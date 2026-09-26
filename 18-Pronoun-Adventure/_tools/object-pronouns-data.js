// Pronoun Adventure Chapter 2 word bank — object pronouns.
// Matches 05-Parts-of-Speech/05-parts-of-speech.md section 5.2
// ("Object Pronoun: me, you, him, her, it, us, them"). Same emoji mapping
// as chapter 1's subject pronouns (PRONOUN_ADVENTURE_WORDS in
// pronouns-data.js) since they refer to the same people/things, just in
// object position — deliberate visual continuity between the two chapters.
// NOTE: unlike chapter 1, every example sentence here ends with the pronoun
// as the LAST word (object position), not the first (subject position) —
// see game-engine-ch2.js's blankLastWord() vs game-engine.js's
// blankFirstWord().
var PRONOUN_ADVENTURE_CH2_WORDS = [
  { en: 'me',   th: 'ฉัน/ผม (กรรม)',      emoji: '🙋', example: 'Please help me.' },
  { en: 'you',  th: 'คุณ (กรรม)',          emoji: '👉', example: 'I love you.' },
  { en: 'him',  th: 'เขา (ชาย, กรรม)',     emoji: '👦', example: 'She likes him.' },
  { en: 'her',  th: 'เขา (หญิง, กรรม)',    emoji: '👧', example: 'He likes her.' },
  { en: 'it',   th: 'มัน (กรรม)',          emoji: '📦', example: 'I bought it.' },
  { en: 'us',   th: 'เรา (กรรม)',          emoji: '👨‍👩‍👧', example: 'They invited us.' },
  { en: 'them', th: 'พวกเขา (กรรม)',       emoji: '👥', example: 'We saw them.' }
];
