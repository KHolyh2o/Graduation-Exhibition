
/* ==========================================
   1. 공통 이미지 설정
========================================== */

// 공통 로고 및 아이콘 이미지
// 경로가 비어 있으면 빈 공간으로 표시

const COMMON_IMAGES = {
  logo: "",
  phoneIcon: "",
  emailIcon: ""
};


/* ==========================================
   2. 졸업전시위원회 학생 번호
========================================== */

// 임시 10명
// 실제 명단에 맞게 수정

const committeeNumbers = [
  1, 2, 3, 4, 5,
  16, 17, 18, 19, 20
];


/* ==========================================
   3. 학생 데이터 40명
========================================== */

const students = Array.from({ length: 40 }, (_, index) => {

  const id = index + 1;
  const number = String(id).padStart(2, "0");

  return {

    // 학생 고유 번호
    id: id,

    // 기본 정보
    name: `학생 ${number}`,
    englishName: `Student ${number}`,

    // 학생 직무
    job: "직무 입력",

    // 자기소개
    introduction: "학생 소개 내용을 입력해주세요.",

    // 연락처
    phone: "",
    email: "",

    // 학생 이미지
    image: "",

    // 팝업에서 사용할 별도 사진
    // 비워두면 목록의 image 사용
    modalImage: "",

    // 학생별 상단 로고
    // 비워두면 공통 로고 사용
    logoImage: "",

    // 학생별 연락처 아이콘
    phoneIcon: "",
    emailIcon: "",

    // 학과 분류
    category: id <= 15 ? "multimedia" : "video",

    // 전시위원회
    committee: committeeNumbers.includes(id),

    // 프로젝트
    projects: Array.from({ length: 4 }, (_, i) => ({
      title: `프로젝트 ${i + 1}`,
      image: "",
      url: ""
    })),

    // 유튜브 영상 ID
    youtubeId: ""

  };

});


/* ==========================================
   4. 학생별 실제 데이터 입력
========================================== */

// 예시: 1번 학생
// 학생마다 별도로 입력하면 됨

Object.assign(students[0], {

  name: "김미콘",
  englishName: "Kim Micon",

  job: "UI/UX Designer",

  introduction:
    "4년 간 서원대학교에서 배운 기술들을 가지고 사회로 나아가 사용자의 불편을 빠르게 발견하고, 명확한 구조와 직관적인 화면으로 해결하는 UI/UX 디자이너가 되겠습니다.",

  phone: "",
  email: "",

  image: "",
  modalImage: "",

  projects: [
    {
      title: "롯데백화점",
      image: "",
      url: ""
    },
    {
      title: "우리동네GS",
      image: "",
      url: ""
    },
    {
      title: "더 현대 커넥트",
      image: "",
      url: ""
    },
    {
      title: "은둔청년 XR 서비스",
      image: "",
      url: ""
    }
  ],

  youtubeId: ""

});


// 2번 학생 예시
// students[1] = 2번 학생
// students[39] = 40번 학생

/*
Object.assign(students[1], {

  name: "학생 이름",
  englishName: "English Name",

  job: "Designer",

  introduction: "학생 자기소개",

  phone: "010-0000-0000",
  email: "example@email.com",

  image: "images/student02.jpg",

  projects: [
    {
      title: "프로젝트 A",
      image: "images/project-a.jpg",
      url: "project-a.html"
    },
    {
      title: "프로젝트 B",
      image: "images/project-b.jpg",
      url: "project-b.html"
    }
  ],

  youtubeId: ""

});
*/


/* ==========================================
   5. HTML 안전 처리
========================================== */

function escapeHTML(value) {

  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

}

function safeURL(value) {

  const url = String(value || "").trim();

  if (
    !url ||
    /^(javascript|data|vbscript):/i.test(url) ||
    url.startsWith("//")
  ) {
    return "";
  }

  return escapeHTML(url);

}


/* ==========================================
   6. ELEMENT
========================================== */

let currentFilter = "all";
let lastTrigger = null;

const studentGrid = document.getElementById("studentGrid");
const peopleCount = document.getElementById("peopleCount");
const emptyState = document.getElementById("emptyState");
const studentPanel = document.getElementById("studentPanel");

const modal = document.getElementById("graduateModal");
const modalContent = document.getElementById("modalContent");
const modalLogo = document.getElementById("modalLogo");
const modalClose = document.getElementById("modalClose");


/* ==========================================
   7. 학생 카드 생성
========================================== */

function createStudentCard(student) {

  const imagePath = safeURL(student.image);

  const imageHTML = imagePath
    ? `
      <img
        src="${imagePath}"
        alt="${escapeHTML(student.name)} 프로필"
        loading="lazy"
      >
    `
    : `<div class="photo-placeholder"></div>`;


  return `
    <button
      type="button"
      class="student-card"
      data-student-id="${student.id}"
      aria-label="${escapeHTML(student.name)} 상세 소개 열기"
    >

      <div class="student-photo">
        ${imageHTML}
      </div>

      <div class="student-info">

        <h3 class="student-name">
          ${escapeHTML(student.name)}
        </h3>

        <p class="student-english">
          ${escapeHTML(student.englishName)}
        </p>

      </div>

    </button>
  `;

}


