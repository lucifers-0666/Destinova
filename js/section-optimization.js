/* ═══════════════════════════════════════════════════════════════════════════════
   PHASE 3: SECTION POSITIONING & LAYOUT OPTIMIZATION - JAVASCRIPT
   Handles scroll animations, counters, and dynamic behaviors
   ═══════════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {

  // ═══════════════════════════════════════════════════════════════════════════════
  // 1. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');

        // Animate grid items
        const grid = entry.target.querySelector('.destinations-grid, .inspiration-grid, .features-grid, .blog-articles-grid');
        if (grid) {
          grid.classList.add('animate');
        }
      }
    });
  }, observerOptions);

  // Observe all major sections
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 2. COUNTER ANIMATIONS FOR STATS
  // ═══════════════════════════════════════════════════════════════════════════════

  function animateCounter(element, target, duration = 2000, decimals = 0, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      if (decimals > 0) {
        element.textContent = current.toFixed(decimals) + suffix;
      } else {
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      element.classList.add('counting');
    }, 16);
  }

  // Observe stat numbers
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        const target = parseInt(entry.target.dataset.target);
        const decimals = parseInt(entry.target.dataset.decimals || 0);
        const suffix = entry.target.dataset.suffix || '';

        animateCounter(entry.target, target, 2000, decimals, suffix);
        entry.target.dataset.animated = 'true';
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  statNumbers.forEach(stat => {
    statObserver.observe(stat);
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 3. LAZY LOADING IMAGES
  // ═══════════════════════════════════════════════════════════════════════════════

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        if (img.dataset.src) {
          img.src = img.dataset.src;
        }

        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }

        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });

        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '50px' });

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 4. SMOOTH SCROLL TO SECTIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.getElementById('header-main')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 5. PROGRESSIVE SECTION LOADING
  // ═══════════════════════════════════════════════════════════════════════════════

  const loadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-loaded');
        loadObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  sections.forEach(section => {
    section.classList.add('section-loading');
    loadObserver.observe(section);
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 6. SCROLL PROGRESS INDICATOR
  // ═══════════════════════════════════════════════════════════════════════════════

  function updateScrollProgress() {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    let progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress-bar';
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: ${scrolled}%;
        height: 3px;
        background: linear-gradient(90deg, #1a4d2e 0%, #4ade80 100%);
        z-index: 9999;
        transition: width 0.1s ease;
      `;
      document.body.appendChild(progressBar);
    } else {
      progressBar.style.width = scrolled + '%';
    }
  }

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateScrollProgress, 10);
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 7. SECTION VISIBILITY TRACKING (ANALYTICS)
  // ═══════════════════════════════════════════════════════════════════════════════

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const sectionName = entry.target.id || entry.target.className;
        console.log(`Section viewed: ${sectionName}`);

        // Send to analytics (Google Analytics, etc.)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'section_view', {
            'section_name': sectionName,
            'scroll_depth': Math.round((window.scrollY / document.documentElement.scrollHeight) * 100)
          });
        }
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => {
    if (section.id) {
      visibilityObserver.observe(section);
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // 8. PERFORMANCE MONITORING
  // ═══════════════════════════════════════════════════════════════════════════════

  if ('PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 9. RESPONSIVE BEHAVIOR ADJUSTMENTS
  // ═══════════════════════════════════════════════════════════════════════════════

  function handleResponsiveAdjustments() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Adjust animation delays for mobile
    if (isMobile) {
      document.documentElement.style.setProperty('--animation-delay-base', '0.05s');
    } else {
      document.documentElement.style.setProperty('--animation-delay-base', '0.1s');
    }

    // Disable expensive animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.body.classList.add('reduced-animations');
    }
  }

  handleResponsiveAdjustments();
  window.addEventListener('resize', debounce(handleResponsiveAdjustments, 250));

  // ═══════════════════════════════════════════════════════════════════════════════
  // 10. UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 11. INITIALIZE AOS (Animate On Scroll) IF AVAILABLE
  // ═══════════════════════════════════════════════════════════════════════════════

  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      easing: 'ease-out',
      once: true,
      offset: 100,
      delay: 0,
      disable: function() {
        return window.innerWidth < 768 && navigator.hardwareConcurrency < 4;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 12. SECTION ORDER VALIDATION (DEVELOPMENT ONLY)
  // ═══════════════════════════════════════════════════════════════════════════════

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const expectedOrder = [
      'hero-section',
      'trust-indicators-bar',
      'live-deal-ticker',
      'premium-features-section',
      'popular-destinations-section',
      'trip-inspiration-section',
      'price-alerts-section',
      'why-choose-us-section',
      'booking-process-section',
      'payment-security-section',
      'trust-indicators-section',
      'travel-classes-3d-section',
      'stats-section',
      'airline-partners-section',
      'mobile-app-section',
      'faq-section',
      'travel-blog-section'
    ];

    const actualSections = Array.from(document.querySelectorAll('main > section, main > .hero-section'));
    console.group('📊 Section Order Validation');
    console.log('Expected sections:', expectedOrder.length);
    console.log('Actual sections:', actualSections.length);

    actualSections.forEach((section, index) => {
      const className = section.className.split(' ')[0];
      console.log(`${index + 1}. ${className}`);
    });
    console.groupEnd();
  }

});
