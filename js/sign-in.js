document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // PASSWORD VISIBILITY TOGGLE WITH ANIMATION
    // =============================================
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('password-icon');

    if (togglePasswordBtn && passwordInput && passwordIcon) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Update ARIA label
            togglePasswordBtn.setAttribute('aria-label', type === 'text' ? 'Hide password' : 'Show password');
            
            // Smooth icon transition
            passwordIcon.style.transform = 'rotate(360deg)';
            passwordIcon.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                if (type === 'text') {
                    passwordIcon.classList.remove('fa-eye');
                    passwordIcon.classList.add('fa-eye-slash');
                } else {
                    passwordIcon.classList.remove('fa-eye-slash');
                    passwordIcon.classList.add('fa-eye');
                }
                passwordIcon.style.transform = 'rotate(0deg)';
            }, 250);
        });
    }

    // =============================================
    // FORM VALIDATION & SUBMISSION
    // =============================================
    const signInForm = document.getElementById('signin-form');
    const emailInput = document.getElementById('email');
    let validationTimeout;

    // Debounce function for real-time validation
    function debounce(func, delay) {
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;

            // Email validation
            const emailValue = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailError = document.getElementById('email-error');

            if (!emailPattern.test(emailValue)) {
                emailInput.classList.add('error-input');
                emailInput.classList.remove('success-input');
                emailInput.style.borderColor = '#E53E3E';
                emailInput.setAttribute('aria-invalid', 'true');
                if (emailError) emailError.classList.remove('hidden');
                isValid = false;
            } else {
                emailInput.classList.remove('error-input');
                emailInput.classList.add('success-input');
                emailInput.style.borderColor = 'var(--emerald-light)';
                emailInput.setAttribute('aria-invalid', 'false');
                if (emailError) emailError.classList.add('hidden');
            }

            // Password validation (minimum 8 characters)
            const passwordValue = passwordInput.value.trim();
            const passwordError = document.getElementById('password-error');

            if (passwordValue.length < 8) {
                passwordInput.classList.add('error-input');
                passwordInput.classList.remove('border-gray-300', 'success-input');
                passwordInput.setAttribute('aria-invalid', 'true');
                if (passwordError) passwordError.classList.remove('hidden');
                isValid = false;
            } else {
                passwordInput.classList.remove('error-input');
                passwordInput.classList.add('success-input');
                passwordInput.setAttribute('aria-invalid', 'false');
                if (passwordError) passwordError.classList.add('hidden');
            }

            // Submit if valid
            if (isValid) {
                const submitBtn = signInForm.querySelector('button[type="submit"]');
                const originalHTML = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing In...';
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');
                
                // Simulate API call
                setTimeout(() => {
                    // Success feedback
                    submitBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Success!';
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('bg-green-600');
                    
                    setTimeout(() => {
                        alert('Welcome back! Redirecting to dashboard...');
                        // window.location.href = 'index.html';
                        
                        // Reset button (for demo purposes)
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('bg-green-600');
                    }, 1000);
                }, 1500);
            }
        });

        // Real-time validation with 400ms debounce
        emailInput.addEventListener('input', debounce(function() {
            const emailValue = this.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailError = document.getElementById('email-error');
            
            if (emailValue && !emailPattern.test(emailValue)) {
                this.classList.add('error-input');
                this.classList.remove('border-gray-300', 'success-input');
                if (emailError) emailError.classList.remove('hidden');
            } else if (emailValue) {
                this.classList.remove('error-input');
                this.classList.add('success-input');
                if (emailError) emailError.classList.add('hidden');
            } else {
                this.classList.remove('error-input', 'success-input');
                this.classList.add('border-gray-300');
                if (emailError) emailError.classList.add('hidden');
            }
        }, 400));

        passwordInput.addEventListener('input', debounce(function() {
            const passwordValue = this.value.trim();
            const passwordError = document.getElementById('password-error');
            
            if (passwordValue && passwordValue.length < 8) {
                this.classList.add('error-input');
                this.classList.remove('border-gray-300', 'success-input');
                if (passwordError) passwordError.classList.remove('hidden');
            } else if (passwordValue) {
                this.classList.remove('error-input');
                this.classList.add('success-input');
                if (passwordError) passwordError.classList.add('hidden');
            } else {
                this.classList.remove('error-input', 'success-input');
                this.classList.add('border-gray-300');
                if (passwordError) passwordError.classList.add('hidden');
            }
        }, 400));
    }



    // =============================================
    // SOCIAL LOGIN HANDLERS
    // =============================================
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            let provider = 'Social';
            if (icon && icon.classList.contains('fa-google')) provider = 'Google';
            else if (icon && icon.classList.contains('fa-facebook')) provider = 'Facebook';
            else if (icon && icon.classList.contains('fa-apple')) provider = 'Apple';
            
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin text-xl"></i>';
            this.disabled = true;
            this.classList.add('loading');
            
            // Simulate OAuth flow
            setTimeout(() => {
                alert(`${provider} Sign In - Feature coming soon! Integration with ${provider} OAuth is under development.`);
                this.innerHTML = originalHTML;
                this.disabled = false;
                this.classList.remove('loading');
            }, 1200);
        });
    });

    // =============================================
    // KEYBOARD NAVIGATION ENHANCEMENT
    // =============================================
    const focusableElements = signInForm ? signInForm.querySelectorAll('input, button, a') : [];
    focusableElements.forEach((element, index) => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                // Custom tab behavior could be added here
            }
        });
    });

    // =============================================
    // PERFORMANCE OPTIMIZATION
    // =============================================
    // Lazy load background images
    if ('IntersectionObserver' in window) {
        const heroSection = document.querySelector('.hero-bg');
        if (heroSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Hero is visible, ensure animations are running
                        heroSection.style.willChange = 'background-position';
                    }
                });
            });
            observer.observe(heroSection);
        }
    }

    // Prevent input zoom on iOS devices
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
        }
    }

});