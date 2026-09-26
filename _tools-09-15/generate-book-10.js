/*
 * "Mini textbook" generator for Chapter 10: WH-Questions.
 * Mirrors the 03-Grammar/_tools/generate-book-0X.js pattern exactly (same
 * shared.css.js, same 20-section skeleton) so this main-course chapter reads
 * as part of the same visual series as Topics 01-08.
 *
 * Usage: node generate-book-10.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-10-wh-questions.json'), 'utf8'));
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
    <div class="cover-emojis">❓ 🔍 🗺️ 🧭 ✨</div>
    <h1 class="cover-title-en">WH-Questions</h1>
    <div class="cover-title-th">What / Where / When / Who / Why / How / Which / Whose</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 บทที่ 10 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Chapter 10 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT ARE WH-QUESTIONS ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  <div class="section-banner sb-c1">
    <div><h1>📖 WH-Questions คืออะไร?</h1><div class="eng">What are WH-Questions?</div></div>
    <div class="chip">ส่วนที่ 2</div>
  </div>
  <p style="font-size:15px;line-height:1.7;">WH-Questions คือคำถามที่ขึ้นต้นด้วยคำกลุ่ม <b>Wh-</b> (What, Where, When, Who, Why, How, Which, Whose) ใช้ถามหาข้อมูลเฉพาะเจาะจง ต่างจากคำถาม Yes/No ที่ตอบแค่ Yes หรือ No — WH-Questions ต้องการคำตอบที่เป็นข้อมูลจริง เช่น สถานที่ เวลา บุคคล เหตุผล ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">What</div>ถามสิ่งของ<div class="ex">What is this?<br>(นี่คืออะไร)</div></div>
    <div class="meaning-box mb2"><div class="word">Where</div>ถามสถานที่<div class="ex">Where do you live?<br>(คุณอาศัยอยู่ที่ไหน)</div></div>
    <div class="meaning-box mb3"><div class="word">Who</div>ถามบุคคล<div class="ex">Who is your teacher?<br>(ครูของคุณคือใคร)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่าแต่ละคำ WH- ใช้ถามคนละเรื่องกัน — นี่คือเหตุผลที่ต้องจำ "หน้าที่" ของแต่ละคำให้แม่น ไม่ใช่แค่ท่องจำคำแปลเฉย ๆ</p>
  <div class="explain-block">
    <h2>🧩 ใช้เมื่อไหร่บ้าง?</h2>
    <table>
      <tr><th>คำ</th><th>ใช้ถาม</th><th>ตัวอย่าง</th></tr>
      <tr><td>What</td><td>สิ่งของ/การกระทำ</td><td>What is your name?</td></tr>
      <tr><td>Where</td><td>สถานที่</td><td>Where is the bathroom?</td></tr>
      <tr><td>When</td><td>เวลา</td><td>When is your birthday?</td></tr>
      <tr><td>Who</td><td>บุคคล (ประธาน)</td><td>Who is your teacher?</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>คำแปล</th></tr>
      <tr><td>What do you want?</td><td>คุณต้องการอะไร</td></tr>
      <tr><td>Where do you live?</td><td>คุณอาศัยอยู่ที่ไหน</td></tr>
      <tr><td>Why are you late?</td><td>ทำไมคุณถึงมาสาย</td></tr>
      <tr><td>How old are you?</td><td>คุณอายุเท่าไหร่</td></tr>
      <tr><td>Whose book is this?</td><td>หนังสือเล่มนี้เป็นของใคร</td></tr>
      <tr><td>Which one do you like?</td><td>คุณชอบอันไหน</td></tr>
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
    <div class="qtext" style="font-size:17px;">โครงสร้างพื้นฐาน: Wh-word + be/aux + Subject + (V)...?</div>
    <p style="margin:6px 0;">ประโยคคำถาม Wh- ส่วนใหญ่เรียงแบบเดียวกับคำถาม Yes/No แค่เติมคำ Wh- ไว้หน้าสุด</p>
    <ul><li>Where do you live? (Present Simple)</li><li>What is she doing? (Present Continuous)</li><li>When did he arrive? (Past Simple)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">กรณีพิเศษ: Who/What เป็นประธานเอง</div>
    <p style="margin:6px 0;">ถ้า Wh-word (มักเป็น Who/What) ทำหน้าที่เป็น<b>ประธาน</b>ของประโยคเอง <b>ไม่ต้องใช้ do/does/did</b> และไม่ต้องกลับโครงสร้าง</p>
    <ul><li>Who broke the window? (ไม่ใช่ "Who did break...")</li><li>What happened to your arm? (ไม่ใช่ "What did happen...")</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">กลุ่ม How + Adjective</div>
    <p style="margin:6px 0;">How จับคู่กับคำคุณศัพท์ได้หลายแบบ แต่ละแบบถามคนละเรื่อง — <b>How many</b> (นับได้) ต่างจาก <b>How much</b> (นับไม่ได้)</p>
    <ul><li>How old are you? (อายุ)</li><li>How many books do you have? (จำนวนนับได้)</li><li>How much is this? (ราคา/ปริมาณนับไม่ได้)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">Which vs What: มีตัวเลือกจำกัดหรือไม่</div>
    <p style="margin:6px 0;">ใช้ <b>Which</b> เมื่อมีตัวเลือกจำกัดให้เลือก (เช่น 2-3 อย่างที่เห็นอยู่) ใช้ <b>What</b> เมื่อถามแบบเปิดกว้างไม่จำกัดตัวเลือก</p>
    <ul><li>Which color do you like, red or blue? (เลือกจาก 2 สี)</li><li>What color do you like? (ถามแบบเปิดกว้าง)</li></ul>
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
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">"WWW-WHW" คาถา 8 คำ WH-</div><p>What-Where-When-Who-Why-How-Which-Whose — ท่องเรียงตามลำดับนี้ให้ขึ้นใจ จะช่วยให้นึกครบทุกคำได้เร็วในห้องสอบ</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">Who เป็นประธาน → ไม่ใช้ do/does/did</div><p>จำว่า "Who ถ้าเป็นประธานเอง ไม่ต้องมีใครมาช่วย" — ตัดกริยาช่วยออกและใช้กริยารูปตรงตัวได้เลย</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">How many นับได้, How much นับไม่ได้</div><p>จำคล้องจอง "many กับ MANY สิ่งที่นับได้ (books, people), much กับ ของเหลว/นามธรรมที่นับไม่ได้ (money, water)"</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">Which = มีตัวเลือกอยู่ตรงหน้า</div><p>ถ้าประโยคบอกตัวเลือกไว้ชัดเจน (เช่น "red or blue", "this one or that one") ให้เลือก Which ทันที ไม่ใช่ What</p></div>
</div>`;
}

/* ---------- SECTION 6: PHONICS CORNER ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔊', 'มุมออกเสียง', 'Phonics Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>คำ</th><th>สัทอักษร (IPA)</th><th>เสียงอ่านแบบไทย</th><th>ตัวอย่างประโยค</th></tr>
      <tr><td><b>what</b></td><td>/wʌt/</td><td>วอท</td><td>What is this? (วอท อิซ ดิส)</td></tr>
      <tr><td><b>where</b></td><td>/weər/</td><td>แวร์</td><td>Where are you? (แวร์ อาร์ ยู)</td></tr>
      <tr><td><b>who</b></td><td>/huː/</td><td>ฮู</td><td>Who is she? (ฮู อิซ ชี)</td></tr>
      <tr><td><b>whose</b></td><td>/huːz/</td><td>ฮูซ</td><td>Whose bag is this? (ฮูซ แบ็ก อิซ ดิส)</td></tr>
      <tr><td><b>which</b></td><td>/wɪtʃ/</td><td>วิช</td><td>Which one? (วิช วัน)</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียง: ระวังคำว่า "who" กับ "how" — who ออกเสียง /huː/ (ฮู ไม่มีเสียง w) ส่วน how ออกเสียง /haʊ/ (เฮา) อย่าสับสนตัวสะกดกับเสียงจริงนะคะ!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['👤', 'person', 'บุคคล'], ['📍', 'place', 'สถานที่'], ['⏰', 'time', 'เวลา'],
    ['🎯', 'reason', 'เหตุผล'], ['🛠️', 'method', 'วิธีการ'], ['🏷️', 'owner', 'เจ้าของ'],
    ['☑️', 'choice', 'ตัวเลือก'], ['🔢', 'amount', 'ปริมาณ'], ['📏', 'distance', 'ระยะทาง'],
    ['⏳', 'duration', 'ระยะเวลา'], ['🔁', 'frequency', 'ความถี่'], ['🎂', 'age', 'อายุ'],
    ['💰', 'price', 'ราคา'], ['❓', 'question word', 'คำคำถาม'], ['💬', 'information', 'ข้อมูล'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้บอก "ประเภทข้อมูล" ที่แต่ละคำ WH- ใช้ถามหา — เข้าใจกลุ่มนี้แล้วจะเลือกคำ WH- ได้แม่นยำขึ้น</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">ทั่วไป: Wh-word + be/aux + Subject + (V)...?</div>
    <div class="pex">Where do you live? <span class="th">(คุณอาศัยอยู่ที่ไหน)</span></div>
    <div class="pex">What is she doing? <span class="th">(เธอกำลังทำอะไรอยู่)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">Who/What เป็นประธาน: Who/What + V...?</div>
    <div class="pex">Who broke the window? <span class="th">(ใครทำหน้าต่างแตก)</span></div>
    <div class="pex">What happened? <span class="th">(เกิดอะไรขึ้น)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">How + Adjective: How + old/much/many/far/long/often + be/aux + S?</div>
    <div class="pex">How old are you? <span class="th">(คุณอายุเท่าไหร่)</span></div>
    <div class="pex">How many books do you have? <span class="th">(คุณมีหนังสือกี่เล่ม)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">Whose/Which + Noun: Whose/Which + noun + be/aux + S?</div>
    <div class="pex">Whose book is this? <span class="th">(หนังสือเล่มนี้เป็นของใคร)</span></div>
    <div class="pex">Which color do you like? <span class="th">(คุณชอบสีอะไร)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาในชีวิตประจำวัน', 'Daily Conversation', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🧑‍🤝‍🧑 บทสนทนาที่ 1: ทำความรู้จักกัน (Getting to Know You)</div>
    <div class="bubble left"><div class="speaker">Ann</div>Hi! What's your name and where are you from?<div class="th">สวัสดี คุณชื่ออะไรและมาจากไหน</div></div>
    <div class="bubble right"><div class="speaker">Somchai</div>I'm Somchai. I'm from Chiang Mai. How about you?<div class="th">ผมชื่อสมชาย มาจากเชียงใหม่ครับ แล้วคุณล่ะ</div></div>
    <div class="bubble left"><div class="speaker">Ann</div>I'm Ann. Why did you move to Bangkok?<div class="th">ฉันชื่อแอน ทำไมคุณถึงย้ายมากรุงเทพ</div></div>
    <div class="bubble right"><div class="speaker">Somchai</div>Because I study at a university here.<div class="th">เพราะผมเรียนมหาวิทยาลัยที่นี่ครับ</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🛍️ บทสนทนาที่ 2: ที่ร้านค้า (At the Shop)</div>
    <div class="bubble left"><div class="speaker">Ploy</div>Excuse me, how much is this bag?<div class="th">ขอโทษนะคะ กระเป๋าใบนี้ราคาเท่าไหร่</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>It's 300 baht. Which color do you want, black or brown?<div class="th">300 บาทครับ คุณต้องการสีไหน สีดำหรือสีน้ำตาล</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>I'll take the black one. Whose design is this?<div class="th">เอาสีดำค่ะ นี่เป็นดีไซน์ของใครคะ</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>It's designed by a local Thai artist.<div class="th">ออกแบบโดยศิลปินไทยครับ</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['Who did break the window?', 'Who เป็นประธานเอง ห้ามใช้ did ซ้ำกับกริยารูปอดีต', 'Who broke the window?'],
    ['What old are you?', 'How old เป็นวลีคงที่ ต้องใช้ How ไม่ใช่ What', 'How old are you?'],
    ['How many money do you have?', 'money นับไม่ได้ ต้องใช้ How much', 'How much money do you have?'],
    ['Whose is this bag?', 'Whose ต้องตามด้วยคำนามทันที ไม่ใช่ตามด้วย is', 'Whose bag is this?'],
    ['What bus do you take? (มีแค่ 2 คัน)', 'มีตัวเลือกจำกัดชัดเจน ต้องใช้ Which ไม่ใช่ What', 'Which bus do you take?'],
    ['Where you live?', 'ลืมใส่กริยาช่วย do ในประโยคคำถาม Present Simple', 'Where do you live?'],
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
    'ดูก่อนว่า Who/What ในโจทย์ทำหน้าที่เป็นประธานหรือเปล่า — ถ้าใช่ ห้ามใช้ do/does/did',
    'แยกให้ออกว่าคำนามหลัง How many/How much นับได้หรือนับไม่ได้ ก่อนเลือกคำ',
    'ถ้าโจทย์มีตัวเลือกจำกัดชัดเจน (this or that, A or B) ให้เลือก Which แทน What',
    'Whose ต้องตามด้วยคำนามเสมอ (Whose + noun), ไม่ใช่ตามด้วย is/are ตรง ๆ',
    'Why มักตอบด้วย Because เสมอ — ใช้ตรวจคำตอบให้สอดคล้องกับคำถาม',
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
    <div class="mindmap-center">WH-Questions</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">🔤 8 คำหลัก</span>What/Where/When/Who/Why/How/Which/Whose</div>
      <div class="mindmap-branch mb-b"><span class="bt">🧩 โครงสร้าง</span>Wh-word + be/aux + S + (V)?</div>
      <div class="mindmap-branch mb-c"><span class="bt">⚠️ Who/What เป็นประธาน</span>ไม่ต้องใช้ do/does/did</div>
      <div class="mindmap-branch mb-d"><span class="bt">📏 How + Adjective</span>old/much/many/far/long/often</div>
      <div class="mindmap-branch mb-e"><span class="bt">☑️ Which vs What</span>มีตัวเลือกจำกัด vs ถามเปิดกว้าง</div>
      <div class="mindmap-branch mb-f"><span class="bt">🏷️ Whose</span>ถามความเป็นเจ้าของ + ตามด้วยคำนาม</div>
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
    <div class="cheat-box"><h4>8 คำ WH-</h4>
      <table><tr><th>คำ</th><th>ถามอะไร</th></tr>
      <tr><td>What</td><td>สิ่งของ/การกระทำ</td></tr>
      <tr><td>Where</td><td>สถานที่</td></tr>
      <tr><td>When</td><td>เวลา</td></tr>
      <tr><td>Who</td><td>บุคคล</td></tr></table></div>
    <div class="cheat-box"><h4>อีก 4 คำ</h4>
      <ul><li>Why: เหตุผล (ตอบด้วย Because)</li><li>How: วิธีการ/สภาพ/ปริมาณ</li><li>Which: เลือกจากตัวเลือกจำกัด</li><li>Whose: ความเป็นเจ้าของ</li></ul></div>
    <div class="cheat-box"><h4>How + Adjective</h4>
      <ul><li>How old (อายุ), How much (นับไม่ได้)</li><li>How many (นับได้), How far/long/often</li></ul></div>
    <div class="cheat-box"><h4>ข้อควรระวัง</h4>
      <ul><li>Who/What เป็นประธาน → ไม่ใช้ do/does/did</li><li>Which เมื่อมีตัวเลือกจำกัด</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกฎในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากคำถามเกี่ยวกับตัวนักเรียนเอง (ชื่อ, บ้าน, อายุ) ก่อนขยายไปสถานการณ์อื่น</li>
    <li>เน้นย้ำกรณีพิเศษ Who/What เป็นประธาน เพราะเป็นจุดที่นักเรียนสับสนบ่อยที่สุด</li>
    <li>ฝึกแยก How many/How much ด้วยการจัดกลุ่มคำนามนับได้-นับไม่ได้ก่อนเข้าโจทย์จริง</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>20 Questions Game</b> — นักเรียนถามคำถาม Wh- เพื่อทายสิ่งของ/บุคคลที่เพื่อนนึกไว้ในใจ</li>
    <li><b>Detective Day</b> — สวมบทนักสืบถามคำถาม "Who...? What...? Why...?" เพื่อไขคดีสมมติในห้องเรียน</li>
    <li><b>Interview Chain</b> — ให้นักเรียนผลัดกันถามเพื่อนด้วยคำถาม Wh- คนละ 1 คำถาม ต่อกันเป็นวงกลม</li>
    <li><b>Which One? Guessing</b> — ครูถือของ 2-3 ชิ้น ให้นักเรียนถาม "Which one is yours?"</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 โดยเฉพาะ Who/What เป็นประธาน เพื่อวางแผนการสอนซ่อมเสริม</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'เขียนคำถาม Wh- 8 ข้อ (คนละคำ) ถามเกี่ยวกับเพื่อนสนิทของตัวเอง แล้วตอบด้วย',
    'สัมภาษณ์คนในครอบครัว 1 คน ด้วยคำถาม Who/What/Where/When/Why อย่างน้อยคนละคำถาม',
    'เขียนบทสนทนาสั้น 4 ประโยคที่มีคำถาม Which หรือ Whose อย่างน้อย 1 ข้อ',
    'หาคำถาม Wh- จากเพลงหรือหนังที่ชอบ 3 ประโยค แล้วแปลไทย'
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
    <div class="quote">"คำถามที่ดีคือจุดเริ่มต้นของการเรียนรู้ทุกอย่าง" 🌟</div>
    <div class="sub">WH-Questions เป็นเครื่องมือสำคัญที่ทำให้เราสื่อสารและเรียนรู้สิ่งใหม่ ๆ ได้ ถ้าวันนี้ใช้คำ Wh- ทั้ง 8 คำได้คล่องแล้ว การสนทนาภาษาอังกฤษจะง่ายขึ้นมาก อย่ากลัวที่จะถามคำถาม เพราะทุกคำถามคือก้าวหนึ่งของความเข้าใจ 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง WH-Questions ค่ะ มีคำสำคัญ 8 คำ: What, Where, When, Who, Why, How, Which, Whose',
    'แต่ละคำถามหาข้อมูลคนละแบบ — จำหน้าที่ของแต่ละคำให้แม่น ไม่ใช่แค่ท่องจำคำแปล',
    'ระวังกรณีพิเศษ: ถ้า Who/What เป็นประธานของประโยคเอง ไม่ต้องใช้ do/does/did',
    'How many ใช้กับคำนามนับได้ ส่วน How much ใช้กับคำนามนับไม่ได้',
    'Which ใช้เมื่อมีตัวเลือกจำกัดให้เลือก ส่วน What ใช้ถามแบบเปิดกว้าง',
    'Whose ต้องตามด้วยคำนามเสมอ เช่น Whose bag, Whose car',
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
<title>หนังสือเรียน: WH-Questions — ม.3</title>
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
