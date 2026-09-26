/*
 * "Mini textbook" generator for Chapter 11: Conversation.
 * Mirrors the 03-Grammar/_tools/generate-book-0X.js pattern exactly (same
 * shared.css.js, same 20-section skeleton) so this main-course chapter reads
 * as part of the same visual series as Topics 01-08. The "Grammar Rules"
 * section is adapted into 7 situational-expression cards since this chapter
 * teaches conversational expressions rather than verb conjugation.
 *
 * Usage: node generate-book-11.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-11-conversation.json'), 'utf8'));
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
    <div class="cover-emojis">💬 🤝 📞 🛍️ ✨</div>
    <h1 class="cover-title-en">Conversation</h1>
    <div class="cover-title-th">บทสนทนาในชีวิตประจำวัน (Everyday Conversation)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 บทที่ 11 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Chapter 11 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHY LEARN CONVERSATION ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  <div class="section-banner sb-c1">
    <div><h1>📖 ทำไมต้องเรียนบทสนทนา?</h1><div class="eng">Why Learn Conversation?</div></div>
    <div class="chip">ส่วนที่ 2</div>
  </div>
  <p style="font-size:15px;line-height:1.7;">บทสนทนาในชีวิตประจำวัน (Everyday Conversation) เป็นทักษะที่ข้อสอบเข้า ม.4 ชอบออกในรูปแบบ <b>"บทสนทนาเว้นช่องว่าง"</b> (Conversation Completion) คือให้อ่านบทสนทนาแล้วเลือกประโยคที่เหมาะสมที่สุดมาเติม บทนี้รวบรวมสำนวนที่ใช้บ่อยที่สุด 7 สถานการณ์ ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">ทักทาย</div>เริ่มบทสนทนา<div class="ex">Hello! What's your name?<br>(สวัสดี คุณชื่ออะไร)</div></div>
    <div class="meaning-box mb2"><div class="word">ขอร้อง</div>ขอความช่วยเหลือ<div class="ex">Could you help me, please?<br>(คุณช่วยฉันได้ไหม)</div></div>
    <div class="meaning-box mb3"><div class="word">กล่าวลา</div>จบบทสนทนา<div class="ex">See you tomorrow!<br>(แล้วเจอกันพรุ่งนี้)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่าแต่ละสถานการณ์มี "คู่สำนวน" เปิด-ตอบที่ค่อนข้างตายตัว — ถ้าจำคู่สำนวนเหล่านี้ให้แม่น จะตอบข้อสอบ Conversation Completion ได้เร็วและแม่นยำขึ้นมาก</p>
  <div class="explain-block">
    <h2>🧩 7 สถานการณ์หลักที่ต้องรู้</h2>
    <table>
      <tr><th>สถานการณ์</th><th>ตัวอย่าง</th><th>คำแปล</th></tr>
      <tr><td>ทักทาย/แนะนำตัว</td><td>Nice to meet you.</td><td>ยินดีที่ได้รู้จัก</td></tr>
      <tr><td>ขอบคุณ/ขอโทษ</td><td>You're welcome.</td><td>ยินดี/ไม่เป็นไร</td></tr>
      <tr><td>ขอร้อง/ขออนุญาต</td><td>May I come in?</td><td>ฉันขอเข้ามาได้ไหม</td></tr>
      <tr><td>ซื้อของ</td><td>I'll take it.</td><td>ฉันจะซื้ออันนี้</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ ตัวอย่างง่าย ๆ</h2>
    <table>
      <tr><th>ประโยค</th><th>คำแปล</th></tr>
      <tr><td>How are you? — I'm fine, thank you.</td><td>สบายดีไหม — สบายดี ขอบคุณ</td></tr>
      <tr><td>Excuse me, where is the bank?</td><td>ขอโทษนะคะ ธนาคารอยู่ที่ไหน</td></tr>
      <tr><td>May I speak to Somsak, please?</td><td>ขอสายคุณสมชายหน่อยค่ะ</td></tr>
      <tr><td>Can I help you?</td><td>ให้ช่วยอะไรไหมคะ/ครับ</td></tr>
      <tr><td>I'm sorry. — That's okay.</td><td>ขอโทษ — ไม่เป็นไร</td></tr>
      <tr><td>Take care. Goodbye!</td><td>ดูแลตัวเองด้วยนะ ลาก่อน</td></tr>
    </table>
  </div>
</div>`;
}

/* ---------- SECTION 3: 7 SITUATIONS STEP BY STEP (adapted from Grammar Rules) ---------- */
function s3() {
  return `<div class="sheet" id="s3">
  ${banner('sb-c2', '🧩', '7 สถานการณ์หลัก ทีละสถานการณ์', '7 Key Situations Step by Step', 'ส่วนที่ 3')}
  <div class="step-card sc1">
    <span class="step-label">STEP 1</span>
    <div class="qtext" style="font-size:17px;">ทักทาย/แนะนำตัว และ ขอบคุณ/ขอโทษ</div>
    <p style="margin:6px 0;">ใช้เปิดบทสนทนาและแสดงมารยาทพื้นฐาน — จำสูตร "ทัก-แนะนำตัว-ถามชื่อ" และ "ขอบคุณ-ตอบรับ / ขอโทษ-ให้อภัย"</p>
    <ul><li>Hello! My name is Nid. What's your name? (ทักทาย/แนะนำตัว)</li><li>Thank you very much. — You're welcome. (ขอบคุณ)</li><li>I'm sorry. — That's okay. (ขอโทษ)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">ขอร้อง/ขออนุญาต และ ซื้อของ</div>
    <p style="margin:6px 0;">ขอร้องใช้ Could/Can/May นำหน้า ส่วนซื้อของเน้นถามราคาและตัดสินใจซื้อ</p>
    <ul><li>Could you help me, please? — Sure, no problem. (ขอร้อง)</li><li>How much is this? — It's 100 baht. I'll take it. (ซื้อของ)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">ถามทาง และ คุยโทรศัพท์</div>
    <p style="margin:6px 0;">ถามทางใช้ Excuse me + Where เปิดประโยค ตอบด้วยทิศทาง ส่วนโทรศัพท์ใช้ May I speak to...? เป็นสูตรมาตรฐาน</p>
    <ul><li>Excuse me, where is the nearest bank? — Go straight ahead. (ถามทาง)</li><li>May I speak to Somsak? — This is Somsak speaking. (โทรศัพท์)</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">กล่าวลา</div>
    <p style="margin:6px 0;">ใช้จบบทสนทนาอย่างสุภาพ มีทั้งแบบเป็นทางการและเป็นกันเอง</p>
    <ul><li>Goodbye. / Bye. — See you later! (เป็นกันเอง)</li><li>Take care. Have a nice day! (เป็นทางการกว่า)</li></ul>
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
  <div class="tip-card">💡 เคล็ดลับ: ท่องตารางนี้ให้ขึ้นใจ เพราะทุกสำนวนในบทนี้อ้างอิงจากตารางเดียวนี้ทั้งหมด!</div>
</div>`;
}

