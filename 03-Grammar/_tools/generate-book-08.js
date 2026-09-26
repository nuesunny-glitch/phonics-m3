/*
 * One-off "mini textbook" generator for Lesson 08: Adding ING.
 * Reuses data-08-adding-ing.json (already verified: grammar tables, tips,
 * worksheet, 50-question quiz, answer key) so this book's practice content
 * stays byte-consistent with the standalone quiz-pack files, and hand-authors
 * the extra storybook sections (cover, phonics, vocabulary, dialogues, mind
 * map, cheat sheet, teacher notes, homework, motivation, summary).
 *
 * Structure and CSS are copied 1:1 from generate-book-01.js (Verb to Be) so
 * every topic in this series renders with an identical visual system.
 *
 * Usage: node generate-book-08.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-08-adding-ing.json'), 'utf8'));
const outDir = path.join(__dirname, '..', '08-Adding ING');
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
    <div class="cover-emojis">🏃 ✍️ 🎬 📚 ✏️</div>
    <h1 class="cover-title-en">Adding ING</h1>
    <div class="cover-title-th">การเติม -ing (Present Continuous: am/is/are + Ving)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 เล่มที่ 8 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Lesson 08 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT IS ADDING ING ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  ${banner('sb-c1', '📖', 'การเติม -ing คืออะไร?', 'What is Adding ING?', 'ส่วนที่ 2')}
  <p style="font-size:15px;line-height:1.7;">จำบทที่ 1 ได้ไหมคะ ที่เราเรียนเรื่อง <b>Verb to Be</b> (am / is / are) กันไปแล้ว? บทนี้เราจะนำ am/is/are มาใช้ต่อยอดกับกริยาที่เติม <b>-ing</b> เพื่อสร้างโครงสร้างที่เรียกว่า <b>Present Continuous</b> ซึ่งใช้บอกว่า "กำลังทำอะไรอยู่" นั่นเองค่ะ</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">กำลังทำอยู่ตอนนี้</div>เหตุการณ์ที่เกิดขึ้นขณะพูด<div class="ex">I am reading now.<br>(ฉันกำลังอ่านหนังสืออยู่)</div></div>
    <div class="meaning-box mb2"><div class="word">สถานการณ์ชั่วคราว</div>ไม่ใช่สิ่งที่ทำเป็นประจำ<div class="ex">She is staying with her aunt.<br>(เธอกำลังพักอยู่กับป้าชั่วคราว)</div></div>
    <div class="meaning-box mb3"><div class="word">Be + Ving</div>โครงสร้างหลักที่ต้องจำ<div class="ex">They are playing.<br>(พวกเขากำลังเล่นอยู่)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตว่าทุกประโยคต้องมี <b>am/is/are</b> (จากบทที่ 1) ควบคู่กับกริยาเติม <b>-ing</b> เสมอ ขาดตัวใดตัวหนึ่งไปไม่ได้ — นี่คือกฎเหล็กของ Present Continuous</p>
  <div class="explain-block">
    <h2>🧩 ใช้เมื่อไหร่บ้าง?</h2>
    <table>
      <tr><th>การใช้</th><th>ตัวอย่าง</th><th>คำแปล</th></tr>
      <tr><td>กำลังทำอยู่ ณ ขณะพูด</td><td>I am doing my homework.</td><td>ฉันกำลังทำการบ้านอยู่</td></tr>
      <tr><td>เห็นเหตุการณ์ต่อหน้า (Look! Listen!)</td><td>Look! He is running.</td><td>ดูสิ! เขากำลังวิ่งอยู่</td></tr>
      <tr><td>สถานการณ์ชั่วคราว ไม่ถาวร</td><td>We are living in Bangkok this year.</td><td>ปีนี้พวกเรากำลังอาศัยอยู่ที่กรุงเทพฯ (ชั่วคราว)</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>คำแปล</th></tr>
      <tr><td>I am eating lunch now.</td><td>ฉันกำลังกินข้าวเที่ยงอยู่</td></tr>
      <tr><td>My brother is playing football.</td><td>พี่ชายของฉันกำลังเล่นฟุตบอลอยู่</td></tr>
      <tr><td>They are studying at the library.</td><td>พวกเขากำลังอ่านหนังสือที่ห้องสมุด</td></tr>
      <tr><td>It is raining outside.</td><td>ข้างนอกฝนกำลังตก</td></tr>
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
    <div class="qtext" style="font-size:17px;">ปกติ (Regular) — เติม -ing ต่อท้ายได้เลย</div>
    <p style="margin:6px 0;">คำกริยาส่วนใหญ่ในภาษาอังกฤษใช้กฎนี้ ไม่ต้องเปลี่ยนตัวสะกดใด ๆ ทั้งสิ้น</p>
    <ul><li>play &rarr; playing (เล่น)</li><li>read &rarr; reading (อ่าน)</li><li>watch &rarr; watching (ดู)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">ลงท้ายด้วย e ที่ไม่ออกเสียง (Silent E) — ตัด e ทิ้งก่อนเติม -ing</div>
    <p style="margin:6px 0;">ถ้าคำกริยาลงท้ายด้วย e เงียบ ๆ (ไม่ออกเสียง) ให้ตัด e ตัวสุดท้ายทิ้งก่อน แล้วค่อยเติม -ing</p>
    <ul><li>make &rarr; making (ทำ) — ไม่ใช่ makeing</li><li>write &rarr; writing (เขียน) — ไม่ใช่ writeing</li><li>dance &rarr; dancing (เต้น)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">พยางค์เดียว แบบ CVC — เบิ้ลพยัญชนะตัวท้ายก่อนเติม -ing</div>
    <p style="margin:6px 0;">ถ้าคำกริยา<b>พยางค์เดียว</b> สะกดแบบ <b>C-V-C</b> (พยัญชนะ-สระเดี่ยวเสียงสั้น-พยัญชนะ) ต้อง<b>เบิ้ล</b>พยัญชนะตัวสุดท้ายก่อนเติม -ing <br><b>ยกเว้น</b> ถ้าลงท้ายด้วย <b>w, x, y</b> ห้ามเบิ้ลเด็ดขาด เติม -ing ตามปกติ</p>
    <ul><li>run &rarr; running (วิ่ง)</li><li>sit &rarr; sitting (นั่ง)</li><li>fix &rarr; fixing (ซ่อม) — ลงท้าย x ห้ามเบิ้ล</li><li>snow &rarr; snowing (หิมะตก) — ลงท้าย w ห้ามเบิ้ล</li></ul>
  </div>
  <div class="step-card sc1">
    <span class="step-label">STEP 4</span>
    <div class="qtext" style="font-size:17px;">คำ 2 พยางค์ เน้นเสียงพยางค์ท้าย — ใช้กฎเบิ้ลเหมือน CVC</div>
    <p style="margin:6px 0;">ถ้าคำกริยามี <b>2 พยางค์</b> และ<b>เน้นเสียงหนักที่พยางค์ท้าย</b> ให้ใช้กฎเดียวกับ CVC คือ<b>เบิ้ล</b>พยัญชนะตัวสุดท้ายก่อนเติม -ing <br><b>แต่ถ้า</b>เน้นเสียงพยางค์แรก (ไม่ใช่ท้ายคำ) จะ<b>ไม่ต้องเบิ้ล</b></p>
    <ul><li>be<b>GIN</b> &rarr; beginning (เริ่ม) — เน้นเสียงท้าย ต้องเบิ้ล</li><li>for<b>GET</b> &rarr; forgetting (ลืม) — เน้นเสียงท้าย ต้องเบิ้ล</li><li><b>O</b>pen &rarr; opening (เปิด) — เน้นเสียงแรก ไม่ต้องเบิ้ล</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">ลงท้ายด้วย -ie — เปลี่ยนเป็น y ก่อนเติม -ing</div>
    <p style="margin:6px 0;">มีคำพิเศษ 3 คำที่ต้องเปลี่ยน <b>ie เป็น y</b> ก่อนเติม -ing เพราะภาษาอังกฤษไม่มีการสะกด "iing"</p>
    <ul><li>die &rarr; dying (ตาย)</li><li>lie &rarr; lying (นอน/โกหก)</li><li>tie &rarr; tying (ผูก)</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE ---------- */
