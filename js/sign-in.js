document.addEventListener('DOMContentLoaded', function() {
    
    // Form elements
    const form = document.getElementById('signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitButton = form.querySelector('button[type="submit"]');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordIcon = document.getElementById('password-icon');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const passwordStrengthBar = document.getElementById('password-strength-bar');
    const passwordStrengthText = document.getElementById('password-strength-text');

    // Password visibility toggle
    if (togglePasswordBtn && passwordInput && passwordIcon) {
        togglePasswordBtn.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            passwordIcon.className = isPassword ? 'fas fa-eye-slash text-xl' : 'fas fa-eye text-xl';
            togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    }

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password strength checker
    function checkPasswordStrength(password) {
        if (!password) {
            passwordStrengthBar.style.width = '0%';
            passwordStrengthBar.className = 'password-strength-bar h-full transition-all duration-300';
            passwordStrengthText.classList.add('hidden');
            return;
        }

        let strength = 0;
        let strengthClass = '';
        let strengthText = '';

        // Check length
        if (password.length >= 8) strength++;
        // Check for letters and numbers
        if (/[a-zA-Z]/.test(password) && /[0-9]/.test(password)) strength++;
        // Check for special characters
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength === 1) {
            strengthClass = 'bg-red-500';
            strengthText = 'Weak';
            passwordStrengthBar.style.width = '33%';
        } else if (strength === 2) {
            strengthClass = 'bg-yellow-500';
            strengthText = 'Medium';
            passwordStrengthBar.style.width = '66%';
        } else if (strength >= 3) {
            strengthClass = 'bg-green-500';
            strengthText = 'Strong';
            passwordStrengthBar.style.width = '100%';
        }

        passwordStrengthBar.className = `password-strength-bar h-full transition-all duration-300 ${strengthClass}`;
        passwordStrengthText.textContent = strengthText;
        passwordStrengthText.className = `text-xs mt-1 font-medium ${strengthClass.replace('bg-', 'text-')}`;
        passwordStrengthText.classList.remove('hidden');
    }
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        passwordStrengthText.classList.remove('hidden');
        
        if (strength <= 2) {
            passwordStrengthBar.className = 'password-strength-bar weak';
            passwordStrengthText.className = 'password-strength-text weak';
            passwordStrengthText.textContent = 'Weak Password';
        } else if (strength <= 4) {
            passwordStrengthBar.className = 'password-strength-bar medium';
            passwordStrengthText.className = 'password-strength-text medium';
            passwordStrengthText.textContent = 'Medium Password';
        } else {
            passwordStrengthBar.className = 'password-strength-bar strong';
            passwordStrengthText.className = 'password-strength-text strong';
            passwordStrengthText.textContent = 'Strong Password';
        }
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
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
                emailInput.style.borderColor = 'var(--accent-success)';
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