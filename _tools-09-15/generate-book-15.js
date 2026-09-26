/*
 * "Mini textbook" generator for Chapter 15: Entrance Exam.
 * Mirrors the 03-Grammar/_tools/generate-book-0X.js pattern exactly (same
 * shared.css.js, same 20-section skeleton) so this main-course chapter reads
 * as part of the same visual series as Topics 01-08. This chapter's content
 * IS a mock exam, already verified 100% correct in this session's review, so
 * it is reformatted rather than replaced: the worksheet section (s13) holds
 * the full 35-question mock exam (Parts A-F), and the quiz section (s14)
 * holds the 15-question Speed Round — intentionally NOT forced to the usual
 * 24/50 split, since inventing filler content on top of an already-
 * comprehensive verified mock exam would be redundant. The "Grammar Rules"
 * section becomes the 5 test-taking-strategy cards from the source material.
 *
 * Usage: node generate-book-15.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-15-entrance-exam.json'), 'utf8'));
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
    <div class="cover-emojis">🏆 📝 🎯 🚀 ✨</div>
    <h1 class="cover-title-en">Entrance Exam</h1>
    <div class="cover-title-th">ข้อสอบจำลองรวมทุกทักษะ (Mock Entrance Exam)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 บทที่ 15 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Chapter 15 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT IS THIS MOCK EXAM ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  <div class="section-banner sb-c1">
    <div><h1>📖 บทสุดท้ายนี้คืออะไร?</h1><div class="eng">What is this Final Chapter?</div></div>
    <div class="chip">ส่วนที่ 2</div>
  </div>
  <p style="font-size:15px;line-height:1.7;">บทสุดท้ายนี้คือ <b>ข้อสอบจำลอง (Mock Exam)</b> ที่รวมทุกทักษะที่เรียนมาตลอด 14 บทเข้าไว้ด้วยกัน เพื่อจำลองสถานการณ์สอบเข้า ม.4 จริง ก่อนลงมือทำควรอ่านกลยุทธ์การทำข้อสอบในส่วนถัดไปก่อน ลองดูภาพรวมโครงสร้างข้อสอบด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">35 ข้อ</div>ข้อสอบเต็มรูปแบบ<div class="ex">Part A-F<br>(Vocabulary ถึง Reading)</div></div>
    <div class="meaning-box mb2"><div class="word">15 ข้อ</div>Speed Round<div class="ex">ทบทวนรอบสุดท้าย<br>ก่อนเข้าห้องสอบ</div></div>
    <div class="meaning-box mb3"><div class="word">6 ทักษะ</div>รวมทุกบท<div class="ex">Vocab, Grammar, WH,<br>Conversation, Error, Reading</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่าข้อสอบนี้ไม่มีเนื้อหาใหม่เลย — ทุกข้อดึงมาจากสิ่งที่เรียนมาแล้วทั้งหมด นี่คือโอกาสสุดท้ายในการฝึกนำความรู้ทั้งหมดมาใช้จริงก่อนสอบจริง</p>
  <div class="explain-block">
    <h2>🧩 โครงสร้างข้อสอบเข้า ม.4 (ภาพรวมทั่วไป)</h2>
    <table>
      <tr><th>ส่วน</th><th>ทักษะที่ทดสอบ</th><th>บทที่เกี่ยวข้อง</th></tr>
      <tr><td>Vocabulary</td><td>คำศัพท์หมวดต่าง ๆ</td><td>บทที่ 3-4</td></tr>
      <tr><td>Grammar</td><td>Tense, Parts of Speech</td><td>บทที่ 5-9, 14</td></tr>
      <tr><td>Reading</td><td>อ่านจับใจความ</td><td>บทที่ 12</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ วิธีวิเคราะห์โจทย์แต่ละแบบ</h2>
    <table>
      <tr><th>ประเภทโจทย์</th><th>วิธีคิด</th></tr>
      <tr><td>Grammar (Tense)</td><td>หาคำสัญญาณ "every day" → Present Simple</td></tr>
      <tr><td>WH-Question</td><td>___ is your birthday? → ถามเวลา → When</td></tr>
      <tr><td>Conversation</td><td>A: Thank you. B: ___ → You're welcome</td></tr>
    </table>
  </div>
</div>`;
}

/* ---------- SECTION 3: TEST-TAKING STRATEGIES STEP BY STEP (adapted from Grammar Rules) ---------- */
function s3() {
  return `<div class="sheet" id="s3">
  ${banner('sb-c2', '🧩', 'กลยุทธ์การทำข้อสอบ ทีละขั้น', 'Test-Taking Strategies Step by Step', 'ส่วนที่ 3')}
  <div class="step-card sc1">
    <span class="step-label">STEP 1</span>
    <div class="qtext" style="font-size:17px;">อ่านคำสั่งให้ครบก่อนทำ</div>
    <p style="margin:6px 0;">อย่ารีบตอบจนไม่รู้ว่าโจทย์ถามอะไร — คำสั่งบางข้ออาจมีเงื่อนไขพิเศษที่ต้องสังเกต</p>
    <ul><li>อ่านคำสั่งทั้งหมดก่อนเริ่มตอบทุกครั้ง</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">จัดการเวลา</div>
    <p style="margin:6px 0;">แบ่งเวลาต่อข้อคร่าว ๆ ก่อนเริ่ม อย่าใช้เวลากับข้อยากข้อเดียวนานเกินไป</p>
    <ul><li>ประเมินเวลาที่มีหารด้วยจำนวนข้อก่อนเริ่มทำ</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">ทำข้อที่มั่นใจก่อน และใช้เทคนิคตัดตัวเลือก</div>
    <p style="margin:6px 0;">ข้ามข้อยากไปก่อน แล้วค่อยกลับมาทำทีหลัง — แม้ไม่มั่นใจ 100% ให้ตัดตัวเลือกที่ผิดชัดเจนออกก่อน จะเพิ่มโอกาสเดาถูกมากขึ้น</p>
    <ul><li>ทำข้อง่ายให้เสร็จก่อน แล้วค่อยกลับมาทำข้อยาก</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">ตรวจคำตอบรอบสุดท้าย</div>
    <p style="margin:6px 0;">ถ้ามีเวลาเหลือ ให้กลับมาตรวจข้อที่ไม่มั่นใจอีกครั้งก่อนส่งข้อสอบ</p>
    <ul><li>เก็บเวลาไว้ 5-10 นาทีสุดท้ายสำหรับตรวจทาน</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE (data-driven, generalized to N columns) ---------- */
function s4() {
  const headers = data.summaryTable.headers;
  const headerHtml = headers.map((h) => `<th>${esc(h)}</th>`).join('');
  const rowsHtml = data.summaryTable.rows.map((r) => `<tr>${r.map((c, ci) => ci === 0 ? `<td><b>${esc(c)}</b></td>` : `<td>${esc(c)}</td>`).join('')}</tr>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'แผนที่ทักษะทั้งหลักสูตร', 'Full Course Skill Map', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr>${headerHtml}</tr>
      ${rowsHtml}
    </table>
  </div>
  <div class="tip-card">💡 เคล็ดลับ: ทบทวนตารางนี้ให้ขึ้นใจ เพราะข้อสอบจำลองในบทนี้ดึงเนื้อหามาจากทุกบทในตารางเดียวนี้ทั้งหมด!</div>
</div>`;
}

/* ---------- SECTION 5: MEMORY TRICKS ---------- */
function s5() {
  return `<div class="sheet" id="s5">
  ${banner('sb-c4', '🧠', 'เทคนิคการจำ', 'Memory Tricks', 'ส่วนที่ 5')}
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">"อ่านคำสั่ง 2 รอบ"</div><p>รอบแรกอ่านเพื่อเข้าใจภาพรวม รอบสองอ่านเพื่อจับรายละเอียด/เงื่อนไขพิเศษที่อาจพลาดไปตอนแรก</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">"ง่ายก่อน ยากทีหลัง"</div><p>เห็นข้อไหนตอบได้ทันที ให้รีบทำก่อน ข้อที่คิดนานให้วงไว้แล้วข้ามไปก่อน กลับมาทำทีหลัง</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">"ตัดตัวเลือกผิดชัดเจนออกก่อน"</div><p>แม้ไม่มั่นใจ 100% การตัดตัวเลือกที่ผิดแน่ ๆ ออก 1-2 ตัวจะเพิ่มโอกาสเดาถูกจาก 25% เป็น 50% ขึ้นไป</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">"เหลือเวลา = ตรวจทาน ไม่ใช่นั่งเฉย"</div><p>ถ้าทำเสร็จก่อนหมดเวลา อย่าหยุดพัก ให้กลับไปตรวจข้อที่ไม่มั่นใจซ้ำอีกรอบเสมอ</p></div>
</div>`;
}

/* ---------- SECTION 6: EXAM DAY CORNER (adapted from Phonics Corner) ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🎒', 'มุมเตรียมตัววันสอบ', 'Exam Day Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>ก่อนสอบ</th><th>ควรทำ</th><th>ไม่ควรทำ</th></tr>
      <tr><td>คืนก่อนสอบ</td><td>ทบทวนเบา ๆ, นอนให้พอ</td><td>อ่านหนังสือดึกจนไม่ได้นอน</td></tr>
      <tr><td>เช้าวันสอบ</td><td>ทานอาหารเช้า, ไปถึงแต่เนิ่น ๆ</td><td>รีบร้อนจนลืมอุปกรณ์</td></tr>
      <tr><td>ระหว่างสอบ</td><td>ตั้งสติ, ทำตาม Checklist</td><td>ตื่นเต้นจนอ่านโจทย์ผิด</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดวันสอบ: การนอนหลับให้เพียงพอมีผลต่อสมาธิและความจำมากกว่าการอ่านหนังสือดึกในคืนสุดท้าย — เตรียมตัวมาดีแล้ว ที่เหลือคือความมั่นใจค่ะ!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['📖', 'vocabulary', 'คำศัพท์'], ['📐', 'grammar', 'ไวยากรณ์'], ['❓', 'wh-question', 'คำถาม Wh-'],
    ['💬', 'conversation', 'บทสนทนา'], ['🔍', 'error detection', 'จับผิดประโยค'], ['📚', 'reading', 'การอ่าน'],
    ['⏱️', 'time management', 'การจัดการเวลา'], ['✂️', 'elimination', 'การตัดตัวเลือก'], ['🔄', 'review', 'ตรวจทาน'],
    ['🎯', 'strategy', 'กลยุทธ์'], ['📝', 'mock exam', 'ข้อสอบจำลอง'], ['🏆', 'confidence', 'ความมั่นใจ'],
    ['📊', 'score', 'คะแนน'], ['✅', 'correct answer', 'คำตอบที่ถูกต้อง'], ['🚀', 'ready', 'พร้อม'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้เป็นคำที่ใช้บ่อยเวลาพูดถึงการสอบและกลยุทธ์การทำข้อสอบ</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS (adapted: analysis patterns per question type) ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'วิธีวิเคราะห์โจทย์แต่ละประเภท', 'Question-Type Analysis Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">Vocabulary: จำความหมายจากหมวดคำศัพท์</div>
    <div class="pex">"nurse" แปลว่า? <span class="th">(นึกถึงหมวดอาชีพจากบทที่ 4)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">Grammar: หาคำสัญญาณเวลาก่อนเสมอ</div>
    <div class="pex">She ___ to school every day. <span class="th">(every day → Present Simple)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">Error Detection: ตรวจทีละส่วน A-B-C-D</div>
    <div class="pex">She (A)go to school. <span class="th">(ประธาน she ต้องเติม s ที่ A)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">Reading: Skim ก่อน แล้วค่อย Scan</div>
    <div class="pex">What is the passage mainly about? <span class="th">(อ่านประโยคแรก/สุดท้ายก่อน)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: WORKED EXAMPLES (adapted from Daily Conversation) ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '🕵️', 'ตัวอย่างการวิเคราะห์โจทย์แต่ละแบบ', 'Worked Examples', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🔍 ตัวอย่างที่ 1: Grammar (Tense)</div>
    <div class="bubble left" style="max-width:100%;"><b>โจทย์:</b> She ___ to school every day.</div>
    <div class="bubble right" style="max-width:100%;background:#D9F7EC;"><b>วิธีคิด:</b> หาคำสัญญาณ "every day" → Present Simple → ประธาน She เติม s → <b>goes</b></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🔍 ตัวอย่างที่ 2: WH-Question</div>
    <div class="bubble left" style="max-width:100%;"><b>โจทย์:</b> ___ is your birthday?</div>
    <div class="bubble right" style="max-width:100%;background:#D9F7EC;"><b>วิธีคิด:</b> คำถามนี้ถามเรื่องเวลา → <b>When</b></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🔍 ตัวอย่างที่ 3: Error Detection</div>
    <div class="bubble left" style="max-width:100%;"><b>โจทย์:</b> She (A)go (B)to school (C)every day.</div>
    <div class="bubble right" style="max-width:100%;background:#D9F7EC;"><b>วิธีคิด:</b> ประธาน she ต้องเติม s ที่กริยา → ผิดที่ <b>A</b> ต้องแก้เป็น goes</div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES (adapted: exam-day mistakes, not just grammar) ---------- */
function s10() {
  const mistakes = [
    ['อ่านโจทย์ผ่าน ๆ แล้วรีบตอบทันที', 'อาจพลาดเงื่อนไขสำคัญในโจทย์ เช่น "ไม่ใช่", "ยกเว้น"', 'อ่านโจทย์ให้ครบ 2 รอบก่อนตอบ'],
    ['ใช้เวลานานเกินไปกับข้อยากข้อเดียว', 'เสียเวลาที่ควรใช้ทำข้ออื่นที่ทำได้', 'ข้ามข้อยากไปก่อน แล้วกลับมาทำทีหลัง'],
    ['ปล่อยข้อที่ไม่มั่นใจไว้ว่าง ๆ', 'เสียโอกาสได้คะแนนแม้จะเดา', 'ตัดตัวเลือกผิดออกแล้วเดาที่เหลือดีกว่าเว้นว่าง'],
    ['ไม่ตรวจคำตอบซ้ำแม้มีเวลาเหลือ', 'อาจพลาดจุดที่ทำผิดโดยไม่ตั้งใจ', 'ใช้เวลาที่เหลือตรวจทานคำตอบเสมอ'],
    ['ตื่นเต้นจนลืมกลยุทธ์ที่ฝึกมา', 'ทำให้ทำข้อสอบได้แย่กว่าความสามารถจริง', 'หายใจลึก ๆ แล้วทำตาม Checklist ที่ฝึกมา'],
    ['นอนดึกอ่านหนังสือคืนก่อนสอบ', 'ร่างกายและสมองไม่พร้อมในวันสอบจริง', 'นอนให้เพียงพอ ทบทวนเบา ๆ พอ'],
  ];
  const cards = mistakes.map((m) => `<div class="mistake-card">
    <div class="wrong">❌ ${esc(m[0])}</div>
    <div class="why">🤔 ${esc(m[1])}</div>
    <div class="right">✅ ${esc(m[2])}</div>
  </div>`).join('');
  return `<div class="sheet" id="s10">
  ${banner('sb-c3', '⚠️', 'ข้อผิดพลาดที่พบบ่อยตอนสอบ', 'Common Exam-Day Mistakes', 'ส่วนที่ 10')}
  ${cards}
</div>`;
}

/* ---------- SECTION 11: EXAM TIPS ---------- */
function s11() {
  const tips = [
    'อ่านคำสั่งให้ครบก่อนทำ อย่ารีบตอบจนไม่รู้ว่าโจทย์ถามอะไร',
    'จัดการเวลา แบ่งเวลาต่อข้อคร่าว ๆ ก่อนเริ่ม อย่าใช้เวลากับข้อยากข้อเดียวนานเกินไป',
    'ทำข้อที่มั่นใจก่อน ข้ามข้อยากไปก่อน แล้วค่อยกลับมาทำทีหลัง',
    'ใช้เทคนิคตัดตัวเลือกผิดทิ้ง แม้ไม่มั่นใจ 100% ตัดตัวเลือกที่ผิดชัดเจนออกก่อน',
    'ตรวจคำตอบรอบสุดท้าย ถ้ามีเวลาเหลือ ให้กลับมาตรวจข้อที่ไม่มั่นใจอีกครั้ง',
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
    <div class="mindmap-center">Entrance Exam</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">📖 Vocabulary</span>บทที่ 3-4</div>
      <div class="mindmap-branch mb-b"><span class="bt">📐 Grammar</span>บทที่ 5-9, 14</div>
      <div class="mindmap-branch mb-c"><span class="bt">❓ WH-Questions</span>บทที่ 10</div>
      <div class="mindmap-branch mb-d"><span class="bt">💬 Conversation</span>บทที่ 11</div>
      <div class="mindmap-branch mb-e"><span class="bt">🔍 Error Detection</span>บทที่ 13</div>
      <div class="mindmap-branch mb-f"><span class="bt">📚 Reading</span>บทที่ 12</div>
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
  ${banner('sb-c6', '📝', `ข้อสอบจำลองเต็มรูปแบบ ${total} ข้อ`, 'Full Mock Exam', 'ส่วนที่ 13')}
  <div class="info-row">
    <span>ชื่อ-นามสกุล <span class="fill-line" style="min-width:220px;">&nbsp;</span></span>
    <span>ชั้น <span class="fill-line" style="min-width:80px;">&nbsp;</span></span>
    <span>วันที่ <span class="fill-line" style="min-width:100px;">&nbsp;</span></span>
    <span>คะแนน <span class="fill-line" style="min-width:70px;">&nbsp;</span> / ${total}</span>
  </div>
  <div class="instructions"><b>คำสั่ง:</b> ทำข้อสอบจำลองเต็มรูปแบบ ${total} ข้อ (Part A-F) จับเวลาทำเสมือนสอบจริง แล้วดูเกณฑ์ประเมินผลในส่วนเฉลย</div>
  ${parts}
</div>`;
}

