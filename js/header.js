document.addEventListener('DOMContentLoaded', function() {
    // Wait for the header to be loaded before initializing
    setTimeout(initializeHeader, 100);
});

function initializeHeader() {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Toggle login state
    let isLoggedIn = false;
    const signInBtn = document.getElementById('signInBtn');
    const userIcon = document.getElementById('userIcon');
    
    if (signInBtn && userIcon) {
        signInBtn.addEventListener('click', () => {
            isLoggedIn = true;
            signInBtn.style.display = 'none';
            userIcon.style.display = 'flex';
        });
        
        userIcon.addEventListener('click', () => {
            isLoggedIn = false;
            userIcon.style.display = 'none';
            signInBtn.style.display = 'flex';
        });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && closeMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && 
                !mobileMenuBtn.contains(e.target) && 
                e.target !== mobileMenuBtn) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = document.querySelectorAll('.mobile-menu .nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}
