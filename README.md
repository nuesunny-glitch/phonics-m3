# English M.3 Course
### คอร์สเรียนภาษาอังกฤษ สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 3 (พื้นฐานต่ำมาก → พร้อมสอบเข้า ม.4)

โปรเจกต์นี้สร้างขึ้นเพื่อปูพื้นฐานภาษาอังกฤษตั้งแต่ระดับเสียง (Phonics) ไปจนถึง
แนวข้อสอบเข้า ม.4 (Entrance Exam) สำหรับนักเรียนที่ไม่มีพื้นฐานมาก่อน มีทั้งหมด
**15 บท** ครบเรียบร้อยแล้วทุกบท พร้อม**เว็บไซต์เรียนออนไลน์แบบรวมทั้งหลักสูตร**

## 🌐 วิธีเปิดเรียน

เปิดไฟล์ [`index.html`](./index.html) ด้วยเบราว์เซอร์ (ดับเบิลคลิกได้เลย ไม่ต้องใช้
เซิร์ฟเวอร์) จะได้เว็บไซต์ที่มี:
- เมนูสารบัญครบทั้ง 15 บท (บทที่ 1 Phonics ขยายเป็น 9 หัวข้อย่อยได้)
- ปุ่ม Previous/Next เปลี่ยนหน้าได้ทั้งหลักสูตร (ข้ามบทได้อัตโนมัติ)
- Progress Bar, Dark Mode, Animation, รองรับมือถือ

## 📁 โครงสร้างโปรเจกต์

| ไฟล์/โฟลเดอร์ | หน้าที่ |
|---|---|
| `index.html`, `style.css`, `script.js` | เว็บไซต์เรียนออนไลน์ (รวมทั้งหลักสูตร) |
| `tools/course-manifest.json` | รายการบท/หัวข้อย่อยทั้งหมด (แหล่งข้อมูลหลัก) |
| `tools/build-site.js` | สคริปต์ประกอบเนื้อหาจาก .md ทุกบทเข้า script.js |
| `tools/script.template.js` | โค้ดหน้าเว็บ (parser + UI logic) ก่อนฝังข้อมูล |
| `0X-ชื่อบท/*.md` | เนื้อหาแต่ละบท (ต้นฉบับ Markdown) |
| `course-outline.md` | ภาพรวมและสถานะแต่ละบท |

### วิธี Build ใหม่ (หลังแก้ไขเนื้อหา .md หรือแก้ template)

```
node tools/build-site.js
```

คำสั่งนี้จะอ่านไฟล์ .md ทุกบทตาม `tools/course-manifest.json` แล้วสร้าง
`script.js` ใหม่ทั้งหมด (บทที่ยังไม่มีไฟล์เนื้อหาจะถูกข้ามอัตโนมัติ)

## 📑 รายชื่อบททั้ง 15 บท

| # | บท | โฟลเดอร์ |
|---|---|---|
| 1 | Phonics (9 หัวข้อย่อย) | [`01-Phonics/`](./01-Phonics/) |
| 2 | Spelling | [`02-Spelling/`](./02-Spelling/) |
| 3 | Sight Words | [`03-Sight-Words/`](./03-Sight-Words/) |
| 4 | Vocabulary | [`04-Vocabulary/`](./04-Vocabulary/) |
| 5 | Parts of Speech | [`05-Parts-of-Speech/`](./05-Parts-of-Speech/) |
| 6 | Present Simple | [`06-Present-Simple/`](./06-Present-Simple/) |
| 7 | Present Continuous | [`07-Present-Continuous/`](./07-Present-Continuous/) |
| 8 | Past Simple | [`08-Past-Simple/`](./08-Past-Simple/) |
| 9 | Future Tense | [`09-Future-Tense/`](./09-Future-Tense/) |
| 10 | WH-Questions | [`10-WH-Questions/`](./10-WH-Questions/) |
| 11 | Conversation | [`11-Conversation/`](./11-Conversation/) |
| 12 | Reading | [`12-Reading/`](./12-Reading/) |
| 13 | Error Detection | [`13-Error-Detection/`](./13-Error-Detection/) |
| 14 | Grammar Summary | [`14-Grammar-Summary/`](./14-Grammar-Summary/) |
| 15 | Entrance Exam | [`15-Entrance-Exam/`](./15-Entrance-Exam/) |

## องค์ประกอบในแต่ละบท

**บทที่ 1 (Phonics)** แบ่งเป็น 9 หัวข้อย่อย แต่ละหัวข้อมี: อธิบายภาษาไทย,
ตัวอย่าง, แบบฝึกหัด, เฉลย, เทคนิคจำ, ข้อผิดพลาดที่เด็กไทยพบบ่อย

**บทที่ 2-15** แต่ละบทมี 1 หน้า ครบ 8 องค์ประกอบ: อธิบายภาษาไทย, ตัวอย่าง,
ตารางสรุป, Mind Map, Infographic (สเปกออกแบบ), แบบฝึกหัด+เฉลย, Quiz+เฉลย,
Flashcards

## บทบาททีมบริหารการศึกษา
โปรเจกต์นี้ผูกกับบันทึกการสอนใน `CLAUDE.md` (ระดับผู้ใช้) ซึ่งกำหนดบทบาทครูประจำวิชา
ไว้ 6 คน (ครูคณิต, ครูอิ้ง, ครูวิทยา, ครูสตางค์, ครูธรรมะ, ครูเซล) — สำหรับคอร์สนี้
"ครูอิ้ง" จะเป็นผู้ดูแลหลักด้านภาษาอังกฤษ

## สถานะโปรเจกต์
✅ ครบทั้ง 15 บท (23 หน้าเนื้อหารวม) — ดูรายละเอียดสถานะที่
[`course-outline.md`](./course-outline.md)
