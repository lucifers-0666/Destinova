 // ============================================
// ENHANCED HERO SECTION FUNCTIONALITY
// ============================================

(function() {
  'use strict';

  // ============================================
  // 1. PARALLAX SCROLLING FOR HERO BACKGROUND
  // ============================================
  
  const heroSection = document.getElementById('heroSection');
  const heroBackground = document.querySelector('.hero-background');
  const floatingIcons = document.querySelectorAll('.floating-icon');
  
  let rafId = null;
  
  function handleParallax() {
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      const scrollY = window.pageYOffset;
      const parallaxSpeed = 0.5;
      
      if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
      }
      
      // Parallax for floating icons (slower speed)
      floatingIcons.forEach((icon, index) => {
        const speed = 0.3 + (index * 0.1);
        icon.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }
  }
  
  function throttledParallax() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      handleParallax();
      rafId = null;
    });
  }
  
  // Only apply parallax on desktop
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', throttledParallax, { passive: true });
  }
  
  // ============================================
  // 2. DESTINATION AUTOCOMPLETE
  // ============================================
  
  const destinations = [
    'Bali, Indonesia', 'Dubai, UAE', 'Maldives', 'Paris, France', 
    'Tokyo, Japan', 'Rome, Italy', 'New York, USA', 'London, UK',
    'Singapore', 'Bangkok, Thailand', 'Sydney, Australia', 'Barcelona, Spain',
    'Istanbul, Turkey', 'Amsterdam, Netherlands', 'Prague, Czech Republic'
  ];
  
  const destinationInput = document.getElementById('destinationInput');
  const autocompleteList = document.getElementById('autocompleteList');
  
  let debounceTimer = null;
  
  function showAutocomplete(value) {
    if (!value || value.length < 2) {
      autocompleteList.hidden = true;
      return;
    }
    
    const filtered = destinations.filter(dest => 
      dest.toLowerCase().includes(value.toLowerCase())
    );
    
    if (filtered.length === 0) {
      autocompleteList.hidden = true;
      return;
    }
    
    autocompleteList.innerHTML = filtered
      .map(dest => `<div class="autocomplete-item" role="option">${dest}</div>`)
      .join('');
    
    autocompleteList.hidden = false;
    
    // Add click handlers
    autocompleteList.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => {
        destinationInput.value = item.textContent;
        autocompleteList.hidden = true;
      });
    });
  }
  
  if (destinationInput) {
    destinationInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        showAutocomplete(e.target.value);
      }, 300);
    });
    
    // Close autocomplete on outside click
    document.addEventListener('click', (e) => {
      if (!destinationInput.contains(e.target) && !autocompleteList.contains(e.target)) {
        autocompleteList.hidden = true;
      }
    });
    
    // Keyboard navigation
    destinationInput.addEventListener('keydown', (e) => {
      const items = autocompleteList.querySelectorAll('.autocomplete-item');
      if (items.length === 0) return;
      
      let currentIndex = -1;
      items.forEach((item, index) => {
        if (item.classList.contains('active')) currentIndex = index;
      });
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        items.forEach(item => item.classList.remove('active'));
        items[nextIndex].classList.add('active');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        items.forEach(item => item.classList.remove('active'));
        items[prevIndex].classList.add('active');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentIndex >= 0) {
          destinationInput.value = items[currentIndex].textContent;
          autocompleteList.hidden = true;
        }
      } else if (e.key === 'Escape') {
        autocompleteList.hidden = true;
      }
    });
  }
  
  // ============================================
  // 3. DATE PICKER SETUP
  // ============================================
  
  const checkInDate = document.getElementById('checkInDate');
  const checkOutDate = document.getElementById('checkOutDate');
  const today = new Date().toISOString().split('T')[0];
  
  if (checkInDate) {
    checkInDate.setAttribute('min', today);
    checkInDate.value = today;
    
    checkInDate.addEventListener('change', (e) => {
      if (checkOutDate) {
        checkOutDate.setAttribute('min', e.target.value);
        
        // Auto-set checkout to next day if empty
        if (!checkOutDate.value) {
          const nextDay = new Date(e.target.value);
          nextDay.setDate(nextDay.getDate() + 1);
          checkOutDate.value = nextDay.toISOString().split('T')[0];
        }
      }
    });
  }
  
  if (checkOutDate) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkOutDate.value = tomorrow.toISOString().split('T')[0];
  }
  
  // ============================================
  // 4. GUESTS SELECTOR DROPDOWN
  // ============================================
  
  const guestsButton = document.getElementById('guestsButton');
  const guestsDropdown = document.getElementById('guestsDropdown');
  const guestsText = document.getElementById('guestsText');
  
  let guestCounts = { adults: 1, children: 0 };
  
  if (guestsButton && guestsDropdown) {
    guestsButton.addEventListener('click', (e) => {
      e.stopPropagation();
      guestsDropdown.hidden = !guestsDropdown.hidden;
    });
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!guestsButton.contains(e.target) && !guestsDropdown.contains(e.target)) {
        guestsDropdown.hidden = true;
      }
    });
    
    // Counter buttons
    document.querySelectorAll('.counter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.getAttribute('data-action');
        const type = btn.getAttribute('data-type');
        const countElement = document.getElementById(`${type}Count`);
        
        let currentValue = parseInt(countElement.textContent);
        
        if (action === 'inc') {
          currentValue++;
        } else if (action === 'dec' && currentValue > 0) {
          if (type === 'adults' && currentValue === 1) return; // At least 1 adult
          currentValue--;
        }
        
        countElement.textContent = currentValue;
        guestCounts[type] = currentValue;
        
        // Update guests text
        updateGuestsText();
      });
    });
    
    function updateGuestsText() {
      const parts = [];
      if (guestCounts.adults > 0) {
        parts.push(`${guestCounts.adults} Adult${guestCounts.adults > 1 ? 's' : ''}`);
      }
      if (guestCounts.children > 0) {
        parts.push(`${guestCounts.children} Child${guestCounts.children > 1 ? 'ren' : ''}`);
      }
      guestsText.textContent = parts.join(', ');
    }
  }
  
  // ============================================
  // 5. TRENDING PILLS NAVIGATION
  // ============================================
  
  const trendingPills = document.querySelectorAll('.trending-pill');
  
  trendingPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const destination = pill.getAttribute('data-destination');
      if (destinationInput) {
        destinationInput.value = destination;
        destinationInput.focus();
      }
    });
  });
  
  // ============================================
  // 6. HERO SEARCH FORM SUBMISSION
  // ============================================
  
  const heroSearchForm = document.getElementById('heroSearchForm');
  
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const destination = destinationInput?.value;
      const checkIn = checkInDate?.value;
      const checkOut = checkOutDate?.value;
      
      // Basic validation
      if (!destination) {
        alert('Please enter a destination');
        destinationInput?.focus();
        return;
      }
      
      if (!checkIn || !checkOut) {
        alert('Please select check-in and check-out dates');
        return;
      }
      
      // Store search data and redirect
      const searchData = {
        destination,
        checkIn,
        checkOut,
        guests: guestCounts,
        timestamp: Date.now()
      };
      
      localStorage.setItem('lastSearch', JSON.stringify(searchData));
      
      // Redirect to results page (adjust URL as needed)
      alert(`✈️ Searching flights to ${destination}...`);
      // window.location.href = `results.html?dest=${encodeURIComponent(destination)}&checkin=${checkIn}&checkout=${checkOut}`;
    });
  }
  
  // ============================================
  // 7. LIVE BOOKING COUNTER ANIMATION
  // ============================================
  
  const bookingCountElement = document.getElementById('bookingCount');
  
  if (bookingCountElement) {
    let currentCount = 2847;
    
    setInterval(() => {
      // Randomly increment by 1-5
      currentCount += Math.floor(Math.random() * 5) + 1;
      bookingCountElement.textContent = currentCount.toLocaleString();
    }, 10000); // Update every 10 seconds
  }
  
})();

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
          
          // Format number
          if (target >= 1000) {
            element.textContent = Math.floor(current / 1000);
          } else {
            element.textContent = Math.floor(current);
          }
        }, 16);
      }, delay);
    });
  }
  
})();

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

