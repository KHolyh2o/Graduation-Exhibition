#!/usr/bin/env node
/**
 * 공유용 폴더의 "전공생 작품명 및 직군 정리" CSV → projects.csv / teamProjects(U300) 변환
 *
 * 사용법:
 *   node scripts/import-drive-works.js
 *   npm run csv:projects csv_data/projects.csv      ← 이어서 projects.js 생성
 *
 * 입력 (UTF-8로 저장된 원본):
 *   csv_data/source/전공생_작품명_멀티미디어.csv   전공,학번,이름,직군,브랜드,부분기능개선,디바이스,창캡
 *   csv_data/source/전공생_작품명_영상미디어.csv   전공,학번,성명,직군,타이틀,타이틀,타이틀,창캡
 *
 * 변환 규칙:
 *   - 멀티미디어 브랜드 칸은 학생 개인 작품.
 *   - 부분기능개선·디바이스 칸은 이름이 같으면 함께 한 프로젝트 1개로 합치고, 학번을 ';'로 이어 쓴다.
 *   - 영상미디어 타이틀 3칸은 개인 작품 (한 학생이 같은 제목을 두 번 적었으면 1개).
 *   - 창캡 칸은 U300 팀 (창캡 = U300 = 한이음). 같은 팀명의 학생들을 팀원으로 묶는다 (멀티미디어 먼저, 영상미디어 다음).
 *     팀 작품은 작품명 없이 팀명만 쓴다.
 *   - role 은 graduates.js 의 직군을 그대로 따른다 (공동 작품은 참여자 직군의 합집합).
 *
 * 판넬 이미지(선택):
 *   csv_data/source/panels.json  { 작품id: ['/images/projects/proposals/xxx.webp'] }
 *   있으면 각 작품의 proposalImages(상세 페이지 세로 이미지)로 들어간다.
 *
 * 썸네일(선택):
 *   csv_data/source/thumbnails.json  { 작품id: '/images/project_thumnail/xxx.png' }
 *   있으면 작품소개 카드의 대표 이미지(thumbnail)로 들어간다.
 *
 * 출력:
 *   csv_data/projects.csv
 *   csv_data/teamProjects.csv  (U300 행만 교체, Game 행은 그대로)
 *   src/data/teamProjects.js   (U300 구간만 교체)
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const CSV_DIR   = path.join(ROOT, 'csv_data');

const { graduateByStudentId } = await import('../src/data/graduates.js');

// 판넬 webp 경로 (없으면 비워 둠)
const panelsPath = path.join(CSV_DIR, 'source', 'panels.json');
const panels = fs.existsSync(panelsPath) ? JSON.parse(fs.readFileSync(panelsPath, 'utf8')) : {};
const panelsOf = (id) => panels[id] ?? [];

// 카드 대표 이미지 (없으면 비워 둠)
const thumbsPath = path.join(CSV_DIR, 'source', 'thumbnails.json');
const thumbnails = fs.existsSync(thumbsPath) ? JSON.parse(fs.readFileSync(thumbsPath, 'utf8')) : {};
const thumbOf = (id) => thumbnails[id] ?? '';

/* ── 입력 ────────────────────────────────────────────────────────── */
// 이 원본 CSV 는 따옴표·쉼표 없는 단순 형식이라 split 으로 충분하다
const readRows = (file) =>
  fs.readFileSync(path.join(CSV_DIR, 'source', file), 'utf8')
    .replace(new RegExp('^\\uFEFF'), '').trim().split(/\r?\n/).slice(1)
    .map((line) => line.split(',').map((v) => v.trim()));

const multimedia = readRows('전공생_작품명_멀티미디어.csv')
  .map(([, studentId, name, job, brand, func, device, team]) => ({ studentId, name, job, titles: { brand, func, device }, team }));
const video = readRows('전공생_작품명_영상미디어.csv')
  .map(([, studentId, name, job, t1, t2, t3, team]) => ({ studentId, name, job, titles: [t1, t2, t3], team }));

/* ── projects ────────────────────────────────────────────────────── */
const projects = []; // { id, tab, studentIds, title }
const pad = (n) => String(n).padStart(2, '0');

// 멀티미디어: 브랜드는 개인, 부분기능개선·디바이스는 같은 이름끼리 합침
multimedia.forEach((s) => {
  if (s.titles.brand) {
    projects.push({ id: `p-mm-${s.studentId}-brand`, tab: 'multimedia', studentIds: [s.studentId], title: s.titles.brand });
  }
});
[['func', 'p-mm-func'], ['device', 'p-mm-device']].forEach(([key, prefix]) => {
  const byTitle = new Map();
  multimedia.forEach((s) => {
    const title = s.titles[key];
    if (!title) return;
    if (!byTitle.has(title)) byTitle.set(title, []);
    byTitle.get(title).push(s.studentId);
  });
  let seq = 1;
  byTitle.forEach((studentIds, title) => {
    projects.push({ id: `${prefix}-${pad(seq++)}`, tab: 'multimedia', studentIds, title });
  });
});

