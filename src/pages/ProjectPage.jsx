import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PROJECT_TABS, TAB_MAP, getSubCategories } from '../data/projectTabs';
import { allWorks, getWorkAuthor, getWorkTitle, matchesSub } from '../data/works';
import { FALLBACK, assetUrl } from '../hooks/useImageFallback';
import SafeImg from '../components/SafeImg';
import './ProjectPage.css';

const matchesKeyword = (work, keyword) =>
  !keyword || `${getWorkTitle(work)} ${getWorkAuthor(work)}`.toLowerCase().includes(keyword);

const ProjectPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('all');

  // ?q=<검색어> (Navbar 검색), ?category=<탭 id> (상세 페이지 돌아가기)
  const keyword = (searchParams.get('q') ?? '').trim().toLowerCase();
  const categoryParam = searchParams.get('category');

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

  const visible = allWorks.filter(
    (w) => w.tab === activeTab && matchesSub(w, filter) && matchesKeyword(w, keyword)
  );

  const switchTab = (id) => {
    const next = new URLSearchParams(searchParams);
    next.set('category', id);
    setSearchParams(next, { replace: true });
    setFilter('all');
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

        <section className="portfolio-section" aria-label="작품 모아보기">
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

          <div className="portfolio-grid" aria-live="polite">
            {visible.map((work) => {
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
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>

          {visible.length === 0 && (
            <p className="empty-state">해당 조건에 맞는 작품이 없습니다.</p>
          )}
        </section>
      </main>

      <button
        type="button"
        className="back-to-top"
        aria-label="맨 위로 이동"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21V3M4.5 10.5 12 3l7.5 7.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default ProjectPage;
