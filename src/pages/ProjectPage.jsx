import React, { useState, useEffect, useRef } from 'react';
import './ProjectPage.css';

/* ─────────── 카테고리 데이터 ─────────── */
const CATEGORIES = {
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

const TAB_KEYS = Object.keys(CATEGORIES);

/* 작업 카드 더미 데이터 생성 */
const buildWorks = () => {
  const result = {};
  Object.entries(CATEGORIES).forEach(([catKey, cat]) => {
    cat.groups.forEach((group) => {
      result[group.id] = Array.from({ length: group.count }, (_, i) => ({
        catKey,
        catLabel:  cat.label,
        sub:       group.sub,
        icon:      group.icon,
        num:       String(i + 1).padStart(2, '0'),
      }));
    });
  });
  return result;
};

const WORKS = buildWorks();

/* ─────────── 컴포넌트 ─────────── */
const ProjectPage = () => {
  const [activeTab,  setActiveTab]  = useState('multimedia');
  const [totalCount, setTotalCount] = useState(CATEGORIES.multimedia.total);
  const [modalData,  setModalData]  = useState(null);
  const categoryBarRef = useRef(null);

  /* 탭 전환 */
  const switchTab = (key) => {
    setActiveTab(key);
    setTotalCount(CATEGORIES[key].total);
    categoryBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // 새 패널의 reveal 요소 관찰
    setTimeout(setupReveal, 50);
  };

  /* 스크롤 Reveal */
  const setupReveal = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  };

  useEffect(() => {
    const cleanup = setupReveal();
    return cleanup;
  }, []);

  /* 모달 body overflow & ESC */
  useEffect(() => {
    document.body.style.overflow = modalData ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalData]);

  useEffect(() => {
    if (!modalData) return;
    const onKey = (e) => { if (e.key === 'Escape') setModalData(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalData]);

  /* ─────────── JSX ─────────── */
  return (
    <div>
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-inner">
            <div>
              <p className="page-breadcrumb">HOME › 작품소개</p>
              <h1 className="page-title">작품소개</h1>
              <p className="page-desc">미디어콘텐츠학부 졸업생들의 작품을 카테고리별로 만나보세요.</p>
            </div>
            <span className="page-total-badge">전체 {totalCount}개 작품</span>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div id="category-bar" ref={categoryBarRef} role="tablist" aria-label="작품 카테고리">
        <div className="container">
          <div className="tab-inner">
            {TAB_KEYS.map((key) => (
              <button
                key={key}
                className={`tab-btn${activeTab === key ? ' active' : ''}`}
                id={`tab-${key}`}
                role="tab"
                aria-selected={activeTab === key}
                aria-controls={`panel-${key}`}
                data-cat={key}
                onClick={() => switchTab(key)}
              >
                {CATEGORIES[key].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <main id="content-area">
        <div className="container">
          {TAB_KEYS.map((catKey) => (
            <section
              key={catKey}
              className={`cat-panel${activeTab === catKey ? ' active' : ''}`}
              id={`panel-${catKey}`}
              role="tabpanel"
              aria-labelledby={`tab-${catKey}`}
            >
              {CATEGORIES[catKey].groups.map((group) => (
                <div key={group.id} className="work-group reveal">
                  <div className="sub-cat-strip">
                    <span className="sub-cat-name">{group.sub}</span>
                    <span className="sub-cat-count">{group.count}개</span>
                  </div>
                  <div className="work-grid">
                    {WORKS[group.id].map((work) => (
                      <div
                        key={`${work.sub}-${work.num}`}
                        className="work-card"
                        tabIndex={0}
                        role="button"
                        aria-label={`${group.label} ${work.num}번 작품 상세 보기`}
                        onClick={() => setModalData(work)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setModalData(work);
                          }
                        }}
                      >
                        <div className="work-thumb">
                          <span className="work-thumb-icon">{work.icon}</span>
                          <span>작품 썸네일 이미지<br />({work.sub} {work.num})</span>
                        </div>
                        <div className="work-info">
                          <p className="work-num">{work.catLabel} · {work.sub} No.{work.num}</p>
                          <p className="work-name">작품명 입력 예정</p>
                          <p className="work-author">제작자 이름</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      </main>

      {/* MODAL — 작품 상세 */}
      <div
        className={`modal-overlay${modalData ? ' active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalWorkTitle"
        onClick={(e) => { if (e.target === e.currentTarget) setModalData(null); }}
      >
        {modalData && (
          <div className="modal-box work-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              aria-label="모달 닫기"
              onClick={() => setModalData(null)}
            >✕</button>

            {/* 영상 영역 */}
            <div className="modal-video-ph">
              <div className="play-icon" aria-hidden="true"></div>
              <span>{modalData.catLabel} {modalData.sub} No.{modalData.num} 작품 소개 영상</span>
            </div>

            {/* 텍스트 영역 */}
            <div className="work-modal-body">
              <span className="modal-badge">{modalData.catLabel} &gt; {modalData.sub}</span>
              <h2 className="modal-work-title" id="modalWorkTitle">
                [{modalData.sub}] 작품명 입력 예정
              </h2>
              <p className="modal-work-author">제작자 이름 · 미디어콘텐츠학부</p>
              <div className="modal-divider"></div>

              <p className="modal-section-label">작품 소개</p>
              <div className="work-modal-text-ph">
                이 영역에는 &quot;{modalData.sub}&quot; 분야 No.{modalData.num} 작품에 대한 소개 문구가 들어갑니다.
                졸업생의 기획 의도, 제작 과정, 사용한 기술 스택 및 툴, 작품의 주요 특징 등을 기술합니다.
              </div>

              <p className="modal-section-label">제안서 및 작품 정보</p>
              <div className="work-modal-text-ph">
                제안서 주요 내용이 이 영역에 표시됩니다. 문제 정의, 솔루션 방향, 기대 효과,
                활용 기술, 일정 계획 등의 항목이 포함됩니다.
                실제 제안서 PDF 링크 또는 발표 자료 링크도 이곳에 첨부될 예정입니다.
              </div>

              <div className="modal-meta-grid">
                <div className="modal-meta-item">
                  <p className="m-label">카테고리</p>
                  <p className="m-value">{modalData.catLabel}</p>
                </div>
                <div className="modal-meta-item">
                  <p className="m-label">서브 카테고리</p>
                  <p className="m-value">{modalData.sub}</p>
                </div>
                <div className="modal-meta-item">
                  <p className="m-label">제작자</p>
                  <p className="m-value">제작자 이름</p>
                </div>
                <div className="modal-meta-item">
                  <p className="m-label">작품 번호</p>
                  <p className="m-value">No.{modalData.num}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
