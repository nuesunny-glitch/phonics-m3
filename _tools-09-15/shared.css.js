// Shared CSS for all 8 grammar-topic mini-courses. Keep in one place so every
// topic (lesson / worksheet / quiz / answer-key) renders identically.
module.exports = `
:root {
  --c1: #FF5D5D; --c1-light: #FFE1E1;
  --c2: #FFA800; --c2-light: #FFF1D6;
  --c3: #2F9BFF; --c3-light: #DCEEFF;
  --c4: #21C38D; --c4-light: #D9F7EC;
  --c5: #9B5DE5; --c5-light: #F1E4FB;
  --c6: #FF5FA2; --c6-light: #FFE3F0;
}
* { box-sizing: border-box; }
body {
  font-family: 'Kanit', 'Sarabun', 'Tahoma', sans-serif;
  color: #2a2a3a;
  margin: 0;
  padding: 0;
  background: #eef1f8;
  font-size: 17px;
}
.sheet {
  max-width: 210mm;
  margin: 16px auto;
  background: #fff;
  padding: 12mm 14mm;
  box-shadow: 0 2px 14px rgba(0,0,0,0.12);
}
.sheet.answer-sheet { page-break-before: always; }
.banner {
  background: linear-gradient(90deg, #FF5D5D, #FFA800, #21C38D, #2F9BFF, #9B5DE5, #FF5FA2);
  border-radius: 18px;
  padding: 16px 22px;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0,0,0,0.25);
  margin-bottom: 14px;
}
.banner.teacher { background: linear-gradient(90deg,#b3261e,#ff5d5d); }
.banner h1 {
  font-family: 'Mali', 'Kanit', sans-serif;
  font-size: 25px;
  margin: 0 0 4px;
}
.banner .sub { font-size: 14px; font-weight: 500; opacity: 0.97; }
.badge-pill {
  display: inline-block;
  background: #2952e3;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
}
.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 26px;
  font-size: 14.5px;
  font-weight: 500;
  margin-bottom: 16px;
  padding: 10px 16px;
  background: #f5f7fd;
  border: 2px dashed #c7cfe8;
  border-radius: 14px;
}
.fill-line { display: inline-block; min-width: 130px; border-bottom: 1.6px dotted #7a84a3; }
.instructions {
  background: #FFF8E1;
  border: 2px solid #FFD54F;
  border-radius: 14px;
  padding: 10px 16px;
  font-size: 14px;
  margin-bottom: 18px;
  line-height: 1.6;
}
.instructions b { color: #92660a; }

/* Quiz / question cards */
.card {
  position: relative;
  border: 3px solid var(--accent);
  border-radius: 20px;
  padding: 18px 18px 14px;
  margin: 26px 0 22px;
  break-inside: avoid;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}
.card.c1 { --accent: var(--c1); --light: var(--c1-light); }
.card.c2 { --accent: var(--c2); --light: var(--c2-light); }
.card.c3 { --accent: var(--c3); --light: var(--c3-light); }
.card.c4 { --accent: var(--c4); --light: var(--c4-light); }
.card.c5 { --accent: var(--c5); --light: var(--c5-light); }
.card.c6 { --accent: var(--c6); --light: var(--c6-light); }
.qnum {
  position: absolute; top: -16px; left: 18px;
  background: var(--accent); color: #fff; font-weight: 800; font-size: 15px;
  padding: 4px 14px; border-radius: 999px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
.stars {
  position: absolute; top: -16px; right: 18px;
  background: #fff; border: 2px solid var(--accent); color: var(--accent);
  font-size: 13px; font-weight: 700; padding: 3px 10px; border-radius: 999px;
}
.card-body { display: flex; gap: 16px; align-items: flex-start; margin-top: 10px; }
.emoji-badge {
  font-size: 42px; line-height: 1;
  background: var(--light); border: 3px dashed var(--accent); border-radius: 50%;
  width: 78px; height: 78px; min-width: 78px;
  display: flex; align-items: center; justify-content: center;
}
.qtext { font-size: 19px; font-weight: 600; line-height: 1.45; padding-top: 8px; }
.rule-tag {
  display: inline-block; font-size: 12px; font-weight: 600; color: var(--accent);
  background: var(--light); border-radius: 8px; padding: 2px 8px; margin-top: 4px;
}
.choice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px 12px; margin: 14px 0 12px; }
.choice { font-size: 17px; font-weight: 500; background: var(--light); border: 2px solid transparent; border-radius: 12px; padding: 9px 12px; }
.write-row { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #555; }
.write-row .letters { display: flex; gap: 8px; }
.write-row .letter-box {
  width: 30px; height: 30px; border: 2px solid var(--accent); border-radius: 8px;
  display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--accent);
}
.write-line { flex: 1; border-bottom: 2px dotted #9aa2bb; height: 24px; }
.score-box {
  margin-top: 26px; border: 3px dashed #2952e3; border-radius: 16px; padding: 14px 18px;
  font-size: 17px; font-weight: 700; text-align: center; color: #1e2b5c; background: #f5f7fd;
}
.footer-note { margin-top: 20px; font-size: 11.5px; color: #8891a8; text-align: center; }

/* Worksheet fill-in items */
.part-title {
  font-size: 15px; color: #fff; background: #2952e3; padding: 6px 12px; border-radius: 6px; margin: 22px 0 10px;
}
.part-desc { font-size: 12.5px; color: #55607a; margin: -4px 0 10px; }
ol.qlist { list-style: none; padding: 0; margin: 0; counter-reset: q; }
ol.qlist li { counter-increment: q; font-size: 15px; padding: 8px 0; border-bottom: 1px dashed #dde2ee; display: flex; align-items: baseline; gap: 8px; }
ol.qlist li::before { content: counter(q) "."; font-weight: 700; color: #2952e3; min-width: 24px; }
.blank { display: inline-block; min-width: 100px; border-bottom: 1.8px solid #333; margin: 0 4px; }
.two-col { columns: 2; column-gap: 28px; }
.two-col li { break-inside: avoid; }

/* Lesson page */
.obj-list { list-style: none; padding: 0; margin: 0; }
.obj-list li {
  background: #f5f7fd; border-left: 5px solid #2952e3; border-radius: 8px;
  padding: 8px 14px; margin-bottom: 8px; font-size: 15px;
}
.explain-block { margin-bottom: 22px; }
.explain-block h2 {
  font-family: 'Mali','Kanit',sans-serif; font-size: 19px; color: #1e2b5c;
  border-bottom: 3px solid #2952e3; padding-bottom: 4px; margin-bottom: 10px;
}
.explain-block table { width: 100%; border-collapse: collapse; font-size: 14px; margin: 10px 0; }
.explain-block th, .explain-block td { border: 1px solid #d8dce8; padding: 7px 10px; text-align: left; }
.explain-block th { background: #f3f5fb; }
.tip-card {
  background: #FFF8E1; border: 2px dashed #FFD54F; border-radius: 14px;
  padding: 10px 16px; margin-bottom: 10px; font-size: 14.5px;
}

/* Answer key */
.teacher-flag {
  display: inline-block; background: #b3261e; color: #fff; font-size: 12px; font-weight: 700;
  padding: 4px 12px; border-radius: 999px; margin-bottom: 10px;
}
.answer-table { width: 100%; border-collapse: collapse; font-size: 13.5px; margin-bottom: 16px; }
.answer-table th, .answer-table td { border: 1px solid #d8dce8; padding: 7px 10px; text-align: left; }
.answer-table th { background: #f3f5fb; }
.answer-table td.emoji-cell { font-size: 20px; text-align: center; }

@media print {
  body { background: #fff; }
  .sheet { margin: 0; box-shadow: none; padding: 8mm 12mm; }
}
@page { size: A4; margin: 8mm; }
`;
