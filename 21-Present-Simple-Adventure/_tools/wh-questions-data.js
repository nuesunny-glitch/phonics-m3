// Present Simple Adventure — Chapter 3: WH Questions. Data for THIS
// chapter only (matches this project's per-chapter data-file convention).
// Teaches the 8 WH words (What/Where/When/Why/Who/Which/Whose/How) built
// on top of do/does question formation (already taught in Chapter 2).
//
// GRAMMAR_POINTS drives the Learn screen (Learning Objectives) — one card
// per WH word, each <=2 English sentences + a short Thai line + one
// do/does example, same template as Chapters 1-2. EXAMPLES (20) is the
// one shared bank reused by Picture Examples, Mini Practice, Game 1,
// Game 2, Game 3 and Boss Quiz — every entry's `blank` is a literal
// substring of `en`, so en.replace(blank, distractor) always produces a
// valid alternate sentence.

var GRAMMAR_POINTS = [
  {
    id: 'what', title: 'What', emoji: '🧐',
    en: "Use 'What' + do/does to ask about a thing.",
    th: 'What ถามเกี่ยวกับสิ่งของ',
    example: { en: 'What do you eat for breakfast?', emoji: '🍳', th: 'คุณกินอะไรเป็นอาหารเช้า' }
  },
  {
    id: 'where', title: 'Where', emoji: '📍',
    en: "Use 'Where' + do/does to ask about a place.",
    th: 'Where ถามเกี่ยวกับสถานที่',
    example: { en: 'Where does she live?', emoji: '🏠', th: 'เธออาศัยอยู่ที่ไหน' }
  },
  {
    id: 'when', title: 'When', emoji: '⏰',
    en: "Use 'When' + do/does to ask about time.",
    th: 'When ถามเกี่ยวกับเวลา',
    example: { en: 'When do you wake up?', emoji: '⏰', th: 'คุณตื่นนอนเมื่อไหร่' }
  },
  {
    id: 'why', title: 'Why', emoji: '🤔',
    en: "Use 'Why' + do/does to ask for a reason.",
    th: 'Why ถามเกี่ยวกับเหตุผล',
    example: { en: 'Why does he study at night?', emoji: '🌙', th: 'ทำไมเขาถึงเรียนตอนกลางคืน' }
  },
  {
    id: 'who', title: 'Who', emoji: '👤',
    en: "Use 'Who' + do/does to ask about a person.",
    th: 'Who ถามเกี่ยวกับบุคคล',
    example: { en: 'Who do you like?', emoji: '👥', th: 'คุณชอบใคร' }
  },
  {
    id: 'which', title: 'Which', emoji: '🔀',
    en: "Use 'Which' + do/does to ask about a choice.",
    th: 'Which ถามเกี่ยวกับตัวเลือก',
    example: { en: 'Which sport do you play?', emoji: '🏀', th: 'คุณเล่นกีฬาอะไร' }
  },
  {
    id: 'whose', title: 'Whose', emoji: '🎒',
    en: "Use 'Whose' + do/does to ask about ownership.",
    th: 'Whose ถามเกี่ยวกับเจ้าของ',
    example: { en: 'Whose bike does he ride?', emoji: '🚲', th: 'เขาขี่จักรยานของใคร' }
  },
  {
    id: 'how', title: 'How', emoji: '🛠️',
    en: "Use 'How' + do/does to ask about a method.",
    th: 'How ถามเกี่ยวกับวิธีการ',
    example: { en: 'How do you go to school?', emoji: '🚌', th: 'คุณไปโรงเรียนยังไง' }
  }
];

