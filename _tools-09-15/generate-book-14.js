/*
 * "Mini textbook" generator for Chapter 14: Grammar Summary.
 * Mirrors the 03-Grammar/_tools/generate-book-0X.js pattern exactly (same
 * shared.css.js, same 20-section skeleton) so this main-course chapter reads
 * as part of the same visual series as Topics 01-08. This chapter is a
 * cross-tense recap (Chapters 5-10), not a single new grammar point, so the
 * "Grammar Rules" section becomes per-tense recap cards, and s4's summary
 * table is generalized to support the Master Table's 4 columns (Tense,
 * Positive, Negative, Question) instead of the usual 3.
 *
 * Usage: node generate-book-14.js
 */
const fs = require('fs');
const path = require('path');

const baseCSS = require('./shared.css.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data-14-grammar-summary.json'), 'utf8'));
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
    <div class="cover-emojis">📊 🔄 📚 🧠 ✨</div>
    <h1 class="cover-title-en">Grammar Summary</h1>
    <div class="cover-title-th">สรุปแกรมม่ารวม (Grammar Summary)</div>
    <div class="cover-subtitle">หนังสือเรียนภาษาอังกฤษ ม.3 บทที่ 14 · เตรียมสอบเข้า ม.4</div>
    <div class="cover-credit">✍️ เรียบเรียงโดย ครูสุนี</div>
    <div class="cover-objectives">
      <h3>🎯 จุดประสงค์การเรียนรู้</h3>
      <ul class="obj-list" style="list-style:disc;">${objs}</ul>
    </div>
    <div class="cover-footer">Chapter 14 · English Grammar Storybook Series 🌈</div>
  </div>`;
}

/* ---------- SECTION 2: WHAT IS THIS SUMMARY CHAPTER ---------- */
function s2() {
  return `<div class="sheet" id="s2">
  <div class="section-banner sb-c1">
    <div><h1>📖 บทสรุปนี้คืออะไร?</h1><div class="eng">What is this Summary Chapter?</div></div>
    <div class="chip">ส่วนที่ 2</div>
  </div>
  <p style="font-size:15px;line-height:1.7;">บทนี้เป็น <b>"บทสรุปรวม"</b> ทบทวนแกรมม่าทั้งหมดที่เรียนมาตั้งแต่บทที่ 5-10 (Parts of Speech, Present Simple, Present Continuous, Past Simple, Future Tense, WH-Questions) มาไว้ในที่เดียว เพื่อใช้ทบทวนก่อนสอบจริงในบทที่ 15 (Entrance Exam) ลองดูตัวอย่างด้านล่างนี้ก่อนเลย:</p>
  <div class="meaning-row">
    <div class="meaning-box mb1"><div class="word">Present Simple</div>นิสัย/ความจริง<div class="ex">She goes to school every day.<br>(เธอไปโรงเรียนทุกวัน)</div></div>
    <div class="meaning-box mb2"><div class="word">Past Simple</div>จบไปแล้ว<div class="ex">I visited Chiang Mai last year.<br>(ฉันไปเชียงใหม่ปีที่แล้ว)</div></div>
    <div class="meaning-box mb3"><div class="word">Future</div>ยังไม่เกิดขึ้น<div class="ex">She is going to study medicine.<br>(เธอวางแผนจะเรียนแพทย์)</div></div>
  </div>
  <p style="font-size:15px;line-height:1.7;">สังเกตไหมว่าแต่ละ Tense ใช้คำสัญญาณเวลาต่างกันชัดเจน — นี่คือกุญแจสำคัญของบทนี้: จับคำสัญญาณให้ได้ก่อน แล้ว Tense ที่ถูกต้องจะตามมาเอง</p>
  <div class="explain-block">
    <h2>🧩 สรุป Parts of Speech (บทที่ 5)</h2>
    <table>
      <tr><th>ชนิดของคำ</th><th>หน้าที่</th><th>ตัวอย่าง</th></tr>
      <tr><td>Noun</td><td>ชื่อคน สัตว์ สิ่งของ สถานที่</td><td>dog, Bangkok, book</td></tr>
      <tr><td>Verb</td><td>บอกการกระทำ/สภาวะ</td><td>run, eat, is, seem</td></tr>
      <tr><td>Adjective</td><td>ขยายคำนาม</td><td>big, happy, beautiful</td></tr>
      <tr><td>Adverb</td><td>ขยายกริยา/คุณศัพท์ (-ly)</td><td>quickly, slowly, very</td></tr>
    </table>
  </div>
  <div class="explain-block">
    <h2>✏️ วิธีเลือก Tense ให้ถูกต้อง (Checklist 3 ขั้นตอน)</h2>
    <table>
      <tr><th>ขั้นตอน</th><th>รายละเอียด</th></tr>
      <tr><td>1</td><td>หาคำสัญญาณเวลาในประโยคก่อนเสมอ (yesterday, now, tomorrow, every day)</td></tr>
      <tr><td>2</td><td>จับคู่คำสัญญาณกับ Tense ที่ตรงกัน</td></tr>
      <tr><td>3</td><td>เช็กประธานว่าเป็น he/she/it หรือไม่ เพื่อเลือกรูปกริยา/verb to be ให้ถูก</td></tr>
    </table>
  </div>