// ============================================
// PRICE COMPARISON TOOL FUNCTIONALITY
// ============================================

(function() {
  'use strict';

  const priceCompareBtn = document.querySelector('.price-compare-btn');
  const priceDestInput = document.getElementById('priceCompareDestination');
  const priceAlertBtn = document.querySelector('.price-alert-btn');
  const priceBookNowBtn = document.querySelector('.price-book-now-btn');

  // Compare Prices
  if (priceCompareBtn && priceDestInput) {
    priceCompareBtn.addEventListener('click', () => {
      const destination = priceDestInput.value.trim();
      if (destination) {
        alert(`Comparing prices for ${destination}...`);
        // Fetch price comparison data from API
      } else {
        alert('Please enter a destination');
      }
    });
  }

  // Price Alert
  if (priceAlertBtn) {
    priceAlertBtn.addEventListener('click', () => {
      const email = prompt('Enter your email to receive price alerts:');
      if (email) {
        alert(`Price alerts will be sent to ${email}`);
        // Save to backend
      }
    });
  }

  // Book Now
  if (priceBookNowBtn) {
    priceBookNowBtn.addEventListener('click', () => {
      alert('Redirecting to booking page...');
      // window.location.href = 'booking.html';
    });
  }

  // Price History Chart (using Chart.js if available)
  const chartCanvas = document.getElementById('priceHistoryChart');
  if (chartCanvas && typeof Chart !== 'undefined') {
    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'],
        datasets: [{
          label: 'Price (₹)',
          data: [55000, 52000, 48000, 50000, 46000, 49000, 45999],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `₹${context.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: (value) => `₹${value / 1000}K`
            }
          }
        }
      }
    });
  }

})();

// ============================================
// FLASH DEALS COUNTDOWN & CAROUSEL
// ============================================

(function() {
  'use strict';

  // Global Countdown Timer
  const countdownHours = document.getElementById('countdownHours');
  const countdownMinutes = document.getElementById('countdownMinutes');
  const countdownSeconds = document.getElementById('countdownSeconds');
  const countdownProgress = document.getElementById('countdownProgress');

  let totalSeconds = 4 * 3600 + 32 * 60 + 15; // 4h 32m 15s
  const initialTotalSeconds = totalSeconds;

  function updateCountdown() {
    if (totalSeconds <= 0) {
      if (countdownHours) countdownHours.textContent = '0';
      if (countdownMinutes) countdownMinutes.textContent = '0';
      if (countdownSeconds) countdownSeconds.textContent = '0';
      return;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (countdownHours) countdownHours.textContent = hours;
    if (countdownMinutes) countdownMinutes.textContent = minutes;
    if (countdownSeconds) countdownSeconds.textContent = seconds;

    // Update progress bar
    if (countdownProgress) {
      const percentage = (totalSeconds / initialTotalSeconds) * 100;
      countdownProgress.style.width = `${percentage}%`;
    }

    totalSeconds--;
  }

  if (countdownHours) {
    setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  // Per-Deal Countdown Timers
  const dealCountdowns = document.querySelectorAll('.deal-countdown');
  dealCountdowns.forEach(countdown => {
    const endTime = countdown.dataset.endTime;
    // Parse time like "1h45m" or "2h30m"
    const match = endTime.match(/(\d+)h\s*(\d+)m/);
    if (match) {
      let dealSeconds = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60;
      
      setInterval(() => {
        if (dealSeconds <= 0) {
          countdown.textContent = 'EXPIRED';
          return;
        }

        const h = Math.floor(dealSeconds / 3600);
        const m = Math.floor((dealSeconds % 3600) / 60);
        countdown.textContent = `${h}h ${m}m`;
        dealSeconds--;
      }, 1000);
    }
  });

  // Carousel Functionality
  const carouselTrack = document.getElementById('flashCarouselTrack');
  const prevBtn = document.querySelector('.flash-carousel-prev');
  const nextBtn = document.querySelector('.flash-carousel-next');
  const dots = document.querySelectorAll('.flash-dot');

  let currentSlide = 0;
  let isAutoRotating = true;
  let autoRotateInterval;

  function updateCarousel() {
    if (!carouselTrack) return;
    const slideWidth = carouselTrack.children[0]?.offsetWidth || 0;
    const gap = 32; // 2rem gap
    const offset = -(currentSlide * (slideWidth + gap));
    carouselTrack.style.transform = `translateX(${offset}px)`;

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function nextSlide() {
    const totalSlides = carouselTrack?.children.length || 0;
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    const totalSlides = carouselTrack?.children.length || 0;
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  function startAutoRotate() {
    autoRotateInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoRotate();
      setTimeout(startAutoRotate, 10000); // Resume after 10s
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoRotate();
      setTimeout(startAutoRotate, 10000);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateCarousel();
      stopAutoRotate();
      setTimeout(startAutoRotate, 10000);
    });
  });

  // Pause on hover
  if (carouselTrack) {
    carouselTrack.addEventListener('mouseenter', stopAutoRotate);
    carouselTrack.addEventListener('mouseleave', startAutoRotate);
  }

  // Start auto-rotation
  startAutoRotate();
  updateCarousel();

  // Flash Deal CTA Buttons
  const flashCTAs = document.querySelectorAll('.flash-deal-cta-btn');
  flashCTAs.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.flash-deal-card-enhanced');
      const dealName = card.querySelector('.flash-deal-name').textContent;
      alert(`Booking ${dealName}...`);
      // window.location.href = `booking.html?deal=${encodeURIComponent(dealName)}`;
    });
  });

  // Notify Me Button
  const notifyBtn = document.querySelector('.flash-notify-btn');
  if (notifyBtn) {
    notifyBtn.addEventListener('click', () => {
      const email = prompt('Enter your email for flash deal notifications:');
      if (email) {
        alert(`You'll be notified at ${email} for upcoming deals!`);
      }
    });
  }

})();

