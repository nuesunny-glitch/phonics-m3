// Story Adventure — Episode 1: First Day at School — FRAMEWORK ONLY.
// Per the module spec ("Create only the framework. Do not build all
// lesson content yet."), this drives 9 placeholder screens (Scene 1-3,
// Vocabulary, Listening, Speaking, Mini Game, Boss Quiz all share the
// same generic placeholder screen with different icon/label; Mission
// Complete is its own screen) with simple Prev/Next navigation — no
// graded logic, no real dialogue/vocabulary/quiz content, no XP awarded.
// When real content is built for this episode, each placeholder step
// below should be replaced with real screens following the same pattern
// as 23-Daily-Conversation-Adventure/_tools/game-engine.js.
(function () {
  'use strict';

  var PLACEHOLDERS = [
    { icon: '🎬', label: 'Scene 1' },
    { icon: '🎬', label: 'Scene 2' },
    { icon: '🎬', label: 'Scene 3' },
    { icon: '🧩', label: 'Vocabulary' },
    { icon: '🔊', label: 'Listening' },
    { icon: '🎤', label: 'Speaking' },
    { icon: '🎮', label: 'Mini Game' },
    { icon: '🏆', label: 'Boss Quiz' }
  ];

  var state = { index: 0 };

  function $(id) { return document.getElementById(id); }

  function showScreen(name) {
    ['intro', 'placeholder', 'complete'].forEach(function (n) {
      $('screen-' + n).classList.toggle('hidden', n !== name);
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function renderPlaceholder() {
    var step = PLACEHOLDERS[state.index];
    $('ph-name').textContent = step.label;
    $('ph-progress-label').textContent = (state.index + 1) + ' / ' + PLACEHOLDERS.length;
    $('ph-bar-fill').style.width = Math.round((state.index / (PLACEHOLDERS.length - 1)) * 100) + '%';
    $('ph-icon').textContent = step.icon;
    $('ph-label').textContent = step.label;
    $('phPrevBtn').disabled = state.index === 0;
    $('phNextBtn').textContent = state.index === PLACEHOLDERS.length - 1 ? 'ไปหน้า Mission Complete ➡️' : 'ถัดไป ▶';
  }

  document.addEventListener('DOMContentLoaded', function () {
    Mascot.renderBubble('intro-mascot', 'ยินดีต้อนรับสู่ Episode 1! ตอนนี้ยังเป็นแค่โครงร่างอยู่นะ เดี๋ยวเนื้อหาจะมาเร็ว ๆ นี้ 🦊');
    Mascot.renderBubble('complete-mascot', 'เยี่ยม! นี่คือโครงร่างทั้งหมดของภารกิจนี้ 🎉');

    $('startBtn').addEventListener('click', function () {
      state.index = 0;
      showScreen('placeholder');
      renderPlaceholder();
    });
    $('phPrevBtn').addEventListener('click', function () {
      if (state.index > 0) { state.index--; renderPlaceholder(); }
    });
    $('phNextBtn').addEventListener('click', function () {
      if (state.index < PLACEHOLDERS.length - 1) { state.index++; renderPlaceholder(); }
      else showScreen('complete');
    });

    showScreen('intro');
  });
})();
