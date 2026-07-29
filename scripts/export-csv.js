import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { graduates } from '../src/data/graduates.js';
import { projects } from '../src/data/projects.js';
import { teamProjects } from '../src/data/teamProjects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const csvDir = path.join(rootDir, 'csv_data');

if (!fs.existsSync(csvDir)) {
  fs.mkdirSync(csvDir);
}

function escapeCSV(str) {
  if (str === null || str === undefined) return '';
  const s = String(str);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// 1. graduates.csv
// id, studentId, name, tab, role, profileImage
const graduatesHeader = ['id', 'studentId', 'name', 'tab', 'role', 'profileImage'].join(',');
const graduatesRows = graduates.map(g => {
  return [
    g.id,
    g.studentId,
    g.name,
    g.tab,
    g.role,
    g.profileImage || ''
  ].map(escapeCSV).join(',');
});
fs.writeFileSync(path.join(csvDir, 'graduates.csv'), '\uFEFF' + [graduatesHeader, ...graduatesRows].join('\n'), 'utf-8');

// 2. projects.csv
// id, studentId, tab, role, title, thumbnail, description, videoUrl, proposalImages, contactEmail, contactPhone
const projectsHeader = ['id', 'studentId', 'tab', 'role', 'title', 'thumbnail', 'description', 'videoUrl', 'proposalImages', 'contactEmail', 'contactPhone'].join(',');
const projectsRows = projects.map(p => {
  return [
    p.id,
    p.studentId,
    p.tab,
    p.role,
    p.title,
    p.thumbnail || '',
    p.description || '',
    p.videoUrl || '',
    (p.proposalImages || []).join(';'),
    p.contact?.email || '',
    p.contact?.phone || ''
  ].map(escapeCSV).join(',');
});
fs.writeFileSync(path.join(csvDir, 'projects.csv'), '\uFEFF' + [projectsHeader, ...projectsRows].join('\n'), 'utf-8');

// 3. teamProjects.csv
// id, group, teamName, title, thumbnail, description, videoUrl, proposalImages, contactEmail, m1_name, m1_role, m1_id, m2_name, m2_role, m2_id, ... up to 6
const teamHeader = [
  'id', 'group', 'teamName', 'title', 'thumbnail', 'description', 'videoUrl', 'proposalImages', 'contactEmail',
  'm1_name', 'm1_role', 'm1_id',
  'm2_name', 'm2_role', 'm2_id',
  'm3_name', 'm3_role', 'm3_id',
  'm4_name', 'm4_role', 'm4_id',
  'm5_name', 'm5_role', 'm5_id',
  'm6_name', 'm6_role', 'm6_id'
].join(',');

const teamRows = teamProjects.map(t => {
  const row = [
    t.id,
    t.group,
    t.teamName,
    t.title,
    t.thumbnail || '',
    t.description || '',
    t.videoUrl || '',
    (t.proposalImages || []).join(';'),
    t.contact?.email || ''
  ];
  
  for (let i = 0; i < 6; i++) {
    const member = t.members[i];
    if (member) {
      row.push(member.name || '', member.role || '', member.studentId || '');
    } else {
      row.push('', '', '');
    }
  }
  
  return row.map(escapeCSV).join(',');
});
fs.writeFileSync(path.join(csvDir, 'teamProjects.csv'), '\uFEFF' + [teamHeader, ...teamRows].join('\n'), 'utf-8');

console.log('CSV files generated successfully in csv_data/');