</div>`;
}

/* ---------- SECTION 3: PER-TENSE RECAP STEP BY STEP (adapted from Grammar Rules) ---------- */
function s3() {
  return `<div class="sheet" id="s3">
  ${banner('sb-c2', '🧩', 'ทบทวน 5 Tense หลัก ทีละ Tense', '5 Key Tenses Recap Step by Step', 'ส่วนที่ 3')}
  <div class="step-card sc1">
    <span class="step-label">STEP 1</span>
    <div class="qtext" style="font-size:17px;">Present Simple — ความจริงทั่วไป, นิสัย, ตารางเวลา</div>
    <p style="margin:6px 0;">โครงสร้าง: S + V(s/es) — คำสัญญาณ: always, usually, every day</p>
    <ul><li>He studies English every day. (นิสัย)</li><li>The sun rises in the east. (ความจริงทั่วไป)</li></ul>
  </div>
  <div class="step-card sc2">
    <span class="step-label">STEP 2</span>
    <div class="qtext" style="font-size:17px;">Present Continuous — กำลังทำอยู่ตอนนี้, แผนนัดไว้</div>
    <p style="margin:6px 0;">โครงสร้าง: S + is/am/are + V-ing — คำสัญญาณ: now, right now, Look!</p>
    <ul><li>Look! He is running now. (กำลังทำ)</li><li>I am meeting my friend this weekend. (แผนนัดไว้)</li></ul>
  </div>
  <div class="step-card sc3">
    <span class="step-label">STEP 3</span>
    <div class="qtext" style="font-size:17px;">Past Simple — จบไปแล้วในอดีต มีเวลาชัดเจน</div>
    <p style="margin:6px 0;">โครงสร้าง: S + V-ed / irregular — คำสัญญาณ: yesterday, last week, ...ago</p>
    <ul><li>We visited Chiang Mai last year.</li><li>She bought a bag two days ago.</li></ul>
  </div>
  <div class="step-card sc4">
    <span class="step-label">BONUS STEP</span>
    <div class="qtext" style="font-size:17px;">Future (will / going to) — ยังไม่เกิดขึ้น</div>
    <p style="margin:6px 0;">will: ตัดสินใจทันที/สัญญา/เดาไม่มีหลักฐาน — going to: แผนที่วางไว้แล้ว/เดามีหลักฐาน</p>
    <ul><li>I will call you tomorrow. (สัญญา)</li><li>She is going to study medicine. (แผนที่วางไว้)</li></ul>
  </div>
