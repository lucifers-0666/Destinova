// header-footer.js

function initializeHeaderAndFooter() {
    // --- HEADER FUNCTIONALITY ---
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

    // Close mobile menu when a link is clicked (if it's not a dropdown)
    document.querySelectorAll('.header-mobile-nav a').forEach(link => {
        if (!link.parentElement.classList.contains('header-dropdown')) {
            link.addEventListener('click', () => {
                const nav = document.getElementById('header-mobile-nav');
                const overlay = document.getElementById('header-mobileNavOverlay');
                if (nav.classList.contains('header-active')) {
                    nav.classList.remove('header-active');
                    overlay.classList.remove('header-active');
                    document.body.style.overflow = '';
                }
            });
        }
    });
    
    // Handle mobile dropdowns
    document.querySelectorAll('.header-mobile-nav .header-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = link.parentElement;
            parent.classList.toggle('header-open');
        });
    });


    // --- FOOTER FUNCTIONALITY ---
    const footer = document.getElementById('destinova-footer');
    if (footer) {
        // Use a try-catch block for IntersectionObserver for wider browser compatibility
        try {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        footer.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(footer);
        } catch (e) {
            console.error("Intersection Observer not supported or failed:", e);
            // Fallback for older browsers: just show the footer
            footer.classList.add('in-view');
        }
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            this.classList.add('submitted');
            setTimeout(() => {
                this.classList.remove('submitted');
                this.reset();
            }, 1000);
        });
    }

    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function () {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}