var EXAMPLES = [
  { id: 'c3ex01', en: 'What do you eat for breakfast?', pron: 'วอท ดู ยู อีท ฟอร์ เบรคฟาสท์', th: 'คุณกินอะไรเป็นอาหารเช้า', emoji: '🍳', type: 'wh', blank: 'What do you eat', distractors: ['What does you eat', 'What are you eat', 'What do you eats'], explain: 'What ถามเกี่ยวกับสิ่งของ + do (you)' },
  { id: 'c3ex02', en: 'What does she cook for dinner?', pron: 'วอท ดัส ชี คุค ฟอร์ ดินเนอร์', th: 'เธอทำอาหารอะไรเป็นมื้อเย็น', emoji: '🍲', type: 'wh', blank: 'What does she cook', distractors: ['What do she cook', 'What is she cook', 'What does she cooks'], explain: 'What ถามเกี่ยวกับสิ่งของ + does (she)' },
  { id: 'c3ex03', en: 'What do they study at school?', pron: 'วอท ดู เธ สตัดดี้ แอ็ท สคูล', th: 'พวกเขาเรียนอะไรที่โรงเรียน', emoji: '📚', type: 'wh', blank: 'What do they study', distractors: ['What does they study', 'What are they study', 'What do they studies'], explain: 'What ถามเกี่ยวกับสิ่งของ + do (they)' },

  { id: 'c3ex04', en: 'Where does he live?', pron: 'แวร์ ดัส ฮี ลิฟว์', th: 'เขาอาศัยอยู่ที่ไหน', emoji: '🏠', type: 'wh', blank: 'Where does he live', distractors: ['Where do he live', 'Where is he live', 'Where does he lives'], explain: 'Where ถามเกี่ยวกับสถานที่ + does (he)' },
  { id: 'c3ex05', en: 'Where do you go on Sunday?', pron: 'แวร์ ดู ยู โก ออน ซันเดย์', th: 'คุณไปไหนในวันอาทิตย์', emoji: '🚶', type: 'wh', blank: 'Where do you go', distractors: ['Where does you go', 'Where are you go', 'Where do you goes'], explain: 'Where ถามเกี่ยวกับสถานที่ + do (you)' },
  { id: 'c3ex06', en: 'Where does Connie play?', pron: 'แวร์ ดัส คอนนี่ เพลย์', th: 'คอนนี่เล่นที่ไหน', emoji: '🦊', type: 'wh', blank: 'Where does Connie play', distractors: ['Where do Connie play', 'Where is Connie play', 'Where does Connie plays'], explain: 'Where ถามเกี่ยวกับสถานที่ + does (ชื่อเฉพาะเอกพจน์)' },

  { id: 'c3ex07', en: 'When do you wake up?', pron: 'เวน ดู ยู เวค อัพ', th: 'คุณตื่นนอนเมื่อไหร่', emoji: '⏰', type: 'wh', blank: 'When do you wake up', distractors: ['When does you wake up', 'When are you wake up', 'When do you wakes up'], explain: 'When ถามเกี่ยวกับเวลา + do (you)' },
  { id: 'c3ex08', en: 'When does she eat lunch?', pron: 'เวน ดัส ชี อีท ลันช์', th: 'เธอกินอาหารกลางวันเมื่อไหร่', emoji: '🍱', type: 'wh', blank: 'When does she eat', distractors: ['When do she eat', 'When is she eat', 'When does she eats'], explain: 'When ถามเกี่ยวกับเวลา + does (she)' },
  { id: 'c3ex09', en: 'When do they finish school?', pron: 'เวน ดู เธ ฟินิช สคูล', th: 'พวกเขาเลิกเรียนเมื่อไหร่', emoji: '🔔', type: 'wh', blank: 'When do they finish', distractors: ['When does they finish', 'When are they finish', 'When do they finishes'], explain: 'When ถามเกี่ยวกับเวลา + do (they)' },

  { id: 'c3ex10', en: 'Why does he study at night?', pron: 'วาย ดัส ฮี สตัดดี้ แอ็ท ไนท์', th: 'ทำไมเขาถึงเรียนตอนกลางคืน', emoji: '🌙', type: 'wh', blank: 'Why does he study', distractors: ['Why do he study', 'Why is he study', 'Why does he studies'], explain: 'Why ถามเกี่ยวกับเหตุผล + does (he)' },
  { id: 'c3ex11', en: 'Why do you like tea?', pron: 'วาย ดู ยู ไลค์ ที', th: 'ทำไมคุณถึงชอบชา', emoji: '🍵', type: 'wh', blank: 'Why do you like', distractors: ['Why does you like', 'Why are you like', 'Why do you likes'], explain: 'Why ถามเกี่ยวกับเหตุผล + do (you)' },
  { id: 'c3ex12', en: 'Why does Connie sleep early?', pron: 'วาย ดัส คอนนี่ สลีพ เออลี่', th: 'ทำไมคอนนี่ถึงนอนเร็ว', emoji: '😴', type: 'wh', blank: 'Why does Connie sleep', distractors: ['Why do Connie sleep', 'Why is Connie sleep', 'Why does Connie sleeps'], explain: 'Why ถามเกี่ยวกับเหตุผล + does (ชื่อเฉพาะเอกพจน์)' },

  { id: 'c3ex13', en: 'Who do you like?', pron: 'ฮู ดู ยู ไลค์', th: 'คุณชอบใคร', emoji: '👥', type: 'wh', blank: 'Who do you like', distractors: ['Who does you like', 'Who are you like', 'Who do you likes'], explain: 'Who ถามเกี่ยวกับบุคคล + do (you)' },
  { id: 'c3ex14', en: 'Who does she call every day?', pron: 'ฮู ดัส ชี คอล เอฟรี เดย์', th: 'เธอโทรหาใครทุกวัน', emoji: '📞', type: 'wh', blank: 'Who does she call', distractors: ['Who do she call', 'Who is she call', 'Who does she calls'], explain: 'Who ถามเกี่ยวกับบุคคล + does (she)' },

  { id: 'c3ex15', en: 'Which sport do you play?', pron: 'วิช สปอร์ท ดู ยู เพลย์', th: 'คุณเล่นกีฬาอะไร', emoji: '🏀', type: 'wh', blank: 'Which sport do you play', distractors: ['Which sport does you play', 'Which sport are you play', 'Which sport do you plays'], explain: 'Which ถามเกี่ยวกับตัวเลือก + do (you)' },
  { id: 'c3ex16', en: 'Which book does he read?', pron: 'วิช บุค ดัส ฮี รีด', th: 'เขาอ่านหนังสือเล่มไหน', emoji: '📖', type: 'wh', blank: 'Which book does he read', distractors: ['Which book do he read', 'Which book is he read', 'Which book does he reads'], explain: 'Which ถามเกี่ยวกับตัวเลือก + does (he)' },

  { id: 'c3ex17', en: 'Whose bike does he ride?', pron: 'ฮูส ไบค์ ดัส ฮี ไรด์', th: 'เขาขี่จักรยานของใคร', emoji: '🚲', type: 'wh', blank: 'Whose bike does he ride', distractors: ['Whose bike do he ride', 'Whose bike is he ride', 'Whose bike does he rides'], explain: 'Whose ถามเกี่ยวกับเจ้าของ + does (he)' },
  { id: 'c3ex18', en: 'Whose dog do they walk?', pron: 'ฮูส ดอก ดู เธ วอล์ค', th: 'พวกเขาพาสุนัขของใครไปเดินเล่น', emoji: '🐕', type: 'wh', blank: 'Whose dog do they walk', distractors: ['Whose dog does they walk', 'Whose dog are they walk', 'Whose dog do they walks'], explain: 'Whose ถามเกี่ยวกับเจ้าของ + do (they)' },

  { id: 'c3ex19', en: 'How do you go to school?', pron: 'ฮาว ดู ยู โก ทู สคูล', th: 'คุณไปโรงเรียนยังไง', emoji: '🚌', type: 'wh', blank: 'How do you go', distractors: ['How does you go', 'How are you go', 'How do you goes'], explain: 'How ถามเกี่ยวกับวิธีการ + do (you)' },
  { id: 'c3ex20', en: 'How does she make tea?', pron: 'ฮาว ดัส ชี เมค ที', th: 'เธอชงชายังไง', emoji: '🍵', type: 'wh', blank: 'How does she make', distractors: ['How do she make', 'How is she make', 'How does she makes'], explain: 'How ถามเกี่ยวกับวิธีการ + does (she)' }
];