// ============================================
// TRAVEL INSPIRATION FEED FUNCTIONALITY
// ============================================

(function() {
  'use strict';

  // Engagement Buttons (Like, Comment, Save, Share)
  const engagementBtns = document.querySelectorAll('.engagement-btn');

  engagementBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      const metricCount = btn.querySelector('.metric-count');

      if (action === 'like') {
        btn.classList.toggle('liked');
        const currentCount = parseInt(metricCount.textContent.replace('k', '')) * 1000;
        metricCount.textContent = `${((currentCount + (btn.classList.contains('liked') ? 1 : -1)) / 1000).toFixed(1)}k`;
      } else if (action === 'comment') {
        alert('Opening comments...');
      } else if (action === 'save') {
        btn.classList.toggle('saved');
        alert(btn.classList.contains('saved') ? 'Story saved!' : 'Story unsaved');
      } else if (action === 'share') {
        alert('Share options: WhatsApp, Instagram, Email, Copy link');
      }
    });
  });

  // Plan Similar Trip Buttons
  const planTripBtns = document.querySelectorAll('.story-plan-trip-btn');
  planTripBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.inspiration-story-card');
      const destination = card.querySelector('.story-destination-badge').textContent.trim();
      alert(`Planning trip to ${destination}...`);
      // Pre-fill booking form with destination
    });
  });

  // Upload Story Button
  const uploadStoryBtn = document.querySelector('.upload-story-btn');
  if (uploadStoryBtn) {
    uploadStoryBtn.addEventListener('click', () => {
      alert('Story upload modal opening...\n\nSteps:\n1. Select image/video\n2. Add destination & dates\n3. Add budget & description\n4. Publish!');
    });
  }

  // View Breakdown Buttons
  const viewBreakdownBtns = document.querySelectorAll('.view-breakdown-btn');
  viewBreakdownBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Full budget breakdown modal opening...');
    });
  });

  // Horizontal Scroll with Snap
  const feedContainer = document.querySelector('.inspiration-feed-container');
  if (feedContainer) {
    // Touch swipe support
    let startX = 0;
    let scrollLeft = 0;

    feedContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - feedContainer.offsetLeft;
      scrollLeft = feedContainer.scrollLeft;
    });

    feedContainer.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - feedContainer.offsetLeft;
      const walk = (x - startX) * 2;
      feedContainer.scrollLeft = scrollLeft - walk;
    });
  }

})();

