// Daily Conversation Adventure — Lesson 1: HELLO! full engine driving all
// 9 screens: intro (character roster) -> scenes (4 dialogue scenes,
// Listen + Repeat-after-me on every line) -> vocab (8 words, image +
// English + Thai + speaker button) -> mini (ungraded, "Who answers?") ->
// game1 (choose correct reply) -> game2 (picture word match) -> game3
// (drag/build the sentence) -> boss (10 random Q, scored, instant
// explanation) -> result (FeedbackStandard win/retry/review + XP/unlock).
// Structure and helper functions follow the same pattern as every other
// Adventure game's game-engine.js (see e.g. 22-Present-Continuous-
// Adventure/_tools/game-engine-ch1.js) per this project's reuse-the-
// engine convention. Only the Boss Quiz is scored — everything before it
// is learning/practice, matching this project's established convention.
(function () {
  'use strict';
  var STORAGE_KEY = 'dailyConversationAdventureLesson1Progress';
  var BOSS_TOTAL = 10;
  var MINI_TOTAL = MINI_QUESTIONS.length;
  var G3_TOTAL = Math.min(6, SHORT_LINES.length);

  var state = {
    sceneIndex: 0,
    miniIndex: 0, miniOrder: [],
    g1Index: 0, g1Order: [],
    g2Selected: null, g2Matched: 0, g2Mistakes: 0,
    g3Index: 0, g3Order: [],
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

  function starsHtml(count, total) {
    var html = '';
    for (var i = 0; i < total; i++) {
      html += '<span style="color:' + (i < count ? 'var(--c2)' : '#ddd') + '">★</span>';
    }
    return html;
  }

  var SCREENS = ['intro', 'scenes', 'vocab', 'mini', 'game1', 'game2', 'game3', 'boss', 'result'];
  function showScreen(name) {
    SCREENS.forEach(function (n) { $('screen-' + n).classList.toggle('hidden', n !== name); });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  // ---------- Shared choice-rendering helper (reused by mini/game1) ----------
  function renderChoices(box, choices, onAnswer) {
    box.innerHTML = '';
    choices.forEach(function (c) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = c.label;
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
        btn.classList.add(c.ok ? 'correct' : 'wrong');
        onAnswer(c.ok);
      });
      box.appendChild(btn);
    });
  }

  // ================= 1. Intro =================
  document.addEventListener('DOMContentLoaded', function () {
    Mascot.renderBubble('intro-mascot', 'สวัสดี! ฉันชื่อคอนนี่ 🦊 มาเรียนทักทายเพื่อนใหม่กันเถอะ!');
    $('cast-row').innerHTML = CHARACTERS.map(function (c) {
      return '<div class="cast-chip"><div class="cast-emoji">' + c.emoji + '</div><div class="cast-name">' + c.name + '</div></div>';
    }).join('');
    $('startBtn').addEventListener('click', startScenes);
    $('scenePrevBtn').addEventListener('click', function () { if (state.sceneIndex > 0) { state.sceneIndex--; renderScene(); } });
    $('sceneNextBtn').addEventListener('click', function () {
      if (state.sceneIndex < SCENES.length - 1) { state.sceneIndex++; renderScene(); }
      else startVocab();
    });
    $('toMiniBtn').addEventListener('click', startMini);
    showScreen('intro');
  });

  // ================= 2. Scenes =================
  function startScenes() { state.sceneIndex = 0; showScreen('scenes'); renderScene(); }
  function renderScene() {
    var sc = SCENES[state.sceneIndex];
    $('scene-location').textContent = sc.location;
    $('scene-illustration').textContent = sc.illustration;
    $('scene-dots').textContent = (state.sceneIndex + 1) + ' / ' + SCENES.length;
    $('scene-bar-fill').style.width = Math.round((state.sceneIndex / (SCENES.length - 1)) * 100) + '%';
    $('scene-lines').innerHTML = sc.lines.map(function (ln, i) {
      var ch = charById(ln.speaker);
      var side = i % 2 === 0 ? '' : 'right';
      var listenBtn = window.Pronunciation ? Pronunciation.renderButton(ln.en, 'sentence') : '';
      var repeatBtn = window.Pronunciation ? Pronunciation.renderPracticeButton(ln.en, 'sentence') : '';
      return '<div class="dialogue-line ' + side + '">' +
        '<div class="speaker-avatar" aria-hidden="true">' + ch.emoji + '</div>' +
        '<div class="dialogue-bubble">' +
          '<div class="speaker-name">' + ch.name + '</div>' +
          '<div class="en-line">' + ln.en + '</div>' +
          '<div class="th-line">' + ln.th + '</div>' +
          '<div class="line-audio-row">' + listenBtn + repeatBtn + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    $('scenePrevBtn').disabled = state.sceneIndex === 0;
    $('sceneNextBtn').textContent = state.sceneIndex === SCENES.length - 1 ? 'ไปคลังคำศัพท์ ➡️' : 'ถัดไป ▶';
  }

  // ================= 3. Vocabulary =================
  function startVocab() {
    showScreen('vocab');
    $('vocab-grid').innerHTML = VOCAB.map(function (v) {
      var listenBtn = window.Pronunciation ? Pronunciation.renderButton(v.en, 'word') : '';
      var repeatBtn = window.Pronunciation ? Pronunciation.renderPracticeButton(v.en, 'word') : '';
      return '<div class="vocab-card">' +
        '<div class="vocab-emoji">' + v.emoji + '</div>' +
        '<div class="vocab-en">' + v.en + '</div>' +
        '<div class="vocab-th">' + v.th + '</div>' +
        listenBtn + repeatBtn +
      '</div>';
    }).join('');
  }

  // ================= 4. Mini Practice (ungraded) =================
  function startMini() {
    state.miniIndex = 0;
    state.miniOrder = shuffle(MINI_QUESTIONS.slice());
    showScreen('mini');
    renderMini();
  }
  function renderMini() {
    var q = state.miniOrder[state.miniIndex];
    $('mini-progress-label').textContent = (state.miniIndex + 1) + ' / ' + MINI_TOTAL;
    $('mini-bar-fill').style.width = Math.round((state.miniIndex / MINI_TOTAL) * 100) + '%';
    $('mini-feedback').innerHTML = '';
    $('mini-content').innerHTML = '<p class="s1-sentence">' + q.prompt + '</p><div class="choice-grid" data-role="choices"></div>';
    renderChoices($('mini-content').querySelector('[data-role="choices"]'), shuffle(q.choices), function (isOk) {
      FeedbackStandard.renderFeedback($('mini-feedback'), isOk);
      setTimeout(function () {
        state.miniIndex++;
        if (state.miniIndex >= MINI_TOTAL) { $('mini-bar-fill').style.width = '100%'; startGame1(); }
        else renderMini();
      }, 1000);
    });
  }

  // ================= 5. Game 1 — Choose the Correct Reply =================
  function startGame1() {
    state.g1Order = shuffle(REPLY_ROUNDS.slice());
    state.g1Index = 0;
    showScreen('game1');
    renderGame1();
  }
  function renderGame1() {
    var round = state.g1Order[state.g1Index];
    $('g1-progress-label').textContent = (state.g1Index + 1) + ' / ' + state.g1Order.length;
    $('g1-bar-fill').style.width = Math.round((state.g1Index / state.g1Order.length) * 100) + '%';
    $('g1-feedback').innerHTML = '';
    $('g1-content').innerHTML =
      '<div class="word-illustration">' + round.illustration + '</div>' +
      '<p class="s1-sentence">"' + round.prompt + '" (' + round.promptTh + ')</p>' +
      '<p class="muted" style="margin-top:-8px;color:#777;">เลือกคำตอบที่ถูกต้อง</p>' +
      '<div class="choice-grid" data-role="choices"></div>';
    renderChoices($('g1-content').querySelector('[data-role="choices"]'), shuffle(buildReplyChoices(round)), function (isOk) {
      FeedbackStandard.renderFeedback($('g1-feedback'), isOk);
      setTimeout(function () {
        state.g1Index++;
        if (state.g1Index >= state.g1Order.length) { $('g1-bar-fill').style.width = '100%'; startGame2(); }
        else renderGame1();
      }, 1000);
    });
  }

  // ================= 6. Game 2 — Picture Word Match =================
  function startGame2() {
    state.g2Selected = null; state.g2Matched = 0; state.g2Mistakes = 0;
    showScreen('game2');
    $('g2-progress-label').textContent = '0 / ' + VOCAB.length + ' คู่';
    $('g2-bar-fill').style.width = '0%';
    $('g2-mistakes').textContent = 'พลาด 0 ครั้ง';

    var tiles = [];
    VOCAB.forEach(function (v, i) {
      tiles.push({ pairId: i, kind: 'emoji', label: v.emoji });
      tiles.push({ pairId: i, kind: 'word', label: v.en });
    });
    tiles = shuffle(tiles);

    var grid = $('g2-grid');
    grid.innerHTML = '';
    tiles.forEach(function (t) {
      var el = document.createElement('div');
      el.className = 'match-tile' + (t.kind === 'word' ? ' word' : '');
      el.textContent = t.label;
      el.dataset.pairId = t.pairId;
      el.addEventListener('click', function () { onG2TileClick(el, t); });
      grid.appendChild(el);
    });
  }
  function onG2TileClick(el, tile) {
    if (el.classList.contains('matched') || el.classList.contains('selected')) return;
    if (!state.g2Selected) {
      state.g2Selected = { el: el, tile: tile };
      el.classList.add('selected');
      return;
    }
    var first = state.g2Selected;
    state.g2Selected = null;
    if (first.el === el) return;
    if (first.tile.pairId === tile.pairId && first.tile.kind !== tile.kind) {
      first.el.classList.remove('selected');
      first.el.classList.add('matched');
      el.classList.add('matched');
      state.g2Matched++;
      $('g2-progress-label').textContent = state.g2Matched + ' / ' + VOCAB.length + ' คู่';
      $('g2-bar-fill').style.width = Math.round((state.g2Matched / VOCAB.length) * 100) + '%';
      if (state.g2Matched >= VOCAB.length) {
        setTimeout(startGame3, 500);
      }
    } else {
      state.g2Mistakes++;
      $('g2-mistakes').textContent = 'พลาด ' + state.g2Mistakes + ' ครั้ง';
      first.el.classList.remove('selected');
      first.el.classList.add('shake');
      el.classList.add('shake');
      setTimeout(function () {
        first.el.classList.remove('shake');
        el.classList.remove('shake');
      }, 300);
    }
  }

  // ================= 7. Game 3 — Build the Sentence (drag & drop) =================
  function startGame3() {
    state.g3Order = shuffle(SHORT_LINES.slice()).slice(0, G3_TOTAL);
    state.g3Index = 0;
    showScreen('game3');
    renderGame3();
  }
  function renderGame3() {
    var ln = state.g3Order[state.g3Index];
    $('g3-progress-label').textContent = (state.g3Index + 1) + ' / ' + state.g3Order.length;
    $('g3-bar-fill').style.width = Math.round((state.g3Index / state.g3Order.length) * 100) + '%';
    $('g3-feedback').innerHTML = '';

    var order = ln.en.replace(/[?.!]+$/, '').split(' ');
    var shuffled = shuffle(order.slice());
    var container = $('g3-content');
    container.innerHTML =
      '<p class="muted" style="color:#777;">เรียงคำให้เป็นประโยค: "' + ln.th + '"</p>' +
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
        if (filledCount >= order.length) {
          FeedbackStandard.renderFeedback($('g3-feedback'), true);
          setTimeout(function () {
            state.g3Index++;
            if (state.g3Index >= state.g3Order.length) { $('g3-bar-fill').style.width = '100%'; startBoss(); }
            else renderGame3();
          }, 1200);
        }
      } else {
        chip.classList.remove('placed');
      }
    });
  }

  // ================= 8. Boss Quiz (10 questions, scored + explanation) =================
  function startBoss() {
    state.bossIndex = 0; state.bossCorrect = 0;
    state.bossQueue = shuffle(BOSS_QUESTIONS.slice()).slice(0, BOSS_TOTAL);
    showScreen('boss');
    renderBoss();
  }
  function renderBoss() {
    var item = state.bossQueue[state.bossIndex];
    $('boss-progress-label').textContent = 'ข้อ ' + (state.bossIndex + 1) + ' / ' + BOSS_TOTAL;
    $('boss-bar-fill').style.width = Math.round((state.bossIndex / BOSS_TOTAL) * 100) + '%';
    $('boss-feedback').innerHTML = '';
    $('boss-explain').classList.add('hidden');
    $('boss-content').innerHTML = '<p class="s1-sentence">' + item.q + '</p><div class="choice-grid" data-role="choices"></div>';
    renderChoices($('boss-content').querySelector('[data-role="choices"]'), shuffle(item.choices), function (isOk) {
      if (isOk) state.bossCorrect++;
      FeedbackStandard.renderFeedback($('boss-feedback'), isOk);
      var explainEl = $('boss-explain');
      explainEl.textContent = '💡 ' + item.explain;
      explainEl.classList.remove('hidden');
      setTimeout(function () {
        state.bossIndex++;
        if (state.bossIndex >= BOSS_TOTAL) { $('boss-bar-fill').style.width = '100%'; finishGame(); }
        else renderBoss();
      }, 1600);
    });
  }

  // ================= 9. Result =================
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
  // Reuse Game-Standards' XP/unlock hook: +100 XP and unlock the next
  // lesson on a Boss Quiz win (8/10, per FeedbackStandard's 80% tier).
  function addXpAndUnlock() {
    var prev = readProgress();
    prev.xp = prev.xp + 100;
    prev.unlocked = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
    var xpEl = document.createElement('div');
    xpEl.className = 'xp-badge';
    xpEl.textContent = '⭐ +100 XP';
    $('result-standard').insertAdjacentElement('afterend', xpEl);
  }

  function finishGame() {
    var pct = state.bossCorrect / BOSS_TOTAL;
    var stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
    saveProgress(state.bossCorrect, stars);

    Mascot.renderBubble('result-mascot', state.bossCorrect >= 8 ? 'เก่งมากเลย! Excellent! 🎉' : 'ฝึกอีกนิดนะ Keep Going! 💪');
    $('result-score').textContent = state.bossCorrect + ' / ' + BOSS_TOTAL + ' คะแนน';
    $('result-stars-extra').innerHTML = starsHtml(stars, 3);

    FeedbackStandard.renderScoreResult($('result-standard'), state.bossCorrect, BOSS_TOTAL, {
      onWin: addXpAndUnlock,
      onRetry: startBoss,
      onReview: startScenes
    });
    showScreen('result');
  }
})();