</div>`;
}

/* ---------- SECTION 4: SUMMARY TABLE (data-driven, generalized to N columns for the Master Table) ---------- */
function s4() {
  const headers = data.summaryTable.headers;
  const headerHtml = headers.map((h) => `<th>${esc(h)}</th>`).join('');
  const rowsHtml = data.summaryTable.rows.map((r) => `<tr>${r.map((c, ci) => ci === 0 ? `<td><b>${esc(c)}</b></td>` : `<td>${esc(c)}</td>`).join('')}</tr>`).join('');
  return `<div class="sheet" id="s4">
  ${banner('sb-c3', '📊', 'ตารางสรุปใหญ่ (Master Table)', 'Summary Table', 'ส่วนที่ 4')}
  <div class="explain-block">
    <table>
      <tr>${headerHtml}</tr>
      ${rowsHtml}
    </table>
  </div>
  <div class="tip-card">💡 เคล็ดลับ: ท่องตารางนี้ให้ขึ้นใจ เพราะทุก Tense ในบทนี้อ้างอิงจากตารางเดียวนี้ทั้งหมด!</div>
</div>`;
}

/* ---------- SECTION 5: MEMORY TRICKS ---------- */
function s5() {
  return `<div class="sheet" id="s5">
  ${banner('sb-c4', '🧠', 'เทคนิคการจำ', 'Memory Tricks', 'ส่วนที่ 5')}
  <div class="step-card sc1"><span class="step-label">เทคนิค 1</span><div class="qtext" style="font-size:18px;">"เช็กประธานก่อนเสมอ"</div><p>เจอประโยคให้จับผิด ให้วงกลมประธานก่อนอันดับแรก แล้วถามตัวเองว่า he/she/it ต้องเติม s ที่กริยาหรือยัง</p></div>
  <div class="step-card sc2"><span class="step-label">เทคนิค 2</span><div class="qtext" style="font-size:18px;">"เจอ do/does/did/will/can → มองกริยาถัดไป"</div><p>ถ้าเจอกริยาช่วยเหล่านี้ กริยาที่ตามมาต้องเป็น base form เสมอ ห้ามเติม -s/-ed/-ing</p></div>
  <div class="step-card sc3"><span class="step-label">เทคนิค 3</span><div class="qtext" style="font-size:18px;">"คำนามพิเศษ = พหูพจน์ไม่ปกติ"</div><p>ท่องจำคำนามที่ไม่เติม s แบบปกติ: children, feet, teeth, mice, men, people, leaves, knives</p></div>
  <div class="step-card sc4"><span class="step-label">เทคนิคโบนัส</span><div class="qtext" style="font-size:18px;">"Adjective อยู่หน้าคำนามเสมอ"</div><p>ภาษาอังกฤษเรียง Adjective ไว้หน้าคำนามเสมอ (a big dog ไม่ใช่ a dog big) ตรงข้ามกับภาษาไทย</p></div>
</div>`;
}

/* ---------- SECTION 6: EXAM FORMAT CORNER (adapted from Phonics Corner) ---------- */
function s6() {
  return `<div class="sheet" id="s6">
  ${banner('sb-c5', '🔊', 'มุมออกเสียง: คำสัญญาณเวลา', 'Signal Words Phonics Corner', 'ส่วนที่ 6')}
  <div class="explain-block">
    <table>
      <tr><th>คำสัญญาณ</th><th>สัทอักษร (IPA)</th><th>Tense ที่บ่งบอก</th></tr>
      <tr><td><b>always</b></td><td>/ˈɔːlweɪz/</td><td>Present Simple</td></tr>
      <tr><td><b>now</b></td><td>/naʊ/</td><td>Present Continuous</td></tr>
      <tr><td><b>yesterday</b></td><td>/ˈjestərdeɪ/</td><td>Past Simple</td></tr>
      <tr><td><b>tomorrow</b></td><td>/təˈmɒroʊ/</td><td>Future</td></tr>
    </table>
  </div>
  <div class="tip-card">🎧 เกร็ดออกเสียง: คำสัญญาณเวลาเหล่านี้มักอยู่ท้ายประโยคและออกเสียงเน้นชัดเจน — ฝึกฟังให้จับคำเหล่านี้ให้ไวจะช่วยเลือก Tense ได้เร็วขึ้นมากค่ะ!</div>