/* ---------- SECTION 5: MEMORY TRICKS ---------- */
function s5() {
  return `<div class="sheet" id="s5">
  ${banner('sb-c4', '🧠', 'เทคนิคการจำ', 'Memory Tricks', 'ส่วนที่ 5')}
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">จำเป็นคู่ ไม่ใช่ทีละประโยค</div><p>ทุกสำนวนมี "คู่" ของมันเสมอ (Thank you ↔ You're welcome) ท่องเป็นคู่จะจำได้แม่นกว่าท่องทีละประโยค</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">ฟังคำถามให้จับ "ประเภทคำตอบ"</div><p>ถ้าคำถามถามราคา คำตอบต้องมีจำนวนเงิน ถ้าถามทาง คำตอบต้องมีทิศทาง — จับคู่ประเภทให้ตรงก่อนเลือกคำตอบ</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">May I...? สุภาพกว่า Can I...?</div><p>ทั้งสองคำถามความหมายเดียวกัน (ขออนุญาต) แต่ May สุภาพและเป็นทางการกว่า Can เล็กน้อย</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">7 สถานการณ์ = 7 นิ้วมือ</div><p>นับสถานการณ์ด้วยนิ้วมือ: ทักทาย-ขอบคุณ-ขอร้อง-ซื้อของ-ถามทาง-โทรศัพท์-กล่าวลา ท่องซ้ำจนขึ้นใจ</p></div>
</div>`;
}

