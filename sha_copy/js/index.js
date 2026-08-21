// 데이터는 진짜 프로젝트(../src/data)에서 그대로 가져옵니다.
// 이 파일에서 데이터를 고치지 마세요 — src/data 안의 파일을 고치면 여기도 같이 바뀝니다.
import { graduates } from '../../src/data/graduates.js';

const FALLBACK_AVATAR = '/sha_copy/images/no-avatar.svg';
const CARD_GAP = 20;

/* ── 이미지 경로 변환 + 로드 실패 시 대체 이미지 ─────────────────
   src/data 안 이미지 경로는 '/images/...' 형태라서, 여기서는
   'sha_copy/images'(진짜 public/images로 연결된 심볼릭 링크)를 앞에 붙여줍니다. */
function safeImg(el, src, fallback) {
  el.src = src ? `/sha_copy${src}` : fallback;
  el.onerror = () => { el.onerror = null; el.src = fallback; };
}

/* ── 프로필 카드 렌더링 ──────────────────────────────────────── */
const track = document.getElementById('track');
document.getElementById('profilesCount').textContent =
  `총 ${graduates.length}명 · 클릭하면 상세 정보를 볼 수 있습니다`;

graduates.forEach((g) => {
  const card = document.createElement('div');
  card.className = 'profile-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `${g.name} 프로필 보기`);

  const imgWrap = document.createElement('div');
  imgWrap.className = 'profile-card-img';
  if (g.profileImage) {
    const img = document.createElement('img');
    img.alt = g.name;
    img.loading = 'lazy';
    safeImg(img, g.profileImage, FALLBACK_AVATAR);
    imgWrap.appendChild(img);
  } else {
    imgWrap.innerHTML = `<div class="img-icon" aria-hidden="true">👤</div><span>프로필 사진 영역</span>`;
  }

  const body = document.createElement('div');
  body.className = 'profile-card-body';
  body.innerHTML = `
    <span class="profile-card-num">${g.id}</span>
    <span class="profile-card-name">${g.name}</span>
    <span class="profile-card-work">${g.role}</span>
  `;

  card.appendChild(imgWrap);
  card.appendChild(body);

  const open = () => openModal(g);
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });

  track.appendChild(card);
});

/* ── 캐러셀 ──────────────────────────────────────────────────── */
const trackOuter   = document.getElementById('trackOuter');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const progressFill  = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');

let curIdx   = 0;
let cardW    = 280;
let visibleN = 3.2;

function calcLayout() {
  const outerW = trackOuter.clientWidth - 56;
  if (window.innerWidth <= 640) {
    visibleN = 1.3;
    cardW = Math.round(outerW / 1.3);
  } else if (window.innerWidth <= 900) {
    visibleN = 2.2;
    cardW = Math.round((outerW - CARD_GAP) / 2.2);
  } else {
    visibleN = 3.2;
    cardW = Math.round((outerW - CARD_GAP * 2) / 3.2);
  }
  applyCardWidth();
}

function applyCardWidth() {
  track.querySelectorAll('.profile-card').forEach((c) => {
    c.style.flex = `0 0 ${cardW}px`;
    c.style.width = `${cardW}px`;
  });
  render();
}

function maxIdx() {
  return Math.max(0, graduates.length - Math.floor(visibleN));
}

function moveTo(idx) {
  curIdx = Math.max(0, Math.min(idx, maxIdx()));
  render();
}

function render() {
  const offset = curIdx * (cardW + CARD_GAP);
  track.style.transform = `translateX(-${offset}px)`;

  const max = maxIdx();
  const pct = max > 0 ? (curIdx / max) * 100 : 0;
  progressFill.style.width = `${pct}%`;

  const shownEnd = Math.min(curIdx + Math.floor(visibleN), graduates.length);
  progressLabel.textContent =
    `${String(curIdx + 1).padStart(2, '0')} – ${String(shownEnd).padStart(2, '0')} / ${String(graduates.length).padStart(2, '0')}`;

  prevBtn.disabled = curIdx === 0;
  nextBtn.disabled = curIdx >= max;
}

prevBtn.addEventListener('click', () => moveTo(curIdx - 1));
nextBtn.addEventListener('click', () => moveTo(curIdx + 1));
window.addEventListener('resize', calcLayout);

// 드래그 / 스와이프
let startX = 0;
let isDragging = false;
trackOuter.addEventListener('mousedown',  (e) => { startX = e.clientX; isDragging = true; });
trackOuter.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; isDragging = true; }, { passive: true });
trackOuter.addEventListener('mouseleave', () => { isDragging = false; });
const onDragEnd = (e) => {
  if (!isDragging) return;
  isDragging = false;
  const endX = e.clientX ?? e.changedTouches?.[0]?.clientX ?? startX;
  const diff = startX - endX;
  if (Math.abs(diff) > 50) moveTo(diff > 0 ? curIdx + 1 : curIdx - 1);
};
trackOuter.addEventListener('mouseup', onDragEnd);
trackOuter.addEventListener('touchend', onDragEnd, { passive: true });

calcLayout();

/* ── 모달 ────────────────────────────────────────────────────── */
const modalOverlay = document.getElementById('modalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');

function openModal(g) {
  document.getElementById('modalNum').textContent = g.id;
  document.getElementById('modalName').textContent = g.name;
  document.getElementById('modalInfo').textContent = `학번: ${g.studentId}  |  직군: ${g.role}`;
  safeImg(document.getElementById('modalImg'), g.profileImage, FALLBACK_AVATAR);
  document.getElementById('modalImg').alt = g.name;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

/* ── 스크롤 reveal 애니메이션 ────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ── 상단 메뉴 (모바일 햄버거) ───────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
menuToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
window.addEventListener('scroll', () => {
  document.getElementById('site-header').style.boxShadow =
    window.scrollY > 10 ? '0 2px 16px rgba(0,0,0,0.10)' : 'none';
});
