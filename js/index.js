// Floating search Bar Js Start here
    // Background Slider
    
    let slideIndex = 0;
    const slides = document.querySelectorAll('.bg-slide');
    
    function changeSlide() {
      slides[slideIndex].classList.remove('active');
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add('active');
    }
    
    setInterval(changeSlide, 6000);
    
    // Close Promo Banner - FIX CORNERS
    document.getElementById('closeBanner').addEventListener('click', function() {
      const promoBanner = document.getElementById('promoBanner');
      const searchCard = document.getElementById('searchCard');
      
      promoBanner.classList.add('hidden');
      searchCard.classList.add('promo-closed'); // Add class to round all corners
    });
    
    // Trip Tabs
    const tabs = document.querySelectorAll('.trip-tab');
    const indicator = document.querySelector('.trip-indicator');
    const returnBox = document.getElementById('returnBox');
    
    function updateIndicator(active) {
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.height = `${active.offsetHeight}px`;
      indicator.style.left = `${active.offsetLeft}px`;
      indicator.style.top = `${active.offsetTop}px`;
    }
    
    updateIndicator(tabs[0]);
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        updateIndicator(this);
        
        if (this.getAttribute('data-type') === 'oneway') {
          returnBox.style.display = 'none';
        } else {
          returnBox.style.display = 'flex';
        }
      });
    });
    
    // Fare Chips
    document.querySelectorAll('.fare-chip-btn').forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.fare-chip-btn').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departInput').setAttribute('min', today);
    document.getElementById('returnInput').setAttribute('min', today);
    
    // Modal
    const modal = document.getElementById('passengersModal');
    const trigger = document.getElementById('passengersTrigger');
    const closeBtn = document.getElementById('modalClose');
    const doneBtn = document.getElementById('modalDone');
    
    let counts = { infants: 0, children: 0, adults: 1, seniors: 0 };
    let selectedClass = 'economy';
    
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.removeAttribute('hidden');
    });
    
    closeBtn.addEventListener('click', () => modal.setAttribute('hidden', 'hidden'));
    modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.setAttribute('hidden', 'hidden'));
    
    document.querySelectorAll('.counter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        const cat = this.getAttribute('data-cat');
        const display = document.getElementById(`${cat}Count`);
        let val = parseInt(display.textContent);
        
        if (action === 'inc') {
          val++;
        } else if (action === 'dec' && val > 0) {
          if (cat === 'adults' && val === 1) return;
          val--;
        }
        
        display.textContent = val;
        counts[cat] = val;
      });
    });
    
    document.querySelectorAll('.class-card').forEach(card => {
      card.addEventListener('click', function() {
        document.querySelectorAll('.class-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        selectedClass = this.getAttribute('data-class');
      });
    });
    
    doneBtn.addEventListener('click', () => {
      const total = counts.infants + counts.children + counts.adults + counts.seniors;
      let text = '';
      
      if (total === 1 && counts.adults === 1) {
        text = '1 Adult';
      } else {
        const parts = [];
        if (counts.infants > 0) parts.push(`${counts.infants} Infant${counts.infants > 1 ? 's' : ''}`);
        if (counts.children > 0) parts.push(`${counts.children} Child${counts.children > 1 ? 'ren' : ''}`);
        if (counts.adults > 0) parts.push(`${counts.adults} Adult${counts.adults > 1 ? 's' : ''}`);
        if (counts.seniors > 0) parts.push(`${counts.seniors} Senior${counts.seniors > 1 ? 's' : ''}`);
        text = parts.join(', ');
      }
      
      const classes = {
        'economy': 'Economy',
        'premium': 'Premium',
        'business': 'Business',
        'first': 'First Class'
      };
      
      text += `, ${classes[selectedClass]}`;
      document.getElementById('passengersText').textContent = text;
      
      modal.setAttribute('hidden', 'hidden');
    });
    
    // Form - Search Flights with Backend API
    document.getElementById('searchForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form values
      const fromInput = document.getElementById('fromInput');
      const toInput = document.getElementById('toInput');
      const departInput = document.getElementById('departInput');
      const returnInput = document.getElementById('returnInput');
      const tripType = document.querySelector('.trip-tab.active')?.getAttribute('data-type') || 'roundtrip';
      
      // Validate inputs
      if (!fromInput.value || !toInput.value || !departInput.value) {
        alert('Please fill in all required fields');
        return;
      }
      
      // Get airport codes from the input values (e.g., "New Delhi (DEL)" -> "DEL")
      const fromMatch = fromInput.value.match(/\(([A-Z]{3})\)/);
      const toMatch = toInput.value.match(/\(([A-Z]{3})\)/);
      
      const from = fromMatch ? fromMatch[1] : fromInput.value;
      const to = toMatch ? toMatch[1] : toInput.value;
      
      // Prepare search params
      const searchParams = {
        from: from,
        to: to,
        date: departInput.value,
        returnDate: tripType === 'roundtrip' ? returnInput.value : undefined,
        passengers: counts.adults + counts.children + counts.seniors,
        class: selectedClass
      };
      
      // Save to recent searches
      const recentSearches = JSON.parse(localStorage.getItem('flightSearches') || '[]');
      recentSearches.unshift({ from, to, date: departInput.value, timestamp: Date.now() });
      localStorage.setItem('flightSearches', JSON.stringify(recentSearches.slice(0, 10)));
      localStorage.setItem('lastSearch', JSON.stringify(searchParams));
      
      // Check if API is available
      if (typeof window.DestinovaAPI !== 'undefined') {
        try {
          // Show loading state
          const searchBtn = document.querySelector('#searchForm button[type="submit"]');
          if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
          }
          
          // Call API
          const results = await window.DestinovaAPI.Flight.search(searchParams);
          
          // Store results and redirect
          localStorage.setItem('flightSearchResults', JSON.stringify(results));
          window.location.href = `booking.html?from=${from}&to=${to}&date=${departInput.value}`;
          
        } catch (error) {
          console.error('Flight search error:', error);
          // Fallback - redirect with params even if API fails
          window.location.href = `booking.html?from=${from}&to=${to}&date=${departInput.value}`;
        }
      } else {
        // API not loaded, redirect with params
        window.location.href = `booking.html?from=${from}&to=${to}&date=${departInput.value}`;
      }
    });

    // Recent Searches Button
    const recentBtn = document.querySelector('.recent-btn-inline');
    if (recentBtn) {
      recentBtn.addEventListener('click', function() {
        // Get recent searches from localStorage
        const recentSearches = JSON.parse(localStorage.getItem('flightSearches') || '[]');
        
        if (recentSearches.length === 0) {
          alert('📋 No recent searches found. Start searching for flights!');
        } else {
          let message = '📋 Recent Searches:\n\n';
          recentSearches.slice(0, 5).forEach((search, index) => {
            message += `${index + 1}. ${search.from} → ${search.to}\n`;
            if (search.date) message += `   Date: ${search.date}\n`;
          });
          alert(message);
        }
      });
    }

    // Popular Routes Quick Fill
    document.querySelectorAll('.popular-route-link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const from = this.dataset.from;
        const to = this.dataset.to;
        
        // Fill search form
        const fromInput = document.getElementById('fromInput');
        const toInput = document.getElementById('toInput');
        
        if (fromInput) fromInput.value = from;
        if (toInput) toInput.value = to;
        
        // Smooth scroll to search form
        document.getElementById('searchForm').scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        // Add pulse effect
        const searchCard = document.getElementById('searchCard');
        if (searchCard) {
          searchCard.style.animation = 'cardPulse 0.6s ease';
          setTimeout(() => {
            searchCard.style.animation = '';
          }, 600);
        }
      });
    });
  
// floting search Bar Js End here

    // ============================================
// TRUST STATISTICS ANIMATED COUNTERS
// ============================================

(function() {
  'use strict';
  
  const trustBar = document.getElementById('trustBar');
  
  if (!trustBar) return;
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  let hasAnimated = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, observerOptions);
  
  observer.observe(trustBar);
  
  function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    statNumbers.forEach((element, index) => {
      const target = parseInt(element.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const delay = index * 200; // Stagger animation
      const increment = target / (duration / 16); // 60fps
      
      let current = 0;
      
      setTimeout(() => {
        const timer = setInterval(() => {
          current += increment;
          
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          
          // Format number with K+ suffix for thousands and % for satisfaction rate
          if (target >= 1000) {
            element.textContent = Math.floor(current / 1000) + 'K+';
          } else if (target >= 90 && target <= 100) {
            // Satisfaction rate (percentage)
            element.textContent = Math.floor(current) + '%';
          } else {
            element.textContent = Math.floor(current) + '+';
          }
        }, 16);
      }, delay);
    });
  }
  
})();
// destination section js starts here
// ============================================
// AI RECOMMENDATIONS FILTER LOGIC
// ============================================

(function() {
  'use strict';
  
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.ai-destination-card');
  
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter');
      
      // Update active state
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      // Filter cards
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  
  // Heart icon toggle
  const heartIcons = document.querySelectorAll('.card-heart-icon');
  
  heartIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      icon.classList.toggle('saved');
      
      // Save to localStorage
      const card = icon.closest('.ai-destination-card');
      const destination = card.querySelector('.card-destination-title').textContent;
      
      let savedDestinations = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      
      if (icon.classList.contains('saved')) {
        if (!savedDestinations.includes(destination)) {
          savedDestinations.push(destination);
        }
      } else {
        savedDestinations = savedDestinations.filter(d => d !== destination);
      }
      
      localStorage.setItem('savedDestinations', JSON.stringify(savedDestinations));
    });
  });
  
  // View Details buttons
  const viewButtons = document.querySelectorAll('.card-view-button');
  
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.ai-destination-card');
      const destination = card.querySelector('.card-destination-title').textContent;
      
      alert(`Viewing details for ${destination}...`);
      // window.location.href = `destination-details.html?name=${encodeURIComponent(destination)}`;
    });
  });
  
  // Load saved destinations on page load
  const savedDestinations = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
  
  cards.forEach(card => {
    const destination = card.querySelector('.card-destination-title').textContent;
    const heartIcon = card.querySelector('.card-heart-icon');
    
    if (savedDestinations.includes(destination)) {
      heartIcon.classList.add('saved');
    }
  });
  
})();

// Add fadeInUp animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ============================================
// ENHANCED TRENDING DESTINATIONS FUNCTIONALITY
// ============================================

