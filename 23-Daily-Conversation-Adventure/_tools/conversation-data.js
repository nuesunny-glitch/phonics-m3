// Daily Conversation Adventure — Lesson 1: HELLO!
// Content data only (no engine logic here) — characters, dialogue scenes,
// vocabulary, mini-practice questions, game data and Boss Quiz questions.
// CHARACTERS is deliberately a full 5-person course roster (per the
// module spec: "Create reusable characters that will appear throughout
// the whole course") even though only Tom and Anna speak in Lesson 1 —
// Ben, Lucy and Ms. Jane appear now as the "Meet the Characters" strip
// and as decoy answer choices, ready to speak in future lessons.

var CHARACTERS = [
  { id: 'tom', name: 'Tom', emoji: '👦' },
  { id: 'anna', name: 'Anna', emoji: '👧' },
  { id: 'ben', name: 'Ben', emoji: '👦' },
  { id: 'lucy', name: 'Lucy', emoji: '👧' },
  { id: 'jane', name: 'Ms. Jane', emoji: '👩' }
];

function charById(id) {
  for (var i = 0; i < CHARACTERS.length; i++) if (CHARACTERS[i].id === id) return CHARACTERS[i];
  return null;
}

// ---------------- Scenes (the 4 dialogue scenes) ----------------
var SCENES = [
  {
    id: 1,
    location: '🏫 At School',
    illustration: '🏫🙋‍♂️🙋‍♀️',
    lines: [
      { speaker: 'tom', en: 'Hello!', th: 'สวัสดี!' },
      { speaker: 'anna', en: 'Hi!', th: 'หวัดดี!' }
    ]
  },
  {
    id: 2,
    location: '🏫 At School',
    illustration: '🧑‍🎓👧',
    lines: [
      { speaker: 'tom', en: 'My name is Tom.', th: 'ฉันชื่อทอม' },
      { speaker: 'anna', en: 'My name is Anna.', th: 'ฉันชื่ออนา' }
    ]
  },
  {
    id: 3,
    location: '🏫 At School',
    illustration: '🤝😊',
    lines: [
      { speaker: 'tom', en: 'Nice to meet you.', th: 'ยินดีที่ได้รู้จักนะ' },
      { speaker: 'anna', en: 'Nice to meet you, too.', th: 'ยินดีที่ได้รู้จักเช่นกัน' }
    ]
  },
  {
    id: 4,
    location: '🏫 At School',
    illustration: '👋🚶‍♂️',
    lines: [
      { speaker: 'tom', en: 'Goodbye.', th: 'ลาก่อนนะ' },
      { speaker: 'anna', en: 'Bye!', th: 'บาย!' }
    ]
  }
];

// Flat list of every dialogue line, used by games/boss quiz.
var ALL_LINES = [];
SCENES.forEach(function (sc) {
  sc.lines.forEach(function (ln) { ALL_LINES.push(ln); });
});

// ---------------- Vocabulary ----------------
var VOCAB = [
  { en: 'Hello', th: 'สวัสดี', emoji: '👋' },
  { en: 'Hi', th: 'หวัดดี', emoji: '🙋' },
  { en: 'Goodbye', th: 'ลาก่อน', emoji: '🚶' },
  { en: 'Bye', th: 'บาย', emoji: '😄' },
  { en: 'Name', th: 'ชื่อ', emoji: '📛' },
  { en: 'Friend', th: 'เพื่อน', emoji: '🧑‍🤝‍🧑' },
  { en: 'Nice', th: 'ดี น่ารัก', emoji: '😊' },
  { en: 'Meet', th: 'พบ เจอ', emoji: '🤝' }
];

// ---------------- Mini Practice (ungraded, "Who answers?" format) ----------------
// One silly non-character decoy per question, matching the module spec's
// own example ("Tom says: Hello! Who answers? Anna / Ben / Dog").
var MINI_QUESTIONS = [
  { prompt: 'Tom says: "Hello!" Who answers?', choices: [
    { label: 'Anna', ok: true }, { label: 'Ben', ok: false }, { label: 'Dog 🐶', ok: false }
  ] },
  { prompt: 'Someone says: "My name is Tom." Who said it?', choices: [
    { label: 'Tom', ok: true }, { label: 'Lucy', ok: false }, { label: 'Cat 🐱', ok: false }
  ] },
  { prompt: 'Tom says: "Nice to meet you." Who answers?', choices: [
    { label: 'Anna', ok: true }, { label: 'Ms. Jane', ok: false }, { label: 'Robot 🤖', ok: false }
  ] },
  { prompt: 'Anna says: "Bye!" Who said "Goodbye." first?', choices: [
    { label: 'Tom', ok: true }, { label: 'Ben', ok: false }, { label: 'Bird 🐦', ok: false }
  ] },
  { prompt: 'Which word means "สวัสดี"?', choices: [
    { label: 'Hello', ok: true }, { label: 'Bye', ok: false }, { label: 'Friend', ok: false }
  ] },
  { prompt: 'Which word means "เพื่อน"?', choices: [
    { label: 'Friend', ok: true }, { label: 'Name', ok: false }, { label: 'Meet', ok: false }
  ] }
];

// ---------------- Game 1: "Choose the Correct Reply" ----------------
// One round per scene — given the first line, pick the correct reply from
// 4 choices (the other 3 replies come from the OTHER scenes, so they're
// plausible but wrong).
var REPLY_ROUNDS = SCENES.map(function (sc) {
  return { prompt: sc.lines[0].en, promptTh: sc.lines[0].th, correct: sc.lines[1].en, illustration: sc.illustration };
});

