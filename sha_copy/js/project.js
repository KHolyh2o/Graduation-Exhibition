
"use strict";

/* ==========================================
   1. 이미지 경로
   비워두면 이미지 공간만 표시
========================================== */
const IMAGE_PATHS = {
   // 멀티미디어
  multimedia: "../public/images/UI/멀티_선택.png",
  multimediaBW: "../public/images/UI/멀티_선택x.png",

  // 영상미디어
  video: "../public/images/UI/영상_선택.png",
  videoBW: "../public/images/UI/영상_선택x.png",

  // XR 프로젝트
  xr: "../public/images/UI/xr_선택.png",
  xrBW: "../public/images/UI/xr_선택x.png",
};

const SOCIAL_URLS = {
  instagram: "",
  youtube: ""
};

/* ==========================================
   2. 카테고리 및 필터
========================================== */
const CATEGORY_NAMES = {
  multimedia: "멀티미디어",
  video: "영상미디어",
  xr: "XR 프로젝트"
};

const FILTERS = {
  multimedia: [
    { key: "all", label: "ALL" },
    { key: "pm", label: "Product Manager" },
    { key: "designer", label: "Designer" },
    { key: "marketer", label: "Marketer" },
    { key: "developer", label: "Developer" },
    { key: "mteam", label: "M-team" }
  ],

  video: [
    { key: "all", label: "ALL" },
    { key: "planning", label: "기획" },
    { key: "production", label: "제작" }
  ],

  xr: [
    { key: "all", label: "ALL" }
  ]
};

/* ==========================================
   3. 작품 데이터
========================================== */

// 기존 시안에 있는 임시 작품명
const multimediaTitles = [
  "현대리바트", "하나은행",
  "롯데아울렛", "롯데아울렛",
  "롯데아울렛", "롯데아울렛",
  "롯데아울렛", "롯데아울렛",
  "롯데아울렛", "롯데아울렛",
  "롯데아울렛", "롯데아울렛",
  "롯데아울렛", "롯데아울렛",
  "롯데아울렛", "롯데아울렛",
  "롯데아울렛", "롯데아울렛",
  "롯데아울렛", "롯데아울렛",
  "롯데아울렛", "스타벅스",
  "메가MGC커피", "롯데아울렛"
];

// 멀티미디어 27개
// PM 10 / Designer 13 / Marketer 2 / Developer 2
const multimediaRoles = [
  ...Array(10).fill("pm"),
  ...Array(13).fill("designer"),
  ...Array(2).fill("marketer"),
  ...Array(2).fill("developer")
];

const projects = [

  // 멀티미디어 27개
  ...multimediaRoles.map((role, index) => ({
    id: `multimedia-${String(index + 1).padStart(2, "0")}`,
    category: "multimedia",
    role: role,

    // M-team 5개 임시 지정
    // 실제 해당 작품에 맞게 true/false 수정
    mteam: index < 5,

    title: multimediaTitles[index]
      || `멀티미디어 작품 ${index + 1}`,

    author: "작가명",
    thumbnail: "",
    description: "",
    link: ""
  })),

  // 영상미디어 50개
  // 기획 8 / 제작 42
  ...Array.from({ length: 50 }, (_, index) => ({
    id: `video-${String(index + 1).padStart(2, "0")}`,
    category: "video",

    role: index < 8
      ? "planning"
      : "production",

    mteam: false,

    title: `영상미디어 작품 ${String(index + 1).padStart(2, "0")}`,
    author: "작가명",
    thumbnail: "",
    description: "",
    link: ""
  })),

  // XR 프로젝트 9개
  ...Array.from({ length: 9 }, (_, index) => ({
    id: `xr-${String(index + 1).padStart(2, "0")}`,
    category: "xr",
    role: "all",
    mteam: false,

    title: `XR 프로젝트 ${String(index + 1).padStart(2, "0")}`,
    author: "작가명",
    thumbnail: "",
    description: "",
    link: ""
  }))

];

/* ==========================================
   작품 카드 표시 정보
   작품마다 개별 수정 가능
========================================== */

const PROJECT_CARD_DATA = {

  "multimedia-01": {
    brand: "개인브랜드",
    proposal: "농협은행",
    author: "신현아",
    thumbnail: "../public/images/project_thumnail/신현아_농협은행.png",
    
  },

  "multimedia-02": {
    brand: "하나은행",
    proposal: "제안 이름",
    author: "작가명",
    thumbnail: "",
  },

  "multimedia-03": {
    brand: "롯데아울렛",
    proposal: "제안 이름",
    author: "작가명",
    thumbnail: "",
  }

  // 나머지 작품도 동일한 형식으로 추가
};

