// Daily Conversation Adventure's own Web Speech API wrapper — kept as its
// own file per this project's one-audio-file-per-game convention, but the
// actual speech synthesis delegates entirely to the shared
// Pronunciation-System engine (slower rate, two-pass sentences, Thai
// guard) so there's one real implementation of "how English is spoken"
// site-wide — this module does NOT create another audio engine. Falls
// back to a minimal inline implementation only if a page is missing the
// Pronunciation-System <script> include.
(function () {
  var cachedVoices = [];

  function loadVoices() {
    cachedVoices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  }
  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
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
