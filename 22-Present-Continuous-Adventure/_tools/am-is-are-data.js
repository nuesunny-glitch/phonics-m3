// Present Continuous Adventure — Chapter 1: What is Present Continuous?,
// am/is/are, verb+ing, Affirmative sentences, Actions happening now.
// Data for THIS chapter only (matches this project's per-chapter
// data-file convention, e.g. Present Simple Adventure's
// subject-verb-affirmative-data.js).
//
// GRAMMAR_POINTS drives the Learn screen (Learning Objectives) — 5 cards,
// each <=2 English sentences + a short Thai line + one example, matching
// the template established across all prior Adventure chapters. EXAMPLES
// (20) is the one shared bank reused by Picture Examples, Mini Practice,
// Game 1, Game 2 and Game 3, and Boss Quiz — every entry's `blank` is a
// literal substring of `en`, so en.replace(blank, distractor) always
// produces a valid alternate sentence. Distractors intentionally include
// realistic -ing spelling mistakes (missing double consonant, keeping a
// silent e) since "verb + ing" is an explicit teaching point this chapter.

var GRAMMAR_POINTS = [
  {
    id: 'what-is', title: 'What is Present Continuous?', emoji: '⏳',
    en: 'Present Continuous describes an action happening right now.',
    th: 'Present Continuous บอกการกระทำที่กำลังเกิดขึ้นตอนนี้',
    example: { en: 'She is reading a book now.', emoji: '📖', th: 'เธอกำลังอ่านหนังสืออยู่ตอนนี้' }
  },
  {
    id: 'am-is-are', title: 'am / is / are', emoji: '🔤',
    en: 'Use am with I, is with he/she/it, are with you/we/they.',
    th: 'am ใช้กับ I, is ใช้กับ he/she/it, are ใช้กับ you/we/they',
    example: { en: 'I am eating.', emoji: '🍽️', th: 'ฉันกำลังกิน' }
  },
  {
    id: 'verb-ing', title: 'verb + ing', emoji: '➕',
    en: 'Add -ing to the verb to show the action is happening now.',
    th: 'เติม -ing ที่กริยาเพื่อบอกว่ากำลังเกิดขึ้น',
    example: { en: 'He is running.', emoji: '🏃', th: 'เขากำลังวิ่ง' }
  },
  {
    id: 'affirmative', title: 'Affirmative sentences', emoji: '✅',
    en: 'Subject + am/is/are + verb-ing.',
    th: 'โครงสร้าง: Subject + am/is/are + verb-ing',
    example: { en: 'They are playing football.', emoji: '⚽', th: 'พวกเขากำลังเล่นฟุตบอล' }
  },
  {
    id: 'happening-now', title: 'Actions happening now', emoji: '👉',
    en: 'Present Continuous talks about actions happening at this exact moment.',
    th: 'ใช้พูดถึงสิ่งที่กำลังเกิดขึ้นตอนนี้เท่านั้น',
    example: { en: 'Look! It is raining.', emoji: '🌧️', th: 'ดูสิ! ฝนกำลังตก' }
  }
];

