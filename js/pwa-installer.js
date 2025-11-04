// ===============================================
// DESTINOVA PWA INSTALLER
// Custom Install Prompt & PWA Management
// ===============================================

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        FIRST_VISIT_DELAY: 30000, // 30 seconds
        RETURNING_VISITOR_PAGES: 2,
        ENGAGED_USER_SEARCHES: 3,
        DISMISS_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
        STORAGE_KEY: 'pwa_install_dismissed',
        PAGE_VIEWS_KEY: 'pwa_page_views',
        SEARCH_COUNT_KEY: 'user_searches'
    };

    // State
    let deferredPrompt = null;
    let installBanner = null;

    // ===============================================
    // INITIALIZATION
    // ===============================================
    function init() {
        console.log('[PWA Installer] Initializing...');

        // Check if already installed
        if (isAppInstalled()) {
            console.log('[PWA Installer] App already installed');
            return;
        }

        // Check if recently dismissed
        if (isRecentlyDismissed()) {
            console.log('[PWA Installer] Install prompt recently dismissed');
            return;
        }

        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for app installed event
        window.addEventListener('appinstalled', handleAppInstalled);

        // Track page views
        trackPageView();

        // Track search interactions
        trackSearchActivity();

        // Determine when to show prompt
        scheduleInstallPrompt();
    }

    // ===============================================
    // EVENT HANDLERS
    // ===============================================
    function handleBeforeInstallPrompt(event) {
        console.log('[PWA Installer] Install prompt available');
        
        // Prevent default Chrome install prompt
        event.preventDefault();
        
        // Store the event for later use
        deferredPrompt = event;

        // Update UI to show custom install banner
        if (window.DestinovaInteractive) {
            window.DestinovaInteractive.showToast(
                'Destinova can be installed for offline access!',
                'info',
                5000
            );
        }
    }

    function handleAppInstalled(event) {
        console.log('[PWA Installer] App installed successfully');
        
        // Clear the deferredPrompt
        deferredPrompt = null;

        // Hide install banner if visible
        hideInstallBanner();

        // Show success message
        if (window.DestinovaInteractive) {
            window.DestinovaInteractive.showToast(
                'Welcome! Destinova is now installed.',
                'success',
                5000
            );
        }

        // Track installation
        trackInstallation();

        // Show onboarding tips
        setTimeout(() => {
            showOnboardingTips();
        }, 2000);
    }

    // ===============================================
    // INSTALL BANNER UI
    // ===============================================
    function createInstallBanner() {
        if (installBanner) return;

        const isMobile = window.innerWidth < 768;

        installBanner = document.createElement('div');
        installBanner.className = 'pwa-install-banner';
        installBanner.innerHTML = `
            <div class="banner-content">
                <div class="banner-icon">
                    <i class="fas fa-download"></i>
                </div>
                <div class="banner-text">
                    <h3>Install Destinova</h3>
                    <p>${isMobile ? 'Add to home screen for faster booking' : 'Install for offline access and faster performance'}</p>
                </div>
                <div class="banner-actions">
                    <button class="btn-install-primary" id="btnInstallNow">
                        <i class="fas fa-download"></i>
                        Install Now
                    </button>
                    <button class="btn-install-dismiss" id="btnInstallDismiss">
                        Maybe Later
                    </button>
                </div>
                <button class="banner-close" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(installBanner);

        // Add event listeners
        document.getElementById('btnInstallNow').addEventListener('click', handleInstallClick);
        document.getElementById('btnInstallDismiss').addEventListener('click', handleDismissClick);
        installBanner.querySelector('.banner-close').addEventListener('click', handleDismissClick);

        // Animate in
        setTimeout(() => {
            installBanner.classList.add('visible');
        }, 100);

        console.log('[PWA Installer] Install banner displayed');
    }

    function hideInstallBanner() {
        if (!installBanner) return;

        installBanner.classList.remove('visible');
        
        setTimeout(() => {
            installBanner.remove();
            installBanner = null;
        }, 300);
    }

    function handleInstallClick() {
        console.log('[PWA Installer] Install button clicked');

        if (!deferredPrompt) {
            console.warn('[PWA Installer] No deferred prompt available');
            
            if (window.DestinovaInteractive) {
                window.DestinovaInteractive.showToast(
                    'Install is not available. Please use your browser menu.',
                    'info',
                    5000
                );
            }
            
            hideInstallBanner();
            return;
        }

        // Show native install prompt
        deferredPrompt.prompt();

        // Wait for user choice
        deferredPrompt.userChoice.then((choiceResult) => {
            console.log('[PWA Installer] User choice:', choiceResult.outcome);

            if (choiceResult.outcome === 'accepted') {
                console.log('[PWA Installer] User accepted install');
                hideInstallBanner();
            } else {
                console.log('[PWA Installer] User dismissed install');
                handleDismissClick();
            }

            // Clear the deferred prompt
            deferredPrompt = null;
        });
    }

    function handleDismissClick() {
        console.log('[PWA Installer] Install dismissed');

        // Store dismissal timestamp
        localStorage.setItem(CONFIG.STORAGE_KEY, Date.now().toString());

        // Hide banner
        hideInstallBanner();

        // Show feedback
        if (window.DestinovaInteractive) {
            window.DestinovaInteractive.showToast(
                'You can install Destinova anytime from settings',
                'info',
                3000
            );
        }
    }

    // ===============================================
    // INSTALL TRIGGERS
    // ===============================================
    function scheduleInstallPrompt() {
        const pageViews = getPageViews();
        const searchCount = getSearchCount();

        // First-time visitor: Show after 30 seconds
        if (pageViews === 1) {
            console.log('[PWA Installer] First visit - scheduling prompt');
            setTimeout(() => {
                if (deferredPrompt) {
                    createInstallBanner();
                }
            }, CONFIG.FIRST_VISIT_DELAY);
        }
        
        // Returning visitor: Show after 2 page views
        else if (pageViews >= CONFIG.RETURNING_VISITOR_PAGES && !isRecentlyDismissed()) {
            console.log('[PWA Installer] Returning visitor - showing prompt');
            setTimeout(() => {
                if (deferredPrompt) {
                    createInstallBanner();
                }
            }, 5000);
        }
        
        // Engaged user: Show after 3 searches
        else if (searchCount >= CONFIG.ENGAGED_USER_SEARCHES && !isRecentlyDismissed()) {
            console.log('[PWA Installer] Engaged user - showing prompt');
            if (deferredPrompt) {
                createInstallBanner();
            }
        }
    }

    // ===============================================
    // TRACKING UTILITIES
    // ===============================================
    function trackPageView() {
        const pageViews = getPageViews();
        localStorage.setItem(CONFIG.PAGE_VIEWS_KEY, (pageViews + 1).toString());
        console.log('[PWA Installer] Page views:', pageViews + 1);
    }

    function getPageViews() {
        return parseInt(localStorage.getItem(CONFIG.PAGE_VIEWS_KEY) || '0', 10);
    }

    function trackSearchActivity() {
        // Listen for search submissions
        document.addEventListener('submit', (event) => {
            if (event.target.classList.contains('search-form') || 
                event.target.closest('.floating-search-card')) {
                
                const searchCount = getSearchCount();
                localStorage.setItem(CONFIG.SEARCH_COUNT_KEY, (searchCount + 1).toString());
                
                console.log('[PWA Installer] Search count:', searchCount + 1);

                // Show prompt after 3rd search
                if (searchCount + 1 >= CONFIG.ENGAGED_USER_SEARCHES && deferredPrompt && !installBanner) {
                    setTimeout(() => {
                        createInstallBanner();
                    }, 2000);
                }
            }
        });
    }

    function getSearchCount() {
        const searches = JSON.parse(localStorage.getItem('user_searches') || '[]');
        return searches.length;
    }

    function trackInstallation() {
        // Track in analytics
        if (window.DestinovaPerformance) {
            window.DestinovaPerformance.trackEvent('PWA', 'installed', 'success');
        }

        // Store installation date
        localStorage.setItem('pwa_installed_date', Date.now().toString());
    }

    // ===============================================
    // STATE CHECK UTILITIES
    // ===============================================
    function isAppInstalled() {
        // Check if running in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }

        // Check if iOS standalone
        if (window.navigator.standalone === true) {
            return true;
        }

        // Check if installed flag exists
        if (localStorage.getItem('pwa_installed_date')) {
            return true;
        }

        return false;
    }

    function isRecentlyDismissed() {
        const dismissedTime = localStorage.getItem(CONFIG.STORAGE_KEY);
        
        if (!dismissedTime) return false;

        const elapsed = Date.now() - parseInt(dismissedTime, 10);
        return elapsed < CONFIG.DISMISS_DURATION;
    }

    // ===============================================
    // ONBOARDING TIPS
    // ===============================================
    function showOnboardingTips() {
        if (!window.DestinovaInteractive) return;

        const tips = [
            'Tip: Destinova works offline - search flights anytime!',
            'Tip: Enable notifications for price drop alerts',
            'Tip: Bookmark favorite destinations for quick access'
        ];

        tips.forEach((tip, index) => {
            setTimeout(() => {
                window.DestinovaInteractive.showToast(tip, 'info', 5000);
            }, index * 6000);
        });
    }

    // ===============================================
    // SERVICE WORKER REGISTRATION
    // ===============================================
    function registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('[PWA Installer] Service Workers not supported');
            return;
        }

        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('[PWA Installer] Service Worker registered:', registration.scope);

                // Check for updates every hour
                setInterval(() => {
                    registration.update();
                }, 60 * 60 * 1000);

                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[PWA Installer] New version available');
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('[PWA Installer] Service Worker registration failed:', error);
            });
    }

    function showUpdateNotification() {
        if (!window.DestinovaInteractive) return;

        const updateBanner = document.createElement('div');
        updateBanner.className = 'pwa-update-banner';
        updateBanner.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>New version available!</span>
                <button id="btnUpdateNow">Update Now</button>
            </div>
        `;

        document.body.appendChild(updateBanner);

        document.getElementById('btnUpdateNow').addEventListener('click', () => {
            if (navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
            }
            window.location.reload();
        });

        setTimeout(() => {
            updateBanner.classList.add('visible');
        }, 100);
    }

    // ===============================================
    // PUBLIC API
    // ===============================================
    window.DestinoPWA = {
        showInstallPrompt: () => {
            if (deferredPrompt && !installBanner) {
                createInstallBanner();
            } else {
                console.warn('[PWA Installer] Install prompt not available');
            }
        },
        
        isInstalled: isAppInstalled,
        
        getInstallStatus: () => {
            return {
                installed: isAppInstalled(),
                promptAvailable: !!deferredPrompt,
                dismissed: isRecentlyDismissed()
            };
        }
    };

    // ===============================================
    // START
    // ===============================================
    // Register service worker immediately
    registerServiceWorker();

    // Initialize PWA installer when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[PWA Installer] Module loaded');

})();
