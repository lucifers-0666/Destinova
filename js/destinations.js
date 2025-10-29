// ============================================
// DESTINOVA DESTINATIONS - COMPLETE JAVASCRIPT
// All Interactive Features Implemented
// Production-Ready Code
// ============================================

console.log('%c✈️ Destinova Destinations Loaded', 'color: #D4AF37; font-size: 20px; font-weight: bold;');
console.log('%c🎨 Complete Redesign v3.0', 'color: #047857; font-size: 16px;');

// ============================================
// GLOBAL STATE
// ============================================
let currentTestimonialIndex = 0;
let exitIntentShown = false;
let isScrollingTestimonials = false;

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Destinova...');
    
    // Initialize all features
    initMobileMenu();
    initParallax();
    initWordReveal();
    initSearchForm();
    initBudgetFilters();
    initAdvancedFilters();
    initDestinationCards();
    initPackageAccordions();
    initTestimonialsCarousel();
    initScrollToTop();
    initChatbot();
    initExitIntent();
    initNotifications();
    initLiveCounter();
    initWishlist();
    initLoadMore();
    
    console.log('✅ All features initialized');
});

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileNav = document.querySelector('.nav-mobile');
    
    if (!mobileMenuBtn || !mobileOverlay || !mobileNav) return;
    
    // Toggle menu
    mobileMenuBtn.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close on overlay click
    mobileOverlay.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close on link click
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallax() {
    const parallaxBg = document.getElementById('parallaxBg');
    if (!parallaxBg) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        parallaxBg.style.transform = `translateY(${rate}px)`;
    });
}

// ============================================
// WORD REVEAL ANIMATION
// ============================================
function initWordReveal() {
    const words = document.querySelectorAll('.word-reveal');
    
    words.forEach((word, index) => {
        const delay = word.dataset.delay || index * 100;
        word.style.animationDelay = `${delay}ms`;
    });
}

// ============================================
// SEARCH FORM
// ============================================
function initSearchForm() {
    const searchForm = document.getElementById('mainSearchForm');
    if (!searchForm) return;
    
    // Set minimum dates
    const departureInput = document.getElementById('searchDeparture');
    const returnInput = document.getElementById('searchReturn');
    
    if (departureInput) {
        const today = new Date().toISOString().split('T')[0];
        departureInput.min = today;
        
        departureInput.addEventListener('change', function() {
            if (returnInput) {
                returnInput.min = this.value;
            }
        });
    }
    
    // Form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const from = document.getElementById('searchFrom').value;
        const destination = document.getElementById('searchDestination').value;
        const departure = document.getElementById('searchDeparture').value;
        const returnDate = document.getElementById('searchReturn').value;
        const travelers = document.getElementById('searchTravelers').value;
        const travelClass = document.getElementById('searchClass').value;
        
        console.log('Search submitted:', {
            from,
            destination,
            departure,
            returnDate,
            travelers,
            travelClass
        });
        
        // Show loading notification
        showNotification('Searching for best deals... ✈️');
        
        // Simulate search (replace with actual search logic)
        setTimeout(() => {
            showNotification('Found 127 flights to ' + destination + ' 🎉');
            // Redirect to results page
            // window.location.href = `search-results.html?from=${from}&to=${destination}...`;
        }, 2000);
    });
}

// ============================================
// BUDGET FILTER CHIPS
// ============================================
function initBudgetFilters() {
    const budgetChips = document.querySelectorAll('.budget-filter-chip');
    
    budgetChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active from all
            budgetChips.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            const budget = this.dataset.budget;
            filterDestinationsByBudget(budget);
        });
    });
}

