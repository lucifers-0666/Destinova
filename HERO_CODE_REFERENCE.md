# 🔧 Flight Booking Hero - Code Reference

## Quick Code Snippets for Common Tasks

---

## 🎨 Styling Customization

### Change Primary Color
```css
/* Find and replace in index.css */
#2563eb  →  Your new primary color
#1d4ed8  →  Your new hover color
```

### Adjust Widget Size
```css
.flight-search-widget {
  max-width: 1200px;  /* Change this value */
  padding: 40px;       /* Adjust padding */
}
```

### Modify Background Image
```html
<!-- In index.html -->
<div class="hero-bg-image" style="background-image: url('YOUR_IMAGE_URL');"></div>
```

---

## 🔌 Integration Examples

### Connect to Real Date Picker (Flatpickr)
```html
<!-- Add to head -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
```

```javascript
// Replace date input initialization in index.js
flatpickr("#departDate", {
  minDate: "today",
  dateFormat: "M d, Y",
  onChange: function(selectedDates, dateStr, instance) {
    const dayName = selectedDates[0].toLocaleDateString('en-US', { weekday: 'short' });
    document.getElementById('departDay').textContent = dayName;
  }
});

flatpickr("#returnDate", {
  minDate: "today",
  dateFormat: "M d, Y",
  onChange: function(selectedDates, dateStr, instance) {
    const dayName = selectedDates[0].toLocaleDateString('en-US', { weekday: 'short' });
    document.getElementById('returnDay').textContent = dayName;
  }
});
```

### Connect to Airport API (Example: Amadeus)
```javascript
async function fetchAirports(query) {
  const response = await fetch(`https://api.amadeus.com/v1/reference-data/locations?keyword=${query}&subType=AIRPORT`, {
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
    }
  });
  
  const data = await response.json();
  return data.data.map(airport => ({
    city: airport.address.cityName,
    code: airport.iataCode,
    name: airport.name
  }));
}

// Update autocomplete to use real data
fromLocationInput.addEventListener('input', async function() {
  const query = this.value;
  if (query.length < 2) return;
  
  const airports = await fetchAirports(query);
  
  // Clear existing items
  fromDropdown.innerHTML = '';
  
  // Add new items
  airports.forEach(airport => {
    const item = document.createElement('div');
    item.className = 'autocomplete-item';
    item.innerHTML = `
      <span class="city-name">${airport.city} - ${airport.name}</span>
      <span class="city-code">${airport.code}</span>
    `;
    item.addEventListener('click', () => {
      fromLocationInput.value = `${airport.city} (${airport.code})`;
      fromDropdown.classList.remove('active');
    });
    fromDropdown.appendChild(item);
  });
  
  fromDropdown.classList.add('active');
});
```

### Add Form Validation (Yup)
```javascript
import * as yup from 'yup';

const searchSchema = yup.object().shape({
  from: yup.string().required('Departure location is required'),
  to: yup.string().required('Destination is required'),
  departDate: yup.date().required('Departure date is required').min(new Date(), 'Date must be in the future'),
  returnDate: yup.date().when('tripType', {
    is: 'round-trip',
    then: yup.date().required('Return date is required').min(yup.ref('departDate'), 'Return must be after departure')
  }),
  adults: yup.number().min(1, 'At least 1 adult required').max(9, 'Maximum 9 adults'),
  children: yup.number().min(0).max(9),
  infants: yup.number().min(0).max(4)
});

// Validate on submit
searchForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = {
    from: fromInput.value,
    to: toInput.value,
    departDate: departDate.value,
    returnDate: returnDate.value,
    tripType: document.querySelector('.tab-btn.active').dataset.tripType,
    adults: adultsCount,
    children: childrenCount,
    infants: infantsCount
  };
  
  try {
    await searchSchema.validate(formData, { abortEarly: false });
    // Proceed with search
    submitSearch(formData);
  } catch (err) {
    // Show validation errors
    err.inner.forEach(error => {
      showError(error.path, error.message);
    });
  }
});
```

### Add Google Analytics Tracking
```javascript
// Track search widget interactions
tabBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    gtag('event', 'tab_change', {
      'event_category': 'search_widget',
      'event_label': this.dataset.tripType
    });
  });
});

