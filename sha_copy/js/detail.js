
"use strict";

/* ==========================================
   1. 학생별 데이터
========================================== */

const STUDENT_DETAILS = {

  // 학생 01
  "student-01": {
    name: "신현아",
    nameEn: "Shin Hyeon A",
    role: "농협은행",

    description:
      "논리적인 분석과 시각적 표현으로 사용자 경험을 만드는 UI/UX 디자이너 신현아입니다. 단순히 예쁜 디자인을 넘어, 사용자 목적에 따라 적합한 방식을 제안하고 고민합니다.",

    // 학생 사진 - 나중에 삽입
    photo: ""
  },

  // 학생 02 (예시)
  "student-02": {
    name: "학생 02",
    nameEn: "Student 02",
    role: "Designer",

    description:
      "두 번째 학생의 자기소개를 입력하는 공간입니다.",

    photo: ""
  }

  // 나머지 학생도 같은 형식으로 추가
};


/* ==========================================
   2. 작품별 상세 데이터

   ID는 기존 project.js의 작품 ID와 동일
   같은 studentId면 같은 학생의 작품
========================================== */

const WORK_DETAILS = {

  // 농협은행
  "multimedia-02": {
    studentId: "student-01",

    title: "농협은행",

    // 상단 영상 또는 이미지
    // type: "video", "youtube", "image"
    mainMedia: {
      type: "video",
      src: ""
    },

    // 하단 긴 작품 이미지
    posterImage: ""
  },

  // 메가MGC커피
  "multimedia-23": {
    studentId: "student-01",

    title: "메가MGC커피",

    mainMedia: {
      type: "video",
      src: ""
    },

    posterImage: ""
  },

  // XR 프로젝트
  "xr-01": {
    studentId: "student-01",

    title: "은둔청년 XR 서비스",

    mainMedia: {
      type: "video",
      src: ""
    },

    posterImage: ""
  },

  // 다른 학생 작품 예시
  "video-01": {
    studentId: "student-02",

    title: "영상미디어 작품 01",

    mainMedia: {
      type: "video",
      src: ""
    },

    posterImage: ""
  },

  "video-02": {
    studentId: "student-02",

    title: "영상미디어 작품 02",

    mainMedia: {
      type: "video",
      src: ""
    },

    posterImage: ""
  }

  // 다른 작품도 같은 형식으로 추가
};


/* ==========================================
   3. 학생 정보 출력
========================================== */

function renderStudent(student, project) {

  const nameKo = document.getElementById("student-name-ko");
  const nameEn = document.getElementById("student-name-en");
  const role = document.getElementById("student-role");
  const description = document.getElementById("student-description");
  const photo = document.getElementById("student-profile-photo");

  if (!student) {

    nameKo.textContent = project.author || "작가명";
    nameEn.textContent = "";

    role.textContent = "담당 분야";
    description.textContent =
      "학생 소개가 아직 등록되지 않았습니다.";

    return;
  }

  nameKo.textContent = student.name;
  nameEn.textContent = student.nameEn;
  role.textContent = student.role;
  description.textContent = student.description;

  // 사진이 설정된 경우
  if (student.photo) {

    const img = document.createElement("img");

    img.src = student.photo;
    img.alt = `${student.name} 프로필 사진`;

    img.onerror = () => img.remove();

    photo.replaceChildren(img);
  }
}


/* ==========================================
   4. 상단 영상 / 이미지 출력
========================================== */

function renderMainMedia(media) {

  const container =
    document.getElementById("detail-main-media");

  container.replaceChildren();

  if (!media || !media.src) {

    container.classList.add("is-empty");
    return;
  }

  container.classList.remove("is-empty");

  // 일반 이미지
  if (media.type === "image") {

    const img = document.createElement("img");

    img.src = media.src;
    img.alt = "작품 대표 이미지";

    img.onerror = () => {
      img.remove();
      container.classList.add("is-empty");
    };

    container.append(img);
  }

  // MP4 영상
  else if (media.type === "video") {

    const video = document.createElement("video");

    video.src = media.src;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";

    container.append(video);
  }

  // 유튜브 임베드
  else if (media.type === "youtube") {

    const iframe = document.createElement("iframe");

    iframe.src = media.src;
    iframe.title = "작품 영상";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";

    container.append(iframe);
  }
}


