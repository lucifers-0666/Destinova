document.addEventListener('DOMContentLoaded', function() {
    const signUpForm = document.getElementById('signup-form');
    
    // Form validation and submission
    signUpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const fullname = document.getElementById('fullname');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirm-password');
        const terms = document.getElementById('terms');
        let isValid = true;
        
        if (!fullname.value.trim()) {
            isValid = false;
            highlightError(fullname, 'Full name is required');
        } else {
            removeHighlight(fullname);
        }
        
        if (!email.value.trim()) {
            isValid = false;
            highlightError(email, 'Email is required');
        } else if (!isValidEmail(email.value)) {
            isValid = false;
            highlightError(email, 'Please enter a valid email address');
        } else {
            removeHighlight(email);
        }
        
        if (!password.value.trim()) {
            isValid = false;
            highlightError(password, 'Password is required');
        } else if (password.value.length < 8) {
            isValid = false;
            highlightError(password, 'Password must be at least 8 characters');
        } else {
            removeHighlight(password);
        }
        
        if (!confirmPassword.value.trim()) {
            isValid = false;
            highlightError(confirmPassword, 'Please confirm your password');
        } else if (password.value !== confirmPassword.value) {
            isValid = false;
            highlightError(confirmPassword, 'Passwords do not match');
        } else {
            removeHighlight(confirmPassword);
        }
        
        if (!terms.checked) {
            isValid = false;
            const termsLabel = document.querySelector('.checkbox-container');
            termsLabel.style.color = '#DC2626';
        } else {
            const termsLabel = document.querySelector('.checkbox-container');
            termsLabel.style.color = '#6B7280';
        }
        
        if (isValid) {
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Account created successfully! (This is a demo)');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                signUpForm.reset();
                
                // Redirect to sign-in page after successful sign-up
                setTimeout(() => {
                    window.location.href = 'sign-in.html';
                }, 1000);
            }, 1500);
        }
    });
    
    // Helper functions
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function highlightError(input, message) {
        input.style.borderColor = '#DC2626';
        
        // Add error message if not exists
        if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#DC2626';
            errorDiv.style.fontSize = '12px';
            errorDiv.style.marginTop = '5px';
            errorDiv.textContent = message;
            
            input.parentNode.appendChild(errorDiv);
        } else {
            // Update existing error message
            input.nextElementSibling.textContent = message;
        }
    }
    
    function removeHighlight(input) {
        input.style.borderColor = '';
        
        // Remove error message if exists
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    // Input label animation
    const inputs = document.querySelectorAll('.input-group input');
    
    inputs.forEach(input => {
        // Initialize labels for pre-filled inputs (if any)
        if (input.value) {
            input.parentNode.querySelector('label').classList.add('focused');
        }
        
        input.addEventListener('focus', function() {
            this.parentNode.querySelector('label').classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.querySelector('label').classList.remove('focused');
            }
        });
    });
});