/* 기존 86개 작품 데이터에 반영 */
projects.forEach((project) => {

  project.brand ||= project.title;
  project.proposal ||= "제안 이름";

  const cardData = PROJECT_CARD_DATA[project.id];

  if (cardData) {
    Object.assign(project, cardData);
  }

});

/* ==========================================
   4. 필터 조건
========================================== */
function matchesFilter(project, filter) {
  if (filter === "all") return true;

  if (filter === "mteam") {
    return project.mteam;
  }

  return project.role === filter;
}

/* ==========================================
   5. 이미지 삽입
========================================== */
function loadImageSlots() {
document
  .querySelectorAll("[data-image-key]")
  .forEach((slot) => {

    const key = slot.dataset.imageKey;
    const colorPath = IMAGE_PATHS[key];

    slot.replaceChildren();

    if (!colorPath) return;

    // 분야별 카테고리 아이콘
    if (slot.classList.contains("category-icon")) {

      const bwPath = IMAGE_PATHS[`${key}BW`];

      slot.classList.toggle(
        "has-bw",
        Boolean(bwPath)
      );

      // 미선택 상태용 흑백 이미지
      if (bwPath) {
        const bwImage = document.createElement("img");

        bwImage.src = bwPath;
        bwImage.alt = "";
        bwImage.className = "category-icon-bw";

        bwImage.onerror = () => {
          slot.classList.remove("has-bw");
          bwImage.remove();
        };

        slot.appendChild(bwImage);
      }

      // 선택 / 호버 상태용 컬러 이미지
      const colorImage = document.createElement("img");

      colorImage.src = colorPath;
      colorImage.alt = "";
      colorImage.className = "category-icon-colored";

      colorImage.onerror = () => colorImage.remove();

      slot.appendChild(colorImage);

      return;
    }

    // 기존 일반 이미지 처리
    const img = document.createElement("img");

    img.src = colorPath;
    img.alt = "";

    img.onerror = () => img.remove();

    slot.appendChild(img);

  });

  document
    .querySelectorAll("[data-social]")
    .forEach((link) => {

      const url = SOCIAL_URLS[link.dataset.social];

      if (url) {
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      } else {
        link.addEventListener("click", (event) => {
          event.preventDefault();
        });
      }
    });
}

/* ==========================================
   6. 작품 카드 생성
========================================== */

/* ==========================================
   작품 카드 생성 - 세로형 디자인
========================================== */

function createProjectCard(project) {

  const article = document.createElement("article");
  article.className = "project-card";

  // 카드 전체 클릭
  const link = document.createElement("a");
  link.className = "project-link";

  link.href = project.link ||
    `detail.html?id=${encodeURIComponent(project.id)}`;

  link.setAttribute(
    "aria-label",
    `${project.brand || project.title} ${project.proposal || ""} 작품 소개 보기`
  );


  /* ========================================
     1. 상단 대표 이미지
  ======================================== */

  const thumb = document.createElement("div");
  thumb.className = "project-thumb";

  if (project.thumbnail) {

    const img = document.createElement("img");

    img.src = project.thumbnail;
    img.alt = `${project.brand || project.title} 대표 이미지`;
    img.loading = "lazy";

    img.onerror = () => img.remove();

    thumb.appendChild(img);
  }


  /* ========================================
     2. 하단 텍스트 영역
  ======================================== */

  const info = document.createElement("div");
  info.className = "project-info";
  
/* 작품별 하단 배경색 */


  // 브랜드명 (파란 표시 영역)
  const brand = document.createElement("p");
  brand.className = "project-brand";

  brand.textContent =
    project.brand || project.title;


  // 제안 이름 (주황 표시 영역)
  const proposal = document.createElement("h2");
  proposal.className = "project-proposal";

  proposal.textContent =
    project.proposal || "제안 이름";


  // 학생명 (검은 표시 영역)
  const author = document.createElement("p");
  author.className = "project-author";

  author.textContent =
    project.author || "작가명";


  /* ========================================
     3. 카드 조립
  ======================================== */

  info.append(
    brand,
    proposal,
    author
  );

  link.append(
    thumb,
    info
  );

  article.appendChild(link);

  return article;
}