/* ==========================================
   5. 하단 긴 이미지 출력
========================================== */

function renderPoster(imagePath) {

  const container =
    document.getElementById("detail-poster");

  container.replaceChildren();

  container.classList.remove("has-image");

  if (!imagePath) {

    container.classList.add("is-empty");
    return;
  }

  const img = document.createElement("img");

  img.src = imagePath;
  img.alt = "작품 상세 소개 이미지";

  img.onload = () => {
    container.classList.add("has-image");
    container.classList.remove("is-empty");
  };

  img.onerror = () => {
    img.remove();
    container.classList.add("is-empty");
  };

  container.append(img);
}


/* ==========================================
   6. Other Project 자동 생성
========================================== */

function renderOtherProjects(currentWorkId, studentId) {

  const container =
    document.getElementById("other-project-list");

  container.replaceChildren();

  if (!studentId) {

    showEmptyRelated(container);
    return;
  }

  // 현재 학생의 다른 작품만 찾기
  const related = Object.entries(WORK_DETAILS)
    .filter(([workId, data]) => {

      return (
        workId !== currentWorkId &&
        data.studentId === studentId
      );

    });

  if (related.length === 0) {

    showEmptyRelated(container);
    return;
  }

  related.forEach(([workId, detail]) => {

    // 기존 작품 목록에서 제목 불러오기
    const original = projects.find(
      (project) => project.id === workId
    );

    if (!original) return;

    const link = document.createElement("a");

    link.className = "other-project-link";

    link.href =
      `detail.html?id=${encodeURIComponent(workId)}`;

    const name = document.createElement("span");

    name.textContent =
      detail.title || original.title;

    const arrow = document.createElement("span");

    arrow.className = "other-project-arrow";
    arrow.textContent = "›";
    arrow.setAttribute("aria-hidden", "true");

    link.append(name, arrow);
    container.append(link);

  });

  if (!container.children.length) {
    showEmptyRelated(container);
  }
}


function showEmptyRelated(container) {

  const message = document.createElement("p");

  message.className = "other-project-empty";
  message.textContent = "등록된 다른 작품이 없습니다.";

  container.append(message);
}


/* ==========================================
   7. 현재 작품 데이터 확인 및 렌더링
========================================== */

function initWorkDetail() {

  const params = new URLSearchParams(location.search);

  const workId = params.get("id");

  // 기존 project.js에 있는 86개 작품 데이터
  const project = projects.find(
    (item) => item.id === workId
  );

  const backLink =
    document.getElementById("detail-back-link");

  // 존재하지 않는 작품
  if (!project) {

    document.getElementById("student-name-ko")
      .textContent = "작품을 찾을 수 없습니다.";

    document.getElementById("student-description")
      .textContent = "작품 주소를 확인해 주세요.";

    document.getElementById("student-name-en")
      .textContent = "";

    document.getElementById("student-role")
      .textContent = "";

    renderOtherProjects(null, null);

    return;
  }

  // 프로젝트별 추가 데이터
  const detail = WORK_DETAILS[workId] || {};

  // 학생별 데이터
  const student =
    STUDENT_DETAILS[detail.studentId] || null;

  // 상세 페이지 제목
  const title = detail.title || project.title;

  document.title =
    `${title} | 2026 졸업전시회`;

  // 돌아가기: 원래 작품 분야
  backLink.href =
    `project.html?category=${encodeURIComponent(project.category)}`;

  // 학생 정보
  renderStudent(student, project);

  // 영상
  renderMainMedia(detail.mainMedia);

  // 세로 이미지
  renderPoster(detail.posterImage);

  // 같은 학생의 다른 작품
  renderOtherProjects(workId, detail.studentId);

}


/* ==========================================
   8. 맨 위로 이동
========================================== */

const detailTopButton =
  document.getElementById("detail-top-button");

if (detailTopButton) {

  detailTopButton.addEventListener("click", () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });
}


/* ==========================================
   9. 실행
========================================== */

initWorkDetail();
