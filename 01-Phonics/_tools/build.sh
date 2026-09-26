#!/bin/bash
# Assembles final HTML pages by concatenating per-page body content between a
# shared <head>/<body> shell. This is a bash stand-in for a real templating
# engine (this machine has no Node.js/Python) — but unlike the old version,
# CSS/JS are no longer inlined into every page. Each page instead REFERENCES
# the shared files (shared.css, shared-nav.js, shared-audio.js) via
# <link>/<script src>, so there is exactly one copy of each on disk and every
# page always uses the current version. See MASTER_TEMPLATE.md.
set -e
cd "$(dirname "$0")"

FONT_LINK='<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700;800&family=Mali:wght@600;700;800&display=swap" rel="stylesheet">'

build_page() {
  local title="$1"; local out_file="$2"; local with_audio="$3"; shift 3
  {
    printf '<!DOCTYPE html>\n<html lang="th">\n<head>\n<meta charset="UTF-8">\n<title>%s</title>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n%s\n<link rel="stylesheet" href="../_tools/shared.css">\n</head>\n<body>\n' "$title" "$FONT_LINK"
    for f in "$@"; do cat "$f"; done
    printf '<script src="../_tools/shared-nav.js"></script>\n'
    if [ "$with_audio" = "yes" ]; then printf '<script src="../_tools/shared-audio.js"></script>\n'; fi
    printf '</body>\n</html>\n'
  } > "$out_file"
  echo "Wrote $out_file"
}

# ---- 01-Alphabet ----
OUT1="../01-Alphabet"
build_page "บทเรียน: ตัวอักษรภาษาอังกฤษ A-Z" "$OUT1/lesson.html" yes body-01-lesson.html
build_page "ใบงาน: ตัวอักษรภาษาอังกฤษ A-Z" "$OUT1/worksheet.html" yes body-01-worksheet.html
build_page "แบบทดสอบ: ตัวอักษรภาษาอังกฤษ A-Z" "$OUT1/quiz.html" yes body-01-quiz.html
build_page "เฉลย: ตัวอักษรภาษาอังกฤษ A-Z" "$OUT1/answer-key.html" no body-01-answerkey.html
build_page "หนังสือเรียน: ตัวอักษรภาษาอังกฤษ A-Z" "$OUT1/lesson-book.html" yes body-01-book-intro.html body-01-worksheet.html body-01-quiz.html body-01-answerkey.html body-01-book-closing.html

# ---- 04-Short-Vowels ----
OUT4="../04-Short-Vowels"
build_page "บทเรียน: สระเสียงสั้น (Short Vowels)" "$OUT4/lesson.html" yes body-04-lesson.html
build_page "ใบงาน: สระเสียงสั้น (Short Vowels)" "$OUT4/worksheet.html" no body-04-worksheet.html
build_page "แบบทดสอบ: สระเสียงสั้น (Short Vowels)" "$OUT4/quiz.html" yes body-04-quiz.html
build_page "เฉลย: สระเสียงสั้น (Short Vowels)" "$OUT4/answer-key.html" no body-04-answerkey.html
build_page "หนังสือเรียน: สระเสียงสั้น (Short Vowels)" "$OUT4/lesson-book.html" yes body-04-book-intro.html body-04-worksheet.html body-04-quiz.html body-04-answerkey.html body-04-book-closing.html

# ---- 02-Consonant-Sounds ----
OUT2="../02-Consonant-Sounds"
build_page "บทเรียน: เสียงพยัญชนะเดี่ยว (Consonant Sounds)" "$OUT2/lesson.html" yes body-02-lesson.html
build_page "ใบงาน: เสียงพยัญชนะเดี่ยว (Consonant Sounds)" "$OUT2/worksheet.html" yes body-02-worksheet.html
build_page "แบบทดสอบ: เสียงพยัญชนะเดี่ยว (Consonant Sounds)" "$OUT2/quiz.html" yes body-02-quiz.html
build_page "เฉลย: เสียงพยัญชนะเดี่ยว (Consonant Sounds)" "$OUT2/answer-key.html" no body-02-answerkey.html
build_page "หนังสือเรียน: เสียงพยัญชนะเดี่ยว (Consonant Sounds)" "$OUT2/lesson-book.html" yes body-02-book-intro.html body-02-worksheet.html body-02-quiz.html body-02-answerkey.html body-02-book-closing.html

