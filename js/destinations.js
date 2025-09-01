document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // HEADER SCROLL & MOBILE MENU LOGIC
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
            // Prevent body scroll when menu is open
            document.body.style.overflow = nav.classList.contains('header-active') ? 'hidden' : '';
        };
        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    }

    // Handle mobile dropdowns
    document.querySelectorAll('.header-mobile-nav .header-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if the clicked link has a valid href other than '#'
            if (link.getAttribute('href') === '#') {
                e.preventDefault(); // Prevent navigation only for placeholder dropdown links
                const parent = link.parentElement;
                parent.classList.toggle('header-open');
            }
        });
    });

    // =============================================
    // SMOOTH SCROLL FOR "START EXPLORING" BUTTON
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
    // REUSABLE SLIDER FUNCTIONALITY
    // =============================================
    function initializeSlider(sliderId) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const track = slider.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const nextButton = slider.querySelector('.next');
        const prevButton = slider.querySelector('.prev');

        if (slides.length <= 1) return; // No need for slider if 1 or 0 slides

        let slideWidth = slides[0].getBoundingClientRect().width + parseInt(getComputedStyle(slides[0]).marginRight) * 2;
        let currentIndex = 0;

        const updateSliderPosition = () => {
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            track.style.transition = 'transform 0.5s ease-in-out';
        };

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop to start
            }
            updateSliderPosition();
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = slides.length - 1; // Loop to end
            }
            updateSliderPosition();
        });

        // Adjust on window resize
        window.addEventListener('resize', () => {
            slideWidth = slides[0].getBoundingClientRect().width + parseInt(getComputedStyle(slides[0]).marginRight) * 2;
            track.style.transition = 'none'; // Disable transition during resize adjustment
            updateSliderPosition();
        });
    }

    initializeSlider('offers-slider');
    initializeSlider('testimonials-slider');

    // =============================================
    // SCROLL-TRIGGERED FADE/SLIDE-IN ANIMATIONS
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

});