// ============================================
// FLEXIBLE BOOKING OPTIONS FUNCTIONALITY
// ============================================

(function() {
  'use strict';

  // EMI Calculator Slider
  const emiSlider = document.getElementById('emiTenureSlider');
  const emiMonthlyAmount = document.getElementById('emiMonthlyAmount');
  const emiTenurePeriod = document.getElementById('emiTenurePeriod');

  if (emiSlider && emiMonthlyAmount && emiTenurePeriod) {
    const totalPrice = 60000;

    function updateEMI() {
      const months = parseInt(emiSlider.value);
      const monthlyAmount = Math.round(totalPrice / months);
      
      emiMonthlyAmount.textContent = `₹${monthlyAmount.toLocaleString()}/month`;
      emiTenurePeriod.textContent = `(${months} months)`;
    }

    emiSlider.addEventListener('input', updateEMI);
    updateEMI();
  }

  // Alternative Dates Selection
  const altDateOptions = document.querySelectorAll('.alt-date-option');
  altDateOptions.forEach(option => {
    option.addEventListener('click', () => {
      altDateOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      const dateRange = option.querySelector('.alt-date-range').textContent;
      const price = option.querySelector('.alt-date-price').textContent;
      alert(`Selected: ${dateRange} for ${price}`);
    });
  });

  // Booking Card CTAs
  const bookingCardCTAs = document.querySelectorAll('.booking-card-cta');
  bookingCardCTAs.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.flexible-booking-card');
      const title = card.querySelector('.booking-card-title').textContent;
      
      if (title.includes('EMI')) {
        alert('Checking EMI options...\n\nPartners: Bajaj Finserv, HDFC, ICICI\n0% interest available');
      } else if (title.includes('Split')) {
        alert('Creating split payment link...\n\nShare with friends to divide costs!');
      } else if (title.includes('Cancellation')) {
        alert('Booking with free cancellation policy...\n\nFull refund till 24hrs before departure');
      } else if (title.includes('Alternative')) {
        alert('Booking best price dates...\n\nYou save ₹8,000!');
      }
    });
  });

})();

