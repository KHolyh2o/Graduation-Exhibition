// 데이터는 진짜 프로젝트(../src/data)에서 그대로 가져옵니다.
import { PROJECT_TABS, getSubCategories } from '../../src/data/projectTabs.js';
import { projects } from '../../src/data/projects.js';
import { teamProjects } from '../../src/data/teamProjects.js';
import { graduateByStudentId } from '../../src/data/graduates.js';

const FALLBACK_IMAGE = '/sha_copy/images/no-image.svg';

// src/data 안 이미지 경로('/images/...')에 'sha_copy/images'(진짜 public/images로
// 연결된 심볼릭 링크)를 앞에 붙여줍니다.
function safeImg(el, src, fallback) {
  el.src = src ? `/sha_copy${src}` : fallback;
  el.onerror = () => { el.onerror = null; el.src = fallback; };
}

const getWorks = (tabId, subId) => {
  if (tabId === 'team') return teamProjects.filter((p) => p.group === subId);
  return projects.filter((p) => p.tab === tabId && p.role === subId);
};

const getTabTotal = (tabId) => {
  if (tabId === 'team') return teamProjects.length;
  return projects.filter((p) => p.tab === tabId).length;
};

const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('/embed/')) return url;
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/[?&]v=([^?&]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return url;
};

let activeTab = 'multimedia';

/* ── 탭 버튼 렌더링 ──────────────────────────────────────────── */
const tabInner = document.getElementById('tabInner');
const categoryBar = document.getElementById('category-bar');
const totalBadge = document.getElementById('totalBadge');

PROJECT_TABS.forEach((tab) => {
  const btn = document.createElement('button');
  btn.className = 'tab-btn';
  btn.id = `tab-${tab.id}`;
  btn.setAttribute('role', 'tab');
  btn.setAttribute('aria-controls', `panel-${tab.id}`);
  btn.textContent = tab.label;
  btn.addEventListener('click', () => switchTab(tab.id));
  tabInner.appendChild(btn);
});

function switchTab(id) {
  activeTab = id;
  render();
  categoryBar.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── 작품 카드 + 패널 렌더링 ─────────────────────────────────── */
const panelsContainer = document.getElementById('panelsContainer');

function workCardHtml(work, tab, sub) {
  const author = work.members ? work.teamName : (graduateByStudentId[work.studentId]?.name ?? '-');
  return `
    <div class="work-card" tabindex="0" role="button" aria-label="${work.title} 상세 보기">
      <div class="work-thumb" data-thumb></div>
      <div class="work-info">
        <p class="work-num">${tab.label} · ${sub.label}</p>
        <p class="work-name">${work.title}</p>
        <p class="work-author">${author}</p>
      </div>
    </div>
  `;
}

function render() {
  // 탭 버튼 active 상태
  PROJECT_TABS.forEach((tab) => {
    const btn = document.getElementById(`tab-${tab.id}`);
    const isActive = tab.id === activeTab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });

  totalBadge.textContent = `전체 ${getTabTotal(activeTab)}개 작품`;

  // 패널 (탭마다 하나, 이미 만들어져 있으면 재사용)
  panelsContainer.innerHTML = '';
  PROJECT_TABS.forEach((tab) => {
    const section = document.createElement('section');
    section.className = `cat-panel${tab.id === activeTab ? ' active' : ''}`;
    section.id = `panel-${tab.id}`;
    section.setAttribute('role', 'tabpanel');
    section.setAttribute('aria-labelledby', `tab-${tab.id}`);
    if (tab.id !== activeTab) { panelsContainer.appendChild(section); return; }

    getSubCategories(tab).forEach((sub) => {
      const works = getWorks(tab.id, sub.id);
      const group = document.createElement('div');
      group.className = 'work-group reveal';
      group.innerHTML = `
        <div class="sub-cat-strip">
          <span class="sub-cat-name">${sub.label}</span>
          <span class="sub-cat-count">${works.length}개</span>
        </div>
        <div class="work-grid">
          ${works.map((w) => workCardHtml(w, tab, sub)).join('')}
        </div>
      `;

      // 썸네일 채우기 (있으면 이미지, 없으면 플레이스홀더)
      const cards = group.querySelectorAll('.work-card');
      works.forEach((work, i) => {
        const thumb = cards[i].querySelector('[data-thumb]');
        if (work.thumbnail) {
          const img = document.createElement('img');
          img.alt = work.title;
          img.loading = 'lazy';
          safeImg(img, work.thumbnail, FALLBACK_IMAGE);
          thumb.appendChild(img);
        } else {
          thumb.innerHTML = `<span class="work-thumb-icon">${sub.icon}</span><span>작품 썸네일 이미지<br />(${sub.label})</span>`;
        }
        const open = () => openModal(work, tab, sub);
        cards[i].addEventListener('click', open);
        cards[i].addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
        });
      });

      section.appendChild(group);
    });

    panelsContainer.appendChild(section);
  });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

