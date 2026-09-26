/*
 * Generator for the 8-topic Grammar Quiz Pack (Verb to Be, Verb to Have, ...).
 * Reads a topic's data JSON and emits 4 self-contained HTML files:
 *   lesson.html, worksheet.html, quiz.html, answer-key.html
 * into that topic's folder, all sharing shared.css.js so every topic looks
 * identical (banner, cute fonts, colorful cards, emoji illustrations).
 *
 * Usage: node generate.js <path-to-data.json>
 */
const fs = require('fs');
const path = require('path');

const CSS = require('./shared.css.js');

const dataPath = process.argv[2];
if (!dataPath) {
  console.error('Usage: node generate.js <path-to-data.json>');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const outDir = path.join(path.dirname(dataPath), '..', data.folder);

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700;800&family=Mali:wght@600;700&display=swap" rel="stylesheet">`;

const STARS = { 1: '⭐ ง่าย', 2: '⭐⭐ ปานกลาง', 3: '⭐⭐⭐ ยาก' };
const COLOR_CLASSES = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function page(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>${esc(title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${FONT_LINK}
<style>${CSS}</style>
</head>
<body>
${bodyHtml}
</body>
</html>
`;
}

function infoRow(maxScore) {
  return `<div class="info-row">
    <span>ชื่อ-นามสกุล <span class="fill-line" style="min-width:220px;">&nbsp;</span></span>
    <span>ชั้น <span class="fill-line" style="min-width:80px;">&nbsp;</span></span>
    <span>เลขที่ <span class="fill-line" style="min-width:60px;">&nbsp;</span></span>
    <span>วันที่ <span class="fill-line" style="min-width:100px;">&nbsp;</span></span>
    <span>คะแนน <span class="fill-line" style="min-width:70px;">&nbsp;</span> / ${maxScore}</span>
  </div>`;
}

/* ---------------- LESSON ---------------- */
function buildLesson() {
  const objs = data.objectives.map((o) => `<li>${esc(o)}</li>`).join('\n');
  const explain = data.explanation.map((block) => `
    <div class="explain-block">
      <h2>${esc(block.heading)}</h2>
      ${block.html}
    </div>`).join('\n');
  const tips = data.tips.map((t) => `<div class="tip-card">💡 ${esc(t)}</div>`).join('\n');

  let summary = '';
  if (data.summaryTable) {
    const head = data.summaryTable.headers.map((h) => `<th>${esc(h)}</th>`).join('');
    const rows = data.summaryTable.rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('\n');
    summary = `<div class="explain-block">
      <h2>📊 ตารางสรุป</h2>
      <table><tr>${head}</tr>${rows}</table>
    </div>`;
  }

  const body = `<div class="sheet">
  <div class="banner">
    <h1>${data.emojiTitle} บทเรียน: ${esc(data.titleThai)}</h1>
    <div class="sub">English Grammar Quiz Pack · เตรียมสอบเข้า ม.4</div>
  </div>

  <div class="explain-block">
    <h2>🎯 จุดประสงค์การเรียนรู้</h2>
    <ul class="obj-list">${objs}</ul>
  </div>

  ${explain}
  ${summary}

  <div class="explain-block">
    <h2>🧠 เทคนิคการจำ</h2>
    ${tips}
  </div>

  <div class="footer-note">English Grammar Quiz Pack · ${esc(data.titleShort)}</div>
</div>`;
  fs.writeFileSync(path.join(outDir, 'lesson.html'), page(`บทเรียน: ${data.titleThai}`, body), 'utf8');
}

/* ---------------- WORKSHEET ---------------- */
function buildWorksheet() {
  let running = 0;
  const parts = data.worksheet.parts.map((part) => {
    const items = part.items.map((item) => {
      running++;
      if (item.includes('___')) {
        return `<li>${item.replace('___', '<span class="blank"></span>')}</li>`;
      }
      return `<li>${item} &rarr; <span class="blank"></span></li>`;
    }).join('\n');
    return `<h2 class="part-title">${esc(part.title)}</h2>
    <p class="part-desc">${esc(part.instructions)}</p>
    <ol class="qlist two-col">${items}</ol>`;
  }).join('\n');

  const total = data.worksheet.parts.reduce((s, p) => s + p.items.length, 0);

  const body = `<div class="sheet">
  <div class="banner">
    <h1>✏️ ใบงานฝึกหัด: ${esc(data.titleThai)}</h1>
    <div class="sub">แบบฝึกหัดเติมคำ — English Grammar Quiz Pack</div>
  </div>
  ${infoRow(total)}
  <div class="instructions"><b>คำสั่ง:</b> เติมคำในช่องว่างให้ถูกต้องตามหลักไวยากรณ์ที่เรียนมา</div>
  ${parts}
  <div class="footer-note">English Grammar Quiz Pack · ${esc(data.titleShort)} — ใบงานฝึกหัด</div>
</div>`;
  fs.writeFileSync(path.join(outDir, 'worksheet.html'), page(`ใบงาน: ${data.titleThai}`, body), 'utf8');
}

/* ---------------- QUIZ ---------------- */
function buildQuiz() {
  const cards = data.quiz.map((q, i) => {
    const cls = COLOR_CLASSES[i % COLOR_CLASSES.length];
    const letters = ['A', 'B', 'C', 'D'];
    const choices = q.choices.map((c, ci) => `<div class="choice">${letters[ci]}) ${esc(c)}</div>`).join('\n');
    return `<div class="card ${cls}">
    <div class="qnum">ข้อ ${i + 1}</div>
    <div class="stars">${STARS[q.difficulty]}</div>
    <div class="card-body">
      <div class="emoji-badge">${q.emoji}</div>
      <div class="qtext">
        ${q.q}
        <div class="rule-tag">${esc(q.tag)}</div>
      </div>
    </div>
    <div class="choice-grid">${choices}</div>
    <div class="write-row">
      <span>คำตอบ:</span>
      <div class="letters"><div class="letter-box">A</div><div class="letter-box">B</div><div class="letter-box">C</div><div class="letter-box">D</div></div>
      <div class="write-line"></div>
    </div>
  </div>`;
  }).join('\n');

  const body = `<div class="sheet">
  <div class="banner">
    <h1>🌈✏️ แบบทดสอบสนุก: ${esc(data.titleThai)} 🎉</h1>
    <div class="sub">ปรนัย 4 ตัวเลือก ${data.quiz.length} ข้อ พร้อมภาพช่วยจำ — English Grammar Quiz Pack</div>
  </div>
  ${infoRow(data.quiz.length)}
  <div class="instructions"><b>คำสั่ง:</b> ดูภาพและอ่านโจทย์แต่ละข้อ แล้วเลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียว โดยวงกลมตัวอักษร (A/B/C/D) ในกรอบ หรือเขียนคำตอบลงในช่องว่างท้ายข้อ 🖍️ ข้อสอบเรียงจากง่ายไปยาก</div>
  ${cards}
  <div class="score-box">🌟 คะแนนรวม: __________ / ${data.quiz.length} 🌟</div>
  <div class="footer-note">English Grammar Quiz Pack · ${esc(data.titleShort)} — แบบทดสอบ ${data.quiz.length} ข้อ</div>
</div>`;
  fs.writeFileSync(path.join(outDir, 'quiz.html'), page(`แบบทดสอบ: ${data.titleThai}`, body), 'utf8');
}

/* ---------------- ANSWER KEY ---------------- */
function buildAnswerKey() {
  let wsRows = '';
  let wsNum = 0;
  data.worksheet.parts.forEach((part) => {
    part.items.forEach((item, idx) => {
      wsNum++;
      wsRows += `<tr><td>${wsNum}</td><td>${esc(part.answers[idx])}</td><td>${esc(part.reasons[idx])}</td></tr>\n`;
    });
  });

  const letters = ['A', 'B', 'C', 'D'];
  const quizRows = data.quiz.map((q, i) => {
    return `<tr><td>${i + 1}</td><td class="emoji-cell">${q.emoji}</td><td>${letters[q.answer]}) ${esc(q.choices[q.answer])}</td><td>${esc(q.explain)}</td></tr>`;
  }).join('\n');

  const body = `<div class="sheet">
  <div class="teacher-flag">สำหรับครูเท่านั้น — ตัดหน้านี้ออกก่อนแจกนักเรียน</div>
  <div class="banner teacher">
    <h1>✅ เฉลย: ${esc(data.titleThai)}</h1>
    <div class="sub">เฉลยใบงานฝึกหัด + แบบทดสอบ พร้อมเหตุผลย่อ</div>
  </div>

  <h2 class="part-title">เฉลยใบงานฝึกหัด</h2>
  <table class="answer-table"><tr><th>ข้อ</th><th>คำตอบ</th><th>เหตุผลย่อ</th></tr>${wsRows}</table>

  <h2 class="part-title">เฉลยแบบทดสอบ (${data.quiz.length} ข้อ)</h2>
  <table class="answer-table"><tr><th>ข้อ</th><th></th><th>คำตอบ</th><th>เหตุผล/คำอธิบาย</th></tr>${quizRows}</table>

  <div class="footer-note">English Grammar Quiz Pack · ${esc(data.titleShort)} — เฉลย (สำหรับครู)</div>
</div>`;
  fs.writeFileSync(path.join(outDir, 'answer-key.html'), page(`เฉลย: ${data.titleThai}`, body), 'utf8');
}

fs.mkdirSync(outDir, { recursive: true });
buildLesson();
buildWorksheet();
buildQuiz();
buildAnswerKey();

console.log(`Generated 4 files for "${data.folder}":`);
console.log(' -', path.join(outDir, 'lesson.html'));
console.log(' -', path.join(outDir, 'worksheet.html'));
console.log(' -', path.join(outDir, 'quiz.html'));
console.log(' -', path.join(outDir, 'answer-key.html'));
console.log(`Quiz questions: ${data.quiz.length}, Worksheet items: ${data.worksheet.parts.reduce((s,p)=>s+p.items.length,0)}`);
