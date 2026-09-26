/*
 * One-off "mini textbook" generator for Lesson 05: How Questions.
 * Reuses data-05-how-questions.json (already verified: grammar tables, tips,
 * worksheet, 50-question quiz, answer key) so this book's practice content
 * stays byte-consistent with the standalone quiz-pack files, and hand-authors
 * the extra storybook sections (cover, phonics, vocabulary, dialogues, mind
 * map, cheat sheet, teacher notes, homework, motivation, summary).
 *
 * Usage: node generate-book-05.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-05-how-questions.json'), 'utf8'));
const outDir = path.join(__dirname, '..', '05-How Questions');
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
    <div class="cover-emojis">🤔 ❓ 💰 📏 🚌</div>
    <h1 class="cover-title-en">How Questions</h1>
    <div class="cover-title-th">คำถามขึ้นต้นด้วย How (How much / How many / How often / How long / How far / How old)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 เล่มที่ 5 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Lesson 05 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT ARE HOW QUESTIONS ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  ${banner('sb-c1', '🤔', 'How Questions คืออะไร?', 'What are How Questions?', 'ส่วนที่ 2')}
  <p style="font-size:15px;line-height:1.7;">How แปลว่า "อย่างไร" แต่ How ไม่ได้ถามแค่แบบเดียว มันใช้ถามได้หลายเรื่องมาก ขึ้นอยู่กับคำที่ตามมา — ตั้งแต่ถามความรู้สึก ถามลักษณะ/ปริมาณ ถามจำนวน ไปจนถึงถามวิธีการ ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">อาการ</div>ถามความเป็นอยู่<div class="ex">How are you?<br>(คุณเป็นอย่างไรบ้าง)</div></div>
    <div class="meaning-box mb2"><div class="word">ลักษณะ</div>ถามอายุ/ความสูง/ระยะทาง<div class="ex">How old are you?<br>(คุณอายุเท่าไหร่)</div></div>
    <div class="meaning-box mb3"><div class="word">จำนวน</div>ถามปริมาณ/ราคา<div class="ex">How much is this?<br>(นี่ราคาเท่าไหร่)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่าทุกประโยคขึ้นต้นด้วย <b>How</b> เหมือนกัน แต่ความหมายต่างกันมากตามคำที่ตามมา — นี่คือเหตุผลที่ต้องสังเกต "คำหลัง How" ให้ดีก่อนแปลหรือตอบคำถาม</p>
  <div class="explain-block">
    <h2>🧩 ใช้เมื่อไหร่บ้าง?</h2>
    <table>
      <tr><th>รูปแบบ</th><th>ใช้เมื่อ</th><th>ตัวอย่าง</th></tr>
      <tr><td>How + is/am/are</td><td>ถามความเป็นอยู่/สภาพ</td><td>How is the weather?</td></tr>
      <tr><td>How + adjective</td><td>ถามอายุ/ความสูง/ระยะทาง/เวลา/ความถี่</td><td>How far is it?</td></tr>
      <tr><td>How much</td><td>ถามปริมาณนามนับไม่ได้ หรือราคา</td><td>How much is this bag?</td></tr>
      <tr><td>How many</td><td>ถามจำนวนนามนับได้</td><td>How many books?</td></tr>
      <tr><td>How + do/does/did</td><td>ถามวิธีการ/การเดินทาง</td><td>How do you go to school?</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>คำแปล</th></tr>
      <tr><td>How are you today?</td><td>วันนี้คุณเป็นอย่างไรบ้าง</td></tr>
      <tr><td>How old is your brother?</td><td>น้องชายคุณอายุเท่าไหร่</td></tr>
      <tr><td>How much is this shirt?</td><td>เสื้อตัวนี้ราคาเท่าไหร่</td></tr>
      <tr><td>How many students are there?</td><td>มีนักเรียนกี่คน</td></tr>
      <tr><td>How do you go to school?</td><td>คุณไปโรงเรียนอย่างไร</td></tr>
      <tr><td>How often do you exercise?</td><td>คุณออกกำลังกายบ่อยแค่ไหน</td></tr>
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
    <div class="qtext" style="font-size:17px;">How + is/am/are — ถามความเป็นอยู่หรือสภาพ</div>
    <p style="margin:6px 0;">ใช้ทักทายหรือถามสภาพของคน สิ่งของ หรืออากาศ ไม่ได้ถามจำนวนหรือปริมาณเลย</p>
    <ul><li>How are you? (คุณเป็นอย่างไรบ้าง)</li><li>How is the weather? (อากาศเป็นอย่างไรบ้าง)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">How + adjective — ถามข้อมูลเฉพาะเจาะจง</div>
    <p style="margin:6px 0;">เติมคำคุณศัพท์ต่อท้าย How เพื่อถามเรื่องเฉพาะ เช่น อายุ ความสูง ระยะทาง ระยะเวลา ความถี่</p>
    <ul><li>How old are you? (คุณอายุเท่าไหร่)</li><li>How often do you exercise? (คุณออกกำลังกายบ่อยแค่ไหน)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">How much (นับไม่ได้/ราคา) vs How many (นับได้)</div>
    <p style="margin:6px 0;">How much ใช้กับนามนับไม่ได้หรือถามราคา ส่วน How many ใช้กับนามนับได้ที่ต้องเป็นรูปพหูพจน์เสมอ</p>
    <ul><li>How much water do you drink? (คุณดื่มน้ำเท่าไหร่)</li><li>How many books do you have? (คุณมีหนังสือกี่เล่ม)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">How + do/does/did — ถามวิธีการ</div>
    <p style="margin:6px 0;">ใช้ถามวิธีการทำสิ่งใดสิ่งหนึ่ง หรือถามว่าเดินทางด้วยวิธีใด โครงสร้างเหมือนประโยคคำถามธรรมดา</p>
    <ul><li>How do you go to school? (คุณไปโรงเรียนอย่างไร)</li><li>How did you get here? (คุณมาถึงที่นี่ได้อย่างไร)</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE ---------- */
