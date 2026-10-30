import React, { useEffect, useRef, useState } from 'react';
import { professors } from '../data/professors';
import { assetUrl, FALLBACK } from '../hooks/useImageFallback';
import SafeImg from '../components/SafeImg';
import './DepartmentPage.css';

// 교육목표 3가지 (sha_copy department.html 기준 문구)
const GOALS = [
  {
    tone: 'red', no: '01', title: '실무 중심 콘텐츠 전문가 교육과정',
    items: [
      '직무 전공별 특화 실무 교육 진행',
      '국가직무능력표준기반 교육 커리큘럼 운영',
      '스마트콘텐츠, 영상미디어, 게임 등 진로디자인모듈 운영',
      '실무 중심 교수진 및 교과·비교과 프로그램 구성',
    ],
  },
  {
    tone: 'blue', no: '02', title: '산학협력 프로젝트 활성화',
    items: [
      '첨단융합스튜디오 운영 및 활성화',
      '실무 프로젝트 및 취·창업 동아리와 산학협력 연계',
      '창업캡스톤디자인 과목 연계를 통한 산학연 프로젝트 진행',
      '공모전, 경진대회 등 현업 실무자 지도 및 컨설팅 진행',
    ],
  },
  {
    tone: 'yellow', no: '03', title: '멀티미디어 융복합콘텐츠 연구 개발',
    items: [
      '스마트디바이스를 활용한 스마트콘텐츠 제작 및 구현',
      '[New Media Contents Zone] 영상미디어콘텐츠 제작',
      '[XR Contents Zone] 3D, 게임, VR·AR, 홀로그램 개발',
      '[Co-working Space] 콘텐츠 아이디어·아이템 개발 구현',
    ],
  },
];

// "미디어콘텐츠학부장" → "미디어콘텐츠학부 학부장", "지도교수" → "미디어콘텐츠학부 지도교수"
const positionOf = (role) => {
  if (role === '미디어콘텐츠학부장') return '미디어콘텐츠학부 학부장';
  return role.startsWith('미디어콘텐츠학부') ? role : `미디어콘텐츠학부 ${role}`;
};

