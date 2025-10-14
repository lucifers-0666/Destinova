/**
 * ===================================================================
 * PREMIUM FOOTER - JAVASCRIPT
 * Destinova - Comprehensive Footer Functionality
 * ===================================================================
 */

// Main Footer Controller
const DestinovaFooter = {
  // Configuration
  config: {
    scrollThreshold: 500,
    debounceDelay: 150,
    animationDuration: 600,
    newsletterEndpoint: '/api/newsletter/subscribe', // Update with actual endpoint
    analyticsEnabled: true
  },

  // State management
  state: {
    isFooterVisible: false,
    isNewsletterSubmitted: false,
    scrollPosition: 0,
    activeDropdown: null
  },

  // Initialize all footer functionality
  init() {
    console.log('[Destinova Footer] Initializing premium footer...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupFooter());
    } else {
      this.setupFooter();
    }
  },

  // Setup all footer components
  setupFooter() {
    try {
      this.initFooterRevealAnimation();
      this.initNewsletterForm();
      this.initBackToTopButton();
      this.initLiveChatButton();
      this.initSocialMediaTracking();
      this.initLanguageCurrencySelectors();
      this.initSmoothScrollLinks();
      this.initPhoneCopyFeature();
      this.initAccessibility();
      this.initAnalytics();
      this.initResponsiveHandlers();
      
      console.log('[Destinova Footer] ✅ All features initialized successfully');
    } catch (error) {
      console.error('[Destinova Footer] ❌ Initialization error:', error);
    }
  },

  /**
   * ===================================================================
   * FOOTER REVEAL ANIMATION
   * ===================================================================
   */
  initFooterRevealAnimation() {
    const footer = document.querySelector('.destinova-footer');
    const newsletterSection = document.querySelector('.footer-newsletter-section');
    
    if (!footer) return;

    // Intersection Observer for footer reveal
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.state.isFooterVisible) {
            this.state.isFooterVisible = true;
            
            // Add visible class to newsletter section
            if (newsletterSection) {
              newsletterSection.classList.add('visible');
            }

            // Track footer view
            this.trackEvent('footer_viewed', {
              timestamp: new Date().toISOString()
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    footerObserver.observe(footer);
  },

  /**
   * ===================================================================
   * NEWSLETTER SUBSCRIPTION FORM
   * ===================================================================
   */
  initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    const emailInput = document.querySelector('.newsletter-email-input');
    const submitButton = document.querySelector('.newsletter-submit-button');

    if (!form || !emailInput || !submitButton) return;

    // Real-time email validation
    emailInput.addEventListener('input', (e) => {
      this.validateEmail(e.target.value) 
        ? emailInput.classList.remove('invalid')
        : emailInput.classList.add('invalid');
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleNewsletterSubmit(emailInput, submitButton);
    });

    // Enter key support
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
      }
    });
  },

  // Handle newsletter subscription
  async handleNewsletterSubmit(emailInput, submitButton) {
    const email = emailInput.value.trim();

    // Validate email
    if (!this.validateEmail(email)) {
      this.showNotification('Please enter a valid email address', 'error');
      emailInput.focus();
      return;
    }

    // Check if already subscribed
    if (this.state.isNewsletterSubmitted) {
      this.showNotification('You are already subscribed!', 'info');
      return;
    }

    // Show loading state
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <svg class="newsletter-submit-icon animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Subscribing...
    `;

    try {
      // Simulate API call (replace with actual endpoint)
      await this.simulateNewsletterAPI(email);
      
      // Success
      this.state.isNewsletterSubmitted = true;
      this.showNotification('🎉 Successfully subscribed! Check your inbox for a welcome email.', 'success');
      
      // Store subscription in localStorage
      localStorage.setItem('destinova_newsletter_subscribed', 'true');
      localStorage.setItem('destinova_newsletter_email', email);
      
      // Clear form
      emailInput.value = '';
      
      // Update button
      submitButton.innerHTML = `
        <svg class="newsletter-submit-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Subscribed!
      `;
      
      // Track conversion
      this.trackEvent('newsletter_subscribed', { email: this.hashEmail(email) });
      
    } catch (error) {
      console.error('[Newsletter] Subscription error:', error);
      this.showNotification('Oops! Something went wrong. Please try again.', 'error');
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  },

  // Simulate newsletter API call
  simulateNewsletterAPI(email) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate 95% success rate
        Math.random() > 0.05 ? resolve() : reject(new Error('Network error'));
      }, 1500);
    });
  },

  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Hash email for privacy (analytics)
  hashEmail(email) {
    return btoa(email).substring(0, 16);
  },

  /**
   * ===================================================================
   * BACK TO TOP BUTTON
   * ===================================================================
   */
  initBackToTopButton() {
    const backToTopBtn = document.querySelector('.back-to-top-button');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    const handleScroll = this.debounce(() => {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      this.state.scrollPosition = scrollPosition;

      if (scrollPosition > this.config.scrollThreshold) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, this.config.debounceDelay);

    window.addEventListener('scroll', handleScroll);

    // Click handler - smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
      this.smoothScrollTo(0, 800);
      this.trackEvent('back_to_top_clicked', { 
        from_position: this.state.scrollPosition 
      });
    });

    // Keyboard support
    backToTopBtn.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        backToTopBtn.click();
      }
    });
  },

  /**
   * ===================================================================
   * LIVE CHAT BUTTON
   * ===================================================================
   */
  initLiveChatButton() {
    const liveChatBtn = document.querySelector('.live-chat-button');
    if (!liveChatBtn) return;

    liveChatBtn.addEventListener('click', () => {
      this.openLiveChat();
      this.trackEvent('live_chat_opened', {
        page_url: window.location.href,
        timestamp: new Date().toISOString()
      });
    });

    // Keyboard support
    liveChatBtn.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        liveChatBtn.click();
      }
    });
  },

  // Open live chat widget
  openLiveChat() {
    // Replace with actual chat widget integration
    // Examples: Intercom, Drift, Zendesk Chat, Tawk.to, etc.
    
    console.log('[Live Chat] Opening chat widget...');
    
    // Placeholder implementation
    this.showNotification('Live chat will be available soon! Call us at +91 1800-123-4567', 'info');
    
    // Example integrations:
    /*
    // Intercom
    if (window.Intercom) {
      window.Intercom('show');
    }
    
    // Drift
    if (window.drift) {
      window.drift.api.openChat();
    }
    
    // Zendesk
    if (window.zE) {
      window.zE('messenger', 'open');
    }
    */
  },

  /**
   * ===================================================================
   * SOCIAL MEDIA TRACKING
   * ===================================================================
   */
  initSocialMediaTracking() {
    const socialIcons = document.querySelectorAll('.footer-social-icon');
    
    socialIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        const platform = icon.getAttribute('aria-label') || 'Unknown';
        const url = icon.getAttribute('href');
        
        this.trackEvent('social_media_click', {
          platform,
          url,
          location: 'footer'
        });
      });
    });
  },

  /**
   * ===================================================================
   * LANGUAGE & CURRENCY SELECTORS
   * ===================================================================
   */
  initLanguageCurrencySelectors() {
    const languageSelector = document.querySelector('.footer-selector[data-type="language"]');
    const currencySelector = document.querySelector('.footer-selector[data-type="currency"]');

    if (languageSelector) {
      this.initDropdown(languageSelector, [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' }
      ], 'language');
    }

    if (currencySelector) {
      this.initDropdown(currencySelector, [
        { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
        { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' }
      ], 'currency');
    }
  },

  // Initialize dropdown functionality
  initDropdown(selector, options, type) {
    selector.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown(selector, options, type);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      if (this.state.activeDropdown) {
        this.closeDropdown();
      }
    });
  },

  // Toggle dropdown menu
  toggleDropdown(selector, options, type) {
    // Close any open dropdown
    if (this.state.activeDropdown && this.state.activeDropdown !== selector) {
      this.closeDropdown();
    }

    // Check if dropdown is already open
    const existingDropdown = selector.querySelector('.dropdown-menu');
    if (existingDropdown) {
      this.closeDropdown();
      return;
    }

    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu';
    dropdown.innerHTML = options.map(option => `
      <div class="dropdown-item" data-value="${option.code}">
        <span class="dropdown-item-icon">${option.flag || option.symbol}</span>
        <span class="dropdown-item-text">${option.name}</span>
      </div>
    `).join('');

    // Add styles
    Object.assign(dropdown.style, {
      position: 'absolute',
      bottom: '100%',
      left: '0',
      marginBottom: '8px',
      background: 'rgba(28, 37, 38, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(229, 203, 175, 0.3)',
      borderRadius: '12px',
      padding: '8px',
      minWidth: '200px',
      maxHeight: '300px',
      overflowY: 'auto',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      zIndex: '1001',
      animation: 'dropdownSlideUp 0.3s ease-out'
    });

    // Add animation keyframes
    if (!document.querySelector('#dropdownAnimation')) {
      const style = document.createElement('style');
      style.id = 'dropdownAnimation';
      style.textContent = `
        @keyframes dropdownSlideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }
        .dropdown-item:hover {
          background: rgba(229, 203, 175, 0.15);
        }
        .dropdown-item-icon {
          font-size: 18px;
        }
      `;
      document.head.appendChild(style);
    }

    selector.style.position = 'relative';
    selector.appendChild(dropdown);
    this.state.activeDropdown = selector;

    // Add click handlers to dropdown items
    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = item.dataset.value;
        this.handleSelectionChange(type, value);
        this.closeDropdown();
      });
    });
  },

  // Close dropdown
  closeDropdown() {
    if (this.state.activeDropdown) {
      const dropdown = this.state.activeDropdown.querySelector('.dropdown-menu');
      if (dropdown) {
        dropdown.style.animation = 'dropdownSlideDown 0.2s ease-out';
        setTimeout(() => dropdown.remove(), 200);
      }
      this.state.activeDropdown = null;
    }
  },

  // Handle language/currency change
  handleSelectionChange(type, value) {
    const selectorText = document.querySelector(`.footer-selector[data-type="${type}"] .footer-selector-text`);
    if (selectorText) {
      selectorText.textContent = value;
    }

    // Store preference
    localStorage.setItem(`destinova_${type}`, value);

    // Track change
    this.trackEvent(`${type}_changed`, { value });

    // Show notification
    const message = type === 'language' 
      ? `Language changed to ${value}`
      : `Currency changed to ${value}`;
    this.showNotification(message, 'success');

    // Reload page if needed (implement actual i18n/currency conversion)
    // setTimeout(() => window.location.reload(), 1000);
  },

  /**
   * ===================================================================
   * SMOOTH SCROLL FOR FOOTER LINKS
   * ===================================================================
   */
  initSmoothScrollLinks() {
    const footerLinks = document.querySelectorAll('.footer-nav-link[href^="#"]');
    
    footerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
            this.smoothScrollTo(offsetTop, 600);
            
            // Update URL without triggering page jump
            history.pushState(null, '', href);
          }
        }
      });
    });
  },

  /**
   * ===================================================================
   * PHONE NUMBER COPY FEATURE
   * ===================================================================
   */
  initPhoneCopyFeature() {
    const phoneLink = document.querySelector('.support-badge-phone');
    if (!phoneLink) return;

    phoneLink.addEventListener('click', (e) => {
      e.preventDefault();
      const phoneNumber = phoneLink.textContent.trim();
      
      // Copy to clipboard
      navigator.clipboard.writeText(phoneNumber).then(() => {
        this.showNotification(`📋 Phone number copied: ${phoneNumber}`, 'success');
        this.trackEvent('phone_copied', { number: phoneNumber });
      }).catch(() => {
        this.showNotification('Unable to copy. Please try manually.', 'error');
      });
    });
  },

  /**
   * ===================================================================
   * ACCESSIBILITY ENHANCEMENTS
   * ===================================================================
   */
  initAccessibility() {
    // Add ARIA labels to icon-only elements
    const socialIcons = document.querySelectorAll('.footer-social-icon');
    socialIcons.forEach((icon, index) => {
      const platforms = ['Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'YouTube'];
      if (!icon.getAttribute('aria-label')) {
        icon.setAttribute('aria-label', `Visit our ${platforms[index]} page`);
      }
      icon.setAttribute('role', 'link');
    });

    // Keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll(
      '.footer-nav-link, .footer-social-icon, .footer-app-badge, .footer-route-link'
    );
    
    interactiveElements.forEach(element => {
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    });

    // Screen reader announcements
    this.createLiveRegion();
  },

  // Create ARIA live region for dynamic announcements
  createLiveRegion() {
    if (!document.getElementById('footer-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'footer-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
  },

  // Announce message to screen readers
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('footer-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  },

  /**
   * ===================================================================
   * ANALYTICS & TRACKING
   * ===================================================================
   */
  initAnalytics() {
    if (!this.config.analyticsEnabled) return;

    // Track footer engagement time
    let engagementStartTime = null;
    const footer = document.querySelector('.destinova-footer');

    const footerEngagementObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            engagementStartTime = Date.now();
          } else if (engagementStartTime) {
            const engagementTime = Date.now() - engagementStartTime;
            this.trackEvent('footer_engagement', {
              duration_seconds: Math.round(engagementTime / 1000)
            });
            engagementStartTime = null;
          }
        });
      },
      { threshold: 0.5 }
    );

    if (footer) {
      footerEngagementObserver.observe(footer);
    }

    // Track link clicks
    const allFooterLinks = document.querySelectorAll('.footer-nav-link, .footer-route-link');
    allFooterLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.trackEvent('footer_link_click', {
          text: link.textContent.trim(),
          url: link.getAttribute('href'),
          category: link.closest('.footer-nav-column')?.querySelector('.footer-nav-heading')?.textContent || 'Unknown'
        });
      });
    });
  },

  // Track custom events
  trackEvent(eventName, eventData = {}) {
    if (!this.config.analyticsEnabled) return;

    // Log to console in development
    console.log('[Analytics]', eventName, eventData);

    // Send to analytics service
    // Example integrations:
    
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('trackCustom', eventName, eventData);
    }

    // Custom analytics endpoint
    /*
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: eventName, data: eventData, timestamp: new Date().toISOString() })
    });
    */
  },

  /**
   * ===================================================================
   * RESPONSIVE HANDLERS
   * ===================================================================
   */
  initResponsiveHandlers() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  },

  handleResize() {
    const width = window.innerWidth;
    
    // Close dropdowns on resize
    if (this.state.activeDropdown) {
      this.closeDropdown();
    }

    // Log viewport change
    this.trackEvent('viewport_resized', {
      width,
      device_type: width < 768 ? 'mobile' : width < 1200 ? 'tablet' : 'desktop'
    });
  },

  /**
   * ===================================================================
   * UTILITY FUNCTIONS
   * ===================================================================
   */

  // Smooth scroll to position
  smoothScrollTo(targetPosition, duration = 600) {
    const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    const easeInOutQuad = (t) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const scroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easing = easeInOutQuad(progress);
      
      window.scrollTo(0, startPosition + distance * easing);

      if (progress < 1) {
        requestAnimationFrame(scroll);
      }
    };

    requestAnimationFrame(scroll);
  },

  // Debounce function
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  // Show notification toast
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.footer-notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `footer-notification footer-notification-${type}`;
    notification.textContent = message;

    // Styles
    Object.assign(notification.style, {
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%) translateY(100px)',
      padding: '16px 24px',
      background: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
      color: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      fontFamily: "'Poppins', sans-serif",
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '10000',
      maxWidth: '90%',
      textAlign: 'center',
      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease'
    });

    document.body.appendChild(notification);

    // Announce to screen readers
    this.announceToScreenReader(message);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Auto remove after 4 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => notification.remove(), 400);
    }, 4000);
  }
};

// Auto-initialize when script loads
DestinovaFooter.init();

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DestinovaFooter;
}
