// Conjunction Adventure Chapter 1 (and/but/or) — game logic.
// Extends the pattern from 16-Verb/17-Adjective/18-Pronoun/19-Preposition
// Adventure (shuffle/pickDistractors/blankTargetWord/saveProgress) with a
// richer 9-screen flow requested for this game specifically:
//   intro (Learn) -> technique (เทคนิคการจำ, carousel) -> examples
//   (ตัวอย่าง, carousel) -> mini (Mini Practice, ungraded) -> stage1 ->
//   stage2 -> stage3 -> boss (Boss Quiz, mixed format) -> result
// Only stage1/stage2/stage3/boss are scored; mini is practice-only.
(function () {
  'use strict';
  var STORAGE_KEY = 'conjunctionAdventureCh1Progress';
  var WORDS = CONJUNCTION_ADVENTURE_CH1_WORDS;
  var N = WORDS.length; // 3

  var state = {
    techIndex: 0,
    exIndex: 0,
    miniOrder: [], miniIndex: 0,
    s1Order: [], s1Index: 0, s1Correct: 0,
    s2Order: [], s2Index: 0, s2Correct: 0,
    s3Mistakes: 0, s3MatchedCount: 0, s3SelectedWord: null, s3SelectedEmoji: null,
    bossOrder: [], bossIndex: 0, bossCorrect: 0
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

  function showScreen(name) {
    ['intro', 'technique', 'examples', 'mini', 'stage1', 'stage2', 'stage3', 'boss', 'result'].forEach(function (n) {
      $('screen-' + n).classList.toggle('hidden', n !== name);
    });
  }

  function pickDistractors(correctIdx, field, count) {
    var pool = [];
    WORDS.forEach(function (w, i) { if (i !== correctIdx) pool.push(w[field]); });
    return shuffle(pool).slice(0, count);
  }

  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function blankTargetWord(sentence, word) {
    var re = new RegExp('\\b' + escapeRegExp(word) + '\\b', 'i');
    return sentence.replace(re, '____');
  }

  function buildChoiceButtons(container, choices, onPick) {
    container.innerHTML = '';
    choices.forEach(function (choice) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.addEventListener('click', function () { onPick(btn, choice); });
      container.appendChild(btn);
    });
  }

  // ================= Technique (เทคนิคการจำ) =================
  function startTechnique() {
    state.techIndex = 0;
    showScreen('technique');
    renderTechnique();
  }

  function renderTechnique() {
    var w = WORDS[state.techIndex];
    Mascot.render('technique-mascot', w.memoryTip);
    var audioBtn = window.Pronunciation ? Pronunciation.renderButton(w.en, 'word') : '';
    var practiceBtn = window.Pronunciation ? Pronunciation.renderPracticeButton(w.en, 'word') : '';
    $('technique-word').innerHTML = '<b>' + w.en + '</b> (' + w.th + ')' + audioBtn + practiceBtn;
    $('technique-dots').textContent = (state.techIndex + 1) + ' / ' + N;
    $('techPrevBtn').disabled = state.techIndex === 0;
    $('techNextBtn').textContent = state.techIndex === N - 1 ? 'ไปดูตัวอย่าง ➡️' : 'ถัดไป ▶';
  }

  // ================= Examples (ตัวอย่าง) =================
  function startExamples() {
    state.exIndex = 0;
    showScreen('examples');
    renderExample();
  }

  function renderExample() {
    var w = WORDS[state.exIndex];
    $('example-word-label').textContent = w.en + ' (' + w.th + ')';
    $('example-scene').innerHTML =
      '<span>' + w.scene[0] + '</span><span class="connector">' + w.connector + '</span><span>' + w.scene[1] + '</span>';
    $('example-en').textContent = w.example;
    $('example-th').textContent = 'ตัวอย่างประโยคที่ใช้ "' + w.en + '"';
    $('example-audio-btn').setAttribute('data-text', w.example);
    $('example-dots').textContent = (state.exIndex + 1) + ' / ' + N;
    $('exPrevBtn').disabled = state.exIndex === 0;
    $('exNextBtn').textContent = state.exIndex === N - 1 ? 'ไปฝึกซ้อม (Mini Practice) ➡️' : 'ถัดไป ▶';
  }

  // ================= Mini Practice (ungraded) =================
  function startMini() {
    state.miniOrder = shuffle(WORDS.map(function (_, i) { return i; }));
    state.miniIndex = 0;
    showScreen('mini');
    renderMini();
  }

  function renderMini() {
    var idx = state.miniOrder[state.miniIndex];
    var w = WORDS[idx];
    $('mini-sentence').textContent = blankTargetWord(w.example, w.en);
    $('mini-progress-label').textContent = (state.miniIndex + 1) + ' / ' + N;
    $('mini-feedback').textContent = '';
    $('mini-feedback').className = 'feedback-line';

    var choices = shuffle([w.en].concat(pickDistractors(idx, 'en', Math.min(3, N - 1))));
    buildChoiceButtons($('mini-choices'), choices, function (btn, choice) { answerMini(btn, choice, w.en); });
  }

  function answerMini(btn, choice, correctAnswer) {
    var box = $('mini-choices');
    Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
    if (choice === correctAnswer) {
      btn.classList.add('correct');
      $('mini-feedback').textContent = 'ถูกต้อง! 🎉';
      $('mini-feedback').className = 'feedback-line good';
    } else {
      btn.classList.add('wrong');
      Array.prototype.forEach.call(box.children, function (b) {
        if (b.textContent === correctAnswer) b.classList.add('correct');
      });
      $('mini-feedback').textContent = 'คำตอบที่ถูกคือ "' + correctAnswer + '" (ไม่เป็นไร นี่แค่ฝึกซ้อม)';
      $('mini-feedback').className = 'feedback-line bad';
    }
    setTimeout(function () {
      state.miniIndex++;
      if (state.miniIndex >= N) {
        startStage1();
      } else {
        renderMini();
      }
    }, 900);
  }

  // ================= Stage 1: emoji + blanked sentence -> word =================
  function startStage1() {
    state.s1Order = shuffle(WORDS.map(function (_, i) { return i; }));
    state.s1Index = 0; state.s1Correct = 0;
    showScreen('stage1');
    renderStage1();
  }

  function renderStage1() {
    var idx = state.s1Order[state.s1Index];
    var w = WORDS[idx];
    $('s1-emoji').textContent = w.emoji;
    $('s1-sentence').textContent = blankTargetWord(w.example, w.en);
    $('s1-progress-label').textContent = (state.s1Index + 1) + ' / ' + N;
    $('s1-bar-fill').style.width = Math.round((state.s1Index / N) * 100) + '%';
    $('s1-feedback').textContent = '';
    $('s1-feedback').className = 'feedback-line';

    var choices = shuffle([w.en].concat(pickDistractors(idx, 'en', Math.min(3, N - 1))));
    buildChoiceButtons($('s1-choices'), choices, function (btn, choice) { answerStage1(btn, choice, w.en); });
  }

  function answerStage1(btn, choice, correctAnswer) {
    var box = $('s1-choices');
    Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
    if (choice === correctAnswer) {
      btn.classList.add('correct');
      state.s1Correct++;
      $('s1-feedback').textContent = 'ถูกต้อง! 🎉';
      $('s1-feedback').className = 'feedback-line good';
    } else {
      btn.classList.add('wrong');
      Array.prototype.forEach.call(box.children, function (b) {
        if (b.textContent === correctAnswer) b.classList.add('correct');
      });
      $('s1-feedback').textContent = 'คำตอบที่ถูกคือ "' + correctAnswer + '"';
      $('s1-feedback').className = 'feedback-line bad';
    }
    setTimeout(function () {
      state.s1Index++;
      if (state.s1Index >= N) {
        $('s1-bar-fill').style.width = '100%';
        startStage2();
      } else {
        renderStage1();
      }
    }, 900);
  }

  // ================= Stage 2: listen -> Thai meaning =================
  function startStage2() {
    state.s2Order = shuffle(WORDS.map(function (_, i) { return i; }));
    state.s2Index = 0; state.s2Correct = 0;
    showScreen('stage2');
    renderStage2();
  }

  function renderStage2() {
    var idx = state.s2Order[state.s2Index];
    var w = WORDS[idx];
    $('s2-progress-label').textContent = (state.s2Index + 1) + ' / ' + N;
    $('s2-bar-fill').style.width = Math.round((state.s2Index / N) * 100) + '%';
    $('s2-feedback').textContent = '';
    $('s2-feedback').className = 'feedback-line';
    $('s2-audio-btn').setAttribute('data-text', w.en);

    var choices = shuffle([w.th].concat(pickDistractors(idx, 'th', Math.min(3, N - 1))));
    buildChoiceButtons($('s2-choices'), choices, function (btn, choice) { answerStage2(btn, choice, w.th); });

    if (window.GameAudio) window.GameAudio.playWord(w.en);
  }

  function answerStage2(btn, choice, correctAnswer) {
    var box = $('s2-choices');
    Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
    if (choice === correctAnswer) {
      btn.classList.add('correct');
      state.s2Correct++;
      $('s2-feedback').textContent = 'ถูกต้อง! 🎉';
      $('s2-feedback').className = 'feedback-line good';
    } else {
      btn.classList.add('wrong');
      Array.prototype.forEach.call(box.children, function (b) {
        if (b.textContent === correctAnswer) b.classList.add('correct');
      });
      $('s2-feedback').textContent = 'คำตอบที่ถูกคือ "' + correctAnswer + '"';
      $('s2-feedback').className = 'feedback-line bad';
    }
    setTimeout(function () {
      state.s2Index++;
      if (state.s2Index >= N) {
        $('s2-bar-fill').style.width = '100%';
        startStage3();
      } else {
        renderStage2();
      }
    }, 900);
  }

  // ================= Stage 3: matching game =================
  function startStage3() {
    state.s3Mistakes = 0; state.s3MatchedCount = 0;
    state.s3SelectedWord = null; state.s3SelectedEmoji = null;
    showScreen('stage3');
    renderStage3();
  }

  function renderStage3() {
    $('s3-progress-label').textContent = state.s3MatchedCount + ' / ' + N + ' คู่';
    $('s3-bar-fill').style.width = Math.round((state.s3MatchedCount / N) * 100) + '%';
    $('s3-mistakes').textContent = 'พลาด ' + state.s3Mistakes + ' ครั้ง';

    var wordTiles = WORDS.map(function (w, i) { return { type: 'word', idx: i, label: w.en }; });
    var emojiTiles = WORDS.map(function (w, i) { return { type: 'emoji', idx: i, label: w.emoji }; });
    var tiles = shuffle(wordTiles.concat(emojiTiles));

    var grid = $('s3-grid');
    grid.innerHTML = '';
    tiles.forEach(function (t) {
      var tile = document.createElement('button');
      tile.className = 'match-tile' + (t.type === 'word' ? ' word' : '');
      tile.textContent = t.label;
      tile.setAttribute('data-idx', t.idx);
      tile.setAttribute('data-type', t.type);
      tile.addEventListener('click', function () { onTileClick(tile, t); });
      grid.appendChild(tile);
    });
  }

  function onTileClick(el, t) {
    if (el.classList.contains('matched') || el.classList.contains('selected')) return;

    if (t.type === 'word') {
      if (state.s3SelectedWord) state.s3SelectedWord.el.classList.remove('selected');
      state.s3SelectedWord = { el: el, idx: t.idx };
      el.classList.add('selected');
    } else {
      if (state.s3SelectedEmoji) state.s3SelectedEmoji.el.classList.remove('selected');
      state.s3SelectedEmoji = { el: el, idx: t.idx };
      el.classList.add('selected');
    }

    if (state.s3SelectedWord && state.s3SelectedEmoji) {
      var w = state.s3SelectedWord, em = state.s3SelectedEmoji;
      if (w.idx === em.idx) {
        w.el.classList.remove('selected'); em.el.classList.remove('selected');
        w.el.classList.add('matched'); em.el.classList.add('matched');
        state.s3MatchedCount++;
        state.s3SelectedWord = null; state.s3SelectedEmoji = null;
        $('s3-progress-label').textContent = state.s3MatchedCount + ' / ' + N + ' คู่';
        $('s3-bar-fill').style.width = Math.round((state.s3MatchedCount / N) * 100) + '%';
        if (state.s3MatchedCount >= N) {
          setTimeout(startBoss, 500);
        }
      } else {
        state.s3Mistakes++;
        $('s3-mistakes').textContent = 'พลาด ' + state.s3Mistakes + ' ครั้ง';
        w.el.classList.add('shake'); em.el.classList.add('shake');
        setTimeout(function () {
          w.el.classList.remove('selected', 'shake');
          em.el.classList.remove('selected', 'shake');
        }, 400);
        state.s3SelectedWord = null; state.s3SelectedEmoji = null;
      }
    }
  }

  // ================= Boss Quiz (mixed format, final scored round) =================
  function startBoss() {
    state.bossOrder = shuffle(WORDS.map(function (_, i) { return i; }));
    state.bossIndex = 0; state.bossCorrect = 0;
    showScreen('boss');
    Mascot.render('boss-mascot', 'ด่านสุดท้ายแล้ว! ตั้งใจดี ๆ นะ สู้ ๆ! 🔥');
    renderBoss();
  }

  function renderBoss() {
    var idx = state.bossOrder[state.bossIndex];
    var w = WORDS[idx];
    var isFillBlank = state.bossIndex % 2 === 0;
    $('boss-progress-label').textContent = (state.bossIndex + 1) + ' / ' + N;
    $('boss-bar-fill').style.width = Math.round((state.bossIndex / N) * 100) + '%';
    $('boss-feedback').textContent = '';
    $('boss-feedback').className = 'feedback-line';

    var box = $('boss-content');
    if (isFillBlank) {
      box.innerHTML = '<div class="big-emoji">' + w.emoji + '</div>' +
        '<p id="boss-sentence" class="s1-sentence"></p>' +
        '<div id="boss-choices" class="choice-grid"></div>';
      $('boss-sentence').textContent = blankTargetWord(w.example, w.en);
      var choicesEn = shuffle([w.en].concat(pickDistractors(idx, 'en', Math.min(3, N - 1))));
      buildChoiceButtons($('boss-choices'), choicesEn, function (btn, choice) { answerBoss(btn, choice, w.en); });
    } else {
      box.innerHTML = '<button id="boss-audio-btn" class="audio-btn" data-audio="word">🔊 ฟังคำศัพท์</button>' +
        '<div id="boss-choices" class="choice-grid"></div>';
      $('boss-audio-btn').setAttribute('data-text', w.en);
      var choicesTh = shuffle([w.th].concat(pickDistractors(idx, 'th', Math.min(3, N - 1))));
      buildChoiceButtons($('boss-choices'), choicesTh, function (btn, choice) { answerBoss(btn, choice, w.th); });
      if (window.GameAudio) window.GameAudio.playWord(w.en);
    }
  }

  function answerBoss(btn, choice, correctAnswer) {
    var box = $('boss-choices');
    Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
    if (choice === correctAnswer) {
      btn.classList.add('correct');
      state.bossCorrect++;
      $('boss-feedback').textContent = 'ถูกต้อง! 🎉';
      $('boss-feedback').className = 'feedback-line good';
    } else {
      btn.classList.add('wrong');
      Array.prototype.forEach.call(box.children, function (b) {
        if (b.textContent === correctAnswer) b.classList.add('correct');
      });
      $('boss-feedback').textContent = 'คำตอบที่ถูกคือ "' + correctAnswer + '"';
      $('boss-feedback').className = 'feedback-line bad';
    }
    setTimeout(function () {
      state.bossIndex++;
      if (state.bossIndex >= N) {
        $('boss-bar-fill').style.width = '100%';
        finishGame();
      } else {
        renderBoss();
      }
    }, 900);
  }

  // ================= Result =================
  function finishGame() {
    var s3Score = Math.max(0, N - state.s3Mistakes);
    var total = state.s1Correct + state.s2Correct + s3Score + state.bossCorrect;
    var max = N * 4;
    var pct = total / max;
    var stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;

    saveProgress(total, stars);

    $('result-stars').textContent = '★★★☆☆☆'.slice(3 - stars, 6 - stars);
    $('result-score').textContent = total + ' / ' + max + ' คะแนน';
    var msgs = [
      'ลองใหม่อีกครั้งนะ เดี๋ยวก็เก่งขึ้น!',
      'เก่งขึ้นแล้ว! ฝึกอีกนิดจะได้ 3 ดาว',
      'เยี่ยมมาก! เกือบเต็มแล้ว',
      'สุดยอด! ผ่านด่านที่ 1 แบบเพอร์เฟกต์ 🌟'
    ];
    $('result-sub').textContent = msgs[stars];

    showScreen('result');
  }

  function saveProgress(score, stars) {
    var prev = {};
    try { prev = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch (e) { prev = {}; }
    var chapter1 = prev.chapter1 || { bestScore: 0, bestStars: 0, playCount: 0 };
    chapter1.playCount = (chapter1.playCount || 0) + 1;
    if (score > chapter1.bestScore) chapter1.bestScore = score;
    if (stars > chapter1.bestStars) chapter1.bestStars = stars;
    prev.chapter1 = chapter1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
  }

  function resetAndReplay() {
    state = {
      techIndex: 0, exIndex: 0,
      miniOrder: [], miniIndex: 0,
      s1Order: [], s1Index: 0, s1Correct: 0,
      s2Order: [], s2Index: 0, s2Correct: 0,
      s3Mistakes: 0, s3MatchedCount: 0, s3SelectedWord: null, s3SelectedEmoji: null,
      bossOrder: [], bossIndex: 0, bossCorrect: 0
    };
    startTechnique();
  }

  document.addEventListener('DOMContentLoaded', function () {
    Mascot.render('intro-mascot', 'สวัสดี! ฉันชื่อคอนนี่ วันนี้เราจะมาเรียนคำสันธานกัน พร้อมลุยหรือยัง?');
    $('toTechniqueBtn').addEventListener('click', startTechnique);
    $('techPrevBtn').addEventListener('click', function () {
      if (state.techIndex > 0) { state.techIndex--; renderTechnique(); }
    });
    $('techNextBtn').addEventListener('click', function () {
      if (state.techIndex < N - 1) { state.techIndex++; renderTechnique(); }
      else { startExamples(); }
    });
    $('exPrevBtn').addEventListener('click', function () {
      if (state.exIndex > 0) { state.exIndex--; renderExample(); }
    });
    $('exNextBtn').addEventListener('click', function () {
      if (state.exIndex < N - 1) { state.exIndex++; renderExample(); }
      else { startMini(); }
    });
    $('replayBtn').addEventListener('click', resetAndReplay);
    showScreen('intro');
  });
})();
