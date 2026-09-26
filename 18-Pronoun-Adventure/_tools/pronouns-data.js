// Pronoun Adventure Chapter 1 word bank — basic subject pronouns.
// Matches the exact set already taught in 05-Parts-of-Speech/05-parts-of-speech.md
// section 5.2 ("Subject Pronoun: I, you, he, she, it, we, they") for consistency.
// Same shape as 16-Verb-Adventure/_tools/verbs-data.js (VERB_ADVENTURE_WORDS)
// by design, so game-engine.js can stay structurally identical between games.
// NOTE: pronouns have weaker 1:1 emoji mapping than concrete verbs/adjectives
// (e.g. "we" vs "they" both look like "a group of people" in emoji) — the
// example sentence is there so Stage 1 stays answerable from context, not
// just the picture alone.
var PRONOUN_ADVENTURE_WORDS = [
  { en: 'I',    th: 'ฉัน/ผม',    emoji: '🙋', example: 'I am a student.' },
  { en: 'you',  th: 'คุณ',        emoji: '👉', example: 'You are my friend.' },
  { en: 'he',   th: 'เขา (ชาย)',  emoji: '👦', example: 'He is my brother.' },
  { en: 'she',  th: 'เขา (หญิง)', emoji: '👧', example: 'She is my sister.' },
  { en: 'it',   th: 'มัน',        emoji: '📦', example: 'It is my bag.' },
  { en: 'we',   th: 'เรา',        emoji: '👨‍👩‍👧', example: 'We are a family.' },
  { en: 'they', th: 'พวกเขา',     emoji: '👥', example: 'They are students.' }
];
