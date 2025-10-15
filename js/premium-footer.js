/* ═══════════════════════════════════════════════════════════════════════════════
   PREMIUM FOOTER - JAVASCRIPT FUNCTIONALITY
   Destinova Flight Booking - Interactive Features & Animations
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    /* ═══════════════════════════════════════════════════════════════════════════════
       NEWSLETTER SUBSCRIPTION
       ═══════════════════════════════════════════════════════════════════════════════ */

    // Newsletter form submission
    function initNewsletterForm() {
        const form = document.querySelector('.newsletter-form-container');
        const emailInput = document.querySelector('.newsletter-email-input');
        const submitBtn = document.querySelector('.newsletter-submit-btn');
        const interestsToggle = document.querySelector('.interests-toggle-button');
        const interestsGrid = document.querySelector('.interests-grid');

        // Toggle interests section
        if (interestsToggle && interestsGrid) {
            interestsToggle.addEventListener('click', function() {
                this.classList.toggle('expanded');
                interestsGrid.classList.toggle('visible');
            });
        }

        // Form submission
        if (submitBtn && emailInput) {
            submitBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const email = emailInput.value.trim();
                
                // Simple email validation
                if (!email || !isValidEmail(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    emailInput.focus();
                    return;
                }

                // Get selected interests
                const selectedInterests = [];
                document.querySelectorAll('.checkbox-input:checked').forEach(checkbox => {
                    const label = checkbox.parentElement.querySelector('.checkbox-label');
                    if (label) {
                        selectedInterests.push(label.textContent.trim());
                    }
                });

                // Show loading state
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                const originalText = submitBtn.querySelector('.btn-text') || submitBtn;
                const originalContent = originalText.textContent;
                originalText.textContent = 'Subscribing...';

                // Simulate API call (replace with actual API endpoint)
                setTimeout(() => {
                    // Success state
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('success');
                    originalText.textContent = "You're subscribed!";
                    
                    // Show confetti animation
                    createConfetti(submitBtn);

                    // Show success notification
                    showNotification('Welcome! Check your inbox for confirmation.', 'success');

                    // Reset form after 3 seconds
                    setTimeout(() => {
                        emailInput.value = '';
                        document.querySelectorAll('.checkbox-input:checked').forEach(cb => cb.checked = false);
                        submitBtn.classList.remove('success');
                        submitBtn.disabled = false;
                        originalText.textContent = originalContent;
                    }, 3000);

                    // Log subscription (replace with actual tracking)
                    console.log('Newsletter subscription:', {
                        email: email,
                        interests: selectedInterests,
                        timestamp: new Date().toISOString()
                    });

                }, 2000);
            });

            // Enter key submission
            emailInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    submitBtn.click();
                }
            });
        }
    }

    // Email validation
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Confetti animation
    function createConfetti(button) {
        const colors = ['#E5CBAF', '#1d5e33', '#2a7d4a', '#FF6138', '#ffffff'];
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '10000';
            document.body.appendChild(particle);

            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 3 + Math.random() * 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            animateParticle(particle, vx, vy);
        }
    }

    function animateParticle(particle, vx, vy) {
        let x = 0, y = 0;
        let opacity = 1;
        let gravity = 0.1;
        let rotation = 0;

        function update() {
            x += vx;
            y += vy;
            vy += gravity;
            opacity -= 0.02;
            rotation += 10;

            particle.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(update);
            } else {
                particle.remove();
            }
        }

        update();
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #2a7d4a, #1d5e33)' : 
                          type === 'error' ? 'linear-gradient(135deg, #D93025, #FF6138)' : 
                          'linear-gradient(135deg, #E5CBAF, #c9a877)'};
            color: #ffffff;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            max-width: 320px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    /* ═══════════════════════════════════════════════════════════════════════════════
       BACK TO TOP BUTTON
       ═══════════════════════════════════════════════════════════════════════════════ */

    function initBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top-btn');
        
        if (!backToTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════
       MOBILE ACCORDION NAVIGATION
       ═══════════════════════════════════════════════════════════════════════════════ */

    function initMobileAccordion() {
        if (window.innerWidth >= 768) return;

        const navColumns = document.querySelectorAll('.footer-nav-column:not(.footer-brand-column)');
        
        navColumns.forEach(column => {
            const header = column.querySelector('.footer-column-header');
            const linksList = column.querySelector('.footer-links-list');
            
            if (!header || !linksList) return;

            // Hide all lists by default on mobile
            linksList.style.maxHeight = '0';
            linksList.style.overflow = 'hidden';
            linksList.style.transition = 'max-height 0.4s ease';

            // Add chevron icon
            const chevron = document.createElement('span');
            chevron.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
            chevron.style.transition = 'transform 0.3s ease';
            header.appendChild(chevron);

            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                const isOpen = linksList.style.maxHeight !== '0px';
                
                // Close all other sections
                navColumns.forEach(col => {
                    const list = col.querySelector('.footer-links-list');
                    const chev = col.querySelector('.footer-column-header svg');
                    if (list && list !== linksList) {
                        list.style.maxHeight = '0';
                        if (chev) chev.style.transform = 'rotate(0deg)';
                    }
                });

                // Toggle current section
                if (isOpen) {
                    linksList.style.maxHeight = '0';
                    chevron.style.transform = 'rotate(0deg)';
                } else {
                    linksList.style.maxHeight = linksList.scrollHeight + 'px';
                    chevron.style.transform = 'rotate(180deg)';
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════
       CURRENCY & LANGUAGE SELECTORS
       ═══════════════════════════════════════════════════════════════════════════════ */

    function initCurrencySelector() {
        const currencyButtons = document.querySelectorAll('.currency-btn');
        
        currencyButtons.forEach(button => {
            button.addEventListener('click', function() {
                currencyButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const currency = this.textContent.trim();
                localStorage.setItem('preferredCurrency', currency);
                
                // Trigger currency change event (for other components)
                window.dispatchEvent(new CustomEvent('currencyChange', { 
                    detail: { currency: currency }
                }));
            });
        });

        // Set initial active state from localStorage
        const savedCurrency = localStorage.getItem('preferredCurrency') || 'INR';
        currencyButtons.forEach(button => {
            if (button.textContent.trim() === savedCurrency) {
                button.classList.add('active');
            }
        });
    }

    function initLanguageSelector() {
        const languageButtons = document.querySelectorAll('.language-btn');
        
        languageButtons.forEach(button => {
            button.addEventListener('click', function() {
                languageButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const language = this.textContent.trim();
                localStorage.setItem('preferredLanguage', language);
                
                // Trigger language change event
                window.dispatchEvent(new CustomEvent('languageChange', { 
                    detail: { language: language }
                }));
            });
        });

        // Set initial active state
        const savedLanguage = localStorage.getItem('preferredLanguage') || '🇮🇳 EN';
        languageButtons.forEach(button => {
            if (button.textContent.trim() === savedLanguage) {
                button.classList.add('active');
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════
       THEME TOGGLE
       ═══════════════════════════════════════════════════════════════════════════════ */

    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle-btn');
        
        if (!themeToggle) return;

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon (if using separate sun/moon icons)
            const icon = this.querySelector('svg');
            if (icon) {
                // Icon swap logic here
            }
        });

        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }

    /* ═══════════════════════════════════════════════════════════════════════════════
       SCROLL ANIMATIONS
       ═══════════════════════════════════════════════════════════════════════════════ */

    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = entry.target.getAttribute('data-animation') || 'fadeInUp 0.8s ease forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll('.footer-newsletter-hero, .footer-nav-column, .payment-logo-item');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.setAttribute('data-animation', `fadeInUp 0.8s ease ${index * 0.1}s forwards`);
            observer.observe(el);
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════
       LINK TRACKING (Analytics)
       ═══════════════════════════════════════════════════════════════════════════════ */

    function initLinkTracking() {
        const footerLinks = document.querySelectorAll('.footer-link-item, .social-icon-btn, .app-badge-btn');
        
        footerLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const linkText = this.textContent.trim() || this.getAttribute('aria-label') || 'Unknown';
                const linkSection = this.closest('.footer-nav-column, .footer-brand-column')
                    ?.querySelector('.footer-column-header, .footer-social-heading')
                    ?.textContent.trim() || 'Footer';
                
                // Track link click (replace with your analytics service)
                console.log('Footer Link Click:', {
                    section: linkSection,
                    link: linkText,
                    timestamp: new Date().toISOString()
                });

                // Send to analytics (example)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'footer_link_click', {
                        'event_category': 'Footer Navigation',
                        'event_label': `${linkSection} - ${linkText}`
                    });
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════
       LIVE CHAT WIDGET
       ═══════════════════════════════════════════════════════════════════════════════ */

    function initLiveChat() {
        const chatBtn = document.querySelector('.live-chat-btn');
        
        if (!chatBtn) return;

        chatBtn.addEventListener('click', function() {
            // Open chat widget (replace with your chat service integration)
            console.log('Opening live chat...');
            
            // Example: Intercom, Drift, or custom chat
            // if (typeof Intercom !== 'undefined') {
            //     Intercom('show');
            // }
            
            showNotification('Live chat opening...', 'info');
        });

        // Simulate unread messages (for demo)
        // In production, this would come from your chat service
        setTimeout(() => {
            const badge = document.querySelector('.chat-notification-badge');
            if (badge) {
                badge.textContent = '1';
            }
        }, 5000);
    }

    /* ═══════════════════════════════════════════════════════════════════════════════
       LAZY LOAD IMAGES
       ═══════════════════════════════════════════════════════════════════════════════ */

    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.payment-logo-item img, .airline-logo-item img');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /* ═══════════════════════════════════════════════════════════════════════════════
       KEYBOARD NAVIGATION
       ═══════════════════════════════════════════════════════════════════════════════ */

    function initKeyboardNavigation() {
        // Escape key to close modals/dropdowns
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close any open dropdowns
                const openDropdowns = document.querySelectorAll('.dropdown.open');
                openDropdowns.forEach(dropdown => dropdown.classList.remove('open'));
            }

            // Alt + T for back to top
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    /* ═══════════════════════════════════════════════════════════════════════════════
       INITIALIZATION
       ═══════════════════════════════════════════════════════════════════════════════ */

    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeFooter);
        } else {
            initializeFooter();
        }
    }

    function initializeFooter() {
        try {
            initNewsletterForm();
            initBackToTop();
            initMobileAccordion();
            initCurrencySelector();
            initLanguageSelector();
            initThemeToggle();
            initScrollAnimations();
            initLinkTracking();
            initLiveChat();
            initLazyLoading();
            initKeyboardNavigation();

            console.log('✅ Premium Footer initialized successfully');
        } catch (error) {
            console.error('Footer initialization error:', error);
        }

        // Re-initialize mobile accordion on resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                initMobileAccordion();
            }, 250);
        });
    }

    // Start initialization
    init();

    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        @keyframes fadeInUp {
            from {
                transform: translateY(30px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

})();
