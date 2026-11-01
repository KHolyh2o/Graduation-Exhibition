"use strict";

/* ==========================================
   1. 공통 설정
========================================== */
const COMMON_CONFIG = {
  basePath: "./",

  // 이미지 경로
  logoImage: "../public/images/로고.png",
  instagramImage: "",
  youtubeImage: "",

  // SNS 링크
  instagramURL: "",
  youtubeURL: ""
};

/* ==========================================
   2. 이미지 삽입 함수
========================================== */
function setCommonImage(elementId, imagePath, altText = "") {
  const container = document.getElementById(elementId);
  if (!container || !imagePath) return;

  const img = document.createElement("img");
  img.src = imagePath;
  img.alt = altText;

  img.onerror = () => {
    img.remove();
  };

  container.appendChild(img);
}

/* ==========================================
   3. 공통 헤더 생성
========================================== */
function createCommonHeader() {
  const target = document.getElementById("common-header");
  if (!target) return;

  const base = COMMON_CONFIG.basePath;

  target.innerHTML = `
    <header class="common-header" id="top">
      <div class="common-header-inner">

        <a href="${base}index.html" class="common-brand" aria-label="메인 페이지로 이동">
          <span class="common-logo" id="common-logo-image"></span>
          <span class="common-brand-text">
            서원대학교 미디어콘텐츠학부<br>
            2026 졸업전시회
          </span>
        </a>

        <nav class="common-nav" aria-label="주 메뉴">
          <a href="${base}project.html" data-page="project.html">WORK</a>
          <a href="${base}student.html" data-page="student.html">GRADUATES</a>
          <a href="${base}department.html" data-page="department.html">ABOUT</a>
          <a href="${base}memory.html" data-page="memory.html">MEMORY</a>
          <a href="${base}archive.html" data-page="archive.html">ARCHIVE</a>

          <button
            type="button"
            class="common-search-toggle"
            id="search-toggle"
            aria-label="작품 검색 열기"
            aria-controls="search-panel"
            aria-expanded="false"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.7" cy="10.7" r="6.4"></circle>
              <path d="m15.5 15.5 5.1 5.1"></path>
            </svg>
          </button>
        </nav>
      </div>

      <div class="common-search-panel" id="search-panel" hidden>
        <input
          id="project-search"
          type="search"
          placeholder="작품명 또는 이름을 검색하세요"
          aria-label="작품명 또는 이름 검색"
          autocomplete="off"
        >
        <button
          type="button"
          class="common-search-close"
          id="search-close"
          aria-label="검색 닫기"
        >
          ×
        </button>
      </div>
    </header>
  `;

  setCommonImage(
    "common-logo-image",
    COMMON_CONFIG.logoImage,
    "졸업전시회 로고"
  );

  const currentPage = location.pathname.split("/").pop() || "index.html";

  let activePage = currentPage;

  // detail 페이지는 WORK로 활성화
  if (currentPage === "detail.html") {
    activePage = "project.html";
  }

  // 메인(index)은 메뉴 활성화 없음
  document.querySelectorAll(".common-nav a[data-page]").forEach((link) => {
    const active = link.dataset.page === activePage;
    link.classList.toggle("is-active", active);

    if (active) {
      link.setAttribute("aria-current", "page");
    }
  });

  const toggle = document.getElementById("search-toggle");
  const panel = document.getElementById("search-panel");
  const input = document.getElementById("project-search");
  const close = document.getElementById("search-close");

  const isPortfolioPage = Boolean(document.getElementById("portfolio-grid"));

  // 포트폴리오 페이지에서는 기존 project.js가 검색 처리
  if (isPortfolioPage) {
    const keyword = new URLSearchParams(location.search).get("q");

    if (keyword) {
      document.addEventListener("DOMContentLoaded", () => {
        panel.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        input.value = keyword;

        input.dispatchEvent(
          new Event("input", { bubbles: true })
        );

        if (!document.querySelector(".project-card")) {
          const categoryButtons = document.querySelectorAll(".media-category");

          for (const button of categoryButtons) {
            button.click();
            if (document.querySelector(".project-card")) break;
          }
        }
      });
    }

    return;
  }

  function openSearch() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    input.focus();
  }

  function closeSearch() {
    panel.hidden = true;
    input.value = "";
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }

  toggle.addEventListener("click", () => {
    if (panel.hidden) {
      openSearch();
    } else {
      closeSearch();
    }
  });

  close.addEventListener("click", closeSearch);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearch();
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const keyword = input.value.trim();
      if (!keyword) return;

      const url = new URL(`${base}project.html`, location.href);
      url.searchParams.set("q", keyword);

      location.href = url.href;
    }
  });
}

