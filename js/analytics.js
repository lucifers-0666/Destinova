/**
 * DESTINOVA ANALYTICS & COOKIE MANAGEMENT
 * Handles Google Analytics 4 event tracking and GDPR/CCPA cookie consent
 */

// ========================================
// COOKIE CONSENT MANAGEMENT
// ========================================

const CookieConsent = {
    COOKIE_NAME: 'destinova_cookie_consent',
    COOKIE_EXPIRY_DAYS: 365,

    /**
     * Initialize cookie consent banner
     */
    init() {
        const consent = this.getConsent();
        
        if (consent === null) {
            // Show banner if no consent has been given
            this.showBanner();
        } else if (consent === 'accepted') {
            // Enable analytics if consent was given
            this.enableAnalytics();
        }

        // Set up event listeners
        this.setupEventListeners();
    },

    /**
     * Show cookie consent banner
     */
    showBanner() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.setAttribute('aria-hidden', 'false');
        }
    },

    /**
     * Hide cookie consent banner
     */
    hideBanner() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.setAttribute('aria-hidden', 'true');
        }
    },

    /**
     * Get current consent status from cookie
     * @returns {string|null} 'accepted', 'rejected', or null
     */
    getConsent() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.COOKIE_NAME) {
                return value;
            }
        }
        return null;
    },

    /**
     * Set consent status in cookie
     * @param {string} status - 'accepted' or 'rejected'
     */
    setConsent(status) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.COOKIE_EXPIRY_DAYS);
        
        document.cookie = `${this.COOKIE_NAME}=${status}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax; Secure`;
    },

    /**
     * Accept all cookies
     */
    acceptAll() {
        this.setConsent('accepted');
        this.enableAnalytics();
        this.hideBanner();
        
        // Show toast notification
        if (typeof DestinovaInteractive !== 'undefined') {
            DestinovaInteractive.showToast('Cookie preferences saved', 'success');
        }
    },

    /**
     * Reject non-essential cookies
     */
    rejectAll() {
        this.setConsent('rejected');
        this.disableAnalytics();
        this.hideBanner();
        
        // Show toast notification
        if (typeof DestinovaInteractive !== 'undefined') {
            DestinovaInteractive.showToast('Only essential cookies will be used', 'info');
        }
    },

    /**
     * Enable Google Analytics tracking
     */
    enableAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'denied' // We don't use ads
            });
        }
    },

    /**
     * Disable Google Analytics tracking
     */
    disableAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied'
            });
        }
    },

    /**
     * Set up event listeners for cookie banner buttons
     */
    setupEventListeners() {
        const acceptBtn = document.getElementById('cookieAccept');
        const rejectBtn = document.getElementById('cookieReject');
        const settingsBtn = document.getElementById('cookieSettings');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAll());
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', () => this.rejectAll());
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }
    },

    /**
     * Show cookie settings modal (placeholder for future implementation)
     */
    showSettings() {
        // TODO: Implement detailed cookie settings modal
        alert('Cookie settings will allow you to customize which cookies to accept. This feature will be implemented in the full version.');
    }
};

// ========================================
// ANALYTICS EVENT TRACKING
// ========================================

