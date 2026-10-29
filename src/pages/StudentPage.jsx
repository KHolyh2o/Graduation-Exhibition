import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { graduates } from '../data/graduates';
import { getWorksByStudent, getWorkTitle } from '../data/works';
import SafeImg from '../components/SafeImg';
import { FALLBACK } from '../hooks/useImageFallback';
import './StudentPage.css';

const FILTERS = [
  { id: 'all',        label: '전체' },
  { id: 'multimedia', label: '멀티미디어' },
  { id: 'video',      label: '영상미디어' },
  { id: 'committee',  label: '졸업전시위원회' },
];

const matchFilter = (g, filter) => {
  if (filter === 'all') return true;
  if (filter === 'committee') return g.committee === true;
  return g.tab === filter;
};

const getYoutubeId = (url) => {
  const m = String(url || '').match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : '';
};

const StudentPage = () => {
  const [filter, setFilter] = useState('all');
  const [showTop, setShowTop] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const lastTriggerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);

  const list = useMemo(() => graduates.filter((g) => matchFilter(g, filter)), [filter]);

  // ?student=<studentId> 로 팝업 상태를 URL과 동기화
  const selectedId = searchParams.get('student');
  const selected = useMemo(
    () => graduates.find((g) => g.studentId === selectedId) ?? null,
    [selectedId]
  );

  const openModal = (g, trigger) => {
    lastTriggerRef.current = trigger;
    setSearchParams({ student: g.studentId });
  };

  const closeModal = () => {
    setSearchParams({}, { replace: true });
    const trigger = lastTriggerRef.current;
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    lastTriggerRef.current = null;
  };

  // 팝업이 열려 있는 동안: 스크롤 잠금, 포커스 이동, ESC·Tab 처리
  useEffect(() => {
    if (!selected) return;
    document.body.style.overflow = 'hidden';
    modalRef.current?.scrollTo(0, 0);
    closeBtnRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll('button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const studentProjects = selected ? getWorksByStudent(selected.studentId) : [];
  const contact = studentProjects.find((p) => p.contact?.email || p.contact?.phone)?.contact;
  const youtubeId = getYoutubeId(studentProjects.find((p) => p.videoUrl)?.videoUrl);

  return (
    <div className="student-page">
      <main id="top">
        <section className="page-title">
          <h1>Profile</h1>
          <p>2026 Seowon University Graduates</p>
          <span>{graduates.length} People</span>
        </section>

        <section className="portfolio-section">
          <div className="category-tabs" role="tablist" aria-label="학생 분류">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`tab${filter === f.id ? ' active' : ''}`}
                id={`tab-${f.id}`}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="student-panel" role="tabpanel" aria-labelledby={`tab-${filter}`}>
            <div className="student-grid">
              {list.map((g) => (
                <button
                  key={g.studentId}
                  type="button"
                  className="student-card"
                  aria-label={`${g.name} 상세 소개 열기`}
                  onClick={(e) => openModal(g, e.currentTarget)}
                >
                  <div className="student-photo">
                    {g.profileImage ? (
                      <SafeImg src={g.profileImage} fallbackSrc={FALLBACK.avatar} alt={`${g.name} 프로필`} />
                    ) : (
                      <div className="photo-placeholder" />
                    )}
                  </div>
                  <div className="student-info">
                    <h3 className="student-name">{g.name}</h3>
                    <p className="student-english">{g.englishName}</p>
                  </div>
                </button>
              ))}
            </div>

            {list.length === 0 && <p className="empty-state">검색 결과가 없습니다.</p>}
          </div>
        </section>
      </main>

      <button
        type="button"
        className={`top-button${showTop ? ' show' : ''}`}
        aria-label="맨 위로 이동"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>

      {selected && (
        <div
          ref={modalRef}
          className="graduate-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalStudentName"
        >
          <div className="graduate-modal-inner">
            <button
              ref={closeBtnRef}
              type="button"
              className="graduate-modal-close"
              aria-label="팝업 닫기"
              onClick={closeModal}
            >
              <span></span>
              <span></span>
            </button>

            <div className="graduate-modal-logo">
              <div className="graduate-logo-placeholder"></div>
            </div>

            <section className="graduate-profile">
              <div className="graduate-profile-photo">
                {selected.profileImage ? (
                  <SafeImg src={selected.profileImage} fallbackSrc={FALLBACK.avatar} alt={`${selected.name} 프로필`} />
                ) : (
                  <div className="graduate-profile-photo-placeholder"></div>
                )}
              </div>

              <div className="graduate-profile-info">
                <div className="graduate-name-line">
                  <h2 className="graduate-name" id="modalStudentName">{selected.name}</h2>
                  <span className="graduate-english-name">{selected.englishName}</span>
                </div>

                <p className="graduate-job">{selected.jobTitle}</p>

                <p className="graduate-introduction">{selected.intro}</p>

                <div className="graduate-contact">
                  <div className="graduate-contact-item">
                    <div className="graduate-contact-icon">
                      <div className="graduate-icon-placeholder"></div>
                    </div>
                    {contact?.phone ? (
                      <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>
                    ) : (
                      <span className="contact-text">전화번호 입력</span>
                    )}
                  </div>

                  <div className="graduate-contact-item">
                    <div className="graduate-contact-icon">
                      <div className="graduate-icon-placeholder"></div>
                    </div>
                    {contact?.email ? (
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    ) : (
                      <span className="contact-text">이메일 입력</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="graduate-project-section">
              <h2 className="graduate-section-title">Project</h2>
              <div className="graduate-project-grid">
                {studentProjects.map((p) => (
                  <Link className="graduate-project-card" key={p.id} to={`/project/${p.id}`}>
                    <div className="graduate-project-image">
                      {p.thumbnail ? (
                        <SafeImg src={p.thumbnail} fallbackSrc={FALLBACK.image} alt={getWorkTitle(p)} />
                      ) : (
                        <div className="graduate-project-placeholder"></div>
                      )}
                    </div>
                    <p className="graduate-project-name">{getWorkTitle(p)}</p>
                  </Link>
                ))}
              </div>
            </section>

            <section className="graduate-video-section">
              <div className="graduate-video">
                {youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                    title={`${selected.name} 프로젝트 영상`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="graduate-video-placeholder"></div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPage;
