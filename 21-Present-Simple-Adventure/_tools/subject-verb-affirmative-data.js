// Present Simple Adventure — Chapter 1: Subject, Verb & Affirmative
// Sentences. Data for THIS chapter only (matches this project's per-chapter
// data-file convention, e.g. 20-Conjunction-Adventure's and-but-or-data.js).
// Future chapters (Negative/do-does, Yes-No + WH Questions) will get their
// own data files when built — not part of this request.
//
// GRAMMAR_POINTS drives the Learn screen. EXAMPLES (the 12 affirmative
// sentences, unchanged from the original single-module build) is the one
// shared bank reused by Picture Examples, Mini Practice, Game 1, Game 2,
// Game 3 and Boss Quiz — every entry's `blank` is guaranteed to be a
// literal substring of `en`, so en.replace(blank, distractor) always
// produces a valid alternate sentence.

var GRAMMAR_POINTS = [
  {
    id: 'subject-verb', title: 'Subject + Verb', emoji: '🧍',
    en: 'The subject does the action. The verb is the action word.',
    th: 'ประธาน = ผู้ทำ, กริยา = การกระทำ',
    example: { en: 'She reads.', emoji: '📖', th: 'เธออ่านหนังสือ' }
  },
  {
    id: 'affirmative', title: 'Affirmative (+s / +es)', emoji: '➕',
    en: 'For he/she/it, add -s or -es to the verb. For I/you/we/they, use the base verb.',
    th: 'he/she/it เติม -s ส่วนที่เหลือใช้รูปเดิม',
    example: { en: 'He plays football.', emoji: '⚽', th: 'เขาเล่นฟุตบอล' }
  }
];

var EXAMPLES = [
  { id: 'ex01', en: "I wake up at 6 o'clock.", pron: "ไอ เวค อัพ แอ็ท ซิกซ์ โอ'คล็อก", th: 'ฉันตื่นนอนตอน 6 โมง', emoji: '⏰', type: 'affirmative', blank: 'wake up', distractors: ['wakes up', 'waking up', 'woke up'], explain: "Subject 'I' ใช้กริยารูปเดิม ไม่เติม -s" },
  { id: 'ex02', en: 'You brush your teeth every morning.', pron: 'ยู บรัช ยัวร์ ทีธ เอฟรี มอร์นิ่ง', th: 'คุณแปรงฟันทุกเช้า', emoji: '🪥', type: 'affirmative', blank: 'brush', distractors: ['brushes', 'brushing', 'brushed'], explain: "'You' ใช้กริยารูปเดิม ไม่เติม -s" },
  { id: 'ex03', en: 'We eat breakfast together.', pron: 'วี อีท เบรคฟาสท์ ทูเก็ตเธอร์', th: 'เรากินอาหารเช้าด้วยกัน', emoji: '🍳', type: 'affirmative', blank: 'eat', distractors: ['eats', 'eating', 'ate'], explain: "'We' ใช้กริยารูปเดิม ไม่เติม -s" },
  { id: 'ex04', en: 'They go to school by bus.', pron: 'เธ โก ทู สคูล บาย บัส', th: 'พวกเขาไปโรงเรียนโดยรถบัส', emoji: '🚌', type: 'affirmative', blank: 'go', distractors: ['goes', 'going', 'went'], explain: "'They' ใช้กริยารูปเดิม ไม่เติม -s" },
  { id: 'ex05', en: 'He wakes up early.', pron: 'ฮี เวคส์ อัพ เออลี่', th: 'เขาตื่นนอนแต่เช้า', emoji: '🌅', type: 'affirmative', blank: 'wakes up', distractors: ['wake up', 'waking up', 'woke up'], explain: "'He' เติม -s ที่กริยา" },
  { id: 'ex06', en: 'She brushes her hair.', pron: 'ชี บรัชเชส เฮอร์ แฮร์', th: 'เธอหวีผม', emoji: '💇', type: 'affirmative', blank: 'brushes', distractors: ['brush', 'brushing', 'brushed'], explain: "'She' เติม -es เพราะกริยาลงท้ายด้วย sh" },
  { id: 'ex07', en: 'It rains a lot in July.', pron: 'อิท เรนส์ อะ ลอท อิน จูไล', th: 'ฝนตกเยอะในเดือนกรกฎาคม', emoji: '🌧️', type: 'affirmative', blank: 'rains', distractors: ['rain', 'raining', 'rained'], explain: "'It' เติม -s ที่กริยา" },
  { id: 'ex08', en: 'Connie walks to school.', pron: 'คอนนี่ วอล์คส์ ทู สคูล', th: 'คอนนี่เดินไปโรงเรียน', emoji: '🦊', type: 'affirmative', blank: 'walks', distractors: ['walk', 'walking', 'walked'], explain: 'ชื่อเฉพาะเอกพจน์ (เหมือน he/she/it) เติม -s' },
  { id: 'ex09', en: 'I read books at night.', pron: 'ไอ รีด บุคส์ แอ็ท ไนท์', th: 'ฉันอ่านหนังสือตอนกลางคืน', emoji: '📚', type: 'affirmative', blank: 'read', distractors: ['reads', 'reading', 'readed'], explain: "'I' ใช้กริยารูปเดิม ไม่เติม -s" },
  { id: 'ex10', en: 'We play games on Sunday.', pron: 'วี เพลย์ เกมส์ ออน ซันเดย์', th: 'เราเล่นเกมในวันอาทิตย์', emoji: '🎲', type: 'affirmative', blank: 'play', distractors: ['plays', 'playing', 'played'], explain: "'We' ใช้กริยารูปเดิม ไม่เติม -s" },
  { id: 'ex11', en: 'She watches TV after dinner.', pron: 'ชี วอชเชส ทีวี อาฟเตอร์ ดินเนอร์', th: 'เธอดูทีวีหลังอาหารเย็น', emoji: '📺', type: 'affirmative', blank: 'watches', distractors: ['watch', 'watching', 'watched'], explain: "'She' เติม -es เพราะกริยาลงท้ายด้วย ch" },
  { id: 'ex12', en: 'He finishes his homework quickly.', pron: 'ฮี ฟินิชเชส ฮิส โฮมเวิร์ค ควิคลี่', th: 'เขาทำการบ้านเสร็จเร็ว', emoji: '📝', type: 'affirmative', blank: 'finishes', distractors: ['finish', 'finishing', 'finished'], explain: "'He' เติม -es เพราะกริยาลงท้ายด้วย sh" }
];

