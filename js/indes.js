// Floating search Bar Js Start here
    // Background Slider
    
    let slideIndex = 0;
    const slides = document.querySelectorAll('.bg-slide');
    
    function changeSlide() {
      slides[slideIndex].classList.remove('active');
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex].classList.add('active');
    }
    
    setInterval(changeSlide, 6000);
    
    // Close Promo Banner - FIX CORNERS
    document.getElementById('closeBanner').addEventListener('click', function() {
      const promoBanner = document.getElementById('promoBanner');
      const searchCard = document.getElementById('searchCard');
      
      promoBanner.classList.add('hidden');
      searchCard.classList.add('promo-closed'); // Add class to round all corners
    });
    
    // Trip Tabs
    const tabs = document.querySelectorAll('.trip-tab');
    const indicator = document.querySelector('.trip-indicator');
    const returnBox = document.getElementById('returnBox');
    
    function updateIndicator(active) {
      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.height = `${active.offsetHeight}px`;
      indicator.style.left = `${active.offsetLeft}px`;
      indicator.style.top = `${active.offsetTop}px`;
    }
    
    updateIndicator(tabs[0]);
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        updateIndicator(this);
        
        if (this.getAttribute('data-type') === 'oneway') {
          returnBox.style.display = 'none';
        } else {
          returnBox.style.display = 'flex';
        }
      });
    });
    
    // Fare Chips
    document.querySelectorAll('.fare-chip-btn').forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.fare-chip-btn').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departInput').setAttribute('min', today);
    document.getElementById('returnInput').setAttribute('min', today);
    
    // Modal
    const modal = document.getElementById('passengersModal');
    const trigger = document.getElementById('passengersTrigger');
    const closeBtn = document.getElementById('modalClose');
    const doneBtn = document.getElementById('modalDone');
    
    let counts = { infants: 0, children: 0, adults: 1, seniors: 0 };
    let selectedClass = 'economy';
    
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.removeAttribute('hidden');
    });
    
    closeBtn.addEventListener('click', () => modal.setAttribute('hidden', 'hidden'));
    modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.setAttribute('hidden', 'hidden'));
    
    document.querySelectorAll('.counter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        const cat = this.getAttribute('data-cat');
        const display = document.getElementById(`${cat}Count`);
        let val = parseInt(display.textContent);
        
        if (action === 'inc') {
          val++;
        } else if (action === 'dec' && val > 0) {
          if (cat === 'adults' && val === 1) return;
          val--;
        }
        
        display.textContent = val;
        counts[cat] = val;
      });
    });
    
    document.querySelectorAll('.class-card').forEach(card => {
      card.addEventListener('click', function() {
        document.querySelectorAll('.class-card').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        selectedClass = this.getAttribute('data-class');
      });
    });
    
    doneBtn.addEventListener('click', () => {
      const total = counts.infants + counts.children + counts.adults + counts.seniors;
      let text = '';
      
      if (total === 1 && counts.adults === 1) {
        text = '1 Adult';
      } else {
        const parts = [];
        if (counts.infants > 0) parts.push(`${counts.infants} Infant${counts.infants > 1 ? 's' : ''}`);
        if (counts.children > 0) parts.push(`${counts.children} Child${counts.children > 1 ? 'ren' : ''}`);
        if (counts.adults > 0) parts.push(`${counts.adults} Adult${counts.adults > 1 ? 's' : ''}`);
        if (counts.seniors > 0) parts.push(`${counts.seniors} Senior${counts.seniors > 1 ? 's' : ''}`);
        text = parts.join(', ');
      }
      
      const classes = {
        'economy': 'Economy',
        'premium': 'Premium',
        'business': 'Business',
        'first': 'First Class'
      };
      
      text += `, ${classes[selectedClass]}`;
      document.getElementById('passengersText').textContent = text;
      
      modal.setAttribute('hidden', 'hidden');
    });
    
    // Form
    document.getElementById('searchForm').addEventListener('submit', function(e) {
      e.preventDefault();
      alert('✈️ Searching flights...');
    });
  
// floting search Bar Js End here

    // ============================================
// TRUST STATISTICS ANIMATED COUNTERS
// ============================================

