// Shared platform mascot for Phase 2 — "น้องปัน" (Pan the Panda) 🐼.
// Deliberately a different character from Connie the Fox (scoped only to
// 20-Conjunction-Adventure) — Pan represents the whole learning platform
// across all 8 UI prototype pages, appearing consistently via this one
// renderer so the look/voice never drifts page to page.
(function () {
  var MASCOT_EMOJI = '🐼';
  var MASCOT_NAME = 'น้องปัน';

  function renderBubble(containerId, text) {
    var el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML =
      '<div class="mascot-row">' +
      '<div class="mascot-avatar" aria-hidden="true">' + MASCOT_EMOJI + '</div>' +
      '<div class="mascot-bubble"><b>' + MASCOT_NAME + ':</b> ' + text + '</div>' +
      '</div>';
  }

  window.Mascot = { renderBubble: renderBubble, emoji: MASCOT_EMOJI, name: MASCOT_NAME };
})();
