/* ===================================
   BOOKING PROCESS SECTION - JAVASCRIPT
   Animations and interactions
   =================================== */

(function() {
  'use strict';

  // =========================
  // 1. INITIALIZATION
  // =========================

  function initBookingProcess() {
    initScrollAnimations();
    initStepNumberCounters();
    initCTAButtonRipple();
    initAccessibility();
  }

  // =========================
  // 2. SCROLL ANIMATIONS
  // =========================

  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          
          // Animate progress line and airplane
          setTimeout(() => {
            const progressIndicator = section.querySelector('.progress-indicator');
            const airplane = section.querySelector('.airplane-traveler');
            
            if (progressIndicator) {
              progressIndicator.classList.add('animate');
            }
            
            if (airplane) {
              airplane.classList.add('animate');
            }
          }, 300);

          // Animate step cards sequentially
          const stepCards = section.querySelectorAll('.step-card');
          stepCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in');
              
              // Trigger step number counter when card animates in
              const stepNumber = card.querySelector('.step-number-overlay');
              if (stepNumber) {
                animateStepNumber(stepNumber, index + 1);
              }
            }, 500 + (index * 300));
          });

          // Unobserve after animation
          observer.unobserve(section);
        }
      });
    }, observerOptions);

    const section = document.querySelector('.booking-process-section');
    if (section) {
      observer.observe(section);
    }
  }

  // =========================
  // 3. STEP NUMBER COUNTER
  // =========================

  function animateStepNumber(element, targetNumber) {
    const duration = 1000; // 1 second
    const startTime = performance.now();
    const startRotation = 0;
    const endRotation = 360;

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      // Update number
      const currentNumber = Math.floor(easedProgress * targetNumber);
      const paddedNumber = currentNumber.toString().padStart(2, '0');
      element.textContent = paddedNumber;
      
      // Update rotation
      const currentRotation = startRotation + (easedProgress * endRotation);
      element.style.transform = `rotate(${currentRotation}deg) scale(${1 + (Math.sin(easedProgress * Math.PI) * 0.2)})`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Reset transform but keep final number
        element.style.transform = 'rotate(0deg) scale(1)';
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // =========================
  // 4. STEP NUMBER COUNTERS FOR ALL CARDS
  // =========================

  function initStepNumberCounters() {
    // This function is now called per card during scroll animation
    // See initScrollAnimations above
  }

  // =========================
  // 5. CTA BUTTON RIPPLE EFFECT
  // =========================

  function initCTAButtonRipple() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
      ctaButton.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Calculate position
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Add to button
        this.appendChild(ripple);
        
        // Remove after animation
        setTimeout(() => {
          ripple.remove();
        }, 600);
        
        console.log('CTA Button clicked: Start Searching Flights');
      });
    }
  }

  // =========================
  // 6. STEP CARD INTERACTIONS
  // =========================

  function initStepCardInteractions() {
    const stepCards = document.querySelectorAll('.step-card');
    
    stepCards.forEach((card, index) => {
      // Log hover events for analytics
      card.addEventListener('mouseenter', () => {
        console.log(`Step ${index + 1} card hovered`);
      });

      // Make cards keyboard accessible
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'article');
      
      // Add keyboard interaction
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          // Could trigger a modal or more info
          console.log(`Step ${index + 1} card activated via keyboard`);
        }
      });
    });
  }

  // =========================
  // 7. AIRPLANE PATH ANIMATION REFINEMENT
  // =========================

  function refineAirplaneAnimation() {
    const airplane = document.querySelector('.airplane-traveler');
    
    if (airplane) {
      // Add slight wobble effect during flight
      airplane.addEventListener('transitionstart', function() {
        let wobbleCount = 0;
        const maxWobbles = 5;
        
        const wobbleInterval = setInterval(() => {
          if (wobbleCount >= maxWobbles) {
            clearInterval(wobbleInterval);
            this.style.transform = this.style.transform.replace(/translateY\([^)]+\)/, '');
            return;
          }
          
          const wobble = Math.sin(wobbleCount * Math.PI) * 3;
          const currentTransform = this.style.transform || '';
          
          if (currentTransform.includes('translateY')) {
            this.style.transform = currentTransform.replace(/translateY\([^)]+\)/, `translateY(${wobble}px)`);
          } else {
            this.style.transform = `${currentTransform} translateY(${wobble}px)`;
          }
          
          wobbleCount++;
        }, 500);
      });
    }
  }

  // =========================
  // 8. PROGRESS LINE MILESTONE MARKERS
  // =========================

  function addProgressMilestones() {
    const connectingPath = document.querySelector('.connecting-path');
    
    if (connectingPath && window.innerWidth >= 1024) {
      // Add milestone dots at 33% and 66%
      const milestones = [33, 66];
      
      milestones.forEach(percent => {
        const dot = document.createElement('div');
        dot.style.cssText = `
          position: absolute;
          top: 50%;
          left: ${percent}%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background: #E5CBAF;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(29, 94, 51, 0.2);
          z-index: 2;
        `;
        connectingPath.appendChild(dot);
      });
    }
  }

  // =========================
  // 9. FEATURE ICONS ANIMATION
  // =========================

  function initFeatureIconAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const features = entry.target.querySelectorAll('.feature-item');
          
          features.forEach((feature, index) => {
            setTimeout(() => {
              feature.style.opacity = '0';
              feature.style.transform = 'translateX(-20px)';
              feature.style.transition = 'all 0.4s ease';
              
              setTimeout(() => {
                feature.style.opacity = '1';
                feature.style.transform = 'translateX(0)';
              }, 10);
            }, index * 100);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach(card => {
      observer.observe(card);
    });
  }

  // =========================
  // 10. TIME INDICATOR PULSE
  // =========================

  function initTimeIndicatorPulse() {
    const timeIndicators = document.querySelectorAll('.time-indicator');
    
    timeIndicators.forEach(indicator => {
      // Add pulse effect when card is hovered
      const card = indicator.closest('.step-card');
      
      if (card) {
        card.addEventListener('mouseenter', () => {
          indicator.style.transform = 'scale(1.05)';
          indicator.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
          indicator.style.transform = 'scale(1)';
        });
      }
    });
  }

  // =========================
  // 11. ACCESSIBILITY
  // =========================

  function initAccessibility() {
    // Add ARIA labels to animated elements
    const progressIndicator = document.querySelector('.progress-indicator');
    if (progressIndicator) {
      progressIndicator.setAttribute('role', 'progressbar');
      progressIndicator.setAttribute('aria-label', 'Booking process progress');
      progressIndicator.setAttribute('aria-valuemin', '0');
      progressIndicator.setAttribute('aria-valuemax', '100');
      progressIndicator.setAttribute('aria-valuenow', '0');
      
      // Update aria-valuenow when animation completes
      setTimeout(() => {
        progressIndicator.setAttribute('aria-valuenow', '100');
      }, 2500);
    }

    // Add proper list structure for screen readers
    const journeyContainer = document.querySelector('.journey-path-container');
    if (journeyContainer) {
      journeyContainer.setAttribute('role', 'list');
      journeyContainer.setAttribute('aria-label', 'Booking process steps');
    }

    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
      card.setAttribute('role', 'listitem');
      card.setAttribute('aria-label', `Step ${index + 1} of 3`);
    });

    // Add alt text context to decorative elements
    const airplane = document.querySelector('.airplane-traveler');
    if (airplane) {
      airplane.setAttribute('aria-hidden', 'true');
    }

    const floatingShapes = document.querySelectorAll('.floating-shape');
    floatingShapes.forEach(shape => {
      shape.setAttribute('aria-hidden', 'true');
    });
  }

  // =========================
  // 12. LAZY LOAD OPTIMIZATION
  // =========================

  function optimizePerformance() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      const floatingShapes = document.querySelectorAll('.floating-shape');
      floatingShapes.forEach(shape => {
        shape.style.display = 'none';
      });
    }

    // Pause animations when section is out of view
    const section = document.querySelector('.booking-process-section');
    
    if (section) {
      const pauseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // Pause animations
            section.style.animationPlayState = 'paused';
          } else {
            // Resume animations
            section.style.animationPlayState = 'running';
          }
        });
      }, { threshold: 0 });

      pauseObserver.observe(section);
    }
  }

  // =========================
  // 13. RESPONSIVE HELPERS
  // =========================

  function handleResponsiveAnimations() {
    let isTabletOrMobile = window.innerWidth < 1024;
    
    window.addEventListener('resize', () => {
      const nowTabletOrMobile = window.innerWidth < 1024;
      
      if (isTabletOrMobile !== nowTabletOrMobile) {
        isTabletOrMobile = nowTabletOrMobile;
        
        // Reinitialize animations for new layout
        const section = document.querySelector('.booking-process-section');
        if (section) {
          // Reset animation classes
          const progressIndicator = section.querySelector('.progress-indicator');
          const airplane = section.querySelector('.airplane-traveler');
          const stepCards = section.querySelectorAll('.step-card');
          
          if (progressIndicator) progressIndicator.classList.remove('animate');
          if (airplane) airplane.classList.remove('animate');
          stepCards.forEach(card => card.classList.remove('animate-in'));
          
          // Trigger reinitialize if in view
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            initScrollAnimations();
          }
        }
      }
    });
  }

  // =========================
  // 14. ANALYTICS TRACKING
  // =========================

  function initAnalyticsTracking() {
    // Track when users interact with steps
    const stepCards = document.querySelectorAll('.step-card');
    
    stepCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        console.log(`Analytics: Step ${index + 1} card clicked`);
        // In production, send to analytics service:
        // analytics.track('booking_process_step_clicked', { step: index + 1 });
      });
    });

    // Track CTA button clicks
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
      ctaButton.addEventListener('click', () => {
        console.log('Analytics: Booking process CTA clicked');
        // In production:
        // analytics.track('booking_process_cta_clicked');
      });
    }
  }

  // =========================
  // 15. INITIALIZE ALL ON DOM READY
  // =========================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initBookingProcess();
      initStepCardInteractions();
      refineAirplaneAnimation();
      addProgressMilestones();
      initFeatureIconAnimations();
      initTimeIndicatorPulse();
      optimizePerformance();
      handleResponsiveAnimations();
      initAnalyticsTracking();
    });
  } else {
    initBookingProcess();
    initStepCardInteractions();
    refineAirplaneAnimation();
    addProgressMilestones();
    initFeatureIconAnimations();
    initTimeIndicatorPulse();
    optimizePerformance();
    handleResponsiveAnimations();
    initAnalyticsTracking();
  }

  // =========================
  // 16. EXPORT FOR TESTING
  // =========================

  window.BookingProcess = {
    init: initBookingProcess,
    animateStepNumber: animateStepNumber,
    addProgressMilestones: addProgressMilestones
  };

})();
