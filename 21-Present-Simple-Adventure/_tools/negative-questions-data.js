// Present Simple Adventure — Chapter 2: do/does, Affirmative (recap),
// Negative & Yes/No Questions. Data for THIS chapter only (matches this
// project's per-chapter data-file convention, e.g. Chapter 1's
// subject-verb-affirmative-data.js). Chapter 3 (WH Questions) will get its
// own data file when built — not part of this request.
//
// GRAMMAR_POINTS drives the Learn screen. EXAMPLES is the one shared bank
// reused by Picture Examples, Mini Practice, Game 1, Game 2, Game 3 and
// Boss Quiz — every entry's `blank` is a literal substring of `en`, so
// en.replace(blank, distractor) always produces a valid alternate
// sentence. The negative/yes-no examples are reused verbatim from the
// original single-module build (already-tested content); 4 new
// affirmative recap examples were added using verbs not used in Chapter 1.

var GRAMMAR_POINTS = [
  {
    id: 'do-does', title: 'do / does', emoji: '❓',
    en: 'Do and does help make questions and negatives. Use does for he/she/it, do for the rest.',
    th: 'do/does ช่วยตั้งคำถามและปฏิเสธ',
    example: { en: 'Do you like tea?', emoji: '🍵', th: 'คุณชอบชาไหม' }
  },
  {
    id: 'affirmative-recap', title: 'Affirmative (recap)', emoji: '✅',
    en: 'Affirmative sentences are simple facts: Subject + Verb (+s/+es for he/she/it).',
    th: 'ประโยคบอกเล่า: Subject + Verb (+s/+es ถ้าเป็น he/she/it)',
    example: { en: 'She likes coffee.', emoji: '☕', th: 'เธอชอบกาแฟ' }
  },
  {
    id: 'negative', title: "don't / doesn't (Negative)", emoji: '🚫',
    en: "Add don't or doesn't before the verb to make it negative. Use doesn't for he/she/it.",
    th: "ปฏิเสธ: don't/doesn't + กริยารูปเดิม",
    example: { en: "She doesn't eat meat.", emoji: '🍖', th: 'เธอไม่กินเนื้อสัตว์' }
  },
  {
    id: 'yesno', title: 'Yes/No Questions', emoji: '🙋',
    en: 'Start with Do or Does, then the subject, then the verb.',
    th: 'คำถาม Yes/No ขึ้นต้นด้วย Do/Does',
    example: { en: 'Does he play games? Yes, he does.', emoji: '🎮', th: 'เขาเล่นเกมไหม ใช่ เขาเล่น' }
  }
];

