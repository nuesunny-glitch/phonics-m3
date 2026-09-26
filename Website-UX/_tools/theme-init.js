// Applies saved dark/light preference immediately (before paint) so there's
// no flash of the wrong theme when navigating between pages. Reuses the
// SAME localStorage key ('course-theme') as the main course site
// (tools/script.template.js) so a dark-mode choice made in either place
// stays consistent across the whole project. Must be loaded in <head>,
// synchronously, before body renders.
(function () {
  var THEME_KEY = 'course-theme';
  var saved = localStorage.getItem(THEME_KEY);
  var theme = saved === 'dark' || saved === 'light'
    ? saved
    : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  window.ThemeToggle = {
    get: function () { return document.documentElement.getAttribute('data-theme'); },
    set: function (t) {
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem(THEME_KEY, t);
    },
    toggle: function () {
      var next = window.ThemeToggle.get() === 'dark' ? 'light' : 'dark';
      window.ThemeToggle.set(next);
      return next;
    }
  };
})();
