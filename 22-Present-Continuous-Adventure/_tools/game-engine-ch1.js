// Present Continuous Adventure — Chapter 1: What is Present Continuous?,
// am/is/are, verb+ing, Affirmative sentences, Actions happening now.
// Full engine driving all 10 screens: intro -> learn (5 grammar cards,
// Learning Objectives) -> memoryTrick -> pictureExamples (20 cards) ->
// mini (ungraded, 4 rotating formats) -> game1 (choose sentence) -> game2
// (choose picture) -> game3 (drag the words) -> boss (10 random Q +
// instant explanation) -> result. Only the Boss Quiz is scored (10 pts
// max) — everything before it is learning/practice, matching this
// project's established convention.
//
// Reused (same logic, structure and helper functions) from Present Simple
// Adventure's game-engine-chN.js files — this chapter's spec asked for
// only 3 interactive games, so Game 4 (Speed Challenge) and Game 5
// (Connie's Daily Routine) are intentionally omitted; everything else is
// the same reusable pattern.
(function () {
  'use strict';
  var STORAGE_KEY = 'presentContinuousAdventureCh1Progress';
  var BOSS_TOTAL = 10;
  var MINI_TOTAL = 8;

  // Sentences short enough to drag word-by-word on a small screen.
  var SHORT_EXAMPLES = EXAMPLES.filter(function (ex) {
    return ex.en.replace(/[?.!]+$/, '').split(' ').length <= 5;
  });
  var G3_TOTAL = Math.min(6, SHORT_EXAMPLES.length);

  var state = {
    learnIndex: 0, peIndex: 0,
    miniIndex: 0, miniFormats: [],
    g1Order: [], g1Index: 0,
    g2Order: [], g2Index: 0,
    g3Order: [], g3Index: 0,
    bossIndex: 0, bossCorrect: 0, bossQueue: []
  };

  function $(id) { return document.getElementById(id); }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function starsHtml(count, total) {
    var html = '';
    for (var i = 0; i < total; i++) {
      html += '<span style="color:' + (i < count ? 'var(--c2)' : '#ddd') + '">★</span>';
    }
    return html;
  }

  var SCREENS = ['intro', 'learn', 'memoryTrick', 'pictureExamples', 'mini', 'game1', 'game2', 'game3', 'boss', 'result'];
  function showScreen(name) {
    SCREENS.forEach(function (n) { $('screen-' + n).classList.toggle('hidden', n !== name); });
  }

  // ---------- Shared choice-rendering helper ----------
  function renderChoices(box, choices, onAnswer, opts) {
    opts = opts || {};
    box.innerHTML = '';
    choices.forEach(function (c) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      if (opts.big) btn.style.fontSize = '2.2rem';
      btn.textContent = c.label;
      btn.addEventListener('click', function () {
        if (c.ok) {
          Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
          btn.classList.add('correct');
          onAnswer(true);
        } else {
          Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
          btn.classList.add('wrong');
          onAnswer(false);
        }
      });
      box.appendChild(btn);
    });
  }

  function pickOthers(pool, excludeId, count, keyFn) {
    var seen = {};
    var out = [];
    shuffle(pool).forEach(function (item) {
      if (item.id === excludeId) return;
      var k = keyFn(item);
      if (seen[k]) return;
      seen[k] = true;
      out.push(item);
    });
    return out.slice(0, count);
  }

  function buildSentenceChoices(ex) {
    var wrongs = ex.distractors.map(function (d) { return ex.en.replace(ex.blank, d); });
    return shuffle([{ label: ex.en, ok: true }].concat(wrongs.map(function (w) { return { label: w, ok: false }; })));
  }

  // ================= Reusable question renderers =================
  function renderSentenceQuestion(container, ex, onAnswer) {
    container.innerHTML =
      '<div class="word-illustration" style="font-size:3.5rem;">' + ex.emoji + '</div>' +
      '<p class="s1-sentence">' + ex.th + '</p>' +
      '<div class="choice-grid" data-role="choices"></div>';
    renderChoices(container.querySelector('[data-role="choices"]'), buildSentenceChoices(ex), onAnswer);
  }

  function renderMeaningQuestion(container, ex, onAnswer) {
    container.innerHTML =
      '<p class="s1-sentence">' + ex.en + '</p>' +
      '<p class="muted" style="margin-top:-8px;">ประโยคนี้แปลว่าอะไร?</p>' +
      '<div class="choice-grid" data-role="choices"></div>';
    var distractors = pickOthers(EXAMPLES, ex.id, 3, function (e) { return e.th; });
    var choices = shuffle([{ label: ex.th, ok: true }].concat(distractors.map(function (e) { return { label: e.th, ok: false }; })));
    renderChoices(container.querySelector('[data-role="choices"]'), choices, onAnswer);
  }

  function renderPictureQuestion(container, ex, onAnswer) {
    container.innerHTML =
      '<h2 style="margin:0 0 10px;">' + ex.en + '</h2>' +
      '<p class="muted">เลือกภาพที่ตรงกับประโยคนี้</p>' +
      '<div class="choice-grid" data-role="choices"></div>';
    var distractors = pickOthers(EXAMPLES, ex.id, 3, function (e) { return e.emoji; });
    var choices = shuffle([{ label: ex.emoji, ok: true }].concat(distractors.map(function (e) { return { label: e.emoji, ok: false }; })));
    renderChoices(container.querySelector('[data-role="choices"]'), choices, onAnswer, { big: true });
  }

  function renderDragQuestion(container, ex, onAnswer) {
    var order = ex.en.replace(/[?.!]+$/, '').split(' ');
    var shuffled = shuffle(order.slice());
    container.innerHTML =
      '<div class="word-illustration" style="font-size:3rem;">' + ex.emoji + '</div>' +
      '<p class="s1-sentence" data-role="zones"></p>' +
      '<div class="drag-row" data-role="dragRow"></div>';
    container.querySelector('[data-role="zones"]').innerHTML =
      order.map(function (_, i) { return '<span class="drop-zone" data-slot="' + i + '">?</span>'; }).join(' ');
    var dragRow = container.querySelector('[data-role="dragRow"]');
    shuffled.forEach(function (w) {
      var chip = document.createElement('button');
      chip.className = 'drag-chip';
      chip.textContent = w;
      dragRow.appendChild(chip);
    });
    var filledCount = 0;
    DragDrop.enable(dragRow, function (chip, zone) {
      var slot = parseInt(zone.getAttribute('data-slot'), 10);
      if (chip.textContent === order[slot]) {
        zone.textContent = chip.textContent;
        zone.classList.add('filled');
        filledCount++;
        if (filledCount >= order.length) onAnswer(true);
      } else {
        chip.classList.remove('placed');
      }
    });
  }

  // ================= 1. Intro =================
  document.addEventListener('DOMContentLoaded', function () {
    Mascot.renderBubble('intro-mascot', 'สวัสดี! ฉันชื่อคอนนี่ 🦊 มาเรียน Present Continuous ด้วยกันนะ');
    $('startBtn').addEventListener('click', startLearn);
    $('learnPrevBtn').addEventListener('click', function () { if (state.learnIndex > 0) { state.learnIndex--; renderLearn(); } });
    $('learnNextBtn').addEventListener('click', function () {
      if (state.learnIndex < GRAMMAR_POINTS.length - 1) { state.learnIndex++; renderLearn(); }
      else startMemoryTrick();
    });
    $('toPEBtn').addEventListener('click', startPictureExamples);
    $('pePrevBtn').addEventListener('click', function () { if (state.peIndex > 0) { state.peIndex--; renderPE(); } });
    $('peNextBtn').addEventListener('click', function () {
      if (state.peIndex < EXAMPLES.length - 1) { state.peIndex++; renderPE(); }
      else startMini();
    });
    $('toBossBtn').addEventListener('click', startBoss);
    $('replayBtn').addEventListener('click', resetAndReplay);
    showScreen('intro');
  });

  // ================= 2. Learn / Learning Objectives (5 cards) =================
  function startLearn() { state.learnIndex = 0; showScreen('learn'); renderLearn(); }
  function renderLearn() {
    var g = GRAMMAR_POINTS[state.learnIndex];
    $('learn-emoji').textContent = g.emoji;
    $('learn-title').textContent = g.title;
    $('learn-en').textContent = g.en;
    $('learn-th').textContent = g.th;
    $('learn-example').innerHTML = '<div class="example-card"><div class="en">' + g.example.emoji + ' ' + g.example.en + '</div><div class="th">' + g.example.th + '</div></div>';
    $('learn-audio-btn').setAttribute('data-text', g.example.en);
    $('learn-dots').textContent = (state.learnIndex + 1) + ' / ' + GRAMMAR_POINTS.length;
    $('learnPrevBtn').disabled = state.learnIndex === 0;
    $('learnNextBtn').textContent = state.learnIndex === GRAMMAR_POINTS.length - 1 ? 'ไปเทคนิคจำ ➡️' : 'ถัดไป ▶';
  }

  // ================= 3. Memory Trick =================
  function startMemoryTrick() {
    showScreen('memoryTrick');
    Mascot.renderBubble('mt-mascot', 'Present Continuous = กำลังเกิดขึ้น "ตอนนี้" เลย! จำสัญญาณเวลาพวกนี้ไว้');
    $('mt-grid').innerHTML = TIME_SIGNALS.map(function (w) {
      var wordAudioBtn = window.Pronunciation ? Pronunciation.renderButton(w.en, 'word') : '';
      var practiceBtn = window.Pronunciation ? Pronunciation.renderPracticeButton(w.en, 'word') : '';
      var sentenceAudioBtn = window.Pronunciation ? Pronunciation.renderButton(w.example, 'sentence') : '';
      return '<div class="tip-card">' + w.emoji + ' <b>' + w.en + '</b>' + wordAudioBtn + practiceBtn +
        ' — ' + w.example + sentenceAudioBtn + '</div>';
    }).join('');
  }

  // ================= 4. Picture Examples =================
  function startPictureExamples() { state.peIndex = 0; showScreen('pictureExamples'); renderPE(); }
  function renderPE() {
    var ex = EXAMPLES[state.peIndex];
    $('pe-emoji').textContent = ex.emoji;
    $('pe-audio-btn').setAttribute('data-text', ex.en);
    $('pe-en').textContent = ex.en;
    $('pe-pron').textContent = ex.pron;
    $('pe-th').textContent = ex.th;
    $('pe-dots').textContent = (state.peIndex + 1) + ' / ' + EXAMPLES.length;
    $('pePrevBtn').disabled = state.peIndex === 0;
    $('peNextBtn').textContent = state.peIndex === EXAMPLES.length - 1 ? 'ไปฝึกซ้อม ➡️' : 'ถัดไป ▶';
  }

  // ================= 5. Mini Practice (ungraded, 4 rotating formats) =================
  var MINI_FORMATS = ['sentence', 'mc', 'match', 'drag'];
  function startMini() {
    state.miniIndex = 0;
    state.miniFormats = [];
    for (var i = 0; i < MINI_TOTAL; i++) state.miniFormats.push(MINI_FORMATS[i % MINI_FORMATS.length]);
    showScreen('mini');
    renderMini();
  }
  function renderMini() {
    var format = state.miniFormats[state.miniIndex];
    var ex = format === 'drag' ? randChoice(SHORT_EXAMPLES) : randChoice(EXAMPLES);
    $('mini-progress-label').textContent = (state.miniIndex + 1) + ' / ' + MINI_TOTAL;
    $('mini-bar-fill').style.width = Math.round((state.miniIndex / MINI_TOTAL) * 100) + '%';
    $('mini-feedback').innerHTML = '';
    var container = $('mini-content');
    var onAnswer = function (isCorrect) {
      FeedbackStandard.renderFeedback($('mini-feedback'), isCorrect);
      setTimeout(function () {
        state.miniIndex++;
        if (state.miniIndex >= MINI_TOTAL) { $('mini-bar-fill').style.width = '100%'; startGame1(); }
        else renderMini();
      }, 1000);
    };
    if (format === 'sentence') renderSentenceQuestion(container, ex, onAnswer);
    else if (format === 'mc') renderMeaningQuestion(container, ex, onAnswer);
    else if (format === 'match') renderPictureQuestion(container, ex, onAnswer);
    else renderDragQuestion(container, ex, onAnswer);
  }

  // ================= 6. Game 1 — Choose the correct sentence =================
  function startGame1() {
    state.g1Order = shuffle(EXAMPLES.slice());
    state.g1Index = 0;
    showScreen('game1');
    renderGame1();
  }
  function renderGame1() {
    var ex = state.g1Order[state.g1Index];
    $('g1-progress-label').textContent = (state.g1Index + 1) + ' / ' + state.g1Order.length;
    $('g1-bar-fill').style.width = Math.round((state.g1Index / state.g1Order.length) * 100) + '%';
    $('g1-feedback').innerHTML = '';
    renderSentenceQuestion($('g1-content'), ex, function (isOk) {
      FeedbackStandard.renderFeedback($('g1-feedback'), isOk);
      setTimeout(function () {
        state.g1Index++;
        if (state.g1Index >= state.g1Order.length) { $('g1-bar-fill').style.width = '100%'; startGame2(); }
        else renderGame1();
      }, 1000);
    });
  }

  // ================= 7. Game 2 — Choose the correct picture =================
  function startGame2() {
    state.g2Order = shuffle(EXAMPLES.slice());
    state.g2Index = 0;
    showScreen('game2');
    renderGame2();
  }
  function renderGame2() {
    var ex = state.g2Order[state.g2Index];
    $('g2-progress-label').textContent = (state.g2Index + 1) + ' / ' + state.g2Order.length;
    $('g2-bar-fill').style.width = Math.round((state.g2Index / state.g2Order.length) * 100) + '%';
    $('g2-feedback').innerHTML = '';
    renderPictureQuestion($('g2-content'), ex, function (isOk) {
      FeedbackStandard.renderFeedback($('g2-feedback'), isOk);
      setTimeout(function () {
        state.g2Index++;
        if (state.g2Index >= state.g2Order.length) { $('g2-bar-fill').style.width = '100%'; startGame3(); }
        else renderGame2();
      }, 1000);
    });
  }

  // ================= 8. Game 3 — Drag the words =================
  function startGame3() {
    state.g3Order = shuffle(SHORT_EXAMPLES.slice()).slice(0, G3_TOTAL);
    state.g3Index = 0;
    showScreen('game3');
    renderGame3();
  }
  function renderGame3() {
    var ex = state.g3Order[state.g3Index];
    $('g3-progress-label').textContent = (state.g3Index + 1) + ' / ' + state.g3Order.length;
    $('g3-bar-fill').style.width = Math.round((state.g3Index / state.g3Order.length) * 100) + '%';
    $('g3-feedback').innerHTML = '';
    renderDragQuestion($('g3-content'), ex, function (isOk) {
      FeedbackStandard.renderFeedback($('g3-feedback'), isOk);
      setTimeout(function () {
        state.g3Index++;
        if (state.g3Index >= state.g3Order.length) { $('g3-bar-fill').style.width = '100%'; startBoss(); }
        else renderGame3();
      }, 1200);
    });
  }

  // ================= 9. Boss Quiz (10 questions, scored + explanation) =================
  function startBoss() {
    state.bossIndex = 0; state.bossCorrect = 0;
    state.bossQueue = [];
    for (var i = 0; i < BOSS_TOTAL; i++) state.bossQueue.push(randChoice(EXAMPLES));
    showScreen('boss');
    renderBoss();
  }
  function renderBoss() {
    var ex = state.bossQueue[state.bossIndex];
    $('boss-progress-label').textContent = 'ข้อ ' + (state.bossIndex + 1) + ' / ' + BOSS_TOTAL;
    $('boss-bar-fill').style.width = Math.round((state.bossIndex / BOSS_TOTAL) * 100) + '%';
    $('boss-feedback').innerHTML = '';
    $('boss-explain').classList.add('hidden');
    renderSentenceQuestion($('boss-content'), ex, function (isOk) {
      if (isOk) state.bossCorrect++;
      FeedbackStandard.renderFeedback($('boss-feedback'), isOk);
      var explainEl = $('boss-explain');
      explainEl.textContent = '💡 ' + ex.explain;
      explainEl.classList.remove('hidden');
      setTimeout(function () {
        state.bossIndex++;
        if (state.bossIndex >= BOSS_TOTAL) { $('boss-bar-fill').style.width = '100%'; finishGame(); }
        else renderBoss();
      }, 1600);
    });
  }

  // ================= 10. Result =================
  function readProgress() {
    var prev = { bestScore: 0, bestStars: 0, playCount: 0, xp: 0, unlocked: false };
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        prev.bestScore = d.bestScore || 0;
        prev.bestStars = d.bestStars || 0;
        prev.playCount = d.playCount || 0;
        prev.xp = d.xp || 0;
        prev.unlocked = !!d.unlocked;
      }
    } catch (e) { /* ignore corrupt storage */ }
    return prev;
  }
  function saveProgress(score, stars) {
    var prev = readProgress();
    prev.playCount = prev.playCount + 1;
    if (score > prev.bestScore) prev.bestScore = score;
    if (stars > prev.bestStars) prev.bestStars = stars;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
  }
  // "Reuse XP and feedback standards": awards XP into this chapter's own
  // progress record via the Game-Standards onWin hook (no cross-game XP
  // ledger exists yet in this project).
  function addXpAndUnlock() {
    var prev = readProgress();
    prev.xp = prev.xp + 20;
    prev.unlocked = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
  }

  function finishGame() {
    var pct = state.bossCorrect / BOSS_TOTAL;
    var stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
    saveProgress(state.bossCorrect, stars);

    Mascot.renderBubble('result-mascot', stars >= 2 ? 'เก่งมากเลย! ภูมิใจในตัวเธอนะ 🎉' : 'ฝึกอีกนิดนะ เดี๋ยวก็เก่งขึ้น!');
    $('result-score').textContent = state.bossCorrect + ' / ' + BOSS_TOTAL + ' คะแนน';
    $('result-stars-extra').innerHTML = starsHtml(stars, 3);

    FeedbackStandard.renderScoreResult($('result-standard'), state.bossCorrect, BOSS_TOTAL, {
      onWin: addXpAndUnlock,
      onRetry: startBoss,
      onReview: startPictureExamples
    });
    showScreen('result');
  }

  function resetAndReplay() {
    state = {
      learnIndex: 0, peIndex: 0,
      miniIndex: 0, miniFormats: [],
      g1Order: [], g1Index: 0,
      g2Order: [], g2Index: 0,
      g3Order: [], g3Index: 0,
      bossIndex: 0, bossCorrect: 0, bossQueue: []
    };
    startLearn();
  }
})();