const DestinovaAnalytics = {
    /**
     * Track flight search event
     * @param {Object} searchData - Search parameters
     */
    trackFlightSearch(searchData) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'flight_search', {
            'origin': searchData.from || '',
            'destination': searchData.to || '',
            'departure_date': searchData.departDate || '',
            'return_date': searchData.returnDate || '',
            'travelers': searchData.travelers || 1,
            'class': searchData.class || 'economy',
            'trip_type': searchData.tripType || 'round-trip'
        });
    },

    /**
     * Track destination card click
     * @param {string} destinationName - Name of destination
     * @param {string} price - Price displayed
     * @param {number} position - Position in grid (for analytics)
     */
    trackDestinationClick(destinationName, price, position) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'destination_click', {
            'destination_name': destinationName,
            'price': price,
            'position': position
        });
    },

    /**
     * Track offer/deal click
     * @param {string} offerTitle - Offer title
     * @param {string} location - Offer location
     * @param {string} originalPrice - Original price
     * @param {string} discountedPrice - Discounted price
     */
    trackOfferClick(offerTitle, location, originalPrice, discountedPrice) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'offer_click', {
            'offer_title': offerTitle,
            'location': location,
            'original_price': originalPrice,
            'discounted_price': discountedPrice,
            'discount_percentage': this.calculateDiscount(originalPrice, discountedPrice)
        });
    },

    /**
     * Track newsletter signup
     * @param {string} email - User email
     */
    trackNewsletterSignup(email) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'newsletter_signup', {
            'email_domain': email.split('@')[1] || '',
            'method': 'hero_form'
        });
    },

    /**
     * Track PWA install
     * @param {string} method - Install method (banner, menu, etc.)
     */
    trackPWAInstall(method) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'pwa_install', {
            'method': method,
            'device_type': this.getDeviceType(),
            'browser': this.getBrowser()
        });
    },

    /**
     * Track dark mode toggle
     * @param {string} theme - New theme (light, dark, auto)
     */
    trackThemeChange(theme) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'theme_change', {
            'theme': theme,
            'time_of_day': this.getTimeOfDay()
        });
    },

    /**
     * Track FAQ accordion interaction
     * @param {string} question - Question clicked
     * @param {boolean} isExpanding - Whether expanding or collapsing
     */
    trackFAQInteraction(question, isExpanding) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'faq_interaction', {
            'question': question,
            'action': isExpanding ? 'expand' : 'collapse'
        });
    },

    /**
     * Track scroll depth
     * @param {number} percentage - Scroll percentage (25, 50, 75, 100)
     */
    trackScrollDepth(percentage) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'scroll_depth', {
            'percentage': percentage
        });
    },

    /**
     * Track page engagement time
     * @param {number} seconds - Time spent on page
     */
    trackEngagementTime(seconds) {
        if (typeof gtag === 'undefined') return;
        
        gtag('event', 'engagement_time', {
            'duration_seconds': seconds,
            'page_path': window.location.pathname
        });
    },

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    /**
     * Calculate discount percentage
     * @param {string} original - Original price string
     * @param {string} discounted - Discounted price string
     * @returns {number} Discount percentage
     */
    calculateDiscount(original, discounted) {
        const originalNum = parseFloat(original.replace(/[^0-9.]/g, ''));
        const discountedNum = parseFloat(discounted.replace(/[^0-9.]/g, ''));
        return Math.round(((originalNum - discountedNum) / originalNum) * 100);
    },

    /**
     * Get device type
     * @returns {string} Device type
     */
    getDeviceType() {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    },

    /**
     * Get browser name
     * @returns {string} Browser name
     */
    getBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
    },

    /**
     * Get time of day
     * @returns {string} Time of day (morning, afternoon, evening, night)
     */
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 6) return 'night';
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    }
};

// ========================================
// SCROLL DEPTH TRACKING
// ========================================

let scrollDepthTracked = {
    25: false,
    50: false,
    75: false,
    100: false
};

function trackScrollDepth() {
    const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    
    for (let threshold in scrollDepthTracked) {
        if (scrollPercentage >= threshold && !scrollDepthTracked[threshold]) {
            scrollDepthTracked[threshold] = true;
            DestinovaAnalytics.trackScrollDepth(parseInt(threshold));
        }
    }
}

// ========================================
// ENGAGEMENT TIME TRACKING
// ========================================

let pageLoadTime = Date.now();
let engagementTimeTracked = false;

function trackEngagementTime() {
    if (!engagementTimeTracked) {
        const timeSpent = Math.floor((Date.now() - pageLoadTime) / 1000);
        if (timeSpent >= 30) { // Track after 30 seconds
            DestinovaAnalytics.trackEngagementTime(timeSpent);
            engagementTimeTracked = true;
        }
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        CookieConsent.init();
        
        // Set up scroll tracking
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(trackScrollDepth, 100);
        });
        
        // Set up engagement time tracking
        setTimeout(trackEngagementTime, 30000);
        window.addEventListener('beforeunload', trackEngagementTime);
    });
} else {
    CookieConsent.init();
}

// Export for use in other scripts
window.DestinovaAnalytics = DestinovaAnalytics;
window.CookieConsent = CookieConsent;
