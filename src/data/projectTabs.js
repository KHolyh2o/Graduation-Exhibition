// 탭/직군 단일 정의 파일.
// 직군 추가·변경 시 이 파일만 수정하면 ProjectPage 필터 UI가 자동 반영된다.
export const PROJECT_TABS = [
  {
    id: 'multimedia',
    label: '멀티미디어',
    roles: [
      { id: 'pm',     label: '기획자',   icon: '📋' },
      { id: 'dev',    label: '개발',     icon: '💻' },
      { id: 'design', label: '디자이너', icon: '🎨' },
    ],
  },
  {
    id: 'video',
    label: '영상미디어',
    roles: [
      { id: 'producer', label: '영상 기획',   icon: '🎬' },
      { id: 'motion',   label: '모션그래픽',  icon: '✨' },
      { id: 'director', label: '연출 · 제작', icon: '🎥' },
    ],
  },
  {
    id: 'team',
    label: '팀프로젝트',
    groups: [
      { id: 'u300',   label: 'U300',          icon: '🚀' },
      { id: 'hanium', label: '한이음',        icon: '🔗' },
      { id: 'game',   label: 'Game 프로젝트', icon: '🎮' },
    ],
  },
];

export const TAB_MAP = Object.fromEntries(PROJECT_TABS.map((t) => [t.id, t]));

// 탭의 서브카테고리(roles 또는 groups)를 통일된 키로 반환
export const getSubCategories = (tab) => tab.roles ?? tab.groups ?? [];