// Frequency-adverb "Habit" memory trick chips (Memory Trick screen).
var FREQUENCY_WORDS = [
  { en: 'Every day', emoji: '📅', example: 'I brush my teeth every day.' },
  { en: 'Usually', emoji: '🙂', example: 'She usually walks to school.' },
  { en: 'Always', emoji: '⭐', example: 'He always does his best.' },
  { en: 'Sometimes', emoji: '🤷', example: 'We sometimes play games.' },
  { en: 'Never', emoji: '🚫', example: "They never arrive late." }
];

// Game 5 — Connie's Daily Routine: a coherent 6-step "day in the life" of
// Connie (all affirmative sentences, a natural fit for Chapter 1).
var CONNIE_ROUTINE = [
  { time: '6:00 AM', emoji: '⏰', en: "Connie wakes up at 6 o'clock.", th: 'คอนนี่ตื่นนอนตอน 6 โมง', blank: 'wakes up', distractors: ['wake up', 'waking up'] },
  { time: '7:00 AM', emoji: '🍳', en: 'Connie eats breakfast.', th: 'คอนนี่กินอาหารเช้า', blank: 'eats', distractors: ['eat', 'eating'] },
  { time: '8:00 AM', emoji: '🎒', en: 'Connie goes to school.', th: 'คอนนี่ไปโรงเรียน', blank: 'goes', distractors: ['go', 'going'] },
  { time: '3:00 PM', emoji: '📝', en: 'Connie finishes her homework.', th: 'คอนนี่ทำการบ้านเสร็จ', blank: 'finishes', distractors: ['finish', 'finishing'] },
  { time: '7:00 PM', emoji: '🍽️', en: 'Connie eats dinner with her family.', th: 'คอนนี่กินอาหารเย็นกับครอบครัว', blank: 'eats', distractors: ['eat', 'eating'] },
  { time: '9:00 PM', emoji: '🛏️', en: 'Connie goes to bed early.', th: 'คอนนี่เข้านอนแต่หัวค่ำ', blank: 'goes', distractors: ['go', 'going'] }
];
