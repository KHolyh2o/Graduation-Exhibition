import React, { useState, useRef } from 'react';
import { PROJECT_TABS, getSubCategories } from '../data/projectTabs';
import { projects } from '../data/projects';
import { teamProjects } from '../data/teamProjects';
import { graduateByStudentId } from '../data/graduates';
import { FALLBACK } from '../hooks/useImageFallback';
import SafeImg from '../components/SafeImg';
import useScrollReveal from '../hooks/useScrollReveal';
import useModal from '../hooks/useModal';
import Modal from '../components/Modal';
import PageHero from '../components/PageHero';
import './ProjectPage.css';

const getWorks = (tabId, subId) => {
  if (tabId === 'team') return teamProjects.filter((p) => p.group === subId);
  return projects.filter((p) => p.tab === tabId && p.role === subId);
};

const getTabTotal = (tabId) => {
  if (tabId === 'team') return teamProjects.length;
  return projects.filter((p) => p.tab === tabId).length;
};

const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/[?&]v=([^?&]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return url;
};

const ProjectPage = () => {
  const [activeTab,  setActiveTab]  = useState('multimedia');
  const { modalData, setModalData } = useModal();
  const categoryBarRef = useRef(null);

  useScrollReveal(activeTab, 0.08);

  const switchTab = (id) => {
    setActiveTab(id);
    categoryBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      <PageHero
        breadcrumb="HOME › 작품소개"
        title="작품소개"
        desc="미디어콘텐츠학부 졸업생들의 작품을 카테고리별로 만나보세요."
        badge={<span className="page-total-badge">전체 {getTabTotal(activeTab)}개 작품</span>}
      />

      {/* CATEGORY TABS */}
      <div id="category-bar" ref={categoryBarRef} role="tablist" aria-label="작품 카테고리">
        <div className="container">
          <div className="tab-inner">
            {PROJECT_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                onClick={() => switchTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <main id="content-area">
        <div className="container">
          {PROJECT_TABS.map((tab) => (
            <section
              key={tab.id}
              className={`cat-panel${activeTab === tab.id ? ' active' : ''}`}
              id={`panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
            >
              {getSubCategories(tab).map((sub) => {
                const works = getWorks(tab.id, sub.id);
                return (
                  <div key={sub.id} className="work-group reveal">
                    <div className="sub-cat-strip">
                      <span className="sub-cat-name">{sub.label}</span>
                      <span className="sub-cat-count">{works.length}개</span>
                    </div>
                    <div className="work-grid">
                      {works.map((work) => (
                        <div
                          key={work.id}
                          className="work-card"
                          tabIndex={0}
                          role="button"
                          aria-label={`${work.title} 상세 보기`}
                          onClick={() => setModalData({ ...work, tabLabel: tab.label, subLabel: sub.label })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setModalData({ ...work, tabLabel: tab.label, subLabel: sub.label });
                            }
                          }}
                        >
                          <div className="work-thumb">
                            {work.thumbnail ? (
                              <SafeImg src={work.thumbnail} fallbackSrc={FALLBACK.image} alt={work.title} />
                            ) : (
                              <>
                                <span className="work-thumb-icon">{sub.icon}</span>
                                <span>작품 썸네일 이미지<br />({sub.label})</span>
                              </>
                            )}
                          </div>
                          <div className="work-info">
                            <p className="work-num">{tab.label} · {sub.label}</p>
                            <p className="work-name">{work.title}</p>
                            <p className="work-author">{work.members ? work.teamName : (graduateByStudentId[work.studentId]?.name ?? '-')}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
            {modalData.videoUrl ? (
              <div className="modal-video-ph">
                <iframe
                  src={toEmbedUrl(modalData.videoUrl)}
                  title={modalData.title}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="modal-video-ph">
                <div className="play-icon" aria-hidden="true" />
                <span>소개 영상 준비 중</span>
              </div>
            )}

            <div className="work-modal-body">
              <span className="modal-badge">{modalData.tabLabel} &gt; {modalData.subLabel}</span>
              <h2 className="modal-work-title" id="modalWorkTitle">{modalData.title}</h2>
              <p className="modal-work-author">
                {modalData.members ? modalData.teamName : (graduateByStudentId[modalData.studentId]?.name ?? '-')} · 미디어콘텐츠학부
              </p>
              <div className="modal-divider" />

              <p className="modal-section-label">작품 소개</p>
              <div className="work-modal-text-ph">{modalData.description}</div>

              {modalData.proposalImages?.length > 0 && (
                <>
                  <p className="modal-section-label">제안서 이미지</p>
                  <div className="proposal-images">
                    {modalData.proposalImages.map((src, i) => (
                      <SafeImg key={i} src={src} fallbackSrc={FALLBACK.image} alt={`제안서 ${i + 1}`} />
                    ))}
                  </div>
                </>
              )}

              <div className="modal-meta-grid">
                <div className="modal-meta-item">
                  <p className="m-label">카테고리</p>
                  <p className="m-value">{modalData.tabLabel}</p>
                </div>
                <div className="modal-meta-item">
                  <p className="m-label">직군 / 그룹</p>
                  <p className="m-value">{modalData.subLabel}</p>
                </div>
                <div className="modal-meta-item">
                  <p className="m-label">이메일</p>
                  <p className="m-value">{modalData.contact?.email ?? '-'}</p>
                </div>
                {modalData.contact?.phone && (
                  <div className="modal-meta-item">
                    <p className="m-label">전화번호</p>
                    <p className="m-value">{modalData.contact.phone}</p>
                  </div>
                )}
              </div>

              {modalData.members && (
                <>
                  <p className="modal-section-label">팀원</p>
                  <ul className="modal-members">
                    {modalData.members.map((m, i) => (
                      <li key={i}>{m.name} · {m.role}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ProjectPage;
