import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const toggleRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

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
          <span className="common-logo" />
          <span className="common-brand-text">
            서원대학교 미디어콘텐츠학부<br />
            2026 졸업전시회
          </span>
        </Link>

        <nav className="common-nav" aria-label="주 메뉴">
          <NavLink to="/project"    className={getNavClass}>WORK</NavLink>
          <NavLink to="/student"    className={getNavClass}>GRADUATES</NavLink>
          <NavLink to="/department" className={getNavClass}>ABOUT</NavLink>
          <NavLink to="/others"     className={getNavClass}>ARCHIVE</NavLink>

          <button
            type="button"
            ref={toggleRef}
            className="common-search-toggle"
            aria-label="작품 검색 열기"
            aria-controls="search-panel"
            aria-expanded={searchOpen}
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.7" cy="10.7" r="6.4" />
              <path d="m15.5 15.5 5.1 5.1" />
            </svg>
          </button>
        </nav>
      </div>

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
