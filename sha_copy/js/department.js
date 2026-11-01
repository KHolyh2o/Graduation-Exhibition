
"use strict";

/* ==========================================
   1. 이미지 경로 설정
========================================== */

const DEPARTMENT_IMAGES = {

  // 상단 졸업전시 포스터
  poster: "../public/images/UI/학과소개_포스터.png",

  // 학부 소개 위쪽 화살
  arrowTop: "../public/images/UI/학과소개화살_위.png",

  // 학부 소개 아래쪽 화살
  arrowBottom: "../public/images/UI/학과소개화살_아래.png",

  // 교육목표 다이어그램
  educationDiagram: "../public/images/UI/학과소개 요소.png"

};


/* ==========================================
   2. 교수진 데이터
   교수마다 사진 개별 지정
========================================== */

const PROFESSORS = [

  {
    id: "professor-01",
    name: "김병완",
    position: "미디어콘텐츠학부 학부장",
    photo: ""
  },

  {
    id: "professor-02",
    name: "최홍렬",
    position: "미디어콘텐츠학부 지도교수",
    photo: ""
  },

  {
    id: "professor-03",
    name: "이병권",
    position: "미디어콘텐츠학부 지도교수",
    photo: ""
  },

  {
    id: "professor-04",
    name: "김금영",
    position: "미디어콘텐츠학부 지도교수",
    photo: ""
  },

  {
    id: "professor-05",
    name: "유해영",
    position: "미디어콘텐츠학부 지도교수",
    photo: ""
  },

  {
    id: "professor-06",
    name: "조한주",
    position: "미디어콘텐츠학부 지도교수",
    photo: ""
  },

  {
    id: "professor-07",
    name: "김명미",
    position: "미디어콘텐츠학부 지도교수",
    photo: ""
  },

  {
    id: "professor-08",
    name: "이가하",
    position: "미디어콘텐츠학부 지도교수",
    photo: ""
  },

  {
    id: "professor-09",
    name: "강경화",
    position: "미디어콘텐츠학부 지도교수",
    photo: ""
  },

  {
    id: "professor-10",
    name: "박동식",
    position: "미디어콘텐츠학부 지도교수",
    photo: ""
  }

];


/* ==========================================
   3. 이미지 삽입 함수
========================================== */

function insertDepartmentImage(
  container,
  imagePath,
  altText = ""
) {

  if (!container) return;

  container.replaceChildren();
  container.classList.remove("has-image");

  // 경로가 비어 있으면 공간만 표시
  if (!imagePath) return;

  const image = document.createElement("img");

  image.alt = altText;
  image.loading = "lazy";

  image.addEventListener("load", () => {

    container.classList.add("has-image");

  });

  image.addEventListener("error", () => {

    image.remove();

    container.classList.remove("has-image");

  });

  image.src = imagePath;

  container.appendChild(image);

}


/* ==========================================
   4. 메인 이미지 불러오기
========================================== */

function loadDepartmentImages() {

  const imageSlots =
    document.querySelectorAll("[data-dept-image]");

  const imageAltTexts = {

    poster: "2026 졸업전시회 포스터",

    arrowTop: "",

    arrowBottom: "",

    educationDiagram:
      "미디어콘텐츠학부 교육목표 다이어그램"

  };

  imageSlots.forEach((slot) => {

    const imageKey = slot.dataset.deptImage;

    const imagePath =
      DEPARTMENT_IMAGES[imageKey] || "";

    const altText =
      imageAltTexts[imageKey] || "";

    insertDepartmentImage(
      slot,
      imagePath,
      altText
    );

  });

}


/* ==========================================
   5. 교수진 카드 생성
========================================== */


/* ==========================================
   교수진 카드 생성
   카드 클릭 → 축사 팝업
========================================== */

