/*
 * Shared rendering pieces (CSS + markup builders) used by both generate.js
 * (builds the single combined index.html for on-screen viewing) and
 * generate-pdf.js (builds small per-chunk HTML files for printing, to work
 * around a headless-Edge print-to-pdf bug where any single print job
 * requiring more than ~8 pages silently truncates its own output).
 *
 * This is the Long Vowels counterpart of 01-Short-Vowels/render-shared.js —
 * same design system (typography, colors, table layout, cover, footer),
 * only the vowel-group data and the letter-highlighting logic differ (long
 * vowels are digraphs/silent-e patterns, e.g. "ai", "ow", "igh", "oo", not a
 * single letter, so highlighting matches each word's own phonics pattern).
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('../../03-Grammar/_tools/shared.css.js');

const GROUPS = [
  { id: 'a', label: 'Long A', thai: 'สระเสียงยาว A (เอ)', color: 'c1', file: 'data-long-a.json', vowel: 'a' },
  { id: 'e', label: 'Long E', thai: 'สระเสียงยาว E (อี)', color: 'c2', file: 'data-long-e.json', vowel: 'e' },
  { id: 'i', label: 'Long I', thai: 'สระเสียงยาว I (ไอ)', color: 'c3', file: 'data-long-i.json', vowel: 'i' },
  { id: 'o', label: 'Long O', thai: 'สระเสียงยาว O (โอ)', color: 'c4', file: 'data-long-o.json', vowel: 'o' },
  { id: 'u', label: 'Long U', thai: 'สระเสียงยาว U (อู)', color: 'c5', file: 'data-long-u.json', vowel: 'u' },
];

const CHAPTER_NAME = '02-Long-Vowels Phonics Word Bank';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* Highlight the grapheme that spells the long-vowel sound. Long vowels are
   digraphs / silent-e patterns rather than a single letter, so we prefer
   matching the word's own `pattern` field (e.g. "-ake", "-ai", "-igh") as a
   literal substring of the word. Irregular padding words carry a generic
   label like "CVC+CV" that isn't a literal substring — for those we fall
   back to highlighting the first occurrence of the group's core vowel
   letter, same as 01-Short-Vowels did for its own irregular words. */
function highlightVowel(word, vowel, pattern) {
  const target = String(pattern || '').replace(/^-/, '');
  const lower = word.toLowerCase();
  if (target && target.length >= 1) {
    const idx = lower.indexOf(target.toLowerCase());
    if (idx !== -1) {
      const before = esc(word.slice(0, idx));
      const hl = esc(word.slice(idx, idx + target.length));
      const after = esc(word.slice(idx + target.length));
      return `${before}<span class="vowel-hl">${hl}</span>${after}`;
    }
  }
  const idx = lower.indexOf(vowel.toLowerCase());
  if (idx === -1) return esc(word);
  const before = esc(word.slice(0, idx));
  const hl = esc(word.slice(idx, idx + 1));
  const after = esc(word.slice(idx + 1));
  return `${before}<span class="vowel-hl">${hl}</span>${after}`;
}