// Track destination quick-select
destinationPills.forEach(pill => {
  pill.addEventListener('click', function() {
    gtag('event', 'quick_select_destination', {
      'event_category': 'search_widget',
      'event_label': this.dataset.destination
    });
  });
});

// Track search submission
searchForm.addEventListener('submit', function() {
  gtag('event', 'search_flights', {
    'event_category': 'conversion',
    'event_label': `${fromInput.value} to ${toInput.value}`,
    'value': adultsCount + childrenCount + infantsCount
  });
});
```

---

## 🎭 Custom Animations

### Add Entrance Animation to Search Widget
```css
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flight-search-widget {
  animation: slideUpFade 0.8s ease-out 0.6s both;
}
```

### Add Ripple Effect to Search Button
```css
.search-flights-btn {
  position: relative;
  overflow: hidden;
}

.search-flights-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.search-flights-btn:active::after {
  width: 300px;
  height: 300px;
}
```

### Add Floating Animation to Trust Badges
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.trust-item {
  animation: float 3s ease-in-out infinite;
}

.trust-item:nth-child(2) {
  animation-delay: 0.5s;
}

.trust-item:nth-child(3) {
  animation-delay: 1s;
}

.trust-item:nth-child(4) {
  animation-delay: 1.5s;
}
```

---

## 📱 Mobile Optimizations

### Prevent Zoom on Input Focus (iOS)
```css
@media (max-width: 768px) {
  .search-input {
    font-size: 16px !important; /* iOS won't zoom if 16px+ */
  }
}
```

### Add Touch Gestures (Swipe to Navigate)
```javascript
let touchStartX = 0;
let touchEndX = 0;

const searchWidget = document.querySelector('.flight-search-widget');

searchWidget.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

searchWidget.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swiped left - next tab
      const activeTab = document.querySelector('.tab-btn.active');
      const nextTab = activeTab.nextElementSibling;
      if (nextTab) nextTab.click();
    } else {
      // Swiped right - previous tab
      const activeTab = document.querySelector('.tab-btn.active');
      const prevTab = activeTab.previousElementSibling;
      if (prevTab) prevTab.click();
    }
  }
}
```

### Add Haptic Feedback (iOS/Android)
```javascript
function vibrate(pattern = 10) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

// Use on button clicks
searchBtn.addEventListener('click', function() {
  vibrate(10);
});

// Use on counter increment
counterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    vibrate([10, 5, 10]);
  });
});
```

---

## 🔍 Search Enhancement Features

### Add Recent Searches
```javascript
function saveSearch(searchData) {
  const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  searches.unshift({
    ...searchData,
    timestamp: Date.now()
  });
  // Keep only last 5 searches
  localStorage.setItem('recentSearches', JSON.stringify(searches.slice(0, 5)));
}

function showRecentSearches() {
  const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
  
  if (searches.length === 0) return;
  
  const recentContainer = document.createElement('div');
  recentContainer.className = 'recent-searches';
  recentContainer.innerHTML = `
    <h4>Recent Searches</h4>
    ${searches.map(search => `
      <div class="recent-search-item" data-search='${JSON.stringify(search)}'>
        <div class="route">${search.from} → ${search.to}</div>
        <div class="date">${search.departDate}</div>
      </div>
    `).join('')}
  `;
  
  // Insert above search form
  searchWidget.insertBefore(recentContainer, searchForm);
  
  // Click to load search
  document.querySelectorAll('.recent-search-item').forEach(item => {
    item.addEventListener('click', function() {
      const search = JSON.parse(this.dataset.search);
      loadSearch(search);
    });
  });
}
```

### Add Price Alert Signup
```html
<!-- Add to HTML after trust indicators -->
<div class="price-alert-banner">
  <div class="alert-icon">🔔</div>
  <div class="alert-content">
    <strong>Want the best deal?</strong>
    <p>Get price alerts when fares drop</p>
  </div>
  <button class="alert-cta-btn">Set Alert</button>
</div>
```

```css
.price-alert-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  margin: 20px auto;
  max-width: 600px;
}

.alert-icon {
  font-size: 32px;
}

.alert-content strong {
  display: block;
  font-size: 16px;
  color: #78350f;
  margin-bottom: 4px;
}

.alert-content p {
  font-size: 14px;
  color: #92400e;
  margin: 0;
}

.alert-cta-btn {
  padding: 10px 20px;
  background: #78350f;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
```

