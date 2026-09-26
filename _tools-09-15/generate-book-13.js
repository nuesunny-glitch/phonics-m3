/*
 * "Mini textbook" generator for Chapter 13: Error Detection.
 * Mirrors the 03-Grammar/_tools/generate-book-0X.js pattern exactly (same
 * shared.css.js, same 20-section skeleton) so this main-course chapter reads
 * as part of the same visual series as Topics 01-08. The "Grammar Rules"
 * section is adapted into 8 error-point cards (Subject-Verb Agreement,
 * Tense, Verb Form, Article, Preposition, Plural Noun, Adjective/Adverb,
 * Word Order) since this chapter is a cross-cutting review, not a single
 * new grammar point.
 *
 * Usage: node generate-book-13.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-13-error-detection.json'), 'utf8'));
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
    <div class="cover-emojis">🔍 ⚠️ 🕵️ ✅ ✨</div>
    <h1 class="cover-title-en">Error Detection</h1>
    <div class="cover-title-th">จับผิดประโยค (Error Detection)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 บทที่ 13 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Chapter 13 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT IS ERROR DETECTION ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  <div class="section-banner sb-c1">
    <div><h1>📖 Error Detection คืออะไร?</h1><div class="eng">What is Error Detection?</div></div>
    <div class="chip">ส่วนที่ 2</div>
  </div>
  <p style="font-size:15px;line-height:1.7;">Error Detection (จับผิดประโยค) เป็นรูปแบบข้อสอบยอดนิยมในข้อสอบเข้า ม.4 โจทย์จะแบ่งประโยคออกเป็น 4 ส่วน (มักขีดเส้นใต้กำกับ A, B, C, D) แล้วให้หาว่าส่วนไหน<b>ผิดหลักไวยากรณ์</b> บทนี้รวบรวม 8 จุดที่ข้อสอบชอบออกจับผิดมากที่สุด โดยอ้างอิงจากทุกบทแกรมม่าที่เรียนมาก่อนหน้า ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">S-V Agreement</div>ประธาน-กริยา<div class="ex">She (A)go → goes<br>(ประธาน she ต้องเติม s)</div></div>
    <div class="meaning-box mb2"><div class="word">Article</div>a/an<div class="ex">I have (B)a apple → an<br>(apple ขึ้นต้นเสียงสระ)</div></div>
    <div class="meaning-box mb3"><div class="word">Plural Noun</div>พหูพจน์ไม่ปกติ<div class="ex">two (C)childs → children<br>(พหูพจน์ไม่ปกติ)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่าแต่ละจุดผิดมาจากกฎที่เคยเรียนมาแล้วทั้งสิ้น — บทนี้จึงเป็นการนำความรู้จากหลายบทมา "ใช้จับผิด" ไม่ใช่เนื้อหาใหม่ทั้งหมด</p>
  <div class="explain-block">
    <h2>🧩 8 จุดที่ควรตรวจสอบ</h2>
    <table>
      <tr><th>จุดที่</th><th>ตัวอย่างผิด</th><th>ตัวอย่างถูก</th></tr>
      <tr><td>1. S-V Agreement</td><td>She go to school.</td><td>She goes to school.</td></tr>
      <tr><td>2. Tense</td><td>I go yesterday.</td><td>I went yesterday.</td></tr>
      <tr><td>3. Verb Form หลัง Aux</td><td>She did not played.</td><td>She did not play.</td></tr>
      <tr><td>4. Article</td><td>I have a apple.</td><td>I have an apple.</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>ผิดที่/แก้เป็น</th></tr>
      <tr><td>We meet in Monday.</td><td>on Monday (Preposition)</td></tr>
      <tr><td>I have two childs.</td><td>children (Plural Noun)</td></tr>
      <tr><td>She sings beautiful.</td><td>beautifully (Adverb)</td></tr>
      <tr><td>I have a dog big.</td><td>a big dog (Word Order)</td></tr>
    </table>
  </div>
</div>`;
}

/* ---------- SECTION 3: 8 ERROR POINTS STEP BY STEP (adapted from Grammar Rules) ---------- */
function s3() {
  return `<div class="sheet" id="s3">
  ${banner('sb-c2', '🧩', '8 จุดที่ควรตรวจสอบ ทีละจุด', '8 Key Error Points Step by Step', 'ส่วนที่ 3')}
  <div class="step-card sc1">
    <span class="step-label">STEP 1</span>
    <div class="qtext" style="font-size:17px;">Subject-Verb Agreement และ Tense</div>
    <p style="margin:6px 0;">ประธาน he/she/it ต้องเติม -s/-es ที่กริยาใน Present Simple และดูคำสัญญาณเวลาในประโยคเสมอ (yesterday→Past, now→Continuous)</p>
    <ul><li>She (A)go → goes (S-V Agreement)</li><li>I (A)go to Chiang Mai yesterday → went (Tense)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">Verb Form หลัง Auxiliary และ Article (a/an)</div>
    <p style="margin:6px 0;">หลัง did/does/do/will/can ต้องใช้กริยารูปเดิม (base form) เสมอ — a ใช้หน้าเสียงพยัญชนะ, an ใช้หน้าเสียงสระ</p>
    <ul><li>She did not (B)played → play (Verb Form)</li><li>I have (B)a apple → an apple (Article)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">Preposition และ Plural Noun</div>
    <p style="margin:6px 0;">in (เดือน/ปี/ฤดู), on (วัน), at (เวลา/สถานที่เจาะจง) — ระวังคำนามพหูพจน์ไม่ปกติ (children, feet, mice)</p>
    <ul><li>I was born (A)on 2010 → in 2010 (Preposition)</li><li>I have two (C)childs → children (Plural Noun)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">Adjective/Adverb และ Word Order</div>
    <p style="margin:6px 0;">Adjective ขยายคำนาม, Adverb ขยายกริยา (ลงท้าย -ly) — และ Adjective ต้องอยู่หน้าคำนามเสมอในภาษาอังกฤษ</p>
    <ul><li>She sings (A)beautiful → beautifully (Adverb)</li><li>I have a (C)dog big → a big dog (Word Order)</li></ul>
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
  <div class="tip-card">💡 เคล็ดลับ: ท่องตารางนี้ให้ขึ้นใจ เพราะทุกกฎในบทนี้อ้างอิงจากตารางเดียวนี้ทั้งหมด!</div>
</div>`;
}

