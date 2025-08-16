// js/footer.js
(async function initFooter() {
  const mount = document.getElementById('dn-footer-mount');
  if (!mount) return;
  const res = await fetch('footer.html');
  mount.innerHTML = await res.text();

  document.getElementById('year').textContent = new Date().getFullYear();

  const form = document.getElementById('newsletterForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    alert(`Thanks for subscribing, ${email}!`);
    form.reset();
  });
})();
