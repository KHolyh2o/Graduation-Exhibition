import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ESC 또는 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const getNavClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link';

  return (
    <header
      id="site-header"
      role="banner"
      style={{ boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.10)' : 'none' }}
    >
      <div className="header-inner">
        {/* 로고 */}
        <Link to="/" className="logo-area" aria-label="홈으로">
          <div className="ph logo-ph">LOGO</div>
          <div className="logo-text">
            <span className="subtitle">서원대학교 미디어콘텐츠학부</span>
            <span className="title">2026 졸업전시</span>
          </div>
        </Link>

        {/* 햄버거 버튼 */}
        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* 내비게이션 */}
        <nav
          className={`site-nav${menuOpen ? ' open' : ''}`}
          id="siteNav"
          aria-label="주요 메뉴"
        >
          <NavLink to="/project"    className={getNavClass} onClick={closeMenu}>작품소개</NavLink>
          <NavLink to="/department" className={getNavClass} onClick={closeMenu}>학부소개</NavLink>
          <NavLink to="/gallery"    className={getNavClass} onClick={closeMenu}>기록들</NavLink>
          <NavLink to="/others"     className={getNavClass} onClick={closeMenu}>과거전시보기</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
