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
// DYNAMIC PRICING CALENDAR FUNCTIONALITY - REMOVED
// ============================================
// (Section removed as calendar feature was deleted from homepage)

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

// ============================================
// MULTI-DESTINATION ROUTE OPTIMIZER - REMOVED
// ============================================
// (Section removed as route optimizer feature was deleted from homepage)

// ============================================
// NEWSLETTER WITH QUIZ - REMOVED
// ============================================
// (Section removed as newsletter quiz feature was deleted from homepage)

// ============================================
// CONTINUE WITH REMAINING FUNCTIONALITY
// ============================================
(function() {
  'use strict';

  // Secure booking and price alert buttons (if they exist elsewhere)
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

// ============================================
// MULTI-DESTINATION ROUTE OPTIMIZER
// ============================================
(function() {
  'use strict';

  const routeDestinationInput = document.getElementById('routeDestinationInput');
  const routeAutocomplete = document.getElementById('routeAutocomplete');
  const addDestinationBtn = document.getElementById('addDestinationBtn');
  const destinationList = document.getElementById('destinationList');
  const optimizeRouteBtn = document.getElementById('optimizeRouteBtn');
  const routeMap = document.getElementById('routeMap');
  const routeDetailsCard = document.getElementById('routeDetailsCard');
  const routeLegs = document.getElementById('routeLegs');
  const totalCost = document.getElementById('totalCost');
  const totalTime = document.getElementById('totalTime');
  const savingsBadge = document.getElementById('savingsBadge');
  const bookRouteBtn = document.getElementById('bookRouteBtn');
  const downloadItineraryBtn = document.getElementById('downloadItineraryBtn');

  // Sample cities database
  const cities = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Goa', lat: 15.2993, lng: 74.1240 },
    { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
    { name: 'Bangkok', lat: 13.7563, lng: 100.5018 },
    { name: 'Bali', lat: -8.4095, lng: 115.1889 },
    { name: 'Maldives', lat: 3.2028, lng: 73.2207 }
  ];

  let destinations = [];
  let map = null;
  let sortable = null;

  // Autocomplete
  if (routeDestinationInput) {
    routeDestinationInput.addEventListener('input', debounce((e) => {
      const value = e.target.value.trim();
      if (value.length < 2) {
        routeAutocomplete.classList.add('hidden');
        return;
      }

      const filtered = cities.filter(city => 
        city.name.toLowerCase().includes(value.toLowerCase())
      );

      if (filtered.length === 0) {
        routeAutocomplete.classList.add('hidden');
        return;
      }

      routeAutocomplete.innerHTML = filtered.map(city => 
        `<div class="p-3 hover:bg-gray-100 cursor-pointer" data-city="${city.name}">${city.name}</div>`
      ).join('');

      routeAutocomplete.classList.remove('hidden');

      // Add click handlers
      routeAutocomplete.querySelectorAll('[data-city]').forEach(item => {
        item.addEventListener('click', () => {
          routeDestinationInput.value = item.dataset.city;
          routeAutocomplete.classList.add('hidden');
        });
      });
    }, 300));
  }

  // Add destination
  if (addDestinationBtn) {
    addDestinationBtn.addEventListener('click', () => {
      const cityName = routeDestinationInput.value.trim();
      const city = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());

      if (!city) {
        showToast('Please select a valid city from the list');
        return;
      }

      if (destinations.find(d => d.name === city.name)) {
        showToast('City already added');
        return;
      }

      if (destinations.length >= 6) {
        showToast('Maximum 6 destinations allowed');
        return;
      }

      destinations.push(city);
      renderDestinations();
      routeDestinationInput.value = '';
      routeAutocomplete.classList.add('hidden');

      if (destinations.length >= 2) {
        optimizeRouteBtn.disabled = false;
      }
    });
  }

  // Render destinations
  function renderDestinations() {
    if (!destinationList) return;

    if (destinations.length === 0) {
      destinationList.innerHTML = `
        <div class="text-center text-gray-400 py-8">
          <i class="fas fa-map-marked-alt text-4xl mb-2"></i>
          <p>Add at least 2 destinations to begin</p>
        </div>
      `;
      return;
    }

    destinationList.innerHTML = destinations.map((city, index) => `
      <div class="destination-item" data-id="${index}">
        <span class="drag-handle"><i class="fas fa-grip-vertical"></i></span>
        <div class="flex-1">
          <p class="font-semibold text-gray-900">${index + 1}. ${city.name}</p>
        </div>
        <button class="remove-destination text-red-600 hover:text-red-700" data-index="${index}">
          <i class="fas fa-times-circle text-xl"></i>
        </button>
      </div>
    `).join('');

    // Remove destination handlers
    destinationList.querySelectorAll('.remove-destination').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        destinations.splice(index, 1);
        renderDestinations();

        if (destinations.length < 2) {
          optimizeRouteBtn.disabled = true;
          routeDetailsCard.classList.add('hidden');
        }
      });
    });

    // Initialize SortableJS
    if (typeof Sortable !== 'undefined' && !sortable) {
      sortable = Sortable.create(destinationList, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: (evt) => {
          const item = destinations.splice(evt.oldIndex, 1)[0];
          destinations.splice(evt.newIndex, 0, item);
          renderDestinations();
        }
      });
    }
  }

  // Initialize map
  function initMap() {
    if (!routeMap || typeof L === 'undefined') return;

    if (map) {
      map.remove();
    }

    routeMap.innerHTML = '';
    routeMap.classList.remove('flex', 'items-center', 'justify-center', 'text-gray-400', 'bg-gray-100');
    
    map = L.map('routeMap').setView([20.5937, 78.9629], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers
    destinations.forEach((city, index) => {
      L.marker([city.lat, city.lng])
        .addTo(map)
        .bindPopup(`<b>${index + 1}. ${city.name}</b>`)
        .openPopup();
    });

    // Draw route lines
    if (destinations.length >= 2) {
      const latLngs = destinations.map(city => [city.lat, city.lng]);
      L.polyline(latLngs, { color: '#10b981', weight: 3 }).addTo(map);

      // Fit bounds
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  // Calculate distance
  function calculateDistance(city1, city2) {
    const R = 6371; // Earth radius in km
    const dLat = (city2.lat - city1.lat) * Math.PI / 180;
    const dLng = (city2.lng - city1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(city1.lat * Math.PI / 180) * Math.cos(city2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  }

  // Optimize route
  if (optimizeRouteBtn) {
    optimizeRouteBtn.addEventListener('click', () => {
      if (destinations.length < 2) return;

      initMap();
      renderRouteDetails();
      routeDetailsCard.classList.remove('hidden');
      
      // Scroll to route details
      setTimeout(() => {
        routeDetailsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });
  }

  // Render route details
  function renderRouteDetails() {
    if (!routeLegs) return;

    let totalCostValue = 0;
    let totalTimeValue = 0;

    routeLegs.innerHTML = '';

    for (let i = 0; i < destinations.length - 1; i++) {
      const from = destinations[i];
      const to = destinations[i + 1];
      const distance = calculateDistance(from, to);
      
      // Calculate prices and times for different modes
      const modes = {
        flight: { cost: distance * 8, time: Math.ceil(distance / 600) + 2, icon: 'fa-plane' },
        train: { cost: distance * 3, time: Math.ceil(distance / 80), icon: 'fa-train' },
        car: { cost: distance * 5, time: Math.ceil(distance / 60), icon: 'fa-car' }
      };

      // Default to cheapest
      const cheapest = Object.keys(modes).reduce((a, b) => modes[a].cost < modes[b].cost ? a : b);
      
      totalCostValue += modes[cheapest].cost;
      totalTimeValue += modes[cheapest].time;

      const legHTML = `
        <div class="route-leg">
          <div class="flex-1">
            <p class="text-sm text-gray-600 mb-1">Leg ${i + 1}</p>
            <p class="text-lg font-bold text-gray-900">${from.name} → ${to.name}</p>
            <p class="text-sm text-gray-500">${distance} km</p>
          </div>
          <div class="flex gap-2 flex-wrap">
            ${Object.entries(modes).map(([mode, data]) => `
              <button class="transport-mode-btn ${mode === cheapest ? 'active' : ''}" data-leg="${i}" data-mode="${mode}">
                <i class="fas ${data.icon} mr-1"></i>
                <div class="text-xs">${mode}</div>
                <div class="text-xs font-bold">₹${data.cost.toLocaleString()}</div>
                <div class="text-xs">${data.time}h</div>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      routeLegs.innerHTML += legHTML;
    }

    // Add transport mode switchers
    document.querySelectorAll('.transport-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const leg = btn.dataset.leg;
        document.querySelectorAll(`[data-leg="${leg}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateTotals();
      });
    });

    updateTotals();
  }

  // Update totals
  function updateTotals() {
    let cost = 0;
    let time = 0;

    document.querySelectorAll('.transport-mode-btn.active').forEach(btn => {
      const costText = btn.querySelector('div:nth-child(3)').textContent;
      const timeText = btn.querySelector('div:nth-child(4)').textContent;
      cost += parseInt(costText.replace(/[^0-9]/g, ''));
      time += parseInt(timeText.replace(/[^0-9]/g, ''));
    });

    if (totalCost) totalCost.textContent = `₹${cost.toLocaleString()}`;
    if (totalTime) totalTime.textContent = `${time}h`;
    
    const savings = cost * 0.15; // 15% savings
    if (savingsBadge) savingsBadge.textContent = `₹${Math.round(savings).toLocaleString()}`;
  }

  // Book route
  if (bookRouteBtn) {
    bookRouteBtn.addEventListener('click', () => {
      showToast('Redirecting to booking page...');
      setTimeout(() => {
        localStorage.setItem('multiDestinationRoute', JSON.stringify(destinations));
        window.location.href = 'booking.html';
      }, 1000);
    });
  }

  // Download itinerary
  if (downloadItineraryBtn) {
    downloadItineraryBtn.addEventListener('click', () => {
      const itinerary = destinations.map((city, i) => 
        `${i + 1}. ${city.name}`
      ).join('\n');
      
      const blob = new Blob([`Your Multi-City Route\n\n${itinerary}\n\nTotal Cost: ${totalCost.textContent}\nTotal Time: ${totalTime.textContent}`], 
        { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'route-itinerary.txt';
      a.click();
      URL.revokeObjectURL(url);
      
      showToast('Itinerary downloaded!');
    });
  }

})();

// ============================================
// NEWSLETTER WITH QUIZ
// ============================================
(function() {
  'use strict';

  const quizContainer = document.getElementById('quizContainer');
  const quizProgress = document.getElementById('quizProgress');
  const quizProgressText = document.getElementById('quizProgressText');
  const questionContainer = document.getElementById('questionContainer');
  const quizResults = document.getElementById('quizResults');
  const resultEmoji = document.getElementById('resultEmoji');
  const personalityType = document.getElementById('personalityType');
  const personalityDescription = document.getElementById('personalityDescription');
  const newsletterForm = document.getElementById('newsletterForm');

  let currentQuestion = 1;
  const totalQuestions = 5;
  const answers = {};

  // Personality types
  const personalities = {
    beach: { emoji: '🏖️', name: 'The Beach Lover', desc: 'You\'re drawn to sun, sand, and sea. Your perfect trip involves relaxation by the water.' },
    mountains: { emoji: '🏔️', name: 'The Mountain Explorer', desc: 'Heights and peaks call to you. Adventure in alpine settings is your happy place.' },
    city: { emoji: '🏙️', name: 'The Urban Explorer', desc: 'You thrive in bustling cities, discovering culture, food, and nightlife.' },
    nature: { emoji: '🌿', name: 'The Nature Enthusiast', desc: 'Forests, trails, and wildlife excite you. You seek authentic outdoor experiences.' },
    adventure: { emoji: '🎢', name: 'The Adrenaline Junkie', desc: 'You live for thrills and extreme sports. Your vacations are action-packed adventures.' },
    culture: { emoji: '🎭', name: 'The Culture Seeker', desc: 'Museums, history, and local traditions fascinate you. You travel to learn and grow.' },
    relaxation: { emoji: '🧘', name: 'The Zen Traveler', desc: 'Peace and rejuvenation are your priorities. Spas and quiet retreats restore your soul.' }
  };

  // Quiz answer handlers
  if (questionContainer) {
    const answerButtons = questionContainer.querySelectorAll('.quiz-answer');
    
    answerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.closest('.quiz-question');
        const questionNum = question.dataset.question;
        const answer = btn.dataset.answer;

        // Store answer
        answers[`q${questionNum}`] = answer;

        // Visual feedback
        question.querySelectorAll('.quiz-answer').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        // Move to next question or show results
        setTimeout(() => {
          if (currentQuestion < totalQuestions) {
            currentQuestion++;
            showQuestion(currentQuestion);
          } else {
            showResults();
          }
        }, 500);
      });
    });
  }

  // Show question
  function showQuestion(num) {
    const questions = questionContainer.querySelectorAll('.quiz-question');
    questions.forEach(q => q.classList.remove('active'));
    questions[num - 1].classList.add('active');

    // Update progress
    const progress = (num / totalQuestions) * 100;
    if (quizProgress) quizProgress.style.width = `${progress}%`;
    if (quizProgressText) quizProgressText.textContent = `Question ${num} of ${totalQuestions}`;
  }

  // Show results
  function showResults() {
    if (!quizResults) return;

    // Determine personality type
    const q1 = answers.q1 || 'beach';
    const personality = personalities[q1] || personalities.beach;

    if (resultEmoji) resultEmoji.textContent = personality.emoji;
    if (personalityType) personalityType.textContent = personality.name;
    if (personalityDescription) personalityDescription.textContent = personality.desc;

    // Hide quiz, show results
    if (quizContainer) quizContainer.classList.add('hidden');
    quizResults.classList.remove('hidden');

    // Scroll to results
    setTimeout(() => {
      quizResults.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  // Newsletter form submission
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('newsletterEmail').value;
      
      if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address');
        return;
      }

      // Store subscription
      localStorage.setItem('newsletterSubscribed', 'true');
      localStorage.setItem('newsletterEmail', email);

      // Trigger confetti
      if (typeof confetti !== 'undefined') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      showToast('🎉 Subscribed successfully! Check your email for ₹500 off code');
      
      // Reset form
      newsletterForm.reset();
    });
  }

})();

// ============================================
// COMPREHENSIVE FOOTER FUNCTIONALITY
// ============================================
(function() {
  'use strict';

  const currencySelector = document.getElementById('currencySelector');
  const languageSelector = document.getElementById('languageSelector');
  
  // NOTE: Old footer handlers removed - now handled by footer.js
  // The new luxury footer uses luxuryCurrencySelector, luxuryLanguageSelector, 
  // liveChatCard, whatsappCard, and luxuryNewsletterForm
  
  // Keep legacy currency selector for backward compatibility (if exists on other pages)
  if (currencySelector && currencySelector.id !== 'luxuryCurrencySelector') {
    currencySelector.addEventListener('change', (e) => {
      const currency = e.target.value;
      localStorage.setItem('selectedCurrency', currency);
      showToast(`Currency changed to ${currency}`);
      console.log('Currency changed to:', currency);
    });

    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
      currencySelector.value = savedCurrency;
    }
  }

  // Keep legacy language selector for backward compatibility (if exists on other pages)
  if (languageSelector && languageSelector.id !== 'luxuryLanguageSelector') {
    languageSelector.addEventListener('change', (e) => {
      const language = e.target.value;
      localStorage.setItem('selectedLanguage', language);
      showToast(`Language changed to ${e.target.options[e.target.selectedIndex].textContent}`);
      console.log('Language changed to:', language);
    });

    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      languageSelector.value = savedLanguage;
    }
  }

  // Smooth scroll for footer links (keep for any remaining anchor links)
  document.querySelectorAll('footer a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();

// ============================================
// MICRO-INTERACTIONS: GLOBAL ENHANCEMENTS
// ============================================
(function() {
  'use strict';

  // Apply btn-hover class to all primary buttons
  document.querySelectorAll('button[type="submit"], .btn, .cta-btn, .search-btn-inline, .price-compare-btn, .price-book-now-btn, .flash-deal-cta-btn, .booking-card-cta, .insurance-cta-btn, .modal-done, .trending-quick-view-btn, .card-view-button, .trending-view-all-btn').forEach(btn => {
    btn.classList.add('btn-hover');
  });

  // Apply card-hover to all interactive cards
  document.querySelectorAll('.ai-destination-card, .trending-destination-card, .flash-deal-card-enhanced, .flexible-booking-card, .feature-card, .category-card-enhanced').forEach(card => {
    card.classList.add('card-hover');
  });

  // Apply icon animations
  document.querySelectorAll('.fa-arrow-right, .fa-arrow-down, .fa-chevron-down, .fa-chevron-right').forEach(icon => {
    icon.classList.add('icon-bounce');
  });

  document.querySelectorAll('.fa-heart, .fa-star').forEach(icon => {
    icon.classList.add('icon-pulse');
  });

  document.querySelectorAll('.fa-sync, .fa-rotate, .fa-gear, .fa-cog').forEach(icon => {
    icon.classList.add('icon-rotate');
  });

  // Apply focus glow to all inputs
  document.querySelectorAll('input[type="text"], input[type="email"], input[type="date"], textarea, select').forEach(input => {
    input.classList.add('input-focus');
  });

})();

// ============================================
// SCROLL-TRIGGERED ANIMATIONS: INTERSECTION OBSERVER
// ============================================
(function() {
  'use strict';

  // Setup Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Observe all animated elements
  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // Auto-apply animations to common elements
  // Fade up for headings
  document.querySelectorAll('h2.section-title, h2.ai-section-title, h2.trending-main-title, h2.price-comparison-title, h2.flash-deals-title').forEach(heading => {
    if (!heading.classList.contains('animate-on-scroll')) {
      heading.classList.add('animate-on-scroll', 'fade-up');
      observer.observe(heading);
    }
  });

  // Stagger for grids
  document.querySelectorAll('.ai-cards-grid, .trending-cards-grid, .features-grid, .offers-grid').forEach(grid => {
    if (!grid.classList.contains('animate-on-scroll')) {
      grid.classList.add('animate-on-scroll', 'stagger-children');
      observer.observe(grid);
    }
  });

})();

// ============================================
// NUMBER COUNTER ANIMATION
// ============================================
(function() {
  'use strict';

  function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/,/g, '').replace(/[^\d]/g, ''));
    if (isNaN(target)) return;
    
    const duration = 2000;
    let current = 0;
    const increment = target / (duration / 16);
    const hasDecimal = element.textContent.includes('.');
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        if (hasDecimal) {
          element.textContent = target.toFixed(1);
        } else {
          element.textContent = target.toLocaleString();
        }
        clearInterval(timer);
      } else {
        if (hasDecimal) {
          element.textContent = current.toFixed(1);
        } else {
          element.textContent = Math.floor(current).toLocaleString();
        }
      }
    }, 16);
  }

  // Observe counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter, .stat-number, .trust-number, [data-counter]').forEach(el => {
    counterObserver.observe(el);
  });

})();

// ============================================
// PROGRESS BAR ANIMATION
// ============================================
(function() {
  'use strict';

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.progress-fill');
        fills.forEach(fill => {
          const targetWidth = fill.dataset.width || '100';
          fill.style.setProperty('--target-width', targetWidth + '%');
          fill.classList.add('show');
        });
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.progress-bar, [data-progress]').forEach(el => {
    progressObserver.observe(el);
  });

})();

// ============================================
// SUCCESS CONFETTI ANIMATION
// ============================================
function showSuccess() {
  // Trigger confetti
  if (typeof confetti !== 'undefined') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
    });
  }
  
  // Show checkmark
  const check = document.createElement('div');
  check.className = 'success-check';
  check.innerHTML = '✓';
  document.body.appendChild(check);
  
  setTimeout(() => check.remove(), 2000);
}

// Expose globally
window.showSuccess = showSuccess;

// ============================================
// ENHANCED TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) {
    console.warn('Toast container not found');
    return;
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };
  
  toast.innerHTML = `
    <span style="font-size: 20px; font-weight: bold;">${icons[type] || '✓'}</span>
    <span style="flex: 1;">${message}</span>
  `;
  
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Expose globally (overwrite if exists)
window.showToast = showToast;

// ============================================
// BUTTON LOADING STATE UTILITY
// ============================================
function setLoading(button, loading) {
  if (!button) return;
  
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.classList.add('btn-loading');
    button.innerHTML = `
      <svg class="animate-spin h-5 w-5 inline mr-2" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Loading...
    `;
  } else {
    button.disabled = false;
    button.classList.remove('btn-loading');
    if (button.dataset.originalText) {
      button.innerHTML = button.dataset.originalText;
      delete button.dataset.originalText;
    }
  }
}

// Expose globally
window.setLoading = setLoading;

// ============================================
// SKELETON SCREEN UTILITIES
// ============================================
function showSkeleton(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="space-y-4">
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width: 80%"></div>
      <div class="skeleton skeleton-text" style="width: 60%"></div>
    </div>
  `;
  container.classList.remove('hidden');
}

function hideSkeleton(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.classList.add('hidden');
}

// Expose globally
window.showSkeleton = showSkeleton;
window.hideSkeleton = hideSkeleton;

// ============================================
// APPLY SUCCESS CONFETTI TO FORM SUBMISSIONS
// ============================================
(function() {
  'use strict';

  // Newsletter subscription
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button[type="submit"]');
      
      setLoading(btn, true);
      
      setTimeout(() => {
        setLoading(btn, false);
        showSuccess();
        showToast('🎉 Successfully subscribed to newsletter!');
        newsletterForm.reset();
      }, 1500);
    });
  }

  // Quiz completion
  const quizButtons = document.querySelectorAll('.quiz-answer[data-question="5"]');
  quizButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        showSuccess();
        showToast('🎊 Quiz completed! Check your results below.');
      }, 500);
    });
  });

  // Booking confirmation
  const bookingButtons = document.querySelectorAll('[id*="book"], [id*="Book"]');
  bookingButtons.forEach(btn => {
    const originalHandler = btn.onclick;
    btn.addEventListener('click', function(e) {
      // Only add confetti, don't prevent original functionality
      setTimeout(() => {
        if (this.textContent.toLowerCase().includes('book') || this.textContent.toLowerCase().includes('confirm')) {
          showSuccess();
        }
      }, 100);
    });
  });

})();

