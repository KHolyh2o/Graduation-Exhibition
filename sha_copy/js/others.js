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
