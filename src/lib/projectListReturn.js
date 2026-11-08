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
