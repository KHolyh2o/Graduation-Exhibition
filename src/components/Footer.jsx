import React from 'react';
import './Footer.css';

// SNS 주소가 정해지면 채우세요. 비어 있으면 아이콘을 표시하지 않습니다.
const SNS_LINKS = [
  { label: 'Instagram', url: '' },
  { label: 'YouTube',   url: '' },
];

const Footer = () => (
  <footer className="common-footer">
    <div className="common-footer-inner">

      <div className="common-footer-left">
        <p>서원대학교</p>
        <p>미디어콘텐츠학부</p>
        <p className="common-footer-copyright">
          © 2026 서원대학교 미디어콘텐츠학부. All rights reserved.
        </p>
      </div>

      <div className="common-footer-right">
        <p>충청북도 청주시 서원구 무심서로 377-3</p>
        <p>043-299-8800</p>
        <p>media@seowon.ac.kr</p>

        <div className="common-footer-sns">
          {SNS_LINKS.filter(({ url }) => url).map(({ label, url }) => (
            <a
              key={label}
              className="common-sns-link"
              href={url}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="common-sns-icon" />
            </a>
          ))}
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
