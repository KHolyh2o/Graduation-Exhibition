import React from 'react';
import { assetUrl } from '../hooks/useImageFallback';
import './Footer.css';

// SNS 주소가 비어 있으면 아이콘을 표시하지 않습니다.
const SNS_LINKS = [
  { label: 'Instagram', url: 'https://www.instagram.com/swu_mediacontents/', icon: '/images/UI/푸터_인스타.png' },
  { label: 'YouTube',   url: 'https://www.youtube.com/@%EB%AF%B8%EB%94%94%EC%96%B4%EC%BD%98%ED%85%90%EC%B8%A0%ED%95%99%EB%B6%80', icon: '/images/UI/푸터_유튜브.png' },
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
        <p>(우)28674 충북 청주시 서원구 무심서로 377-3(모충동) 서원대학교 제1자연관 302호</p>
        <p>043-299-8590</p>

        <div className="common-footer-sns">
          {SNS_LINKS.filter(({ url }) => url).map(({ label, url, icon }) => (
            <a
              key={label}
              className="common-sns-link"
              href={url}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="common-sns-icon">
                <img src={assetUrl(icon)} alt="" onError={(e) => e.currentTarget.remove()} />
              </span>
            </a>
          ))}
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;