(function() {
  'use strict';

  // View Toggle (Grid/Map)
  const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
  const gridView = document.getElementById('gridView');
  const mapView = document.getElementById('mapView');

  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      // Update active state
      viewToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle views
      if (view === 'grid') {
        if (gridView) gridView.style.display = 'block';
        if (mapView) mapView.style.display = 'none';
      } else if (view === 'map') {
        if (gridView) gridView.style.display = 'none';
        if (mapView) mapView.style.display = 'block';
      }
    });
  });

  // Heart Icon Toggle (Save Destinations)
  const heartIcons = document.querySelectorAll('.trending-heart-icon');
  let savedTrendingDests = JSON.parse(localStorage.getItem('savedTrendingDestinations') || '[]');

  heartIcons.forEach(icon => {
    const destination = icon.dataset.destination;
    
    // Load saved state
    if (savedTrendingDests.includes(destination)) {
      icon.classList.add('saved');
    }

    icon.addEventListener('click', (e) => {
      e.preventDefault();
      icon.classList.toggle('saved');
      
      if (icon.classList.contains('saved')) {
        if (!savedTrendingDests.includes(destination)) {
          savedTrendingDests.push(destination);
        }
      } else {
        savedTrendingDests = savedTrendingDests.filter(d => d !== destination);
      }
      
      localStorage.setItem('savedTrendingDestinations', JSON.stringify(savedTrendingDests));
    });
  });

  // Quick View Button
  const quickViewBtns = document.querySelectorAll('.trending-quick-view-btn');
  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.trending-destination-card');
      const destName = card.querySelector('.trending-dest-name').textContent;
      alert(`Quick view for ${destName} - Opening detailed view...`);
      // window.location.href = `destination-details.html?name=${encodeURIComponent(destName)}`;
    });
  });

  // View All Destinations Button
  const viewAllBtn = document.querySelector('.trending-view-all-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      alert('Redirecting to destinations page...');
      // window.location.href = 'destinations.html';
    });
  }

})();


// destionation section js ends here

// ============================================
// FLASH DEALS COUNTDOWN TIMERS
// ============================================

(function() {
  'use strict';
  
  function initFlashDeals() {
    const timers = document.querySelectorAll('.flash-timer');
    
    if (timers.length === 0) return;
    
    timers.forEach(timer => {
      const countdownElement = timer.querySelector('.countdown');
      if (!countdownElement) return;
      
      // Set a random end time (between 2-24 hours from now)
      const hoursLeft = Math.floor(Math.random() * 22) + 2;
      const endTime = new Date(Date.now() + hoursLeft * 60 * 60 * 1000);
      
      function updateCountdown() {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) {
          countdownElement.textContent = 'EXPIRED';
          countdownElement.style.color = '#9ca3af';
          return;
        }
        
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.textContent = 
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Add urgency color when less than 2 hours
        if (distance < 2 * 60 * 60 * 1000) {
          countdownElement.style.color = '#ef4444';
          countdownElement.style.animation = 'urgentPulse 1s ease-in-out infinite';
        }
      }
      
      updateCountdown();
      setInterval(updateCountdown, 1000);
    });
    
    // Grab Deal button handlers
    const grabBtns = document.querySelectorAll('.flash-grab-btn');
    grabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const card = this.closest('.flash-deal-card');
        const destination = card.querySelector('.flash-destination').textContent;
        const price = card.querySelector('.flash-price-now').textContent;
        
        // Add to cart animation
        this.innerHTML = '<i class="fas fa-check"></i> <span>Added to Cart!</span>';
        this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        setTimeout(() => {
          alert(`🎉 Flash Deal Added!\n\n${destination}\nPrice: ${price}\n\nProceed to checkout?`);
        }, 500);
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlashDeals);
  } else {
    initFlashDeals();
  }
  
  // Add urgentPulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes urgentPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
    }
  `;
  document.head.appendChild(style);
  
})();

// flash deals section js ends here

// ============================================
// FAQ SECTION - ACCORDION & SEARCH
// ============================================

(function() {
  'use strict';
  
  function initFAQ() {
    // Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
    
    // Search functionality
    const searchInput = document.getElementById('faqSearchInput');
    
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        faqItems.forEach(item => {
          const questionText = item.querySelector('.faq-question-text').textContent.toLowerCase();
          const answerText = item.querySelector('.faq-answer p').textContent.toLowerCase();
          
          if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
            item.style.display = 'block';
            
            // Auto-expand if searching
            if (searchTerm.length > 0) {
              item.classList.add('active');
              item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
            }
          } else {
            item.style.display = 'none';
          }
        });
        
        // Show "no results" message if needed
        const visibleItems = Array.from(faqItems).filter(item => item.style.display !== 'none');
        
        if (visibleItems.length === 0 && searchTerm.length > 0) {
          // Could add a "no results" message here
          console.log('No FAQ results found');
        }
      });
    }
    
    // Helpful buttons
    const helpfulButtons = document.querySelectorAll('.faq-helpful-btn');
    
    helpfulButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const isYes = this.classList.contains('yes');
        const faqItem = this.closest('.faq-item');
        const question = faqItem.querySelector('.faq-question-text').textContent;
        
        // Visual feedback
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
        
        // Log feedback (in production, send to analytics)
        console.log(`FAQ Feedback: "${question}" was ${isYes ? 'helpful' : 'not helpful'}`);
        
        // Show thank you message
        const feedbackMsg = document.createElement('span');
        feedbackMsg.textContent = isYes ? '✓ Thank you!' : 'We\'ll improve this answer';
        feedbackMsg.style.color = isYes ? '#10b981' : '#f59e0b';
        feedbackMsg.style.fontWeight = '600';
        feedbackMsg.style.marginLeft = '8px';
        feedbackMsg.style.fontSize = '13px';
        
        const helpfulDiv = this.closest('.faq-helpful');
        
        // Remove existing feedback
        const existingFeedback = helpfulDiv.querySelector('span:last-child');
        if (existingFeedback && existingFeedback !== helpfulDiv.firstElementChild) {
          existingFeedback.remove();
        }
        
        helpfulDiv.appendChild(feedbackMsg);
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
  
})();

// faq section js ends here


// how it
/* ===============================================
   HOW IT WORKS SECTION - JAVASCRIPT
   Modern Interactions & Animations
   =============================================== */

(function() {
  'use strict';

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', initializeHowItWorks);

  function initializeHowItWorks() {
    // Initialize all components
    initAOS();
    initProgressLine();
    initCardTilt();
    initNumberCounter();
    initFeatureAnimation();
    initParallaxShapes();
    initIconRotation();
    initCardEntrance();
    initGradientAnimation();
    initButtonRipple();
    initSmoothScroll();
    initPerformanceOptimizations();
    initAccessibility();
    
    // Console branding
    consoleBranding();
  }

  /* ===============================================
     AOS (Animate On Scroll) Initialization
     =============================================== */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 0,
        disable: function() {
          return window.innerWidth < 768;
        },
        startEvent: 'DOMContentLoaded',
        initClassName: 'aos-init',
        animatedClassName: 'aos-animate',
        useClassNames: false,
        disableMutationObserver: false,
        debounceDelay: 50,
        throttleDelay: 99,
      });

      // Refresh AOS on dynamic content load
      window.addEventListener('load', function() {
        AOS.refresh();
      });
    }
  }

  /* ===============================================
     Progress Line Animation
     =============================================== */
  function initProgressLine() {
    const progressLine = document.querySelector('.animate-progress-line');
    const section = document.querySelector('.how-it-works-section');
    
    if (!progressLine || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            progressLine.style.width = '0%';
            setTimeout(() => {
              progressLine.style.transition = 'width 3s cubic-bezier(0.4, 0, 0.2, 1)';
              progressLine.style.width = '100%';
            }, 200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px' }
    );

    observer.observe(section);
  }

  /* ===============================================
     3D Card Tilt Effect
     =============================================== */
  function initCardTilt() {
    const cards = document.querySelectorAll('.step-card');
    
    if (window.innerWidth < 768) return; // Disable on mobile

    cards.forEach(card => {
      const cardElement = card.querySelector('div');
      if (!cardElement) return;

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('mouseenter', handleMouseEnter);

      function handleMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        cardElement.style.transform = `
          perspective(1000px) 
          rotateX(${-rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateY(-12px) 
          scale(1.02)
          translateZ(20px)
        `;
      }

      function handleMouseLeave() {
        cardElement.style.transform = '';
        cardElement.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }

      function handleMouseEnter() {
        cardElement.style.transition = 'none';
      }
    });
  }

  /* ===============================================
     Number Counter Animation
     =============================================== */
  function initNumberCounter() {
    const numberElements = document.querySelectorAll('.step-card .absolute span');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    numberElements.forEach(element => {
      observer.observe(element);
    });

    function animateNumber(element) {
      const targetText = element.textContent.trim();
      const targetNumber = parseInt(targetText);
      
      if (isNaN(targetNumber)) return;

      let currentNumber = 0;
      const duration = 1200;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        
        currentNumber = Math.floor(eased * targetNumber);
        element.textContent = String(currentNumber).padStart(2, '0');

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = String(targetNumber).padStart(2, '0');
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* ===============================================
     Feature List Staggered Animation
     =============================================== */
  function initFeatureAnimation() {
    const featureLists = document.querySelectorAll('.step-card ul');
    
    featureLists.forEach(list => {
      const items = list.querySelectorAll('li');
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateFeatures(items);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(list);
    });

    function animateFeatures(items) {
      items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
          item.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, index * 100);
      });
    }
  }

  /* ===============================================
     Parallax Background Shapes
     =============================================== */
  function initParallaxShapes() {
    const shapes = document.querySelectorAll('.how-it-works-section .absolute.blur-3xl');
    const section = document.querySelector('.how-it-works-section');
    
    if (!shapes.length || !section || window.innerWidth < 768) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      // Only animate when section is in viewport
      if (scrolled > sectionTop - window.innerHeight && 
          scrolled < sectionTop + sectionHeight) {
        
        const relativeScroll = scrolled - sectionTop;
        
        shapes.forEach((shape, index) => {
          const speed = (index + 1) * 0.05;
          const yPos = relativeScroll * speed;
          const xPos = Math.sin(relativeScroll * 0.001) * 20;
          
          shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
      }
    }
  }

  /* ===============================================
     Icon Rotation on Hover
     =============================================== */
  function initIconRotation() {
    const cards = document.querySelectorAll('.step-card');
    
    cards.forEach(card => {
      const icon = card.querySelector('.w-24 svg');
      
      if (!icon) return;

      card.addEventListener('mouseenter', () => {
        icon.style.transition = 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
        icon.style.transform = 'rotate(360deg) scale(1.15)';
      });

      card.addEventListener('mouseleave', () => {
        icon.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        icon.style.transform = 'rotate(0deg) scale(1)';
      });
    });
  }

  /* ===============================================
     Card Entrance Animation
     =============================================== */
  function initCardEntrance() {
    const cards = document.querySelectorAll('.step-card > div');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '0';
              entry.target.style.transform = 'translateY(60px) scale(0.95)';
              
              requestAnimationFrame(() => {
                entry.target.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
              });
            }, index * 150);
            
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    cards.forEach(card => {
      observer.observe(card);
    });
  }

  /* ===============================================
     Dynamic Gradient Animation
     =============================================== */
  function initGradientAnimation() {
    const title = document.querySelector('.how-it-works-section h2');
    
    if (!title) return;

    let hue = 158; // Starting hue for emerald
    let animationId;

    function animateGradient() {
      hue = (hue + 0.3) % 360;
      
      const color1 = `hsl(${hue}, 64%, 35%)`;
      const color2 = `hsl(${hue + 5}, 78%, 29%)`;
      const color3 = `hsl(${hue - 3}, 70%, 32%)`;
      
      title.style.backgroundImage = `linear-gradient(to right, ${color1}, ${color2}, ${color3})`;
      
      animationId = requestAnimationFrame(animateGradient);
    }

    // Start animation when in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateGradient();
          } else {
            cancelAnimationFrame(animationId);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(title);
  }

  /* ===============================================
     Button Ripple Effect
     =============================================== */
  function initButtonRipple() {
    const buttons = document.querySelectorAll('.how-it-works-section button, .cta-button');
    
    buttons.forEach(button => {
      button.addEventListener('click', createRipple);
    });

    function createRipple(e) {
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: ripple-effect 0.6s ease-out;
      `;
      
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    }

    // Add CSS for ripple animation
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple-effect {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ===============================================
     Smooth Scroll
     =============================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = offsetTop - 80; // Adjust for fixed header

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ===============================================
     Performance Optimizations
     =============================================== */
  function initPerformanceOptimizations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.documentElement.classList.add('reduced-animations');
    }

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
      const section = document.querySelector('.how-it-works-section');
      if (document.hidden) {
        section?.classList.add('paused');
      } else {
        section?.classList.remove('paused');
      }
    });

    // Lazy load images if any
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('.how-it-works-section img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  /* ===============================================
     Accessibility Enhancements
     =============================================== */
  function initAccessibility() {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.classList.add('reduce-motion');
      
      // Disable all animations
      const style = document.createElement('style');
      style.textContent = `
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Add keyboard navigation support
    const cards = document.querySelectorAll('.step-card');
    cards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', `Step ${index + 1}`);
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          card.click();
        }
      });
    });

    // Add ARIA labels
    const section = document.querySelector('.how-it-works-section');
    if (section) {
      section.setAttribute('aria-label', 'How it works process');
    }
  }

  /* ===============================================
     Console Branding
     =============================================== */
  function consoleBranding() {
    const styles = {
      title: 'color: #1d5e33; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 0 #E5CBAF;',
      subtitle: 'color: #c9a877; font-size: 14px; font-weight: 600;',
      info: 'color: #2a7d4a; font-size: 12px;'
    };

    console.log('%c🚀 Destinova Flight Booking', styles.title);
    console.log('%c✈️  Built with Tailwind CSS & Modern JavaScript', styles.subtitle);
    console.log('%c📍 Version 2.0 | 2025', styles.info);
  }

  /* ===============================================
     Utility Functions
     =============================================== */
  
  // Debounce function for scroll events
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

  // Throttle function for scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Expose utilities to window object if needed
  window.DestinovaUtils = {
    debounce,
    throttle,
    isInViewport
  };

})();

/* ===============================================
   Additional Event Listeners
   =============================================== */

// Handle window resize
window.addEventListener('resize', debounce(function() {
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}, 250));

// Handle orientation change
window.addEventListener('orientationchange', function() {
  setTimeout(() => {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, 300);
});

// Function helper for debounce (defined outside IIFE for reuse)
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
// Enhanced Progress Line with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
  
  // Animate Progress Line on Scroll
  const progressLine = document.querySelector('.progress-line-animated');
  if (progressLine) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressLine.style.animation = 'progress-expand 3s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(progressLine);
  }
  
  // Enhanced Card Lift Effect with Depth
  const cards = document.querySelectorAll('.step-card');
  cards.forEach((card, index) => {
    card.style.setProperty('--index', index);
    
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });
  
  // Number Counter with Easing
  const stats = document.querySelectorAll('.step-card .absolute span');
  const observerStats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        observerStats.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => observerStats.observe(stat));
  
  function animateValue(element) {
    const target = parseInt(element.textContent);
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.floor(start + (target - start) * eased);
      
      element.textContent = current.toString().padStart(2, '0');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }
  
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
});
// Enhanced Interactions for Polished Version
document.addEventListener('DOMContentLoaded', function() {
  
  // Icon Pulse Animation on Page Load
  setTimeout(() => {
    const icons = document.querySelectorAll('.icon-container');
    icons.forEach((icon, index) => {
      setTimeout(() => {
        icon.classList.add('animate-icon-pulse');
      }, index * 300);
    });
  }, 500);
  
  // Enhanced Button Click Effect
  const ctaButton = document.querySelector('.group\\/btn');
  if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
      // Create ripple
      const ripple = document.createElement('div');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: button-ripple 0.8s ease-out;
        z-index: 0;
      `;
      
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    });
  }
  
  // Sparkle Animation for Trust Badge
  const trustBadge = document.querySelector('.animate-sparkle');
  if (trustBadge) {
    setInterval(() => {
      trustBadge.style.animation = 'none';
      setTimeout(() => {
        trustBadge.style.animation = 'sparkle 3s ease-in-out';
      }, 10);
    }, 5000);
  }
  
  // Progress Line with Enhanced Timing
  const progressLine = document.querySelector('.progress-line-animated');
  if (progressLine) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            progressLine.style.width = '100%';
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(progressLine);
  }
  
  // Enhanced Card Hover with Depth
  const cards = document.querySelectorAll('.step-card > div');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '20';
    });
    
    card.addEventListener('mouseleave', function() {
      setTimeout(() => {
        this.style.zIndex = '1';
      }, 500);
    });
  });
  
  // Smooth Number Counter for Step Numbers
  const stepNumbers = document.querySelectorAll('.step-card .absolute span');
  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.textContent);
        let currentValue = 0;
        
        const interval = setInterval(() => {
          if (currentValue < finalValue) {
            currentValue++;
            target.textContent = String(currentValue).padStart(2, '0');
          } else {
            clearInterval(interval);
          }
        }, 80);
        
        numberObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  stepNumbers.forEach(num => numberObserver.observe(num));
  
});

