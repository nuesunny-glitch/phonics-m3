// Conjunction Adventure's recurring mascot — "น้องคอนนี่" (Connie the Fox).
// Shared by all 3 chapters so the same character/voice appears consistently
// on the Learn, เทคนิคการจำ, ตัวอย่าง, Mini Practice, and Boss Quiz screens.
// Scoped to this one game only (not shared across other Adventure games) —
// per user decision, only Conjunction Adventure gets a mascot for now; the
// other 4 games are untouched.
(function () {
  var MASCOT_EMOJI = '🦊';
  var MASCOT_NAME = 'น้องคอนนี่';

  function render(containerId, text) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML =
      '<div class="mascot-bubble">' +
      '<div class="mascot-avatar" aria-hidden="true">' + MASCOT_EMOJI + '</div>' +
      '<div class="mascot-speech"><b>' + MASCOT_NAME + ':</b> ' + text + '</div>' +
      '</div>';
  }

  window.Mascot = { render: render, emoji: MASCOT_EMOJI, name: MASCOT_NAME };
})();
