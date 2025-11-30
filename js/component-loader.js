/**
 * ===================================
 * Destinova Component Loader
 * Loads header and footer components into pages
 * ===================================
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    headerPlaceholder: '#header-placeholder',
    footerPlaceholder: '#footer-placeholder',
    headerPath: '../html/components/header.html',
    footerPath: '../html/components/footer.html',
    headerCssPath: '../css/header.css',
    footerCssPath: '../css/footer.css',
    headerJsPath: '../js/header.js',
    footerJsPath: '../js/footer.js',
  };

  /**
   * Load CSS file dynamically
   * @param {string} href - CSS file path
   * @param {string} id - Unique ID for the link element
   */
  function loadCSS(href, id) {
    if (document.getElementById(id)) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  /**
   * Load JavaScript file dynamically
   * @param {string} src - JS file path
   * @param {string} id - Unique ID for the script element
   */
  function loadScript(src, id) {
    if (document.getElementById(id)) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  /**
   * Fetch HTML component content
   * @param {string} path - Component file path
   */
  async function fetchComponent(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load component: ${path}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Component loading error:', error);
      return '';
    }
  }

  /**
   * Load header component
   */
  async function loadHeader() {
    const placeholder = document.querySelector(CONFIG.headerPlaceholder);
    if (!placeholder) {
      console.warn('Header placeholder not found');
      return;
    }

    try {
      // Load header CSS first
      await loadCSS(CONFIG.headerCssPath, 'header-css');
      
      // Fetch and insert header HTML
      const headerHTML = await fetchComponent(CONFIG.headerPath);
      placeholder.innerHTML = headerHTML;
      
      // Execute inline scripts in the component
      const scripts = placeholder.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        script.parentNode.replaceChild(newScript, script);
      });
      
      // Load header JS
      await loadScript(CONFIG.headerJsPath, 'header-js');
      
      // Initialize header if function exists
      if (typeof initHeader === 'function') {
        initHeader();
      }
      
      console.log('✅ Header component loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load header:', error);
    }
  }

  /**
   * Load footer component
   */
  async function loadFooter() {
    const placeholder = document.querySelector(CONFIG.footerPlaceholder);
    if (!placeholder) {
      console.warn('Footer placeholder not found');
      return;
    }

    try {
      // Load footer CSS first
      await loadCSS(CONFIG.footerCssPath, 'footer-css');
      
      // Fetch and insert footer HTML
      const footerHTML = await fetchComponent(CONFIG.footerPath);
      placeholder.innerHTML = footerHTML;
      
      // Load footer JS
      await loadScript(CONFIG.footerJsPath, 'footer-js');
      
      // Initialize footer if class exists
      if (typeof LuxuryFooter === 'function') {
        new LuxuryFooter();
      }
      
      console.log('✅ Footer component loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load footer:', error);
    }
  }

  /**
   * Load all components
   */
  async function loadComponents() {
    await Promise.all([
      loadHeader(),
      loadFooter()
    ]);
    
    // Dispatch custom event when all components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  }

  /**
   * Set active navigation link based on current page
   */
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPath.includes(href.replace('../html/', '').replace('.html', ''))) {
        link.classList.add('active');
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
  } else {
    loadComponents();
  }

  // Set active link after components are loaded
  document.addEventListener('componentsLoaded', setActiveNavLink);

  // Export functions for manual use
  window.DestinovaComponents = {
    loadHeader,
    loadFooter,
    loadComponents,
    setActiveNavLink
  };

})();
