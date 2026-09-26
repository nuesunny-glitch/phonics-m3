#!/bin/bash
# Assembles final HTML pages for 02-Spelling by concatenating shared style/script
# fragments with per-page body content. Mirrors 01-Phonics/_tools/build.sh — see
# that file's header comment for why this bash approach exists instead of the
# Node generate.js pattern (no Node.js on this machine).
set -e
cd "$(dirname "$0")"

FONT_LINK='<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600;700;800&family=Mali:wght@600;700;800&display=swap" rel="stylesheet">'

build_page() {
  local title="$1"; local out_file="$2"; local with_audio="$3"; shift 3
  {
    printf '<!DOCTYPE html>\n<html lang="th">\n<head>\n<meta charset="UTF-8">\n<title>%s</title>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n%s\n<style>\n' "$title" "$FONT_LINK"
    cat combined-style.css
    printf '</style>\n<link rel="stylesheet" href="../Audio-System/audio-system.css">\n</head>\n<body>\n'
    printf '<a href="../home.html" style="display:inline-flex;align-items:center;gap:6px;margin:10px 0 0 10px;padding:8px 16px;background:#1e2b5c;color:#fff;font-family:Kanit,sans-serif;font-size:15px;font-weight:700;text-decoration:none;border-radius:999px;">🏡 Dashboard</a>\n'
    for f in "$@"; do cat "$f"; done
    printf '<script src="../Audio-System/audio-system.js"></script>\n'
    if [ "$with_audio" = "yes" ]; then cat audio-inline.html; fi
    printf '</body>\n</html>\n'
  } > "$out_file"
  echo "Wrote $out_file"
}

OUT=".."
build_page "บทเรียน: Spelling" "$OUT/lesson.html" yes body-lesson.html
build_page "ใบงาน: Spelling" "$OUT/worksheet.html" no body-worksheet.html
build_page "แบบทดสอบ: Spelling" "$OUT/quiz.html" yes body-quiz.html
build_page "เฉลย: Spelling" "$OUT/answer-key.html" no body-answerkey.html
build_page "หนังสือเรียน: Spelling" "$OUT/lesson-book.html" yes body-book-intro.html body-worksheet.html body-quiz.html body-answerkey.html body-book-closing.html

echo "Done."
