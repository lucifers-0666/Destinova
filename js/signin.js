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
    // INITIALIZATION COMPLETE
    // =============================================
    
    console.log('✅ Destinova Sign-In initialization complete');
    
    // Announce page ready to screen readers
    announceToScreenReader('Sign in form is ready');
});