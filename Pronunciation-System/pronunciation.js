// Global English Pronunciation System — ONE reusable component for the
// whole English M3 site (main course pages, printable System-B lesson
// pages, and any future page). NOT the same thing as each Adventure
// game's own standalone game-audio.js (those stay as separate files per
// this project's established one-audio-file-per-game convention) — but
// as of this revision, every game's game-audio.js is a thin wrapper that
// delegates the actual speech synthesis to THIS file, so there is one
// real implementation of "how English is spoken" site-wide.
//
// USAGE
// -----
// 1. Include on any page:
//      <link rel="stylesheet" href="path/to/Pronunciation-System/pronunciation.css">
//      <script src="path/to/Pronunciation-System/pronunciation.js"></script>
//
// 2. Render a button next to any English text (word or sentence):
//      Pronunciation.renderButton('apple')                 // word (default)
//      Pronunciation.renderButton('The cat is sleeping.', 'sentence')
//      Pronunciation.renderPracticeButton('apple')          // "🗣️ พูดตาม" repeat-after-me button
//    All return an HTML string — insert it via innerHTML/insertAdjacentHTML
//    right next to the text it belongs to. Clicks are handled automatically
//    via one document-level listener; no extra wiring needed per button.
//
// 3. Or call the speak functions directly from your own code:
//      Pronunciation.speakWord('cat');            // forces single-word slow playback
//      Pronunciation.speakSentence('The cat is sleeping.'); // forces two-pass sentence playback
//      Pronunciation.speak(someText, btn);         // auto-detects word vs sentence — used by
//                                                   // legacy/generic call sites (e.g. each game's
//                                                   // game-audio.js) that don't know in advance
//                                                   // which kind of text they were given.
//
// SPEECH RATE / PACING (Gen Alpha / weak-foundation readability standard)
// - Single words & short phrases: rate 0.70 (within the requested 0.65-0.75 slow band).
// - Example sentences: TWO PASSES —
//     pass 1: every word spoken individually at rate 0.60, with a short
//             pause between words (300ms) so beginners can follow along
//             word-by-word.
//     pass 2 (after a longer 550ms pause): the whole sentence spoken
//             naturally at rate 0.75 (top of the slow band).
// - English only: any text containing Thai script (U+0E00-U+0E7F) is
//   silently refused — this component must never read Thai text aloud
//   with the English voice. No caller in this codebase should ever pass
//   Thai text in, but this is a defensive guard against future mistakes.
//
// WHERE TO USE IT (per the site-wide pronunciation requirement)
// - DO add buttons beside: vocabulary words, grammar keywords, example
//   sentences, quiz questions, answer choices, game prompts, English
//   instructions students must read aloud.
// - do NOT add buttons to: navigation labels, file names, hidden/
//   technical text, decorative English text, or any Thai text.
//
// OUT OF SCOPE (deliberately not touched/absorbed by this engine)
// - 01-Phonics/_tools/shared-audio.js (and its duplicate inlined into
//   02-Spelling's build output) has its own working slow/normal speed
//   toggle (🐢/🐇) and a `playSplit` phoneme-blending function for
//   teaching individual letter sounds — both are untouched by this file.
(function () {
  'use strict';

  var WORD_RATE = 0.70;           // single words / short phrases
  var SENTENCE_PASS1_RATE = 0.60; // word-by-word first pass
  var SENTENCE_PASS2_RATE = 0.75; // whole-sentence second pass
  var WORD_GAP_MS = 300;          // pause between words within pass 1
  var PASS_GAP_MS = 550;          // pause between pass 1 and pass 2
  var THAI_RE = /[฀-๿]/;

  var cachedVoices = [];
  var currentBtn = null;
  var playToken = 0; // bumped on every speak() call; in-flight chains check this
                      // before continuing so a new click cleanly cuts off any
                      // still-pending word-by-word/two-pass sequence instead of
                      // letting stale timers keep talking over the new audio.

  function loadVoices() {
    cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  // English voice only, prefer en-US, fall back to en-GB, then any en-*.
  function pickVoice() {
    var enVoices = cachedVoices.filter(function (v) { return /^en/i.test(v.lang); });
    var us = enVoices.filter(function (v) { return /^en-US/i.test(v.lang); })[0];
    if (us) return us;
    var gb = enVoices.filter(function (v) { return /^en-GB/i.test(v.lang); })[0];
    if (gb) return gb;
    return enVoices[0] || null;
  }

  function clearPlayingState() {
    if (currentBtn) {
      currentBtn.classList.remove('pron-btn-playing');
      currentBtn = null;
    }
  }

  function setPlaying(btn) {
    if (btn) { btn.classList.add('pron-btn-playing'); currentBtn = btn; }
  }

  function endPlaying(btn) {
    if (btn) { btn.classList.remove('pron-btn-playing'); if (currentBtn === btn) currentBtn = null; }
  }

  function showFallback(btn) {
    if (!btn || !btn.parentElement) return;
    if (btn.parentElement.querySelector('.pron-fallback-msg')) return; // already showing
    var msg = document.createElement('span');
    msg.className = 'pron-fallback-msg';
    msg.textContent = 'ไม่พบเสียงภาษาอังกฤษในอุปกรณ์นี้';
    btn.insertAdjacentElement('afterend', msg);
    setTimeout(function () { if (msg.parentElement) msg.remove(); }, 3000);
  }

  // Auto-detect word vs sentence for callers that don't specify — used by
  // legacy/generic delegation (each game's game-audio.js, feedback-standard.js).
  // Gate the trailing-punctuation check behind >=2 words so single-word
  // interjections with punctuation (e.g. "Look!", "Listen!") stay classified
  // as 'word', not misdetected as a sentence.
  function detectType(text) {
    var trimmed = String(text).trim();
    var words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length >= 4) return 'sentence';
    if (words.length >= 2 && /[.?]$/.test(trimmed)) return 'sentence';
    return 'word';
  }

  function makeUtterance(text, rate, voice) {
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.voice = voice;
    u.rate = rate;
    return u;
  }

  // Core entry point. opts: { type: 'word'|'sentence' (optional — auto-detected
  // via detectType when omitted), btn: element (optional, for the pulse state) }
  function speak(text, opts) {
    opts = opts || {};
    if (!text) return;
    text = String(text);
    if (THAI_RE.test(text)) return; // never speak Thai with the English voice

    if (!window.speechSynthesis) { showFallback(opts.btn); return; }
    var voice = pickVoice();
    if (!voice) { showFallback(opts.btn); return; }

    // Stop any previous audio (this component's own, another pron-btn's, or
    // a game's own game-audio.js — all share one browser-wide speech queue)
    // and invalidate any in-flight word-by-word/two-pass chain so it can't
    // keep talking after this new click.
    window.speechSynthesis.cancel();
    clearPlayingState();
    var myToken = ++playToken;
    function stillCurrent() { return myToken === playToken; }

    var type = (opts.type === 'word' || opts.type === 'sentence') ? opts.type : detectType(text);
    var btn = opts.btn || null;
    setPlaying(btn);

    if (type === 'word') {
      var u = makeUtterance(text, WORD_RATE, voice);
      u.onend = function () { if (stillCurrent()) endPlaying(btn); };
      u.onerror = u.onend;
      window.speechSynthesis.speak(u);
      return;
    }

    // Sentence: pass 1 speaks each word individually (slow, with a pause
    // between words), pass 2 speaks the whole sentence naturally.
    var words = text.trim().split(/\s+/).filter(Boolean);
    var i = 0;

    function nextWord() {
      if (!stillCurrent() || i >= words.length) return;
      var w = words[i++];
      var isLast = i >= words.length;
      var uw = makeUtterance(w, SENTENCE_PASS1_RATE, voice);
      uw.onend = function () {
        if (!stillCurrent()) return;
        setTimeout(isLast ? startPass2 : nextWord, isLast ? PASS_GAP_MS : WORD_GAP_MS);
      };
      uw.onerror = uw.onend;
      window.speechSynthesis.speak(uw);
    }

    function startPass2() {
      if (!stillCurrent()) return;
      var us = makeUtterance(text, SENTENCE_PASS2_RATE, voice);
      us.onend = function () { if (stillCurrent()) endPlaying(btn); };
      us.onerror = us.onend;
      window.speechSynthesis.speak(us);
    }

    nextWord();
  }

  function speakWord(text, btn) { speak(text, { type: 'word', btn: btn || null }); }
  function speakSentence(text, btn) { speak(text, { type: 'sentence', btn: btn || null }); }
  // Generic auto-detecting entry point for legacy/thin-wrapper delegation
  // (each game's GameAudio.playWord, feedback-standard.js's fallback) —
  // these callers don't know in advance whether their text is a single
  // word or a full example sentence, so let detectType() decide.
  function speakAuto(text, btn) { speak(text, { btn: btn || null }); }

  function escapeAttr(text) { return String(text).replace(/"/g, '&quot;'); }

  // Returns an HTML string for a compact, keyboard-accessible, mobile-
  // friendly speaker button. A real <button> so Enter/Space work natively
  // with no extra JS, and so screen readers announce it as a control.
  //
  // Wrapped in try/catch and guaranteed to return a string, never throw:
  // callers across the site build this into the MIDDLE of a larger
  // innerHTML/choice-rendering loop (e.g. each Adventure game's
  // renderStage1()), so a failure here must never abort that caller's
  // loop and leave its own, unrelated answer/choice buttons unrendered.
  function renderButton(text, type) {
    try {
      var t = type === 'sentence' ? 'sentence' : 'word';
      return '<button type="button" class="pron-btn" data-pron-type="' + t +
        '" data-pron-text="' + escapeAttr(text) +
        '" aria-label="ฟังการออกเสียง (Listen)">🔊</button>';
    } catch (e) {
      return '';
    }
  }

  // "Repeat after me" practice button — same underlying playback as the
  // regular speaker button (reuses the exact same speak() path via the
  // shared .pron-btn click listener below), styled/labeled differently to
  // invite the student to say the word back out loud after listening.
  // Same try/catch guarantee as renderButton() above, for the same reason.
  function renderPracticeButton(text, type) {
    try {
      var t = type === 'sentence' ? 'sentence' : 'word';
      return '<button type="button" class="pron-btn pron-practice-btn" data-pron-type="' + t +
        '" data-pron-text="' + escapeAttr(text) +
        '" aria-label="พูดตาม (Repeat after me)">🗣️ พูดตาม</button>';
    } catch (e) {
      return '';
    }
  }

  // One delegated listener handles every button on the page, including
  // ones added after page load (dynamically rendered quiz/game content) —
  // no per-button wiring required. Matches both .pron-btn (speaker) and
  // .pron-practice-btn (practice — also carries .pron-btn so it's caught
  // here too).
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.pron-btn') : null;
    if (!btn) return;
    var text = btn.getAttribute('data-pron-text');
    if (!text) return;
    var type = btn.getAttribute('data-pron-type');
    if (type === 'sentence') speakSentence(text, btn);
    else speakWord(text, btn);
  });

  window.Pronunciation = {
    speak: speakAuto,
    speakWord: speakWord,
    speakSentence: speakSentence,
    renderButton: renderButton,
    renderPracticeButton: renderPracticeButton
  };
})();
