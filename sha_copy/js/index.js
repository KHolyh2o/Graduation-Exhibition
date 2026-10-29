
"use strict";

/* ==========================================
   1. 메인 페이지 이미지 / 영상 설정

   경로를 비워두면 빈 공간 유지
========================================== */

const INDEX_ASSETS = {

  // 메인 영상
  heroVideo: "",

  // 전시 콘셉트 이미지
  concept: "",

  // TARGET 이미지 3개
  multimedia: "",
  video: "",
  xr: "",

  // 전시 안내 지도
  map: "",

  // Credit 로고
  creditLogo: "",

  // 학생 슬라이드 버튼 이미지
  arrowPrev: "",
  arrowNext: ""

};


/* ==========================================
   2. 학생 카드별 이미지 / 이동 주소

   각 학생 카드 = 완성 이미지 1장

   아래에 실제 학생별 데이터 추가
========================================== */

const STUDENT_OVERRIDES = {

  "student-01": {
    image: "",
    link: "student.html"
  },

  "student-02": {
    image: "",
    link: "student.html"
  },

  "student-03": {
    image: "",
    link: "student.html"
  }

  // student-04 ~ student-40
  // 동일한 형식으로 추가 가능

};


/* ==========================================
   3. 학생 40명 데이터 자동 생성
========================================== */

const MAIN_STUDENTS = Array.from(
  { length: 40 },
  (_, index) => {

    const studentId =
      `student-${String(index + 1).padStart(2, "0")}`;

    const override =
      STUDENT_OVERRIDES[studentId] || {};

    return {
      id: studentId,

      image: override.image || "",

      link: override.link || "student.html"
    };

  }
);


/* ==========================================
   4. 이미지 삽입 공통 함수
========================================== */

function setIndexImage(container, imagePath, altText = "") {

  if (!container) return;

  container.replaceChildren();
  container.classList.remove("has-image");

  // 이미지 경로가 비어 있으면 공간 유지
  if (!imagePath) return;

  const image = document.createElement("img");

  image.src = imagePath;
  image.alt = altText;
  image.loading = "lazy";

  image.addEventListener("load", () => {
    container.classList.add("has-image");
  });

  image.addEventListener("error", () => {
    image.remove();
    container.classList.remove("has-image");
  });

  container.appendChild(image);

}


/* ==========================================
   5. 메인 영상 설정
========================================== */

function initMainHeroVideo() {

  const video =
    document.getElementById("main-hero-video");

  if (!video) return;

  const videoPath = INDEX_ASSETS.heroVideo;

  // 영상 경로가 없으면 빈 공간 유지
  if (!videoPath) return;

  video.src = videoPath;

  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;

  video.load();

  // 자동재생 가능한 환경에서 재생
  video.play().catch(() => {
    // 브라우저가 자동 재생을 제한하는 경우
  });

}


/* ==========================================
   6. 메인 이미지 영역 불러오기
========================================== */

function loadIndexImages() {

  const imageElements =
    document.querySelectorAll("[data-main-image]");

  const altTexts = {

    concept: "전시 콘셉트 이미지",

    multimedia: "멀티미디어 작품 대표 이미지",

    video: "영상미디어 작품 대표 이미지",

    xr: "XR 프로젝트 대표 이미지",

    map: "졸업전시 장소 안내 지도",

    creditLogo: "졸업전시 크레딧 로고"

  };

  imageElements.forEach((element) => {

    const key = element.dataset.mainImage;

    const imagePath = INDEX_ASSETS[key] || "";

    setIndexImage(
      element,
      imagePath,
      altTexts[key] || ""
    );

  });

}


/* ==========================================
   7. 학생 카드 생성
   이미지만 표시, 별도 텍스트 없음
========================================== */

function createMainStudentCard(student) {

  const card = document.createElement("article");

  card.className = "student-card";


  /* 카드 전체 링크 */
  const link = document.createElement("a");

  link.className = "student-card-link";

  link.href = student.link;

  link.setAttribute(
    "aria-label",
    `${student.id} 학생 소개 보기`
  );


  /* 카드 이미지 공간 */
  const imageContainer =
    document.createElement("div");

  imageContainer.className = "student-card-image";


  /* 이미지 */
  if (student.image) {

    const image = document.createElement("img");

    image.src = student.image;

    image.alt = `${student.id} 학생 프로필`;

    image.loading = "lazy";

    image.addEventListener("error", () => {
      image.remove();
    });

    imageContainer.appendChild(image);

  }


  link.appendChild(imageContainer);
  card.appendChild(link);

  return card;

}


