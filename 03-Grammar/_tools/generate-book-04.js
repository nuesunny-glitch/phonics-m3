/*
 * One-off "mini textbook" generator for Lesson 04: A / An / The (Articles).
 * Reuses data-04-a-an-the.json (already verified: grammar tables, tips,
 * worksheet, 50-question quiz, answer key) so this book's practice content
 * stays byte-consistent with the standalone quiz-pack files, and hand-authors
 * the extra storybook sections (cover, phonics, vocabulary, dialogues, mind
 * map, cheat sheet, teacher notes, homework, motivation, summary).
 *
 * Usage: node generate-book-04.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-04-a-an-the.json'), 'utf8'));
const outDir = path.join(__dirname, '..', '04-A-An-The');
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

.toc { list-style: none; padding:0; margin: 10px 0; columns: 2; column-gap: 22px; }
.toc li { font-size: 13.5px; padding: 5px 0; border-bottom: 1px dashed #dde2ee; }
.toc .n { color:#2952e3; font-weight:700; margin-right:6px; }
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
    <div class="cover-emojis">🔤 📌 🍎 🌞 📖</div>
    <h1 class="cover-title-en">A / An / The</h1>
    <div class="cover-title-th">คำนำหน้านาม Articles (a / an / the)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 เล่มที่ 4 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Lesson 04 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT ARE ARTICLES ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  ${banner('sb-c1', '📖', 'Article คืออะไร?', 'What are Articles?', 'ส่วนที่ 2')}
  <p style="font-size:15px;line-height:1.7;">คำว่า <b>a, an, the</b> เรียกว่า <b>Article</b> หรือ "คำนำหน้านาม" ในภาษาไทยเราไม่มีคำแบบนี้ จึงมักสับสน แต่จำง่าย ๆ แค่นี้: <b>a/an</b> แปลว่า "หนึ่ง...(ที่ยังไม่เจาะจง)" ส่วน <b>the</b> แปลว่า "...(ตัวที่เจาะจง/รู้กันแล้ว)" ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">a / an</div>ไม่เจาะจง กล่าวถึงครั้งแรก<div class="ex">I have a pen.<br>(ฉันมีปากกาด้ามหนึ่ง)</div></div>
    <div class="meaning-box mb2"><div class="word">the</div>เจาะจง กล่าวถึงซ้ำ/มีหนึ่งเดียว<div class="ex">The pen is blue.<br>(ปากกา(ด้ามนั้น)สีน้ำเงิน)</div></div>
    <div class="meaning-box mb3"><div class="word">ไม่ใช้เลย</div>นามพหูพจน์ทั่วไป/นามนับไม่ได้<div class="ex">I like pens.<br>(ฉันชอบปากกา(ทั่วไป))</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่าประโยคแรกยังไม่รู้ว่า "ปากกาด้ามไหน" จึงใช้ a แต่พอพูดซ้ำในประโยคที่สอง ทั้งคนพูดและคนฟังรู้แล้วว่าหมายถึงด้ามไหน จึงเปลี่ยนเป็น the — นี่คือหัวใจสำคัญที่สุดของบทนี้</p>
  <div class="explain-block">
    <h2>🧩 ใช้เมื่อไหร่บ้าง?</h2>
    <table>
      <tr><th>การใช้</th><th>ตัวอย่าง</th><th>คำแปล</th></tr>
      <tr><td>นามเอกพจน์ ยังไม่เจาะจง</td><td>She has a cat.</td><td>เธอมีแมวตัวหนึ่ง</td></tr>
      <tr><td>นามที่เจาะจง/รู้กันแล้ว</td><td>The cat is cute.</td><td>แมว(ตัวนั้น)น่ารัก</td></tr>
      <tr><td>นามพหูพจน์/นับไม่ได้ ทั่วไป</td><td>Cats are cute. / I like milk.</td><td>แมวน่ารัก(ทั่วไป) / ฉันชอบนม</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>คำแปล</th></tr>
      <tr><td>I have an apple.</td><td>ฉันมีแอปเปิลลูกหนึ่ง</td></tr>
      <tr><td>The apple is sweet.</td><td>แอปเปิล(ลูกนั้น)หวาน</td></tr>
      <tr><td>The sun is bright today.</td><td>วันนี้ดวงอาทิตย์สว่างมาก</td></tr>
      <tr><td>Dogs are friendly animals.</td><td>สุนัขเป็นสัตว์ที่เป็นมิตร</td></tr>
      <tr><td>She is a nurse.</td><td>เธอเป็นพยาบาล</td></tr>
      <tr><td>He is an honest boy.</td><td>เขาเป็นเด็กที่ซื่อสัตย์</td></tr>
    </table>
  </div>
</div>`;
}

/* ---------- SECTION 3: GRAMMAR RULES STEP BY STEP ---------- */
function s3() {
  return `<div class="sheet" id="s3">
  ${banner('sb-c2', '🧩', 'กฎไวยากรณ์ทีละขั้น', 'Grammar Rules Step by Step', 'ส่วนที่ 3')}
  <div class="step-card sc1">
    <span class="step-label">STEP 1</span>
    <div class="qtext" style="font-size:17px;">a — ใช้หน้าคำที่ขึ้นต้นด้วย <b>เสียงพยัญชนะ</b></div>
    <p style="margin:6px 0;">ถ้าคำถัดไปออกเสียงขึ้นต้นเป็นเสียงพยัญชนะ (ไม่ใช่ a e i o u) ให้ใช้ a</p>
    <ul><li>a dog (สุนัขตัวหนึ่ง)</li><li>a university (ออกเสียง "yoo-" ซึ่งเป็นเสียงพยัญชนะ)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">an — ใช้หน้าคำที่ขึ้นต้นด้วย <b>เสียงสระ</b></div>
    <p style="margin:6px 0;">สำคัญที่สุด: ต้องดูจาก "เสียง" ที่ได้ยิน ไม่ใช่ตัวอักษรที่เขียน! บางคำสะกดด้วยพยัญชนะแต่ออกเสียงเป็นสระ เช่น hour (h ไม่ออกเสียง)</p>
    <ul><li>an apple (แอปเปิลลูกหนึ่ง)</li><li>an hour (หนึ่งชั่วโมง — h ไม่ออกเสียง จึงได้ยินเสียงสระ)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">the — ใช้เมื่อ <b>เจาะจง / มีหนึ่งเดียว / กล่าวซ้ำ</b></div>
    <p style="margin:6px 0;">ใช้ the เมื่อทั้งผู้พูดและผู้ฟังรู้อยู่แล้วว่าหมายถึงอันไหน เช่น เคยพูดถึงมาแล้ว หรือมีเพียงหนึ่งเดียวในโลก</p>
    <ul><li>I bought a pen. The pen is blue. (กล่าวซ้ำ)</li><li>the sun, the moon, the sky (มีหนึ่งเดียว)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">ไม่ใช้ article เลย — นามพหูพจน์ทั่วไป/นามนับไม่ได้/ชื่อเฉพาะ</div>
    <p style="margin:6px 0;">เมื่อพูดถึงสิ่งนั้นแบบทั่วไป (ไม่เจาะจง) ไม่ต้องใส่ a, an หรือ the เลย</p>
    <ul><li>Dogs are cute. (สุนัขทั่วไป)</li><li>I drink water. (น้ำทั่วไป) / Thailand, Somchai (ชื่อเฉพาะ)</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE ---------- */
function s4() {
  const rowsHtml = data.summaryTable.rows.map((r) => `<tr><td>${esc(r[0])}</td><td><b>${esc(r[1])}</b></td><td>${esc(r[2])}</td></tr>`).join('');
  const headHtml = data.summaryTable.headers.map((h) => `<th>${esc(h)}</th>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'ตารางสรุป', 'Summary Table', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr>${headHtml}</tr>
      ${rowsHtml}
    </table>
  </div>
  <div class="tip-card">💡 เคล็ดลับ: ท่องตารางนี้ให้ขึ้นใจ เพราะทุกกฎในบทนี้อ้างอิงจากตารางเดียวนี้ทั้งหมด!</div>
</div>`;
}

/* ---------- SECTION 5: MEMORY TRICKS ---------- */
function s5() {
  return `<div class="sheet" id="s5">
  ${banner('sb-c4', '🧠', 'เทคนิคการจำ', 'Memory Tricks', 'ส่วนที่ 5')}
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">ฟังเสียง ไม่ใช่ตัวอักษร!</div><p>อย่าดูว่าตัวหนังสือขึ้นต้นด้วยอะไร ให้ฟังว่า "เสียงแรก" ที่พูดออกมาเป็นเสียงสระหรือพยัญชนะ — จำว่า <b>an hour</b> ไม่ใช่ a hour เพราะ h ไม่ออกเสียง เลยได้ยินเสียง "our" ซึ่งเป็นสระ</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">the = ตัวนั้น ตัวที่รู้กันอยู่แล้ว</div><p>ถ้าคิดในใจแล้วชี้ได้ว่า "อันนี้ไง ตัวที่พูดถึงเมื่อกี้" ให้ใช้ the แต่ถ้ายังไม่รู้ว่าอันไหน ให้ใช้ a/an</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">คล้องจองจำง่าย</div><p>"หนึ่งอย่าง ใช้ a/an — พูดซ้ำอีกที ใช้ the — พูดทั่วไปหลายอย่าง ไม่ต้องใช้อะไรเลย!" ท่องประโยคนี้ซ้ำ ๆ จะช่วยจำกฎทั้ง 3 แบบได้ในคาถาเดียว</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">จำคำยกเว้นด้วยคำสั้น ๆ</div><p>"an hour, an honest man" (h เงียบ = สระ) และ "a university, a uniform" (ขึ้นต้นด้วยเสียง "yoo" = พยัญชนะ) — ท่องสองกลุ่มนี้ให้ขึ้นใจ เพราะข้อสอบชอบออกบ่อยที่สุด!</p></div>
</div>`;
}

/* ---------- SECTION 6: PHONICS CORNER ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔊', 'มุมออกเสียง', 'Phonics Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>คำ</th><th>สัทอักษร (IPA)</th><th>เสียงอ่านแบบไทย</th><th>ตัวอย่างประโยค</th></tr>
      <tr><td><b>a</b></td><td>/ə/</td><td>อะ</td><td>a cat (อะ แคท)</td></tr>
      <tr><td><b>an</b></td><td>/ən/</td><td>แอิน/อัน</td><td>an apple (แอิน แอปเปิล)</td></tr>
      <tr><td><b>the</b> (หน้าเสียงพยัญชนะ)</td><td>/ðə/</td><td>เธอะ</td><td>the dog (เธอะ ด็อก)</td></tr>
      <tr><td><b>the</b> (หน้าเสียงสระ)</td><td>/ðiː/</td><td>ธี</td><td>the apple (ธี แอปเปิล)</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียงพิเศษ: คำว่า <b>an hour</b> อ่านว่า <b>/aʊər/</b> (เอาเออร์) เพราะตัว h เป็น "silent h" ไม่ออกเสียงเลย! ฟังดี ๆ จะได้ยินแค่เสียงสระ "our" เท่านั้น จึงต้องใช้ an ไม่ใช่ a — นี่คือตัวอย่างคลาสสิกที่ข้อสอบชอบออกที่สุด</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['🐶', 'a dog', 'สุนัขตัวหนึ่ง'], ['🐘', 'an elephant', 'ช้างตัวหนึ่ง'], ['🦉', 'an owl', 'นกฮูกตัวหนึ่ง'],
    ['🍎', 'an apple', 'แอปเปิลลูกหนึ่ง'], ['🍌', 'a banana', 'กล้วยลูกหนึ่ง'], ['🍊', 'an orange', 'ส้มลูกหนึ่ง'],
    ['🐈', 'a cat', 'แมวตัวหนึ่ง'], ['🥚', 'an egg', 'ไข่ฟองหนึ่ง'], ['🐟', 'a fish', 'ปลาตัวหนึ่ง'],
    ['☀️', 'the sun', 'ดวงอาทิตย์'], ['🌙', 'the moon', 'ดวงจันทร์'], ['☁️', 'the sky', 'ท้องฟ้า'],
    ['⏰', 'an hour', 'หนึ่งชั่วโมง'], ['🎓', 'a university', 'มหาวิทยาลัยแห่งหนึ่ง'], ['☔', 'an umbrella', 'ร่มคันหนึ่ง'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้ใช้บ่อยที่สุดเวลาแต่งประโยคกับ Article — แบ่งเป็น 4 หมวด: สัตว์, อาหาร/ผลไม้, สิ่งที่มีหนึ่งเดียว, และคำยกเว้นด้านเสียง</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">Pattern 1: I have a/an + noun.</div>
    <div class="pex">I have a pencil. <span class="th">(ฉันมีดินสอด้ามหนึ่ง)</span></div>
    <div class="pex">She has an umbrella. <span class="th">(เธอมีร่มคันหนึ่ง)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">Pattern 2: The + noun + is/are + ...</div>
    <div class="pex">The book is interesting. <span class="th">(หนังสือ(เล่มนั้น)น่าสนใจ)</span></div>
    <div class="pex">The students are quiet. <span class="th">(นักเรียน(กลุ่มนั้น)เงียบ)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">Pattern 3: (no article) + plural noun / uncountable noun + verb</div>
    <div class="pex">Dogs are loyal animals. <span class="th">(สุนัขเป็นสัตว์ที่ซื่อสัตย์)</span></div>
    <div class="pex">Water is important for life. <span class="th">(น้ำสำคัญต่อชีวิต)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">Pattern 4: First mention (a/an) → Second mention (the)</div>
    <div class="pex">I saw a bird. The bird was singing. <span class="th">(ฉันเห็นนกตัวหนึ่ง นก(ตัวนั้น)กำลังร้องเพลง)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาในชีวิตประจำวัน', 'Daily Conversation', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🛒 บทสนทนาที่ 1: ไปตลาด (At the Market)</div>
    <div class="bubble left"><div class="speaker">Mom</div>What do you want to buy today?<div class="th">วันนี้ลูกอยากซื้ออะไร</div></div>
    <div class="bubble right"><div class="speaker">Nan</div>I want an apple and a fish, please.<div class="th">หนูอยากได้แอปเปิลกับปลาค่ะ</div></div>
    <div class="bubble left"><div class="speaker">Mom</div>Okay. Look, the apple over there looks fresh.<div class="th">โอเค ดูสิ แอปเปิล(ลูกนั้น)ดูสดมากเลย</div></div>
    <div class="bubble right"><div class="speaker">Nan</div>Yes! And the fish smells good too.<div class="th">ใช่ค่ะ! แล้วปลา(ตัวนั้น)ก็มีกลิ่นหอมด้วย</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🐾 บทสนทนาที่ 2: เล่าเรื่องสัตว์เลี้ยง (Talking about a Pet)</div>
    <div class="bubble left"><div class="speaker">Beam</div>I have a dog at home.<div class="th">ฉันมีสุนัขที่บ้านตัวหนึ่ง</div></div>
    <div class="bubble right"><div class="speaker">Job</div>Really? What does the dog look like?<div class="th">จริงเหรอ แล้วสุนัข(ตัวนั้น)หน้าตาเป็นยังไง</div></div>
    <div class="bubble left"><div class="speaker">Beam</div>The dog is small and very friendly. It's an honest little friend!<div class="th">สุนัข(ตัวนั้น)ตัวเล็กและเป็นมิตรมาก มันเป็นเพื่อนตัวน้อยที่ซื่อสัตย์เลย!</div></div>
    <div class="bubble right"><div class="speaker">Job</div>That's so cute! I want a pet too.<div class="th">น่ารักจังเลย ฉันก็อยากมีสัตว์เลี้ยงบ้างจัง</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['I have an dog.', 'dog ขึ้นต้นด้วยเสียงพยัญชนะ d ต้องใช้ a ไม่ใช่ an', 'I have a dog.'],
    ['She is an nurse.', 'nurse ขึ้นต้นด้วยเสียงพยัญชนะ n (ฟังเสียง ไม่ใช่ตัวสะกด) ต้องใช้ a', 'She is a nurse.'],
    ['I saw a elephant.', 'elephant ขึ้นต้นด้วยเสียงสระ e ต้องใช้ an ไม่ใช่ a', 'I saw an elephant.'],
    ['The Bangkok is a big city.', 'Bangkok เป็นชื่อเฉพาะ (ชื่อเมือง) ส่วนใหญ่ไม่ต้องใช้ article นำหน้า', 'Bangkok is a big city.'],
    ['I waited for a hour.', 'hour ตัว h ไม่ออกเสียง จึงได้ยินเสียงสระ ต้องใช้ an', 'I waited for an hour.'],
    ['She studies at an university.', 'university ออกเสียงขึ้นต้นว่า "yoo-" ซึ่งเป็นเสียงพยัญชนะ ต้องใช้ a', 'She studies at a university.'],
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
    'ตัดสินจาก "เสียง" ไม่ใช่ตัวสะกด — an hour, an honest man (h เงียบ = สระ) ส่วน a university, a uniform (ขึ้นต้นเสียง yoo = พยัญชนะ)',
    'กล่าวถึงครั้งแรกใช้ a/an พอกล่าวถึงซ้ำในประโยคถัดไป (รู้แล้วว่าอันไหน) ให้เปลี่ยนเป็น the ทันที',
    'ไม่ใช้ article เลยกับนามพหูพจน์ที่พูดถึงทั่วไป นามนับไม่ได้ และชื่อเฉพาะส่วนใหญ่ (คน ประเทศ เมือง)',
    'คำคุณศัพท์ขั้นสูงสุด (superlative) เช่น the best, the tallest ต้องมี the เสมอ ไม่มีข้อยกเว้น',
    'สิ่งที่มีหนึ่งเดียวในโลก/บริบท เช่น the sun, the moon, the sky ต้องใช้ the เสมอ',
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
    <div class="mindmap-center">A / An / The</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">🔤 a</span>หน้าเสียงพยัญชนะ (a dog, a university)</div>
      <div class="mindmap-branch mb-b"><span class="bt">🔤 an</span>หน้าเสียงสระ (an apple, an hour)</div>
      <div class="mindmap-branch mb-c"><span class="bt">🎯 the</span>เจาะจง/กล่าวซ้ำ/มีหนึ่งเดียว/superlative</div>
      <div class="mindmap-branch mb-d"><span class="bt">🚫 ไม่ใช้ article</span>พหูพจน์ทั่วไป/นับไม่ได้/ชื่อเฉพาะ</div>
      <div class="mindmap-branch mb-e"><span class="bt">⚠️ ข้อยกเว้นเสียง</span>an hour, an honest man</div>
      <div class="mindmap-branch mb-f"><span class="bt">⚠️ ข้อยกเว้นเสียง</span>a university, a uniform, a European</div>
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
  const cards = data.quiz.map((q, i) => {
    const cls = COLOR_CLASSES[i % COLOR_CLASSES.length];
    const choices = q.choices.map((c, ci) => `<div class="choice">${letters[ci]}) ${esc(c)}</div>`).join('');
    return `<div class="card ${cls}">
    <div class="qnum">ข้อ ${i + 1}</div>
    <div class="stars">${STARS[q.difficulty]}</div>
    <div class="card-body">
      <div class="emoji-badge">${q.emoji}</div>
      <div class="qtext">${q.q}<div class="rule-tag">${esc(q.tag)}</div></div>
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
  <div class="instructions"><b>คำสั่ง:</b> ดูภาพและอ่านโจทย์แต่ละข้อ แล้วเลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว ข้อสอบเรียงจากง่ายไปยาก</div>
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
    <div class="cheat-box"><h4>ตาราง a / an / the</h4>
      <table><tr><th>คำถัดไป</th><th>ใช้</th></tr>
      <tr><td>เสียงพยัญชนะ</td><td>a</td></tr>
      <tr><td>เสียงสระ</td><td>an</td></tr>
      <tr><td>เจาะจง/กล่าวซ้ำ/หนึ่งเดียว</td><td>the</td></tr></table></div>
    <div class="cheat-box"><h4>ไม่ใช้ article เลย</h4>
      <ul><li>นามพหูพจน์ทั่วไป (Dogs are cute.)</li><li>นามนับไม่ได้ (I drink water.)</li><li>ชื่อเฉพาะส่วนใหญ่ (Thailand, Somchai)</li></ul></div>
    <div class="cheat-box"><h4>คำยกเว้นด้านเสียงต้องจำ</h4>
      <ul><li>an hour, an honest man (h เงียบ)</li><li>a university, a uniform (เสียง yoo)</li><li>a European (เสียง yoor) / an MP (เสียง em)</li></ul></div>
    <div class="cheat-box"><h4>เทคนิคจำเร็ว</h4>
      <ul><li>ฟังเสียง ไม่ดูตัวสะกด</li><li>ครั้งแรก a/an ครั้งที่สอง the</li><li>superlative ต้องมี the เสมอ</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกฎในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากของใกล้ตัวในห้องเรียน ให้นักเรียนฝึกพูด a/an ก่อน แล้วค่อยขยายไปสอน the ตอนกล่าวถึงซ้ำ</li>
    <li>เน้นย้ำเรื่อง "ฟังเสียง ไม่ดูตัวสะกด" ให้นักเรียนออกเสียงคำดัง ๆ ก่อนเลือก a หรือ an ทุกครั้ง</li>
    <li>สอนคำยกเว้นด้านเสียง (hour, university) แยกเป็นกลุ่มพิเศษ เพราะเป็นจุดที่ออกข้อสอบบ่อยที่สุด</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Guess the Object</b> — นักเรียนอธิบายสิ่งของในห้องเรียนด้วย a/an ("It's a book." / "It's an eraser.") เพื่อนทายว่าคืออะไร</li>
    <li><b>Treasure Hunt</b> — ซ่อนของเล็ก ๆ ในห้อง ให้นักเรียนหาแล้วบรรยายด้วย a/an ก่อน จากนั้นพูดถึงซ้ำด้วย the</li>
    <li><b>Sound Sort</b> — แจกบัตรคำ ให้นักเรียนแยกกองว่าคำไหนใช้ a คำไหนใช้ an โดยฟังเสียง ไม่ใช่ดูตัวสะกด (รวมคำยกเว้นอย่าง hour, university)</li>
    <li><b>Story Chain</b> — ให้นักเรียนผลัดกันแต่งประโยคต่อกัน โดยประโยคแรกใช้ a/an แนะนำสิ่งใหม่ ประโยคถัดไปต้องใช้ the พูดถึงสิ่งเดิม</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 โดยเฉพาะคำยกเว้นด้านเสียง เพื่อวางแผนการสอนซ่อมเสริมรายบุคคล</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'บรรยายสิ่งของ 5 ชิ้นในกระเป๋านักเรียนของตัวเอง โดยใช้ a/an (เช่น I have a pencil case. I have an eraser.)',
    'เขียนย่อหน้าสั้น ๆ เกี่ยวกับสัตว์เลี้ยง (หรือสัตว์ที่ชอบ) โดยประโยคแรกใช้ a/an แนะนำ แล้วประโยคถัด ๆ ไปใช้ the พูดถึงซ้ำ',
    'หาคำศัพท์ที่ขึ้นต้นด้วยตัวอักษรสระแต่ใช้ a (หรือขึ้นต้นด้วยพยัญชนะแต่ใช้ an) มา 3 คำ พร้อมเหตุผลว่าทำไม',
    'เขียนประโยค 3 ประโยคโดยไม่ใช้ article เลย เกี่ยวกับสิ่งที่ชอบแบบทั่วไป (เช่น I like cats. I drink milk.)',
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
    <div class="quote">"แค่ฟังเสียง แค่นั้นเอง ก็เก่ง a/an/the ได้แล้ว!" 🌟</div>
    <div class="sub">Article อาจดูเป็นเรื่องเล็ก ๆ แต่เป็นจุดที่ทำให้ประโยคภาษาอังกฤษถูกต้องและเป็นธรรมชาติมากขึ้น ถ้าวันนี้เข้าใจ a/an/the แน่นแล้ว การอ่านและเขียนภาษาอังกฤษจะลื่นไหลขึ้นมาก อย่ากลัวที่จะพูดผิด เพราะทุกความผิดพลาดคือก้าวหนึ่งของการเก่งขึ้น 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง Article: a, an, the ค่ะ',
    'a ใช้หน้าเสียงพยัญชนะ ส่วน an ใช้หน้าเสียงสระ — จำไว้ว่าต้อง "ฟังเสียง" ไม่ใช่ดูตัวสะกด',
    'the ใช้เมื่อเจาะจงแล้ว เคยพูดถึงมาก่อน หรือมีหนึ่งเดียวในโลก เช่น the sun, the moon',
    'บางกรณีไม่ต้องใช้ article เลย เช่น นามพหูพจน์ทั่วไป นามนับไม่ได้ และชื่อเฉพาะส่วนใหญ่',
    'ระวังคำยกเว้นด้านเสียง เช่น an hour, an honest man (h เงียบ) และ a university, a uniform (เสียง yoo)',
    'กล่าวถึงครั้งแรกใช้ a/an พอกล่าวถึงซ้ำให้เปลี่ยนเป็น the ทันที',
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
<title>หนังสือเรียน: A / An / The — ม.3</title>
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
