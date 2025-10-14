/* ===================================================================
   PAYMENT PARTNERS & SECURITY SECTION - JAVASCRIPT
   Handles animations, interactions, and accessibility
   =================================================================== */

(function() {
  'use strict';

  /**
   * Main initialization function
   */
  function initPaymentSecuritySection() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  /**
   * Initialize all features
   */
  function init() {
    const section = document.querySelector('.payment-security-section');
    if (!section) {
      console.warn('Payment Security section not found');
      return;
    }

    initScrollAnimations();
    initPaymentLogoInteractions();
    initSecurityCardInteractions();
    initTrustBadgeTooltips();
    initAccessibility();
    initPerformanceOptimizations();
    initAnalytics();
  }

  /* ===================================================================
     SCROLL ANIMATIONS
     =================================================================== */

  /**
   * Initialize scroll-triggered animations with IntersectionObserver
   */
  function initScrollAnimations() {
    const section = document.querySelector('.payment-security-section');
    if (!section) return;

    const logos = section.querySelectorAll('.payment-logo-wrapper');
    const securityCards = section.querySelectorAll('.security-feature-card');

    // Create observer for logos
    const logoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            // Animation handled by CSS, just trigger by adding to viewport
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all logos
    logos.forEach((logo) => logoObserver.observe(logo));

    // Create observer for security cards
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            // Animation handled by CSS
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all security cards
    securityCards.forEach((card) => cardObserver.observe(card));
  }

  /* ===================================================================
     PAYMENT LOGO INTERACTIONS
     =================================================================== */

  /**
   * Handle payment logo hover and click interactions
   */
  function initPaymentLogoInteractions() {
    const logos = document.querySelectorAll('.payment-logo-wrapper');

    logos.forEach((logo) => {
      // Add keyboard accessibility
      logo.setAttribute('tabindex', '0');
      logo.setAttribute('role', 'button');

      // Handle keyboard navigation
      logo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleLogoClick(logo);
        }
      });

      // Handle click
      logo.addEventListener('click', () => {
        handleLogoClick(logo);
      });

      // Track hover for analytics
      logo.addEventListener('mouseenter', () => {
        const logoName = logo.getAttribute('aria-label') || 'Unknown';
        trackEvent('payment_logo_hover', { logo: logoName });
      });
    });
  }

  /**
   * Handle logo click - show additional info or navigate
   * @param {HTMLElement} logo - The logo element clicked
   */
  function handleLogoClick(logo) {
    const logoName = logo.getAttribute('aria-label') || 'Unknown';
    
    // Track click
    trackEvent('payment_logo_click', { logo: logoName });

    // Show tooltip or navigate to payment info
    // For now, just log (can be enhanced with modal or tooltip)
    console.log(`Payment option selected: ${logoName}`);

    // Optional: Add pulse effect
    logo.style.animation = 'none';
    setTimeout(() => {
      logo.style.animation = '';
    }, 10);
  }

  /* ===================================================================
     SECURITY CARD INTERACTIONS
     =================================================================== */

  /**
   * Handle security feature card interactions
   */
  function initSecurityCardInteractions() {
    const cards = document.querySelectorAll('.security-feature-card');

    cards.forEach((card) => {
      // Add keyboard accessibility
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');

      // Handle keyboard navigation
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSecurityCardClick(card);
        }
      });

      // Handle click
      card.addEventListener('click', () => {
        handleSecurityCardClick(card);
      });

      // Pause icon pulse animation on hover
      card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.security-icon-container svg');
        if (icon) {
          icon.style.animationPlayState = 'paused';
        }
      });

      card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.security-icon-container svg');
        if (icon) {
          icon.style.animationPlayState = 'running';
        }
      });
    });
  }

  /**
   * Handle security card click
   * @param {HTMLElement} card - The card element clicked
   */
  function handleSecurityCardClick(card) {
    const heading = card.querySelector('.security-feature-heading');
    const featureName = heading ? heading.textContent : 'Unknown';

    // Track click
    trackEvent('security_feature_click', { feature: featureName });

    // Optional: Expand card or show more details
    console.log(`Security feature selected: ${featureName}`);

    // Add temporary highlight effect
    card.style.background = 'rgba(229, 203, 175, 0.12)';
    setTimeout(() => {
      card.style.background = '';
    }, 300);
  }

  /* ===================================================================
     TRUST BADGE TOOLTIPS
     =================================================================== */

  /**
   * Initialize trust badge tooltip interactions
   */
  function initTrustBadgeTooltips() {
    const badges = document.querySelectorAll('.trust-badge');

    badges.forEach((badge) => {
      // Add keyboard accessibility
      badge.setAttribute('tabindex', '0');

      // Handle keyboard navigation
      badge.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const tooltip = badge.querySelector('.trust-badge-tooltip');
          if (tooltip) {
            // Toggle tooltip visibility for keyboard users
            tooltip.style.opacity = tooltip.style.opacity === '1' ? '0' : '1';
          }
        }
      });

      // Track badge interactions
      badge.addEventListener('click', () => {
        const badgeText = badge.textContent.trim();
        trackEvent('trust_badge_click', { badge: badgeText });
      });
    });
  }

  /* ===================================================================
     ACCESSIBILITY ENHANCEMENTS
     =================================================================== */

  /**
   * Enhance accessibility features
   */
  function initAccessibility() {
    const section = document.querySelector('.payment-security-section');
    if (!section) return;

    // Set section ARIA label
    section.setAttribute('aria-label', 'Payment partners and security information');

    // Set ARIA labels for payment logos
    const logos = section.querySelectorAll('.payment-logo-wrapper');
    logos.forEach((logo) => {
      if (!logo.hasAttribute('aria-label')) {
        const img = logo.querySelector('img');
        if (img && img.alt) {
          logo.setAttribute('aria-label', `Payment option: ${img.alt}`);
        }
      }
    });

    // Set ARIA labels for security cards
    const securityCards = section.querySelectorAll('.security-feature-card');
    securityCards.forEach((card) => {
      const heading = card.querySelector('.security-feature-heading');
      const description = card.querySelector('.security-feature-description');
      
      if (heading) {
        const ariaLabel = `${heading.textContent}. ${description ? description.textContent : ''}`;
        card.setAttribute('aria-label', ariaLabel);
      }
    });

    // Add live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'payment-security-live-region';
    section.appendChild(liveRegion);

    // Announce when section becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !section.dataset.announced) {
            section.dataset.announced = 'true';
            liveRegion.textContent = 'Payment partners and security features section is now visible';
            setTimeout(() => {
              liveRegion.textContent = '';
            }, 1000);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(section);
  }

  /* ===================================================================
     PERFORMANCE OPTIMIZATIONS
     =================================================================== */

  /**
   * Optimize performance for low-end devices
   */
  function initPerformanceOptimizations() {
    const section = document.querySelector('.payment-security-section');
    if (!section) return;

    // Detect low-end device
    const isLowEndDevice =
      navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

    if (isLowEndDevice) {
      // Disable decorative elements
      const decorations = section.querySelectorAll(
        '.floating-lock-decoration, .security-badge-watermark'
      );
      decorations.forEach((el) => {
        el.style.display = 'none';
      });

      // Simplify animations
      const style = document.createElement('style');
      style.textContent = `
        .payment-security-section .payment-logo-wrapper,
        .payment-security-section .security-feature-card {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Lazy load payment logo images
    const logos = section.querySelectorAll('.payment-logo-wrapper img');
    if ('loading' in HTMLImageElement.prototype) {
      logos.forEach((img) => {
        img.loading = 'lazy';
      });
    } else {
      // Fallback for browsers that don't support lazy loading
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              imageObserver.unobserve(img);
            }
          }
        });
      });

      logos.forEach((img) => {
        if (img.dataset.src) {
          imageObserver.observe(img);
        }
      });
    }

    // Pause animations when section is out of view
    const pauseObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const animatedElements = section.querySelectorAll(
            '.security-icon-container svg, .floating-lock-decoration'
          );

          animatedElements.forEach((el) => {
            if (entry.isIntersecting) {
              el.style.animationPlayState = 'running';
            } else {
              el.style.animationPlayState = 'paused';
            }
          });
        });
      },
      { threshold: 0 }
    );

    pauseObserver.observe(section);
  }

  /* ===================================================================
     ANALYTICS TRACKING
     =================================================================== */

  /**
   * Track user interactions for analytics
   * @param {string} eventName - Name of the event
   * @param {Object} eventData - Additional event data
   */
  function trackEvent(eventName, eventData = {}) {
    // Log to console for development
    console.log(`[Analytics] ${eventName}`, eventData);

    // Send to analytics platform (Google Analytics, Mixpanel, etc.)
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }

    if (window.mixpanel) {
      window.mixpanel.track(eventName, eventData);
    }

    // Custom analytics endpoint
    if (window.destinovaAnalytics) {
      window.destinovaAnalytics.track(eventName, eventData);
    }
  }

  /**
   * Initialize analytics tracking for section
   */
  function initAnalytics() {
    const section = document.querySelector('.payment-security-section');
    if (!section) return;

    // Track section view
    const viewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !section.dataset.tracked) {
            section.dataset.tracked = 'true';
            trackEvent('payment_security_section_view', {
              timestamp: new Date().toISOString(),
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    viewObserver.observe(section);

    // Track time spent in section
    let timeSpent = 0;
    let interval = null;

    const timeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          interval = setInterval(() => {
            timeSpent++;
          }, 1000);
        } else {
          if (interval) {
            clearInterval(interval);
            if (timeSpent > 0) {
              trackEvent('payment_security_section_time_spent', {
                seconds: timeSpent,
              });
              timeSpent = 0;
            }
          }
        }
      });
    });

    timeObserver.observe(section);
  }

  /* ===================================================================
     RESPONSIVE BEHAVIOR
     =================================================================== */

  /**
   * Handle responsive layout changes
   */
  function handleResponsiveChanges() {
    let currentBreakpoint = getBreakpoint();

    window.addEventListener('resize', debounce(() => {
      const newBreakpoint = getBreakpoint();
      
      if (newBreakpoint !== currentBreakpoint) {
        currentBreakpoint = newBreakpoint;
        
        // Reinitialize features if needed
        console.log(`Breakpoint changed to: ${newBreakpoint}`);
        
        trackEvent('breakpoint_change', { breakpoint: newBreakpoint });
      }
    }, 250));
  }

  /**
   * Get current breakpoint
   * @returns {string} Current breakpoint name
   */
  function getBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1200) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }

  /**
   * Debounce function for performance
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
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

  /* ===================================================================
     PAYMENT LOGO DATA
     =================================================================== */

  /**
   * Payment partner information (for tooltips/modals)
   */
  const paymentPartnerData = {
    visa: {
      name: 'Visa',
      acceptedCountries: '200+ countries',
      processingTime: 'Instant',
    },
    mastercard: {
      name: 'Mastercard',
      acceptedCountries: '210+ countries',
      processingTime: 'Instant',
    },
    amex: {
      name: 'American Express',
      acceptedCountries: '160+ countries',
      processingTime: 'Instant',
    },
    rupay: {
      name: 'RuPay',
      acceptedCountries: 'India, UAE, Singapore',
      processingTime: 'Instant',
    },
    paytm: {
      name: 'Paytm',
      acceptedCountries: 'India',
      processingTime: 'Instant',
    },
    phonepe: {
      name: 'PhonePe',
      acceptedCountries: 'India',
      processingTime: 'Instant',
    },
    googlepay: {
      name: 'Google Pay',
      acceptedCountries: 'Global',
      processingTime: 'Instant',
    },
    paypal: {
      name: 'PayPal',
      acceptedCountries: '200+ countries',
      processingTime: '1-3 business days',
    },
    upi: {
      name: 'UPI',
      acceptedCountries: 'India',
      processingTime: 'Instant',
    },
    netbanking: {
      name: 'Net Banking',
      acceptedCountries: 'India',
      processingTime: 'Instant',
    },
    emi: {
      name: 'EMI Options',
      acceptedCountries: 'India',
      processingTime: '3-24 months',
    },
    crypto: {
      name: 'Cryptocurrency',
      acceptedCountries: 'Select countries',
      processingTime: '10-30 minutes',
    },
  };

  /* ===================================================================
     INITIALIZATION
     =================================================================== */

  // Initialize section
  initPaymentSecuritySection();

  // Handle responsive changes
  handleResponsiveChanges();

  // Export for external use if needed
  window.PaymentSecuritySection = {
    init: initPaymentSecuritySection,
    trackEvent: trackEvent,
    paymentPartnerData: paymentPartnerData,
  };
})();
