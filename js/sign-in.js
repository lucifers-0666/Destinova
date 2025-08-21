document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const signInTab = document.getElementById('signin-tab');
    const signUpTab = document.getElementById('signup-tab');
    const signInForm = document.getElementById('signin-form');
    const signUpForm = document.getElementById('signup-form');
    
    // Form switching functionality
    signInTab.addEventListener('click', function() {
        switchToSignIn();
    });
    
    signUpTab.addEventListener('click', function() {
        switchToSignUp();
    });
    
    function switchToSignIn() {
        signInTab.classList.add('active');
        signUpTab.classList.remove('active');
        signInForm.classList.add('active');
        signUpForm.classList.remove('active');
    }
    
    function switchToSignUp() {
        signUpTab.classList.add('active');
        signInTab.classList.remove('active');
        signUpForm.classList.add('active');
        signInForm.classList.remove('active');
    }
    
    // Form validation and submission
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const inputs = this.querySelectorAll('input[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    highlightError(input);
                } else {
                    removeHighlight(input);
                    
                    // Additional validation for specific fields
                    if (input.type === 'email' && !isValidEmail(input.value)) {
                        isValid = false;
                        highlightError(input);
                    }
                    
                    if (input.type === 'password' && input.id === 'signup-confirm') {
                        const password = document.getElementById('signup-password');
                        if (input.value !== password.value) {
                            isValid = false;
                            highlightError(input);
                            showPasswordMismatch();
                        }
                    }
                }
            });
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = this.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                // Simulate API call
                setTimeout(() => {
                    alert('Form submitted successfully! (This is a demo)');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    form.reset();
                }, 1500);
            }
        });
    });
    
    // Helper functions
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function highlightError(input) {
        input.style.borderColor = '#ff3860';
        input.style.backgroundColor = 'rgba(255, 56, 96, 0.1)';
        
        // Add error message if not exists
        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#ff3860';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '5px';
            errorDiv.textContent = 'This field is required';
            
            input.parentNode.appendChild(errorDiv);
        }
    }
    
    function removeHighlight(input) {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
        
        // Remove error message if exists
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function showPasswordMismatch() {
        const confirmInput = document.getElementById('signup-confirm');
        const errorDiv = confirmInput.parentNode.querySelector('.error-message');
        
        if (errorDiv) {
            errorDiv.textContent = 'Passwords do not match';
        }
    }
    
    // Input label animation on focus
    const inputs = document.querySelectorAll('.input-group input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.querySelector('label').classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.querySelector('label').classList.remove('focused');
            }
        });
        
        // Initialize labels for pre-filled inputs (if any)
        if (input.value) {
            input.parentNode.querySelector('label').classList.add('focused');
        }
    });
    
    // Add subtle animation to form elements when they become visible
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe form elements for scroll animations
    const formElements = document.querySelectorAll('.input-group, .form-options, .submit-btn');
    formElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});