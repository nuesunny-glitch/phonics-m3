/*
 * One-off "mini textbook" generator for Lesson 07: Adding S and ES.
 * Reuses data-07-adding-s-es.json (already verified: grammar tables, tips,
 * worksheet, 50-question quiz, answer key) so this book's practice content
 * stays byte-consistent with the standalone quiz-pack files, and hand-authors
 * the extra storybook sections (cover, phonics, vocabulary, dialogues, mind
 * map, cheat sheet, teacher notes, homework, motivation, summary).
 *
 * Usage: node generate-book-07.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-07-adding-s-es.json'), 'utf8'));
const outDir = path.join(__dirname, '..', '07-Adding S and ES');
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
    <div class="cover-emojis">➕ 🔤 🐱🐱 📦📦</div>
    <h1 class="cover-title-en">Adding S and ES</h1>
    <div class="cover-title-th">การเติม s และ es (คำนามพหูพจน์ และกริยา he/she/it)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 เล่มที่ 7 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Lesson 07 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT IS ADDING S AND ES ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  ${banner('sb-c1', '📖', 'การเติม s และ es คืออะไร?', 'What is Adding S and ES?', 'ส่วนที่ 2')}
  <p style="font-size:15px;line-height:1.7;">การเติม -s หรือ -es ต่อท้ายคำ เป็นเรื่องเล็ก ๆ ที่สำคัญมากในภาษาอังกฤษ เพราะมันทำหน้าที่ได้ถึง <b>2 อย่าง</b> ในประโยค แม้จะเติมตัวอักษรเหมือนกัน แต่ความหมายและตำแหน่งในประโยคต่างกันโดยสิ้นเชิง ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">หน้าที่ 1</div>ทำให้คำนามเป็นพหูพจน์ (มากกว่า 1)<div class="ex">cat → cats<br>I have two cats.<br>(ฉันมีแมวสองตัว)</div></div>
    <div class="meaning-box mb2"><div class="word">หน้าที่ 2</div>ทำให้กริยาเข้ากับประธาน he/she/it<div class="ex">play → plays<br>He plays football.<br>(เขาเล่นฟุตบอล)</div></div>
    <div class="meaning-box mb3"><div class="word">ข่าวดี!</div>กฎการสะกดเหมือนกันทั้งคู่<div class="ex">box → boxes<br>watch → watches<br>(กฎเดียวกันเป๊ะ)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่า <b>boxes</b> (คำนามพหูพจน์) กับ <b>watches</b> (กริยา he/she/it) ใช้กฎการเติม -es แบบเดียวกันทุกประการ — นี่คือเหตุผลที่บทนี้เรียนกฎการสะกดแค่ชุดเดียว แต่ใช้ได้ทั้งคำนามและกริยา!</p>
  <div class="explain-block">
    <h2>🧩 ใช้เมื่อไหร่บ้าง?</h2>
    <table>
      <tr><th>การใช้</th><th>ตัวอย่าง</th><th>คำแปล</th></tr>
      <tr><td>บอกว่ามีมากกว่า 1 สิ่ง (คำนามพหูพจน์)</td><td>She has three books.</td><td>เธอมีหนังสือสามเล่ม</td></tr>
      <tr><td>บอกกริยาของประธาน he/she/it (Present Simple)</td><td>She watches TV every night.</td><td>เธอดูทีวีทุกคืน</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>คำแปล</th></tr>
      <tr><td>I have two dogs.</td><td>ฉันมีสุนัขสองตัว</td></tr>
      <tr><td>There are five boxes on the table.</td><td>มีกล่องห้าใบอยู่บนโต๊ะ</td></tr>
      <tr><td>He plays basketball every day.</td><td>เขาเล่นบาสเก็ตบอลทุกวัน</td></tr>
      <tr><td>She studies English at school.</td><td>เธอเรียนภาษาอังกฤษที่โรงเรียน</td></tr>
      <tr><td>My mother watches the news at night.</td><td>แม่ของฉันดูข่าวตอนกลางคืน</td></tr>
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
    <div class="qtext" style="font-size:17px;">ปกติ — เติม <b>-s</b> ตรง ๆ ได้เลย</div>
    <p style="margin:6px 0;">คำนามและกริยาส่วนใหญ่ แค่เติม -s ต่อท้ายคำเดิม ไม่ต้องเปลี่ยนรูปคำ</p>
    <ul><li>cat → cats (แมว)</li><li>book → books (หนังสือ)</li><li>play → plays (เล่น)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">ลงท้ายเสียง <b>s, ss, sh, ch, x, z</b> — เติม <b>-es</b></div>
    <p style="margin:6px 0;">ถ้าเติมแค่ -s เฉย ๆ จะออกเสียงยาก จึงต้องเติม -es แทน เพื่อให้ออกเสียงง่ายขึ้น</p>
    <ul><li>bus → buses (รถบัส)</li><li>box → boxes (กล่อง)</li><li>watch → watches (นาฬิกา/เฝ้าดู)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">พยัญชนะ+y → เปลี่ยนเป็น <b>-ies</b> (แต่สระ+y เติม -s ตรง ๆ)</div>
    <p style="margin:6px 0;">ดูตัวอักษรหน้า y ก่อนเสมอ ถ้าเป็นพยัญชนะ ต้องเปลี่ยน y เป็น i แล้วเติม es แต่ถ้าเป็นสระ (a,e,i,o,u) แค่เติม s ตรง ๆ</p>
    <ul><li>baby → babies (b+y เป็นพยัญชนะ)</li><li>study → studies (d+y เป็นพยัญชนะ)</li><li>boy → boys (o+y เป็นสระ)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">f/fe → ves และพหูพจน์รูปแปลก (Irregular) ต้องท่องจำ</div>
    <p style="margin:6px 0;">คำนามบางคำที่ลงท้าย f/fe เปลี่ยนเป็น ves และมีคำนามอีกกลุ่มที่ไม่เติม s เลย แต่เปลี่ยนรูปคำไปเลย ต้องท่องจำเป็นคำ ๆ ไป</p>
    <ul><li>leaf → leaves, knife → knives</li><li>man → men, child → children, tooth → teeth</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE ---------- */
