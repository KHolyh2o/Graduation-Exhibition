// 데이터는 진짜 프로젝트(../src/data)에서 그대로 가져옵니다.
import { professors } from '../../src/data/professors.js';

const FALLBACK_AVATAR = '/sha_copy/images/no-avatar.svg';

// src/data 안 이미지 경로('/images/...')에 'sha_copy/images'(진짜 public/images로
// 연결된 심볼릭 링크)를 앞에 붙여줍니다.
function safeImg(el, src, fallback) {
  el.src = src ? `/sha_copy${src}` : fallback;
  el.onerror = () => { el.onerror = null; el.src = fallback; };
}

/* ── 교수진 카드 렌더링 ──────────────────────────────────────── */
const profGrid = document.getElementById('profGrid');

professors.forEach((prof) => {
  const card = document.createElement('div');
  card.className = 'prof-card reveal';
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `${prof.name} 상세보기`);

  const img = document.createElement('img');
  img.className = 'prof-img';
  img.alt = prof.name;
  safeImg(img, prof.photo, FALLBACK_AVATAR);

  card.appendChild(img);
  card.insertAdjacentHTML('beforeend', `
    <p class="prof-name">${prof.name}</p>
    <p class="prof-subject">${prof.subjects[0]}</p>
  `);

  const open = () => openModal(prof);
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });

  profGrid.appendChild(card);
});

/* ── 모달 ────────────────────────────────────────────────────── */
const modalOverlay = document.getElementById('modalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');

function openModal(prof) {
  safeImg(document.getElementById('modalImg'), prof.photo, FALLBACK_AVATAR);
  document.getElementById('modalImg').alt = prof.name;
  document.getElementById('modalProfName').textContent = prof.name;
  document.getElementById('modalSubject').textContent = prof.subjects.join(' / ');
  document.getElementById('modalMessage').textContent = prof.message;

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
