// Shared drag-and-drop component — Pointer Events API (not native HTML5
// Drag-and-Drop, which has notoriously poor touch support on mobile
// browsers). One implementation, reused by both Mini Practice's "drag &
// drop" question type and Game 2 ("Drag the word"), per this project's
// reuse-components convention.
//
// Usage: DragDrop.enable(containerEl, onDrop) where containerEl holds one
// or more `.drag-chip` elements and one or more `.drop-zone` elements.
// onDrop(chipEl, zoneEl) fires when a chip is released over an empty zone;
// the caller decides correct/wrong and updates classes/state.
(function () {
  function enable(container, onDrop) {
    var chips = container.querySelectorAll('.drag-chip');
    Array.prototype.forEach.call(chips, function (chip) {
      var startX = 0, startY = 0, dx = 0, dy = 0, dragging = false;

      chip.addEventListener('pointerdown', function (e) {
        if (chip.classList.contains('placed')) return;
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        chip.setPointerCapture(e.pointerId);
        chip.classList.add('dragging');
      });

      chip.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        dx = e.clientX - startX; dy = e.clientY - startY;
        chip.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';

        chip.style.pointerEvents = 'none';
        var under = document.elementFromPoint(e.clientX, e.clientY);
        chip.style.pointerEvents = '';
        var zones = container.querySelectorAll('.drop-zone');
        Array.prototype.forEach.call(zones, function (z) { z.classList.remove('over'); });
        var zone = under ? under.closest('.drop-zone') : null;
        if (zone && !zone.classList.contains('filled')) zone.classList.add('over');
      });

      chip.addEventListener('pointerup', function (e) {
        if (!dragging) return;
        dragging = false;
        chip.classList.remove('dragging');

        chip.style.pointerEvents = 'none';
        var under = document.elementFromPoint(e.clientX, e.clientY);
        chip.style.pointerEvents = '';
        var zones = container.querySelectorAll('.drop-zone');
        Array.prototype.forEach.call(zones, function (z) { z.classList.remove('over'); });
        var zone = under ? under.closest('.drop-zone') : null;

        if (zone && !zone.classList.contains('filled')) {
          chip.style.transform = '';
          chip.classList.add('placed');
          onDrop(chip, zone);
        } else {
          chip.style.transform = '';
        }
      });

      chip.addEventListener('pointercancel', function () {
        dragging = false;
        chip.classList.remove('dragging');
        chip.style.transform = '';
      });
    });
  }

  window.DragDrop = { enable: enable };
})();