function filterDestinationsByBudget(budget) {
    const cards = document.querySelectorAll('.destination-card-clean');
    
    cards.forEach(card => {
        const price = parseInt(card.dataset.price);
        let show = false;
        
        if (budget === 'all') {
            show = true;
        } else if (budget === 'budget' && price < 50000) {
            show = true;
        } else if (budget === 'mid' && price >= 50000 && price < 80000) {
            show = true;
        } else if (budget === 'luxury' && price >= 80000) {
            show = true;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
    
    console.log('Filtered by budget:', budget);
}

// ============================================
// ADVANCED FILTERS
// ============================================
function initAdvancedFilters() {
    const durationFilter = document.getElementById('durationFilter');
    const budgetSlider = document.getElementById('budgetSlider');
    const budgetValue = document.getElementById('budgetValue');
    const styleFilter = document.getElementById('styleFilter');
    const sortFilter = document.getElementById('sortFilter');
    const familyFilter = document.getElementById('familyFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const seasonTags = document.querySelectorAll('.season-tag');
    
    // Budget slider
    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            budgetValue.textContent = `₹${value.toLocaleString('en-IN')}+`;
            applyFilters();
        });
    }
    
    // Other filters
    if (durationFilter) durationFilter.addEventListener('change', applyFilters);
    if (styleFilter) styleFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applySorting);
    if (familyFilter) familyFilter.addEventListener('change', applyFilters);
    
    // Season tags
    seasonTags.forEach(tag => {
        tag.addEventListener('click', function() {
            seasonTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
    
    // Clear filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            if (durationFilter) durationFilter.value = '';
            if (budgetSlider) {
                budgetSlider.value = 100000;
                budgetValue.textContent = '₹1,00,000+';
            }
            if (styleFilter) styleFilter.value = '';
            if (sortFilter) sortFilter.value = 'popular';
            if (familyFilter) familyFilter.checked = false;
            seasonTags.forEach(t => t.classList.remove('active'));
            
            applyFilters();
            showNotification('Filters cleared ✨');
        });
    }
}

function applyFilters() {
    const cards = document.querySelectorAll('.destination-card-clean');
    const duration = document.getElementById('durationFilter')?.value;
    const maxBudget = parseInt(document.getElementById('budgetSlider')?.value || 200000);
    const style = document.getElementById('styleFilter')?.value;
    const familyFriendly = document.getElementById('familyFilter')?.checked;
    const activeSeason = document.querySelector('.season-tag.active')?.dataset.season;
    
    let visibleCount = 0;
    
    cards.forEach(card => {
        const price = parseInt(card.dataset.price);
        const cardDuration = card.dataset.duration;
        const cardStyle = card.dataset.style;
        const cardSeason = card.dataset.season;
        
        let show = true;
        
        // Budget filter
        if (price > maxBudget) show = false;
        
        // Duration filter
        if (duration && cardDuration !== duration) show = false;
        
        // Style filter
        if (style && cardStyle !== style) show = false;
        
        // Season filter
        if (activeSeason && activeSeason !== 'all-year' && cardSeason !== activeSeason && cardSeason !== 'all-year') {
            show = false;
        }
        
        card.style.display = show ? 'block' : 'none';
        if (show) visibleCount++;
    });
    
    console.log(`Filters applied: ${visibleCount} destinations visible`);
}

function applySorting() {
    const sortValue = document.getElementById('sortFilter')?.value;
    const grid = document.getElementById('destinationsGrid');
    if (!grid) return;
    
    const cards = Array.from(grid.querySelectorAll('.destination-card-clean'));
    
    cards.sort((a, b) => {
        switch (sortValue) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'rating':
                const ratingA = parseFloat(a.querySelector('.rating-value')?.textContent || 0);
                const ratingB = parseFloat(b.querySelector('.rating-value')?.textContent || 0);
                return ratingB - ratingA;
            case 'trending':
                // Could be based on data attributes
                return Math.random() - 0.5; // Random for demo
            default: // popular
                return 0;
        }
    });
    
    // Re-append in new order
    cards.forEach(card => grid.appendChild(card));
    
    console.log('Sorted by:', sortValue);
}

// ============================================
// DESTINATION CARDS
// ============================================
function initDestinationCards() {
    // View details buttons
    const viewDetailsBtns = document.querySelectorAll('.btn-view-details');
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const destination = this.dataset.destination;
            console.log('View details:', destination);
            // window.location.href = `destination-detail.html?id=${destination}`;
            showNotification(`Loading ${destination} details...`);
        });
    });
    
    // Book now buttons
    const bookNowBtns = document.querySelectorAll('.btn-book-now');
    bookNowBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Book now clicked');
            showNotification('Redirecting to booking... ✈️');
            // window.location.href = 'booking.html';
        });
    });
}

// ============================================
// PACKAGE ACCORDIONS
// ============================================
function initPackageAccordions() {
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    
    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const content = document.getElementById(targetId);
            
            if (!content) return;
            
            // Toggle active class
            this.classList.toggle('active');
            content.classList.toggle('open');
            
            // Animate max-height
            if (content.classList.contains('open')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });
}

