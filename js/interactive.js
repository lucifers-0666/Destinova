/**
 * DESTINOVA - INTERACTIVE FEATURES
 * Phase 3: Advanced Interactivity, Modals, Forms & User Feedback
 * 
 * Features:
 * - Form validation with real-time feedback
 * - Modal/popup management
 * - Toast notification system
 * - User preferences & localStorage
 * - Accessibility helpers
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Interactive features module initialized');
    
    initModals();
    initToastSystem();
    initFormValidation();
    initUserPreferences();
    initStickyHeader();
    initScrollToTop();
    initPromoPopup();
    initNotificationCenter();
    initCompareModeToCards();
    initRippleEffect();
});

// ============================================
// MODAL MANAGEMENT
// ============================================

let activeModal = null;

function initModals() {
    // Create modal backdrop if doesn't exist
    if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.addEventListener('click', closeModal);
        document.body.appendChild(backdrop);
    }
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeModal) {
            closeModal();
        }
    });
    
    // Add modal triggers to destination cards
    document.querySelectorAll('.destination-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-explore')) return;
            e.preventDefault();
            showDestinationModal(card);
        });
    });
    
    // Add modal triggers to offer cards
    document.querySelectorAll('.offer-card').forEach(card => {
        const bookBtn = card.querySelector('.btn-book-tour');
        if (bookBtn) {
            bookBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showOfferModal(card);
            });
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal ${modalId} not found`);
        return;
    }
    
    activeModal = modal;
    const backdrop = document.querySelector('.modal-backdrop');
    
    // Show backdrop
    backdrop.classList.add('active');
    
    // Show modal with animation
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    // Animate in
    gsap.fromTo(modal,
        { opacity: 0, scale: 0.95, y: 20 },
        { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.3,
            ease: 'back.out(1.5)'
        }
    );
    
    // Focus first focusable element
    setTimeout(() => {
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        firstFocusable?.focus();
    }, 350);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!activeModal) return;
    
    const backdrop = document.querySelector('.modal-backdrop');
    
    // Animate out
    gsap.to(activeModal, {
        opacity: 0,
        scale: 0.95,
        y: 20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
            activeModal.style.display = 'none';
            activeModal.setAttribute('aria-hidden', 'true');
            activeModal = null;
        }
    });
    
    // Hide backdrop
    backdrop.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

function showDestinationModal(card) {
    const name = card.querySelector('.destination-name')?.textContent || 'Destination';
    const price = card.querySelector('.destination-price')?.textContent || 'Price available';
    const image = card.querySelector('.destination-image')?.src || '';
    
    // Create modal content
    const modalHTML = `
        <div id="destinationModal" class="modal" role="dialog" aria-labelledby="modal-title" aria-modal="true">
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body">
                    <img src="${image}" alt="${name}" class="modal-image">
                    <h2 id="modal-title" class="modal-title">${name}</h2>
                    <p class="modal-price">${price}</p>
                    <div class="modal-details">
                        <div class="detail-item">
                            <i class="fas fa-plane-departure"></i>
                            <span>Direct & connecting flights available</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>Average flight time: 6-8 hours</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>Best time to visit: Year-round</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <span>Popular with couples & families</span>
                        </div>
                    </div>
                    <button class="btn-modal-primary" onclick="redirectToSearch('${name}')">
                        <i class="fas fa-search"></i>
                        Search Flights to ${name}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if present
    const existing = document.getElementById('destinationModal');
    if (existing) existing.remove();
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Open modal
    setTimeout(() => openModal('destinationModal'), 10);
    
    // Add close button listener
    document.querySelector('#destinationModal .modal-close')?.addEventListener('click', closeModal);
}

function showOfferModal(card) {
    const title = card.querySelector('.offer-title')?.textContent || 'Special Offer';
    const price = card.querySelector('.price-current')?.textContent || '';
    const originalPrice = card.querySelector('.price-original')?.textContent || '';
    const location = card.querySelector('.location-tag')?.textContent.trim() || '';
    const image = card.querySelector('.offer-image')?.src || '';
    const rating = card.querySelectorAll('.offer-rating .fa-star').length || 5;
    
    const modalHTML = `
        <div id="offerModal" class="modal" role="dialog" aria-labelledby="offer-modal-title" aria-modal="true">
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body">
                    <img src="${image}" alt="${title}" class="modal-image">
                    <span class="modal-location"><i class="fas fa-location-dot"></i> ${location}</span>
                    <h2 id="offer-modal-title" class="modal-title">${title}</h2>
                    <div class="modal-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(rating)}
                        <span>(Excellent reviews)</span>
                    </div>
                    <div class="modal-price-wrapper">
                        <span class="modal-price-original">${originalPrice}</span>
                        <span class="modal-price-current">${price}</span>
                    </div>
                    <div class="modal-features">
                        <div class="feature-badge"><i class="fas fa-check-circle"></i> Instant Confirmation</div>
                        <div class="feature-badge"><i class="fas fa-check-circle"></i> Free Cancellation</div>
                        <div class="feature-badge"><i class="fas fa-check-circle"></i> Best Price Guarantee</div>
                    </div>
                    <button class="btn-modal-primary" onclick="proceedToBooking('${title}')">
                        <i class="fas fa-ticket"></i>
                        Proceed to Booking
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const existing = document.getElementById('offerModal');
    if (existing) existing.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setTimeout(() => openModal('offerModal'), 10);
    
    document.querySelector('#offerModal .modal-close')?.addEventListener('click', closeModal);
}

// Global functions for modal actions
window.redirectToSearch = function(destination) {
    showToast(`Searching flights to ${destination}...`, 'info');
    setTimeout(() => {
        closeModal();
        // In production, redirect to search results
        console.log(`Redirecting to search: ${destination}`);
    }, 1000);
};

window.proceedToBooking = function(offer) {
    showToast('Redirecting to booking page...', 'success');
    setTimeout(() => {
        closeModal();
        // In production, redirect to booking
        console.log(`Proceeding to booking: ${offer}`);
    }, 1000);
};

// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================

let toastQueue = [];
let maxToasts = 3;

function initToastSystem() {
    // Create toast container if doesn't exist
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }
}

function showToast(message, type = 'info', duration = 4000) {
    const container = document.querySelector('.toast-container');
    
    // Remove oldest toast if at limit
    const existingToasts = container.querySelectorAll('.toast');
    if (existingToasts.length >= maxToasts) {
        removeToast(existingToasts[0]);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
        <button class="toast-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    gsap.fromTo(toast,
        { opacity: 0, x: 50, scale: 0.9 },
        { 
            opacity: 1, 
            x: 0, 
            scale: 1, 
            duration: 0.3,
            ease: 'back.out(1.5)'
        }
    );
    
    // Close button
    toast.querySelector('.toast-close')?.addEventListener('click', () => removeToast(toast));
    
    // Auto dismiss
    if (duration > 0) {
        setTimeout(() => removeToast(toast), duration);
    }
    
    return toast;
}

function removeToast(toast) {
    if (!toast || !toast.parentElement) return;
    
    gsap.to(toast, {
        opacity: 0,
        x: 50,
        scale: 0.9,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
            toast.remove();
        }
    });
}

// ============================================
// FORM VALIDATION
// ============================================

function initFormValidation() {
    const form = document.getElementById('flightSearchForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        // Real-time validation on blur
        input.addEventListener('blur', () => validateField(input));
        
        // Clear validation on focus
        input.addEventListener('focus', () => clearFieldValidation(input));
    });
    
    // Enhanced form submission
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    let isValid = true;
    let message = '';
    
    // Required field check
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        message = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    }
    
    // Date validation
    if (field.type === 'date' && field.value) {
        const selectedDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            isValid = false;
            message = 'Date cannot be in the past';
        }
        
        // Return date validation
        if (field.id === 'returnDate') {
            const departDate = document.getElementById('departDate');
            if (departDate && departDate.value) {
                const departure = new Date(departDate.value);
                if (selectedDate < departure) {
                    isValid = false;
                    message = 'Return date must be after departure date';
                }
            }
        }
    }
    
    // Apply validation state
    if (isValid) {
        formGroup.classList.remove('is-error');
        formGroup.classList.add('is-valid');
        showValidationMessage(formGroup, 'Valid', 'success');
    } else {
        formGroup.classList.remove('is-valid');
        formGroup.classList.add('is-error');
        showValidationMessage(formGroup, message, 'error');
        
        // Shake animation
        anime({
            targets: field,
            translateX: [-10, 10, -10, 10, 0],
            duration: 400,
            easing: 'easeInOutQuad'
        });
    }
    
    return isValid;
}

function clearFieldValidation(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.remove('is-error', 'is-valid');
    removeValidationMessage(formGroup);
}

function showValidationMessage(formGroup, message, type) {
    removeValidationMessage(formGroup);
    
    const messageEl = document.createElement('div');
    messageEl.className = `validation-message validation-${type}`;
    messageEl.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    formGroup.appendChild(messageEl);
    
    // Animate in
    gsap.fromTo(messageEl,
        { opacity: 0, y: -5 },
        { opacity: 1, y: 0, duration: 0.2 }
    );
}

function removeValidationMessage(formGroup) {
    const existing = formGroup.querySelector('.validation-message');
    if (existing) {
        gsap.to(existing, {
            opacity: 0,
            y: -5,
            duration: 0.15,
            onComplete: () => existing.remove()
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('.form-input[required]');
    let isFormValid = true;
    
    // Validate all required fields
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showToast('Please fix all errors before submitting', 'error');
        
        // Focus first invalid field
        const firstError = form.querySelector('.is-error .form-input');
        firstError?.focus();
        return;
    }
    
    // Success! Process form
    showToast('Searching for flights...', 'info');
    
    // Track search in user profile
    trackSearch(form);
    
    // Continue with existing search.js logic
}

// ============================================
// USER PREFERENCES & LOCAL STORAGE
// ============================================

function initUserPreferences() {
    loadUserProfile();
    trackUserBehavior();
}

function loadUserProfile() {
    const profile = getUserProfile();
    
    // Apply saved preferences
    if (profile.preferences.language) {
        // Set language if needed
    }
    
    // Show personalized recommendations
    if (profile.searchHistory.length > 0) {
        showPersonalizedRecommendations(profile);
    }
}

function getUserProfile() {
    const defaultProfile = {
        searchHistory: [],
        preferences: {
            language: 'en',
            currency: 'INR'
        },
        analytics: {
            totalSearches: 0,
            mostSearchedRoute: null,
            averageBudget: 0
        }
    };
    
    const stored = localStorage.getItem('destinovaUserProfile');
    return stored ? JSON.parse(stored) : defaultProfile;
}

function saveUserProfile(profile) {
    localStorage.setItem('destinovaUserProfile', JSON.stringify(profile));
}

function trackSearch(form) {
    const profile = getUserProfile();
    
    const searchData = {
        from: form.querySelector('#fromLocation')?.value || '',
        to: form.querySelector('#toLocation')?.value || '',
        departDate: form.querySelector('#departDate')?.value || '',
        returnDate: form.querySelector('#returnDate')?.value || '',
        travelers: form.querySelector('#travelers')?.value || '2',
        class: form.querySelector('#class')?.value || 'economy',
        timestamp: new Date().toISOString()
    };
    
    // Add to history (keep last 10)
    profile.searchHistory.unshift(searchData);
    if (profile.searchHistory.length > 10) {
        profile.searchHistory = profile.searchHistory.slice(0, 10);
    }
    
    // Update analytics
    profile.analytics.totalSearches++;
    
    saveUserProfile(profile);
}

function showPersonalizedRecommendations(profile) {
    // Get most recent search
    const recentSearch = profile.searchHistory[0];
    if (!recentSearch) return;
    
    // Show subtle notification
    setTimeout(() => {
        showToast(`💡 Based on your searches, you might like flights to ${recentSearch.to}`, 'info', 6000);
    }, 3000);
}

function trackUserBehavior() {
    // Track clicks on destination cards
    document.querySelectorAll('.destination-card').forEach(card => {
        card.addEventListener('click', () => {
            const destination = card.querySelector('.destination-name')?.textContent || '';
            logAnalyticsEvent('destination_card_click', { destination });
        });
    });
    
    // Track offer card clicks
    document.querySelectorAll('.offer-card').forEach(card => {
        card.addEventListener('click', () => {
            const offer = card.querySelector('.offer-title')?.textContent || '';
            logAnalyticsEvent('offer_card_click', { offer });
        });
    });
}

function logAnalyticsEvent(eventName, data) {
    console.log('📊 Analytics Event:', eventName, data);
    
    // In production, send to Google Analytics or custom endpoint
    // gtag('event', eventName, data);
}

// ============================================
// STICKY HEADER
// ============================================

function initStickyHeader() {
    let lastScroll = 0;
    const heroSection = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
        
        // Show/hide on scroll direction (optional feature)
        if (currentScroll > lastScroll && currentScroll > 300) {
            // Scrolling down
            document.body.classList.add('scroll-down');
        } else {
            // Scrolling up
            document.body.classList.remove('scroll-down');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

function initScrollToTop() {
    // Create button
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(button);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top
    button.addEventListener('click', () => {
        gsap.to(window, {
            duration: 1,
            scrollTo: { y: 0 },
            ease: 'power2.inOut'
        });
    });
}

// ============================================
// PROMO POPUP
// ============================================

function initPromoPopup() {
    // Check if already shown
    const hidePromo = localStorage.getItem('hidePromo');
    const hideUntil = localStorage.getItem('hidePromoUntil');
    
    if (hidePromo === 'true' && hideUntil) {
        const hideDate = new Date(hideUntil);
        if (new Date() < hideDate) {
            return; // Don't show popup
        }
    }
    
    // Show after 5 seconds
    setTimeout(() => {
        showPromoPopup();
    }, 5000);
}

function showPromoPopup() {
    const modalHTML = `
        <div id="promoPopup" class="modal promo-modal" role="dialog" aria-labelledby="promo-title" aria-modal="true">
            <div class="modal-content">
                <button class="modal-close" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="modal-body">
                    <div class="promo-icon">✈️</div>
                    <h2 id="promo-title" class="promo-title">First-Time Traveler?</h2>
                    <p class="promo-subtitle">Get <strong>15% OFF</strong> on your first booking!</p>
                    <form class="promo-form" id="promoForm">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            class="promo-input"
                            required
                        >
                        <button type="submit" class="btn-promo">
                            Get Discount Code
                        </button>
                    </form>
                    <button class="promo-dismiss" onclick="dismissPromo()">Maybe later</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setTimeout(() => openModal('promoPopup'), 10);
    
    // Handle form submission
    document.getElementById('promoForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        showToast('🎉 Discount code sent to your email!', 'success');
        closeModal();
        
        // Hide for 7 days
        localStorage.setItem('hidePromo', 'true');
        const hideUntil = new Date();
        hideUntil.setDate(hideUntil.getDate() + 7);
        localStorage.setItem('hidePromoUntil', hideUntil.toISOString());
    });
    
    // Close button
    document.querySelector('#promoPopup .modal-close')?.addEventListener('click', closeModal);
}

window.dismissPromo = function() {
    closeModal();
    // Hide for 1 day
    localStorage.setItem('hidePromo', 'true');
    const hideUntil = new Date();
    hideUntil.setDate(hideUntil.getDate() + 1);
    localStorage.setItem('hidePromoUntil', hideUntil.toISOString());
};

// ============================================
// NOTIFICATION CENTER
// ============================================

function initNotificationCenter() {
    // Create notification bell (would typically be in header)
    const bellHTML = `
        <div class="notification-bell">
            <button class="bell-button" aria-label="Notifications">
                <i class="fas fa-bell"></i>
                <span class="notification-badge">3</span>
            </button>
            <div class="notification-dropdown" role="menu">
                <div class="notification-header">
                    <h3>Notifications</h3>
                    <button class="mark-all-read">Mark all read</button>
                </div>
                <div class="notification-list">
                    <div class="notification-item unread">
                        <div class="notification-icon success">
                            <i class="fas fa-tag"></i>
                        </div>
                        <div class="notification-content">
                            <p class="notification-text">Flight price dropped: Delhi → Mumbai</p>
                            <span class="notification-time">2 hours ago</span>
                        </div>
                    </div>
                    <div class="notification-item unread">
                        <div class="notification-icon warning">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="notification-content">
                            <p class="notification-text">Only 3 seats left at this price</p>
                            <span class="notification-time">5 hours ago</span>
                        </div>
                    </div>
                    <div class="notification-item">
                        <div class="notification-icon info">
                            <i class="fas fa-info-circle"></i>
                        </div>
                        <div class="notification-content">
                            <p class="notification-text">Your searched flight is now 20% cheaper</p>
                            <span class="notification-time">1 day ago</span>
                        </div>
                    </div>
                </div>
                <a href="#" class="view-all-notifications">View all notifications</a>
            </div>
        </div>
    `;
    
    // Would typically add to header
    // For demo, log to console
    console.log('📬 Notification center ready');
}

// ============================================
// COMPARE MODE FOR CARDS
// ============================================

let compareMode = false;
let selectedCards = [];

function initCompareModeToCards() {
    // Add compare mode toggle (would be in UI)
    console.log('🔄 Compare mode ready');
    
    // Could add checkboxes to cards on hover in future
}

// ============================================
// RIPPLE EFFECT
// ============================================

function initRippleEffect() {
    const buttons = document.querySelectorAll('button:not(.no-ripple)');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ============================================
// EXPORT UTILITIES
// ============================================

window.DestinovaInteractive = {
    showToast,
    openModal,
    closeModal,
    showDestinationModal,
    showOfferModal,
    validateField,
    getUserProfile,
    saveUserProfile
};

console.log('✅ Destinova Interactive module loaded');