const DepartmentPage = () => {
  const [selected, setSelected] = useState(null);
  const lastTriggerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const frameRef = useRef(null);

  // 푸터 여백 등 페이지 전용 스타일(body.page-department)
  useEffect(() => {
    document.body.classList.add('page-department');
    return () => document.body.classList.remove('page-department');
  }, []);

  const closeMessage = () => {
    setSelected(null);
    const trigger = lastTriggerRef.current;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    lastTriggerRef.current = null;
  };

  const openMessage = (prof, trigger) => {
    lastTriggerRef.current = trigger;
    setSelected(prof);
  };

  // 팝업이 열려 있는 동안: 배경 스크롤 잠금, 맨 위에서 시작, 닫기 버튼 포커스, ESC·Tab 처리
  useEffect(() => {
    if (!selected) return undefined;
    document.body.classList.add('dept-message-open');
    frameRef.current?.scrollTo(0, 0);
    closeBtnRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelected(null);
        const trigger = lastTriggerRef.current;
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      } else if (e.key === 'Tab') {
        e.preventDefault();             // 팝업 안에서는 닫기 버튼에 포커스 유지
        closeBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('dept-message-open');
    };
  }, [selected]);

  return (
    <div className="dept-root">
      <main className="dept-page">

        {/* 01. 졸업전시 소개 */}
        <section className="dept-hero" data-reveal>
          {/* 포스터 이미지 자리 — 이미지가 정해지면 <img> 를 넣는다 */}
          <div className="dept-poster dept-image-slot" role="img" aria-label="2026 졸업전시회 포스터" />

          <div className="dept-hero-content">
            <h1 className="dept-symbol">과녁</h1>
            <h2 className="dept-hero-title">
              서로 다른 시선이 <span>하나의 과녁</span>을 겨눈다
            </h2>
            <p className="dept-hero-description">
              수많은 정보와 가능성 속에서 우리는 각자의 질문을 발견하고,<br />
              자신만의 방향을 조준해 왔습니다.<br />
              이번 졸업전시 (과녁)은 학생들이 쌓아온 고민과 과정,<br />
              그리고 각기 다른 가능성이 하나의 결과물로 세상을<br />
              향하는 순간을 담습니다.
            </p>
            <div className="dept-hero-caption">
              <p>2026 서원대학교 미디어콘텐츠학부 졸업전시회</p>
              <p>2026 SWU MEDIA CONTENTS EXHIBITION</p>
              <p>SEOWON UNIVERSITY, 2026</p>
            </div>
          </div>
        </section>

        {/* 02. 학부 소개 */}
        <section className="dept-introduction" data-reveal>
          <div className="dept-arrow-slot" />
          <h2>미디어콘텐츠학부</h2>
          <h3>질문을 찾고, 방향을 설계하는 사람들</h3>
          <p className="dept-introduction-description">
            미디어콘텐츠학부는 기획·디자인·영상·디지털 기술을 넘나들며
            자신만의 시선과 가능성을 발견하는 곳입니다.<br />
            학생들은 다양한 경험과 프로젝트를 통해 질문을 찾고,
            방향을 조준하며, 아이디어를 자신만의 콘텐츠로 완성해 나갑니다.
          </p>
          <div className="dept-arrow-slot" />
        </section>

        {/* 03. 미디어콘텐츠학부 교육목표 */}
        <section className="dept-education">
          <div className="dept-education-header" data-reveal>
            <h2>미디어콘텐츠학부 교육목표</h2>
            <p>
              미디어환경에 유기적으로 대응할 수 있는 첨단실용학문으로
              실무에서 요구하는 <strong>‘멀티형 인재’</strong>로 성장하기 위한<br />
              지능형·감성형·실감형 3단계 융합미디어교육과정을 통해
              스마트미디어콘텐츠전문가를 양성합니다.
            </p>
          </div>

          <div className="dept-diagram-wrap" data-reveal>
            {/* 교육목표 다이어그램 이미지 자리 */}
            <div className="dept-diagram dept-image-slot" role="img" aria-label="미디어콘텐츠학부 교육목표 다이어그램" />
          </div>

          <div className="dept-education-grid">
            {GOALS.map(({ tone, no, title, items }) => (
              <article key={no} className={`dept-goal dept-goal-${tone}`} data-reveal>
                <div className="dept-goal-heading">
                  <span className="dept-goal-number">{no}</span>
                  <h3>{title}</h3>
                </div>
                <div className="dept-goal-line" />
                <div className="dept-goal-text">
                  {items.map((item) => <p key={item}>{item}</p>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 04. 교수진 소개 */}
        <section className="dept-professors">
          <div className="dept-professors-header" data-reveal>
            <h2>PROFESSOR&apos;S MESSAGE</h2>
            <p>
              새로운 과녁을 향해 나아가는 학생들을 응원하는
              미디어콘텐츠학부 교수진을 소개합니다.
            </p>
          </div>

          <div className="dept-professor-grid">
            {professors.map((prof) => (
              <article className="dept-professor-card" key={prof.id} data-reveal>
                <button
                  type="button"
                  className="dept-professor-button"
                  aria-label={`${prof.name} 축사 보기`}
                  aria-haspopup="dialog"
                  onClick={(e) => openMessage(prof, e.currentTarget)}
                >
                  <div className="dept-professor-photo dept-image-slot">
                    <SafeImg src={prof.cardPhoto ?? prof.photo} fallbackSrc={FALLBACK.avatar} alt={`${prof.name} 사진`} />
                  </div>
                  <h3 className="dept-professor-name">{prof.name.replace(/ 교수$/, '')}</h3>
                  <p className="dept-professor-position">{positionOf(prof.role)}</p>
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* 교수 축사 팝업 */}
      {selected && (
        <div
          className="dept-message-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeMessage(); }}
        >
          <div className="dept-message-panel" role="dialog" aria-modal="true" aria-labelledby="dept-message-name">
            {/* 닫기 버튼: 스크롤해도 고정 */}
            <button
              type="button"
              ref={closeBtnRef}
              className="dept-message-close"
              aria-label="팝업 닫기"
              onClick={closeMessage}
            >
              <span aria-hidden="true">×</span>
            </button>

            <div className="dept-message-frame" ref={frameRef} tabIndex={-1}>
              <div className="dept-message-logo">
                <img src={assetUrl('/images/로고.png')} alt="2026 졸업전시회 과녁 로고" onError={(e) => e.currentTarget.remove()} />
              </div>

              <div className="dept-message-body">
                <div className="dept-message-photo">
                  <SafeImg src={selected.photo} fallbackSrc={FALLBACK.avatar} alt={`${selected.name} 사진`} />
                </div>

                <div className="dept-message-text">
                  <h2 className="dept-message-name" id="dept-message-name">{selected.name.replace(/ 교수$/, '')}</h2>
                  <p className="dept-message-position">
                    {positionOf(selected.role).replace('미디어콘텐츠학부 ', '미디어콘텐츠학부 / ')}
                  </p>
                  {selected.headline && <h3 className="dept-message-quote">{`“${selected.headline}”`}</h3>}
                  <div className="dept-message-content">
                    {selected.message || '축사 내용이 아직 등록되지 않았습니다.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="dept-top-button"
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

export default DepartmentPage;
