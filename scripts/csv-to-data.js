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
 *   id, studentId, name, tab, role, jobTitle, profileImage
 *   g-01, 2022001001, 홍길동, multimedia, pm, 기획자, /images/profiles/홍길동.jpg
 *   (role: 필터용 코드 / jobTitle: 화면에 표시할 한글 직함 — 쉼표 금지, 2개면 ' · '로 구분)
 *
 * [projects.csv]
 *   id, studentId, tab, role, title, thumbnail, description, videoUrl,
 *   proposalImages, contactEmail, contactPhone
 *   (proposalImages: 세미콜론으로 구분  ex. /images/a.jpg;/images/b.jpg)
 *
 * [teamProjects.csv]
 *   id, group, teamName, title, thumbnail, description, videoUrl,
 *   proposalImages, contactEmail, m1_name, m1_role, m1_id, m2_name, m2_role, m2_id, ... m6_id
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const SRC_DATA  = path.join(ROOT, 'src', 'data');

/* ── CSV parser ──────────────────────────────────────────────────── */
// '#'으로 시작하는 행은 주석 처리된 데이터 (__comment: true) — graduates에서만 JS 주석으로 출력
function parseCsv(raw) {
  const lines = raw.trim().split(/\r?\n/);
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const isComment = line.startsWith('#');
    const values = (isComment ? line.slice(1) : line).split(',').map((v) => v.trim());
    const row = Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
    return isComment ? { ...row, __comment: true } : row;
  });
}
const activeRows = (rows) => rows.filter((r) => !r.__comment);

// role 칸은 세미콜론으로 복수 직군 허용 (ex. pm;dev) — 첫 값이 주 직군(role), 2개 이상이면 roles 배열도 출력
const roleFields = (roleCell) => {
  const list = roleCell.split(';').map((v) => v.trim()).filter(Boolean);
  const primary = list[0] ?? '';
  return list.length > 1
    ? `role: '${primary}', roles: [${list.map((v) => `'${v}'`).join(', ')}]`
    : `role: '${primary}'`;
};

/* ── graduates ───────────────────────────────────────────────────── */
function generateGraduates(rows) {
  const entries = rows.map((r) =>
    (r.__comment ? '  // ' : '  ') +
    `{ id: '${r.id}', studentId: '${r.studentId}', name: '${r.name}', ` +
    `tab: '${r.tab}', ${roleFields(r.role)}, jobTitle: '${r.jobTitle ?? ''}', profileImage: '${r.profileImage}' },`
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
      `    tab: '${r.tab}', ${roleFields(r.role)},\n` +
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

/* ── teamProjects ────────────────────────────────────────────────── */
function generateTeamProjects(rows) {
  const entries = rows.map((r) => {
    const proposals = r.proposalImages
      ? r.proposalImages.split(';').filter(Boolean).map((p) => `'${p.trim()}'`).join(', ')
      : '';
      
    const members = [];
    for (let i = 1; i <= 6; i++) {
      const name = r[`m${i}_name`];
      const role = r[`m${i}_role`];
      const studentId = r[`m${i}_id`];
      if (name) {
        members.push(`{ name: '${name}', role: '${role || ''}', studentId: '${studentId || ''}' }`);
      }
    }

    return (
      `  {\n` +
      `    id: '${r.id}', tab: 'team', group: '${r.group}',\n` +
      `    teamName: '${r.teamName}', title: '${r.title}',\n` +
      `    thumbnail: '${r.thumbnail}',\n` +
      `    description: '${r.description.replace(/'/g, "\\'")}',\n` +
      `    videoUrl: '${r.videoUrl}',\n` +
      `    proposalImages: [${proposals}],\n` +
      `    contact: { email: '${r.contactEmail}' },\n` +
      `    members: [\n      ${members.join(',\n      ')}\n    ],\n` +
      `  },`
    );
  });

  return `export const teamProjects = [\n${entries.join('\n')}\n];\n`;
}

/* ── main ────────────────────────────────────────────────────────── */
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : null;
};

const graduatesCsv = flag('--graduates');
const projectsCsv  = flag('--projects');
const teamProjectsCsv = flag('--teamProjects');

if (!graduatesCsv && !projectsCsv && !teamProjectsCsv) {
  console.error('사용법: node scripts/csv-to-data.js --graduates <path> [--projects <path>]');
  process.exit(1);
}

if (graduatesCsv) {
  const raw  = fs.readFileSync(path.resolve(graduatesCsv), 'utf8');
  const rows = parseCsv(raw);
  const out  = generateGraduates(rows);
  const dest = path.join(SRC_DATA, 'graduates.js');
  fs.writeFileSync(dest, out, 'utf8');
  console.log(`✓ graduates.js 생성 완료 (${activeRows(rows).length}명, 주석 ${rows.filter((r) => r.__comment).length}) → ${dest}`);
}

if (projectsCsv) {
  const raw  = fs.readFileSync(path.resolve(projectsCsv), 'utf8');
  const rows = activeRows(parseCsv(raw));
  const out  = generateProjects(rows);
  const dest = path.join(SRC_DATA, 'projects.js');
  fs.writeFileSync(dest, out, 'utf8');
  console.log(`✓ projects.js 생성 완료 (${rows.length}개) → ${dest}`);
}

if (teamProjectsCsv) {
  const raw  = fs.readFileSync(path.resolve(teamProjectsCsv), 'utf8');
  const rows = activeRows(parseCsv(raw));
  const out  = generateTeamProjects(rows);
  const dest = path.join(SRC_DATA, 'teamProjects.js');
  fs.writeFileSync(dest, out, 'utf8');
  console.log(`✓ teamProjects.js 생성 완료 (${rows.length}팀) → ${dest}`);
}
