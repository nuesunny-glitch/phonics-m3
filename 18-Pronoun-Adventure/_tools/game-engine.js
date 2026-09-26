// Pronoun Adventure Chapter 1 — game logic. Structurally based on
// 16-Verb-Adventure/_tools/game-engine.js and
// 17-Adjective-Adventure/_tools/game-engine.js: reads PRONOUN_ADVENTURE_WORDS
// (pronouns-data.js), uses its own localStorage key so scores never mix
// across the three game series, and drives the same 5 screens in
// chapter-1-basic-pronouns/game.html by toggling the ".hidden" class.
//
// One deliberate difference from the other two engines: renderStage1() also
// fills #s1-sentence with the word's example sentence, first word blanked
// out (every PRONOUN_ADVENTURE_WORDS example starts with the pronoun itself,
// so a simple "replace first word" is safe here). Verbs/adjectives have a
// clean 1:1 emoji mapping so the emoji alone is enough; pronouns don't
// (e.g. "we" vs "they" both render as "a group of people" in emoji), so the
// sentence gives the question a single defensible answer.
(function () {
  'use strict';
  var STORAGE_KEY = 'pronounAdventureProgress';
  var TOTAL_PER_STAGE = PRONOUN_ADVENTURE_WORDS.length; // 7

  var state = {
    s1Order: [], s1Index: 0, s1Correct: 0,
    s2Order: [], s2Index: 0, s2Correct: 0,
    s3Mistakes: 0, s3MatchedCount: 0,
    s3SelectedWord: null, s3SelectedEmoji: null
  };

  function $(id) { return document.getElementById(id); }

  // Speaker-button renderer: prefers the Global Audio System (Phase 2
  // pilot — window.GlobalAudio, rate 0.85) when the page has loaded it,
  // otherwise falls back to the existing Pronunciation-System engine.
  // Returns '' if neither is present, same as the previous inline check.
  function renderAudioBtn(text, type) {
    if (window.GlobalAudio) return window.GlobalAudio.renderButton(text, type);
    if (window.Pronunciation) return window.Pronunciation.renderButton(text, type);
    return '';
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function showScreen(name) {
    ['intro', 'stage1', 'stage2', 'stage3', 'result'].forEach(function (n) {
      $('screen-' + n).classList.toggle('hidden', n !== name);
    });
  }

  function pickDistractors(correctIdx, field, count) {
    var pool = [];
    PRONOUN_ADVENTURE_WORDS.forEach(function (w, i) { if (i !== correctIdx) pool.push(w[field]); });
    return shuffle(pool).slice(0, count);
  }

  function blankFirstWord(sentence) {
    return sentence.replace(/^\S+/, '____');
  }

  // ---------------- Stage 1: emoji + blanked sentence -> English word ----------------
  function startStage1() {
    state.s1Order = shuffle(PRONOUN_ADVENTURE_WORDS.map(function (_, i) { return i; }));
    state.s1Index = 0; state.s1Correct = 0;
    showScreen('stage1');
    renderStage1();
  }

  function renderStage1() {
    var idx = state.s1Order[state.s1Index];
    var verb = PRONOUN_ADVENTURE_WORDS[idx];
    $('s1-emoji').textContent = verb.emoji;
    // Pronunciation System: speaker button for the full (un-blanked)
    // example sentence, so students can hear the target sentence. Built
    // via innerHTML (not a separately-targeted child span) since this
    // whole line is replaced fresh on every render anyway.
    $('s1-sentence').innerHTML = blankFirstWord(verb.example) +
      renderAudioBtn(verb.example, 'sentence');
    $('s1-progress-label').textContent = (state.s1Index + 1) + ' / ' + TOTAL_PER_STAGE;
    $('s1-bar-fill').style.width = Math.round((state.s1Index / TOTAL_PER_STAGE) * 100) + '%';
    $('s1-feedback').textContent = '';
    $('s1-feedback').className = 'feedback-line';

    var choices = shuffle([verb.en].concat(pickDistractors(idx, 'en', Math.min(3, TOTAL_PER_STAGE - 1))));
    var box = $('s1-choices');
    box.innerHTML = '';
    choices.forEach(function (choice) {
      // A real <button> can't nest inside another <button>, so the choice
      // button and its speaker button are siblings inside a small flex
      // wrapper (.gaud-choice-item, from Audio-System/audio-system.css)
      // instead of nested.
      var item = document.createElement('div');
      item.className = 'gaud-choice-item';
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.addEventListener('click', function () { answerStage1(btn, choice, verb.en); });
      item.appendChild(btn);
      item.insertAdjacentHTML('beforeend', renderAudioBtn(choice, 'word'));
      box.appendChild(item);
    });
  }

  function answerStage1(btn, choice, correctAnswer) {
    var box = $('s1-choices');
    Array.prototype.forEach.call(box.querySelectorAll('.choice-btn'), function (b) { b.disabled = true; });
    var isCorrect = choice === correctAnswer;
    if (isCorrect) {
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
      if (state.s1Index >= TOTAL_PER_STAGE) {
        $('s1-bar-fill').style.width = '100%';
        startStage2();
      } else {
        renderStage1();
      }
    }, 900);
  }

  // ---------------- Stage 2: listen -> Thai meaning ----------------
  function startStage2() {
    state.s2Order = shuffle(PRONOUN_ADVENTURE_WORDS.map(function (_, i) { return i; }));
    state.s2Index = 0; state.s2Correct = 0;
    showScreen('stage2');
    renderStage2();
  }

  function renderStage2() {
    var idx = state.s2Order[state.s2Index];
    var verb = PRONOUN_ADVENTURE_WORDS[idx];
    $('s2-progress-label').textContent = (state.s2Index + 1) + ' / ' + TOTAL_PER_STAGE;
    $('s2-bar-fill').style.width = Math.round((state.s2Index / TOTAL_PER_STAGE) * 100) + '%';
    $('s2-feedback').textContent = '';
    $('s2-feedback').className = 'feedback-line';
    $('s2-audio-btn').setAttribute('data-text', verb.en);

    var choices = shuffle([verb.th].concat(pickDistractors(idx, 'th', Math.min(3, TOTAL_PER_STAGE - 1))));
    var box = $('s2-choices');
    box.innerHTML = '';
    choices.forEach(function (choice) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice;
      btn.addEventListener('click', function () { answerStage2(btn, choice, verb.th); });
      box.appendChild(btn);
    });

    if (window.GameAudio) window.GameAudio.playWord(verb.en);
  }

  function answerStage2(btn, choice, correctAnswer) {
    var box = $('s2-choices');
    Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
    var isCorrect = choice === correctAnswer;
    if (isCorrect) {
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
      if (state.s2Index >= TOTAL_PER_STAGE) {
        $('s2-bar-fill').style.width = '100%';
        startStage3();
      } else {
        renderStage2();
      }
    }, 900);
  }

  // ---------------- Stage 3: matching game ----------------
  function startStage3() {
    state.s3Mistakes = 0; state.s3MatchedCount = 0;
    state.s3SelectedWord = null; state.s3SelectedEmoji = null;
    showScreen('stage3');
    renderStage3();
  }

  function renderStage3() {
    $('s3-progress-label').textContent = state.s3MatchedCount + ' / ' + TOTAL_PER_STAGE + ' คู่';
    $('s3-bar-fill').style.width = Math.round((state.s3MatchedCount / TOTAL_PER_STAGE) * 100) + '%';
    $('s3-mistakes').textContent = 'พลาด ' + state.s3Mistakes + ' ครั้ง';

    var wordTiles = PRONOUN_ADVENTURE_WORDS.map(function (w, i) { return { type: 'word', idx: i, label: w.en }; });
    var emojiTiles = PRONOUN_ADVENTURE_WORDS.map(function (w, i) { return { type: 'emoji', idx: i, label: w.emoji }; });
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
        $('s3-progress-label').textContent = state.s3MatchedCount + ' / ' + TOTAL_PER_STAGE + ' คู่';
        $('s3-bar-fill').style.width = Math.round((state.s3MatchedCount / TOTAL_PER_STAGE) * 100) + '%';
        if (state.s3MatchedCount >= TOTAL_PER_STAGE) {
          setTimeout(finishGame, 500);
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

  // ---------------- Result ----------------
  function finishGame() {
    var s3Score = Math.max(0, TOTAL_PER_STAGE - state.s3Mistakes);
    var total = state.s1Correct + state.s2Correct + s3Score;
    var max = TOTAL_PER_STAGE * 3;
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
      s1Order: [], s1Index: 0, s1Correct: 0,
      s2Order: [], s2Index: 0, s2Correct: 0,
      s3Mistakes: 0, s3MatchedCount: 0,
      s3SelectedWord: null, s3SelectedEmoji: null
    };
    startStage1();
  }

  document.addEventListener('DOMContentLoaded', function () {
    $('startBtn').addEventListener('click', startStage1);
    $('replayBtn').addEventListener('click', resetAndReplay);
    showScreen('intro');
  });
})();
