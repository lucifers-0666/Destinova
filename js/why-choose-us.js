/* ===================================
   WHY CHOOSE US SECTION - JAVASCRIPT
   Counter animations and interactions
   =================================== */

(function() {
  'use strict';

  // =========================
  // 1. INITIALIZATION
  // =========================

  function initWhyChooseUs() {
    initScrollAnimations();
    initCounterAnimations();
    initTrustBadgeInteractions();
    initTestimonialInteractions();
    initAccessibility();
  }

  // =========================
  // 2. SCROLL ANIMATIONS
  // =========================

  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class
          entry.target.classList.add('animate-in');
          
          // Trigger counter animation for stat cards
          if (entry.target.classList.contains('stat-card')) {
            const numberElement = entry.target.querySelector('.stat-number');
            if (numberElement && !numberElement.classList.contains('counted')) {
              animateCounter(numberElement);
            }
          }
        }
      });
    }, observerOptions);

    // Observe stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
      observer.observe(card);
    });

    // Observe trust badges
    document.querySelectorAll('.trust-badge').forEach(badge => {
      observer.observe(badge);
    });

    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card-featured, .testimonial-card-secondary').forEach(card => {
      observer.observe(card);
    });

    // Observe review badge
    const reviewBadge = document.querySelector('.review-platform-badge');
    if (reviewBadge) {
      observer.observe(reviewBadge);
    }
  }

  // =========================
  // 3. COUNTER ANIMATIONS
  // =========================

  function animateCounter(element) {
    // Mark as counted to prevent re-animation
    element.classList.add('counted', 'counting');

    // Get the target value from data attribute or text content
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasCurrency = text.includes('₹') || text.includes('Cr');

    // Extract the numeric value
    let targetValue;
    if (hasCurrency) {
      // Handle currency format like ₹2Cr+
      const numericPart = text.replace(/[₹Cr+]/g, '').trim();
      targetValue = parseFloat(numericPart);
    } else {
      targetValue = parseFloat(text.replace(/[+%M]/g, ''));
    }

    // If we can't parse a number, skip animation
    if (isNaN(targetValue)) {
      return;
    }

    // Animation parameters
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;

    // Easing function (ease-out)
    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    // Animation frame function
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = startValue + (targetValue - startValue) * easedProgress;

      // Format the number based on the original format
      let displayValue;
      if (hasCurrency) {
        displayValue = `₹${currentValue.toFixed(0)}Cr`;
      } else if (hasPercent) {
        displayValue = `${Math.round(currentValue)}`;
      } else if (text.includes('M')) {
        displayValue = `${currentValue.toFixed(1)}M`;
      } else {
        displayValue = Math.round(currentValue).toString();
      }

      // Update the element
      const suffix = element.querySelector('.stat-suffix');
      if (suffix) {
        // Update only the number part, keeping the suffix
        const numberNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (numberNode) {
          numberNode.textContent = displayValue;
        }
      } else {
        // Update the entire content
        if (hasPlus) {
          element.innerHTML = displayValue + '<span class="stat-suffix">+</span>';
        } else if (hasPercent) {
          element.innerHTML = displayValue + '<span class="stat-suffix">%</span>';
        } else {
          element.textContent = displayValue;
        }
      }

      // Continue animation or finish
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Remove counting class when done
        setTimeout(() => {
          element.classList.remove('counting');
        }, 100);
      }
    }

    // Start the animation
    requestAnimationFrame(updateCounter);

    // Announce to screen readers
    announceToScreenReader(element, text);
  }

  // =========================
  // 4. TRUST BADGE INTERACTIONS
  // =========================

  function initTrustBadgeInteractions() {
    const badges = document.querySelectorAll('.trust-badge');

    badges.forEach(badge => {
      // Click handler to show certification details (optional modal)
      badge.addEventListener('click', (e) => {
        const badgeText = badge.querySelector('.trust-badge-text').textContent;
        console.log(`Trust badge clicked: ${badgeText}`);
        // In a real implementation, this would open a modal with certification details
        showTooltip(badge, 'Verified certification');
      });

      // Keyboard navigation
      badge.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          badge.click();
        }
      });
    });
  }

  // =========================
  // 5. TESTIMONIAL INTERACTIONS
  // =========================

  function initTestimonialInteractions() {
    const testimonials = document.querySelectorAll('.testimonial-card-featured, .testimonial-card-secondary');

    testimonials.forEach(testimonial => {
      // Optional: Click to expand full review
      testimonial.style.cursor = 'pointer';
      
      testimonial.addEventListener('click', (e) => {
        // Don't trigger if clicking on avatar or other interactive elements
        if (e.target.closest('.testimonial-avatar')) return;

        const authorName = testimonial.querySelector('.testimonial-author-name').textContent;
        const reviewText = testimonial.querySelector('.testimonial-text').textContent;
        
        console.log(`Testimonial clicked: ${authorName}`);
        // In a real implementation, this would open a modal with full review
      });

      // Keyboard accessibility
      testimonial.setAttribute('tabindex', '0');
      testimonial.setAttribute('role', 'article');
      
      testimonial.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          testimonial.click();
        }
      });
    });
  }

  // =========================
  // 6. STAT CARD TOOLTIPS
  // =========================

  function showTooltip(element, message) {
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: #1d5e33;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    element.style.position = 'relative';
    element.appendChild(tooltip);

    // Fade in
    setTimeout(() => {
      tooltip.style.opacity = '1';
    }, 10);

    // Remove after 2 seconds
    setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 300);
    }, 2000);
  }

  // =========================
  // 7. ACCESSIBILITY
  // =========================

  function initAccessibility() {
    // Set ARIA attributes on stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(number => {
      const statCard = number.closest('.stat-card');
      if (statCard) {
        number.setAttribute('aria-live', 'polite');
        number.setAttribute('aria-atomic', 'true');
      }
    });

    // Add proper ARIA labels to testimonials
    const testimonials = document.querySelectorAll('.testimonial-card-featured, .testimonial-card-secondary');
    testimonials.forEach((testimonial, index) => {
      const authorName = testimonial.querySelector('.testimonial-author-name');
      if (authorName) {
        const name = authorName.textContent.trim();
        testimonial.setAttribute('aria-label', `Testimonial from ${name}`);
      }
    });

    // Add ARIA labels to icons
    const icons = document.querySelectorAll('.trust-badge-icon, .testimonial-star, .review-platform-icon');
    icons.forEach(icon => {
      icon.setAttribute('aria-hidden', 'true');
    });

    // Add keyboard navigation hints
    const interactiveElements = document.querySelectorAll('.trust-badge, .testimonial-card-featured, .testimonial-card-secondary');
    interactiveElements.forEach(element => {
      element.setAttribute('role', 'button');
      element.setAttribute('tabindex', '0');
    });
  }

  function announceToScreenReader(element, finalValue) {
    // Update aria-live region after counter animation
    setTimeout(() => {
      const statCard = element.closest('.stat-card');
      if (statCard) {
        const label = statCard.querySelector('.stat-label');
        const description = statCard.querySelector('.stat-description');
        
        if (label) {
          const announcement = `${finalValue} ${label.textContent}`;
          element.setAttribute('aria-label', announcement);
        }
      }
    }, 2100); // After animation completes
  }

  // =========================
  // 8. CTA BUTTON INTERACTION
  // =========================

  function initCTAButton() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
      ctaButton.addEventListener('click', (e) => {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = ctaButton.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          top: ${y}px;
          left: ${x}px;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;

        ctaButton.style.position = 'relative';
        ctaButton.style.overflow = 'hidden';
        ctaButton.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);

        console.log('CTA Button clicked: Start Your Journey');
      });
    }
  }

  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // =========================
  // 9. LAZY LOAD AVATARS
  // =========================

  function initLazyLoadAvatars() {
    const avatars = document.querySelectorAll('.testimonial-avatar');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });

      avatars.forEach(avatar => {
        imageObserver.observe(avatar);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      avatars.forEach(avatar => {
        if (avatar.dataset.src) {
          avatar.src = avatar.dataset.src;
        }
      });
    }
  }

  // =========================
  // 10. INITIALIZE ON DOM READY
  // =========================

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhyChooseUs);
  } else {
    initWhyChooseUs();
  }

  // Initialize CTA button separately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCTAButton);
  } else {
    initCTAButton();
  }

  // Initialize lazy loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoadAvatars);
  } else {
    initLazyLoadAvatars();
  }

  // =========================
  // 11. EXPORT FOR TESTING
  // =========================

  // Expose functions for testing (optional)
  window.WhyChooseUs = {
    init: initWhyChooseUs,
    animateCounter: animateCounter,
    showTooltip: showTooltip
  };

})();