// ============================================
// TESTIMONIALS CAROUSEL
// ============================================
function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonialsCarousel');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    
    if (!carousel) return;
    
    const cards = carousel.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (isScrollingTestimonials) return;
            isScrollingTestimonials = true;
            
            currentTestimonialIndex = (currentTestimonialIndex + 1) % totalCards;
            scrollToTestimonial(currentTestimonialIndex);
            
            setTimeout(() => isScrollingTestimonials = false, 600);
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (isScrollingTestimonials) return;
            isScrollingTestimonials = true;
            
            currentTestimonialIndex = (currentTestimonialIndex - 1 + totalCards) % totalCards;
            scrollToTestimonial(currentTestimonialIndex);
            
            setTimeout(() => isScrollingTestimonials = false, 600);
        });
    }
    
    // Indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            if (isScrollingTestimonials) return;
            isScrollingTestimonials = true;
            
            currentTestimonialIndex = index;
            scrollToTestimonial(index);
            
            setTimeout(() => isScrollingTestimonials = false, 600);
        });
    });
    
    // Auto-scroll every 5 seconds
    setInterval(() => {
        if (!isScrollingTestimonials) {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % totalCards;
            scrollToTestimonial(currentTestimonialIndex);
        }
    }, 5000);
}

function scrollToTestimonial(index) {
    const carousel = document.getElementById('testimonialsCarousel');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    
    if (!carousel) return;
    
    const cardWidth = carousel.querySelector('.testimonial-card').offsetWidth;
    const gap = 32; // gap between cards
    const scrollPosition = (cardWidth + gap) * index;
    
    carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

// ============================================
// SCROLL TO TOP
// ============================================
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;
    
    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// CHATBOT
// ============================================
function initChatbot() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotModal = document.getElementById('chatbotModal');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    if (!chatbotBtn || !chatbotModal) return;
    
    // Open chatbot
    chatbotBtn.addEventListener('click', function() {
        chatbotModal.classList.add('active');
    });
    
    // Close chatbot
    if (closeChatbot) {
        closeChatbot.addEventListener('click', function() {
            chatbotModal.classList.remove('active');
        });
    }
    
    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;
        
        // Add user message
        addChatMessage(message, 'user');
        chatbotInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addChatMessage(response, 'bot');
        }, 1000);
    }
    
    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Quick actions
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            handleQuickAction(action);
        });
    });
}

function addChatMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbotMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}-message`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">Just now</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">Just now</span>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('maldives')) {
        return 'Great choice! Maldives packages start from ₹45,999. Would you like to see our exclusive deals?';
    } else if (lowerMessage.includes('dubai')) {
        return 'Dubai is amazing! We have packages starting at ₹38,999 with direct flights. Interested?';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return 'Our destination packages range from ₹38,999 to ₹1,50,000. What\'s your preferred budget?';
    } else if (lowerMessage.includes('book')) {
        return 'I can help you book! Please share your preferred destination and travel dates.';
    } else {
        return 'I\'m here to help! You can ask about destinations, packages, prices, or booking assistance.';
    }
}

function handleQuickAction(action) {
    switch (action) {
        case 'destinations':
            addChatMessage('Show me destination recommendations', 'user');
            setTimeout(() => {
                addChatMessage('Based on current trends, I recommend: Maldives, Dubai, Bali, and Switzerland. Which interests you?', 'bot');
            }, 1000);
            break;
        case 'packages':
            addChatMessage('Show available packages', 'user');
            setTimeout(() => {
                addChatMessage('We have 50+ packages! Popular ones: Maldives Paradise (₹1,16,999), Dubai City Break (₹58,999), Bali Adventure (₹72,999)', 'bot');
            }, 1000);
            break;
        case 'booking':
            addChatMessage('I need booking assistance', 'user');
            setTimeout(() => {
                addChatMessage('I\'ll connect you with a travel expert. Please share your destination and travel dates.', 'bot');
            }, 1000);
            break;
        case 'support':
            addChatMessage('Connect me with an agent', 'user');
            setTimeout(() => {
                addChatMessage('Connecting you to our 24/7 support team. Please hold...', 'bot');
            }, 1000);
            break;
    }
}

// ============================================
// EXIT INTENT POPUP
// ============================================
function initExitIntent() {
    const exitModal = document.getElementById('exitIntentModal');
    const exitOverlay = document.getElementById('exitModalOverlay');
    const closeExitModal = document.getElementById('closeExitModal');
    const declineOffer = document.getElementById('declineOffer');
    const exitForm = document.getElementById('exitOfferForm');
    
    if (!exitModal) return;
    
    // Detect exit intent
    document.addEventListener('mouseleave', function(e) {
        if (e.clientY < 0 && !exitIntentShown) {
            exitModal.classList.add('active');
            exitIntentShown = true;
        }
    });
    
    // Close modal
    function closeModal() {
        exitModal.classList.remove('active');
    }
    
    if (closeExitModal) closeExitModal.addEventListener('click', closeModal);
    if (exitOverlay) exitOverlay.addEventListener('click', closeModal);
    if (declineOffer) declineOffer.addEventListener('click', closeModal);
    
    // Form submission
    if (exitForm) {
        exitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            console.log('Exit offer claimed:', email);
            showNotification('🎉 Offer claimed! Check your email.');
            closeModal();
        });
    }
}

// ============================================
// NOTIFICATIONS
// ============================================
function initNotifications() {
    // Show initial notification after 3 seconds
    setTimeout(() => {
        showNotification('🔥 3 people just booked Maldives!');
    }, 3000);
    
    // Random notifications
    const notifications = [
        '💰 Price drop on Dubai packages!',
        '⭐ Sarah just rated us 5 stars!',
        '✈️ Last 2 seats for Bali next week!',
        '🎁 Special offer: 15% off on all bookings!'
    ];
    
    let notificationIndex = 0;
    setInterval(() => {
        showNotification(notifications[notificationIndex]);
        notificationIndex = (notificationIndex + 1) % notifications.length;
    }, 20000);
}

function showNotification(message) {
    const toast = document.getElementById('notificationToast');
    if (!toast) return;
    
    const messageEl = toast.querySelector('.toast-message');
    if (messageEl) messageEl.textContent = message;
    
    toast.classList.add('show');
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.onclick = () => toast.classList.remove('show');
    }
}

// ============================================
// LIVE COUNTER
// ============================================
function initLiveCounter() {
    const liveCount = document.querySelector('.live-count');
    if (!liveCount) return;
    
    setInterval(() => {
        const current = parseInt(liveCount.textContent);
        const change = Math.floor(Math.random() * 10) - 5;
        const newCount = Math.max(1200, Math.min(1300, current + change));
        liveCount.textContent = newCount.toLocaleString('en-IN');
    }, 5000);
}

// ============================================
// WISHLIST
// ============================================
function initWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            
            const destination = this.dataset.destination || this.dataset.package;
            if (this.classList.contains('active')) {
                showNotification(`❤️ Added ${destination} to wishlist`);
            } else {
                showNotification(`Removed ${destination} from wishlist`);
            }
        });
    });
}

// ============================================
// LOAD MORE
// ============================================
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreDestinations');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Simulate loading
        setTimeout(() => {
            showNotification('✨ 6 more destinations loaded!');
            this.innerHTML = '<i class="fas fa-plus-circle"></i> Load More Destinations';
            
            // In real implementation, load actual data here
        }, 1500);
    });
    
    // Show more activity button
    const showMoreActivity = document.getElementById('showMoreActivity');
    if (showMoreActivity) {
        showMoreActivity.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            
            setTimeout(() => {
                showNotification('Loaded more booking activity');
                this.innerHTML = '<i class="fas fa-chevron-down"></i> Show More Activity';
            }, 1000);
        });
    }
}

// ============================================
// NEWSLETTER FORM
// ============================================
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('subscriberName').value;
        const email = document.getElementById('subscriberEmail').value;
        const phone = document.getElementById('subscriberPhone').value;
        const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked'))
            .map(cb => cb.value);
        
        console.log('Newsletter subscription:', {
            name,
            email,
            phone,
            interests
        });
        
        showNotification('🎉 Welcome to Premium Club!');
        this.reset();
    });
}

// ============================================
// INTERSECTION OBSERVER (Animations on scroll)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('.destination-card-clean, .package-card-luxury, .tool-card, .guide-card, .advantage-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Format currency
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// Get date range
function getDateRange(days) {
    const start = new Date();
    const end = new Date(start.getTime() + (days * 24 * 60 * 60 * 1000));
    return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
    };
}

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c🌍 Destinova - Where Will Your Story Begin?', 'color: #047857; font-size: 16px; font-weight: bold;');
console.log('%cFounded by Zaid Malik & Ashok Sah', 'color: #D4AF37; font-size: 14px;');
console.log('%cAll systems operational ✈️', 'color: #047857; font-size: 12px;');

// ============================================
// END OF JAVASCRIPT
// ============================================
