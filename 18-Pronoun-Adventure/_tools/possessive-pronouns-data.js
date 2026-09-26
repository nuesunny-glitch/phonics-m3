// Pronoun Adventure Chapter 3 word bank — possessive adjectives (my, your,
// his, her, its, our, their). Matches the "แสดงความเป็นเจ้าของ" column of
// 05-Parts-of-Speech/05-parts-of-speech.md section 5.2, using the adjective
// form (my/your/her/our/their) rather than the standalone possessive
// pronoun form (mine/yours/hers/ours/theirs) — this keeps the word bank at
// 7 items, one per person, exactly parallel to chapter 1 (subject) and
// chapter 2 (object). Same emoji mapping as chapters 1-2 for continuity.
// NOTE: unlike chapters 1-2, the possessive adjective sits in the MIDDLE of
// its example sentence (right before a noun: "This is my book."), not at
// the start or end — so game-engine-ch3.js blanks the exact target word
// wherever it appears, instead of the first/last word.
var PRONOUN_ADVENTURE_CH3_WORDS = [
  { en: 'my',    th: 'ของฉัน/ของผม',   emoji: '🙋', example: 'This is my book.' },
  { en: 'your',  th: 'ของคุณ',          emoji: '👉', example: 'Is this your pen?' },
  { en: 'his',   th: 'ของเขา (ชาย)',    emoji: '👦', example: 'That is his bag.' },
  { en: 'her',   th: 'ของเขา (หญิง)',   emoji: '👧', example: 'This is her dress.' },
  { en: 'its',   th: 'ของมัน',          emoji: '📦', example: 'The box lost its lid.' },
  { en: 'our',   th: 'ของเรา',          emoji: '👨‍👩‍👧', example: 'This is our house.' },
  { en: 'their', th: 'ของพวกเขา',       emoji: '👥', example: 'That is their car.' }
];
