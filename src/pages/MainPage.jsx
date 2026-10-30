import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { graduates } from '../data/graduates';
import { professors } from '../data/professors';
import { EXHIBITION, COMMITTEE_TEAMS } from '../data/constants';
import { assetUrl, FALLBACK } from '../hooks/useImageFallback';
import SafeImg from '../components/SafeImg';
import './MainPage.css';

/* ── 인트로 ─────────────────────────────────────────────────────────
   sha_copy index.js 의 INDEX INTRO 이식. 움직이는 WebP 를 전체 화면으로 보여 주고
   INTRO_DURATION 이 지나거나 SKIP 을 누르면 사라진다.
   사이트 안에서 메인으로 돌아올 때마다 다시 나오지 않도록, 새로고침 전까지는 한 번만 재생한다. */
const INTRO_DURATION = 7000;   // WebP 애니메이션 길이에 맞출 것
const INTRO_FADE = 750;
const INTRO_SAFETY = 10000;    // 로딩 실패 대비
let introPlayed = false;

const IndexIntro = ({ onDone }) => {
  const [hiding, setHiding] = useState(false);
  const finishedRef = useRef(false);
  const startedRef = useRef(false);
  const timersRef = useRef([]);

  // 인트로가 끝나기 전에는 본문이 보이지 않도록 html 에 상태 클래스를 건다 (그려지기 전에)
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.add('index-intro-pending');
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      root.classList.remove('index-intro-pending', 'index-intro-complete');
    };
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    timersRef.current.forEach(clearTimeout);
    const root = document.documentElement;
    root.classList.remove('index-intro-pending');
    root.classList.add('index-intro-complete');
    setHiding(true);
    timersRef.current = [window.setTimeout(onDone, INTRO_FADE)];
  }, [onDone]);

  const start = useCallback(() => {
    if (startedRef.current || finishedRef.current) return;
    startedRef.current = true;
    timersRef.current.push(window.setTimeout(finish, INTRO_DURATION));
  }, [finish]);

  useEffect(() => {
    const safety = window.setTimeout(finish, INTRO_SAFETY);
    return () => clearTimeout(safety);
  }, [finish]);

  return (
    <div className={`index-intro${hiding ? ' is-hiding' : ''}`}>
      <img
        className="index-intro-image"
        src={assetUrl('/images/인트로.webp')}
        alt="2026 졸업전시회 인트로 애니메이션"
        fetchPriority="high"
        ref={(el) => { if (el?.complete && el.naturalWidth > 0) start(); }}
        onLoad={start}
        onError={finish}
      />
      <button type="button" className="index-intro-skip" onClick={finish}>SKIP</button>
    </div>
  );
};

/* ── 학생 슬라이더 ──────────────────────────────────────────────────
   학생 1명 = 명찰 이미지 1장 (public/images/명찰 사진/2026 졸업전시회 명찰_이름.png).
   PC 10명(5×2), 모바일(768px 이하) 4명(2×2)씩 한 페이지. */
const useMediaQuery = (query) => useSyncExternalStore(
  (callback) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', callback);
    return () => mq.removeEventListener('change', callback);
  },
  () => window.matchMedia(query).matches,
  () => false,
);

const STUDENTS = graduates.map((g) => ({
  id: g.studentId,
  name: g.name,
  image: `/images/명찰 사진/2026 졸업전시회 명찰_${g.name}.png`,
  to: `/student?student=${g.studentId}`,
}));

