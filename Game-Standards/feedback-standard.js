// ============================================================================
// Game Feedback Standard — shared, reusable feedback/scoring layer for ALL
// FUTURE Adventure-style games and quizzes in this project.
//
// This is NEW project-wide infrastructure. It is intentionally NOT wired
// into the 5 existing games (16-Verb-Adventure, 17-Adjective-Adventure,
// 18-Pronoun-Adventure, 19-Preposition-Adventure, 20-Conjunction-Adventure)
// — those keep their existing (Thai) feedback text and scoring untouched,
// since lesson/game content must not change. New modules built from now on
// should load this file and call FeedbackStandard.* instead of writing
// their own feedback strings.
//
// USAGE (see demo.html for a full working example):
//   <link rel="stylesheet" href="../Game-Standards/feedback-standard.css">
//   <script src="../Game-Standards/feedback-standard.js"></script>
//
//   // after the player answers a question:
//   FeedbackStandard.renderFeedback(document.getElementById('feedback'), isCorrect);
//
//   // after the final question of a quiz:
//   FeedbackStandard.renderScoreResult(document.getElementById('result'), score, maxScore, {
//     onWin:    function () { /* award XP, unlock next lesson, save progress */ },
//     onRetry:  function () { /* restart the quiz immediately */ },
//     onReview: function () { /* show a review/answers screen, then retry */ }
//   });
// ============================================================================
(function () {
  'use strict';

  // Exact phrase pools from the standard. Never show "Wrong" / "Incorrect".
  var CORRECT_PHRASES = ['Great!', 'Awesome!', 'Excellent!', 'Well done!', 'Amazing!', 'You got it!'];
  var INCORRECT_PHRASES = ['Try again!', 'Almost!', 'Look carefully!', 'Think again!', "You're close!", 'Give it another try!'];

  function randChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randomCorrectPhrase() { return randChoice(CORRECT_PHRASES); }
  function randomIncorrectPhrase() { return randChoice(INCORRECT_PHRASES); }

  // Speaks `text` using the host game's own audio module if present (the
  // window.GameAudio.playWord(text) pattern used by every existing
  // Adventure game), else falls back to a self-contained en-US/en-GB
  // speechSynthesis call so this module also works standalone.
  function speak(text) {
    if (window.GameAudio && typeof window.GameAudio.playWord === 'function') {
      window.GameAudio.playWord(text);
      return;
    }
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    var voices = window.speechSynthesis.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
    var us = voices.filter(function (v) { return /^en-US/i.test(v.lang); })[0];
    u.voice = us || voices[0] || null;
    window.speechSynthesis.speak(u);
  }

  function escapeAttr(text) { return String(text).replace(/"/g, '&quot;'); }

  function speakerButtonHtml(text) {
    return '<button type="button" class="fbstd-speaker-btn" data-fbstd-speak="' + escapeAttr(text) + '" aria-label="Listen">🔊</button>';
  }

  function wireSpeakerButtons(scope) {
    var root = scope || document;
    root.querySelectorAll('[data-fbstd-speak]').forEach(function (btn) {
      if (btn._fbstdWired) return;
      btn._fbstdWired = true;
      btn.addEventListener('click', function () { speak(btn.getAttribute('data-fbstd-speak')); });
    });
  }

  // Renders one feedback line + speaker button into `container`. Call this
  // every time a question is answered. Returns the phrase shown.
  function renderFeedback(container, isCorrect) {
    if (!container) return '';
    var phrase = isCorrect ? randomCorrectPhrase() : randomIncorrectPhrase();
    container.innerHTML =
      '<span class="fbstd-feedback ' + (isCorrect ? 'fbstd-good' : 'fbstd-bad') + '">' + phrase + '</span>' +
      speakerButtonHtml(phrase);
    wireSpeakerButtons(container);
    return phrase;
  }

  // Lightweight, dependency-free confetti burst (emoji particles + CSS
  // animation, no external library — this project has no build pipeline).
  function celebrate() {
    var burst = document.createElement('div');
    burst.className = 'fbstd-confetti-burst';
    var pieces = ['🎉', '✨', '🎊', '⭐', '🎈'];
    for (var i = 0; i < 24; i++) {
      var span = document.createElement('span');
      span.className = 'fbstd-confetti-piece';
      span.textContent = pieces[i % pieces.length];
      span.style.left = Math.random() * 100 + '%';
      span.style.animationDelay = (Math.random() * 0.4) + 's';
      span.style.fontSize = (1 + Math.random()) + 'rem';
      burst.appendChild(span);
    }
    document.body.appendChild(burst);
    setTimeout(function () { burst.remove(); }, 2600);
  }

  // Final score screen per the 3-tier standard:
  //   80-100% -> win    (You Win! / Great job! You passed! + confetti + XP/unlock hook)
  //   60-79%  -> retry  (Almost there! Try once more. + immediate retry)
  //   0-59%   -> review (Keep trying! Review and try again. + Review button)
  // `score`/`max` can be any scale (10-question quiz, 20-question Boss Quiz,
  // etc.) — internally converted to a percentage so every future module
  // gets the same tiering regardless of its total question count.
  function renderScoreResult(container, score, max, opts) {
    if (!container) return '';
    opts = opts || {};
    var pct = max > 0 ? score / max : 0;
    var tier = pct >= 0.8 ? 'win' : pct >= 0.6 ? 'retry' : 'review';

    var html;
    if (tier === 'win') {
      html =
        '<div class="fbstd-result fbstd-result-win">' +
          '<div class="fbstd-title">You Win!</div>' +
          '<div class="fbstd-sub">Great job! You passed!</div>' +
        '</div>';
    } else if (tier === 'retry') {
      html =
        '<div class="fbstd-result fbstd-result-retry">' +
          '<div class="fbstd-title">Almost there! Try once more.</div>' +
          '<button type="button" class="fbstd-btn fbstd-btn-primary" data-fbstd-action="retry">Try Again</button>' +
        '</div>';
    } else {
      html =
        '<div class="fbstd-result fbstd-result-review">' +
          '<div class="fbstd-title">Keep trying! Review and try again.</div>' +
          '<button type="button" class="fbstd-btn fbstd-btn-outline" data-fbstd-action="review">Review</button>' +
          '<button type="button" class="fbstd-btn fbstd-btn-primary" data-fbstd-action="retry">Try Again</button>' +
        '</div>';
    }
    container.innerHTML = html;

    if (tier === 'win') {
      celebrate();
      if (typeof opts.onWin === 'function') opts.onWin();
    }
    var retryBtn = container.querySelector('[data-fbstd-action="retry"]');
    if (retryBtn && typeof opts.onRetry === 'function') retryBtn.addEventListener('click', opts.onRetry);
    var reviewBtn = container.querySelector('[data-fbstd-action="review"]');
    if (reviewBtn && typeof opts.onReview === 'function') reviewBtn.addEventListener('click', opts.onReview);

    return tier;
  }

  window.FeedbackStandard = {
    CORRECT_PHRASES: CORRECT_PHRASES,
    INCORRECT_PHRASES: INCORRECT_PHRASES,
    randomCorrectPhrase: randomCorrectPhrase,
    randomIncorrectPhrase: randomIncorrectPhrase,
    renderFeedback: renderFeedback,
    renderScoreResult: renderScoreResult,
    celebrate: celebrate,
    speak: speak
  };
})();
