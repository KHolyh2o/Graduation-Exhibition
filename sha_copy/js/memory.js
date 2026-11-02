
"use strict";

/* ==========================================
   MEMORY PAGE
   응원 메시지 포스트잇 게시판
========================================== */

(() => {

  /* ========================================
     1. 저장 설정

     비워두면 현재 브라우저에 저장
     Supabase 연결 시 전체 방문자와 공유
  ======================================== */

  const SUPABASE_URL = "";
  const SUPABASE_KEY = "";

  const STORAGE_KEY = "graduation-memory-2026";
  const MAX_MESSAGES = 200;

  const useSharedStorage = Boolean(
    SUPABASE_URL && SUPABASE_KEY
  );


  /* ========================================
     2. 요소
  ======================================== */

  const form = document.getElementById("memory-form");
  const messageInput = document.getElementById("memory-message");
  const nameInput = document.getElementById("memory-name");
  const lengthText = document.getElementById("memory-length");
  const board = document.getElementById("memory-board");
  const count = document.getElementById("memory-count");
  const empty = document.getElementById("memory-empty");
  const status = document.getElementById("memory-status");
  const submitButton = document.getElementById("memory-submit");

  if (!form || !board || !messageInput) return;

const allowedColors = [
  "lime",
  "pink",
  "yellow",
  "red",
  "blue"
];
  let messages = [];
  let database = null;
  let isSaving = false;


  /* ========================================
     3. 브라우저 저장
  ======================================== */

  function readLocalMessages() {

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }

  }

  function saveLocalMessages(data) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data.slice(0, MAX_MESSAGES))
    );

  }


  /* ========================================
     4. 포스트잇 생성
  ======================================== */

  function createPostIt(item, index) {

    const postIt = document.createElement("article");

    postIt.className = "memory-note";

    postIt.dataset.color =
      allowedColors.includes(item.color)
        ? item.color
        : "yellow";

    // 포스트잇마다 각도를 조금씩 다르게
    const angles = [-2, 1.5, -1, 2, 0.5, -1.5];

    postIt.style.setProperty(
      "--note-rotate",
      `${angles[index % angles.length]}deg`
    );

    // 메시지
    const message = document.createElement("p");
    message.className = "memory-note-message";
    message.textContent = item.message || "";

    // 하단 정보
    const footer = document.createElement("div");
    footer.className = "memory-note-footer";

    const author = document.createElement("span");
    author.className = "memory-note-author";
    author.textContent =
      item.sender_name || "익명";

    const date = document.createElement("time");

    const created = new Date(item.created_at);

    if (!Number.isNaN(created.getTime())) {
      date.dateTime = created.toISOString();
      date.textContent = created.toLocaleDateString(
        "ko-KR",
        {
          month: "numeric",
          day: "numeric"
        }
      );
    }

    footer.append(author, date);
    postIt.append(message, footer);

    return postIt;

  }


  /* ========================================
     5. 게시판 출력
  ======================================== */

  function renderMessages() {

    const fragment = document.createDocumentFragment();

    messages.forEach((item, index) => {
      fragment.appendChild(
        createPostIt(item, index)
      );
    });

    board.replaceChildren(fragment);

    count.textContent = messages.length;
    empty.hidden = messages.length !== 0;

  }


  /* ========================================
     6. 공유 데이터 불러오기
  ======================================== */

  async function loadSharedMessages() {

    const { data, error } = await database
      .from("memory_messages")
      .select(
        "id, sender_name, message, color, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(MAX_MESSAGES);

    if (error) throw error;

    messages = data || [];
    renderMessages();

  }


  /* ========================================
     7. 글자 수 표시
  ======================================== */

  messageInput.addEventListener("input", () => {

    lengthText.textContent =
      `${messageInput.value.length} / 140`;

  });


  /* ========================================
     8. 메시지 등록
  ======================================== */

  form.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (isSaving) return;

    const message = messageInput.value.trim();
    const senderName =
      nameInput.value.trim() || "익명";

    const selectedColor = form.querySelector(
      'input[name="color"]:checked'
    );

    const color = selectedColor?.value || "lime";

    if (!message) {
      status.textContent = "메시지를 입력해 주세요.";
      messageInput.focus();
      return;
    }

    if (!allowedColors.includes(color)) {
      status.textContent = "포스트잇 색상을 선택해 주세요.";
      return;
    }

    if (useSharedStorage && !database) {
      status.textContent =
        "저장 서비스에 연결되지 않았습니다.";
      return;
    }

    const newMessage = {
      sender_name: senderName,
      message,
      color
    };

    isSaving = true;
    submitButton.disabled = true;
    status.textContent = "메시지를 등록하고 있어요.";

    try {

      if (useSharedStorage) {

        // 모든 방문자가 볼 수 있는 데이터베이스
        const { error } = await database
          .from("memory_messages")
          .insert(newMessage);

        if (error) throw error;

        await loadSharedMessages();

      } else {

        // 현재 브라우저에서만 저장
        const localMessage = {
          ...newMessage,
          id: Date.now(),
          created_at: new Date().toISOString()
        };

        const nextMessages = [
          localMessage,
          ...messages
        ].slice(0, MAX_MESSAGES);

        saveLocalMessages(nextMessages);

        messages = nextMessages;
        renderMessages();

      }

      // 작성창 초기화
      form.reset();
      lengthText.textContent = "0 / 140";

      status.textContent =
        "응원 메시지가 포스트잇으로 등록됐어요!";

      messageInput.focus();

    } catch (error) {

      console.error("MEMORY 저장 오류:", error);

      status.textContent =
        "등록에 실패했습니다. 다시 시도해 주세요.";

    } finally {

      isSaving = false;
      submitButton.disabled = false;

    }

  });


  /* ========================================
     9. 초기 실행
  ======================================== */

  async function initMemory() {

    // 브라우저 저장 모드
    if (!useSharedStorage) {

      messages = readLocalMessages();
      renderMessages();

      status.textContent =
        "현재는 이 브라우저에만 저장되는 미리보기 모드입니다.";

      return;
    }

    // 공유 데이터베이스 연결
    try {

      const { createClient } = await import(
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
      );

      database = createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

      await loadSharedMessages();

      status.textContent = "";

      // 다른 학생이 작성한 메시지도 갱신
      setInterval(() => {

        if (document.hidden || isSaving) return;

        loadSharedMessages().catch((error) => {
          console.error("MEMORY 갱신 오류:", error);
        });

      }, 15000);

    } catch (error) {

      console.error("MEMORY 연결 오류:", error);

      database = null;
      submitButton.disabled = true;

      status.textContent =
        "메시지 저장 서비스 연결에 실패했습니다.";

    }

  }

  initMemory();

})();
