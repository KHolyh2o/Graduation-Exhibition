import React, { useState, useEffect } from 'react';
import './DepartmentPage.css';

/* ─────────── 교수진 데이터 ─────────── */
const professors = [
  { id: 1, name: '김○○ 교수', subject: '스마트콘텐츠 기획 / 멀티미디어 제작론',
    message: '여러분이 4년간 쌓아온 모든 경험과 지식은 결코 헛되지 않습니다. 세상은 여러분의 창의적인 시선과 도전을 기다리고 있습니다. 자신을 믿고 두려움 없이 나아가세요. 졸업을 진심으로 축하합니다!' },
  { id: 2, name: '이○○ 교수', subject: '영상미디어 제작 / 영상편집 실습',
    message: '졸업은 끝이 아니라 새로운 시작입니다. 미디어 산업은 빠르게 변화하지만, 여러분이 배운 탄탄한 기초 위에서 무한히 성장할 수 있습니다. 항상 배움을 멈추지 말고 꿈을 향해 힘차게 전진하길 응원합니다!' },
  { id: 3, name: '박○○ 교수', subject: '게임디자인 / XR 콘텐츠 개발',
    message: '3D, VR, AR 등 실감형 콘텐츠의 시대가 열리고 있습니다. 여러분은 그 최전선에서 활약할 최고의 인재들입니다. 현장에서 부딪히며 배우는 모든 순간이 여러분을 더욱 빛나게 할 것입니다. 파이팅!' },
  { id: 4, name: '최○○ 교수', subject: 'UI/UX 디자인 / 웹 퍼블리싱',
    message: '사용자를 감동시키는 디자인을 만드는 여러분이 자랑스럽습니다. 디테일에서 차이가 나는 법입니다. 작은 것 하나하나에 최선을 다하는 습관을 유지한다면 반드시 빛날 날이 올 것입니다. 졸업을 축하합니다!' },
  { id: 5, name: '정○○ 교수', subject: '브랜드 마케팅 / 콘텐츠 전략',
    message: '콘텐츠는 세상과 소통하는 언어입니다. 여러분이 만들어 낼 이야기들이 세상을 더욱 풍요롭게 만들 것이라 확신합니다. 도전을 두려워하지 말고, 실패해도 다시 일어나는 회복탄력성을 길러나가세요!' },
  { id: 6, name: '한○○ 교수', subject: '광고영상 제작 / 다큐멘터리 기획',
    message: '카메라 너머로 세상을 바라보는 여러분만의 시선이 가장 큰 무기입니다. 졸업 후에도 끊임없이 세상에 질문을 던지는 창작자로 살아가길 바랍니다. 여러분의 앞날을 진심으로 응원합니다!' },
  { id: 7, name: '윤○○ 교수', subject: '애니메이션 / 모션그래픽',
    message: '움직임 하나에 감정을 담는 것이 얼마나 어렵고도 보람 있는 일인지 여러분은 이미 알고 있을 것입니다. 그 열정을 잃지 마세요. 세상 어딘가에서 여러분의 작품이 누군가를 웃게 만들 것입니다. 축하합니다!' },
  { id: 8, name: '임○○ 교수', subject: '데이터 저널리즘 / 미디어 리터러시',
    message: '정보가 넘쳐나는 시대일수록 진실을 꿰뚫는 비판적 사고가 중요합니다. 여러분이 배운 미디어 리터러시를 현장에서도 발휘하여 올바른 콘텐츠를 만들어 가는 전문가가 되길 기대합니다. 수고 많으셨습니다!' },
  { id: 9, name: '강○○ 교수', subject: '사운드 디자인 / 음향 제작',
    message: '보이지 않는 소리가 콘텐츠의 감동을 완성합니다. 여러분이 만드는 모든 작품에 혼을 담는 것을 잊지 마세요. 사운드 하나로 세상을 바꿀 수 있다는 자신감을 갖고 힘차게 날아오르길 응원합니다!' },
  { id: 10, name: '오○○ 교수', subject: '1인 미디어 창작 / 크리에이터 스튜디오',
    message: '여러분 한 사람 한 사람이 이미 하나의 미디어입니다. 자신의 이야기를 담대하게 세상에 내놓으세요. 실수를 두려워하지 말고, 꾸준히 콘텐츠를 만들다 보면 반드시 여러분만의 팬층이 생길 것입니다. 졸업 축하드립니다!' },
];

