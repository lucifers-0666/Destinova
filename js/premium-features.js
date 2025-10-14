/* ═══════════════════════════════════════════════════════════════════════════════
   PREMIUM FEATURES SECTION - INTERACTIVE FUNCTIONALITY
   Destinova Flight Booking
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════════
  // 1. SCROLL ANIMATION OBSERVER
  // ═══════════════════════════════════════════════════════════════════════════════

  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: stop observing after animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe header elements
    const headerElements = document.querySelectorAll(
      '.features-eyebrow, .features-main-heading, .features-subheading'
    );
    headerElements.forEach(el => observer.observe(el));

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => observer.observe(card));
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 2. COUNTER ANIMATION FOR STAT BADGES
  // ═══════════════════════════════════════════════════════════════════════════════

  function animateCounter(element, target, suffix = '', duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      // Format based on suffix
      if (suffix === 'Cr+') {
        element.textContent = `₹${current.toFixed(0)}Cr+ Saved`;
      } else if (suffix === '%') {
        element.textContent = `${Math.round(current)}% Satisfaction`;
      } else if (suffix === 'Sec') {
        element.textContent = `<${Math.round(current)} Sec Avg`;
      } else if (suffix === 'Safe') {
        element.textContent = `${Math.round(current)}% Safe`;
      }
    }, 16);
  }

  function initCounterAnimations() {
    const counterObserverOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const badge = entry.target;
          badge.dataset.animated = 'true';
          
          // Determine which counter to animate based on badge text
          const badgeText = badge.textContent;
          
          if (badgeText.includes('Saved')) {
            animateCounter(badge, 2, 'Cr+', 2000);
          } else if (badgeText.includes('Satisfaction')) {
            animateCounter(badge, 98, '%', 1800);
          } else if (badgeText.includes('Sec')) {
            animateCounter(badge, 30, 'Sec', 1500);
          } else if (badgeText.includes('Safe')) {
            animateCounter(badge, 100, 'Safe', 2200);
          }
          
          counterObserver.unobserve(entry.target);
        }
      });
    }, counterObserverOptions);

    const statBadges = document.querySelectorAll('.feature-stat-badge');
    statBadges.forEach(badge => counterObserver.observe(badge));
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 3. ENHANCED HOVER EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════════

  function initHoverEffects() {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
      // Track mouse position for subtle tilt effect (optional enhancement)
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        // Apply subtle 3D tilt (can be disabled if too much)
        // card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        // card.style.transform = '';
      });

      // Add ripple effect on click
      card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Add ripple effect styles dynamically
  function injectRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .feature-card {
        position: relative;
        overflow: hidden;
      }
      
      .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(229, 203, 175, 0.4);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      
      @keyframes ripple-animation {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 4. ICON PRELOADING
  // ═══════════════════════════════════════════════════════════════════════════════

  function preloadLucideIcons() {
    // Lucide icons are already inline SVGs, no preloading needed
    // But we can ensure they're properly loaded
    const icons = document.querySelectorAll('.feature-icon');
    icons.forEach(icon => {
      // Add loaded class for potential CSS transitions
      icon.classList.add('icon-loaded');
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 5. KEYBOARD NAVIGATION ENHANCEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  function initKeyboardNavigation() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
      // Make cards keyboard focusable
      card.setAttribute('tabindex', '0');
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextCard = featureCards[index + 1] || featureCards[0];
          nextCard.focus();
        }
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevCard = featureCards[index - 1] || featureCards[featureCards.length - 1];
          prevCard.focus();
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 6. PERFORMANCE MONITORING
  // ═══════════════════════════════════════════════════════════════════════════════

  function monitorPerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.includes('premium-features')) {
            console.log('Premium Features Section Load Time:', entry.duration + 'ms');
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure'] });
      
      // Mark when section is fully interactive
      performance.mark('premium-features-start');
      
      window.addEventListener('load', () => {
        performance.mark('premium-features-end');
        performance.measure(
          'premium-features-interactive',
          'premium-features-start',
          'premium-features-end'
        );
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 7. LAZY LOADING ENHANCEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  function initLazyLoading() {
    // If section is far down the page, delay initialization until needed
    const section = document.querySelector('.premium-features-section');
    
    if (!section) return;
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Section is in viewport, initialize all features
          initScrollAnimations();
          initCounterAnimations();
          initHoverEffects();
          initKeyboardNavigation();
          preloadLucideIcons();
          
          sectionObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '200px' // Start loading 200px before section enters viewport
    });
    
    sectionObserver.observe(section);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 8. ACCESSIBILITY ENHANCEMENTS
  // ═══════════════════════════════════════════════════════════════════════════════

  function enhanceAccessibility() {
    // Add ARIA live region for counter updates
    const statBadges = document.querySelectorAll('.feature-stat-badge');
    statBadges.forEach(badge => {
      badge.setAttribute('aria-live', 'polite');
      badge.setAttribute('aria-atomic', 'true');
    });

    // Add descriptive labels to icon containers
    const iconContainers = document.querySelectorAll('.feature-icon-container');
    iconContainers.forEach((container, index) => {
      const featureTitles = [
        'Best Price Guarantee',
        '24/7 Expert Support',
        'Instant Booking',
        'Bank-Level Security'
      ];
      container.setAttribute('aria-label', featureTitles[index] || 'Feature icon');
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 9. ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════════════════════

  function initErrorHandling() {
    window.addEventListener('error', (e) => {
      if (e.filename && e.filename.includes('premium-features')) {
        console.error('Premium Features Error:', e.message);
        // Fallback: ensure content is still visible even if JS fails
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 10. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  function init() {
    // Check if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Check if section exists
    const section = document.querySelector('.premium-features-section');
    if (!section) {
      console.warn('Premium Features Section not found on this page');
      return;
    }

    // Initialize all features
    try {
      injectRippleStyles();
      enhanceAccessibility();
      initErrorHandling();
      monitorPerformance();
      
      // Use lazy loading for better performance
      if ('IntersectionObserver' in window) {
        initLazyLoading();
      } else {
        // Fallback for older browsers
        initScrollAnimations();
        initCounterAnimations();
        initHoverEffects();
        initKeyboardNavigation();
        preloadLucideIcons();
      }
      
      console.log('✅ Premium Features Section initialized successfully');
    } catch (error) {
      console.error('Error initializing Premium Features Section:', error);
      // Ensure content is visible even if JS fails
      const allElements = document.querySelectorAll('.feature-card, .features-eyebrow, .features-main-heading, .features-subheading');
      allElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  }

  // Start initialization
  init();

  // ═══════════════════════════════════════════════════════════════════════════════
  // 11. EXPOSE PUBLIC API (Optional)
  // ═══════════════════════════════════════════════════════════════════════════════

  window.PremiumFeatures = {
    reinit: init,
    version: '1.0.0'
  };

})();
