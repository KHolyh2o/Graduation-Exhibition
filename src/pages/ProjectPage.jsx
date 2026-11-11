import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { Link, useLocation, useNavigationType, useSearchParams } from 'react-router-dom';
import { saveProjectListUrl, saveListScroll, takeScrollToRestore, setPendingScroll } from '../lib/projectListReturn';
import { PROJECT_TABS, TAB_MAP, getSubCategories } from '../data/projectTabs';
import { allWorks, compareByAuthor, getWorkAuthor, getWorkKind, getTeamMemberNames, getWorkTitle, matchesSub, WORK_KINDS } from '../data/works';
import { FALLBACK, assetUrl } from '../hooks/useImageFallback';
import SafeImg from '../components/SafeImg';
import './ProjectPage.css';

const matchesKeyword = (work, keyword) =>
  !keyword || `${getWorkTitle(work)} ${getWorkAuthor(work)}`.toLowerCase().includes(keyword);

const ProjectPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigationType = useNavigationType();

  // ?q=<검색어> (Navbar 검색), ?category=<탭 id>, ?role=<직군/필터 id> — 선택 상태를 전부 주소에 담아 두어서
  // 작품 상세에 들어갔다가 돌아와도 같은 탭·필터·검색 그대로 보인다
  const keyword = (searchParams.get('q') ?? '').trim().toLowerCase();
  const categoryParam = searchParams.get('category');
  const roleParam = searchParams.get('role');

  // 지금 목록 주소를 기억 — 작품 상세의 "돌아가기"가 같은 탭·필터로 돌려보낸다
  const listUrl = `${location.pathname}${location.search}`;
  useEffect(() => {
    saveProjectListUrl(listUrl);
  }, [listUrl]);

  // 돌아왔을 때 있던 높이로 복원. 이동 효과(SiteEffects)가 이동 직후 맨 위로 올리므로, 같은 높이를 넘겨 두어 덮어쓰지 않게 한다
  useLayoutEffect(() => {
    const y = takeScrollToRestore(listUrl, navigationType);
    if (y === null) return undefined;
    // 이동 효과로 본문이 가려져 있는 동안(돌아가기)에는 여기서 스크롤하지 않는다. 이 시점에 스크롤하면 브라우저가 카드 스타일을
    // 먼저 계산해 버려서, 카드가 "투명 → 올라오기"가 아니라 이미 보이는 상태에서 시작해 등장 애니메이션이 사라진다.
    // 높이는 SiteEffects 가 이동을 마무리할 때(pendingScroll) 맞춘다. 브라우저 뒤로가기는 가려진 적이 없으므로 바로 맞춘다.
    if (!document.body.classList.contains('fx-leaving')) window.scrollTo({ top: y, behavior: 'instant' });
    setPendingScroll(y);
    const clear = window.setTimeout(() => setPendingScroll(null), 1500);
    // 목록을 떠나면 값을 반드시 비운다 (남아 있으면 다른 페이지로 갈 때 맨 위 대신 이 높이로 올라간다)
    return () => { window.clearTimeout(clear); setPendingScroll(null); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 스크롤할 때마다 높이를 기억 (프레임당 한 번만)
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; saveListScroll(listUrl, window.scrollY); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [listUrl]);

  // 카테고리 지정이 없고 검색 중이면, 결과가 있는 첫 탭을 연다
  const activeTab = useMemo(() => {
    if (TAB_MAP[categoryParam]) return categoryParam;
    if (keyword) {
      const hit = PROJECT_TABS.find((t) => allWorks.some((w) => w.tab === t.id && matchesKeyword(w, keyword)));
      if (hit) return hit.id;
    }
    return PROJECT_TABS[0].id;
  }, [categoryParam, keyword]);

  const tab = TAB_MAP[activeTab];
  const filters = [{ id: 'all', label: 'ALL' }, ...getSubCategories(tab)];
  // 주소의 role 이 이 탭에 없는 값이면 ALL
  const filter = filters.some((f) => f.id === roleParam) ? roleParam : 'all';

  const setFilter = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'all') next.delete('role'); else next.set('role', id);
    setSearchParams(next, { replace: true });
  };

  const visible = allWorks
    .filter((w) => w.tab === activeTab && matchesSub(w, filter) && matchesKeyword(w, keyword))
    .sort(compareByAuthor);

  // 멀티미디어는 브랜드 제안 / 부분 개선 제안으로 나눠 보여 준다. 그 외 탭은 한 묶음
  const sections = activeTab === 'multimedia'
    ? WORK_KINDS.map((k) => ({ ...k, works: visible.filter((w) => getWorkKind(w) === k.id) })).filter((s) => s.works.length > 0)
    : [{ id: 'all', label: '', works: visible }];

  // 검색을 끝내고 전체 작품으로 돌아간다. 검색 중에 자동으로 열린 탭은 그대로 두고(category 를 주소에 고정), 검색어만 지운다
  const rawKeyword = (searchParams.get('q') ?? '').trim();
  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('q');
    next.set('category', activeTab);
    setSearchParams(next, { replace: true });
  };

  const switchTab = (id) => {
    const next = new URLSearchParams(searchParams);
    next.set('category', id);
    next.delete('role');   // 탭을 바꾸면 필터는 ALL 부터
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="project-page" data-category={activeTab}>
      <main id="work">
        <section className="intro" aria-labelledby="page-title">
          <h1 id="page-title">Portfolio</h1>
          <p className="intro-korean">질문에서 시작된 가능성이 하나의 결과물을 만들어낸 순간을 소개합니다.</p>
          <p className="intro-english">2026 Seowon University Graduates</p>
        </section>

        <section className="media-section" aria-label="작품 분야 선택">
          <div className="media-categories">
            {PROJECT_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                data-category={t.id}
                className={`media-category${activeTab === t.id ? ' is-active' : ''}`}
                aria-pressed={activeTab === t.id}
                onClick={() => switchTab(t.id)}
              >
                {/* 선택·호버 때는 컬러, 평소에는 흑백 아이콘 */}
                <span className="asset-slot category-icon has-bw">
                  <img className="category-icon-bw" src={assetUrl(`/images/UI/category-${t.id}-bw.webp`)} alt="" onError={(e) => e.currentTarget.remove()} />
                  <img className="category-icon-colored" src={assetUrl(`/images/UI/category-${t.id}.webp`)} alt="" onError={(e) => e.currentTarget.remove()} />
                </span>
                <span className="category-label">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={`portfolio-section${keyword ? ' has-search' : ''}`} aria-label="작품 모아보기">
          <div className="role-filters" role="group" aria-label="작품 필터">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`role-button${filter === f.id ? ' is-active' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {keyword && (
            <p className="search-result-bar" role="status">
              <strong>&lsquo;{rawKeyword}&rsquo;</strong> 검색 결과 {visible.length}개
              <span className="search-result-dot" aria-hidden="true">·</span>
              <button type="button" className="search-result-clear" onClick={clearSearch}>
                전체 작품 보기
              </button>
            </p>
          )}

          <div aria-live="polite">
            {sections.map((section) => (
              <div className="portfolio-section-group" key={section.id}>
                {section.label && (
                  <h3 className="portfolio-kind" data-kind={section.id}>{section.label}</h3>
                )}
                <div className="portfolio-grid">
                  {section.works.map((work) => {
              // 제안 이름(proposal)이 있으면 브랜드명을 위에 작게, 제안 이름을 크게. 없으면 작품명을 크게 보여 준다
              const heading = work.proposal || getWorkTitle(work);
              return (
                <article key={work.id} className="project-card">
                  <Link
                    to={`/project/${work.id}`}
                    className="project-link"
                    aria-label={`${getWorkTitle(work)} ${work.proposal ?? ''} 작품 소개 보기`}
                  >
                    <div className="project-thumb">
                      {work.thumbnail && (
                        <SafeImg src={work.thumbnail} fallbackSrc={FALLBACK.image} alt={`${getWorkTitle(work)} 대표 이미지`} />
                      )}
                    </div>
                    <div className="project-info">
                      {work.proposal && <p className="project-brand">{getWorkTitle(work)}</p>}
                      <h2 className="project-proposal">{heading}</h2>
                      {work.title && <p className="project-author">{getWorkAuthor(work)}</p>}
                      {work.members && <p className="project-author project-team-members">{getTeamMemberNames(work)}</p>}
                    </div>
                  </Link>
                </article>
              );
            })}
                </div>
              </div>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="empty-state">해당 조건에 맞는 작품이 없습니다.</p>
          )}
        </section>
      </main>

    </div>
  );
};

export default ProjectPage;
