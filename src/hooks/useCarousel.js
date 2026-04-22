import { useState, useEffect, useRef, useCallback } from 'react';

const CARD_GAP = 20;

const useCarousel = (total) => {
  const [curIdx,   setCurIdx]   = useState(0);
  const [cardW,    setCardW]    = useState(280);
  const [visibleN, setVisibleN] = useState(3.2);
  const trackRef      = useRef(null);
  const trackOuterRef = useRef(null);

  const calcLayout = useCallback(() => {
    if (!trackOuterRef.current) return;
    const outerW = trackOuterRef.current.clientWidth - 56;
    if (window.innerWidth <= 640) {
      setVisibleN(1.3);
      setCardW(Math.round(outerW / 1.3));
    } else if (window.innerWidth <= 900) {
      setVisibleN(2.2);
      setCardW(Math.round((outerW - CARD_GAP) / 2.2));
    } else {
      setVisibleN(3.2);
      setCardW(Math.round((outerW - CARD_GAP * 2) / 3.2));
    }
  }, []);

  useEffect(() => {
    calcLayout();
    window.addEventListener('resize', calcLayout);
    return () => window.removeEventListener('resize', calcLayout);
  }, [calcLayout]);

  useEffect(() => {
    if (!trackRef.current) return;
    const offset = curIdx * (cardW + CARD_GAP);
    trackRef.current.style.transform = `translateX(-${offset}px)`;
    trackRef.current.querySelectorAll('.profile-card').forEach((c) => {
      c.style.flex  = `0 0 ${cardW}px`;
      c.style.width = `${cardW}px`;
    });
  }, [curIdx, cardW]);

  const maxIdx = Math.max(0, total - Math.floor(visibleN));

  const moveTo = useCallback((idx) => {
    setCurIdx(Math.max(0, Math.min(idx, maxIdx)));
  }, [maxIdx]);

  useEffect(() => {
    const outer = trackOuterRef.current;
    if (!outer) return;
    let startX     = 0;
    let isDragging = false;

    const onDown   = (e) => { startX = e.clientX; isDragging = true; };
    const onTStart = (e) => { startX = e.touches[0].clientX; isDragging = true; };
    const onEnd    = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? startX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        setCurIdx((prev) => Math.max(0, Math.min(diff > 0 ? prev + 1 : prev - 1, maxIdx)));
      }
    };
    const onLeave = () => { isDragging = false; };

    outer.addEventListener('mousedown',  onDown);
    outer.addEventListener('touchstart', onTStart, { passive: true });
    outer.addEventListener('mouseup',    onEnd);
    outer.addEventListener('touchend',   onEnd,   { passive: true });
    outer.addEventListener('mouseleave', onLeave);
    return () => {
      outer.removeEventListener('mousedown',  onDown);
      outer.removeEventListener('touchstart', onTStart);
      outer.removeEventListener('mouseup',    onEnd);
      outer.removeEventListener('touchend',   onEnd);
      outer.removeEventListener('mouseleave', onLeave);
    };
  }, [maxIdx]);

  const progressPct   = maxIdx > 0 ? (curIdx / maxIdx) * 100 : 0;
  const shownEnd      = Math.min(curIdx + Math.floor(visibleN), total);
  const progressLabel = `${String(curIdx + 1).padStart(2, '0')} – ${String(shownEnd).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

  return { curIdx, cardW, trackRef, trackOuterRef, moveTo, maxIdx, progressPct, progressLabel };
};

export default useCarousel;
