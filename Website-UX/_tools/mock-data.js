// Single source of mock user state for this UI-only prototype (Phase 2 —
// no backend yet). Every page reads from here so numbers stay consistent
// across Dashboard/Learning Map/Achievements/Profile instead of each page
// hardcoding its own guess. Swap this file for a real API call later.
var MOCK_USER = {
  name: 'น้องมิน',
  level: 4,
  xp: 1240,
  xpToNextLevel: 1500,
  streakDays: 7,
  totalStars: 23,
  longestStreak: 12,
  currentChapter: { id: 6, title: 'Present Simple', progressPct: 60 },
  joinDate: '12 มิ.ย. 2569'
};

// Maps a learning-map "node" to a REAL page already built elsewhere in this
// project, so Phase-2 navigation isn't a dead-end mockup where content
// already exists (course lessons + the 5 Adventure games).
var MOCK_MAP_NODES = [
  { id: 1, title: 'Phonics', icon: '🔤', status: 'done', href: '../index.html#c1-1' },
  { id: 2, title: 'Spelling', icon: '✏️', status: 'done', href: '../index.html#c2-1' },
  { id: 3, title: 'Sight Words', icon: '👀', status: 'done', href: '../index.html#c3-1' },
  { id: 4, title: 'Vocabulary', icon: '📖', status: 'done', href: '../index.html#c4-1' },
  { id: 5, title: 'Parts of Speech', icon: '🧩', status: 'done', href: '../index.html#c5-1' },
  { id: 6, title: 'Present Simple', icon: '⏰', status: 'current', href: '../index.html#c6-1' },
  { id: 7, title: 'Present Continuous', icon: '🏃', status: 'locked', href: '../index.html#c7-1' },
  { id: 8, title: 'Past Simple', icon: '⏳', status: 'locked', href: '../index.html#c8-1' },
  { id: 9, title: 'Future Tense', icon: '🔮', status: 'locked', href: '../index.html#c9-1' },
  { id: 10, title: 'WH-Questions', icon: '❓', status: 'locked', href: '../index.html#c10-1' },
  // Bonus game, not a numbered course chapter — status 'bonus' (not
  // 'done'/'current'/'locked') so it renders distinctly and is always
  // playable, never gated behind lesson progress.
  { id: 'preposition-adventure', title: 'Preposition Adventure', icon: '🧭', status: 'bonus', href: '../19-Preposition-Adventure/index.html' },
  { id: 'present-simple-adventure', title: 'Present Simple Adventure', icon: '⏰', status: 'bonus', href: '../21-Present-Simple-Adventure/index.html' }
];

var MOCK_BADGES = [
  { icon: '🔥', label: 'นักสู้ 7 วัน', unlocked: true },
  { icon: '⭐', label: 'สะสม 20 ดาว', unlocked: true },
  { icon: '🏃', label: 'เจ้าแห่งกริยา', unlocked: true, href: '../16-Verb-Adventure/index.html' },
  { icon: '🎨', label: 'เจ้าแห่งคุณศัพท์', unlocked: false, href: '../17-Adjective-Adventure/index.html' },
  { icon: '🎭', label: 'เจ้าแห่งสรรพนาม', unlocked: false, href: '../18-Pronoun-Adventure/index.html' },
  { icon: '🧭', label: 'เจ้าแห่งบุพบท', unlocked: false, href: '../19-Preposition-Adventure/index.html' },
  { icon: '🔗', label: 'เจ้าแห่งสันธาน', unlocked: false, href: '../20-Conjunction-Adventure/index.html' },
  { icon: '⏰', label: 'เจ้าแห่ง Present Simple', unlocked: false, href: '../21-Present-Simple-Adventure/index.html' },
  { icon: '📚', label: 'อ่านครบ 5 บท', unlocked: true },
  { icon: '💯', label: 'เต็ม 100 ครั้งแรก', unlocked: false }
];