/* ==========================================
   7. 메인 포트폴리오 페이지
========================================== */
function initGallery() {

  const grid = document.getElementById("portfolio-grid");

  if (!grid) return;

  const roleFilters = document.getElementById("role-filters");
  const emptyState = document.getElementById("empty-state");

  const categoryButtons =
    document.querySelectorAll(".media-category");

  const searchToggle =
    document.getElementById("search-toggle");

  const searchPanel =
    document.getElementById("search-panel");

  const searchInput =
    document.getElementById("project-search");

  const searchClose =
    document.getElementById("search-close");

  const urlCategory =
    new URLSearchParams(location.search).get("category");

  const state = {
    category: Object.hasOwn(CATEGORY_NAMES, urlCategory)
      ? urlCategory
      : "multimedia",

    filter: "all",
    keyword: ""
  };

  /* 작품 목록 출력 */
  function renderProjects() {

    const keyword =
      state.keyword.trim().toLocaleLowerCase();

    const visible = projects.filter((project) => {

      return (
        project.category === state.category &&
        matchesFilter(project, state.filter) &&

        (
          !keyword ||
          `${project.title} ${project.author}`
            .toLocaleLowerCase()
            .includes(keyword)
        )
      );
    });

    grid.replaceChildren(
      ...visible.map(createProjectCard)
    );

    emptyState.hidden = visible.length > 0;
  }

  /* 카테고리에 맞는 하위 필터 생성 */
  function renderFilters() {

    const categoryProjects = projects.filter(
      (project) => project.category === state.category
    );

    const buttons = FILTERS[state.category].map(
      ({ key, label }) => {

        const button = document.createElement("button");
        button.type = "button";
        button.className = "role-button";

        const isActive = state.filter === key;

        button.classList.toggle(
          "is-active",
          isActive
        );

        button.setAttribute(
          "aria-pressed",
          String(isActive)
        );

        // 필터 이름
        const name = document.createElement("span");
        name.textContent = label;

        // 해당 필터 작품 수
        const count = document.createElement("span");
        count.className = "filter-count";

        count.textContent = String(
          categoryProjects.filter(
            (project) => matchesFilter(project, key)
          ).length
        );

        button.append(name);

        // 하위 필터 클릭
        button.addEventListener("click", () => {

          state.filter = key;

          renderFilters();
          renderProjects();

        });

        return button;
      }
    );

    roleFilters.replaceChildren(...buttons);
  }

  /* 메인 카테고리 클릭 */
  categoryButtons.forEach((button) => {

    button.addEventListener("click", () => {

      state.category = button.dataset.category;

      // 카테고리 변경 시 ALL부터 시작
      state.filter = "all";

      categoryButtons.forEach((b) => {

        const active = b === button;

        b.classList.toggle("is-active", active);

        b.setAttribute(
          "aria-pressed",
          String(active)
        );
      });

      renderFilters();
      renderProjects();

    });

    const active =
      button.dataset.category === state.category;

    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  /* 검색창 */
  function toggleSearch(forceOpen) {

    const open =
      typeof forceOpen === "boolean"
        ? forceOpen
        : searchPanel.hidden;

    searchPanel.hidden = !open;

    searchToggle.setAttribute(
      "aria-expanded",
      String(open)
    );

    if (open) {
      searchInput.focus();
    } else {
      searchInput.value = "";
      state.keyword = "";

      renderProjects();
      searchToggle.focus();
    }
  }

  searchToggle.addEventListener("click", () => {
    toggleSearch();
  });

  searchClose.addEventListener("click", () => {
    toggleSearch(false);
  });

  searchInput.addEventListener("input", () => {
    state.keyword = searchInput.value;
    renderProjects();
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !searchPanel.hidden
    ) {
      toggleSearch(false);
    }
  });

  renderFilters();
  renderProjects();
}

/* ==========================================
   8. 작품 상세 페이지
========================================== */
function initDetailPage() {

  const titleElement =
    document.getElementById("detail-title");

  if (!titleElement) return;

  const id = new URLSearchParams(
    location.search
  ).get("id");

  const project = projects.find(
    (item) => item.id === id
  );

  const authorElement =
    document.getElementById("detail-author");

  const categoryElement =
    document.getElementById("detail-category");

  const imageElement =
    document.getElementById("detail-image");

  const descriptionElement =
    document.getElementById("detail-description");

  const backLink =
    document.getElementById("detail-back");

  if (!project) {
    titleElement.textContent =
      "작품을 찾을 수 없습니다.";

    authorElement.textContent =
      "작품 주소를 다시 확인해 주세요.";

    imageElement.hidden = true;
    descriptionElement.hidden = true;

    return;
  }

  titleElement.textContent = project.title;
  authorElement.textContent = project.author;

  categoryElement.textContent =
    CATEGORY_NAMES[project.category];

  descriptionElement.textContent =
    project.description ||
    "작품 소개 내용이 아직 등록되지 않았습니다.";

  backLink.href =
    `index.html?category=${encodeURIComponent(project.category)}`;

  document.title = `${project.title} | Portfolio`;

  if (project.thumbnail) {

    const image = document.createElement("img");

    image.src = project.thumbnail;
    image.alt = `${project.title} 작품 이미지`;

    image.onerror = () => image.remove();

    imageElement.append(image);
  }
}

/* ==========================================
   9. 초기 실행
========================================== */
loadImageSlots();
initGallery();
initDetailPage();

// 맨 위로 이동
const backToTop =
  document.getElementById("back-to-top");

if (backToTop) {
  backToTop.addEventListener("click", () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });
}