/* ---------- SECTION 14: QUIZ (reused from data — 15-question Speed Round) ---------- */
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
  ${banner('sb-c1', '⚡', `Speed Round ทบทวนรอบสุดท้าย ${data.quiz.length} ข้อ`, 'Final Speed Round', 'ส่วนที่ 14')}
  <div class="info-row">
    <span>ชื่อ-นามสกุล <span class="fill-line" style="min-width:220px;">&nbsp;</span></span>
    <span>ชั้น <span class="fill-line" style="min-width:80px;">&nbsp;</span></span>
    <span>คะแนน <span class="fill-line" style="min-width:70px;">&nbsp;</span> / ${data.quiz.length}</span>
  </div>
  <div class="instructions"><b>คำสั่ง:</b> ทบทวนรอบสุดท้ายก่อนสอบจริงด้วยคำถามผสมทุกทักษะ ${data.quiz.length} ข้อ ตั้งเวลาให้เร็วที่สุดเท่าที่ยังตอบถูก</div>
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
  <h2 class="part-title">เฉลยข้อสอบจำลองเต็มรูปแบบ (35 ข้อ)</h2>
  <table class="answer-table"><tr><th>ข้อ</th><th>คำตอบ</th><th>เหตุผลย่อ</th></tr>${wsRows}</table>
  <div class="tip-card" style="margin:10px 0;">📊 <b>เกณฑ์ประเมิน:</b> 30-35 ข้อ = พร้อมสอบจริงมาก | 24-29 ข้อ = ดี ควรทบทวนบทที่ตอบผิดบ่อย | ต่ำกว่า 24 = กลับไปทบทวนบทที่ 14 (Grammar Summary) และบทที่เกี่ยวข้องอีกรอบ</div>
  <h2 class="part-title">เฉลย Speed Round (${data.quiz.length} ข้อ)</h2>
  <table class="answer-table"><tr><th>ข้อ</th><th></th><th>คำตอบ</th><th>เหตุผล/คำอธิบาย</th></tr>${quizRows}</table>
