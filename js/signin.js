document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // MODERN SIGN-IN FUNCTIONALITY 2025
    // =============================================
    
    console.log('🚀 Destinova Sign-In loaded');
    
    // Form elements
    const form = document.getElementById('signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = form ? form.querySelector('button[type="submit"]') : null;
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordIcon = document.getElementById('password-icon');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const socialButtons = document.querySelectorAll('.social-btn');

    // =============================================
    // ENHANCED UX: AUTO-FOCUS & SMOOTH INTERACTIONS
    // =============================================
    
    // Auto-focus email input for better UX
    if (emailInput) {
        // Delay focus to allow page load animations to complete
        setTimeout(() => {
            emailInput.focus();
        }, 800);
    }

    // =============================================
    // PASSWORD VISIBILITY TOGGLE
    // =============================================
    
    if (togglePasswordBtn && passwordInput && passwordIcon) {
        togglePasswordBtn.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            
            // Toggle password visibility
            passwordInput.type = isPassword ? 'text' : 'password';
            passwordIcon.className = isPassword ? 'fas fa-eye-slash text-lg' : 'fas fa-eye text-lg';
            
            // Update aria-label for accessibility
            togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            
            // Add visual feedback
            togglePasswordBtn.classList.add('scale-110');
            setTimeout(() => {
                togglePasswordBtn.classList.remove('scale-110');
            }, 150);
        });
    }

    // =============================================
    // REAL-TIME FORM VALIDATION
    // =============================================
    
    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    // Password validation function
    function validatePassword(password) {
        return password.length >= 8;
    }

    // Show error message
    function showError(input, errorElement, message) {
        input.classList.add('error-input');
        input.classList.remove('success-input');
        errorElement.classList.remove('hidden');
        errorElement.querySelector('span').textContent = message;
        
        // Add shake animation
        input.classList.add('animate-pulse');
        setTimeout(() => {
            input.classList.remove('animate-pulse');
        }, 500);
    }

    // Show success state
    function showSuccess(input, errorElement) {
        input.classList.remove('error-input');
        input.classList.add('success-input');
        errorElement.classList.add('hidden');
    }

    // Debounce function for performance
    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Real-time email validation
    if (emailInput && emailError) {
        const validateEmailInput = debounce(function() {
            const email = emailInput.value.trim();
            
            if (email === '') {
                emailInput.classList.remove('error-input', 'success-input');
                emailError.classList.add('hidden');
                return;
            }
            
            if (!validateEmail(email)) {
                showError(emailInput, emailError, 'Please enter a valid email address');
            } else {
                showSuccess(emailInput, emailError);
            }
        }, 300);

        emailInput.addEventListener('input', validateEmailInput);
        emailInput.addEventListener('blur', validateEmailInput);
    }

    // Real-time password validation
    if (passwordInput && passwordError) {
        const validatePasswordInput = debounce(function() {
            const password = passwordInput.value;
            
            if (password === '') {
                passwordInput.classList.remove('error-input', 'success-input');
                passwordError.classList.add('hidden');
                return;
            }
            
            if (!validatePassword(password)) {
                showError(passwordInput, passwordError, 'Password must be at least 8 characters long');
            } else {
                showSuccess(passwordInput, passwordError);
            }
        }, 300);

        passwordInput.addEventListener('input', validatePasswordInput);
        passwordInput.addEventListener('blur', validatePasswordInput);
    }

    // =============================================
    // FORM SUBMISSION HANDLING
    // =============================================
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            console.log('🔐 Form submission initiated');
            
            let isValid = true;
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Validate email
            if (!validateEmail(email)) {
                showError(emailInput, emailError, 'Please enter a valid email address');
                isValid = false;
            }

            // Validate password
            if (!validatePassword(password)) {
                showError(passwordInput, passwordError, 'Password must be at least 8 characters long');
                isValid = false;
            }

            if (isValid) {
                // Show loading state
                submitButton.classList.add('loading');
                submitButton.disabled = true;
                
                const originalText = submitButton.querySelector('span').textContent;
                submitButton.querySelector('span').textContent = 'Signing In...';
                
                // Simulate API call
                setTimeout(() => {
                    console.log('✅ Sign-in successful');
                    
                    // Show success feedback
                    submitButton.classList.remove('loading');
                    submitButton.classList.add('bg-green-500');
                    submitButton.querySelector('span').textContent = 'Welcome Back!';
                    
                    // Redirect after a brief delay
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                    
                }, 2000);
            } else {
                console.log('❌ Form validation failed');
                
                // Focus first invalid field
                const firstError = form.querySelector('.error-input');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    }

    // =============================================
    // SOCIAL LOGIN HANDLERS
    // =============================================
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Determine provider from icon
            const icon = this.querySelector('i');
            let provider = 'Unknown';
            
            if (icon.classList.contains('fa-google')) {
                provider = 'Google';
            } else if (icon.classList.contains('fa-facebook')) {
                provider = 'Facebook';
            } else if (icon.classList.contains('fa-apple')) {
                provider = 'Apple';
            }
            
            console.log(`🔗 Social login initiated with ${provider}`);
            
            // Add loading state
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin text-xl"></i>';
            this.disabled = true;
            this.classList.add('loading');
            
            // Simulate OAuth flow
            setTimeout(() => {
                console.log(`✅ ${provider} authentication successful`);
                
                // Restore button and redirect
                this.innerHTML = originalContent;
                this.disabled = false;
                this.classList.remove('loading');
                
                // In a real app, this would handle the OAuth callback
                alert(`${provider} login would be processed here`);
            }, 1500);
        });
    });

    // =============================================
    // ENHANCED KEYBOARD NAVIGATION
    // =============================================
    
    const focusableElements = form ? form.querySelectorAll('input, button, a') : [];
    
    focusableElements.forEach((element, index) => {
        element.addEventListener('keydown', function(e) {
            // Enhanced tab navigation
            if (e.key === 'Tab') {
                // Add visual feedback for keyboard navigation
                this.classList.add('ring-2', 'ring-blue-300');
                setTimeout(() => {
                    this.classList.remove('ring-2', 'ring-blue-300');
                }, 300);
            }
            
            // Enter key handling for buttons
            if (e.key === 'Enter' && this.tagName === 'BUTTON') {
                this.click();
            }
        });
    });

    // =============================================
    // MODERN UX ENHANCEMENTS
    // =============================================
    
    // Add subtle hover effects to form inputs
    const formInputs = document.querySelectorAll('input');
    formInputs.forEach(input => {
        input.addEventListener('mouseenter', function() {
            if (!this.classList.contains('error-input')) {
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.15)';
            }
        });
        
        input.addEventListener('mouseleave', function() {
            if (!this.matches(':focus')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
    });

    // =============================================
    // ACCESSIBILITY IMPROVEMENTS
    // =============================================
    
    // Announce form errors to screen readers
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // =============================================
    // PERFORMANCE OPTIMIZATIONS
    // =============================================
    
    // Lazy load background images for better performance
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('[data-bg]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.backgroundImage = `url(${img.dataset.bg})`;
                    img.removeAttribute('data-bg');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // =============================================
    // MOBILE OPTIMIZATIONS
    // =============================================
    
    // Prevent zoom on iOS when focusing inputs
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
        }
    }

    // Handle mobile keyboard appearance
    const originalHeight = window.innerHeight;
    window.addEventListener('resize', function() {
        const currentHeight = window.innerHeight;
        const keyboardHeight = originalHeight - currentHeight;
        
        if (keyboardHeight > 150) {
            // Keyboard is likely open
            document.body.classList.add('keyboard-open');
        } else {
            document.body.classList.remove('keyboard-open');
        }
    });

    // =============================================
    // PROGRESSIVE ENHANCEMENT
    // =============================================
    
    // Add 'js-enabled' class for progressive enhancement
    document.documentElement.classList.add('js-enabled');
    
    // Feature detection and graceful degradation
    const supportsPassiveListeners = (() => {
        let passive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get() { passive = true; }
            });
            window.addEventListener('test', null, opts);
        } catch (e) {}
        return passive;
    })();

    // =============================================
    // ANALYTICS & TRACKING (Placeholder)
    // =============================================
    
    // Track user interactions for analytics
    function trackEvent(eventName, properties = {}) {
        console.log(`📊 Event tracked: ${eventName}`, properties);
        
        // In a real application, this would send data to analytics service
        // Example: gtag('event', eventName, properties);
    }

    // Track form interactions
    if (emailInput) {
        emailInput.addEventListener('focus', () => trackEvent('email_field_focused'));
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('focus', () => trackEvent('password_field_focused'));
    }

    // =============================================
    // AOS ANIMATIONS INITIALIZATION
    // =============================================
    
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: false, // Allow animations to repeat
            offset: 50,
            easing: 'ease-out-cubic',
            delay: 0,
            mirror: true, // Animate elements on scroll in both directions
        });
    }
    
    // =============================================
    // PREMIUM INTERACTIONS & EFFECTS
    // =============================================
    
    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Apply ripple to buttons
    document.querySelectorAll('.submit-btn, .social-btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Smooth scroll for back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('mouseenter', () => {
            backBtn.style.transform = 'translateX(-4px) scale(1.02)';
        });
        backBtn.addEventListener('mouseleave', () => {
            backBtn.style.transform = '';
        });
    }
    
    // Enhanced input focus effects
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = '';
        });
        
        // Add success class on valid input
        input.addEventListener('input', function() {
            if (this.value.length > 0 && !this.classList.contains('error')) {
                this.classList.add('success');
            } else {
                this.classList.remove('success');
            }
        });
    });
    
    // Parallax effect for hero panel
    document.addEventListener('mousemove', (e) => {
        const heroPanel = document.querySelector('.hero-panel');
        if (heroPanel && window.innerWidth > 768) {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            heroPanel.style.transform = `translate(${x}px, ${y}px)`;
            heroPanel.style.transition = 'transform 0.3s ease-out';
        }
    });
    
    // Floating animation for decorative elements
    const decorativeElements = document.querySelectorAll('.decoration-circle, .decoration-blob');
    decorativeElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
        element.style.animationDuration = `${20 + index * 5}s`;
    });
    
    // Animate scene layers with parallax
    document.addEventListener('mousemove', (e) => {
        const sceneLayers = document.querySelectorAll('.scene-layer');
        if (sceneLayers.length > 0 && window.innerWidth > 768) {
            const x = (e.clientX / window.innerWidth - 0.5);
            const y = (e.clientY / window.innerHeight - 0.5);
            
            sceneLayers.forEach((layer, index) => {
                const speed = (index + 1) * 10;
                layer.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
                layer.style.transition = 'transform 0.5s ease-out';
            });
        }
    });
    
    // Add hover effect to trust badges
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.08) rotate(2deg)';
        });
        badge.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Typing effect for form placeholders (optional)
    function typingEffect(element, text, speed = 50) {
        let i = 0;
        element.placeholder = '';
        const timer = setInterval(() => {
            if (i < text.length) {
                element.placeholder += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }
    
    // Apply typing effect on page load (optional - can be commented out)
    setTimeout(() => {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (emailInput && emailInput.placeholder) {
            const originalEmail = emailInput.placeholder;
            typingEffect(emailInput, originalEmail, 30);
        }
        
        if (passwordInput && passwordInput.placeholder) {
            setTimeout(() => {
                const originalPassword = passwordInput.placeholder;
                typingEffect(passwordInput, originalPassword, 30);
            }, 800);
        }
    }, 1500);
    
    // Add shimmer effect to submit button on hover
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #164426 0%, #1d5e33 50%, #2a7d4a 100%)';
            this.style.backgroundSize = '200% 200%';
            this.style.animation = 'gradientFlow 2s ease infinite';
        });
    }
    
    // Add 3D tilt effect to form panel (subtle)
    const formPanel = document.querySelector('.form-panel');
    if (formPanel && window.innerWidth > 768) {
        formPanel.addEventListener('mousemove', (e) => {
            const rect = formPanel.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            formPanel.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
        });
        
        formPanel.addEventListener('mouseleave', () => {
            formPanel.style.transform = '';
        });
    }
    
    // Loading state animations
    if (submitButton) {
        submitButton.addEventListener('click', function(e) {
            if (this.classList.contains('loading')) {
                // Add pulsing effect while loading
                this.style.animation = 'pulse 1s ease-in-out infinite';
            }
        });
    }
    
    // =============================================
    // INITIALIZATION COMPLETE
    // =============================================
    
    console.log('✅ Destinova Sign-In initialization complete');
    
    // Announce page ready to screen readers
    announceToScreenReader('Sign in form is ready');
});