import React, { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { graduates } from '../data/graduates';
import { professors } from '../data/professors';
import { allWorks, getWorkTitle } from '../data/works';
import { EXHIBITION, COMMITTEE_TEAMS } from '../data/constants';
import { assetUrl, FALLBACK } from '../hooks/useImageFallback';
import SafeImg from '../components/SafeImg';
import GraduateModal from '../components/GraduateModal';
import './MainPage.css';

/* ── 인트로 ─────────────────────────────────────────────────────────
   sha_copy index.js 의 INDEX INTRO 이식. 움직이는 WebP 를 전체 화면으로 보여 주고
   INTRO_DURATION 이 지나거나 화면(하단 띠)을 누르면 사라진다.
   사이트 안에서 메인으로 돌아올 때마다 다시 나오지 않도록, 새로고침 전까지는 한 번만 재생한다. */
const INTRO_DURATION = 6000;   // WebP 애니메이션 길이에 맞출 것
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
    <div className={`index-intro${hiding ? ' is-hiding' : ''}`} onClick={finish}>
      <img
        className="index-intro-image"
        src={assetUrl('/images/인트로.webp')}
        alt="2026 졸업전시회 인트로 애니메이션"
        fetchPriority="high"
        ref={(el) => { if (el?.complete && el.naturalWidth > 0) start(); }}
        onLoad={start}
        onError={finish}
      />
      <button type="button" className="index-intro-skip" onClick={finish}>
        <span>2026 졸업전시 보러가기</span>
      </button>
    </div>
  );
};

/* ── 학생 슬라이더 ──────────────────────────────────────────────────
   학생 1명 = 명찰 이미지 1장 (public/images/명찰 사진/2026 졸업전시회 명찰_이름.png).
   PC 10명(5×2), 모바일(768px 이하) 1명씩 한 페이지.
   카드를 누르면 페이지 이동 없이 메인 위에 학생 소개 팝업이 열린다. */
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
}));

const StudentSlider = () => {
  const [openId, setOpenId] = useState(null);
  const lastTriggerRef = useRef(null);
  const opened = graduates.find((g) => g.studentId === openId) ?? null;
  const closePopup = () => {
    setOpenId(null);
    const trigger = lastTriggerRef.current;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    lastTriggerRef.current = null;
  };
  const isMobile = useMediaQuery('(max-width: 768px)');
  const pageSize = isMobile ? 1 : 10;
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
                      <button
                        type="button"
                        className="student-card-link"
                        aria-label={`${s.name} 학생 소개 보기`}
                        onClick={(e) => { lastTriggerRef.current = e.currentTarget; setOpenId(s.id); }}
                      >
                        <div className="student-card-image">
                          <SafeImg src={s.image} fallbackSrc={FALLBACK.avatar} alt={`${s.name} 학생 프로필`} />
                        </div>
                      </button>
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

      {opened && <GraduateModal student={opened} onClose={closePopup} />}
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
  { category: 'multimedia', label: '멀티미디어', keyword: 'SIGNAL' },
  { category: 'video',      label: '영상미디어', keyword: 'FOCUS' },
  { category: 'team',       label: '팀프로젝트', keyword: 'TARGET' },
];

const TARGET_SHUFFLE_MS = 5000;

// 카테고리마다 썸네일이 있는 작품 중 하나를 무작위로 뽑는다 (직전 작품과 겹치지 않게)
const POOLS = TARGETS.map((t) => allWorks.filter((w) => w.tab === t.category && w.thumbnail));
const pickRandomTargets = (prev) => TARGETS.map((t, i) => {
  const pool = POOLS[i].length > 1 ? POOLS[i].filter((w) => w !== prev?.[i]?.work) : POOLS[i];
  return { ...t, work: pool[Math.floor(Math.random() * pool.length)] };
});