function s4() {
  const headers = data.summaryTable.headers;
  const rowsHtml = data.summaryTable.rows.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${r[2]}</td></tr>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'ตารางสรุป', 'Summary Table', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr><th>${esc(headers[0])}</th><th>${esc(headers[1])}</th><th>${esc(headers[2])}</th></tr>
      ${rowsHtml}
    </table>
  </div>
  <div class="tip-card">💡 เคล็ดลับ: ท่องตารางนี้ให้ขึ้นใจ เพราะทุกกฎการสะกด -ing ในบทนี้อ้างอิงจากตารางเดียวนี้ทั้งหมด! และอย่าลืมว่าทุกครั้งที่ใช้ Ving ต้องมี am/is/are นำหน้าเสมอ</div>
</div>`;
}

/* ---------- SECTION 5: MEMORY TRICKS ---------- */
function s5() {
  return `<div class="sheet" id="s5">
  ${banner('sb-c4', '🧠', 'เทคนิคการจำ', 'Memory Tricks', 'ส่วนที่ 5')}
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">"e หายไป เมื่อมี ing มา"</div><p>เห็น e เงียบ ๆ ท้ายคำ อย่ามัวรอช้า ต้องตัดทิ้งก่อนเสมอแล้วค่อยเติม ing เช่น make &rarr; making, hope &rarr; hoping</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">"พยางค์เดียวสั้น ๆ ต้อง double ตัวท้าย"</div><p>คำสั้นพยางค์เดียว สระเดียวเสียงสั้น พยัญชนะปิดท้าย (CVC) ให้เบิ้ลตัวท้ายก่อนเติม ing เหมือนเสียงกระแทกซ้ำ run-n-ing, sit-t-ing</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">คล้องจอง CVC: "สั้น-ตัน-ซ้ำ"</div><p>ท่องจังหวะ "สระสั้น พยัญชนะตัน ต้องเบิ้ลซ้ำ แล้วค่อยเติม ing" — run running, sit sitting, swim swimming, stop stopping</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">"w x y ไม่ต้อง double"</div><p>ถ้าคำลงท้ายด้วย <b>w, x, y</b> ห้ามเบิ้ลตัวท้ายเด็ดขาด! เติม -ing ตรง ๆ เลย: snow &rarr; snowing, fix &rarr; fixing, play &rarr; playing และจำ 3 คำพิเศษ "ตาย นอน ผูก ต้องใช้ y": die &rarr; dying, lie &rarr; lying, tie &rarr; tying</p></div>
</div>`;
}

/* ---------- SECTION 6: PHONICS CORNER ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔊', 'มุมออกเสียง', 'Phonics Corner', 'ส่วนที่ 6')}
  <p style="font-size:14.5px;color:#55607a;">ตัวลงท้าย <b>-ing</b> ออกเสียงว่า <b>/ɪŋ/</b> (อิง) เสมอ ไม่ว่าคำนั้นจะสะกดยังไงมาก่อนหน้า ลองฟังและออกเสียงตามตัวอย่างด้านล่างนี้</p>
  <div class="explain-block">
    <table>
      <tr><th>คำ</th><th>สัทอักษร (IPA)</th><th>เสียงอ่านแบบไทย</th><th>ตัวอย่างประโยค</th></tr>
      <tr><td><b>playing</b></td><td>/ˈpleɪɪŋ/</td><td>เพลอิง</td><td>They are playing. (พวกเขากำลังเล่นอยู่)</td></tr>
      <tr><td><b>running</b></td><td>/ˈrʌnɪŋ/</td><td>รันนิง</td><td>She is running. (เธอกำลังวิ่งอยู่)</td></tr>
      <tr><td><b>making</b></td><td>/ˈmeɪkɪŋ/</td><td>เมกิง</td><td>I am making a cake. (ฉันกำลังทำเค้ก)</td></tr>
      <tr><td><b>writing</b></td><td>/ˈraɪtɪŋ/</td><td>ไรทิง</td><td>He is writing. (เขากำลังเขียนอยู่)</td></tr>
      <tr><td><b>sitting</b></td><td>/ˈsɪtɪŋ/</td><td>ซิททิง</td><td>We are sitting. (พวกเรากำลังนั่งอยู่)</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียง: เสียง /ŋ/ ท้าย -ing เป็นเสียงขึ้นจมูก (เหมือนเสียง "ง" ในภาษาไทย) ให้ปิดปากแล้วปล่อยลมออกทางจมูกเบา ๆ ไม่ใช่ออกเสียง "อิน-กึ" แบบแยกพยางค์นะคะ!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['🏃', 'run', 'วิ่ง'], ['🏊', 'swim', 'ว่ายน้ำ'], ['✍️', 'write', 'เขียน'],
    ['💃', 'dance', 'เต้น'], ['⚽', 'play', 'เล่น'], ['🍰', 'make', 'ทำ'],
    ['📖', 'read', 'อ่าน'], ['😴', 'sleep', 'นอนหลับ'], ['🍽️', 'eat', 'กิน'],
    ['🚴', 'ride', 'ขี่'], ['🛑', 'stop', 'หยุด'], ['🎨', 'draw', 'วาดรูป'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำกริยาแสดงการกระทำ (action verbs) กลุ่มนี้ใช้บ่อยที่สุดเวลาแต่งประโยค Present Continuous — ลองฝึกเปลี่ยนแต่ละคำให้เป็นรูป -ing ดูนะคะ</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">Positive: Subject + am/is/are + Ving + ...</div>
    <div class="pex">I am reading a book. <span class="th">(ฉันกำลังอ่านหนังสืออยู่)</span></div>
    <div class="pex">They are playing football. <span class="th">(พวกเขากำลังเล่นฟุตบอลอยู่)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">Negative: Subject + am/is/are + not + Ving + ...</div>
    <div class="pex">I am not sleeping. <span class="th">(ฉันไม่ได้กำลังนอนหลับ)</span></div>
    <div class="pex">She is not studying now. (She isn't studying.) <span class="th">(เธอไม่ได้กำลังเรียนอยู่ตอนนี้)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">Question: Am/Is/Are + Subject + Ving + ...?</div>
    <div class="pex">Are you doing your homework? <span class="th">(เธอกำลังทำการบ้านอยู่หรือเปล่า)</span></div>
    <div class="pex">Is he sleeping? <span class="th">(เขากำลังนอนหลับอยู่หรือเปล่า)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">Short Answer: Yes, S + am/is/are. / No, S + am/is/are + not.</div>
    <div class="pex">Yes, I am. / No, I'm not. <span class="th">(ใช่ ฉันกำลังทำอยู่ / ไม่ ฉันไม่ได้ทำ)</span></div>
    <div class="pex">Yes, she is. / No, she isn't. <span class="th">(ใช่ เธอกำลังทำอยู่ / ไม่ เธอไม่ได้ทำ)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาในชีวิตประจำวัน', 'Daily Conversation', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">📱 บทสนทนาที่ 1: ตอนนี้ทำอะไรอยู่ (What Are You Doing Now?)</div>
    <div class="bubble left"><div class="speaker">Nid (โทรศัพท์)</div>Hi! What are you doing now?<div class="th">สวัสดี ตอนนี้เธอกำลังทำอะไรอยู่</div></div>
    <div class="bubble right"><div class="speaker">Tam</div>I'm doing my homework. I am writing an English essay.<div class="th">ฉันกำลังทำการบ้านอยู่ ฉันกำลังเขียนเรียงความภาษาอังกฤษ</div></div>
    <div class="bubble left"><div class="speaker">Nid</div>Wow! Is it difficult?<div class="th">โห ยากไหม</div></div>
    <div class="bubble right"><div class="speaker">Tam</div>A little. My sister is helping me right now.<div class="th">นิดหน่อย ตอนนี้น้องสาวของฉันกำลังช่วยฉันอยู่</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🌳 บทสนทนาที่ 2: ที่สวนสาธารณะ (At the Park)</div>
    <div class="bubble left"><div class="speaker">Ploy</div>Look! That boy is running so fast.<div class="th">ดูสิ! เด็กผู้ชายคนนั้นกำลังวิ่งเร็วมากเลย</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>Yes, and his friends are swimming in the lake.<div class="th">ใช่ แล้วเพื่อนของเขาก็กำลังว่ายน้ำอยู่ในทะเลสาบ</div></div>
    <div class="bubble left"><div class="speaker">Ploy</div>What is that girl doing over there?<div class="th">เด็กผู้หญิงคนนั้นกำลังทำอะไรอยู่ตรงนั้น</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>She is dancing, and her dog is sitting next to her.<div class="th">เธอกำลังเต้นอยู่ แล้วสุนัขของเธอก็กำลังนั่งอยู่ข้าง ๆ</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['She is runing.', 'run เป็นคำ CVC ต้องเบิ้ลตัวท้าย n สองตัว ไม่ใช่ตัวเดียว', 'She is running.'],
    ['He is writeing a letter.', 'write ลงท้ายด้วย silent e ต้องตัด e ทิ้งก่อนเติม -ing', 'He is writing a letter.'],
    ['I am play football.', 'ลืมเติม -ing หลังกริยา เมื่อใช้ am/is/are ต้องมี Ving เสมอ', 'I am playing football.'],
    ['She is siting.', 'sit เป็นคำ CVC ต้องเบิ้ล t สองตัว ไม่ใช่ตัวเดียว', 'She is sitting.'],
    ['They are stayying at a hotel.', 'stay ลงท้ายด้วย y ซึ่งเป็นข้อยกเว้น ห้ามเบิ้ลตัวท้าย', 'They are staying at a hotel.'],
    ['The plant is dieing.', 'die ต้องเปลี่ยน ie เป็น y ก่อนเติม -ing ไม่ใช่เติม -ing ต่อจาก ie ตรง ๆ', 'The plant is dying.'],
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
    'มองตัวสะกด 3 ตัวสุดท้ายของกริยาก่อนเสมอ แล้วถามตัวเอง "ลงท้ายด้วย e เงียบ ๆ ไหม? เป็นคำ CVC ไหม? ลงท้ายด้วย w/x/y ไหม?"',
    'ถ้าลงท้ายด้วย e ที่ไม่ออกเสียง ให้ตัด e ทิ้งก่อนเสมอ (make → making) แต่ถ้าไม่แน่ใจว่า e ออกเสียงหรือไม่ ลองอ่านออกเสียงคำนั้นดู',
    'ถ้าเป็นคำพยางค์เดียวแบบ CVC (สระสั้น พยัญชนะปิดท้าย) ต้องเบิ้ลตัวท้ายก่อนเติม -ing เสมอ (run → running) ยกเว้นลงท้ายด้วย w, x, y',
    'อย่าลืมว่า Ving ต้องมี am/is/are นำหน้าเสมอ ห้ามใช้ Ving ลอย ๆ โดยไม่มี Verb to Be ช่วย',
    'ระวังคำพิเศษ 3 คำ die/lie/tie ที่ต้องเปลี่ยน ie เป็น y ก่อนเติม -ing และอย่าสับสนกับ dyeing/laying ที่หน้าตาคล้ายกัน',
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
    <div class="mindmap-center">Adding ING</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">🌱 ปกติ (Regular)</span>เติม -ing ต่อท้ายได้เลย เช่น play &rarr; playing</div>
      <div class="mindmap-branch mb-b"><span class="bt">✂️ ตัด e ทิ้ง (Silent-e)</span>ตัด e ทิ้งก่อนเติม -ing เช่น make &rarr; making</div>
      <div class="mindmap-branch mb-c"><span class="bt">👯 เบิ้ลตัวท้าย (CVC)</span>เบิ้ลพยัญชนะตัวท้ายก่อนเติม -ing เช่น run &rarr; running</div>
      <div class="mindmap-branch mb-d"><span class="bt">⚠️ ข้อยกเว้น w/x/y</span>ห้ามเบิ้ล เติม -ing ตามปกติ เช่น snow &rarr; snowing</div>
      <div class="mindmap-branch mb-e"><span class="bt">🎭 -ie &rarr; y</span>เปลี่ยน ie เป็น y ก่อนเติม -ing เช่น die &rarr; dying</div>
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
    <div class="cheat-box"><h4>กฎการเติม -ing</h4>
      <table><tr><th>กรณี</th><th>ตัวอย่าง</th></tr>
      <tr><td>ปกติ</td><td>play &rarr; playing</td></tr>
      <tr><td>ตัด e ทิ้ง</td><td>make &rarr; making</td></tr>
      <tr><td>เบิ้ลตัวท้าย (CVC)</td><td>run &rarr; running</td></tr>
      <tr><td>-ie &rarr; y</td><td>die &rarr; dying</td></tr>
      <tr><td>เน้นเสียงท้าย (2 พยางค์)</td><td>begin &rarr; beginning</td></tr></table></div>
    <div class="cheat-box"><h4>โครงสร้าง Present Continuous</h4>
      <ul><li>Positive: S + am/is/are + Ving</li><li>Negative: S + am/is/are + not + Ving</li><li>Question: Am/Is/Are + S + Ving?</li><li>ต้องมี am/is/are คู่กับ Ving เสมอ</li></ul></div>
    <div class="cheat-box"><h4>⚠️ ข้อยกเว้น w/x/y</h4>
      <ul><li>ลงท้าย w, x, y &rarr; ห้ามเบิ้ลตัวท้าย</li><li>snow &rarr; snowing</li><li>fix &rarr; fixing</li><li>play &rarr; playing</li></ul></div>
    <div class="cheat-box"><h4>เทคนิคจำเร็ว</h4>
      <ul><li>e หายไปเมื่อมี ing มา</li><li>พยางค์เดียวสั้น ๆ ต้อง double ตัวท้าย</li><li>w x y ไม่ต้อง double</li><li>ตาย นอน ผูก ต้องใช้ y</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกฎในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>ทบทวน Verb to Be (บทที่ 1) ก่อนเข้าเนื้อหา เพราะ Present Continuous ต้องใช้ am/is/are ควบคู่กับ Ving เสมอ</li>
    <li>สอนกฎการสะกดทีละขั้นตามลำดับความยาก: ปกติ &rarr; silent-e &rarr; CVC double &rarr; ข้อยกเว้น w/x/y &rarr; ie&rarr;y</li>
    <li>ให้นักเรียนฝึกแยกประเภทคำกริยาก่อนเติม -ing ทุกครั้ง แทนที่จะท่องจำรูปสำเร็จ เพื่อให้นำไปใช้กับคำใหม่ ๆ ได้เอง</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Charades -ing</b> — นักเรียนคนหนึ่งแสดงท่าทางกริยา (วิ่ง เต้น ว่ายน้ำ) เพื่อนทายและพูดประโยคเต็ม "He/She is ___ing."</li>
    <li><b>Freeze Dance</b> — เปิดเพลงให้นักเรียนเต้น พอหยุดเพลงให้ครูชี้ถามว่า "What are you doing?" นักเรียนต้องตอบด้วยท่าที่ค้างอยู่ เช่น "I am jumping."</li>
    <li><b>Spelling Relay</b> — แบ่งทีม ให้ตัวแทนแต่ละทีมวิ่งมาสะกดรูป -ing ของคำที่ครูให้บนกระดานให้ถูกต้องเร็วที่สุด (เน้นคำที่มีกฎพิเศษ เช่น run, write, stay)</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 (โดยเฉพาะการลืมเบิ้ลตัวสะกดและลืมตัด silent e) เพื่อวางแผนการสอนซ่อมเสริมรายบุคคล</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'เขียนประโยค 5 ประโยค บรรยายว่าคนในครอบครัวของตัวเองกำลังทำอะไรอยู่ตอนนี้ โดยใช้ am/is/are + Ving (เช่น My mom is cooking dinner now.)',
    'ฝึกสะกดคำกริยาเติม -ing ที่มักสะกดผิด 10 คำต่อไปนี้ให้ถูกต้อง: run, sit, make, write, stop, swim, play, stay, die, dance',
    'วาดภาพเหตุการณ์ที่กำลังเกิดขึ้นในสวนสาธารณะ แล้วเขียนบรรยาย 3 ประโยคโดยใช้ Present Continuous',
    'ดูรูปเพื่อนในห้องแล้วเขียนคำถาม "What is he/she doing?" พร้อมคำตอบ 3 คู่',
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
    <div class="quote">"แค่จำกฎ 4 ข้อให้แม่น การสะกด -ing ก็ไม่ใช่เรื่องยากอีกต่อไป" 🌟</div>
    <div class="sub">การเติม -ing อาจดูมีกฎเยอะในตอนแรก แต่ถ้าฝึกสังเกตตัวสะกดท้ายคำบ่อย ๆ นักเรียนจะสะกดถูกได้เองโดยอัตโนมัติ อย่ากลัวที่จะเขียนผิดในตอนฝึกซ้อม เพราะทุกครั้งที่แก้ไขคือก้าวหนึ่งของความเก่งขึ้น 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่องการเติม -ing เพื่อสร้างรูป Present Continuous (กำลังทำอยู่) ค่ะ',
    'กฎที่ 1 ปกติ เติม -ing ต่อท้ายได้เลย เช่น play &rarr; playing',
    'กฎที่ 2 ลงท้ายด้วย silent e ให้ตัด e ทิ้งก่อนเติม -ing เช่น make &rarr; making',
    'กฎที่ 3 คำพยางค์เดียวแบบ CVC ต้องเบิ้ลตัวท้ายก่อนเติม -ing เช่น run &rarr; running แต่ถ้าลงท้าย w, x, y ห้ามเบิ้ลเด็ดขาด',
    'กฎที่ 4 คำพิเศษ die, lie, tie ต้องเปลี่ยน ie เป็น y ก่อนเติม -ing',
    'อย่าลืม! ทุกครั้งที่ใช้ Ving ต้องมี am/is/are (จากบทที่ 1) นำหน้าเสมอ ขาดไม่ได้เด็ดขาด',
    'สุดท้าย ฝึกทำแบบฝึกหัดและแบบทดสอบให้ครบ แล้วนักเรียนจะสะกดคำ -ing ได้แม่นยำแน่นอนค่ะ',
  ];
  const linesHtml = lines.map((l) => `<div class="line">✅ ${esc(l).replace(/&amp;rarr;/g, '&rarr;')}</div>`).join('');
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
<title>หนังสือเรียน: Adding ING — ม.3</title>
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
