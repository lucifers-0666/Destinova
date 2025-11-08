/**
 * ===================================
 * Destinova Header Component - JavaScript
 * Final Premium Version
 * Top bar always visible (no hiding)
 * Transparent → Solid scroll effect
 * Login state management
 * All interactive features
 * ===================================
 */

function initHeader() {
  'use strict';

  console.log('🚀 Initializing Destinova Header...');

  // ===================================
  // CONFIGURATION
  // ===================================
  const CONFIG = {
    scrollThreshold: 50,          // Pixels before header becomes solid
    debounceDelay: 10,            // Scroll event debounce
    dropdownDelay: 200,           // Dropdown close delay
    mobileBreakpoint: 1024,       // Mobile/desktop breakpoint
    animationDuration: 300,       // Default animation duration
  };

  // ===================================
  // CACHE DOM ELEMENTS
  // ===================================
  const elements = {
    // Main containers
    header: document.querySelector('.header-wrapper'),
    mainHeader: document.querySelector('.main-header'),
    topBar: document.querySelector('.top-bar'),
    body: document.body,
    
    // Login state elements
    authLinks: document.getElementById('auth-links'),
    userInfo: document.getElementById('user-info'),
    accountNavItem: document.getElementById('account-nav-item'),
    userDisplayName: document.getElementById('user-display-name'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Desktop navigation
    desktopNav: document.querySelector('.desktop-nav'),
    hamburger: document.getElementById('hamburger-btn'),
    searchBtn: document.getElementById('search-btn'),
    
    // Dropdown parents
    dropdownParents: document.querySelectorAll('.has-dropdown'),
    
    // Mobile menu
    mobileMenu: document.getElementById('mobile-menu'),
    mobileOverlay: document.getElementById('mobile-menu-overlay'),
    mobileCloseBtn: document.getElementById('mobile-close-btn'),
    
    // Mobile expandable items
    mobileExpandables: document.querySelectorAll('.mobile-nav-item.expandable'),
    
    // All navigation links
    allNavLinks: document.querySelectorAll('.nav-link, .mobile-nav-item'),
  };

  // ===================================
  // STATE MANAGEMENT
  // ===================================
  let state = {
    lastScrollY: window.scrollY,
    scrollDirection: 'none',
    ticking: false,
    isScrolled: false,
    isMobileMenuOpen: false,
    activeDropdown: null,
    windowWidth: window.innerWidth,
    isLoggedIn: false,
    userName: 'Guest',
  };

  // ===================================
  // UTILITY FUNCTIONS
  // ===================================
  
  /**
   * Check if element exists
   */
  function elementExists(element) {
    return element !== null && element !== undefined;
  }

  /**
   * Debounce function for performance
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

  /**
   * Get current scroll position
   */
  function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  // ===================================
  // LOGIN STATE MANAGEMENT
  // ===================================
  
  /**
   * Check if user is logged in and update UI
   */
  function checkLoginStatus() {
    // Get login state from localStorage
    state.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    state.userName = localStorage.getItem('userName') || 'Guest';
    
    console.log('🔐 Login Status:', state.isLoggedIn ? 'Logged In' : 'Not Logged In');
    console.log('👤 User:', state.userName);
    
    updateLoginUI();
  }

  /**
   * Update UI based on login status
   */
  function updateLoginUI() {
    if (state.isLoggedIn) {
      // User is logged in - show account menu
      if (elementExists(elements.authLinks)) {
        elements.authLinks.style.display = 'none';
      }
      if (elementExists(elements.userInfo)) {
        elements.userInfo.style.display = 'flex';
      }
      if (elementExists(elements.accountNavItem)) {
        elements.accountNavItem.style.display = 'block';
      }
      if (elementExists(elements.userDisplayName)) {
        elements.userDisplayName.textContent = state.userName;
      }
    } else {
      // User is not logged in - show sign in/up links
      if (elementExists(elements.authLinks)) {
        elements.authLinks.style.display = 'flex';
      }
      if (elementExists(elements.userInfo)) {
        elements.userInfo.style.display = 'none';
      }
      if (elementExists(elements.accountNavItem)) {
        elements.accountNavItem.style.display = 'none';
      }
    }
  }

  /**
   * Handle user logout
   */
  function handleLogout(event) {
    event.preventDefault();
    
    console.log('🚪 Logging out...');
    
    // Clear login data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    
    // Update state
    state.isLoggedIn = false;
    state.userName = 'Guest';
    
    // Update UI
    updateLoginUI();
    
    // Close any open dropdowns
    closeAllDropdowns();
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = '../html/index.html';
    }, 300);
  }

  // ===================================
  // SCROLL EFFECTS (SIMPLIFIED)
  // ===================================
  
  /**
   * Main scroll handler - only transparent to solid
   */
  function handleScroll() {
    const scrollY = getScrollPosition();
    state.scrollDirection = scrollY > state.lastScrollY ? 'down' : 'up';

    // ONLY EFFECT: Transparent → Solid transition
    if (scrollY > CONFIG.scrollThreshold && !state.isScrolled) {
      elements.mainHeader.classList.add('scrolled');
      elements.header.classList.add('scrolled');
      state.isScrolled = true;
      
      // Smooth transition animation
      animateHeaderTransition();
      
      console.log('✨ Header: Scrolled state (solid glassmorphic)');
    } 
    else if (scrollY <= CONFIG.scrollThreshold && state.isScrolled) {
      elements.mainHeader.classList.remove('scrolled');
      elements.header.classList.remove('scrolled');
      state.isScrolled = false;
      
      console.log('✨ Header: Transparent state');
    }

    // Close all dropdowns on significant scroll
    if (Math.abs(scrollY - state.lastScrollY) > 100) {
      closeAllDropdowns();
    }

    state.lastScrollY = scrollY <= 0 ? 0 : scrollY;
  }

  /**
   * Smooth animation when header transitions
   */
  function animateHeaderTransition() {
    if (!elementExists(elements.mainHeader)) return;
    
    elements.mainHeader.style.transition = 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
      if (elementExists(elements.mainHeader)) {
        elements.mainHeader.style.transition = '';
      }
    }, 400);
  }

  /**
   * Optimized scroll handler with requestAnimationFrame
   */
  function onScroll() {
    if (!state.ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        state.ticking = false;
      });
      state.ticking = true;
    }
  }

  // ===================================
  // MOBILE MENU FUNCTIONALITY
  // ===================================
  
  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    if (state.isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  /**
   * Open mobile menu with animations
   */
  function openMobileMenu() {
    if (!elementExists(elements.mobileMenu)) return;
    
    elements.mobileMenu.classList.add('active');
    elements.mobileOverlay.classList.add('active');
    elements.hamburger.classList.add('active');
    elements.body.style.overflow = 'hidden'; // Prevent body scroll
    
    state.isMobileMenuOpen = true;

    // Accessibility
    elements.mobileMenu.setAttribute('aria-hidden', 'false');
    elements.hamburger.setAttribute('aria-expanded', 'true');

    // Staggered animation for menu items
    staggerMobileMenuItems();
    
    console.log('📱 Mobile menu opened');
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    if (!elementExists(elements.mobileMenu)) return;
    
    elements.mobileMenu.classList.remove('active');
    elements.mobileOverlay.classList.remove('active');
    elements.hamburger.classList.remove('active');
    elements.body.style.overflow = ''; // Restore body scroll
    
    state.isMobileMenuOpen = false;

    // Close all expanded submenus
    const expandedItems = elements.mobileMenu.querySelectorAll('.expandable.active');
    expandedItems.forEach(item => item.classList.remove('active'));

    // Accessibility
    elements.mobileMenu.setAttribute('aria-hidden', 'true');
    elements.hamburger.setAttribute('aria-expanded', 'false');
    
    console.log('📱 Mobile menu closed');
  }

  /**
   * Staggered fade-in animation for mobile menu items
   */
  function staggerMobileMenuItems() {
    const items = elements.mobileMenu.querySelectorAll('.mobile-nav-item');
    
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 50 * index);
    });
  }

  /**
   * Toggle mobile submenu (accordion style)
   */
  function toggleMobileSubmenu(expandableItem) {
    const isActive = expandableItem.classList.contains('active');
    
    // Close other expanded items (accordion behavior)
    elements.mobileExpandables.forEach(item => {
      if (item !== expandableItem) {
        item.classList.remove('active');
      }
    });
    
    // Toggle current item
    if (isActive) {
      expandableItem.classList.remove('active');
    } else {
      expandableItem.classList.add('active');
      
      // Animate submenu items
      const submenuItems = expandableItem.querySelectorAll('.mobile-submenu-item');
      submenuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        
        setTimeout(() => {
          item.style.transition = 'all 250ms ease-out';
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        }, 50 * index);
      });
    }
  }

  // ===================================
  // DESKTOP DROPDOWN FUNCTIONALITY
  // ===================================
  
  /**
   * Setup hover-based dropdowns for desktop
   */
  function setupDropdowns() {
    elements.dropdownParents.forEach(parent => {
      let timeoutId;
      
      // Mouse enter - show dropdown
      parent.addEventListener('mouseenter', () => {
        clearTimeout(timeoutId);
        closeAllDropdowns();
        
        parent.classList.add('active');
        state.activeDropdown = parent;
        
        // Update ARIA
        const button = parent.querySelector('button');
        if (button) {
          button.setAttribute('aria-expanded', 'true');
        }
        
        // Animate dropdown items (staggered reveal happens via CSS)
        animateDropdownItems(parent);
      });
      
      // Mouse leave - hide dropdown with delay
      parent.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => {
          parent.classList.remove('active');
          
          // Update ARIA
          const button = parent.querySelector('button');
          if (button) {
            button.setAttribute('aria-expanded', 'false');
          }
          
          if (state.activeDropdown === parent) {
            state.activeDropdown = null;
          }
        }, CONFIG.dropdownDelay);
      });
    });
  }

  /**
   * Animate dropdown items on reveal
   */
  function animateDropdownItems(parent) {
    const items = parent.querySelectorAll('.dropdown-item');
    
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(-8px)';
      
      setTimeout(() => {
        item.style.transition = 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 50 * index);
    });
  }

  /**
   * Close all open dropdowns
   */
  function closeAllDropdowns() {
    elements.dropdownParents.forEach(parent => {
      parent.classList.remove('active');
      
      const button = parent.querySelector('button');
      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }
    });
    
    state.activeDropdown = null;
  }

  // ===================================
  // SEARCH FUNCTIONALITY
  // ===================================
  
  /**
   * Handle search button click
   */
  function handleSearchClick(event) {
    // Create ripple effect
    createRipple(elements.searchBtn, event);
    
    // Navigate to booking page with search focus
    setTimeout(() => {
      window.location.href = '../html/booking.html#search';
    }, 300);
  }

  /**
   * Create ripple effect on button click
   */
  function createRipple(button, event) {
    if (!elementExists(button)) return;
    
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    Object.assign(ripple.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.6)',
      transform: 'scale(0)',
      animation: 'ripple 0.6s ease-out',
      pointerEvents: 'none',
      zIndex: '1000'
    });

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  // ===================================
  // KEYBOARD NAVIGATION
  // ===================================
  
  /**
   * Handle keyboard events for accessibility
   */
  function handleKeyboard(event) {
    const key = event.key;
    
    // ESC key - close everything
    if (key === 'Escape') {
      if (state.isMobileMenuOpen) {
        closeMobileMenu();
      }
      closeAllDropdowns();
    }
    
    // Toggle mobile menu with Enter/Space on hamburger
    if ((key === 'Enter' || key === ' ') && document.activeElement === elements.hamburger) {
      event.preventDefault();
      toggleMobileMenu();
    }
    
    // Navigate dropdowns with arrow keys
    if (state.activeDropdown && (key === 'ArrowDown' || key === 'ArrowUp')) {
      event.preventDefault();
      navigateDropdownWithKeys(key);
    }
  }

  /**
   * Navigate dropdown items with keyboard
   */
  function navigateDropdownWithKeys(key) {
    if (!state.activeDropdown) return;
    
    const items = Array.from(state.activeDropdown.querySelectorAll('.dropdown-item'));
    const currentIndex = items.findIndex(item => item === document.activeElement);
    
    let nextIndex;
    if (key === 'ArrowDown') {
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    }
    
    items[nextIndex]?.focus();
  }

  // ===================================
  // ACTIVE PAGE DETECTION
  // ===================================
  
  /**
   * Highlight active navigation item based on current page
   */
  function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    elements.allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href && href.includes(currentPage)) {
        link.classList.add('active');
        
        // Also mark parent dropdown as active
        const parentDropdown = link.closest('.has-dropdown');
        if (parentDropdown) {
          const parentButton = parentDropdown.querySelector('button.nav-link');
          if (parentButton) {
            parentButton.classList.add('active');
          }
        }
      }
    });
  }

  // ===================================
  // SMOOTH SCROLL TO TOP
  // ===================================
  
  /**
   * Logo click scrolls to top on current page
   */
  function setupLogoScrollToTop() {
    const logo = document.querySelector('.logo-link');
    
    if (elementExists(logo)) {
      logo.addEventListener('click', (event) => {
        const currentPath = window.location.pathname;
        
        // Only prevent default and scroll if on index page
        if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
          event.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      });
    }
  }

  // ===================================
  // WINDOW RESIZE HANDLER
  // ===================================
  
  /**
   * Handle window resize events
   */
  const handleResize = debounce(() => {
    const newWidth = window.innerWidth;
    
    // Close mobile menu if resized to desktop
    if (newWidth >= CONFIG.mobileBreakpoint && state.isMobileMenuOpen) {
      closeMobileMenu();
    }
    
    // Close all dropdowns on resize
    closeAllDropdowns();
    
    state.windowWidth = newWidth;
  }, 250);

  // ===================================
  // EVENT LISTENERS
  // ===================================
  
  /**
   * Attach all event listeners
   */
  function attachEventListeners() {
    // Logout button
    if (elementExists(elements.logoutBtn)) {
      elements.logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Mobile menu toggle
    if (elementExists(elements.hamburger)) {
      elements.hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    if (elementExists(elements.mobileCloseBtn)) {
      elements.mobileCloseBtn.addEventListener('click', closeMobileMenu);
    }
    
    if (elementExists(elements.mobileOverlay)) {
      elements.mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Mobile submenu toggles
    elements.mobileExpandables.forEach(expandable => {
      const trigger = expandable.querySelector('.mobile-nav-trigger');
      if (trigger) {
        trigger.addEventListener('click', () => toggleMobileSubmenu(expandable));
      }
    });
    
    // Search button
    if (elementExists(elements.searchBtn)) {
      elements.searchBtn.addEventListener('click', handleSearchClick);
    }
    
    // Scroll behavior - passive for performance
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Setup desktop dropdowns
    setupDropdowns();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.has-dropdown') && state.activeDropdown) {
        closeAllDropdowns();
      }
    });
    
    // Close mobile menu when clicking internal links
    const mobileNavLinks = elements.mobileMenu?.querySelectorAll('a') || [];
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(closeMobileMenu, 100);
      });
    });
    
    // Window resize
    window.addEventListener('resize', handleResize);
    
    console.log('✅ Event listeners attached');
  }

  // ===================================
  // INITIALIZATION
  // ===================================
  
  /**
   * Initialize all header functionality
   */
  function init() {
    // Verify required elements exist
    if (!elementExists(elements.header)) {
      console.error('❌ Destinova Header: Header element not found');
      return;
    }
    
    if (!elementExists(elements.mainHeader)) {
      console.error('❌ Destinova Header: Main header element not found');
      return;
    }
    
    // Check login status
    checkLoginStatus();
    
    // Set initial ARIA attributes
    if (elementExists(elements.mobileMenu)) {
      elements.mobileMenu.setAttribute('aria-hidden', 'true');
    }
    
    if (elementExists(elements.hamburger)) {
      elements.hamburger.setAttribute('aria-expanded', 'false');
    }
    
    // Attach all event listeners
    attachEventListeners();
    
    // Run initial scroll check
    handleScroll();
    
    // Set active nav item
    setActiveNavItem();
    
    // Setup logo scroll to top
    setupLogoScrollToTop();
    
    // Prevent FOUC (Flash of Unstyled Content)
    if (elementExists(elements.header)) {
      elements.header.style.opacity = '1';
    }
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    console.log('✅ Destinova Header: Initialized successfully');
    console.log('📊 State:', {
      isLoggedIn: state.isLoggedIn,
      userName: state.userName,
      scrolled: state.isScrolled,
      mobileMenuOpen: state.isMobileMenuOpen,
      windowWidth: state.windowWidth
    });
  }

  // Start initialization
  init();

  // ===================================
  // PUBLIC API
  // ===================================
  
  // Return public methods for external control if needed
  return {
    // Mobile menu
    openMenu: openMobileMenu,
    closeMenu: closeMobileMenu,
    toggleMenu: toggleMobileMenu,
    
    // Dropdowns
    closeDropdowns: closeAllDropdowns,
    
    // Scroll
    refresh: handleScroll,
    
    // Login
    checkLogin: checkLoginStatus,
    logout: handleLogout,
    
    // State
    getState: () => ({ ...state }),
  };
}

// ===================================
// AUTO-INITIALIZATION
// ===================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  // DOM already loaded - check if not already initialized
  if (typeof window.headerInitialized === 'undefined') {
    window.headerInitialized = true;
    initHeader();
  }
}

// ===================================
// RIPPLE ANIMATION STYLES
// ===================================
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
  @keyframes ripple {
    to {
      transform: scale(2.5);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyles);

// ===================================
// MODULE EXPORT
// ===================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initHeader };
}

// Make globally available
if (typeof window !== 'undefined') {
  window.initHeader = initHeader;
}

console.log('📦 Destinova Header JS loaded');