function buildReplyChoices(round) {
  var others = SCENES.map(function (sc) { return sc.lines[1].en; }).filter(function (t) { return t !== round.correct; });
  var wrongs = others.slice(0, 3);
  var choices = [{ label: round.correct, ok: true }].concat(wrongs.map(function (w) { return { label: w, ok: false }; }));
  return choices;
}

// ---------------- Game 2: "Picture Word Match" (uses VOCAB) ----------------
// ---------------- Game 3: "Build the Sentence" (uses short ALL_LINES) ----------------
var SHORT_LINES = ALL_LINES.filter(function (ln) {
  return ln.en.replace(/[.!?]+$/, '').split(' ').length <= 5;
});

// ---------------- Boss Quiz question bank (14 questions; 10 are drawn
// each playthrough) ----------------
var BOSS_QUESTIONS = [
  { q: 'Who says "Hello!" first at school?', choices: [
    { label: 'Tom', ok: true }, { label: 'Anna', ok: false }, { label: 'Ben', ok: false }, { label: 'Lucy', ok: false }
  ], explain: 'Tom says "Hello!" first, and Anna answers "Hi!"' },

  { q: 'What is the correct reply to "Hello!"?', choices: [
    { label: 'Hi!', ok: true }, { label: 'Bye!', ok: false }, { label: 'Goodbye.', ok: false }, { label: 'My name is Tom.', ok: false }
  ], explain: '"Hello!" → "Hi!" is the natural greeting reply.' },

  { q: 'What does "Nice to meet you." mean?', choices: [
    { label: 'ยินดีที่ได้รู้จัก', ok: true }, { label: 'ลาก่อน', ok: false }, { label: 'ฉันชื่อทอม', ok: false }, { label: 'เพื่อนของฉัน', ok: false }
  ], explain: '"Nice to meet you." = ยินดีที่ได้รู้จัก' },

  { q: 'How do you say "ลาก่อน" in English?', choices: [
    { label: 'Goodbye', ok: true }, { label: 'Hello', ok: false }, { label: 'Meet', ok: false }, { label: 'Friend', ok: false }
  ], explain: '"Goodbye" = ลาก่อน' },

  { q: 'What is the correct reply to "Goodbye."?', choices: [
    { label: 'Bye!', ok: true }, { label: 'Hi!', ok: false }, { label: 'Nice to meet you.', ok: false }, { label: 'My name is Anna.', ok: false }
  ], explain: 'When someone says "Goodbye.", you can answer "Bye!"' },

  { q: 'Who says "My name is Anna."?', choices: [
    { label: 'Anna', ok: true }, { label: 'Tom', ok: false }, { label: 'Lucy', ok: false }, { label: 'Ms. Jane', ok: false }
  ], explain: 'Anna introduces herself: "My name is Anna."' },

  { q: 'What does "Friend" mean in Thai?', choices: [
    { label: 'เพื่อน', ok: true }, { label: 'ชื่อ', ok: false }, { label: 'สวัสดี', ok: false }, { label: 'พบ', ok: false }
  ], explain: '"Friend" = เพื่อน' },

  { q: 'How do you say "ชื่อ" in English?', choices: [
    { label: 'Name', ok: true }, { label: 'Nice', ok: false }, { label: 'Meet', ok: false }, { label: 'Bye', ok: false }
  ], explain: '"Name" = ชื่อ' },

  { q: 'What is the correct reply to "Nice to meet you."?', choices: [
    { label: 'Nice to meet you, too.', ok: true }, { label: 'Hello!', ok: false }, { label: 'Bye!', ok: false }, { label: 'My name is Tom.', ok: false }
  ], explain: 'The polite reply is "Nice to meet you, too."' },

  { q: 'What does "Hi!" mean in Thai?', choices: [
    { label: 'หวัดดี', ok: true }, { label: 'ลาก่อน', ok: false }, { label: 'ขอบคุณ', ok: false }, { label: 'ขอโทษ', ok: false }
  ], explain: '"Hi!" = หวัดดี (a casual greeting, same as "Hello!")' },

  { q: 'Who says "Bye!" at the end of the scene?', choices: [
    { label: 'Anna', ok: true }, { label: 'Tom', ok: false }, { label: 'Ben', ok: false }, { label: 'Ms. Jane', ok: false }
  ], explain: 'Tom says "Goodbye." and Anna answers "Bye!"' },

  { q: 'What does "Meet" mean in Thai?', choices: [
    { label: 'พบ เจอ', ok: true }, { label: 'ชื่อ', ok: false }, { label: 'ดี', ok: false }, { label: 'บาย', ok: false }
  ], explain: '"Meet" = พบ / เจอ' },

  { q: 'How do you say "หวัดดี" in English?', choices: [
    { label: 'Hi', ok: true }, { label: 'Bye', ok: false }, { label: 'Name', ok: false }, { label: 'Friend', ok: false }
  ], explain: '"Hi" = หวัดดี' },

  { q: 'What does "Nice" mean in Thai?', choices: [
    { label: 'ดี น่ารัก', ok: true }, { label: 'เพื่อน', ok: false }, { label: 'ชื่อ', ok: false }, { label: 'ลาก่อน', ok: false }
  ], explain: '"Nice" = ดี / น่ารัก' }
];
