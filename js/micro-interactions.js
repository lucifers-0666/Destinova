/**
 * ═══════════════════════════════════════════════════════════════
 * DESTINOVA - PREMIUM MICRO-INTERACTIONS JAVASCRIPT
 * ═══════════════════════════════════════════════════════════════
 * 
 * Purpose: Add interactive behaviors for premium UI elements
 * Features: Cursor tracking, scroll progress, animations, ripples,
 *           parallax, counters, toasts, confetti, form validation
 * 
 * Performance: Throttled, debounced, IntersectionObserver
 * Accessibility: Keyboard support, reduced motion, ARIA
 * ═══════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  // Throttle function for performance
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(this, args);
      }
    };
  }

  // Debounce function for inputs
  function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // Check if reduced motion is preferred
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Check if touch device
  function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
  }

  // ═══════════════════════════════════════════════════════════════
  // 1. CUSTOM CURSOR (Desktop Only)
  // ═══════════════════════════════════════════════════════════════

  function initCustomCursor() {
    if (isTouchDevice()) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth cursor follow
    function animateCursor() {
      const diffX = mouseX - cursorX;
      const diffY = mouseY - cursorY;
      
      cursorX += diffX * 0.15;
      cursorY += diffY * 0.15;
      
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover class on interactive elements
    const interactiveElements = 'a, button, .btn, input, textarea, select, [role="button"]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches(interactiveElements) || e.target.closest(interactiveElements)) {
        cursor.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.matches(interactiveElements) || e.target.closest(interactiveElements)) {
        cursor.classList.remove('hover');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. SCROLL PROGRESS INDICATOR
  // ═══════════════════════════════════════════════════════════════

  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);

    // Create section markers
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section, index) => {
      const marker = document.createElement('div');
      marker.className = 'scroll-progress-marker';
      marker.dataset.section = section.getAttribute('id').replace(/-/g, ' ');
      marker.dataset.target = section.id;
      progressBar.appendChild(marker);

      // Position marker based on section position
      const updateMarkerPosition = () => {
        const sectionTop = section.offsetTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const position = (sectionTop / docHeight) * 100;
        marker.style.left = position + '%';
      };
      updateMarkerPosition();
      window.addEventListener('resize', throttle(updateMarkerPosition, 200));

      // Click to scroll to section
      marker.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Update progress on scroll
    const updateProgress = throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      progressBar.style.transform = `scaleX(${progress})`;
    }, 100);

    window.addEventListener('scroll', updateProgress);
    updateProgress();
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. SECTION ENTRANCE ANIMATIONS
  // ═══════════════════════════════════════════════════════════════

  function initScrollAnimations() {
    if (prefersReducedMotion()) return;

    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation to save resources
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.animate-on-scroll, .stagger-children').forEach(el => {
      observer.observe(el);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 4. BUTTON RIPPLE EFFECT
  // ═══════════════════════════════════════════════════════════════

  function initButtonRipple() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.btn-ripple');
      if (!button) return;

      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple-effect';

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      button.appendChild(ripple);

      // Remove after animation
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 5. MAGNETIC BUTTONS (Desktop Only)
  // ═══════════════════════════════════════════════════════════════

  function initMagneticButtons() {
    if (isTouchDevice()) return;

    const buttons = document.querySelectorAll('.btn-magnetic');

    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Move button slightly toward cursor
        const moveX = x * 0.15;
        const moveY = y * 0.15;

        button.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. CARD PARALLAX EFFECT
  // ═══════════════════════════════════════════════════════════════

  function initCardParallax() {
    if (isTouchDevice() || prefersReducedMotion()) return;

    const cards = document.querySelectorAll('.card-parallax');

    cards.forEach(card => {
      const image = card.querySelector('.card-parallax__image');
      if (!image) return;

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Move image opposite to cursor
        const moveX = -x * 20;
        const moveY = -y * 20;

        image.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
      });

      card.addEventListener('mouseleave', () => {
        image.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. BOOKMARK/WISHLIST ANIMATION
  // ═══════════════════════════════════════════════════════════════

  function initBookmarkAnimation() {
    document.addEventListener('click', (e) => {
      const bookmark = e.target.closest('.card-bookmark');
      if (!bookmark) return;

      bookmark.classList.toggle('active');

      if (bookmark.classList.contains('active')) {
        // Create heart particles
        for (let i = 0; i < 4; i++) {
          const particle = document.createElement('span');
          particle.className = 'heart-particle';
          particle.textContent = '♥';
          particle.style.left = Math.random() * 40 - 20 + 'px';
          particle.style.animationDelay = i * 0.1 + 's';
          bookmark.style.position = 'relative';
          bookmark.appendChild(particle);

          particle.addEventListener('animationend', () => {
            particle.remove();
          });
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 8. FORM FLOATING LABELS
  // ═══════════════════════════════════════════════════════════════

  function initFloatingLabels() {
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
      const input = group.querySelector('.form-input');
      if (!input) return;

      // Check on page load
      if (input.value) {
        input.classList.add('has-value');
      }

      input.addEventListener('blur', () => {
        if (input.value) {
          input.classList.add('has-value');
        } else {
          input.classList.remove('has-value');
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 9. NUMBER COUNTER ANIMATION
  // ═══════════════════════════════════════════════════════════════

  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  function initNumberCounters() {
    const counters = document.querySelectorAll('.counter-number');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target || entry.target.textContent.replace(/,/g, ''));
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  // ═══════════════════════════════════════════════════════════════
  // 10. TOAST NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════════

  let toastContainer;

  function createToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function showToast(message, type = 'info', duration = 5000) {
    const container = createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    const icons = {
      success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2a7d4a" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
      error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D93025" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
      info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d5e33" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
      warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9500" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">${message}</div>
      <button class="toast-close" aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    // Auto-dismiss
    setTimeout(() => removeToast(toast), duration);

    // Limit to 3 toasts
    const toasts = container.querySelectorAll('.toast');
    if (toasts.length > 3) {
      removeToast(toasts[0]);
    }
  }

  function removeToast(toast) {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }

  // Expose globally
  window.showToast = showToast;

  // ═══════════════════════════════════════════════════════════════
  // 11. CONFETTI EFFECT
  // ═══════════════════════════════════════════════════════════════

  function createConfetti(element) {
    const colors = ['#1d5e33', '#2a7d4a', '#E5CBAF', '#c9a877', '#ffffff'];
    const shapes = ['circle', 'square'];
    const count = 50;

    const rect = element.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';

      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4;
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 10 + 10;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      particle.style.cssText = `
        position: fixed;
        left: ${originX}px;
        top: ${originY}px;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${shape === 'circle' ? '50%' : '0'};
        pointer-events: none;
        z-index: 10000;
      `;

      document.body.appendChild(particle);

      // Animate particle
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 10;

      let x = 0, y = 0, rotation = 0;
      let gravity = 0.5;
      let velocityY = vy;

      function animate() {
        x += vx;
        y += velocityY;
        velocityY += gravity;
        rotation += 10;

        particle.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        particle.style.opacity = Math.max(0, 1 - y / 300);

        if (y < 300) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      }

      setTimeout(() => animate(), i * 10);
    }
  }

  // Expose globally
  window.createConfetti = createConfetti;

  // ═══════════════════════════════════════════════════════════════
  // 12. SPARKLE EFFECT
  // ═══════════════════════════════════════════════════════════════

  function createSparkle(element) {
    const rect = element.getBoundingClientRect();
    const count = 4;

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';

      const x = Math.random() * 40 - 20;
      const y = Math.random() * 40 - 20;

      sparkle.style.left = rect.left + rect.width / 2 + x + 'px';
      sparkle.style.top = rect.top + rect.height / 2 + y + 'px';

      document.body.appendChild(sparkle);

      sparkle.addEventListener('animationend', () => {
        sparkle.remove();
      });
    }
  }

  // Add sparkle on hover for elements with .sparkle-container
  document.addEventListener('mouseover', throttle((e) => {
    const container = e.target.closest('.sparkle-container');
    if (container && !isTouchDevice()) {
      createSparkle(container);
    }
  }, 500));

  // ═══════════════════════════════════════════════════════════════
  // 13. FLOATING PARTICLES BACKGROUND
  // ═══════════════════════════════════════════════════════════════

  function initFloatingParticles(container, count = 30) {
    if (prefersReducedMotion()) return;

    const particlesBg = document.createElement('div');
    particlesBg.className = 'particles-bg';
    container.style.position = 'relative';
    container.appendChild(particlesBg);

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 8 + 's';
      particle.style.animationDuration = Math.random() * 5 + 10 + 's';
      particlesBg.appendChild(particle);
    }
  }

  // Initialize particles in hero section
  const heroSection = document.querySelector('.hero-section, .immersive-hero-section');
  if (heroSection) {
    initFloatingParticles(heroSection, 30);
  }

  // ═══════════════════════════════════════════════════════════════
  // 14. KEYBOARD NAVIGATION SUPPORT
  // ═══════════════════════════════════════════════════════════════

  function initKeyboardNavigation() {
    // Add keyboard focus class
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Autocomplete keyboard navigation
    document.addEventListener('keydown', (e) => {
      const autocomplete = document.querySelector('.form-autocomplete:not([hidden])');
      if (!autocomplete) return;

      const items = autocomplete.querySelectorAll('.form-autocomplete-item');
      let focusedIndex = Array.from(items).findIndex(item => 
        item.classList.contains('keyboard-focus')
      );

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[focusedIndex]?.classList.remove('keyboard-focus');
        focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
        items[focusedIndex]?.classList.add('keyboard-focus');
        items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[focusedIndex]?.classList.remove('keyboard-focus');
        focusedIndex = Math.max(focusedIndex - 1, 0);
        items[focusedIndex]?.classList.add('keyboard-focus');
        items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        items[focusedIndex]?.click();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 15. ENHANCED BOOKING STEPS ANIMATION
  // ═══════════════════════════════════════════════════════════════

  function initBookingStepsAnimation() {
    const section = document.querySelector('.booking-steps-section');
    if (!section) return;

    const pathProgress = section.querySelector('.booking-steps__path-progress');
    const pathShimmer = section.querySelector('.booking-steps__path-shimmer');
    const airplane = section.querySelector('.booking-steps__airplane');
    const milestones = section.querySelectorAll('.booking-steps__milestone');
    const cards = section.querySelectorAll('.booking-step-card');
    const readyCard = section.querySelector('.booking-steps__ready-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !section.classList.contains('animated')) {
          section.classList.add('animated');

          // Animation timeline
          setTimeout(() => pathProgress?.classList.add('active'), 600);
          setTimeout(() => pathShimmer?.classList.add('active'), 2000);
          setTimeout(() => {
            milestones.forEach(m => m.classList.add('active'));
          }, 2500);
          setTimeout(() => airplane?.classList.add('flying'), 2500);
          setTimeout(() => {
            cards.forEach(c => c.classList.add('visible'));
          }, 1000);
          setTimeout(() => readyCard?.classList.add('visible'), 5000);

          observer.unobserve(section);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(section);
  }

  // ═══════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

  document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Initializing premium micro-interactions...');

    // Initialize all features
    initCustomCursor();
    initScrollProgress();
    initScrollAnimations();
    initButtonRipple();
    initMagneticButtons();
    initCardParallax();
    initBookmarkAnimation();
    initFloatingLabels();
    initNumberCounters();
    initKeyboardNavigation();
    initBookingStepsAnimation();

    console.log('✨ Premium micro-interactions ready!');
  });

  // ═══════════════════════════════════════════════════════════════
  // EXAMPLE USAGE (for developers)
  // ═══════════════════════════════════════════════════════════════

  /*
  
  // Show toast notification
  showToast('Flight search completed!', 'success');
  showToast('Please fill all required fields', 'error');
  showToast('Flight details updated', 'info');
  showToast('Limited seats available!', 'warning');

  // Trigger confetti
  const button = document.querySelector('#book-now-btn');
  button.addEventListener('click', () => {
    createConfetti(button);
  });

  // Add floating particles to any section
  const section = document.querySelector('.deals-section');
  initFloatingParticles(section, 20);

  */

})();
