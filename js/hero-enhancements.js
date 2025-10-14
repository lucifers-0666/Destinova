/**
 * Hero Section Enhancements
 * - Counter animations for statistics
 * - Countdown timer for limited offer
 * - Rotating booking notifications
 * - Parallax effects
 */

(function() {
  'use strict';

  // ============================================================================
  // COUNTER ANIMATION
  // ============================================================================
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = formatNumber(target);
        clearInterval(timer);
      } else {
        element.textContent = formatNumber(Math.floor(current));
      }
    }, 16);
  }

  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+';
    }
    return num + '+';
  }

  // Initialize counters when they come into view
  function initCounters() {
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          const target = parseInt(entry.target.getAttribute('data-count'));
          animateCounter(entry.target, target);
        }
      });
    }, { threshold: 0.5 });

    statValues.forEach(stat => observer.observe(stat));
  }

  // ============================================================================
  // COUNTDOWN TIMER
  // ============================================================================
  function startCountdownTimer() {
    const timerElement = document.getElementById('offerTimer');
    if (!timerElement) return;

    // Set timer to 24 hours from now
    let timeLeft = 24 * 60 * 60; // 24 hours in seconds

    function updateTimer() {
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;

      timerElement.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      if (timeLeft > 0) {
        timeLeft--;
      } else {
        timeLeft = 24 * 60 * 60; // Reset to 24 hours
      }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // ============================================================================
  // BOOKING NOTIFICATIONS
  // ============================================================================
  const bookingNotifications = [
    { name: 'Sarah M.', route: 'NYC → Paris', time: '2 minutes ago' },
    { name: 'John D.', route: 'London → Dubai', time: '5 minutes ago' },
    { name: 'Emily R.', route: 'Tokyo → Singapore', time: '8 minutes ago' },
    { name: 'Michael K.', route: 'LA → Sydney', time: '12 minutes ago' },
    { name: 'Lisa P.', route: 'Berlin → Rome', time: '15 minutes ago' },
    { name: 'David W.', route: 'Mumbai → Bangkok', time: '18 minutes ago' },
    { name: 'Anna S.', route: 'Toronto → Miami', time: '22 minutes ago' },
    { name: 'Chris B.', route: 'Seoul → Hong Kong', time: '25 minutes ago' }
  ];

  let currentNotificationIndex = 0;

  function showBookingNotification() {
    const notification = document.getElementById('bookingNotification');
    if (!notification) return;

    const data = bookingNotifications[currentNotificationIndex];
    
    // Update content
    notification.querySelector('.notification-name').textContent = data.name;
    notification.querySelector('.notification-route').textContent = data.route;
    notification.querySelector('.notification-time').textContent = data.time;

    // Reset animation
    notification.style.animation = 'none';
    setTimeout(() => {
      notification.style.animation = 'slideInLeft 0.5s ease-out, fadeOut 0.5s ease-out 5.5s forwards';
    }, 10);

    // Move to next notification
    currentNotificationIndex = (currentNotificationIndex + 1) % bookingNotifications.length;
  }

  function startNotificationRotation() {
    // Show first notification after 3 seconds
    setTimeout(showBookingNotification, 3000);
    
    // Show new notification every 8 seconds (6s display + 2s pause)
    setInterval(showBookingNotification, 8000);
  }

  // ============================================================================
  // PARALLAX EFFECT
  // ============================================================================
  function initParallax() {
    const heroImageLayer = document.querySelector('.hero-image-layer');
    if (!heroImageLayer) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroHeight = document.querySelector('.hero-section-modern').offsetHeight;
      
      if (scrolled < heroHeight) {
        const parallaxSpeed = 0.5;
        heroImageLayer.style.transform = `translateY(${scrolled * parallaxSpeed}px) scale(1.1)`;
      }
    });
  }

  // ============================================================================
  // SMOOTH SCROLL FOR CTA BUTTONS
  // ============================================================================
  function initSmoothScroll() {
    const ctaButtons = document.querySelectorAll('a[href^="#"]');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ============================================================================
  // INITIALIZE ALL ENHANCEMENTS
  // ============================================================================
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    console.log('🚀 Initializing Hero Section Enhancements...');

    // Initialize all features
    initCounters();
    startCountdownTimer();
    startNotificationRotation();
    initParallax();
    initSmoothScroll();

    console.log('✅ Hero Section Enhancements Loaded Successfully!');
  }

  // Start initialization
  init();

})();
