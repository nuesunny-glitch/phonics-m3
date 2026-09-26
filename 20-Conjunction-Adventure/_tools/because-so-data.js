// Conjunction Adventure Chapter 2 word bank — because / so.
// Same shape as and-but-or-data.js. Only 2 words — small on purpose per the
// requested scope; game-engine-ch2.js's distractor guard
// (Math.min(3, TOTAL_PER_STAGE-1)) already handles small banks gracefully.
var CONJUNCTION_ADVENTURE_CH2_WORDS = [
  {
    en: 'because', th: 'เพราะ', emoji: '🌧️',
    scene: ['🌧️', '🏠'], connector: '➡️',
    example: 'He stayed home because it was raining.',
    memoryTip: 'เพราะ (BECAUSE) ตอบคำถาม "ทำไม" เสมอ นึกถึง BE-CAUSE = เป็นสาเหตุของสิ่งที่เกิดขึ้น'
  },
  {
    en: 'so', th: 'ดังนั้น', emoji: '➡️',
    scene: ['😋', '🍽️'], connector: '➡️',
    example: 'He was hungry, so he ate lunch.',
    memoryTip: 'ดังนั้น (SO) บอกผลลัพธ์ที่ตามมาจากเหตุการณ์ก่อนหน้า สั้นแค่ 2 ตัวอักษร เหมือนสรุปผลแบบไว ๆ'
  }
];