/* ---------- SECTION 5: MEMORY TRICKS ---------- */
function s5() {
  return `<div class="sheet" id="s5">
  ${banner('sb-c4', '🧠', 'เทคนิคการจำ', 'Memory Tricks', 'ส่วนที่ 5')}
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">"เช็กประธานก่อนเสมอ"</div><p>เจอประโยคให้จับผิด ให้วงกลมประธานก่อนอันดับแรก แล้วถามตัวเองว่า he/she/it ต้องเติม s ที่กริยาหรือยัง</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">"เจอ do/does/did/will/can → มองกริยาถัดไป"</div><p>ถ้าเจอกริยาช่วยเหล่านี้ กริยาที่ตามมาต้องเป็น base form เสมอ ห้ามเติม -s/-ed/-ing</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">"คำนามพิเศษ = พหูพจน์ไม่ปกติ"</div><p>ท่องจำคำนามที่ไม่เติม s แบบปกติ: children, feet, teeth, mice, men, people, leaves, knives</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">"Adjective อยู่หน้าคำนามเสมอ"</div><p>ภาษาอังกฤษเรียง Adjective ไว้หน้าคำนามเสมอ (a big dog ไม่ใช่ a dog big) ตรงข้ามกับภาษาไทย</p></div>
</div>`;
}

