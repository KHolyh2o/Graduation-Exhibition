// 탭/직군 단일 정의 파일.
// 직군 추가·변경 시 이 파일만 수정하면 ProjectPage 필터 UI가 자동 반영된다.
export const PROJECT_TABS = [
  {
    id: 'multimedia',
    label: '멀티미디어',
    // sha_copy 작품소개 필터 표기. mteam 은 직군이 아니라 "여럿이 함께 한 작품" (works.js matchesSub 참고)
    roles: [
      { id: 'pm',        label: 'Project Manager', icon: '📋' },
      { id: 'design',    label: 'Designer',        icon: '🎨' },
      { id: 'marketer',  label: 'Marketer',        icon: '📣' },
      { id: 'dev',       label: 'Developer',       icon: '💻' },
      { id: 'mteam',     label: 'M-team',          icon: '🤝' },
    ],
  },
  {
    id: 'video',
    label: '영상미디어',
    roles: [
      { id: 'planning',   label: '기획', icon: '🎬' },
      { id: 'production', label: '제작', icon: '🎥' },
    ],
  },
  {
    id: 'team',
    label: '팀프로젝트',
    // 하위 카테고리 없음 — 필터는 ALL 하나만 보인다
    groups: [],
  },
];

export const TAB_MAP = Object.fromEntries(PROJECT_TABS.map((t) => [t.id, t]));

// 탭의 서브카테고리(roles 또는 groups)를 통일된 키로 반환
export const getSubCategories = (tab) => tab.roles ?? tab.groups ?? [];