const StudentSlider = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const pageSize = isMobile ? 4 : 10;
  const totalPages = Math.ceil(STUDENTS.length / pageSize);

  // PC ↔ 모바일로 바뀌면 첫 페이지부터
  const [state, setState] = useState({ size: pageSize, page: 0 });
  const page = state.size === pageSize ? Math.min(state.page, totalPages - 1) : 0;
  const goTo = (next) => setState({ size: pageSize, page: next });

  const pages = Array.from({ length: totalPages }, (_, i) => STUDENTS.slice(i * pageSize, (i + 1) * pageSize));

  return (
    <>
      <div className="students-slider-wrap" data-reveal role="region" aria-label="학생 프로필 슬라이드">
        <button
          type="button"
          className="students-nav students-nav-prev"
          aria-label="이전 학생 목록"
          disabled={page === 0}
          onClick={() => goTo(page - 1)}
        >
          <img src={assetUrl('/images/UI/slide_pre.png')} alt="" onError={(e) => { e.currentTarget.hidden = true; }} />
        </button>

        <div className="students-slider">
          <div className="students-track" style={{ transform: `translateX(-${page * 100}%)` }}>
            {pages.map((list, i) => (
              <div className="students-page" key={i} inert={i !== page} aria-hidden={i !== page}>
                <div className="students-grid">
                  {list.map((s) => (
                    <article className="student-card" key={s.id}>
                      <Link className="student-card-link" to={s.to} aria-label={`${s.name} 학생 소개 보기`}>
                        <div className="student-card-image">
                          <SafeImg src={s.image} fallbackSrc={FALLBACK.avatar} alt={`${s.name} 학생 프로필`} />
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="students-nav students-nav-next"
          aria-label="다음 학생 목록"
          disabled={page === totalPages - 1}
          onClick={() => goTo(page + 1)}
        >
          <img src={assetUrl('/images/UI/slide_next.png')} alt="" onError={(e) => { e.currentTarget.hidden = true; }} />
        </button>
      </div>

      <p className="main-sr-only" aria-live="polite">{`학생 슬라이드 ${page + 1} / ${totalPages}`}</p>
    </>
  );
};

/* ── 크레딧 ─────────────────────────────────────────────────────── */
const SPACE = '　';   // 이름 사이 전각 공백 (sha_copy 와 동일)
const chunk = (list, size) => Array.from({ length: Math.ceil(list.length / size) }, (_, i) => list.slice(i * size, (i + 1) * size));

const committeeByTeam = COMMITTEE_TEAMS
  .map((team) => ({ team, names: graduates.filter((g) => g.committeeTeam === team).map((g) => g.name) }))
  .filter((t) => t.names.length > 0);

const professorNames = professors.map((p) => p.name.replace(/ 교수$/, ''));
const graduateRows = chunk(graduates.map((g) => g.name), 15);

/* ── 메인 페이지 ────────────────────────────────────────────────── */
const TARGETS = [
  { category: 'multimedia', label: '멀티미디어' },
  { category: 'video',      label: '영상미디어' },
  { category: 'team',       label: '팀프로젝트' },
];

const MainPage = () => {
  const [showIntro, setShowIntro] = useState(
    () => !introPlayed && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const handleIntroDone = useCallback(() => {
    introPlayed = true;
    setShowIntro(false);
  }, []);

  // 메인 전용 스타일(body.page-index)
  useEffect(() => {
    document.body.classList.add('page-index');
    return () => document.body.classList.remove('page-index');
  }, []);

  return (
    <div className="index-root">
      {showIntro && <IndexIntro onDone={handleIntroDone} />}

      <main className="main-page">

        {/* 01. MAIN VIDEO — 영상(이미지) 안에 글자가 포함된 형태 */}
        <section className="main-hero-video" aria-label="2026 졸업전시회 메인 영상">
          <img src={assetUrl('/images/메인배너_수정예정.png')} alt="" />
        </section>

        {/* 02. EXHIBITION CONCEPT */}
        <section className="main-concept" data-reveal>
          <div className="concept-inner">
            <div className="concept-copy">
              <p className="section-label">EXHIBITION CONCEPT</p>
              <h2 className="concept-title">
                서로 다른 시선이<br />
                <span>하나의 과녁</span>을<br />
                겨눈다
              </h2>
              <p className="concept-description">
                무수한 정보와 시도 사이, 자신만의 질문을 품고
                가능성을 탐색하며 의미 있는 방향을 제시하는 졸업전시.
              </p>
              <p className="concept-description concept-description-sub">
                각기 다른 시선과 가능성이 하나의 결과물로 이어지는
                과정과 순간을 소개합니다.
              </p>
            </div>

            {/* 콘셉트 이미지 자리 — 이미지가 정해지면 <img> 를 넣는다 */}
            <div className="concept-visual main-image-slot" role="img" aria-label="전시 콘셉트 이미지" />
          </div>
        </section>

        {/* 03. TARGET / PROJECT */}
        <section className="main-target" data-reveal>
          <div className="target-inner">
            <div className="target-heading">
              <div className="target-title-group">
                <h2>TARGET</h2>
                <p>
                  가능성이 확신이 되는 순간,<br />
                  <strong>하나의 작품으로 명중합니다</strong>
                </p>
              </div>
              <p className="target-description">
                질문에서 시작된 가능성이 하나의 결과물을 만들어내는 순간을 소개합니다.
              </p>
            </div>

            {/* 카테고리 대표 이미지 3개 — 이미지 한 장에 디자인과 글자가 포함 */}
            <div className="target-grid">
              {TARGETS.map(({ category, label }) => (
                <Link
                  key={category}
                  to={`/project?category=${category}`}
                  className="target-card"
                  aria-label={`${label} 작품 보기`}
                >
                  <div className="target-card-image main-image-slot" />
                </Link>
              ))}
            </div>

            <div className="main-button-wrap">
              <Link to="/project" className="main-outline-button">전체작품 구경하기</Link>
            </div>
          </div>
        </section>

        {/* 04. STUDENT PROFILE */}
        <section className="main-students">
          <div className="students-inner">
            <div className="students-heading" data-reveal>
              <p className="section-label section-label-blue">Student Profile</p>
              <h2>
                작품 뒤에는 <span>각자의 시선</span>이 있습니다
              </h2>
              <p className="students-description">
                새로운 시각의 결실을 함께 만든, 미디어콘텐츠학부의 학생들을 소개합니다.
              </p>
            </div>

            <StudentSlider />

            <div className="main-button-wrap">
              <Link to="/student" className="main-outline-button">전체학생 조회하기</Link>
            </div>
          </div>
        </section>

        {/* 05. EXHIBITION INFORMATION */}
        <section className="main-info" data-reveal>
          <div className="info-inner">
            <div className="info-content">
              <p className="section-label section-label-yellow">EXHIBITION</p>
              <h2>전시안내</h2>

              <div className="info-row">
                <h3>주소</h3>
                <div className="info-value">
                  <p>{EXHIBITION.address}</p>
                  <p>{EXHIBITION.place}</p>
                  <p className="info-address-en">
                    {EXHIBITION.addressEn[0]}<br />
                    {EXHIBITION.addressEn[1]}
                  </p>
                </div>
              </div>

              <div className="info-row">
                <h3>일시</h3>
                <div className="info-value">
                  <p className="info-date"><span>DATE</span><span>{EXHIBITION.dateText}</span></p>
                  <p className="info-date"><span>TIME</span><span>{EXHIBITION.hoursText}</span></p>
                </div>
              </div>
            </div>

            <div className="info-map main-image-slot has-image" role="img" aria-label="전시 장소 안내 지도">
              <img src={assetUrl('/images/학교지도.png')} alt="졸업전시 장소 안내 지도" loading="lazy" />
            </div>
          </div>
        </section>

        {/* 06. CREDIT */}
        <section className="main-credit" data-reveal>
          <div className="credit-inner">
            <div className="credit-header">
              <h2>Credit</h2>
              <div className="credit-logo" />
            </div>
            <p className="credit-subtitle">2026 Media Contents Graduation · 서원대학교 미디어콘텐츠학부</p>

            <div className="credit-row">
              <h3>졸업전시위원회</h3>
              <div className="credit-committee">
                {committeeByTeam.map(({ team, names }) => (
                  <div className="credit-team" key={team}>
                    <strong>{team}</strong>
                    <span>{names.join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="credit-row">
              <h3>교수진</h3>
              <div className="credit-names">{professorNames.join(SPACE)}</div>
            </div>

            <div className="credit-row">
              <h3>졸업생</h3>
              <div className="credit-names credit-graduates">
                {graduateRows.map((row, i) => <p key={i}>{row.join(SPACE)}</p>)}
              </div>
            </div>
          </div>
        </section>
      </main>

      <button
        type="button"
        className="main-top-button"
        aria-label="맨 위로 이동"
        onClick={() => window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 21V3M4.5 10.5 12 3l7.5 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default MainPage;