/* ==========================================
   8. 학생 슬라이드 페이지 생성
========================================== */

function initMainStudentSlider() {

  const track =
    document.getElementById("students-track");

  const prevButton =
    document.getElementById("students-prev");

  const nextButton =
    document.getElementById("students-next");

  const status =
    document.getElementById("students-slide-status");

  if (!track || !prevButton || !nextButton) {
    return;
  }


  /* ========================================
     슬라이드 상태
  ======================================== */

  let currentPage = 0;

  let pageSize = 10;

  let totalPages = 0;


  /* 화면 크기에 따른 페이지당 학생 수 */
  function getPageSize() {

    return window.matchMedia(
      "(max-width: 768px)"
    ).matches ? 4 : 10;

  }


  /* ========================================
     슬라이드 페이지 구성
  ======================================== */

  function buildPages() {

    pageSize = getPageSize();

    totalPages = Math.ceil(
      MAIN_STUDENTS.length / pageSize
    );

    currentPage = Math.min(
      currentPage,
      totalPages - 1
    );

    const pages = [];

    for (let page = 0; page < totalPages; page++) {

      const pageElement =
        document.createElement("div");

      pageElement.className = "students-page";


      /* 해당 페이지의 학생 목록 */
      const start = page * pageSize;

      const end = start + pageSize;

      const students =
        MAIN_STUDENTS.slice(start, end);


      /* 이미지 그리드 */
      const grid = document.createElement("div");

      grid.className = "students-grid";

      grid.append(
        ...students.map(createMainStudentCard)
      );


      pageElement.appendChild(grid);

      pages.push(pageElement);

    }

    track.replaceChildren(...pages);

    updateSlider();

  }


  /* ========================================
     슬라이드 위치 갱신
  ======================================== */

  function updateSlider() {

    track.style.transform =
      `translateX(-${currentPage * 100}%)`;


    /* 양쪽 버튼 활성화 */
    prevButton.disabled = currentPage === 0;

    nextButton.disabled =
      currentPage === totalPages - 1;


    /* 현재 페이지 접근성 */
    const pages =
      track.querySelectorAll(".students-page");

    pages.forEach((page, index) => {

      const isVisible = index === currentPage;

      page.inert = !isVisible;

      page.setAttribute(
        "aria-hidden",
        String(!isVisible)
      );

    });


    /* 현재 페이지 상태 */
    if (status) {

      status.textContent =
        `학생 슬라이드 ${currentPage + 1} / ${totalPages}`;

    }

  }


  /* ========================================
     이전 버튼
  ======================================== */

  prevButton.addEventListener("click", () => {

    if (currentPage <= 0) return;

    currentPage--;

    updateSlider();

  });


  /* ========================================
     다음 버튼
  ======================================== */

  nextButton.addEventListener("click", () => {

    if (currentPage >= totalPages - 1) return;

    currentPage++;

    updateSlider();

  });


  /* ========================================
     모바일 / PC 전환 시 재구성
  ======================================== */

  const mobileQuery = window.matchMedia(
    "(max-width: 768px)"
  );

  mobileQuery.addEventListener("change", () => {

    // PC / 모바일 전환 시 첫 페이지부터
    currentPage = 0;

    buildPages();

  });


  /* ========================================
     최초 생성
  ======================================== */

  buildPages();

}


/* ==========================================
   9. 슬라이드 버튼 이미지 적용
========================================== */

function loadStudentArrowImages() {

  const arrowSettings = [

    {
      id: "students-prev-image",
      path: INDEX_ASSETS.arrowPrev
    },

    {
      id: "students-next-image",
      path: INDEX_ASSETS.arrowNext
    }

  ];


  arrowSettings.forEach(({ id, path }) => {

    const image = document.getElementById(id);

    if (!image || !path) return;

    image.src = path;
    image.hidden = false;

    image.addEventListener("error", () => {
      image.hidden = true;
    });

  });

}


/* ==========================================
   10. 맨 위로 이동
========================================== */

function initMainTopButton() {

  const button =
    document.getElementById("main-top-button");

  if (!button) return;

  button.addEventListener("click", () => {

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({

      top: 0,

      behavior: reduceMotion
        ? "auto"
        : "smooth"

    });

  });

}


/* ==========================================
   11. 메인 페이지 실행
========================================== */

function initIndexPage() {

  initMainHeroVideo();

  loadIndexImages();

  loadStudentArrowImages();

  initMainStudentSlider();

  initMainTopButton();

}


/* ==========================================
   12. 초기화
========================================== */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initIndexPage
  );

} else {

  initIndexPage();

}
