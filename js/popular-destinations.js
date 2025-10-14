/* ═══════════════════════════════════════════════════════════════════════════════
   POPULAR DESTINATIONS SECTION - INTERACTIVE FUNCTIONALITY
   Destinova Flight Booking
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════════
  // 1. SCROLL ANIMATION OBSERVER
  // ═══════════════════════════════════════════════════════════════════════════════

  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all destination cards
    const cards = document.querySelectorAll('.destination-card');
    cards.forEach(card => observer.observe(card));
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 2. LAZY LOAD IMAGES
  // ═══════════════════════════════════════════════════════════════════════════════

  function initLazyLoadImages() {
    const imageObserverOptions = {
      threshold: 0,
      rootMargin: '200px' // Start loading 200px before entering viewport
    };

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const wrapper = img.closest('.destination-image-wrapper');
          
          // Remove loading class from wrapper
          if (wrapper) {
            wrapper.classList.remove('loading');
          }
          
          // Load the actual image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loading');
            
            img.onload = () => {
              img.classList.remove('loading');
              img.classList.add('loaded');
            };
            
            // Load srcset if available
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            
            delete img.dataset.src;
            delete img.dataset.srcset;
          }
          
          imageObserver.unobserve(img);
        }
      });
    }, imageObserverOptions);

    // Observe all destination images
    const images = document.querySelectorAll('.destination-image[data-src]');
    images.forEach(img => imageObserver.observe(img));
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 3. BOOKMARK/HEART TOGGLE
  // ═══════════════════════════════════════════════════════════════════════════════

  function initBookmarkToggle() {
    const bookmarks = document.querySelectorAll('.destination-bookmark');
    
    // Load saved bookmarks from localStorage
    const savedBookmarks = JSON.parse(localStorage.getItem('destinova-bookmarks') || '[]');
    
    bookmarks.forEach(bookmark => {
      const card = bookmark.closest('.destination-card');
      const destinationId = card.dataset.destinationId;
      
      // Check if this destination is bookmarked
      if (savedBookmarks.includes(destinationId)) {
        bookmark.classList.add('active');
      }
      
      bookmark.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = bookmark.classList.toggle('active');
        
        // Update localStorage
        let bookmarks = JSON.parse(localStorage.getItem('destinova-bookmarks') || '[]');
        
        if (isActive) {
          if (!bookmarks.includes(destinationId)) {
            bookmarks.push(destinationId);
          }
          // Optional: Show toast notification
          showToast(`${card.querySelector('.destination-name').textContent} added to favorites!`);
        } else {
          bookmarks = bookmarks.filter(id => id !== destinationId);
          showToast(`${card.querySelector('.destination-name').textContent} removed from favorites.`);
        }
        
        localStorage.setItem('destinova-bookmarks', JSON.stringify(bookmarks));
      });
      
      // Keyboard accessibility
      bookmark.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          bookmark.click();
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 4. CARD CLICK HANDLER
  // ═══════════════════════════════════════════════════════════════════════════════

  function initCardClickHandlers() {
    const cards = document.querySelectorAll('.destination-card');
    
    cards.forEach(card => {
      // Make card keyboard accessible
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'article');
      
      // Click handler
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking bookmark or CTA button
        if (e.target.closest('.destination-bookmark') || 
            e.target.closest('.destination-cta-button')) {
          return;
        }
        
        const destinationId = card.dataset.destinationId;
        const destinationName = card.querySelector('.destination-name').textContent;
        
        // Navigate to destination details page
        console.log(`Navigating to destination: ${destinationName} (ID: ${destinationId})`);
        // window.location.href = `destination-details.html?id=${destinationId}`;
      });
      
      // Keyboard navigation
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 5. CTA BUTTON HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════════

  function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.destination-cta-button');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card click
        
        const card = button.closest('.destination-card');
        const destinationId = card.dataset.destinationId;
        const destinationName = card.querySelector('.destination-name').textContent;
        const price = card.querySelector('.price-amount').textContent;
        
        console.log(`View Deals clicked for: ${destinationName} (${price})`);
        
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('button-ripple');
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Navigate to deals page
        // window.location.href = `deals.html?destination=${destinationId}`;
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 6. LOAD MORE FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════════════════════

  function initLoadMore() {
    const loadMoreButton = document.querySelector('.load-more-button');
    
    if (loadMoreButton) {
      loadMoreButton.addEventListener('click', () => {
        // Add loading state
        loadMoreButton.disabled = true;
        loadMoreButton.innerHTML = `
          <svg class="load-more-icon spinning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          <span>Loading...</span>
        `;
        
        // Simulate loading more destinations
        setTimeout(() => {
          console.log('Loading more destinations...');
          // In a real app, fetch more destinations from API
          // loadMoreDestinations().then(destinations => {
          //   appendDestinations(destinations);
          // });
          
          loadMoreButton.disabled = false;
          loadMoreButton.innerHTML = `
            <svg class="load-more-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Explore More Destinations</span>
          `;
          
          showToast('More destinations loaded!');
        }, 1500);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 7. TOAST NOTIFICATION
  // ═══════════════════════════════════════════════════════════════════════════════

  function showToast(message) {
    // Create toast if doesn't exist
    let toast = document.querySelector('.destinations-toast');
    
    if (!toast) {
      toast = document.createElement('div');
      toast.classList.add('destinations-toast');
      document.body.appendChild(toast);
      
      // Add toast styles dynamically
      const toastStyles = `
        .destinations-toast {
          position: fixed;
          bottom: 32px;
          right: 32px;
          background: rgba(28, 37, 38, 0.95);
          backdrop-filter: blur(10px);
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          z-index: 10000;
          pointer-events: none;
        }
        
        .destinations-toast.show {
          opacity: 1;
          transform: translateY(0);
        }
        
        @media (max-width: 767px) {
          .destinations-toast {
            left: 16px;
            right: 16px;
            bottom: 24px;
          }
        }
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.textContent = toastStyles;
      document.head.appendChild(styleSheet);
    }
    
    toast.textContent = message;
    toast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 8. PRELOAD CRITICAL IMAGES
  // ═══════════════════════════════════════════════════════════════════════════════

  function preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('.destination-card:nth-child(-n+3) .destination-image');
    
    criticalImages.forEach(img => {
      if (img.dataset.src) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = img.dataset.src;
        document.head.appendChild(preloadLink);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 9. ANIMATED AIRPLANE PATH (SVG Animation)
  // ═══════════════════════════════════════════════════════════════════════════════

  function initAirplanePath() {
    const svg = document.querySelector('.airplane-path-svg');
    if (!svg) return;
    
    // Animate the airplane along the path
    const airplane = svg.querySelector('.airplane-icon-animated');
    if (airplane) {
      // The airplane will animate along the defined path automatically with CSS
      console.log('✈️ Airplane path animation initialized');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 10. PERFORMANCE MONITORING
  // ═══════════════════════════════════════════════════════════════════════════════

  function monitorPerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name.includes('popular-destinations')) {
            console.log('Popular Destinations Section Load Time:', entry.duration + 'ms');
          }
        });
      });
      
      observer.observe({ entryTypes: ['measure'] });
      
      performance.mark('destinations-start');
      
      window.addEventListener('load', () => {
        performance.mark('destinations-end');
        performance.measure(
          'popular-destinations-interactive',
          'destinations-start',
          'destinations-end'
        );
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 11. VIEW ALL DESTINATIONS LINK
  // ═══════════════════════════════════════════════════════════════════════════════

  function initViewAllLink() {
    const viewAllLink = document.querySelector('.view-all-destinations-link');
    
    if (viewAllLink) {
      viewAllLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Navigating to all destinations page...');
        // window.location.href = 'destinations.html';
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 12. KEYBOARD NAVIGATION ENHANCEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  function enhanceKeyboardNavigation() {
    const cards = document.querySelectorAll('.destination-card');
    
    cards.forEach((card, index) => {
      card.addEventListener('keydown', (e) => {
        let targetCard = null;
        
        switch(e.key) {
          case 'ArrowRight':
            e.preventDefault();
            targetCard = cards[index + 1] || cards[0];
            break;
          case 'ArrowLeft':
            e.preventDefault();
            targetCard = cards[index - 1] || cards[cards.length - 1];
            break;
          case 'ArrowDown':
            e.preventDefault();
            // Move to card below (in grid)
            targetCard = cards[Math.min(index + 3, cards.length - 1)];
            break;
          case 'ArrowUp':
            e.preventDefault();
            // Move to card above (in grid)
            targetCard = cards[Math.max(index - 3, 0)];
            break;
        }
        
        if (targetCard) {
          targetCard.focus();
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 13. ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════════════════════

  function initErrorHandling() {
    window.addEventListener('error', (e) => {
      if (e.filename && e.filename.includes('popular-destinations')) {
        console.error('Popular Destinations Error:', e.message);
        
        // Fallback: ensure cards are visible even if JS fails
        const cards = document.querySelectorAll('.destination-card');
        cards.forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        });
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 14. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  function init() {
    // Check if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Check if section exists
    const section = document.querySelector('.popular-destinations-section');
    if (!section) {
      console.warn('Popular Destinations Section not found on this page');
      return;
    }

    try {
      // Initialize all features
      initErrorHandling();
      monitorPerformance();
      preloadCriticalImages();
      
      if ('IntersectionObserver' in window) {
        initScrollAnimations();
        initLazyLoadImages();
      } else {
        // Fallback for older browsers
        const cards = document.querySelectorAll('.destination-card');
        cards.forEach(card => card.classList.add('visible'));
        
        const images = document.querySelectorAll('.destination-image[data-src]');
        images.forEach(img => {
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
        });
      }
      
      initBookmarkToggle();
      initCardClickHandlers();
      initCTAButtons();
      initLoadMore();
      initViewAllLink();
      enhanceKeyboardNavigation();
      initAirplanePath();
      
      console.log('✅ Popular Destinations Section initialized successfully');
    } catch (error) {
      console.error('Error initializing Popular Destinations Section:', error);
      
      // Ensure content is visible even if JS fails
      const allElements = document.querySelectorAll('.destination-card');
      allElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) scale(1)';
      });
    }
  }

  // Start initialization
  init();

  // ═══════════════════════════════════════════════════════════════════════════════
  // 15. EXPOSE PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════════

  window.PopularDestinations = {
    reinit: init,
    showToast: showToast,
    version: '1.0.0'
  };

})();