/* ==========================================
   4. 공통 푸터 생성
========================================== */
function createCommonFooter() {
  const target = document.getElementById("common-footer");
  if (!target) return;

  target.innerHTML = `
    <footer class="common-footer">
      <div class="common-footer-inner">

        <div class="common-footer-left">
          <p>서원대학교</p>
          <p>미디어콘텐츠학부</p>
          <p class="common-footer-copyright">
            © 2026 서원대학교 미디어콘텐츠학부.
            All rights reserved.
          </p>
        </div>

        <div class="common-footer-right">
          <p>충청북도 청주시 서원구 무심서로 377-3</p>
          <p>043-299-8800</p>
          <p>media@seowon.ac.kr</p>

          <div class="common-footer-sns">
            <a
              class="common-sns-link"
              id="common-instagram"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="common-sns-icon" id="common-instagram-image"></span>
            </a>

            <a
              class="common-sns-link"
              id="common-youtube"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="common-sns-icon" id="common-youtube-image"></span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  `;

  setCommonImage(
    "common-instagram-image",
    COMMON_CONFIG.instagramImage,
    "Instagram"
  );

  setCommonImage(
    "common-youtube-image",
    COMMON_CONFIG.youtubeImage,
    "YouTube"
  );

  const instagram = document.getElementById("common-instagram");
  const youtube = document.getElementById("common-youtube");

  if (COMMON_CONFIG.instagramURL) {
    instagram.href = COMMON_CONFIG.instagramURL;
  }

  if (COMMON_CONFIG.youtubeURL) {
    youtube.href = COMMON_CONFIG.youtubeURL;
  }
}

/* ==========================================
   5. 실행
========================================== */
createCommonHeader();
createCommonFooter();

/* ==========================================
   MOBILE HEADER MENU
========================================== */

