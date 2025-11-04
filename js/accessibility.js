// ===============================================
// DESTINOVA ACCESSIBILITY ENHANCEMENTS
// WCAG AAA Compliance & Enhanced Accessibility
// ===============================================

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'destinova_accessibility',
        FOCUS_OUTLINE_WIDTH: '3px',
        SKIP_LINK_TARGETS: ['#main-content', '#search-section', '#footer'],
        HIGH_CONTRAST_RATIO: 7, // WCAG AAA
        FONT_SIZES: {
            NORMAL: 16,
            LARGE: 18,
            XLARGE: 20
        }
    };

    // State
    let settings = {
        fontSize: CONFIG.FONT_SIZES.NORMAL,
        highContrast: false,
        reduceMotion: false,
        focusIndicators: true,
        keyboardNav: true,
        screenReaderOptimized: false
    };

    // ===============================================
    // INITIALIZATION
    // ===============================================
    function init() {
        console.log('[Accessibility] Initializing...');

        // Load saved settings
        loadSettings();

        // Create accessibility toolbar
        createAccessibilityToolbar();

        // Add skip links
        addSkipLinks();

        // Enhance keyboard navigation
        enhanceKeyboardNavigation();

        // Add focus indicators
        addFocusIndicators();

        // Add ARIA live regions
        addLiveRegions();

        // Enhance form accessibility
        enhanceFormAccessibility();

        // Monitor dynamic content
        observeDynamicContent();

        // Add keyboard shortcuts
        addKeyboardShortcuts();

        // Detect user preferences
        detectUserPreferences();

        // Apply saved settings
        applySettings();

        console.log('[Accessibility] Initialized');
    }

    // ===============================================
    // SETTINGS MANAGEMENT
    // ===============================================
    function loadSettings() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        
        if (saved) {
            try {
                settings = { ...settings, ...JSON.parse(saved) };
            } catch (error) {
                console.error('[Accessibility] Failed to load settings:', error);
            }
        }
    }

    function saveSettings() {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(settings));
        console.log('[Accessibility] Settings saved');
    }

    function applySettings() {
        applyFontSize(settings.fontSize);
        applyHighContrast(settings.highContrast);
        applyReduceMotion(settings.reduceMotion);
    }

    // ===============================================
    // ACCESSIBILITY TOOLBAR
    // ===============================================
    function createAccessibilityToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'accessibility-toolbar';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Accessibility controls');
        
        toolbar.innerHTML = `
            <button class="a11y-toggle-btn" aria-label="Toggle accessibility menu">
                <i class="fas fa-universal-access"></i>
            </button>
            
            <div class="a11y-menu" role="menu" hidden>
                <h3>Accessibility Options</h3>
                
                <div class="a11y-option">
                    <label>
                        <span>Font Size</span>
                        <select id="a11y-font-size" aria-label="Select font size">
                            <option value="${CONFIG.FONT_SIZES.NORMAL}">Normal</option>
                            <option value="${CONFIG.FONT_SIZES.LARGE}">Large</option>
                            <option value="${CONFIG.FONT_SIZES.XLARGE}">Extra Large</option>
                        </select>
                    </label>
                </div>
                
                <div class="a11y-option">
                    <label>
                        <input type="checkbox" id="a11y-high-contrast" />
                        <span>High Contrast</span>
                    </label>
                </div>
                
                <div class="a11y-option">
                    <label>
                        <input type="checkbox" id="a11y-reduce-motion" />
                        <span>Reduce Motion</span>
                    </label>
                </div>
                
                <div class="a11y-option">
                    <label>
                        <input type="checkbox" id="a11y-focus-indicators" checked />
                        <span>Enhanced Focus Indicators</span>
                    </label>
                </div>
                
                <div class="a11y-option">
                    <label>
                        <input type="checkbox" id="a11y-screen-reader" />
                        <span>Screen Reader Optimizations</span>
                    </label>
                </div>
                
                <button class="btn-reset-a11y" aria-label="Reset accessibility settings">
                    Reset to Default
                </button>
            </div>
        `;

        document.body.appendChild(toolbar);

        // Add event listeners
        setupToolbarEvents(toolbar);
    }

    function setupToolbarEvents(toolbar) {
        const toggleBtn = toolbar.querySelector('.a11y-toggle-btn');
        const menu = toolbar.querySelector('.a11y-menu');
        const fontSizeSelect = toolbar.querySelector('#a11y-font-size');
        const highContrastCheckbox = toolbar.querySelector('#a11y-high-contrast');
        const reduceMotionCheckbox = toolbar.querySelector('#a11y-reduce-motion');
        const focusIndicatorsCheckbox = toolbar.querySelector('#a11y-focus-indicators');
        const screenReaderCheckbox = toolbar.querySelector('#a11y-screen-reader');
        const resetBtn = toolbar.querySelector('.btn-reset-a11y');

        // Toggle menu
        toggleBtn.addEventListener('click', () => {
            const isHidden = menu.hasAttribute('hidden');
            
            if (isHidden) {
                menu.removeAttribute('hidden');
                toggleBtn.setAttribute('aria-expanded', 'true');
            } else {
                menu.setAttribute('hidden', '');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Font size
        fontSizeSelect.value = settings.fontSize;
        fontSizeSelect.addEventListener('change', (e) => {
            settings.fontSize = parseInt(e.target.value, 10);
            applyFontSize(settings.fontSize);
            saveSettings();
            announceChange('Font size changed');
        });

        // High contrast
        highContrastCheckbox.checked = settings.highContrast;
        highContrastCheckbox.addEventListener('change', (e) => {
            settings.highContrast = e.target.checked;
            applyHighContrast(settings.highContrast);
            saveSettings();
            announceChange(settings.highContrast ? 'High contrast enabled' : 'High contrast disabled');
        });

        // Reduce motion
        reduceMotionCheckbox.checked = settings.reduceMotion;
        reduceMotionCheckbox.addEventListener('change', (e) => {
            settings.reduceMotion = e.target.checked;
            applyReduceMotion(settings.reduceMotion);
            saveSettings();
            announceChange(settings.reduceMotion ? 'Motion reduced' : 'Motion enabled');
        });

        // Focus indicators
        focusIndicatorsCheckbox.checked = settings.focusIndicators;
        focusIndicatorsCheckbox.addEventListener('change', (e) => {
            settings.focusIndicators = e.target.checked;
            saveSettings();
            announceChange(settings.focusIndicators ? 'Focus indicators enabled' : 'Focus indicators disabled');
        });

        // Screen reader
        screenReaderCheckbox.checked = settings.screenReaderOptimized;
        screenReaderCheckbox.addEventListener('change', (e) => {
            settings.screenReaderOptimized = e.target.checked;
            optimizeForScreenReader(settings.screenReaderOptimized);
            saveSettings();
            announceChange(settings.screenReaderOptimized ? 'Screen reader mode enabled' : 'Screen reader mode disabled');
        });

        // Reset
        resetBtn.addEventListener('click', () => {
            resetSettings();
            // Update UI
            fontSizeSelect.value = settings.fontSize;
            highContrastCheckbox.checked = settings.highContrast;
            reduceMotionCheckbox.checked = settings.reduceMotion;
            focusIndicatorsCheckbox.checked = settings.focusIndicators;
            screenReaderCheckbox.checked = settings.screenReaderOptimized;
            announceChange('Settings reset to default');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toolbar.contains(e.target) && !menu.hasAttribute('hidden')) {
                menu.setAttribute('hidden', '');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ===============================================
    // FONT SIZE ADJUSTMENT
    // ===============================================
    function applyFontSize(size) {
        document.documentElement.style.setProperty('--base-font-size', `${size}px`);
        
        // Adjust related sizes proportionally
        const scale = size / CONFIG.FONT_SIZES.NORMAL;
        document.documentElement.style.setProperty('--font-scale', scale);
        
        console.log('[Accessibility] Font size set to:', size);
    }

    // ===============================================
    // HIGH CONTRAST MODE
    // ===============================================
    function applyHighContrast(enabled) {
        if (enabled) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }
        
        console.log('[Accessibility] High contrast:', enabled);
    }

    // ===============================================
    // REDUCE MOTION
    // ===============================================
    function applyReduceMotion(enabled) {
        if (enabled) {
            document.documentElement.classList.add('reduce-motion');
            
            // Disable GSAP animations
            if (window.gsap) {
                window.gsap.globalTimeline.timeScale(10000);
            }
            
            // Disable AOS
            if (window.AOS) {
                window.AOS.refreshHard();
            }
        } else {
            document.documentElement.classList.remove('reduce-motion');
            
            // Re-enable animations
            if (window.gsap) {
                window.gsap.globalTimeline.timeScale(1);
            }
        }
        
        console.log('[Accessibility] Reduce motion:', enabled);
    }

    // ===============================================
    // SKIP LINKS
    // ===============================================
    function addSkipLinks() {
        const skipLinksContainer = document.createElement('div');
        skipLinksContainer.className = 'skip-links';
        skipLinksContainer.setAttribute('role', 'navigation');
        skipLinksContainer.setAttribute('aria-label', 'Skip links');
        
        // Add skip to main content as first link
        const skipLinks = `
            <a href="#main-content" class="skip-link skip-to-main">Skip to main content</a>
            <a href="#search-section" class="skip-link">Skip to search</a>
            <a href="#footer" class="skip-link">Skip to footer</a>
        `;
        
        skipLinksContainer.innerHTML = skipLinks;
        document.body.insertBefore(skipLinksContainer, document.body.firstChild);
        
        // Add smooth scroll behavior to skip links
        skipLinksContainer.querySelectorAll('.skip-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId) || 
                                     document.querySelector('main') ||
                                     document.querySelector('.hero-section');
                
                if (targetElement) {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Announce to screen reader
                    announceChange(`Navigated to ${link.textContent}`, 'polite');
                }
            });
        });
        
        console.log('[Accessibility] Skip links added');
    }

    // ===============================================
    // KEYBOARD NAVIGATION
    // ===============================================
    function enhanceKeyboardNavigation() {
        // Add keyboard focus class to body when tab is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav-active');
            }
        });

        // Remove keyboard focus class when mouse is used
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav-active');
        });

        // Add roving tabindex to card grids
        setupRovingTabindex('.destination-grid', '.destination-card');
        setupRovingTabindex('.features-grid', '.feature-card');
        setupRovingTabindex('.offers-grid', '.offer-card');
    }

    function setupRovingTabindex(containerSelector, itemSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const items = container.querySelectorAll(itemSelector);
        if (items.length === 0) return;

        let currentIndex = 0;

        // Set initial tabindex
        items.forEach((item, index) => {
            item.setAttribute('tabindex', index === 0 ? '0' : '-1');
        });

        // Handle arrow keys
        container.addEventListener('keydown', (e) => {
            if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
                return;
            }

            e.preventDefault();

            items[currentIndex].setAttribute('tabindex', '-1');

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                currentIndex = (currentIndex + 1) % items.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
            } else if (e.key === 'Home') {
                currentIndex = 0;
            } else if (e.key === 'End') {
                currentIndex = items.length - 1;
            }

            items[currentIndex].setAttribute('tabindex', '0');
            items[currentIndex].focus();
        });
    }

    // ===============================================
    // FOCUS INDICATORS
    // ===============================================
    function addFocusIndicators() {
        // Add enhanced focus styles
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-nav-active *:focus {
                outline: ${CONFIG.FOCUS_OUTLINE_WIDTH} solid var(--primary-emerald);
                outline-offset: 2px;
                box-shadow: 0 0 0 4px rgba(29, 94, 51, 0.2);
            }
            
            .keyboard-nav-active button:focus,
            .keyboard-nav-active a:focus {
                outline: ${CONFIG.FOCUS_OUTLINE_WIDTH} solid var(--gold-rich);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    // ===============================================
    // ARIA LIVE REGIONS
    // ===============================================
    function addLiveRegions() {
        // Create polite announcement region
        const politeRegion = document.createElement('div');
        politeRegion.id = 'aria-live-polite';
        politeRegion.className = 'sr-only';
        politeRegion.setAttribute('aria-live', 'polite');
        politeRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(politeRegion);

        // Create assertive announcement region
        const assertiveRegion = document.createElement('div');
        assertiveRegion.id = 'aria-live-assertive';
        assertiveRegion.className = 'sr-only';
        assertiveRegion.setAttribute('aria-live', 'assertive');
        assertiveRegion.setAttribute('aria-atomic', 'true');
        document.body.appendChild(assertiveRegion);

        console.log('[Accessibility] ARIA live regions added');
    }

    function announceChange(message, priority = 'polite') {
        const regionId = priority === 'assertive' ? 'aria-live-assertive' : 'aria-live-polite';
        const region = document.getElementById(regionId);
        
        if (region) {
            region.textContent = '';
            setTimeout(() => {
                region.textContent = message;
            }, 100);
        }
    }

    // ===============================================
    // FORM ACCESSIBILITY
    // ===============================================
    function enhanceFormAccessibility() {
        // Add required field indicators
        document.querySelectorAll('input[required], select[required], textarea[required]').forEach((field) => {
            if (!field.hasAttribute('aria-required')) {
                field.setAttribute('aria-required', 'true');
            }

            // Add visual required indicator
            const label = document.querySelector(`label[for="${field.id}"]`);
            if (label && !label.querySelector('.required-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'required-indicator';
                indicator.setAttribute('aria-label', 'required');
                indicator.textContent = ' *';
                label.appendChild(indicator);
            }
        });

        // Add error announcements
        document.querySelectorAll('input, select, textarea').forEach((field) => {
            field.addEventListener('invalid', (e) => {
                announceChange(`Error in ${field.name || 'form field'}: ${field.validationMessage}`, 'assertive');
            });
        });
    }

    // ===============================================
    // DYNAMIC CONTENT OBSERVER
    // ===============================================
    function observeDynamicContent() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Add ARIA attributes to new content
                        enhanceElement(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function enhanceElement(element) {
        // Add role to interactive elements without proper semantics
        if (element.onclick && !element.getAttribute('role')) {
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
        }

        // Enhance images without alt text
        if (element.tagName === 'IMG' && !element.hasAttribute('alt')) {
            element.setAttribute('alt', '');
            element.setAttribute('role', 'presentation');
        }
    }

    // ===============================================
    // SCREEN READER OPTIMIZATION
    // ===============================================
    function optimizeForScreenReader(enabled) {
        if (enabled) {
            // Add descriptive labels
            document.querySelectorAll('button, a, input').forEach((el) => {
                if (!el.hasAttribute('aria-label') && !el.textContent.trim()) {
                    el.setAttribute('aria-label', el.className || 'interactive element');
                }
            });

            // Hide decorative elements
            document.querySelectorAll('.decorative, [data-decorative]').forEach((el) => {
                el.setAttribute('aria-hidden', 'true');
            });
        }
    }

    // ===============================================
    // KEYBOARD SHORTCUTS
    // ===============================================
    function addKeyboardShortcuts() {
        const shortcuts = [
            { key: '/', action: () => focusSearch(), description: 'Focus search' },
            { key: 'h', action: () => scrollToTop(), description: 'Go to top' },
            { key: '?', action: () => showKeyboardHelp(), description: 'Show keyboard shortcuts' }
        ];

        document.addEventListener('keydown', (e) => {
            // Don't trigger if user is typing in an input
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
                return;
            }

            shortcuts.forEach((shortcut) => {
                if (e.key === shortcut.key) {
                    e.preventDefault();
                    shortcut.action();
                }
            });
        });

        console.log('[Accessibility] Keyboard shortcuts enabled');
    }

    function focusSearch() {
        const searchInput = document.querySelector('#fromLocation, [name="search"], input[type="search"]');
        if (searchInput) {
            searchInput.focus();
            announceChange('Search focused');
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        announceChange('Scrolled to top');
    }

    function showKeyboardHelp() {
        const helpText = `
            Keyboard Shortcuts:
            / - Focus search
            h - Go to top
            ? - Show this help
            Alt + T - Toggle dark mode
            Tab - Navigate forward
            Shift + Tab - Navigate backward
        `;
        
        alert(helpText);
    }

    // ===============================================
    // USER PREFERENCE DETECTION
    // ===============================================
    function detectUserPreferences() {
        // Detect reduced motion preference
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            settings.reduceMotion = true;
            applyReduceMotion(true);
            console.log('[Accessibility] Reduced motion detected from system');
        }

        // Detect high contrast preference
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            settings.highContrast = true;
            applyHighContrast(true);
            console.log('[Accessibility] High contrast detected from system');
        }
    }

    // ===============================================
    // RESET SETTINGS
    // ===============================================
    function resetSettings() {
        settings = {
            fontSize: CONFIG.FONT_SIZES.NORMAL,
            highContrast: false,
            reduceMotion: false,
            focusIndicators: true,
            keyboardNav: true,
            screenReaderOptimized: false
        };
        
        applySettings();
        saveSettings();
        
        console.log('[Accessibility] Settings reset');
    }

    // ===============================================
    // PUBLIC API
    // ===============================================
    window.DestinovaAccessibility = {
        announce: announceChange,
        setFontSize: applyFontSize,
        toggleHighContrast: () => {
            settings.highContrast = !settings.highContrast;
            applyHighContrast(settings.highContrast);
            saveSettings();
        },
        toggleReduceMotion: () => {
            settings.reduceMotion = !settings.reduceMotion;
            applyReduceMotion(settings.reduceMotion);
            saveSettings();
        },
        getSettings: () => ({ ...settings }),
        reset: resetSettings
    };

    // ===============================================
    // START
    // ===============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[Accessibility] Module loaded');

})();
