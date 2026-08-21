// 이 페이지는 데이터가 필요 없어서 src/data를 가져오지 않습니다.

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
