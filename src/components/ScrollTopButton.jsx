import { useEffect, useState } from 'react';

// 맨 위로 이동 버튼 — 전 페이지 공통 한 개. App 에서 한 번만 마운트한다.
// 디자인·위치는 index.css 의 .scroll-top-button 한 곳에서만 정한다 (페이지마다 따로 만들지 말 것).
// 맨 위에서는 숨기고, 400px 이상 내려가면 나타난다.
const ScrollTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`scroll-top-button${show ? ' show' : ''}`}
      aria-label="맨 위로 이동"
      tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 21V3M4.5 10.5 12 3l7.5 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default ScrollTopButton;
