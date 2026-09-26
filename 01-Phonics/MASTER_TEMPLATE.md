# Master Template — English M.3 Course HTML Lesson System

เอกสารนี้อธิบายโครงสร้างของ `01-Phonics/` ซึ่งใช้เป็น **ต้นแบบ (master template)**
สำหรับสร้างชุด HTML ของบทเรียนอื่น ๆ ในคอร์สต่อไป (02-Spelling, 03-Grammar
ที่มีอยู่แล้วยังใช้โครงสร้างเวอร์ชันเก่ากว่า — ไม่ได้ถูกแก้ในรอบนี้)

> ไม่มี Node.js/Python บนเครื่องที่ใช้พัฒนา — ทุกอย่างในระบบนี้ทำงานด้วย
> ไฟล์ HTML/CSS/JS ธรรมดา + bash script ต่อไฟล์ ไม่ต้องใช้ build tool ใด ๆ
> ตอนเปิดใช้งานจริง (แค่ดับเบิลคลิกเปิดไฟล์ HTML ก็ใช้ได้)

---

## 1. โครงสร้างไฟล์

```
01-Phonics/
  MASTER_TEMPLATE.md          ← เอกสารนี้
  01-alphabet.md ... 09-blending.md   ← เนื้อหาต้นฉบับ (ใช้โดยเว็บไซต์หลัก index.html)
  README.md
  _tools/                     ← ไฟล์ "แหล่งความจริงเดียว" (single source of truth)
    shared.css                ← CSS ทั้งหมดของทุกหน้า (ไฟล์เดียว ไม่มีการ copy)
    shared-nav.js              ← ระบบ Home/Progress/Prev/Next (ไฟล์เดียว)
    shared-audio.js            ← ระบบเสียง Web Speech API (ไฟล์เดียว)
    build.sh                   ← สคริปต์ประกอบ body fragment + head/script อ้างอิง
    body-<NN>-lesson.html      ← เนื้อหา body ของแต่ละไฟล์ต่อหัวข้อ (ต้นฉบับที่แก้ไข)
    body-<NN>-worksheet.html
    body-<NN>-quiz.html
    body-<NN>-answerkey.html
    body-<NN>-book-intro.html  ← ส่วนต้น+กลางของ lesson-book (cover, word bank ฯลฯ)
    body-<NN>-book-closing.html
  01-Alphabet/                 ← ไฟล์ผลลัพธ์ (generated) — ห้ามแก้ตรงนี้โดยตรง
    lesson.html
    lesson-book.html
    quiz.html
    worksheet.html
    answer-key.html
  02-Consonant-Sounds/  ... 09-Blending/   (โครงเดียวกัน รวม 9 หัวข้อ)
```

**กฎสำคัญ:** ไฟล์ผลลัพธ์ (`01-Alphabet/*.html` ฯลฯ) เป็นไฟล์ที่ **generate จาก
build.sh เสมอ** ห้ามแก้ไขตรง ๆ เพราะจะถูกทับตอนรัน build.sh ครั้งถัดไป — แก้ที่
`_tools/body-*.html` แล้วรัน `node ... ` ไม่ได้ ให้รัน `bash build.sh` แทน

## 2. วิธี build ใหม่

```bash
cd 01-Phonics/_tools
bash build.sh
```

สคริปต์จะไล่ต่อ (concatenate) แต่ละ `body-*.html` เข้ากับ head/script boilerplate
แล้วเขียนไฟล์ผลลัพธ์ทับใน `01-Phonics/<Topic>/*.html` ทั้ง 45 ไฟล์ (9 หัวข้อ × 5 ไฟล์)

## 3. ระบบไฟล์ shared (ทำไมไม่มีโค้ดซ้ำ)

ทุกหน้า HTML **reference** ไฟล์ shared ผ่าน `<link>`/`<script src>` แทนการ inline
CSS/JS เข้าไปในตัวเอง — เบราว์เซอร์โหลดไฟล์เหล่านี้ตรง ๆ ผ่าน `file://` ได้ปกติ
(ต่างจาก `fetch`/AJAX ที่ติด CORS เวลาเปิดไฟล์ local) ดังนั้น CSS/JS มีอยู่แค่
**ที่เดียวจริง ๆ** แก้ไขจุดเดียวมีผลทุกหน้า:

```html
<head>
  ...
  <link rel="stylesheet" href="../_tools/shared.css">
</head>
<body>
  ...body content...
  <script src="../_tools/shared-nav.js"></script>
  <script src="../_tools/shared-audio.js"></script>  <!-- เฉพาะหน้าที่มีเสียง -->
</body>
```

