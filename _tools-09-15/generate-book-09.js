/*
 * "Mini textbook" generator for Chapter 09: Future Tense (will / be going to).
 * Mirrors the 03-Grammar/_tools/generate-book-0X.js pattern exactly (same
 * shared.css.js, same 20-section skeleton) so this main-course chapter reads
 * as part of the same visual series as Topics 01-08.
 *
 * Usage: node generate-book-09.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-09-future-tense.json'), 'utf8'));
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
    <div class="cover-emojis">🔮 🌅 📅 🚀 ✨</div>
    <h1 class="cover-title-en">Future Tense</h1>
    <div class="cover-title-th">Future Tense (will / be going to)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 บทที่ 9 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Chapter 09 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT IS FUTURE TENSE ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  <div class="section-banner sb-c1">
    <div><h1>📖 Future Tense คืออะไร?</h1><div class="eng">What is Future Tense?</div></div>
    <div class="chip">ส่วนที่ 2</div>
  </div>
  <p style="font-size:15px;line-height:1.7;">Future Tense ใช้พูดถึงเหตุการณ์ที่ยังไม่เกิดขึ้น แต่จะเกิดขึ้นในอนาคต ภาษาอังกฤษมีวิธีพูดถึงอนาคตหลายแบบ แต่ที่สำคัญที่สุดสำหรับ ม.3 คือ 2 รูปแบบหลัก: <b>will</b> และ <b>be going to</b> ซึ่งแปลว่า "จะ" เหมือนกัน แต่ใช้ในสถานการณ์ต่างกัน ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">ตัดสินใจทันที</div>ใช้ will<div class="ex">The phone is ringing. I will answer it.<br>(โทรศัพท์ดังอยู่ ฉันจะรับเอง)</div></div>
    <div class="meaning-box mb2"><div class="word">แผนที่วางไว้แล้ว</div>ใช้ be going to<div class="ex">I am going to visit my aunt.<br>(ฉันวางแผนจะไปเยี่ยมป้า)</div></div>
    <div class="meaning-box mb3"><div class="word">คาดเดามีหลักฐาน</div>ใช้ be going to<div class="ex">Look! It is going to rain.<br>(ดูสิ! ฝนกำลังจะตกแน่ ๆ)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่าทั้ง 3 ประโยคแปลว่า "จะ" เหมือนกัน แต่เลือกใช้ <b>will</b> หรือ <b>be going to</b> ต่างกันตามบริบท — นี่คือเหตุผลที่ต้องเข้าใจ "การใช้งาน" มากกว่าจะท่องจำแค่คำแปลเดียว</p>
  <div class="explain-block">
    <h2>🧩 ใช้เมื่อไหร่บ้าง?</h2>
    <table>
      <tr><th>การใช้</th><th>ตัวอย่าง</th><th>คำแปล</th></tr>
      <tr><td>ตัดสินใจทันทีตอนพูด</td><td>I will answer it.</td><td>ฉันจะรับเอง (ตัดสินใจตอนนี้)</td></tr>
      <tr><td>สัญญา/ข้อเสนอ</td><td>I will help you.</td><td>ฉันจะช่วยคุณ</td></tr>
      <tr><td>แผนที่วางไว้แล้ว</td><td>I am going to study medicine.</td><td>ฉันวางแผนจะเรียนแพทย์</td></tr>
      <tr><td>คาดเดามีหลักฐาน</td><td>It is going to rain.</td><td>ฝนกำลังจะตก (เห็นเมฆดำ)</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>คำแปล</th></tr>
      <tr><td>I will call you tomorrow.</td><td>ฉันจะโทรหาคุณพรุ่งนี้</td></tr>
      <tr><td>She is going to study medicine.</td><td>เธอวางแผนจะเรียนแพทย์</td></tr>
      <tr><td>Look! The bus is going to leave.</td><td>ดูสิ! รถบัสกำลังจะไปแล้ว</td></tr>
      <tr><td>We will meet again soon.</td><td>เราจะเจอกันอีกครั้งเร็ว ๆ นี้</td></tr>
      <tr><td>They are going to travel next month.</td><td>พวกเขาวางแผนจะเดินทางเดือนหน้า</td></tr>
      <tr><td>I promise I will help you.</td><td>ฉันสัญญาว่าจะช่วยคุณ</td></tr>
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
    <div class="qtext" style="font-size:17px;">will — ตัดสินใจทันที, สัญญา, คาดเดาไม่มีหลักฐาน</div>
    <p style="margin:6px 0;">ใช้ <b>will</b> เมื่อตัดสินใจทำอะไรทันทีตอนพูด, ให้สัญญา/ข้อเสนอช่วยเหลือ, หรือคาดเดาโดยไม่มีหลักฐานชัดเจน<br><b>โครงสร้าง:</b> S + will + V(base) — will ใช้ได้กับทุกประธาน ไม่เปลี่ยนรูป</p>
    <ul><li>The phone is ringing. I will answer it. (ตัดสินใจทันที)</li><li>I will help you with your homework. (สัญญา)</li><li>I think it will rain tomorrow. (คาดเดาไม่มีหลักฐาน)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">be going to — แผนที่วางไว้แล้ว, คาดเดามีหลักฐาน</div>
    <p style="margin:6px 0;">ใช้ <b>be going to</b> เมื่อมีแผนที่ตั้งใจ/วางแผนไว้ล่วงหน้าแล้ว หรือคาดเดาจากหลักฐานที่เห็นอยู่ในปัจจุบัน<br><b>โครงสร้าง:</b> S + is/am/are + going to + V(base)</p>
    <ul><li>I am going to visit my grandmother this weekend. (แผนที่วางไว้)</li><li>Look at those clouds! It is going to rain. (มีหลักฐาน)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">ปฏิเสธ — เติม not</div>
    <p style="margin:6px 0;">ปฏิเสธของ will คือเติม <b>not</b> ต่อท้าย (will not / won't) ส่วนปฏิเสธของ be going to คือเติม not หลัง is/am/are</p>
    <ul><li>I will not (won't) go home. (ปฏิเสธ will)</li><li>She is not going to study tonight. (ปฏิเสธ be going to)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">คำถาม — ยก will/is/am/are มาไว้หน้าประธาน</div>
    <p style="margin:6px 0;">คำถามของ will ให้ยก <b>Will</b> มาไว้หน้าประธาน ส่วนคำถามของ be going to ให้ยก <b>Is/Am/Are</b> มาไว้หน้าประธาน</p>
    <ul><li>Will you go home? (คำถาม will)</li><li>Is she going to study tonight? (คำถาม be going to)</li></ul>
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
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">will = ตัดสินใจไว</div><p>will มาจากใจตอนนั้นเลย — ตัดสินใจไว, สัญญาไว, เดาไว (ไม่มีหลักฐาน) จำว่า "will = ใจสั่งตอนนี้"</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">be going to = วางแผนไว้ก่อนแล้ว</div><p>going to ฟังดูเหมือน "กำลังเดินไปหา" แผนนั้น — จำว่า "going to = ไปตามแผนที่วางไว้"</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">เห็นหลักฐาน → be going to</div><p>ถ้าประโยคมีคำว่า Look!, เห็นเมฆดำ, เห็นรอยร้าว ฯลฯ (มีหลักฐานอยู่ตรงหน้า) ให้เลือก be going to ทันที</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">คาถา "WGT"</div><p><b>W</b>ill = ตัดสินใจ/สัญญา/เดาลอย ๆ, <b>G</b>oing <b>T</b>o = แผน/หลักฐาน — ท่อง "Will ใจ, Going to แผน" ซ้ำ 3 รอบก่อนสอบ!</p></div>
</div>`;
}

/* ---------- SECTION 6: PHONICS CORNER ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔊', 'มุมออกเสียง', 'Phonics Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>คำ</th><th>สัทอักษร (IPA)</th><th>เสียงอ่านแบบไทย</th><th>ตัวอย่างประโยค</th></tr>
      <tr><td><b>will</b></td><td>/wɪl/</td><td>วิล</td><td>I will call you. (ไอ วิล คอล ยู)</td></tr>
      <tr><td><b>won't</b></td><td>/woʊnt/</td><td>โวนท์</td><td>I won't forget. (ไอ โวนท์ ฟอร์เก็ท)</td></tr>
      <tr><td><b>going to</b></td><td>/ˈɡoʊɪŋ tuː/</td><td>โกอิง ทู</td><td>She is going to study. (ชี อิซ โกอิง ทู สตัดดี้)</td></tr>
      <tr><td><b>gonna</b> (พูดไม่เป็นทางการ)</td><td>/ˈɡʌnə/</td><td>กันนะ</td><td>I'm gonna go. (ไอม์ กันนะ โก)</td></tr>
      <tr><td><b>soon</b></td><td>/suːn/</td><td>ซูน</td><td>See you soon. (ซี ยู ซูน)</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียง: ในการพูดจริง เจ้าของภาษามักพูด "going to" แบบย่อเป็น "gonna" (เช่น I'm gonna call you) แต่ในการเขียนหรือข้อสอบทางการ ให้ใช้ "going to" แบบเต็มเสมอนะคะ!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['📅', 'tomorrow', 'พรุ่งนี้'], ['🗓️', 'next week', 'สัปดาห์หน้า'], ['📆', 'next month', 'เดือนหน้า'],
    ['🎊', 'next year', 'ปีหน้า'], ['⏳', 'soon', 'เร็ว ๆ นี้'], ['🔮', 'in the future', 'ในอนาคต'],
    ['🌅', 'someday', 'สักวันหนึ่ง'], ['📋', 'plan', 'แผนการ'], ['🤞', 'promise', 'สัญญา'],
    ['🔍', 'evidence', 'หลักฐาน'], ['🎯', 'decide', 'ตัดสินใจ'], ['💭', 'predict', 'คาดเดา'],
    ['🎉', 'weekend', 'สุดสัปดาห์'], ['⏰', 'schedule', 'ตารางเวลา'], ['✋', 'offer', 'ข้อเสนอ'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้เป็นคำสัญญาณเวลาและคำที่ใช้บ่อยที่สุดเวลาแต่งประโยค Future Tense — ลองสังเกตว่าคำไหนใช้ได้ทั้ง will และ be going to</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">Positive (will): Subject + will + V(base)</div>
    <div class="pex">I will call you tomorrow. <span class="th">(ฉันจะโทรหาคุณพรุ่งนี้)</span></div>
    <div class="pex">She will graduate next year. <span class="th">(เธอจะจบการศึกษาปีหน้า)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">Negative (will): Subject + will not (won't) + V(base)</div>
    <div class="pex">I will not go to the party. <span class="th">(ฉันจะไม่ไปงานปาร์ตี้)</span></div>
    <div class="pex">She won't be late. <span class="th">(เธอจะไม่มาสาย)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">Positive (be going to): Subject + is/am/are + going to + V(base)</div>
    <div class="pex">I am going to visit my aunt. <span class="th">(ฉันวางแผนจะไปเยี่ยมป้า)</span></div>
    <div class="pex">They are going to travel next month. <span class="th">(พวกเขาวางแผนจะเดินทางเดือนหน้า)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">Question: Will + S + V(base)? / Is/Am/Are + S + going to + V(base)?</div>
    <div class="pex">Will you come with me? <span class="th">(คุณจะมากับฉันไหม)</span></div>
    <div class="pex">Is he going to join us? <span class="th">(เขาจะเข้าร่วมกับเราไหม)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาในชีวิตประจำวัน', 'Daily Conversation', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🎉 บทสนทนาที่ 1: วางแผนสุดสัปดาห์ (Weekend Plans)</div>
    <div class="bubble left"><div class="speaker">Ann</div>What are you going to do this weekend?<div class="th">สุดสัปดาห์นี้เธอวางแผนจะทำอะไร</div></div>
    <div class="bubble right"><div class="speaker">Somchai</div>I'm going to visit my grandmother. I already told her.<div class="th">ผมวางแผนจะไปเยี่ยมยาย ผมบอกยายไว้แล้ว</div></div>
    <div class="bubble left"><div class="speaker">Ann</div>That's nice! I think I will just stay home and rest.<div class="th">ดีจังเลย! ฉันคิดว่าฉันคงจะอยู่บ้านพักผ่อนเฉย ๆ</div></div>
    <div class="bubble right"><div class="speaker">Somchai</div>Sounds good. I'll call you when I get back.<div class="th">ฟังดูดีนะ ผมจะโทรหาเธอตอนกลับมา</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">☁️ บทสนทนาที่ 2: ทายอากาศ (Guessing the Weather)</div>
    <div class="bubble left"><div class="speaker">Ploy</div>Look at those dark clouds! It's going to rain soon.<div class="th">ดูก้อนเมฆดำนั่นสิ! ฝนกำลังจะตกในไม่ช้า</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>You're right. I'll bring an umbrella just in case.<div class="th">เธอพูดถูก ฉันจะเอาร่มไปด้วยเผื่อไว้</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>Good idea. I think it will rain all afternoon.<div class="th">ความคิดดีนะ ฉันคิดว่าฝนจะตกทั้งบ่ายเลย</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>Then let's go home early today.<div class="th">งั้นวันนี้เรากลับบ้านแต่เนิ่น ๆ กันเถอะ</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['I will going to study.', 'ห้ามใช้ will และ going to ปนกันในประโยคเดียว', 'I am going to study. / I will study.'],
    ['She will to help you.', 'หลัง will ห้ามมี to นำหน้ากริยา', 'She will help you.'],
    ['They is going to travel.', 'ประธาน they เป็นพหูพจน์ ต้องใช้ are ไม่ใช่ is', 'They are going to travel.'],
    ['Do you will come?', 'คำถามด้วย will ห้ามใช้ do ร่วมด้วย ต้องยก Will มาไว้หน้าประธานเลย', 'Will you come?'],
    ['I am going study tonight.', 'ลืมคำว่า to หลัง going', 'I am going to study tonight.'],
    ['She wills graduate next year.', 'will ไม่ผันตามประธาน ห้ามเติม -s', 'She will graduate next year.'],
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
    'ดูว่ามีหลักฐานอยู่ตรงหน้าไหม (เมฆดำ, รอยร้าว, เห็นบางอย่างกำลังจะเกิด) — ถ้ามี ใช้ be going to',
    'ดูว่าเป็นแผนที่วางไว้ล่วงหน้าแล้วไหม (จองตั๋วแล้ว, บอกไว้แล้ว) — ถ้าใช่ ใช้ be going to',
    'ถ้าเป็นการตัดสินใจทันทีตอนพูด หรือเป็นสัญญา/ข้อเสนอ ใช้ will เสมอ',
    'ห้ามใช้ will และ going to ปนกันในประโยคเดียวกันเด็ดขาด',
    'หลัง will และหลัง going to ต้องเป็นกริยารูปเดิม (base form) เสมอ ไม่เติม -s/-ing/-ed',
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
    <div class="mindmap-center">Future Tense</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">⚡ will</span>ตัดสินใจทันที/สัญญา/เดาไม่มีหลักฐาน</div>
      <div class="mindmap-branch mb-b"><span class="bt">📋 be going to</span>แผนที่วางไว้แล้ว/เดามีหลักฐาน</div>
      <div class="mindmap-branch mb-c"><span class="bt">🚫 ปฏิเสธ</span>will not (won't) / is-am-are + not + going to</div>
      <div class="mindmap-branch mb-d"><span class="bt">❓ คำถาม</span>Will + S...? / Is-Am-Are + S + going to...?</div>
      <div class="mindmap-branch mb-e"><span class="bt">🔤 คำสัญญาณ</span>tomorrow, next week/month/year, soon</div>
      <div class="mindmap-branch mb-f"><span class="bt">⚠️ ข้อควรระวัง</span>ห้ามใช้ will + going to ปนกัน</div>
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
    <div class="cheat-box"><h4>ตาราง Future Tense</h4>
      <table><tr><th>รูปแบบ</th><th>โครงสร้าง</th></tr>
      <tr><td>will</td><td>S + will + V(base)</td></tr>
      <tr><td>be going to</td><td>S + is/am/are + going to + V(base)</td></tr>
      <tr><td>ปฏิเสธ will</td><td>S + will not (won't) + V</td></tr>
      <tr><td>ปฏิเสธ going to</td><td>S + is/am/are + not + going to + V</td></tr></table></div>
    <div class="cheat-box"><h4>ใช้เมื่อไหร่</h4>
      <ul><li>will: ตัดสินใจทันที, สัญญา, เดาไม่มีหลักฐาน</li><li>going to: แผนที่วางไว้แล้ว, เดามีหลักฐาน</li></ul></div>
    <div class="cheat-box"><h4>คำสัญญาณ</h4>
      <ul><li>tomorrow, next week/month/year</li><li>soon, in the future, someday</li></ul></div>
    <div class="cheat-box"><h4>เทคนิคจำเร็ว</h4>
      <ul><li>เห็นหลักฐาน → going to</li><li>ตัดสินใจตอนนี้ → will</li><li>ห้ามผสม will + going to</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกฎในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากสถานการณ์ที่นักเรียนคุ้นเคย (แผนวันหยุด, ทายอากาศ) ก่อนเข้ากฎไวยากรณ์</li>
    <li>เน้นย้ำว่า will และ be going to แปลว่า "จะ" เหมือนกัน แต่เลือกใช้ตาม "หลักฐาน" กับ "แผนที่วางไว้"</li>
    <li>ให้นักเรียนฝึกแยกประเภทประโยคก่อนตอบ: มีหลักฐานไหม? มีแผนไหม? หรือแค่ตัดสินใจตอนนี้?</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Fortune Teller Game</b> — ให้นักเรียนทายอนาคตของเพื่อนด้วย "I think you will..." แล้วเทียบกับความจริง</li>
    <li><b>Weekend Plan Interview</b> — สัมภาษณ์เพื่อน "What are you going to do this weekend?"</li>
    <li><b>Promise Circle</b> — นักเรียนแต่ละคนพูดสัญญา 1 ข้อด้วย "I will..." แล้วส่งต่อรอบวง</li>
    <li><b>Weather Detective</b> — ดูภาพท้องฟ้าต่าง ๆ แล้วแต่งประโยคคาดเดาด้วย "It is going to..."</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 โดยเฉพาะการผสม will กับ going to เพื่อวางแผนการสอนซ่อมเสริม</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'เขียนประโยค 5 ประโยคเกี่ยวกับแผนสุดสัปดาห์ของตัวเอง โดยใช้ be going to',
    'เขียนสัญญา 3 ข้อที่อยากทำให้คนในครอบครัว โดยใช้ "I will..."',
    'สังเกตท้องฟ้าวันนี้แล้วเขียนคาดเดาสภาพอากาศ 2 ประโยคด้วย "It is going to..."',
    'สัมภาษณ์เพื่อน 1 คน ด้วยคำถาม "What are you going to do next year?" แล้วจดคำตอบมาเล่าในห้องเรียน'
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
    <div class="quote">"อนาคตที่ดีเริ่มจากการวางแผนตั้งแต่วันนี้" 🌟</div>
    <div class="sub">Future Tense สอนให้เราพูดถึงความฝันและแผนการของตัวเองเป็นภาษาอังกฤษได้ ถ้าวันนี้เข้าใจ will กับ be going to แน่นแล้ว การพูดถึงอนาคตจะง่ายขึ้นมาก ลองฝึกพูดถึงแผนของตัวเองทุกวันนะ 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง Future Tense ที่แปลว่า "จะ" ค่ะ มี 2 รูปแบบหลัก: will และ be going to',
    'will ใช้เมื่อ: ตัดสินใจทันทีตอนพูด, ให้สัญญา/ข้อเสนอ, หรือคาดเดาแบบไม่มีหลักฐาน',
    'be going to ใช้เมื่อ: มีแผนที่วางไว้ล่วงหน้าแล้ว หรือคาดเดาจากหลักฐานที่เห็นอยู่ตรงหน้า',
    'ปฏิเสธ: will not (won\'t) / is-am-are + not + going to',
    'คำถาม: ยก Will หรือ Is/Am/Are มาไว้หน้าสุดของประโยค',
    'ห้ามใช้ will และ going to ปนกันในประโยคเดียวเด็ดขาด นี่คือข้อผิดพลาดที่พบบ่อยที่สุด',
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
<title>หนังสือเรียน: Future Tense — ม.3</title>
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