function initCommonMobileMenu() {

  const header =
    document.querySelector(".common-header");

  const nav =
    header?.querySelector(".common-nav");

  if (!header || !nav) return;

  // 중복 생성 방지
  if (document.getElementById("common-mobile-menu")) {
    return;
  }

  const base = COMMON_CONFIG.basePath || "./";

  /* ========================================
     1. 햄버거 버튼 생성
  ======================================== */

  const menuToggle = document.createElement("button");

  menuToggle.type = "button";
  menuToggle.className = "common-menu-toggle";

  menuToggle.setAttribute(
    "aria-label",
    "메뉴 열기"
  );

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  menuToggle.setAttribute(
    "aria-controls",
    "common-mobile-menu"
  );

  menuToggle.innerHTML = `
    <span class="common-hamburger-bars" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
  `;

  // 검색 버튼 오른쪽에 추가
  nav.appendChild(menuToggle);


  /* ========================================
     2. 모바일 메뉴 생성
  ======================================== */

  const mobileMenu = document.createElement("nav");

  mobileMenu.id = "common-mobile-menu";
  mobileMenu.className = "common-mobile-menu";

  mobileMenu.setAttribute(
    "aria-label",
    "모바일 메뉴"
  );

  mobileMenu.hidden = true;

  mobileMenu.innerHTML = `

    <a href="${base}project.html"
       class="common-mobile-link">
      WORK
    </a>

    <a href="${base}student.html"
       class="common-mobile-link">
      GRADUATES
    </a>

    <a href="${base}department.html"
       class="common-mobile-link">
      ABOUT
    </a>

    <a href="${base}memory.html" class="common-mobile-link">
  MEMORY
</a>

    <a href="${base}archive.html"
       class="common-mobile-link">
      ARCHIVE
    </a>

  `;

  header.appendChild(mobileMenu);


  /* ========================================
     3. 메뉴 열기 / 닫기
  ======================================== */

  let isNavigating = false;

  function openMenu() {

    // 기존 검색창이 열려 있다면 닫기
    const searchPanel =
      document.getElementById("search-panel");

    const searchClose =
      document.getElementById("search-close");

    if (searchPanel && !searchPanel.hidden) {
      searchClose?.click();
    }

    mobileMenu.hidden = false;

    mobileMenu.classList.remove("is-blue");

    menuToggle.classList.add("is-open");

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    menuToggle.setAttribute(
      "aria-label",
      "메뉴 닫기"
    );

    document.body.classList.add(
      "mobile-menu-open"
    );

  }

  function closeMenu() {

    if (isNavigating) return;

    mobileMenu.hidden = true;

    mobileMenu.classList.remove("is-blue");

    menuToggle.classList.remove("is-open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "메뉴 열기"
    );

    document.body.classList.remove(
      "mobile-menu-open"
    );

  }

  /* 햄버거 클릭 */
  menuToggle.addEventListener("click", () => {

    if (mobileMenu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }

  });


  /* ========================================
     4. 메뉴 항목 클릭
        흰색 → 파란색 → 페이지 이동
  ======================================== */

const menuLinks =
  mobileMenu.querySelectorAll(".common-mobile-link");

menuLinks.forEach((link) => {

  link.addEventListener("click", () => {

    // 메뉴 닫기
    closeMenu();

    // preventDefault를 사용하지 않으므로
    // 기존 href 주소로 바로 이동
  });

});


  /* ========================================
     5. 검색 버튼 클릭 시 메뉴 닫기
  ======================================== */

  const searchToggle =
    document.getElementById("search-toggle");

  searchToggle?.addEventListener("click", () => {
    closeMenu();
  });


  /* ========================================
     6. ESC로 닫기
  ======================================== */

  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      !mobileMenu.hidden
    ) {

      closeMenu();
      menuToggle.focus();

    }

  });


  /* ========================================
     7. PC 전환 시 모바일 메뉴 닫기
  ======================================== */

  window.addEventListener("resize", () => {

    if (window.innerWidth > 768) {
      closeMenu();
    }

  });

  // 뒤로가기 캐시로 복귀했을 때 메뉴 초기화
  window.addEventListener("pageshow", () => {

    isNavigating = false;
    closeMenu();

  });

}


/* ==========================================
   실행

   기존 common.js 마지막에
   createCommonHeader();
   createCommonFooter();
   가 실행된 다음 호출
========================================== */

initCommonMobileMenu();

/* ==========================================
   SCROLL REVEAL
   스크롤에 따라 콘텐츠 서서히 등장
========================================== */


/* ==========================================
   GLOBAL INTERACTION
   모든 페이지 공통
========================================== */

