#!/usr/bin/env node
/**
 * CSV → graduates.js / projects.js 변환 스크립트
 *
 * 사용법:
 *   node scripts/csv-to-data.js --graduates path/to/graduates.csv
 *   node scripts/csv-to-data.js --projects  path/to/projects.csv
 *   node scripts/csv-to-data.js --graduates graduates.csv --projects projects.csv
 *
 * CSV 컬럼 형식:
 *
 * [graduates.csv]
 *   id, studentId, name, tab, role, profileImage
 *   g-01, 2022001001, 홍길동, multimedia, pm, /images/profiles/홍길동.jpg
 *
 * [projects.csv]
 *   id, studentId, tab, role, title, thumbnail, description, videoUrl,
 *   proposalImages, contactEmail, contactPhone
 *   (proposalImages: 세미콜론으로 구분  ex. /images/a.jpg;/images/b.jpg)
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const SRC_DATA  = path.join(ROOT, 'src', 'data');

/* ── CSV parser ──────────────────────────────────────────────────── */
function parseCsv(raw) {
  const lines = raw.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

/* ── graduates ───────────────────────────────────────────────────── */
function generateGraduates(rows) {
  const entries = rows.map((r) =>
    `  { id: '${r.id}', studentId: '${r.studentId}', name: '${r.name}', ` +
    `tab: '${r.tab}', role: '${r.role}', profileImage: '${r.profileImage}' },`
  );

  return `export const graduates = [\n${entries.join('\n')}\n];\n\n` +
    `export const graduateByStudentId = Object.fromEntries(\n` +
    `  graduates.map((g) => [g.studentId, g])\n);\n`;
}

/* ── projects ────────────────────────────────────────────────────── */
function generateProjects(rows) {
  const entries = rows.map((r) => {
    const proposals = r.proposalImages
      ? r.proposalImages.split(';').filter(Boolean).map((p) => `'${p.trim()}'`).join(', ')
      : '';
    return (
      `  {\n` +
      `    id: '${r.id}', studentId: '${r.studentId}',\n` +
      `    tab: '${r.tab}', role: '${r.role}',\n` +
      `    title: '${r.title}',\n` +
      `    thumbnail: '${r.thumbnail}',\n` +
      `    description: '${r.description.replace(/'/g, "\\'")}',\n` +
      `    videoUrl: '${r.videoUrl}',\n` +
      `    proposalImages: [${proposals}],\n` +
      `    contact: { email: '${r.contactEmail}', phone: ${r.contactPhone ? `'${r.contactPhone}'` : 'null'} },\n` +
      `  },`
    );
  });

  return `export const projects = [\n${entries.join('\n')}\n];\n`;
}

/* ── main ────────────────────────────────────────────────────────── */
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
};

const graduatesCsv = flag('--graduates');
const projectsCsv  = flag('--projects');

if (!graduatesCsv && !projectsCsv) {
  console.error('사용법: node scripts/csv-to-data.js --graduates <path> [--projects <path>]');
  process.exit(1);
}

if (graduatesCsv) {
  const raw  = fs.readFileSync(path.resolve(graduatesCsv), 'utf8');
  const rows = parseCsv(raw);
  const out  = generateGraduates(rows);
  const dest = path.join(SRC_DATA, 'graduates.js');
  fs.writeFileSync(dest, out, 'utf8');
  console.log(`✓ graduates.js 생성 완료 (${rows.length}명) → ${dest}`);
}

if (projectsCsv) {
  const raw  = fs.readFileSync(path.resolve(projectsCsv), 'utf8');
  const rows = parseCsv(raw);
  const out  = generateProjects(rows);
  const dest = path.join(SRC_DATA, 'projects.js');
  fs.writeFileSync(dest, out, 'utf8');
  console.log(`✓ projects.js 생성 완료 (${rows.length}개) → ${dest}`);
}