function createProfessorCard(professor) {

  const card = document.createElement("article");
  card.className = "dept-professor-card";
  card.dataset.professorId = professor.id;
  card.setAttribute("data-reveal", "");

  // 카드 전체를 버튼으로 생성
  const button = document.createElement("button");

  button.type = "button";
  button.className = "dept-professor-button";
  button.dataset.professorId = professor.id;

  button.setAttribute(
    "aria-label",
    `${professor.name} 교수 축사 보기`
  );

  button.setAttribute(
    "aria-haspopup",
    "dialog"
  );


  /* 교수 사진 */
  const photo = document.createElement("div");

  photo.className =
    "dept-professor-photo dept-image-slot";

  insertDepartmentImage(
    photo,
    professor.photo,
    `${professor.name} 교수 사진`
  );


  /* 교수 이름 */
  const name = document.createElement("h3");

  name.className = "dept-professor-name";
  name.textContent = professor.name;


  /* 교수 직책 */
  const position = document.createElement("p");

  position.className = "dept-professor-position";
  position.textContent = professor.position;


  button.append(photo, name, position);
  card.appendChild(button);

  return card;
}



/* ==========================================
   6. 교수진 목록 출력
========================================== */

function renderProfessors() {

  const container =
    document.getElementById("dept-professor-grid");

  if (!container) return;

  // 기존 목록 초기화
  container.replaceChildren();

  // 교수진 카드 10개 생성
  const professorCards = PROFESSORS.map(
    createProfessorCard
  );

  container.append(...professorCards);

}


/* ==========================================
   7. 맨 위로 이동 버튼
========================================== */

