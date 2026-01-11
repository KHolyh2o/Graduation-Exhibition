import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">졸업 전시 홈페이지</Link>
            </div>
            <ul className="navbar-links">
                <li><Link to="/">메인</Link></li>
                <li><Link to="/project">프로젝트</Link></li>
                <li><Link to="/department">학부소개</Link></li>
                <li><Link to="/gallery">사진갤러리</Link></li>
                <li><Link to="/others">기타</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
