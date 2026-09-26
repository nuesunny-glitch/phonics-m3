/*
 * One-off "mini textbook" generator for Lesson 01: Verb to Be.
 * Reuses data-01-verb-to-be.json (already verified: grammar tables, tips,
 * worksheet, 50-question quiz, answer key) so this book's practice content
 * stays byte-consistent with the standalone quiz-pack files, and hand-authors
 * the extra storybook sections (cover, phonics, vocabulary, dialogues, mind
 * map, cheat sheet, teacher notes, homework, motivation, summary).
 *
 * Usage: node generate-book-01.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-01-verb-to-be.json'), 'utf8'));
const outDir = path.join(__dirname, '..', '01-Verb to Be');
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
    <div class="cover-emojis">🧑‍🎓 👧 👦 📚 ✏️</div>
    <h1 class="cover-title-en">Verb to Be</h1>
    <div class="cover-title-th">กริยา Verb to Be (am / is / are / was / were)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 เล่มที่ 1 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Lesson 01 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT IS VERB TO BE ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  ${banner('sb-c1', '📖', 'Verb to Be คืออะไร?', 'What is Verb to Be?', 'ส่วนที่ 2')}
  <p style="font-size:15px;line-height:1.7;">Verb to Be เป็นกริยาพิเศษที่นักเรียนไทยจะเจอบ่อยที่สุดในภาษาอังกฤษ เพราะมันไม่ได้แปลว่าอย่างเดียว แต่มีความหมายได้ถึง 3 แบบ ขึ้นอยู่กับบริบทของประโยค ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">เป็น</div>บอกว่าใครเป็นอะไร<div class="ex">I am a student.<br>(ฉันเป็นนักเรียน)</div></div>
    <div class="meaning-box mb2"><div class="word">อยู่</div>บอกว่าอยู่ที่ไหน<div class="ex">They are at school.<br>(พวกเขาอยู่ที่โรงเรียน)</div></div>
    <div class="meaning-box mb3"><div class="word">คือ</div>บอกว่าสิ่งนี้คืออะไร<div class="ex">This is my dog.<br>(นี่คือสุนัขของฉัน)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่าทั้ง 3 ประโยคใช้คำว่า <b>am / are / is</b> เหมือนกัน แต่แปลไทยต่างกันตามบริบท — นี่คือเหตุผลที่ต้องเข้าใจ "การใช้งาน" มากกว่าจะท่องจำแค่คำแปลเดียว</p>
  <div class="explain-block">
    <h2>🧩 ใช้เมื่อไหร่บ้าง?</h2>
    <table>
      <tr><th>การใช้</th><th>ตัวอย่าง</th><th>คำแปล</th></tr>
      <tr><td>บอกชื่อ/อาชีพ/ตัวตน</td><td>He is a doctor.</td><td>เขาเป็นหมอ</td></tr>
      <tr><td>บอกลักษณะ/ความรู้สึก</td><td>The dog is big. / I am happy.</td><td>สุนัขตัวใหญ่ / ฉันมีความสุข</td></tr>
      <tr><td>บอกสถานที่</td><td>We are at home.</td><td>พวกเราอยู่ที่บ้าน</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>คำแปล</th></tr>
      <tr><td>I am ten years old.</td><td>ฉันอายุสิบขวบ</td></tr>
      <tr><td>My mother is kind.</td><td>แม่ของฉันใจดี</td></tr>
      <tr><td>We are friends.</td><td>พวกเราเป็นเพื่อนกัน</td></tr>
      <tr><td>The book is on the table.</td><td>หนังสืออยู่บนโต๊ะ</td></tr>
      <tr><td>They are happy today.</td><td>วันนี้พวกเขามีความสุข</td></tr>
      <tr><td>It is a cat.</td><td>มันคือแมว</td></tr>
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
    <div class="qtext" style="font-size:17px;">am — ใช้กับ <b>I</b> เท่านั้น!</div>
    <p style="margin:6px 0;">จำง่าย ๆ ว่าคำว่า <b>am</b> ผูกติดกับ I เพียงคำเดียวในโลกนี้ ไม่มีประธานอื่นใช้ am เด็ดขาด</p>
    <ul><li>I am a student. (ฉันเป็นนักเรียน)</li><li>I am hungry. (ฉันหิว)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">is — ใช้กับ <b>He / She / It</b> หรือคำนามเอกพจน์</div>
    <p style="margin:6px 0;">ถ้าพูดถึงคนเดียว/สิ่งเดียว (เอกพจน์) ให้ใช้ is เสมอ</p>
    <ul><li>He is a doctor. (เขาเป็นหมอ)</li><li>My dog is friendly. (สุนัขของฉันเป็นมิตร)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">are — ใช้กับ <b>You / We / They</b> หรือคำนามพหูพจน์</div>
    <p style="margin:6px 0;">ใช้กับ You เสมอ (ไม่ว่าจะคนเดียวหรือหลายคน) และใช้กับ We/They หรือคำนามที่เป็นพหูพจน์</p>
    <ul><li>You are my friend. (เธอเป็นเพื่อนของฉัน)</li><li>They are students. (พวกเขาเป็นนักเรียน)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">was / were — เมื่อเรื่องราวเกิดขึ้นในอดีต</div>
    <p style="margin:6px 0;">แค่เปลี่ยน am/is → <b>was</b> และ are → <b>were</b> เท่านั้น กฎประธานเหมือนเดิมทุกอย่าง</p>
    <ul><li>I was at home yesterday. (เมื่อวานฉันอยู่บ้าน)</li><li>They were at the beach last week. (สัปดาห์ก่อนพวกเขาอยู่ที่ชายหาด)</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE ---------- */