function initDepartmentTopButton() {

  const topButton =
    document.getElementById("dept-top-button");

  if (!topButton) return;

  topButton.addEventListener("click", () => {

    const reduceMotion =
      window.matchMedia(
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
   PROFESSOR MESSAGE MODAL
========================================== */

function initProfessorMessageModal() {

  const grid =
    document.getElementById("dept-professor-grid");

  const overlay =
    document.getElementById("dept-message-overlay");

  const closeButton =
    document.getElementById("dept-message-close");

  const modalLogo =
    document.getElementById("dept-message-logo");

  const modalPhoto =
    document.getElementById("dept-message-photo");

  const modalName =
    document.getElementById("dept-message-name");

  const modalPosition =
    document.getElementById("dept-message-position");

  const modalQuote =
    document.getElementById("dept-message-quote");

  const modalContent =
    document.getElementById("dept-message-content");

  if (!grid || !overlay || !closeButton) return;

  let lastFocusedElement = null;


  /* ========================================
     팝업 로고
     공통 헤더 로고 이미지 재사용
  ======================================== */


/* 공통 로고 이미지 사용 */
const commonLogo = document.querySelector(
  "#common-logo-image img"
);

modalLogo.replaceChildren();

if (commonLogo) {
  const logo = commonLogo.cloneNode(true);
  logo.alt = "2026 졸업전시회 과녁 로고";
  modalLogo.appendChild(logo);
}



  /* ========================================
     교수별 축사 열기
  ======================================== */

  function openProfessorMessage(professorId) {

    const professor = PROFESSORS.find(
      (item) => item.id === professorId
    );

    if (!professor) return;

    const messageData =
      PROFESSOR_MESSAGES[professorId] || {};

    lastFocusedElement = document.activeElement;


    /* 교수 이름 */
    modalName.textContent = professor.name;


    /* 소속 / 직책 */
    modalPosition.textContent =
      professor.position.replace(
        "미디어콘텐츠학부 ",
        "미디어콘텐츠학부 / "
      );


    /* 축사 제목 */
    if (messageData.title) {

      modalQuote.hidden = false;
      modalQuote.textContent = `“${messageData.title}”`;

    } else {

      modalQuote.hidden = true;
      modalQuote.textContent = "";

    }


    /* 교수별 축사 본문 */
    modalContent.textContent =
      messageData.message ||
      "축사 내용이 아직 등록되지 않았습니다.";


    /* 교수 사진
       팝업 전용 사진이 있으면 우선 사용
       없으면 기존 교수 목록 사진 사용
    */
    const photoPath =
      messageData.photo || professor.photo || "";

    insertDepartmentImage(
      modalPhoto,
      photoPath,
      `${professor.name} 교수 사진`
    );


    /* 팝업 열기 */
   
/* 팝업 열기 */
overlay.hidden = false;

document.body.classList.add("dept-message-open");

/* 팝업을 열 때 항상 맨 위에서 시작 */
const modalFrame =
  document.getElementById("dept-message-frame");

if (modalFrame) {
  modalFrame.scrollTop = 0;
}

closeButton.focus();

  }


  /* ========================================
     팝업 닫기
  ======================================== */

  function closeProfessorMessage() {

    if (overlay.hidden) return;

    overlay.hidden = true;

    document.body.classList.remove(
      "dept-message-open"
    );

    // 이전에 클릭한 교수 카드로 포커스 복귀
    if (
      lastFocusedElement &&
      lastFocusedElement.isConnected
    ) {
      lastFocusedElement.focus();
    }

  }


  /* ========================================
     교수 카드 클릭
  ======================================== */

  grid.addEventListener("click", (event) => {

    const button = event.target.closest(
      ".dept-professor-button"
    );

    if (!button) return;

    const professorId =
      button.dataset.professorId;

    openProfessorMessage(professorId);

  });


  /* ========================================
     X 버튼 클릭
  ======================================== */

  closeButton.addEventListener(
    "click",
    closeProfessorMessage
  );


  /* ========================================
     팝업 바깥 빈 영역 클릭
  ======================================== */

  overlay.addEventListener("click", (event) => {

    if (event.target === overlay) {
      closeProfessorMessage();
    }

  });


  /* ========================================
     ESC / 키보드
  ======================================== */

  document.addEventListener("keydown", (event) => {

    if (overlay.hidden) return;

    if (event.key === "Escape") {

      event.preventDefault();
      closeProfessorMessage();

    }

    // 팝업이 열린 동안 키보드 포커스 유지
    if (event.key === "Tab") {

      event.preventDefault();
      closeButton.focus();

    }

  });

}



/* ==========================================
   ABOUT 페이지 초기화
========================================== */

function initDepartmentPage() {

  // 이미지 불러오기
  loadDepartmentImages();

  // 교수 카드 10개 생성
  renderProfessors();

  // 교수별 축사 팝업
  initProfessorMessageModal();

  // 맨 위로 버튼
  initDepartmentTopButton();

}



/* ==========================================
   9. 실행
========================================== */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initDepartmentPage
  );

} else {

  initDepartmentPage();

}

/* ==========================================
   PROFESSOR MESSAGE DATA
   교수별 축사 개별 관리
========================================== */

const PROFESSOR_MESSAGES = {

  /* 김병완 */
  "professor-01": {
    title: "축하합니다, 그리고 감사합니다.",

    message: `여러분 인생의 가장 빛나는 4년을 함께 할 수 있어 감사했습니다.

그동안 수많은 도전과 고민, 그리고 웃음과 눈물이 있었겠지요. 하지만 그 모든 시간이 여러분을 한층 단단하고 멋진 사람으로 성장시켰을 것이라 믿습니다.

이제 세상이라는 무대에서 여러분만의 색깔로 마음껏 빛나시길 바랍니다. 여러분의 앞날에 늘 설렘과 용기가 함께하길 바랍니다.

사랑하고 축복합니다~`,

    photo: ""
  },

  /* 최홍렬 */
  "professor-02": {
    title: "",
    message: "",
    photo: ""
  },

  /* 이병권 */
  "professor-03": {
    title: "",
    message: "",
    photo: ""
  },

  /* 김금영 */
  "professor-04": {
    title: "",
    message: "",
    photo: ""
  },

  /* 유해영 */
  "professor-05": {
    title: "",
    message: "",
    photo: ""
  },

  /* 조한주 */
  "professor-06": {
    title: "",
    message: "",
    photo: ""
  },

  /* 김명미 */
  "professor-07": {
    title: "",
    message: "",
    photo: ""
  },

  /* 이가하 */
  "professor-08": {
    title: "",
    message: "",
    photo: ""
  },

  /* 강경화 */
  "professor-09": {
    title: "",
    message: "",
    photo: ""
  },

  /* 박동식 */
  "professor-10": {
    title: "",
    message: "",
    photo: ""
  }

};
