/**
 * Enhanced Hero Section - JavaScript
 * Handles parallax effects, animations, autocomplete, counters, and interactions
 */

// ===============================================
// Parallax Effect for Floating Icons
// ===============================================
function initParallax() {
    const hero = document.querySelector('.enhanced-hero-section');
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    if (!hero) return;
    
    let ticking = false;
    
    function updateParallax(scrollY) {
        const heroRect = hero.getBoundingClientRect();
        
        // Only apply parallax when hero is visible
        if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
            floatingIcons.forEach((icon, index) => {
                // Different parallax speeds for each icon
                const speed = 0.3 + (index * 0.1);
                const yOffset = scrollY * speed;
                icon.style.transform = `translateY(${yOffset}px)`;
            });
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(() => updateParallax(scrollY));
            ticking = true;
        }
    });
}

// ===============================================
// Destination Autocomplete
// ===============================================
function initAutocomplete() {
    const input = document.getElementById('destination-input');
    const list = document.getElementById('autocomplete-list');
    
    if (!input || !list) return;
    
    const destinations = [
        'Bali, Indonesia',
        'Dubai, UAE',
        'Maldives',
        'Paris, France',
        'Tokyo, Japan',
        'Rome, Italy',
        'New York, USA',
        'London, UK',
        'Barcelona, Spain',
        'Singapore',
        'Bangkok, Thailand',
        'Istanbul, Turkey'
    ];
    
    let selectedIndex = -1;
    let debounceTimer;
    
    function showSuggestions(value) {
        if (!value) {
            list.classList.remove('active');
            return;
        }
        
        const filtered = destinations.filter(dest => 
            dest.toLowerCase().includes(value.toLowerCase())
        );
        
        if (filtered.length === 0) {
            list.classList.remove('active');
            return;
        }
        
        list.innerHTML = filtered.map((dest, index) => 
            `<div class="autocomplete-item" data-index="${index}">${dest}</div>`
        ).join('');
        
        list.classList.add('active');
        selectedIndex = -1;
        
        // Add click handlers
        document.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                input.value = item.textContent;
                list.classList.remove('active');
            });
        });
    }
    
    // Debounced input handler
    input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            showSuggestions(e.target.value);
        }, 300);
    });
    
    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
        const items = list.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && items[selectedIndex]) {
                input.value = items[selectedIndex].textContent;
                list.classList.remove('active');
            }
        } else if (e.key === 'Escape') {
            list.classList.remove('active');
        }
    });
    
    function updateSelection(items) {
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !list.contains(e.target)) {
            list.classList.remove('active');
        }
    });
}

// ===============================================
// Animated Counter for Trust Statistics
// ===============================================
function animateCounter(element, target, duration = 2000, decimals = 0) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.dataset.suffix || '';
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = formatNumber(target, decimals) + suffix;
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(start, decimals) + suffix;
        }
    }, 16);
}

function formatNumber(num, decimals) {
    if (decimals > 0) {
        return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString();
}

// ===============================================
// Scroll-Triggered Animations
// ===============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation delay
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, index * 100);
                
                // Animate counters for trust stats
                if (entry.target.classList.contains('trust-stat-item')) {
                    const numberElement = entry.target.querySelector('.trust-stat-number');
                    const target = parseInt(numberElement.dataset.counter);
                    const decimals = parseInt(numberElement.dataset.decimal) || 0;
                    animateCounter(numberElement, target, 2000, decimals);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe trust stats
    document.querySelectorAll('.trust-stat-item').forEach(item => {
        observer.observe(item);
    });
    
    // Observe recommendation cards
    document.querySelectorAll('.recommendation-card').forEach(card => {
        observer.observe(card);
    });
}

// ===============================================
// Live Booking Counter
// ===============================================
function updateLiveBooking() {
    const counter = document.querySelector('.booking-counter-text');
    if (!counter) return;
    
    // Random number between 2800-3000
    const randomCount = Math.floor(Math.random() * 200) + 2800;
    counter.textContent = `${randomCount.toLocaleString()} travelers booked today`;
}

// Update every 5 seconds
setInterval(updateLiveBooking, 5000);

// ===============================================
// Trending Pills Navigation
// ===============================================
function initTrendingPills() {
    const pills = document.querySelectorAll('.trending-pill');
    
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const destination = pill.textContent;
            const destinationInput = document.getElementById('destination-input');
            if (destinationInput) {
                destinationInput.value = destination;
                destinationInput.focus();
                
                // Add pulse animation
                pill.style.animation = 'none';
                setTimeout(() => {
                    pill.style.animation = '';
                }, 10);
            }
        });
    });
}

