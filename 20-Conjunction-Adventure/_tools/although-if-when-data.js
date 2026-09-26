// Conjunction Adventure Chapter 3 word bank — although / if / when.
// Same shape as and-but-or-data.js. All three of these commonly START a
// sentence in their example ("Although...", "If...", "When...") — this
// exercises blankTargetWord()'s case-insensitive matching at the very start
// of a sentence (capitalized), not just mid-sentence.
var CONJUNCTION_ADVENTURE_CH3_WORDS = [
  {
    en: 'although', th: 'แม้ว่า', emoji: '☔',
    scene: ['☔', '😊'], connector: '↔',
    example: 'Although it was raining, she went out.',
    memoryTip: 'แม้ว่า (ALTHOUGH) บอกว่า "ถึงจะ...ก็ตาม" ยาวกว่า BUT เพราะใช้บอกความขัดแย้งที่หนักแน่นกว่า'
  },
  {
    en: 'if', th: 'ถ้า', emoji: '☂️',
    scene: ['🌧️', '☂️'], connector: '❓',
    example: 'If it rains, take an umbrella.',
    memoryTip: 'ถ้า (IF) สั้นแค่ 2 ตัวอักษร ใช้ตั้งเงื่อนไข/สมมติฐาน จำง่าย ๆ ว่า IF = ถ้าสมมติว่า'
  },
  {
    en: 'when', th: 'เมื่อ', emoji: '🔔',
    scene: ['🔔', '🏫'], connector: '➡️',
    example: 'When the bell rings, we go to class.',
    memoryTip: 'เมื่อ (WHEN) บอกเวลาที่เหตุการณ์เกิดขึ้น ขึ้นต้นด้วย W เหมือนคำถาม When? (เมื่อไหร่)'
  }
];
