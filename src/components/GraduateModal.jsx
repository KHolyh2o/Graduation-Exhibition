import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { getWorksByStudent, getWorkTitle } from '../data/works';
import SafeImg from './SafeImg';
import { assetUrl, FALLBACK } from '../hooks/useImageFallback';
import '../pages/StudentPage.css';

const getYoutubeId = (url) => {
  const m = String(url || '').match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : '';
};

// 졸업생 프로필 팝업 — 졸업생 페이지(/student?student=)와 메인 학생 슬라이더가 함께 쓴다.
// 스타일은 StudentPage.css 의 .student-page 아래에 있어서 래퍼 클래스를 붙인다.
const GraduateModal = ({ student, onClose }) => {
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);   // 팝업 안에서 스크롤되는 영역

  // 팝업이 열려 있는 동안: 스크롤 잠금, 포커스 이동, ESC·Tab 처리
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    scrollRef.current?.scrollTo(0, 0);
    closeBtnRef.current?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
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
  }, [student]);

  const studentProjects = getWorksByStudent(student.studentId);
  const contact = studentProjects.find((p) => p.contact?.email || p.contact?.phone)?.contact;
  const youtubeId = getYoutubeId(studentProjects.find((p) => p.videoUrl)?.videoUrl);

  // 변형(transform)이 걸린 부모 안에서도 화면 전체를 덮도록 body 로 옮겨 그린다
  return createPortal(
    <div className="student-page student-modal-host">
    <div
      ref={modalRef}
      className="graduate-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalStudentName"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}   // 어두운 바깥 영역 클릭 시 닫기
    >
      <div className="graduate-modal-shell">
        {/* 닫기 버튼은 스크롤해도 고정 */}
        <button
          ref={closeBtnRef}
          type="button"
          className="graduate-modal-close"
          aria-label="팝업 닫기"
          onClick={onClose}
        >
          <span></span>
          <span></span>
        </button>

        {/* 스크롤은 이 안에서만 */}
        <div ref={scrollRef} className="graduate-modal-inner">
        <div className="graduate-modal-logo">
          <img src={assetUrl('/images/로고.png')} alt="2026 졸업전시회 로고" onError={(e) => e.currentTarget.remove()} />
        </div>

        <div className="graduate-modal-content">
        <section className="graduate-profile">
          <div className="graduate-profile-photo">
            {student.profileImage ? (
              <SafeImg src={student.profileImage} fallbackSrc={FALLBACK.avatar} alt={`${student.name} 프로필`} />
            ) : (
              <div className="graduate-profile-photo-placeholder"></div>
            )}
          </div>

          <div className="graduate-profile-info">
            <div className="graduate-name-line">
              <h2 className="graduate-name" id="modalStudentName">{student.name}</h2>
              <span className="graduate-english-name">{student.englishName}</span>
            </div>

            <p className="graduate-job">{student.jobTitle}</p>

            <p className="graduate-introduction">{student.intro}</p>

            <div className="graduate-contact">
              <div className="graduate-contact-item">
                <div className="graduate-contact-icon">
                  <img src={assetUrl('/images/UI/학생번호.png')} alt="" onError={(e) => e.currentTarget.remove()} />
                </div>
                {contact?.phone ? (
                  <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}>{contact.phone}</a>
                ) : (
                  <span className="contact-text">전화번호 입력</span>
                )}
              </div>

              <div className="graduate-contact-item">
                <div className="graduate-contact-icon">
                  <img src={assetUrl('/images/UI/학생메일.png')} alt="" onError={(e) => e.currentTarget.remove()} />
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
                title={`${student.name} 프로젝트 영상`}
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
      </div>
    </div>
    </div>,
    document.body,
  );
};

export default GraduateModal;