/* ─────────── 컴포넌트 ─────────── */
const DepartmentPage = () => {
  const [modalProf, setModalProf] = useState(null);

  /* 스크롤 Reveal */
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

  /* 모달 body overflow & ESC */
  useEffect(() => {
    document.body.style.overflow = modalProf ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalProf]);

  useEffect(() => {
    if (!modalProf) return;
    const onKey = (e) => { if (e.key === 'Escape') setModalProf(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalProf]);

  /* ─────────── JSX ─────────── */
  return (
    <div>
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="container">
          <p className="page-breadcrumb">HOME › 학부소개</p>
          <h1 className="page-title">학부소개</h1>
          <p className="page-desc">미디어콘텐츠학부의 교육목표, 핵심 역량, 교수진을 소개합니다.</p>
        </div>
      </div>

      {/* SECTION 1 — 미디어콘텐츠학부 소개 */}
      <section id="dept-intro" aria-label="미디어콘텐츠학부 소개">
        <div className="container">
          <div className="dept-intro-inner reveal">
            <p className="section-eyebrow">Department of Media Contents</p>
            <h2 className="dept-main-title">미디어콘텐츠학부</h2>
            <div className="dept-divider"></div>
            <p className="dept-sub-text">
              미래산업의 핵심·인재·창의 융합형 멀티미디어 콘텐츠 전문가를 양성하는<br />
              미디어콘텐츠학부를 소개합니다.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — 교육목표 */}
      <section id="edu-goal" aria-label="교육목표">
        <div className="container">

          <div className="section-header reveal">
            <h2 className="section-title">미디어콘텐츠학부 교육목표</h2>
            <p className="section-overview">
              멀티미디어환경에 유기적으로 대응할 수 있는 첨단실용학문으로 실무에서 요구하는
              &#39;멀티형 인재&#39;로 성장하기 위한 지능형·감성형·실감형 3단계 융합미디어교육과정을 통해
              스마트미디어콘텐츠전문가를 양성합니다.
            </p>
          </div>

          {/* 핵심역량 다이어그램 */}
          <div className="competency-diagram reveal" aria-label="핵심 역량 다이어그램">
            <div className="comp-node">
              <span className="comp-node-en">Intelligent Contents</span>
              <span className="comp-node-kr">지능형<br />콘텐츠</span>
            </div>
            <div className="comp-bridge">
              <span className="comp-bridge-tag">브랜드 마케팅</span>
              <div className="comp-bridge-line"></div>
              <span className="comp-bridge-tag">공통영역</span>
              <div className="comp-bridge-line"></div>
              <span className="comp-bridge-tag">기획설계</span>
            </div>
            <div className="comp-node" style={{ borderColor: 'var(--ph-dark)', background: 'var(--ph-light)' }}>
              <span className="comp-node-en">Emotional Contents</span>
              <span className="comp-node-kr">감성형<br />콘텐츠</span>
            </div>
            <div className="comp-bridge">
              <span className="comp-bridge-tag">실무 프로젝트</span>
              <div className="comp-bridge-line"></div>
              <span className="comp-bridge-tag">디자인제작</span>
            </div>
            <div className="comp-node">
              <span className="comp-node-en">Immersive Contents</span>
              <span className="comp-node-kr">실감형<br />콘텐츠</span>
            </div>
          </div>

          {/* 3대 세부 교육방향 */}
          <div className="edu-cards" aria-label="3대 세부 교육방향">
            <article className="edu-card reveal">
              <span className="edu-card-num">01</span>
              <h3 className="edu-card-title">실무 중심 콘텐츠 전문가 교육과정</h3>
              <ul className="edu-card-list">
                <li>직무 전공별 특화 실무 교육 진행</li>
                <li>국가직무능력표준기반 교육 커리큘럼 운영</li>
                <li>스마트콘텐츠, 영상미디어, 게임 등 진로디자인로드맵 운영</li>
                <li>실무 중심 교수진 및 교과·비교과 프로그램 구성</li>
              </ul>
            </article>
            <article className="edu-card reveal">
              <span className="edu-card-num">02</span>
              <h3 className="edu-card-title">산학협력 프로젝트 활성화</h3>
              <ul className="edu-card-list">
                <li>첨단융합스튜디오 운영 및 활성화</li>
                <li>실무 프로젝트 형 취·창업 동아리와 산학협력 연계</li>
                <li>창업캡스톤디자인 과목 연계를 통합 산학연 프로젝트 진행</li>
                <li>공모전, 경진대회 등 현업 실무자 지도 및 컨설팅 진행</li>
              </ul>
            </article>
            <article className="edu-card reveal">
              <span className="edu-card-num">03</span>
              <h3 className="edu-card-title">멀티미디어 융복합콘텐츠 연구 개발</h3>
              <ul className="edu-card-list">
                <li>스마트디바이스를 활용한 스마트콘텐츠 제작 및 구현</li>
                <li>[New Media Contents Zone] 영상미디어콘텐츠 제작</li>
                <li>[XR Contents Zone] 3D, 게임, VR·AR, 홀로그램 개발</li>
                <li>[Co-working Space] 콘텐츠 아이디어·아이템 개발 구현</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 3 — 교수진 소개 */}
      <section id="professors" aria-label="교수진 소개">
        <div className="container">
          <div className="section-header reveal">
            <h2 className="section-title">교수진 소개</h2>
            <p className="section-overview">
              프로필을 클릭하면 교수님의 담당 과목과 졸업생들을 향한 응원 메시지를 확인할 수 있습니다.
            </p>
          </div>

          <div className="prof-grid">
            {professors.map((prof) => (
              <div
                key={prof.id}
                className="prof-card reveal"
                role="button"
                tabIndex={0}
                aria-label={`${prof.name} 상세보기`}
                onClick={() => setModalProf(prof)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setModalProf(prof);
                  }
                }}
              >
                <div className="ph prof-img-ph">{prof.name}<br />사진</div>
                <p className="prof-name">{prof.name}</p>
                <p className="prof-subject">{prof.subject.split(' / ')[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL — 교수 상세 */}
      <div
        className={`modal-overlay${modalProf ? ' active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalProfName"
        onClick={(e) => { if (e.target === e.currentTarget) setModalProf(null); }}
      >
        {modalProf && (
          <div className="modal-box prof-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              aria-label="닫기"
              onClick={() => setModalProf(null)}
            >✕</button>

            <div className="modal-head">
              <div className="ph modal-prof-img">{modalProf.name}<br />사진</div>
              <div className="modal-prof-info">
                <p className="modal-eyebrow">Professor</p>
                <p className="modal-name" id="modalProfName">{modalProf.name}</p>
                <p className="modal-subject">{modalProf.subject}</p>
              </div>
            </div>

            <div className="prof-modal-body">
              <div>
                <p className="modal-section-label">졸업생들을 향한 응원 메시지</p>
                <div className="modal-message-box">{modalProf.message}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentPage;