function initSiteInteraction() {

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) return;

  // 애니메이션 활성화
  document.documentElement.classList.add("fx-enabled");


  /* ========================================
     1. 등장 효과 적용 대상
  ======================================== */

  const selectors = [

    // 메인 페이지
    ".main-hero-video",
    ".concept-copy",
    ".concept-visual",
    ".target-heading",
    ".target-card",
    ".students-heading",
    ".student-card",
    ".info-content",
    ".info-map",
    ".credit-header",
    ".credit-row",

    // WORK
    ".intro",
    ".media-category",
    ".role-filters",
    ".project-card",

    // GRADUATES
    ".student-profile-card",
    ".graduate-card",
    ".student-item",

    // 작품 상세 페이지
    ".student-sidebar",
    ".detail-main-media",
    ".detail-poster",
    ".other-projects",

    // ABOUT
    ".dept-poster",
    ".dept-hero-content",
    ".dept-introduction",
    ".dept-education-header",
    ".dept-diagram-wrap",
    ".dept-goal",
    ".dept-professors-header",
    ".dept-professor-card",

    // 공통 푸터
    ".common-footer-inner",

    // 수동 적용
    "[data-reveal]"

  ].join(", ");


  /* ========================================
     2. 화면 진입 감지
  ======================================== */

  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add("fx-visible");

        // 최초 1회만 실행
        observer.unobserve(entry.target);

      });

    },
    {
      threshold: 0.03,

      // 화면 하단에 살짝 들어온 뒤 실행
      rootMargin: "0px 0px -80px 0px"
    }
  );


  /* ========================================
     3. 카드 순차 등장 시간 설정
  ======================================== */

  function getDelay(element) {

    // 개별 지연 설정
    if (element.hasAttribute("data-reveal-delay")) {

      const delay = Number(
        element.dataset.revealDelay
      );

      return Number.isFinite(delay)
        ? Math.max(0, Math.min(delay, 800))
        : 0;
    }


    // 그리드 카드 순차 등장
    const cardSelectors = [
      ".project-card",
      ".student-card",
      ".graduate-card",
      ".student-profile-card",
      ".dept-professor-card",
      ".target-card",
      ".dept-goal"
    ].join(", ");

    if (element.matches(cardSelectors)) {

      const siblings = Array.from(
        element.parentElement.children
      );

      const index = siblings.indexOf(element);

      let columns = 5;

      if (window.innerWidth <= 768) {
        columns = 2;
      }

      if (element.matches(".dept-goal")) {
        columns = window.innerWidth <= 768 ? 1 : 3;
      }

      return (index % columns) * 120;
    }


    // 메인 카테고리 아이콘
    if (element.matches(".media-category")) {

      const siblings = Array.from(
        element.parentElement.children
      );

      return siblings.indexOf(element) * 150;
    }

    return 0;
  }


  /* ========================================
     4. 효과 등록
  ======================================== */

  function registerReveal(root = document) {

    const elements = [];

    if (
      root.nodeType === 1 &&
      root.matches(selectors)
    ) {
      elements.push(root);
    }

    if (root.querySelectorAll) {
      elements.push(
        ...root.querySelectorAll(selectors)
      );
    }

    const newElements = [];

    elements.forEach((element) => {

      if (element.classList.contains("fx-reveal")) {
        return;
      }

      /*
        부모 섹션과 내부 콘텐츠에
        효과가 이중 적용되는 문제 방지
      */
      if (
        element.hasAttribute("data-reveal") &&
        element.querySelector(
          ".project-card, .student-card, " +
          ".target-card, .dept-goal, " +
          ".dept-professor-card, " +
          ".concept-copy, .concept-visual, " +
          ".dept-poster, .dept-hero-content"
        )
      ) {
        return;
      }

      const delay = getDelay(element);

      element.style.setProperty(
        "--fx-delay",
        `${delay}ms`
      );

      element.classList.add("fx-reveal");

      newElements.push(element);

    });


    /*
      중요:
      먼저 투명한 상태를 화면에 적용한 뒤
      다음 프레임에서 등장 감지를 시작해야
      실제 transition이 눈에 보임
    */
    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        newElements.forEach((element) => {
          observer.observe(element);
        });

      });

    });

  }


  /* ========================================
     5. 최초 콘텐츠 등록
  ======================================== */

  registerReveal();


  /* ========================================
     6. 동적 콘텐츠 등록
     필터 변경 / 학생 슬라이더 등
  ======================================== */

  const mutationObserver = new MutationObserver(
    (mutations) => {

      mutations.forEach((mutation) => {

        mutation.addedNodes.forEach((node) => {

          if (node.nodeType !== 1) return;

          registerReveal(node);

        });

      });

    }
  );

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

}