</div>`;
}

/* ---------- SECTION 7: VOCABULARY ---------- */
function s7() {
  const words = [
    ['📅', 'always', 'เสมอ (Present Simple)'], ['⏰', 'now', 'ตอนนี้ (Continuous)'], ['📆', 'yesterday', 'เมื่อวาน (Past)'],
    ['🗓️', 'tomorrow', 'พรุ่งนี้ (Future)'], ['🔁', 'usually', 'โดยปกติ'], ['👁️', 'right now', 'ตอนนี้เลย'],
    ['⏳', 'last week', 'สัปดาห์ที่แล้ว'], ['🔮', 'soon', 'เร็ว ๆ นี้'], ['📋', 'plan', 'แผนการ'],
    ['🔠', 'noun', 'คำนาม'], ['🎬', 'verb', 'คำกริยา'], ['🎨', 'adjective', 'คำคุณศัพท์'],
    ['🏃', 'adverb', 'คำกริยาวิเศษณ์'], ['❓', 'wh-word', 'คำคำถาม'], ['🔄', 'review', 'ทบทวน'],
  ];
  const cards = words.map((w) => `<div class="flash-card"><div class="fe">${w[0]}</div><div class="fw">${w[1]}</div><div class="ft">${w[2]}</div></div>`).join('');
  return `<div class="sheet" id="s7">
  ${banner('sb-c6', '📚', 'คำศัพท์น่ารู้', 'Vocabulary', 'ส่วนที่ 7')}
  <p style="font-size:14.5px;color:#55607a;">คำศัพท์กลุ่มนี้รวมคำสัญญาณเวลาของทุก Tense และศัพท์ไวยากรณ์พื้นฐานที่ใช้ตลอดบทนี้</p>
  <div class="flash-grid">${cards}</div>
</div>`;
}

/* ---------- SECTION 8: SENTENCE PATTERNS (adapted: master formula comparison) ---------- */
function s8() {
  return `<div class="sheet" id="s8">
  ${banner('sb-c1', '🧱', 'เทียบโครงสร้างทุก Tense', 'Tense Comparison Patterns', 'ส่วนที่ 8')}
  <div class="pattern-box" style="--accent:#21C38D;"><div class="formula">Present Simple vs Continuous</div>
    <div class="pex">She goes to school every day. <span class="th">(นิสัย)</span></div>
    <div class="pex">She is going to school now. <span class="th">(กำลังทำ)</span></div></div>
  <div class="pattern-box" style="--accent:#FF5D5D;"><div class="formula">Past Simple vs Future</div>
    <div class="pex">She went to school yesterday. <span class="th">(อดีต)</span></div>
    <div class="pex">She will go to school tomorrow. <span class="th">(อนาคต)</span></div></div>
  <div class="pattern-box" style="--accent:#2F9BFF;"><div class="formula">will vs be going to</div>
    <div class="pex">I will help you. (ตัดสินใจทันที) <span class="th"></span></div>
    <div class="pex">I am going to study medicine. (แผนที่วางไว้) <span class="th"></span></div></div>
  <div class="pattern-box" style="--accent:#9B5DE5;"><div class="formula">คำถามของทุก Tense (สรุปรวม)</div>
    <div class="pex">Do/Does...? / Is/Am/Are...? / Did...? / Will...? <span class="th">(ขึ้นอยู่กับ Tense)</span></div></div>
