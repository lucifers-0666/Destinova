// js/header.js
(async function initHeader() {
  const mount = document.getElementById('dn-header-mount');
  if (!mount) return;
  const res = await fetch('header.html');
  mount.innerHTML = await res.text();

  const navbar = document.querySelector('.dn-navbar');
  const hamburger = document.querySelector('.dn-hamburger');
  const navLinks = document.querySelector('.dn-nav-links');

  // Transparent to solid on scroll
  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('solid');
    } else {
      navbar.classList.remove('solid');
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  // Mobile menu
  hamburger?.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  });

  // Active link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.dn-nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();