/* ==========================================
   8. 카테고리 필터
========================================== */

function matchCategory(student) {

  if (currentFilter === "multimedia") {
    return student.category === "multimedia";
  }

  if (currentFilter === "video") {
    return student.category === "video";
  }

  if (currentFilter === "committee") {
    return student.committee === true;
  }

  return true;

}


/* ==========================================
   9. 학생 목록 출력
========================================== */

function renderStudents() {

  // 외부 헤더 검색창 연동
  const searchInput = document.getElementById("studentSearch");

  const keyword = (searchInput?.value || "")
    .trim()
    .toLowerCase();


  const result = students.filter(student => {

    const categoryMatch = matchCategory(student);

    const searchText = [
      student.name,
      student.englishName
    ].join(" ").toLowerCase();

    const searchMatch = searchText.includes(keyword);

    return categoryMatch && searchMatch;

  });


  studentGrid.innerHTML = result
    .map(createStudentCard)
    .join("");



  emptyState.hidden = result.length !== 0;

}


/* ==========================================
   10. TAB EVENT
========================================== */

document.querySelectorAll(".tab").forEach(tab => {

  tab.addEventListener("click", () => {

    currentFilter = tab.dataset.filter;

    document.querySelectorAll(".tab").forEach(item => {

      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");

    });

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");

    studentPanel.setAttribute(
      "aria-labelledby",
      tab.id
    );

    renderStudents();

  });

});


/* ==========================================
   11. 외부 헤더 검색 연동
========================================== */

document.addEventListener("input", event => {

  if (event.target?.id === "studentSearch") {
    renderStudents();
  }

});


/* ==========================================
   12. 이미지 공간 생성
========================================== */

function createImageSlot(path, placeholderClass, alt = "") {

  const imagePath = safeURL(path);

  if (imagePath) {

    return `
      <img
        src="${imagePath}"
        alt="${escapeHTML(alt)}"
      >
    `;

  }

  return `<div class="${placeholderClass}"></div>`;

}


/* ==========================================
   13. 연락처 생성
========================================== */

function createContact(student) {

  const phoneIcon = student.phoneIcon || COMMON_IMAGES.phoneIcon;
  const emailIcon = student.emailIcon || COMMON_IMAGES.emailIcon;

  const phoneText = student.phone || "전화번호 입력";
  const emailText = student.email || "이메일 입력";

  const telNumber = String(student.phone || "")
    .replace(/[^\d+]/g, "");

  const phoneHTML = telNumber
    ? `<a href="tel:${telNumber}">
         ${escapeHTML(phoneText)}
       </a>`
    : `<span class="contact-text">
         ${escapeHTML(phoneText)}
       </span>`;

  const emailHTML = student.email
    ? `<a href="mailto:${escapeHTML(student.email)}">
         ${escapeHTML(emailText)}
       </a>`
    : `<span class="contact-text">
         ${escapeHTML(emailText)}
       </span>`;


  return `
    <div class="graduate-contact">

      <!-- 전화번호 -->
      <div class="graduate-contact-item">

        <div class="graduate-contact-icon">
          ${createImageSlot(
            phoneIcon,
            "graduate-icon-placeholder",
            ""
          )}
        </div>

        ${phoneHTML}

      </div>

      <!-- 이메일 -->
      <div class="graduate-contact-item">

        <div class="graduate-contact-icon">
          ${createImageSlot(
            emailIcon,
            "graduate-icon-placeholder",
            ""
          )}
        </div>

        ${emailHTML}

      </div>

    </div>
  `;

}


/* ==========================================
   14. 프로젝트 생성
========================================== */

function createProjectCard(project) {

  const imageHTML = createImageSlot(
    project.image,
    "graduate-project-placeholder",
    project.title
  );

  const content = `
    <div class="graduate-project-image">
      ${imageHTML}
    </div>

    <p class="graduate-project-name">
      ${escapeHTML(project.title)}
    </p>
  `;

  const projectURL = safeURL(project.url);

  // 프로젝트 상세 페이지 주소가 있으면 이동
  if (projectURL) {

    return `
      <a
        class="graduate-project-card"
        href="${projectURL}"
      >
        ${content}
      </a>
    `;

  }

  // 주소가 없으면 일반 카드
  return `
    <div class="graduate-project-card">
      ${content}
    </div>
  `;

}


/* ==========================================
   15. 유튜브 영역 생성
========================================== */

function createYoutubeSection(student) {

  const youtubeId = String(student.youtubeId || "").trim();

  // 유튜브 영상 ID가 등록되면 영상 표시
  const validYoutubeId = /^[a-zA-Z0-9_-]{11}$/.test(youtubeId);

  const videoHTML = validYoutubeId
    ? `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${youtubeId}"
        title="${escapeHTML(student.name)} 프로젝트 영상"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    `
    : `<div class="graduate-video-placeholder"></div>`;


  return `
    <section class="graduate-video-section">
      <div class="graduate-video">
        ${videoHTML}
      </div>
    </section>
  `;

}


