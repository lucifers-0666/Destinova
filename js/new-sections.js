/* ═══════════════════════════════════════════════════════════════════════════════
   NEW SECTIONS INTERACTIVE FUNCTIONALITY
   ═══════════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {

  // ═══════════════════════════════════════════════════════════════════════════════
  // 1. LIVE DEAL TICKER - Duplicate content for seamless loop
  // ═══════════════════════════════════════════════════════════════════════════════

  const dealTicker = document.querySelector('.deal-ticker-content');
  if (dealTicker) {
    const dealItems = dealTicker.innerHTML;
    dealTicker.innerHTML = dealItems + dealItems; // Duplicate for seamless loop
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 2. TRIP INSPIRATION TABS
  // ═══════════════════════════════════════════════════════════════════════════════

  const inspirationTabs = document.querySelectorAll('.inspiration-tab');
  const inspirationPanels = document.querySelectorAll('.inspiration-panel');

  inspirationTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const category = this.getAttribute('data-category');

      // Remove active class from all tabs
      inspirationTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      // Add active class to clicked tab
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Hide all panels
      inspirationPanels.forEach(panel => {
        panel.classList.remove('active');
      });

      // Show selected panel
      const activePanel = document.querySelector(`[data-panel="${category}"]`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 3. PRICE ALERTS FORM
  // ═══════════════════════════════════════════════════════════════════════════════

  const priceAlertsForm = document.getElementById('priceAlertsForm');
  const alertsSuccess = document.querySelector('.price-alerts-success');

  if (priceAlertsForm) {
    priceAlertsForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = document.getElementById('alert-email');
      const email = emailInput.value;

      // Simulate API call
      setTimeout(() => {
        priceAlertsForm.style.display = 'none';
        alertsSuccess.style.display = 'flex';

        // Reset after 5 seconds
        setTimeout(() => {
          priceAlertsForm.style.display = 'flex';
          alertsSuccess.style.display = 'none';
          priceAlertsForm.reset();
        }, 5000);
      }, 500);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 4. FAQ ACCORDION
  // ═══════════════════════════════════════════════════════════════════════════════

  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.closest('.faq-item');
      const isActive = faqItem.classList.contains('active');

      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isActive) {
        faqItem.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 5. INSPIRATION CARDS - Explore Flights Button
  // ═══════════════════════════════════════════════════════════════════════════════

  const inspirationCtas = document.querySelectorAll('.inspiration-cta');

  inspirationCtas.forEach(cta => {
    cta.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const card = this.closest('.inspiration-card');
      const destination = card.querySelector('h3').textContent;

      // Redirect to booking page with destination pre-filled
      window.location.href = `booking.html?destination=${encodeURIComponent(destination)}`;
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 6. ANIMATE TRUST STATS ON SCROLL
  // ═══════════════════════════════════════════════════════════════════════════════

  const trustStats = document.querySelectorAll('.trust-stat strong');
  let hasAnimated = false;

  function animateStats() {
    if (hasAnimated) return;

    const trustBar = document.querySelector('.trust-indicators-bar');
    const rect = trustBar.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      hasAnimated = true;

      trustStats.forEach(stat => {
        const text = stat.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/\d/g, '');

        let current = 0;
        const increment = number / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const counter = setInterval(() => {
          current += increment;
          if (current >= number) {
            stat.textContent = number + suffix;
            clearInterval(counter);
          } else {
            stat.textContent = Math.floor(current) + suffix;
          }
        }, stepTime);
      });
    }
  }

  window.addEventListener('scroll', animateStats);
  animateStats(); // Check on load

  // ═══════════════════════════════════════════════════════════════════════════════
  // 7. MOBILE APP QR CODE TRACKING
  // ═══════════════════════════════════════════════════════════════════════════════

  const qrCode = document.querySelector('.qr-code');
  if (qrCode) {
    qrCode.addEventListener('click', function() {
      console.log('QR Code clicked - Track mobile app download intent');
      // Add analytics tracking here
    });
  }

  const appBadges = document.querySelectorAll('.app-badge');
  appBadges.forEach(badge => {
    badge.addEventListener('click', function(e) {
      const store = this.classList.contains('app-store') ? 'App Store' : 'Google Play';
      console.log(`${store} badge clicked - Track mobile app download`);
      // Add analytics tracking here
    });
  });
});
