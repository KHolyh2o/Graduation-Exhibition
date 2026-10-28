"use strict";

/* ==========================================
   1. 공통 설정
========================================== */
const COMMON_CONFIG = {
  basePath: "./",

  // 이미지 경로
  logoImage: "",
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