var EXAMPLES = [
  // Affirmative recap (4 — new verbs, not reused from Chapter 1)
  { id: 'c2ex01', en: 'I like tea.', pron: 'ไอ ไลค์ ที', th: 'ฉันชอบชา', emoji: '🍵', type: 'affirmative', blank: 'like', distractors: ['likes', 'liking', 'liked'], explain: "'I' ใช้กริยารูปเดิม ไม่เติม -s" },
  { id: 'c2ex02', en: 'She likes coffee.', pron: 'ชี ไลค์ส คอฟฟี่', th: 'เธอชอบกาแฟ', emoji: '☕', type: 'affirmative', blank: 'likes', distractors: ['like', 'liking', 'liked'], explain: "'She' เติม -s ที่กริยา" },
  { id: 'c2ex03', en: 'They study English every day.', pron: 'เธ สตัดดี้ อิงลิช เอฟรี เดย์', th: 'พวกเขาเรียนภาษาอังกฤษทุกวัน', emoji: '📖', type: 'affirmative', blank: 'study', distractors: ['studies', 'studying', 'studied'], explain: "'They' ใช้กริยารูปเดิม ไม่เติม -s" },
  { id: 'c2ex04', en: 'He swims every weekend.', pron: 'ฮี สวิมส์ เอฟรี วีคเอนด์', th: 'เขาว่ายน้ำทุกสุดสัปดาห์', emoji: '🏊', type: 'affirmative', blank: 'swims', distractors: ['swim', 'swimming', 'swam'], explain: "'He' เติม -s ที่กริยา" },

  // Negative (8 — reused verbatim from the original single-module build)
  { id: 'c2ex05', en: "I don't like coffee.", pron: 'ไอ โด้นท์ ไลค์ คอฟฟี่', th: 'ฉันไม่ชอบกาแฟ', emoji: '☕', type: 'negative', blank: "don't like", distractors: ["doesn't like", 'not like', "isn't like"], explain: "'I' ใช้ don't (ไม่ใช่ doesn't)" },
  { id: 'c2ex06', en: "She doesn't eat meat.", pron: 'ชี ดัซเซ่นท์ อีท มีท', th: 'เธอไม่กินเนื้อสัตว์', emoji: '🍖', type: 'negative', blank: "doesn't eat", distractors: ["don't eat", 'not eats', "isn't eat"], explain: "'She' ใช้ doesn't + กริยารูปเดิม" },
  { id: 'c2ex07', en: "They don't play video games at school.", pron: 'เธ โด้นท์ เพลย์ วีดีโอ เกมส์ แอ็ท สคูล', th: 'พวกเขาไม่เล่นวิดีโอเกมที่โรงเรียน', emoji: '🎮', type: 'negative', blank: "don't play", distractors: ["doesn't play", 'not play', "isn't play"], explain: "'They' ใช้ don't" },
  { id: 'c2ex08', en: "He doesn't drink milk.", pron: 'ฮี ดัซเซ่นท์ ดริงค์ มิลค์', th: 'เขาไม่ดื่มนม', emoji: '🥛', type: 'negative', blank: "doesn't drink", distractors: ["don't drink", 'not drinks', "isn't drink"], explain: "'He' ใช้ doesn't + กริยารูปเดิม" },
  { id: 'c2ex09', en: "We don't watch TV in the morning.", pron: 'วี โด้นท์ วอช ทีวี อิน เธอะ มอร์นิ่ง', th: 'เราไม่ดูทีวีตอนเช้า', emoji: '🌇', type: 'negative', blank: "don't watch", distractors: ["doesn't watch", 'not watch', "isn't watch"], explain: "'We' ใช้ don't" },
  { id: 'c2ex10', en: "Connie doesn't sleep late.", pron: 'คอนนี่ ดัซเซ่นท์ สลีพ เลท', th: 'คอนนี่ไม่นอนดึก', emoji: '😴', type: 'negative', blank: "doesn't sleep", distractors: ["don't sleep", 'not sleeps', "isn't sleep"], explain: "ชื่อเฉพาะเอกพจน์ ใช้ doesn't" },
  { id: 'c2ex11', en: "You don't clean your room on Sunday.", pron: 'ยู โด้นท์ คลีน ยัวร์ รูม ออน ซันเดย์', th: 'คุณไม่ทำความสะอาดห้องในวันอาทิตย์', emoji: '🧹', type: 'negative', blank: "don't clean", distractors: ["doesn't clean", 'not clean', "isn't clean"], explain: "'You' ใช้ don't" },
  { id: 'c2ex12', en: "It doesn't rain in the desert.", pron: 'อิท ดัซเซ่นท์ เรน อิน เธอะ เดสเสิร์ท', th: 'ฝนไม่ตกในทะเลทราย', emoji: '🏜️', type: 'negative', blank: "doesn't rain", distractors: ["don't rain", 'not rains', "isn't rain"], explain: "'It' ใช้ doesn't + กริยารูปเดิม" },

  // Yes/No Questions (6 — reused verbatim from the original single-module build)
  { id: 'c2ex13', en: 'Do you like tea?', pron: 'ดู ยู ไลค์ ที', th: 'คุณชอบชาไหม', emoji: '🍵', type: 'yesno', blank: 'Do you like', distractors: ['Does you like', 'Are you like', 'You do like'], explain: "'you' ใช้ Do ขึ้นต้นประโยคคำถาม" },
  { id: 'c2ex14', en: 'Does she play the piano?', pron: 'ดัส ชี เพลย์ เธอะ เพียโน่', th: 'เธอเล่นเปียโนไหม', emoji: '🎹', type: 'yesno', blank: 'Does she play', distractors: ['Do she play', 'Is she play', 'Does she plays'], explain: "'she' ใช้ Does + กริยารูปเดิม (ไม่เติม s ซ้ำ)" },
  { id: 'c2ex15', en: 'Do they go to school by bike?', pron: 'ดู เธ โก ทู สคูล บาย ไบค์', th: 'พวกเขาไปโรงเรียนโดยจักรยานไหม', emoji: '🚲', type: 'yesno', blank: 'Do they go', distractors: ['Does they go', 'Are they go', 'Do they goes'], explain: "'they' ใช้ Do ขึ้นต้นประโยคคำถาม" },
  { id: 'c2ex16', en: 'Does he study English every day?', pron: 'ดัส ฮี สตัดดี้ อิงลิช เอฟรี เดย์', th: 'เขาเรียนภาษาอังกฤษทุกวันไหม', emoji: '📖', type: 'yesno', blank: 'Does he study', distractors: ['Do he study', 'Is he study', 'Does he studies'], explain: "'he' ใช้ Does + กริยารูปเดิม" },
  { id: 'c2ex17', en: 'Does Connie like apples?', pron: 'ดัส คอนนี่ ไลค์ แอปเปิ้ลส์', th: 'คอนนี่ชอบแอปเปิลไหม', emoji: '🍎', type: 'yesno', blank: 'Does Connie like', distractors: ['Do Connie like', 'Is Connie like', 'Does Connie likes'], explain: 'ชื่อเฉพาะเอกพจน์ ใช้ Does' },
  { id: 'c2ex18', en: 'Do we need an umbrella?', pron: 'ดู วี นีด แอน อัมเบรลล่า', th: 'เราต้องใช้ร่มไหม', emoji: '☂️', type: 'yesno', blank: 'Do we need', distractors: ['Does we need', 'Are we need', 'Do we needs'], explain: "'we' ใช้ Do ขึ้นต้นประโยคคำถาม" }
];