var EXAMPLES = [
  { id: 'ex01', en: 'I am eating breakfast now.', pron: 'ไอ แอม อีทติ้ง เบรคฟาสท์ นาว', th: 'ฉันกำลังกินอาหารเช้าอยู่ตอนนี้', emoji: '🍳', blank: 'am eating', distractors: ['is eating', 'are eating', 'eating'], explain: "'I' ใช้ am + กริยาเติม -ing" },
  { id: 'ex02', en: 'I am doing my homework.', pron: 'ไอ แอม ดูอิ้ง มาย โฮมเวิร์ค', th: 'ฉันกำลังทำการบ้าน', emoji: '📝', blank: 'am doing', distractors: ['is doing', 'are doing', 'doing'], explain: "'I' ใช้ am + กริยาเติม -ing" },
  { id: 'ex03', en: 'You are reading a book.', pron: 'ยู อาร์ รีดดิ้ง อะ บุค', th: 'คุณกำลังอ่านหนังสือ', emoji: '📚', blank: 'are reading', distractors: ['is reading', 'am reading', 'reading'], explain: "'You' ใช้ are + กริยาเติม -ing" },
  { id: 'ex04', en: 'We are playing football.', pron: 'วี อาร์ เพลย์อิ้ง ฟุตบอล', th: 'เรากำลังเล่นฟุตบอล', emoji: '⚽', blank: 'are playing', distractors: ['is playing', 'am playing', 'playing'], explain: "'We' ใช้ are + กริยาเติม -ing" },
  { id: 'ex05', en: 'They are watching TV.', pron: 'เธ อาร์ วอชชิ่ง ทีวี', th: 'พวกเขากำลังดูทีวี', emoji: '📺', blank: 'are watching', distractors: ['is watching', 'am watching', 'watching'], explain: "'They' ใช้ are + กริยาเติม -ing" },
  { id: 'ex06', en: 'He is running in the park.', pron: 'ฮี อีส รันนิ่ง อิน เธอะ พาร์ค', th: 'เขากำลังวิ่งในสวน', emoji: '🏃', blank: 'is running', distractors: ['are running', 'am running', 'running'], explain: "'He' ใช้ is + run เติมพยัญชนะซ้ำก่อน -ing (double n)" },
  { id: 'ex07', en: 'She is writing a letter.', pron: 'ชี อีส ไรทติ้ง อะ เลทเทอร์', th: 'เธอกำลังเขียนจดหมาย', emoji: '✍️', blank: 'is writing', distractors: ['are writing', 'am writing', 'writeing'], explain: "'She' ใช้ is + write ตัด e แล้วเติม -ing" },
  { id: 'ex08', en: 'It is raining outside.', pron: 'อิท อีส เรนนิ่ง เอาท์ไซด์', th: 'ฝนกำลังตกข้างนอก', emoji: '🌧️', blank: 'is raining', distractors: ['are raining', 'am raining', 'raining'], explain: "'It' ใช้ is + กริยาเติม -ing" },
  { id: 'ex09', en: 'Connie is sleeping now.', pron: 'คอนนี่ อีส สลีปปิ้ง นาว', th: 'คอนนี่กำลังนอนหลับอยู่', emoji: '😴', blank: 'is sleeping', distractors: ['are sleeping', 'am sleeping', 'sleeping'], explain: 'ชื่อเฉพาะเอกพจน์ ใช้ is' },
  { id: 'ex10', en: 'Connie is swimming in the pool.', pron: 'คอนนี่ อีส สวิมมิ่ง อิน เธอะ พูล', th: 'คอนนี่กำลังว่ายน้ำในสระ', emoji: '🏊', blank: 'is swimming', distractors: ['is swiming', 'are swimming', 'swimming'], explain: 'swim ตัวสะกดสั้นเติมพยัญชนะซ้ำก่อน -ing' },
  { id: 'ex11', en: 'I am making a cake.', pron: 'ไอ แอม เมคกิ้ง อะ เค้ก', th: 'ฉันกำลังทำเค้ก', emoji: '🎂', blank: 'am making', distractors: ['am makeing', 'is making', 'are making'], explain: 'make ตัด e แล้วเติม -ing' },
  { id: 'ex12', en: 'She is riding a bike.', pron: 'ชี อีส ไรดิ้ง อะ ไบค์', th: 'เธอกำลังขี่จักรยาน', emoji: '🚲', blank: 'is riding', distractors: ['is rideing', 'are riding', 'am riding'], explain: 'ride ตัด e แล้วเติม -ing' },
  { id: 'ex13', en: 'We are sitting on the floor.', pron: 'วี อาร์ ซิทติ้ง ออน เธอะ ฟลอร์', th: 'เรากำลังนั่งบนพื้น', emoji: '🪑', blank: 'are sitting', distractors: ['are siting', 'is sitting', 'am sitting'], explain: 'sit ตัวสะกดสั้นเติมพยัญชนะซ้ำก่อน -ing' },
  { id: 'ex14', en: 'He is getting ready for school.', pron: 'ฮี อีส เก็ทติ้ง เรดี้ ฟอร์ สคูล', th: 'เขากำลังเตรียมตัวไปโรงเรียน', emoji: '🎒', blank: 'is getting', distractors: ['is geting', 'are getting', 'am getting'], explain: 'get ตัวสะกดสั้นเติมพยัญชนะซ้ำก่อน -ing' },
  { id: 'ex15', en: 'They are shopping at the mall.', pron: 'เธ อาร์ ชอปปิ้ง แอ็ท เธอะ มอลล์', th: 'พวกเขากำลังช้อปปิ้งที่ห้าง', emoji: '🛍️', blank: 'are shopping', distractors: ['are shoping', 'is shopping', 'am shopping'], explain: 'shop ตัวสะกดสั้นเติมพยัญชนะซ้ำก่อน -ing' },
  { id: 'ex16', en: 'You are singing a song.', pron: 'ยู อาร์ ซิงกิ้ง อะ ซอง', th: 'คุณกำลังร้องเพลง', emoji: '🎤', blank: 'are singing', distractors: ['is singing', 'am singing', 'singing'], explain: "'You' ใช้ are + กริยาเติม -ing" },
  { id: 'ex17', en: 'I am talking to my friend.', pron: 'ไอ แอม ทอล์คกิ้ง ทู มาย เฟรนด์', th: 'ฉันกำลังคุยกับเพื่อน', emoji: '💬', blank: 'am talking', distractors: ['is talking', 'are talking', 'talking'], explain: "'I' ใช้ am + กริยาเติม -ing" },
  { id: 'ex18', en: 'She is cooking dinner.', pron: 'ชี อีส คุคกิ้ง ดินเนอร์', th: 'เธอกำลังทำอาหารเย็น', emoji: '🍲', blank: 'is cooking', distractors: ['are cooking', 'am cooking', 'cooking'], explain: "'She' ใช้ is + กริยาเติม -ing" },
  { id: 'ex19', en: 'We are studying English now.', pron: 'วี อาร์ สตัดดี้อิ้ง อิงลิช นาว', th: 'เรากำลังเรียนภาษาอังกฤษอยู่ตอนนี้', emoji: '📖', blank: 'are studying', distractors: ['is studying', 'am studying', 'studying'], explain: "'We' ใช้ are + กริยาเติม -ing" },
  { id: 'ex20', en: 'Connie is dancing happily.', pron: 'คอนนี่ อีส แดนซิ่ง แฮพพิลี่', th: 'คอนนี่กำลังเต้นอย่างมีความสุข', emoji: '💃', blank: 'is dancing', distractors: ['is danceing', 'are dancing', 'am dancing'], explain: 'dance ตัด e แล้วเติม -ing' }
];

// Present-moment time signals (Memory Trick screen).
var TIME_SIGNALS = [
  { emoji: '👉', en: 'Now', example: 'I am doing my homework now.' },
  { emoji: '👀', en: 'Look!', example: 'Look! She is dancing.' },
  { emoji: '👂', en: 'Listen!', example: 'Listen! He is singing.' },
  { emoji: '⏳', en: 'Right now', example: 'We are studying right now.' }
];
