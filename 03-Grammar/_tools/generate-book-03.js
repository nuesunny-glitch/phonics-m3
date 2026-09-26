/*
 * One-off "mini textbook" generator for Lesson 03: Verb to Do.
 * Reuses data-03-verb-to-do.json (already verified: grammar tables, tips,
 * worksheet, 50-question quiz, answer key) so this book's practice content
 * stays byte-consistent with the standalone quiz-pack files, and hand-authors
 * the extra storybook sections (cover, phonics, vocabulary, dialogues, mind
 * map, cheat sheet, teacher notes, homework, motivation, summary).
 *
 * Usage: node generate-book-03.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-03-verb-to-do.json'), 'utf8'));
const outDir = path.join(__dirname, '..', '03-Verb to Do');
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
    <div class="cover-emojis">🧑‍🎓 🔨 📚 ❓ ✏️</div>
    <h1 class="cover-title-en">Verb to Do</h1>
    <div class="cover-title-th">กริยา Verb to Do (do / does / did)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 เล่มที่ 3 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Lesson 03 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT IS VERB TO DO ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  ${banner('sb-c1', '📖', 'Verb to Do คืออะไร?', 'What is Verb to Do?', 'ส่วนที่ 2')}
  <p style="font-size:15px;line-height:1.7;">Verb to Do เป็นกริยาที่มีความสามารถพิเศษ เพราะทำหน้าที่ได้ถึง <b>2 อย่าง</b> ในประโยคเดียวกันได้เลย! ลองดูตัวอย่างด้านล่างนี้ก่อน:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">ทำ</div>กริยาหลัก (Main Verb)<div class="ex">I do my homework.<br>(ฉันทำการบ้าน)</div></div>
    <div class="meaning-box mb2"><div class="word">ช่วยถาม</div>กริยาช่วย (Auxiliary)<div class="ex">Do you like pizza?<br>(คุณชอบพิซซ่าไหม)</div></div>
    <div class="meaning-box mb3"><div class="word">ช่วยปฏิเสธ</div>กริยาช่วย (Auxiliary)<div class="ex">I don't like it.<br>(ฉันไม่ชอบมัน)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตว่ากล่องที่ 2 และ 3 คำว่า <b>do</b> ไม่ได้แปลว่า "ทำ" เลย แต่ทำหน้าที่เป็น "ตัวช่วย" สร้างประโยคคำถามกับปฏิเสธเท่านั้น — นี่คือจุดที่นักเรียนต้องแยกให้ออกให้ได้</p>
  <div class="explain-block">
    <h2>🧩 ใช้เมื่อไหร่บ้าง?</h2>
    <table>
      <tr><th>การใช้</th><th>ตัวอย่าง</th><th>คำแปล</th></tr>
      <tr><td>กริยาหลัก แปลว่า "ทำ"</td><td>She does the dishes.</td><td>เธอล้างจาน</td></tr>
      <tr><td>กริยาช่วยสร้างคำถาม</td><td>Do you play football?</td><td>คุณเล่นฟุตบอลไหม</td></tr>
      <tr><td>กริยาช่วยสร้างปฏิเสธ</td><td>He doesn't like coffee.</td><td>เขาไม่ชอบกาแฟ</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>คำแปล</th></tr>
      <tr><td>I do my homework every night.</td><td>ฉันทำการบ้านทุกคืน</td></tr>
      <tr><td>She does her best in exams.</td><td>เธอทำเต็มที่ในการสอบ</td></tr>
      <tr><td>Do you like ice cream?</td><td>คุณชอบไอศกรีมไหม</td></tr>
      <tr><td>Does he play guitar?</td><td>เขาเล่นกีตาร์หรือเปล่า</td></tr>
      <tr><td>We don't have class today.</td><td>วันนี้พวกเราไม่มีเรียน</td></tr>
      <tr><td>Did you go to school yesterday?</td><td>เมื่อวานคุณไปโรงเรียนไหม</td></tr>
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
    <div class="qtext" style="font-size:17px;">do — กริยาช่วยของ <b>I / You / We / They</b></div>
    <p style="margin:6px 0;">ใช้ do สร้างคำถามและปฏิเสธเมื่อประธานเป็น I, You, We, They (พหูพจน์ทั้งหมด)</p>
    <ul><li>Do you like pizza? (คุณชอบพิซซ่าไหม)</li><li>I don't like spiders. (ฉันไม่ชอบแมงมุม)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">does — กริยาช่วยของ <b>He / She / It</b></div>
    <p style="margin:6px 0;">ถ้าประธานเป็นเอกพจน์บุรุษที่ 3 (He/She/It หรือชื่อคน-สิ่งของเดี่ยว) ให้ใช้ does และกริยาตัวหลังต้องเป็นกริยาช่องที่ 1 เท่านั้น (ห้ามเติม s ซ้ำ)</p>
    <ul><li>Does he play football? (เขาเล่นฟุตบอลไหม)</li><li>She doesn't play tennis. (เธอไม่เล่นเทนนิส)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">did — กริยาช่วยในอดีต ใช้ได้กับ <b>ทุกประธาน</b></div>
    <p style="margin:6px 0;">เมื่อพูดถึงอดีต ไม่ต้องแยก do/does อีกต่อไป ใช้ did เหมือนกันหมดทุกประธาน และกริยาตัวหลังต้องเป็นกริยาช่องที่ 1 (ห้ามผันเป็นอดีตซ้ำ)</p>
    <ul><li>Did you go to school? (คุณไปโรงเรียนไหม)</li><li>She didn't finish it. (เธอทำมันไม่เสร็จ)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">do — กริยาแท้ แปลว่า "ทำ" ได้ทุกกาลเวลา</div>
    <p style="margin:6px 0;">นอกจากเป็นกริยาช่วยแล้ว do ยังเป็นกริยาแท้ได้ด้วย โดยผันตามประธานและกาลเวลาเหมือนกริยาทั่วไป: <b>do/does</b> (ปัจจุบัน) → <b>did</b> (อดีต)</p>
    <ul><li>I do my homework every night. (ฉันทำการบ้านทุกคืน)</li><li>She did the laundry yesterday. (เมื่อวานเธอซักผ้า)</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE ---------- */
