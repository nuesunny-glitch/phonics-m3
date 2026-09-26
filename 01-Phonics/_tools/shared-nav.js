/* Shared navigation bar for 01-Phonics: Home / Progress / Previous / Next.
   Loaded via <script src="../_tools/shared-nav.js"> on every page (including
   worksheet/answer-key). Builds the 45-page sequence at runtime from TOPICS x
   FILETYPES (single source of truth — add a topic or file type here once and
   every page picks it up, no per-page duplication). Determines the current
   page's position by reading the last two segments of location.pathname, so
   no per-page id needs to be embedded anywhere. See MASTER_TEMPLATE.md. */
(function () {
  'use strict';

  var TOPICS = [
    { folder: '01-Alphabet', title: 'ตัวอักษร A-Z' },
    { folder: '02-Consonant-Sounds', title: 'เสียงพยัญชนะเดี่ยว' },
    { folder: '03-Consonant-Digraphs', title: 'พยัญชนะควบ' },
    { folder: '04-Short-Vowels', title: 'สระเสียงสั้น' },
    { folder: '05-Long-Vowels', title: 'สระเสียงยาว' },
    { folder: '06-Vowel-Teams-1', title: 'สระผสมกลุ่ม 1' },
    { folder: '07-Vowel-Teams-2', title: 'สระผสมกลุ่ม 2' },
    { folder: '08-R-Controlled-Vowels', title: 'R-controlled Vowels' },
    { folder: '09-Blending', title: 'ผสมเสียงเป็นคำ' }
  ];

  var FILETYPES = [
    { file: 'lesson.html', label: 'บทเรียน', icon: '📖' },
    { file: 'lesson-book.html', label: 'หนังสือเรียน', icon: '📚' },
    { file: 'quiz.html', label: 'แบบทดสอบ', icon: '📝' },
    { file: 'worksheet.html', label: 'ใบงาน', icon: '✏️' },
    { file: 'answer-key.html', label: 'เฉลย', icon: '✅' }
  ];

  var PAGE_SEQUENCE = [];
  TOPICS.forEach(function (topic, ti) {
    FILETYPES.forEach(function (ft) {
      PAGE_SEQUENCE.push({
        path: topic.folder + '/' + ft.file,
        topicIndex: ti + 1,
        topicTitle: topic.title,
        fileLabel: ft.label,
        fileIcon: ft.icon
      });
    });
  });

  function currentIndex() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return -1;
    var key = decodeURIComponent(parts[parts.length - 2]) + '/' + decodeURIComponent(parts[parts.length - 1]);
    for (var i = 0; i < PAGE_SEQUENCE.length; i++) {
      if (PAGE_SEQUENCE[i].path === key) return i;
    }
    return -1;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildNavBar() {
    var idx = currentIndex();
    if (idx === -1) return; // unrecognized page (e.g. opened outside the topic folders) — skip nav

    document.body.classList.add('has-navbar');

    var total = PAGE_SEQUENCE.length;
    var pct = Math.round(((idx + 1) / total) * 100);
    var cur = PAGE_SEQUENCE[idx];
    var prevIdx = idx - 1;
    var nextIdx = idx + 1;
    var prevHref = prevIdx >= 0 ? '../' + PAGE_SEQUENCE[prevIdx].path : null;
    var nextHref = nextIdx < total ? '../' + PAGE_SEQUENCE[nextIdx].path : null;

    var bar = document.createElement('div');
    bar.className = 'phonics-navbar';
    bar.innerHTML =
      '<a class="nav-btn" href="../../home.html" title="กลับหน้าหลัก (Dashboard)">🏡 <span class="nav-btn-label">Dashboard</span></a>' +
      '<a class="nav-btn" href="../../index.html" title="กลับหน้าหลักเว็บไซต์">🏠 <span class="nav-btn-label">หน้าหลัก</span></a>' +
      (prevHref
        ? '<a class="nav-btn" href="' + prevHref + '">⬅️ <span class="nav-btn-label">ก่อนหน้า</span></a>'
        : '<span class="nav-btn disabled">⬅️ <span class="nav-btn-label">ก่อนหน้า</span></span>') +
      '<div class="nav-progress">' +
        '<div class="nav-progress-track"><div class="nav-progress-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="nav-progress-text">หัวข้อที่ ' + cur.topicIndex + '/9 &middot; ' + esc(cur.topicTitle) +
          ' &mdash; ' + cur.fileIcon + ' ' + esc(cur.fileLabel) +
          ' &middot; หน้า ' + (idx + 1) + '/' + total + ' (' + pct + '%)</div>' +
      '</div>' +
      (nextHref
        ? '<a class="nav-btn" href="' + nextHref + '">➡️ <span class="nav-btn-label">ถัดไป</span></a>'
        : '<span class="nav-btn disabled">➡️ <span class="nav-btn-label">ถัดไป</span></span>');

    document.body.insertBefore(bar, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNavBar);
  } else {
    buildNavBar();
  }

  window.PhonicsNav = { PAGE_SEQUENCE: PAGE_SEQUENCE, TOPICS: TOPICS, FILETYPES: FILETYPES };
})();
