/*
 * One-off "mini textbook" generator for Lesson 06: WH-Questions.
 * Reuses data-06-wh-questions.json (already verified: grammar tables, tips,
 * worksheet, 50-question quiz, answer key) so this book's practice content
 * stays byte-consistent with the standalone quiz-pack files, and hand-authors
 * the extra storybook sections (cover, phonics, vocabulary, dialogues, mind
 * map, cheat sheet, teacher notes, homework, motivation, summary).
 *
 * Usage: node generate-book-06.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-06-wh-questions.json'), 'utf8'));
const outDir = path.join(__dirname, '..', '06-WH Questions');
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
.mb-g { background:#00B8A9; }

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
    <div class="cover-emojis">❓ 🔍 🧑‍🎓 📚 ✏️</div>
    <h1 class="cover-title-en">WH-Questions</h1>
    <div class="cover-title-th">คำถาม WH (What / Where / When / Who / Why / Which / Whose)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 เล่มที่ 6 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Lesson 06 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT ARE WH-QUESTIONS ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  ${banner('sb-c1', '❓', 'WH-Questions คืออะไร?', 'What are WH-Questions?', 'ส่วนที่ 2')}
  <p style="font-size:15px;line-height:1.7;">WH-Questions คือประโยคคำถามที่ขึ้นต้นด้วยคำคำถามกลุ่ม <b>WH</b> ทั้ง 7 คำ ได้แก่ What, Where, When, Who, Why, Which, Whose แต่ละคำมีความหมายและใช้ถามข้อมูลต่างกัน ไม่เหมือนคำถาม Yes/No ที่ตอบแค่ Yes หรือ No เพราะ WH-Questions ต้องการคำตอบที่เป็นข้อมูลจริง ๆ ลองดูความหมายของแต่ละคำก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">What = อะไร</div>ถามสิ่งของ/การกระทำแบบเปิดกว้าง<div class="ex">What is this?<br>(นี่คืออะไร)</div></div>
    <div class="meaning-box mb2"><div class="word">Where = ที่ไหน</div>ถามสถานที่<div class="ex">Where do you live?<br>(คุณอาศัยอยู่ที่ไหน)</div></div>
    <div class="meaning-box mb3"><div class="word">When = เมื่อไหร่</div>ถามเวลา<div class="ex">When is your birthday?<br>(วันเกิดคุณเมื่อไหร่)</div></div>
  </div>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">Who = ใคร</div>ถามถึงบุคคล<div class="ex">Who is that man?<br>(ผู้ชายคนนั้นเป็นใคร)</div></div>
    <div class="meaning-box mb2"><div class="word">Why = ทำไม</div>ถามเหตุผล<div class="ex">Why are you late?<br>(ทำไมคุณถึงมาสาย)</div></div>
    <div class="meaning-box mb3"><div class="word">Which = อันไหน</div>ถามตัวเลือกที่จำกัด<div class="ex">Which one do you want?<br>(คุณต้องการอันไหน)</div></div>
  </div>
  <div class="explain-block">
    <h2>🧩 อีก 1 คำที่ต้องรู้: Whose (ของใคร)</h2>
    <table>
      <tr><th>WH-word</th><th>ความหมาย</th><th>ตัวอย่าง</th><th>คำแปล</th></tr>
      <tr><td>Whose</td><td>ของใคร (ถามความเป็นเจ้าของ)</td><td>Whose bag is this?</td><td>กระเป๋าใบนี้เป็นของใคร</td></tr>
    </table>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตว่าทั้ง 7 คำนี้ใช้ถามข้อมูลคนละแบบกัน — เคล็ดลับคือต้องเข้าใจ "ใช้ถามอะไร" ของแต่ละคำให้แม่นก่อน แล้วค่อยไปเรียนรู้ว่าประโยคคำถามแต่ละแบบเรียงคำอย่างไร</p>
</div>`;
}

/* ---------- SECTION 3: GRAMMAR RULES STEP BY STEP ---------- */
function s3() {
  return `<div class="sheet" id="s3">
  ${banner('sb-c2', '🧩', 'กฎไวยากรณ์ทีละขั้น', 'Grammar Rules Step by Step', 'ส่วนที่ 3')}
  <div class="step-card sc1">
    <span class="step-label">STEP 1</span>
    <div class="qtext" style="font-size:17px;">WH + is / are / was / were + ประธาน...?</div>
    <p style="margin:6px 0;">ใช้เมื่อหลัง WH ไม่มีกริยาแท้ (มีแต่คำนาม/คุณศัพท์/สถานที่) เลือก Verb to Be ให้ตรงกับประธานเหมือนเดิม</p>
    <ul><li>What is this? (นี่คืออะไร)</li><li>Where are you? (คุณอยู่ที่ไหน)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">WH + do / does / did + ประธาน + กริยาช่อง 1...?</div>
    <p style="margin:6px 0;">ใช้เมื่อหลัง WH มีกริยาแท้ (action verb เช่น like, live, arrive) กริยาหลักต้องเป็นกริยาช่อง 1 เสมอ ห้ามผัน เพราะ do/does/did ทำหน้าที่บอกกาลแทนแล้ว</p>
    <ul><li>What do you like? (คุณชอบอะไร)</li><li>Where does she live? (เธออาศัยอยู่ที่ไหน)</li><li>When did you arrive? (คุณมาถึงเมื่อไหร่)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">Which vs What</div>
    <p style="margin:6px 0;"><b>Which</b> = ใช้เมื่อมีตัวเลือกจำกัด/รู้อยู่แล้ว (มักมีคำว่า "...or...") ส่วน <b>What</b> = ใช้ถามแบบเปิดกว้าง ไม่มีตัวเลือกจำกัด</p>
    <ul><li>Which do you want, tea or coffee? (ตัวเลือกจำกัด)</li><li>What is your favorite food? (เปิดกว้าง)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">Whose + นาม...? — ถามความเป็นเจ้าของ</div>
    <p style="margin:6px 0;">ใช้โครงสร้าง Whose + นาม + is/are... หรือ Whose + นาม + do/does/did + ประธาน + กริยา...</p>
    <ul><li>Whose bag is this? (กระเป๋าใบนี้เป็นของใคร)</li><li>Whose pen do you have? (คุณมีปากกาของใคร)</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE ---------- */
function s4() {
  const rows = [
    ['What', 'อะไร (เปิดกว้าง)', 'What is your name?'],
    ['Where', 'ที่ไหน', 'Where do you live?'],
    ['When', 'เมื่อไหร่', 'When did you arrive?'],
    ['Who', 'ใคร', 'Who is that man?'],
    ['Why', 'ทำไม', 'Why are you late?'],
    ['Which', 'อันไหน (ตัวเลือกจำกัด)', 'Which one do you want?'],
    ['Whose', 'ของใคร', 'Whose bag is this?'],
  ];
  const rowsHtml = rows.map((r) => `<tr><td><b>${r[0]}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'ตารางสรุป', 'Summary Table', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr><th>WH-word</th><th>ความหมาย</th><th>ตัวอย่างประโยค</th></tr>
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
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">คำจำ 7 คำ: W-W-W-W-W-W-W</div><p>What-Where-When-Who-Why-Which-Whose ล้วนขึ้นต้นด้วย W ยกเว้น How! ท่องเรียงเป็นจังหวะ "อะไร-ที่ไหน-เมื่อไหร่-ใคร-ทำไม-อันไหน-ของใคร" ให้คล่องปากทุกเช้า</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">Which แปลว่าอันไหนถ้ามีตัวเลือกให้</div><p>เห็นคำว่า "...or..." หรือมีของให้เลือกอยู่ตรงหน้า ให้นึกถึง Which ทันที ถ้าไม่มีตัวเลือกจำกัดให้ใช้ What แทน</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">Who เป็นประธานไม่ต้องใช้ do ช่วย</div><p>ถ้า Who เป็นคนทำเอง (ใครทำ) ผันกริยาตรง ๆ ได้เลย เช่น Who made this cake? แต่ถ้า Who เป็นกรรม (ถามว่าทำอะไรกับใคร) ต้องมี do/does/did เช่น Who did you meet?</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">Whose ≠ Who's</div><p><b>Whose</b> (ไม่มี apostrophe) แปลว่า "ของใคร" ส่วน <b>Who's</b> (มี apostrophe) ย่อมาจาก Who is/Who has — สะกดคล้ายกันแต่ความหมายคนละเรื่อง ข้อสอบชอบเอามาสลับ ต้องดูให้ดี!</p></div>
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
      <tr><td><b>where</b></td><td>/wɛər/</td><td>แวร์</td><td>Where are you? (แวร์ อาร์ ยู)</td></tr>
      <tr><td><b>when</b></td><td>/wɛn/</td><td>เวน</td><td>When is it? (เวน อิซ อิท)</td></tr>
      <tr><td><b>who</b></td><td>/huː/</td><td>ฮู</td><td>Who is she? (ฮู อิซ ชี)</td></tr>
      <tr><td><b>why</b></td><td>/waɪ/</td><td>วาย</td><td>Why are you late? (วาย อาร์ ยู เลท)</td></tr>
      <tr><td><b>which</b></td><td>/wɪtʃ/</td><td>วิช</td><td>Which one? (วิช วัน)</td></tr>
      <tr><td><b>whose</b></td><td>/huːz/</td><td>ฮูซ</td><td>Whose bag is this? (ฮูซ แบก อิซ ดิส)</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียง: ระวัง who /huː/ (ฮู) กับ whose /huːz/ (ฮูซ) เสียงคล้ายกันมาก ต่างกันแค่เสียง "ซ" ท้ายคำ ฝึกฟังและออกเสียงให้ชัดเจนเพื่อไม่ให้สับสน!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['🏫', 'school', 'โรงเรียน (สถานที่)'], ['🏠', 'home', 'บ้าน (สถานที่)'], ['🏬', 'mall', 'ห้าง (สถานที่)'],
    ['⏰', 'morning', 'ตอนเช้า (เวลา)'], ['🌙', 'tonight', 'คืนนี้ (เวลา)'], ['📅', 'yesterday', 'เมื่อวาน (เวลา)'],
    ['👩‍🏫', 'teacher', 'ครู (บุคคล)'], ['👨‍👩‍👧', 'family', 'ครอบครัว (บุคคล)'], ['🧑‍🤝‍🧑', 'friend', 'เพื่อน (บุคคล)'],
    ['💡', 'because', 'เพราะว่า (เหตุผล)'], ['🤒', 'sick', 'ป่วย (เหตุผล)'], ['⏳', 'busy', 'ยุ่ง (เหตุผล)'],
    ['👜', 'bag', 'กระเป๋า (ของ)'], ['👟', 'shoes', 'รองเท้า (ของ)'], ['📱', 'phone', 'โทรศัพท์ (ของ)'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้คือ "หมวดคำตอบ" ที่มักใช้ตอบ WH-Questions แบ่งเป็น 5 หมวด: สถานที่ (Where), เวลา (When), บุคคล (Who), เหตุผล (Why), และสิ่งของ (What/Which/Whose)</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">WH + is/are/was/were + Subject + ...?</div>
    <div class="pex">Where is your school? <span class="th">(โรงเรียนของคุณอยู่ที่ไหน)</span></div>
    <div class="pex">Why were you late? <span class="th">(ทำไมคุณถึงมาสาย)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">WH + do/does/did + Subject + base verb + ...?</div>
    <div class="pex">Where do you live? <span class="th">(คุณอาศัยอยู่ที่ไหน)</span></div>
    <div class="pex">What did she buy? <span class="th">(เธอซื้ออะไร)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">Who + verb (ไม่มี do-support เมื่อ Who เป็นประธาน)</div>
    <div class="pex">Who made this cake? <span class="th">(ใครเป็นคนทำเค้กนี้)</span></div>
    <div class="pex">Who broke the window? <span class="th">(ใครทำหน้าต่างแตก)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">Whose + noun + is/are... / Whose + noun + do/does/did + S + verb?</div>
    <div class="pex">Whose bag is this? <span class="th">(กระเป๋าใบนี้เป็นของใคร)</span></div>
    <div class="pex">Whose pen do you have? <span class="th">(คุณมีปากกาของใคร)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาในชีวิตประจำวัน', 'Daily Conversation', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🎤 บทสนทนาที่ 1: สัมภาษณ์เพื่อนใหม่ (Interviewing a New Friend)</div>
    <div class="bubble left"><div class="speaker">Nan</div>Hi! What's your name?<div class="th">สวัสดี เธอชื่ออะไร</div></div>
    <div class="bubble right"><div class="speaker">Tom</div>I'm Tom. Nice to meet you!<div class="th">ผมชื่อทอม ยินดีที่ได้รู้จักนะ</div></div>
    <div class="bubble left"><div class="speaker">Nan</div>Where are you from?<div class="th">เธอมาจากที่ไหน</div></div>
    <div class="bubble right"><div class="speaker">Tom</div>I'm from Chiang Mai. Where do you live now?<div class="th">ผมมาจากเชียงใหม่ แล้วเธออาศัยอยู่ที่ไหนตอนนี้</div></div>
    <div class="bubble left"><div class="speaker">Nan</div>I live near the school. Why did you move here?<div class="th">ฉันอาศัยอยู่ใกล้โรงเรียน แล้วทำไมเธอถึงย้ายมาที่นี่</div></div>
    <div class="bubble right"><div class="speaker">Tom</div>Because my father works here now.<div class="th">เพราะพ่อของผมมาทำงานที่นี่</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🎒 บทสนทนาที่ 2: ทายของใคร (At the Lost and Found)</div>
    <div class="bubble left"><div class="speaker">Ploy</div>Whose bag is this? It was under the chair.<div class="th">กระเป๋าใบนี้เป็นของใครนะ มันอยู่ใต้เก้าอี้</div></div>
    <div class="bubble right"><div class="speaker">Beam</div>Which bag, the red one or the blue one?<div class="th">กระเป๋าใบไหนล่ะ ใบสีแดงหรือใบสีน้ำเงิน</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>The blue one. Whose is it?<div class="th">ใบสีน้ำเงิน มันเป็นของใครนะ</div></div>
    <div class="bubble right"><div class="speaker">Beam</div>I think it's Nid's. Who saw her last?<div class="th">ฉันคิดว่าน่าจะเป็นของนิด ใครเห็นเธอครั้งสุดท้าย</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>I don't know. Let's ask her tomorrow.<div class="th">ฉันไม่รู้เหมือนกัน พรุ่งนี้ไปถามเธอกันดีกว่า</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['What you like?', 'ลืมเติม do/does/did ช่วยเมื่อมีกริยาแท้', 'What do you like?'],
    ['Where you are from?', 'เรียงคำผิด ต้องยก Verb to Be มาไว้หน้าประธาน', 'Where are you from?'],
    ['Who is make this cake?', 'Who เป็นประธาน ไม่ต้องใช้ do-support และไม่ต้องมี is นำหน้ากริยา', 'Who made this cake?'],
    ["Whose's bag is this?", 'Whose ไม่ต้องเติม apostrophe-s เพราะไม่ใช่คำย่อของ Who is', 'Whose bag is this?'],
    ['What does she wants?', 'เมื่อมี does ช่วยแล้ว กริยาหลักต้องเป็นกริยาช่อง 1 ห้ามเติม -s', 'What does she want?'],
    ['Which do you like your favorite color?', 'ควรใช้ What เพราะเป็นคำถามแบบเปิดกว้าง ไม่มีตัวเลือกจำกัด', 'What is your favorite color?'],
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
    'เช็กก่อนเสมอว่าหลัง WH มีกริยาแท้หรือไม่ ถ้ามีให้ใช้ do/does/did ถ้าไม่มี (มีแต่นาม/คุณศัพท์) ให้ใช้ is/are/was/were',
    'จับคู่กริยาช่วยให้ตรงกับประธานและกาลเวลาเสมอ: I/You/We/They ปัจจุบันใช้ do, He/She/It ปัจจุบันใช้ does, อดีตทุกประธานใช้ did',
    'Who เป็นประธานของประโยค (ใครทำ) ไม่ต้องมี do/does/did ผันกริยาตรง ๆ แต่ถ้า Who เป็นกรรม (ถามว่าทำอะไรกับใคร) ต้องมี do/does/did ช่วยตามปกติ',
    'Which ใช้เมื่อมีตัวเลือกจำกัดหรือรู้ตัวเลือกอยู่แล้ว (มักมีคำว่า or) ส่วน What ใช้ถามแบบเปิดกว้างไม่จำกัดตัวเลือก',
    'ระวัง Whose (ของใคร ไม่มี apostrophe) กับ Who\'s (ย่อมาจาก Who is/Who has มี apostrophe) สะกดคล้ายกันแต่ความหมายต่างกัน ข้อสอบชอบเอามาจับผิด',
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
      <div class="mindmap-branch mb-a"><span class="bt">❓ What</span>อะไร (เปิดกว้าง ไม่มีตัวเลือกจำกัด)</div>
      <div class="mindmap-branch mb-b"><span class="bt">📍 Where</span>ที่ไหน (สถานที่)</div>
      <div class="mindmap-branch mb-c"><span class="bt">⏰ When</span>เมื่อไหร่ (เวลา)</div>
      <div class="mindmap-branch mb-d"><span class="bt">🧑 Who</span>ใคร (บุคคล — ประธานไม่ต้องมี do)</div>
      <div class="mindmap-branch mb-e"><span class="bt">🤔 Why</span>ทำไม (เหตุผล — มักตอบ Because)</div>
      <div class="mindmap-branch mb-f"><span class="bt">🎯 Which</span>อันไหน (ตัวเลือกจำกัด)</div>
      <div class="mindmap-branch mb-g"><span class="bt">👑 Whose</span>ของใคร (ความเป็นเจ้าของ)</div>
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
    <div class="cheat-box"><h4>ความหมาย WH-word ทั้ง 7 คำ</h4>
      <table><tr><th>คำ</th><th>ความหมาย</th></tr>
      <tr><td>What</td><td>อะไร</td></tr>
      <tr><td>Where</td><td>ที่ไหน</td></tr>
      <tr><td>When</td><td>เมื่อไหร่</td></tr>
      <tr><td>Who</td><td>ใคร</td></tr>
      <tr><td>Why</td><td>ทำไม</td></tr>
      <tr><td>Which</td><td>อันไหน</td></tr>
      <tr><td>Whose</td><td>ของใคร</td></tr></table></div>
    <div class="cheat-box"><h4>จับคู่กริยาช่วยให้ตรง</h4>
      <ul><li>ไม่มีกริยาแท้ → is/are/was/were</li><li>มีกริยาแท้ ปัจจุบัน (I/You/We/They) → do</li><li>มีกริยาแท้ ปัจจุบัน (He/She/It) → does</li><li>มีกริยาแท้ อดีต (ทุกประธาน) → did</li></ul></div>
    <div class="cheat-box"><h4>Which vs What</h4>
      <ul><li>Which = มีตัวเลือกจำกัด/มีคำว่า or</li><li>What = ถามแบบเปิดกว้าง</li></ul></div>
    <div class="cheat-box"><h4>ข้อควรระวัง</h4>
      <ul><li>Who เป็นประธาน → ไม่ต้องมี do/does/did</li><li>Whose ≠ Who's (Who's = Who is)</li><li>มีกริยาช่วยแล้ว กริยาหลักต้องเป็นช่อง 1</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกฎในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากทบทวนความหมายของ WH-word ทีละคำก่อน ให้นักเรียนจับคู่คำกับความหมายไทยได้คล่องก่อนเข้าโครงสร้างประโยค</li>
    <li>เน้นย้ำจุดตัดสินใจสำคัญ 2 อย่าง: (1) หลัง WH มีกริยาแท้หรือไม่ (2) ประธาน/กาลเวลาคืออะไร เพื่อเลือกกริยาช่วยให้ถูก</li>
    <li>ยกตัวอย่าง Who ที่เป็นประธานกับ Who ที่เป็นกรรมให้เห็นความต่างชัดเจน เพราะเป็นจุดที่นักเรียนสับสนบ่อยที่สุด</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>20 Questions</b> — นักเรียนคนหนึ่งนึกถึงสิ่งของ/บุคคลในใจ เพื่อน ๆ ผลัดกันถามคำถาม WH-Questions เพื่อทายให้ถูกภายใน 20 คำถาม</li>
    <li><b>Interview Bingo</b> — แจกตารางบิงโกที่มีคำตอบ (สถานที่/เวลา/บุคคล) นักเรียนเดินถามเพื่อนด้วย WH-Questions เพื่อหาคนที่คำตอบตรงกับช่องในตาราง</li>
    <li><b>Whose Is It?</b> — ให้นักเรียนนำของใช้ส่วนตัวมาวางรวมกัน แล้วผลัดกันถาม "Whose is this?" เพื่อทายเจ้าของ</li>
    <li><b>Reporter Role Play</b> — จับคู่ให้นักเรียนสวมบทบาทนักข่าวสัมภาษณ์เพื่อนด้วย What/Where/When/Why แล้วสรุปรายงานหน้าชั้น</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 โดยเฉพาะเรื่อง Who เป็นประธาน และ Whose vs Who's เพื่อวางแผนการสอนซ่อมเสริมรายบุคคล</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'เขียนคำถาม WH-Questions 5 ข้อ เพื่อใช้สัมภาษณ์คนในครอบครัว 1 คน (ใช้ What/Where/When/Who/Why อย่างน้อยคนละ 1 ข้อ)',
    'นำคำถามข้อ 1 ไปถามจริง แล้วจดคำตอบที่ได้มา 3 ข้อ เตรียมมาเล่าให้เพื่อนฟังหน้าชั้นเรียน',
    'เขียนประโยคคำถาม Which กับ What อย่างละ 2 ประโยค พร้อมระบุว่าทำไมถึงเลือกใช้คำนั้น',
    'หาประโยคคำถาม WH-Questions จากเพลงหรือหนังที่ชอบ 3 ประโยค แล้วแปลไทยพร้อมบอกว่าใช้กริยาช่วยตัวไหน',
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
    <div class="quote">"การตั้งคำถามที่ดี คือก้าวแรกของการเรียนรู้ที่ดี" 🌟</div>
    <div class="sub">WH-Questions คือกุญแจสำคัญที่จะช่วยให้นักเรียนสื่อสารภาษาอังกฤษได้ลึกซึ้งขึ้น ไม่ใช่แค่ตอบ Yes/No อีกต่อไป ยิ่งฝึกถามมากเท่าไหร่ ก็ยิ่งเก่งขึ้นเท่านั้น อย่ากลัวที่จะถามผิด เพราะทุกคำถามคือก้าวหนึ่งของความเข้าใจ 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง WH-Questions ทั้ง 7 คำ: What (อะไร), Where (ที่ไหน), When (เมื่อไหร่), Who (ใคร), Why (ทำไม), Which (อันไหน), Whose (ของใคร) ค่ะ',
    'ถ้าหลัง WH ไม่มีกริยาแท้ (มีแต่นาม/คุณศัพท์) ให้ใช้ is/am/are/was/were ตามประธาน',
    'ถ้าหลัง WH มีกริยาแท้ ให้ใช้ do/does/did ช่วย แล้วกริยาหลักต้องเป็นกริยาช่อง 1 เท่านั้น',
    'Who เป็นประธาน (ใครทำ) ไม่ต้องมี do/does/did ผันกริยาตรง ๆ ได้เลย เช่น Who made this cake?',
    'Which ใช้เมื่อมีตัวเลือกจำกัดให้ (มักมีคำว่า or) ส่วน What ใช้ถามแบบเปิดกว้าง',
    'ระวัง Whose (ของใคร) กับ Who\'s (= Who is) สะกดคล้ายกันแต่ความหมายต่างกันสิ้นเชิง',
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
