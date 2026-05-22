import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => (
  <div className="notfound-wrap">
    <p className="notfound-code">404</p>
    <p className="notfound-title">페이지를 찾을 수 없습니다</p>
    <p className="notfound-desc">주소가 잘못되었거나 삭제된 페이지입니다.</p>
    <Link to="/" className="notfound-btn">홈으로 돌아가기</Link>
  </div>
);

export default NotFoundPage;
