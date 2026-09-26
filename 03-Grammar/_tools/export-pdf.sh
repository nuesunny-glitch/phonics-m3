#!/bin/bash
# Export worksheet.html, quiz.html, answer-key.html to PDF via headless Edge.
# Usage: ./export-pdf.sh "G:\My Drive\English projects M3\03-Grammar\01-Verb to Be"
set -e
WINDIR="$1"
if [ -z "$WINDIR" ]; then
  echo "Usage: $0 <topic-folder-windows-path>"
  exit 1
fi

EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
if [ ! -f "$EDGE" ]; then
  EDGE="/c/Program Files/Microsoft/Edge/Application/msedge.exe"
fi

# Build a file:// URL from a Windows path (backslashes -> forward slashes, spaces -> %20)
to_url() {
  local p="$1"
  p="${p//\\//}"
  p="${p// /%20}"
  echo "file:///${p}"
}

for f in worksheet quiz answer-key; do
  html_win="$WINDIR\\$f.html"
  pdf_win="$WINDIR\\$f.pdf"
  url=$(to_url "$html_win")
  "$EDGE" --headless=new --disable-gpu --no-sandbox --print-to-pdf="$pdf_win" --print-to-pdf-no-header "$url" 2>&1 | grep -v "task_manager\|vbs_encoder" || true
  echo "Exported: $pdf_win"
done
