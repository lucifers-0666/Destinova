document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // DYNAMICALLY LOAD HEADER & FOOTER
    // =============================================
    const headerPlaceholder = document.getElementById('header-main');
    const footerPlaceholder = document.getElementById('destinova-footer');

    // Assuming header.html and footer.html are in the same 'html' directory
    if (headerPlaceholder) {
        fetch('header.html')
            .then(res => res.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initializeHeaderScripts();
            });
    }

    if (footerPlaceholder) {
        fetch('footer.html')
            .then(res => res.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
                initializeFooterScripts();
            });
    }
    
    // =============================================
    // HEADER SCRIPTS
    // =============================================
    function initializeHeaderScripts() {
        const header = document.getElementById('header-main');
        if (header) {
            window.addEventListener('scroll', () => {
                header.classList.toggle('header-scrolled', window.scrollY > 50);
            });
        }
        const menuToggle = document.getElementById('header-menuToggle');
        const nav = document.getElementById('header-mobile-nav');
        const overlay = document.getElementById('header-mobileNavOverlay');
        if (menuToggle && nav && overlay) {
            const toggleMenu = () => {
                nav.classList.toggle('header-active');
                overlay.classList.toggle('header-active');
                document.body.style.overflow = nav.classList.contains('header-active') ? 'hidden' : '';
            };
            menuToggle.addEventListener('click', toggleMenu);
            overlay.addEventListener('click', toggleMenu);
        }
        document.querySelectorAll('.header-mobile-nav .header-dropdown > a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                    link.parentElement.classList.toggle('header-open');
                }
            });
        });
    }

    // =============================================
    // FOOTER SCRIPTS
    // =============================================
    function initializeFooterScripts() {
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            window.addEventListener('scroll', function() {
                scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
            });
            scrollToTopBtn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // =============================================
    // SHARED AUTH FORM SCRIPTS
    // =============================================
    // Password visibility toggle
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordField = this.previousElementSibling.previousElementSibling;
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function highlightError(input, message) {
        input.style.borderColor = '#DC2626';
        let errorDiv = input.parentElement.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            input.parentElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    function removeHighlight(input) {
        input.style.borderColor = '';
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // =============================================
    // SIGN-IN FORM SPECIFIC LOGIC
    // =============================================
    const signInForm = document.getElementById('signin-form');
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            let isValid = true;

            if (!isValidEmail(email.value)) {
                isValid = false;
                highlightError(email, 'Please enter a valid email address');
            } else { removeHighlight(email); }

            if (!password.value.trim()) {
                isValid = false;
                highlightError(password, 'Password is required');
            } else { removeHighlight(password); }

            if (isValid) {
                const submitBtn = this.querySelector('.submit-btn');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
                submitBtn.disabled = true;
                setTimeout(() => {
                    alert('Signed in successfully! (This is a demo)');
                    submitBtn.innerHTML = 'Sign In';
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }

    // =============================================
    // SIGN-UP FORM SPECIFIC LOGIC
    // =============================================
    const signUpForm = document.getElementById('signup-form');
    if (signUpForm) {
        const passwordField = document.getElementById('password');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        passwordField.addEventListener('input', updatePasswordStrength);

        function updatePasswordStrength() {
            const value = passwordField.value;
            let strength = 0;
            if (value.length > 7) strength++; // Length
            if (value.match(/[A-Z]/)) strength++; // Uppercase
            if (value.match(/[0-9]/)) strength++; // Numbers
            if (value.match(/[^A-Za-z0-9]/)) strength++; // Symbols

            strengthBar.className = 'strength-bar';
            switch (strength) {
                case 1:
                case 2:
                    strengthBar.classList.add('weak');
                    strengthText.textContent = 'Weak';
                    break;
                case 3:
                    strengthBar.classList.add('medium');
                    strengthText.textContent = 'Medium';
                    break;
                case 4:
                    strengthBar.classList.add('strong');
                    strengthText.textContent = 'Strong';
                    break;
                default:
                    strengthText.textContent = '';
            }
        }

        signUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullname = document.getElementById('fullname');
            const email = document.getElementById('email');
            const confirmPassword = document.getElementById('confirm-password');
            const terms = document.getElementById('terms');
            let isValid = true;
            
            // Re-validate all fields on submit
            if (!fullname.value.trim()) { isValid = false; highlightError(fullname, 'Full name is required'); } else { removeHighlight(fullname); }
            if (!isValidEmail(email.value)) { isValid = false; highlightError(email, 'Please enter a valid email address'); } else { removeHighlight(email); }
            if (passwordField.value.length < 8) { isValid = false; highlightError(passwordField, 'Password must be at least 8 characters'); } else { removeHighlight(passwordField); }
            if (passwordField.value !== confirmPassword.value) { isValid = false; highlightError(confirmPassword, 'Passwords do not match'); } else { removeHighlight(confirmPassword); }
            
            if (!terms.checked) {
                isValid = false;
                alert('You must agree to the Terms & Conditions.');
            }
            
            if (isValid) {
                const submitBtn = this.querySelector('.submit-btn');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
                submitBtn.disabled = true;
                setTimeout(() => {
                    alert('Account created successfully! Redirecting to sign-in... (This is a demo)');
                    window.location.href = 'sign-in.html';
                }, 1500);
            }
        });
    }
});