// 영상미디어: 전부 개인 작품 (같은 학생의 중복 제목은 1개로)
video.forEach((s) => {
  [...new Set(s.titles.filter(Boolean))].forEach((title, i) => {
    projects.push({ id: `p-vd-${s.studentId}-${i + 1}`, tab: 'video', studentIds: [s.studentId], title });
  });
});

const roleCell = (studentIds) => {
  const roles = [];
  studentIds.forEach((id) => {
    const g = graduateByStudentId[id];
    if (!g) throw new Error(`graduates.js 에 없는 학번: ${id}`);
    (g.roles ?? [g.role]).forEach((r) => { if (!roles.includes(r)) roles.push(r); });
  });
  return roles.join(';');
};

const projectsCsv = [
  'id,studentId,tab,role,title,thumbnail,description,videoUrl,proposalImages,contactEmail,contactPhone',
  ...projects.map((p) =>
    [p.id, p.studentIds.join(';'), p.tab, roleCell(p.studentIds), p.title, thumbOf(p.id), '', '', panelsOf(p.id).join(';'), '', ''].join(',')),
].join('\n') + '\n';
fs.writeFileSync(path.join(CSV_DIR, 'projects.csv'), projectsCsv, 'utf8');

/* ── U300 팀 ─────────────────────────────────────────────────────── */
const teams = new Map(); // 팀명 → [{ name, role, studentId }]
[...multimedia, ...video].forEach((s) => {
  if (!s.team) return;
  if (!teams.has(s.team)) teams.set(s.team, []);
  teams.get(s.team).push({ name: s.name, role: s.job, studentId: s.studentId });
});

const teamRows = [...teams].map(([teamName, members], i) => ({
  id: `t-u300-${pad(i + 1)}`, group: 'u300', teamName, title: '', members,
}));

// teamProjects.csv — U300 행 교체
const teamCsvPath = path.join(CSV_DIR, 'teamProjects.csv');
const teamLines = fs.readFileSync(teamCsvPath, 'utf8').trim().split(/\r?\n/);
const memberCols = (members) =>
  Array.from({ length: 6 }, (_, k) => {
    const m = members[k];
    return m ? [m.name, m.role, m.studentId] : ['', '', ''];
  }).flat();
const u300Lines = teamRows.map((t) =>
  [t.id, t.group, t.teamName, t.title, thumbOf(t.id), '', '', panelsOf(t.id).join(';'), '', ...memberCols(t.members)].join(','));
fs.writeFileSync(
  teamCsvPath,
  [teamLines[0], ...u300Lines, ...teamLines.slice(1).filter((l) => !l.startsWith('t-u300-'))].join('\n') + '\n',
  'utf8',
);

// teamProjects.js — U300 구간 교체
const jsPath = path.join(ROOT, 'src', 'data', 'teamProjects.js');
const js = fs.readFileSync(jsPath, 'utf8');
const startMark = '  // ── U300 (10팀)';
const endMark   = '  // ── Game';
const start = js.indexOf(startMark);
const end   = js.indexOf(endMark);
if (start === -1 || end === -1) throw new Error('teamProjects.js 의 U300 구간 표식을 찾지 못했습니다.');

const u300Js = teamRows.map((t) =>
  `  {\n` +
  `    id: '${t.id}', tab: 'team', group: 'u300',\n` +
  `    teamName: '${t.teamName}', title: '${t.title}',\n` +
  `    thumbnail: '${thumbOf(t.id)}',\n` +
  `    description: '',\n` +
  `    videoUrl: '',\n` +
  `    proposalImages: [${panelsOf(t.id).map((v) => `'${v}'`).join(', ')}],\n` +
  `    contact: { email: '' },\n` +
  `    members: [\n` +
  t.members.map((m) => `      { name: '${m.name}', role: '${m.role}', studentId: '${m.studentId}' },`).join('\n') + `\n` +
  `    ],\n` +
  `  },`
).join('\n');

fs.writeFileSync(
  jsPath,
  js.slice(0, start) + `  // ── U300 (${teamRows.length}팀) ` + '─'.repeat(58) + `\n${u300Js}\n\n` + js.slice(end),
  'utf8',
);

console.log(`✓ projects.csv  ${projects.length}개 (멀티미디어 ${projects.filter((p) => p.tab === 'multimedia').length} / 영상미디어 ${projects.filter((p) => p.tab === 'video').length})`);
console.log(`  └ 공동 작품 ${projects.filter((p) => p.studentIds.length > 1).length}개`);
console.log(`✓ U300 ${teamRows.length}팀 → teamProjects.csv / teamProjects.js`);