function s4() {
  const rowsHtml = data.summaryTable.rows.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[2])}</td><td>${esc(r[1])}</td></tr>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'ตารางสรุป', 'Summary Table', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr><th>How-question type</th><th>Example</th><th>ใช้กับ</th></tr>
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
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">How much = นับไม่ได้</div><p>How much ใช้กับของที่นับเป็นชิ้นไม่ได้ เช่น เงิน น้ำ ข้าว — จำคล้องจอง "much ไม่มี s เหมือนเงิน น้ำ ข้าว ที่นับไม่ได้"</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">How many = นับได้</div><p>How many ใช้กับของที่นับเป็นชิ้นได้ เช่น คน หนังสือ ต้องเติม s เสมอ — จำว่า "many มี s เหมือนนามพหูพจน์"</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">คาถา "5 ตัวร้ายนับไม่ได้"</div><p>ท่องจำกลุ่มคำที่ดูเหมือนนับได้แต่จริง ๆ นับไม่ได้: <b>money, rice, homework, information, luggage</b> — "เงิน ข้าว การบ้าน ข้อมูล กระเป๋า" ห้ามเติม s เด็ดขาด!</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">คำคล้องจอง How + adjective</div><p>ท่องจังหวะ "How OLD is your age, How TALL is your height, How FAR is the way, How LONG through the day, How OFTEN every week!" ช่วยจำคู่คำถามได้แม่นขึ้นมาก</p></div>
</div>`;
}

/* ---------- SECTION 6: PHONICS CORNER ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔊', 'มุมออกเสียง', 'Phonics Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>คำ</th><th>สัทอักษร (IPA)</th><th>เสียงอ่านแบบไทย</th><th>ตัวอย่างประโยค</th></tr>
      <tr><td><b>how</b></td><td>/haʊ/</td><td>ฮาว</td><td>How are you? (ฮาว อาร์ ยู)</td></tr>
      <tr><td><b>much</b></td><td>/mʌtʃ/</td><td>มัช</td><td>How much is it? (ฮาว มัช อิส อิท)</td></tr>
      <tr><td><b>many</b></td><td>/ˈmɛni/</td><td>เมนี</td><td>How many books? (ฮาว เมนี บุ๊คส์)</td></tr>
      <tr><td><b>often</b></td><td>/ˈɒfən/ หรือ /ˈɒftən/</td><td>ออฟเฟิน หรือ อ็อฟเทิน</td><td>How often do you go? (ฮาว ออฟเฟิน ดู ยู โก)</td></tr>
      <tr><td><b>far</b></td><td>/fɑːr/</td><td>ฟาร์</td><td>How far is it? (ฮาว ฟาร์ อิส อิท)</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียง: คำว่า often มีคนพูดได้สองแบบ บางคนออกเสียง t (อ็อฟเทิน) บางคนไม่ออกเสียง t (ออฟเฟิน) ทั้งสองแบบถูกต้อง เลือกแบบไหนก็ได้ให้ถนัดปาก!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['⭐', 'always', 'เสมอ'], ['🔁', 'often', 'บ่อย ๆ'], ['🤏', 'sometimes', 'บางครั้ง'],
    ['🚫', 'never', 'ไม่เคย'], ['💵', 'money', 'เงิน'], ['🏷️', 'price', 'ราคา'],
    ['💰', 'baht', 'บาท'], ['📏', 'kilometer', 'กิโลเมตร'], ['📐', 'meter', 'เมตร'],
    ['⏱️', 'minute', 'นาที'], ['🕐', 'hour', 'ชั่วโมง'], ['📅', 'week', 'สัปดาห์'],
    ['🎂', 'age', 'อายุ'], ['📏', 'height', 'ความสูง'], ['🚌', 'distance', 'ระยะทาง'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้ใช้บ่อยที่สุดเวลาแต่งประโยคหรือตอบคำถามกับ How — แบ่งเป็น 3 หมวด: ความถี่, เงิน/ราคา, และระยะทาง/เวลา</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">How + adjective + is/are + Subject?</div>
    <div class="pex">How old is your sister? <span class="th">(น้องสาวคุณอายุเท่าไหร่)</span></div>
    <div class="pex">How far is it to school? <span class="th">(จากที่นี่ไปโรงเรียนไกลแค่ไหน)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">How much/many + noun + do/does + Subject + have?</div>
    <div class="pex">How much money do you have? <span class="th">(คุณมีเงินเท่าไหร่)</span></div>
    <div class="pex">How many books do you have? <span class="th">(คุณมีหนังสือกี่เล่ม)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">How often + do/does + Subject + verb?</div>
    <div class="pex">How often do you play football? <span class="th">(คุณเล่นฟุตบอลบ่อยแค่ไหน)</span></div>
    <div class="pex">— Twice a week. / Every day. / Sometimes. <span class="th">(ตอบด้วยคำบอกความถี่เท่านั้น)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">How + do/does/did + Subject + verb (ถามวิธีการ)?</div>
    <div class="pex">How do you go to school? — By bus. <span class="th">(คุณไปโรงเรียนอย่างไร — โดยรถบัส)</span></div>
    <div class="pex">How did you get here? — I walked. <span class="th">(คุณมาที่นี่อย่างไร — ฉันเดินมา)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาในชีวิตประจำวัน', 'Daily Conversation', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🚌 บทสนทนาที่ 1: ไปโรงเรียนยังไง (How do you go to school?)</div>
    <div class="bubble left"><div class="speaker">Ann</div>How do you go to school every day?<div class="th">ทุกวันเธอไปโรงเรียนยังไง</div></div>
    <div class="bubble right"><div class="speaker">Somchai</div>I go by bus. How about you?<div class="th">ผมไปโดยรถบัส แล้วเธอล่ะ</div></div>
    <div class="bubble left"><div class="speaker">Ann</div>I usually walk. How long does the bus ride take?<div class="th">ฉันมักจะเดินไป แล้วนั่งรถบัสใช้เวลานานแค่ไหน</div></div>
    <div class="bubble right"><div class="speaker">Somchai</div>It takes about 20 minutes. How far is your house from school?<div class="th">ใช้เวลาประมาณ 20 นาที แล้วบ้านเธอไกลจากโรงเรียนแค่ไหน</div></div>
    <div class="bubble left"><div class="speaker">Ann</div>It's very close, only 500 meters.<div class="th">ใกล้มากเลย แค่ 500 เมตรเอง</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🛍️ บทสนทนาที่ 2: ซื้อของที่ตลาด (Shopping at the Market)</div>
    <div class="bubble left"><div class="speaker">Ploy</div>Excuse me, how much is this bag?<div class="th">ขอโทษนะคะ กระเป๋าใบนี้ราคาเท่าไหร่</div></div>
    <div class="bubble right"><div class="speaker">Vendor</div>It's 250 baht. How many do you want?<div class="th">250 บาทค่ะ อยากได้กี่ใบคะ</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>Just one, please. How much are these apples?<div class="th">ขอใบเดียวค่ะ แล้วแอปเปิ้ลพวกนี้ราคาเท่าไหร่คะ</div></div>
    <div class="bubble right"><div class="speaker">Vendor</div>They are 10 baht each. How many apples do you need?<div class="th">ลูกละ 10 บาทค่ะ ต้องการกี่ลูกคะ</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>Five apples, please. Thank you!<div class="th">ขอ 5 ลูกค่ะ ขอบคุณค่ะ</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['How many money do you have?', 'money เป็นคำนามนับไม่ได้ ต้องใช้ How much ไม่ใช่ How many', 'How much money do you have?'],
    ['How much students are there?', 'students เป็นคำนามนับได้ ต้องใช้ How many ไม่ใช่ How much', 'How many students are there?'],
    ['How old you are?', 'ประโยคคำถามต้องสลับ Verb to Be มาไว้หน้าประธาน ไม่ใช่เรียงแบบประโยคบอกเล่า', 'How old are you?'],
    ['How much is these apples?', 'apples เป็นพหูพจน์ ต้องใช้ are ไม่ใช่ is', 'How much are these apples?'],
    ['How many homeworks do you have?', 'homework เป็นคำนามนับไม่ได้ ไม่มีรูปพหูพจน์ homeworks และต้องใช้ How much', 'How much homework do you have?'],
    ['How often is he go to the gym?', 'ประโยคที่ใช้ do-support ต้องใช้ does ไม่ใช่ is (he/she/it ใช้ does)', 'How often does he go to the gym?'],
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
    'ดูคำนามที่ตามหลัง How much/How many ก่อนเสมอ — ถ้าเติม s แล้วนับเป็นชิ้นได้ชัดเจน ใช้ How many แต่ถ้าเป็นของเหลว/ผง/นามธรรม ใช้ How much',
    'จำคำนามตัวร้าย 5 คำที่นับไม่ได้ให้แม่น: money, rice, homework, information, luggage — ห้ามเติม s เด็ดขาด',
    'ลำดับคำในประโยคคำถามต้องเป็น How + adjective/much/many + is/are/do/does/did + ประธาน เสมอ ห้ามเรียงแบบประโยคบอกเล่า',
    'คำตอบของ How often ต้องเป็นคำบอกความถี่เท่านั้น เช่น always, often, sometimes, never, every day, twice a week — ห้ามตอบเป็นจำนวนหรือราคา',
    'ถ้าประธานเป็นเอกพจน์ (he/she/it) ในประโยค How + do ต้องเปลี่ยนเป็น How + does ทันที',
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
    <div class="mindmap-center">How Questions</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">😊 How + be</span>ถามความเป็นอยู่/สภาพ เช่น How are you?</div>
      <div class="mindmap-branch mb-b"><span class="bt">📏 How + adjective</span>อายุ/ความสูง/ระยะทาง/เวลา/ความถี่</div>
      <div class="mindmap-branch mb-c"><span class="bt">🥛 How much</span>นามนับไม่ได้ หรือถามราคา</div>
      <div class="mindmap-branch mb-d"><span class="bt">🔢 How many</span>นามนับได้ (พหูพจน์เสมอ)</div>
      <div class="mindmap-branch mb-e"><span class="bt">🚶 How + do/does/did</span>ถามวิธีการ/การเดินทาง</div>
      <div class="mindmap-branch mb-f"><span class="bt">⚠️ ข้อควรระวัง</span>money/rice/homework/information/luggage นับไม่ได้</div>
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
    <div class="cheat-box"><h4>ตาราง How-question</h4>
      <table><tr><th>ชนิด</th><th>ตัวอย่าง</th></tr>
      <tr><td>How + be</td><td>How are you?</td></tr>
      <tr><td>How + adj</td><td>How old/tall/far/long/often?</td></tr>
      <tr><td>How much</td><td>นับไม่ได้/ราคา</td></tr>
      <tr><td>How many</td><td>นับได้ (พหูพจน์)</td></tr>
      <tr><td>How + do</td><td>ถามวิธีการ</td></tr></table></div>
    <div class="cheat-box"><h4>นับได้ vs นับไม่ได้</h4>
      <ul><li>นับไม่ได้: money, rice, homework, information, luggage, furniture</li><li>นับได้: book(s), student(s), people, dollar(s)</li></ul></div>
    <div class="cheat-box"><h4>คำตอบความถี่ (How often)</h4>
      <ul><li>always, usually, often</li><li>sometimes, rarely, never</li><li>every day/week, once/twice a week</li></ul></div>
    <div class="cheat-box"><h4>เทคนิคจำเร็ว</h4>
      <ul><li>much → ไม่มี s (นับไม่ได้)</li><li>many → มี s (นับได้)</li><li>he/she/it → does ไม่ใช่ do</li><li>ลำดับ: How+adj/much/many + be/do + S</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกฎในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากตัวอย่างใกล้ตัวนักเรียนก่อนเข้าเนื้อหา (อายุ ส่วนสูง ระยะทางบ้าน-โรงเรียน)</li>
    <li>เน้นให้นักเรียนแยกคำนามนับได้/นับไม่ได้ก่อนเลือก How much/How many ทุกครั้ง เพราะเป็นจุดที่สับสนบ่อยที่สุด</li>
    <li>ย้ำเรื่องคำตอบของ How often ต้องเป็นความถี่เท่านั้น ไม่ใช่จำนวนหรือราคา</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Class Survey</b> — นักเรียนเดินถามเพื่อน 5 คนด้วยคำถาม "How often do you...?" แล้วสรุปผลเป็นกราฟหน้าชั้น</li>
    <li><b>Price is Right</b> — ครูนำของมาแสดง ให้นักเรียนถาม "How much is this?" แล้วทายราคาให้ใกล้เคียงที่สุด</li>
    <li><b>How Far/Tall Estimation Game</b> — วัดของในห้องเรียน (โต๊ะ ประตู กระดานดำ) แล้วถามตอบด้วย How tall/How far จริง ๆ ด้วยไม้บรรทัด/สายวัด</li>
    <li><b>Countable or Not?</b> — แจกบัตรคำนาม ให้นักเรียนแยกกลุ่มว่านับได้หรือนับไม่ได้ แล้วแต่งคำถาม How much/How many</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 (โดยเฉพาะ How much/How many) เพื่อวางแผนการสอนซ่อมเสริมรายบุคคล</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'สัมภาษณ์คนในครอบครัว 3 คน ด้วยคำถาม "How often do you...?" (เช่น ออกกำลังกาย ทำอาหาร อ่านหนังสือ) แล้วจดคำตอบมาเล่าในห้องเรียน',
    'เขียนประโยค 3 ประโยคเกี่ยวกับระยะทางหรือระยะเวลา โดยใช้ How far หรือ How long (เช่น How far is it from your house to the park?)',
    'ถ่ายรูปหรือวาดสิ่งของ 3 อย่างในบ้าน แล้วเขียนคำถาม-คำตอบ "How much is it?" สมมติราคาขึ้นเอง',
    'เขียนย่อหน้าสั้น ๆ 4-5 ประโยค บรรยายวิธีที่ตัวเองไปโรงเรียนทุกวัน โดยใช้ How do you go to school? เป็นหัวข้อ',
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
    <div class="quote">"ถามให้เป็น ก็เข้าใจโลกได้กว้างขึ้น" 🌟</div>
    <div class="sub">How Questions คือกุญแจสำคัญที่จะช่วยให้เราถามหาข้อมูลได้ทุกเรื่อง ไม่ว่าจะเป็นราคา จำนวน ระยะทาง หรือวิธีการ ถ้าวันนี้แยกแยะ How much กับ How many ได้แม่นแล้ว นักเรียนจะพูดและเขียนภาษาอังกฤษได้มั่นใจขึ้นมาก อย่ากลัวที่จะถามผิด เพราะทุกคำถามคือก้าวหนึ่งของการเรียนรู้ 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง How Questions ที่แปลว่า "อย่างไร" แต่ใช้ถามได้หลายแบบมากค่ะ',
    'How + is/am/are ใช้ถามความเป็นอยู่หรือสภาพ เช่น How are you? / How is the weather?',
    'How + adjective ใช้ถามข้อมูลเฉพาะ เช่น How old, How tall, How far, How long, How often',
    'How much คู่กับนามนับไม่ได้หรือถามราคา ส่วน How many คู่กับนามนับได้ที่ต้องเติม s เสมอ',
    'How + do/does/did ใช้ถามวิธีการหรือการเดินทาง เช่น How do you go to school?',
    'ระวังคำนามตัวร้าย 5 คำที่นับไม่ได้: money, rice, homework, information, luggage',
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
<title>หนังสือเรียน: How Questions — ม.3</title>
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