function s4() {
  const rowsHtml = data.summaryTable.rows.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
  const headers = data.summaryTable.headers.map((h) => `<th>${esc(h)}</th>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'ตารางสรุป', 'Summary Table', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr>${headers}</tr>
      ${rowsHtml}
    </table>
  </div>
  <div class="tip-card">💡 เคล็ดลับ: ท่องตารางนี้ให้ขึ้นใจ เพราะทุกกฎในบทนี้อ้างอิงจากตารางเดียวนี้ทั้งหมด! และอย่าลืมว่ากฎเดียวกันนี้ใช้ได้กับทั้งคำนามพหูพจน์และกริยา he/she/it</div>
</div>`;
}

/* ---------- SECTION 5: MEMORY TRICKS ---------- */
function s5() {
  return `<div class="sheet" id="s5">
  ${banner('sb-c4', '🧠', 'เทคนิคการจำ', 'Memory Tricks', 'ส่วนที่ 5')}
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">ฟังเสียงท้ายคำ</div><p>คำที่ลงท้ายเสียง "ซ ช ส" คือ s, ss, sh, ch, x, z ออกเสียงเพิ่มพยางค์ไม่ได้ถ้าเติมแค่ s เฉย ๆ จึงต้องมี E ช่วยเสมอ — จำว่า <b>"เสียง ซ ช ส ต้องมี E ช่วย"</b></p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">พยัญชนะ+y ก่อน y เปลี่ยนเป็น i</div><p>จำคาถา: <b>"หน้าพยัญชนะ Y ใจร้อน ต้องเปลี่ยนเป็น IES ไว ๆ ส่วนหน้าสระ Y ใจเย็น แค่เติม S ก็พอ"</b> เช่น baby→babies (ใจร้อน) แต่ boy→boys (ใจเย็น)</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">คล้องจองพหูพจน์รูปแปลก</div><p>ท่องเป็นจังหวะ: <b>"man เป็น men, child เป็น children, tooth เป็น teeth, foot เป็น feet, mouse เป็น mice, person เป็น people"</b> ท่องซ้ำทุกวันจนติดปาก เพราะคำเหล่านี้ไม่มีกฎ ต้องจำล้วน ๆ</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">นามกับกริยาใช้กฎเดียวกัน!</div><p>ไม่ต้องท่องสองชุด เพราะกฎการเติม s/es ของคำนามพหูพจน์กับกริยา he/she/it เหมือนกันเป๊ะ จำแค่ชุดเดียว เช่น <b>box→boxes</b> เหมือน <b>watch→watches</b></p></div>
</div>`;
}

/* ---------- SECTION 6: PHONICS CORNER ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔊', 'มุมออกเสียง', 'Phonics Corner', 'ส่วนที่ 6')}
  <p style="font-size:14.5px;color:#55607a;">จุดที่พิเศษมากของ -s/-es คือมันออกเสียงได้ถึง <b>3 แบบ</b> ขึ้นอยู่กับเสียงสุดท้ายของคำเดิม (ไม่ใช่ตัวสะกด แต่เป็น "เสียง" ที่ออก)</p>
  <div class="explain-block">
    <table>
      <tr><th>เสียง -s/-es</th><th>เมื่อคำเดิมลงท้ายด้วยเสียง...</th><th>ตัวอย่างคำ</th><th>เสียงอ่านแบบไทย</th></tr>
      <tr><td>/s/</td><td>เสียงไม่ก้อง เช่น p, t, k, f</td><td>cats, books, laughs</td><td>แคทส์, บุคส์, ลาฟส์</td></tr>
      <tr><td>/z/</td><td>เสียงก้อง เช่น b, d, g, l, n, สระ</td><td>dogs, boys, cars</td><td>ด็อกซ์, บอยซ์, คาร์ซ</td></tr>
      <tr><td>/ɪz/</td><td>เสียง s, ss, sh, ch, x, z (ที่เติม -es)</td><td>buses, boxes, watches</td><td>บัสเซส, บ็อกซเซส, วอทเชส</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียง: ลองพูดคำว่า <b>cats</b> กับ <b>dogs</b> ช้า ๆ จะได้ยินว่า cats ลงท้ายเสียง "ส" แต่ dogs ลงท้ายเสียง "ซ" ทั้งที่สะกดด้วย s เหมือนกัน! ส่วนคำที่เติม -es อย่าง <b>buses</b> จะมีพยางค์เพิ่มขึ้นมาอีก 1 พยางค์เสมอ (บัส-เซส)</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['🍎', 'apple → apples', 'แอปเปิล (หลายผล)'], ['🐕', 'puppy → puppies', 'ลูกสุนัข (หลายตัว)'], ['🚕', 'taxi → taxis', 'รถแท็กซี่ (หลายคัน)'],
    ['🧦', 'sock → socks', 'ถุงเท้า (หลายข้าง)'], ['🍽️', 'brush (verb) → brushes', 'แปรง/ปัด (he/she/it)'], ['🎨', 'try (verb) → tries', 'พยายาม (he/she/it)'],
    ['🧀', 'loaf → loaves', 'ขนมปังก้อน (หลายก้อน)'], ['🎥', 'video → videos', 'วิดีโอ (หลายคลิป)'], ['🧑‍🍳', 'chef → chefs', 'เชฟ (หลายคน)'],
    ['🐟', 'fish → fish', 'ปลา (รูปเดียวกัน)'], ['👨', 'man → men', 'ผู้ชาย (พหูพจน์รูปแปลก)'], ['🦷', 'tooth → teeth', 'ฟัน (พหูพจน์รูปแปลก)'],
    ['🧺', 'wash (verb) → washes', 'ซัก/ล้าง (he/she/it)'], ['🎂', 'party → parties', 'งานปาร์ตี้ (หลายงาน)'], ['🔑', 'key → keys', 'กุญแจ (หลายดอก)'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้ครอบคลุมทุกกฎการเติม s/es ที่เรียนมา — ทั้งคำนามพหูพจน์แบบปกติ/พิเศษ และกริยา he/she/it</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">There is one ___, there are two ___s.</div>
    <div class="pex">There is one box, there are two boxes. <span class="th">(มีกล่องหนึ่งใบ มีกล่องสองใบ)</span></div>
    <div class="pex">There is one child, there are two children. <span class="th">(มีเด็กหนึ่งคน มีเด็กสองคน)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">He/She/It + verb+s/es + every day/week.</div>
    <div class="pex">He plays football every day. <span class="th">(เขาเล่นฟุตบอลทุกวัน)</span></div>
    <div class="pex">She watches TV every night. <span class="th">(เธอดูทีวีทุกคืน)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">I have + number + noun+s.</div>
    <div class="pex">I have two cats and three dogs. <span class="th">(ฉันมีแมวสองตัวและสุนัขสามตัว)</span></div>
    <div class="pex">She has five books on the shelf. <span class="th">(เธอมีหนังสือห้าเล่มบนชั้น)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">It + verb+s + noun+s.</div>
    <div class="pex">The bus goes to school at 7 a.m. <span class="th">(รถบัสไปโรงเรียนตอน 7 โมง)</span></div>
    <div class="pex">My mother washes the dishes after dinner. <span class="th">(แม่ล้างจานหลังอาหารเย็น)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาในชีวิตประจำวัน', 'Daily Conversation', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🏫 บทสนทนาที่ 1: บรรยายห้องเรียน (Describing the Classroom)</div>
    <div class="bubble left"><div class="speaker">Ann</div>How many students are there in your class?<div class="th">ห้องของเธอมีนักเรียนกี่คน</div></div>
    <div class="bubble right"><div class="speaker">Somchai</div>There are thirty students. We have five boxes of books and two shelves.<div class="th">มีนักเรียนสามสิบคนครับ เรามีกล่องหนังสือห้าใบและชั้นวางสองชั้น</div></div>
    <div class="bubble left"><div class="speaker">Ann</div>Wow! Do you have many chairs and desks?<div class="th">ว้าว มีเก้าอี้กับโต๊ะเยอะไหม</div></div>
    <div class="bubble right"><div class="speaker">Somchai</div>Yes, we have thirty desks and thirty chairs. Some students bring their own dishes for lunch!<div class="th">ใช่ครับ เรามีโต๊ะและเก้าอี้อย่างละสามสิบตัว นักเรียนบางคนเอาจานมาเองสำหรับมื้อเที่ยงด้วย</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">👦 บทสนทนาที่ 2: กิจวัตรประจำวันของน้องชาย (My Brother's Daily Routine)</div>
    <div class="bubble left"><div class="speaker">Ploy</div>My brother always plays football after school. He also studies English every night.<div class="th">น้องชายฉันเล่นฟุตบอลหลังเลิกเรียนเสมอ เขายังเรียนภาษาอังกฤษทุกคืนด้วย</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>That's great! Does he watch TV too?<div class="th">เยี่ยมเลย เขาดูทีวีด้วยไหม</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>Yes, he watches cartoons on weekends. He washes his bike every Sunday too.<div class="th">ใช่ค่ะ เขาดูการ์ตูนช่วงวันหยุด เขายังล้างจักรยานทุกวันอาทิตย์ด้วย</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>He sounds very responsible. My sister carries her own bags and tries her best in every exam too.<div class="th">เขาดูมีความรับผิดชอบมากเลย น้องสาวฉันก็ถือกระเป๋าเองและพยายามอย่างเต็มที่ในทุกการสอบเหมือนกัน</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['I have two boxs.', 'box ลงท้าย x ต้องเติม -es เป็น boxes ไม่ใช่แค่เติม s', 'I have two boxes.'],
    ['She has two babys.', 'baby ลงท้ายพยัญชนะ+y ต้องเปลี่ยน y เป็น i แล้วเติม es', 'She has two babies.'],
    ['He play football every day.', 'ประธาน He เป็น he/she/it ต้องเติม -s ที่กริยา play เป็น plays', 'He plays football every day.'],
    ['She watch TV every day.', 'ประธาน She เป็น he/she/it และ watch ลงท้าย ch ต้องเติม -es เป็น watches', 'She watches TV every day.'],
    ['One child, two childs.', 'child เป็นพหูพจน์รูปแปลก ไม่เติม s เลย ต้องเปลี่ยนเป็น children', 'One child, two children.'],
    ['My father has two knifes.', 'knife ลงท้าย fe ต้องเปลี่ยนเป็น ves ไม่ใช่แค่เติม s', 'My father has two knives.'],
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
    'มองตัวอักษร (หรือเสียง) ตัวสุดท้ายของคำก่อนเสมอ แล้วค่อยเลือกกฎที่ตรงกับตัวอักษรนั้น',
    'ถ้าเจอคำนามพหูพจน์รูปแปลก (man, woman, child, tooth, foot, mouse, person) ให้ท่องจำเป็นคำทั้งคำ เพราะไม่มีกฎตายตัวมาช่วย',
    'กฎการเติม s/es แบบเดียวกันนี้ใช้ได้ทั้งกับคำนามพหูพจน์ และกริยาที่ใช้กับประธาน he/she/it ในประโยค Present Simple',
    'ระวังคำที่ลงท้าย o และ f/fe เพราะมีทั้งคำที่ทำตามกฎและคำยกเว้นที่ต้องจำเป็นคำ ๆ ไป เช่น photo→photos แต่ potato→potatoes',
    'เวลาผันกริยา he/she/it ให้เช็คตัวสะกดท้ายคำกริยาเดิมก่อนเสมอ เหมือนกับตอนเติมพหูพจน์คำนามทุกประการ',
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
    <div class="mindmap-center">Adding S and ES</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">➕ ปกติ +s</span>cat → cats, play → plays</div>
      <div class="mindmap-branch mb-b"><span class="bt">🔤 s/ss/sh/ch/x/z +es</span>bus → buses, watch → watches</div>
      <div class="mindmap-branch mb-c"><span class="bt">🔁 y → ies</span>baby → babies, study → studies</div>
      <div class="mindmap-branch mb-d"><span class="bt">🍃 f/fe → ves</span>leaf → leaves, knife → knives</div>
      <div class="mindmap-branch mb-e"><span class="bt">🧑‍🤝‍🧑 พหูพจน์รูปแปลก</span>man → men, child → children</div>
      <div class="mindmap-branch mb-f"><span class="bt">👤 กริยา he/she/it</span>ใช้กฎเดียวกันกับคำนามพหูพจน์</div>
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
    <div class="cheat-box"><h4>กฎการเติม s/es</h4>
      <table><tr><th>ลงท้ายด้วย</th><th>กฎ</th></tr>
      <tr><td>ทั่วไป</td><td>+s</td></tr>
      <tr><td>s,ss,sh,ch,x,z</td><td>+es</td></tr>
      <tr><td>พยัญชนะ+y</td><td>y→ies</td></tr>
      <tr><td>สระ+y</td><td>+s</td></tr>
      <tr><td>f/fe (บางคำ)</td><td>→ves</td></tr></table></div>
    <div class="cheat-box"><h4>พหูพจน์รูปแปลก (ท่องจำ)</h4>
      <ul><li>man → men, woman → women</li><li>child → children</li><li>tooth → teeth, foot → feet</li><li>mouse → mice, person → people</li><li>sheep → sheep, fish → fish (เหมือนเดิม)</li></ul></div>
    <div class="cheat-box"><h4>3 เสียงของ -s/-es</h4>
      <ul><li>/s/ หลังเสียงไม่ก้อง เช่น cats</li><li>/z/ หลังเสียงก้อง/สระ เช่น dogs</li><li>/ɪz/ หลังเสียง s,ss,sh,ch,x,z เช่น buses</li></ul></div>
    <div class="cheat-box"><h4>อย่าลืม!</h4>
      <ul><li>นามพหูพจน์ กับ กริยา he/she/it ใช้กฎเดียวกัน</li><li>photo→photos, piano→pianos (ข้อยกเว้น +s เท่านั้น)</li><li>roof→roofs, chief→chiefs (ไม่เปลี่ยนเป็น ves)</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกฎในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากการให้นักเรียนสังเกตเสียงท้ายคำก่อนสอนกฎ เพื่อให้จำได้ด้วยตัวเองมากกว่าท่องจำอย่างเดียว</li>
    <li>เน้นย้ำว่ากฎการเติม s/es ใช้ได้ทั้งคำนามพหูพจน์และกริยา he/she/it เพื่อลดภาระการท่องจำของนักเรียน</li>
    <li>แยกสอนพหูพจน์รูปแปลก (irregular) เป็นชุดคำศัพท์ต่างหาก เพราะไม่มีกฎช่วย ต้องอาศัยการทบทวนซ้ำ ๆ</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Plural Relay Race</b> — แบ่งทีม ให้นักเรียนวิ่งผลัดไปเขียนรูปพหูพจน์ที่ถูกต้องบนกระดาน ทีมที่เขียนถูกและเร็วที่สุดชนะ</li>
    <li><b>Spelling Bee</b> — ครูพูดกริยา + ประธาน he/she/it แล้วให้นักเรียนสะกดรูปกริยาที่ผันแล้วออกมาดัง ๆ</li>
    <li><b>Sound Sort</b> — แจกบัตรคำ ให้นักเรียนแยกกลุ่มตามเสียงลงท้าย /s/, /z/, /ɪz/ ลงในตาราง 3 ช่อง</li>
    <li><b>Irregular Plural Memory Game</b> — เกมจับคู่การ์ด เอกพจน์-พหูพจน์รูปแปลก เพื่อฝึกจำคำที่ไม่มีกฎ</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 เพื่อวางแผนการสอนซ่อมเสริมรายบุคคล โดยเฉพาะพหูพจน์รูปแปลก</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'เขียนประโยค 5 ประโยค โดยใช้คำนามพหูพจน์ของสิ่งของภายในบ้าน (เช่น We have three chairs and two shelves.)',
    'ท่องจำพหูพจน์รูปแปลก 5 คำ (man, woman, child, tooth, foot) แล้วให้คนในครอบครัวช่วยทดสอบถามตอบ',
    'เขียนบรรยายกิจวัตรประจำวันของสมาชิกในครอบครัว 1 คน (he/she) โดยใช้กริยาเติม s/es อย่างน้อย 5 ประโยค',
    'หาคำนามพหูพจน์หรือกริยาเติม s/es จากป้าย/ฉลากสินค้าในบ้าน 3 คำ แล้วเขียนกฎการสะกดที่ใช้',
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
    <div class="quote">"แค่ตัว s ตัวเดียว ก็เปลี่ยนความหมายได้ทั้งประโยค อย่ามองข้ามรายละเอียดเล็ก ๆ นะ" 🌟</div>
    <div class="sub">การเติม s/es อาจดูเป็นเรื่องเล็ก แต่ถ้าฝึกสังเกตเสียงท้ายคำทุกวัน จะกลายเป็นเรื่องง่ายและอัตโนมัติในที่สุด ทุกครั้งที่เขียนผิดคือโอกาสที่จะจำได้แม่นขึ้น อย่ากลัวที่จะฝึกซ้ำ ๆ เพราะความเก่งเกิดจากการฝึกฝนทุกวัน 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่องการเติม -s และ -es ซึ่งมีหน้าที่ 2 อย่าง คือทำให้คำนามเป็นพหูพจน์ และผันกริยาให้เข้ากับ he/she/it ค่ะ',
    'คำทั่วไป เติม -s ตรง ๆ ได้เลย เช่น cat→cats, play→plays',
    'ถ้าลงท้ายเสียง s, ss, sh, ch, x, z ต้องเติม -es เสมอ เช่น bus→buses, watch→watches',
    'ถ้าลงท้ายพยัญชนะ+y ให้เปลี่ยน y เป็น i แล้วเติม es เช่น baby→babies, study→studies แต่ถ้าเป็นสระ+y แค่เติม s เช่น boy→boys',
    'คำที่ลงท้าย f/fe บางคำเปลี่ยนเป็น ves เช่น leaf→leaves, knife→knives',
    'ระวังพหูพจน์รูปแปลกที่ไม่มีกฎ ต้องท่องจำ เช่น man→men, child→children, tooth→teeth',
    'สุดท้าย ฝึกทำแบบฝึกหัดและแบบทดสอบให้ครบ แล้วนักเรียนจะแม่นเรื่องนี้แน่นอนค่ะ'
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
<title>หนังสือเรียน: Adding S and ES — ม.3</title>
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
