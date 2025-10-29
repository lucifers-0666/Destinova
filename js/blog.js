/* ===============================================================
   Destinova Blog — Fixed Design Interactions
   - Header shrink + sticky bar offset + reading progress
   - Reveal observer + lazy images
   - Parallax micro-zoom
   - Filters (chips + sticky bar)
   - Favorites (localStorage)
   - Modal article with comments + copy link
   - Fare-hold countdown (demo; swap with server timestamp)
   - Airline policy matrix (responsive)
=============================================================== */
(() => {
  "use strict";
  const qs  = (s, p=document) => p.querySelector(s);
  const qsa = (s, p=document) => [...p.querySelectorAll(s)];

  /* Header + progress + sticky */
  function initHeaderAndProgress() {
    const header = qs('#siteHeader');
    const stickyBar = qs('#stickyBar');
    const progress = qs('#progressBar');
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle('shrink', y > 80);
      stickyBar.classList.toggle('visible', y > 260);
      const h = document.documentElement;
      const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
      progress.style.width = `${Math.max(0, Math.min(1, pct)) * 100}%`;
    };
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  /* Reveal */
  function initReveal() {
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, {threshold:.15, rootMargin:'0px 0px -60px 0px'});
    qsa('.reveal').forEach(el=>obs.observe(el));
  }

  /* Lazy images */
  function initLazy() {
    if (!('IntersectionObserver' in window)) {
      qsa('img[data-src]').forEach(img => { img.src = img.dataset.src; });
      return;
    }
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const img = e.target; img.src = img.dataset.src; img.removeAttribute('data-src'); io.unobserve(img);
        }
      });
    },{rootMargin:'200px 0px'});
    qsa('img[data-src]').forEach(img=>io.observe(img));
  }

  /* Parallax */
  function initParallax() {
    qsa('.parallax-card').forEach(card=>{
      const media = qs('img', card);
      if(!media) return;
      card.addEventListener('mousemove', (e)=>{
        const r = card.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width/2)) / (r.width/2);
        const y = (e.clientY - (r.top  + r.height/2)) / (r.height/2);
        media.style.transform = `scale(1.12) translate(${x*6}px, ${y*6}px)`;
      });
      card.addEventListener('mouseleave', ()=>{ media.style.transform = ''; });
    });
  }

  /* Filters */
  function initFilters() {
    const chips = qsa('.chip');
    const gridCards = qsa('.post-card');
    const input = qs('#searchPosts');
    const theme = qs('#themeSelect');
    const clear = qs('#clearFilters');

    function apply() {
      const active = qs('.chip.active')?.dataset.chip || 'all';
      const term = (input?.value || '').trim().toLowerCase();
      const themeVal = theme?.value || 'all';
      gridCards.forEach(c=>{
        const tags = (c.dataset.tags || '');
        const matchChip  = active==='all' || tags.includes(active);
        const matchTheme = themeVal==='all' || tags.includes(themeVal);
        const text = (qs('.post-title', c)?.textContent + ' ' + qs('.post-excerpt', c)?.textContent).toLowerCase();
        const matchTerm  = !term || text.includes(term);
        c.style.display = (matchChip && matchTheme && matchTerm) ? '' : 'none';
      });
    }

    chips.forEach(ch=>{
      ch.addEventListener('click', ()=>{
        chips.forEach(c=>c.classList.remove('active'));
        ch.classList.add('active');
        apply();
      });
    });

    const debounce = (fn, d=250)=>{let t;return (...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),d)}};
    input?.addEventListener('input', debounce(apply, 180));
    theme?.addEventListener('change', apply);
    clear?.addEventListener('click', ()=>{
      if(!input || !theme) return;
      input.value=''; theme.value='all';
      chips.forEach(c=>c.classList.remove('active'));
      qs('.chip[data-chip="all"]').classList.add('active');
      apply();
    });

    apply();
  }

  /* Favorites */
  function initFavorites() {
    const KEY = 'destinova_blog_favs_v1';
    const favs = new Set(JSON.parse(localStorage.getItem(KEY)||'[]'));
    const sync = (btn, on) => btn.innerHTML = on ? '<i class="fas fa-heart"></i> Saved' : '<i class="far fa-heart"></i> Save';
    qsa('.favorite-btn').forEach(btn=>{
      const id = btn.dataset.id;
      if (favs.has(id)) sync(btn, true);
      btn.addEventListener('click', ()=>{
        const on = !favs.has(id);
        on ? favs.add(id) : favs.delete(id);
        localStorage.setItem(KEY, JSON.stringify([...favs]));
        sync(btn, on);
      });
    });
  }

  /* Article data */
  const ARTICLES = {
    'post-flight-expiration': {
      title: 'Lock the Deal: Holds vs. PNR TTL vs. Ticket Validity',
      hero: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=1400',
      read: 8,
      content:
        'Fare holds freeze today’s price for a short window (often 20 minutes to 24 hours). PNR TTL is the airline or GDS deadline for an unpaid reservation to auto‑cancel; whichever window is shorter—hold or TTL—wins. Ticket validity begins after payment and defines how long the e‑ticket remains usable, commonly up to 12 months on standard brands. Always check (1) hold timer, (2) PNR TTL on the booking, and (3) check‑in/boarding cutoffs.'
    },
    'post-hold-vs-ttl': {
      title: 'Hold vs. PNR TTL: What Expires First?',
      hero: 'https://images.unsplash.com/photo-1497957569023-cba04537bb9b?w=1400',
      read: 5,
      content:
        'Holds protect price; TTL protects seats. A 24h hold with a 3h TTL will purge at 3h unless paid. Track both timers and ticket before the earlier one ends to avoid re‑pricing.'
    },
    'post-ticket-validity': {
      title: 'Ticket Validity: 1‑Year Myth and the Real Rules',
      hero: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1400',
      read: 6,
      content:
        'Many IATA‑based fares allow travel up to 12 months from first coupon, but promotional brands can shorten that. Change penalties and blackout windows may restrict practical use—always check the brand sheet.'
    }
  };

  /* Modal */
  function initArticleModal() {
    const modal = qs('#articleModal');
    const openers = qsa('.open-article');
    const close = qs('#closeArticle');
    const hero = qs('#modalHero');
    const title = qs('#modalTitle');
    const text = qs('#modalContent');
    const read = qs('#modalReadTime');
    const favModal = qs('#favModal');
    const copyBtn = qs('#copyLink');
    const commentForm = qs('#commentForm');
    const commentList = qs('#commentList');

    const KEY_COMMENTS = 'destinova_blog_comments_v1';
    const loadC = (id) => JSON.parse(localStorage.getItem(KEY_COMMENTS) || '{}')[id] || [];
    const saveC = (id, arr) => { const all = JSON.parse(localStorage.getItem(KEY_COMMENTS) || '{}'); all[id] = arr; localStorage.setItem(KEY_COMMENTS, JSON.stringify(all)); };
    const render = (id) => { const arr = loadC(id); commentList.innerHTML = arr.map(c => `<div class="comment-item"><strong>${c.name}</strong><p>${c.text}</p></div>`).join(''); };

    let currentId = null;
    openers.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.dataset.id; const a = ARTICLES[id]; if(!a) return;
        currentId = id; hero.src = a.hero; title.textContent = a.title; text.textContent = a.content; read.textContent = a.read;
        render(currentId); modal.classList.add('active'); document.body.style.overflow='hidden';
      });
    });
    close.addEventListener('click', ()=>{ modal.classList.remove('active'); document.body.style.overflow=''; });

    copyBtn.addEventListener('click', async ()=>{
      if(!currentId) return;
      const link = location.origin + location.pathname + `#${currentId}`;
      await navigator.clipboard.writeText(link);
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied';
      setTimeout(()=>copyBtn.innerHTML='<i class="fas fa-link"></i> Copy Link', 1200);
    });

    favModal.addEventListener('click', ()=>{ favModal.innerHTML = '<i class="fas fa-heart"></i> Saved'; });

    commentForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = qs('#commentName').value.trim();
      const content = qs('#commentText').value.trim();
      if(!name || !content || !currentId) return;
      const arr = loadC(currentId); arr.unshift({name, text: content}); saveC(currentId, arr); render(currentId); commentForm.reset();
    });

    // Deep link
    if (location.hash && ARTICLES[location.hash.slice(1)]) {
      const id = location.hash.slice(1); const a = ARTICLES[id];
      currentId = id; hero.src = a.hero; title.textContent = a.title; text.textContent = a.content; read.textContent = a.read;
      render(currentId); modal.classList.add('active'); document.body.style.overflow='hidden';
    }
  }

  /* Newsletter */
  function initNewsletter() {
    const form = qs('#newsletterForm'); const success = qs('#newsletterSuccess'); if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const btn = qs('button', form); const label = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = '<span class="btn-shine"></span><i class="fas fa-spinner fa-spin"></i> Subscribing';
      setTimeout(()=>{ btn.disabled=false; btn.innerHTML=label; success.style.display='block'; setTimeout(()=>success.style.display='none', 4000); form.reset(); }, 1200);
    });
  }

  /* Overlay search */
  function initSearchOverlay() {
    const open = qs('#openSearch'); const overlay = qs('#searchOverlay'); const close = qs('#closeSearch');
    const field = qs('#overlaySearchInput'); const results = qs('#searchResults');

    const index = qsa('.post-card, .feature-card').map(c => ({
      id: qs('.open-article', c)?.dataset.id || 'post-flight-expiration',
      title: (qs('.post-title', c) || qs('.feature-title', c)).textContent,
      excerpt: (qs('.post-excerpt', c) || qs('.feature-text', c)).textContent
    }));

    const render = (term='')=>{
      const t = term.toLowerCase();
      const hits = index.filter(i => !t || i.title.toLowerCase().includes(t) || i.excerpt.toLowerCase().includes(t));
      results.innerHTML = hits.map(h => `<div class="result-item"><strong>${h.title}</strong><p>${h.excerpt}</p></div>`).join('') || '<div class="result-item">No matches found.</div>';
    };

    open?.addEventListener('click', ()=>{ overlay.classList.add('active'); field.focus(); render(); });
    close?.addEventListener('click', ()=> overlay.classList.remove('active'));
    field?.addEventListener('input', (e)=> render(e.target.value));
  }

  /* Demo hold countdown (replace with server timestamp if available) */
  function initExpiryCountdown() {
    const H = qs('#expH'), M = qs('#expM'), S = qs('#expS'); if(!H||!M||!S) return;
    const stored = localStorage.getItem('destinova_hold_until');
    const end = stored ? +stored : (Date.now() + 24*60*60*1000);
    if(!stored) localStorage.setItem('destinova_hold_until', String(end));

    const tick = () => {
      const d = end - Date.now();
      if (d <= 0) { H.textContent='00'; M.textContent='00'; S.textContent='00'; clearInterval(tmr); return; }
      const h = Math.floor(d/3_600_000);
      const m = Math.floor((d%3_600_000)/60_000);
      const s = Math.floor((d%60_000)/1_000);
      H.textContent = String(h).padStart(2,'0');
      M.textContent = String(m).padStart(2,'0');
      S.textContent = String(s).padStart(2,'0');
    };
    tick();
    const tmr = setInterval(tick, 1000);
  }

  /* Airline matrix (responsive) */
  function initPolicyMatrix() {
    const body = qs('#policyBody'); if(!body) return;
    const airlines = [
      { name:'IndiGo', region:'india', hold:'No (limited via OTAs)', ttl:'30–60 min', checkin:'60–75 min / 120–180 min', note:'Tighter TTL on promos' },
      { name:'Air India', region:'india', hold:'Up to 24h (fare dependent)', ttl:'2–24 h', checkin:'60–75 min / 180 min', note:'Brand variations apply' },
      { name:'Vistara', region:'india', hold:'6–24 h (limited)', ttl:'2–24 h', checkin:'60–75 min / 180 min', note:'Holds vary by brand' },
      { name:'Qatar Airways', region:'me', hold:'24–72 h (fee/route)', ttl:'4–24 h', checkin:'90 min / 180 min', note:'Golden brands differ' },
      { name:'Emirates', region:'me', hold:'24–72 h (fee/route)', ttl:'4–24 h', checkin:'60–90 min / 180 min', note:'“Lock my fare” option' },
      { name:'Lufthansa', region:'eu', hold:'Up to 48 h (brand/fee)', ttl:'2–24 h', checkin:'60–90 min / 180 min', note:'Light brand TTL short' },
      { name:'Singapore Airlines', region:'apac', hold:'Up to 72 h (fee/brand)', ttl:'4–24 h', checkin:'60–90 min / 180 min', note:'Holds common on long‑haul' }
    ];

    const rowHTML = a => `
      <div class="policy-row" role="row">
        <div class="policy-airline" role="cell"><i class="fas fa-plane-departure"></i> ${a.name}</div>
        <div role="cell"><span class="badge-soft">${a.hold}</span></div>
        <div role="cell"><span class="badge-soft">${a.ttl}</span></div>
        <div role="cell"><span class="badge-soft">${a.checkin}</span></div>
        <div role="cell" class="policy-note-cell">${a.note}</div>
      </div>
    `;

    const render = (term='', region='all')=>{
      const t = term.toLowerCase();
      body.innerHTML = airlines
        .filter(a => (region==='all' || a.region===region) && (a.name.toLowerCase().includes(t)))
        .map(rowHTML).join('');
      if(!body.innerHTML) body.innerHTML = `<div class="policy-row"><div class="policy-airline">No results</div><div></div><div></div><div></div><div></div></div>`;
    };

    const search = qs('#airlineSearch');
    const region = qs('#regionFilter');
    const debounce = (fn, d=250)=>{let t;return (...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),d)}};

    search?.addEventListener('input', debounce(()=>render(search.value, region.value), 200));
    region?.addEventListener('change', ()=>render(search?.value||'', region.value));

    render();
  }

  /* Boot */
  initHeaderAndProgress();
  initReveal();
  initLazy();
  initParallax();
  initFilters();
  initFavorites();
  initArticleModal();
  initNewsletter();
  initExpiryCountdown();
  initPolicyMatrix();
  initSearchOverlay();
})();
