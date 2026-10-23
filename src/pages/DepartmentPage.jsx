import React from 'react';
import { professors } from '../data/professors';
import { FALLBACK } from '../hooks/useImageFallback';
import SafeImg from '../components/SafeImg';
import useScrollReveal from '../hooks/useScrollReveal';
import useModal from '../hooks/useModal';
import Modal from '../components/Modal';
import PageHero from '../components/PageHero';
import './DepartmentPage.css';

const DepartmentPage = () => {
  const { modalData: modalProf, setModalData: setModalProf } = useModal();
  useScrollReveal();

  return (
    <div>
      <PageHero
        breadcrumb="HOME › 학부소개"
        title="학부소개"
        desc="미디어콘텐츠학부의 교육목표, 핵심 역량, 교수진을 소개합니다."
      />

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
              프로필을 클릭하면 교수님들이 졸업생들에게 전하는 격려사를 확인할 수 있습니다.
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
                <SafeImg className="prof-img" src={prof.photo} fallbackSrc={FALLBACK.avatar} alt={prof.name} />
                <p className="prof-name">{prof.name}</p>
                <p className="prof-subject">{prof.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Modal
        isOpen={!!modalProf}
        onClose={() => setModalProf(null)}
        boxClassName="prof-modal-box"
        ariaLabelledby="modalProfName"
      >
        {modalProf && (
          <>
            <div className="modal-head">
              <SafeImg className="modal-prof-img" src={modalProf.photo} fallbackSrc={FALLBACK.avatar} alt={modalProf.name} />
              <div className="modal-prof-info">
                <p className="modal-eyebrow">Professor</p>
                <p className="modal-name" id="modalProfName">{modalProf.name}</p>
                <p className="modal-subject">{modalProf.role}</p>
              </div>
            </div>
            <div className="prof-modal-body">
              <p className="modal-section-label">격려사</p>
              <div className="modal-message-box">
                <p className="modal-message-headline">{modalProf.headline}</p>
                {modalProf.message}
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default DepartmentPage;