// ============================================
// GROUP TRAVEL PLANNER: Voting, Itinerary, Group Creation
// ============================================
(function(){
  'use strict';

  // Debounced voting for shared wishlist
  const voteButtons = document.querySelectorAll('.btn-vote');
  const VOTE_KEY = 'groupPlannerVotes_v1';
  let voteState = JSON.parse(localStorage.getItem(VOTE_KEY) || '{}');

  function saveVotes() { localStorage.setItem(VOTE_KEY, JSON.stringify(voteState)); }

  function updateVoteUI() {
    // For demo, update any mini counts present
    document.querySelectorAll('.mini-dest-card').forEach((card,i)=>{
      const span = card.querySelector('.text-sm');
      // No strict mapping in demo; keep visual consistent
    });
  }

  // simple debounce
  function debounce(fn, ms){ let id; return (...args)=>{ clearTimeout(id); id=setTimeout(()=>fn(...args), ms); }; }

  const applyVote = debounce((action)=>{
    // action: 'inc' or 'dec' - demo: toggle a demo counter
    const demoKey = 'demo_shared_wishlist_count';
    let val = parseInt(localStorage.getItem(demoKey) || '20',10);
    if(action==='inc') val++; else if(action==='dec' && val>0) val--;
    localStorage.setItem(demoKey, String(val));
    updateVoteUI();
  }, 500);

  voteButtons.forEach(btn => {
    btn.addEventListener('click', (e)=>{
      const cls = btn.classList.contains('vote-plus') ? 'inc' : 'dec';
      applyVote(cls);
      btn.classList.add('active');
      setTimeout(()=>btn.classList.remove('active'),250);
    });
  });

  // Drag & drop itinerary
  const itContainer = document.querySelector('.mini-itinerary');
  if(itContainer){
    let dragEl = null;
    itContainer.addEventListener('dragstart', (e)=>{
      dragEl = e.target;
      e.dataTransfer.effectAllowed = 'move';
      e.target.classList.add('dragging');
    });
    itContainer.addEventListener('dragend', (e)=>{
      if(e.target) e.target.classList.remove('dragging');
      dragEl = null;
    });
    itContainer.addEventListener('dragover', (e)=>{
      e.preventDefault();
      const after = getDragAfterElement(itContainer, e.clientY);
      if(after == null) itContainer.appendChild(dragEl);
      else itContainer.insertBefore(dragEl, after);
    });

    function getDragAfterElement(container, y){
      const draggableElements = [...container.querySelectorAll('.it-item:not(.dragging)')];
      return draggableElements.reduce((closest, child)=>{
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height/2;
        if(offset < 0 && offset > closest.offset) return { offset: offset, element: child };
        return closest;
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  }

  // Create Group CTA -> lightweight modal flow using prompts (demo)
  const createGroupBtn = document.getElementById('createGroupBtn');
  if(createGroupBtn){
    createGroupBtn.addEventListener('click', ()=>{
      const tripName = prompt('Trip name (e.g., Goa Getaway 2025)');
      if(!tripName) return;
      const dest = prompt('Destination');
      if(!dest) return;
      const dates = prompt('Dates (start - end)');
      const size = prompt('Group size (1-20)', '4');

      const group = { id: 'grp_'+Date.now(), tripName, dest, dates, size: parseInt(size||4,10), created: Date.now() };
      // save to localStorage
      const groups = JSON.parse(localStorage.getItem('userGroups') || '[]');
      groups.push(group);
      localStorage.setItem('userGroups', JSON.stringify(groups));

      alert('Group created! Opening Trip Dashboard...');
      // redirect placeholder
      // window.location.href = 'group-dashboard.html?gid='+encodeURIComponent(group.id);
    });
  }

})();

// ============================================
// LOCAL EXPERIENCES: Filters, Booking, Modal
// ============================================
(function(){
  'use strict';

  const filterButtons = document.querySelectorAll('#experienceFilters .filter-pill');
  const experienceCards = document.querySelectorAll('#experiencesGrid .experience-card');

  const activeFilters = new Set();
  const applyFilters = debounce(()=>{
    const filters = Array.from(activeFilters);
    experienceCards.forEach(card=>{
      const cat = card.getAttribute('data-category') || '';
      if(filters.length===0 || filters.includes(cat)) card.style.display = '';
      else card.style.display = 'none';
    });
  }, 300);

  filterButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const f = btn.getAttribute('data-filter');
      btn.classList.toggle('active');
      if(btn.classList.contains('active')) activeFilters.add(f); else activeFilters.delete(f);
      applyFilters();
    });
  });

  // Booking actions
  document.querySelectorAll('.btn-book-quick').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const card = btn.closest('.experience-card');
      const title = card.querySelector('h3').textContent;
      alert(`Instantly booked: ${title} — confirmation will be sent via email.`);
    });
  });

  document.querySelectorAll('.btn-request').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const card = btn.closest('.experience-card');
      const title = card.querySelector('h3').textContent;
      alert(`Request sent to local guide for: ${title}. They will confirm shortly.`);
    });
  });

})();

