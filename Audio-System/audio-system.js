// Global English Audio System (Phase 2) — ONE reusable pronunciation
// module intended to eventually cover the whole English M3 site. This is
// a NEW engine, separate from Pronunciation-System/pronunciation.js (the
// existing site-wide speech engine — see CLAUDE.md §6). It is being
// piloted on three sections only (Articles, Pronouns, Present Simple
// Chapter 1) before any wider rollout, so Pronunciation-System is left
// untouched and keeps running everywhere else exactly as before.
//
// USAGE
// -----
// 1. Include on a page:
//      <link rel="stylesheet" href="path/to/Audio-System/audio-system.css">
//      <script src="path/to/Audio-System/audio-system.js"></script>
//
// 2. Render a compact speaker button next to any English text:
//      GlobalAudio.renderButton('apple')                  // word (default)
//      GlobalAudio.renderButton('She runs fast.', 'sentence')
//    Returns an HTML string — insert via innerHTML/insertAdjacentHTML.
//    Clicks are handled by one delegated document-level listener, so
//    buttons work whether they exist at page load or are added later.
//
// 3. Or call directly:
//      GlobalAudio.speakWord('cat');
//      GlobalAudio.speakSentence('The cat is sleeping.');
//      GlobalAudio.speakSequence('A-B-C-D-E'); // reads letters one at a
//        time with a pause between each (renderSequenceButton() for the
//        matching button) — for alphabet-order content, never for real
//        words. A lone "_" or "..." token is a silent blank (used for
//        ordering-quiz prompts like "A B _ D E" so the button can read
//        what's visible without ever speaking the blanked answer).
//      GlobalAudio.speakSound('b'); // speaks the PHONICS SOUND of a
//        single letter ("buh") instead of its NAME ("bee") — for topics
//        that teach letter sounds rather than letter names. Not exposed
//        via a render*() helper since script.js's applyLessonAudio()
//        decides per-topic (data-gaud-type="sound") whether a bare
//        single letter should use this or the normal speakWord name.
//
// BEHAVIOR
// - English voice only, en-US preferred (falls back to en-GB, then any
//   en-* voice). Text containing Thai script (U+0E00-U+0E7F) is silently
//   refused — this module must never read Thai text with the English voice.
// - Speech rate is a flat 0.85 for both speakWord and speakSentence (no
//   two-pass playback — single utterance).
// - Any in-flight speech (from this module or elsewhere, since all
//   speechSynthesis callers share one browser-wide queue) is cancelled
//   before a new utterance starts, so audio never overlaps.
// - Adds a `gaud-btn-playing` class to the active button for the duration
//   of playback (small pulse animation, see audio-system.css).
(function () {
  'use strict';

  var RATE = 0.85;
  var THAI_RE = /[฀-๿]/;

  // English-approximation spellings so the TTS engine says a letter's
  // PHONICS SOUND (e.g. "buh") instead of its NAME (e.g. "bee"). Same table
  // as 01-Phonics/_tools/shared-audio.js's SOUND_MAP — kept as its own copy
  // here rather than shared, since the two audio engines are intentionally
  // separate (see CLAUDE.md §6).
  var SOUND_MAP = {
    a: 'ah', b: 'buh', c: 'kuh', d: 'duh', e: 'eh', f: 'ffff', g: 'guh',
    h: 'huh', i: 'ih', j: 'juh', k: 'kuh', l: 'luh', m: 'mmm', n: 'nnn',
    o: 'aw', p: 'puh', q: 'kwuh', r: 'ruh', s: 'sss', t: 'tuh', u: 'uh',
    v: 'vuh', w: 'wuh', x: 'ks', y: 'yuh', z: 'zzz'
  };

  var cachedVoices = [];
  var currentBtn = null;
  var playToken = 0; // bumped on every speak() call so a stale onend/onerror
                      // from a cancelled utterance can't clear a newer button's
                      // playing state.

  function loadVoices() {
    cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  if (window.speechSynthesis) {
    loadVoices();
    // addEventListener (not the onvoiceschanged property) so this doesn't
    // get silently clobbered by another script on the same page that also
    // wants to know when voices finish loading (e.g. a game's own
    // game-audio.js sets the onvoiceschanged property too).
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
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
      currentBtn.classList.remove('gaud-btn-playing');
      currentBtn = null;
    }
  }

  function setPlaying(btn) {
    if (btn) { btn.classList.add('gaud-btn-playing'); currentBtn = btn; }
  }

  function endPlaying(btn) {
    if (btn) { btn.classList.remove('gaud-btn-playing'); if (currentBtn === btn) currentBtn = null; }
  }

  function showFallback(btn) {
    if (!btn || !btn.parentElement) return;
    if (btn.parentElement.querySelector('.gaud-fallback-msg')) return;
    var msg = document.createElement('span');
    msg.className = 'gaud-fallback-msg';
    msg.textContent = 'ไม่พบเสียงภาษาอังกฤษในอุปกรณ์นี้';
    btn.insertAdjacentElement('afterend', msg);
    setTimeout(function () { if (msg.parentElement) msg.remove(); }, 3000);
  }

  function speak(text, btn) {
    if (!text) return;
    text = String(text);
    if (THAI_RE.test(text)) return; // never speak Thai with the English voice

    if (!window.speechSynthesis) { showFallback(btn); return; }
    var voice = pickVoice();
    if (!voice) { showFallback(btn); return; }

    // Stop any previous audio before playing a new one — cancel() clears the
    // whole browser speech queue, so this also stops audio started by any
    // other caller sharing the same queue.
    window.speechSynthesis.cancel();
    clearPlayingState();
    var myToken = ++playToken;

    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.voice = voice;
    u.rate = RATE;
    setPlaying(btn);
    u.onend = function () { if (myToken === playToken) endPlaying(btn); };
    u.onerror = u.onend;
    window.speechSynthesis.speak(u);
  }

  function speakWord(text, btn) { speak(text, btn); }
  function speakSentence(text, btn) { speak(text, btn); }
  function speakSound(letter, btn) {
    if (!letter) return;
    speak(SOUND_MAP[String(letter).toLowerCase()] || letter, btn);
  }

  // Speaks a run of individual letters with a short pause between each,
  // e.g. "A-B-C-D-E" -> "A" ...pause... "B" ...pause... "C" ... — for
  // alphabet-sequence content (ordering exercises, ABC Song groupings,
  // chunking drills) where reading the group as one run-together word
  // would be wrong. Tokens are split on whitespace/commas/hyphens; a lone
  // "_" or a run of dots ("...") is treated as a blank and produces a
  // longer silent gap instead of being spoken — used for ordering-quiz
  // prompts like "A B _ D E" so the button can read the visible letters
  // aloud without ever speaking the blanked answer. Same
  // rate/voice/cancel/playing-state guarantees as speak().
  var LETTER_GAP_MS = 350;
  var BLANK_GAP_MS = 650;
  function speakSequence(text, btn) {
    if (!text) return;
    text = String(text);
    if (THAI_RE.test(text)) return;
    var tokens = text.split(/[\s,\-]+/).filter(Boolean);
    if (!tokens.length) return;

    if (!window.speechSynthesis) { showFallback(btn); return; }
    var voice = pickVoice();
    if (!voice) { showFallback(btn); return; }

    window.speechSynthesis.cancel();
    clearPlayingState();
    var myToken = ++playToken;
    setPlaying(btn);

    var i = 0;
    function isBlank(tok) { return tok === '_' || /^\.{2,}$/.test(tok); }
    function step() {
      if (myToken !== playToken) return;
      if (i >= tokens.length) { endPlaying(btn); return; }
      var tok = tokens[i++];
      if (isBlank(tok)) { setTimeout(step, BLANK_GAP_MS); return; }
      var isLast = i >= tokens.length;
      var u = new SpeechSynthesisUtterance(tok);
      u.lang = 'en-US';
      u.voice = voice;
      u.rate = RATE;
      u.onend = function () {
        if (myToken !== playToken) return;
        if (isLast) endPlaying(btn); else setTimeout(step, LETTER_GAP_MS);
      };
      u.onerror = u.onend;
      window.speechSynthesis.speak(u);
    }
    step();
  }

  function escapeAttr(text) { return String(text).replace(/"/g, '&quot;'); }

  // Returns an HTML string for a compact, keyboard-accessible speaker
  // button. A real <button> so Enter/Space work natively and screen
  // readers announce it as a control; large enough tap target for mobile.
  function renderButton(text, type) {
    try {
      var t = type === 'sentence' ? 'sentence' : 'word';
      return '<button type="button" class="gaud-btn" data-gaud-type="' + t +
        '" data-gaud-text="' + escapeAttr(text) +
        '" aria-label="ฟังเสียง (Listen): ' + escapeAttr(text) + '">🔊</button>';
    } catch (e) {
      return '';
    }
  }

  // Compact "play sequence" button for a run of letters — visually
  // identical to renderButton() (same size/icon) so it stays compact, but
  // wired to speakSequence() via data-gaud-type="sequence" and labeled so
  // screen readers announce it as a sequence, not a single word.
  function renderSequenceButton(text) {
    try {
      return '<button type="button" class="gaud-btn" data-gaud-type="sequence" data-gaud-text="' +
        escapeAttr(text) +
        '" aria-label="ฟังทีละตัวอักษร (Play sequence): ' + escapeAttr(text) + '">🔊</button>';
    } catch (e) {
      return '';
    }
  }

  // "Repeat after me" practice button — same underlying playback as the
  // regular speaker button (reuses the exact same speak() path via the
  // shared .gaud-btn click listener below), styled/labeled differently to
  // invite the student to say the word back out loud after listening.
  function renderPracticeButton(text, type) {
    try {
      var t = type === 'sentence' ? 'sentence' : 'word';
      return '<button type="button" class="gaud-btn gaud-practice-btn" data-gaud-type="' + t +
        '" data-gaud-text="' + escapeAttr(text) +
        '" aria-label="พูดตาม (Repeat after me): ' + escapeAttr(text) + '">🗣️ พูดตาม</button>';
    } catch (e) {
      return '';
    }
  }

  // One delegated listener handles every button on the page, including
  // ones added after page load.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.gaud-btn') : null;
    if (!btn) return;
    var text = btn.getAttribute('data-gaud-text');
    if (!text) return;
    var type = btn.getAttribute('data-gaud-type');
    if (type === 'sentence') speakSentence(text, btn);
    else if (type === 'sequence') speakSequence(text, btn);
    else if (type === 'sound') speakSound(text, btn);
    else speakWord(text, btn);
  });

  window.GlobalAudio = {
    speakWord: speakWord,
    speakSentence: speakSentence,
    speakSequence: speakSequence,
    speakSound: speakSound,
    renderButton: renderButton,
    renderSequenceButton: renderSequenceButton,
    renderPracticeButton: renderPracticeButton
  };
})();
