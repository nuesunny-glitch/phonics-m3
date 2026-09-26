// Present Continuous Adventure's mascot — "น้องคอนนี่" (Connie the Fox) 🦊.
// Same character as Present Simple Adventure's (this game's spec explicitly
// asks to reuse Connie), kept as its own standalone file per this
// project's established one-mascot-file-per-game convention — not
// cross-linked.
(function () {
  var MASCOT_EMOJI = '🦊';
  var MASCOT_NAME = 'น้องคอนนี่';

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
