
"use strict";

/* ==========================================
   1. 메인 페이지 이미지 / 영상 설정

   경로를 비워두면 빈 공간 유지
========================================== */

const INDEX_ASSETS = {

  // 메인 영상
  heroVideo: "../public/images/메인배너_수정예정.png",

  // 전시 콘셉트 이미지
  concept: "",

  // TARGET 이미지 3개
  multimedia: "",
  video: "",
  xr: "",

  // 전시 안내 지도
  map: "../public/images/학교지도.png",

  // Credit 로고
  creditLogo: "../public/images/UI/크레딧 화살.png",

  // 학생 슬라이드 버튼 이미지
  arrowPrev: "../public/images/UI/slide_pre.png",
  arrowNext: "../public/images/UI/slide_next.png"

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

/* 학생 카드 - 페이지 이동 없는 버튼 */
const link = document.createElement("button");

link.type = "button";
link.className = "student-card-link";

link.dataset.studentId = student.id;

link.setAttribute(
  "aria-label",
  `${student.id} 학생 소개 보기`
);


link.dataset.studentId = student.id;

link.setAttribute(
  "aria-label",
  `${student.id} 학생 소개 보기`
);

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

/* ==========================================
   INDEX INTRO ANIMATION
========================================== */

function initIndexIntro() {

  const intro =
    document.getElementById("index-intro");

  const image =
    document.getElementById("index-intro-image");

  const skip =
    document.getElementById("index-intro-skip");

  if (!intro || !image) return;


  /* ========================================
     설정값
  ======================================== */

  // WebP 애니메이션 길이에 맞게 수정
  const INTRO_DURATION = 6000;

  // 사라지는 효과
  const FADE_DURATION = 750;

  let introTimer = null;
  let safetyTimer = null;
  let started = false;
  let finished = false;


  /* ========================================
     인트로 종료
  ======================================== */


/* 인트로 종료 */
function finishIntro() {

  if (finished) return;

  finished = true;

  clearTimeout(introTimer);
  clearTimeout(safetyTimer);

  // 인트로 종료 상태 설정
  document.documentElement.classList.remove(
    "index-intro-pending"
  );

  document.documentElement.classList.add(
    "index-intro-complete"
  );

  // 인트로가 헤더 클릭을 막지 않도록 설정
  intro.style.pointerEvents = "none";

  // 서서히 사라지는 효과
  intro.classList.add("is-hiding");

  // 완전히 제거
  window.setTimeout(() => {
    intro.remove();
  }, 750);

}


  /* ========================================
     WebP 로드 후 재생 시간 시작
  ======================================== */

  function startIntro() {

    if (started || finished) return;

    started = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      finishIntro();
      return;
    }

    introTimer = window.setTimeout(
      finishIntro,
      INTRO_DURATION
    );

  }


  /* 이미지 로드 확인 */
  if (image.complete) {

    if (image.naturalWidth > 0) {
      startIntro();
    } else {
      finishIntro();
    }

  } else {

    image.addEventListener(
      "load",
      startIntro,
      { once: true }
    );

    image.addEventListener(
      "error",
      finishIntro,
      { once: true }
    );

  }


  /* SKIP 버튼 */
intro.addEventListener("click", () => {
  finishIntro();
});


  /* 파일 로딩 실패 등에 대비한 안전장치 */
  safetyTimer = window.setTimeout(() => {
    finishIntro();
  }, 10000);

}


/* ==========================================
   실행
========================================== */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initIndexIntro,
    { once: true }
  );

} else {

  initIndexIntro();

}


/* ==========================================
   INDEX STUDENT POPUP
========================================== */


/* ==========================================
   INDEX STUDENT POPUP - 수정본
========================================== */

function initIndexStudentPopup() {

  const overlay = document.getElementById(
    "index-student-overlay"
  );

  const iframe = document.getElementById(
    "index-student-iframe"
  );



  const track = document.getElementById(
    "students-track"
  );

if (!overlay || !iframe || !track) {
  return;
}

  let lastFocusedElement = null;


  /* ========================================
     팝업 열기
  ======================================== */

  function openIndexStudentPopup(studentId) {

    lastFocusedElement = document.activeElement;

    overlay.hidden = false;
    overlay.classList.remove("is-ready");

    document.body.classList.add(
      "index-student-modal-open"
    );

    // 기존 student.html의 학생별 팝업
    iframe.src =
      `student.html?from=index#${encodeURIComponent(studentId)}`;

  }


  /* ========================================
     팝업 닫기
     INDEX 화면 유지
  ======================================== */



/* ==========================================
   INDEX 학생 팝업 닫기
========================================== */

function closeIndexStudentPopup() {

  if (overlay.hidden) return;

  // 팝업 숨기기
  overlay.hidden = true;
  overlay.classList.remove("is-ready");

  // INDEX 스크롤 잠금 해제
  document.body.classList.remove(
    "index-student-modal-open"
  );

  // iframe 초기화
  iframe.removeAttribute("src");

  // 기존 학생 카드로 포커스 복귀
  if (
    lastFocusedElement &&
    lastFocusedElement.isConnected
  ) {
    lastFocusedElement.focus({
      preventScroll: true
    });
  }

}

/* 중요!
   student.js에서도 INDEX 닫기 함수를
   직접 호출할 수 있도록 등록
*/



  /* ========================================
     학생 카드 클릭
  ======================================== */

  track.addEventListener("click", (event) => {

    const button = event.target.closest(
      ".student-card-link[data-student-id]"
    );

    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    openIndexStudentPopup(
      button.dataset.studentId
    );

  });


  /* ========================================
     INDEX의 X 버튼
  ======================================== */




  /* ========================================
     iframe 로드 완료

     기존 student.html의 X 버튼을 숨기고
     INDEX가 닫기 기능을 직접 관리
  ======================================== */

 
/* iframe 로딩 완료 */
iframe.addEventListener("load", () => {

  if (overlay.hidden) return;

  overlay.classList.add("is-ready");

});



  /* ========================================
     기존 student.js에서 보내는
     닫기 신호도 계속 지원
  ======================================== */

  window.addEventListener("message", (event) => {

    if (event.source !== iframe.contentWindow) {
      return;
    }

    if (
      location.protocol !== "file:" &&
      event.origin !== location.origin
    ) {
      return;
    }

    if (
      event.data?.type ===
      "CLOSE_INDEX_STUDENT_MODAL"
    ) {
      closeIndexStudentPopup();
    }

  });


  /* ========================================
     INDEX 팝업 바깥 클릭
  ======================================== */

  overlay.addEventListener("click", (event) => {

    if (event.target === overlay) {
      closeIndexStudentPopup();
    }

  });


  /* ========================================
     INDEX에서 ESC 누르기
  ======================================== */

  document.addEventListener("keydown", (event) => {

    if (overlay.hidden) return;

    if (event.key === "Escape") {

      event.preventDefault();

      closeIndexStudentPopup();

    }

  });

}



/* 실행 */
if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initIndexStudentPopup
  );

} else {

  initIndexStudentPopup();

}


