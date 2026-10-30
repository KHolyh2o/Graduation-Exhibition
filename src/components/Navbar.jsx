import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { assetUrl } from '../hooks/useImageFallback';
import './Navbar.css';

const MENU = [
  { to: '/project',    label: 'WORK' },
  { to: '/student',    label: 'GRADUATES' },
  { to: '/department', label: 'ABOUT' },
  { to: '/others',     label: 'ARCHIVE' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const toggleRef = useRef(null);
  const menuToggleRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // 모바일 메뉴: ESC·PC 폭으로 전환 시 닫기, 열려 있는 동안 배경 스크롤 잠금
  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', menuOpen);
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.classList.remove('mobile-menu-open');
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen((open) => {
      if (!open) setSearchOpen(false);   // 메뉴를 열면 검색창은 닫는다
      return !open;
    });
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setKeyword('');
    toggleRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeSearch();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const q = keyword.trim();
      if (!q) return;
      navigate(`/project?q=${encodeURIComponent(q)}`);
      closeSearch();
    }
  };

  const getNavClass = ({ isActive }) => (isActive ? 'is-active' : undefined);

  return (
    <header className="common-header" id="top">
      <div className="common-header-inner">
        <Link to="/" className="common-brand" aria-label="메인 페이지로 이동">
          <span className="common-logo">
            <img src={assetUrl('/images/로고.png')} alt="" onError={(e) => e.currentTarget.remove()} />
          </span>
          <span className="common-brand-text">
            서원대학교 미디어콘텐츠학부<br />
            2026 졸업전시회
          </span>
        </Link>

        <nav className="common-nav" aria-label="주 메뉴">
          {MENU.map(({ to, label }) => (
            <NavLink key={to} to={to} className={getNavClass}>{label}</NavLink>
          ))}

          <button
            type="button"
            ref={toggleRef}
            className="common-search-toggle"
            aria-label="작품 검색 열기"
            aria-controls="search-panel"
            aria-expanded={searchOpen}
            onClick={() => {
              setMenuOpen(false);
              if (searchOpen) closeSearch(); else setSearchOpen(true);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.7" cy="10.7" r="6.4" />
              <path d="m15.5 15.5 5.1 5.1" />
            </svg>
          </button>

          {/* 모바일(768px 이하)에서만 보이는 햄버거 */}
          <button
            type="button"
            ref={menuToggleRef}
            className={`common-menu-toggle${menuOpen ? ' is-open' : ''}`}
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            aria-controls="common-mobile-menu"
            onClick={toggleMenu}
          >
            <span className="common-hamburger-bars" aria-hidden="true">
              <span /><span /><span />
            </span>
          </button>
        </nav>
      </div>

      <nav
        id="common-mobile-menu"
        className="common-mobile-menu"
        aria-label="모바일 메뉴"
        hidden={!menuOpen}
      >
        {MENU.map(({ to, label }) => (
          <Link key={to} to={to} className="common-mobile-link" onClick={() => setMenuOpen(false)}>{label}</Link>
        ))}
      </nav>

      <div className="common-search-panel" id="search-panel" hidden={!searchOpen}>
        <input
          ref={inputRef}
          type="search"
          placeholder="작품명 또는 이름을 검색하세요"
          aria-label="작품명 또는 이름 검색"
          autoComplete="off"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="common-search-close"
          aria-label="검색 닫기"
          onClick={closeSearch}
        >
          ×
        </button>
      </div>
    </header>
  );
};

export default Navbar;
