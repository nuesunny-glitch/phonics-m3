/*
 * Builds the single combined index.html (cover + TOC + all 5 groups) for
 * on-screen viewing in a browser. All content comes verbatim from
 * data-long-*.json — this file controls presentation only.
 *
 * For the PDF, see generate-pdf.js: headless Edge's print-to-pdf silently
 * truncates any single print job that needs more than ~8 pages, so the PDF
 * is built from many small per-chunk print jobs merged together instead of
 * printing this file directly.
 *
 * Usage: node generate.js
 */
const fs = require('fs');
const path = require('path');
const R = require('./render-shared.js');

const bodyParts = [R.coverPage(), R.tocPage(), ...R.GROUPS.map(R.groupPageFull)];
const html = R.wrapDocument(R.CHAPTER_NAME, bodyParts.join('\n'));

const outPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Wrote', outPath);
console.log('Total words:', R.GROUPS.reduce((s, g) => s + R.loadGroupWords(g).length, 0));
