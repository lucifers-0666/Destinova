document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // HEADER SCRIPTS (FOR MOBILE MENU)
    // =============================================
    const menuToggle = document.getElementById('header-menuToggle');
    const nav = document.getElementById('header-mobile-nav');
    const overlay = document.getElementById('header-mobileNavOverlay');

    if (menuToggle && nav && overlay) {
        const toggleMenu = () => {
            nav.classList.toggle('header-active');
            overlay.classList.toggle('header-active');
            // Prevent body from scrolling when mobile menu is open
            document.body.style.overflow = nav.classList.contains('header-active') ? 'hidden' : '';
        };
        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    }
    
    // =============================================
    // FOOTER SCRIPTS (FOR SCROLL-TO-TOP BUTTON)
    // =============================================
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =============================================
    // SIGN-IN FORM SPECIFIC LOGIC
    // =============================================
    const signInForm = document.getElementById('signin-form');
    if (signInForm) {
        // --- Password visibility toggle ---
        const passwordToggle = signInForm.querySelector('.password-toggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', function() {
                const passwordField = document.getElementById('password');
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }

        // --- Form submission and validation ---
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission

            // Add your validation logic here if needed
            console.log('Sign-in form submitted (demo).');
            alert('Signed in successfully! (This is a demo)');
        });
    }
});