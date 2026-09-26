// Pronoun Adventure's own Web Speech API wrapper — kept as its own file
// per this project's one-audio-file-per-game convention, but the actual
// speech synthesis delegates to a shared engine so there's one real
// implementation of "how English is spoken" per page. Prefers the new
// Global Audio System (Phase 2 pilot — window.GlobalAudio, rate 0.85) if
// the page has loaded it; otherwise falls back to the existing
// Pronunciation-System engine (window.Pronunciation) if that's loaded
// instead; otherwise a minimal inline implementation. Chapter 1 (basic
// pronouns) loads GlobalAudio as part of the Phase 2 pilot — chapters 2
// and 3 don't, so they keep using Pronunciation-System exactly as before.
(function () {
  var cachedVoices = [];

  function loadVoices() {
    cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function pickVoice() {
    var enVoices = cachedVoices.filter(function (v) { return /^en/i.test(v.lang); });
    var us = enVoices.filter(function (v) { return /^en-US/i.test(v.lang); })[0];
    if (us) return us;
    var gb = enVoices.filter(function (v) { return /^en-GB/i.test(v.lang); })[0];
    if (gb) return gb;
    return enVoices[0] || null;
  }

  // Minimal fallback, only used if Pronunciation-System's script isn't
  // present on the page for some reason.
  function fallbackSpeak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    var v = pickVoice();
    if (v) u.voice = v;
    u.rate = 0.70;
    window.speechSynthesis.speak(u);
  }

  function playWord(text, btn) {
    if (window.GlobalAudio) { window.GlobalAudio.speakWord(text, btn); return; }
    if (window.Pronunciation) { window.Pronunciation.speak(text, btn); return; }
    fallbackSpeak(text);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-audio="word"]') : null;
    if (!btn) return;
    var text = btn.getAttribute('data-text');
    if (text) playWord(text, btn);
  });

  window.GameAudio = { playWord: playWord };
})();
