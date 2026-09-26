/*
 * Builds index.pdf by printing many SMALL HTML chunks separately and
 * merging the resulting PDFs with pdf-lib.
 *
 * Why: headless Edge's `--print-to-pdf` silently truncates any single print
 * job whose content needs more than ~8 physical pages (verified empirically
 * — content past that point is simply missing from the output PDF, with no
 * error). This document needs ~50+ pages at the requested larger font
 * sizes, so each group's 100 rows is split into chunks of 40/40/20 rows
 * (each chunk is only 3-4 pages, safely under the ~8-page ceiling), printed
 * one at a time, then reassembled in the correct order into one final PDF.
 *
 * Usage: node generate-pdf.js
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
// pdf-lib is installed outside this Google-Drive-synced folder because npm's
// tar extraction gets corrupted by the Drive sync client here (package.json
// consistently landed as a 0-byte file when installed in-place).
const { PDFDocument, StandardFonts, rgb } = require('C:\\Users\\PRASER~1\\AppData\\Local\\Temp\\claude\\C--Users-prasert-johnpong\\fb1f841f-8f1a-40bd-8221-812ce07ca759\\scratchpad\\pdf-lib-install\\node_modules\\pdf-lib');
const R = require('./render-shared.js');

const CHUNK_SIZE = 40;

function findEdge() {
  const candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  throw new Error('msedge.exe not found');
}

function toFileUrl(winPath) {
  const p = winPath.replace(/\\/g, '/').replace(/ /g, '%20');
  return `file:///${p}`;
}

function printToPdf(edge, htmlPath, pdfPath, userDataDir) {
  execFileSync(edge, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    `--user-data-dir=${userDataDir}`,
    `--print-to-pdf=${pdfPath}`, '--no-pdf-header-footer',
    toFileUrl(htmlPath),
  ], { stdio: 'pipe', timeout: 60000 });
}

async function main() {
  const edge = findEdge();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'svwb-'));
  // Isolated profile dir so this headless instance doesn't contend for the
  // singleton profile lock held by the user's regular, already-open Edge
  // windows (sharing the default profile caused print jobs to hang/timeout).
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'svwb-profile-'));
  const chunkPdfPaths = [];

  try {
    // Chunk 1: cover + TOC
    {
      const html = R.wrapDocument(R.CHAPTER_NAME, R.coverPage() + '\n' + R.tocPage());
      const htmlPath = path.join(tmpDir, 'chunk-000-cover.html');
      const pdfPath = path.join(tmpDir, 'chunk-000-cover.pdf');
      fs.writeFileSync(htmlPath, html, 'utf8');
      console.log('Printing cover + TOC...');
      printToPdf(edge, htmlPath, pdfPath, userDataDir);
      chunkPdfPaths.push(pdfPath);
    }

    // One or more chunks per group
    let chunkNum = 1;
    for (const group of R.GROUPS) {
      const words = R.loadGroupWords(group);
      for (let start = 0; start < words.length; start += CHUNK_SIZE) {
        const slice = words.slice(start, start + CHUNK_SIZE);
        const isFirst = start === 0;
        const pageHtml = R.groupChunkPage(group, slice, start, words.length, isFirst);
        const html = R.wrapDocument(R.CHAPTER_NAME, pageHtml);
        const tag = String(chunkNum).padStart(3, '0');
        const htmlPath = path.join(tmpDir, `chunk-${tag}-${group.id}-${start}.html`);
        const pdfPath = path.join(tmpDir, `chunk-${tag}-${group.id}-${start}.pdf`);
        fs.writeFileSync(htmlPath, html, 'utf8');
        console.log(`Printing group ${group.id} rows ${start + 1}-${start + slice.length}...`);
        printToPdf(edge, htmlPath, pdfPath, userDataDir);
        chunkPdfPaths.push(pdfPath);
        chunkNum++;
      }
    }

    console.log('Merging', chunkPdfPaths.length, 'chunk PDFs...');
    const merged = await PDFDocument.create();
    for (const p of chunkPdfPaths) {
      const bytes = fs.readFileSync(p);
      const src = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach((pg) => merged.addPage(pg));
    }
    // Draw the footer (chapter name + page number) directly onto each merged
    // page. We can't rely on Chromium's native --print-to-pdf header/footer
    // here: it would number pages relative to each small chunk (e.g. "1/4"
    // repeated per chunk) rather than the final merged document, and its CLI
    // form offers no custom template. Drawing text post-merge guarantees
    // correct, consistent numbering across the whole 500-word document.
    const font = await merged.embedFont(StandardFonts.Helvetica);
    const pages = merged.getPages();
    const total = pages.length;
    const footerColor = rgb(0.45, 0.45, 0.45);
    const fontSize = 9;
    pages.forEach((pg, idx) => {
      const { width } = pg.getSize();
      const label = R.CHAPTER_NAME;
      const pageNumText = `Page ${idx + 1} / ${total}`;
      pg.drawText(label, { x: 34, y: 20, size: fontSize, font, color: footerColor });
      const pnWidth = font.widthOfTextAtSize(pageNumText, fontSize);
      pg.drawText(pageNumText, { x: width - 34 - pnWidth, y: 20, size: fontSize, font, color: footerColor });
    });

    const outBytes = await merged.save();
    const outPath = path.join(__dirname, 'index.pdf');
    fs.writeFileSync(outPath, outBytes);
    console.log('Wrote', outPath, '-', merged.getPageCount(), 'total pages');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