/* ── 모달 ────────────────────────────────────────────────────── */
const modalOverlay = document.getElementById('modalOverlay');
const modalCloseBtn = document.getElementById('modalCloseBtn');

function openModal(work, tab, sub) {
  const videoWrap = document.getElementById('modalVideoWrap');
  if (work.videoUrl) {
    videoWrap.innerHTML = `
      <div class="modal-video-ph">
        <iframe src="${toEmbedUrl(work.videoUrl)}" title="${work.title}" allowfullscreen loading="lazy"></iframe>
      </div>
    `;
  } else {
    videoWrap.innerHTML = `
      <div class="modal-video-ph">
        <div class="play-icon" aria-hidden="true"></div>
        <span>소개 영상 준비 중</span>
      </div>
    `;
  }

  const author = work.members ? work.teamName : (graduateByStudentId[work.studentId]?.name ?? '-');
  document.getElementById('modalBadge').textContent = `${tab.label} > ${sub.label}`;
  document.getElementById('modalWorkTitle').textContent = work.title;
  document.getElementById('modalAuthor').textContent = `${author} · 미디어콘텐츠학부`;
  document.getElementById('modalDesc').textContent = work.description;

  const proposalWrap = document.getElementById('modalProposalWrap');
  if (work.proposalImages?.length > 0) {
    proposalWrap.innerHTML = `
      <p class="modal-section-label">제안서 이미지</p>
      <div class="proposal-images">
        ${work.proposalImages.map((src, i) => `<img alt="제안서 ${i + 1}" data-proposal-src="${src}" />`).join('')}
      </div>
    `;
    proposalWrap.querySelectorAll('[data-proposal-src]').forEach((img) => {
      safeImg(img, img.dataset.proposalSrc, FALLBACK_IMAGE);
    });
  } else {
    proposalWrap.innerHTML = '';
  }

  const metaGrid = document.getElementById('modalMetaGrid');
  metaGrid.innerHTML = `
    <div class="modal-meta-item">
      <p class="m-label">카테고리</p>
      <p class="m-value">${tab.label}</p>
    </div>
    <div class="modal-meta-item">
      <p class="m-label">직군 / 그룹</p>
      <p class="m-value">${sub.label}</p>
    </div>
    <div class="modal-meta-item">
      <p class="m-label">이메일</p>
      <p class="m-value">${work.contact?.email ?? '-'}</p>
    </div>
    ${work.contact?.phone ? `
    <div class="modal-meta-item">
      <p class="m-label">전화번호</p>
      <p class="m-value">${work.contact.phone}</p>
    </div>` : ''}
  `;

  const membersWrap = document.getElementById('modalMembersWrap');
  if (work.members) {
    membersWrap.innerHTML = `
      <p class="modal-section-label">팀원</p>
      <ul class="modal-members">
        ${work.members.map((m) => `<li>${m.name} · ${m.role}</li>`).join('')}
      </ul>
    `;
  } else {
    membersWrap.innerHTML = '';
  }

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  document.getElementById('modalVideoWrap').innerHTML = '';
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
}, { threshold: 0.08 });

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

render();
