// Conjunction Adventure Chapter 1 word bank — and / but / or.
// Shape extends the other Adventure games' {en, th, emoji, example} with:
//   scene: [emoji, emoji]   — a 2-element "picture scene" (not a single
//                              emoji) because conjunctions are relations
//                              between two things, not concrete objects —
//                              a lone emoji can't convey "and" vs "but" vs
//                              "or", but two emoji + a connector symbol can.
//   connector: string        — symbol rendered between the two scene emoji
//                              (+ for addition, ↔ for contrast, ❓ for choice)
//   memoryTip: string        — Thai mnemonic shown on the เทคนิคการจำ screen
// `emoji` (single) is kept too, reused for the Stage 3 matching-game tiles
// where a single glyph per word reads better in a small tile.
var CONJUNCTION_ADVENTURE_CH1_WORDS = [
  {
    en: 'and', th: 'และ', emoji: '➕',
    scene: ['🍎', '🍌'], connector: '+',
    example: 'I like apples and bananas.',
    memoryTip: 'และ (AND) ใช้เชื่อมสองสิ่งที่ไปด้วยกัน จำง่าย ๆ: A-N-D = Add aNother Detail (เพิ่มอีกอย่างเข้าไป)'
  },
  {
    en: 'but', th: 'แต่', emoji: '↔️',
    scene: ['🐭', '💪'], connector: '↔',
    example: 'She is small but strong.',
    memoryTip: 'แต่ (BUT) บอกความขัดแย้งกับสิ่งที่พูดไปก่อนหน้า จำง่าย ๆ ว่าฟังดู "สะดุด" เหมือนมีอะไรมาขวางกลางประโยค'
  },
  {
    en: 'or', th: 'หรือ', emoji: '❓',
    scene: ['🍵', '☕'], connector: '❓',
    example: 'Do you want tea or coffee?',
    memoryTip: 'หรือ (OR) ใช้ให้เลือกอย่างใดอย่างหนึ่ง จำจากเสียง "ออ" เหมือนตอนลังเลว่าจะเลือกอันไหนดี'
  }
];