# ---- 03-Consonant-Digraphs ----
OUT3="../03-Consonant-Digraphs"
build_page "บทเรียน: พยัญชนะควบ (Consonant Digraphs)" "$OUT3/lesson.html" yes body-03-lesson.html
build_page "ใบงาน: พยัญชนะควบ (Consonant Digraphs)" "$OUT3/worksheet.html" yes body-03-worksheet.html
build_page "แบบทดสอบ: พยัญชนะควบ (Consonant Digraphs)" "$OUT3/quiz.html" yes body-03-quiz.html
build_page "เฉลย: พยัญชนะควบ (Consonant Digraphs)" "$OUT3/answer-key.html" no body-03-answerkey.html
build_page "หนังสือเรียน: พยัญชนะควบ (Consonant Digraphs)" "$OUT3/lesson-book.html" yes body-03-book-intro.html body-03-worksheet.html body-03-quiz.html body-03-answerkey.html body-03-book-closing.html

# ---- 05-Long-Vowels ----
OUT5="../05-Long-Vowels"
build_page "บทเรียน: สระเสียงยาว (Long Vowels)" "$OUT5/lesson.html" yes body-05-lesson.html
build_page "ใบงาน: สระเสียงยาว (Long Vowels)" "$OUT5/worksheet.html" yes body-05-worksheet.html
build_page "แบบทดสอบ: สระเสียงยาว (Long Vowels)" "$OUT5/quiz.html" yes body-05-quiz.html
build_page "เฉลย: สระเสียงยาว (Long Vowels)" "$OUT5/answer-key.html" no body-05-answerkey.html
build_page "หนังสือเรียน: สระเสียงยาว (Long Vowels)" "$OUT5/lesson-book.html" yes body-05-book-intro.html body-05-worksheet.html body-05-quiz.html body-05-answerkey.html body-05-book-closing.html

# ---- 06-Vowel-Teams-1 ----
OUT6="../06-Vowel-Teams-1"
build_page "บทเรียน: สระผสมกลุ่ม 1" "$OUT6/lesson.html" yes body-06-lesson.html
build_page "ใบงาน: สระผสมกลุ่ม 1" "$OUT6/worksheet.html" no body-06-worksheet.html
build_page "แบบทดสอบ: สระผสมกลุ่ม 1" "$OUT6/quiz.html" yes body-06-quiz.html
build_page "เฉลย: สระผสมกลุ่ม 1" "$OUT6/answer-key.html" no body-06-answerkey.html
build_page "หนังสือเรียน: สระผสมกลุ่ม 1" "$OUT6/lesson-book.html" yes body-06-book-intro.html body-06-worksheet.html body-06-quiz.html body-06-answerkey.html body-06-book-closing.html

# ---- 07-Vowel-Teams-2 ----
OUT7="../07-Vowel-Teams-2"
build_page "บทเรียน: สระผสมกลุ่ม 2" "$OUT7/lesson.html" yes body-07-lesson.html
build_page "ใบงาน: สระผสมกลุ่ม 2" "$OUT7/worksheet.html" no body-07-worksheet.html
build_page "แบบทดสอบ: สระผสมกลุ่ม 2" "$OUT7/quiz.html" yes body-07-quiz.html
build_page "เฉลย: สระผสมกลุ่ม 2" "$OUT7/answer-key.html" no body-07-answerkey.html
build_page "หนังสือเรียน: สระผสมกลุ่ม 2" "$OUT7/lesson-book.html" yes body-07-book-intro.html body-07-worksheet.html body-07-quiz.html body-07-answerkey.html body-07-book-closing.html

# ---- 08-R-Controlled-Vowels ----
OUT8="../08-R-Controlled-Vowels"
build_page "บทเรียน: R-controlled Vowels" "$OUT8/lesson.html" yes body-08-lesson.html
build_page "ใบงาน: R-controlled Vowels" "$OUT8/worksheet.html" no body-08-worksheet.html
build_page "แบบทดสอบ: R-controlled Vowels" "$OUT8/quiz.html" yes body-08-quiz.html
build_page "เฉลย: R-controlled Vowels" "$OUT8/answer-key.html" no body-08-answerkey.html
build_page "หนังสือเรียน: R-controlled Vowels" "$OUT8/lesson-book.html" yes body-08-book-intro.html body-08-worksheet.html body-08-quiz.html body-08-answerkey.html body-08-book-closing.html

# ---- 09-Blending ----
OUT9="../09-Blending"
build_page "บทเรียน: ผสมเสียงเป็นคำ (Blending)" "$OUT9/lesson.html" yes body-09-lesson.html
build_page "ใบงาน: ผสมเสียงเป็นคำ (Blending)" "$OUT9/worksheet.html" no body-09-worksheet.html
build_page "แบบทดสอบ: ผสมเสียงเป็นคำ (Blending)" "$OUT9/quiz.html" yes body-09-quiz.html
build_page "เฉลย: ผสมเสียงเป็นคำ (Blending)" "$OUT9/answer-key.html" no body-09-answerkey.html
build_page "หนังสือเรียน: ผสมเสียงเป็นคำ (Blending)" "$OUT9/lesson-book.html" yes body-09-book-intro.html body-09-worksheet.html body-09-quiz.html body-09-answerkey.html body-09-book-closing.html

echo "Done."
