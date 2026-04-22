export const CATEGORIES = {
  multimedia: {
    label: '멀티미디어',
    total: 30,
    groups: [
      { id: 'pm',     label: 'Product Manager', icon: '📋', count: 10, sub: 'Product Manager' },
      { id: 'dev',    label: 'Developer',        icon: '💻', count: 10, sub: 'Developer' },
      { id: 'design', label: 'Designer',         icon: '🎨', count: 10, sub: 'Designer' },
    ],
  },
  video: {
    label: '영상미디어',
    total: 30,
    groups: [
      { id: '2d', label: '2D 제품 홍보', icon: '🎬', count: 10, sub: '2D 제품 홍보' },
      { id: '3d', label: '3D',           icon: '🧊', count: 10, sub: '3D' },
      { id: 'ai', label: 'AI 기획',      icon: '🤖', count: 10, sub: 'AI 기획' },
    ],
  },
  team: {
    label: '팀프로젝트',
    total: 23,
    groups: [
      { id: 'u300',   label: 'U300',          icon: '🚀', count: 10, sub: 'U300' },
      { id: 'hanium', label: '한이음',        icon: '🔗', count: 10, sub: '한이음' },
      { id: 'game',   label: 'Game 프로젝트', icon: '🎮', count: 3,  sub: 'Game 프로젝트' },
    ],
  },
};

export const TAB_KEYS = Object.keys(CATEGORIES);

const buildWorks = () => {
  const result = {};
  Object.entries(CATEGORIES).forEach(([catKey, cat]) => {
    cat.groups.forEach((group) => {
      result[group.id] = Array.from({ length: group.count }, (_, i) => ({
        catKey,
        catLabel: cat.label,
        sub:      group.sub,
        icon:     group.icon,
        num:      String(i + 1).padStart(2, '0'),
      }));
    });
  });
  return result;
};

export const WORKS = buildWorks();
