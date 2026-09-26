// Preposition Adventure (Grade 9 beginner redesign) — single word bank for
// the whole module: 4 Prepositions of Place + 3 Prepositions of Time.
// "in"/"on"/"at" repeat across both categories with different meanings, so
// each entry has a unique `id` (not just `en`) — game-engine.js always
// keys off `id`, never off `en` alone.
// Every th/trick/explain string is kept to ONE short line (the "no long
// explanations" requirement).
var PREPOSITION_WORDS = [
  {
    id: 'place-in', en: 'in', th: 'อยู่ข้างใน', emoji: '📦', category: 'place',
    trick: 'IN = อยู่ "ใน"',
    examples: ['The cat is in the box.', 'I am in the room.', 'The fish is in the water.'],
    explain: '"in" ใช้เมื่อของอยู่ข้างในที่ปิดหรือมีขอบเขต'
  },
  {
    id: 'place-on', en: 'on', th: 'อยู่บน', emoji: '📖', category: 'place',
    trick: 'ON = อยู่ "บน"',
    examples: ['The book is on the table.', 'The cat is on the sofa.', 'A picture is on the wall.'],
    explain: '"on" ใช้เมื่อของสัมผัสอยู่บนพื้นผิว'
  },
  {
    id: 'place-under', en: 'under', th: 'อยู่ใต้', emoji: '🛏️', category: 'place',
    trick: 'UNDER = อยู่ "ใต้"',
    examples: ['The shoes are under the bed.', 'The dog is under the table.', 'The ball is under the chair.'],
    explain: '"under" ใช้เมื่อของอยู่ต่ำกว่าสิ่งอื่น'
  },
  {
    id: 'place-at', en: 'at', th: 'จุดเดียว (สถานที่)', emoji: '📍', category: 'place',
    trick: 'AT = จุดเดียว',
    examples: ['She is at the door.', 'I am at school.', 'We are at the bus stop.'],
    explain: '"at" ใช้บอกตำแหน่งที่เป็นจุดหนึ่ง ไม่เจาะจงพื้นที่กว้าง'
  },
  {
    id: 'time-in', en: 'in', th: 'ช่วงเวลายาว', emoji: '🌸', category: 'time',
    trick: 'IN = ช่วงเวลายาว',
    timeline: ['July', '2026', 'the morning'],
    explain: '"in" ใช้กับเดือน ปี ฤดู หรือช่วงเวลายาว'
  },
  {
    id: 'time-on', en: 'on', th: 'วัน', emoji: '📅', category: 'time',
    trick: 'ON = วัน',
    timeline: ['Monday', 'my birthday'],
    explain: '"on" ใช้กับวันหรือวันที่เฉพาะ'
  },
  {
    id: 'time-at', en: 'at', th: 'เวลาเฉพาะ', emoji: '⏰', category: 'time',
    trick: 'AT = เวลาเฉพาะ',
    timeline: ['7:00', 'noon', 'midnight'],
    explain: '"at" ใช้กับเวลาที่แน่นอน เช่น ชั่วโมง'
  }
];

var PLACE_WORDS = PREPOSITION_WORDS.filter(function (w) { return w.category === 'place'; });
var TIME_WORDS = PREPOSITION_WORDS.filter(function (w) { return w.category === 'time'; });