/* ---------- SECTION 6: EXAM FORMAT CORNER (adapted from Phonics Corner) ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '📐', 'มุมรูปแบบข้อสอบ', 'Exam Format Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>ส่วน</th><th>ลักษณะ</th><th>ตัวอย่าง</th></tr>
      <tr><td><b>A</b></td><td>มักเป็นประธาน/กริยาแรกของประโยค</td><td>She (A)go...</td></tr>
      <tr><td><b>B</b></td><td>มักเป็นกริยาหลัก/บุพบท</td><td>...to school (B)every day...</td></tr>
      <tr><td><b>C</b></td><td>มักเป็นคำคุณศัพท์/คำนาม</td><td>...(C)childs...</td></tr>
      <tr><td><b>D</b></td><td>มักเป็นส่วนท้ายประโยค/คำสัญญาณเวลา</td><td>...(D)yesterday.</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดการทำข้อสอบ: บางข้ออาจไม่มีจุดผิดเลย (ประโยคถูกต้องทั้งหมด) — อย่าเดามั่วว่าต้องมีจุดผิดเสมอ ให้ตรวจสอบทีละส่วนอย่างรอบคอบก่อนสรุปคำตอบนะคะ!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['👤', 'subject', 'ประธาน'], ['🔤', 'verb', 'กริยา'], ['📅', 'tense', 'กาล/เวลา'],
    ['🔧', 'auxiliary', 'กริยาช่วย'], ['📰', 'article', 'คำนำหน้านาม'], ['📍', 'preposition', 'คำบุพบท'],
    ['👥', 'plural', 'พหูพจน์'], ['🎨', 'adjective', 'คำคุณศัพท์'], ['🏃', 'adverb', 'คำกริยาวิเศษณ์'],
    ['🔢', 'word order', 'ลำดับคำ'], ['❌', 'error', 'ข้อผิดพลาด'], ['✅', 'correct', 'ถูกต้อง'],
    ['🔍', 'detect', 'ตรวจจับ'], ['📝', 'sentence', 'ประโยค'], ['🧩', 'grammar rule', 'กฎไวยากรณ์'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้เป็นศัพท์ไวยากรณ์พื้นฐานที่ใช้อธิบาย 8 จุดที่ควรตรวจสอบในบทนี้</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS (adapted: checking-order patterns) ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'ลำดับการตรวจสอบประโยค', 'Checking-Order Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">ขั้น 1: หาประธานและกริยาแรก</div>
    <div class="pex">She (A)go... <span class="th">(ประธาน she + กริยาที่ยังไม่เติม s)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">ขั้น 2: มองหา do/does/did/will/can</div>
    <div class="pex">She did not (B)played... <span class="th">(หลัง did not ต้องเป็น base form)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">ขั้น 3: ตรวจ Article, Preposition, Plural Noun</div>
    <div class="pex">I have (B)a apple... / two (C)childs... <span class="th">(an apple / children)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">ขั้น 4: ตรวจ Adjective/Adverb และ Word Order</div>
    <div class="pex">She sings (A)beautiful... / a (C)dog big <span class="th">(beautifully / a big dog)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: WORKED EXAMPLES (adapted from Daily Conversation) ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '🕵️', 'ตัวอย่างการวิเคราะห์โจทย์', 'Worked Examples', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🔍 ตัวอย่างที่ 1: วิเคราะห์ทีละขั้น</div>
    <div class="bubble left" style="max-width:100%;"><b>โจทย์:</b> He (A)did not (B)went (C)to the party (D)last night.</div>
    <div class="bubble right" style="max-width:100%;background:#D9F7EC;"><b>ขั้นที่ 1:</b> มองหา did not → เจอที่ A<br><b>ขั้นที่ 2:</b> หลัง did not ต้องเป็น base form ไม่ใช่ went<br><b>สรุป:</b> ผิดที่ B ต้องแก้เป็น go</div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🔍 ตัวอย่างที่ 2: วิเคราะห์ทีละขั้น</div>
    <div class="bubble left" style="max-width:100%;"><b>โจทย์:</b> She (A)has (B)three (C)childs (D)at home.</div>
    <div class="bubble right" style="max-width:100%;background:#D9F7EC;"><b>ขั้นที่ 1:</b> ตรวจประธาน-กริยา She has ถูกต้องแล้ว<br><b>ขั้นที่ 2:</b> ตรวจคำนามพหูพจน์ childs ไม่ถูกต้อง<br><b>สรุป:</b> ผิดที่ C ต้องแก้เป็น children</div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['She (A)go to school every day.', 'ประธาน she ต้องเติม s ที่กริยา', 'She (A)goes to school every day.'],
    ['I (A)saw a elephant yesterday.', 'elephant ขึ้นต้นเสียงสระ ต้องใช้ an', 'I saw (A)an elephant yesterday.'],
    ['He did not (A)played football.', 'หลัง did not ต้องใช้กริยารูปเดิม', 'He did not (A)play football.'],
    ['They are (A)play football now.', 'หลัง are ต้องเติม -ing', 'They are (A)playing football now.'],
    ['We meet (A)in Monday.', 'วันใช้ on ไม่ใช่ in', 'We meet (A)on Monday.'],
    ['I have a dog (A)big.', 'Adjective ต้องอยู่หน้าคำนามเสมอ', 'I have (A)a big dog.'],
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
    'ตรวจสอบทีละจุดตามลำดับ: ประธาน-กริยา → กริยาช่วย → article/preposition → plural noun → adjective/adverb → word order',
    'อย่าลืมว่าบางข้ออาจไม่มีจุดผิดเลย ให้ตรวจครบทุกส่วนก่อนสรุปคำตอบ',
    'ถ้าเจอ do/does/did/will/can/should ให้เพ่งความสนใจไปที่กริยาถัดไปทันที',
    'ท่องจำคำนามพหูพจน์ไม่ปกติให้ขึ้นใจ เพราะมักเป็นจุดที่ข้อสอบชอบออก',
    'ฝึกแปลประโยคเป็นไทยคร่าว ๆ ในใจ จะช่วยให้สังเกตลำดับคำผิดปกติได้ง่ายขึ้น',
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
    <div class="mindmap-center">Error Detection (8 จุด)</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">1-2. S-V Agreement / Tense</span>he/she/it +s/es, คำสัญญาณเวลา</div>
      <div class="mindmap-branch mb-b"><span class="bt">3-4. Verb Form / Article</span>base form หลัง aux, a/an ตามเสียง</div>
      <div class="mindmap-branch mb-c"><span class="bt">5-6. Preposition / Plural</span>in-on-at, พหูพจน์ไม่ปกติ</div>
      <div class="mindmap-branch mb-d"><span class="bt">7-8. Adj-Adv / Word Order</span>ขยายนาม/กริยา, adj หน้านามเสมอ</div>
      <div class="mindmap-branch mb-e"><span class="bt">🔍 วิธีทำ</span>ตรวจทีละจุดตามลำดับ</div>
      <div class="mindmap-branch mb-f"><span class="bt">⚠️ ระวัง</span>บางข้ออาจไม่มีจุดผิด</div>
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
  <div class="instructions"><b>คำสั่ง:</b> อ่านโจทย์แต่ละข้อ แล้วเลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว ข้อสอบเรียงจากง่ายไปยาก</div>
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
    <div class="cheat-box"><h4>4 จุดแรก</h4>
      <table><tr><th>จุด</th><th>กฎ</th></tr>
      <tr><td>S-V Agreement</td><td>he/she/it +s/es</td></tr>
      <tr><td>Tense</td><td>ดูคำสัญญาณเวลา</td></tr>
      <tr><td>Verb Form หลัง Aux</td><td>base form เสมอ</td></tr>
      <tr><td>Article</td><td>a/an ตามเสียง</td></tr></table></div>
    <div class="cheat-box"><h4>4 จุดหลัง</h4>
      <ul><li>Preposition: in/on/at</li><li>Plural Noun: children/feet/mice</li><li>Adjective/Adverb: -ly ขยายกริยา</li><li>Word Order: adj หน้านามเสมอ</li></ul></div>
    <div class="cheat-box"><h4>ลำดับการตรวจ</h4>
      <ul><li>ประธาน-กริยา → กริยาช่วย</li><li>article/prep → plural noun</li><li>adj/adv → word order</li></ul></div>
    <div class="cheat-box"><h4>ข้อควรระวัง</h4>
      <ul><li>บางข้ออาจไม่มีจุดผิด</li><li>ตรวจครบทุกส่วนก่อนตอบ</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกจุดในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากทบทวนกฎที่เรียนมาแล้วในบทก่อนหน้าก่อนเข้าสู่การจับผิดจริง</li>
    <li>สอนให้นักเรียนตรวจสอบทีละจุดอย่างเป็นระบบ ไม่ใช่เดามั่วจากความรู้สึก</li>
    <li>เน้นย้ำว่าบางข้ออาจไม่มีจุดผิดเลย เพื่อฝึกให้นักเรียนไม่ด่วนสรุปเร็วเกินไป</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Grammar Detective</b> — แจกประโยคผิดให้นักเรียนจับคู่กันหาจุดผิดและแข่งกันตอบเร็วที่สุด</li>
    <li><b>Fix My Sentence</b> — ครูพูดประโยคผิดปากเปล่า ให้นักเรียนช่วยกันแก้เป็นประโยคที่ถูกต้อง</li>
    <li><b>Error Bingo</b> — แจกตารางบิงโกที่มี 8 จุดผิด ครูอ่านประโยค นักเรียนทายว่าเป็นจุดผิดประเภทไหน</li>
    <li><b>Peer Editing</b> — ให้นักเรียนแลกเปลี่ยนงานเขียนของตัวเองแล้วช่วยกันหาจุดผิด 8 ประเภทนี้</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตว่านักเรียนพลาดจุดไหนบ่อยที่สุดจากส่วนที่ 10 เพื่อวางแผนการสอนซ่อมเสริมเฉพาะจุด</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'หาประโยคภาษาอังกฤษ 5 ประโยคจากหนังสือ/อินเทอร์เน็ต แล้วตรวจสอบว่าถูกหลักไวยากรณ์ทั้ง 8 จุดหรือไม่',
    'แต่งประโยคผิดเอง 3 ประโยค (คนละจุดผิด) แล้วให้เพื่อนช่วยจับผิดและแก้ไข',
    'ทบทวนสมุดจดของตัวเอง หาจุดที่เคยเขียนผิดตามหลัก 8 จุดในบทนี้ แล้วแก้ไขให้ถูกต้อง',
    'เขียนย่อหน้าสั้น 4-5 ประโยคเกี่ยวกับตัวเอง แล้วตรวจสอบตัวเองว่ามีจุดผิดตามหลัก 8 จุดหรือไม่'
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
    <div class="quote">"นักสืบที่เก่งที่สุด คือคนที่มองอย่างรอบคอบ" 🌟</div>
    <div class="sub">การจับผิดประโยคไม่ใช่แค่การท่องกฎ แต่คือการนำความรู้จากทุกบทที่เรียนมารวมกันแล้วใช้จริง ถ้าวันนี้ตรวจสอบได้ครบทั้ง 8 จุดแล้ว นักเรียนจะพร้อมมากสำหรับข้อสอบเข้า ม.4 อย่ากลัวที่จะตรวจสอบซ้ำ เพราะความรอบคอบคือกุญแจสำคัญ 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง Error Detection ค่ะ รวม 8 จุดที่ข้อสอบเข้า ม.4 ชอบออกจับผิดมากที่สุด',
    'Subject-Verb Agreement และ Tense คือการเช็กประธาน-กริยาและคำสัญญาณเวลาให้ตรงกัน',
    'Verb Form หลัง Auxiliary ต้องเป็น base form เสมอ (หลัง do/does/did/will/can)',
    'Article (a/an) ดูจากเสียง ไม่ใช่ตัวสะกด และ Preposition ดูจาก in/on/at ให้ตรงบริบท',
    'Plural Noun ระวังคำนามพหูพจน์ไม่ปกติ เช่น children, feet, mice',
    'Adjective/Adverb และ Word Order — adjective ต้องอยู่หน้าคำนามเสมอในภาษาอังกฤษ',
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
<title>หนังสือเรียน: Error Detection — ม.3</title>
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
