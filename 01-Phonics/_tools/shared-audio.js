/* Shared Web Speech API audio module for 01-Phonics.
   Loaded via <script src="../_tools/shared-audio.js"> — a single real file,
   not copy-pasted per page. Wires up [data-audio] buttons and a floating
   speed-toggle bar. See MASTER_TEMPLATE.md for the data-attribute contract. */
(function () {
  'use strict';

  var SOUND_MAP = {
    'b': 'buh', 'c': 'kuh', 'd': 'duh', 'f': 'fee', 'g': 'gah',
    'h': 'hah', 'j': 'juh', 'k': 'kuh', 'l': 'luh', 'm': 'mmm',
    'n': 'nnn', 'p': 'puh', 'q': 'kwuh', 'qu': 'kwuh', 'r': 'ruh', 's': 'sss',
    't': 'tuh', 'v': 'vuh', 'w': 'wuh', 'x': 'ksee', 'y': 'yuh', 'z': 'zzz',
    'sh': 'shh', 'ch': 'chuh', 'th': 'th', 'wh': 'wuh', 'ph': 'ffff',
    'ng': 'ng', 'ck': 'kuh',
    'a': 'ah', 'e': 'eh', 'i': 'ih', 'o': 'aw', 'u': 'uh',
    'ee': 'ee', 'ea': 'ee', 'ai': 'ay', 'ay': 'ay', 'oa': 'oh', 'ow': 'oh',
    'ie': 'eye', 'igh': 'eye', 'oo': 'oo', 'ue': 'oo', 'ui': 'oo',
    'au': 'aw', 'aw': 'aw', 'oi': 'oy', 'oy': 'oy',
    'ar': 'ar', 'er': 'er', 'ir': 'er', 'ur': 'er', 'or': 'or',
    'air': 'air', 'ear': 'ear', 'eer': 'eer'
  };

  var RATE_VALUES = { slow: 0.55, normal: 1.0 };
  var currentRateMode = 'normal';
  try {
    var saved = window.localStorage && localStorage.getItem('phonicsAudioRate');
    if (saved && RATE_VALUES[saved]) currentRateMode = saved;
  } catch (e) { /* localStorage unavailable (privacy mode etc.) */ }

  var cachedVoices = [];
  function loadVoices() {
    if (window.speechSynthesis) cachedVoices = window.speechSynthesis.getVoices();
  }
  if (window.speechSynthesis) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function pickVoice() {
    if (!cachedVoices.length) loadVoices();
    var enVoices = cachedVoices.filter(function (v) { return /^en/i.test(v.lang); });
    var us = enVoices.filter(function (v) { return /^en-US/i.test(v.lang); })[0];
    if (us) return us;
    var gb = enVoices.filter(function (v) { return /^en-GB/i.test(v.lang); })[0];
    if (gb) return gb;
    return enVoices[0] || null;
  }

  function getRateValue() { return RATE_VALUES[currentRateMode] || 1.0; }

  function wait(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }

  function speak(text, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      if (!window.speechSynthesis || !text) { resolve(); return; }
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      var v = pickVoice();
      if (v) u.voice = v;
      u.rate = opts.rate || getRateValue();
      u.pitch = 1;
      u.onend = function () { resolve(); };
      u.onerror = function () { resolve(); };
      window.speechSynthesis.speak(u);
    });
  }

  function playWord(word) {
    if (!window.speechSynthesis || !word) return;
    window.speechSynthesis.cancel();
    speak(word);
  }

  function playSound(letter) {
    if (!window.speechSynthesis || !letter) return;
    window.speechSynthesis.cancel();
    speak(SOUND_MAP[letter.toLowerCase()] || letter);
  }

  function playSentence(sentence) {
    if (!window.speechSynthesis || !sentence) return;
    window.speechSynthesis.cancel();
    speak(sentence);
  }

  function playSplit(word, partsCsv) {
    if (!window.speechSynthesis || !word) return;
    window.speechSynthesis.cancel();
    var parts = (partsCsv || '').split(',').map(function (p) { return p.trim(); }).filter(Boolean);
    var chain = Promise.resolve();
    parts.forEach(function (p) {
      var say = SOUND_MAP[p.toLowerCase()] || p;
      chain = chain.then(function () { return speak(say, { rate: Math.min(getRateValue(), 0.85) }); })
                   .then(function () { return wait(180); });
    });
    chain.then(function () { return wait(150); }).then(function () { return speak(word); });
  }

  function setRate(mode) {
    if (!RATE_VALUES[mode]) return;
    currentRateMode = mode;
    try { window.localStorage && localStorage.setItem('phonicsAudioRate', mode); } catch (e) {}
    updateToggleUI();
  }

  function updateToggleUI() {
    var bar = document.getElementById('phonicsSpeedToggle');
    if (!bar) return;
    var btns = bar.querySelectorAll('.st-btn');
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (b.getAttribute('data-rate') === currentRateMode) b.classList.add('active');
      else b.classList.remove('active');
    }
  }

  function buildToggleUI() {
    if (document.getElementById('phonicsSpeedToggle')) return;
    var bar = document.createElement('div');
    bar.className = 'speed-toggle';
    bar.id = 'phonicsSpeedToggle';
    bar.innerHTML = '<span class="st-label">🔊 ความเร็ว</span>' +
      '<button type="button" class="st-btn" data-rate="slow">🐢 ช้า</button>' +
      '<button type="button" class="st-btn" data-rate="normal">🐇 ปกติ</button>';
    document.body.appendChild(bar);
    updateToggleUI();
  }

  function onClick(e) {
    var audioEl = e.target.closest('[data-audio]');
    if (audioEl) {
      var kind = audioEl.getAttribute('data-audio');
      if (kind === 'word') playWord(audioEl.getAttribute('data-text'));
      else if (kind === 'sound') playSound(audioEl.getAttribute('data-text'));
      else if (kind === 'sentence') playSentence(audioEl.getAttribute('data-text'));
      else if (kind === 'split') playSplit(audioEl.getAttribute('data-word'), audioEl.getAttribute('data-parts'));
      return;
    }
    var rateBtn = e.target.closest('.st-btn');
    if (rateBtn) setRate(rateBtn.getAttribute('data-rate'));
  }

  function init() {
    if (!window.speechSynthesis) {
      document.body.classList.add('no-speech');
      return;
    }
    buildToggleUI();
    document.addEventListener('click', onClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PhonicsAudio = { playWord: playWord, playSound: playSound, playSentence: playSentence, playSplit: playSplit, setRate: setRate };
})();