// ============================================
// SUSTAINABILITY: Carbon Calc, Offsets, GreenPoints
// ============================================
(function(){
  'use strict';

  const carbonDestination = document.getElementById('carbonDestination');
  const carbonResults = document.getElementById('carbonResults');
  const carbonKg = document.getElementById('carbonKg');
  const treeCount = document.getElementById('treeCount');
  const offsetNowBtn = document.getElementById('offsetNowBtn');
  const addOffsetBtn = document.getElementById('addOffsetBtn');

  const transportRadios = document.getElementsByName('transport');

  function getTransportMode(){
    for(const r of transportRadios) if(r.checked) return r.value;
    return 'flight';
  }

  function calcCO2(mode){
    // Demo values (round-trip estimate)
    const map = { flight:245, train:82, bus:45, car:150 };
    return map[mode] || 100;
  }

  function updateCarbon(){
    const mode = getTransportMode();
    const kg = calcCO2(mode);
    if(carbonResults) carbonResults.classList.remove('hidden');
    if(carbonKg) carbonKg.textContent = `${kg} kg CO2`;
    if(treeCount) treeCount.textContent = String(Math.max(1, Math.round(kg/15)));
  }

  if(carbonDestination){
    carbonDestination.addEventListener('change', updateCarbon);
  }
  Array.from(transportRadios).forEach(r=>r.addEventListener('change', updateCarbon));

  if(offsetNowBtn){
    offsetNowBtn.addEventListener('click', ()=>{
      // Demo: add 10 GreenPoints and show success
      const pts = parseInt(localStorage.getItem('greenPoints')||'0',10) + 10;
      localStorage.setItem('greenPoints', String(pts));
      alert('✅ 15 trees planted in your name! You earned +10 GreenPoints.');
      // update progress (if exists)
      const prog = document.getElementById('greenProgress');
      if(prog){ prog.style.width = Math.min(100, (pts/500)*100)+'%'; }
    });
  }

  if(addOffsetBtn){
    addOffsetBtn.addEventListener('click', ()=>{
      alert('Carbon offset added to booking (+₹500)');
    });
  }

  // initial update
  updateCarbon();

})();

// ============================================
// ENHANCED CATEGORY SECTION FUNCTIONALITY
// ============================================
(function() {
  'use strict';

  const categoryCards = document.querySelectorAll('.category-card-enhanced');
  
  // Category selection state
  let selectedCategory = null;

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      selectedCategory = category;
      
      // Visual feedback
      categoryCards.forEach(c => c.style.opacity = '0.6');
      card.style.opacity = '1';
      
      // Store selection
      localStorage.setItem('selectedCategory', category);
      
      // Show notification
      showToast(`${card.querySelector('h3').textContent} selected! Loading packages...`);
      
      // Simulate navigation (replace with actual routing)
      setTimeout(() => {
        console.log(`Navigate to ${category} packages`);
        categoryCards.forEach(c => c.style.opacity = '1');
      }, 1500);
    });

    // Hover analytics
    card.addEventListener('mouseenter', () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'category_hover', {
          'event_category': 'engagement',
          'event_label': card.dataset.category
        });
      }
    });
  });

  // Mobile: Always show stats
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.category-stats').forEach(stat => {
      stat.style.opacity = '1';
    });
  }

})();

