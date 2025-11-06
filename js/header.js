/**
 * ============================================
 * HEADER.JS - Modern Navigation Header 2025
 * ============================================
 * Features:
 * - Scroll progress bar
 * - Header shrink on scroll with backdrop blur
 * - Mobile menu toggle with off-canvas slide
 * - Expandable search bar
 * - Dropdown interactions
 * - Active page detection
 * - Mobile accordion menus
 * - Keyboard navigation (Tab, Escape)
 * - Click outside to close
 * - Smooth animations and transitions
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  
  function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${Math.min(progress, 100)}%`;
    }
  }
  
  // Update on scroll
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress(); // Initial call


  // ============================================
  // HEADER SHRINK & BACKDROP BLUR ON SCROLL
  // ============================================
  const mainHeader = document.getElementById('main-header');
  const navContainer = document.getElementById('nav-container');
  const utilityBarTop = document.getElementById('utility-bar-top');
  let lastScrollY = window.scrollY;
  let ticking = false;
  
  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
      // Scrolled state
      if (mainHeader) {
        mainHeader.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        mainHeader.style.backdropFilter = 'blur(10px)';
      }
      if (navContainer) {
        navContainer.style.height = '60px';
      }
      
      // Hide utility bar when scrolling
      if (utilityBarTop) {
        utilityBarTop.style.transform = 'translateY(-100%)';
        utilityBarTop.style.opacity = '0';
      }
    } else {
      // Top state
      if (mainHeader) {
        mainHeader.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        mainHeader.style.backdropFilter = 'none';
      }
      if (navContainer) {
        navContainer.style.height = '70px';
      }
      
      // Show utility bar at top
      if (utilityBarTop) {
        utilityBarTop.style.transform = 'translateY(0)';
        utilityBarTop.style.opacity = '1';
      }
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }
  
  function requestHeaderTick() {
    if (!ticking) {
      window.requestAnimationFrame(handleHeaderScroll);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestHeaderTick, { passive: true });
  handleHeaderScroll(); // Initial call


  // ============================================
  // ACTIVE PAGE DETECTION
  // ============================================
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item[data-page]');
  
  navItems.forEach(item => {
    const page = item.getAttribute('data-page');
    if (currentPage.includes(page) || (currentPage === '' && page === 'index')) {
      // Add active state with glow effect
      item.classList.add('active-page');
      item.style.background = 'linear-gradient(135deg, rgba(29, 94, 51, 0.1), rgba(29, 94, 51, 0.05))';
      item.style.boxShadow = '0 0 20px rgba(29, 94, 51, 0.15)';
      item.style.borderRadius = '8px';
      
      // Make underline always visible for active page
      const underline = item.querySelector('span[class*="absolute bottom-0"]');
      if (underline) {
        underline.style.width = '70%';
      }
    }
  });


  // ============================================
  // EXPANDABLE SEARCH BAR
  // ============================================
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchBarExpanded = document.getElementById('search-bar-expanded');
  const headerSearchInput = document.getElementById('header-search-input');
  let searchBarOpen = false;
  
  if (searchToggleBtn && searchBarExpanded) {
    searchToggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      searchBarOpen = !searchBarOpen;
      
      if (searchBarOpen) {
        searchBarExpanded.classList.remove('invisible', 'opacity-0', '-translate-y-2');
        searchBarExpanded.classList.add('visible', 'opacity-100', 'translate-y-0');
        
        // Focus input after animation
        setTimeout(() => {
          if (headerSearchInput) headerSearchInput.focus();
        }, 100);
      } else {
        closeSearchBar();
      }
    });
    
    // Close on click outside
    document.addEventListener('click', function(e) {
      if (searchBarOpen && !searchBarExpanded.contains(e.target) && e.target !== searchToggleBtn) {
        closeSearchBar();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchBarOpen) {
        closeSearchBar();
      }
    });
    
    function closeSearchBar() {
      searchBarExpanded.classList.add('invisible', 'opacity-0', '-translate-y-2');
      searchBarExpanded.classList.remove('visible', 'opacity-100', 'translate-y-0');
      searchBarOpen = false;
    }
  }


  // ============================================
  // MOBILE MENU TOGGLE
  // ============================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const hamburgerLines = document.querySelectorAll('.hamburger-line');
  let mobileMenuOpen = false;
  
  function openMobileMenu() {
    mobileMenuOpen = true;
    if (mobileMenu) mobileMenu.style.transform = 'translateX(0)';
    if (mobileMenuBackdrop) {
      mobileMenuBackdrop.classList.remove('invisible', 'opacity-0');
      mobileMenuBackdrop.classList.add('visible', 'opacity-100');
    }
    document.body.style.overflow = 'hidden'; // Prevent scroll
    
    // Animate hamburger to X
    if (hamburgerLines.length === 3) {
      hamburgerLines[0].style.transform = 'rotate(45deg) translateY(8px)';
      hamburgerLines[1].style.opacity = '0';
      hamburgerLines[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    }
    
    // Update ARIA
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
  }
  
  function closeMobileMenu() {
    mobileMenuOpen = false;
    if (mobileMenu) mobileMenu.style.transform = 'translateX(100%)';
    if (mobileMenuBackdrop) {
      mobileMenuBackdrop.classList.add('invisible', 'opacity-0');
      mobileMenuBackdrop.classList.remove('visible', 'opacity-100');
    }
    document.body.style.overflow = ''; // Restore scroll
    
    // Reset hamburger
    if (hamburgerLines.length === 3) {
      hamburgerLines[0].style.transform = 'none';
      hamburgerLines[1].style.opacity = '1';
      hamburgerLines[2].style.transform = 'none';
    }
    
    // Update ARIA
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  }
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (mobileMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }
  
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  
  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
  }
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenuOpen) {
      closeMobileMenu();
    }
  });


  // ============================================
  // MOBILE ACCORDION MENUS
  // ============================================
  const mobileAccordions = document.querySelectorAll('.mobile-accordion');
  
  mobileAccordions.forEach(accordion => {
    const trigger = accordion.querySelector('.mobile-accordion-trigger');
    const content = accordion.querySelector('.mobile-accordion-content');
    const chevron = accordion.querySelector('.mobile-chevron');
    
    if (trigger && content) {
      trigger.addEventListener('click', function() {
        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
        
        // Close all other accordions
        mobileAccordions.forEach(otherAccordion => {
          if (otherAccordion !== accordion) {
            const otherContent = otherAccordion.querySelector('.mobile-accordion-content');
            const otherChevron = otherAccordion.querySelector('.mobile-chevron');
            if (otherContent) {
              otherContent.style.maxHeight = '0';
            }
            if (otherChevron) {
              otherChevron.style.transform = 'rotate(0deg)';
            }
          }
        });
        
        // Toggle current accordion
        if (isOpen) {
          content.style.maxHeight = '0';
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        }
      });
    }
  });


  // ============================================
  // DROPDOWN STAGGERED ANIMATION
  // ============================================
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  
  dropdownItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 50}ms`;
  });


  // ============================================
  // KEYBOARD NAVIGATION FOR DROPDOWNS
  // ============================================
  const dropdownTriggers = document.querySelectorAll('.nav-item-wrapper button');
  
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('keydown', function(e) {
      const dropdown = this.parentElement.querySelector('.dropdown-menu');
      
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Toggle dropdown visibility
        if (dropdown) {
          const isVisible = !dropdown.classList.contains('invisible');
          if (isVisible) {
            dropdown.classList.add('invisible', 'opacity-0');
            dropdown.classList.remove('visible', 'opacity-100');
          } else {
            dropdown.classList.remove('invisible', 'opacity-0');
            dropdown.classList.add('visible', 'opacity-100');
            
            // Focus first item
            const firstLink = dropdown.querySelector('a, button');
            if (firstLink) firstLink.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        if (dropdown) {
          dropdown.classList.add('invisible', 'opacity-0');
          dropdown.classList.remove('visible', 'opacity-100');
        }
        this.focus();
      }
    });
  });


  // ============================================
  // LANGUAGE & CURRENCY SELECTOR (TOP BAR)
  // ============================================
  const langButtons = document.querySelectorAll('[data-lang]');
  const currencyButtons = document.querySelectorAll('[data-currency]');
  
  langButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      const langSelector = document.getElementById('lang-selector-top');
      if (langSelector) {
        const langText = langSelector.querySelector('span');
        if (langText) {
          langText.textContent = lang.toUpperCase();
        }
      }
      
      // Store in localStorage
      localStorage.setItem('selectedLanguage', lang);
      
      // Here you would typically load language resources
      console.log('Language changed to:', lang);
    });
  });
  
  currencyButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const currency = this.getAttribute('data-currency');
      const currencySelector = document.getElementById('currency-selector-top');
      if (currencySelector) {
        const currencyText = currencySelector.querySelector('span');
        if (currencyText) {
          currencyText.textContent = currency;
        }
      }
      
      // Store in localStorage
      localStorage.setItem('selectedCurrency', currency);
      
      // Here you would typically update prices
      console.log('Currency changed to:', currency);
    });
  });
  
  // Load saved preferences
  const savedLang = localStorage.getItem('selectedLanguage');
  const savedCurrency = localStorage.getItem('selectedCurrency');
  
  if (savedLang) {
    const langSelector = document.getElementById('lang-selector-top');
    if (langSelector) {
      const langText = langSelector.querySelector('span');
      if (langText) langText.textContent = savedLang.toUpperCase();
    }
  }
  
  if (savedCurrency) {
    const currencySelector = document.getElementById('currency-selector-top');
    if (currencySelector) {
      const currencyText = currencySelector.querySelector('span');
      if (currencyText) currencyText.textContent = savedCurrency;
    }
  }


  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          // Close mobile menu if open
          if (mobileMenuOpen) {
            closeMobileMenu();
          }
          
          // Smooth scroll
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });


  // ============================================
  // FOCUS TRAP FOR MOBILE MENU (ACCESSIBILITY)
  // ============================================
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    });
  }
  
  if (mobileMenu) {
    trapFocus(mobileMenu);
  }


  // ============================================
  // CONSOLE LOG (DEVELOPMENT ONLY)
  // ============================================
  console.log('✅ Header navigation initialized successfully!');
  console.log('✈️ Destinova - Modern 2025 Header with Trending Effects');

});