path เป็น `../_tools/...` เพราะไฟล์ทุกหน้าอยู่ที่ `01-Phonics/<Topic>/<file>.html`
(ลึกลงมา 1 ชั้นจาก `01-Phonics/`)

**`shared-audio.js` โหลดใน:** lesson.html, lesson-book.html, quiz.html เสมอ
**และใน worksheet.html เฉพาะบางหัวข้อ** (01, 02, 03, 05) — **ไม่โหลดใน**
answer-key.html เลย (เอกสารครูอย่างเดียว ไม่มีเหตุผลต้องมีเสียง)

**กฎการใส่เสียงใน worksheet:** ใส่ได้เฉพาะข้อที่ "คำเต็มถูกแสดงไว้แล้วในโจทย์"
(เช่น ให้ฟัง "cat" แล้วตอบว่าเสียง c แข็งหรืออ่อน) **ห้ามใส่เมื่อช่องว่างคือคำตอบ
ที่ต้องเติมโดยตรง** (เช่น `c_t` เติมสระ หรือ `_ueen` เติมตัวอักษรต้นคำ) เพราะปุ่ม
ฟังจะเฉลยคำตอบไปในตัว — เหตุผลนี้คือทำไม 04, 06, 07, 08, 09 ถึงไม่มีปุ่มเสียงใน
worksheet เลย (ทุกข้อในหัวข้อเหล่านั้นเป็นแบบเติมตัวอักษร/สระที่หายไปโดยตรง)
ส่วน 05 (Magic E) ใส่เสียงได้เฉพาะ "คำตั้งต้นก่อนเติม e" (เช่น cap) ไม่ใส่ที่คำ
คำตอบหลังเติม e