### Add Flight Preferences
```javascript
// Store user preferences
const preferences = {
  defaultClass: 'economy',
  preferredAirlines: [],
  maxStops: 2,
  mealPreference: 'vegetarian',
  seatPreference: 'window'
};

function loadUserPreferences() {
  const saved = localStorage.getItem('flightPreferences');
  if (saved) {
    Object.assign(preferences, JSON.parse(saved));
    applyPreferences();
  }
}

function applyPreferences() {
  // Auto-select preferred class
  const classBtn = document.querySelector(`[data-class="${preferences.defaultClass}"]`);
  if (classBtn) classBtn.click();
  
  // Pre-fill direct flights if preferred
  if (preferences.maxStops === 0) {
    document.getElementById('directFlights').checked = true;
  }
}

// Save on changes
classBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    preferences.defaultClass = this.dataset.class;
    localStorage.setItem('flightPreferences', JSON.stringify(preferences));
  });
});
```

---

## 🎨 Theme Customization

### Dark Mode Support
```css
/* Add to index.css */
@media (prefers-color-scheme: dark) {
  .flight-search-widget {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .search-input {
    background: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }
  
  .search-input:focus {
    border-color: #3b82f6;
  }
  
  .tab-btn {
    color: #9ca3af;
  }
  
  .tab-btn:hover {
    background: #374151;
  }
  
  .autocomplete-dropdown,
  .travelers-dropdown,
  .advanced-options {
    background: #374151;
    border: 1px solid #4b5563;
  }
  
  .autocomplete-item:hover {
    background: #4b5563;
  }
}
```

### Custom Color Theme
```css
:root {
  /* Override default colors */
  --primary-color: #8b5cf6;      /* Purple */
  --primary-hover: #7c3aed;
  --primary-light: #ede9fe;
  
  /* Apply to elements */
}

.tab-btn.active {
  background: var(--primary-color);
}

.search-flights-btn {
  background: var(--primary-color);
}

.search-flights-btn:hover {
  background: var(--primary-hover);
}

.destination-pill {
  background: var(--primary-light);
  color: var(--primary-hover);
}
```

---

## 🚀 Performance Optimizations

### Lazy Load Background Image
```javascript
const heroImage = document.querySelector('.hero-bg-image');
const imageUrl = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2400';

// Load high-res image after page load
window.addEventListener('load', function() {
  const img = new Image();
  img.src = imageUrl;
  img.onload = function() {
    heroImage.style.backgroundImage = `url('${imageUrl}')`;
  };
});
```

### Debounce Autocomplete Searches
```javascript
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

// Use with autocomplete
const debouncedSearch = debounce(async function(query) {
  const airports = await fetchAirports(query);
  updateAutocompleteResults(airports);
}, 300);

fromLocationInput.addEventListener('input', function() {
  debouncedSearch(this.value);
});
```

### Optimize Parallax with requestAnimationFrame
```javascript
let ticking = false;

function updateParallax() {
  const scrolled = window.pageYOffset;
  const parallaxSpeed = 0.5;
  heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
  ticking = false;
}

window.addEventListener('scroll', function() {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
});
```

---

## 🔒 Security Best Practices

### Sanitize User Input
```javascript
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Use before displaying user input
fromInput.addEventListener('blur', function() {
  this.value = sanitizeInput(this.value);
});
```

### CSRF Protection
```javascript
// Add CSRF token to form
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

searchForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  formData.append('_csrf', csrfToken);
  
  const response = await fetch('/api/search-flights', {
    method: 'POST',
    body: formData,
    headers: {
      'X-CSRF-Token': csrfToken
    }
  });
  
  // Handle response
});
```

---

## 📊 A/B Testing Setup

### Test Different Headlines
```javascript
const headlines = [
  "Explore the World, Your Way",
  "Find Your Perfect Flight Today",
  "Book Flights to 500+ Destinations",
  "Your Journey Starts Here"
];

const variant = Math.floor(Math.random() * headlines.length);
const headlineEl = document.querySelector('.hero-main-headline');
headlineEl.textContent = headlines[variant];

// Track which variant
gtag('event', 'headline_variant', {
  'variant': variant,
  'text': headlines[variant]
});
```

