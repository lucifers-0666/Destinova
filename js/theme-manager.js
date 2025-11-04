// ===============================================
// DESTINOVA THEME MANAGER
// Dark Mode Toggle & Persistence
// ===============================================

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'destinova_theme',
        THEMES: {
            LIGHT: 'light',
            DARK: 'dark',
            AUTO: 'auto'
        },
        TRANSITION_DURATION: 300
    };

    // State
    let currentTheme = CONFIG.THEMES.LIGHT;
    let systemPreference = CONFIG.THEMES.LIGHT;
    let themeToggleButton = null;

    // ===============================================
    // INITIALIZATION
    // ===============================================
    function init() {
        console.log('[Theme Manager] Initializing...');

        // Detect system preference
        detectSystemPreference();

        // Load saved theme or use system preference
        loadTheme();

        // Create theme toggle button
        createThemeToggle();

        // Listen for system preference changes
        watchSystemPreference();

        // Add keyboard shortcut (Alt + T)
        addKeyboardShortcut();

        console.log('[Theme Manager] Initialized with theme:', currentTheme);
    }

    // ===============================================
    // THEME DETECTION
    // ===============================================
    function detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            systemPreference = CONFIG.THEMES.DARK;
        } else {
            systemPreference = CONFIG.THEMES.LIGHT;
        }
        
        console.log('[Theme Manager] System preference:', systemPreference);
    }

    function watchSystemPreference() {
        if (!window.matchMedia) return;

        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        darkModeQuery.addEventListener('change', (event) => {
            systemPreference = event.matches ? CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;
            console.log('[Theme Manager] System preference changed:', systemPreference);

            // Auto-apply if user preference is 'auto'
            const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (!savedTheme || savedTheme === CONFIG.THEMES.AUTO) {
                applyTheme(systemPreference, true);
            }
        });
    }

    // ===============================================
    // THEME LOADING & SAVING
    // ===============================================
    function loadTheme() {
        const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEY);

        if (savedTheme === CONFIG.THEMES.AUTO || !savedTheme) {
            // Use system preference
            currentTheme = systemPreference;
        } else {
            // Use saved preference
            currentTheme = savedTheme;
        }

        applyTheme(currentTheme, false);
    }

    function saveTheme(theme) {
        localStorage.setItem(CONFIG.STORAGE_KEY, theme);
        console.log('[Theme Manager] Theme saved:', theme);

        // Track in analytics
        if (window.DestinovaPerformance) {
            window.DestinovaPerformance.trackEvent('Theme', 'changed', theme);
        }
    }

    // ===============================================
    // THEME APPLICATION
    // ===============================================
    function applyTheme(theme, animate = true) {
        const html = document.documentElement;
        const body = document.body;

        // Add transition class for smooth color changes
        if (animate) {
            body.classList.add('theme-transitioning');
        }

        // Apply theme
        if (theme === CONFIG.THEMES.DARK) {
            html.setAttribute('data-theme', 'dark');
            currentTheme = CONFIG.THEMES.DARK;
        } else {
            html.setAttribute('data-theme', 'light');
            currentTheme = CONFIG.THEMES.LIGHT;
        }

        // Update meta theme-color for mobile browsers
        updateMetaThemeColor(theme);

        // Update toggle button
        updateToggleButton();

        // Remove transition class after animation
        if (animate) {
            setTimeout(() => {
                body.classList.remove('theme-transitioning');
            }, CONFIG.TRANSITION_DURATION);
        }

        // Dispatch custom event for other modules
        window.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme: currentTheme } 
        }));

        console.log('[Theme Manager] Theme applied:', theme);
    }

    function updateMetaThemeColor(theme) {
        let themeColor = '#1d5e33'; // Light mode emerald

        if (theme === CONFIG.THEMES.DARK) {
            themeColor = '#0F1419'; // Dark mode background
        }

        // Update existing meta tag or create new one
        let metaTag = document.querySelector('meta[name="theme-color"]');
        
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'theme-color';
            document.head.appendChild(metaTag);
        }

        metaTag.content = themeColor;
    }

    // ===============================================
    // THEME TOGGLE UI (Three-State Toggle)
    // ===============================================
    function createThemeToggle() {
        // Create toggle button
        themeToggleButton = document.createElement('button');
        themeToggleButton.className = 'theme-toggle';
        themeToggleButton.setAttribute('aria-label', 'Toggle theme mode');
        themeToggleButton.setAttribute('title', 'Toggle theme: Light / Dark / Auto (Alt + T)');
        
        updateToggleButton();
        
        // Click cycles through: light → dark → auto → light
        themeToggleButton.addEventListener('click', cycleTheme);
        
        // Right-click shows theme menu
        themeToggleButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showThemeMenu();
        });
        
        document.body.appendChild(themeToggleButton);
    }

    function updateToggleButton() {
        if (!themeToggleButton) return;

        const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEY);
        let icon = 'fa-moon'; // Default: light mode, show moon to switch to dark
        let label = 'Switch to dark mode';
        
        if (savedTheme === CONFIG.THEMES.AUTO) {
            icon = 'fa-circle-half-stroke'; // Auto mode
            label = 'Auto mode (follows system)';
        } else if (currentTheme === CONFIG.THEMES.DARK) {
            icon = 'fa-sun'; // Dark mode, show sun to switch to light
            label = 'Switch to light mode';
        }
        
        themeToggleButton.innerHTML = `
            <div class="theme-icon-wrapper">
                <i class="fas ${icon}"></i>
            </div>
        `;

        themeToggleButton.setAttribute('aria-label', label);
        themeToggleButton.setAttribute('title', `${label} (Alt + T)`);
    }

    function showThemeMenu() {
        // Create theme selection menu
        const menu = document.createElement('div');
        menu.className = 'theme-menu';
        menu.innerHTML = `
            <button class="theme-option" data-theme="light">
                <i class="fas fa-sun"></i>
                <span>Light</span>
                ${currentTheme === CONFIG.THEMES.LIGHT && localStorage.getItem(CONFIG.STORAGE_KEY) !== CONFIG.THEMES.AUTO ? '<i class="fas fa-check"></i>' : ''}
            </button>
            <button class="theme-option" data-theme="dark">
                <i class="fas fa-moon"></i>
                <span>Dark</span>
                ${currentTheme === CONFIG.THEMES.DARK && localStorage.getItem(CONFIG.STORAGE_KEY) !== CONFIG.THEMES.AUTO ? '<i class="fas fa-check"></i>' : ''}
            </button>
            <button class="theme-option" data-theme="auto">
                <i class="fas fa-circle-half-stroke"></i>
                <span>Auto</span>
                ${localStorage.getItem(CONFIG.STORAGE_KEY) === CONFIG.THEMES.AUTO ? '<i class="fas fa-check"></i>' : ''}
            </button>
        `;
        
        // Position near toggle button
        const rect = themeToggleButton.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 10}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;
        
        document.body.appendChild(menu);
        
        // Add event listeners
        menu.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                setTheme(theme);
                menu.remove();
            });
        });
        
        // Close menu when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && e.target !== themeToggleButton) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
        
        // Animate in
        setTimeout(() => menu.classList.add('visible'), 10);
    }
    
    function cycleTheme() {
        const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEY);
        let nextTheme;
        
        // Cycle: light → dark → auto → light
        if (!savedTheme || savedTheme === CONFIG.THEMES.LIGHT) {
            nextTheme = CONFIG.THEMES.DARK;
        } else if (savedTheme === CONFIG.THEMES.DARK) {
            nextTheme = CONFIG.THEMES.AUTO;
        } else {
            nextTheme = CONFIG.THEMES.LIGHT;
        }
        
        setTheme(nextTheme);
        
        // Show feedback
        const messages = {
            [CONFIG.THEMES.LIGHT]: '☀️ Light mode',
            [CONFIG.THEMES.DARK]: '🌙 Dark mode',
            [CONFIG.THEMES.AUTO]: '🔄 Auto mode (follows system)'
        };
        
        if (window.DestinovaInteractive) {
            window.DestinovaInteractive.showToast(messages[nextTheme], 'info', 2000);
        }
        
        animateToggleButton();
    }

    // ===============================================
    // THEME TOGGLE ACTIONS
    // ===============================================
    function toggleTheme() {
        const newTheme = currentTheme === CONFIG.THEMES.LIGHT ? 
            CONFIG.THEMES.DARK : CONFIG.THEMES.LIGHT;

        applyTheme(newTheme, true);
        saveTheme(newTheme);

        // Show feedback toast
        if (window.DestinovaInteractive) {
            const message = newTheme === CONFIG.THEMES.DARK ? 
                '🌙 Dark mode enabled' : '☀️ Light mode enabled';
            window.DestinovaInteractive.showToast(message, 'info', 2000);
        }

        // Animate button
        animateToggleButton();
    }

    function animateToggleButton() {
        if (!themeToggleButton) return;

        themeToggleButton.classList.add('toggling');
        
        setTimeout(() => {
            themeToggleButton.classList.remove('toggling');
        }, 600);
    }

    // ===============================================
    // KEYBOARD SHORTCUT
    // ===============================================
    function addKeyboardShortcut() {
        document.addEventListener('keydown', (event) => {
            // Alt + T
            if (event.altKey && event.key.toLowerCase() === 't') {
                event.preventDefault();
                toggleTheme();
            }
        });

        console.log('[Theme Manager] Keyboard shortcut enabled: Alt + T');
    }

    // ===============================================
    // UTILITY FUNCTIONS
    // ===============================================
    function getCurrentTheme() {
        return currentTheme;
    }

    function getSystemPreference() {
        return systemPreference;
    }

    function setTheme(theme) {
        if (!Object.values(CONFIG.THEMES).includes(theme)) {
            console.warn('[Theme Manager] Invalid theme:', theme);
            return;
        }

        if (theme === CONFIG.THEMES.AUTO) {
            applyTheme(systemPreference, true);
        } else {
            applyTheme(theme, true);
        }

        saveTheme(theme);
    }

    // ===============================================
    // AUTO DARK MODE (Time-based)
    // ===============================================
    function enableAutoDarkMode() {
        const hour = new Date().getHours();
        
        // Auto dark mode between 6 PM and 6 AM
        if (hour >= 18 || hour < 6) {
            if (currentTheme !== CONFIG.THEMES.DARK) {
                applyTheme(CONFIG.THEMES.DARK, true);
                
                if (window.DestinovaInteractive) {
                    window.DestinovaInteractive.showToast(
                        '🌙 Auto dark mode enabled for evening',
                        'info',
                        3000
                    );
                }
            }
        } else {
            if (currentTheme !== CONFIG.THEMES.LIGHT) {
                applyTheme(CONFIG.THEMES.LIGHT, true);
            }
        }
    }

    // ===============================================
    // PUBLIC API
    // ===============================================
    window.DestinovaTheme = {
        toggle: toggleTheme,
        set: setTheme,
        get: getCurrentTheme,
        getSystemPreference: getSystemPreference,
        enableAuto: enableAutoDarkMode,
        
        // Theme constants
        THEMES: CONFIG.THEMES
    };

    // ===============================================
    // START
    // ===============================================
    // Initialize immediately to prevent flash of wrong theme
    if (document.readyState === 'loading') {
        // Load theme before DOM ready to prevent flash
        const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEY);
        const systemDark = window.matchMedia && 
            window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === CONFIG.THEMES.DARK || 
            (!savedTheme && systemDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[Theme Manager] Module loaded');

})();
