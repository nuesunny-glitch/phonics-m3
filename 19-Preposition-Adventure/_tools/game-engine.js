// Preposition Adventure (Grade 9 beginner redesign) — full engine driving
// all 10 screens: intro -> learnPlace -> learnTime -> memoryTrick -> mini
// (ungraded, 4 rotating formats) -> game1 (choose picture) -> game2 (drag
// word) -> game3 (Rescue Mission) -> boss (20 random Q + explanation) ->
// result. Only the Boss Quiz is scored (20 pts max) — everything before it
// is learning/practice, matching this project's established "Mini Practice
// ไม่นับคะแนน" convention.
(function () {
  'use strict';
  var STORAGE_KEY = 'prepositionAdventureProgress';
  var BOSS_TOTAL = 20;
  var MINI_TOTAL = 8;

  var state = {
    lpIndex: 0, ltIndex: 0,
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

  // Renders stars as colored spans (not the ★/☆ glyph pair) — at small font
  // sizes some font-fallback stacks render ★ and ☆ visually identically,
  // making "0 stars" and "3 stars" indistinguishable. Color contrast is
  // robust regardless of font.
  function starsHtml(count, total) {
    var html = '';
    for (var i = 0; i < total; i++) {
      html += '<span style="color:' + (i < count ? 'var(--c2)' : '#ddd') + '">★</span>';
    }
    return html;
  }

  function showScreen(name) {
    ['intro', 'learnPlace', 'learnTime', 'memoryTrick', 'mini', 'game1', 'game2', 'game3', 'boss', 'result'].forEach(function (n) {
      $('screen-' + n).classList.toggle('hidden', n !== name);
    });
  }

  // A word is uniquely identified by `id` (since "in"/"on"/"at" repeat
  // across place+time with different meanings) — distractors must differ
  // in BOTH id and `en` text so choice buttons never show duplicate labels.
  function pickDistractors(correctWord, count) {
    // Dedupe by `en` too, not just `id` — "at" (place) and "at" (time) have
    // different ids but the SAME en text, so without this two distractor
    // buttons could both read "at" with no way to tell them apart.
    var seenEn = {};
    var pool = [];
    shuffle(PREPOSITION_WORDS).forEach(function (w) {
      if (w.id === correctWord.id || w.en === correctWord.en || seenEn[w.en]) return;
      seenEn[w.en] = true;
      pool.push(w);
    });
    return pool.slice(0, count);
  }

  function buildChoiceButtons(container, choices, onPick) {
    container.innerHTML = '';
    choices.forEach(function (choice) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.label;
      btn.addEventListener('click', function () { onPick(btn, choice); });
      container.appendChild(btn);
    });
  }

  // Unified question-sentence builder — works for both categories so every
  // other screen (mini/game1/game2/boss) can share one code path:
  //   place -> blank one of the 3 example sentences
  //   time  -> "____ " + a timeline chip (e.g. "____ Monday")
  function questionSentence(word) {
    if (word.category === 'place') {
      var ex = randChoice(word.examples);
      return ex.replace(word.en, '____');
    }
    var t = randChoice(word.timeline);
    return '____ ' + t;
  }

  // ================= 1. Intro =================
  document.addEventListener('DOMContentLoaded', function () {
    Mascot.renderBubble('intro-mascot', 'สวัสดี! ฉันชื่อคอนนี่ 🦊 มาเรียนคำบุพบทด้วยกันนะ');
    $('startBtn').addEventListener('click', startLearnPlace);
    $('lpPrevBtn').addEventListener('click', function () { if (state.lpIndex > 0) { state.lpIndex--; renderLearnPlace(); } });
    $('lpNextBtn').addEventListener('click', function () {
      if (state.lpIndex < PLACE_WORDS.length - 1) { state.lpIndex++; renderLearnPlace(); }
      else startLearnTime();
    });
    $('ltPrevBtn').addEventListener('click', function () { if (state.ltIndex > 0) { state.ltIndex--; renderLearnTime(); } });
    $('ltNextBtn').addEventListener('click', function () {
      if (state.ltIndex < TIME_WORDS.length - 1) { state.ltIndex++; renderLearnTime(); }
      else startMemoryTrick();
    });
    $('toMiniBtn').addEventListener('click', startMini);
    $('toBossBtn').addEventListener('click', startBoss);
    $('replayBtn').addEventListener('click', resetAndReplay);
    showScreen('intro');
  });

  // ================= 2. Learn: Place =================
  function startLearnPlace() { state.lpIndex = 0; showScreen('learnPlace'); renderLearnPlace(); }
  function renderLearnPlace() {
    var w = PLACE_WORDS[state.lpIndex];
    $('lp-emoji').textContent = w.emoji;
    $('lp-audio-btn').setAttribute('data-text', w.en);
    $('lp-word').textContent = w.en.toUpperCase();
    $('lp-th').textContent = w.th;
    $('lp-examples').innerHTML = w.examples.map(function (ex) {
      return '<div class="example-card"><div class="en">' + ex + '</div></div>';
    }).join('');
    $('lp-dots').textContent = (state.lpIndex + 1) + ' / ' + PLACE_WORDS.length;
    $('lpPrevBtn').disabled = state.lpIndex === 0;
    $('lpNextBtn').textContent = state.lpIndex === PLACE_WORDS.length - 1 ? 'ไปเรื่องเวลา ➡️' : 'ถัดไป ▶';
  }

  // ================= 3. Learn: Time =================
  function startLearnTime() { state.ltIndex = 0; showScreen('learnTime'); renderLearnTime(); }
  function renderLearnTime() {
    var w = TIME_WORDS[state.ltIndex];
    $('lt-emoji').textContent = w.emoji;
    $('lt-audio-btn').setAttribute('data-text', w.en);
    $('lt-word').textContent = w.en.toUpperCase();
    $('lt-th').textContent = w.th;
    $('lt-timeline').innerHTML = w.timeline.map(function (t) {
      return '<span class="timeline-chip">' + t + '</span>';
    }).join('');
    $('lt-dots').textContent = (state.ltIndex + 1) + ' / ' + TIME_WORDS.length;
    $('ltPrevBtn').disabled = state.ltIndex === 0;
    $('ltNextBtn').textContent = state.ltIndex === TIME_WORDS.length - 1 ? 'ดูเทคนิคจำ ➡️' : 'ถัดไป ▶';
  }

  // ================= 4. Memory Trick recap =================
  function startMemoryTrick() {
    showScreen('memoryTrick');
    Mascot.renderBubble('mt-mascot', 'นี่คือเทคนิคจำง่าย ๆ ทั้งหมดเลย!');
    $('mt-grid').innerHTML = PREPOSITION_WORDS.map(function (w) {
      var audioBtn = window.Pronunciation ? Pronunciation.renderButton(w.en, 'word') : '';
      var practiceBtn = window.Pronunciation ? Pronunciation.renderPracticeButton(w.en, 'word') : '';
      return '<div class="tip-card">' + w.emoji + ' ' + w.trick + audioBtn + practiceBtn + '</div>';
    }).join('');
  }

  // ================= 5. Mini Practice (ungraded, 4 rotating formats) =================
  var MINI_FORMATS = ['fill', 'mc', 'match', 'drag'];
  function startMini() {
    state.miniIndex = 0;
    state.miniFormats = [];
    for (var i = 0; i < MINI_TOTAL; i++) state.miniFormats.push(MINI_FORMATS[i % MINI_FORMATS.length]);
    showScreen('mini');
    renderMini();
  }
  function renderMini() {
    var word = randChoice(PREPOSITION_WORDS);
    var format = state.miniFormats[state.miniIndex];
    $('mini-progress-label').textContent = (state.miniIndex + 1) + ' / ' + MINI_TOTAL;
    $('mini-bar-fill').style.width = Math.round((state.miniIndex / MINI_TOTAL) * 100) + '%';
    $('mini-feedback').textContent = '';
    $('mini-feedback').className = 'feedback-line';
    renderPracticeQuestion($('mini-content'), word, format, function (isCorrect) {
      $('mini-feedback').textContent = isCorrect ? 'ถูกต้อง! 🎉' : 'ไม่เป็นไร นี่แค่ฝึกซ้อม 🙂';
      $('mini-feedback').className = 'feedback-line ' + (isCorrect ? 'good' : 'bad');
      setTimeout(function () {
        state.miniIndex++;
        if (state.miniIndex >= MINI_TOTAL) { $('mini-bar-fill').style.width = '100%'; startGame1(); }
        else renderMini();
      }, 900);
    });
  }

  // Shared renderer for the 4 practice formats (used by Mini Practice only;
  // Game1/Game2/Game3/Boss each have their own themed render function below
  // since they need different visuals, but reuse pickDistractors/questionSentence).
  function renderPracticeQuestion(container, word, format, onAnswer) {
    if (format === 'fill') {
      container.innerHTML = '<div class="word-illustration" style="font-size:3.5rem;">' + word.emoji + '</div>' +
        '<p class="s1-sentence">' + questionSentence(word) + '</p>' +
        '<div class="choice-grid" id="pq-choices"></div>';
      var choices = shuffle([{ label: word.en, ok: true }].concat(pickDistractors(word, 3).map(function (w) { return { label: w.en, ok: false }; })));
      buildChoiceButtons($('pq-choices'), choices, function (btn, c) { markChoice(btn, c.ok, onAnswer); });
    } else if (format === 'mc') {
      container.innerHTML = '<p style="font-weight:700;">ความหมายของ "' + word.en + '" (' + (word.category === 'place' ? 'ตำแหน่ง' : 'เวลา') + ') คือ?</p>' +
        '<div class="choice-grid" id="pq-choices"></div>';
      var mcChoices = shuffle([{ label: word.th, ok: true }].concat(pickDistractors(word, 3).map(function (w) { return { label: w.th, ok: false }; })));
      buildChoiceButtons($('pq-choices'), mcChoices, function (btn, c) { markChoice(btn, c.ok, onAnswer); });
    } else if (format === 'match') {
      container.innerHTML = '<h2 style="margin:0 0 10px;">' + word.en.toUpperCase() + '</h2><p class="muted">เลือกภาพที่ตรงกับคำนี้</p>' +
        '<div class="choice-grid" id="pq-choices"></div>';
      var picChoices = shuffle([{ label: word.emoji, ok: true }].concat(pickDistractors(word, 3).map(function (w) { return { label: w.emoji, ok: false }; })));
      picChoices.forEach(function (c) { c.big = true; });
      var box = $('pq-choices') || container.querySelector('#pq-choices');
      box.innerHTML = '';
      picChoices.forEach(function (c) {
        var btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.style.fontSize = '2.2rem';
        btn.textContent = c.label;
        btn.addEventListener('click', function () { markChoice(btn, c.ok, onAnswer); });
        box.appendChild(btn);
      });
    } else if (format === 'drag') {
      var sentence = questionSentence(word);
      container.innerHTML = '<div class="word-illustration" style="font-size:3.5rem;">' + word.emoji + '</div>' +
        '<p class="s1-sentence">' + sentence.replace('____', '<span class="drop-zone" id="pq-zone">?</span>') + '</p>' +
        '<div class="drag-row" id="pq-drag"></div>';
      var dragOpts = shuffle([word].concat(pickDistractors(word, 2)));
      var dragRow = $('pq-drag');
      dragOpts.forEach(function (w) {
        var chip = document.createElement('button');
        chip.className = 'drag-chip';
        chip.textContent = w.en;
        chip.setAttribute('data-ok', w.id === word.id ? '1' : '0');
        dragRow.appendChild(chip);
      });
      DragDrop.enable(dragRow, function (chip, zone) {
        var ok = chip.getAttribute('data-ok') === '1';
        zone.textContent = chip.textContent;
        zone.classList.add('filled');
        onAnswer(ok);
      });
    }
  }

  function markChoice(btn, isOk, onAnswer) {
    var box = btn.parentElement;
    Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
    btn.classList.add(isOk ? 'correct' : 'wrong');
    onAnswer(isOk);
  }

  // ================= 6. Game 1 — Choose the correct picture =================
  function startGame1() {
    state.g1Order = shuffle(PREPOSITION_WORDS.slice());
    state.g1Index = 0;
    showScreen('game1');
    renderGame1();
  }
  function renderGame1() {
    var word = state.g1Order[state.g1Index];
    $('g1-word').textContent = word.en.toUpperCase() + ' (' + word.th + ')';
    $('g1-progress-label').textContent = (state.g1Index + 1) + ' / ' + PREPOSITION_WORDS.length;
    $('g1-bar-fill').style.width = Math.round((state.g1Index / PREPOSITION_WORDS.length) * 100) + '%';
    $('g1-feedback').textContent = '';
    $('g1-feedback').className = 'feedback-line';
    var choices = shuffle([{ label: word.emoji, ok: true }].concat(pickDistractors(word, 3).map(function (w) { return { label: w.emoji, ok: false }; })));
    var box = $('g1-choices');
    box.innerHTML = '';
    choices.forEach(function (c) {
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.style.fontSize = '2.2rem';
      btn.textContent = c.label;
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
        btn.classList.add(c.ok ? 'correct' : 'wrong');
        $('g1-feedback').textContent = c.ok ? 'ถูกต้อง! 🎉' : 'ลองดูใหม่นะ';
        $('g1-feedback').className = 'feedback-line ' + (c.ok ? 'good' : 'bad');
        setTimeout(function () {
          state.g1Index++;
          if (state.g1Index >= state.g1Order.length) { $('g1-bar-fill').style.width = '100%'; startGame2(); }
          else renderGame1();
        }, 900);
      });
      box.appendChild(btn);
    });
  }

  // ================= 7. Game 2 — Drag the word =================
  function startGame2() {
    state.g2Order = shuffle(PREPOSITION_WORDS.slice());
    state.g2Index = 0;
    showScreen('game2');
    renderGame2();
  }
  function renderGame2() {
    var word = state.g2Order[state.g2Index];
    $('g2-emoji').textContent = word.emoji;
    $('g2-progress-label').textContent = (state.g2Index + 1) + ' / ' + PREPOSITION_WORDS.length;
    $('g2-bar-fill').style.width = Math.round((state.g2Index / PREPOSITION_WORDS.length) * 100) + '%';
    $('g2-feedback').textContent = '';
    $('g2-feedback').className = 'feedback-line';
    var sentence = questionSentence(word);
    $('g2-sentence').innerHTML = sentence.replace('____', '<span class="drop-zone" id="g2-zone">?</span>');
    var dragRow = $('g2-drag-row');
    dragRow.innerHTML = '';
    var opts = shuffle([word].concat(pickDistractors(word, 3)));
    opts.forEach(function (w) {
      var chip = document.createElement('button');
      chip.className = 'drag-chip';
      chip.textContent = w.en;
      chip.setAttribute('data-ok', w.id === word.id ? '1' : '0');
      dragRow.appendChild(chip);
    });
    DragDrop.enable(dragRow, function (chip, zone) {
      var ok = chip.getAttribute('data-ok') === '1';
      zone.textContent = chip.textContent;
      zone.classList.add('filled');
      $('g2-feedback').textContent = ok ? 'ถูกต้อง! 🎉' : 'ลองดูใหม่นะ';
      $('g2-feedback').className = 'feedback-line ' + (ok ? 'good' : 'bad');
      setTimeout(function () {
        state.g2Index++;
        if (state.g2Index >= state.g2Order.length) { $('g2-bar-fill').style.width = '100%'; startGame3(); }
        else renderGame2();
      }, 900);
    });
  }

  // ================= 8. Game 3 — Rescue Mission =================
  function startGame3() {
    state.g3Order = shuffle(PREPOSITION_WORDS.slice());
    state.g3Index = 0;
    showScreen('game3');
    $('g3-done').classList.add('hidden');
    renderRescueTrack();
    renderGame3Question();
  }
  function renderRescueTrack() {
    var track = $('rescue-track');
    var html = '';
    for (var i = 0; i < state.g3Order.length; i++) {
      html += '<div class="rescue-stone' + (i < state.g3Index ? ' done' : '') + '">' + (i < state.g3Index ? '✅' : (i + 1)) + '</div>';
    }
    html += '<div class="rescue-goal">🏫</div>';
    track.innerHTML = html;
    var pct = state.g3Index / state.g3Order.length;
    var token = document.createElement('div');
    token.className = 'rescue-token';
    token.textContent = '🦊';
    token.style.left = (pct * 90) + '%';
    track.appendChild(token);
  }
  function renderGame3Question() {
    if (state.g3Index >= state.g3Order.length) {
      $('g3-question').innerHTML = '';
      $('g3-choices').innerHTML = '';
      $('g3-done').classList.remove('hidden');
      return;
    }
    var word = state.g3Order[state.g3Index];
    $('g3-question').innerHTML = '<div class="word-illustration" style="font-size:3rem;">' + word.emoji + '</div>' +
      '<p class="s1-sentence">' + questionSentence(word) + '</p>';
    $('g3-feedback').textContent = '';
    $('g3-feedback').className = 'feedback-line';
    var choices = shuffle([{ label: word.en, ok: true }].concat(pickDistractors(word, 3).map(function (w) { return { label: w.en, ok: false }; })));
    buildChoiceButtons($('g3-choices'), choices, function (btn, c) {
      if (c.ok) {
        Array.prototype.forEach.call(btn.parentElement.children, function (b) { b.disabled = true; });
        btn.classList.add('correct');
        $('g3-feedback').textContent = 'เก่งมาก! คอนนี่เดินหน้าต่อ 🦊';
        $('g3-feedback').className = 'feedback-line good';
        setTimeout(function () {
          state.g3Index++;
          renderRescueTrack();
          renderGame3Question();
        }, 800);
      } else {
        btn.classList.add('wrong');
        $('g3-feedback').textContent = 'ลองอีกครั้งนะ 💪';
        $('g3-feedback').className = 'feedback-line bad';
      }
    });
  }

  // ================= 9. Boss Quiz (20 questions, scored + explanation) =================
  var BOSS_FORMATS = ['fill', 'mc', 'match'];
  function startBoss() {
    state.bossIndex = 0; state.bossCorrect = 0;
    state.bossQueue = [];
    for (var i = 0; i < BOSS_TOTAL; i++) {
      state.bossQueue.push({ word: randChoice(PREPOSITION_WORDS), format: randChoice(BOSS_FORMATS) });
    }
    showScreen('boss');
    renderBoss();
  }
  function renderBoss() {
    var q = state.bossQueue[state.bossIndex];
    $('boss-progress-label').textContent = 'ข้อ ' + (state.bossIndex + 1) + ' / ' + BOSS_TOTAL;
    $('boss-bar-fill').style.width = Math.round((state.bossIndex / BOSS_TOTAL) * 100) + '%';
    $('boss-feedback').textContent = '';
    $('boss-feedback').className = 'feedback-line';
    $('boss-explain').classList.add('hidden');

    var container = $('boss-content');
    if (q.format === 'match') {
      container.innerHTML = '<h2 style="margin:0 0 10px;">' + q.word.en.toUpperCase() + '</h2><p class="muted">เลือกภาพที่ตรงกับคำนี้</p><div class="choice-grid" id="boss-choices"></div>';
      var picChoices = shuffle([{ label: q.word.emoji, ok: true }].concat(pickDistractors(q.word, 3).map(function (w) { return { label: w.emoji, ok: false }; })));
      var box = $('boss-choices');
      picChoices.forEach(function (c) {
        var btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.style.fontSize = '2.2rem';
        btn.textContent = c.label;
        btn.addEventListener('click', function () { answerBoss(this, c.ok, q.word); });
        box.appendChild(btn);
      });
    } else if (q.format === 'mc') {
      container.innerHTML = '<p style="font-weight:700;">ความหมายของ "' + q.word.en + '" คือ?</p><div class="choice-grid" id="boss-choices"></div>';
      var mcChoices = shuffle([{ label: q.word.th, ok: true }].concat(pickDistractors(q.word, 3).map(function (w) { return { label: w.th, ok: false }; })));
      buildChoiceButtons($('boss-choices'), mcChoices, function (btn, c) { answerBoss(btn, c.ok, q.word); });
    } else {
      container.innerHTML = '<div class="word-illustration" style="font-size:3.5rem;">' + q.word.emoji + '</div>' +
        '<p class="s1-sentence">' + questionSentence(q.word) + '</p><div class="choice-grid" id="boss-choices"></div>';
      var fillChoices = shuffle([{ label: q.word.en, ok: true }].concat(pickDistractors(q.word, 3).map(function (w) { return { label: w.en, ok: false }; })));
      buildChoiceButtons($('boss-choices'), fillChoices, function (btn, c) { answerBoss(btn, c.ok, q.word); });
    }
  }
  function answerBoss(btn, isOk, word) {
    var box = btn.parentElement;
    Array.prototype.forEach.call(box.children, function (b) { b.disabled = true; });
    btn.classList.add(isOk ? 'correct' : 'wrong');
    if (isOk) state.bossCorrect++;
    $('boss-feedback').textContent = isOk ? 'ถูกต้อง! 🎉' : 'ยังไม่ถูก 🙁';
    $('boss-feedback').className = 'feedback-line ' + (isOk ? 'good' : 'bad');
    var explainEl = $('boss-explain');
    explainEl.textContent = '💡 ' + word.explain;
    explainEl.classList.remove('hidden');
    setTimeout(function () {
      state.bossIndex++;
      if (state.bossIndex >= BOSS_TOTAL) { $('boss-bar-fill').style.width = '100%'; finishGame(); }
      else renderBoss();
    }, 1500);
  }

  // ================= 10. Result =================
  function finishGame() {
    var pct = state.bossCorrect / BOSS_TOTAL;
    var stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
    saveProgress(state.bossCorrect, stars);

    Mascot.renderBubble('result-mascot', stars >= 2 ? 'เก่งมากเลย! ภูมิใจในตัวเธอนะ 🎉' : 'ฝึกอีกนิดนะ เดี๋ยวก็เก่งขึ้น!');
    $('result-stars').innerHTML = starsHtml(stars, 3);
    $('result-score').textContent = state.bossCorrect + ' / ' + BOSS_TOTAL + ' คะแนน';
    var msgs = ['ลองใหม่อีกครั้งนะ เดี๋ยวก็เก่งขึ้น!', 'เก่งขึ้นแล้ว! ฝึกอีกนิดจะได้ 3 ดาว', 'เยี่ยมมาก! เกือบเต็มแล้ว', 'สุดยอด! เพอร์เฟกต์เลย 🌟'];
    $('result-sub').textContent = msgs[stars];
    showScreen('result');
  }

  function saveProgress(score, stars) {
    var prev = { bestScore: 0, bestStars: 0, playCount: 0 };
    try { prev = JSON.parse(localStorage.getItem(STORAGE_KEY)) || prev; } catch (e) { /* ignore */ }
    prev.playCount = (prev.playCount || 0) + 1;
    if (score > prev.bestScore) prev.bestScore = score;
    if (stars > prev.bestStars) prev.bestStars = stars;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
  }

  function resetAndReplay() {
    state = {
      lpIndex: 0, ltIndex: 0,
      miniIndex: 0, miniFormats: [],
      g1Order: [], g1Index: 0,
      g2Order: [], g2Index: 0,
      g3Order: [], g3Index: 0,
      bossIndex: 0, bossCorrect: 0, bossQueue: []
    };
    startLearnPlace();
  }
})();