### Test Button Colors
```css
/* Variant A: Blue (control) */
.search-flights-btn.variant-a {
  background: #2563eb;
}

/* Variant B: Green */
.search-flights-btn.variant-b {
  background: #059669;
}

/* Variant C: Orange */
.search-flights-btn.variant-c {
  background: #ea580c;
}
```

```javascript
const variants = ['variant-a', 'variant-b', 'variant-c'];
const variant = variants[Math.floor(Math.random() * variants.length)];
searchBtn.classList.add(variant);

// Track conversions
searchForm.addEventListener('submit', function() {
  gtag('event', 'conversion', {
    'button_variant': variant
  });
});
```

---

## 🎯 Conversion Rate Optimization

### Add Exit Intent Popup
```javascript
let exitIntentShown = false;

document.addEventListener('mouseout', function(e) {
  if (e.clientY < 0 && !exitIntentShown) {
    showExitIntent();
    exitIntentShown = true;
  }
});

function showExitIntent() {
  // Show special offer modal
  const modal = document.createElement('div');
  modal.className = 'exit-intent-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Wait! Get 10% Off Your First Booking</h2>
      <p>Subscribe to our newsletter for exclusive deals</p>
      <input type="email" placeholder="Enter your email">
      <button class="claim-btn">Claim Offer</button>
    </div>
  `;
  document.body.appendChild(modal);
}
```

### Add Urgency Timer
```html
<div class="urgency-banner">
  <i class="fas fa-clock"></i>
  <span id="urgencyText">Book in the next <strong id="urgencyTimer">15:00</strong> minutes to lock in this price!</span>
</div>
```

```javascript
let timeLeft = 15 * 60; // 15 minutes in seconds

setInterval(function() {
  if (timeLeft <= 0) return;
  
  timeLeft--;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  document.getElementById('urgencyTimer').textContent = 
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}, 1000);
```

---

## 🐛 Debugging Helpers

### Add Console Logging
```javascript
// Enable debug mode
const DEBUG = true;

function log(message, data = null) {
  if (DEBUG) {
    console.log(`[Flight Hero] ${message}`, data || '');
  }
}

// Use throughout code
tab-btn.addEventListener('click', function() {
  log('Tab changed', this.dataset.tripType);
});

searchForm.addEventListener('submit', function() {
  log('Search submitted', {
    from: fromInput.value,
    to: toInput.value
  });
});
```

### Add Error Boundary
```javascript
window.addEventListener('error', function(e) {
  console.error('Hero section error:', e.error);
  
  // Show user-friendly message
  const errorBanner = document.createElement('div');
  errorBanner.className = 'error-banner';
  errorBanner.textContent = 'Something went wrong. Please refresh the page.';
  document.querySelector('.hero-content-wrapper').prepend(errorBanner);
});
```

---

## 📚 Useful Resources

### Recommended Libraries
- **Date Picker:** Flatpickr (https://flatpickr.js.org/)
- **Validation:** Yup (https://github.com/jquense/yup)
- **Animations:** GSAP (https://greensock.com/gsap/)
- **Icons:** Font Awesome 6 (https://fontawesome.com/)
- **Analytics:** Google Analytics 4

### API Resources
- **Flight Search:** Amadeus, Skyscanner, Kiwi
- **Airports:** OpenFlights, Airport API
- **Currency:** Exchange Rates API

---

## ✅ Complete Example: Full Search Submission

```javascript
async function submitFlightSearch(formData) {
  try {
    // Show loading
    searchBtn.classList.add('loading');
    
    // Validate
    await searchSchema.validate(formData);
    
    // Track event
    gtag('event', 'search_flights', {
      'from': formData.from,
      'to': formData.to
    });
    
    // API call
    const response = await fetch('/api/search-flights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save to recent searches
      saveSearch(formData);
      
      // Redirect to results
      window.location.href = `/flights?id=${data.searchId}`;
    } else {
      throw new Error(data.message);
    }
    
  } catch (error) {
    // Hide loading
    searchBtn.classList.remove('loading');
    
    // Show error
    showError('search', error.message);
    
    // Log error
    console.error('Search failed:', error);
    
    // Track error
    gtag('event', 'search_error', {
      'error_message': error.message
    });
  }
}
```

---

**Status:** ✅ Ready for implementation and customization
**Need Help?** Check the main documentation files for detailed explanations
