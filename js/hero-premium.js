/* ═══════════════════════════════════════════════════════════════════════════════
   DESTINOVA PREMIUM HERO SECTION - JAVASCRIPT
   Interactive Features & Form Handling
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. LAZY LOAD BACKGROUND IMAGE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initBackgroundImage() {
    const background = document.getElementById('heroBackground');
    if (!background) return;

    const img = new Image();
    img.onload = function() {
      background.style.backgroundImage = `url('${img.src}')`;
      background.classList.remove('loading');
    };
    img.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80';
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. TAB SWITCHER FUNCTIONALITY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initTabSwitcher() {
    const tabs = document.querySelectorAll('.hero-tab');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Get tab type
        const tabType = this.dataset.tab;
        console.log('Tab switched to:', tabType);
        
        // Here you can add logic to show/hide return date field for one-way
        // or add multi-city fields
      });
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. FLATPICKR DATE PICKER INITIALIZATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initDatePicker() {
    const dateInput = document.getElementById('heroDate');
    if (!dateInput || typeof flatpickr === 'undefined') return;

    flatpickr(dateInput, {
      mode: 'range',
      minDate: 'today',
      dateFormat: 'M d, Y',
      showMonths: 2,
      disableMobile: false,
      locale: {
        firstDayOfWeek: 1
      },
      onChange: function(selectedDates, dateStr) {
        if (selectedDates.length > 0) {
          dateInput.classList.remove('error');
          const errorMsg = dateInput.parentElement.parentElement.querySelector('.hero-error-message');
          if (errorMsg) errorMsg.remove();
        }
      }
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. TRAVELERS COUNTER (SIMPLE VERSION)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initTravelersCounter() {
    const travelersInput = document.getElementById('heroTravelers');
    if (!travelersInput) return;

    let count = 1;

    travelersInput.addEventListener('click', function() {
      count = count >= 9 ? 1 : count + 1;
      this.value = `${count} Traveler${count > 1 ? 's' : ''}`;
      
      this.classList.remove('error');
      const errorMsg = this.parentElement.parentElement.querySelector('.hero-error-message');
      if (errorMsg) errorMsg.remove();
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. AUTOCOMPLETE FOR LOCATION INPUTS (MOCK DATA)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const airports = [
    { code: 'JFK', city: 'New York', name: 'John F. Kennedy International' },
    { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International' },
    { code: 'LHR', city: 'London', name: 'Heathrow' },
    { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle' },
    { code: 'DXB', city: 'Dubai', name: 'Dubai International' },
    { code: 'HND', city: 'Tokyo', name: 'Haneda' },
    { code: 'SIN', city: 'Singapore', name: 'Changi' },
    { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith' },
    { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport' },
    { code: 'AMS', city: 'Amsterdam', name: 'Schiphol' }
  ];

  function initLocationAutocomplete() {
    const fromInput = document.getElementById('heroFrom');
    const toInput = document.getElementById('heroTo');

    [fromInput, toInput].forEach(input => {
      if (!input) return;

      input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        
        if (value.length < 2) return;

        // Filter airports
        const matches = airports.filter(airport => 
          airport.city.toLowerCase().includes(value) ||
          airport.code.toLowerCase().includes(value) ||
          airport.name.toLowerCase().includes(value)
        );

        // For demo purposes, just validate on blur
        if (matches.length > 0) {
          this.classList.remove('error');
          const errorMsg = this.parentElement.parentElement.querySelector('.hero-error-message');
          if (errorMsg) errorMsg.remove();
        }
      });

      input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
          this.classList.add('error');
        }
      });
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. FORM VALIDATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function showError(input, message) {
    input.classList.add('error');
    
    // Remove existing error message
    const existingError = input.parentElement.parentElement.querySelector('.hero-error-message');
    if (existingError) existingError.remove();
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'hero-error-message';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    input.parentElement.parentElement.appendChild(errorDiv);
  }

  function clearError(input) {
    input.classList.remove('error');
    const errorMsg = input.parentElement.parentElement.querySelector('.hero-error-message');
    if (errorMsg) errorMsg.remove();
  }

  function validateForm() {
    const form = document.getElementById('heroSearchForm');
    if (!form) return false;

    let isValid = true;
    const fromInput = document.getElementById('heroFrom');
    const toInput = document.getElementById('heroTo');
    const dateInput = document.getElementById('heroDate');

    // Validate From
    if (!fromInput.value.trim()) {
      showError(fromInput, 'Please enter departure city');
      isValid = false;
    } else {
      clearError(fromInput);
    }

    // Validate To
    if (!toInput.value.trim()) {
      showError(toInput, 'Please enter destination city');
      isValid = false;
    } else {
      clearError(toInput);
    }

    // Validate Date
    if (!dateInput.value.trim()) {
      showError(dateInput, 'Please select travel dates');
      isValid = false;
    } else {
      clearError(dateInput);
    }

    return isValid;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7. FORM SUBMISSION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initFormSubmission() {
    const form = document.getElementById('heroSearchForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const button = this.querySelector('.hero-search-button');
      
      // Add loading state
      button.classList.add('loading');
      button.disabled = true;

      // Simulate API call
      setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;

        // Get form values
        const formData = {
          from: document.getElementById('heroFrom').value,
          to: document.getElementById('heroTo').value,
          date: document.getElementById('heroDate').value,
          travelers: document.getElementById('heroTravelers').value,
          tripType: document.querySelector('.hero-tab.active').dataset.tab
        };

        console.log('Search submitted:', formData);
        
        // Redirect to results page or handle search
        // window.location.href = `results.html?from=${formData.from}&to=${formData.to}`;
        alert('Search functionality will redirect to results page');
      }, 1500);
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 8. SCROLL INDICATOR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', function() {
      const nextSection = document.querySelector('#hero-premium').nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    });

    // Keyboard support
    scrollIndicator.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 9. PARALLAX SCROLL EFFECT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initParallaxEffect() {
    const heroSection = document.getElementById('hero-premium');
    const heroBackground = document.getElementById('heroBackground');
    
    if (!heroSection || !heroBackground) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const scrolled = window.pageYOffset;
          const heroHeight = heroSection.offsetHeight;
          
          if (scrolled < heroHeight) {
            const parallaxOffset = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${parallaxOffset}px)`;
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    }, { passive: true });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 10. PRELOAD FONTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function preloadFonts() {
    const fonts = [
      { family: 'Montserrat', weight: '700' },
      { family: 'Poppins', weight: '400' },
      { family: 'Poppins', weight: '500' },
      { family: 'Poppins', weight: '600' }
    ];

    fonts.forEach(font => {
      const fontFace = new FontFace(
        font.family,
        `url(https://fonts.googleapis.com/css2?family=${font.family}:wght@${font.weight}&display=swap)`
      );
      
      fontFace.load().then(() => {
        document.fonts.add(fontFace);
      }).catch(err => {
        console.warn('Font loading failed:', err);
      });
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 11. KEYBOARD NAVIGATION FOR TAB SWITCHER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initKeyboardNavigation() {
    const tabs = document.querySelectorAll('.hero-tab');
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('keydown', function(e) {
        let newIndex;
        
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          newIndex = (index + 1) % tabs.length;
          tabs[newIndex].focus();
          tabs[newIndex].click();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          newIndex = (index - 1 + tabs.length) % tabs.length;
          tabs[newIndex].focus();
          tabs[newIndex].click();
        }
      });
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 12. REAL-TIME INPUT VALIDATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initRealTimeValidation() {
    const inputs = document.querySelectorAll('.hero-input');
    
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        if (this.value.trim() !== '') {
          clearError(this);
        }
      });
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // INITIALIZE ALL FEATURES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInit);
    } else {
      runInit();
    }
  }

  function runInit() {
    console.log('🎯 Destinova Premium Hero: Initializing...');
    
    preloadFonts();
    initBackgroundImage();
    initTabSwitcher();
    initDatePicker();
    initTravelersCounter();
    initLocationAutocomplete();
    initFormSubmission();
    initScrollIndicator();
    initParallaxEffect();
    initKeyboardNavigation();
    initRealTimeValidation();
    
    console.log('✅ Destinova Premium Hero: All features loaded!');
  }

  // Start initialization
  init();

})();