/* 작품이 바뀔 때 깜빡이지 않도록 새 이미지를 미리 불러온 뒤, 이전 이미지 위에서 서서히 나타낸다 */
const CrossfadeImg = ({ src }) => {
  const [layers, setLayers] = useState(() => [{ src, key: 0 }]);
  const keyRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    const show = () => {
      if (cancelled) return;
      setLayers((prev) => (prev[prev.length - 1].src === src ? prev : [...prev.slice(-1), { src, key: ++keyRef.current }]));
    };
    img.onload = show;
    img.onerror = show;
    img.src = assetUrl(src);
    return () => { cancelled = true; };
  }, [src]);

  // 페이드가 끝나면 맨 아래 이전 이미지를 치운다
  useEffect(() => {
    if (layers.length < 2) return undefined;
    const timer = window.setTimeout(() => setLayers((prev) => prev.slice(-1)), 900);
    return () => clearTimeout(timer);
  }, [layers]);

  return layers.map((l, i) => (
    <SafeImg
      key={l.key}
      className={i > 0 ? 'target-fade-in' : undefined}
      src={l.src}
      fallbackSrc={FALLBACK.image}
      alt=""
    />
  ));
};

const MainPage = () => {
  const [targets, setTargets] = useState(() => pickRandomTargets());

  // 카드에 마우스를 올리거나 포커스가 있는 동안에는 작품이 바뀌지 않는다
  const targetPausedRef = useRef(false);
  const pauseTargets = () => { targetPausedRef.current = true; };
  const resumeTargets = () => { targetPausedRef.current = false; };

  // 새로고침 없이 5초마다 대표 작품이 바뀐다 (모션 줄이기 설정이면 고정)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      if (!targetPausedRef.current) setTargets((prev) => pickRandomTargets(prev));
    }, TARGET_SHUFFLE_MS);
    return () => clearInterval(timer);
  }, []);
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
        <section className="main-hero-video" aria-label="2026 졸업전시회 메인 배너">
          {/* 움직이는 WebP 배경 */}
          <img className="main-hero-webp" src={assetUrl('/images/배너.webp')} alt="" fetchPriority="high" />
          {/* 오른쪽 상단 : 전시회 정보 */}
          <img className="main-banner-overlay banner-info" src={assetUrl('/images/banner-2.png')} alt="2026 서원대학교 미디어콘텐츠학부 졸업전시회" />
          {/* 오른쪽 중앙 : 메인 타이틀 */}
          <img className="main-banner-overlay banner-title" src={assetUrl('/images/banner-3.png')} alt="서로 다른 시선이 과녁을 겨눈다" />
          {/* 오른쪽 하단 : 영문 전시 로고 */}
          <img className="main-banner-overlay banner-logo" src={assetUrl('/images/banner-1.png')} alt="2026 Graduation Exhibition" />
        </section>

        {/* 02. EXHIBITION CONCEPT */}
        <section className="main-concept" data-reveal>
          <div className="concept-inner">
            <div className="concept-copy">
              <p className="section-label">EXHIBITION CONCEPT</p>
              <h2 className="concept-title" style={{ fontSize: '3.2rem' }}>
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

            <div className="concept-visual main-image-slot has-image">
              <img src={assetUrl('/images/배너하단.webp')} alt="전시 콘셉트 이미지" loading="lazy" />
            </div>
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
            <div
              className="target-grid"
              onMouseEnter={pauseTargets}
              onMouseLeave={resumeTargets}
              onFocus={pauseTargets}
              onBlur={resumeTargets}
            >
              {targets.map(({ category, label, keyword, work }) => (
                <Link
                  key={category}
                  to={work ? `/project/${work.id}` : `/project?category=${category}`}
                  className="target-card"
                  aria-label={work ? `${label} · ${getWorkTitle(work)} 작품 보기` : `${label} 작품 보기`}
                >
                  <div className="target-card-image main-image-slot">
                    {work && <CrossfadeImg src={work.thumbnail} />}
                    <span className="target-card-keyword" aria-hidden="true">{keyword}</span>
                  </div>
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
              <div className="credit-logo">
                <img src={assetUrl('/images/UI/크레딧 화살.png')} alt="" onError={(e) => e.currentTarget.remove()} />
              </div>
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
