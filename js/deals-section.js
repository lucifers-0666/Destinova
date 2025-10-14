/* ============================================= */
/* DEALS SECTION - INTERACTIVE FUNCTIONALITY */
/* ============================================= */

(function() {
  'use strict';

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDealsSection);
  } else {
    initDealsSection();
  }

  function initDealsSection() {
    console.log('🎯 Initializing Deals Section...');

    // Initialize all features
    initCarouselNavigation();
    initCarouselIndicators();
    initAutoScroll();
    initScrollSnapping();
    initCardInteractions();
    initBookingButtons();
    initLazyLoading();
    initAccessibility();

    console.log('✅ Deals Section initialized successfully');
  }

  /* ============================================= */
  /* 1. CAROUSEL NAVIGATION */
  /* ============================================= */
  function initCarouselNavigation() {
    const carousel = document.querySelector('.deals-carousel');
    const prevButton = document.querySelector('.deals-nav-button.prev');
    const nextButton = document.querySelector('.deals-nav-button.next');

    if (!carousel || !prevButton || !nextButton) return;

    // Calculate scroll amount (one card width + gap)
    const scrollAmount = 412; // 380px card + 32px gap

    // Previous button
    prevButton.addEventListener('click', () => {
      carousel.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    // Next button
    nextButton.addEventListener('click', () => {
      carousel.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });

    // Update button states on scroll
    function updateNavButtons() {
      const scrollLeft = carousel.scrollLeft;
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;

      // Disable prev button at start
      if (scrollLeft <= 10) {
        prevButton.classList.add('disabled');
      } else {
        prevButton.classList.remove('disabled');
      }

      // Disable next button at end
      if (scrollLeft >= maxScroll - 10) {
        nextButton.classList.add('disabled');
      } else {
        nextButton.classList.remove('disabled');
      }
    }

    // Initial state
    updateNavButtons();

    // Update on scroll
    carousel.addEventListener('scroll', updateNavButtons);

    // Keyboard navigation (Arrow keys)
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevButton.click();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextButton.click();
      }
    });

    console.log('✓ Carousel navigation initialized');
  }

  /* ============================================= */
  /* 2. SCROLL SNAPPING & SMOOTH BEHAVIOR */
  /* ============================================= */
  function initScrollSnapping() {
    const carousel = document.querySelector('.deals-carousel');
    if (!carousel) return;

    // Smooth scroll polyfill for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
      carousel.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          e.preventDefault();
          carousel.scrollLeft += e.deltaX;
        }
      });
    }

    // Touch swipe support
    let isDown = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      carousel.style.cursor = 'grabbing';
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
      isDown = false;
      carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });

    console.log('✓ Scroll snapping initialized');
  }

  /* ============================================= */
  /* 3. CARD INTERACTIONS */
  /* ============================================= */
  function initCardInteractions() {
    const cards = document.querySelectorAll('.deal-card');

    cards.forEach((card) => {
      // Click handler - navigate to details
      card.addEventListener('click', (e) => {
        // Don't navigate if clicking book button
        if (e.target.closest('.deal-book-button')) return;

        const dealId = card.dataset.dealId;
        console.log(`🎫 Viewing deal: ${dealId}`);
        
        // Add ripple effect at click position
        createRipple(e, card);

        // Navigate after short delay
        setTimeout(() => {
          // window.location.href = `deal-details.html?id=${dealId}`;
          console.log(`Would navigate to: deal-details.html?id=${dealId}`);
        }, 300);
      });

      // Keyboard navigation
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });

      // Hover effect enhancement
      card.addEventListener('mouseenter', () => {
        card.style.cursor = 'pointer';
      });
    });

    console.log(`✓ Card interactions initialized (${cards.length} cards)`);
  }

  /* ============================================= */
  /* 4. CAROUSEL INDICATORS */
  /* ============================================= */
  function initCarouselIndicators() {
    const carousel = document.querySelector('.deals-carousel');
    const indicatorsContainer = document.querySelector('.deals-carousel-indicators');
    
    if (!carousel || !indicatorsContainer) return;

    const cards = carousel.querySelectorAll('.deal-card');
    
    // Create indicator dots
    cards.forEach((card, index) => {
      const dot = document.createElement('button');
      dot.className = 'deals-indicator-dot';
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to deal ${index + 1}`);
      
      // Click to scroll to card
      dot.addEventListener('click', () => {
        const cardWidth = card.offsetWidth + 32; // card width + gap
        carousel.scrollTo({
          left: cardWidth * index,
          behavior: 'smooth'
        });
      });
      
      indicatorsContainer.appendChild(dot);
    });

    // Update active indicator on scroll
    carousel.addEventListener('scroll', () => {
      const scrollPosition = carousel.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 32;
      const activeIndex = Math.round(scrollPosition / cardWidth);
      
      document.querySelectorAll('.deals-indicator-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    });

    console.log(`✓ Carousel indicators initialized (${cards.length} indicators)`);
  }

  /* ============================================= */
  /* 5. AUTO-SCROLL CAROUSEL */
  /* ============================================= */
  function initAutoScroll() {
    const carousel = document.querySelector('.deals-carousel');
    if (!carousel) return;

    let autoScrollInterval;
    let isPaused = false;

    const startAutoScroll = () => {
      autoScrollInterval = setInterval(() => {
        if (isPaused) return;

        const scrollAmount = 412; // card width + gap
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        
        // Scroll to next card or loop back to start
        if (carousel.scrollLeft >= maxScroll - 10) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 5000); // Every 5 seconds
    };

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    carousel.addEventListener('mouseleave', () => {
      isPaused = false;
    });

    // Pause on interaction
    carousel.addEventListener('touchstart', () => {
      isPaused = true;
      setTimeout(() => { isPaused = false; }, 10000); // Resume after 10s
    });

    startAutoScroll();

    console.log('✓ Auto-scroll initialized (5s interval)');
  }

  /* ============================================= */
  /* 6. BOOKING BUTTONS */
  /* ============================================= */
  function initBookingButtons() {
    const bookButtons = document.querySelectorAll('.deal-book-button');

    bookButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click

        const card = button.closest('.deal-card');
        const dealId = card.dataset.dealId;
        const fromCity = card.querySelector('.deal-city:first-child').textContent;
        const toCity = card.querySelector('.deal-city:last-child').textContent;
        const price = card.querySelector('.deal-current-price').textContent;

        console.log(`🎫 Booking deal: ${fromCity} → ${toCity} | ${price}`);

        // Create ripple effect
        createRipple(e, button);

        // Add loading state
        button.classList.add('loading');
        button.disabled = true;
        const originalText = button.querySelector('span').textContent;
        button.querySelector('span').textContent = 'Processing...';

        // Simulate booking process
        setTimeout(() => {
          button.classList.remove('loading');
          button.disabled = false;
          button.querySelector('span').textContent = originalText;

          // Navigate to booking page
          // window.location.href = `booking.html?deal=${dealId}`;
          console.log(`Would navigate to: booking.html?deal=${dealId}`);
        }, 1500);
      });

      // Prevent button focus on card click
      button.addEventListener('mousedown', (e) => {
        e.stopPropagation();
      });
    });

    console.log(`✓ Booking buttons initialized (${bookButtons.length} buttons)`);
  }

  /* ============================================= */
  /* 7. LAZY LOADING IMAGES */
  /* ============================================= */
  function initLazyLoading() {
    const images = document.querySelectorAll('.deal-card-image[data-src]');

    // Intersection Observer for lazy loading
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const wrapper = img.closest('.deal-card-image-wrapper');

            // Load image
            img.src = img.dataset.src;
            
            // Handle srcset if available
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }

            // Remove loading state when loaded
            img.addEventListener('load', () => {
              img.classList.add('loaded');
              if (wrapper) {
                wrapper.classList.remove('loading');
              }
              img.removeAttribute('data-src');
              img.removeAttribute('data-srcset');
            });

            // Handle error
            img.addEventListener('error', () => {
              console.warn('Failed to load image:', img.dataset.src);
              if (wrapper) {
                wrapper.classList.remove('loading');
              }
            });

            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01
      }
    );

    images.forEach((img) => imageObserver.observe(img));

    console.log(`✓ Lazy loading initialized (${images.length} images)`);
  }

  /* ============================================= */
  /* 8. ACCESSIBILITY FEATURES */
  /* ============================================= */
  function initAccessibility() {
    const cards = document.querySelectorAll('.deal-card');
    const carousel = document.querySelector('.deals-carousel');

    // Add ARIA labels
    cards.forEach((card, index) => {
      const fromCity = card.querySelector('.deal-city:first-child')?.textContent || 'Unknown';
      const toCity = card.querySelector('.deal-city:last-child')?.textContent || 'Unknown';
      const price = card.querySelector('.deal-current-price')?.textContent || 'N/A';
      const discount = card.querySelector('.deal-discount-badge')?.textContent || '';

      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', `Deal ${index + 1}: Flight from ${fromCity} to ${toCity} for ${price}. ${discount}`);
      card.setAttribute('tabindex', '0');
    });

    // Announce carousel navigation to screen readers
    if (carousel) {
      carousel.setAttribute('role', 'region');
      carousel.setAttribute('aria-label', 'Flight deals carousel');
    }

    console.log('✓ Accessibility features initialized');
  }

  /* ============================================= */
  /* UTILITY FUNCTIONS */
  /* ============================================= */

  /**
   * Create ripple effect on click
   */
  function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      top: ${y}px;
      left: ${x}px;
      transform: scale(0);
      pointer-events: none;
      z-index: 9999;
      animation: ripple-animation 0.6s ease-out;
    `;

    // Add ripple styles to document if not exists
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * Format currency
   */
  function formatCurrency(amount, currency = '₹') {
    return `${currency}${amount.toLocaleString('en-IN')}`;
  }

  /**
   * Calculate discount percentage
   */
  function calculateDiscount(original, current) {
    return Math.round(((original - current) / original) * 100);
  }

  /* ============================================= */
  /* PERFORMANCE MONITORING */
  /* ============================================= */
  if (window.PerformanceObserver) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.name.includes('deals-section')) {
            console.log(`⚡ ${entry.name}: ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      observer.observe({ entryTypes: ['measure'] });
    } catch (e) {
      console.warn('Performance monitoring not supported');
    }
  }

})();