// Add CSS for icon pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes icon-pulse-load {
    0% {
      transform: scale(0.8);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.15);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .animate-icon-pulse {
    animation: icon-pulse-load 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;
document.head.appendChild(style);
// 3 step  section js starts here

/* ===============================================
   FARE CALENDAR - PRODUCTION JAVASCRIPT
   =============================================== */

(function() {
  'use strict';

  // Sample comprehensive price data
  const priceData = {
    '2025-03': {
      1: 420, 2: 385, 3: 405, 4: 390, 5: 510, 6: 620, 7: 580,
      8: 395, 9: 375, 10: 410, 11: 425, 12: 530, 13: 640, 14: 615,
      15: 360, 16: 380, 17: 400, 18: 415, 19: 520, 20: 635, 21: 610,
      22: 390, 23: 370, 24: 405, 25: 420, 26: 535, 27: 650, 28: 625,
      29: 385, 30: 375, 31: 410
    }
  };

  let currentMonth = '2025-03';
  let selectedDay = null;
  let clickCount = 0;
  let clickTimeout = null;

  // Initialize
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    renderCalendar();
    initializeEventListeners();
    animateConfidenceMeter();
    initEasterEgg();
  }

  // Render Calendar with full functionality
  function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-days');
    if (!calendarGrid) return;

    calendarGrid.innerHTML = '';
    
    const prices = priceData[currentMonth];
    const minPrice = Math.min(...Object.values(prices));
    const maxPrice = Math.max(...Object.values(prices));
    const daysInMonth = Object.keys(prices).length;

    // Determine first day of month (for grid positioning)
    const firstDay = new Date(currentMonth + '-01').getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1; // Monday = 0

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day-placeholder';
      calendarGrid.appendChild(emptyCell);
    }

    // Render actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const price = prices[day];
      const date = new Date(`${currentMonth}-${String(day).padStart(2, '0')}`);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isBestPrice = price === minPrice;
      
      // Calculate trend
      const prevPrice = day > 1 ? prices[day - 1] : null;
      let trend = null;
      if (prevPrice) {
        if (price > prevPrice + 20) trend = 'up';
        else if (price < prevPrice - 20) trend = 'down';
      }
      
      const dayCell = createDayCell(day, price, isBestPrice, isWeekend, trend);
      calendarGrid.appendChild(dayCell);
    }
  }

  function createDayCell(day, price, isBestPrice, isWeekend, trend) {
    const cell = document.createElement('div');
    cell.className = `calendar-day ${isBestPrice ? 'best-price' : ''} ${isWeekend ? 'weekend' : ''}`;
    cell.dataset.day = day;
    cell.dataset.price = price;
    cell.tabIndex = 0;
    
    cell.innerHTML = `
      <div class="day-number">${day}</div>
      <div class="price">$${price}</div>
      ${trend ? `
        <svg class="trend-arrow ${trend}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="${trend === 'up' ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M19 12l-7 7-7-7'}"></path>
        </svg>
      ` : ''}
    `;
    
    // Event listeners
    cell.addEventListener('click', () => selectDay(cell, day, price));
    cell.addEventListener('mouseenter', (e) => showTooltip(e, day, price));
    cell.addEventListener('mouseleave', hideTooltip);
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectDay(cell, day, price);
      }
    });
    
    return cell;
  }

  // Day Selection with Ripple
  function selectDay(cell, day, price) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Add selection
    cell.classList.add('selected');
    selectedDay = day;
    
    // Create ripple effect
    createRipple(cell);
    
    // Update best day display
    updateBestDayDisplay(day, price);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  function createRipple(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, rgba(229, 203, 175, 0.6) 0%, transparent 70%);
      border-radius: 12px;
      pointer-events: none;
      animation: ripple-expand 0.8s ease-out;
      z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  }

  // Enhanced Tooltip
  function showTooltip(event, day, price) {
    const tooltip = document.getElementById('price-tooltip');
    if (!tooltip) return;
    
    const cell = event.currentTarget;
    const rect = cell.getBoundingClientRect();
    
    const avgPrice = calculateAveragePrice();
    const savings = avgPrice - price;
    const savingsPercent = Math.round((savings / avgPrice) * 100);
    
    tooltip.querySelector('.tooltip-content').innerHTML = `
      <div class="font-bold text-lg text-[#164426] mb-3">
        <div class="flex items-center justify-between">
          <span>March ${day}, 2025</span>
          ${cell.classList.contains('weekend') ? '<span class="text-xs bg-[#e8f4ed] text-[#2a7d4a] px-2 py-1 rounded-full">Weekend</span>' : ''}
        </div>
      </div>
      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">Flight Price:</span>
          <span class="text-xl font-bold text-[#1d5e33]">$${price}</span>
        </div>
        ${savings > 0 ? `
          <div class="flex items-center justify-between">
            <span class="text-gray-600">You Save:</span>
            <span class="text-lg font-bold text-[#2a7d4a]">$${Math.round(savings)} (${savingsPercent}%)</span>
          </div>
        ` : savings < 0 ? `
          <div class="flex items-center justify-between">
            <span class="text-gray-600">vs Average:</span>
            <span class="text-sm font-semibold text-[#dc3545]">+$${Math.abs(Math.round(savings))}</span>
          </div>
        ` : ''}
        <div class="pt-2 mt-2 border-t border-gray-100">
          <div class="flex items-start gap-2 text-xs text-gray-500">
            <svg class="w-4 h-4 text-[#2a7d4a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${getFlightDetails(day)}</span>
          </div>
        </div>
      </div>
    `;
    
    // Position tooltip
    const scrollY = window.scrollY || window.pageYOffset;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top + scrollY - 10}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
    tooltip.classList.remove('hidden');
  }

  function hideTooltip() {
    const tooltip = document.getElementById('price-tooltip');
    if (tooltip) {
      tooltip.classList.add('hidden');
    }
  }

  function calculateAveragePrice() {
    const prices = Object.values(priceData[currentMonth]);
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  }

  function getFlightDetails(day) {
    const date = new Date(`${currentMonth}-${day}`);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    return isWeekend 
      ? '8 flights available · Avg 7h 45m · Weekend pricing'
      : '15 flights available · Avg 7h 20m · Weekday rates';
  }

  function updateBestDayDisplay(day, price) {
    const display = document.getElementById('best-day-display');
    if (!display) return;
    
    const minPrice = Math.min(...Object.values(priceData[currentMonth]));
    const savings = price - minPrice;
    
    display.style.animation = 'none';
    setTimeout(() => {
      display.textContent = `March ${day} - ${savings > 0 ? `Save $${savings}!` : 'Best Price!'}`;
      display.style.animation = 'fade-in-up 0.5s ease-out';
    }, 10);
  }

  // Event Listeners
  function initializeEventListeners() {
    // Month navigation
    document.querySelector('.month-prev')?.addEventListener('click', () => changeMonth(-1));
    document.querySelector('.month-next')?.addEventListener('click', () => changeMonth(1));
    
    // Change route
    document.querySelector('.change-route-btn')?.addEventListener('click', changeRoute);
    
    // Price alert
    document.querySelector('.price-alert-btn')?.addEventListener('click', setPriceAlert);
  }

  function changeMonth(direction) {
    const display = document.querySelector('.month-display');
    if (display) {
      display.style.opacity = '0';
      display.style.transform = direction > 0 ? 'translateX(20px)' : 'translateX(-20px)';
      
      setTimeout(() => {
        display.textContent = direction > 0 ? 'April 2025' : 'February 2025';
        display.style.transition = 'all 0.3s ease-out';
        display.style.opacity = '1';
        display.style.transform = 'translateX(0)';
      }, 300);
    }
    
    renderCalendar();
  }

  function changeRoute() {
    console.log('Change route clicked');
    // Implement route change modal
  }

  function setPriceAlert() {
    const btn = document.querySelector('.price-alert-btn');
    if (!btn || btn.classList.contains('active')) return;
    
    btn.classList.add('active');
    
    // Icon change
    const bellIcon = btn.querySelector('.bell-icon');
    if (bellIcon) {
      bellIcon.outerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      `;
    }
    
    btn.querySelector('span').textContent = 'Alert Set!';
    
    // Confetti
    createConfetti(btn);
    
    // Reset after 2.5s
    setTimeout(() => {
      btn.classList.remove('active');
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span>Set Price Alert</span>
      `;
    }, 2500);
  }

  // Confetti Effect
  function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#1d5e33', '#2a7d4a', '#3a9c60', '#c9a877', '#E5CBAF'];
    
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 8 + 4;
      const tx = (Math.random() - 0.5) * 300;
      const ty = (Math.random() - 0.5) * 300;
      const rotation = Math.random() * 720;
      
      confetti.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        --tx: ${tx}px;
        --ty: ${ty}px;
        --r: ${rotation}deg;
        animation: confetti-burst ${0.8 + Math.random() * 0.4}s ease-out forwards;
      `;
      
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1200);
    }
  }

  // Animate Confidence Meter
  function animateConfidenceMeter() {
    const fill = document.querySelector('.confidence-fill');
    const value = document.querySelector('.confidence-value');
    
    if (fill && value) {
      setTimeout(() => {
        fill.classList.add('animate');
        
        // Animate number
        let current = 0;
        const target = 92;
        const duration = 1500;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          value.textContent = Math.round(current) + '%';
        }, 16);
      }, 1000);
    }
  }

  // Easter Egg: Triple Click Title
  function initEasterEgg() {
    const title = document.getElementById('calendar-title');
    if (!title) return;
    
    title.addEventListener('click', () => {
      clickCount++;
      
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        clickCount = 0;
      }, 1000);
      
      if (clickCount === 3) {
        triggerEasterEgg();
        clickCount = 0;
      }
    });
  }

  function triggerEasterEgg() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.remove('hidden');
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#1d5e33', '#2a7d4a', '#3a9c60', '#c9a877', '#E5CBAF', '#f5e8d8'];
    
    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        shape: Math.random() > 0.5 ? 'circle' : 'square'
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        
        ctx.restore();
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.rotation += p.rotationSpeed;
        
        if (p.y > canvas.height + 50) {
          particles.splice(index, 1);
        }
      });
      
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        canvas.classList.add('hidden');
      }
    }
    
    animate();
    
    // Play success sound if available
    if (window.Audio) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVank');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }

  // Add dynamic CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-expand {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
    
    @keyframes confetti-burst {
      to {
        transform: translate(var(--tx), var(--ty)) rotate(var(--r));
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

})();
// Travel Dates Section JS ends here



 

// Baggage & Seat Cost Estimator - JavaScript starts here
(function() {
  'use strict';

  // --- Localized INR pricing for demo ---
  const fareData = {
    basic: {
      basePrice: 32000,
    },
    standard: {
      basePrice: 39500,
    },
    premium: {
      basePrice: 52000,
    }
  };
  // Addon options must match HTML data-price!
  const baggagePrices = {none: 0, "1bag": 3750, "2bags": 7500, extra: 10000};
  const seatPrices = {random: 0, standard: 2100, legroom: 5400, premium: 10000};

  let state = {
    baggage: 3750, // default (1 bag)
    seat: 0, // default (random)
    priority: false,
    lounge: false,
    selectedFare: null
  };

  function updateAllPrices(){
    // Read options
    state.baggage = +document.querySelector('input[name="baggage"]:checked').dataset.price;
    state.seat = +document.querySelector('input[name="seat"]:checked').dataset.price;
    state.priority = document.querySelector('.toggle-input[data-price="1250"]').checked ? 1250 : 0;
    state.lounge = document.querySelector('.toggle-input[data-price="3300"]').checked ? 3300 : 0;
    // Fare card computation
    ["basic","standard","premium"].forEach(fare=>{
      const card = document.querySelector(`[data-fare="${fare}"]`);
      let addons = 0;
      // Each fare includes varying baggage/seat/priority coverage:
      let base = fareData[fare].basePrice;
      if(fare==="basic"){
        // All addons
        addons = state.baggage + state.seat + state.priority + state.lounge;
      } else if(fare==="standard"){
        // 1 bag, standard seat incl, priority + lounge extra
        let extraBag = Math.max(0,state.baggage-3750); // 1 basic included
        let seatExtra = Math.max(0,state.seat-2100); // std seat included
        addons = extraBag + seatExtra + state.priority + state.lounge;
      } else if(fare==="premium"){
        // 2 bags, premium seat, priority incl, lounge extra
        let extraBag = Math.max(0,state.baggage-7500); // 2 included
        let seatExtra = Math.max(0,state.seat-10000); // premium included
        let priorityExtra = 0; // included
        addons = extraBag + seatExtra + priorityExtra + state.lounge;
      }
      let total = base + addons;
      // Animate main price values
      animateNumber(card.querySelector('.base-price'),+card.querySelector('.base-price').textContent,base);
      animateNumber(card.querySelector('.addon-price'),+card.querySelector('.addon-price').textContent||0,addons);
      let totalElem=card.querySelector('.total-price');
      animateNumber(totalElem,+totalElem.textContent,total);
      totalElem.classList.add('price-flash');
      setTimeout(()=>totalElem.classList.remove('price-flash'),650);
    });
    updateBestValueTip();
  }

  function animateNumber(elem, from, to){
    if(from===to) return;
    let start = performance.now();
    function update(now){
      let p = Math.min((now-start)/500,1);
      elem.textContent = Math.round(from+(to-from)*p).toLocaleString("en-IN");
      if(p<1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Smart tip and Best Value badge logic
  function updateBestValueTip(){
    // Compute actual totals
    const getTotal = f=>{
      const card = document.querySelector(`[data-fare="${f}"]`);
      return +card.querySelector('.total-price').textContent.replace(/\D/g,'');
    };
    let t_basic=getTotal("basic"), t_std=getTotal("standard"), t_prem=getTotal("premium");
    // Tip message
    let tip = document.querySelector('.tip-message');
    let smartCont = document.querySelector('.smart-tip-container');
    if(!tip) return;
    if(t_std<t_basic-10){
      smartCont.classList.remove('hidden');
      tip.textContent = `Standard fare saves you ₹${(t_basic-t_std).toLocaleString('en-IN')} vs Basic + add-ons!`;
    } else if (t_prem<t_basic-10 && t_prem<t_std-10){
      smartCont.classList.remove('hidden');
      tip.textContent = `Premium fare lets you enjoy extra luxury for only ₹${(t_prem-t_basic).toLocaleString('en-IN')} more.`;
    } else {
      smartCont.classList.add('hidden');
    }
  }

  // Timer
  let timer = 14*60+32;
  function tickTimer(){
    let el=document.querySelector('.timer-display');
    if(el){
      timer--; if(timer<0) timer=0;
      let m=Math.floor(timer/60),s=timer%60;
      el.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
      if(timer<300) el.classList.add('urgent'); else el.classList.remove('urgent');
      if(timer>0) setTimeout(tickTimer,1000);
    }
  }

  // Option select (radio toggles + styling)
  function handleOptionRadios(){
    document.querySelectorAll('.option-container input[type=radio]').forEach(input=>{
      input.addEventListener('change',e=>{
        document.querySelectorAll(`input[name=${e.target.name}]`).forEach(ip=>ip.closest('.option-container').classList.remove('selected'));
        input.closest('.option-container').classList.add('selected');
        updateAllPrices();
      });
    });
  }

  // Toggle switches appearance
  document.querySelectorAll('.toggle-input').forEach(toggle=>{
    toggle.addEventListener('change',updateAllPrices);
  });

  // Fare card select handlers and micro-animation
  document.querySelectorAll('.select-fare-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      document.querySelectorAll('.fare-card').forEach(card=>card.classList.remove('selected'));
      let card = e.target.closest('.fare-card');
      card.classList.add('selected');
      // Flash total, show toast if best value
    });
  });

  // Comparison tooltips
  document.querySelectorAll('.fare-card').forEach(card=>{
    card.addEventListener('mouseenter',function(e){
      if(card.querySelector('.card-tooltip')) return; 
      // Show tooltip with cost breakdown
      let base = card.querySelector('.base-price').textContent,
          addon = card.querySelector('.addon-price').textContent,
          total = card.querySelector('.total-price').textContent;
      let tt = document.createElement('div');
      tt.className="card-tooltip";
      tt.innerHTML=`<div class="cdt-head"><strong>Cost Breakdown</strong></div>
      <div class="cdt"><span>Base Fare</span><span>₹${base}</span></div>
      <div class="cdt"><span>Add-ons</span><span>+₹${addon}</span></div>
      <div class="cdt-head"></div>
      <div class="cdt cdt-foot"><span>Total</span><span>₹${total}</span></div>`;
      card.appendChild(tt);
    });
    card.addEventListener('mouseleave',function(e){
      let tt = card.querySelector('.card-tooltip');
      if(tt) tt.remove();
    });
  })

  // Initial
  handleOptionRadios();
  updateAllPrices();
  setTimeout(tickTimer,1000);

  // Accessibility: focus ring on enter
  document.querySelectorAll('.option-container').forEach(cont=>{
    cont.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){
        cont.querySelector('input').checked=true;
        updateAllPrices();
      }
    });
  });

  // Section title easter egg
  let click = 0, to=null;
  document.getElementById('calculator-title').addEventListener('click',()=>{
    click++;
    clearTimeout(to);
    to = setTimeout(()=>click=0,900); 
    if(click===3){alert("🎉 Secret Promo: FLYTRUE10 for 10% off!");}
  });

})();

// BAGGAGE & SEAT COST ESTIMATOR - JAVASCRIPT ends here



// Visa & Entry Rules Checker Section js strat here

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', initializeVisaChecker);

  function initializeVisaChecker() {
    // Initialize all components
    initFloatingParticles();
    initParallaxEffects();
    initPurposeButtons();
    initSlider();
    initCloseButtons();
    initFormInteractions();
    initAccessibility();
    initSaveButtons();
  }

  // Floating particles animation
  function initFloatingParticles() {
    const particles = document.querySelectorAll('.floating-particles .particle');
    particles.forEach(particle => {
      const duration = 12 + Math.random() * 8;
      const delay = Math.random() * duration;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
    });
  }

  // Parallax lens flare effects
  function initParallaxEffects() {
    const section = document.getElementById('visa-entry-rules-checker');
    const flares = document.querySelectorAll('.lens-flare');
    const maxTranslateX = 12;
    let ticking = false;

    function updateParallax(event) {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = event && event.clientX ? event.clientX : window.innerWidth / 2;
        const mouseY = event && event.clientY ? event.clientY : window.innerHeight / 2;
        const moveX = (mouseX - centerX) / rect.width;
        const moveY = (mouseY - centerY) / rect.height;
        flares.forEach((flare, idx) => {
          const intensity = (idx + 1) / flares.length;
          const translateX = maxTranslateX * intensity * moveX;
          const translateY = maxTranslateX * intensity * moveY * 0.5;
          flare.style.transform = `translate(${translateX}px, ${translateY}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }

    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      window.addEventListener('mousemove', updateParallax);
      window.addEventListener('scroll', () => updateParallax({ 
        clientX: window.innerWidth / 2, 
        clientY: window.innerHeight / 2 
      }));
    }
  }

  // Purpose button toggle
  function initPurposeButtons() {
    const purposeButtons = document.querySelectorAll('.purpose-btn');
    purposeButtons.forEach((btn, i, group) => {
      btn.addEventListener('click', function() {
        group.forEach(b => {
          b.classList.remove('selected');
        });
        this.classList.add('selected');
        
        // Add smooth feedback animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });
  }

  // Slider with live value update
  function initSlider() {
    const slider = document.getElementById('staySlider');
    const valueDisplay = document.getElementById('stayValue');
    
    if (slider && valueDisplay) {
      slider.addEventListener('input', function() {
        const days = this.value;
        valueDisplay.textContent = `${days} ${days === '1' ? 'day' : 'days'}`;
        
        // Update slider track fill
        const percentage = ((days - this.min) / (this.max - this.min)) * 100;
        this.style.background = `linear-gradient(to right, #10b981 0%, #10b981 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
      });
      
      // Trigger initial update
      slider.dispatchEvent(new Event('input'));
    }
  }

  // Close alert buttons
  function initCloseButtons() {
    const closeButtons = document.querySelectorAll('.close-alert-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const alert = this.closest('.passport-expiry-alert');
        if (alert) {
          alert.style.opacity = '0';
          alert.style.transform = 'translateX(-20px)';
          setTimeout(() => {
            alert.style.display = 'none';
          }, 300);
        }
      });
    });
  }

  // Form interactions and validation
  function initFormInteractions() {
    // Select dropdowns
    const selects = document.querySelectorAll('.visa-select');
    selects.forEach(select => {
      select.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });
      
      select.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
      });
      
      select.addEventListener('change', function() {
        // Add change animation
        this.style.transform = 'scale(1.02)';
        setTimeout(() => {
          this.style.transform = '';
        }, 200);
      });
    });

    // Resource links
    const resourceLinks = document.querySelectorAll('.resource-link');
    resourceLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Add click feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });
  }

  // Accessibility enhancements
  function initAccessibility() {
    // Focus visible for keyboard navigation
    const focusableElements = document.querySelectorAll(
      '#visa-entry-rules-checker input, #visa-entry-rules-checker select, #visa-entry-rules-checker button, #visa-entry-rules-checker a'
    );
    
    focusableElements.forEach(el => {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          this.classList.add('keyboard-focus');
        }
      });
      
      el.addEventListener('mousedown', function() {
        this.classList.remove('keyboard-focus');
      });
    });

    // Announce changes to screen readers
    const formInputs = document.querySelectorAll('#visa-entry-rules-checker input, #visa-entry-rules-checker select');
    formInputs.forEach(input => {
      input.addEventListener('change', function() {
        const liveRegion = document.querySelector('.visa-results-card');
        if (liveRegion) {
          liveRegion.setAttribute('aria-atomic', 'true');
        }
      });
    });
  }

  // Save and Email buttons
  function initSaveButtons() {
    const saveTripBtn = document.querySelector('.save-trip-btn');
    const emailReqBtn = document.querySelector('.email-req-btn');
    
    if (saveTripBtn) {
      saveTripBtn.addEventListener('click', function() {
        // Add success feedback
        const originalText = this.innerHTML;
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Saved!</span>
        `;
        this.style.background = 'linear-gradient(to right, #047857, #059669)';
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.style.background = '';
        }, 2000);
      });
    }
    
    if (emailReqBtn) {
      emailReqBtn.addEventListener('click', function() {
        // Add sending feedback
        const originalText = this.innerHTML;
        this.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="w-[18px] h-[18px] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          <span>Sending...</span>
        `;
        
        setTimeout(() => {
          this.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Sent!</span>
          `;
          
          setTimeout(() => {
            this.innerHTML = originalText;
          }, 1500);
        }, 1500);
      });
    }
  }

})();