// ============================================
// DEMO: APPLY LOADING STATE TO OPTIMIZE BUTTON
// ============================================
(function() {
  'use strict';

  const optimizeBtn = document.getElementById('optimizeRouteBtn');
  if (optimizeBtn) {
    optimizeBtn.addEventListener('click', async function() {
      setLoading(this, true);
      if (window.announce) announce('Calculating optimal route');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLoading(this, false);
      showToast('✓ Route optimized successfully!');
      if (window.announce) announce('Route optimized. Check results below');
    });
  }

})();

// ============================================
// ACCESSIBILITY: SCREEN READER ANNOUNCEMENTS
// ============================================
(function() {
  'use strict';

  // Create or get live region for announcements
  let announcer = document.getElementById('sr-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }

  // Function to announce messages to screen readers
  window.announce = function(message) {
    if (announcer) {
      announcer.textContent = message;
      setTimeout(() => announcer.textContent = '', 100);
    }
  };

})();

// ============================================
// ACCESSIBILITY: KEYBOARD NAVIGATION
// ============================================
(function() {
  'use strict';

  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close all modals
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
      });
      
      // Close guests dropdown
      const guestsDropdown = document.getElementById('guestsDropdown');
      const guestsButton = document.getElementById('guestsButton');
      if (guestsDropdown && !guestsDropdown.hidden) {
        guestsDropdown.hidden = true;
        if (guestsButton) {
          guestsButton.setAttribute('aria-expanded', 'false');
          guestsButton.focus();
        }
      }
      
      if (window.announce) announce('Dialog closed');
    }
  });

  // Navigate quiz answers with arrow keys
  const quizContainer = document.getElementById('questionContainer');
  if (quizContainer) {
    quizContainer.addEventListener('keydown', (e) => {
      const activeQuestion = quizContainer.querySelector('.quiz-question:not(.hidden)');
      if (!activeQuestion) return;
      
      const answers = Array.from(activeQuestion.querySelectorAll('.quiz-answer'));
      const currentIndex = answers.findIndex(btn => btn === document.activeElement);
      
      if (currentIndex === -1) return;
      
      let nextIndex = currentIndex;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = Math.min(currentIndex + 1, answers.length - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = Math.max(currentIndex - 1, 0);
        e.preventDefault();
      }
      
      if (nextIndex !== currentIndex) {
        answers[nextIndex].focus();
        // Update tabindex and aria-checked
        answers.forEach((btn, idx) => {
          btn.setAttribute('tabindex', idx === nextIndex ? '0' : '-1');
        });
      }
    });

    // Enter/Space to select quiz answer
    quizContainer.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('quiz-answer')) {
          e.preventDefault();
          e.target.click();
          if (window.announce) announce('Answer selected. Moving to next question');
        }
      }
    });
  }

  // Navigate destination cards with arrow keys
  document.querySelectorAll('.ai-destinations-grid, .trending-grid, .card-grid').forEach(grid => {
    const cards = Array.from(grid.querySelectorAll('.card-hover, .destination-card, [tabindex="0"]'));
    
    cards.forEach((card, index) => {
      card.addEventListener('keydown', (e) => {
        let nextIndex = index;
        
        if (e.key === 'ArrowRight') {
          nextIndex = Math.min(index + 1, cards.length - 1);
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          nextIndex = Math.max(index - 1, 0);
          e.preventDefault();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Trigger click on card or find clickable element inside
          const link = card.querySelector('a, button');
          if (link) {
            link.click();
          } else {
            card.click();
          }
        }
        
        if (nextIndex !== index) {
          cards[nextIndex].focus();
        }
      });
    });
  });

  // Update guests dropdown aria-expanded
  const guestsButton = document.getElementById('guestsButton');
  const guestsDropdown = document.getElementById('guestsDropdown');
  
  if (guestsButton && guestsDropdown) {
    guestsButton.addEventListener('click', () => {
      setTimeout(() => {
        const isExpanded = !guestsDropdown.hidden;
        guestsButton.setAttribute('aria-expanded', isExpanded.toString());
        if (window.announce) announce(isExpanded ? 'Travelers selector opened' : 'Travelers selector closed');
      }, 50);
    });
  }

  // Make custom interactive elements keyboard accessible
  document.querySelectorAll('[role="button"]:not(button)').forEach(el => {
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
    el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

})();

// ============================================
// ACCESSIBILITY: MODAL FOCUS TRAP
// ============================================
(function() {
  'use strict';

  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
    
    // Focus first element when modal opens
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'aria-hidden') {
          const isVisible = !element.classList.contains('hidden') && element.getAttribute('aria-hidden') !== 'true';
          if (isVisible && focusableElements.length > 0) {
            setTimeout(() => firstElement.focus(), 100);
          }
        }
      });
    });
    
    observer.observe(element, { attributes: true });
  }

  // Apply focus trap to all modals and dialogs
  document.querySelectorAll('.modal, [role="dialog"]').forEach(trapFocus);

  // Expose globally for dynamically created modals
  window.trapFocus = trapFocus;

})();
