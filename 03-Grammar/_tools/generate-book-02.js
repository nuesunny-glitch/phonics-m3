/*
 * One-off "mini textbook" generator for Lesson 02: Verb to Have.
 * Reuses data-02-verb-to-have.json (already verified: grammar tables, tips,
 * worksheet, 50-question quiz, answer key) so this book's practice content
 * stays byte-consistent with the standalone quiz-pack files, and hand-authors
 * the extra storybook sections (cover, phonics, vocabulary, dialogues, mind
 * map, cheat sheet, teacher notes, homework, motivation, summary).
 *
 * Structure mirrors generate-book-01.js exactly (same BOOK_CSS, same 20
 * section ids s1-s20, same generic worksheet/quiz/answer-key reader) —
 * only the content of each section function is rewritten for this topic.
 *
 * Usage: node generate-book-02.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-02-verb-to-have.json'), 'utf8'));
const outDir = path.join(__dirname, '..', '02-Verb to Have');
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
    <div class="cover-emojis">🎒 🖐️ 👨‍👩‍👧‍👦 📚 ✏️</div>
    <h1 class="cover-title-en">Verb to Have</h1>
    <div class="cover-title-th">กริยา Verb to Have (have / has / had)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 เล่มที่ 2 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Lesson 02 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT IS VERB TO HAVE ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  ${banner('sb-c1', '📖', 'Verb to Have คืออะไร?', 'What is Verb to Have?', 'ส่วนที่ 2')}
  <p style="font-size:15px;line-height:1.7;">Verb to Have แปลว่า "มี" ใช้บอกว่าประธานมีสิ่งใดสิ่งหนึ่งอยู่ แต่ในภาษาอังกฤษจริง ๆ have/has ถูกใช้ได้หลายความหมายมากกว่าคำว่า "มีของ" อย่างเดียว ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">ครอบครอง</div>มีสิ่งของเป็นเจ้าของ<div class="ex">I have a bike.<br>(ฉันมีจักรยาน)</div></div>
    <div class="meaning-box mb2"><div class="word">ครอบครัว</div>บอกความสัมพันธ์คนในบ้าน<div class="ex">She has two brothers.<br>(เธอมีพี่ชายสองคน)</div></div>
    <div class="meaning-box mb3"><div class="word">อาการ/ความรู้สึก</div>บอกว่าป่วยหรือรู้สึกอย่างไร<div class="ex">He has a headache.<br>(เขาปวดหัว)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">นอกจากนี้ have/has ยังใช้กับ <b>วลีกิจวัตรประจำวัน</b> ที่ไม่ได้แปลว่า "มี" ตรงตัว เช่น <b>have breakfast</b> (กินอาหารเช้า), <b>have a shower</b> (อาบน้ำ), <b>have fun</b> (สนุก) — ต้องจำเป็นชุด ๆ ไปเลย</p>
  <div class="explain-block">
    <h2>🧩 ใช้เมื่อไหร่บ้าง?</h2>
    <table>
      <tr><th>การใช้</th><th>ตัวอย่าง</th><th>คำแปล</th></tr>
      <tr><td>ความเป็นเจ้าของ</td><td>They have a big garden.</td><td>พวกเขามีสวนใหญ่</td></tr>
      <tr><td>ครอบครัว/ความสัมพันธ์</td><td>We have a new teacher.</td><td>พวกเรามีครูคนใหม่</td></tr>
      <tr><td>อาการป่วย/ความรู้สึก</td><td>My brother has a cold.</td><td>น้องชายฉันเป็นหวัด</td></tr>
      <tr><td>กิจวัตรประจำวัน</td><td>I have lunch at noon.</td><td>ฉันกินอาหารกลางวันตอนเที่ยง</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>คำแปล</th></tr>
      <tr><td>I have a new bag.</td><td>ฉันมีกระเป๋าใบใหม่</td></tr>
      <tr><td>My father has a small shop.</td><td>พ่อของฉันมีร้านเล็ก ๆ</td></tr>
      <tr><td>The cat has soft fur.</td><td>แมวตัวนี้มีขนนุ่ม</td></tr>
      <tr><td>We have a lot of homework.</td><td>พวกเรามีการบ้านเยอะมาก</td></tr>
      <tr><td>She has a headache today.</td><td>วันนี้เธอปวดหัว</td></tr>
      <tr><td>They have breakfast at 7.</td><td>พวกเขากินอาหารเช้าตอน 7 โมง</td></tr>
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
    <div class="qtext" style="font-size:17px;">have — ใช้กับ <b>I / You / We / They</b> หรือคำนามพหูพจน์</div>
    <p style="margin:6px 0;">ถ้าประธานเป็น I, You, We, They หรือคำนามพหูพจน์ ให้ใช้ have เสมอ</p>
    <ul><li>I have a new bag. (ฉันมีกระเป๋าใบใหม่)</li><li>They have a big garden. (พวกเขามีสวนใหญ่)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">has — ใช้กับ <b>He / She / It</b> หรือคำนามเอกพจน์</div>
    <p style="margin:6px 0;">ถ้าพูดถึงคนเดียว/สิ่งเดียว (เอกพจน์บุรุษที่ 3) ให้เปลี่ยน have เป็น <b>has</b> เสมอ (ไม่ใช่ haves)</p>
    <ul><li>She has two brothers. (เธอมีพี่ชายสองคน)</li><li>My father has a small shop. (พ่อของฉันมีร้านเล็ก ๆ)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3 (BONUS)</span>
    <div class="qtext" style="font-size:17px;">had — ใช้กับ <b>ทุกประธาน</b> ในอดีต</div>
    <p style="margin:6px 0;">พอเป็นเรื่องราวในอดีต ทั้ง have และ has จะกลายเป็น <b>had</b> เหมือนกันหมด ไม่ต้องแยกเอกพจน์-พหูพจน์อีกแล้ว</p>
    <ul><li>I had a bike when I was young. (ตอนเด็กฉันมีจักรยาน)</li><li>She had long hair last year. (ปีที่แล้วเธอผมยาว)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">have (มี) vs have to (ต้อง) — ห้ามสับสน!</div>
    <p style="margin:6px 0;">ถ้าหลัง have/has ตามด้วย <b>คำนาม</b> แปลว่า "มี" แต่ถ้าตามด้วย <b>to + กริยาช่อง 1</b> แปลว่า "ต้อง" (ความจำเป็น)</p>
    <ul><li>I have a book. (ฉันมีหนังสือ) ≠ I have to study. (ฉันต้องเรียน)</li><li>She has to wear a uniform. (เธอต้องใส่ชุดนักเรียน)</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE ---------- */
