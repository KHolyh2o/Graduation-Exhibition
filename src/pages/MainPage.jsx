import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

/* ─────────── 상수 & 더미 데이터 ─────────── */
const TOTAL    = 40;
const CARD_GAP = 20;

const graduates = Array.from({ length: TOTAL }, (_, i) => ({
  num:     String(i + 1).padStart(2, '0'),
  name:    `졸업생 ${i + 1}`,
  major:   '미디어콘텐츠학부 · 2026년 졸업',
  info:    `학번: 2022XXXXX  |  지도 교수: ○○○ 교수님  |  연락처: 010-XXXX-XXXX`,
  work:    `작품 제목: [작품명 입력]  |  장르: 영상 / 그래픽 / 웹 등\n작품에 대한 간략한 설명이 이곳에 표시됩니다. 졸업생의 작품 의도, 사용 기술, 완성도 등을 소개합니다.`,
  comment: `4년간의 학교생활을 마치며 느낀 소감과 감사 인사를 전합니다.\n함께해 준 동기들, 지도해 주신 교수님들, 항상 응원해 주신 가족에게 감사드립니다.`,
}));

/* ─────────── 컴포넌트 ─────────── */
const MainPage = () => {
  const [curIdx,    setCurIdx]    = useState(0);
  const [cardW,     setCardW]     = useState(280);
  const [visibleN,  setVisibleN]  = useState(3.2);
  const [modalData, setModalData] = useState(null);

  const trackRef      = useRef(null);
  const trackOuterRef = useRef(null);

  /* ── 레이아웃 계산 ── */
  const calcLayout = useCallback(() => {
    if (!trackOuterRef.current) return;
    const outerW = trackOuterRef.current.clientWidth - 56;
    if (window.innerWidth <= 640) {
      setVisibleN(1.3);
      setCardW(Math.round(outerW / 1.3));
    } else if (window.innerWidth <= 900) {
      setVisibleN(2.2);
      setCardW(Math.round((outerW - CARD_GAP) / 2.2));
    } else {
      setVisibleN(3.2);
      setCardW(Math.round((outerW - CARD_GAP * 2) / 3.2));
    }
  }, []);

  useEffect(() => {
    calcLayout();
    window.addEventListener('resize', calcLayout);
    return () => window.removeEventListener('resize', calcLayout);
  }, [calcLayout]);

  /* ── 트랙 이동 (transform 직접 조작) ── */
  useEffect(() => {
    if (!trackRef.current) return;
    const offset = curIdx * (cardW + CARD_GAP);
    trackRef.current.style.transform = `translateX(-${offset}px)`;
    trackRef.current.querySelectorAll('.profile-card').forEach((c) => {
      c.style.flex  = `0 0 ${cardW}px`;
      c.style.width = `${cardW}px`;
    });
  }, [curIdx, cardW]);

  const maxIdx = Math.max(0, TOTAL - Math.floor(visibleN));

  const moveTo = useCallback((idx) => {
    setCurIdx(Math.max(0, Math.min(idx, maxIdx)));
  }, [maxIdx]);

  /* ── 터치 / 드래그 스와이프 ── */
  useEffect(() => {
    const outer = trackOuterRef.current;
    if (!outer) return;
    let startX    = 0;
    let isDragging = false;

    const onDown   = (e) => { startX = e.clientX; isDragging = true; };
    const onTStart = (e) => { startX = e.touches[0].clientX; isDragging = true; };
    const onEnd    = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? startX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        setCurIdx((prev) => Math.max(0, Math.min(diff > 0 ? prev + 1 : prev - 1, maxIdx)));
      }
    };
    const onLeave = () => { isDragging = false; };

    outer.addEventListener('mousedown',  onDown);
    outer.addEventListener('touchstart', onTStart, { passive: true });
    outer.addEventListener('mouseup',    onEnd);
    outer.addEventListener('touchend',   onEnd,   { passive: true });
    outer.addEventListener('mouseleave', onLeave);
    return () => {
      outer.removeEventListener('mousedown',  onDown);
      outer.removeEventListener('touchstart', onTStart);
      outer.removeEventListener('mouseup',    onEnd);
      outer.removeEventListener('touchend',   onEnd);
      outer.removeEventListener('mouseleave', onLeave);
    };
  }, [maxIdx]);

  /* ── 스크롤 Reveal ── */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── 모달 body overflow ── */
  useEffect(() => {
    document.body.style.overflow = modalData ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalData]);

  /* ── ESC 키 모달 닫기 ── */
  useEffect(() => {
    if (!modalData) return;
    const onKey = (e) => { if (e.key === 'Escape') setModalData(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalData]);

  /* ── 진행 바 계산 ── */
  const progressPct   = maxIdx > 0 ? (curIdx / maxIdx) * 100 : 0;
  const shownEnd      = Math.min(curIdx + Math.floor(visibleN), TOTAL);
  const progressLabel = `${String(curIdx + 1).padStart(2, '0')} – ${String(shownEnd).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`;

  /* ─────────── JSX ─────────── */
  return (
    <main>

      {/* ── SECTION 1 · 프로모션 영상 Hero ── */}
      <section id="hero" aria-label="프로모션 영상">
        <div className="ph hero-video-ph" role="img" aria-label="프로모션 영상 재생 영역">
          <div className="play-icon" aria-hidden="true"></div>
          <span>프로모션 영상 재생 영역</span>
        </div>
        <p className="hero-scroll-hint" aria-hidden="true">↓ SCROLL</p>
      </section>

      {/* ── SECTION 2 · 전시 소개 ── */}
      <section id="intro" aria-labelledby="intro-title">
        <div className="container">
          <div className="intro-grid">

            {/* 포스터 */}
            <div
              className="ph intro-poster reveal"
              role="img"
              aria-label="졸업전시 공식 포스터 이미지"
            >
              졸업전시<br />공식 포스터
            </div>

            {/* 텍스트 */}
            <div className="intro-content reveal">
              <p className="section-label">2026 Graduation Exhibition</p>
              <div className="exhibit-year" aria-hidden="true">2026</div>
              <h1 className="exhibit-title" id="intro-title">
                전시 타이틀을<br />이곳에 입력합니다
              </h1>
              <div className="exhibit-divider" aria-hidden="true"></div>

              <p className="exhibit-concept">
                이곳에는 졸업전시의 핵심 컨셉과 테마를 소개하는 문구가 들어갑니다.
                미디어콘텐츠학부 학생들이 4년간 쌓아온 열정과 창의성을 담아 선보이는
                특별한 전시입니다.
              </p>
              <p className="exhibit-concept">
                각 졸업생들이 직접 기획하고 제작한 작품들을 통해 미래 미디어 산업의
                가능성을 탐색합니다. 전시 기간 동안 다양한 부대 행사와 함께 관람객
                여러분을 맞이할 예정입니다.
              </p>

              <div className="exhibit-meta">
                <div className="meta-card">
                  <div className="meta-label">전시 기간</div>
                  <div className="meta-value">2026. 00. 00 — 00. 00</div>
                </div>
                <div className="meta-card">
                  <div className="meta-label">전시 장소</div>
                  <div className="meta-value">서원대학교 ○○관</div>
                </div>
                <div className="meta-card">
                  <div className="meta-label">참여 인원</div>
                  <div className="meta-value">40명</div>
                </div>
                <div className="meta-card">
                  <div className="meta-label">관람 시간</div>
                  <div className="meta-value">00:00 — 00:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 · 졸업생 프로필 캐러셀 ── */}
      <section id="profiles" aria-labelledby="profiles-title">
        <div className="container">

          {/* 헤더 */}
          <div className="profiles-header reveal">
            <div>
              <p className="section-label">Class of 2026</p>
              <h2 className="profiles-title" id="profiles-title">졸업생 프로필</h2>
            </div>
            <div className="profiles-header-right">
              <span className="profiles-count">총 40명 · 클릭하면 상세 정보를 볼 수 있습니다</span>
              <Link to="/project" className="profiles-more-btn" aria-label="작품소개 페이지로 이동">
                더보기
                <span className="btn-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* 캐러셀 */}
          <div className="carousel-wrap reveal" aria-label="졸업생 프로필 슬라이드">
            <div className="carousel-track-outer" ref={trackOuterRef}>
              <div className="carousel-track" ref={trackRef}>
                {graduates.map((g) => (
                  <div
                    key={g.num}
                    className="profile-card"
                    tabIndex={0}
                    role="button"
                    aria-label={`${g.name} 프로필 보기`}
                    style={{ flex: `0 0 ${cardW}px`, width: `${cardW}px` }}
                    onClick={() => setModalData(g)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setModalData(g);
                      }
                    }}
                  >
                    <div className="profile-card-img">
                      <div className="img-icon" aria-hidden="true">👤</div>
                      <span>프로필 사진 영역</span>
                    </div>
                    <div className="profile-card-body">
                      <span className="profile-card-num">No.{g.num}</span>
                      <span className="profile-card-name">{g.name}</span>
                      <span className="profile-card-work">작품명 입력 예정</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 진행 바 + 화살표 */}
            <div className="carousel-progress">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
              </div>
              <span className="progress-label">{progressLabel}</span>
              <div className="carousel-arrows">
                <button
                  className="carousel-btn"
                  aria-label="이전 슬라이드"
                  disabled={curIdx === 0}
                  onClick={() => moveTo(curIdx - 1)}
                >←</button>
                <button
                  className="carousel-btn"
                  aria-label="다음 슬라이드"
                  disabled={curIdx >= maxIdx}
                  onClick={() => moveTo(curIdx + 1)}
                >→</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4 · 아카이브 CTA ── */}
      <section id="archive" aria-labelledby="archive-title">
        <div className="container">
          <div className="archive-inner reveal">
            <p className="archive-eyebrow">Exhibition Archive</p>
            <h2 className="archive-heading" id="archive-title">
              지난 졸업전시의<br />기억을 만나보세요
            </h2>
            <p className="archive-desc">
              서원대학교 미디어콘텐츠학부 선배들의 열정과 창의력이 담긴<br />
              역대 졸업전시 아카이브를 둘러보세요.
            </p>

            <Link to="/others" className="cta-btn" aria-label="지난 년도 작품 구경하기 페이지로 이동">
              지난 년도 작품 구경하기
              <span className="arrow" aria-hidden="true">→</span>
            </Link>

            <div className="year-tags" aria-label="연도별 아카이브">
              {['2025','2024','2023','2022','2021'].map((y) => (
                <Link key={y} to="/others" className="year-tag">{y}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL · 프로필 상세 ── */}
      <div
        className={`modal-overlay${modalData ? ' active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalName"
        onClick={(e) => { if (e.target === e.currentTarget) setModalData(null); }}
      >
        {modalData && (
          <div className="modal-box main-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              aria-label="모달 닫기"
              onClick={() => setModalData(null)}
            >✕</button>

            {/* 모달 헤더 */}
            <div className="modal-header">
              <div className="ph modal-profile-img" role="img" aria-label="프로필 사진">프로필 사진</div>
              <div className="modal-profile-info">
                <p className="modal-num">No. {modalData.num}</p>
                <h2 className="modal-name" id="modalName">{modalData.name}</h2>
                <p className="modal-major">{modalData.major}</p>
              </div>
            </div>

            {/* 모달 바디 */}
            <div className="modal-body">
              <div>
                <p className="modal-section-title">기본 정보</p>
                <div className="modal-text-ph">{modalData.info}</div>
              </div>
              <div>
                <p className="modal-section-title">담당 졸업 작품</p>
                <div className="modal-work-ph">
                  <p className="work-title">작품 제목 / 장르</p>
                  <div className="ph modal-work-thumb" role="img" aria-label="작품 썸네일">작품 썸네일 이미지</div>
                  <p className="modal-work-desc">{modalData.work}</p>
                </div>
              </div>
              <div>
                <p className="modal-section-title">졸업 소감</p>
                <div className="modal-text-ph">{modalData.comment}</div>
              </div>
            </div>
          </div>
        )}
      </div>

    </main>
  );
};

export default MainPage;
