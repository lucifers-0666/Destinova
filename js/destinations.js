document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // HEADER SCROLL & MOBILE MENU LOGIC (NEW SCRIPT)
    // =============================================
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

        // Close menu when a link is clicked (if it's not a dropdown)
        document.querySelectorAll('.header-mobile-nav a').forEach(link => {
            if (!link.parentElement.classList.contains('header-dropdown')) {
                link.addEventListener('click', toggleMenu);
            }
        });
    }

    // Handle mobile dropdowns
    document.querySelectorAll('.header-mobile-nav .header-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                const parent = link.parentElement;
                parent.classList.toggle('header-open');
            }
        });
    });

    // =============================================
    // PAGE-SPECIFIC: SMOOTH SCROLL FOR "START EXPLORING" BUTTON
    // =============================================
    const startExploringBtn = document.getElementById('start-exploring-btn');
    if (startExploringBtn) {
        startExploringBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // =============================================
    // PAGE-SPECIFIC: REUSABLE SLIDER FUNCTIONALITY
    // =============================================
    function initializeSlider(sliderId) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const track = slider.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const nextButton = slider.querySelector('.next');
        const prevButton = slider.querySelector('.prev');

        if (slides.length <= 1) return;

        let slideWidth = slides[0].getBoundingClientRect().width + parseInt(getComputedStyle(slides[0]).marginRight || 0) * 2;
        let currentIndex = 0;

        const updateSliderPosition = () => {
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            track.style.transition = 'transform 0.5s ease-in-out';
        };

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateSliderPosition();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateSliderPosition();
        });

        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width + parseInt(getComputedStyle(slides[0]).marginRight || 0) * 2;
            track.style.transition = 'none';
            updateSliderPosition();
        });
    }

    initializeSlider('offers-slider');
    initializeSlider('testimonials-slider');

    // =============================================
    // PAGE-SPECIFIC: SCROLL-TRIGGERED ANIMATIONS
    // =============================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // =============================================
    // FOOTER FUNCTIONALITY (NEW SCRIPT)
    // =============================================
    function initializeFooterScripts() {
        // Animate footer into view
        const footer = document.getElementById('destinova-footer');
        if (footer) {
            const footerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        footer.classList.add('in-view');
                        footerObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            footerObserver.observe(footer);
        }

        // Newsletter form submission
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function (e) {
                e.preventDefault();
                this.classList.add('submitted');
                console.log('Newsletter subscription submitted!');

                setTimeout(() => {
                    this.classList.remove('submitted');
                    this.reset();
                }, 1000);
            });
        }

        // Scroll-to-top button
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });

            scrollToTopBtn.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    initializeFooterScripts(); // Run the footer scripts
});