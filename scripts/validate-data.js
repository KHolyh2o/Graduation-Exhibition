#!/usr/bin/env node
/**
 * 데이터 유효성 검사 스크립트
 *
 * 사용법:
 *   node scripts/validate-data.js
 *
 * 검사 항목:
 *   - graduates: id/studentId 중복, 이름 미입력, tab/role 유효값
 *   - projects:  id/studentId 중복, 제목 미입력, studentId → graduates 연결 누락
 *   - teamProjects: id 중복, 팀명/제목 미입력, group 유효값
 *   - 이미지 경로: public/ 디렉토리에 실제 파일 존재 여부
 */

import fs   from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const PUBLIC    = path.join(ROOT, 'public');

/* ── dynamic import (ESM) ────────────────────────────────────────── */
const { graduates }    = await import('../src/data/graduates.js');
const { projects }     = await import('../src/data/projects.js');
const { teamProjects } = await import('../src/data/teamProjects.js');
const { PROJECT_TABS } = await import('../src/data/projectTabs.js');

/* ── 유효 값 목록 ────────────────────────────────────────────────── */
const VALID_TABS  = PROJECT_TABS.map((t) => t.id);
const VALID_ROLES = Object.fromEntries(
  PROJECT_TABS.map((t) => [t.id, (t.roles ?? t.groups ?? []).map((r) => r.id)])
);
const VALID_GROUPS = VALID_ROLES['team'] ?? [];

/* ── 결과 수집 ───────────────────────────────────────────────────── */
let errors   = 0;
let warnings = 0;

const err  = (msg) => { console.error(`  ✗ ERROR   ${msg}`);   errors++; };
const warn = (msg) => { console.warn( `  △ WARNING ${msg}`);   warnings++; };
const ok   = (msg) => console.log(`  ✓ ${msg}`);

function checkDuplicates(list, key, label) {
  const seen = new Set();
  list.forEach((item) => {
    if (seen.has(item[key])) err(`${label} 중복 ${key}: "${item[key]}"`);
    else seen.add(item[key]);
  });
}

function fileExists(relPath) {
  if (!relPath) return false;
  return fs.existsSync(path.join(PUBLIC, relPath));
}

/* ── 1. graduates 검사 ───────────────────────────────────────────── */
console.log('\n[ graduates.js ]');
checkDuplicates(graduates, 'id',        'graduate');
checkDuplicates(graduates, 'studentId', 'graduate');

const graduateIds = new Set(graduates.map((g) => g.studentId));

graduates.forEach((g) => {
  if (!g.name || g.name === '이름 입력')
    warn(`${g.id} (${g.studentId}) — 이름 미입력`);
  if (!VALID_TABS.includes(g.tab))
    err(`${g.id} — 유효하지 않은 tab: "${g.tab}"`);
  if (g.profileImage && !fileExists(g.profileImage))
    warn(`${g.id} — 프로필 이미지 없음: ${g.profileImage}`);
});

if (!errors && !warnings) ok(`graduates ${graduates.length}명 이상 없음`);

/* ── 2. projects 검사 ────────────────────────────────────────────── */
console.log('\n[ projects.js ]');
checkDuplicates(projects, 'id', 'project');

// 한 학생이 여러 작품을 가질 수 있고, 함께 한 작품은 studentIds 에 전원이 들어 있다
projects.forEach((p) => {
  if (!p.title || p.title === '작품명 입력')
    warn(`${p.id} — 작품명 미입력`);
  (p.studentIds ?? [p.studentId]).forEach((sid) => {
    if (!graduateIds.has(sid))
      err(`${p.id} — graduates에 없는 studentId: "${sid}"`);
  });
  if (p.thumbnail && !fileExists(p.thumbnail))
    warn(`${p.id} — 썸네일 없음: ${p.thumbnail}`);
  (p.proposalImages ?? []).forEach((img) => {
    if (!fileExists(img)) warn(`${p.id} — 제안서 이미지 없음: ${img}`);
  });
  if (!VALID_TABS.includes(p.tab))
    err(`${p.id} — 유효하지 않은 tab: "${p.tab}"`);
});

if (!errors && !warnings) ok(`projects ${projects.length}개 이상 없음`);

/* ── 3. teamProjects 검사 ────────────────────────────────────────── */
console.log('\n[ teamProjects.js ]');
checkDuplicates(teamProjects, 'id', 'teamProject');

teamProjects.forEach((t) => {
  if (!t.teamName || t.teamName === '팀명 입력')
    warn(`${t.id} — 팀명 미입력`);
  if (!VALID_GROUPS.includes(t.group))
    err(`${t.id} — 유효하지 않은 group: "${t.group}"`);
  if (t.thumbnail && !fileExists(t.thumbnail))
    warn(`${t.id} — 썸네일 없음: ${t.thumbnail}`);
});

if (!errors && !warnings) ok(`teamProjects ${teamProjects.length}개 이상 없음`);

/* ── 결과 요약 ───────────────────────────────────────────────────── */
console.log('\n─────────────────────────────────────');
if (errors === 0 && warnings === 0) {
  console.log('✅ 모든 검사 통과\n');
} else {
  if (errors)   console.error(`❌ 오류 ${errors}건`);
  if (warnings) console.warn( `⚠️  경고 ${warnings}건`);
  console.log();
  if (errors) process.exit(1);
}