</div>`;
}

/* ---------- SECTION 16: CHEAT SHEET ---------- */
function s16() {
  return `<div class="sheet" id="s16">
  ${banner('sb-c3', '📋', 'ชีทสรุปหน้าเดียว', 'Cheat Sheet', 'ส่วนที่ 16')}
  <div class="cheat-grid">
    <div class="cheat-box"><h4>5 กลยุทธ์การทำข้อสอบ</h4>
      <ul><li>1. อ่านคำสั่งให้ครบ</li><li>2. จัดการเวลา</li><li>3. ทำง่ายก่อน ยากทีหลัง</li><li>4. ตัดตัวเลือกผิด</li><li>5. ตรวจทานรอบสุดท้าย</li></ul></div>
    <div class="cheat-box"><h4>6 ส่วนของข้อสอบ</h4>
      <ul><li>Vocabulary, Grammar</li><li>WH-Questions, Conversation</li><li>Error Detection, Reading</li></ul></div>
    <div class="cheat-box"><h4>เกณฑ์ประเมิน (35 ข้อ)</h4>
      <ul><li>30-35: พร้อมสอบจริงมาก</li><li>24-29: ดี ควรทบทวนจุดที่ผิด</li><li>ต่ำกว่า 24: ทบทวนบทที่ 14 อีกรอบ</li></ul></div>
    <div class="cheat-box"><h4>ก่อนเข้าห้องสอบ</h4>
      <ul><li>นอนให้พอ ทานอาหารเช้า</li><li>ไปถึงแต่เนิ่น ๆ ตั้งสติ</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกกลยุทธ์ในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>ใช้บทนี้จำลองบรรยากาศห้องสอบจริง จับเวลาให้นักเรียนทำข้อสอบเต็มรูปแบบอย่างน้อย 1 ครั้ง</li>
    <li>เน้นย้ำกลยุทธ์การทำข้อสอบมากพอ ๆ กับความรู้เนื้อหา เพราะหลายคนรู้เนื้อหาแต่บริหารเวลาไม่เป็น</li>
    <li>ใช้ผลคะแนนจากบทนี้เป็นตัวชี้วัดสุดท้ายก่อนแนะนำแผนทบทวนรายบุคคล</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Mock Exam Day</b> — จัดสอบจำลองเต็มรูปแบบพร้อมจับเวลาเหมือนสอบจริง</li>
    <li><b>Answer Key Review</b> — หลังสอบเสร็จ ให้นักเรียนตรวจคำตอบกันเองพร้อมอธิบายเหตุผล</li>
    <li><b>Weakness Mapping</b> — ให้นักเรียนทำตารางสรุปว่าตัวเองพลาดส่วนไหนมากที่สุด</li>
    <li><b>Confidence Circle</b> — ให้นักเรียนแต่ละคนพูด 1 ประโยคให้กำลังใจตัวเองก่อนแยกย้าย</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ข้อสอบจำลอง 35 ข้อ (ส่วนที่ 13) เป็นการสอบจำลองเต็มรูปแบบ และ Speed Round 15 ข้อ (ส่วนที่ 14) เป็นการทบทวนรอบสุดท้าย</li>
    <li>ใช้เกณฑ์ประเมินในส่วนเฉลยเพื่อแนะนำแผนทบทวนที่เหมาะกับนักเรียนแต่ละคน</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'ทำข้อสอบจำลองในส่วนที่ 13 อีกรอบโดยจับเวลาจริง แล้วเทียบว่าคะแนนดีขึ้นหรือไม่',
    'ทบทวนข้อที่ตอบผิดในการทำครั้งแรก แล้วกลับไปอ่านบทที่เกี่ยวข้องอีกครั้ง',
    'เขียนแผนทบทวน 3 วันก่อนสอบจริงของตัวเอง โดยระบุว่าจะทบทวนบทไหนวันไหน',
    'ฝึกทำ Speed Round ในส่วนที่ 14 ให้เร็วขึ้นโดยที่ยังตอบถูกครบทุกข้อ'
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
    <div class="quote">"เธอเตรียมพร้อมมาตลอดทางแล้ว วันนี้แค่แสดงมันออกมา" 🌟</div>
    <div class="sub">ตลอด 15 บทที่ผ่านมา นักเรียนได้สะสมความรู้ภาษาอังกฤษไว้มากมายแล้ว บทนี้เป็นเพียงการซ้อมใหญ่ก่อนสนามจริง ถ้าทำข้อสอบจำลองนี้ได้ดี ก็มั่นใจได้เลยว่าพร้อมสำหรับการสอบเข้า ม.4 จริงแล้ว สู้ ๆ นะคะ 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทสุดท้ายนี้คือข้อสอบจำลองที่รวมทุกทักษะที่เรียนมาตลอด 14 บทเข้าไว้ด้วยกันค่ะ',
    'ก่อนทำข้อสอบ ให้ใช้กลยุทธ์ 5 ข้อ: อ่านคำสั่งครบ, จัดการเวลา, ทำง่ายก่อน, ตัดตัวเลือกผิด, ตรวจทานรอบสุดท้าย',
    'ข้อสอบจำลองเต็มรูปแบบมี 35 ข้อ ครอบคลุม Vocabulary, Grammar, WH-Questions, Conversation, Error Detection, Reading',
    'Speed Round 15 ข้อ ใช้ทบทวนรอบสุดท้ายก่อนเข้าห้องสอบจริง',
    'ดูเกณฑ์ประเมินผลในส่วนเฉลยเพื่อวางแผนทบทวนเพิ่มเติมให้ตรงจุด',
    'จำไว้ว่าทุกข้อในบทนี้ไม่มีเนื้อหาใหม่เลย เป็นการนำสิ่งที่เรียนมาทั้งหมดมาใช้จริง',
    'สุดท้าย ขอให้นักเรียนของครูสุนีทุกคนโชคดีและทำข้อสอบเข้า ม.4 ได้อย่างมั่นใจค่ะ',
  ];
  const linesHtml = lines.map((l) => `<div class="line">✅ ${esc(l)}</div>`).join('');
  return `<div class="sheet" id="s20">
  <div class="sunee-poster">
    <div class="avatar">👩‍🏫</div>
    <h2>ครูสุนีสรุปให้ 🌈</h2>
    ${linesHtml}
    <div class="signoff">สู้ๆ นะคะ นักเรียนของครูสุนีทุกคน 💪🌈 ยินดีด้วยที่เรียนจบหลักสูตรภาษาอังกฤษ ม.3 ครบทั้ง 15 บทแล้ว พร้อมสอบเข้า ม.4! 🎉</div>
  </div>
</div>`;
}

const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>หนังสือเรียน: Entrance Exam — ม.3</title>
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
