const BASE = import.meta.env.BASE_URL; // '/2026/'

// 데이터 파일의 '/images/...' 경로 → 실제 서빙 경로로 변환
// 슬래시는 유지하고 각 파일명 세그먼트만 인코딩 (한글 파일명 대응)
// 외부 URL(http)은 그대로 반환
export const assetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const encoded = path
    .replace(/^\//, '')
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return `${BASE}${encoded}`;
};

export const FALLBACK = {
  image:  assetUrl('/images/no-image.svg'),
  avatar: assetUrl('/images/no-avatar.svg'),
};