/* ==========================================
   7. 페이지 이동 애니메이션
========================================== */

function initSitePageTransition() {

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let navigating = false;

  document.addEventListener("click", (event) => {

    if (event.defaultPrevented) return;

    if (event.button !== 0) return;

    if (
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target;

    if (!(target instanceof Element)) return;

    const link = target.closest("a[href]");

    if (!link) return;

    if (
      link.hasAttribute("download") ||
      (link.target && link.target !== "_self")
    ) {
      return;
    }

    const href = link.getAttribute("href");

    if (!href || href.startsWith("#")) return;

    let url;

    try {
      url = new URL(link.href);
    } catch {
      return;
    }

    // 외부 링크 제외
    if (url.origin !== location.origin) return;

    // 동일 페이지 이동 제외
    if (
      url.pathname === location.pathname &&
      url.search === location.search
    ) {
      return;
    }

    if (navigating) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    navigating = true;

    if (reduceMotion) {
      location.href = url.href;
      return;
    }

    document.body.classList.add("fx-leaving");

    setTimeout(() => {
      location.href = url.href;
    }, 400);

  });


  /* 뒤로가기 복귀 */
  window.addEventListener("pageshow", () => {

    navigating = false;

    document.body.classList.remove("fx-leaving");

  });

}


/* ==========================================
   8. 실행
========================================== */

function startSiteInteraction() {

  initSiteInteraction();
  initSitePageTransition();

}

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    startSiteInteraction,
    { once: true }
  );

} else {

  startSiteInteraction();

}


/* ==========================================
   GLOBAL FONT SIZE +2pt
   모든 페이지 공통 폰트 확대
========================================== */

function increaseAllPageFontSizes() {

  // 중복 적용 방지
  if (
    document.documentElement.dataset.fontPlusTwoPt
    === "true"
  ) return;

  const visited = new WeakSet();

  function updateSheet(sheet) {

    if (!sheet || visited.has(sheet)) return;

    visited.add(sheet);

    let rules;

    try {
      rules = sheet.cssRules;
    } catch {
      // 접근할 수 없는 외부 스타일시트 제외
      return;
    }

    function updateRules(ruleList) {

      for (const rule of ruleList) {

        // 일반 CSS 규칙
        if (rule.type === 1 && rule.style) {

          const original = rule.style
            .getPropertyValue("font-size")
            .trim();

          if (!original) continue;

          // 크기 키워드는 변경하지 않음
          if (
            /^(inherit|initial|unset|revert|revert-layer|larger|smaller|xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large)$/i
              .test(original)
          ) {
            continue;
          }

          // 기존 글자 크기 + 2pt
          const increased = original === "0"
            ? "2pt"
            : `calc(${original} + 2pt)`;

          // 브라우저가 지원하는 값인지 확인
          if (
            typeof CSS !== "undefined" &&
            typeof CSS.supports === "function" &&
            !CSS.supports("font-size", increased)
          ) {
            continue;
          }

          try {

            const priority = rule.style
              .getPropertyPriority("font-size");

            rule.style.setProperty(
              "font-size",
              increased,
              priority
            );

          } catch {
            // 변경할 수 없는 선언은 유지
          }

        }

        // 모바일 @media 등도 적용
        if (rule.cssRules) {
          updateRules(rule.cssRules);
        }

        // @import CSS 처리
        if (
          rule.type === 3 &&
          rule.styleSheet
        ) {
          updateSheet(rule.styleSheet);
        }

      }

    }

    updateRules(rules);

  }

  // 연결된 모든 스타일시트 처리
  for (const sheet of document.styleSheets) {
    updateSheet(sheet);
  }

  document.documentElement.dataset.fontPlusTwoPt =
    "true";

}

// 공통 폰트 확대 실행
increaseAllPageFontSizes();