function s4() {
  const rows = [
    ['I', 'have', 'had', 'I have/had a pen.'],
    ['You', 'have', 'had', 'You have/had a nice bike.'],
    ['We', 'have', 'had', 'We have/had a great time.'],
    ['They', 'have', 'had', 'They have/had a dog.'],
    ['He', 'has', 'had', 'He has/had a car.'],
    ['She', 'has', 'had', 'She has/had a headache.'],
    ['It', 'has', 'had', 'It has/had soft fur.'],
  ];
  const rowsHtml = rows.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${esc(r[3])}</td></tr>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'ตารางสรุป', 'Summary Table', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr><th>ประธาน (Subject)</th><th>ปัจจุบัน</th><th>อดีต</th><th>ตัวอย่างประโยค</th></tr>
      ${rowsHtml}
    </table>
  </div>
  <div class="explain-block">
    <h2>🚫❓ ปฏิเสธและคำถาม</h2>
    <table>
      <tr><th></th><th>ปัจจุบัน</th><th>อดีต</th><th>ตัวอย่าง</th></tr>
      <tr><td>ปฏิเสธ</td><td>don't/doesn't have</td><td>didn't have</td><td>He doesn't have / didn't have a car.</td></tr>
      <tr><td>คำถาม</td><td>Do/Does...have?</td><td>Did...have?</td><td>Does she have / Did she have a dog?</td></tr>
    </table>
  </div>
  <div class="tip-card">💡 เคล็ดลับ: ท่องตารางนี้ให้ขึ้นใจ เพราะทุกกฎในบทนี้อ้างอิงจากตารางเดียวนี้ทั้งหมด!</div>
</div>`;
}

/* ---------- SECTION 5: MEMORY TRICKS ---------- */
function s5() {
  return `<div class="sheet" id="s5">
  ${banner('sb-c4', '🧠', 'เทคนิคการจำ', 'Memory Tricks', 'ส่วนที่ 5')}
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">He / She / It → has</div><p>สามคนนี้มี "ตัว s" เหมือนกับ is เลย — จำว่า "He She It ชอบเติม s เข้าไปหน่อย"</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">I / You / We / They → have</div><p>ประธานที่เหลือทั้งหมดใช้ have ธรรมดา ไม่ต้องเติมอะไร</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">คาถาจังหวะ</div><p>ท่องคล้องจอง: "I have, You have, He has, She has, It has, We have, They have" ซ้ำ ๆ จนติดปาก</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">อดีตง่ายกว่าอีก!</div><p>ทุกประธานในอดีตใช้ <b>had</b> เหมือนกันหมด ไม่ต้องแยกเอกพจน์-พหูพจน์ ไม่มีคำว่า "hased" หรือ "haved" — จำแค่คำเดียวจบ!</p></div>
</div>`;
}

/* ---------- SECTION 6: PHONICS CORNER ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔊', 'มุมออกเสียง', 'Phonics Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>คำ</th><th>สัทอักษร (IPA)</th><th>เสียงอ่านแบบไทย</th><th>ตัวอย่างประโยค</th></tr>
      <tr><td><b>have</b></td><td>/hæv/</td><td>แฮฟ</td><td>I have a pen. (ไอ แฮฟ อะ เพน)</td></tr>
      <tr><td><b>has</b></td><td>/hæz/</td><td>แฮซ</td><td>She has a cat. (ชี แฮซ อะ แคท)</td></tr>
      <tr><td><b>had</b></td><td>/hæd/</td><td>แฮด</td><td>They had a dog. (เธ แฮด อะ ดอก)</td></tr>
      <tr><td><b>don't have</b></td><td>/doʊnt hæv/</td><td>โดนท์ แฮฟ</td><td>I don't have time. (ไอ โดนท์ แฮฟ ไทม์)</td></tr>
      <tr><td><b>doesn't have</b></td><td>/ˈdʌzənt hæv/</td><td>ดัซเซินท์ แฮฟ</td><td>He doesn't have a car.</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียงสนุก ๆ: เวลาเจ้าของภาษาพูดคำว่า <b>"have to"</b> เร็ว ๆ เสียง v กับ t จะกลืนกันจนฟังดูเหมือน <b>/hæftə/ (แฮฟทู)</b> เช่น "I have to go" จะฟังดูเหมือน "ไอ แฮฟทู โก" — ลองฟังเพลงหรือหนังฝรั่งดูแล้วจะได้ยินแบบนี้บ่อยมาก!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['👦', 'brother', 'พี่/น้องชาย'], ['👧', 'sister', 'พี่/น้องสาว'], ['🐶', 'pet', 'สัตว์เลี้ยง'],
    ['🤒', 'a cold', 'เป็นหวัด'], ['🤕', 'a headache', 'ปวดหัว'], ['🌡️', 'a fever', 'เป็นไข้'],
    ['🚲', 'bike', 'จักรยาน'], ['📱', 'phone', 'โทรศัพท์'], ['🎒', 'bag', 'กระเป๋า'],
    ['🍳', 'breakfast', 'อาหารเช้า'], ['🚿', 'a shower', 'อาบน้ำ'], ['🎉', 'fun', 'ความสนุก'],
    ['🏠', 'a garden', 'สวน'], ['🚗', 'a car', 'รถยนต์'], ['👨‍👩‍👧‍👦', 'family', 'ครอบครัว'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้ใช้บ่อยที่สุดเวลาแต่งประโยคกับ Verb to Have — แบ่งเป็น 3 หมวด: คนในครอบครัว, อาการป่วย, และสิ่งของ/กิจวัตรประจำวัน</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">Positive: Subject + have/has + ...</div>
    <div class="pex">I have a bike. <span class="th">(ฉันมีจักรยาน)</span></div>
    <div class="pex">She has two brothers. <span class="th">(เธอมีพี่ชายสองคน)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">Negative: Subject + don't/doesn't + have + ...</div>
    <div class="pex">I don't have a car. <span class="th">(ฉันไม่มีรถยนต์)</span></div>
    <div class="pex">He doesn't have a pet. <span class="th">(เขาไม่มีสัตว์เลี้ยง)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">Question: Do/Does + Subject + have + ...?</div>
    <div class="pex">Do you have a pen? <span class="th">(เธอมีปากกาไหม)</span></div>
    <div class="pex">Does she have a sister? <span class="th">(เธอมีน้องสาวไหม)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">Short Answer: Yes, S + do/does. / No, S + don't/doesn't.</div>
    <div class="pex">Yes, I do. / No, I don't. <span class="th">(ใช่ ฉันมี / ไม่ ฉันไม่มี)</span></div>
    <div class="pex">Yes, she does. / No, she doesn't. <span class="th">(ใช่ เธอมี / ไม่ เธอไม่มี)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาในชีวิตประจำวัน', 'Daily Conversation', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">👨‍👩‍👧‍👦 บทสนทนาที่ 1: ครอบครัวของฉัน (My Family)</div>
    <div class="bubble left"><div class="speaker">Nan</div>Do you have any brothers or sisters?<div class="th">เธอมีพี่น้องไหม</div></div>
    <div class="bubble right"><div class="speaker">Tim</div>Yes, I do. I have one brother and one sister.<div class="th">มีครับ ผมมีพี่ชายหนึ่งคนกับน้องสาวหนึ่งคน</div></div>
    <div class="bubble left"><div class="speaker">Nan</div>That's nice! Does your family have a pet?<div class="th">ดีจังเลย ครอบครัวเธอมีสัตว์เลี้ยงไหม</div></div>
    <div class="bubble right"><div class="speaker">Tim</div>Yes, we have a small dog. Her name is Milo.<div class="th">มีครับ พวกเรามีสุนัขตัวเล็ก ๆ ชื่อไมโล</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🤒 บทสนทนาที่ 2: รู้สึกไม่สบาย (Feeling Sick)</div>
    <div class="bubble left"><div class="speaker">Ploy</div>What's wrong? You don't look well.<div class="th">เป็นอะไรไป ดูท่าทางไม่ค่อยสบายเลย</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>I have a headache and a fever.<div class="th">ผมปวดหัวและมีไข้</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>Oh no! Does your sister have a cold too?<div class="th">แย่จัง น้องสาวเธอเป็นหวัดด้วยไหม</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>Yes, she has a bad cold. We have to see a doctor today.<div class="th">ใช่ครับ เธอเป็นหวัดหนัก พวกเราต้องไปหาหมอวันนี้</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['I has a dog.', 'ประธาน I ต้องใช้ have เสมอ ไม่ใช่ has', 'I have a dog.'],
    ['She have a cat.', 'She เป็นเอกพจน์ ต้องใช้ has ไม่ใช่ have', 'She has a cat.'],
    ["I don't has time.", "หลัง don't/doesn't ต้องใช้ have รูปเดิมเสมอ ไม่ผันซ้ำเป็น has", "I don't have time."],
    ['Has you a pen?', 'ประโยคคำถามกับ you ต้องใช้ Do ขึ้นต้น ไม่ใช่ Has', 'Do you have a pen?'],
    ['He haved a car last year.', 'อดีตของ have/has คือ had (irregular verb) ห้ามเติม ed', 'He had a car last year.'],
    ['He is a headache.', 'อาการป่วยต้องใช้ have/has ไม่ใช่ Verb to Be', 'He has a headache.'],
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
    'มองประธานก่อนเสมอ — ถ้าเป็น He/She/It หรือคำนามเอกพจน์ ใช้ has ถ้าไม่ใช่ ใช้ have',
    "ปฏิเสธและคำถามใช้ don't/doesn't/Do/Does + have เสมอ (ห้ามใช้ has ตามหลังกริยาช่วย)",
    'อดีตกาลใช้ had กับทุกประธานเหมือนกันหมด ไม่มีคำว่า haved หรือ hased',
    'ระวัง have to / has to ที่แปลว่า "ต้อง" ไม่ใช่ "มี" — ดูว่าคำถัดไปเป็น to+กริยา หรือคำนาม',
    'อาการป่วย/ความรู้สึกใช้ have/has เท่านั้น (a headache, a cold, a fever) ห้ามใช้ Verb to Be',
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
    <div class="mindmap-center">Verb to Have</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">🔤 ความหมาย</span>ครอบครอง / ครอบครัว / อาการป่วย / กิจวัตร</div>
      <div class="mindmap-branch mb-b"><span class="bt">🧩 รูปแบบ</span>have / has (ปัจจุบัน) → had (อดีต)</div>
      <div class="mindmap-branch mb-c"><span class="bt">🚫 ปฏิเสธ</span>don't/doesn't/didn't + have</div>
      <div class="mindmap-branch mb-d"><span class="bt">❓ คำถาม</span>Do/Does/Did + ประธาน + have...?</div>
      <div class="mindmap-branch mb-e"><span class="bt">📌 Have to</span>แปลว่า "ต้อง" ไม่ใช่ "มี"</div>
      <div class="mindmap-branch mb-f"><span class="bt">🍳 วลีกิจวัตร</span>have breakfast / a shower / fun</div>
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
    <div class="cheat-box"><h4>ตาราง Verb to Have</h4>
      <table><tr><th>ประธาน</th><th>ปัจจุบัน</th><th>อดีต</th></tr>
      <tr><td>I/You/We/They</td><td>have</td><td>had</td></tr>
      <tr><td>He/She/It</td><td>has</td><td>had</td></tr></table></div>
    <div class="cheat-box"><h4>โครงสร้างประโยค</h4>
      <ul><li>Positive: S + have/has + ...</li><li>Negative: S + don't/doesn't + have</li><li>Question: Do/Does + S + have...?</li><li>Past: S + had / didn't have / Did...have?</li></ul></div>
    <div class="cheat-box"><h4>Have to ≠ Have</h4>
      <ul><li>have + คำนาม = มี</li><li>have to + กริยาช่อง 1 = ต้อง</li><li>He has to go. (เขาต้องไป)</li><li>He has a car. (เขามีรถ)</li></ul></div>
    <div class="cheat-box"><h4>เทคนิคจำเร็ว</h4>
      <ul><li>He/She/It → has (มี s)</li><li>ที่เหลือ → have</li><li>อดีต: ทุกประธาน → had</li><li>ปฏิเสธ/คำถาม ใช้ have เสมอ ไม่ใช่ has</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกฎในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากสิ่งของ/สัตว์เลี้ยงของนักเรียนเองก่อน แล้วค่อยขยายไปพูดถึงครอบครัวและอาการป่วย</li>
    <li>เน้นย้ำจุดสับสนสำคัญ: หลัง don't/doesn't ต้องใช้ have เสมอ (ไม่ผันซ้ำเป็น has)</li>
    <li>สอนแยก have (มี) กับ have to (ต้อง) โดยให้นักเรียนสังเกตคำที่ตามหลังเสมอ (คำนาม vs to+กริยา)</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Family Tree Interview</b> — ให้นักเรียนวาดต้นไม้ครอบครัวแล้วบรรยายด้วย have/has (I have one brother. She has a big family.)</li>
    <li><b>What's in your bag?</b> — จับคู่ถามตอบ "Do you have a pencil?" แล้วเปิดกระเป๋าตรวจคำตอบจริง</li>
    <li><b>Do you have...? Matching Game</b> — จับคู่บัตรภาพของกับประโยค "I have a ___." เพื่อฝึกคำศัพท์ไปพร้อมกัน</li>
    <li><b>Doctor Role-Play</b> — ให้นักเรียนสวมบทเป็นหมอ/คนไข้ ฝึกประโยค "I have a headache." / "Does he have a fever?"</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 โดยเฉพาะ has/have หลัง don't/doesn't เพื่อวางแผนการสอนซ่อมเสริมรายบุคคล</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'วาดต้นไม้ครอบครัวของตัวเอง แล้วเขียนบรรยาย 5 ประโยคโดยใช้ have/has (เช่น My mother has two sisters.)',
    'เขียนบรรยายสัตว์เลี้ยง (หรือสัตว์เลี้ยงในฝัน) 3 ประโยค โดยใช้ "It has..." หรือ "I have..."',
    'สัมภาษณ์คนในครอบครัว 1 คน ถามว่าในห้องของเขามีอะไรบ้าง ด้วยคำถาม "Do you have...?" อย่างน้อย 3 คำถาม แล้วจดคำตอบมาเล่าในห้องเรียน',
    'เขียนประโยคเปรียบเทียบ have (มี) กับ have to (ต้อง) อย่างละ 2 ประโยค แล้วแปลไทยกำกับ',
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
    <div class="quote">"ยิ่งเรียนรู้คำว่า have/has มากเท่าไหร่ ก็ยิ่งเล่าเรื่องครอบครัวและชีวิตตัวเองเป็นภาษาอังกฤษได้มากเท่านั้น" 🌟</div>
    <div class="sub">Verb to Have ช่วยให้นักเรียนพูดถึงสิ่งที่ตัวเองมี คนที่ตัวเองรัก และความรู้สึกของตัวเองได้อย่างมั่นใจ ลองฝึกเล่าเรื่องครอบครัวหรือสัตว์เลี้ยงของตัวเองเป็นภาษาอังกฤษดูนะ แล้วจะรู้สึกว่าภาษาอังกฤษใกล้ตัวกว่าที่คิด 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง Verb to Have ที่แปลว่า "มี" ค่ะ',
    'จำแค่นี้: He She It ใช้ has (มีตัว s เหมือน is) ส่วน I You We They ใช้ have',
    'ในอดีต ทุกประธานใช้ had เหมือนกันหมด ไม่ต้องแยกเอกพจน์-พหูพจน์อีกแล้ว',
    'ปฏิเสธ ใช้ don\'t/doesn\'t/didn\'t + have เสมอ (ห้ามใช้ has ตามหลังกริยาช่วย)',
    'คำถาม ใช้ Do/Does/Did ขึ้นต้นประโยค แล้วตามด้วยประธาน + have',
    'ระวัง have to ที่แปลว่า "ต้อง" ไม่ใช่ "มี" — ดูคำที่ตามหลังให้ดี',
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
<title>หนังสือเรียน: Verb to Have — ม.3</title>
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