// ============================================
// TRAVEL INSURANCE COMPARISON FUNCTIONALITY
// ============================================
(function() {
  'use strict';

  const coverageViewBtn = document.getElementById('coverageViewBtn');
  const scenarioViewBtn = document.getElementById('scenarioViewBtn');
  const coverageView = document.getElementById('coverageView');
  const scenarioView = document.getElementById('scenarioView');
  const insuranceCTAs = document.querySelectorAll('.insurance-cta-btn');

  // State
  let selectedPlan = null;
  let insuranceAdded = false;

  // Toggle between views
  function switchView(viewType) {
    if (viewType === 'coverage') {
      coverageView.classList.remove('hidden');
      scenarioView.classList.add('hidden');
      coverageViewBtn.classList.add('active');
      coverageViewBtn.classList.add('border-blue-600', 'bg-blue-600', 'text-white');
      coverageViewBtn.classList.remove('border-gray-300', 'text-gray-600');
      scenarioViewBtn.classList.remove('active');
      scenarioViewBtn.classList.add('border-gray-300', 'text-gray-600');
      scenarioViewBtn.classList.remove('border-blue-600', 'bg-blue-600', 'text-white');
    } else {
      coverageView.classList.add('hidden');
      scenarioView.classList.remove('hidden');
      scenarioViewBtn.classList.add('active');
      scenarioViewBtn.classList.add('border-blue-600', 'bg-blue-600', 'text-white');
      scenarioViewBtn.classList.remove('border-gray-300', 'text-gray-600');
      coverageViewBtn.classList.remove('active');
      coverageViewBtn.classList.add('border-gray-300', 'text-gray-600');
      coverageViewBtn.classList.remove('border-blue-600', 'bg-blue-600', 'text-white');
    }
  }

  if (coverageViewBtn) {
    coverageViewBtn.addEventListener('click', () => switchView('coverage'));
  }

  if (scenarioViewBtn) {
    scenarioViewBtn.addEventListener('click', () => switchView('scenario'));
  }

  // Plan selection
  insuranceCTAs.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const plans = ['basic', 'standard', 'premium'];
      const prices = [299, 599, 999];
      selectedPlan = plans[index];
      insuranceAdded = true;

      // Store in localStorage
      localStorage.setItem('selectedInsurance', JSON.stringify({
        plan: selectedPlan,
        price: prices[index]
      }));

      // Show confirmation
      showToast(`${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} insurance plan added! ₹${prices[index]}`);

      // Track analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'insurance_selected', {
          'event_category': 'conversion',
          'event_label': selectedPlan,
          'value': prices[index]
        });
      }
    });
  });

})();

