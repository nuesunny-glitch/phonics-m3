/*
 * "Mini textbook" generator for Chapter 12: Reading.
 * Mirrors the 03-Grammar/_tools/generate-book-0X.js pattern exactly (same
 * shared.css.js, same 20-section skeleton) so this main-course chapter reads
 * as part of the same visual series as Topics 01-08. The "Grammar Rules"
 * section is adapted into 3 reading-strategy cards, and the Quiz section
 * (s14) is customized to print each reading passage once before its group
 * of questions (via data.passages + q.passageRef), unlike other chapters
 * whose quiz items are all independent one-liners.
 *
 * Usage: node generate-book-12.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-12-reading.json'), 'utf8'));
const outDir = path.join(__dirname, '..', data.folder);
const outPath = path.join(outDir, 'lesson-book.html');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700;800&family=Mali:wght@600;700;800&display=swap" rel="stylesheet">`;

const BOOK_CSS = `
/* ---- Book-only additions on top of shared.css.js ---- */
.cover-page {
  min-height: 277mm;
  background: linear-gradient(160deg, #FF5D5D 0%, #FFA800 22%, #21C38D 48%, #2F9BFF 72%, #9B5DE5 100%);
  color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 22mm 16mm;
  position: relative;
  overflow: hidden;
}
.cover-decor { font-size: 26px; letter-spacing: 14px; opacity: 0.9; margin-bottom: 6px; }
.cover-emojis { font-size: 54px; margin: 6px 0 18px; }
.cover-title-en {
  font-family: 'Mali','Kanit',sans-serif;
  font-size: 56px;
  margin: 0;
  text-shadow: 0 4px 10px rgba(0,0,0,0.25);
}
.cover-title-th { font-size: 24px; font-weight: 700; margin-top: 6px; }
.cover-subtitle { font-size: 16px; font-weight: 500; margin-top: 10px; opacity: 0.95; }
.cover-credit { font-size: 14px; margin-top: 14px; background: rgba(255,255,255,0.2); padding: 5px 16px; border-radius: 999px; }
.cover-objectives {
  margin-top: 28px;
  background: rgba(255,255,255,0.95);
  color: #2a2a3a;
  border-radius: 20px;
  padding: 18px 24px;
  max-width: 150mm;
  text-align: left;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
.cover-objectives h3 { font-family:'Mali','Kanit',sans-serif; margin: 0 0 10px; color: #1e2b5c; font-size: 19px; text-align:center; }
.cover-objectives li { margin-bottom: 8px; font-size: 14.5px; }
.cover-footer { margin-top: auto; padding-top: 26px; font-size: 13px; opacity: 0.9; }

.section-banner {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  border-radius: 18px; padding: 14px 20px; margin-bottom: 16px; color: #fff;
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.section-banner h1 { font-family:'Mali','Kanit',sans-serif; font-size: 22px; margin: 0; }
.section-banner .eng { font-size: 12.5px; font-weight: 500; opacity: 0.95; }
.section-banner .chip { background: rgba(255,255,255,0.28); border-radius: 999px; padding: 5px 14px; font-size: 12px; font-weight: 700; white-space: nowrap; }
.sb-c1 { background: linear-gradient(90deg,#FF5D5D,#ff8a8a); }
.sb-c2 { background: linear-gradient(90deg,#FFA800,#ffcb66); }
.sb-c3 { background: linear-gradient(90deg,#2F9BFF,#7dc0ff); }
.sb-c4 { background: linear-gradient(90deg,#21C38D,#6be0b8); }
.sb-c5 { background: linear-gradient(90deg,#9B5DE5,#c79bf2); }
.sb-c6 { background: linear-gradient(90deg,#FF5FA2,#ff9ec8); }
.sb-teacher { background: linear-gradient(90deg,#b3261e,#ff5d5d); }

.meaning-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 16px 0; }
.meaning-box { border-radius: 16px; padding: 14px; text-align: center; }
.meaning-box .word { font-size: 26px; font-weight: 800; margin-bottom: 4px; }
.meaning-box .ex { font-size: 13.5px; margin-top: 8px; background: rgba(255,255,255,0.7); border-radius: 10px; padding: 6px 8px; }
.mb1 { background: #FFE1E1; color: #b3261e; }
.mb2 { background: #DCEEFF; color: #10508f; }
.mb3 { background: #D9F7EC; color: #0d7a53; }

.step-card { border-radius: 18px; padding: 16px 18px; margin: 14px 0; border: 3px solid var(--accent); }
.step-card .step-label { display:inline-block; background: var(--accent); color:#fff; font-weight:800; font-size: 13px; padding: 3px 12px; border-radius: 999px; margin-bottom: 8px; }
.step-card.sc1 { --accent:#FF5D5D; background:#FFF3F3; }
.step-card.sc2 { --accent:#2F9BFF; background:#F1F8FF; }
.step-card.sc3 { --accent:#21C38D; background:#F0FBF7; }
.step-card.sc4 { --accent:#9B5DE5; background:#F8F3FE; }
.step-card ul { margin: 6px 0 0; padding-left: 20px; }

.flash-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin: 12px 0; }
.flash-card { border-radius: 14px; padding: 12px 8px; text-align:center; background: #f5f7fd; border: 2px dashed #c7cfe8; }
.flash-card .fe { font-size: 34px; }
.flash-card .fw { font-weight: 700; font-size: 14px; margin-top: 4px; }
.flash-card .ft { font-size: 12.5px; color: #55607a; }

.pattern-box { border-radius: 16px; padding: 14px 18px; margin: 12px 0; background: #f5f7fd; border-left: 6px solid var(--accent); }
.pattern-box .formula { font-family:'Mali','Kanit',sans-serif; font-size: 16px; font-weight: 700; color: var(--accent); }
.pattern-box .pex { font-size: 14px; margin-top: 6px; }
.pattern-box .pex .th { color: #667; font-size: 12.5px; }

.dialogue-wrap { margin: 14px 0 22px; }
.dialogue-title { font-weight: 700; color: #1e2b5c; margin-bottom: 8px; font-size: 15px; }
.bubble { max-width: 78%; padding: 9px 14px; border-radius: 16px; margin: 6px 0; font-size: 14.5px; }
.bubble .th { font-size: 12.5px; color: #667; margin-top: 2px; }
.bubble.left { background: #DCEEFF; border-bottom-left-radius: 4px; margin-right: auto; }
.bubble.right { background: #FFE1E1; border-bottom-right-radius: 4px; margin-left: auto; text-align: right; }
.speaker { font-weight: 700; font-size: 12.5px; color: #445; margin-bottom: 2px; }

.mistake-card { border-radius: 14px; padding: 12px 16px; margin: 10px 0; background: #fff; border: 2px solid #f0d0d0; }
.mistake-card .wrong { color: #b3261e; font-weight: 700; }
.mistake-card .right { color: #0d7a53; font-weight: 700; }
.mistake-card .why { font-size: 13.5px; color: #55607a; margin: 4px 0; }

.tip-checklist { list-style: none; padding: 0; margin: 12px 0; }
.tip-checklist li { display:flex; gap:10px; align-items:flex-start; background:#FFF8E1; border:2px solid #FFD54F; border-radius:12px; padding:10px 14px; margin-bottom:8px; font-size:14px; }
.tip-checklist .num { background:#FFA800; color:#fff; font-weight:800; border-radius:50%; width:26px; height:26px; min-width:26px; display:flex; align-items:center; justify-content:center; font-size:13px; }

.mindmap-wrap { display:flex; flex-direction:column; align-items:center; margin: 18px 0; }
.mindmap-center { background: linear-gradient(90deg,#FF5D5D,#9B5DE5); color:#fff; font-family:'Mali','Kanit',sans-serif; font-size:20px; font-weight:800; border-radius:999px; padding:14px 30px; box-shadow:0 6px 16px rgba(0,0,0,0.2); }
.mindmap-branches { display:grid; grid-template-columns: repeat(2,1fr); gap:12px; margin-top:18px; width:100%; }
.mindmap-branch { border-radius:14px; padding:12px 14px; color:#fff; font-size:13.5px; }
.mindmap-branch .bt { font-weight:800; font-size:14.5px; display:block; margin-bottom:4px; }
.mb-a { background:#FF5D5D; } .mb-b { background:#FFA800; } .mb-c { background:#2F9BFF; }
.mb-d { background:#21C38D; } .mb-e { background:#9B5DE5; } .mb-f { background:#FF5FA2; }

.cheat-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.cheat-box { background:#f5f7fd; border-radius:14px; padding:12px 14px; border:2px solid #dbe2f5; }
.cheat-box h4 { margin:0 0 8px; font-size:14px; color:#1e2b5c; font-family:'Mali','Kanit',sans-serif; }
.cheat-box table { width:100%; border-collapse: collapse; font-size:12.5px; }
.cheat-box td, .cheat-box th { border:1px solid #d8dce8; padding:4px 6px; }
.cheat-box ul { margin:0; padding-left:18px; font-size:12.5px; }
.cheat-box li { margin-bottom:4px; }

.teacher-note-box { background:#FFF3F3; border:2px dashed #b3261e; border-radius:14px; padding:12px 16px; margin-bottom:12px; }
.teacher-note-box h4 { margin:0 0 6px; color:#b3261e; font-size:14.5px; }
.teacher-note-box ul { margin:0; padding-left:20px; font-size:13.5px; }
.teacher-note-box li { margin-bottom:4px; }

.homework-card { background:#F0FBF7; border:2px solid #21C38D; border-radius:14px; padding:12px 16px; margin-bottom:10px; font-size:14px; }
.homework-card .hnum { color:#0d7a53; font-weight:800; }

.motivation-poster {
  text-align:center; padding: 30px 20px; border-radius:20px;
  background: linear-gradient(135deg,#9B5DE5,#FF5FA2);
  color:#fff; margin-top: 30px;
}
.motivation-poster .quote { font-family:'Mali','Kanit',sans-serif; font-size:22px; font-weight:800; line-height:1.5; }
.motivation-poster .sub { margin-top:10px; font-size:14px; opacity:0.95; }

.sunee-poster {
  background: linear-gradient(135deg,#FFD54F,#FF9800);
  border-radius: 22px; padding: 22px 24px; color:#3a2a00;
}
.sunee-poster .avatar { font-size:44px; }
.sunee-poster h2 { font-family:'Mali','Kanit',sans-serif; font-size:24px; margin:6px 0 14px; }
.sunee-poster .line { background:rgba(255,255,255,0.55); border-radius:12px; padding:9px 14px; margin-bottom:8px; font-size:14.5px; }
.sunee-poster .signoff { text-align:center; font-weight:800; font-size:16px; margin-top:14px; }
`;

function banner(cls, icon, thTitle, engSub, chip) {
  return `<div class="section-banner ${cls}">
    <div><h1>${icon} ${esc(thTitle)}</h1><div class="eng">${esc(engSub)}</div></div>
    <div class="chip">${esc(chip)}</div>
  </div>`;
}

/* ---------- SECTION 1: COVER ---------- */
function sCover() {
  const objs = data.objectives.map((o) => `<li>${esc(o)}</li>`).join('');
  return `<div class="sheet cover-page" id="s1">
    <div class="cover-decor">🌟 ⭐ 🎈 ✨ 🌈 ⭐ 🌟</div>
    <div class="cover-emojis">📖 🔍 🕵️ 🧩 ✨</div>
    <h1 class="cover-title-en">Reading</h1>
    <div class="cover-title-th">การอ่านจับใจความ (Reading Comprehension)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 บทที่ 12 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Chapter 12 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHY LEARN READING STRATEGIES ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  <div class="section-banner sb-c1">
    <div><h1>📖 ทำไมต้องมีกลยุทธ์การอ่าน?</h1><div class="eng">Why Reading Strategies?</div></div>
    <div class="chip">ส่วนที่ 2</div>
  </div>
  <p style="font-size:15px;line-height:1.7;">การอ่านจับใจความ (Reading Comprehension) เป็นทักษะที่รวมทุกอย่างที่เรียนมาเข้าด้วยกัน (Phonics, คำศัพท์, แกรมม่า) ข้อสอบเข้า ม.4 มักให้อ่านย่อหน้าสั้น ๆ แล้วตอบคำถาม 4-5 ข้อ บทนี้สอนกลยุทธ์การอ่านและประเภทคำถามที่พบบ่อย ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">Skimming</div>อ่านคร่าว ๆ<div class="ex">หาใจความหลักของย่อหน้า<br>(ไม่ต้องอ่านทุกคำ)</div></div>
    <div class="meaning-box mb2"><div class="word">Scanning</div>อ่านหาข้อมูล<div class="ex">กวาดสายตาหาคำ/ตัวเลข<br>ที่ต้องการเจาะจง</div></div>
    <div class="meaning-box mb3"><div class="word">Guessing</div>เดาความหมาย<div class="ex">ดูบริบทรอบคำศัพท์<br>ที่ไม่รู้จัก</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่าแต่ละกลยุทธ์ใช้ในสถานการณ์ต่างกัน — นี่คือเหตุผลที่ต้องรู้ "จะอ่านแบบไหน" ก่อนเริ่มอ่านจริง ไม่ใช่อ่านทุกคำแบบเดียวกันทุกครั้ง</p>
  <div class="explain-block">
    <h2>🧩 5 ประเภทคำถามที่พบบ่อยในข้อสอบ</h2>
    <table>
      <tr><th>ประเภทคำถาม</th><th>ตัวอย่างคำถาม</th><th>วิธีตอบ</th></tr>
      <tr><td>Main Idea</td><td>What is the passage mainly about?</td><td>อ่านประโยคแรก/สุดท้าย</td></tr>
      <tr><td>Detail</td><td>What time does the shop open?</td><td>ใช้ Scanning หาคำตอบตรง</td></tr>
      <tr><td>Vocabulary in Context</td><td>The word "huge"...closest in meaning?</td><td>ดูประโยครอบคำนั้น</td></tr>
      <tr><td>Inference</td><td>What can we infer...?</td><td>คิดต่อจากข้อมูลที่ให้มา</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างย่อหน้าฝึกอ่าน</h2>
    <table>
      <tr><th>ย่อหน้าตัวอย่าง</th><th>คำถามตัวอย่าง</th></tr>
      <tr><td>Malee is a student who wakes up at six every morning and likes English because her teacher is kind.</td><td>What time does Malee wake up? → Six o'clock</td></tr>
      <tr><td>Milo is a small, brown dog. He is very friendly.</td><td>The word "He" refers to...? → Milo (the dog)</td></tr>
    </table>
  </div>
</div>`;
}

/* ---------- SECTION 3: READING STRATEGIES STEP BY STEP (adapted from Grammar Rules) ---------- */
function s3() {
  return `<div class="sheet" id="s3">
  ${banner('sb-c2', '🧩', 'กลยุทธ์การอ่านทีละขั้น', 'Reading Strategies Step by Step', 'ส่วนที่ 3')}
  <div class="step-card sc1">
    <span class="step-label">STEP 1</span>
    <div class="qtext" style="font-size:17px;">Skimming — อ่านคร่าว ๆ หาใจความหลัก</div>
    <p style="margin:6px 0;">อ่านเร็ว ๆ ทั้งย่อหน้าโดยไม่ต้องอ่านทุกคำ เน้นประโยคแรกและประโยคสุดท้ายซึ่งมักบอกใจความหลัก ใช้ตอบคำถามประเภท Main Idea</p>
    <ul><li>อ่านหัวข้อ/ประโยคแรกก่อนเสมอ</li><li>ถามตัวเองว่า "ย่อหน้านี้พูดเรื่องอะไรโดยรวม"</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">Scanning — กวาดสายตาหาข้อมูลเฉพาะจุด</div>
    <p style="margin:6px 0;">ไม่อ่านทั้งหมด แต่กวาดสายตาหาคำสำคัญในคำถาม (ชื่อ, ตัวเลข, วันที่) แล้วอ่านเฉพาะรอบ ๆ คำนั้น ใช้ตอบคำถามประเภท Detail</p>
    <ul><li>อ่านคำถามก่อน แล้วหาคำสำคัญในคำถาม</li><li>กวาดหาคำนั้นในย่อหน้า แล้วอ่านประโยครอบข้าง</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">Guessing from Context — เดาความหมายจากบริบท</div>
    <p style="margin:6px 0;">เมื่อเจอคำศัพท์ที่ไม่รู้จัก ให้ดูประโยคก่อน-หลังคำนั้นเพื่อเดาความหมาย ใช้ตอบคำถามประเภท Vocabulary in Context</p>
    <ul><li>ไม่ต้องรู้ทุกคำศัพท์ก็ตอบได้ ถ้าดูบริบทเป็น</li><li>สังเกตคำเชื่อม (because, so, but) ที่ช่วยบอกความหมาย</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">Inference & Reference — คิดต่อและอ้างอิงสรรพนาม</div>
    <p style="margin:6px 0;">Inference: คำตอบไม่ได้บอกตรง ๆ ต้องคิดต่อจากข้อมูลที่ให้มา — Reference: คำสรรพนาม (it, he, she, they) มองย้อนกลับไปหาคำนามก่อนหน้าเสมอ</p>
    <ul><li>Inference: อ่านทั้งย่อหน้าอีกรอบ แล้วถามว่า "จากข้อมูลนี้ สรุปอะไรได้บ้าง"</li><li>Reference: หาคำนามที่อยู่ก่อนหน้าสรรพนามทันที</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE (data-driven) ---------- */
function s4() {
  const headers = data.summaryTable.headers;
  const rowsHtml = data.summaryTable.rows.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'ตารางสรุป', 'Summary Table', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr><th>${esc(headers[0])}</th><th>${esc(headers[1])}</th><th>${esc(headers[2])}</th></tr>
      ${rowsHtml}
    </table>
  </div>
  <div class="tip-card">💡 เคล็ดลับ: ท่องตารางนี้ให้ขึ้นใจ เพราะทุกกลยุทธ์และประเภทคำถามในบทนี้อ้างอิงจากตารางเดียวนี้ทั้งหมด!</div>
</div>`;
}

/* ---------- SECTION 5: MEMORY TRICKS ---------- */
function s5() {
  return `<div class="sheet" id="s5">
  ${banner('sb-c4', '🧠', 'เทคนิคการจำ', 'Memory Tricks', 'ส่วนที่ 5')}
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">"อ่านคำถามก่อนอ่านเนื้อเรื่อง"</div><p>อ่านคำถามและตัวเลือกก่อนเสมอ จะได้รู้ว่าต้องหาอะไรตอนอ่านย่อหน้า ประหยัดเวลาได้มาก</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">"ประโยคแรก-สุดท้าย = ใจความหลัก"</div><p>ย่อหน้าภาษาอังกฤษส่วนใหญ่บอกใจความหลักไว้ที่ประโยคแรกหรือประโยคสุดท้าย อ่าน 2 ประโยคนี้ก่อนก็มักตอบ Main Idea ได้แล้ว</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">"เขา-เธอ-มัน มองย้อนกลับ"</div><p>เจอคำถาม Reference (it, he, she, they) ให้มองคำนามที่อยู่ "ก่อนหน้า" สรรพนามนั้นทันที ไม่ต้องมองไปข้างหน้า</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">"ไม่รู้คำศัพท์ ไม่ใช่จบเกม"</div><p>เจอคำศัพท์ไม่รู้จัก อย่าตกใจ ให้อ่านประโยคก่อน-หลังคำนั้น มักมีคำใบ้ซ่อนอยู่เสมอ (เช่น because, but, so)</p></div>
</div>`;
}

/* ---------- SECTION 6: KEY SIGNAL WORDS CORNER (adapted from Phonics Corner) ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔑', 'มุมคำสัญญาณสำคัญ', 'Key Signal Words Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>คำสัญญาณ</th><th>ใช้บอกอะไร</th><th>ตัวอย่าง</th></tr>
      <tr><td><b>because / so</b></td><td>เหตุผล/ผลลัพธ์ — ช่วยตอบ Detail และ Inference</td><td>...because her teacher is kind.</td></tr>
      <tr><td><b>mainly / mostly</b></td><td>ใจความหลักของย่อหน้า</td><td>The passage is mainly about...</td></tr>
      <tr><td><b>it / he / she / they</b></td><td>สรรพนามอ้างอิง — มองย้อนกลับหาคำนามก่อนหน้า</td><td>Milo is a dog. He is friendly.</td></tr>
      <tr><td><b>closest in meaning to</b></td><td>คำถามศัพท์ในบริบท (Vocabulary in Context)</td><td>"huge" is closest in meaning to...</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดการอ่าน: คำสัญญาณเหล่านี้เปรียบเหมือน "ป้ายบอกทาง" ในย่อหน้า ถ้าเจอคำเหล่านี้ ให้ชะลอความเร็วในการอ่านตรงนั้นเป็นพิเศษ เพราะมักเป็นจุดที่ข้อสอบชอบถาม!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY (adapted: question-type terms) ---------- */
function s7() {
  const words = [
    ['🎯', 'main idea', 'ใจความหลัก'], ['🔎', 'detail', 'รายละเอียด'], ['🔤', 'vocabulary in context', 'คำศัพท์ในบริบท'],
    ['🤔', 'inference', 'การอนุมาน'], ['🔗', 'reference', 'การอ้างอิง'], ['👁️', 'skim', 'อ่านคร่าว ๆ'],
    ['🔍', 'scan', 'กวาดหาข้อมูล'], ['📝', 'passage', 'ย่อหน้า/บทอ่าน'], ['💡', 'context clue', 'เบาะแสจากบริบท'],
    ['🧩', 'meaning', 'ความหมาย'], ['📌', 'evidence', 'หลักฐานในเรื่อง'], ['🗂️', 'summary', 'สรุปความ'],
    ['❓', 'question type', 'ประเภทคำถาม'], ['✅', 'correct answer', 'คำตอบที่ถูกต้อง'], ['🚫', 'distractor', 'ตัวลวง'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้เป็นชื่อเรียกประเภทคำถามและทักษะการอ่าน — รู้จักคำเหล่านี้จะช่วยให้เข้าใจโจทย์ข้อสอบได้เร็วขึ้น</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS (adapted: common question-type phrasings) ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'รูปแบบคำถามที่พบบ่อย', 'Common Question Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">Main Idea: What is the passage mainly about?</div>
    <div class="pex">อ่านประโยคแรก/สุดท้าย แล้วสรุปเป็นภาพรวม <span class="th">(ใจความหลัก)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">Detail: What/When/Where/Who + does/did/is...?</div>
    <div class="pex">Scanning หาคำตอบตรงในเนื้อเรื่อง <span class="th">(รายละเอียด)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">Vocabulary in Context: The word "___" is closest in meaning to...?</div>
    <div class="pex">ดูประโยครอบคำนั้นเพื่อเดาความหมาย <span class="th">(คำศัพท์ในบริบท)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">Reference/Inference: The word "it/he/she" refers to...? / What can we infer...?</div>
    <div class="pex">มองคำนามก่อนหน้า / คิดต่อจากข้อมูลที่ให้มา <span class="th">(อ้างอิง/อนุมาน)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: EXTRA READING PASSAGES (adapted from Daily Conversation) ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '📰', 'ย่อหน้าฝึกอ่านเพิ่มเติม', 'Extra Practice Passages', 'ส่วนที่ 9')}
  <p style="font-size:14.5px;color:#55607a;">ลองฝึกอ่านย่อหน้าสั้น ๆ ต่อไปนี้ด้วยตัวเอง แล้ววิเคราะห์ว่าแต่ละย่อหน้ามีใจความหลักว่าอะไร และมีคำสรรพนามอ้างอิงถึงใคร/อะไรบ้าง (ย่อหน้าเหล่านี้จะถูกใช้ในแบบทดสอบ ส่วนที่ 14 ด้วย)</p>
  <div class="dialogue-wrap">
    <div class="dialogue-title">⚽ ย่อหน้าที่ 1: Tum and Football</div>
    <div class="bubble left" style="max-width:100%;">${esc(data.passages[0].text)}</div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🍪 ย่อหน้าที่ 2: Kate's Baking Day</div>
    <div class="bubble left" style="max-width:100%;">${esc(data.passages[1].text)}</div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['อ่านทุกคำในย่อหน้าอย่างละเอียดก่อนดูคำถาม', 'เสียเวลาโดยไม่จำเป็น ควรอ่านคำถามก่อนเพื่อรู้ว่าต้องหาอะไร', 'อ่านคำถาม → Skim ย่อหน้า → Scan หาคำตอบเฉพาะจุด'],
    ['เจอคำศัพท์ไม่รู้จักแล้วหยุดอ่านทันที', 'ควรอ่านต่อและดูบริบทรอบคำนั้นเพื่อเดาความหมาย', 'ใช้ Guessing from Context แทนการหยุดอ่าน'],
    ['ตอบคำถาม Reference โดยมองไปข้างหน้าแทนข้างหลัง', 'สรรพนาม (it, he, she) มักอ้างถึงคำนามที่อยู่ "ก่อนหน้า" เสมอ', 'มองย้อนกลับไปหาคำนามก่อนสรรพนามนั้น'],
    ['เลือกคำตอบ Inference ที่มีคำจากย่อหน้าตรง ๆ ทุกคำ', 'Inference ต้องคิดต่อจากข้อมูล ไม่ใช่แค่หาคำที่ตรงกับย่อหน้า', 'เลือกคำตอบที่ "สรุปได้อย่างสมเหตุสมผล" จากข้อมูลทั้งหมด'],
    ['อ่านย่อหน้าเรียงจากบนลงล่างทุกครั้งเพื่อหา Detail', 'เสียเวลา ควร Scan หาคำสำคัญในคำถามแทนการอ่านไล่ทีละบรรทัด', 'Scanning หาคำสำคัญที่ตรงกับคำถามโดยตรง'],
    ['เลือกคำตอบที่ยาวและซับซ้อนที่สุดเพราะคิดว่าน่าจะถูก', 'คำตอบที่ถูกต้องไม่จำเป็นต้องยาวหรือซับซ้อนที่สุดเสมอไป', 'เลือกคำตอบที่ตรงกับข้อมูลในย่อหน้าที่สุด ไม่ใช่ยาวที่สุด'],
  ];
  const cards = mistakes.map((m) => `<div class="mistake-card">
    <div class="wrong">❌ ${esc(m[0])}</div>
    <div class="why">🤔 ${esc(m[1])}</div>
    <div class="right">✅ ${esc(m[2])}</div>
  </div>`).join('');
  return `<div class="sheet" id="s10">
  ${banner('sb-c3', '⚠️', 'ข้อผิดพลาดที่พบบ่อย', 'Common Mistakes', 'ส่วนที่ 10')}
  ${cards}
</div>`;
}

/* ---------- SECTION 11: EXAM TIPS ---------- */
function s11() {
  const tips = [
    'อ่านคำถามและตัวเลือกก่อนอ่านย่อหน้าเต็ม จะรู้ว่าควรมองหาอะไร',
    'ใช้ Skimming หา Main Idea ก่อน แล้วค่อยใช้ Scanning หา Detail ทีละข้อ',
    'คำถาม Reference ให้มองคำนามที่อยู่ก่อนหน้าสรรพนามเสมอ ไม่ใช่มองไปข้างหน้า',
    'คำถาม Inference ต้องคิดต่อจากข้อมูล ไม่มีคำตอบที่บอกตรง ๆ ในย่อหน้า',
    'ถ้าไม่รู้ความหมายคำศัพท์ ให้ดูประโยคก่อน-หลังคำนั้น มักมีคำใบ้ซ่อนอยู่เสมอ',
  ];
  const items = tips.map((t, i) => `<li><span class="num">${i + 1}</span><span>${esc(t)}</span></li>`).join('');
  return `<div class="sheet" id="s11">
  ${banner('sb-c4', '🏆', 'เทคนิคทำข้อสอบ', 'Exam Tips', 'ส่วนที่ 11')}
  <ul class="tip-checklist">${items}</ul>
</div>`;
}

/* ---------- SECTION 12: MIND MAP ---------- */
function s12() {
  return `<div class="sheet" id="s12">
  ${banner('sb-c5', '🗺️', 'แผนผังความคิด', 'Mind Map', 'ส่วนที่ 12')}
  <div class="mindmap-wrap">
    <div class="mindmap-center">Reading</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">👁️ Skimming</span>อ่านคร่าว ๆ หาใจความหลัก</div>
      <div class="mindmap-branch mb-b"><span class="bt">🔍 Scanning</span>กวาดหาข้อมูลเฉพาะจุด</div>
      <div class="mindmap-branch mb-c"><span class="bt">💡 Guessing from Context</span>เดาความหมายคำศัพท์จากบริบท</div>
      <div class="mindmap-branch mb-d"><span class="bt">🎯 Main Idea/Detail</span>ใจความหลัก/รายละเอียด</div>
      <div class="mindmap-branch mb-e"><span class="bt">🤔 Inference</span>คิดต่อจากข้อมูลที่ให้มา</div>
      <div class="mindmap-branch mb-f"><span class="bt">🔗 Reference</span>สรรพนามอ้างถึงคำนามก่อนหน้า</div>
    </div>
  </div>
</div>`;
}

/* ---------- SECTION 13: WORKSHEET (reused from data) ---------- */
function s13() {
  const parts = data.worksheet.parts.map((part) => {
    const items = part.items.map((item) => {
      if (item.includes('___')) return `<li>${item.replace('___', '<span class="blank"></span>')}</li>`;
      return `<li>${item} &rarr; <span class="blank"></span></li>`;
    }).join('');
    return `<h2 class="part-title">${esc(part.title)}</h2><p class="part-desc">${esc(part.instructions)}</p><ol class="qlist two-col">${items}</ol>`;
  }).join('');
  const total = data.worksheet.parts.reduce((s, p) => s + p.items.length, 0);
  return `<div class="sheet" id="s13">
  ${banner('sb-c6', '✏️', 'ใบงานฝึกหัด', 'Worksheet', 'ส่วนที่ 13')}
  <div class="info-row">
    <span>ชื่อ-นามสกุล <span class="fill-line" style="min-width:220px;">&nbsp;</span></span>
    <span>ชั้น <span class="fill-line" style="min-width:80px;">&nbsp;</span></span>
    <span>วันที่ <span class="fill-line" style="min-width:100px;">&nbsp;</span></span>
    <span>คะแนน <span class="fill-line" style="min-width:70px;">&nbsp;</span> / ${total}</span>
  </div>
  <div class="instructions"><b>คำสั่ง:</b> เติมคำในช่องว่างให้ถูกต้องตามหลักไวยากรณ์ที่เรียนมา</div>
  ${parts}
</div>`;
}

/* ---------- SECTION 14: QUIZ (reused from data, 50 Qs) ---------- */
function s14() {
  const STARS = { 1: '⭐ ง่าย', 2: '⭐⭐ ปานกลาง', 3: '⭐⭐⭐ ยาก' };
  const COLOR_CLASSES = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  const letters = ['A', 'B', 'C', 'D'];
  const passageById = {};
  data.passages.forEach((p) => { passageById[p.id] = p; });
  let lastPassageRef = null;
  const cards = data.quiz.map((q, i) => {
    const cls = COLOR_CLASSES[i % COLOR_CLASSES.length];
    const choices = q.choices.map((c, ci) => `<div class="choice">${letters[ci]}) ${esc(c)}</div>`).join('');
    let passageBlock = '';
    if (q.passageRef && q.passageRef !== lastPassageRef) {
      const p = passageById[q.passageRef];
      passageBlock = `<div class="explain-block" style="margin:18px 0 10px;"><h2>${esc(p.title)}</h2><p style="font-size:14px;line-height:1.7;">${esc(p.text)}</p></div>`;
      lastPassageRef = q.passageRef;
    }
    return `${passageBlock}<div class="card ${cls}">
    <div class="qnum">ข้อ ${i + 1}</div>
    <div class="stars">${STARS[q.difficulty]}</div>
    <div class="card-body">
      <div class="emoji-badge">${q.emoji}</div>
      <div class="qtext">${esc(q.q)}<div class="rule-tag">${esc(q.tag)}</div></div>
    </div>
    <div class="choice-grid">${choices}</div>
    <div class="write-row">
      <span>คำตอบ:</span>
      <div class="letters"><div class="letter-box">A</div><div class="letter-box">B</div><div class="letter-box">C</div><div class="letter-box">D</div></div>
      <div class="write-line"></div>
    </div>
  </div>`;
  }).join('');
  return `<div class="sheet" id="s14">
  ${banner('sb-c1', '🌈', `แบบทดสอบสนุก ${data.quiz.length} ข้อ`, 'Quiz', 'ส่วนที่ 14')}
  <div class="info-row">
    <span>ชื่อ-นามสกุล <span class="fill-line" style="min-width:220px;">&nbsp;</span></span>
    <span>ชั้น <span class="fill-line" style="min-width:80px;">&nbsp;</span></span>
    <span>คะแนน <span class="fill-line" style="min-width:70px;">&nbsp;</span> / ${data.quiz.length}</span>
  </div>
  <div class="instructions"><b>คำสั่ง:</b> อ่านย่อหน้าแต่ละตอนแล้วตอบคำถามที่ตามมา เลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว ข้อสอบเรียงจากง่ายไปยาก</div>
  ${cards}
  <div class="score-box">🌟 คะแนนรวม: __________ / ${data.quiz.length} 🌟</div>
</div>`;
}

/* ---------- SECTION 15: ANSWER KEY (reused from data) ---------- */
function s15() {
  let wsRows = '';
  let wsNum = 0;
  data.worksheet.parts.forEach((part) => {
    part.items.forEach((item, idx) => {
      wsNum++;
      wsRows += `<tr><td>${wsNum}</td><td>${esc(part.answers[idx])}</td><td>${esc(part.reasons[idx])}</td></tr>`;
    });
  });
  const letters = ['A', 'B', 'C', 'D'];
  const quizRows = data.quiz.map((q, i) => `<tr><td>${i + 1}</td><td class="emoji-cell">${q.emoji}</td><td>${letters[q.answer]}) ${esc(q.choices[q.answer])}</td><td>${esc(q.explain)}</td></tr>`).join('');
  return `<div class="sheet" id="s15">
  <div class="teacher-flag">สำหรับครูเท่านั้น — ตัดหน้านี้ออกก่อนแจกนักเรียน</div>
  ${banner('sb-teacher', '✅', 'เฉลยพร้อมคำอธิบาย', 'Answer Key', 'ส่วนที่ 15')}
  <h2 class="part-title">เฉลยใบงานฝึกหัด</h2>
  <table class="answer-table"><tr><th>ข้อ</th><th>คำตอบ</th><th>เหตุผลย่อ</th></tr>${wsRows}</table>
  <h2 class="part-title">เฉลยแบบทดสอบ (${data.quiz.length} ข้อ)</h2>
  <table class="answer-table"><tr><th>ข้อ</th><th></th><th>คำตอบ</th><th>เหตุผล/คำอธิบาย</th></tr>${quizRows}</table>
</div>`;
}

/* ---------- SECTION 16: CHEAT SHEET ---------- */
function s16() {
  return `<div class="sheet" id="s16">
  ${banner('sb-c3', '📋', 'ชีทสรุปหน้าเดียว', 'Cheat Sheet', 'ส่วนที่ 16')}
  <div class="cheat-grid">
    <div class="cheat-box"><h4>3 กลยุทธ์การอ่าน</h4>
      <table><tr><th>กลยุทธ์</th><th>ใช้เมื่อไหร่</th></tr>
      <tr><td>Skimming</td><td>หา Main Idea</td></tr>
      <tr><td>Scanning</td><td>หา Detail</td></tr>
      <tr><td>Guessing from Context</td><td>หา Vocabulary</td></tr></table></div>
    <div class="cheat-box"><h4>5 ประเภทคำถาม</h4>
      <ul><li>Main Idea, Detail</li><li>Vocabulary in Context</li><li>Inference, Reference</li></ul></div>
    <div class="cheat-box"><h4>เทคนิคจำเร็ว</h4>
      <ul><li>ประโยคแรก/สุดท้าย = ใจความหลัก</li><li>สรรพนามมองย้อนกลับเสมอ</li></ul></div>
    <div class="cheat-box"><h4>ข้อควรระวัง</h4>
      <ul><li>Inference ต้องคิดต่อ ไม่ใช่หาคำตรง ๆ</li><li>อ่านคำถามก่อนอ่านย่อหน้าเต็ม</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกลยุทธ์ในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>สอนกลยุทธ์การอ่านก่อนให้อ่านย่อหน้าจริง เพื่อให้นักเรียนรู้จักวิธีคิดก่อนลงมือ</li>
    <li>ฝึกให้นักเรียนอ่านคำถามก่อนอ่านย่อหน้าเต็มเสมอ เป็นนิสัยที่ช่วยประหยัดเวลาในห้องสอบ</li>
    <li>เน้นย้ำว่าคำถาม Inference ไม่มีคำตอบบอกตรง ๆ ในเนื้อเรื่อง ต้องฝึกคิดต่อ</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Speed Skimming Race</b> — จับเวลาให้นักเรียนอ่านย่อหน้าเร็ว ๆ แล้วตอบ Main Idea ให้ถูกต้องที่สุด</li>
    <li><b>Word Detective</b> — ปิดคำศัพท์บางคำในย่อหน้า ให้นักเรียนเดาความหมายจากบริบทรอบข้าง</li>
    <li><b>Pronoun Hunt</b> — ให้นักเรียนวงกลมสรรพนามทุกตัวในย่อหน้าแล้วโยงเส้นไปหาคำนามที่อ้างถึง</li>
    <li><b>Passage Swap</b> — ให้นักเรียนแต่งย่อหน้าสั้น ๆ เอง แล้วแลกกันตอบคำถามของเพื่อน</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 โดยเฉพาะคำถาม Reference และ Inference เพื่อวางแผนการสอนซ่อมเสริม</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'หาย่อหน้าภาษาอังกฤษสั้น ๆ จากหนังสือหรืออินเทอร์เน็ต 1 ย่อหน้า แล้วเขียนสรุปใจความหลัก 1 ประโยค',
    'เลือกคำศัพท์ที่ไม่รู้จัก 3 คำจากย่อหน้าที่อ่าน แล้วลองเดาความหมายจากบริบทก่อนเปิดพจนานุกรมตรวจสอบ',
    'อ่านย่อหน้าที่กำหนด แล้วแต่งคำถามเอง 3 ข้อ (Detail, Vocabulary, Inference อย่างละ 1 ข้อ)',
    'ฝึก Scanning โดยจับเวลาตัวเองหาคำตอบ Detail จากย่อหน้าในหนังสือเรียนวิชาอื่น ๆ'
  ];
  const cards = hw.map((h, i) => `<div class="homework-card"><span class="hnum">การบ้านข้อ ${i + 1}:</span> ${esc(h)}</div>`).join('');
  return `<div class="sheet" id="s18">
  ${banner('sb-c4', '🏡', 'การบ้านสนุก ๆ', 'Homework', 'ส่วนที่ 18')}
  ${cards}
</div>`;
}

/* ---------- SECTION 19: MOTIVATION ---------- */
function s19() {
  return `<div class="sheet" id="s19">
  ${banner('sb-c5', '💪', 'ให้กำลังใจ', 'Motivation', 'ส่วนที่ 19')}
  <div class="motivation-poster">
    <div class="quote">"อ่านให้ฉลาด ไม่ใช่อ่านให้เร็วที่สุด" 🌟</div>
    <div class="sub">การอ่านจับใจความไม่ได้วัดกันที่ความเร็ว แต่วัดกันที่กลยุทธ์ที่ใช้ ถ้าวันนี้เข้าใจ Skimming, Scanning และการเดาความหมายจากบริบทแล้ว การอ่านข้อสอบภาษาอังกฤษจะง่ายขึ้นมาก ไม่ต้องรู้ทุกคำศัพท์ก็เข้าใจเรื่องราวได้ 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง Reading Comprehension ค่ะ มีกลยุทธ์หลัก 3 แบบ: Skimming, Scanning, Guessing from Context',
    'Skimming ใช้หาใจความหลัก (Main Idea) โดยอ่านประโยคแรก/สุดท้ายของย่อหน้า',
    'Scanning ใช้หาคำตอบ Detail โดยกวาดหาคำสำคัญในคำถามแล้วอ่านรอบ ๆ คำนั้น',
    'Guessing from Context ใช้ตอบคำถามคำศัพท์ (Vocabulary in Context) โดยดูประโยครอบข้าง',
    'Reference: สรรพนาม (it, he, she, they) ต้องมองย้อนกลับไปหาคำนามก่อนหน้าเสมอ',
    'Inference: คำตอบไม่ได้บอกตรง ๆ ในเรื่อง ต้องคิดต่อจากข้อมูลที่ให้มา',
    'สุดท้าย ฝึกทำแบบฝึกหัดและแบบทดสอบให้ครบ แล้วนักเรียนจะแม่นเรื่องนี้แน่นอนค่ะ',
  ];
  const linesHtml = lines.map((l) => `<div class="line">✅ ${esc(l)}</div>`).join('');
  return `<div class="sheet" id="s20">
  <div class="sunee-poster">
    <div class="avatar">👩‍🏫</div>
    <h2>ครูสุนีสรุปให้ 🌈</h2>
    ${linesHtml}
    <div class="signoff">สู้ๆ นะคะ นักเรียนของครูสุนีทุกคน 💪🌈 อ่านหน้านี้ซ้ำ 5 นาทีก่อนสอบ แล้วจะมั่นใจขึ้นเยอะเลยค่ะ!</div>
  </div>
</div>`;
}

const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>หนังสือเรียน: Reading — ม.3</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${FONT_LINK}
<style>${baseCSS}${BOOK_CSS}</style>
</head>
<body>
${sCover()}
${s2()}
${s3()}
${s4()}
${s5()}
${s6()}
${s7()}
${s8()}
${s9()}
${s10()}
${s11()}
${s12()}
${s13()}
${s14()}
${s15()}
${s16()}
${s17()}
${s18()}
${s19()}
${s20()}
</body>
</html>
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, html, 'utf8');
console.log('Wrote', outPath);
console.log('Quiz questions embedded:', data.quiz.length);
console.log('Worksheet items embedded:', data.worksheet.parts.reduce((s, p) => s + p.items.length, 0));