// Visa & Entry Rules Checker Section end here


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRICE TRACKING SECTION - ENHANCED FUNCTIONALITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', () => {
    initPriceTracking();
  });

  function initPriceTracking() {
    // Initialize all sub-modules
    initRadioButtons();
    initCheckboxes();
    initPriceInput();
    initActionButtons();
    initChartInteractions();
    initActiveAlerts();
    initAnimations();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RADIO BUTTON CARD SELECTION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initRadioButtons() {
    const radioOptions = document.querySelectorAll('.price-radio-option');
    const radioInputs = document.querySelectorAll('input[type="radio"][name="price-alert"]');

    radioOptions.forEach((option, index) => {
      option.addEventListener('click', function() {
        // Remove selected class from all options
        radioOptions.forEach(opt => opt.classList.remove('radio-selected'));
        
        // Add selected class to clicked option
        this.classList.add('radio-selected');
        
        // Check the corresponding radio input
        const radioInput = this.querySelector('input[type="radio"]');
        if (radioInput) {
          radioInput.checked = true;
        }

        // Animate selection
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);

        // Enable/disable price input based on selection
        const priceInput = document.querySelector('.price-input');
        if (index === 0 && priceInput) {
          priceInput.removeAttribute('disabled');
          priceInput.focus();
        } else if (priceInput) {
          priceInput.setAttribute('disabled', 'true');
        }
      });

      // Keyboard accessibility
      option.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Handle radio input change directly
    radioInputs.forEach(radio => {
      radio.addEventListener('change', function() {
        const parentOption = this.closest('.price-radio-option');
        if (parentOption && !parentOption.classList.contains('radio-selected')) {
          parentOption.click();
        }
      });
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CHECKBOX VALIDATION & ANIMATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initCheckboxes() {
    const checkboxOptions = document.querySelectorAll('.checkbox-option');
    const checkboxInputs = document.querySelectorAll('.checkbox-option input[type="checkbox"]');

    checkboxOptions.forEach(option => {
      option.addEventListener('click', function(e) {
        // Don't trigger if clicking on the input itself
        if (e.target.type === 'checkbox') return;

        const checkbox = this.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          
          // Trigger change event manually
          const event = new Event('change', { bubbles: true });
          checkbox.dispatchEvent(event);
        }
      });
    });

    checkboxInputs.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const indicator = this.nextElementSibling;
        const checkIcon = indicator?.querySelector('.check-icon');

        if (this.checked) {
          // Show check icon
          if (checkIcon) {
            checkIcon.style.display = 'block';
          }
          
          // Validate at least one is checked
          validateCheckboxes();
        } else {
          // Hide check icon
          if (checkIcon) {
            checkIcon.style.display = 'none';
          }
          
          // Ensure at least one remains checked
          const allCheckboxes = document.querySelectorAll('.checkbox-option input[type="checkbox"]');
          const anyChecked = Array.from(allCheckboxes).some(cb => cb.checked);
          
          if (!anyChecked) {
            this.checked = true;
            if (checkIcon) {
              checkIcon.style.display = 'block';
            }
            showNotification('At least one notification method must be selected', 'warning');
          }
        }
      });
    });

    // Initial state setup
    checkboxInputs.forEach(checkbox => {
      const indicator = checkbox.nextElementSibling;
      const checkIcon = indicator?.querySelector('.check-icon');
      if (checkIcon) {
        checkIcon.style.display = checkbox.checked ? 'block' : 'none';
      }
    });
  }

  function validateCheckboxes() {
    const checkboxes = document.querySelectorAll('.checkbox-option input[type="checkbox"]');
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    return anyChecked;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PRICE INPUT VALIDATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initPriceInput() {
    const priceInput = document.querySelector('.price-input');
    if (!priceInput) return;

    // Format input on blur
    priceInput.addEventListener('blur', function() {
      const value = parseInt(this.value);
      
      if (isNaN(value) || value < 1000) {
        this.value = '1000';
        this.classList.add('error');
        setTimeout(() => this.classList.remove('error'), 500);
        showNotification('Minimum price is ₹1,000', 'error');
      } else if (value > 999999) {
        this.value = '999999';
        this.classList.add('error');
        setTimeout(() => this.classList.remove('error'), 500);
        showNotification('Maximum price is ₹9,99,999', 'error');
      } else {
        this.value = value;
        this.classList.remove('error');
      }
    });

    // Allow only numeric input
    priceInput.addEventListener('keypress', function(e) {
      if (e.key < '0' || e.key > '9') {
        e.preventDefault();
      }
    });

    // Real-time validation
    priceInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, '');
      
      if (this.value.length > 6) {
        this.value = this.value.slice(0, 6);
      }
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACTION BUTTONS (CREATE ALERT & EMAIL)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initActionButtons() {
    const createAlertBtn = document.querySelector('.primary-cta');
    const emailDealBtn = document.querySelector('.secondary-cta');

    if (createAlertBtn) {
      createAlertBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
          return;
        }

        // Show loading state
        this.classList.add('loading');
        this.disabled = true;
        const originalText = this.innerHTML;
        this.innerHTML = '<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/></svg> Creating Alert...';

        // Simulate API call
        setTimeout(() => {
          this.classList.remove('loading');
          this.disabled = false;
          this.innerHTML = originalText;
          
          showNotification('Price alert created successfully!', 'success');
          
          // Confetti effect
          if (typeof confetti !== 'undefined') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }, 1500);
      });
    }

    if (emailDealBtn) {
      emailDealBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show email input modal or inline form
        const email = prompt('Enter your email address:');
        
        if (email && validateEmail(email)) {
          this.classList.add('loading');
          const originalText = this.innerHTML;
          this.innerHTML = '<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/></svg> Sending...';

          setTimeout(() => {
            this.classList.remove('loading');
            this.innerHTML = originalText;
            showNotification(`Deal sent to ${email}!`, 'success');
          }, 1200);
        } else if (email) {
          showNotification('Please enter a valid email address', 'error');
        }
      });
    }
  }

  function validateForm() {
    // Check if a radio option is selected
    const radioSelected = document.querySelector('input[type="radio"][name="price-alert"]:checked');
    if (!radioSelected) {
      showNotification('Please select a price tracking option', 'error');
      return false;
    }

    // If "price below" is selected, validate the price input
    if (radioSelected.closest('.price-radio-option').classList.contains('radio-selected')) {
      const priceInput = document.querySelector('.price-input');
      const firstOption = document.querySelector('.price-radio-option');
      
      if (firstOption.classList.contains('radio-selected')) {
        const price = parseInt(priceInput.value);
        if (isNaN(price) || price < 1000 || price > 999999) {
          priceInput.classList.add('error');
          setTimeout(() => priceInput.classList.remove('error'), 500);
          showNotification('Please enter a valid price between ₹1,000 and ₹9,99,999', 'error');
          return false;
        }
      }
    }

    // Validate at least one checkbox is selected
    if (!validateCheckboxes()) {
      showNotification('Please select at least one notification method', 'error');
      return false;
    }

    return true;
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CHART INTERACTIONS & TOOLTIPS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initChartInteractions() {
    const chart = document.getElementById('price-history-chart');
    if (!chart) return;

    const circles = chart.querySelectorAll('circle');
    let tooltip = document.querySelector('.chart-tooltip');

    // Create tooltip if it doesn't exist
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip';
      tooltip.innerHTML = `
        <div class="chart-tooltip-date"></div>
        <div class="chart-tooltip-price"></div>
      `;
      document.body.appendChild(tooltip);
    }

    // Sample price data (in real app, this would come from backend)
    const priceData = [
      { date: 'Feb 1', price: 27775 },
      { date: 'Feb 6', price: 30450 },
      { date: 'Feb 11', price: 24900 },
      { date: 'Feb 16', price: 30450 },
      { date: 'Feb 21', price: 35670 },
      { date: 'Feb 26', price: 33250 },
      { date: 'Mar 1', price: 37300 },
      { date: 'Mar 3', price: 31900 }
    ];

    circles.forEach((circle, index) => {
      // Mouse enter
      circle.addEventListener('mouseenter', function(e) {
        const data = priceData[index] || { date: 'Unknown', price: 0 };
        
        // Update tooltip content
        tooltip.querySelector('.chart-tooltip-date').textContent = data.date;
        tooltip.querySelector('.chart-tooltip-price').textContent = `₹${data.price.toLocaleString('en-IN')}`;
        
        // Show tooltip
        tooltip.classList.add('show');
        
        // Position tooltip
        const rect = circle.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltipRect.height - 12}px`;

        // Highlight circle
        circle.setAttribute('r', '12');
        circle.style.filter = 'drop-shadow(0 0 8px rgba(42, 125, 74, 0.8))';
      });

      // Mouse leave
      circle.addEventListener('mouseleave', function() {
        tooltip.classList.remove('show');
        
        // Reset circle
        circle.setAttribute('r', '8');
        circle.style.filter = '';
      });
    });

    // Animate chart line on load
    const polyline = chart.querySelector('.graph-line');
    if (polyline) {
      polyline.style.strokeDasharray = '1000';
      polyline.style.strokeDashoffset = '1000';
      
      setTimeout(() => {
        polyline.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
        polyline.style.strokeDashoffset = '0';
      }, 500);
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACTIVE ALERTS CRUD OPERATIONS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initActiveAlerts() {
    const alertCards = document.querySelectorAll('.alert-card');

    alertCards.forEach(card => {
      // Edit button
      const editBtn = card.querySelector('button:nth-child(1)');
      if (editBtn) {
        editBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          handleEditAlert(card);
        });
      }

      // Pause button
      const pauseBtn = card.querySelector('button:nth-child(2)');
      if (pauseBtn) {
        pauseBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          handlePauseAlert(card);
        });
      }

      // Delete button
      const deleteBtn = card.querySelector('button:nth-child(3)');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          handleDeleteAlert(card);
        });
      }
    });
  }

  function handleEditAlert(card) {
    const targetPriceSpan = card.querySelector('span:has(svg[class*="c9a877"]) + span, .font-semibold.text-\\[#1d5e33\\]');
    if (!targetPriceSpan) {
      showNotification('Cannot edit alert at this time', 'error');
      return;
    }

    const currentPrice = targetPriceSpan.textContent.replace(/[^0-9]/g, '');
    const newPrice = prompt('Enter new target price:', currentPrice);

    if (newPrice !== null && newPrice.trim() !== '') {
      const price = parseInt(newPrice);
      if (!isNaN(price) && price >= 1000 && price <= 999999) {
        targetPriceSpan.textContent = `₹${price.toLocaleString('en-IN')}`;
        showNotification('Alert updated successfully!', 'success');
        
        // Animate update
        card.style.transform = 'scale(1.02)';
        setTimeout(() => {
          card.style.transform = '';
        }, 300);
      } else {
        showNotification('Please enter a valid price', 'error');
      }
    }
  }

  function handlePauseAlert(card) {
    const badge = card.querySelector('.w-9.h-9.rounded-full');
    if (!badge) return;

    const isPaused = badge.classList.contains('bg-gray-400');

    if (isPaused) {
      // Resume alert
      badge.classList.remove('bg-gray-400');
      badge.classList.add('bg-[#2a7d4a]', 'animate-pulse');
      badge.textContent = 'ON';
      card.style.opacity = '1';
      showNotification('Alert resumed', 'success');
    } else {
      // Pause alert
      badge.classList.remove('bg-[#2a7d4a]', 'animate-pulse');
      badge.classList.add('bg-gray-400');
      badge.textContent = '||';
      card.style.opacity = '0.7';
      showNotification('Alert paused', 'info');
    }
  }

  function handleDeleteAlert(card) {
    const confirmed = confirm('Are you sure you want to delete this alert?');
    
    if (confirmed) {
      // Animate removal
      card.style.transform = 'translateX(100%)';
      card.style.opacity = '0';
      card.style.transition = 'all 0.4s ease';

      setTimeout(() => {
        card.remove();
        showNotification('Alert deleted successfully', 'success');
        
        // Update alert count
        updateAlertCount();
      }, 400);
    }
  }

  function updateAlertCount() {
    const alertCards = document.querySelectorAll('.alert-card');
    const countBadge = document.querySelector('.bg-\\[#2a7d4a\\].text-white.rounded-full.px-3');
    if (countBadge) {
      countBadge.textContent = alertCards.length;
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ANIMATIONS & SCROLL EFFECTS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe cards and elements
    const elementsToAnimate = document.querySelectorAll('#price-alerts-section .card-depth, #price-alerts-section .smart-insight');
    elementsToAnimate.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Stats card hover effects
    const statCards = document.querySelectorAll('#price-alerts-section .grid-cols-3 > div');
    statCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-6px) scale(1.03)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NOTIFICATION SYSTEM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `price-tracking-notification ${type}`;
    
    const icons = {
      success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    
    notification.innerHTML = `
      ${icons[type] || icons.info}
      <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: type === 'success' ? '#10b981' : 
                  type === 'error' ? '#ef4444' :
                  type === 'warning' ? '#f59e0b' : '#3b82f6',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '600',
      fontSize: '0.9375rem',
      zIndex: '10000',
      animation: 'slideInRight 0.3s ease',
      maxWidth: '400px'
    });
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Add notification animations to document
  if (!document.getElementById('price-tracking-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'price-tracking-notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

})();

// price alert  section start here 


document.addEventListener('DOMContentLoaded', () => {

  // Radio button active styles toggle
  document.querySelectorAll('input[type=radio][name=price-alert]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('input[type=radio][name=price-alert]').forEach(r => 
        r.parentNode.classList.remove('font-bold', 'text-[#2a7d4a]')
      );
      if (radio.checked) {
        radio.parentNode.classList.add('font-bold', 'text-[#2a7d4a]');
      }
    });
  });

  // Price input field pulse focus
  document.querySelectorAll('.price-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.classList.add('ring', 'ring-[#2a7d4a]/20');
    });
    input.addEventListener('blur', () => {
      input.classList.remove('ring', 'ring-[#2a7d4a]/20');
    });
  });

  // Custom checkbox interaction
  document.querySelectorAll('.checkbox-option input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const label = checkbox.parentNode;
      if (checkbox.checked) {
        label.querySelector('.checked-indicator').classList.remove('hidden');
      } else {
        label.querySelector('.checked-indicator').classList.add('hidden');
      }
    });
  });

  // Animated graph line drawing
  const graphLine = document.querySelector('.graph-line');
  if (graphLine) {
    const length = graphLine.getTotalLength();
    graphLine.style.strokeDasharray = length;
    graphLine.style.strokeDashoffset = length;
    setTimeout(() => {
      graphLine.style.transition = 'stroke-dashoffset 1.2s ease-in-out';
      graphLine.style.strokeDashoffset = 0;
    }, 500);
  }

  // Animate price number on update
  const priceDisplay = document.querySelector('.saved-search-price');
  if (priceDisplay) {
    const oldPrice = parseInt(priceDisplay.textContent.replace(/[^0-9]/g, '')) || 0;
    const newPrice = 340; // Example new price
    let step = (newPrice - oldPrice) / 60;
    let current = oldPrice;
    let count = 0;
    const countInterval = setInterval(() => {
      current += step;
      priceDisplay.textContent = `$${Math.round(current)}`;
      count++;
      if (count >= 60) {
        clearInterval(countInterval);
        // Flash green bg and fade out
        priceDisplay.style.backgroundColor = '#e8f4ed';
        setTimeout(() => priceDisplay.style.backgroundColor = 'transparent', 800);
      }
    }, 20);
  }

  // Bell icon shake animation on CTA hover
  document.querySelectorAll('.primary-cta').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.classList.add('animate-bellShake');
    });
    btn.addEventListener('animationend', () => {
      btn.classList.remove('animate-bellShake');
    });
  });

  // Accessibility: Focus outlines are manage by CSS, add aria live announce on input changes
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-9999px';
  document.body.appendChild(liveRegion);

  document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('change', () => {
      liveRegion.textContent = 'Price alert options updated';
    });
  });

  // Active Alerts: Edit, Pause, Delete button handlers (example shows alert)
  document.querySelectorAll('.alert-card button').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      alert(`Action: ${button.textContent.trim()}`);
    });
  });

});
// price alert section end here

