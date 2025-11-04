/* ===================================================================
   DESTINOVA PREMIUM HEADER - JavaScript Controller
   Features: Smart scroll, Scroll progress, Magnetic hover, Auth management
   =================================================================== */

(function() {
  'use strict';

  // ===================================================================
  // STATE MANAGEMENT
  // ===================================================================
  
  const HeaderState = {
    // Scroll tracking
    lastScrollY: 0,
    scrollDirection: 'none',
    isScrolling: false,
    scrollTimeout: null,
    ticking: false,
    
    // UI State
    isUserLoggedIn: false,
    userName: '',
    currentPage: '',
    isDarkMode: false,
    
    // Dropdown state
    activeDropdown: null,
    
    // Mobile menu state
    isMobileMenuOpen: false,
    
    init() {
      this.loadAuthState();
      this.loadDarkMode();
      this.detectCurrentPage();
      this.lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    },
    
    loadAuthState() {
      const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
      const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
      
      this.isUserLoggedIn = isSignedIn;
      this.userName = userDetails.name || userDetails.email || 'User';
    },
    
    loadDarkMode() {
      this.isDarkMode = localStorage.getItem('theme') === 'dark';
      const theme = this.isDarkMode ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    },
    
    detectCurrentPage() {
      const path = window.location.pathname;
      const page = path.split('/').pop().replace('.html', '') || 'index';
      this.currentPage = page;
    },
    
    setScrollDirection(direction) {
      this.scrollDirection = direction;
    }
  };

  // ===================================================================
  // SCROLL PROGRESS INDICATOR
  // ===================================================================
  
  const ScrollProgress = {
    progressBar: null,
    
    init() {
      this.progressBar = document.getElementById('scrollProgress');
      if (!this.progressBar) return;
      
      window.addEventListener('scroll', () => this.update(), { passive: true });
      this.update();
    },
    
    update() {
      if (!this.progressBar) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      const clampedPercent = Math.min(Math.max(scrollPercent, 0), 100);
      
      this.progressBar.style.transform = `scaleX(${clampedPercent / 100})`;
    }
  };

  // ===================================================================
  // SMART STICKY HEADER - Hide on scroll down, show on scroll up
  // ===================================================================
  
  const SmartSticky = {
    header: null,
    scrollThreshold: 50,
    hideThreshold: 150,
    lastScrollY: 0,
    
    init() {
      this.header = document.getElementById('site-header');
      if (!this.header) return;
      
      // Debounced scroll handler for performance
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        if (scrollTimeout) {
          window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
          this.handleScroll();
        });
      }, { passive: true });
      
      // Initial check
      this.handleScroll();
    },
    
    handleScroll() {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add scrolled class after threshold
      if (currentScrollY > this.scrollThreshold) {
        this.header.classList.add('header-scrolled');
      } else {
        this.header.classList.remove('header-scrolled');
      }
      
      // Smart hide/show behavior
      if (currentScrollY > this.hideThreshold) {
        if (currentScrollY > this.lastScrollY) {
          // Scrolling DOWN - Hide header
          this.header.classList.add('header-hidden');
          this.header.classList.remove('header-visible');
          HeaderState.setScrollDirection('down');
        } else {
          // Scrolling UP - Show header
          this.header.classList.remove('header-hidden');
          this.header.classList.add('header-visible');
          HeaderState.setScrollDirection('up');
        }
      } else {
        // Near top - Always show
        this.header.classList.remove('header-hidden');
        this.header.classList.remove('header-visible');
        HeaderState.setScrollDirection('none');
      }
      
      this.lastScrollY = currentScrollY;
    }
  };

  // ===================================================================
  // DROPDOWN MENU MANAGEMENT
  // ===================================================================
  
  const DropdownManager = {
    dropdowns: [],
    
    init() {
      // Find all dropdown buttons
      const dropdownBtns = document.querySelectorAll('.dropdown-btn');
      
      dropdownBtns.forEach(btn => {
        const menu = btn.nextElementSibling;
        if (!menu || !menu.classList.contains('dropdown-menu')) return;
        
        this.dropdowns.push({ btn, menu });
        
        // Click handler
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggle(btn, menu);
        });
        
        // Keyboard navigation
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle(btn, menu);
          } else if (e.key === 'Escape') {
            this.close(btn, menu);
          }
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
          if (!btn.contains(e.target) && !menu.contains(e.target)) {
            this.close(btn, menu);
          }
        });
        
        // Dropdown link keyboard navigation
        const links = menu.querySelectorAll('.dropdown-link, .logout-link');
        links.forEach((link, index) => {
          link.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              const next = links[index + 1];
              if (next) next.focus();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              const prev = links[index - 1];
              if (prev) prev.focus();
              else btn.focus();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              this.close(btn, menu);
              btn.focus();
            }
          });
        });
      });
    },
    
    toggle(btn, menu) {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      
      // Close all other dropdowns first
      this.closeAll();
      
      if (!isOpen) {
        this.open(btn, menu);
      }
    },
    
    open(btn, menu) {
      btn.setAttribute('aria-expanded', 'true');
      menu.classList.add('show');
      HeaderState.activeDropdown = { btn, menu };
      
      // Focus first link
      setTimeout(() => {
        const firstLink = menu.querySelector('.dropdown-link, .logout-link');
        if (firstLink) firstLink.focus();
      }, 100);
    },
    
    close(btn, menu) {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('show');
      if (HeaderState.activeDropdown?.btn === btn) {
        HeaderState.activeDropdown = null;
      }
    },
    
    closeAll() {
      this.dropdowns.forEach(({ btn, menu }) => {
        this.close(btn, menu);
      });
    }
  };

  // ===================================================================
  // PROFILE MENU (User Dropdown)
  // ===================================================================
  
  const ProfileMenu = {
    init() {
      const profileBtn = document.getElementById('profile-btn');
      const profileDropdown = document.getElementById('user-dropdown');
      
      if (!profileBtn || !profileDropdown) return;
      
      // Toggle dropdown
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = profileDropdown.classList.contains('show');
        
        // Close other dropdowns
        DropdownManager.closeAll();
        
        if (!isOpen) {
          profileDropdown.classList.add('show');
          profileBtn.setAttribute('aria-expanded', 'true');
        } else {
          profileDropdown.classList.remove('show');
          profileBtn.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Close on click outside
      document.addEventListener('click', (e) => {
        if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
          profileDropdown.classList.remove('show');
          profileBtn.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Keyboard navigation
      profileBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          profileBtn.click();
        } else if (e.key === 'Escape') {
          profileDropdown.classList.remove('show');
          profileBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  };

  // ===================================================================
  // MOBILE MENU MANAGEMENT
  // ===================================================================
  
  const MobileMenu = {
    hamburgerBtn: null,
    mobileMenu: null,
    closeBtn: null,
    
    init() {
      this.hamburgerBtn = document.getElementById('hamburger-btn');
      this.mobileMenu = document.getElementById('mobile-menu');
      this.closeBtn = document.getElementById('mobile-close');
      
      if (!this.hamburgerBtn || !this.mobileMenu) return;
      
      // Hamburger button
      this.hamburgerBtn.addEventListener('click', () => this.toggle());
      
      // Close button
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      
      // Mobile dropdown buttons
      const dropdownBtns = document.querySelectorAll('.mobile-dropdown-btn');
      dropdownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const menuId = btn.getAttribute('data-menu') + '-submenu';
          const submenu = document.getElementById(menuId);
          
          if (submenu) {
            const isOpen = submenu.classList.contains('show');
            submenu.classList.toggle('show');
            btn.textContent = btn.textContent.replace(isOpen ? '▴' : '▾', isOpen ? '▾' : '▴');
          }
        });
      });
      
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && HeaderState.isMobileMenuOpen) {
          this.close();
        }
      });
      
      // Close on link click
      const mobileLinks = this.mobileMenu.querySelectorAll('.mobile-link');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          // Delay close to allow navigation
          setTimeout(() => this.close(), 200);
        });
      });
    },
    
    toggle() {
      if (HeaderState.isMobileMenuOpen) {
        this.close();
      } else {
        this.open();
      }
    },
    
    open() {
      this.mobileMenu.classList.add('show');
      this.hamburgerBtn.setAttribute('aria-expanded', 'true');
      HeaderState.isMobileMenuOpen = true;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Close desktop dropdowns
      DropdownManager.closeAll();
    },
    
    close() {
      this.mobileMenu.classList.remove('show');
      this.hamburgerBtn.setAttribute('aria-expanded', 'false');
      HeaderState.isMobileMenuOpen = false;
      
      // Restore body scroll
      document.body.style.overflow = '';
    }
  };

  // ===================================================================
  // AUTH UI MANAGEMENT
  // ===================================================================
  
  const AuthUI = {
    init() {
      this.updateUI();
      this.setupLogoutHandlers();
    },
    
    updateUI() {
      // Desktop auth section
      const authGuest = document.getElementById('auth-guest');
      const authUser = document.getElementById('auth-user');
      const userNameDisplay = document.getElementById('user-name-display');
      
      // Mobile auth section
      const mobileAuthGuest = document.getElementById('mobile-auth-guest');
      const mobileAuthUser = document.getElementById('mobile-auth-user');
      const mobileUserName = document.getElementById('mobile-user-name');
      
      if (HeaderState.isUserLoggedIn) {
        // Show user menu, hide guest buttons
        if (authGuest) authGuest.style.display = 'none';
        if (authUser) authUser.style.display = 'flex';
        if (userNameDisplay) userNameDisplay.textContent = HeaderState.userName;
        
        if (mobileAuthGuest) mobileAuthGuest.style.display = 'none';
        if (mobileAuthUser) mobileAuthUser.style.display = 'block';
        if (mobileUserName) mobileUserName.textContent = `Hello, ${HeaderState.userName}`;
      } else {
        // Show guest buttons, hide user menu
        if (authGuest) authGuest.style.display = 'flex';
        if (authUser) authUser.style.display = 'none';
        
        if (mobileAuthGuest) mobileAuthGuest.style.display = 'block';
        if (mobileAuthUser) mobileAuthUser.style.display = 'none';
      }
    },
    
    setupLogoutHandlers() {
      // Desktop logout
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => this.handleLogout());
      }
      
      // Mobile logout
      const mobileLogoutBtn = document.getElementById('mobile-logout');
      if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', () => this.handleLogout());
      }
    },
    
    handleLogout() {
      // Clear auth data
      localStorage.removeItem('isUserSignedIn');
      localStorage.removeItem('userDetails');
      
      // Show confirmation
      if (confirm('Are you sure you want to sign out?')) {
        // Redirect to home
        window.location.href = 'index.html';
      } else {
        // Restore state if cancelled
        HeaderState.loadAuthState();
      }
    }
  };

  // ===================================================================
  // ACTIVE PAGE HIGHLIGHTING
  // ===================================================================
  
  const ActivePage = {
    init() {
      // Highlight current page in navigation
      const currentPage = HeaderState.currentPage;
      
      // Desktop nav links
      const navLinks = document.querySelectorAll('.nav-link[data-page]');
      navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
          link.classList.add('active');
        }
      });
      
      // Dropdown links
      const dropdownLinks = document.querySelectorAll('.dropdown-link[data-page]');
      dropdownLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
          link.classList.add('active');
          // Also highlight parent dropdown
          const parentDropdown = link.closest('.nav-dropdown');
          if (parentDropdown) {
            const parentBtn = parentDropdown.querySelector('.dropdown-btn');
            if (parentBtn) parentBtn.classList.add('active');
          }
        }
      });
      
      // Mobile links
      const mobileLinks = document.querySelectorAll('.mobile-link[data-page]');
      mobileLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
          link.classList.add('active');
        }
      });
    }
  };

  // ===================================================================
  // DARK MODE TOGGLE
  // ===================================================================
  
  const DarkMode = {
    toggleBtn: null,
    
    init() {
      this.toggleBtn = document.getElementById('dark-mode-toggle');
      if (!this.toggleBtn) return;
      
      this.toggleBtn.addEventListener('click', () => this.toggle());
      
      // Keyboard support
      this.toggleBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle();
        }
      });
    },
    
    toggle() {
      HeaderState.isDarkMode = !HeaderState.isDarkMode;
      const theme = HeaderState.isDarkMode ? 'dark' : 'light';
      
      // Update DOM
      document.documentElement.setAttribute('data-theme', theme);
      
      // Save to localStorage
      localStorage.setItem('theme', theme);
      
      // Dispatch custom event for other scripts
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
  };

  // ===================================================================
  // SEARCH BUTTON HANDLER
  // ===================================================================
  
  const SearchButton = {
    init() {
      const searchBtn = document.getElementById('search-btn');
      if (!searchBtn) return;
      
      searchBtn.addEventListener('click', () => {
        // You can implement search overlay here
        // For now, redirect to booking page with search focus
        const currentPath = window.location.pathname;
        if (!currentPath.includes('booking.html')) {
          window.location.href = 'booking.html';
        } else {
          // Focus search input if on booking page
          const searchInput = document.querySelector('input[type="text"]');
          if (searchInput) searchInput.focus();
        }
      });
    }
  };

  // ===================================================================
  // RIPPLE EFFECT ON AVATAR CLICK
  // ===================================================================
  
  const RippleEffect = {
    init() {
      const profileBtn = document.getElementById('profile-btn');
      if (!profileBtn) return;
      
      profileBtn.addEventListener('click', () => {
        const ripple = profileBtn.querySelector('.avatar-ripple');
        if (!ripple) return;
        
        // Reset animation
        ripple.style.animation = 'none';
        
        // Trigger reflow
        void ripple.offsetWidth;
        
        // Restart animation
        ripple.style.animation = 'ripple 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
      });
    }
  };

  // ===================================================================
  // MAGNETIC HOVER EFFECT (Subtle cursor follow)
  // ===================================================================
  
  const MagneticHover = {
    elements: [],
    
    init() {
      // Apply to buttons and important links
      const magneticElements = document.querySelectorAll('.auth-btn, .header-icon-btn, .logo-link');
      
      magneticElements.forEach(el => {
        this.elements.push(el);
        
        el.addEventListener('mousemove', (e) => this.handleMove(e, el));
        el.addEventListener('mouseleave', () => this.handleLeave(el));
      });
    },
    
    handleMove(e, el) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.15;
      const deltaY = (e.clientY - centerY) * 0.15;
      
      el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    },
    
    handleLeave(el) {
      el.style.transform = '';
    }
  };

  // ===================================================================
  // PERFORMANCE MONITORING (Optional)
  // ===================================================================
  
  const Performance = {
    init() {
      // Log header initialization time in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`🚀 Header initialized in ${loadTime}ms`);
      }
    }
  };

  // ===================================================================
  // MAIN INITIALIZATION
  // ===================================================================
  
  function initializeHeader() {
    // Initialize state first
    HeaderState.init();
    
    // Initialize all modules
    ScrollProgress.init();
    SmartSticky.init();
    DropdownManager.init();
    ProfileMenu.init();
    MobileMenu.init();
    AuthUI.init();
    ActivePage.init();
    DarkMode.init();
    SearchButton.init();
    RippleEffect.init();
    MagneticHover.init();
    Performance.init();
    
    console.log('✈️ Destinova Premium Header Loaded');
  }

  // ===================================================================
  // START WHEN DOM IS READY
  // ===================================================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeader);
  } else {
    initializeHeader();
  }

  // ===================================================================
  // EXPOSE UTILITIES FOR OTHER SCRIPTS
  // ===================================================================
  
  window.DestinovaHeader = {
    closeAllDropdowns: () => DropdownManager.closeAll(),
    closeMobileMenu: () => MobileMenu.close(),
    refreshAuth: () => {
      HeaderState.loadAuthState();
      AuthUI.updateUI();
    },
    getScrollProgress: () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return (scrollTop / (documentHeight - windowHeight)) * 100;
    }
  };

})();