(function() {
  'use strict';
  
  const trustBar = document.getElementById('trustBar');
  
  if (!trustBar) return;
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  let hasAnimated = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, observerOptions);
  
  observer.observe(trustBar);
  
  function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    statNumbers.forEach((element, index) => {
      const target = parseInt(element.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const delay = index * 200; // Stagger animation
      const increment = target / (duration / 16); // 60fps
      
      let current = 0;
      
      setTimeout(() => {
        const timer = setInterval(() => {
          current += increment;
          
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          
          // Format number
          if (target >= 1000) {
            element.textContent = Math.floor(current / 1000);
          } else {
            element.textContent = Math.floor(current);
          }
        }, 16);
      }, delay);
    });
  }
  
})();
// destination section js starts here
// ============================================
// AI RECOMMENDATIONS FILTER LOGIC
// ============================================

(function() {
  'use strict';
  
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.ai-destination-card');
  
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.getAttribute('data-filter');
      
      // Update active state
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      // Filter cards
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  
  // Heart icon toggle
  const heartIcons = document.querySelectorAll('.card-heart-icon');
  
  heartIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      icon.classList.toggle('saved');
      
      // Save to localStorage
      const card = icon.closest('.ai-destination-card');
      const destination = card.querySelector('.card-destination-title').textContent;
      
      let savedDestinations = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
      
      if (icon.classList.contains('saved')) {
        if (!savedDestinations.includes(destination)) {
          savedDestinations.push(destination);
        }
      } else {
        savedDestinations = savedDestinations.filter(d => d !== destination);
      }
      
      localStorage.setItem('savedDestinations', JSON.stringify(savedDestinations));
    });
  });
  
  // View Details buttons
  const viewButtons = document.querySelectorAll('.card-view-button');
  
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.ai-destination-card');
      const destination = card.querySelector('.card-destination-title').textContent;
      
      alert(`Viewing details for ${destination}...`);
      // window.location.href = `destination-details.html?name=${encodeURIComponent(destination)}`;
    });
  });
  
  // Load saved destinations on page load
  const savedDestinations = JSON.parse(localStorage.getItem('savedDestinations') || '[]');
  
  cards.forEach(card => {
    const destination = card.querySelector('.card-destination-title').textContent;
    const heartIcon = card.querySelector('.card-heart-icon');
    
    if (savedDestinations.includes(destination)) {
      heartIcon.classList.add('saved');
    }
  });
  
})();

// Add fadeInUp animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// ============================================
// ENHANCED TRENDING DESTINATIONS FUNCTIONALITY
// ============================================

(function() {
  'use strict';

  // View Toggle (Grid/Map)
  const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');
  const gridView = document.getElementById('gridView');
  const mapView = document.getElementById('mapView');

  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      
      // Update active state
      viewToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle views
      if (view === 'grid') {
        if (gridView) gridView.style.display = 'block';
        if (mapView) mapView.style.display = 'none';
      } else if (view === 'map') {
        if (gridView) gridView.style.display = 'none';
        if (mapView) mapView.style.display = 'block';
      }
    });
  });

  // Heart Icon Toggle (Save Destinations)
  const heartIcons = document.querySelectorAll('.trending-heart-icon');
  let savedTrendingDests = JSON.parse(localStorage.getItem('savedTrendingDestinations') || '[]');

  heartIcons.forEach(icon => {
    const destination = icon.dataset.destination;
    
    // Load saved state
    if (savedTrendingDests.includes(destination)) {
      icon.classList.add('saved');
    }

    icon.addEventListener('click', (e) => {
      e.preventDefault();
      icon.classList.toggle('saved');
      
      if (icon.classList.contains('saved')) {
        if (!savedTrendingDests.includes(destination)) {
          savedTrendingDests.push(destination);
        }
      } else {
        savedTrendingDests = savedTrendingDests.filter(d => d !== destination);
      }
      
      localStorage.setItem('savedTrendingDestinations', JSON.stringify(savedTrendingDests));
    });
  });

  // Quick View Button
  const quickViewBtns = document.querySelectorAll('.trending-quick-view-btn');
  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.trending-destination-card');
      const destName = card.querySelector('.trending-dest-name').textContent;
      alert(`Quick view for ${destName} - Opening detailed view...`);
      // window.location.href = `destination-details.html?name=${encodeURIComponent(destName)}`;
    });
  });

  // View All Destinations Button
  const viewAllBtn = document.querySelector('.trending-view-all-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      alert('Redirecting to destinations page...');
      // window.location.href = 'destinations.html';
    });
  }

})();