/* ---------- SECTION 6: INTONATION & POLITENESS CORNER (adapted from Phonics Corner) ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🎵', 'มุมน้ำเสียงและมารยาท', 'Intonation & Politeness Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>สำนวน</th><th>น้ำเสียงที่ควรใช้</th><th>ตัวอย่างสถานการณ์</th></tr>
      <tr><td><b>Excuse me...</b></td><td>เสียงสุภาพ ขึ้นเบา ๆ ท้ายประโยค</td><td>เรียกความสนใจก่อนถามทาง/ขัดจังหวะ</td></tr>
      <tr><td><b>Could you...?</b></td><td>เสียงอ่อนโยน ลงท้ายแบบคำถาม</td><td>ขอร้องอย่างสุภาพ ฟังดูไม่สั่ง</td></tr>
      <tr><td><b>I'm so sorry...</b></td><td>เสียงจริงใจ ช้าลงเล็กน้อย</td><td>ขอโทษเรื่องที่ทำผิดพลาด</td></tr>
      <tr><td><b>Thank you very much.</b></td><td>เสียงอบอุ่น เน้นคำว่า "very much"</td><td>ขอบคุณอย่างจริงใจ</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดมารยาท: ในภาษาอังกฤษ การพูด "please" และยิ้มเวลาขอร้อง/ขอบคุณเป็นเรื่องสำคัญมาก แม้แต่ประโยคเดียวกัน ถ้าพูดด้วยน้ำเสียงห้วนก็อาจฟังดูไม่สุภาพได้ ลองฝึกพูดด้วยน้ำเสียงนุ่มนวลนะคะ!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['👋', 'greeting', 'การทักทาย'], ['🙏', 'thanks', 'การขอบคุณ'], ['😔', 'apology', 'การขอโทษ'],
    ['🙋', 'request', 'การขอร้อง'], ['🚪', 'permission', 'การขออนุญาต'], ['🛍️', 'shopping', 'การซื้อของ'],
    ['🧭', 'direction', 'ทิศทาง'], ['📞', 'phone call', 'การโทรศัพท์'], ['👋', 'farewell', 'การกล่าวลา'],
    ['💰', 'price', 'ราคา'], ['📍', 'nearest', 'ใกล้ที่สุด'], ['↔️', 'straight ahead', 'ตรงไป'],
    ['↩️', 'turn left/right', 'เลี้ยวซ้าย/ขวา'], ['🤝', 'polite', 'สุภาพ'], ['💬', 'expression', 'สำนวน'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้เป็นชื่อเรียกของแต่ละสถานการณ์บทสนทนา ช่วยให้จัดหมวดหมู่สำนวนในหัวได้ง่ายขึ้น</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS (adapted: opener + responder pairs) ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'โครงสร้างประโยค', 'Sentence Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">ทักทาย/ขอบคุณ: เปิด → ตอบ</div>
    <div class="pex">Hello! What's your name? → My name is... <span class="th">(ทักทาย/แนะนำตัว)</span></div>
    <div class="pex">Thank you. → You're welcome. <span class="th">(ขอบคุณ)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">ขอร้อง/ขออนุญาต: Could/Can/May + S + V? → Sure/I'm afraid not</div>
    <div class="pex">Could you help me? → Sure, no problem. <span class="th">(ขอร้อง)</span></div>
    <div class="pex">May I come in? → Sure, come in. <span class="th">(ขออนุญาต)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">ซื้อของ/ถามทาง: How much...? / Where is...? → บอกราคา/ทิศทาง</div>
    <div class="pex">How much is this? → It's 100 baht. <span class="th">(ซื้อของ)</span></div>
    <div class="pex">Where is the bank? → Go straight ahead. <span class="th">(ถามทาง)</span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">โทรศัพท์/กล่าวลา: May I speak to...? → This is...speaking</div>
    <div class="pex">May I speak to Ben? → This is Ben speaking. <span class="th">(โทรศัพท์)</span></div>
    <div class="pex">Goodbye! See you soon. → Bye! Take care. <span class="th">(กล่าวลา)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: DAILY CONVERSATION (reused from source .md's 5 example dialogues) ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '💬', 'บทสนทนาตัวอย่าง 5 สถานการณ์', 'Sample Dialogues', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🧑‍🤝‍🧑 สถานการณ์ที่ 1: การแนะนำตัว</div>
    <div class="bubble left"><div class="speaker">Nid</div>Hello! My name is Nid. What's your name?<div class="th">สวัสดี! ฉันชื่อนิด คุณชื่ออะไร</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>Hi! I'm Ben. Nice to meet you.<div class="th">สวัสดี! ผมชื่อเบน ยินดีที่ได้รู้จัก</div></div>
    <div class="bubble left"><div class="speaker">Nid</div>Nice to meet you too. How are you?<div class="th">ยินดีที่ได้รู้จักเช่นกัน คุณเป็นอย่างไรบ้าง</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>I'm fine, thank you. And you?<div class="th">สบายดีครับ ขอบคุณ แล้วคุณล่ะ</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🛍️ สถานการณ์ที่ 2: การซื้อของ</div>
    <div class="bubble left"><div class="speaker">Ben</div>Can I help you?<div class="th">ให้ช่วยอะไรไหมคะ</div></div>
    <div class="bubble right"><div class="speaker">Nid</div>Yes, how much is this shirt?<div class="th">ค่ะ เสื้อตัวนี้ราคาเท่าไหร่</div></div>
    <div class="bubble left"><div class="speaker">Ben</div>It's 250 baht. Do you have a smaller size?<div class="th">250 บาทค่ะ ต้องการไซส์เล็กกว่านี้ไหม</div></div>
    <div class="bubble right"><div class="speaker">Nid</div>Yes, here you are. Great, I'll take it.<div class="th">มีค่ะ นี่ค่ะ ดีเลย ฉันจะซื้ออันนี้</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🧭 สถานการณ์ที่ 3: การถามทาง</div>
    <div class="bubble left"><div class="speaker">Nid</div>Excuse me, where is the nearest hospital?<div class="th">ขอโทษค่ะ โรงพยาบาลที่ใกล้ที่สุดอยู่ที่ไหน</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>Go straight ahead, then turn left at the corner.<div class="th">ตรงไปข้างหน้า แล้วเลี้ยวซ้ายที่มุมถนน</div></div>
    <div class="bubble left"><div class="speaker">Nid</div>Is it far from here?<div class="th">ไกลจากที่นี่ไหมคะ</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>No, it's just 5 minutes away.<div class="th">ไม่ไกลค่ะ แค่ 5 นาทีเอง</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">📞 สถานการณ์ที่ 4: การคุยโทรศัพท์</div>
    <div class="bubble left"><div class="speaker">Nid</div>Hello, may I speak to Somsak, please?<div class="th">สวัสดีค่ะ ขอสายคุณสมชายหน่อยค่ะ</div></div>
    <div class="bubble right"><div class="speaker">Somsak</div>This is Somsak speaking.<div class="th">สมชายพูดครับ</div></div>
    <div class="bubble left"><div class="speaker">Nid</div>Hi, this is Nid. Are you free tomorrow?<div class="th">สวัสดีค่ะ นี่นิดนะ พรุ่งนี้ว่างไหม</div></div>
    <div class="bubble right"><div class="speaker">Somsak</div>Sure, what's up? Let's meet at the library.<div class="th">ว่างครับ มีอะไรหรือเปล่า ไปเจอกันที่ห้องสมุดนะ</div></div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🙋 สถานการณ์ที่ 5: การขอร้อง/ขออนุญาต</div>
    <div class="bubble left"><div class="speaker">Nid</div>Could you help me with my homework?<div class="th">ช่วยฉันทำการบ้านหน่อยได้ไหม</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>Sure, no problem. Could I borrow your pen too?<div class="th">ได้เลย ไม่มีปัญหา ขอยืมปากกาด้วยได้ไหม</div></div>
    <div class="bubble left"><div class="speaker">Nid</div>Of course, here you are. Thank you so much.<div class="th">ได้เลย นี่จ้ะ ขอบคุณมากนะ</div></div>
    <div class="bubble right"><div class="speaker">Ben</div>You're welcome.<div class="th">ไม่เป็นไร ยินดี</div></div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['A: Thank you. B: It\'s 100 baht.', 'ตอบคำขอบคุณต้องใช้ You\'re welcome ไม่ใช่ตอบราคาซึ่งเป็นคนละสถานการณ์', 'A: Thank you. B: You\'re welcome.'],
    ['A: How much is this? B: Nice to meet you.', 'คำถามถามราคาต้องตอบด้วยจำนวนเงิน ไม่ใช่คำทักทาย', 'A: How much is this? B: It\'s 100 baht.'],
    ['A: Can I help you? B: Turn left.', 'คำเสนอช่วยเหลือในร้านค้าต้องตอบรับ/ปฏิเสธ ไม่ใช่บอกทิศทาง', 'A: Can I help you? B: Yes, please.'],
    ['A: May I speak to Ben? B: I\'m fine, thanks.', 'คำขอสายโทรศัพท์ต้องตอบด้วย This is...speaking หรือ Hold on', 'A: May I speak to Ben? B: This is Ben speaking.'],
    ['A: I\'m sorry. B: How much is it?', 'คำขอโทษต้องตอบด้วยการให้อภัย ไม่ใช่ถามราคา', 'A: I\'m sorry. B: That\'s okay.'],
    ['A: Goodbye! B: It\'s 50 baht.', 'การกล่าวลาต้องตอบด้วยการกล่าวลาเช่นกัน', 'A: Goodbye! B: Bye! Take care.'],
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
    'ก่อนเลือกคำตอบ ให้จับ "ประเภท" ของคำถามก่อนเสมอ (ถามราคา/ทิศทาง/ตอบรับขอบคุณ ฯลฯ)',
    'ตัวลวงที่พบบ่อยที่สุดคือคำตอบจากสถานการณ์อื่นที่ฟังดูสุภาพแต่ไม่ตรงบริบท (เช่น "Nice to meet you" ตอบคำถามราคา)',
    'สังเกตคำสำคัญในประโยคถาม (how much, where, may I) เพื่อคาดเดาประเภทคำตอบก่อนอ่านตัวเลือก',
    'ข้อสอบเรียงประโยคบทสนทนา ให้หาประโยคเปิดก่อน (มักมีคำทักทาย/Excuse me) แล้วไล่ลำดับตามความสมเหตุสมผล',
    'จำสำนวนตอบรับมาตรฐานให้แม่น เพราะข้อสอบมักออกแบบเดียวกันซ้ำในสถานการณ์เดิม',
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
    <div class="mindmap-center">Conversation</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">👋 ทักทาย/ขอบคุณ</span>Hello! What's your name? / Thank you → You're welcome</div>
      <div class="mindmap-branch mb-b"><span class="bt">🙋 ขอร้อง/ขออนุญาต</span>Could you...? / May I...? → Sure / I'm afraid not</div>
      <div class="mindmap-branch mb-c"><span class="bt">🛍️ ซื้อของ</span>How much...? → It's...baht. I'll take it.</div>
      <div class="mindmap-branch mb-d"><span class="bt">🧭 ถามทาง</span>Where is...? → Go straight/turn left-right</div>
      <div class="mindmap-branch mb-e"><span class="bt">📞 โทรศัพท์</span>May I speak to...? → This is...speaking</div>
      <div class="mindmap-branch mb-f"><span class="bt">👋 กล่าวลา</span>Goodbye/See you → Take care/Bye</div>
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
    <div class="cheat-box"><h4>7 สถานการณ์หลัก</h4>
      <table><tr><th>สถานการณ์</th><th>สำนวนสำคัญ</th></tr>
      <tr><td>ทักทาย</td><td>Hello! Nice to meet you.</td></tr>
      <tr><td>ขอบคุณ/ขอโทษ</td><td>You're welcome. / That's okay.</td></tr>
      <tr><td>ขอร้อง/ขออนุญาต</td><td>Could you...? / May I...?</td></tr></table></div>
    <div class="cheat-box"><h4>อีก 4 สถานการณ์</h4>
      <ul><li>ซื้อของ: How much...? I'll take it.</li><li>ถามทาง: Where is...? Go straight.</li><li>โทรศัพท์: May I speak to...?</li><li>กล่าวลา: Goodbye! Take care.</li></ul></div>
    <div class="cheat-box"><h4>คู่สำนวนตอบรับ</h4>
      <ul><li>Thank you → You're welcome</li><li>I'm sorry → That's okay</li><li>May I...? → Sure/I'm afraid not</li></ul></div>
    <div class="cheat-box"><h4>ข้อควรระวัง</h4>
      <ul><li>จับ "ประเภทคำตอบ" ให้ตรงกับคำถามเสมอ</li><li>ระวังตัวลวงที่สุภาพแต่ผิดบริบท</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุกสถานการณ์ในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>เริ่มจากสถานการณ์ใกล้ตัวนักเรียนก่อน (แนะนำตัว, ขอบคุณ) แล้วค่อยขยายไปสถานการณ์ที่ซับซ้อนขึ้น</li>
    <li>ให้นักเรียนฝึกจำเป็น "คู่สำนวน" เปิด-ตอบ ไม่ใช่ท่องประโยคเดี่ยว ๆ</li>
    <li>เน้นย้ำมารยาทและน้ำเสียงสุภาพ ไม่ใช่แค่ความถูกต้องทางไวยากรณ์</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Role-Play Stations</b> — แบ่งมุมห้องเป็น 7 สถานการณ์ ให้นักเรียนหมุนเวียนเล่นบทสนทนาแต่ละมุม</li>
    <li><b>Phone Call Simulation</b> — ใช้โทรศัพท์ของเล่นฝึกบทสนทนาโทรศัพท์เป็นคู่ ๆ</li>
    <li><b>Shopping Market Day</b> — จัดร้านค้าจำลองในห้อง ให้นักเรียนฝึกซื้อ-ขายด้วยสำนวนที่เรียน</li>
    <li><b>Direction Maze</b> — วาดแผนที่ห้องเรียน/โรงเรียน ให้นักเรียนฝึกถามและบอกทาง</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>สังเกตข้อผิดพลาดที่พบบ่อยที่สุดจากส่วนที่ 10 โดยเฉพาะการตอบไม่ตรงประเภทคำถาม เพื่อวางแผนการสอนซ่อมเสริม</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'เขียนบทสนทนาสั้น 6 ประโยคระหว่างเพื่อน 2 คนที่เจอกันครั้งแรก โดยใช้สำนวนทักทาย/แนะนำตัว',
    'สัมภาษณ์คนในครอบครัว 1 คน ด้วยการขอร้อง/ขออนุญาตอย่างน้อย 2 ประโยค แล้วจดคำตอบมาเล่าในห้องเรียน',
    'ฝึกพูดบทสนทนาถามทางกับเพื่อน โดยใช้แผนที่จริงในหมู่บ้าน/ชุมชนของตัวเอง',
    'หาบทสนทนาภาษาอังกฤษจากหนังหรือซีรีส์ที่ชอบ 1 ฉาก แล้วเขียนบทและแปลไทย'
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
    <div class="quote">"การพูดคุยที่ดีเริ่มจากคำง่าย ๆ ไม่กี่คำ" 🌟</div>
    <div class="sub">บทสนทนาในชีวิตประจำวันคือภาษาอังกฤษที่ใช้ได้จริงที่สุด ถ้าวันนี้จำสำนวนพื้นฐาน 7 สถานการณ์ได้แม่นแล้ว จะกล้าพูดภาษาอังกฤษกับใครก็ได้มากขึ้นเยอะเลย อย่ากลัวที่จะพูดผิด เพราะการสื่อสารสำคัญกว่าความสมบูรณ์แบบ 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เรียนเรื่อง Conversation ค่ะ รวมสำนวนสำคัญ 7 สถานการณ์ในชีวิตประจำวัน',
    'ทักทาย/ขอบคุณ/ขอโทษ ใช้เปิดบทสนทนาและแสดงมารยาทพื้นฐาน',
    'ขอร้อง/ขออนุญาต ใช้ Could/Can/May นำหน้า ตอบรับด้วย Sure หรือปฏิเสธอย่างสุภาพ',
    'ซื้อของและถามทาง เน้นตอบให้ตรงประเภท (ราคา หรือ ทิศทาง)',
    'โทรศัพท์ใช้สูตร May I speak to...? — This is...speaking. เป็นมาตรฐาน',
    'กล่าวลาให้เลือกใช้ให้เหมาะกับความสนิทสนม (เป็นทางการ vs เป็นกันเอง)',
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
<title>หนังสือเรียน: Conversation — ม.3</title>
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