// scocail proof section js start here

document.addEventListener("DOMContentLoaded", function () {
  
  // --- SVG Sprite Check (for cross-browser <use> support) ---
  // This is a common pattern, not in the prompt but good practice.
  // If you are sure about your environment, you can remove it.
  (function(d, u) {
    var x = new XMLHttpRequest();
    var b = d.body;
    x.open('GET', u, true);
    x.send();
    x.onload = function() {
      var s = d.createElement('div');
      s.style.display = 'none';
      s.innerHTML = x.responseText;
      b.insertBefore(s, b.firstChild);
    }
  })(document, ''); // In a real setup, you'd load a sprite file. Since it's inline, it's fine.


  // --- Animated Rating Stars and Countup ---
  const countupElem = document.querySelector('.countup[data-value]');
  if (countupElem) {
    const endVal = parseFloat(countupElem.dataset.value);
    let curr = 0, frames = 38, step = endVal / frames, frame = 0;
    function animateNum() {
      curr += step; frame++;
      countupElem.textContent = Math.min(curr, endVal).toFixed(1);
      if (frame < frames) requestAnimationFrame(animateNum);
      else countupElem.textContent = endVal.toFixed(1);
    }
    animateNum();
  }
  
  // --- Animate Stats Counters ---
  const statNumbers = document.querySelectorAll('.stat-value[data-target]');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statElement = entry.target;
        const target = statElement.getAttribute('data-target');
        
        // Parse target value (handle decimals like 4.8)
        const isDecimal = target.includes('.');
        const targetNum = parseFloat(target);
        const suffix = statElement.textContent.replace(/[\d.]+/, '').trim(); // Get any suffix like "K+", "/5.0", etc.
        
        animateStatCounter(statElement, 0, targetNum, suffix, isDecimal, 2000);
        statsObserver.unobserve(statElement);
      }
    });
  }, { threshold: 0.3 });
  
  statNumbers.forEach(stat => statsObserver.observe(stat));
  
  function animateStatCounter(element, start, end, suffix, isDecimal, duration) {
    const range = end - start;
    const frames = 60; // 60fps for smooth animation
    const increment = range / frames;
    let current = start;
    let frame = 0;
    
    const timer = setInterval(() => {
      current += increment;
      frame++;
      
      if (current >= end || frame >= frames) {
        current = end;
        clearInterval(timer);
      }
      
      // Format number based on type
      const displayValue = isDecimal ? current.toFixed(1) : Math.floor(current);
      element.textContent = displayValue + suffix;
    }, duration / frames);
  }
  
  // --- Animate Rating Bars ---
  const ratingBarsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        document.querySelectorAll('.rating-bar-bar[data-end]').forEach((bar, idx) => {
          setTimeout(() => {
            const fill = bar.querySelector('.rating-bar-fill');
            const endPercent = bar.dataset.end;
            if (fill && endPercent) {
              fill.style.width = endPercent + '%';
            }
          }, idx * 100); // Stagger animation by 100ms per bar
        });
        ratingBarsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  
  const ratingCard = document.querySelector('.rating-card');
  ratingCard && ratingBarsObserver.observe(ratingCard);

  // --------- Review Carousel ---------
  const carouselCards = [
    {
      stars: 5,
      title: "Best Flight Deal Ever!",
      text: "Saved $200 on my Paris trip! The booking process was seamless and customer support was fantastic. Highly recommend!",
      name: "Sarah M.",
      location: "New York",
      photo: "https://randomuser.me/api/portraits/women/71.jpg",
      verified: true,
      ago: "2 weeks ago",
      route: "NYC → Paris"
    },
    {
      stars: 5,
      title: "Absolutely Amazing Experience!",
      text: "Found a $385 flight to Paris when others were charging $585! Easy booking, instant confirmation, and great customer service.",
      name: "Jennifer T.",
      location: "Los Angeles",
      photo: "https://randomuser.me/api/portraits/women/50.jpg",
      verified: true,
      ago: "1 week ago",
      route: "LAX → Tokyo"
    },
    {
      stars: 4,
      title: "Great value, minor delays",
      text: "Saved big on my flight but check-in took a bit longer than expected. Overall, happy with the booking process.",
      name: "Michael R.",
      location: "Chicago",
      photo: "https://randomuser.me/api/portraits/men/22.jpg",
      verified: true,
      ago: "3 days ago",
      route: "ORD → London"
    }
  ];
  let carouselIndex = 0;
  const carouselCard = document.querySelector(".review-card");
  const leftBtn = document.querySelector(".nav-arrow.left");
  const rightBtn = document.querySelector(".nav-arrow.right");
  const dotsWrap = document.querySelector('.carousel-dots');

  // Dots creation (idempotent)
  if (dotsWrap && dotsWrap.children.length !== carouselCards.length) {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < carouselCards.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.tabIndex = 0;
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dotsWrap.appendChild(dot);
    }
  }
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  // *** UPDATED updateCarousel function ***
  function updateCarousel(idx) {
    if (!carouselCard) return;
    
    let c = carouselCards[idx];
    
    // Generate star HTML using the new SVG sprite
    let starHtml = '';
    for (let i = 0; i < 5; i++) {
      starHtml += `
        <svg class="star-icon ${i < c.stars ? 'filled' : ''}" viewBox="0 0 20 20">
          <use href="#star-icon"></use>
        </svg>`;
    }

    carouselCard.innerHTML = `
      <div style="display: flex; gap: 0.25rem; margin-bottom: 0.75rem;">
        ${starHtml}
      </div>
      
      <h3 style="font-size: 1.25rem; font-weight: 600; color: #064e3b; margin-bottom: 0.75rem;">
        "${c.title}"
      </h3>
      
      <p style="color: #374151; line-height: 1.6; margin-bottom: 1rem; flex-grow: 1;">
        ${c.text}
      </p>
      
      <div style="display: flex; align-items: center; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
        <img src="${c.photo}" alt="${c.name}" style="width: 3rem; height: 3rem; border-radius: 9999px; object-fit: cover;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <p style="font-weight: 600; color: #064e3b;">${c.name}</p>
            <span style="color: #6b7280;">•</span>
            <p style="color: #4b5563;">${c.location}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">
            ${c.verified ? `
              <span style="display: flex; align-items: center; gap: 0.25rem; color: #059669;">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 20 20">
                  <use href="#check-badge-icon"></use>
                </svg>
                Verified
              </span>
              <span>•</span>
            ` : ''}
            <span>${c.ago}</span>
            <span>•</span>
            <span style="display: flex; align-items: center; gap: 0.25rem;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 20 20">
                <use href="#airplane-icon"></use>
              </svg>
              ${c.route}
            </span>
          </div>
        </div>
      </div>
    `;

    // Set active dot
    dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
  }
  
  // Navigation Arrows
  leftBtn && leftBtn.addEventListener('click', () => {
    carouselIndex = (carouselIndex - 1 + carouselCards.length) % carouselCards.length;
    updateCarousel(carouselIndex);
  });
  rightBtn && rightBtn.addEventListener('click', () => {
    carouselIndex = (carouselIndex + 1) % carouselCards.length;
    updateCarousel(carouselIndex);
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      carouselIndex = i;
      updateCarousel(carouselIndex);
    });
    dot.addEventListener('keydown', (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        carouselIndex = i;
        updateCarousel(carouselIndex);
      }
    });
  });
  // Auto-play carousel
  let autoCarousel = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % carouselCards.length;
    updateCarousel(carouselIndex);
  }, 6000);
  
  const carouselContainer = document.querySelector('.review-carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoCarousel));
    carouselContainer.addEventListener('mouseleave', () => {
      autoCarousel = setInterval(() => {
        carouselIndex = (carouselIndex + 1) % carouselCards.length;
        updateCarousel(carouselIndex);
      }, 6000);
    });
  }
  updateCarousel(0); // Initial call

  // ---- Live Booking Activity ----
  const liveBookings = [
    { flag: '🇯🇵', city: 'Tokyo', time: '2 min ago' },
    { flag: '🇬🇧', city: 'London', time: '5 min ago' },
    { flag: '🇫🇷', city: 'Paris', time: '8 min ago' },
    { flag: '🇮🇹', city: 'Rome', time: '12 min ago' },
    { flag: '🇮🇳', city: 'Delhi', time: '17 min ago' },
    { flag: '🇪🇸', city: 'Madrid', time: '20 min ago' }
  ];
  const liveWrap = document.querySelector('.live-activity-section');
  let liveIdx = 0;

  // *** UPDATED renderLive function ***
  function renderLive() {
    if (!liveWrap) return;
    
    let bookingHtml = '';
    const bookingsToShow = liveBookings.slice(liveIdx, liveIdx + 4);
    if (liveIdx + 4 > liveBookings.length) {
      bookingsToShow.push(...liveBookings.slice(0, (liveIdx + 4) % liveBookings.length));
    }
    
    bookingHtml = bookingsToShow.map(item => `
      <div class="live-booking-item">
        <div class="live-booking-location">
          <span class="live-booking-flag">${item.flag}</span>
          <span class="live-booking-city">${item.city}</span>
        </div>
        <span class="live-booking-time">Booked ${item.time}</span>
      </div>
    `).join('');

    liveWrap.innerHTML = `
      <div class="live-header">
        <span class="live-pulse">
          <span class="live-pulse-ping"></span>
          <span class="live-pulse-dot"></span>
        </span>
        <span class="live-label">LIVE</span>
        <span class="live-text">234 people booking right now</span>
      </div>
      
      <div class="live-bookings-list">
        ${bookingHtml}
      </div>
    `;
  }
  
  renderLive(); // Initial call
  setInterval(() => {
    liveIdx = (liveIdx + 1) % liveBookings.length;
    renderLive();
  }, 6100);

  // --- Customer photo tooltips ---
  document.querySelectorAll('.customer-photo').forEach(photo => {
    const tooltip = photo.querySelector('.photo-tooltip');
    if (!tooltip) return;
    const msg = photo.dataset.location || '';
    tooltip.innerText = msg;
    
    const showTooltip = () => {
      tooltip.style.opacity = 1;
      tooltip.style.pointerEvents = 'auto';
    };
    const hideTooltip = () => {
      tooltip.style.opacity = 0;
      tooltip.style.pointerEvents = 'none';
    };

    photo.addEventListener('mouseenter', showTooltip);
    photo.addEventListener('mouseleave', hideTooltip);
    photo.addEventListener('focus', showTooltip);
    photo.addEventListener('blur', hideTooltip);
  });
});