function s4() {
  const rows = [
    ['I', 'am', 'I am a student.'],
    ['You', 'are', 'You are my friend.'],
    ['We', 'are', 'We are happy.'],
    ['They', 'are', 'They are students.'],
    ['He', 'is', 'He is a doctor.'],
    ['She', 'is', 'She is my sister.'],
    ['It', 'is', 'It is a cat.'],
  ];
  const rowsHtml = rows.map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${esc(r[2])}</td></tr>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'ตารางสรุป', 'Summary Table', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr><th>ประธาน (Subject)</th><th>Verb to Be</th><th>ตัวอย่างประโยค</th></tr>
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
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">I → am</div><p>มีแค่ตัวเดียวในโลกที่ใช้ am นั่นคือ I เท่านั้น จำแบบนี้: "I อยู่คนเดียว ใช้ am คนเดียว"</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">He / She / It → is</div><p>ถ้าพูดถึง "คนเดียว-สิ่งเดียว" (ไม่ใช่ I) ให้ใช้ is เสมอ — จำว่า "1 คน 1 สิ่ง ใช้ is"</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">You / We / They → are</div><p>You We They ใช้ are ทั้งหมด — จำคล้องจอง "You We They ARE together!"</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">คาถา "AIA"</div><p><b>A</b>m คู่กับ I, <b>I</b>s คู่กับ He-She-It, <b>A</b>re คู่กับ You-We-They — ท่องจังหวะ "I am, You are, He is, She is, It is, We are, They are" ซ้ำ 3 รอบทุกเช้าก่อนไปโรงเรียน!</p></div>
</div>`;
}

/* ---------- SECTION 6: PHONICS CORNER ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔊', 'มุมออกเสียง', 'Phonics Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>คำ</th><th>สัทอักษร (IPA)</th><th>เสียงอ่านแบบไทย</th><th>ตัวอย่างประโยค</th></tr>
      <tr><td><b>am</b></td><td>/æm/</td><td>แอม</td><td>I am happy. (ไอ แอม แฮปปี้)</td></tr>
      <tr><td><b>is</b></td><td>/ɪz/</td><td>อิซ</td><td>She is kind. (ชี อิซ ไคน์ด)</td></tr>
      <tr><td><b>are</b></td><td>/ɑːr/</td><td>อาร์</td><td>They are here. (เธ อาร์ เฮียร์)</td></tr>
      <tr><td><b>was</b></td><td>/wʌz/</td><td>วอส</td><td>I was tired. (ไอ วอส ไทเออร์ด)</td></tr>
      <tr><td><b>were</b></td><td>/wɜːr/</td><td>เวอร์</td><td>They were late. (เธ เวอร์ เลท)</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียง: เจ้าของภาษามักพูดคำเหล่านี้แบบ "หดเสียง" (Contraction) เช่น I'm (ไอม์), She's (ชีส), They're (แธร์) — ลองฝึกพูดแบบหดเสียงให้คล่องด้วยนะ เพราะคนอังกฤษพูดแบบนี้ในชีวิตจริง!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['👩‍🏫', 'teacher', 'ครู'], ['👨‍⚕️', 'doctor', 'หมอ'], ['👩‍⚕️', 'nurse', 'พยาบาล'],
    ['👨‍🌾', 'farmer', 'ชาวนา'], ['🧑‍🎓', 'student', 'นักเรียน'], ['👮', 'police officer', 'ตำรวจ'],
    ['😄', 'happy', 'มีความสุข'], ['😴', 'tired', 'เหนื่อย/ง่วง'], ['🍔', 'hungry', 'หิว'],
    ['📏', 'tall', 'สูง'], ['💛', 'kind', 'ใจดี'], ['⏰', 'busy', 'ยุ่ง'],
    ['🏫', 'school', 'โรงเรียน'], ['🏠', 'home', 'บ้าน'], ['🏥', 'hospital', 'โรงพยาบาล'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้ใช้บ่อยที่สุดเวลาแต่งประโยคกับ Verb to Be — แบ่งเป็น 3 หมวด: อาชีพ, ความรู้สึก/ลักษณะ, และสถานที่</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">Positive: Subject + am/is/are + ...</div>
    <div class="pex">I am a student. <span class="th">(ฉันเป็นนักเรียน)</span></div>
    <div class="pex">They are happy. <span class="th">(พวกเขามีความสุข)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">Negative: Subject + am/is/are + not + ...</div>
    <div class="pex">I am not tired. <span class="th">(ฉันไม่เหนื่อย)</span></div>
    <div class="pex">She is not busy. (She isn't busy.) <span class="th">(เธอไม่ยุ่ง)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">Question: Am/Is/Are + Subject + ...?</div>
    <div class="pex">Are you ready? <span class="th">(เธอพร้อมหรือยัง)</span></div>
    <div class="pex">Is he your friend? <span class="th">(เขาเป็นเพื่อนเธอหรือเปล่า)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">Short Answer: Yes, S + am/is/are. / No, S + am/is/are + not.</div>
    <div class="pex">Yes, I am. / No, I'm not. <span class="th">(ใช่ ฉันพร้อม / ไม่ ฉันไม่พร้อม)</span></div>
    <div class="pex">Yes, he is. / No, he isn't. <span class="th">(ใช่ เขาเป็น / ไม่ เขาไม่เป็น)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาในชีวิตประจำวัน', 'Daily Conversation', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🏫 บทสนทนาที่ 1: ที่โรงเรียน (At School)</div>
    <div class="bubble left"><div class="speaker">Ann</div>Hi! Are you a new student?<div class="th">สวัสดี เธอเป็นนักเรียนใหม่หรือเปล่า</div></div>
    <div class="bubble right"><div class="speaker">Somchai</div>Yes, I am. My name is Somchai.<div class="th">ใช่ครับ ผมชื่อสมชาย</div></div>
    <div class="bubble left"><div class="speaker">Ann</div>Nice to meet you! I'm Ann. Is this your classroom?<div class="th">ยินดีที่ได้รู้จักนะ ฉันแอน นี่ห้องเรียนของเธอหรือเปล่า</div></div>
    <div class="bubble right"><div class="speaker">Somchai</div>Yes, it is. My classmates are very friendly.<div class="th">ใช่ครับ เพื่อนร่วมชั้นของผมเป็นมิตรมากเลย</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🤝 บทสนทนาที่ 2: ทำความรู้จักเพื่อนใหม่ (Meeting a New Friend)</div>
    <div class="bubble left"><div class="speaker">Ploy</div>Hello! What's your name?<div class="th">สวัสดี เธอชื่ออะไร</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>I'm Ben. I'm from England. Are you from Bangkok?<div class="th">ผมชื่อเบน มาจากอังกฤษ เธอมาจากกรุงเทพหรือเปล่า</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>Yes, I am. This is my sister. She is twelve years old.<div class="th">ใช่ค่ะ นี่น้องสาวของฉัน เธออายุสิบสองปี</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>Nice to meet you both! You are very kind.<div class="th">ยินดีที่ได้รู้จักทั้งสองคนเลย พวกเธอใจดีมาก</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['I is a student.', 'I ต้องใช้ am เสมอ ไม่ใช่ is', 'I am a student.'],
    ['She are happy.', 'She เป็นเอกพจน์ ต้องใช้ is ไม่ใช่ are', 'She is happy.'],
    ['They is friends.', 'They เป็นพหูพจน์ ต้องใช้ are ไม่ใช่ is', 'They are friends.'],
    ["He don't is tired.", 'ห้ามใช้ do/don\'t ร่วมกับ Verb to Be — ปฏิเสธด้วย not เท่านั้น', "He isn't tired."],
    ['Am you ready?', 'ประธาน you ต้องใช้ Are ขึ้นต้นประโยคคำถาม ไม่ใช่ Am', 'Are you ready?'],
    ['Everyone are excited.', 'Everyone ถือเป็นเอกพจน์เสมอ แม้จะหมายถึงหลายคน ต้องใช้ is', 'Everyone is excited.'],
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
    'มองประธานก่อนเสมอ — วงกลมประธานในโจทย์ก่อนเลือก am/is/are/was/were',
    'ระวังคำนามพิเศษ เช่น Everyone, News, Glasses, จำนวนเงิน ที่กฎเอกพจน์/พหูพจน์แปลกไปจากปกติ',
    'ประโยคคำถาม: Verb to Be ต้องมาไว้หน้าสุดของประโยคเสมอ',
    'ประโยคปฏิเสธ: เติม not ต่อท้าย Verb to Be ทันที ไม่ต้องใช้ do/does/did ช่วย',
    'ถ้าโจทย์มีคำว่า yesterday, last night, ago, last week ให้เปลี่ยนเป็น was/were ทันที',
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
    <div class="mindmap-center">Verb to Be</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">🔤 ความหมาย</span>เป็น / อยู่ / คือ</div>
      <div class="mindmap-branch mb-b"><span class="bt">🧩 รูปแบบ</span>am / is / are / was / were</div>
      <div class="mindmap-branch mb-c"><span class="bt">🚫 ปฏิเสธ</span>เติม not ต่อท้าย (isn't, aren't, wasn't, weren't)</div>
      <div class="mindmap-branch mb-d"><span class="bt">❓ คำถาม</span>สลับ Be มาไว้หน้าประธาน</div>
      <div class="mindmap-branch mb-e"><span class="bt">📦 There is/are</span>บอกว่ามีอะไรอยู่ที่ไหน</div>
      <div class="mindmap-branch mb-f"><span class="bt">⚠️ ข้อควรระวัง</span>Everyone/News/Glasses/เงิน ใช้กฎพิเศษ</div>
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
    <div class="cheat-box"><h4>ตาราง Verb to Be</h4>
      <table><tr><th>ประธาน</th><th>ปัจจุบัน</th><th>อดีต</th></tr>
      <tr><td>I</td><td>am</td><td>was</td></tr>
      <tr><td>He/She/It</td><td>is</td><td>was</td></tr>
      <tr><td>You/We/They</td><td>are</td><td>were</td></tr></table></div>
    <div class="cheat-box"><h4>โครงสร้างประโยค</h4>
      <ul><li>Positive: S + be + ...</li><li>Negative: S + be + not + ...</li><li>Question: Be + S + ...?</li><li>There is/are + นาม</li></ul></div>
    <div class="cheat-box"><h4>คำนามพิเศษต้องระวัง</h4>
      <ul><li>Everyone/News → is (เอกพจน์)</li><li>Glasses/Trousers → are (พหูพจน์)</li><li>จำนวนเงินรวม → is (เอกพจน์)</li></ul></div>
    <div class="cheat-box"><h4>เทคนิคจำเร็ว</h4>
      <ul><li>I → am เท่านั้น</li><li>He/She/It → is</li><li>You/We/They → are</li><li>อดีต: is/am→was, are→were</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกฎในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากตัวอย่างใกล้ตัวนักเรียนก่อนเข้าเนื้อหา (ชื่อเพื่อนในห้อง, อาชีพในครอบครัว)</li>
    <li>ให้นักเรียนแต่งประโยคเกี่ยวกับตัวเองก่อน แล้วค่อยขยายไปแต่งเกี่ยวกับเพื่อน/คนในครอบครัว</li>
    <li>เน้นย้ำว่า Verb to Be ไม่ใช้ do/does/did ช่วยปฏิเสธ/คำถาม เพราะเป็นจุดที่นักเรียนสับสนบ่อยที่สุด</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Verb to Be Bingo</b> — แจกตารางบิงโกที่มีประโยคเว้นช่องว่าง ครูอ่านประโยคแบบสุ่ม นักเรียนเติม am/is/are ในตาราง</li>
    <li><b>Musical Chairs Q&A</b> — เปิดเพลง หยุดเพลงแล้วชี้ให้นักเรียนถามตอบด้วยคำถาม Yes/No (Are you...? Is she...?)</li>
    <li><b>Charades ทายอาชีพ</b> — นักเรียนแสดงท่าทาง เพื่อนทาย แล้วพูดประโยคเต็ม "He/She is a ___."</li>
    <li><b>Class Survey</b> — ให้นักเรียนเดินถามเพื่อน 5 คนด้วยคำถาม "Are you...?" แล้วสรุปผลหน้าชั้น</li>
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
    'เขียนประโยค 5 ประโยคเกี่ยวกับครอบครัวของตัวเอง โดยใช้ is/are (เช่น My father is a farmer.)',
    'วาดรูปสัตว์เลี้ยงตัวโปรด แล้วเขียนบรรยาย 3 ประโยคโดยใช้ "It is..."',
    'หาประโยคภาษาอังกฤษที่มี Verb to Be จากเพลงหรือหนังที่ชอบ 3 ประโยค แล้วแปลไทย',
    'สัมภาษณ์คนในครอบครัว 1 คน ด้วยคำถาม "Are you...?" อย่างน้อย 3 คำถาม แล้วจดคำตอบมาเล่าในห้องเรียน',
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
    <div class="quote">"ทุกคนเก่งภาษาอังกฤษได้ ถ้าฝึกทุกวันแม้แค่วันละนิด" 🌟</div>
    <div class="sub">Verb to Be คือก้าวแรกของไวยากรณ์อังกฤษทั้งหมด ถ้าวันนี้เข้าใจ am/is/are แน่นแล้ว บทต่อ ๆ ไปจะง่ายขึ้นมาก อย่ากลัวที่จะพูดผิด เพราะทุกความผิดพลาดคือก้าวหนึ่งของการเก่งขึ้น 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง Verb to Be ที่แปลได้ว่า "เป็น / อยู่ / คือ" ค่ะ',
    'จำแค่ 3 คำ: am ใช้กับ I เท่านั้น, is ใช้กับ He She It, are ใช้กับ You We They',
    'อดีตกาลก็แค่เปลี่ยน am/is เป็น was และ are เป็น were เท่านั้นเอง',
    'ปฏิเสธ ให้เติม not ต่อท้าย Verb to Be เลย ไม่ต้องใช้ do/does/did ช่วย',
    'คำถาม ให้ยก Verb to Be มาไว้หน้าสุดของประโยค',
    'ระวังคำนามพิเศษ เช่น Everyone, News, Glasses ที่ใช้กฎแปลกจากปกติ',
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
<title>หนังสือเรียน: Verb to Be — ม.3</title>
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
