import React from 'react';
import { Link } from 'react-router-dom';
import { graduates } from '../data/graduates';
import { FALLBACK } from '../hooks/useImageFallback';
import SafeImg from '../components/SafeImg';
import useScrollReveal from '../hooks/useScrollReveal';
import useModal from '../hooks/useModal';
import useCarousel from '../hooks/useCarousel';
import Modal from '../components/Modal';
import './MainPage.css';

const MainPage = () => {
  const { modalData, setModalData } = useModal();
  const { curIdx, cardW, trackRef, trackOuterRef, moveTo, maxIdx, progressPct, progressLabel } = useCarousel(graduates.length);
  useScrollReveal();

  return (
    <main>

      {/* SECTION 1 · 프로모션 영상 Hero */}
      <section id="hero" aria-label="프로모션 영상">
        <div className="ph hero-video-ph" role="img" aria-label="프로모션 영상 재생 영역">
          <div className="play-icon" aria-hidden="true"></div>
          <span>프로모션 영상 재생 영역</span>
        </div>
        <p className="hero-scroll-hint" aria-hidden="true">↓ SCROLL</p>
      </section>

      {/* SECTION 2 · 전시 소개 */}
      <section id="intro" aria-labelledby="intro-title">
        <div className="container">
          <div className="intro-grid">

            <div
              className="ph intro-poster reveal"
              role="img"
              aria-label="졸업전시 공식 포스터 이미지"
            >
              졸업전시<br />공식 포스터
            </div>

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

      {/* SECTION 3 · 졸업생 프로필 캐러셀 */}
      <section id="profiles" aria-labelledby="profiles-title">
        <div className="container">

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

          <div className="carousel-wrap reveal" aria-label="졸업생 프로필 슬라이드">
            <div className="carousel-track-outer" ref={trackOuterRef}>
              <div className="carousel-track" ref={trackRef}>
                {graduates.map((g) => (
                  <div
                    key={g.id}
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
                      <SafeImg src={g.profileImage} fallbackSrc={FALLBACK.avatar} alt={g.name} />
                    </div>
                    <div className="profile-card-body">
                      <span className="profile-card-num">{g.id}</span>
                      <span className="profile-card-name">{g.name}</span>
                      <span className="profile-card-work">{g.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

      {/* SECTION 4 · 아카이브 CTA */}
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
              {['2025', '2024', '2023', '2022', '2021'].map((y) => (
                <Link key={y} to="/others" className="year-tag">{y}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Modal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        boxClassName="main-modal-box"
        ariaLabelledby="modalName"
      >
        {modalData && (
          <>
            <div className="modal-header">
              <SafeImg className="modal-profile-img" src={modalData.profileImage} fallbackSrc={FALLBACK.avatar} alt={modalData.name} />
              <div className="modal-profile-info">
                <p className="modal-num">{modalData.id}</p>
                <h2 className="modal-name" id="modalName">{modalData.name}</h2>
                <p className="modal-major">미디어콘텐츠학부 · 2026년 졸업</p>
              </div>
            </div>

            <div className="modal-body">
              <div>
                <p className="modal-section-title">기본 정보</p>
                <div className="modal-text-ph">
                  학번: {modalData.studentId} &nbsp;|&nbsp; 직군: {modalData.role}
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>

    </main>
  );
};

export default MainPage;
