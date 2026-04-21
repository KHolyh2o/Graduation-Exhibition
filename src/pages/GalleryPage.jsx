import React, { useEffect } from 'react';
import './GalleryPage.css';

const GalleryPage = () => {
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

  return (
    <main id="records" aria-label="졸업전시 준비과정 영상">
      <div className="records-inner">

        {/* 타이틀 */}
        <div className="records-head reveal">
          <p className="records-eyebrow">Behind the Exhibition</p>
          <h1 className="records-title">우리의 준비 과정</h1>
          <div className="records-divider"></div>
          <p className="records-desc">
            2026 졸업전시를 완성하기까지의 모든 순간을 담은 영상을 만나보세요.
          </p>
        </div>

        {/* 영상 플레이어 플레이스홀더 */}
        <div className="video-wrapper reveal" style={{ transitionDelay: '0.15s' }}>
          <div
            className="video-ph"
            role="img"
            aria-label="졸업전시 준비과정 영상 재생 영역"
          >
            <div className="play-btn" aria-hidden="true"></div>
            <span className="video-ph-label">졸업전시 준비과정 영상 재생 영역</span>
          </div>
        </div>

      </div>
    </main>
  );
};

export default GalleryPage;
