import { useState } from 'react';
import { toEmbedUrl } from '../data/works';

// 작품 영상 (1~2개). 영상이 둘이면 아래 점(●●)과 좌우 화살표로 넘긴다.
//  · 한 번에 영상 하나만 그린다 (넘기면 앞 영상은 멈춤)
//  · 영상이 하나뿐이면 점·화살표 없이 영상만 나온다
//  · videos: 영상 URL 배열, labels: 점·화살표에 붙일 이름 (스크린리더/툴팁용)
const VideoCarousel = ({ videos, title, labels = [] }) => {
  const [index, setIndex] = useState(0);
  const count = videos.length;
  if (count === 0) return null;

  const current = Math.min(index, count - 1);
  const go = (next) => setIndex((next + count) % count);
  const labelOf = (i) => labels[i] || `영상 ${i + 1}`;

  return (
    <div className="detail-video">
      <div className="detail-main-media" aria-label="작품 대표 영상">
        <iframe
          key={videos[current]}
          src={toEmbedUrl(videos[current])}
          title={`${title} — ${labelOf(current)}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              className="detail-video-arrow is-prev"
              aria-label={`이전 영상: ${labelOf((current - 1 + count) % count)}`}
              onClick={() => go(current - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="detail-video-arrow is-next"
              aria-label={`다음 영상: ${labelOf((current + 1) % count)}`}
              onClick={() => go(current + 1)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="detail-video-dots" role="tablist" aria-label="영상 선택">
          {videos.map((url, i) => (
            <button
              key={url}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`${i + 1} / ${count}: ${labelOf(i)}`}
              title={labelOf(i)}
              className={`detail-video-dot${i === current ? ' is-active' : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoCarousel;