</div>`;
}

/* ---------- SECTION 9: WORKED EXAMPLES (adapted from Daily Conversation) ---------- */
function s9() {
  return `<div class="sheet" id="s9">
  ${banner('sb-c2', '🕵️', 'ตัวอย่างการเลือก Tense ทีละขั้น', 'Worked Examples', 'ส่วนที่ 9')}
  <div class="dialogue-wrap">
    <div class="dialogue-title">🔍 ตัวอย่างที่ 1: ใช้ Checklist 3 ขั้นตอน</div>
    <div class="bubble left" style="max-width:100%;"><b>โจทย์:</b> She ___ (visit) her grandmother last week.</div>
    <div class="bubble right" style="max-width:100%;background:#D9F7EC;"><b>ขั้นที่ 1:</b> หาคำสัญญาณ → "last week"<br><b>ขั้นที่ 2:</b> จับคู่กับ Tense → Past Simple<br><b>ขั้นที่ 3:</b> เช็กประธาน She (ไม่ต้องเติม s ที่กริยาช่องอดีต)<br><b>คำตอบ:</b> visited</div>
  </div>
  <div class="dialogue-wrap">
    <div class="dialogue-title">🔍 ตัวอย่างที่ 2: ใช้ Checklist 3 ขั้นตอน</div>
    <div class="bubble left" style="max-width:100%;"><b>โจทย์:</b> Look! They ___ (play) football now.</div>
    <div class="bubble right" style="max-width:100%;background:#D9F7EC;"><b>ขั้นที่ 1:</b> หาคำสัญญาณ → "Look!" และ "now"<br><b>ขั้นที่ 2:</b> จับคู่กับ Tense → Present Continuous<br><b>ขั้นที่ 3:</b> เช็กประธาน They (พหูพจน์ ใช้ are)<br><b>คำตอบ:</b> are playing</div>
  </div>
</div>`;
}

/* ---------- SECTION 10: COMMON MISTAKES ---------- */
function s10() {
  const mistakes = [
    ['I go to Chiang Mai yesterday.', 'มีคำสัญญาณ yesterday ต้องใช้ Past Simple ไม่ใช่ Present Simple', 'I went to Chiang Mai yesterday.'],
    ['She is play football now.', 'Present Continuous ต้องเติม -ing ที่กริยา', 'She is playing football now.'],
    ['I will going to study tonight.', 'ห้ามใช้ will และ going to ปนกันในประโยคเดียว', 'I am going to study tonight.'],
    ['He don\'t like coffee.', 'ประธาน He เป็นเอกพจน์ ต้องใช้ doesn\'t ไม่ใช่ don\'t', 'He doesn\'t like coffee.'],
    ['Who did break the window?', 'Who เป็นประธานเอง ห้ามใช้ did ซ้ำกับกริยารูปอดีต', 'Who broke the window?'],
    ['She sing very good.', 'ต้องใช้ adverb ขยายกริยา sing และใช้ well ไม่ใช่ good', 'She sings very well.'],
  ];
  const cards = mistakes.map((m) => `<div class="mistake-card">
    <div class="wrong">❌ ${esc(m[0])}</div>
    <div class="why">🤔 ${esc(m[1])}</div>
    <div class="right">✅ ${esc(m[2])}</div>
  </div>`).join('');
  return `<div class="sheet" id="s10">
  ${banner('sb-c3', '⚠️', 'ข้อผิดพลาดที่พบบ่อยข้ามทุก Tense', 'Common Cross-Tense Mistakes', 'ส่วนที่ 10')}
  ${cards}