/* ==========================================
   16. 학생별 팝업 내용 생성
========================================== */

function createModalContent(student) {

  const profileImage = student.modalImage || student.image;

  const imageHTML = createImageSlot(
    profileImage,
    "graduate-profile-photo-placeholder",
    `${student.name} 프로필`
  );

  const projects = Array.isArray(student.projects)
    ? student.projects
    : [];

  const projectHTML = projects
    .map(createProjectCard)
    .join("");


  return `

    <!-- 학생 프로필 -->
    <section class="graduate-profile">

      <div class="graduate-profile-photo">
        ${imageHTML}
      </div>

      <div class="graduate-profile-info">

        <div class="graduate-name-line">

          <h2 class="graduate-name" id="modalStudentName">
            ${escapeHTML(student.name)}
          </h2>

          <span class="graduate-english-name">
            ${escapeHTML(student.englishName)}
          </span>

        </div>

        <p class="graduate-job">
          ${escapeHTML(student.job)}
        </p>

        <p class="graduate-introduction">
          ${escapeHTML(student.introduction)}
        </p>

        ${createContact(student)}

      </div>

    </section>


    <!-- PROJECT -->
    <section class="graduate-project-section">

      <h2 class="graduate-section-title">
        Project
      </h2>

      <div class="graduate-project-grid">
        ${projectHTML}
      </div>

    </section>


    <!-- YOUTUBE VIDEO -->
    ${createYoutubeSection(student)}

  `;

}


/* ==========================================
   17. 팝업 열기
========================================== */

function openStudentModal(student) {

  // 상단 로고 이미지
  const logoImage = student.logoImage || COMMON_IMAGES.logo;

  modalLogo.innerHTML = createImageSlot(
    logoImage,
    "graduate-logo-placeholder",
    "졸업전시 로고"
  );

  // 해당 학생의 데이터 적용
  modalContent.innerHTML = createModalContent(student);

  // 팝업 표시
  modal.hidden = false;

  document.body.classList.add("graduate-modal-open");

  // 팝업 스크롤 초기화
  modal.scrollTop = 0;

  // 닫기 버튼으로 포커스 이동
  modalClose.focus({ preventScroll: true });

}


/* ==========================================
   18. 팝업 닫기
========================================== */

function hideStudentModal() {

  if (modal.hidden) return;

  modal.hidden = true;

  // 유튜브 영상 재생도 종료
  modalContent.innerHTML = "";

  document.body.classList.remove("graduate-modal-open");

  // 원래 클릭한 학생 카드로 포커스 복귀
  if (lastTrigger && lastTrigger.isConnected) {
    lastTrigger.focus({ preventScroll: true });
  }

  lastTrigger = null;

}


/* ==========================================
   19. 학생별 팝업 URL 연동
========================================== */

// 학생별 URL을 구분할 수 있음
// #student-01
// #student-02
// ...
// #student-40

function syncModalWithHash() {

  const match = window.location.hash.match(/^#student-(\d+)$/);

  if (!match) {
    hideStudentModal();
    return;
  }

  const studentId = Number(match[1]);

  const student = students.find(item => item.id === studentId);

  if (student) {
    openStudentModal(student);
  } else {
    hideStudentModal();
  }

}


/* ==========================================
   20. 학생 카드 클릭 이벤트
========================================== */

studentGrid.addEventListener("click", event => {

  const card = event.target.closest("[data-student-id]");

  if (!card) return;

  const studentId = Number(card.dataset.studentId);

  const student = students.find(item => item.id === studentId);

  if (!student) return;

  // 클릭했던 카드 기억
  lastTrigger = card;

  // URL 해시를 바꾸면 팝업 자동 실행
  const number = String(studentId).padStart(2, "0");

  window.location.hash = `student-${number}`;

});


/* ==========================================
   21. 닫기 버튼
========================================== */

function closeStudentModal() {

  // 학생 해시 제거
  const cleanURL =
    window.location.pathname + window.location.search;

  history.replaceState(null, "", cleanURL);

  hideStudentModal();

}

modalClose.addEventListener("click", closeStudentModal);


/* ==========================================
   22. ESC / 팝업 키보드 동작
========================================== */

document.addEventListener("keydown", event => {

  if (modal.hidden) return;

  // ESC 닫기
  if (event.key === "Escape") {
    closeStudentModal();
    return;
  }

  // 포커스가 팝업 밖으로 나가지 않게 처리
  if (event.key === "Tab") {

    const focusable = Array.from(
      modal.querySelectorAll(
        'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => el.getClientRects().length > 0);

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }

  }

});


/* ==========================================
   23. URL 변경 감지
========================================== */

window.addEventListener("hashchange", syncModalWithHash);

window.addEventListener("popstate", syncModalWithHash);


/* ==========================================
   24. TOP BUTTON
========================================== */

const topButton = document.getElementById("topButton");

window.addEventListener("scroll", () => {

  topButton.classList.toggle(
    "show",
    window.scrollY > 400
  );

});

topButton.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});


/* ==========================================
   25. INITIAL EXECUTION
========================================== */

renderStudents();
syncModalWithHash();