// Pattern-contrast memory trick (Memory Trick screen) — shows the same verb
// across all 3 sentence types taught in this chapter, side by side.
var PATTERN_TRICKS = [
  { emoji: '✅', label: 'Affirmative', pattern: 'Subject + Verb', example: 'She likes tea.' },
  { emoji: '🚫', label: 'Negative', pattern: "Subject + don't/doesn't + Verb", example: "She doesn't like tea." },
  { emoji: '❓', label: 'Yes/No Question', pattern: 'Do/Does + Subject + Verb?', example: 'Does she like tea?' }
];

// Game 5 — Connie's Daily Routine: same "day in the life" narrative as
// Chapter 1, but the 6 steps now rotate across affirmative/negative/yes-no
// to exercise every grammar point taught in this chapter.
var CONNIE_ROUTINE = [
  { time: '6:00 AM', emoji: '⏰', en: 'Connie wakes up early.', th: 'คอนนี่ตื่นนอนแต่เช้า', blank: 'wakes up', distractors: ['wake up', 'waking up'] },
  { time: '7:00 AM', emoji: '🍳', en: 'Does Connie eat breakfast?', th: 'คอนนี่กินอาหารเช้าไหม', blank: 'Does Connie eat', distractors: ['Do Connie eat', 'Is Connie eat'] },
  { time: '8:00 AM', emoji: '🚌', en: "Connie doesn't miss the school bus.", th: 'คอนนี่ไม่พลาดรถโรงเรียน', blank: "doesn't miss", distractors: ["don't miss", 'not miss'] },
  { time: '3:00 PM', emoji: '📝', en: 'Connie finishes her homework.', th: 'คอนนี่ทำการบ้านเสร็จ', blank: 'finishes', distractors: ['finish', 'finishing'] },
  { time: '7:00 PM', emoji: '🍽️', en: 'Does Connie eat dinner with her family?', th: 'คอนนี่กินอาหารเย็นกับครอบครัวไหม', blank: 'Does Connie eat', distractors: ['Do Connie eat', 'Is Connie eat'] },
  { time: '9:00 PM', emoji: '🛏️', en: "Connie doesn't stay up late.", th: 'คอนนี่ไม่นอนดึก', blank: "doesn't stay up", distractors: ["don't stay up", 'not stay up'] }
];