</div>`;
}

/* ---------- SECTION 11: EXAM TIPS ---------- */
function s11() {
  const tips = [
    'ใช้ Checklist 3 ขั้นตอนทุกครั้ง: หาคำสัญญาณ → จับคู่ Tense → เช็กประธาน',
    'จำคำสัญญาณของแต่ละ Tense ให้แม่น เพราะเป็นกุญแจสำคัญที่สุดในการเลือก Tense',
    'ระวังข้อที่ผสมหลาย Tense ในย่อหน้าเดียว ให้แยกแต่ละประโยคออกจากกันก่อนตอบ',
    'ทบทวน Parts of Speech 8 ชนิดให้แม่น เพราะมักออกเป็นข้อสอบแยกต่างหาก',
    'ฝึกทำโจทย์ผสม Tense บ่อย ๆ เพื่อความคุ้นเคยก่อนเข้าสู่บทที่ 15 (Entrance Exam)',
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
    <div class="mindmap-center">Grammar Summary</div>
    <div class="mindmap-branches">
      <div class="mindmap-branch mb-a"><span class="bt">🔤 Parts of Speech</span>Noun, Verb, Adjective, Adverb + อีก 4 ชนิด</div>
      <div class="mindmap-branch mb-b"><span class="bt">📅 Present Simple/Continuous</span>นิสัย/ความจริง vs กำลังทำ</div>
      <div class="mindmap-branch mb-c"><span class="bt">⏮️ Past Simple</span>จบไปแล้วในอดีต</div>
      <div class="mindmap-branch mb-d"><span class="bt">🔮 Future (will/going to)</span>ตัดสินใจ/สัญญา vs แผนที่วางไว้</div>
      <div class="mindmap-branch mb-e"><span class="bt">❓ WH-Questions</span>What/Where/When/Who/Why/How/Which/Whose</div>
      <div class="mindmap-branch mb-f"><span class="bt">✅ Checklist 3 ขั้น</span>คำสัญญาณ → จับคู่ Tense → เช็กประธาน</div>
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
    <div class="cheat-box"><h4>5 Tense หลัก</h4>
      <table><tr><th>Tense</th><th>คำสัญญาณ</th></tr>
      <tr><td>Present Simple</td><td>always, every day</td></tr>
      <tr><td>Present Continuous</td><td>now, Look!</td></tr>
      <tr><td>Past Simple</td><td>yesterday, ...ago</td></tr>
      <tr><td>Future</td><td>tomorrow, soon</td></tr></table></div>
    <div class="cheat-box"><h4>8 ชนิดของคำ</h4>
      <ul><li>Noun, Pronoun, Verb, Adjective</li><li>Adverb, Preposition, Conjunction, Interjection</li></ul></div>
    <div class="cheat-box"><h4>8 คำ WH-</h4>
      <ul><li>What, Where, When, Who</li><li>Why, How, Which, Whose</li></ul></div>
    <div class="cheat-box"><h4>Checklist 3 ขั้น</h4>
      <ul><li>1. หาคำสัญญาณเวลา</li><li>2. จับคู่กับ Tense</li><li>3. เช็กประธาน</li></ul></div>
  </div>
  <div class="tip-card" style="margin-top:14px;">📌 พกหน้านี้ติดตัวไว้ อ่านทบทวน 5 นาทีก่อนสอบ ครบทุก Tense ในบทนี้!</div>
</div>`;
}

/* ---------- SECTION 17: TEACHER'S NOTES ---------- */
function s17() {
  return `<div class="sheet" id="s17">
  ${banner('sb-teacher', '🍎', "มุมคุณครู", "Teacher's Notes", 'ส่วนที่ 17')}
  <div class="teacher-note-box"><h4>🎯 แนวคิดการสอน</h4><ul>
    <li>ใช้บทนี้เป็นการทบทวนแบบรวบยอด ไม่ใช่การสอนเนื้อหาใหม่ เน้นการเชื่อมโยงความรู้เก่า</li>
    <li>ให้นักเรียนฝึกใช้ Checklist 3 ขั้นตอนซ้ำ ๆ จนกลายเป็นความเคยชิน</li>
    <li>เน้นย้ำว่าคำสัญญาณเวลาคือกุญแจสำคัญที่สุดในการเลือก Tense ให้ถูกต้อง</li>
  </ul></div>
  <div class="teacher-note-box"><h4>🎲 กิจกรรมในห้องเรียน</h4><ul>
    <li><b>Tense Relay Race</b> — แบ่งกลุ่มแข่งกันเติม Tense ให้ถูกต้องในเวลาจำกัด ทีมไหนถูกมากที่สุดชนะ</li>
    <li><b>Signal Word Sort</b> — แจกบัตรคำสัญญาณเวลา ให้นักเรียนจัดกลุ่มตาม Tense ที่ตรงกัน</li>
    <li><b>Parts of Speech Charades</b> — นักเรียนแสดงท่าทางแทนชนิดของคำ ให้เพื่อนทาย</li>
    <li><b>Grand Review Quiz Bowl</b> — จัดแข่งตอบคำถามรวมทุกบทที่เรียนมาแบบเกมโชว์</li>
  </ul></div>
  <div class="teacher-note-box"><h4>📝 ข้อเสนอแนะการประเมินผล</h4><ul>
    <li>ใช้ใบงาน (ส่วนที่ 13) เป็นแบบฝึกหัดในชั้นเรียน และแบบทดสอบ 50 ข้อ (ส่วนที่ 14) เป็นการบ้าน/สอบท้ายบท</li>
    <li>ใช้ผลจากบทนี้ประเมินว่านักเรียนคนไหนต้องกลับไปทบทวนบทที่ 5-10 เป็นพิเศษก่อนเข้าสู่บทที่ 15</li>
  </ul></div>
</div>`;
}