// social proof section js end here

// why choose us  section js start here

// ===============================================
//  WHY CHOOSE US SECTION - INTERACTIVE FEATURES
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Typing Effect for Subtitle
  const typingElement = document.querySelector('.typing-text');
  if (typingElement) {
    const text = typingElement.getAttribute('data-typing-text') || '';
    const cursor = typingElement.querySelector('.typing-cursor');
    let charIndex = 0;
    
    // Clear initial content
    typingElement.textContent = '';
    if (cursor) {
      typingElement.appendChild(cursor);
    }
    
    function typeCharacter() {
      if (charIndex < text.length) {
        const textNode = document.createTextNode(text.charAt(charIndex));
        if (cursor) {
          typingElement.insertBefore(textNode, cursor);
        } else {
          typingElement.appendChild(textNode);
        }
        charIndex++;
        
        // Variable speed for natural typing
        const speed = Math.random() * 50 + 30;
        setTimeout(typeCharacter, speed);
      } else {
        // Stop cursor blinking after typing completes
        setTimeout(() => {
          if (cursor) {
            cursor.style.animation = 'none';
            cursor.style.opacity = '0';
          }
        }, 2000);
      }
    }
    
    // Start typing after a brief delay
    setTimeout(() => {
      typeCharacter();
    }, 800);
  }
  
  // 2. Scroll-Triggered Animation with Intersection Observer
  const whyChooseSection = document.querySelector('.why-choose-us-section');
  const whyChooseCards = document.querySelectorAll('.why-choose-card');
  
  if (whyChooseSection && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-100px',
      threshold: 0.2
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger card animations
          whyChooseCards.forEach((card, index) => {
            setTimeout(() => {
              card.style.animation = `cardSlideIn 0.7s ease-out forwards`;
            }, index * 120); // 120ms stagger delay
          });
          
          // Unobserve after animation triggers
          sectionObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    sectionObserver.observe(whyChooseSection);
  }
  
  // 3. Card Keyboard Navigation
  whyChooseCards.forEach((card, index) => {
    // Add keyboard event listeners
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
      
      // Arrow key navigation
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextCard = whyChooseCards[index + 1] || whyChooseCards[0];
        nextCard.focus();
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevCard = whyChooseCards[index - 1] || whyChooseCards[whyChooseCards.length - 1];
        prevCard.focus();
      }
    });
    
    // Optional: Add click interaction (e.g., log analytics or open modal)
    card.addEventListener('click', () => {
      console.log(`Card clicked: ${card.querySelector('.card-title').textContent}`);
      
      // Add a subtle click effect
      card.style.transform = 'scale(0.98) translateY(-8px)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
    });
  });
  
  // 4. Enhanced Hover Effects with Mouse Position Tracking
  whyChooseCards.forEach(card => {
    const cardGlow = card.querySelector('.card-glow');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Update glow position based on mouse
      if (cardGlow) {
        cardGlow.style.background = `radial-gradient(
          circle at ${x}% ${y}%,
          rgba(29, 94, 51, 0.5),
          rgba(201, 168, 119, 0.4),
          rgba(58, 156, 96, 0.3)
        )`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      // Reset to default gradient
      if (cardGlow) {
        cardGlow.style.background = `linear-gradient(
          135deg,
          rgba(29, 94, 51, 0.4),
          rgba(201, 168, 119, 0.4),
          rgba(58, 156, 96, 0.4)
        )`;
      }
    });
  });
  
  // 5. Stats Counter Animation
  const statValues = document.querySelectorAll('.stat-value');
  
  if (statValues.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statElement = entry.target;
          const finalText = statElement.textContent.trim();
          
          // Extract number from text (e.g., "500K+" -> 500)
          const numMatch = finalText.match(/(\d+)/);
          if (numMatch) {
            const targetNum = parseInt(numMatch[1]);
            const suffix = finalText.replace(/\d+/, '');
            
            animateCounter(statElement, 0, targetNum, suffix, 2000);
          }
          
          statsObserver.unobserve(statElement);
        }
      });
    }, { threshold: 0.5 });
    
    statValues.forEach(stat => statsObserver.observe(stat));
  }
  
  function animateCounter(element, start, end, suffix, duration) {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  }
  
  // 6. Performance Optimization: Reduce animations on low-power devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.body.classList.add('reduce-animations');
  }
  
  // 7. Focus Management for Accessibility
  const whyChooseHeading = document.getElementById('why-choose-heading');
  if (whyChooseHeading) {
    // Announce section when it comes into view
    if ('IntersectionObserver' in window) {
      const a11yObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Screen readers will announce the heading
            whyChooseHeading.setAttribute('aria-live', 'polite');
            setTimeout(() => {
              whyChooseHeading.removeAttribute('aria-live');
            }, 2000);
            a11yObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      
      a11yObserver.observe(whyChooseSection);
    }
  }
  
  // 8. Prefers Reduced Motion Support
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    whyChooseCards.forEach(card => {
      card.style.animation = 'none';
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    
    const icons = document.querySelectorAll('.card-icon');
    icons.forEach(icon => {
      icon.style.animation = 'none';
      icon.style.opacity = '1';
      icon.style.transform = 'none';
    });
  }
});

