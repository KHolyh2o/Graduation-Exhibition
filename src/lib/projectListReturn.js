import { PROJECT_TABS } from '../data/projectTabs';

// 작품소개 목록의 주소(탭·직군·검색어)를 기억해 두었다가, 작품 상세의 "돌아가기"가 그대로 돌려보내게 한다.
// (링크의 state 로 넘기는 방식은 SiteEffects 가 링크 클릭을 가로채 주소 문자열로만 이동해서 state 가 사라지므로 쓸 수 없다)
const KEY = 'project-list-url';

export const saveProjectListUrl = (url) => {
  try { sessionStorage.setItem(KEY, url); } catch { /* 저장소를 못 쓰는 환경 — 기억만 못 할 뿐 동작은 정상 */ }
};

// 저장된 주소가 이 작품의 탭과 맞을 때만 쓴다 (다른 탭 목록으로 돌려보내지 않게)
export const getProjectListUrl = (workTab) => {
  try {
    const url = sessionStorage.getItem(KEY);
    if (!url) return null;
    const params = new URLSearchParams(url.split('?')[1] ?? '');
    const category = params.get('category');
    // category 가 없으면 기본(첫) 탭이 열려 있던 것이고, 검색어(q)만 있으면 탭을 따로 정하지 않은 검색 결과다
    if ((category ?? PROJECT_TABS[0].id) === workTab || (!category && params.get('q'))) return url;
  } catch { /* 무시 */ }
  return null;
};

/* ── 스크롤 위치 복원 ───────────────────────────────────────────────
   목록에서 내려가 있던 높이를 기억했다가, 작품 상세의 "돌아가기"(또는 브라우저 뒤로가기)로 돌아오면 그 높이로 되돌린다.
   작품 소개 목록을 새로 여는 경우(메뉴 클릭 등)에는 복원하지 않고 맨 위부터 시작한다. */
const SCROLL_KEY = 'project-list-scroll';
const RESTORE_KEY = 'project-list-restore';

// 목록 화면이 떠 있는 동안 스크롤할 때마다 호출 (주소와 함께 저장)
export const saveListScroll = (url, y) => {
  try { sessionStorage.setItem(SCROLL_KEY, JSON.stringify({ url, y: Math.round(y) })); } catch { /* 무시 */ }
};

// 작품 상세의 "돌아가기"를 눌렀다는 표시 (링크 이동은 새 이동(PUSH)이라 뒤로가기와 구분해야 한다)
export const markRestoreScroll = () => {
  try { sessionStorage.setItem(RESTORE_KEY, '1'); } catch { /* 무시 */ }
};

// 목록이 열릴 때 호출: 복원해야 하면 저장된 높이를, 아니면 null. 표시는 한 번 쓰면 지운다.
export const takeScrollToRestore = (url, navigationType) => {
  try {
    const marked = sessionStorage.getItem(RESTORE_KEY) === '1';
    sessionStorage.removeItem(RESTORE_KEY);
    if (!marked && navigationType !== 'POP') return null;
    const saved = JSON.parse(sessionStorage.getItem(SCROLL_KEY) ?? 'null');
    return saved && saved.url === url && Number.isFinite(saved.y) ? saved.y : null;
  } catch { return null; }
};

// SiteEffects 가 이동 효과를 마무리할 때 "맨 위로" 올리는데, 복원할 높이가 있으면 그 높이로 올리도록 넘겨 주는 값
let pendingY = null;
export const setPendingScroll = (y) => { pendingY = y; };
export const takePendingScroll = () => { const y = pendingY; pendingY = null; return y; };
