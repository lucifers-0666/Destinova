/**
 * Header & Hero Slider Functionality
 * Modern Premium Design Implementation
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HEADER SCROLL BEHAVIOR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const header = document.getElementById('header-main');
  let lastScrollY = window.scrollY;
  
  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
    
    lastScrollY = currentScrollY;
  }
  
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HERO SLIDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const heroSlider = {
    currentSlide: 0,
    slides: null,
    dots: null,
    isPaused: false,
    autoPlayInterval: null,
    autoPlayDelay: 5000,
    
    init: function() {
      this.slides = document.querySelectorAll('.hero-slide');
      this.dots = document.querySelectorAll('.hero-slider-dot');
      
      if (this.slides.length === 0) return;
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Show first slide
      this.goToSlide(0);
      
      // Start auto-play
      this.startAutoPlay();
    },
    
    setupEventListeners: function() {
      // Dot navigation
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          this.goToSlide(index);
          this.resetAutoPlay();
        });
      });
      
      // Arrow navigation
      const leftArrow = document.querySelector('.hero-slider-arrow.left');
      const rightArrow = document.querySelector('.hero-slider-arrow.right');
      
      if (leftArrow) {
        leftArrow.addEventListener('click', () => {
          this.prevSlide();
          this.resetAutoPlay();
        });
      }
      
      if (rightArrow) {
        rightArrow.addEventListener('click', () => {
          this.nextSlide();
          this.resetAutoPlay();
        });
      }
      
      // Pause on hover (optional)
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
          this.isPaused = true;
        });
        
        heroSection.addEventListener('mouseleave', () => {
          this.isPaused = false;
        });
      }
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.prevSlide();
          this.resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
          this.nextSlide();
          this.resetAutoPlay();
        }
      });
    },
    
    goToSlide: function(index) {
      // Update current slide
      this.currentSlide = index;
      
      // Update slides
      this.slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
          // Restart Ken Burns animation
          const img = slide.querySelector('img');
          if (img) {
            img.style.animation = 'none';
            setTimeout(() => {
              img.style.animation = 'kenBurnsZoom 5s linear forwards';
            }, 10);
          }
        } else {
          slide.classList.remove('active');
        }
      });
      
      // Update dots
      this.dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    },
    
    nextSlide: function() {
      const nextIndex = (this.currentSlide + 1) % this.slides.length;
      this.goToSlide(nextIndex);
    },
    
    prevSlide: function() {
      const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
      this.goToSlide(prevIndex);
    },
    
    startAutoPlay: function() {
      this.autoPlayInterval = setInterval(() => {
        if (!this.isPaused) {
          this.nextSlide();
        }
      }, this.autoPlayDelay);
    },
    
    resetAutoPlay: function() {
      clearInterval(this.autoPlayInterval);
      this.startAutoPlay();
    }
  };
  
  // Initialize slider
  heroSlider.init();
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SEARCH WIDGET FUNCTIONALITY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const searchWidget = {
    tripType: 'roundTrip',
    fareType: 'regular',
    
    init: function() {
      this.setupTripTypeTabs();
      this.setupSwapButton();
      this.setupFareTypes();
      this.setupSearchButton();
    },
    
    setupTripTypeTabs: function() {
      const tabs = document.querySelectorAll('.search-trip-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // Remove active from all tabs
          tabs.forEach(t => t.classList.remove('active'));
          // Add active to clicked tab
          tab.classList.add('active');
          // Update trip type
          this.tripType = tab.dataset.tripType || 'roundTrip';
          
          // Show/hide return date based on trip type
          const returnField = document.querySelector('.search-input-field[data-field="return"]');
          if (returnField) {
            if (this.tripType === 'oneWay') {
              returnField.style.opacity = '0.5';
              returnField.style.pointerEvents = 'none';
            } else {
              returnField.style.opacity = '1';
              returnField.style.pointerEvents = 'auto';
            }
          }
        });
      });
    },
    
    setupSwapButton: function() {
      const swapBtn = document.querySelector('.search-swap-btn');
      const fromInput = document.querySelector('.search-input-field[data-field="from"] input');
      const toInput = document.querySelector('.search-input-field[data-field="to"] input');
      
      if (swapBtn && fromInput && toInput) {
        swapBtn.addEventListener('click', () => {
          const temp = fromInput.value;
          fromInput.value = toInput.value;
          toInput.value = temp;
          
          // Add animation class
          swapBtn.style.transform = 'rotate(180deg)';
          setTimeout(() => {
            swapBtn.style.transform = '';
          }, 300);
        });
      }
    },
    
    setupFareTypes: function() {
      const farePills = document.querySelectorAll('.search-fare-pill');
      farePills.forEach(pill => {
        pill.addEventListener('click', () => {
          // Remove active from all pills
          farePills.forEach(p => p.classList.remove('active'));
          // Add active to clicked pill
          pill.classList.add('active');
          // Update fare type
          this.fareType = pill.dataset.fareType || 'regular';
        });
      });
    },
    
    setupSearchButton: function() {
      const searchBtn = document.querySelector('.search-submit-btn');
      if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Add loading state
          searchBtn.classList.add('loading');
          searchBtn.innerHTML = '<div class="btn-loader"></div> Searching...';
          
          // Simulate search (replace with actual search logic)
          setTimeout(() => {
            // Remove loading state
            searchBtn.classList.remove('loading');
            searchBtn.innerHTML = '<i class="fas fa-search"></i> SEARCH FLIGHTS';
            
            // Navigate to results page (uncomment when ready)
            // window.location.href = 'results.html';
            
            // For now, show success message
            console.log('Searching flights with:', {
              tripType: this.tripType,
              fareType: this.fareType
            });
          }, 2000);
        });
      }
    }
  };
  
  // Initialize search widget
  searchWidget.init();
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CTA BUTTONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const bookFlightBtn = document.querySelector('.hero-btn-primary');
  const exploreBtn = document.querySelector('.hero-btn-secondary');
  
  if (bookFlightBtn) {
    bookFlightBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Scroll to search widget
      const searchWidget = document.querySelector('.floating-search-widget');
      if (searchWidget) {
        searchWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
  
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Navigate to destinations page or scroll to destinations section
      const destinationsSection = document.querySelector('.popular-destinations-section');
      if (destinationsSection) {
        destinationsSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'destinations.html';
      }
    });
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
