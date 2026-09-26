// Shared bottom tab bar for the 5 "logged in" pages (not shown on
// Landing/Login, which are pre-auth). Self-locating like
// 01-Phonics/_tools/shared-nav.js — reads the current filename from
// location.pathname so no per-page config is needed.
(function () {
  var TABS = [
    { file: 'dashboard.html', icon: '🏠', label: 'หน้าหลัก' },
    { file: 'learning-map.html', icon: '🗺️', label: 'แผนที่' },
    { file: 'course-library.html', icon: '📚', label: 'คลัง' },
    { file: 'achievements.html', icon: '🏆', label: 'รางวัล' },
    { file: 'profile.html', icon: '👤', label: 'โปรไฟล์' }
  ];

  function currentFile() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] || '');
  }

  function render() {
    var mount = document.getElementById('bottomNav');
    if (!mount) return;
    var here = currentFile();
    var nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.setAttribute('aria-label', 'เมนูหลัก');
    TABS.forEach(function (tab) {
      var a = document.createElement('a');
      a.href = tab.file;
      if (tab.file === here) a.classList.add('active');
      a.innerHTML = '<span class="icon" aria-hidden="true">' + tab.icon + '</span><span>' + tab.label + '</span>';
      nav.appendChild(a);
    });
    mount.replaceWith(nav);
  }

  document.addEventListener('DOMContentLoaded', render);
})();
