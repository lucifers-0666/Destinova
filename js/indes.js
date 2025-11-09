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
// 3 step  section js starts here

/* ===============================================
   FARE CALENDAR - PRODUCTION JAVASCRIPT
   =============================================== */

(function() {
  'use strict';

  // Sample comprehensive price data
  const priceData = {
    '2025-03': {
      1: 420, 2: 385, 3: 405, 4: 390, 5: 510, 6: 620, 7: 580,
      8: 395, 9: 375, 10: 410, 11: 425, 12: 530, 13: 640, 14: 615,
      15: 360, 16: 380, 17: 400, 18: 415, 19: 520, 20: 635, 21: 610,
      22: 390, 23: 370, 24: 405, 25: 420, 26: 535, 27: 650, 28: 625,
      29: 385, 30: 375, 31: 410
    }
  };

  let currentMonth = '2025-03';
  let selectedDay = null;
  let clickCount = 0;
  let clickTimeout = null;

  // Initialize
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    renderCalendar();
    initializeEventListeners();
    animateConfidenceMeter();
    initEasterEgg();
  }

  // Render Calendar with full functionality
  function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-days');
    if (!calendarGrid) return;

    calendarGrid.innerHTML = '';
    
    const prices = priceData[currentMonth];
    const minPrice = Math.min(...Object.values(prices));
    const maxPrice = Math.max(...Object.values(prices));
    const daysInMonth = Object.keys(prices).length;

    // Determine first day of month (for grid positioning)
    const firstDay = new Date(currentMonth + '-01').getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1; // Monday = 0

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day-placeholder';
      calendarGrid.appendChild(emptyCell);
    }

    // Render actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const price = prices[day];
      const date = new Date(`${currentMonth}-${String(day).padStart(2, '0')}`);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isBestPrice = price === minPrice;
      
      // Calculate trend
      const prevPrice = day > 1 ? prices[day - 1] : null;
      let trend = null;
      if (prevPrice) {
        if (price > prevPrice + 20) trend = 'up';
        else if (price < prevPrice - 20) trend = 'down';
      }
      
      const dayCell = createDayCell(day, price, isBestPrice, isWeekend, trend);
      calendarGrid.appendChild(dayCell);
    }
  }

  function createDayCell(day, price, isBestPrice, isWeekend, trend) {
    const cell = document.createElement('div');
    cell.className = `calendar-day ${isBestPrice ? 'best-price' : ''} ${isWeekend ? 'weekend' : ''}`;
    cell.dataset.day = day;
    cell.dataset.price = price;
    cell.tabIndex = 0;
    
    cell.innerHTML = `
      <div class="day-number">${day}</div>
      <div class="price">$${price}</div>
      ${trend ? `
        <svg class="trend-arrow ${trend}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="${trend === 'up' ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M19 12l-7 7-7-7'}"></path>
        </svg>
      ` : ''}
    `;
    
    // Event listeners
    cell.addEventListener('click', () => selectDay(cell, day, price));
    cell.addEventListener('mouseenter', (e) => showTooltip(e, day, price));
    cell.addEventListener('mouseleave', hideTooltip);
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectDay(cell, day, price);
      }
    });
    
    return cell;
  }

  // Day Selection with Ripple
  function selectDay(cell, day, price) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Add selection
    cell.classList.add('selected');
    selectedDay = day;
    
    // Create ripple effect
    createRipple(cell);
    
    // Update best day display
    updateBestDayDisplay(day, price);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  function createRipple(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, rgba(229, 203, 175, 0.6) 0%, transparent 70%);
      border-radius: 12px;
      pointer-events: none;
      animation: ripple-expand 0.8s ease-out;
      z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  }

  // Enhanced Tooltip
  function showTooltip(event, day, price) {
    const tooltip = document.getElementById('price-tooltip');
    if (!tooltip) return;
    
    const cell = event.currentTarget;
    const rect = cell.getBoundingClientRect();
    
    const avgPrice = calculateAveragePrice();
    const savings = avgPrice - price;
    const savingsPercent = Math.round((savings / avgPrice) * 100);
    
    tooltip.querySelector('.tooltip-content').innerHTML = `
      <div class="font-bold text-lg text-[#164426] mb-3">
        <div class="flex items-center justify-between">
          <span>March ${day}, 2025</span>
          ${cell.classList.contains('weekend') ? '<span class="text-xs bg-[#e8f4ed] text-[#2a7d4a] px-2 py-1 rounded-full">Weekend</span>' : ''}
        </div>
      </div>
      <div class="space-y-2 text-sm">
        <div class="flex items-center justify-between py-2 border-b border-gray-100">
          <span class="text-gray-600">Flight Price:</span>
          <span class="text-xl font-bold text-[#1d5e33]">$${price}</span>
        </div>
        ${savings > 0 ? `
          <div class="flex items-center justify-between">
            <span class="text-gray-600">You Save:</span>
            <span class="text-lg font-bold text-[#2a7d4a]">$${Math.round(savings)} (${savingsPercent}%)</span>
          </div>
        ` : savings < 0 ? `
          <div class="flex items-center justify-between">
            <span class="text-gray-600">vs Average:</span>
            <span class="text-sm font-semibold text-[#dc3545]">+$${Math.abs(Math.round(savings))}</span>
          </div>
        ` : ''}
        <div class="pt-2 mt-2 border-t border-gray-100">
          <div class="flex items-start gap-2 text-xs text-gray-500">
            <svg class="w-4 h-4 text-[#2a7d4a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${getFlightDetails(day)}</span>
          </div>
        </div>
      </div>
    `;
    
    // Position tooltip
    const scrollY = window.scrollY || window.pageYOffset;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top + scrollY - 10}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
    tooltip.classList.remove('hidden');
  }

  function hideTooltip() {
    const tooltip = document.getElementById('price-tooltip');
    if (tooltip) {
      tooltip.classList.add('hidden');
    }
  }

  function calculateAveragePrice() {
    const prices = Object.values(priceData[currentMonth]);
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  }

  function getFlightDetails(day) {
    const date = new Date(`${currentMonth}-${day}`);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    return isWeekend 
      ? '8 flights available · Avg 7h 45m · Weekend pricing'
      : '15 flights available · Avg 7h 20m · Weekday rates';
  }

  function updateBestDayDisplay(day, price) {
    const display = document.getElementById('best-day-display');
    if (!display) return;
    
    const minPrice = Math.min(...Object.values(priceData[currentMonth]));
    const savings = price - minPrice;
    
    display.style.animation = 'none';
    setTimeout(() => {
      display.textContent = `March ${day} - ${savings > 0 ? `Save $${savings}!` : 'Best Price!'}`;
      display.style.animation = 'fade-in-up 0.5s ease-out';
    }, 10);
  }

  // Event Listeners
  function initializeEventListeners() {
    // Month navigation
    document.querySelector('.month-prev')?.addEventListener('click', () => changeMonth(-1));
    document.querySelector('.month-next')?.addEventListener('click', () => changeMonth(1));
    
    // Change route
    document.querySelector('.change-route-btn')?.addEventListener('click', changeRoute);
    
    // Price alert
    document.querySelector('.price-alert-btn')?.addEventListener('click', setPriceAlert);
  }

  function changeMonth(direction) {
    const display = document.querySelector('.month-display');
    if (display) {
      display.style.opacity = '0';
      display.style.transform = direction > 0 ? 'translateX(20px)' : 'translateX(-20px)';
      
      setTimeout(() => {
        display.textContent = direction > 0 ? 'April 2025' : 'February 2025';
        display.style.transition = 'all 0.3s ease-out';
        display.style.opacity = '1';
        display.style.transform = 'translateX(0)';
      }, 300);
    }
    
    renderCalendar();
  }

  function changeRoute() {
    console.log('Change route clicked');
    // Implement route change modal
  }

  function setPriceAlert() {
    const btn = document.querySelector('.price-alert-btn');
    if (!btn || btn.classList.contains('active')) return;
    
    btn.classList.add('active');
    
    // Icon change
    const bellIcon = btn.querySelector('.bell-icon');
    if (bellIcon) {
      bellIcon.outerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      `;
    }
    
    btn.querySelector('span').textContent = 'Alert Set!';
    
    // Confetti
    createConfetti(btn);
    
    // Reset after 2.5s
    setTimeout(() => {
      btn.classList.remove('active');
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span>Set Price Alert</span>
      `;
    }, 2500);
  }

  // Confetti Effect
  function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#1d5e33', '#2a7d4a', '#3a9c60', '#c9a877', '#E5CBAF'];
    
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 8 + 4;
      const tx = (Math.random() - 0.5) * 300;
      const ty = (Math.random() - 0.5) * 300;
      const rotation = Math.random() * 720;
      
      confetti.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        --tx: ${tx}px;
        --ty: ${ty}px;
        --r: ${rotation}deg;
        animation: confetti-burst ${0.8 + Math.random() * 0.4}s ease-out forwards;
      `;
      
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1200);
    }
  }

  // Animate Confidence Meter
  function animateConfidenceMeter() {
    const fill = document.querySelector('.confidence-fill');
    const value = document.querySelector('.confidence-value');
    
    if (fill && value) {
      setTimeout(() => {
        fill.classList.add('animate');
        
        // Animate number
        let current = 0;
        const target = 92;
        const duration = 1500;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          value.textContent = Math.round(current) + '%';
        }, 16);
      }, 1000);
    }
  }

  // Easter Egg: Triple Click Title
  function initEasterEgg() {
    const title = document.getElementById('calendar-title');
    if (!title) return;
    
    title.addEventListener('click', () => {
      clickCount++;
      
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        clickCount = 0;
      }, 1000);
      
      if (clickCount === 3) {
        triggerEasterEgg();
        clickCount = 0;
      }
    });
  }

  function triggerEasterEgg() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.remove('hidden');
    
    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#1d5e33', '#2a7d4a', '#3a9c60', '#c9a877', '#E5CBAF', '#f5e8d8'];
    
    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        shape: Math.random() > 0.5 ? 'circle' : 'square'
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        
        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        
        ctx.restore();
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.rotation += p.rotationSpeed;
        
        if (p.y > canvas.height + 50) {
          particles.splice(index, 1);
        }
      });
      
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        canvas.classList.add('hidden');
      }
    }
    
    animate();
    
    // Play success sound if available
    if (window.Audio) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVank');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }

  // Add dynamic CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-expand {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
    
    @keyframes confetti-burst {
      to {
        transform: translate(var(--tx), var(--ty)) rotate(var(--r));
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

})();
// Travel Dates Section JS ends here



/* ===============================================
   BAGGAGE & SEAT COST ESTIMATOR - JAVASCRIPT
   =============================================== */

(function() {
  'use strict';

  // Fare Data
  const fareData = {
    basic: {
      basePrice: 385,
      includes: {
        baggage: 0,
        seat: 0,
        boarding: false,
        lounge: false
      }
    },
    standard: {
      basePrice: 475,
      includes: {
        baggage: 45, // 1 bag included
        seat: 25, // Standard seat included
        boarding: false,
        lounge: false
      }
    },
    premium: {
      basePrice: 625,
      includes: {
        baggage: 90, // 2 bags included
        seat: 120, // Premium seat included
        boarding: 15, // Priority boarding included
        lounge: false
      }
    }
  };

  // State Management
  let calculatorState = {
    selections: {
      baggage: 45,
      seat: 0,
      boarding: false,
      lounge: false
    },
    selectedFare: null,
    achievements: []
  };

  let clickCount = 0;
  let clickTimeout = null;
  let timerInterval = null;
  let timeRemaining = 14 * 60 + 32; // 14:32 in seconds

  // Initialize
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initializeEventListeners();
    updateAllPrices();
    startPriceLockTimer();
    checkBestValue();
  }

  // Event Listeners
  function initializeEventListeners() {
    // Radio buttons for baggage
    document.querySelectorAll('input[name="baggage"]').forEach(radio => {
      radio.addEventListener('change', handleBaggageChange);
    });

    // Radio buttons for seat
    document.querySelectorAll('input[name="seat"]').forEach(radio => {
      radio.addEventListener('change', handleSeatChange);
    });

    // Toggle switches for extras
    document.querySelectorAll('.toggle-input').forEach(toggle => {
      toggle.addEventListener('change', handleExtrasChange);
    });

    // Fare selection buttons
    document.querySelectorAll('.select-fare-btn').forEach(btn => {
      btn.addEventListener('click', handleFareSelection);
    });

    // Fare card hover for mouse position
    document.querySelectorAll('.fare-card').forEach(card => {
      card.addEventListener('mousemove', handleCardMouseMove);
    });

    // Easter egg - triple click title
    const title = document.getElementById('calculator-title');
    if (title) {
      title.addEventListener('click', handleTitleClick);
    }
  }

  // Handle Baggage Change
  function handleBaggageChange(e) {
    const price = parseInt(e.target.dataset.price);
    calculatorState.selections.baggage = price;
    
    createRipple(e.target.closest('.option-card'));
    updateAllPrices();
    checkBestValue();
    checkAchievements();
  }

  // Handle Seat Change
  function handleSeatChange(e) {
    const price = parseInt(e.target.dataset.price);
    calculatorState.selections.seat = price;
    
    createRipple(e.target.closest('.option-card'));
    updateAllPrices();
    checkBestValue();
    checkAchievements();
  }

  // Handle Extras Change
  function handleExtrasChange(e) {
    const price = parseInt(e.target.dataset.price);
    const extraType = e.target.closest('label').textContent.includes('Priority') ? 'boarding' : 'lounge';
    
    calculatorState.selections[extraType] = e.target.checked ? price : 0;
    
    if (e.target.checked) {
      createRipple(e.target.closest('.toggle-card'));
    }
    
    updateAllPrices();
    checkBestValue();
  }

  // Update All Prices
  function updateAllPrices() {
    const addons = calculatorState.selections.baggage + 
                   calculatorState.selections.seat +
                   (calculatorState.selections.boarding || 0) +
                   (calculatorState.selections.lounge || 0);

    // Update each fare card
    Object.keys(fareData).forEach(fareType => {
      const card = document.querySelector(`[data-fare="${fareType}"]`);
      if (!card) return;

      const fare = fareData[fareType];
      const includedValue = fare.includes.baggage + fare.includes.seat + 
                           (fare.includes.boarding ? 15 : 0) +
                           (fare.includes.lounge ? 40 : 0);
      
      // Calculate what user still needs to pay
      let remainingCost = 0;
      
      if (calculatorState.selections.baggage > fare.includes.baggage) {
        remainingCost += calculatorState.selections.baggage - fare.includes.baggage;
      }
      
      if (calculatorState.selections.seat > fare.includes.seat) {
        remainingCost += calculatorState.selections.seat - fare.includes.seat;
      }
      
      if (calculatorState.selections.boarding && !fare.includes.boarding) {
        remainingCost += calculatorState.selections.boarding;
      }
      
      if (calculatorState.selections.lounge && !fare.includes.lounge) {
        remainingCost += calculatorState.selections.lounge;
      }

      const totalCost = fare.basePrice + remainingCost;

      // Update UI with animation
      const addonElement = card.querySelector('.addon-price');
      const totalElement = card.querySelector('.total-price');
      
      if (addonElement) {
        animateNumberChange(addonElement, parseInt(addonElement.textContent), remainingCost);
      }
      
      if (totalElement) {
        animateNumberChange(totalElement, parseInt(totalElement.textContent), totalCost);
        totalElement.classList.add('price-flash');
        setTimeout(() => totalElement.classList.remove('price-flash'), 600);
      }
    });
  }

  // Animate Number Change
  function animateNumberChange(element, from, to) {
    const duration = 500;
    const start = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = Math.round(from + (to - from) * eased);
      
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Check Best Value
  function checkBestValue() {
    const prices = {};
    
    Object.keys(fareData).forEach(fareType => {
      const card = document.querySelector(`[data-fare="${fareType}"]`);
      if (card) {
        const totalElement = card.querySelector('.total-price');
        prices[fareType] = parseInt(totalElement.textContent);
      }
    });

    const bestFare = Object.keys(prices).reduce((a, b) => prices[a] < prices[b] ? a : b);
    
    // Move best value badge
    document.querySelectorAll('.fare-card').forEach(card => {
      card.classList.remove('fare-card-best');
      const badge = card.querySelector('.best-badge');
      if (badge) badge.remove();
    });

    const bestCard = document.querySelector(`[data-fare="${bestFare}"]`);
    if (bestCard && bestFare === 'standard') {
      bestCard.classList.add('fare-card-best');
      
      // Re-add badge if standard
      if (!bestCard.querySelector('.best-badge')) {
        const badge = document.createElement('div');
        badge.className = 'absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#c9a877] to-[#E5CBAF] text-[#164426] rounded-full font-bold text-sm shadow-lg flex items-center gap-1 animate-bounce-subtle best-badge';
        badge.innerHTML = '<span>🏆</span><span>BEST VALUE</span>';
        bestCard.insertBefore(badge, bestCard.firstChild);
      }
    }

    // Update smart tip
    updateSmartTip(prices);
  }

  // Update Smart Tip
  function updateSmartTip(prices) {
    const container = document.querySelector('.smart-tip-container');
    const message = container.querySelector('.tip-message');
    
    if (!container || !message) return;

    const basicWithAddons = prices.basic;
    const standardPrice = prices.standard;
    const savings = basicWithAddons - standardPrice;

    if (savings > 20) {
      message.textContent = `Standard fare saves you $${savings} vs Basic + add-ons!`;
      container.classList.remove('hidden');
    } else if (savings < -50) {
      message.textContent = `Consider Basic fare! You're adding $${Math.abs(savings)} more than needed.`;
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
  }

  // Check Achievements
  function checkAchievements() {
    const prices = {};
    
    Object.keys(fareData).forEach(fareType => {
      const card = document.querySelector(`[data-fare="${fareType}"]`);
      if (card) {
        const totalElement = card.querySelector('.total-price');
        prices[fareType] = parseInt(totalElement.textContent);
      }
    });

    const bestFare = Object.keys(prices).reduce((a, b) => prices[a] < prices[b] ? a : b);
    const savings = fareData.basic.basePrice + 
                   calculatorState.selections.baggage + 
                   calculatorState.selections.seat - 
                   prices[bestFare];

    // Savvy Saver Achievement
    if (bestFare === 'standard' && !calculatorState.achievements.includes('savvy_saver')) {
      calculatorState.achievements.push('savvy_saver');
      showAchievement('💰', 'Savvy Saver', 'You picked the best value!');
    }

    // Deal Hunter Achievement
    if (savings >= 100 && !calculatorState.achievements.includes('deal_hunter')) {
      calculatorState.achievements.push('deal_hunter');
      showAchievement('🎯', 'Deal Hunter', `Saved $${savings}!`);
      triggerConfetti();
    }
  }

  // Show Achievement Toast
  function showAchievement(icon, title, message) {
    const toast = document.getElementById('achievement-toast');
    if (!toast) return;

    toast.querySelector('.achievement-icon').textContent = icon;
    toast.querySelector('.achievement-title').textContent = title;
    toast.querySelector('.achievement-message').textContent = message;

    toast.classList.remove('hidden', 'hide');
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.classList.add('hidden'), 400);
    }, 4000);
  }

  // Handle Fare Selection
  function handleFareSelection(e) {
    const card = e.target.closest('.fare-card');
    const fare = card.dataset.fare;
    calculatorState.selectedFare = fare;

    // Visual feedback
    createRipple(card);
    
    // Add achievement for comparing all fares
    if (!calculatorState.achievements.includes('planner_pro')) {
      calculatorState.achievements.push('planner_pro');
      showAchievement('📅', 'Planner Pro', 'You compared all options!');
    }

    console.log('Selected fare:', fare);
    // Implement booking flow here
  }

  // Create Ripple Effect
  function createRipple(element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    
    ripple.style.cssText = `
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, rgba(42, 125, 74, 0.4) 0%, transparent 70%);
      border-radius: inherit;
      pointer-events: none;
      animation: ripple 0.8s ease-out;
      z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
  }

  // Handle Card Mouse Move (for glow effect)
  function handleCardMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  }

  // Price Lock Timer
  function startPriceLockTimer() {
    const timerDisplay = document.querySelector('.timer-display');
    if (!timerDisplay) return;

    timerInterval = setInterval(() => {
      timeRemaining--;
      
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      
      timerDisplay.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
      
      // Add urgent class when less than 5 minutes
      if (timeRemaining < 300) {
        timerDisplay.classList.add('urgent');
      }
      
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = 'Expired';
      }
    }, 1000);
  }

  // Easter Egg: Triple Click Title
  function handleTitleClick() {
    clickCount++;
    
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      clickCount = 0;
    }, 1000);
    
    if (clickCount === 3) {
      triggerEasterEgg();
      clickCount = 0;
    }
  }

  function triggerEasterEgg() {
    // Show promo code
    alert('🎉 Secret Promo Code: CALC2025 - Save extra 5%!');
    triggerConfetti();
  }

  // Confetti Effect
  function triggerConfetti() {
    const canvas = document.getElementById('calculator-confetti');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.remove('hidden');

    const ctx = canvas.getContext('2d');
    const particles = [];
    const colors = ['#1d5e33', '#2a7d4a', '#3a9c60', '#c9a877', '#E5CBAF', '#f5e8d8'];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.5 ? 'circle' : 'square'
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 50) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        canvas.classList.add('hidden');
      }
    }

    animate();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  });

})();
// date picker section JS ends here

// Baggage & Seat Cost Estimator - JavaScript starts here
(function() {
  'use strict';

  // --- Localized INR pricing for demo ---
  const fareData = {
    basic: {
      basePrice: 32000,
    },
    standard: {
      basePrice: 39500,
    },
    premium: {
      basePrice: 52000,
    }
  };
  // Addon options must match HTML data-price!
  const baggagePrices = {none: 0, "1bag": 3750, "2bags": 7500, extra: 10000};
  const seatPrices = {random: 0, standard: 2100, legroom: 5400, premium: 10000};

  let state = {
    baggage: 3750, // default (1 bag)
    seat: 0, // default (random)
    priority: false,
    lounge: false,
    selectedFare: null
  };

  function updateAllPrices(){
    // Read options
    state.baggage = +document.querySelector('input[name="baggage"]:checked').dataset.price;
    state.seat = +document.querySelector('input[name="seat"]:checked').dataset.price;
    state.priority = document.querySelector('.toggle-input[data-price="1250"]').checked ? 1250 : 0;
    state.lounge = document.querySelector('.toggle-input[data-price="3300"]').checked ? 3300 : 0;
    // Fare card computation
    ["basic","standard","premium"].forEach(fare=>{
      const card = document.querySelector(`[data-fare="${fare}"]`);
      let addons = 0;
      // Each fare includes varying baggage/seat/priority coverage:
      let base = fareData[fare].basePrice;
      if(fare==="basic"){
        // All addons
        addons = state.baggage + state.seat + state.priority + state.lounge;
      } else if(fare==="standard"){
        // 1 bag, standard seat incl, priority + lounge extra
        let extraBag = Math.max(0,state.baggage-3750); // 1 basic included
        let seatExtra = Math.max(0,state.seat-2100); // std seat included
        addons = extraBag + seatExtra + state.priority + state.lounge;
      } else if(fare==="premium"){
        // 2 bags, premium seat, priority incl, lounge extra
        let extraBag = Math.max(0,state.baggage-7500); // 2 included
        let seatExtra = Math.max(0,state.seat-10000); // premium included
        let priorityExtra = 0; // included
        addons = extraBag + seatExtra + priorityExtra + state.lounge;
      }
      let total = base + addons;
      // Animate main price values
      animateNumber(card.querySelector('.base-price'),+card.querySelector('.base-price').textContent,base);
      animateNumber(card.querySelector('.addon-price'),+card.querySelector('.addon-price').textContent||0,addons);
      let totalElem=card.querySelector('.total-price');
      animateNumber(totalElem,+totalElem.textContent,total);
      totalElem.classList.add('price-flash');
      setTimeout(()=>totalElem.classList.remove('price-flash'),650);
    });
    updateBestValueTip();
  }

  function animateNumber(elem, from, to){
    if(from===to) return;
    let start = performance.now();
    function update(now){
      let p = Math.min((now-start)/500,1);
      elem.textContent = Math.round(from+(to-from)*p).toLocaleString("en-IN");
      if(p<1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Smart tip and Best Value badge logic
  function updateBestValueTip(){
    // Compute actual totals
    const getTotal = f=>{
      const card = document.querySelector(`[data-fare="${f}"]`);
      return +card.querySelector('.total-price').textContent.replace(/\D/g,'');
    };
    let t_basic=getTotal("basic"), t_std=getTotal("standard"), t_prem=getTotal("premium");
    // Tip message
    let tip = document.querySelector('.tip-message');
    let smartCont = document.querySelector('.smart-tip-container');
    if(!tip) return;
    if(t_std<t_basic-10){
      smartCont.classList.remove('hidden');
      tip.textContent = `Standard fare saves you ₹${(t_basic-t_std).toLocaleString('en-IN')} vs Basic + add-ons!`;
    } else if (t_prem<t_basic-10 && t_prem<t_std-10){
      smartCont.classList.remove('hidden');
      tip.textContent = `Premium fare lets you enjoy extra luxury for only ₹${(t_prem-t_basic).toLocaleString('en-IN')} more.`;
    } else {
      smartCont.classList.add('hidden');
    }
  }

  // Timer
  let timer = 14*60+32;
  function tickTimer(){
    let el=document.querySelector('.timer-display');
    if(el){
      timer--; if(timer<0) timer=0;
      let m=Math.floor(timer/60),s=timer%60;
      el.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
      if(timer<300) el.classList.add('urgent'); else el.classList.remove('urgent');
      if(timer>0) setTimeout(tickTimer,1000);
    }
  }

  // Option select (radio toggles + styling)
  function handleOptionRadios(){
    document.querySelectorAll('.option-container input[type=radio]').forEach(input=>{
      input.addEventListener('change',e=>{
        document.querySelectorAll(`input[name=${e.target.name}]`).forEach(ip=>ip.closest('.option-container').classList.remove('selected'));
        input.closest('.option-container').classList.add('selected');
        updateAllPrices();
      });
    });
  }

  // Toggle switches appearance
  document.querySelectorAll('.toggle-input').forEach(toggle=>{
    toggle.addEventListener('change',updateAllPrices);
  });

  // Fare card select handlers and micro-animation
  document.querySelectorAll('.select-fare-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      document.querySelectorAll('.fare-card').forEach(card=>card.classList.remove('selected'));
      let card = e.target.closest('.fare-card');
      card.classList.add('selected');
      // Flash total, show toast if best value
    });
  });

  // Comparison tooltips
  document.querySelectorAll('.fare-card').forEach(card=>{
    card.addEventListener('mouseenter',function(e){
      if(card.querySelector('.card-tooltip')) return; 
      // Show tooltip with cost breakdown
      let base = card.querySelector('.base-price').textContent,
          addon = card.querySelector('.addon-price').textContent,
          total = card.querySelector('.total-price').textContent;
      let tt = document.createElement('div');
      tt.className="card-tooltip";
      tt.innerHTML=`<div class="cdt-head"><strong>Cost Breakdown</strong></div>
      <div class="cdt"><span>Base Fare</span><span>₹${base}</span></div>
      <div class="cdt"><span>Add-ons</span><span>+₹${addon}</span></div>
      <div class="cdt-head"></div>
      <div class="cdt cdt-foot"><span>Total</span><span>₹${total}</span></div>`;
      card.appendChild(tt);
    });
    card.addEventListener('mouseleave',function(e){
      let tt = card.querySelector('.card-tooltip');
      if(tt) tt.remove();
    });
  })

  // Initial
  handleOptionRadios();
  updateAllPrices();
  setTimeout(tickTimer,1000);

  // Accessibility: focus ring on enter
  document.querySelectorAll('.option-container').forEach(cont=>{
    cont.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){
        cont.querySelector('input').checked=true;
        updateAllPrices();
      }
    });
  });

  // Section title easter egg
  let click = 0, to=null;
  document.getElementById('calculator-title').addEventListener('click',()=>{
    click++;
    clearTimeout(to);
    to = setTimeout(()=>click=0,900); 
    if(click===3){alert("🎉 Secret Promo: FLYTRUE10 for 10% off!");}
  });

})();

// BAGGAGE & SEAT COST ESTIMATOR - JAVASCRIPT ends here



// Visa & Entry Rules Checker Section js strat here

document.addEventListener('DOMContentLoaded', () => {
  // Floating particles: randomize duration/delay for each for organic look
  const particles = document.querySelectorAll('.floating-particles .particle');
  particles.forEach(particle => {
    const duration = 12 + Math.random() * 8; // 12-20s
    const delay = Math.random() * duration;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
  });

  // Parallax lens flare movement
  const section = document.getElementById('visa-entry-rules-checker');
  const flares = document.querySelectorAll('.lens-flare');
  const maxTranslateX = 12; // max horizontal move px
  let ticking = false;

  function updateParallax(event) {
    if (ticking) return;
    window.requestAnimationFrame(() => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = event && event.clientX ? event.clientX : window.innerWidth / 2;
      const mouseY = event && event.clientY ? event.clientY : window.innerHeight / 2;
      const moveX = (mouseX - centerX) / rect.width;
      const moveY = (mouseY - centerY) / rect.height;
      flares.forEach((flare, idx) => {
        const intensity = (idx + 1) / flares.length;
        const translateX = maxTranslateX * intensity * moveX;
        const translateY = maxTranslateX * intensity * moveY * 0.5;
        flare.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('mousemove', updateParallax);
    window.addEventListener('scroll', (e) => updateParallax({ clientX: window.innerWidth/2, clientY: window.innerHeight/2 }));
  }

  // Accessible radio button visual and aria selection for purpose buttons
  document.querySelectorAll('.purpose-btn').forEach((btn, i, group) => {
    btn.addEventListener('click', () => {
      group.forEach(b => b.classList.remove('selected','bg-[#e8f4ed]','border-[#2a7d4a]','shadow'));
      btn.classList.add('selected','bg-[#e8f4ed]','border-[#2a7d4a]','shadow');
      btn.blur();
    });
  });

  // Dismiss passport expiry alert
  document.querySelectorAll('.passport-expiry-alert button').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.passport-expiry-alert').style.display = 'none';
    });
  });

  // Animate dropdown arrow on focus
  document.querySelectorAll('select').forEach(sel => {
    sel.addEventListener('focus', function () {
      this.parentNode.querySelector('svg').classList.add('rotate-180');
    });
    sel.addEventListener('blur', function () {
      this.parentNode.querySelector('svg').classList.remove('rotate-180');
    });
  });

  // Accessible focus highlights for all main controls
  document.querySelectorAll('input, select, button, a').forEach(el => {
    el.addEventListener('focus', function () {
      this.style.outline = '3px solid #2a7d4a';
      this.style.outlineOffset = '2px';
    });
    el.addEventListener('blur', function () {
      this.style.outline = 'none';
    });
  });

  // Announce status on input change
  Array.from(document.querySelectorAll('input, select')).forEach(el => {
    el.addEventListener('input', () => {
      const live = document.querySelector('[role="alert"][aria-live]');
      if (live) {
        live.setAttribute('aria-atomic', 'true');
        live.setAttribute('tabindex', '-1');
        live.focus();
      }
    });
  });
});


// Visa & Entry Rules Checker Section end here


// price alert  section start here 


document.addEventListener('DOMContentLoaded', () => {

  // Radio button active styles toggle
  document.querySelectorAll('input[type=radio][name=price-alert]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('input[type=radio][name=price-alert]').forEach(r => 
        r.parentNode.classList.remove('font-bold', 'text-[#2a7d4a]')
      );
      if (radio.checked) {
        radio.parentNode.classList.add('font-bold', 'text-[#2a7d4a]');
      }
    });
  });

  // Price input field pulse focus
  document.querySelectorAll('.price-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.classList.add('ring', 'ring-[#2a7d4a]/20');
    });
    input.addEventListener('blur', () => {
      input.classList.remove('ring', 'ring-[#2a7d4a]/20');
    });
  });

  // Custom checkbox interaction
  document.querySelectorAll('.checkbox-option input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const label = checkbox.parentNode;
      if (checkbox.checked) {
        label.querySelector('.checked-indicator').classList.remove('hidden');
      } else {
        label.querySelector('.checked-indicator').classList.add('hidden');
      }
    });
  });

  // Animated graph line drawing
  const graphLine = document.querySelector('.graph-line');
  if (graphLine) {
    const length = graphLine.getTotalLength();
    graphLine.style.strokeDasharray = length;
    graphLine.style.strokeDashoffset = length;
    setTimeout(() => {
      graphLine.style.transition = 'stroke-dashoffset 1.2s ease-in-out';
      graphLine.style.strokeDashoffset = 0;
    }, 500);
  }

  // Animate price number on update
  const priceDisplay = document.querySelector('.saved-search-price');
  if (priceDisplay) {
    const oldPrice = parseInt(priceDisplay.textContent.replace(/[^0-9]/g, '')) || 0;
    const newPrice = 340; // Example new price
    let step = (newPrice - oldPrice) / 60;
    let current = oldPrice;
    let count = 0;
    const countInterval = setInterval(() => {
      current += step;
      priceDisplay.textContent = `$${Math.round(current)}`;
      count++;
      if (count >= 60) {
        clearInterval(countInterval);
        // Flash green bg and fade out
        priceDisplay.style.backgroundColor = '#e8f4ed';
        setTimeout(() => priceDisplay.style.backgroundColor = 'transparent', 800);
      }
    }, 20);
  }

  // Bell icon shake animation on CTA hover
  document.querySelectorAll('.primary-cta').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.classList.add('animate-bellShake');
    });
    btn.addEventListener('animationend', () => {
      btn.classList.remove('animate-bellShake');
    });
  });

  // Accessibility: Focus outlines are manage by CSS, add aria live announce on input changes
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-9999px';
  document.body.appendChild(liveRegion);

  document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('change', () => {
      liveRegion.textContent = 'Price alert options updated';
    });
  });

  // Active Alerts: Edit, Pause, Delete button handlers (example shows alert)
  document.querySelectorAll('.alert-card button').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      alert(`Action: ${button.textContent.trim()}`);
    });
  });

});
// price alert section end here

// scocail proof section js start here

document.addEventListener("DOMContentLoaded", function () {
  
  // --- SVG Sprite Check (for cross-browser <use> support) ---
  // This is a common pattern, not in the prompt but good practice.
  // If you are sure about your environment, you can remove it.
  (function(d, u) {
    var x = new XMLHttpRequest();
    var b = d.body;
    x.open('GET', u, true);
    x.send();
    x.onload = function() {
      var s = d.createElement('div');
      s.style.display = 'none';
      s.innerHTML = x.responseText;
      b.insertBefore(s, b.firstChild);
    }
  })(document, ''); // In a real setup, you'd load a sprite file. Since it's inline, it's fine.


  // --- Animated Rating Stars and Countup ---
  const countupElem = document.querySelector('.countup[data-value]');
  if (countupElem) {
    const endVal = parseFloat(countupElem.dataset.value);
    let curr = 0, frames = 38, step = endVal / frames, frame = 0;
    function animateNum() {
      curr += step; frame++;
      countupElem.textContent = Math.min(curr, endVal).toFixed(1);
      if (frame < frames) requestAnimationFrame(animateNum);
      else countupElem.textContent = endVal.toFixed(1);
    }
    animateNum();
  }
  
  // --- Animate rating bars when visible ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        document.querySelectorAll('.rating-bar-bar').forEach((bar, idx) => {
          setTimeout(() => {
            const fill = bar.querySelector('.rating-bar-fill');
            fill.style.width = bar.dataset.end || '0%';
          }, idx * 60);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.38 });
  const breakdown = document.querySelector('.rating-breakdown');
  breakdown && observer.observe(breakdown);

  // --------- Review Carousel ---------
  const carouselCards = [
    {
      stars: 5,
      title: "Best Flight Deal Ever!",
      text: "Saved $200 on my Paris trip! The booking process was seamless and customer support was fantastic. Highly recommend!",
      name: "Sarah M.",
      location: "New York",
      photo: "https://randomuser.me/api/portraits/women/71.jpg",
      verified: true,
      ago: "2 weeks ago",
      route: "NYC → Paris"
    },
    {
      stars: 5,
      title: "Absolutely Amazing Experience!",
      text: "Found a $385 flight to Paris when others were charging $585! Easy booking, instant confirmation, and great customer service.",
      name: "Jennifer T.",
      location: "Los Angeles",
      photo: "https://randomuser.me/api/portraits/women/50.jpg",
      verified: true,
      ago: "1 week ago",
      route: "LAX → Tokyo"
    },
    {
      stars: 4,
      title: "Great value, minor delays",
      text: "Saved big on my flight but check-in took a bit longer than expected. Overall, happy with the booking process.",
      name: "Michael R.",
      location: "Chicago",
      photo: "https://randomuser.me/api/portraits/men/22.jpg",
      verified: true,
      ago: "3 days ago",
      route: "ORD → London"
    }
  ];
  let carouselIndex = 0;
  const carouselCard = document.querySelector(".review-card");
  const leftBtn = document.querySelector(".nav-arrow.left");
  const rightBtn = document.querySelector(".nav-arrow.right");
  const dotsWrap = document.querySelector('.carousel-dots');

  // Dots creation (idempotent)
  if (dotsWrap && dotsWrap.children.length !== carouselCards.length) {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < carouselCards.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.tabIndex = 0;
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dotsWrap.appendChild(dot);
    }
  }
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  // *** UPDATED updateCarousel function ***
  function updateCarousel(idx) {
    if (!carouselCard) return;
    
    let c = carouselCards[idx];
    
    // Generate star HTML using the new SVG sprite
    let starHtml = '';
    for (let i = 0; i < 5; i++) {
      starHtml += `
        <svg class="star-icon ${i < c.stars ? 'filled' : ''}" viewBox="0 0 20 20">
          <use href="#star-icon"></use>
        </svg>`;
    }

    carouselCard.innerHTML = `
      <div style="display: flex; gap: 0.25rem; margin-bottom: 0.75rem;">
        ${starHtml}
      </div>
      
      <h3 style="font-size: 1.25rem; font-weight: 600; color: #064e3b; margin-bottom: 0.75rem;">
        "${c.title}"
      </h3>
      
      <p style="color: #374151; line-height: 1.6; margin-bottom: 1rem; flex-grow: 1;">
        ${c.text}
      </p>
      
      <div style="display: flex; align-items: center; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
        <img src="${c.photo}" alt="${c.name}" style="width: 3rem; height: 3rem; border-radius: 9999px; object-fit: cover;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <p style="font-weight: 600; color: #064e3b;">${c.name}</p>
            <span style="color: #6b7280;">•</span>
            <p style="color: #4b5563;">${c.location}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem;">
            ${c.verified ? `
              <span style="display: flex; align-items: center; gap: 0.25rem; color: #059669;">
                <svg style="width: 1rem; height: 1rem;" viewBox="0 0 20 20">
                  <use href="#check-badge-icon"></use>
                </svg>
                Verified
              </span>
              <span>•</span>
            ` : ''}
            <span>${c.ago}</span>
            <span>•</span>
            <span style="display: flex; align-items: center; gap: 0.25rem;">
              <svg style="width: 1rem; height: 1rem;" viewBox="0 0 20 20">
                <use href="#airplane-icon"></use>
              </svg>
              ${c.route}
            </span>
          </div>
        </div>
      </div>
    `;

    // Set active dot
    dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
  }
  
  // Navigation Arrows
  leftBtn && leftBtn.addEventListener('click', () => {
    carouselIndex = (carouselIndex - 1 + carouselCards.length) % carouselCards.length;
    updateCarousel(carouselIndex);
  });
  rightBtn && rightBtn.addEventListener('click', () => {
    carouselIndex = (carouselIndex + 1) % carouselCards.length;
    updateCarousel(carouselIndex);
  });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      carouselIndex = i;
      updateCarousel(carouselIndex);
    });
    dot.addEventListener('keydown', (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        carouselIndex = i;
        updateCarousel(carouselIndex);
      }
    });
  });
  // Auto-play carousel
  let autoCarousel = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % carouselCards.length;
    updateCarousel(carouselIndex);
  }, 6000);
  
  const carouselContainer = document.querySelector('.review-carousel-container');
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoCarousel));
    carouselContainer.addEventListener('mouseleave', () => {
      autoCarousel = setInterval(() => {
        carouselIndex = (carouselIndex + 1) % carouselCards.length;
        updateCarousel(carouselIndex);
      }, 6000);
    });
  }
  updateCarousel(0); // Initial call

  // ---- Live Booking Activity ----
  const liveBookings = [
    { flag: '🇯🇵', city: 'Tokyo', time: '2 min ago' },
    { flag: '🇬🇧', city: 'London', time: '5 min ago' },
    { flag: '🇫🇷', city: 'Paris', time: '8 min ago' },
    { flag: '🇮🇹', city: 'Rome', time: '12 min ago' },
    { flag: '🇮🇳', city: 'Delhi', time: '17 min ago' },
    { flag: '🇪🇸', city: 'Madrid', time: '20 min ago' }
  ];
  const liveWrap = document.querySelector('.live-activity-section');
  let liveIdx = 0;

  // *** UPDATED renderLive function ***
  function renderLive() {
    if (!liveWrap) return;
    
    let bookingHtml = '';
    const bookingsToShow = liveBookings.slice(liveIdx, liveIdx + 4);
    if (liveIdx + 4 > liveBookings.length) {
      bookingsToShow.push(...liveBookings.slice(0, (liveIdx + 4) % liveBookings.length));
    }
    
    bookingHtml = bookingsToShow.map(item => `
      <div class="live-booking-item">
        <div class="live-booking-location">
          <span class="live-booking-flag">${item.flag}</span>
          <span class="live-booking-city">${item.city}</span>
        </div>
        <span class="live-booking-time">Booked ${item.time}</span>
      </div>
    `).join('');

    liveWrap.innerHTML = `
      <div class="live-header">
        <span class="live-pulse">
          <span class="live-pulse-ping"></span>
          <span class="live-pulse-dot"></span>
        </span>
        <span class="live-label">LIVE</span>
        <span class="live-text">234 people booking right now</span>
      </div>
      
      <div class="live-bookings-list">
        ${bookingHtml}
      </div>
    `;
  }
  
  renderLive(); // Initial call
  setInterval(() => {
    liveIdx = (liveIdx + 1) % liveBookings.length;
    renderLive();
  }, 6100);

  // --- Customer photo tooltips ---
  document.querySelectorAll('.customer-photo').forEach(photo => {
    const tooltip = photo.querySelector('.photo-tooltip');
    if (!tooltip) return;
    const msg = photo.dataset.location || '';
    tooltip.innerText = msg;
    
    const showTooltip = () => {
      tooltip.style.opacity = 1;
      tooltip.style.pointerEvents = 'auto';
    };
    const hideTooltip = () => {
      tooltip.style.opacity = 0;
      tooltip.style.pointerEvents = 'none';
    };

    photo.addEventListener('mouseenter', showTooltip);
    photo.addEventListener('mouseleave', hideTooltip);
    photo.addEventListener('focus', showTooltip);
    photo.addEventListener('blur', hideTooltip);
  });
});