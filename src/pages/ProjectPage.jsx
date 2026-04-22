import React, { useState, useRef } from 'react';
import { CATEGORIES, TAB_KEYS, WORKS } from '../data/projects';
import useScrollReveal from '../hooks/useScrollReveal';
import useModal from '../hooks/useModal';
import Modal from '../components/Modal';
import PageHero from '../components/PageHero';
import './ProjectPage.css';

const ProjectPage = () => {
  const [activeTab,  setActiveTab]  = useState('multimedia');
  const [totalCount, setTotalCount] = useState(CATEGORIES.multimedia.total);
  const { modalData, setModalData } = useModal();
  const categoryBarRef = useRef(null);

  // activeTab을 dep으로 넘겨 탭 전환 시 새 패널 요소도 관찰
  useScrollReveal(activeTab, 0.08);

  const switchTab = (key) => {
    setActiveTab(key);
    setTotalCount(CATEGORIES[key].total);
    categoryBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <PageHero
        breadcrumb="HOME › 작품소개"
        title="작품소개"
        desc="미디어콘텐츠학부 졸업생들의 작품을 카테고리별로 만나보세요."
        badge={<span className="page-total-badge">전체 {totalCount}개 작품</span>}
      />

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

      <Modal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        boxClassName="work-modal-box"
        ariaLabelledby="modalWorkTitle"
      >
        {modalData && (
          <>
            <div className="modal-video-ph">
              <div className="play-icon" aria-hidden="true"></div>
              <span>{modalData.catLabel} {modalData.sub} No.{modalData.num} 작품 소개 영상</span>
            </div>
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
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProjectPage;