function s4() {
  const rows = [
    ['I / You / We / They', 'do', 'did', 'I do my homework every day. / I did my homework yesterday.'],
    ['He / She / It', 'does', 'did', 'She does her homework every day. / She did her homework yesterday.'],
  ];
  const rowsHtml = rows.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${esc(r[3])}</td></tr>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'ตารางสรุป', 'Summary Table', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr><th>ประธาน (Subject)</th><th>Present Auxiliary</th><th>Past Auxiliary</th><th>ตัวอย่างประโยค</th></tr>
      ${rowsHtml}
    </table>
  </div>
  <div class="tip-card">💡 เคล็ดลับ: ท่องตารางนี้ให้ขึ้นใจ เพราะทุกกฎในบทนี้อ้างอิงจากตารางเดียวนี้ทั้งหมด! และอย่าลืม — did ใช้ได้กับทุกประธานในอดีต ไม่ต้องแยก do/does อีกแล้ว</div>
</div>`;
}

/* ---------- SECTION 5: MEMORY TRICKS ---------- */
function s5() {
  return `<div class="sheet" id="s5">
  ${banner('sb-c4', '🧠', 'เทคนิคการจำ', 'Memory Tricks', 'ส่วนที่ 5')}
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">He / She / It → does</div><p>จำว่า "He She It มี s เหมือน is/has" ก็เลยต้องใช้ does (ที่มี s อยู่ในตัว) — จำคู่กับ Verb to Be ที่ He She It ใช้ is เหมือนกัน</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">I / You / We / They → do</div><p>ประธานที่เหลือทั้งหมดใช้ do ธรรมดา ไม่มี s ต่อท้าย จำง่าย ๆ ว่า "คนอื่นนอกจาก He She It ใช้ do เฉย ๆ"</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">did ใช้กับทุกประธานในอดีต</div><p>พอเป็นอดีต ไม่ต้องคิดเรื่อง do/does อีกเลย เพราะทุกประธานใช้ did เหมือนกันหมด — จำว่า "อดีตไม่มีสอง มีแค่ did เดียว"</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">คำคล้องจอง "DDD"</div><p>ท่องจังหวะ: "<b>D</b>o, do, do — I You We They! <b>D</b>oes, does, does — He She It today! <b>D</b>id, did, did — ใช้ได้กับทุกคนในอดีต!" ท่องซ้ำ 3 รอบทุกเช้าก่อนไปโรงเรียน!</p></div>
</div>`;
}

/* ---------- SECTION 6: PHONICS CORNER ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔊', 'มุมออกเสียง', 'Phonics Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>คำ</th><th>สัทอักษร (IPA)</th><th>เสียงอ่านแบบไทย</th><th>ตัวอย่างประโยค</th></tr>
      <tr><td><b>do</b></td><td>/duː/</td><td>ดู</td><td>Do you like it? (ดู ยู ไลค์ อิท)</td></tr>
      <tr><td><b>does</b></td><td>/dʌz/</td><td>ดัซ</td><td>Does she know? (ดัซ ชี โนว์)</td></tr>
      <tr><td><b>did</b></td><td>/dɪd/</td><td>ดิด</td><td>Did you go? (ดิด ยู โกว)</td></tr>
      <tr><td><b>don't</b></td><td>/doʊnt/</td><td>โดนท์</td><td>I don't know. (ไอ โดนท์ โนว์)</td></tr>
      <tr><td><b>doesn't</b></td><td>/ˈdʌzənt/</td><td>ดัสเซินท์</td><td>He doesn't care. (ฮี ดัสเซินท์ แคร์)</td></tr>
      <tr><td><b>didn't</b></td><td>/ˈdɪdənt/</td><td>ดิดเดินท์</td><td>They didn't come. (เธ ดิดเดินท์ คัม)</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียง: คำว่า do และ does ออกเสียงคล้ายกันแต่ไม่เหมือนกัน ระวังสับสน! do ออกเสียงยาว "ดู" ส่วน does ออกเสียงสั้น "ดัซ" ลองพูดออกเสียงเปรียบเทียบกันหลาย ๆ รอบให้คุ้นหู</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['📓', 'homework', 'การบ้าน'], ['🍽️', 'dishes', 'จาน'], ['🏃', 'exercise', 'ออกกำลังกาย'],
    ['🙏', 'favor', 'ความช่วยเหลือ'], ['🧹', 'chores', 'งานบ้าน'], ['🏅', 'best', 'ดีที่สุด'],
    ['🧺', 'laundry', 'ผ้าที่ต้องซัก'], ['🧼', 'cleaning', 'การทำความสะอาด'], ['🍳', 'cooking', 'การทำอาหาร'],
    ['👔', 'ironing', 'การรีดผ้า'], ['🛍️', 'shopping', 'การซื้อของ'], ['💼', 'living', 'การดำรงชีพ/อาชีพ'],
    ['🐛', 'spiders', 'แมงมุม'], ['🥦', 'vegetables', 'ผัก'], ['🎮', 'video games', 'วิดีโอเกม'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้ใช้บ่อยที่สุดเวลาพูดถึงกิจวัตรประจำวันและวลีกับ do (do homework, do the dishes ฯลฯ) — จำไว้ให้แม่นเพราะออกสอบบ่อยมาก</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">Positive: Subject + do/does/did + main verb + ...</div>
    <div class="pex">I do my homework every night. <span class="th">(ฉันทำการบ้านทุกคืน)</span></div>
    <div class="pex">She did the laundry yesterday. <span class="th">(เมื่อวานเธอซักผ้า)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">Negative: Subject + don't/doesn't/didn't + base verb + ...</div>
    <div class="pex">I don't like spiders. <span class="th">(ฉันไม่ชอบแมงมุม)</span></div>
    <div class="pex">He didn't finish his homework. <span class="th">(เขาทำการบ้านไม่เสร็จ)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">Question: Do/Does/Did + Subject + base verb + ...?</div>
    <div class="pex">Do you like pizza? <span class="th">(คุณชอบพิซซ่าไหม)</span></div>
    <div class="pex">Did they win the game? <span class="th">(พวกเขาชนะเกมไหม)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">Short Answer: Yes, S + do/does/did. / No, S + don't/doesn't/didn't.</div>
    <div class="pex">Yes, I do. / No, I don't. <span class="th">(ใช่ ฉันชอบ / ไม่ ฉันไม่ชอบ)</span></div>
    <div class="pex">Yes, they did. / No, they didn't. <span class="th">(ใช่ พวกเขาชนะ / ไม่ พวกเขาไม่ชนะ)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาในชีวิตประจำวัน', 'Daily Conversation', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">📓 บทสนทนาที่ 1: ทำการบ้านหรือยัง (Homework Check)</div>
    <div class="bubble left"><div class="speaker">Mom</div>Do you do your homework every day?<div class="th">ลูกทำการบ้านทุกวันหรือเปล่า</div></div>
    <div class="bubble right"><div class="speaker">Nan</div>Yes, I do. I did it right after school today.<div class="th">ทำค่ะ วันนี้หนูทำเสร็จตั้งแต่กลับจากโรงเรียนแล้ว</div></div>
    <div class="bubble left"><div class="speaker">Mom</div>Great! Does your brother do his homework too?<div class="th">เยี่ยมเลย แล้วน้องชายทำการบ้านด้วยไหม</div></div>
    <div class="bubble right"><div class="speaker">Nan</div>No, he doesn't. He didn't finish it yesterday.<div class="th">ไม่ค่ะ เมื่อวานน้องทำไม่เสร็จเลย</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🧹 บทสนทนาที่ 2: กิจวัตรประจำวัน (Daily Chores)</div>
    <div class="bubble left"><div class="speaker">Ploy</div>What do you do to help at home?<div class="th">เธอทำอะไรช่วยงานบ้านบ้าง</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>I do the dishes every evening. My sister does the laundry on Sundays.<div class="th">ผมล้างจานทุกเย็น ส่วนพี่สาวซักผ้าทุกวันอาทิตย์</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>Did you do exercise this morning?<div class="th">เมื่อเช้าเธอออกกำลังกายหรือเปล่า</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>Yes, I did. I always do my best to stay healthy.<div class="th">ออกครับ ผมพยายามทำเต็มที่เพื่อสุขภาพที่ดีเสมอ</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['She do her homework.', 'She เป็นเอกพจน์บุรุษที่ 3 ต้องใช้ does ไม่ใช่ do', 'She does her homework.'],
    ['Do she like it?', 'ประธาน she เป็นเอกพจน์ ต้องใช้ Does ขึ้นต้นประโยคคำถาม', 'Does she like it?'],
    ["I doesn't like it.", 'ประธาน I ต้องใช้ don\'t ไม่ใช่ doesn\'t', "I don't like it."],
    ['She doesn\'t likes coffee.', 'หลัง doesn\'t ต้องใช้กริยาช่องที่ 1 เท่านั้น ห้ามเติม s ซ้ำ', "She doesn't like coffee."],
    ['Did you went to the party?', 'หลัง Did ต้องใช้กริยาช่องที่ 1 เสมอ ห้ามผันเป็นอดีตซ้ำ', 'Did you go to the party?'],
    ['What do you doing?', 'ห้ามใช้ do คู่กับกริยาเติม -ing แบบนี้ ถ้าถามอาชีพให้พูด "What do you do?" ถ้าถามสิ่งที่กำลังทำอยู่ให้ใช้ "What are you doing?"', 'What are you doing? / What do you do?'],
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
    'มองประธานก่อนเสมอ — He/She/It ใช้ does, ประธานอื่นใช้ do, ถ้าเป็นอดีตใช้ did กับทุกประธาน',
    'หลัง do/does/did ต้องใช้กริยาช่องที่ 1 (base verb) เสมอ ห้ามเติม s ห้ามผันเป็นอดีตซ้ำ',
    'สังเกตให้ดีว่า do ในประโยคเป็น "กริยาช่วย" หรือ "กริยาแท้" — บางประโยคมี do สองตัวในประโยคเดียว เช่น Does he do the ironing?',
    'คำถาม WH ต้องเรียง: WH + Do/Does/Did + ประธาน + กริยาช่องที่ 1 ...?',
    'ห้ามใช้ do/does/did ร่วมกับ Verb to Be เด็ดขาด (Is he does...? ไม่มีจริงในภาษาอังกฤษ)',
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
    <div class="mindmap-center">Verb to Do</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">🏋️ กริยาแท้</span>do = ทำ (do homework, do the dishes)</div>
      <div class="mindmap-branch mb-b"><span class="bt">🧩 กริยาช่วย</span>do / does (ปัจจุบัน)</div>
      <div class="mindmap-branch mb-c"><span class="bt">🚫 ปฏิเสธ</span>don't / doesn't / didn't + กริยาช่องที่ 1</div>
      <div class="mindmap-branch mb-d"><span class="bt">❓ คำถาม</span>Do/Does/Did + ประธาน + กริยาช่องที่ 1?</div>
      <div class="mindmap-branch mb-e"><span class="bt">⏮️ อดีต did</span>ใช้ได้กับทุกประธาน</div>
      <div class="mindmap-branch mb-f"><span class="bt">💬 วลีที่ใช้บ่อย</span>homework, chores, exercise, best</div>
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
    <div class="cheat-box"><h4>ตาราง Verb to Do</h4>
      <table><tr><th>ประธาน</th><th>ปัจจุบัน</th><th>อดีต</th></tr>
      <tr><td>I/You/We/They</td><td>do</td><td>did</td></tr>
      <tr><td>He/She/It</td><td>does</td><td>did</td></tr></table></div>
    <div class="cheat-box"><h4>โครงสร้างประโยค</h4>
      <ul><li>Positive: S + do/does/did + verb</li><li>Negative: S + don't/doesn't/didn't + base verb</li><li>Question: Do/Does/Did + S + base verb?</li></ul></div>
    <div class="cheat-box"><h4>กฎเหล็กต้องจำ</h4>
      <ul><li>หลัง do/does/did ต้องเป็นกริยาช่องที่ 1 เสมอ</li><li>ห้ามเติม s ซ้ำ (doesn't likes ❌)</li><li>ห้ามผันอดีตซ้ำ (Did you went ❌)</li></ul></div>
    <div class="cheat-box"><h4>เทคนิคจำเร็ว</h4>
      <ul><li>He/She/It → does (มี s เหมือน is)</li><li>คนอื่น → do</li><li>อดีต → did ใช้กับทุกคน</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกฎในบทนี้! และอย่าลืม: ห้าม "double-mark the tense" เช่นพูดว่า doesn't likes เด็ดขาด</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากแยกให้เห็นชัดว่า do มี 2 บทบาท (กริยาแท้ vs กริยาช่วย) ก่อนเข้าเนื้อหาเชิงลึก</li>
    <li>เน้นย้ำว่าหลัง do/does/did ต้องเป็นกริยาช่องที่ 1 เสมอ เพราะเป็นจุดที่นักเรียนผิดบ่อยที่สุด</li>
    <li>ใช้ตัวอย่างวลีที่ใกล้ตัว เช่น do homework, do the dishes เพื่อให้นักเรียนจำได้ง่ายและใช้ได้จริง</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Do You...? Class Survey</b> — ให้นักเรียนเดินถามเพื่อน 5 คนด้วยคำถาม "Do you...?" แล้วสรุปผลหน้าชั้น</li>
    <li><b>Chore Charades</b> — นักเรียนแสดงท่าทางทำงานบ้าน (do the dishes, do the laundry ฯลฯ) เพื่อนทายแล้วตอบเป็นประโยคเต็ม "He/She does the dishes."</li>
    <li><b>Did You Ever...? Sharing Circle</b> — นักเรียนผลัดกันเล่าประสบการณ์ในอดีตง่าย ๆ โดยใช้คำถาม "Did you ever...?" และตอบด้วย Yes, I did. / No, I didn't.</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 เพื่อวางแผนการสอนซ่อมเสริมรายบุคคล</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'เขียนย่อหน้าสั้น ๆ เกี่ยวกับกิจวัตรประจำวันของตัวเอง โดยใช้ do/does อย่างน้อย 5 ประโยค (เช่น I do my homework every night. My mother does the cooking.)',
    'สัมภาษณ์คนในครอบครัว 1 คน ถามว่าเมื่อวานเขาทำงานบ้านอะไรบ้าง โดยใช้คำถาม "Did you...?" อย่างน้อย 3 คำถาม แล้วจดคำตอบมาเล่าในห้องเรียน',
    'เขียนประโยคปฏิเสธ 3 ประโยค บอกสิ่งที่ตัวเองไม่ชอบทำ โดยใช้ don\'t/doesn\'t (เช่น I don\'t like doing the dishes.)',
    'หาตัวอย่างประโยคที่มี do/does/did จากเพลงหรือหนังที่ชอบ 3 ประโยค แล้วแปลไทย พร้อมบอกว่า do ตัวนั้นเป็นกริยาแท้หรือกริยาช่วย',
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
    <div class="quote">"ทำวันนี้ให้ดีที่สุด แล้วพรุ่งนี้จะง่ายขึ้นเสมอ" 🌟</div>
    <div class="sub">Verb to Do อาจดูซับซ้อนตอนแรกเพราะมีทั้งบทบาทกริยาแท้และกริยาช่วย แต่ถ้าฝึกแยกให้ออกบ่อย ๆ นักเรียนจะใช้ได้อย่างคล่องแคล่วแน่นอน อย่ากลัวที่จะพูดผิด เพราะทุกความผิดพลาดคือก้าวหนึ่งของการเก่งขึ้น 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง Verb to Do ที่ทำหน้าที่ได้ 2 อย่าง คือ กริยาแท้ (แปลว่า "ทำ") และกริยาช่วย ค่ะ',
    'จำแค่ 3 คำ: do ใช้กับ I You We They, does ใช้กับ He She It, did ใช้กับทุกประธานในอดีต',
    'เมื่อเป็นกริยาช่วย ให้ใช้ do/does/did สร้างประโยคคำถามและปฏิเสธในรูปแบบเดียวกันเสมอ',
    'หลัง do/does/did ต้องเป็นกริยาช่องที่ 1 เท่านั้น ห้ามเติม s ห้ามผันอดีตซ้ำ',
    'ปฏิเสธ ใช้ don\'t/doesn\'t/didn\'t + กริยาช่องที่ 1 และคำถาม ให้ยก Do/Does/Did มาไว้หน้าสุดของประโยค',
    'ระวังประโยคที่มี do สองตัว เช่น "Does he do the ironing?" — ตัวแรกช่วย ตัวหลังแท้',
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
<title>หนังสือเรียน: Verb to Do — ม.3</title>
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