/* ---------- SECTION 18: HOMEWORK ---------- */
function s18() {
  const hw = [
    'ทำตารางสรุปคำสัญญาณเวลาของทุก Tense ด้วยลายมือตัวเอง แล้วติดไว้ที่โต๊ะเรียน',
    'เขียนย่อหน้าสั้น 5 ประโยคเล่าเรื่องราวในชีวิตประจำวัน โดยใช้ให้ครบทั้ง 5 Tense ที่เรียนมา',
    'ทบทวนแบบฝึกหัดของบทที่ 6-10 อีกครั้ง แล้วจดบันทึกจุดที่ยังไม่แม่น',
    'ฝึกแต่งประโยคคำถาม Wh- ผสมกับ Tense ต่าง ๆ อย่างน้อย 5 ประโยค'
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
    <div class="quote">"ทบทวนวันนี้ เพื่อมั่นใจในวันสอบ" 🌟</div>
    <div class="sub">บทนี้คือการรวบรวมทุกอย่างที่นักเรียนเรียนมาตลอดหลายบท ถ้าวันนี้ทบทวนได้ครบและเข้าใจแน่นแล้ว นักเรียนก็พร้อมมากสำหรับบทสุดท้ายคือ Entrance Exam อย่ากังวลไป เพราะทุกอย่างที่เรียนมาอยู่ในตัวนักเรียนแล้ว แค่ทบทวนให้แน่นขึ้นอีกนิด 💙</div>
  </div>
</div>`;
}

/* ---------- SECTION 20: TEACHER SUNEE'S SUMMARY ---------- */
function s20() {
  const lines = [
    'บทนี้เป็นบทสรุปรวมแกรมม่าตั้งแต่บทที่ 5-10 ค่ะ ทั้ง Parts of Speech และ 5 Tense หลัก',
    'Present Simple ใช้กับความจริงทั่วไป/นิสัย ส่วน Present Continuous ใช้กับสิ่งที่กำลังทำอยู่ตอนนี้',
    'Past Simple ใช้กับเหตุการณ์ที่จบไปแล้วในอดีต มีเวลาชัดเจน',
    'Future มี 2 แบบ: will (ตัดสินใจทันที/สัญญา) และ be going to (แผนที่วางไว้แล้ว)',
    'WH-Questions มี 8 คำหลัก แต่ละคำถามหาข้อมูลคนละแบบ',
    'ใช้ Checklist 3 ขั้นตอนเสมอ: หาคำสัญญาณ → จับคู่ Tense → เช็กประธาน',
    'สุดท้าย ฝึกทำแบบฝึกหัดและแบบทดสอบให้ครบ แล้วนักเรียนจะพร้อมสำหรับบทสุดท้ายแน่นอนค่ะ',
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
<title>หนังสือเรียน: Grammar Summary — ม.3</title>
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