function loadGroupWords(group) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, group.file), 'utf8'));
}

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@700;800;900&family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const PAGE_CSS = `
:root {
  --font-en: 'Inter', 'Noto Sans Thai', sans-serif;
  --font-title: 'Nunito', 'Noto Sans Thai', sans-serif;
}
* { box-sizing: border-box; }
html, body { font-family: var(--font-en); font-size: 18px; line-height: 1.75; color: #24304a; }

@page { size: A4; margin: 16mm 12mm; }

/* ---------- COVER ---------- */
.cover-page {
  min-height: 235mm;
  background: linear-gradient(160deg, #FF5D5D 0%, #FFA800 22%, #21C38D 48%, #2F9BFF 72%, #9B5DE5 100%);
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28mm 18mm;
  position: relative;
  overflow: hidden;
}
.cover-kicker { font-size: 16px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; opacity: 0.92; margin-bottom: 6px; }
.cover-title-en { font-family: var(--font-title); font-weight: 900; font-size: 68px; margin: 0; line-height: 1.05; text-shadow: 0 6px 16px rgba(0,0,0,0.28); }
.cover-title-th { font-family: var(--font-title); font-size: 27px; font-weight: 800; margin-top: 14px; }
.cover-subtitle { font-size: 19px; font-weight: 600; margin-top: 10px; opacity: 0.97; font-style: italic; }
.cover-desc { font-size: 15.5px; font-weight: 500; margin-top: 18px; opacity: 0.95; max-width: 130mm; line-height: 1.6; }
.cover-stats { margin-top: 30px; display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.cover-stat { background: rgba(255,255,255,0.97); color:#24304a; border-radius: 18px; padding: 12px 22px; font-weight: 800; font-size: 15.5px; box-shadow: 0 6px 16px rgba(0,0,0,0.18); }
.cover-credit { margin-top: 28px; font-size: 14px; font-weight: 600; background: rgba(255,255,255,0.22); padding: 7px 20px; border-radius: 999px; }

/* ---------- TABLE OF CONTENTS ---------- */
.toc-page { padding: 8mm 4mm 4mm; }
.toc-page h2 { font-family: var(--font-title); font-weight: 800; text-align:center; color:#1e2b5c; font-size: 30px; margin-bottom: 8px; }
.toc-page > p { text-align:center; color:#55607a; font-size: 17px; line-height: 1.7; max-width: 150mm; margin: 0 auto 22px; }
.toc-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 14px; margin-top: 10px; }
.toc-card { border-radius: 18px; padding: 20px 10px; text-align: center; color: #fff; font-weight: 800; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
.toc-card .tc-letter { font-family: var(--font-title); font-size: 26px; font-weight: 900; }
.toc-card .tc-thai { font-size: 14px; font-weight: 600; margin-top: 6px; line-height: 1.5; }
.toc-card .tc-count { font-size: 13px; margin-top: 10px; opacity: 0.92; }
.toc-page .tip-card { font-size: 16px; line-height: 1.7; padding: 18px 22px; margin-top: 28px; }

/* ---------- GROUP SECTION ---------- */
.group-page { page-break-before: always; padding-top: 4mm; }
.group-banner {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  border-radius: 20px; padding: 22px 28px; margin-bottom: 22px; color: #fff;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.group-banner h1 { font-family: var(--font-title); font-weight: 800; font-size: 32px; margin: 0; }
.group-banner .eng { font-size: 15px; font-weight: 600; opacity: 0.95; margin-top: 2px; }
.group-banner .chip { background: rgba(255,255,255,0.3); border-radius: 999px; padding: 8px 20px; font-size: 15px; font-weight: 800; white-space: nowrap; }
.gb-c1 { background: linear-gradient(90deg,#FF5D5D,#ff8a8a); }
.gb-c2 { background: linear-gradient(90deg,#FFA800,#ffcb66); }
.gb-c3 { background: linear-gradient(90deg,#2F9BFF,#7dc0ff); }
.gb-c4 { background: linear-gradient(90deg,#21C38D,#6be0b8); }
.gb-c5 { background: linear-gradient(90deg,#9B5DE5,#c79bf2); }

/* ---------- WORD TABLE ---------- */
.word-table { width: 100%; border-collapse: collapse; font-size: 17px; margin-bottom: 6mm; table-layout: fixed; }
.word-table col.c-num    { width: 4%; }
.word-table col.c-word   { width: 13%; }
.word-table col.c-pattern{ width: 11%; }
.word-table col.c-thai   { width: 13%; }
.word-table col.c-meaning{ width: 15%; }
.word-table col.c-en     { width: 25%; }
.word-table col.c-th     { width: 19%; }

.word-table thead th {
  background: #2952e3; color: #fff; font-family: var(--font-title); font-weight: 800;
  font-size: 22px; padding: 14px 12px; text-align: center; line-height: 1.3;
}
.word-table tbody td {
  padding: 14px 14px; border-bottom: 1px solid #e4e8f5; vertical-align: middle;
  line-height: 1.65;
}
.word-table tbody tr:nth-child(odd) td { background: #ffffff; }
.word-table tbody tr:nth-child(even) td { background: #f4f5f8; }

.word-table .num-col     { text-align: center; color: #a3abc0; font-weight: 700; font-size: 14px; }
.word-table .word-col    { text-align: center; font-weight: 800; color: #1e2b5c; font-size: 21px; letter-spacing: 0.2px; }
.word-table .pattern-col { text-align: center; color: #2952e3; font-weight: 700; font-size: 16px; }
.word-table .thai-col    { text-align: center; color: #b3261e; font-weight: 700; font-size: 17px; }
.word-table .meaning-col { text-align: center; font-size: 16.5px; }
.word-table .en-col      { text-align: left; color: #24304a; font-size: 16.5px; }
.word-table .th-col      { text-align: left; color: #5c6785; font-size: 15.5px; }

.vowel-hl { color: #e8531f; font-weight: 900; }

.continued-tag { font-size: 13px; font-weight: 700; color: #8891a8; margin: -12px 0 14px; text-align: right; }

@media print {
  .group-page { page-break-before: always; }
  thead { display: table-header-group; }
}
`;

function coverPage() {
  return `<div class="sheet cover-page" id="cover">
  <div class="cover-kicker">English M.3 · Phonics Word Bank</div>
  <h1 class="cover-title-en">Long Vowels<br>Word Bank</h1>
  <div class="cover-title-th">คลังคำศัพท์ สระเสียงยาว 5 ตัว (a, e, i, o, u)</div>
  <div class="cover-subtitle">Phonics Reading System for Thai Students</div>
  <div class="cover-desc">หนังสือเรียนภาษาอังกฤษ ม.3 · หัวข้อที่ 2: Long Vowels · เตรียมสอบเข้า ม.4</div>
  <div class="cover-stats">
    <div class="cover-stat">📚 5 กลุ่มสระ</div>
    <div class="cover-stat">🔤 500 คำศัพท์</div>
    <div class="cover-stat">🗣️ คำอ่านไทย + คำแปล</div>
    <div class="cover-stat">✏️ ตัวอย่างประโยค</div>
  </div>
  <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
</div>`;
}

