// 작품 조회 공통 헬퍼 — ProjectPage(목록)와 DetailPage(상세)가 함께 사용한다.
import { projects } from './projects';
import { teamProjects } from './teamProjects';
import { graduateByStudentId } from './graduates';
import { TAB_MAP, getSubCategories } from './projectTabs';

export const allWorks = [...projects, ...teamProjects];

// 팀 작품은 작품명 없이 팀명만 쓴다
export const getWorkTitle = (work) => work.title || work.teamName;

export const getWorkById = (id) => allWorks.find((w) => w.id === id);

// 개인·공동 작품 참여 졸업생 학번 (공동 작품은 studentIds, 단독 작품은 studentId)
export const getWorkStudentIds = (work) => work.studentIds ?? [work.studentId];

// 개인·공동 작품은 졸업생 이름(공동이면 ', '로 연결), 팀 작품은 팀명
export const getWorkAuthor = (work) =>
  work.members
    ? work.teamName
    : getWorkStudentIds(work).map((id) => graduateByStudentId[id]?.name ?? '-').join(', ');

// 탭 안에서 직군(개인) 또는 그룹(팀) 필터 일치 여부. 'all' 은 항상 통과
export const matchesSub = (work, subId) => {
  if (subId === 'all') return true;
  if (work.tab === 'team') return work.group === subId;
  if (subId === 'mteam') return getWorkStudentIds(work).length > 1;   // M-team = 여럿이 함께 한 작품
  return (work.roles ?? [work.role]).includes(subId);
};

export const getSubLabel = (work) => {
  const tab = TAB_MAP[work.tab];
  const key = work.tab === 'team' ? work.group : work.role;
  return getSubCategories(tab).find((s) => s.id === key)?.label ?? '';
};

// 졸업생 한 명의 작품(개인·공동 + 참여한 팀 작품)
export const getWorksByStudent = (studentId) => [
  ...projects.filter((p) => getWorkStudentIds(p).includes(studentId)),
  ...teamProjects.filter((t) => t.members?.some((m) => m.studentId === studentId)),
];

export const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/[?&]v=([^?&]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return url;
};