// The 8 WH words, quick-recall chips (Memory Trick screen).
var WH_TRICKS = [
  { emoji: '🧐', en: 'What', th: 'อะไร' },
  { emoji: '📍', en: 'Where', th: 'ที่ไหน' },
  { emoji: '⏰', en: 'When', th: 'เมื่อไหร่' },
  { emoji: '🤔', en: 'Why', th: 'ทำไม' },
  { emoji: '👤', en: 'Who', th: 'ใคร' },
  { emoji: '🔀', en: 'Which', th: 'อันไหน' },
  { emoji: '🎒', en: 'Whose', th: 'ของใคร' },
  { emoji: '🛠️', en: 'How', th: 'ยังไง' }
];

// Game 5 — Connie's Daily Routine: same "day in the life" narrative as
// Chapters 1-2, this time each step is a WH question about the routine.
var CONNIE_ROUTINE = [
  { time: '6:00 AM', emoji: '⏰', en: 'When does Connie wake up?', th: 'คอนนี่ตื่นนอนเมื่อไหร่', blank: 'When does Connie wake up', distractors: ['When do Connie wake up', 'When is Connie wake up'] },
  { time: '7:00 AM', emoji: '🍳', en: 'What does Connie eat for breakfast?', th: 'คอนนี่กินอะไรเป็นอาหารเช้า', blank: 'What does Connie eat', distractors: ['What do Connie eat', 'What is Connie eat'] },
  { time: '8:00 AM', emoji: '🚌', en: 'How does Connie go to school?', th: 'คอนนี่ไปโรงเรียนยังไง', blank: 'How does Connie go', distractors: ['How do Connie go', 'How is Connie go'] },
  { time: '3:00 PM', emoji: '📖', en: 'Where does Connie study?', th: 'คอนนี่อ่านหนังสือที่ไหน', blank: 'Where does Connie study', distractors: ['Where do Connie study', 'Where is Connie study'] },
  { time: '7:00 PM', emoji: '🍽️', en: 'Who does Connie eat dinner with?', th: 'คอนนี่กินอาหารเย็นกับใคร', blank: 'Who does Connie eat', distractors: ['Who do Connie eat', 'Who is Connie eat'] },
  { time: '9:00 PM', emoji: '🛏️', en: 'Why does Connie sleep early?', th: 'ทำไมคอนนี่ถึงนอนเร็ว', blank: 'Why does Connie sleep', distractors: ['Why do Connie sleep', 'Why is Connie sleep'] }
];