// destionation section js ends here


// how it
/* ===============================================
   HOW IT WORKS SECTION - JAVASCRIPT
   Modern Interactions & Animations
   =============================================== */

(function() {
  'use strict';

  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', initializeHowItWorks);

  function initializeHowItWorks() {
    // Initialize all components
    initAOS();
    initProgressLine();
    initCardTilt();
    initNumberCounter();
    initFeatureAnimation();
    initParallaxShapes();
    initIconRotation();
    initCardEntrance();
    initGradientAnimation();
    initButtonRipple();
    initSmoothScroll();
    initPerformanceOptimizations();
    initAccessibility();
    
    // Console branding
    consoleBranding();
  }

  /* ===============================================
     AOS (Animate On Scroll) Initialization
     =============================================== */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 0,
        disable: function() {
          return window.innerWidth < 768;
        },
        startEvent: 'DOMContentLoaded',
        initClassName: 'aos-init',
        animatedClassName: 'aos-animate',
        useClassNames: false,
        disableMutationObserver: false,
        debounceDelay: 50,
        throttleDelay: 99,
      });

      // Refresh AOS on dynamic content load
      window.addEventListener('load', function() {
        AOS.refresh();
      });
    }
  }

  /* ===============================================
     Progress Line Animation
     =============================================== */
  function initProgressLine() {
    const progressLine = document.querySelector('.animate-progress-line');
    const section = document.querySelector('.how-it-works-section');
    
    if (!progressLine || !section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            progressLine.style.width = '0%';
            setTimeout(() => {
              progressLine.style.transition = 'width 3s cubic-bezier(0.4, 0, 0.2, 1)';
              progressLine.style.width = '100%';
            }, 200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px' }
    );

    observer.observe(section);
  }

  /* ===============================================
     3D Card Tilt Effect
     =============================================== */
  function initCardTilt() {
    const cards = document.querySelectorAll('.step-card');
    
    if (window.innerWidth < 768) return; // Disable on mobile

    cards.forEach(card => {
      const cardElement = card.querySelector('div');
      if (!cardElement) return;

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('mouseenter', handleMouseEnter);

      function handleMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        cardElement.style.transform = `
          perspective(1000px) 
          rotateX(${-rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateY(-12px) 
          scale(1.02)
          translateZ(20px)
        `;
      }

      function handleMouseLeave() {
        cardElement.style.transform = '';
        cardElement.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }

      function handleMouseEnter() {
        cardElement.style.transition = 'none';
      }
    });
  }

  /* ===============================================
     Number Counter Animation
     =============================================== */
  function initNumberCounter() {
    const numberElements = document.querySelectorAll('.step-card .absolute span');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    numberElements.forEach(element => {
      observer.observe(element);
    });

    function animateNumber(element) {
      const targetText = element.textContent.trim();
      const targetNumber = parseInt(targetText);
      
      if (isNaN(targetNumber)) return;

      let currentNumber = 0;
      const duration = 1200;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        
        currentNumber = Math.floor(eased * targetNumber);
        element.textContent = String(currentNumber).padStart(2, '0');

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          element.textContent = String(targetNumber).padStart(2, '0');
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* ===============================================
     Feature List Staggered Animation
     =============================================== */
  function initFeatureAnimation() {
    const featureLists = document.querySelectorAll('.step-card ul');
    
    featureLists.forEach(list => {
      const items = list.querySelectorAll('li');
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateFeatures(items);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(list);
    });

    function animateFeatures(items) {
      items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
          item.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, index * 100);
      });
    }
  }

  /* ===============================================
     Parallax Background Shapes
     =============================================== */
  function initParallaxShapes() {
    const shapes = document.querySelectorAll('.how-it-works-section .absolute.blur-3xl');
    const section = document.querySelector('.how-it-works-section');
    
    if (!shapes.length || !section || window.innerWidth < 768) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      // Only animate when section is in viewport
      if (scrolled > sectionTop - window.innerHeight && 
          scrolled < sectionTop + sectionHeight) {
        
        const relativeScroll = scrolled - sectionTop;
        
        shapes.forEach((shape, index) => {
          const speed = (index + 1) * 0.05;
          const yPos = relativeScroll * speed;
          const xPos = Math.sin(relativeScroll * 0.001) * 20;
          
          shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
        });
      }
    }
  }

  /* ===============================================
     Icon Rotation on Hover
     =============================================== */
  function initIconRotation() {
    const cards = document.querySelectorAll('.step-card');
    
    cards.forEach(card => {
      const icon = card.querySelector('.w-24 svg');
      
      if (!icon) return;

      card.addEventListener('mouseenter', () => {
        icon.style.transition = 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
        icon.style.transform = 'rotate(360deg) scale(1.15)';
      });

      card.addEventListener('mouseleave', () => {
        icon.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        icon.style.transform = 'rotate(0deg) scale(1)';
      });
    });
  }

  /* ===============================================
     Card Entrance Animation
     =============================================== */
  function initCardEntrance() {
    const cards = document.querySelectorAll('.step-card > div');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '0';
              entry.target.style.transform = 'translateY(60px) scale(0.95)';
              
              requestAnimationFrame(() => {
                entry.target.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
              });
            }, index * 150);
            
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '50px' }
    );

    cards.forEach(card => {
      observer.observe(card);
    });
  }

  /* ===============================================
     Dynamic Gradient Animation
     =============================================== */
  function initGradientAnimation() {
    const title = document.querySelector('.how-it-works-section h2');
    
    if (!title) return;

    let hue = 158; // Starting hue for emerald
    let animationId;

    function animateGradient() {
      hue = (hue + 0.3) % 360;
      
      const color1 = `hsl(${hue}, 64%, 35%)`;
      const color2 = `hsl(${hue + 5}, 78%, 29%)`;
      const color3 = `hsl(${hue - 3}, 70%, 32%)`;
      
      title.style.backgroundImage = `linear-gradient(to right, ${color1}, ${color2}, ${color3})`;
      
      animationId = requestAnimationFrame(animateGradient);
    }

    // Start animation when in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateGradient();
          } else {
            cancelAnimationFrame(animationId);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(title);
  }

  /* ===============================================
     Button Ripple Effect
     =============================================== */
  function initButtonRipple() {
    const buttons = document.querySelectorAll('.how-it-works-section button, .cta-button');
    
    buttons.forEach(button => {
      button.addEventListener('click', createRipple);
    });

    function createRipple(e) {
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: ripple-effect 0.6s ease-out;
      `;
      
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    }

    // Add CSS for ripple animation
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple-effect {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ===============================================
     Smooth Scroll
     =============================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = offsetTop - 80; // Adjust for fixed header

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ===============================================
     Performance Optimizations
     =============================================== */
  function initPerformanceOptimizations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.documentElement.classList.add('reduced-animations');
    }

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
      const section = document.querySelector('.how-it-works-section');
      if (document.hidden) {
        section?.classList.add('paused');
      } else {
        section?.classList.remove('paused');
      }
    });

    // Lazy load images if any
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('.how-it-works-section img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  /* ===============================================
     Accessibility Enhancements
     =============================================== */
  function initAccessibility() {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.classList.add('reduce-motion');
      
      // Disable all animations
      const style = document.createElement('style');
      style.textContent = `
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Add keyboard navigation support
    const cards = document.querySelectorAll('.step-card');
    cards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'article');
      card.setAttribute('aria-label', `Step ${index + 1}`);
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          card.click();
        }
      });
    });

    // Add ARIA labels
    const section = document.querySelector('.how-it-works-section');
    if (section) {
      section.setAttribute('aria-label', 'How it works process');
    }
  }

  /* ===============================================
     Console Branding
     =============================================== */
  function consoleBranding() {
    const styles = {
      title: 'color: #1d5e33; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 0 #E5CBAF;',
      subtitle: 'color: #c9a877; font-size: 14px; font-weight: 600;',
      info: 'color: #2a7d4a; font-size: 12px;'
    };

    console.log('%c🚀 Destinova Flight Booking', styles.title);
    console.log('%c✈️  Built with Tailwind CSS & Modern JavaScript', styles.subtitle);
    console.log('%c📍 Version 2.0 | 2025', styles.info);
  }

  /* ===============================================
     Utility Functions
     =============================================== */
  
  // Debounce function for scroll events
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

  // Throttle function for scroll events
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Expose utilities to window object if needed
  window.DestinovaUtils = {
    debounce,
    throttle,
    isInViewport
  };

})();

