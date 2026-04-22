import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer id="site-footer" role="contentinfo">
    <div className="container">
      <div className="footer-inner">

        <div className="footer-brand">
          <p className="school-name">서원대학교</p>
          <p className="dept-name">미디어콘텐츠학부</p>
          <p className="exhibit-name-small">2026 졸업전시</p>
        </div>

        <div className="footer-info">
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            충청북도 청주시 서원구 무심서로 377-3
          </span>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 12a19.79 19.79 0 0 1-3.07-8.68A2 2 0 0 1 3.29 1.14h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
            </svg>
            043-299-8800
          </span>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            media@seowon.ac.kr
          </span>
        </div>

      </div>
      <p className="footer-copy">
        © 2026 서원대학교 미디어콘텐츠학부. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
