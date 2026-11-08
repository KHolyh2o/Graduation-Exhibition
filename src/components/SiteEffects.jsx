import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// sha_copy/js/common.js 의 "GLOBAL INTERACTION" 이식.
//  1) 스크롤로 화면에 들어오면 아래에서 서서히 등장 (.fx-reveal → .fx-visible)
//  2) 내부 링크 이동 시 본문이 사라지는 효과 (body.fx-leaving) 후 이동
// 전체 페이지 공통이라 App 에서 한 번만 마운트한다.

// 등장 효과를 줄 요소 (페이지별 클래스를 한곳에 모아 둠)
const REVEAL_SELECTORS = [
  // 메인
  '.main-hero-video', '.concept-copy', '.concept-visual', '.target-heading', '.target-card',
  '.students-heading', '.students-slider-wrap', '.info-content', '.info-map', '.credit-header', '.credit-row',
  // WORK
  '.intro', '.media-category', '.role-filters', '.project-card',
  // GRADUATES
  '.student-card',
  // 작품 상세
  '.student-sidebar', '.detail-main-media', '.detail-poster', '.other-projects',
  // ABOUT
  '.dept-poster', '.dept-hero-content', '.dept-introduction', '.dept-education-header',
  '.dept-diagram-wrap', '.dept-goal', '.dept-professors-header', '.dept-professor-card',
  // 푸터
  '.common-footer-inner',
  // 수동 지정
  '[data-reveal]',
].join(', ');

// 부모 섹션(data-reveal)이 이 요소들을 품고 있으면, 내부 요소만 등장시키고 부모는 건너뜀 (이중 적용 방지)
const NESTED_REVEAL = [
  '.project-card', '.student-card', '.target-card', '.dept-goal', '.dept-professor-card',
  '.concept-copy', '.concept-visual', '.dept-poster', '.dept-hero-content',
].join(', ');

// 그리드 안에서 순서대로 시차를 두는 카드
const STAGGER_CARDS = '.project-card, .student-card, .target-card, .dept-professor-card, .dept-goal';

const getDelay = (el) => {
  if (el.hasAttribute('data-reveal-delay')) {
    const delay = Number(el.dataset.revealDelay);
    return Number.isFinite(delay) ? Math.max(0, Math.min(delay, 800)) : 0;
  }
  if (el.matches(STAGGER_CARDS)) {
    // 카드는 줄 순서와 상관없이 0~400ms 사이의 임의 지연 — 올라오는 순서가 제각각이라 자연스럽고 가볍게 보인다.
    // (등록될 때 한 번만 정해지므로 같은 카드가 도중에 바뀌지 않는다. 새로고침하면 순서가 달라진다)
    return Math.round(Math.random() * 400);
  }
  if (el.matches('.media-category')) {
    return Array.from(el.parentElement.children).indexOf(el) * 150;
  }
  return 0;
};

const SiteEffects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 페이지 이동 효과를 끝내는 함수 (아래 2) 효과가 만들어 두고, 주소가 바뀐 뒤에 부른다)
  const finishLeavingRef = useRef(null);

  // 1) 스크롤 등장 효과
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    document.documentElement.classList.add('fx-enabled');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('fx-visible');
          observer.unobserve(entry.target);   // 최초 1회만
        });
      },
      { threshold: 0.03, rootMargin: '0px 0px -80px 0px' },
    );

    const register = (root) => {
      const found = [];
      if (root.nodeType === 1 && root.matches(REVEAL_SELECTORS)) found.push(root);
      if (root.querySelectorAll) found.push(...root.querySelectorAll(REVEAL_SELECTORS));

      const fresh = [];
      found.forEach((el) => {
        if (el.classList.contains('fx-reveal')) return;
        if (el.hasAttribute('data-reveal') && el.querySelector(NESTED_REVEAL)) return;
        el.style.setProperty('--fx-delay', `${getDelay(el)}ms`);
        el.classList.add('fx-reveal');
        fresh.push(el);
      });

      // 투명 상태가 먼저 화면에 그려진 다음 프레임부터 감지해야 transition 이 보인다
      requestAnimationFrame(() => {
        requestAnimationFrame(() => fresh.forEach((el) => observer.observe(el)));
      });
    };

    register(document);

    // 필터 변경·슬라이드 등으로 나중에 추가되는 요소도 등록
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((m) => m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) register(node);
      }));
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      document.documentElement.classList.remove('fx-enabled');
    };
  }, []);

  // 2) 페이지 이동 효과: 내부 링크를 가로채 본문을 사라지게 한 뒤 이동
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const base = import.meta.env.BASE_URL.replace(/\/$/, '');   // '/2026'
    let navigating = false;
    let timer = null;
    let safetyTimer = null;

    // 새 화면이 실제로 그려진 뒤에 호출한다. 맨 위로 올리고 본문을 다시 보이게 한다.
    // (navigate 직후에 바로 풀면, 아직 내려받는 중인 새 페이지 대신 이전 화면이 잠깐 다시 보이는 잔상이 생긴다)
    const finishLeaving = () => {
      window.clearTimeout(safetyTimer);
      if (!navigating && !document.body.classList.contains('fx-leaving')) return;
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.body.classList.remove('fx-leaving');
      navigating = false;
    };
    finishLeavingRef.current = finishLeaving;

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      let url;
      try { url = new URL(link.href); } catch { return; }
      if (url.origin !== window.location.origin) return;                           // 외부 링크
      if (url.pathname !== `${base}` && !url.pathname.startsWith(`${base}/`)) return;   // 앱 밖 경로(/archive/ 등)
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      if (navigating) return;
      navigating = true;

      const to = url.pathname.replace(new RegExp(`^${base}`), '') + url.search + url.hash;
      document.body.classList.add('fx-leaving');
      timer = window.setTimeout(() => {
        navigate(to || '/');
        // 주소가 바뀌지 않거나 페이지를 못 불러오는 경우에도 화면이 숨겨진 채로 남지 않게 안전장치
        safetyTimer = window.setTimeout(finishLeaving, 4000);
      }, 400);
    };

    document.addEventListener('click', onClick, true);   // 캡처 단계: 라우터보다 먼저
    return () => {
      document.removeEventListener('click', onClick, true);
      window.clearTimeout(timer);
      window.clearTimeout(safetyTimer);
      finishLeavingRef.current = null;
      document.body.classList.remove('fx-leaving');
    };
  }, [navigate]);

  // 3) 주소가 바뀌어 새 화면이 그려진 다음 프레임에 이동 효과를 마무리
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => finishLeavingRef.current?.()));
    return () => cancelAnimationFrame(id);
  }, [location.pathname, location.search]);

  return null;
};

export default SiteEffects;