// ===============================================
// Filter Pills for Recommendations
// ===============================================
function initFilterPills() {
    const pills = document.querySelectorAll('.filter-pill');
    const cards = document.querySelectorAll('.recommendation-card');
    
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active from all pills
            pills.forEach(p => p.classList.remove('active'));
            
            // Add active to clicked pill
            pill.classList.add('active');
            
            // Filter cards (this would be connected to actual data filtering)
            const filter = pill.dataset.filter;
            
            // For now, just add animation effect
            cards.forEach((card, index) => {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = '';
                    setTimeout(() => {
                        card.classList.add('animated');
                    }, index * 100);
                }, 10);
            });
        });
    });
}

// ===============================================
// Save/Heart Icon Toggle
// ===============================================
function initSaveIcons() {
    const saveIcons = document.querySelectorAll('.save-icon');
    
    saveIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            icon.classList.toggle('saved');
            
            // Animation effect
            icon.style.transform = 'scale(1.5)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 200);
            
            // Save to localStorage (optional)
            const cardId = icon.closest('.recommendation-card').dataset.id;
            toggleSaved(cardId);
        });
    });
}

function toggleSaved(id) {
    let saved = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
    
    if (saved.includes(id)) {
        saved = saved.filter(s => s !== id);
    } else {
        saved.push(id);
    }
    
    localStorage.setItem('savedDestinations', JSON.stringify(saved));
}

// ===============================================
// Search Form Handler
// ===============================================
function initSearchForm() {
    const form = document.getElementById('enhanced-search-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const destination = formData.get('destination');
        const checkin = formData.get('checkin');
        const checkout = formData.get('checkout');
        const guests = formData.get('guests');
        
        // Validate
        if (!destination || !checkin || !checkout || !guests) {
            alert('Please fill in all fields');
            return;
        }
        
        if (new Date(checkout) <= new Date(checkin)) {
            alert('Check-out date must be after check-in date');
            return;
        }
        
        // Store search data
        const searchData = {
            destination,
            checkin,
            checkout,
            guests,
            timestamp: Date.now()
        };
        
        localStorage.setItem('lastSearch', JSON.stringify(searchData));
        
        // Redirect to results page
        window.location.href = 'results.html?' + new URLSearchParams(searchData);
    });
}

// ===============================================
// Date Input Restrictions
// ===============================================
function initDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('checkin-date');
    const checkoutInput = document.getElementById('checkout-date');
    
    if (checkinInput) {
        checkinInput.setAttribute('min', today);
        
        checkinInput.addEventListener('change', () => {
            const selectedDate = checkinInput.value;
            if (checkoutInput) {
                checkoutInput.setAttribute('min', selectedDate);
                
                // Clear checkout if it's before checkin
                if (checkoutInput.value && checkoutInput.value <= selectedDate) {
                    checkoutInput.value = '';
                }
            }
        });
    }
}

// ===============================================
// Live Ticker Animation
// ===============================================
function initLiveTicker() {
    const ticker = document.querySelector('.live-ticker');
    if (!ticker) return;
    
    // Clone ticker items for seamless loop
    const tickerContent = ticker.innerHTML;
    ticker.innerHTML = tickerContent + tickerContent;
}

// ===============================================
// Mobile Responsive Adjustments
// ===============================================
function handleResponsive() {
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Disable parallax on mobile for performance
        window.removeEventListener('scroll', initParallax);
    }
}

window.addEventListener('resize', handleResponsive);

// ===============================================
// Initialize All Features
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Enhanced Hero Section Initialized');
    
    // Initialize all features
    initParallax();
    initAutocomplete();
    initScrollAnimations();
    initTrendingPills();
    initFilterPills();
    initSaveIcons();
    initSearchForm();
    initDateInputs();
    initLiveTicker();
    handleResponsive();
    
    // Initial update
    updateLiveBooking();
});

// ===============================================
// Accessibility: Focus Management
// ===============================================
document.addEventListener('keydown', (e) => {
    // Skip to main content with keyboard
    if (e.key === 'Tab' && e.shiftKey === false && e.target === document.body) {
        const firstFocusable = document.querySelector('.enhanced-search-container input');
        if (firstFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
});

// ===============================================
// Performance: Lazy Load Images
// ===============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
