// js/index.js
(function () {
  // Reveal animations
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Auto sliders
  document.querySelectorAll('.slider').forEach(slider => {
    const imgs = Array.from(slider.querySelectorAll('img'));
    let idx = 0;
    imgs.forEach((img,i)=> img.style.opacity = i===0 ? '1':'0');
    setInterval(() => {
      imgs[idx].style.opacity = '0';
      idx = (idx + 1) % imgs.length;
      imgs[idx].style.opacity = '1';
    }, 3000);
  });

  // Autocomplete (demo)
  const cities = ['Delhi (DEL)','Mumbai (BOM)','Bengaluru (BLR)','Hyderabad (HYD)','Chennai (MAA)','Kolkata (CCU)','Goa (GOI)','Dubai (DXB)','Bangkok (BKK)','London (LHR)'];
  function attachAutocomplete(inputId, sugId) {
    const input = document.getElementById(inputId);
    const box = document.getElementById(sugId);
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      box.innerHTML = '';
      if (!q) return;
      cities.filter(c => c.toLowerCase().includes(q)).slice(0,5).forEach(c => {
        const div = document.createElement('div');
        div.textContent = c;
        div.tabIndex = 0;
        div.addEventListener('click', () => { input.value = c; box.innerHTML=''; });
        box.appendChild(div);
      });
    });
    document.addEventListener('click', (e) => { if (!box.contains(e.target) && e.target!==input) box.innerHTML=''; });
  }
  attachAutocomplete('from','fromSug');
  attachAutocomplete('to','toSug');

  // Passenger counters
  const counts = { adult: 1, child: 0 };
  document.getElementById('passengers').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const { type, op } = btn.dataset;
    if (!type || !op) return;
    counts[type] = Math.max( type === 'adult' ? 1 : 0, counts[type] + (op === '+' ? 1 : -1) );
    document.getElementById('adultCount').textContent = counts.adult;
    document.getElementById('childCount').textContent = counts.child;
  });

  // Search submit -> navigate to results.html with params
  const form = document.getElementById('flightForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: document.getElementById('from').value.trim(),
      to: document.getElementById('to').value.trim(),
      depart: document.getElementById('depart').value,
      ret: document.getElementById('return').value,
      adults: counts.adult,
      children: counts.child
    });
    location.href = `results.html?${params.toString()}`;
  });
})();