/* ===============================================
   Additional Event Listeners
   =============================================== */

// Handle window resize
window.addEventListener('resize', debounce(function() {
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
}, 250));

// Handle orientation change
window.addEventListener('orientationchange', function() {
  setTimeout(() => {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }, 300);
});

// Function helper for debounce (defined outside IIFE for reuse)
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
// Enhanced Progress Line with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
  
  // Animate Progress Line on Scroll
  const progressLine = document.querySelector('.progress-line-animated');
  if (progressLine) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressLine.style.animation = 'progress-expand 3s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(progressLine);
  }
  
  // Enhanced Card Lift Effect with Depth
  const cards = document.querySelectorAll('.step-card');
  cards.forEach((card, index) => {
    card.style.setProperty('--index', index);
    
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });
  
  // Number Counter with Easing
  const stats = document.querySelectorAll('.step-card .absolute span');
  const observerStats = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateValue(entry.target);
        observerStats.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  stats.forEach(stat => observerStats.observe(stat));
  
  function animateValue(element) {
    const target = parseInt(element.textContent);
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.floor(start + (target - start) * eased);
      
      element.textContent = current.toString().padStart(2, '0');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }
  
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
});
// Enhanced Interactions for Polished Version
document.addEventListener('DOMContentLoaded', function() {
  
  // Icon Pulse Animation on Page Load
  setTimeout(() => {
    const icons = document.querySelectorAll('.icon-container');
    icons.forEach((icon, index) => {
      setTimeout(() => {
        icon.classList.add('animate-icon-pulse');
      }, index * 300);
    });
  }, 500);
  
  // Enhanced Button Click Effect
  const ctaButton = document.querySelector('.group\\/btn');
  if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
      // Create ripple
      const ripple = document.createElement('div');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        animation: button-ripple 0.8s ease-out;
        z-index: 0;
      `;
      
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    });
  }
  
  // Sparkle Animation for Trust Badge
  const trustBadge = document.querySelector('.animate-sparkle');
  if (trustBadge) {
    setInterval(() => {
      trustBadge.style.animation = 'none';
      setTimeout(() => {
        trustBadge.style.animation = 'sparkle 3s ease-in-out';
      }, 10);
    }, 5000);
  }
  
  // Progress Line with Enhanced Timing
  const progressLine = document.querySelector('.progress-line-animated');
  if (progressLine) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            progressLine.style.width = '100%';
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(progressLine);
  }
  
  // Enhanced Card Hover with Depth
  const cards = document.querySelectorAll('.step-card > div');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '20';
    });
    
    card.addEventListener('mouseleave', function() {
      setTimeout(() => {
        this.style.zIndex = '1';
      }, 500);
    });
  });
  
  // Smooth Number Counter for Step Numbers
  const stepNumbers = document.querySelectorAll('.step-card .absolute span');
  const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = parseInt(target.textContent);
        let currentValue = 0;
        
        const interval = setInterval(() => {
          if (currentValue < finalValue) {
            currentValue++;
            target.textContent = String(currentValue).padStart(2, '0');
          } else {
            clearInterval(interval);
          }
        }, 80);
        
        numberObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });
  
  stepNumbers.forEach(num => numberObserver.observe(num));
  
});

// Add CSS for icon pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes icon-pulse-load {
    0% {
      transform: scale(0.8);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.15);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .animate-icon-pulse {
    animation: icon-pulse-load 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`;
document.head.appendChild(style);

