// Story Adventure — the 15-episode mission list. Metadata only (card
// content for the hub's progress map + episode cards) — only Episode 1
// has a real playable framework right now (episode-1-first-day/game.html);
// Episodes 2-15 are locked placeholders per the module spec ("Create ONLY
// the Story Adventure category and Episode 1 framework").
var EPISODES = [
  { n: 1, id: 'first-day', emoji: '🏫', title: 'First Day at School', desc: 'วันแรกที่โรงเรียน ทักทายและทำความรู้จักเพื่อนใหม่', difficulty: 'ง่าย', time: '10 นาที', xp: 50, href: 'episode-1-first-day/game.html', unlocked: true },
  { n: 2, id: 'school-bag', emoji: '🎒', title: 'Find My School Bag', desc: 'ตามหากระเป๋านักเรียนที่หายไปในโรงเรียน', difficulty: 'ง่าย', time: '8 นาที', xp: 50 },
  { n: 3, id: 'meet-teacher', emoji: '👩', title: 'Meet the Teacher', desc: 'ทำความรู้จักคุณครูคนใหม่ที่โรงเรียน', difficulty: 'ง่าย', time: '10 นาที', xp: 60 },
  { n: 4, id: 'new-friends', emoji: '👬', title: 'Make New Friends', desc: 'หาเพื่อนใหม่และชวนกันเล่นด้วยกัน', difficulty: 'ง่าย', time: '10 นาที', xp: 60 },
  { n: 5, id: 'classroom', emoji: '📚', title: 'In the Classroom', desc: 'เรียนรู้คำศัพท์ของใช้ในห้องเรียน', difficulty: 'ปานกลาง', time: '12 นาที', xp: 70 },
  { n: 6, id: 'lunch-time', emoji: '🍎', title: 'Lunch Time', desc: 'สั่งอาหารและพูดคุยกันตอนพักกลางวัน', difficulty: 'ง่าย', time: '10 นาที', xp: 60 },
  { n: 7, id: 'playground', emoji: '⚽', title: 'Playground', desc: 'ชวนเพื่อนเล่นกีฬาที่สนามเด็กเล่น', difficulty: 'ปานกลาง', time: '10 นาที', xp: 70 },
  { n: 8, id: 'library', emoji: '📖', title: 'Library', desc: 'ยืมหนังสือและพูดคุยกับบรรณารักษ์', difficulty: 'ปานกลาง', time: '12 นาที', xp: 80 },
  { n: 9, id: 'go-home', emoji: '🚌', title: 'Go Home', desc: 'ขึ้นรถบัสกลับบ้านหลังเลิกเรียน', difficulty: 'ง่าย', time: '8 นาที', xp: 60 },
  { n: 10, id: 'my-family', emoji: '🏠', title: 'My Family', desc: 'แนะนำสมาชิกในครอบครัวของฉัน', difficulty: 'ปานกลาง', time: '12 นาที', xp: 80 },
  { n: 11, id: 'convenience-store', emoji: '🛒', title: 'Convenience Store', desc: 'ซื้อของที่ร้านสะดวกซื้อใกล้บ้าน', difficulty: 'ปานกลาง', time: '12 นาที', xp: 90 },
  { n: 12, id: 'my-pet', emoji: '🐶', title: 'My Pet', desc: 'เล่ากับเพื่อนเกี่ยวกับสัตว์เลี้ยงแสนรัก', difficulty: 'ง่าย', time: '10 นาที', xp: 70 },
  { n: 13, id: 'rainy-day', emoji: '🌧', title: 'Rainy Day', desc: 'พูดคุยเรื่องสภาพอากาศในวันฝนตก', difficulty: 'ปานกลาง', time: '10 นาที', xp: 80 },
  { n: 14, id: 'birthday-party', emoji: '🎂', title: 'Birthday Party', desc: 'ไปงานวันเกิดของเพื่อนและอวยพร', difficulty: 'ปานกลาง', time: '12 นาที', xp: 90 },
  { n: 15, id: 'school-festival', emoji: '🏆', title: 'School Festival', desc: 'ภารกิจสุดท้าย! งานเทศกาลประจำโรงเรียน', difficulty: 'ยาก', time: '15 นาที', xp: 150 }
];