function tocPage() {
  const cards = GROUPS.map((g) => `<div class="toc-card gb-${g.color}">
    <div class="tc-letter">${esc(g.label)}</div>
    <div class="tc-thai">${esc(g.thai)}</div>
    <div class="tc-count">100 คำ</div>
  </div>`).join('');
  return `<div class="sheet toc-page">
  <h2>📖 สารบัญ 5 กลุ่มสระเสียงยาว</h2>
  <p>แต่ละกลุ่มมี 100 คำศัพท์ พร้อมรูปแบบการสะกด (Phonics Pattern), คำอ่านภาษาไทย, คำแปล, และตัวอย่างประโยค</p>
  <div class="toc-grid">${cards}</div>
  <div class="tip-card">💡 <b>วิธีใช้:</b> อ่านคำในตารางออกเสียงตามคำอ่านภาษาไทยที่กำกับไว้ (เป็นการประมาณเสียง ไม่ใช่การสะกดแบบไทยแท้) แล้วลองแต่งประโยคของตัวเองโดยเลียนแบบตัวอย่างที่ให้ไว้ — ตัวอักษรสระที่ไฮไลต์สีส้มในแต่ละคำคือกลุ่มตัวอักษรที่ออกเสียงสระเสียงยาวที่กำลังฝึก</div>
</div>`;
}

function tableHead() {
  return `<thead>
      <tr><th>#</th><th>Word</th><th>Pattern</th><th>คำอ่าน</th><th>คำแปล</th><th>ตัวอย่างประโยค</th><th>คำแปลประโยค</th></tr>
    </thead>`;
}

function tableColgroup() {
  return `<colgroup>
      <col class="c-num"><col class="c-word"><col class="c-pattern"><col class="c-thai">
      <col class="c-meaning"><col class="c-en"><col class="c-th">
    </colgroup>`;
}

function rowsHtml(words, group, startIndex) {
  return words.map((w, i) => `<tr>
    <td class="num-col">${startIndex + i + 1}</td>
    <td class="word-col">${highlightVowel(w.word, group.vowel, w.pattern)}</td>
    <td class="pattern-col">${esc(w.pattern)}</td>
    <td class="thai-col">${esc(w.thai)}</td>
    <td class="meaning-col">${esc(w.meaning)}</td>
    <td class="en-col">${esc(w.en)}</td>
    <td class="th-col">${esc(w.th)}</td>
  </tr>`).join('');
}

/* Full single-page-per-group markup (used for the on-screen index.html, not for printing) */
function groupPageFull(group) {
  const words = loadGroupWords(group);
  return `<div class="sheet group-page" id="group-${group.id}">
  <div class="group-banner gb-${group.color}">
    <div><h1>🔤 ${esc(group.label)}</h1><div class="eng">${esc(group.thai)}</div></div>
    <div class="chip">100 คำ</div>
  </div>
  <table class="word-table">
    ${tableColgroup()}
    ${tableHead()}
    <tbody>
      ${rowsHtml(words, group, 0)}
    </tbody>
  </table>
</div>`;
}

/* One printable chunk (subset of a group's rows) — used by generate-pdf.js to
   stay safely under the ~8-page-per-print-job ceiling. `isFirst` controls
   whether the full group banner is shown or a "continued" tag instead. */
function groupChunkPage(group, words, startIndex, totalInGroup, isFirst) {
  const banner = isFirst
    ? `<div class="group-banner gb-${group.color}">
    <div><h1>🔤 ${esc(group.label)}</h1><div class="eng">${esc(group.thai)}</div></div>
    <div class="chip">100 คำ</div>
  </div>`
    : `<div class="group-banner gb-${group.color}">
    <div><h1>🔤 ${esc(group.label)} (ต่อ)</h1><div class="eng">${esc(group.thai)}</div></div>
    <div class="chip">${startIndex + 1}-${startIndex + words.length} / ${totalInGroup}</div>
  </div>`;
  return `<div class="sheet group-page" id="group-${group.id}-${startIndex}">
  ${banner}
  <table class="word-table">
    ${tableColgroup()}
    ${tableHead()}
    <tbody>
      ${rowsHtml(words, group, startIndex)}
    </tbody>
  </table>
</div>`;
}

function wrapDocument(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${FONT_LINK}
<style>${baseCSS}${PAGE_CSS}</style>
</head>
<body>
${bodyHtml}
</body>
</html>
`;
}

module.exports = {
  GROUPS, CHAPTER_NAME, esc, highlightVowel, loadGroupWords,
  coverPage, tocPage, groupPageFull, groupChunkPage, wrapDocument,
};