**`shared-nav.js` โหลดทุกหน้ารวม worksheet/answer-key** (ตามที่ระบุว่า "ทุกหน้า
ต้องมี Home/Prev/Next/Progress") — ตัว nav bar เองซ่อนอัตโนมัติตอนสั่งพิมพ์
(`@media print`) ไม่กระทบกระดาษพิมพ์

## 4. ระบบ Navigation (shared-nav.js)

ไฟล์เดียวมี:
- **`TOPICS`** array (9 รายการ: `{folder, title}`) — ลำดับหัวข้อ Phonics 1-9
- **`FILETYPES`** array (5 รายการ: `{file, label, icon}`) — lesson → lesson-book
  → quiz → worksheet → answer-key
- สร้าง **`PAGE_SEQUENCE`** (45 รายการ) จากการวนลูป `TOPICS × FILETYPES` ตอนรันจริง
  ในเบราว์เซอร์ — ไม่ต้อง hardcode 45 รายการที่ไหนอีก
- ตรวจตำแหน่งหน้าปัจจุบันจาก `location.pathname` เอง (อ่าน 2 ส่วนท้ายของ path
  คือ `<Topic>/<file>.html`) **ไม่ต้องฝัง id ใด ๆ ไว้ในแต่ละหน้า**
- Home ลิงก์ไปเว็บไซต์หลัก `../../index.html`
- Previous/Next พาไปหน้าก่อน-หลังใน `PAGE_SEQUENCE` (ข้ามหัวข้อเองอัตโนมัติเมื่อ
  ครบ 5 ไฟล์ของหัวข้อนั้น) ปุ่มจะกลายเป็น `<span class="disabled">` ที่หน้าแรก/
  หน้าสุดท้ายของคอร์ส
- Progress bar แสดง % + "หัวข้อที่ X/9 · ชื่อหัวข้อ — ไอคอน ประเภทไฟล์ · หน้า Y/45"

**เพิ่มหัวข้อใหม่:** เติม object ใหม่ใน `TOPICS` array ที่ `_tools/shared-nav.js`
(1 จุด) ระบบจะคำนวณ PAGE_SEQUENCE/Progress ใหม่ให้อัตโนมัติทุกหน้า

## 5. ระบบเสียง (shared-audio.js)

ใช้ **Web Speech API** (`speechSynthesis`) เลือกเสียง `en-US`/`en-GB` เท่านั้น
(กรอง `getVoices()` หา lang ขึ้นต้น `en`, ตั้ง `utterance.lang='en-US'` เสมอเป็น
fallback) ปุ่มเสียงทำงานผ่าน `data-audio` attribute + event delegation:

```html
<button class="audio-btn" data-audio="word" data-text="cat">🔊 คำเต็ม</button>
<button class="audio-btn" data-audio="sound" data-text="c">🔊 เสียง c</button>
<button class="audio-btn split" data-audio="split" data-word="cat" data-parts="c,a,t">🔤 แยกเสียง</button>
<button class="audio-btn sentence" data-audio="sentence" data-text="I have a cat.">🔊 ฟังประโยค</button>
```

- `data-audio="word"` — พูดคำเต็มตรง ๆ (สะกดถูกต้องเสมอ) หรือ "ชื่อเรียก" ตัวอักษร
  ถ้า `data-text` เป็นตัวอักษรเดี่ยว (เช่น `data-text="A"` พูดว่า "ay" ไม่ใช่เสียง
  Phonics)
- `data-audio="sound"` (เพิ่มเข้ามา 2026-09-26) — พูด**เสียง Phonics ของตัวอักษร
  เดี่ยว** โดยตรง ไม่ใช่ชื่อเรียก ใช้ตาราง `SOUND_MAP` เดียวกับ `split` แปลง
  `data-text` (เช่น `a`, `b`, `c` ตัวพิมพ์เล็ก) เป็นข้อความประมาณเสียง (เช่น
  `a`→"ah", `b`→"buh", `c`→"kuh") ใช้ตอนหน้าเรียนต้องการฝึกเสียง Phonics ของ
  ตัวอักษรเดี่ยว ไม่ใช่ชื่อเรียก (เช่น `01-Alphabet/lesson.html` หลัง
  2026-09-26 — ดูหมายเหตุด้านล่าง) ต่างจาก `split` ตรงที่ `sound` พูดแค่เสียง
  เดียวจบ ไม่มีการต่อด้วยคำเต็ม
- `data-audio="split"` — **กฎ Phonics: พูดเสียงตัวอักษร/หน่วยเสียงทีละตัวก่อน
  แล้วค่อยพูดคำเต็มปิดท้าย** เช่น c → a → t → "cat" ใช้ตาราง `SOUND_MAP` ใน
  `shared-audio.js` แปลง grapheme (เช่น `c`, `sh`, `ai`) เป็นข้อความประมาณเสียง
  ที่ TTS ภาษาอังกฤษออกเสียงได้ใกล้เคียงหน่วยเสียงจริงมากกว่าพูดชื่อตัวอักษรตรง ๆ
  (เช่น `c`→"kuh" ไม่ใช่ "see") — คั่นแต่ละเสียงด้วยหน่วงเวลาสั้น ๆ ผ่าน
  `utterance.onend` chain
- `data-audio="sentence"` — พูดประโยคเต็ม

**หน้า `01-Alphabet/lesson.html` เป็นข้อยกเว้น (2026-09-26):** เดิมตาราง A-Z
สอน "ชื่อเรียก" ตัวอักษร (A=เอ, B=บี) ด้วย `data-audio="word"` และมีข้อความ
อธิบายชัดเจนว่าเสียงจริงจะสอนในหัวข้อถัดไป ผู้ใช้ขอให้เปลี่ยนหน้านี้ทั้งหน้าให้
สอน**เสียง Phonics โดยตรงแทนชื่อเรียก** จึงเปลี่ยนคอลัมน์ที่ 2 ของตารางเป็นเสียง
Phonics ตาม `thai_phonics_sound_standard.md` และเปลี่ยนปุ่มตัวอักษรเดี่ยวเป็น
`data-audio="sound"` ทั้งหมด — เป็นหน้าเดียวในโปรเจกต์ที่ตั้งใจสอนเสียงตั้งแต่
หัวข้อแรก ไม่ใช่รูปแบบมาตรฐานของ topic อื่น
- แถบลอยมุมขวาล่าง "🐢 ช้า / 🐇 ปกติ" ปรับความเร็ว (rate 0.55 / 1.0) จำค่าไว้ใน
  `localStorage` ข้ามหน้าได้ในเซสชันเดียวกัน
- กดซ้ำได้ไม่จำกัด (ไม่มี debounce) — ก่อนพูดใหม่จะ `speechSynthesis.cancel()`
  กันเสียงซ้อน

**ตารางถอดเสียงไทยที่แสดงบนหน้าเว็บ (ข้อความ ไม่ใช่เสียง):** อยู่ใน
`body-*.html` โดยตรง (ไม่ใช่ shared file) — ดูตารางเต็มและที่มาที่ memory
`thai_phonics_sound_standard.md` ตัวอย่างรูปแบบ:
`c-a-t → เคอะ-แอะ-เทอะ → cat (แค่ท)` — **นี่เป็นข้อความแสดงผลเท่านั้น ไม่เกี่ยวกับ
เสียง TTS ที่พูดจริง** (TTS ใช้ `SOUND_MAP` ภาษาอังกฤษข้างบนแยกต่างหาก เพราะเสียง
`en-US` อ่านตัวอักษรไทยไม่ได้ถูกต้อง)

## 6. CSS Class อ้างอิงหลัก (จาก `shared.css`)

| Class | ใช้ทำอะไร |
|---|---|
| `.sheet` | กรอบหน้ากระดาษ A4 (ทุกหน้า) |
| `.banner` / `.banner.teacher` | แถบหัวข้อสีรุ้ง / แถบสีแดงสำหรับหน้าเฉลยครู |
| `.card.c1`–`.c6` | การ์ดคำถาม quiz (สีหมุนเวียน 6 สี) |
| `.choice-grid` / `.choice` | ตัวเลือก ก-ง |
| `.word-grid` / `.word-card` | คลังคำศัพท์ (Word Bank) มี emoji + breakdown + เสียง |
| `.sentence-list` / `.sentence-card` | ประโยคตัวอย่างพร้อมปุ่มฟัง |
| `.mistake-card` | การ์ด "ข้อผิดพลาดที่พบบ่อย" (wrong/why/right) |
| `.section-banner.sb-c1`–`.sb-c6`/`.sb-teacher` | หัวข้อย่อยใน lesson-book |
| `.cover-page` | หน้าปกของ lesson-book |
| `.mindmap-wrap` / `.mindmap-branch.mb-a`–`.mb-f` | แผนผังความคิด |
| `.teacher-poster` | โปสเตอร์สรุปท้ายเล่มจากครูอิ้ง |
| `.qlist.two-col` / `.blank` | รายการข้อสอบเติมคำในใบงาน |
| `.answer-table` | ตารางเฉลย |
| `.phonics-navbar` | แถบ nav ลอยด้านบน (ใหม่) |
| `.speed-toggle` | แถบปรับความเร็วเสียงลอยมุมขวาล่าง |

## 7. Responsive

`shared.css` มี breakpoint ที่ `max-width:640px` (มือถือ/แท็บเล็ตแนวตั้ง) และ
`max-width:400px` (มือถือจอเล็ก) ปรับ: `.word-grid`/`.mindmap-branches` เหลือ
1-2 คอลัมน์, `.choice-grid` เหลือ 1 คอลัมน์, `.card-body`/`.info-row` เรียง
แนวตั้ง, ย่อขนาดตัวอักษร banner/cover, nav bar ย่อ label ปุ่มเมื่อจอแคบมาก
ทดสอบผ่าน Browser tool ที่ 375px/600px/1280px แล้วไม่มี horizontal overflow

## 8. ขั้นตอนสร้างหัวข้อใหม่ (ภายใน 01-Phonics)

1. สร้างโฟลเดอร์ผลลัพธ์ `01-Phonics/<NN>-<Name>/`
2. เขียน `_tools/body-<NN>-lesson.html`, `body-<NN>-worksheet.html`,
   `body-<NN>-quiz.html`, `body-<NN>-answerkey.html`,
   `body-<NN>-book-intro.html`, `body-<NN>-book-closing.html`
   (ใช้ CSS class จากข้อ 6, ปุ่มเสียงจากข้อ 5 — ดูไฟล์หัวข้อ 01/04 เป็นตัวอย่าง)
3. เติม object ใหม่ใน `TOPICS` array ที่ `_tools/shared-nav.js`
4. เติมบรรทัด `build_page ...` ใหม่ 5 บรรทัดใน `_tools/build.sh`
5. รัน `bash build.sh`
6. ตรวจสอบผ่านเบราว์เซอร์: console ไม่มี error, nav bar ถูกต้อง, เสียงทำงาน,
   responsive ไม่แตก, `@media print` ซ่อน nav/เสียงถูกต้อง

## 9. ขั้นตอนเอาไปใช้กับบทอื่น (02-Spelling ฯลฯ) ในอนาคต

02-Spelling/03-Grammar **ยังไม่ได้ย้ายมาใช้ระบบนี้** (ยังเป็น CSS/JS inline
แบบเดิม) หากต้องการอัปเกรดในอนาคต แนวทางคือทำซ้ำโครงสร้างข้อ 1-2 ทั้งชุด
(สร้าง `<บท>/_tools/shared.css`, `shared-nav.js` ที่มี `TOPICS`/`FILETYPES`
ของบทนั้นเอง, `shared-audio.js`, `build.sh`) — แต่ละบทมีชุด shared ของตัวเอง
แยกกัน ไม่ได้ใช้ไฟล์ shared ร่วมข้ามบท เพื่อให้แต่ละบทยังคง self-contained
และแก้ไขบทหนึ่งไม่กระทบอีกบท
