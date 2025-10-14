/* ==========================================================================
   DESTINOVA - IMMERSIVE HERO SECTION JAVASCRIPT
   Interactive functionality, animations, and user interactions
   ========================================================================== */

(function() {
  'use strict';

  // ==========================================================================
  // CONFIGURATION & CONSTANTS
  // ==========================================================================
  const CONFIG = {
    slideshow: {
      interval: 10000, // 10 seconds per slide
      transitionDuration: 2000 // 2 seconds crossfade
    },
    particles: {
      count: 50,
      minSize: 2,
      maxSize: 6,
      minDuration: 8000,
      maxDuration: 15000
    },
    typing: {
      charDelay: 50, // 50ms per character
      cursorBlinkSpeed: 500
    },
    counter: {
      duration: 2000,
      delay: 2500
    },
    autocomplete: {
      debounceDelay: 300
    }
  };

  const SLIDESHOW_IMAGES = [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000', // Airplane wing above clouds
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2000', // Exotic beach (Maldives)
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000'  // City skyline at dusk (Paris)
  ];

  const AIRPORTS = [
    { code: 'DEL', city: 'New Delhi', country: 'India', name: 'Indira Gandhi International' },
    { code: 'DXB', city: 'Dubai', country: 'UAE', name: 'Dubai International' },
    { code: 'BOM', city: 'Mumbai', country: 'India', name: 'Chhatrapati Shivaji Maharaj' },
    { code: 'LHR', city: 'London', country: 'UK', name: 'Heathrow' },
    { code: 'BLR', city: 'Bangalore', country: 'India', name: 'Kempegowda International' },
    { code: 'SIN', city: 'Singapore', country: 'Singapore', name: 'Changi' },
    { code: 'MAA', city: 'Chennai', country: 'India', name: 'Chennai International' },
    { code: 'BKK', city: 'Bangkok', country: 'Thailand', name: 'Suvarnabhumi' },
    { code: 'HYD', city: 'Hyderabad', country: 'India', name: 'Rajiv Gandhi International' },
    { code: 'JFK', city: 'New York', country: 'USA', name: 'John F. Kennedy International' }
  ];

  // ==========================================================================
  // DOM ELEMENTS
  // ==========================================================================
  let elements = {};

  function cacheElements() {
    elements = {
      heroSection: document.querySelector('.immersive-hero'),
      slideshowContainer: document.querySelector('.hero-background-slideshow'),
      particlesContainer: document.querySelector('.hero-particles'),
      headlineLines: document.querySelectorAll('.hero-headline-line'),
      cursor: document.querySelector('.typing-cursor'),
      trustIndicators: document.querySelectorAll('.trust-indicator'),
      searchCard: document.querySelector('.hero-search-card'),
      tripTabs: document.querySelectorAll('.trip-tab'),
      searchForm: document.querySelector('.hero-search-form'),
      fromInput: document.getElementById('hero-from-input'),
      toInput: document.getElementById('hero-to-input'),
      datesInput: document.getElementById('hero-dates-input'),
      travelersInput: document.getElementById('hero-travelers-input'),
      searchButton: document.querySelector('.search-button'),
      advancedToggle: document.querySelector('.advanced-toggle-btn'),
      advancedPanel: document.querySelector('.advanced-options-panel'),
      shortcutPills: document.querySelectorAll('.shortcut-pill'),
      scrollIndicator: document.querySelector('.scroll-indicator'),
      decorativeAirplanes: document.querySelectorAll('.decorative-airplane')
    };
  }

  // ==========================================================================
  // BACKGROUND SLIDESHOW
  // ==========================================================================
  function initSlideshow() {
    if (!elements.slideshowContainer) return;

    // Create slide elements
    SLIDESHOW_IMAGES.forEach((imageUrl, index) => {
      const slide = document.createElement('div');
      slide.classList.add('hero-slide');
      slide.style.backgroundImage = `url(${imageUrl})`;
      if (index === 0) slide.classList.add('active');
      elements.slideshowContainer.appendChild(slide);
    });

    let currentSlide = 0;
    const slides = elements.slideshowContainer.querySelectorAll('.hero-slide');

    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, CONFIG.slideshow.interval);

    console.log('✈️ Slideshow initialized with', slides.length, 'slides');
  }

  // ==========================================================================
  // PARTICLE SYSTEM
  // ==========================================================================
  function initParticles() {
    if (!elements.particlesContainer) return;

    for (let i = 0; i < CONFIG.particles.count; i++) {
      createParticle();
    }

    console.log('✨ Particle system initialized with', CONFIG.particles.count, 'particles');
  }

  function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // Random size
    const size = Math.random() * (CONFIG.particles.maxSize - CONFIG.particles.minSize) + CONFIG.particles.minSize;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random starting position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = '-10px';

    // Random animation duration
    const duration = Math.random() * (CONFIG.particles.maxDuration - CONFIG.particles.minDuration) + CONFIG.particles.minDuration;
    particle.style.animationDuration = `${duration}ms`;

    // Random horizontal drift
    const drift = (Math.random() - 0.5) * 100;
    particle.style.setProperty('--drift', `${drift}px`);

    // Random delay
    const delay = Math.random() * 5000;
    particle.style.animationDelay = `${delay}ms`;

    elements.particlesContainer.appendChild(particle);

    // Recreate particle after animation
    setTimeout(() => {
      particle.remove();
      createParticle();
    }, duration + delay);
  }

  // ==========================================================================
  // HEADLINE TYPING ANIMATION
  // ==========================================================================
  function initTypingAnimation() {
    if (!elements.headlineLines.length) return;

    const line1 = elements.headlineLines[0];
    const line2 = elements.headlineLines[1];
    const text1 = 'Where Will Your';
    const text2 = 'Journey Take You?';

    typeText(line1, text1, 0, () => {
      typeText(line2, text2, 0, () => {
        setTimeout(() => {
          if (elements.cursor) {
            elements.cursor.classList.add('hide');
          }
        }, 500);
      });
    });
  }

  function typeText(element, text, index, callback) {
    if (!element) return;

    element.classList.add('typing');

    if (index < text.length) {
      element.textContent += text[index];
      setTimeout(() => {
        typeText(element, text, index + 1, callback);
      }, CONFIG.typing.charDelay);
    } else if (callback) {
      callback();
    }
  }

  // ==========================================================================
  // COUNTER ANIMATIONS
  // ==========================================================================
  function initCounterAnimations() {
    setTimeout(() => {
      elements.trustIndicators.forEach((indicator, index) => {
        const numberElement = indicator.querySelector('.trust-indicator-number');
        if (!numberElement) return;

        const text = numberElement.textContent;
        const match = text.match(/(\d+(?:\.\d+)?)(.*)/);
        if (!match) return;

        const target = parseFloat(match[1]);
        const suffix = match[2];

        animateCounter(numberElement, 0, target, CONFIG.counter.duration, suffix);
      });
    }, CONFIG.counter.delay);
  }

  function animateCounter(element, start, end, duration, suffix = '') {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (range * easeOut);
      
      // Format number
      let displayValue;
      if (end >= 1) {
        displayValue = Math.round(current);
      } else {
        displayValue = current.toFixed(1);
      }
      
      element.textContent = displayValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ==========================================================================
  // TRIP TYPE TABS
  // ==========================================================================
  function initTripTypeTabs() {
    elements.tripTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        elements.tripTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        console.log('🎫 Trip type changed to:', this.textContent);
      });
    });
  }

  // ==========================================================================
  // SEARCH FORM INTERACTIONS
  // ==========================================================================
  function initSearchForm() {
    // Prevent form submission
    if (elements.searchForm) {
      elements.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }

    // Search button click
    if (elements.searchButton) {
      elements.searchButton.addEventListener('click', handleSearchClick);
    }

    // Initialize autocomplete for from/to inputs
    if (elements.fromInput) {
      initAutocomplete(elements.fromInput, 'from');
    }
    if (elements.toInput) {
      initAutocomplete(elements.toInput, 'to');
    }

    // Initialize date picker
    if (elements.datesInput) {
      initDatePicker();
    }

    // Initialize travelers dropdown
    if (elements.travelersInput) {
      initTravelersDropdown();
    }
  }

  function handleSearchClick(e) {
    const button = e.currentTarget;
    
    // Validate form
    const isValid = validateForm();
    
    if (!isValid) {
      return;
    }

    // Add ripple effect
    createRipple(e, button);

    // Show loading state
    button.classList.add('loading');
    const buttonText = button.querySelector('.search-button-text');
    const originalText = buttonText.textContent;
    buttonText.textContent = 'Searching...';

    // Simulate search (replace with actual API call)
    setTimeout(() => {
      button.classList.remove('loading');
      button.classList.add('success');
      buttonText.textContent = 'Found 247 flights';
      
      // Reset after 2 seconds
      setTimeout(() => {
        button.classList.remove('success');
        buttonText.textContent = originalText;
        
        // Navigate to results page (or show results)
        console.log('🔍 Searching flights...', getFormData());
      }, 2000);
    }, 2000);
  }

  function createRipple(event, button) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  function validateForm() {
    let isValid = true;
    const inputs = [elements.fromInput, elements.toInput, elements.datesInput, elements.travelersInput];

    inputs.forEach(input => {
      const group = input?.closest('.search-input-group');
      if (!group) return;

      if (!input.value || input.value.trim() === '') {
        group.classList.add('error');
        group.classList.remove('success');
        isValid = false;

        // Shake animation
        setTimeout(() => {
          group.classList.remove('error');
        }, 400);
      } else {
        group.classList.remove('error');
        group.classList.add('success');
      }
    });

    return isValid;
  }

  function getFormData() {
    return {
      tripType: document.querySelector('.trip-tab.active')?.textContent,
      from: elements.fromInput?.value,
      to: elements.toInput?.value,
      dates: elements.datesInput?.value,
      travelers: elements.travelersInput?.value
    };
  }

  // ==========================================================================
  // AUTOCOMPLETE FUNCTIONALITY
  // ==========================================================================
  function initAutocomplete(input, type) {
    const group = input.closest('.search-input-group');
    let dropdown = group.querySelector('.autocomplete-dropdown');

    // Create dropdown if doesn't exist
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.classList.add('autocomplete-dropdown');
      group.appendChild(dropdown);
    }

    let debounceTimer;

    input.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      
      debounceTimer = setTimeout(() => {
        const query = this.value.trim().toLowerCase();
        
        if (query.length < 2) {
          dropdown.classList.remove('open');
          return;
        }

        const results = AIRPORTS.filter(airport => 
          airport.city.toLowerCase().includes(query) ||
          airport.code.toLowerCase().includes(query) ||
          airport.name.toLowerCase().includes(query) ||
          airport.country.toLowerCase().includes(query)
        ).slice(0, 5);

        displayAutocompleteResults(dropdown, results, input);
      }, CONFIG.autocomplete.debounceDelay);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!group.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  function displayAutocompleteResults(dropdown, results, input) {
    dropdown.innerHTML = '';

    if (results.length === 0) {
      dropdown.classList.remove('open');
      return;
    }

    results.forEach(airport => {
      const item = document.createElement('div');
      item.classList.add('autocomplete-item');
      item.innerHTML = `
        <div class="autocomplete-item-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
          </svg>
        </div>
        <div class="autocomplete-item-text">
          <div class="autocomplete-item-name">${airport.city}, ${airport.country}</div>
          <div class="autocomplete-item-code">${airport.code} - ${airport.name}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        input.value = `${airport.city} (${airport.code})`;
        dropdown.classList.remove('open');
        input.closest('.search-input-group').classList.add('success');
      });

      dropdown.appendChild(item);
    });

    dropdown.classList.add('open');
  }

  // ==========================================================================
  // DATE PICKER INITIALIZATION
  // ==========================================================================
  function initDatePicker() {
    // Check if Flatpickr is available
    if (typeof flatpickr === 'undefined') {
      console.warn('⚠️ Flatpickr library not loaded');
      return;
    }

    flatpickr(elements.datesInput, {
      mode: 'range',
      dateFormat: 'M d, Y',
      minDate: 'today',
      monthSelectorType: 'static',
      onReady: function(selectedDates, dateStr, instance) {
        instance.calendarContainer.classList.add('hero-calendar');
      },
      onChange: function(selectedDates, dateStr, instance) {
        if (selectedDates.length === 2) {
          elements.datesInput.closest('.search-input-group').classList.add('success');
        }
      }
    });

    console.log('📅 Date picker initialized');
  }

  // ==========================================================================
  // TRAVELERS DROPDOWN
  // ==========================================================================
  function initTravelersDropdown() {
    const group = elements.travelersInput.closest('.search-input-group');
    let dropdown = group.querySelector('.travelers-dropdown');

    // Create dropdown if doesn't exist
    if (!dropdown) {
      dropdown = createTravelersDropdown();
      group.appendChild(dropdown);
    }

    let travelers = {
      adults: 1,
      children: 0,
      infants: 0,
      class: 'Economy'
    };

    elements.travelersInput.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Update travelers count
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (e.target.classList.contains('stepper-btn')) {
        const type = e.target.dataset.type;
        const action = e.target.dataset.action;
        
        if (action === 'increase') {
          travelers[type]++;
        } else if (action === 'decrease' && travelers[type] > 0) {
          travelers[type]--;
          if (type === 'adults' && travelers[type] === 0) {
            travelers[type] = 1; // Minimum 1 adult
          }
        }
        
        updateTravelersDisplay(dropdown, travelers);
      }
      
      if (e.target.classList.contains('class-option')) {
        dropdown.querySelectorAll('.class-option').forEach(opt => opt.classList.remove('selected'));
        e.target.classList.add('selected');
        travelers.class = e.target.textContent;
        updateTravelersDisplay(dropdown, travelers);
      }
      
      if (e.target.classList.contains('travelers-apply-btn')) {
        updateTravelersInput(travelers);
        dropdown.classList.remove('open');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!group.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });

    console.log('👥 Travelers dropdown initialized');
  }

  function createTravelersDropdown() {
    const dropdown = document.createElement('div');
    dropdown.classList.add('travelers-dropdown');
    dropdown.innerHTML = `
      <div class="traveler-row">
        <div class="traveler-label">Adults</div>
        <div class="traveler-controls">
          <button class="stepper-btn" data-type="adults" data-action="decrease">-</button>
          <span class="traveler-count" data-type="adults">1</span>
          <button class="stepper-btn" data-type="adults" data-action="increase">+</button>
        </div>
      </div>
      <div class="traveler-row">
        <div class="traveler-label">Children (2-12)</div>
        <div class="traveler-controls">
          <button class="stepper-btn" data-type="children" data-action="decrease">-</button>
          <span class="traveler-count" data-type="children">0</span>
          <button class="stepper-btn" data-type="children" data-action="increase">+</button>
        </div>
      </div>
      <div class="traveler-row">
        <div class="traveler-label">Infants (0-2)</div>
        <div class="traveler-controls">
          <button class="stepper-btn" data-type="infants" data-action="decrease">-</button>
          <span class="traveler-count" data-type="infants">0</span>
          <button class="stepper-btn" data-type="infants" data-action="increase">+</button>
        </div>
      </div>
      <div class="class-selector">
        <div class="class-selector-label">Cabin Class</div>
        <div class="class-options">
          <button class="class-option selected">Economy</button>
          <button class="class-option">Business</button>
          <button class="class-option">First</button>
        </div>
      </div>
      <button class="travelers-apply-btn">Apply</button>
    `;
    return dropdown;
  }

  function updateTravelersDisplay(dropdown, travelers) {
    dropdown.querySelector('[data-type="adults"]').textContent = travelers.adults;
    dropdown.querySelector('[data-type="children"]').textContent = travelers.children;
    dropdown.querySelector('[data-type="infants"]').textContent = travelers.infants;
  }

  function updateTravelersInput(travelers) {
    const total = travelers.adults + travelers.children + travelers.infants;
    const text = `${total} Traveler${total > 1 ? 's' : ''}, ${travelers.class}`;
    elements.travelersInput.value = text;
    elements.travelersInput.closest('.search-input-group').classList.add('success');
  }

  // ==========================================================================
  // ADVANCED OPTIONS TOGGLE
  // ==========================================================================
  function initAdvancedOptions() {
    if (!elements.advancedToggle || !elements.advancedPanel) return;

    elements.advancedToggle.addEventListener('click', () => {
      const isOpen = elements.advancedPanel.classList.toggle('open');
      elements.advancedToggle.classList.toggle('open', isOpen);
      
      console.log('⚙️ Advanced options', isOpen ? 'opened' : 'closed');
    });
  }

  // ==========================================================================
  // QUICK SEARCH SHORTCUTS
  // ==========================================================================
  function initQuickShortcuts() {
    elements.shortcutPills.forEach(pill => {
      pill.addEventListener('click', function() {
        const route = this.textContent.trim();
        const [from, to] = route.split('→').map(s => s.trim());
        
        // Find airports
        const fromAirport = AIRPORTS.find(a => a.city === from);
        const toAirport = AIRPORTS.find(a => a.city === to);
        
        if (fromAirport && elements.fromInput) {
          elements.fromInput.value = `${fromAirport.city} (${fromAirport.code})`;
          elements.fromInput.closest('.search-input-group').classList.add('success');
        }
        
        if (toAirport && elements.toInput) {
          elements.toInput.value = `${toAirport.city} (${toAirport.code})`;
          elements.toInput.closest('.search-input-group').classList.add('success');
        }
        
        console.log('✈️ Quick route selected:', route);
      });
    });
  }

  // ==========================================================================
  // SCROLL INDICATOR
  // ==========================================================================
  function initScrollIndicator() {
    if (!elements.scrollIndicator) return;

    elements.scrollIndicator.addEventListener('click', () => {
      const nextSection = elements.heroSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ==========================================================================
  // PARALLAX DECORATIVE AIRPLANES
  // ==========================================================================
  function initParallaxAirplanes() {
    if (!elements.decorativeAirplanes.length) return;

    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      elements.decorativeAirplanes.forEach((airplane, index) => {
        const factor = (index + 1) * 0.02;
        const moveX = (clientX - centerX) * factor;
        const moveY = (clientY - centerY) * factor;
        
        airplane.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });
  }

  // ==========================================================================
  // KEYBOARD SHORTCUTS
  // ==========================================================================
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // "/" focuses search
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        elements.fromInput?.focus();
      }
      
      // "Esc" clears form
      if (e.key === 'Escape') {
        clearForm();
      }
      
      // "Enter" submits search (if focused on inputs)
      if (e.key === 'Enter' && document.activeElement?.classList.contains('search-input')) {
        e.preventDefault();
        elements.searchButton?.click();
      }
    });
  }

  function clearForm() {
    const inputs = [elements.fromInput, elements.toInput, elements.datesInput, elements.travelersInput];
    inputs.forEach(input => {
      if (input) {
        input.value = '';
        input.closest('.search-input-group')?.classList.remove('success', 'error');
      }
    });
    
    console.log('🗑️ Form cleared');
  }

  // ==========================================================================
  // INTERSECTION OBSERVER - Pause animations when off-screen
  // ==========================================================================
  function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        } else {
          entry.target.style.animationPlayState = 'paused';
        }
      });
    }, { threshold: 0.1 });

    if (elements.particlesContainer) {
      observer.observe(elements.particlesContainer);
    }
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  function init() {
    console.log('🚀 Initializing Immersive Hero Section...');

    cacheElements();
    
    // Initialize all features
    initSlideshow();
    initParticles();
    initTypingAnimation();
    initCounterAnimations();
    initTripTypeTabs();
    initSearchForm();
    initAdvancedOptions();
    initQuickShortcuts();
    initScrollIndicator();
    initParallaxAirplanes();
    initKeyboardShortcuts();
    initIntersectionObserver();

    console.log('✅ Immersive Hero Section fully initialized!');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for external use
  window.DestinovaHero = {
    clearForm,
    getFormData,
    validateForm
  };

})();
