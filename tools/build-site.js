/*
 * Build script for the unified English M.3 Course website.
 * Reads tools/course-manifest.json, loads each chapter's topic markdown
 * file(s), strips the leading H1 + trailing nav footer, and injects the
 * resulting COURSE data structure into script.js (built from
 * tools/script.template.js).
 *
 * Chapters/topics whose markdown file does not exist yet are skipped, so
 * the site always reflects exactly what has been written so far.
 *
 * Usage: node tools/build-site.js
 * (run from anywhere; paths below are relative to this file's location)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const manifestPath = path.join(__dirname, 'course-manifest.json');
const templatePath = path.join(__dirname, 'script.template.js');
const outPath = path.join(ROOT, 'script.js');

function stripTrailingNav(lines) {
  let end = lines.length;
  while (end > 0) {
    const t = lines[end - 1].trim();
    if (
      t === '' ||
      t === '---' ||
      t.startsWith('⬅️') ||
      t.startsWith('➡️') ||
      t.startsWith('🎉')
    ) {
      end--;
    } else {
      break;
    }
  }
  return lines.slice(0, end);
}

function extractTitle(h1Line) {
  const m = h1Line.match(/^#\s+(.+)$/);
  if (!m) return null;
  return m[1].trim().replace(/^(หัวข้อที่|บทที่)\s*\d+\s*[:.]\s*/, '').trim();
}

function loadTopic(chapterFolder, topicMeta) {
  const filePath = path.join(ROOT, chapterFolder, topicMeta.file);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  let lines = raw.split('\n');

  const title = extractTitle(lines[0]) || topicMeta.file;
  lines = lines.slice(1);
  while (lines.length && lines[0].trim() === '') lines = lines.slice(1);
  if (lines.length && lines[0].trim() === '---') lines = lines.slice(1);
  while (lines.length && lines[0].trim() === '') lines = lines.slice(1);

  lines = stripTrailingNav(lines);
  const body = lines.join('\n').trim();

  return { id: topicMeta.id, icon: topicMeta.icon, title, body };
}

function build() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const course = [];

  manifest.forEach((chapterMeta) => {
    const topics = [];
    chapterMeta.topics.forEach((topicMeta) => {
      const topic = loadTopic(chapterMeta.folder, topicMeta);
      if (topic) topics.push(topic);
    });
    if (topics.length > 0) {
      course.push({
        id: chapterMeta.id,
        folder: chapterMeta.folder,
        title: chapterMeta.title,
        icon: chapterMeta.icon,
        topics,
      });
    }
  });

  const template = fs.readFileSync(templatePath, 'utf8');
  const dataDecl = 'const COURSE = ' + JSON.stringify(course, null, 2) + ';';
  const finalContent = template.replace('/*__COURSE_DATA__*/', dataDecl);
  fs.writeFileSync(outPath, finalContent, 'utf8');

  console.log('Wrote', outPath);
  let totalTopics = 0;
  course.forEach((ch) => {
    totalTopics += ch.topics.length;
    console.log(` - Chapter ${ch.id} [${ch.folder}] "${ch.title}": ${ch.topics.length} topic(s)`);
  });
  console.log(`Total: ${course.length} chapter(s), ${totalTopics} page(s)`);

  const missing = [];
  manifest.forEach((chapterMeta) => {
    chapterMeta.topics.forEach((topicMeta) => {
      const filePath = path.join(ROOT, chapterMeta.folder, topicMeta.file);
      if (!fs.existsSync(filePath)) missing.push(path.join(chapterMeta.folder, topicMeta.file));
    });
  });
  if (missing.length) {
    console.log(`\n(${missing.length} topic file(s) not written yet, skipped):`);
    missing.forEach((m) => console.log('   -', m));
  }
}

build();
