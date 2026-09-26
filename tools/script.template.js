/* ===================================================================
   English M.3 Course — บทเรียนออนไลน์ (หลักสูตรเต็ม 15 บท)
   script.js: ข้อมูลหลักสูตร + ตัวแปลง Markdown → HTML + ตรรกะหน้าเว็บ
   =================================================================== */

/*__COURSE_DATA__*/

/* -------------------------------------------------------------------
   ตัวแปลง Markdown -> HTML แบบง่าย (รองรับเฉพาะรูปแบบที่ใช้ในบทเรียนนี้:
   หัวข้อ #/##/###, **ตัวหนา**, ตาราง, blockquote >, เส้นคั่น ---,
   ลิสต์แบบตัวเลขและบูลเลต รวมถึงลิสต์ย่อยแบบเยื้องบรรทัด)
   ------------------------------------------------------------------- */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inlineMd(text) {
  let t = escapeHtml(text);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return t;
}

function isTableSeparator(row) {
  return /^[\s|:-]+$/.test(row) && row.includes('-');
}

function parseTableRow(row) {
  return row
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim());
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  const n = lines.length;
  let i = 0;

  while (i < n) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      out.push(`<h${level} class="md-h${level}">${inlineMd(hMatch[2].trim())}</h${level}>`);
      i++;
      continue;
    }

    if (/^-{3,}$/.test(line.trim())) {
      out.push('<hr>');
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < n && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote><p>${inlineMd(buf.join(' '))}</p></blockquote>`);
      continue;
    }

    if (/^\|/.test(line.trim())) {
      const rows = [];
      while (i < n && /^\|/.test(lines[i].trim())) {
        rows.push(lines[i].trim());
        i++;
      }
      if (rows.length >= 2 && isTableSeparator(rows[1])) {
        const header = parseTableRow(rows[0]);
        const body = rows.slice(2).map(parseTableRow);
        let t = '<div class="table-wrap"><table><thead><tr>';
        header.forEach((h) => (t += `<th>${inlineMd(h)}</th>`));
        t += '</tr></thead><tbody>';
        body.forEach((r) => {
          t += '<tr>';
          r.forEach((c) => (t += `<td>${inlineMd(c)}</td>`));
          t += '</tr>';
        });
        t += '</tbody></table></div>';
        out.push(t);
      } else {
        rows.forEach((r) => out.push(`<p>${inlineMd(r)}</p>`));
      }
      continue;
    }

    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      const items = [];
      let current = olMatch[2];
      i++;
      while (i < n) {
        const l = lines[i];
        if (l.trim() === '') break;
        const nextOl = l.match(/^(\d+)\.\s+(.*)$/);
        if (nextOl) {
          items.push(current);
          current = nextOl[2];
          i++;
          continue;
        }
        if (/^\s+/.test(l)) {
          const trimmed = l.trim();
          if (/^[-*]\s+/.test(trimmed)) {
            current += '<br>• ' + trimmed.replace(/^[-*]\s+/, '');
          } else {
            current += ' ' + trimmed;
          }
          i++;
          continue;
        }
        break;
      }
      items.push(current);
      out.push('<ol>' + items.map((it) => `<li>${inlineMd(it)}</li>`).join('') + '</ol>');
      continue;
    }

    const ulMatch = line.match(/^[-*]\s+(.*)$/);
    if (ulMatch) {
      const items = [];
      let current = ulMatch[1];
      i++;
      while (i < n) {
        const l = lines[i];
        if (l.trim() === '') break;
        const nextUl = l.match(/^[-*]\s+(.*)$/);
        if (nextUl) {
          items.push(current);
          current = nextUl[1];
          i++;
          continue;
        }
        if (/^\s+/.test(l)) {
          current += ' ' + l.trim();
          i++;
          continue;
        }
        break;
      }
      items.push(current);
      out.push('<ul>' + items.map((it) => `<li>${inlineMd(it)}</li>`).join('') + '</ul>');
      continue;
    }

    {
      const buf = [line.trim()];
      i++;
      while (
        i < n &&
        lines[i].trim() !== '' &&
        !/^#{1,6}\s+/.test(lines[i]) &&
        !/^-{3,}$/.test(lines[i].trim()) &&
        !/^>\s?/.test(lines[i]) &&
        !/^\|/.test(lines[i].trim()) &&
        !/^\d+\.\s+/.test(lines[i]) &&
        !/^[-*]\s+/.test(lines[i])
      ) {
        buf.push(lines[i].trim());
        i++;
      }
      out.push(`<p>${inlineMd(buf.join(' '))}</p>`);
    }
  }

  return out.join('\n');
}

/* -------------------------------------------------------------------
   ตรรกะหน้าเว็บ: เมนูแบบ accordion (บท > หัวข้อย่อย), Previous/Next
   ข้ามบทได้ทั้งหลักสูตร, เมนูมือถือ, Dark Mode, Progress Bar, Animation
   ------------------------------------------------------------------- */
(function () {
  /* Flatten COURSE (chapters > topics) into a single ordered PAGES list */
  const PAGES = [];
  COURSE.forEach((ch, chIdx) => {
    ch.topics.forEach((t, tIdx) => {
      PAGES.push({
        chapterIdx: chIdx,
        topicIdx: tIdx,
        chapterId: ch.id,
        chapterTitle: ch.title,
        chapterIcon: ch.icon,
        isMultiTopic: ch.topics.length > 1,
        topicId: t.id,
        icon: t.icon,
        title: t.title,
        body: t.body,
      });
    });
  });

  const lessonListEl = document.getElementById('lessonList');
  const contentEl = document.getElementById('content');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressEl = document.getElementById('progress');
  const progressBarFillEl = document.getElementById('progressBarFill');
  const sidebarEl = document.getElementById('sidebar');
  const overlayEl = document.getElementById('overlay');
  const menuToggleBtn = document.getElementById('menuToggle');
  const closeSidebarBtn = document.getElementById('closeSidebar');
  const themeToggleBtn = document.getElementById('themeToggle');
  const yearEl = document.getElementById('year');
  const subtitleEl = document.getElementById('brandSubtitle');

  const THEME_KEY = 'course-theme';
  let currentPage = 0;

  /* ---------------- Dark Mode ---------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeToggleBtn) {
      themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'
      );
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
      return;
    }
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------------- Sidebar (accordion: chapter > topics) ---------------- */
  function pageIndexFor(chIdx, tIdx) {
    return PAGES.findIndex((p) => p.chapterIdx === chIdx && p.topicIdx === tIdx);
  }

  function buildSidebar() {
    lessonListEl.innerHTML = '';
    COURSE.forEach((ch, chIdx) => {
      const li = document.createElement('li');
      li.className = 'chapter-group';
      li.dataset.chapterIdx = String(chIdx);

      const header = document.createElement('button');
      header.type = 'button';
      header.className = 'chapter-header';
      const multi = ch.topics.length > 1;
      header.innerHTML =
        `<span class="lesson-num">${ch.icon}</span>` +
        `<span class="lesson-label">บทที่ ${ch.id}<br><small>${ch.title}</small></span>` +
        (multi ? `<span class="chevron">▾</span>` : '');

      if (multi) {
        header.addEventListener('click', () => {
          li.classList.toggle('expanded');
        });
      } else {
        header.addEventListener('click', () => {
          selectPage(pageIndexFor(chIdx, 0));
          closeSidebar();
        });
      }
      li.appendChild(header);

      if (multi) {
        const topicList = document.createElement('ul');
        topicList.className = 'topic-list';
        ch.topics.forEach((t, tIdx) => {
          const tLi = document.createElement('li');
          const tBtn = document.createElement('button');
          tBtn.type = 'button';
          tBtn.className = 'topic-link';
          tBtn.dataset.page = String(pageIndexFor(chIdx, tIdx));
          tBtn.innerHTML = `<span class="topic-icon">${t.icon}</span><span>${t.title}</span>`;
          tBtn.addEventListener('click', () => {
            selectPage(pageIndexFor(chIdx, tIdx));
            closeSidebar();
          });
          tLi.appendChild(tBtn);
          topicList.appendChild(tLi);
        });
        li.appendChild(topicList);
      }

      lessonListEl.appendChild(li);
    });
  }

  /* ---------------- Render page (with enter animation) ---------------- */
  function renderPage(idx) {
    const page = PAGES[idx];
    const badge = page.isMultiTopic
      ? `บทที่ ${page.chapterId}: ${escapeHtml(page.chapterTitle)} · หัวข้อที่ ${page.topicId}/${
          COURSE[page.chapterIdx].topics.length
        }`
      : `บทที่ ${page.chapterId} / ${COURSE.length}`;

    contentEl.innerHTML =
      `<div class="lesson-fade">` +
      `<div class="lesson-header">
         <span class="lesson-badge">${badge}</span>
         <h1>${page.icon} ${escapeHtml(page.title)}</h1>
       </div>` +
      `<div class="lesson-body">${mdToHtml(page.body)}</div>` +
      `</div>`;
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (subtitleEl) {
      subtitleEl.textContent = page.isMultiTopic
        ? `บทที่ ${page.chapterId} · ${page.chapterTitle} (${page.topicId}/${
            COURSE[page.chapterIdx].topics.length
          })`
        : `บทที่ ${page.chapterId} · ${page.chapterTitle}`;
    }
  }

  function updateActiveNav() {
    const page = PAGES[currentPage];

    lessonListEl.querySelectorAll('.chapter-group').forEach((group, chIdx) => {
      group.classList.toggle('current', chIdx === page.chapterIdx);
      if (chIdx === page.chapterIdx) group.classList.add('expanded');
    });

    lessonListEl.querySelectorAll('.topic-link').forEach((btn) => {
      const pageIdx = Number(btn.dataset.page);
      btn.classList.toggle('active', pageIdx === currentPage);
      if (pageIdx === currentPage) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    lessonListEl.querySelectorAll('.chapter-header').forEach((header, chIdx) => {
      const chapter = COURSE[chIdx];
      const isSingle = chapter.topics.length === 1;
      const isActive = isSingle && chIdx === page.chapterIdx;
      header.classList.toggle('active', isActive);
    });
  }

  function updateNavButtons() {
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === PAGES.length - 1;
    progressEl.textContent = `${currentPage + 1} / ${PAGES.length}`;
  }

  /* ---------------- Progress bar (overall course progress) ---------------- */
  function updateProgressBar() {
    const pct = ((currentPage + 1) / PAGES.length) * 100;
    if (progressBarFillEl) {
      progressBarFillEl.style.width = pct + '%';
    }
  }

  function selectPage(idx, updateHash = true) {
    if (idx < 0 || idx >= PAGES.length) return;
    currentPage = idx;
    renderPage(idx);
    updateActiveNav();
    updateNavButtons();
    updateProgressBar();
    if (updateHash) {
      const page = PAGES[idx];
      history.replaceState(null, '', `#c${page.chapterId}-${page.topicId}`);
    }
  }

  /* ---------------- Mobile sidebar (with animated hamburger) ---------------- */
  function openSidebar() {
    sidebarEl.classList.add('open');
    overlayEl.classList.add('open');
    menuToggleBtn.classList.add('active');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebarEl.classList.remove('open');
    overlayEl.classList.remove('open');
    menuToggleBtn.classList.remove('active');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }

  function indexFromHash() {
    const m = location.hash.match(/^#c(\d+)-(\d+)$/);
    if (!m) return 0;
    const chapterId = parseInt(m[1], 10);
    const topicId = parseInt(m[2], 10);
    const idx = PAGES.findIndex((p) => p.chapterId === chapterId && p.topicId === topicId);
    return idx >= 0 ? idx : 0;
  }

  menuToggleBtn.addEventListener('click', () => {
    if (sidebarEl.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
  closeSidebarBtn.addEventListener('click', closeSidebar);
  overlayEl.addEventListener('click', closeSidebar);

  prevBtn.addEventListener('click', () => selectPage(currentPage - 1));
  nextBtn.addEventListener('click', () => selectPage(currentPage + 1));

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft') selectPage(currentPage - 1);
    if (e.key === 'ArrowRight') selectPage(currentPage + 1);
  });

  window.addEventListener('hashchange', () => {
    selectPage(indexFromHash(), false);
  });

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  initTheme();
  buildSidebar();
  selectPage(indexFromHash(), false);
  if (!location.hash) {
    const first = PAGES[0];
    history.replaceState(null, '', `#c${first.chapterId}-${first.topicId}`);
  }
})();