// why choose us  section js end here

// ===============================================
//  WHY CHOOSE US REVOLUTIONARY - 3D INTERACTIONS
// ===============================================

class WhyChooseUsRevolutionary {
  constructor() {
    this.section = document.getElementById('whyChooseUs');
    if (!this.section) return;
    
    this.cards = document.querySelectorAll('.glass-card');
    this.canvas = document.getElementById('particleCanvas');
    this.customCursor = document.getElementById('customCursor');
    this.counters = document.querySelectorAll('.badge-count, .counter-text');
    
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.isHovering = false;
    
    this.init();
  }
  
  init() {
    this.setupCanvas();
    this.createParticles();
    this.animateParticles();
    this.initHoverEffects();
    this.initCustomCursor();
    this.observeIntersection();
    this.initKeyboardNav();
    this.initMagneticEffect();
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.disableAnimations();
    }
  }
  
  // ━━━ CANVAS PARTICLE SYSTEM ━━━
  setupCanvas() {
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  resizeCanvas() {
    this.canvas.width = this.section.offsetWidth;
    this.canvas.height = this.section.offsetHeight;
  }
  
  createParticles() {
    const particleCount = 50;
    const shapes = ['circle', 'triangle', 'hexagon'];
    const colors = ['rgba(29, 94, 51, 0.3)', 'rgba(201, 168, 119, 0.3)', 'rgba(42, 125, 74, 0.3)'];
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02
      });
    }
  }
  
  animateParticles() {
    if (!this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.rotation += particle.rotationSpeed;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.x -= dx * force * 0.02;
        particle.y -= dy * force * 0.02;
      }
      
      // Draw particle
      this.ctx.save();
      this.ctx.translate(particle.x, particle.y);
      this.ctx.rotate(particle.rotation);
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;
      
      switch(particle.shape) {
        case 'circle':
          this.ctx.beginPath();
          this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case 'triangle':
          this.ctx.beginPath();
          this.ctx.moveTo(0, -particle.size);
          this.ctx.lineTo(particle.size, particle.size);
          this.ctx.lineTo(-particle.size, particle.size);
          this.ctx.closePath();
          this.ctx.fill();
          break;
          
        case 'hexagon':
          this.ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = particle.size * Math.cos(angle);
            const y = particle.size * Math.sin(angle);
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
          }
          this.ctx.closePath();
          this.ctx.fill();
          break;
      }
      
      this.ctx.restore();
    });
    
    requestAnimationFrame(() => this.animateParticles());
  }
  
  // ━━━ 3D TILT HOVER EFFECT ━━━
  initHoverEffects() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.isHovering = true;
      });
      
      card.addEventListener('mousemove', (e) => {
        this.handle3DTilt(card, e);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.isHovering = false;
        this.reset3DTilt(card);
      });
      
      // Click ripple effect
      card.addEventListener('click', (e) => {
        this.createRipple(card, e);
      });
      
      // Icon bounce on hover
      const icon = card.querySelector('.icon-svg');
      if (icon) {
        card.addEventListener('mouseenter', () => {
          icon.style.animation = 'none';
          setTimeout(() => {
            icon.style.animation = '';
          }, 10);
        });
      }
    });
    
    // Track mouse position for particles
    this.section.addEventListener('mousemove', (e) => {
      const rect = this.section.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
  }
  
  handle3DTilt(card, e) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * -10;
    const rotateY = (mouseX / (rect.width / 2)) * 10;
    
    card.style.transform = `
      translateY(-20px) 
      translateZ(40px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale(1.04)
    `;
  }
  
  reset3DTilt(card) {
    card.style.transform = '';
  }
  
  createRipple(card, e) {
    const ripple = card.querySelector('.ripple-effect');
    if (!ripple) return;
    
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    ripple.style.animation = 'none';
    setTimeout(() => {
      ripple.style.animation = 'ripple 0.6s ease-out';
    }, 10);
  }
  
  // ━━━ CUSTOM CURSOR ━━━
  initCustomCursor() {
    if (!this.customCursor) return;
    
    this.section.addEventListener('mousemove', (e) => {
      this.customCursor.style.left = e.clientX + 'px';
      this.customCursor.style.top = e.clientY + 'px';
    });
    
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.customCursor.classList.add('active');
      });
      
      card.addEventListener('mouseleave', () => {
        this.customCursor.classList.remove('active');
      });
    });
  }
  
  // ━━━ MAGNETIC EFFECT ━━━
  initMagneticEffect() {
    const magneticDistance = 100;
    
    document.addEventListener('mousemove', (e) => {
      this.cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < magneticDistance && !this.isHovering) {
          const force = (magneticDistance - distance) / magneticDistance;
          const moveX = deltaX * force * 0.1;
          const moveY = deltaY * force * 0.1;
          
          card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        } else if (!this.isHovering) {
          card.style.transform = '';
        }
      });
    });
  }
  
  // ━━━ INTERSECTION OBSERVER ━━━
  observeIntersection() {
    const options = {
      threshold: 0.2,
      rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startCounterAnimations();
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    observer.observe(this.section);
  }
  
  // ━━━ COUNTER ANIMATIONS ━━━
  startCounterAnimations() {
    this.counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      
      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };
      
      updateCounter();
    });
  }
  
  // ━━━ KEYBOARD NAVIGATION ━━━
  initKeyboardNav() {
    this.cards.forEach((card, index) => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
        
        // Arrow key navigation
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextCard = this.cards[index + 1] || this.cards[0];
          nextCard.focus();
        }
        
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevCard = this.cards[index - 1] || this.cards[this.cards.length - 1];
          prevCard.focus();
        }
      });
      
      // Visual feedback for keyboard focus
      card.addEventListener('focus', () => {
        if (!card.matches(':hover')) {
          card.style.transform = 'translateY(-10px) scale(1.02)';
        }
      });
      
      card.addEventListener('blur', () => {
        if (!card.matches(':hover')) {
          card.style.transform = '';
        }
      });
    });
  }
  
  // ━━━ DISABLE ANIMATIONS FOR REDUCED MOTION ━━━
  disableAnimations() {
    this.particles = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    this.cards.forEach(card => {
      card.style.animation = 'none';
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
    
    const floatingElements = this.section.querySelectorAll('.floating-badge, .geometric-decoration');
    floatingElements.forEach(el => {
      el.style.animation = 'none';
    });
  }
  
  // ━━━ DESTROY METHOD ━━━
  destroy() {
    window.removeEventListener('resize', this.resizeCanvas);
    // Remove all event listeners
    this.cards.forEach(card => {
      card.replaceWith(card.cloneNode(true));
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new WhyChooseUsRevolutionary();
  });
} else {
  new WhyChooseUsRevolutionary();
}

// why choose us revolutionary section js end here