// ============================================
// DYNAMIC PRICING CALENDAR FUNCTIONALITY
// ============================================
(function() {
  'use strict';

  const calendarDays = document.getElementById('calendarDays');
  const currentMonthYear = document.getElementById('currentMonthYear');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const flexibleDatesCheckbox = document.getElementById('flexibleDatesCheckbox');
  const viewWeekendsBtn = document.getElementById('viewWeekendsBtn');
  const browseMonthBtn = document.getElementById('browseMonthBtn');
  const flexibleResultsTable = document.getElementById('flexibleResultsTable');
  const flexibleResultsBody = document.getElementById('flexibleResultsBody');
  const secureBookingBtn = document.getElementById('secureBookingBtn');
  const priceAlertBtn = document.getElementById('priceAlertBtn');

  // State
  let currentDate = new Date();
  let selectedDateRange = { start: null, end: null };
  let flexibility = { daysRange: 0, weekendOnly: false };

  // Generate random price within range
  function generatePrice(dateObj) {
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = Math.random() < 0.1;
    
    let basePrice = 20000 + Math.random() * 60000;
    if (isWeekend) basePrice *= 1.2;
    if (isHoliday) basePrice *= 1.3;
    
    return Math.round(basePrice / 1000) * 1000;
  }

  // Get price color class
  function getPriceClass(price) {
    if (price < 40000) return 'price-green';
    if (price < 60000) return 'price-yellow';
    if (price < 80000) return 'price-orange';
    return 'price-red';
  }

  // Format price
  function formatPrice(price) {
    return `₹${(price / 1000).toFixed(0)}K`;
  }

  // Render calendar
  function renderCalendar() {
    if (!calendarDays) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    if (currentMonthYear) {
      currentMonthYear.textContent = `${monthNames[month]} ${year}`;
    }

    // Clear previous days
    calendarDays.innerHTML = '';

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Add empty cells for days before month starts
    const startDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
    for (let i = 0; i < startDay; i++) {
      const emptyCell = document.createElement('div');
      calendarDays.appendChild(emptyCell);
    }

    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const isPast = dateObj < today.setHours(0, 0, 0, 0);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
      const isHoliday = Math.random() < 0.1;
      const isBestDeal = Math.random() < 0.05;

      const dayCell = document.createElement('div');
      dayCell.className = 'calendar-day';
      
      if (isPast) {
        dayCell.classList.add('unavailable');
      } else {
        const price = generatePrice(dateObj);
        dayCell.classList.add(getPriceClass(price));
        
        if (isWeekend) dayCell.classList.add('weekend');
        if (isHoliday) dayCell.classList.add('holiday');
        if (isBestDeal) dayCell.classList.add('best-deal');

        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'price-tooltip';
        tooltip.textContent = formatPrice(price);
        if (isHoliday) tooltip.textContent += ' • Holiday +30%';
        dayCell.appendChild(tooltip);

        // Click handler
        dayCell.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
          dayCell.classList.add('selected');
          selectedDateRange.start = dateObj;
          showToast(`Selected: ${dateObj.toLocaleDateString()} - ${formatPrice(price)}`);
        });
      }

      dayCell.innerHTML += `<span>${day}</span>`;
      calendarDays.appendChild(dayCell);
    }
  }

  // Month navigation
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }

  // Flexible dates
  if (flexibleDatesCheckbox) {
    flexibleDatesCheckbox.addEventListener('change', (e) => {
      flexibility.daysRange = e.target.checked ? 3 : 0;
      if (e.target.checked) {
        showFlexibleResults();
      } else {
        flexibleResultsTable.classList.add('hidden');
      }
    });
  }

  // Show flexible results
  function showFlexibleResults() {
    if (!flexibleResultsBody) return;

    flexibleResultsTable.classList.remove('hidden');
    flexibleResultsBody.innerHTML = '';

    // Generate 5 sample date ranges
    for (let i = 0; i < 5; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i * 3) + 5);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 3);

      const yourPrice = 45999 + (i * 2000);
      const typicalPrice = yourPrice + 8000;
      const savings = typicalPrice - yourPrice;

      const row = document.createElement('tr');
      row.className = i === 0 ? 'best-price' : '';
      row.innerHTML = `
        <td class="px-6 py-4 font-medium text-gray-900">
          ${startDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - 
          ${endDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
        </td>
        <td class="px-6 py-4 text-center text-gray-700">3 nights</td>
        <td class="px-6 py-4 text-center font-bold text-green-600">${formatPrice(yourPrice)}</td>
        <td class="px-6 py-4 text-center text-gray-500 line-through">${formatPrice(typicalPrice)}</td>
        <td class="px-6 py-4 text-center font-bold text-orange-600">${formatPrice(savings)}</td>
        <td class="px-6 py-4 text-center">
          <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm">
            Select
          </button>
        </td>
      `;

      row.addEventListener('click', () => {
        showToast(`Dates selected: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
      });

      flexibleResultsBody.appendChild(row);
    }
  }

  // View weekends
  if (viewWeekendsBtn) {
    viewWeekendsBtn.addEventListener('click', () => {
      flexibility.weekendOnly = true;
      showFlexibleResults();
      showToast('Showing weekend deals...');
    });
  }

  // Browse month
  if (browseMonthBtn) {
    browseMonthBtn.addEventListener('click', () => {
      showFlexibleResults();
      showToast('Browsing all dates for the month...');
    });
  }

  // Secure booking
  if (secureBookingBtn) {
    secureBookingBtn.addEventListener('click', () => {
      if (selectedDateRange.start) {
        showToast('Redirecting to booking page...');
        setTimeout(() => {
          window.location.href = 'booking.html';
        }, 1000);
      } else {
        showToast('Please select a date first');
      }
    });
  }

  // Price alert
  if (priceAlertBtn) {
    priceAlertBtn.addEventListener('click', () => {
      const email = prompt('Enter your email for price drop alerts:');
      if (email && email.includes('@')) {
        localStorage.setItem('priceAlertEmail', email);
        showToast(`✓ Alert set! We'll notify ${email} when prices drop`);
      }
    });
  }

  // Initialize Chart.js for price history
  const chartCanvas = document.getElementById('priceHistoryChart');
  if (chartCanvas && typeof Chart !== 'undefined') {
    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'Price',
          data: Array.from({length: 30}, () => 40000 + Math.random() * 30000),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `₹${context.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          x: { display: false },
          y: {
            display: true,
            ticks: {
              callback: (value) => `₹${(value / 1000).toFixed(0)}K`,
              font: { size: 10 }
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  // Initialize calendar
  renderCalendar();

})();

// ============================================
// UTILITY: SHOW TOAST NOTIFICATION
// ============================================
function showToast(message) {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg mb-3 animate-fade-in';
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Helper function for debouncing
function debounce(fn, ms) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}
