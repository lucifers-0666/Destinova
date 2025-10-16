/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DESTINOVA HERO SECTION - REDESIGNED JAVASCRIPT
 * Breathtaking, Conversion-Focused Hero with Premium Interactions
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 1: INITIALIZATION & STATE MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const HeroApp = {
  state: {
    tripType: 'roundtrip',
    from: '',
    to: '',
    departureDate: null,
    returnDate: null,
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'economy',
    directFlights: false,
    nearbyAirports: false,
    flexibleDates: false
  },

  // Sample airport data (in production, fetch from API)
  airports: [
    { city: 'New Delhi', code: 'DEL', country: 'India' },
    { city: 'Mumbai', code: 'BOM', country: 'India' },
    { city: 'Bangalore', code: 'BLR', country: 'India' },
    { city: 'Chennai', code: 'MAA', country: 'India' },
    { city: 'Hyderabad', code: 'HYD', country: 'India' },
    { city: 'Kolkata', code: 'CCU', country: 'India' },
    { city: 'Dubai', code: 'DXB', country: 'UAE' },
    { city: 'London', code: 'LHR', country: 'UK' },
    { city: 'Singapore', code: 'SIN', country: 'Singapore' },
    { city: 'Bangkok', code: 'BKK', country: 'Thailand' },
    { city: 'New York', code: 'JFK', country: 'USA' },
    { city: 'Paris', code: 'CDG', country: 'France' }
  ]
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 2: PAGE LOAD ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initializeParticles();
  initializePromoBanner();
  initializeTrustCounters();
  initializeTripTypeTabs();
  initializeFormInputs();
  initializeSwapButton();
  initializeQuickFilters();
  initializePopularRoutes();
  initializeScrollIndicator();
  initializeFormValidation();
  restoreFormState();
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 3: PARTICLE SYSTEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeParticles() {
  const container = document.getElementById('particlesContainer');
  if (!container) return;

  // Create 40 particles on desktop, 15 on mobile
  const particleCount = window.innerWidth > 768 ? 40 : 15;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 6 + 2; // 2-8px
    const left = Math.random() * 100; // 0-100%
    const duration = Math.random() * 10 + 10; // 10-20s
    const delay = Math.random() * 20; // 0-20s
    const drift = (Math.random() - 0.5) * 100; // -50 to 50px
    
    particle.style.cssText = `
      --size: ${size}px;
      --duration: ${duration}s;
      --delay: ${delay}s;
      --drift: ${drift}px;
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
    `;
    
    container.appendChild(particle);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 4: PROMO BANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializePromoBanner() {
  const promoBanner = document.getElementById('promoBanner');
  const promoClose = document.getElementById('promoClose');
  
  if (!promoBanner || !promoClose) return;

  // Check if user previously closed the banner
  if (sessionStorage.getItem('promoBannerClosed')) {
    promoBanner.style.display = 'none';
    return;
  }

  promoClose.addEventListener('click', () => {
    promoBanner.classList.add('hidden');
    sessionStorage.setItem('promoBannerClosed', 'true');
    
    setTimeout(() => {
      promoBanner.style.display = 'none';
    }, 400);
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 5: TRUST INDICATORS - ANIMATED COUNTERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeTrustCounters() {
  const counters = document.querySelectorAll('.trust-number');
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseFloat(element.dataset.target);
  const duration = 2000; // 2 seconds
  const startTime = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out-quad)
    const easeOutQuad = progress * (2 - progress);
    const current = target * easeOutQuad;
    
    if (isDecimal) {
      element.textContent = current.toFixed(1);
    } else if (target >= 1000000) {
      element.textContent = (current / 1000000).toFixed(1) + 'M+';
    } else {
      element.textContent = Math.floor(current).toLocaleString() + '+';
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 6: TRIP TYPE TABS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeTripTypeTabs() {
  const tabs = document.querySelectorAll('.trip-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      
      // Add active to clicked tab
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      // Update state
      HeroApp.state.tripType = tab.dataset.trip;
      
      // Handle return date visibility
      handleTripTypeChange();
      
      // Save state
      saveFormState();
    });
  });
}

function handleTripTypeChange() {
  const datesInput = document.getElementById('dates');
  const tripType = HeroApp.state.tripType;
  
  if (tripType === 'oneway') {
    // Hide return date in date picker
    HeroApp.state.returnDate = null;
    if (HeroApp.state.departureDate) {
      datesInput.value = formatDate(HeroApp.state.departureDate);
    }
  } else if (tripType === 'multicity') {
    showToast('Multi-city search coming soon!', 'info');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 7: FORM INPUTS - AUTOCOMPLETE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let activeInput = null;
let autocompleteDebounceTimer = null;

function initializeFormInputs() {
  const fromInput = document.getElementById('from');
  const toInput = document.getElementById('to');
  const datesInput = document.getElementById('dates');
  const travelersInput = document.getElementById('travelers');
  
  // FROM/TO Autocomplete
  [fromInput, toInput].forEach(input => {
    input.addEventListener('focus', handleAirportInputFocus);
    input.addEventListener('input', debounce(handleAirportInputChange, 300));
    input.addEventListener('blur', handleAirportInputBlur);
  });
  
  // Dates Input
  datesInput.addEventListener('click', openDatePicker);
  
  // Travelers Input
  travelersInput.addEventListener('click', openTravelersDropdown);
  
  // Update travelers display
  updateTravelersDisplay();
}

function handleAirportInputFocus(e) {
  activeInput = e.target;
  const inputContainer = e.target.closest('.input-container');
  
  if (e.target.value.length === 0) {
    showRecentSearches(e.target);
  }
}

function handleAirportInputChange(e) {
  const query = e.target.value.trim();
  
  if (query.length < 2) {
    hideAutocomplete();
    return;
  }
  
  searchAirports(query, e.target);
}

function handleAirportInputBlur(e) {
  // Delay to allow clicking autocomplete items
  setTimeout(() => {
    if (document.activeElement !== e.target) {
      hideAutocomplete();
    }
  }, 200);
}

function searchAirports(query, input) {
  const results = HeroApp.airports.filter(airport => {
    const searchStr = `${airport.city} ${airport.code} ${airport.country}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });
  
  showAutocomplete(results, input);
}

function showAutocomplete(results, input) {
  const dropdown = document.getElementById('autocompleteDropdown');
  const content = document.getElementById('autocompleteContent');
  
  if (!dropdown || !content) return;
  
  // Position dropdown below input
  const inputRect = input.getBoundingClientRect();
  const container = input.closest('.input-wrapper');
  
  dropdown.style.cssText = `
    position: absolute;
    top: ${container.offsetTop + container.offsetHeight + 8}px;
    left: ${container.offsetLeft}px;
    width: ${container.offsetWidth}px;
  `;
  
  // Build dropdown content
  if (results.length === 0) {
    content.innerHTML = `
      <div class="autocomplete-empty">
        <i data-lucide="search" style="width: 32px; height: 32px; opacity: 0.3;"></i>
        <p>No airports found</p>
        <small>Try a different search term</small>
      </div>
    `;
  } else {
    content.innerHTML = results.map(airport => `
      <div class="autocomplete-item" data-city="${airport.city}" data-code="${airport.code}">
        <i data-lucide="plane" class="autocomplete-icon"></i>
        <div class="autocomplete-details">
          <div class="autocomplete-city">${airport.city}</div>
          <div class="autocomplete-country">${airport.country}</div>
        </div>
        <div class="autocomplete-code">${airport.code}</div>
      </div>
    `).join('');
    
    // Add click handlers
    content.querySelectorAll('.autocomplete-item').forEach(item => {
      item.addEventListener('click', () => selectAirport(item, input));
    });
  }
  
  dropdown.removeAttribute('hidden');
  lucide.createIcons();
}

function selectAirport(item, input) {
  const city = item.dataset.city;
  const code = item.dataset.code;
  
  input.value = `${city} (${code})`;
  
  // Update state
  if (input.id === 'from') {
    HeroApp.state.from = code;
  } else {
    HeroApp.state.to = code;
  }
  
  // Mark as valid
  input.closest('.input-container').classList.add('valid');
  
  // Hide dropdown
  hideAutocomplete();
  
  // Focus next field
  focusNextField(input);
  
  // Validate
  validateField(input);
  
  // Save state
  saveFormState();
}

function hideAutocomplete() {
  const dropdown = document.getElementById('autocompleteDropdown');
  if (dropdown) {
    dropdown.setAttribute('hidden', '');
  }
}

function showRecentSearches(input) {
  const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  
  if (recentSearches.length === 0) {
    // Show popular destinations instead
    const popular = HeroApp.airports.slice(0, 5);
    showAutocomplete(popular, input);
  } else {
    const airports = recentSearches.map(code => 
      HeroApp.airports.find(a => a.code === code)
    ).filter(Boolean);
    showAutocomplete(airports, input);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 8: DATE PICKER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function openDatePicker() {
  const modal = document.getElementById('datePickerModal');
  if (!modal) return;
  
  modal.removeAttribute('hidden');
  renderCalendars();
  setupDatePickerEvents();
}

function closeDatePicker() {
  const modal = document.getElementById('datePickerModal');
  if (modal) {
    modal.setAttribute('hidden', '');
  }
}

function renderCalendars() {
  const container = document.getElementById('calendarsContainer');
  if (!container) return;
  
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  
  container.innerHTML = `
    <div class="calendar-month">
      ${renderMonth(today)}
    </div>
    <div class="calendar-month">
      ${renderMonth(nextMonth)}
    </div>
  `;
  
  // Add click handlers to day cells
  container.querySelectorAll('.day-cell').forEach(cell => {
    cell.addEventListener('click', () => selectDate(cell));
  });
}

function renderMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  let html = `
    <div class="month-header">${monthName}</div>
    <div class="day-headers">
      <div>Su</div><div>Mo</div><div>Tu</div><div>We</div>
      <div>Th</div><div>Fr</div><div>Sa</div>
    </div>
    <div class="days-grid">
  `;
  
  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    html += '<div class="day-cell empty"></div>';
  }
  
  // Day cells
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const isPast = cellDate < today;
    const isToday = cellDate.getTime() === today.getTime();
    const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
    
    let classes = 'day-cell';
    if (isPast) classes += ' disabled';
    if (isToday) classes += ' today';
    if (isWeekend) classes += ' weekend';
    
    // Check if selected
    if (HeroApp.state.departureDate && cellDate.getTime() === HeroApp.state.departureDate.getTime()) {
      classes += ' selected';
    }
    if (HeroApp.state.returnDate && cellDate.getTime() === HeroApp.state.returnDate.getTime()) {
      classes += ' selected';
    }
    
    // Check if in range
    if (HeroApp.state.departureDate && HeroApp.state.returnDate) {
      if (cellDate > HeroApp.state.departureDate && cellDate < HeroApp.state.returnDate) {
        classes += ' in-range';
      }
    }
    
    html += `
      <div class="${classes}" data-date="${cellDate.toISOString()}">
        <span class="day-number">${day}</span>
      </div>
    `;
  }
  
  html += '</div>';
  return html;
}

function selectDate(cell) {
  if (cell.classList.contains('disabled')) return;
  
  const date = new Date(cell.dataset.date);
  
  if (!HeroApp.state.departureDate || (HeroApp.state.departureDate && HeroApp.state.returnDate)) {
    // First selection or reset
    HeroApp.state.departureDate = date;
    HeroApp.state.returnDate = null;
  } else if (date > HeroApp.state.departureDate) {
    // Second selection
    HeroApp.state.returnDate = date;
  } else {
    // Date before departure, reset
    HeroApp.state.departureDate = date;
    HeroApp.state.returnDate = null;
  }
  
  renderCalendars();
  updateDateDisplay();
}

function updateDateDisplay() {
  const displayEl = document.querySelector('.date-range-display');
  const datesInput = document.getElementById('dates');
  const applyBtn = document.getElementById('applyDates');
  
  if (HeroApp.state.departureDate && HeroApp.state.returnDate) {
    const depStr = formatDate(HeroApp.state.departureDate);
    const retStr = formatDate(HeroApp.state.returnDate);
    
    if (displayEl) displayEl.textContent = `${depStr} - ${retStr}`;
    if (datesInput) datesInput.value = `${depStr} - ${retStr}`;
    if (applyBtn) applyBtn.removeAttribute('disabled');
  } else if (HeroApp.state.departureDate) {
    const depStr = formatDate(HeroApp.state.departureDate);
    
    if (displayEl) displayEl.textContent = depStr;
    if (datesInput) datesInput.value = depStr;
    if (applyBtn) applyBtn.setAttribute('disabled', '');
  } else {
    if (displayEl) displayEl.textContent = 'Select dates';
    if (datesInput) datesInput.value = '';
    if (applyBtn) applyBtn.setAttribute('disabled', '');
  }
}

function setupDatePickerEvents() {
  const clearBtn = document.getElementById('clearDates');
  const applyBtn = document.getElementById('applyDates');
  const overlay = document.querySelector('.date-picker-overlay');
  
  if (clearBtn) {
    clearBtn.onclick = () => {
      HeroApp.state.departureDate = null;
      HeroApp.state.returnDate = null;
      renderCalendars();
      updateDateDisplay();
    };
  }
  
  if (applyBtn) {
    applyBtn.onclick = () => {
      closeDatePicker();
      validateField(document.getElementById('dates'));
      saveFormState();
      focusNextField(document.getElementById('dates'));
    };
  }
  
  if (overlay) {
    overlay.onclick = closeDatePicker;
  }
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 9: TRAVELERS DROPDOWN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function openTravelersDropdown() {
  const dropdown = document.getElementById('travelersDropdown');
  if (!dropdown) return;
  
  dropdown.removeAttribute('hidden');
  setupTravelersEvents();
}

function closeTravelersDropdown() {
  const dropdown = document.getElementById('travelersDropdown');
  if (dropdown) {
    dropdown.setAttribute('hidden', '');
  }
}

function setupTravelersEvents() {
  const counterBtns = document.querySelectorAll('.counter-btn');
  const classOptions = document.querySelectorAll('.class-option');
  const applyBtn = document.getElementById('applyTravelers');
  
  // Counter buttons
  counterBtns.forEach(btn => {
    btn.onclick = () => {
      const passenger = btn.dataset.passenger;
      const action = btn.dataset.action;
      
      updatePassengerCount(passenger, action);
    };
  });
  
  // Class options
  classOptions.forEach(option => {
    option.onclick = () => {
      classOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
      HeroApp.state.cabinClass = option.dataset.class;
    };
  });
  
  // Apply button
  if (applyBtn) {
    applyBtn.onclick = () => {
      closeTravelersDropdown();
      updateTravelersDisplay();
      validateField(document.getElementById('travelers'));
      saveFormState();
      focusNextField(document.getElementById('travelers'));
    };
  }
  
  // Click outside to close
  document.addEventListener('click', handleClickOutsideTravelers);
}

function handleClickOutsideTravelers(e) {
  const dropdown = document.getElementById('travelersDropdown');
  const travelersInput = document.getElementById('travelers');
  
  if (!dropdown.contains(e.target) && e.target !== travelersInput) {
    closeTravelersDropdown();
    document.removeEventListener('click', handleClickOutsideTravelers);
  }
}

function updatePassengerCount(passenger, action) {
  const currentCount = HeroApp.state[passenger];
  const maxPassengers = 9;
  const totalPassengers = HeroApp.state.adults + HeroApp.state.children + HeroApp.state.infants;
  
  if (action === 'plus') {
    if (totalPassengers >= maxPassengers) {
      showToast('Maximum 9 passengers allowed', 'error');
      return;
    }
    
    if (passenger === 'infants' && HeroApp.state.infants >= HeroApp.state.adults) {
      showToast('Number of infants cannot exceed adults', 'error');
      return;
    }
    
    HeroApp.state[passenger]++;
  } else if (action === 'minus') {
    if (passenger === 'adults' && currentCount <= 1) {
      showToast('At least one adult required', 'error');
      return;
    }
    
    if (currentCount > 0) {
      HeroApp.state[passenger]--;
    }
  }
  
  // Update display
  document.getElementById(`${passenger}Count`).textContent = HeroApp.state[passenger];
  updateCounterButtonStates();
}

function updateCounterButtonStates() {
  const totalPassengers = HeroApp.state.adults + HeroApp.state.children + HeroApp.state.infants;
  
  // Disable plus buttons if max reached
  if (totalPassengers >= 9) {
    document.querySelectorAll('.plus-btn').forEach(btn => {
      btn.setAttribute('disabled', '');
    });
  } else {
    document.querySelectorAll('.plus-btn').forEach(btn => {
      btn.removeAttribute('disabled');
    });
  }
  
  // Adults minus button
  const adultsMinusBtn = document.querySelector('[data-passenger="adults"][data-action="minus"]');
  if (HeroApp.state.adults <= 1) {
    adultsMinusBtn?.setAttribute('disabled', '');
  } else {
    adultsMinusBtn?.removeAttribute('disabled');
  }
  
  // Children minus button
  const childrenMinusBtn = document.querySelector('[data-passenger="children"][data-action="minus"]');
  if (HeroApp.state.children <= 0) {
    childrenMinusBtn?.setAttribute('disabled', '');
  } else {
    childrenMinusBtn?.removeAttribute('disabled');
  }
  
  // Infants minus button
  const infantsMinusBtn = document.querySelector('[data-passenger="infants"][data-action="minus"]');
  if (HeroApp.state.infants <= 0) {
    infantsMinusBtn?.setAttribute('disabled', '');
  } else {
    infantsMinusBtn?.removeAttribute('disabled');
  }
  
  // Infants plus button
  const infantsPlusBtn = document.querySelector('[data-passenger="infants"][data-action="plus"]');
  if (HeroApp.state.infants >= HeroApp.state.adults) {
    infantsPlusBtn?.setAttribute('disabled', '');
  } else {
    infantsPlusBtn?.removeAttribute('disabled');
  }
}

function updateTravelersDisplay() {
  const input = document.getElementById('travelers');
  if (!input) return;
  
  const total = HeroApp.state.adults + HeroApp.state.children + HeroApp.state.infants;
  const classLabel = HeroApp.state.cabinClass.split('-').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ');
  
  let text = '';
  if (total === 1) {
    text = '1 Traveler';
  } else {
    text = `${total} Travelers`;
  }
  
  text += `, ${classLabel}`;
  input.value = text;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 10: SWAP BUTTON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeSwapButton() {
  const swapBtn = document.getElementById('swapButton');
  if (!swapBtn) return;
  
  swapBtn.addEventListener('click', () => {
    const fromInput = document.getElementById('from');
    const toInput = document.getElementById('to');
    
    // Add swapping animation
    swapBtn.classList.add('swapping');
    
    // Swap values with fade effect
    const fromValue = fromInput.value;
    const toValue = toInput.value;
    
    fromInput.style.opacity = '0';
    toInput.style.opacity = '0';
    
    setTimeout(() => {
      fromInput.value = toValue;
      toInput.value = fromValue;
      
      // Swap state
      const tempFrom = HeroApp.state.from;
      HeroApp.state.from = HeroApp.state.to;
      HeroApp.state.to = tempFrom;
      
      fromInput.style.opacity = '1';
      toInput.style.opacity = '1';
      
      swapBtn.classList.remove('swapping');
      
      saveFormState();
    }, 300);
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 11: QUICK FILTERS & POPULAR ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeQuickFilters() {
  const directCheckbox = document.getElementById('directFlights');
  const nearbyCheckbox = document.getElementById('nearbyAirports');
  const flexibleCheckbox = document.getElementById('flexibleDates');
  
  [directCheckbox, nearbyCheckbox, flexibleCheckbox].forEach(checkbox => {
    if (checkbox) {
      checkbox.addEventListener('change', (e) => {
        HeroApp.state[e.target.id] = e.target.checked;
        saveFormState();
      });
    }
  });
}

function initializePopularRoutes() {
  const routePills = document.querySelectorAll('.route-pill');
  
  routePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const from = pill.dataset.from;
      const to = pill.dataset.to;
      const fromCode = pill.dataset.fromCode;
      const toCode = pill.dataset.toCode;
      
      // Fill form
      document.getElementById('from').value = `${from} (${fromCode})`;
      document.getElementById('to').value = `${to} (${toCode})`;
      
      HeroApp.state.from = fromCode;
      HeroApp.state.to = toCode;
      
      // Mark as valid
      document.querySelector('[data-field="from"]').classList.add('valid');
      document.querySelector('[data-field="to"]').classList.add('valid');
      
      // Animate pill
      pill.style.transform = 'scale(1.1)';
      setTimeout(() => {
        pill.style.transform = '';
      }, 200);
      
      // Show success briefly
      showToast(`Route selected: ${from} → ${to}`, 'success');
      
      // Focus dates
      setTimeout(() => {
        document.getElementById('dates').focus();
      }, 500);
      
      saveFormState();
    });
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 12: SCROLL INDICATOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  if (!indicator) return;
  
  indicator.addEventListener('click', () => {
    const nextSection = document.querySelector('.hero-section').nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  
  // Hide on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      indicator.style.opacity = '0';
      indicator.style.pointerEvents = 'none';
    } else {
      indicator.style.opacity = '1';
      indicator.style.pointerEvents = 'auto';
    }
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 13: FORM VALIDATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeFormValidation() {
  const form = document.getElementById('flightSearchForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (errors.length > 0) {
      showErrorSummary(errors);
      // Focus first error
      const firstError = errors[0];
      const field = document.getElementById(firstError.field);
      if (field) {
        field.focus();
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      hideErrorSummary();
      submitForm();
    }
  });
}

function validateForm() {
  const errors = [];
  
  // Validate FROM
  if (!HeroApp.state.from) {
    errors.push({
      field: 'from',
      message: 'Please select a departure city'
    });
  }
  
  // Validate TO
  if (!HeroApp.state.to) {
    errors.push({
      field: 'to',
      message: 'Please select a destination city'
    });
  }
  
  // Check if FROM and TO are same
  if (HeroApp.state.from && HeroApp.state.to && HeroApp.state.from === HeroApp.state.to) {
    errors.push({
      field: 'to',
      message: 'Destination must be different from departure'
    });
  }
  
  // Validate DATES
  if (!HeroApp.state.departureDate) {
    errors.push({
      field: 'dates',
      message: 'Please select travel dates'
    });
  }
  
  if (HeroApp.state.tripType === 'roundtrip' && !HeroApp.state.returnDate) {
    errors.push({
      field: 'dates',
      message: 'Please select return date for round trip'
    });
  }
  
  // Mark fields with errors
  ['from', 'to', 'dates'].forEach(fieldId => {
    const field = document.getElementById(fieldId);
    const wrapper = field?.closest('.input-wrapper');
    const container = field?.closest('.input-container');
    const errorMsg = wrapper?.querySelector('.error-message');
    
    const fieldError = errors.find(e => e.field === fieldId);
    
    if (fieldError) {
      wrapper?.classList.add('has-error');
      container?.classList.add('error');
      if (errorMsg) errorMsg.textContent = fieldError.message;
    } else {
      wrapper?.classList.remove('has-error');
      container?.classList.remove('error');
    }
  });
  
  return errors;
}

function validateField(field) {
  const wrapper = field.closest('.input-wrapper');
  const container = field.closest('.input-container');
  const errorMsg = wrapper?.querySelector('.error-message');
  
  let isValid = true;
  let message = '';
  
  if (field.id === 'from') {
    isValid = HeroApp.state.from !== '';
    message = 'Please select a departure city';
  } else if (field.id === 'to') {
    isValid = HeroApp.state.to !== '';
    message = 'Please select a destination city';
    
    if (isValid && HeroApp.state.from === HeroApp.state.to) {
      isValid = false;
      message = 'Destination must be different from departure';
    }
  } else if (field.id === 'dates') {
    isValid = HeroApp.state.departureDate !== null;
    message = 'Please select travel dates';
  }
  
  if (isValid) {
    wrapper?.classList.remove('has-error');
    container?.classList.remove('error');
    container?.classList.add('valid');
  } else {
    wrapper?.classList.add('has-error');
    container?.classList.add('error');
    container?.classList.remove('valid');
    if (errorMsg) errorMsg.textContent = message;
  }
  
  return isValid;
}

function showErrorSummary(errors) {
  const summary = document.getElementById('errorSummary');
  const list = document.getElementById('errorSummaryList');
  
  if (!summary || !list) return;
  
  list.innerHTML = errors.map(error => 
    `<li data-field="${error.field}">${error.message}</li>`
  ).join('');
  
  summary.removeAttribute('hidden');
  
  // Add click handlers
  list.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      const field = document.getElementById(item.dataset.field);
      if (field) {
        field.focus();
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
  
  // Close button
  const closeBtn = summary.querySelector('.error-summary-close');
  if (closeBtn) {
    closeBtn.onclick = hideErrorSummary;
  }
}

function hideErrorSummary() {
  const summary = document.getElementById('errorSummary');
  if (summary) {
    summary.setAttribute('hidden', '');
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 14: FORM SUBMISSION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function submitForm() {
  const searchBtn = document.getElementById('searchButton');
  const searchIcon = searchBtn.querySelector('.search-icon');
  const searchText = searchBtn.querySelector('.search-text');
  
  // Loading state
  searchBtn.classList.add('loading');
  searchBtn.setAttribute('disabled', '');
  searchText.textContent = 'Searching...';
  
  // Simulate search (2 seconds)
  setTimeout(() => {
    // Success state
    searchBtn.classList.remove('loading');
    searchBtn.classList.add('success');
    searchText.textContent = 'Found 247 flights!';
    
    // Save to recent searches
    saveRecentSearch();
    
    // Navigate after brief success display
    setTimeout(() => {
      navigateToResults();
    }, 1000);
  }, 2000);
}

function navigateToResults() {
  // Build query string
  const params = new URLSearchParams({
    from: HeroApp.state.from,
    to: HeroApp.state.to,
    departure: HeroApp.state.departureDate?.toISOString().split('T')[0] || '',
    return: HeroApp.state.returnDate?.toISOString().split('T')[0] || '',
    adults: HeroApp.state.adults,
    children: HeroApp.state.children,
    infants: HeroApp.state.infants,
    class: HeroApp.state.cabinClass,
    tripType: HeroApp.state.tripType,
    direct: HeroApp.state.directFlights,
    nearby: HeroApp.state.nearbyAirports,
    flexible: HeroApp.state.flexibleDates
  });
  
  window.location.href = `results.html?${params.toString()}`;
}

function saveRecentSearch() {
  const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  
  // Add current FROM/TO codes
  if (HeroApp.state.from && !recent.includes(HeroApp.state.from)) {
    recent.unshift(HeroApp.state.from);
  }
  if (HeroApp.state.to && !recent.includes(HeroApp.state.to)) {
    recent.unshift(HeroApp.state.to);
  }
  
  // Keep only last 5
  localStorage.setItem('recentSearches', JSON.stringify(recent.slice(0, 5)));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 15: STATE PERSISTENCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function saveFormState() {
  const state = {
    ...HeroApp.state,
    departureDate: HeroApp.state.departureDate?.toISOString(),
    returnDate: HeroApp.state.returnDate?.toISOString()
  };
  
  sessionStorage.setItem('heroFormState', JSON.stringify(state));
}

function restoreFormState() {
  const saved = sessionStorage.getItem('heroFormState');
  
  if (!saved) return;
  
  try {
    const state = JSON.parse(saved);
    
    // Restore state
    Object.assign(HeroApp.state, state);
    
    // Convert date strings back to Date objects
    if (state.departureDate) {
      HeroApp.state.departureDate = new Date(state.departureDate);
    }
    if (state.returnDate) {
      HeroApp.state.returnDate = new Date(state.returnDate);
    }
    
    // Restore UI
    if (state.from) {
      const airport = HeroApp.airports.find(a => a.code === state.from);
      if (airport) {
        document.getElementById('from').value = `${airport.city} (${airport.code})`;
        document.querySelector('[data-field="from"]').classList.add('valid');
      }
    }
    
    if (state.to) {
      const airport = HeroApp.airports.find(a => a.code === state.to);
      if (airport) {
        document.getElementById('to').value = `${airport.city} (${airport.code})`;
        document.querySelector('[data-field="to"]').classList.add('valid');
      }
    }
    
    updateDateDisplay();
    updateTravelersDisplay();
    
    // Restore trip type
    document.querySelectorAll('.trip-tab').forEach(tab => {
      if (tab.dataset.trip === state.tripType) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Restore checkboxes
    if (state.directFlights) document.getElementById('directFlights').checked = true;
    if (state.nearbyAirports) document.getElementById('nearbyAirports').checked = true;
    if (state.flexibleDates) document.getElementById('flexibleDates').checked = true;
    
    showToast('Your previous search has been restored', 'info');
  } catch (error) {
    console.error('Error restoring form state:', error);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 16: UTILITY FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

function focusNextField(currentField) {
  const fields = ['from', 'to', 'dates', 'travelers'];
  const currentIndex = fields.indexOf(currentField.id);
  
  if (currentIndex < fields.length - 1) {
    const nextField = document.getElementById(fields[currentIndex + 1]);
    if (nextField) {
      setTimeout(() => nextField.focus(), 300);
    }
  }
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toastNotification');
  const toastIcon = toast?.querySelector('.toast-icon');
  const toastMessage = toast?.querySelector('.toast-message');
  
  if (!toast || !toastMessage) return;
  
  toastMessage.textContent = message;
  
  // Set icon based on type
  if (toastIcon && typeof lucide !== 'undefined') {
    if (type === 'success') {
      toastIcon.setAttribute('data-lucide', 'check-circle');
      toast.style.background = 'rgba(42, 125, 74, 0.95)';
    } else if (type === 'error') {
      toastIcon.setAttribute('data-lucide', 'x-circle');
      toast.style.background = 'rgba(217, 48, 37, 0.95)';
    } else {
      toastIcon.setAttribute('data-lucide', 'info');
      toast.style.background = 'rgba(29, 94, 51, 0.95)';
    }
    lucide.createIcons();
  }
  
  toast.removeAttribute('hidden');
  toast.style.animation = 'slideInRight 0.4s ease-out';
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.4s ease-in';
    setTimeout(() => {
      toast.setAttribute('hidden', '');
    }, 400);
  }, 3000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 17: KEYBOARD SHORTCUTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('keydown', (e) => {
  // "/" key: Focus search form
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    document.getElementById('from').focus();
  }
  
  // Escape: Close all dropdowns/modals
  if (e.key === 'Escape') {
    hideAutocomplete();
    closeDatePicker();
    closeTravelersDropdown();
    hideErrorSummary();
  }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SECTION 18: AUTO-LOCATION DETECTION (OPTIONAL)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function detectUserLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // In production, use lat/lng to find nearest airport via API
        console.log('User location:', position.coords);
        
        // For demo, default to New Delhi
        const fromInput = document.getElementById('from');
        if (fromInput && !fromInput.value) {
          fromInput.value = 'New Delhi (DEL)';
          HeroApp.state.from = 'DEL';
          document.querySelector('[data-field="from"]').classList.add('valid');
        }
      },
      (error) => {
        console.log('Geolocation error:', error);
      }
    );
  }
}

// Auto-detect location after page load
setTimeout(detectUserLocation, 1000);

console.log('✈️ Destinova Hero Section - Redesigned & Loaded Successfully!');
