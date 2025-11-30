/**
 * 🔐 DESTINOVA AUTH CHECK
 * Authentication verification utility for protected pages
 * Include this script in pages that require authentication
 */

(function() {
    'use strict';

    const AuthCheck = {
        // Configuration
        config: {
            loginPage: '/html/sign-in.html',
            redirectParam: 'redirect',
            publicPages: [
                '/html/sign-in.html',
                '/html/sign-up.html',
                '/html/forgot-password.html',
                '/html/index.html',
                '/index.html',
                '/'
            ]
        },

        /**
         * Check if current page is public
         */
        isPublicPage() {
            const currentPath = window.location.pathname;
            return this.config.publicPages.some(page => 
                currentPath.endsWith(page) || currentPath === page
            );
        },

        /**
         * Check if user is authenticated
         */
        isAuthenticated() {
            if (typeof TokenManager !== 'undefined') {
                return TokenManager.isAuthenticated();
            }
            return !!localStorage.getItem('destinova_access_token');
        },

        /**
         * Get current user from storage
         */
        getUser() {
            if (typeof TokenManager !== 'undefined') {
                return TokenManager.getUser();
            }
            const user = localStorage.getItem('destinova_user');
            return user ? JSON.parse(user) : null;
        },

        /**
         * Redirect to login page with return URL
         */
        redirectToLogin() {
            const currentUrl = encodeURIComponent(window.location.href);
            window.location.href = `${this.config.loginPage}?${this.config.redirectParam}=${currentUrl}`;
        },

        /**
         * Redirect to intended page after login
         */
        redirectToIntended(defaultPage = '/html/index.html') {
            const params = new URLSearchParams(window.location.search);
            const redirect = params.get(this.config.redirectParam);
            
            if (redirect) {
                window.location.href = decodeURIComponent(redirect);
            } else {
                window.location.href = defaultPage;
            }
        },

        /**
         * Load user data and update UI
         */
        async loadUserData() {
            if (!this.isAuthenticated()) {
                return null;
            }

            let user = this.getUser();

            // If no cached user, fetch from API
            if (!user && typeof AuthAPI !== 'undefined') {
                try {
                    const response = await AuthAPI.getMe();
                    if (response.success && response.data) {
                        user = response.data;
                    }
                } catch (error) {
                    console.error('Failed to load user data:', error);
                    // Token might be invalid, clear it
                    if (error.status === 401) {
                        this.logout();
                    }
                    return null;
                }
            }

            // Update UI with user info
            if (user) {
                this.updateUserUI(user);
            }

            return user;
        },

        /**
         * Update UI elements with user information
         */
        updateUserUI(user) {
            // Update user name display
            const userNameElements = document.querySelectorAll('.user-name, [data-user-name]');
            userNameElements.forEach(el => {
                el.textContent = user.firstName || user.name || 'User';
            });

            // Update user email display
            const userEmailElements = document.querySelectorAll('.user-email, [data-user-email]');
            userEmailElements.forEach(el => {
                el.textContent = user.email || '';
            });

            // Update user avatar
            const avatarElements = document.querySelectorAll('.user-avatar, [data-user-avatar]');
            avatarElements.forEach(el => {
                if (user.profilePicture) {
                    el.src = user.profilePicture;
                } else {
                    // Generate initials avatar
                    const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
                    el.alt = initials.toUpperCase();
                }
            });

            // Update loyalty points
            const pointsElements = document.querySelectorAll('.loyalty-points, [data-loyalty-points]');
            pointsElements.forEach(el => {
                el.textContent = (user.loyaltyPoints || 0).toLocaleString();
            });

            // Show/hide auth-dependent elements
            document.querySelectorAll('[data-show-authenticated]').forEach(el => {
                el.style.display = 'block';
            });
            document.querySelectorAll('[data-hide-authenticated]').forEach(el => {
                el.style.display = 'none';
            });

            // Trigger custom event
            window.dispatchEvent(new CustomEvent('auth:userLoaded', { detail: { user } }));
        },

        /**
         * Update UI for logged out state
         */
        updateLoggedOutUI() {
            document.querySelectorAll('[data-show-authenticated]').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('[data-hide-authenticated]').forEach(el => {
                el.style.display = 'block';
            });
        },

        /**
         * Logout user
         */
        async logout() {
            if (typeof AuthAPI !== 'undefined') {
                await AuthAPI.logout();
            } else {
                localStorage.removeItem('destinova_access_token');
                localStorage.removeItem('destinova_refresh_token');
                localStorage.removeItem('destinova_user');
                localStorage.removeItem('isUserSignedIn');
            }
            
            this.updateLoggedOutUI();
            window.dispatchEvent(new CustomEvent('auth:logout'));
        },

        /**
         * Initialize authentication check
         * @param {Object} options - Configuration options
         * @param {boolean} options.requireAuth - If true, redirect to login if not authenticated
         * @param {boolean} options.loadUser - If true, load and display user data
         * @param {string} options.redirectTo - Custom login page URL
         */
        async init(options = {}) {
            const {
                requireAuth = false,
                loadUser = true,
                redirectTo = null
            } = options;

            if (redirectTo) {
                this.config.loginPage = redirectTo;
            }

            // If page requires auth and user is not authenticated
            if (requireAuth && !this.isAuthenticated()) {
                this.redirectToLogin();
                return null;
            }

            // Load user data if requested
            if (loadUser && this.isAuthenticated()) {
                return await this.loadUserData();
            }

            // Update UI for non-authenticated state
            if (!this.isAuthenticated()) {
                this.updateLoggedOutUI();
            }

            return null;
        },

        /**
         * Check if user has specific role
         */
        hasRole(role) {
            const user = this.getUser();
            if (!user) return false;
            return user.role === role;
        },

        /**
         * Check if user is admin
         */
        isAdmin() {
            return this.hasRole('admin');
        },

        /**
         * Require specific role or redirect
         */
        requireRole(role, redirectTo = '/html/index.html') {
            if (!this.hasRole(role)) {
                window.location.href = redirectTo;
                return false;
            }
            return true;
        }
    };

    // Listen for auth events
    window.addEventListener('auth:logout', () => {
        AuthCheck.updateLoggedOutUI();
    });

    // Auto-initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        // Check for data-require-auth attribute on body
        const body = document.body;
        const requireAuth = body.hasAttribute('data-require-auth');
        
        if (requireAuth) {
            AuthCheck.init({ requireAuth: true, loadUser: true });
        } else {
            // Just load user data if authenticated
            AuthCheck.init({ requireAuth: false, loadUser: true });
        }
    });

    // Export to window
    window.AuthCheck = AuthCheck;
})();
