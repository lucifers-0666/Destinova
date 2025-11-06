/* ===============================================
   LUXURY FOOTER INTERACTIONS - 2025 PREMIUM
   =============================================== */

(function() {
    'use strict';

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // AWARDS CAROUSEL - AUTO ROTATE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initAwardsCarousel() {
        const awardCards = document.querySelectorAll('.award-card');
        if (awardCards.length === 0) return;

        let currentIndex = 0;

        function rotateAward() {
            // Remove active from current
            awardCards[currentIndex].classList.remove('active');
            
            // Move to next
            currentIndex = (currentIndex + 1) % awardCards.length;
            
            // Add active to next
            awardCards[currentIndex].classList.add('active');
        }

        // Rotate every 4 seconds
        setInterval(rotateAward, 4000);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // DESTINATIONS SCROLL - PHASE 2 ENHANCED
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initDestinationsScroll() {
        const scrollContainer = document.getElementById('destinationsScroll');
        const scrollDots = document.querySelectorAll('.scroll-dot');
        const scrollArrowLeft = document.querySelector('.scroll-arrow-left');
        const scrollArrowRight = document.querySelector('.scroll-arrow-right');
        
        if (!scrollContainer || scrollDots.length === 0) return;

        // Update active dot and arrow visibility based on scroll position
        function updateScrollIndicator() {
            const scrollLeft = scrollContainer.scrollLeft;
            const containerWidth = scrollContainer.offsetWidth;
            const scrollWidth = scrollContainer.scrollWidth;
            
            // Calculate which section we're in (0, 1, or 2)
            const totalScrollable = scrollWidth - containerWidth;
            const scrollPercentage = scrollLeft / totalScrollable;
            const activeIndex = Math.round(scrollPercentage * (scrollDots.length - 1));
            
            scrollDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });

            // Show/hide arrows based on scroll position
            if (scrollArrowLeft && scrollArrowRight) {
                // Hide left arrow if at start
                if (scrollLeft <= 10) {
                    scrollArrowLeft.style.opacity = '0';
                } else {
                    scrollArrowLeft.style.opacity = '0.5';
                }

                // Hide right arrow if at end
                if (scrollLeft >= totalScrollable - 10) {
                    scrollArrowRight.style.opacity = '0';
                } else {
                    scrollArrowRight.style.opacity = '0.5';
                }
            }
        }

        scrollContainer.addEventListener('scroll', updateScrollIndicator);
        
        // Initial check
        updateScrollIndicator();

        // Click dot to scroll to section
        scrollDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const containerWidth = scrollContainer.offsetWidth;
                const scrollWidth = scrollContainer.scrollWidth;
                const totalScrollable = scrollWidth - containerWidth;
                const targetScroll = (totalScrollable / (scrollDots.length - 1)) * index;
                
                scrollContainer.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            });

            // Keyboard navigation for dots
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dot.click();
                }
            });
        });

        // Keyboard navigation for destination cards
        const destinationCards = scrollContainer.querySelectorAll('.destination-mini-card');
        destinationCards.forEach((card, index) => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });

            // Click to navigate (optional - add your own logic)
            card.addEventListener('click', () => {
                const destination = card.dataset.destination;
                console.log(`Navigate to ${destination}`);
                // Add your navigation logic here
                if (window.announce) {
                    window.announce(`Exploring ${destination} flights`);
                }
            });
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // BACK TO TOP BUTTON - PHASE 3 ENHANCED
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        let isScrolling = false;

        // Show/hide based on scroll position
        function toggleBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop(); // Check initial state

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            if (isScrolling) return;
            
            isScrolling = true;
            backToTopBtn.classList.add('scrolling');
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Reset after scroll completes
            setTimeout(() => {
                isScrolling = false;
                backToTopBtn.classList.remove('scrolling');
            }, 1000);

            if (window.announce) {
                window.announce('Scrolled to top of page');
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // WHATSAPP BUBBLE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initWhatsAppBubble() {
        const whatsappBubble = document.getElementById('whatsappBubble');
        const whatsappCard = document.getElementById('whatsappCard');
        
        if (whatsappBubble) {
            whatsappBubble.addEventListener('click', () => {
                // Replace with your actual WhatsApp number
                const phoneNumber = '1234567890'; // Update this
                const message = encodeURIComponent('Hi! I need help with flight booking.');
                window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                
                if (window.announce) {
                    window.announce('Opening WhatsApp chat');
                }
            });
        }

        if (whatsappCard) {
            whatsappCard.addEventListener('click', () => {
                const phoneNumber = '1234567890'; // Update this
                const message = encodeURIComponent('Hi! I need help with flight booking.');
                window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                
                if (window.announce) {
                    window.announce('Opening WhatsApp chat');
                }
            });

            // Keyboard support
            whatsappCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    whatsappCard.click();
                }
            });
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // LIVE CHAT BUTTON
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initLiveChat() {
        const liveChatCard = document.getElementById('liveChatCard');
        
        if (liveChatCard) {
            liveChatCard.addEventListener('click', () => {
                // Add your live chat integration here
                console.log('Opening live chat...');
                alert('Live chat feature coming soon! Contact us at support@destinova.com');
                
                if (window.announce) {
                    window.announce('Opening live chat');
                }
            });

            // Keyboard support
            liveChatCard.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    liveChatCard.click();
                }
            });
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // NEWSLETTER FORM - PHASE 3 ENHANCED WITH SUCCESS STATES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initNewsletterForm() {
        const form = document.getElementById('luxuryNewsletterForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('#luxury-newsletter-email');
            const email = emailInput.value.trim();
            
            if (!email) return;

            const submitBtn = form.querySelector('.newsletter-submit');
            const originalHTML = submitBtn.innerHTML;
            
            // 1. Loading State
            submitBtn.classList.add('loading');
            submitBtn.innerHTML = '<span>Subscribing...</span>';
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 2. Success State
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            submitBtn.innerHTML = '<span>Subscribed!</span><span class="newsletter-submit-icon">✓</span>';
            
            // 3. Create Confetti
            createConfettiExplosion(submitBtn);
            
            // 4. Show Success Message
            showSuccessMessage(form);
            
            // 5. Reset after delay
            setTimeout(() => {
                emailInput.value = '';
                submitBtn.classList.remove('success');
                submitBtn.innerHTML = originalHTML;
                
                // Remove success message
                const successMsg = form.querySelector('.newsletter-success-message');
                if (successMsg) successMsg.remove();
            }, 3000);

            // Store subscription
            console.log('Newsletter subscription:', email);
            
            if (window.announce) {
                window.announce('Successfully subscribed to newsletter');
            }
        });
    }

    // Advanced Confetti with Physics
    function createConfettiExplosion(button) {
        const colors = ['#E5CBAF', '#d4af37', '#ffffff'];
        const shapes = ['circle', 'square'];
        const particleCount = 25;
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2;
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.className = 'confetti-particle';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            particle.style.borderRadius = shape === 'circle' ? '50%' : '0';
            particle.style.position = 'fixed';
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.zIndex = '9999';
            
            // Random trajectory
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 100 + Math.random() * 100;
            const x = Math.cos(angle) * velocity;
            const y = Math.sin(angle) * velocity - 80; // Upward bias
            
            particle.style.setProperty('--x', `${x}px`);
            particle.style.setProperty('--y', `${y}px`);
            
            document.body.appendChild(particle);
            
            // Remove after animation
            setTimeout(() => particle.remove(), 2000);
        }
    }

    // Success Message
    function showSuccessMessage(form) {
        const message = document.createElement('div');
        message.className = 'newsletter-success-message';
        message.innerHTML = 'Check your inbox! 📧';
        form.appendChild(message);
        
        // Auto-hide after 4s
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 400);
        }, 4000);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SCROLL ANIMATIONS - PHASE 2 ENHANCED
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate');
        const sectionTitles = document.querySelectorAll('.footer-section-title');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        
                        // Announce to screen readers
                        if (entry.target.classList.contains('bento-newsletter')) {
                            if (window.announce) {
                                window.announce('Newsletter section appeared');
                            }
                        }
                        
                        observer.unobserve(entry.target); // Only animate once
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -80px 0px'
            });

            animatedElements.forEach(el => observer.observe(el));
            sectionTitles.forEach(el => observer.observe(el));
        } else {
            // Fallback for browsers without IntersectionObserver
            animatedElements.forEach(el => el.classList.add('visible'));
            sectionTitles.forEach(el => el.classList.add('visible'));
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // CURRENCY & LANGUAGE SELECTORS - PERSISTENCE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initSelectors() {
        const currencySelector = document.getElementById('luxuryCurrencySelector');
        const languageSelector = document.getElementById('luxuryLanguageSelector');

        // Load saved preferences
        if (currencySelector) {
            const savedCurrency = localStorage.getItem('selectedCurrency');
            if (savedCurrency) {
                currencySelector.value = savedCurrency;
            }

            currencySelector.addEventListener('change', (e) => {
                localStorage.setItem('selectedCurrency', e.target.value);
                console.log('Currency changed to:', e.target.value);
                
                if (window.announce) {
                    window.announce(`Currency changed to ${e.target.value}`);
                }
                
                // Add your currency change logic here
                // e.g., update prices across the site
            });
        }

        if (languageSelector) {
            const savedLanguage = localStorage.getItem('selectedLanguage');
            if (savedLanguage) {
                languageSelector.value = savedLanguage;
            }

            languageSelector.addEventListener('change', (e) => {
                localStorage.setItem('selectedLanguage', e.target.value);
                console.log('Language changed to:', e.target.value);
                
                if (window.announce) {
                    window.announce(`Language changed to ${e.target.value}`);
                }
                
                // Add your language change logic here
                // e.g., reload page with new language
            });
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TRUST MARQUEE - PAUSE ON HOVER
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initTrustMarquee() {
        const marquee = document.querySelector('.trust-marquee');
        if (!marquee) return;

        // Already handled by CSS :hover { animation-play-state: paused; }
        // But we can add additional interactions here if needed
        
        marquee.addEventListener('mouseenter', () => {
            if (window.announce) {
                window.announce('Trust badges carousel paused');
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // EASTER EGG - KONAMI CODE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initEasterEgg() {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                
                if (konamiIndex === konamiCode.length) {
                    activateEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    function activateEasterEgg() {
        console.log('🎉 Easter Egg Activated!');
        
        // Create flying plane across screen
        const plane = document.createElement('div');
        plane.textContent = '✈️';
        plane.style.cssText = `
            position: fixed;
            top: 50%;
            left: -100px;
            font-size: 60px;
            z-index: 99999;
            animation: flyAcross 3s linear;
            pointer-events: none;
        `;
        document.body.appendChild(plane);

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flyAcross {
                0% { left: -100px; transform: translateY(0); }
                50% { transform: translateY(-50px); }
                100% { left: calc(100% + 100px); transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);

        // Remove after animation
        setTimeout(() => {
            plane.remove();
            style.remove();
        }, 3000);

        if (window.announce) {
            window.announce('Easter egg activated! A plane is flying across the screen!');
        }

        // Show celebration message
        alert('🎉 Congratulations! You found the secret! Enjoy 10% off your next booking with code: KONAMI10');
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // MAGNETIC HOVER EFFECT (OPTIONAL ENHANCEMENT)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initMagneticButtons() {
        const magneticElements = document.querySelectorAll('.newsletter-submit, .back-to-top');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.15;
                const moveY = y * 0.15;
                
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PHASE 4: MOBILE ACCORDION & ACCESSIBILITY
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initMobileAccordion() {
        // Only run on mobile
        if (window.innerWidth > 768) return;
        
        const sectionTitles = document.querySelectorAll('.footer-section-title');
        
        sectionTitles.forEach((title, index) => {
            // Add chevron icon
            const chevron = document.createElement('span');
            chevron.className = 'accordion-chevron';
            chevron.setAttribute('aria-hidden', 'true');
            chevron.textContent = '›';
            title.appendChild(chevron);
            
            // Add ARIA attributes
            title.setAttribute('role', 'button');
            title.setAttribute('aria-expanded', 'false');
            title.setAttribute('tabindex', '0');
            
            const linksList = title.nextElementSibling;
            if (linksList && linksList.classList.contains('footer-links')) {
                linksList.setAttribute('id', `footer-links-${index}`);
                title.setAttribute('aria-controls', `footer-links-${index}`);
                
                // Toggle on click
                title.addEventListener('click', () => toggleAccordion(title, linksList));
                
                // Keyboard support
                title.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleAccordion(title, linksList);
                    }
                });
            }
        });
        
        function toggleAccordion(title, linksList) {
            const isExpanded = title.getAttribute('aria-expanded') === 'true';
            
            // Close all other accordions
            document.querySelectorAll('.footer-section-title').forEach(t => {
                if (t !== title) {
                    t.setAttribute('aria-expanded', 'false');
                    t.classList.remove('expanded');
                    const links = t.nextElementSibling;
                    if (links) links.classList.remove('expanded');
                }
            });
            
            // Toggle current
            title.setAttribute('aria-expanded', !isExpanded);
            title.classList.toggle('expanded');
            linksList.classList.toggle('expanded');
            
            if (window.announce) {
                const action = !isExpanded ? 'expanded' : 'collapsed';
                window.announce(`${title.textContent} section ${action}`);
            }
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // KEYBOARD NAVIGATION DETECTION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initKeyboardDetection() {
        let isUsingKeyboard = false;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                isUsingKeyboard = true;
                document.body.classList.add('keyboard-user');
            }
        });
        
        document.addEventListener('mousedown', () => {
            isUsingKeyboard = false;
            document.body.classList.remove('keyboard-user');
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // DEBOUNCED SCROLL HANDLER (Performance)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SCREEN READER ANNOUNCER
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    window.announce = function(message, priority = 'polite') {
        let announcer = document.getElementById('sr-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', priority);
            announcer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(announcer);
        }
        
        // Clear and set new message
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    };

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PHASE 5: AUTO-UPDATE COPYRIGHT YEAR
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initCopyrightYear() {
        const yearElement = document.getElementById('copyrightYear');
        if (!yearElement) return;
        
        const currentYear = new Date().getFullYear();
        
        // Only update if different (for Jan 1 transitions)
        if (parseInt(yearElement.textContent) !== currentYear) {
            yearElement.style.animation = 'yearFadeIn 0.5s ease';
            yearElement.textContent = currentYear;
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PHASE 5: TOAST NOTIFICATIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function showToast(message, type = 'error') {
        // Remove existing toasts
        document.querySelectorAll('.toast-notification').forEach(t => t.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        
        document.body.appendChild(toast);
        
        // Auto-dismiss after 4s
        setTimeout(() => {
            toast.remove();
        }, 4000);
        
        // Also announce to screen readers
        if (window.announce) {
            window.announce(message, 'assertive');
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PHASE 5: ENHANCED NEWSLETTER WITH ERROR HANDLING
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initNewsletterFormEnhanced() {
        const form = document.getElementById('luxuryNewsletterForm');
        const emailInput = document.getElementById('luxury-newsletter-email');
        
        if (!form || !emailInput) return;
        
        // Remove existing error messages on input
        emailInput.addEventListener('input', () => {
            emailInput.classList.remove('error');
            const existingError = form.querySelector('.error-message');
            if (existingError) existingError.remove();
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailInput.classList.add('error');
                
                // Add error message if not exists
                if (!form.querySelector('.error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Please enter a valid email address';
                    errorMsg.setAttribute('role', 'alert');
                    form.appendChild(errorMsg);
                }
                
                if (window.announce) {
                    window.announce('Invalid email address. Please check and try again.', 'assertive');
                }
                return;
            }
            
            // Simulate API call with error handling
            try {
                // Check rate limiting (simple localStorage check)
                const lastSubmit = localStorage.getItem('newsletter_last_submit');
                const now = Date.now();
                
                if (lastSubmit && (now - parseInt(lastSubmit)) < 60000) { // 1 minute cooldown
                    showToast('Too many attempts. Please wait a moment.', 'warning');
                    return;
                }
                
                // Store submission time
                localStorage.setItem('newsletter_last_submit', now.toString());
                
                // Simulate network request
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        // Simulate 10% failure rate for demo
                        if (Math.random() < 0.1) {
                            reject(new Error('Network error'));
                        } else {
                            resolve();
                        }
                    }, 1000);
                });
                
                // Success - trigger existing confetti animation
                showToast('Successfully subscribed! Check your email for exclusive deals.', 'success');
                
                // Call existing newsletter success function if it exists
                if (typeof initNewsletterForm === 'function') {
                    // Trigger the confetti from existing Phase 3 code
                    createConfettiExplosion(form);
                }
                
                emailInput.value = '';
                
            } catch (error) {
                showToast('Connection error. Please try again.', 'error');
                console.error('Newsletter submission error:', error);
            }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PHASE 5: LOADING SKELETONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function showSkeletonLoaders() {
        // This would be called if content loads async
        // For now, just fade out skeletons if they exist
        const skeletons = document.querySelectorAll('.skeleton-container');
        
        setTimeout(() => {
            skeletons.forEach(skeleton => {
                skeleton.classList.add('loaded');
                setTimeout(() => skeleton.remove(), 300);
            });
        }, 1500); // Simulate loading time
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PHASE 5: EASTER EGG - KONAMI CODE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initEasterEggKonami() {
        // Check if already found this session
        if (sessionStorage.getItem('easter_egg_activated')) return;
        
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'b', 'a'
        ];
        
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            const key = e.key;
            
            if (key === konamiCode[konamiIndex]) {
                konamiIndex++;
                
                if (konamiIndex === konamiCode.length) {
                    activateEasterEgg();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    function activateEasterEgg() {
        // Mark as activated
        sessionStorage.setItem('easter_egg_activated', 'true');
        localStorage.setItem('easter_egg_found', 'true');
        
        console.log('🎉 KONAMI CODE ACTIVATED!');
        
        // 1. Flying Plane Animation
        const plane = document.createElement('div');
        plane.className = 'easter-egg-plane flying';
        plane.innerHTML = '✈️';
        plane.style.fontSize = '60px';
        document.body.appendChild(plane);
        
        // Create trail
        const trail = document.createElement('div');
        trail.className = 'plane-trail';
        document.body.appendChild(trail);
        
        let trailInterval = setInterval(() => {
            const rect = plane.getBoundingClientRect();
            if (rect.left > window.innerWidth) {
                clearInterval(trailInterval);
                trail.remove();
                return;
            }
            
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            dot.style.left = rect.left + 'px';
            dot.style.top = rect.top + rect.height / 2 + 'px';
            trail.appendChild(dot);
            
            setTimeout(() => dot.remove(), 1000);
        }, 50);
        
        setTimeout(() => {
            plane.remove();
            clearInterval(trailInterval);
        }, 3000);
        
        // 2. Enhanced Confetti Burst
        setTimeout(() => {
            createEasterEggConfetti();
        }, 500);
        
        // 3. Success Toast
        setTimeout(() => {
            const toast = document.createElement('div');
            toast.className = 'easter-egg-toast';
            toast.innerHTML = '🎉 You found the secret! ✈️<br><small style="font-size: 14px; font-weight: 400; opacity: 0.9;">Welcome to the exclusive travelers club!</small>';
            document.body.appendChild(toast);
            
            setTimeout(() => toast.remove(), 5000);
        }, 1500);
        
        // Announce to screen reader
        if (window.announce) {
            window.announce('Easter egg activated! You found the secret Konami code!', 'polite');
        }
    }

    function createEasterEggConfetti() {
        const colors = ['gold', 'emerald'];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = `easter-egg-confetti ${colors[Math.floor(Math.random() * colors.length)]}`;
                
                const startX = window.innerWidth / 2;
                const startY = window.innerHeight / 2;
                
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';
                
                document.body.appendChild(particle);
                
                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = 200 + Math.random() * 200;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                particle.animate([
                    { 
                        transform: 'translate(0, 0) rotate(0deg)',
                        opacity: 1
                    },
                    { 
                        transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 720}deg)`,
                        opacity: 0
                    }
                ], {
                    duration: 2000 + Math.random() * 1000,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
                
                setTimeout(() => particle.remove(), 3000);
            }, i * 20);
        }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PHASE 5: DESTINATION CARDS ERROR STATE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function showDestinationsError() {
        const container = document.getElementById('destinationsScroll');
        if (!container) return;
        
        container.innerHTML = `
            <div class="destinations-error-state">
                <div class="error-icon" aria-hidden="true">✈️</div>
                <div class="error-title">Unable to load destinations</div>
                <div class="error-description">We're having trouble loading destination data</div>
                <button class="retry-button" onclick="location.reload()">
                    Retry
                </button>
            </div>
        `;
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // INITIALIZE ALL FEATURES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('🌟 Initializing Luxury Footer...');

        // Initialize all features
        initAwardsCarousel();
        initDestinationsScroll();
        initBackToTop();
        initWhatsAppBubble();
        initLiveChat();
        initNewsletterForm();
        initScrollAnimations();
        initSelectors();
        initTrustMarquee();
        initEasterEgg();
        initMagneticButtons();
        
        // Phase 4 Features
        initMobileAccordion();
        initKeyboardDetection();
        
        // Phase 5 Features
        initCopyrightYear();
        initNewsletterFormEnhanced();
        initEasterEggKonami();
        showSkeletonLoaders();

        console.log('✅ Luxury Footer Initialized (Phase 5 Complete)');
        
        // Cleanup will-change after animations
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('.scroll-animate.visible');
            animatedElements.forEach(el => {
                el.style.willChange = 'auto';
            });
        }, 1000);
    }

    // Start initialization
    init();
    
    // Handle window resize for mobile accordion
    let resizeTimer;
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 768) {
            // Remove mobile accordion on desktop
            document.querySelectorAll('.footer-section-title').forEach(title => {
                title.classList.add('expanded');
                const links = title.nextElementSibling;
                if (links) links.classList.add('expanded');
            });
        } else {
            // Reinitialize mobile accordion
            initMobileAccordion();
        }
    }, 250));

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ACCESSIBILITY - REDUCED MOTION CHECK
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        console.log('⚠️ Reduced motion preference detected - animations disabled');
    }

    // Listen for changes
    prefersReducedMotion.addEventListener('change', (e) => {
        if (e.matches) {
            console.log('⚠️ User enabled reduced motion preference');
        } else {
            console.log('✅ User disabled reduced motion preference');
        }
    });

})();
