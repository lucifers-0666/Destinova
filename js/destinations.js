document.addEventListener('DOMContentLoaded', function () {

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
    // FOOTER-RELATED: SCROLL TO TOP BUTTON
    // =============================================
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =============================================
    // FOOTER-RELATED: NEWSLETTER & ANIMATIONS
    // =============================================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            this.classList.add('submitted');
            setTimeout(() => {
                this.classList.remove('submitted');
                const input = this.querySelector('input[type="email"]');
                if(input) input.value = '';
            }, 2000);
        });
    }

    // =============================================
    // FOOTER-RELATED: SCROLL-IN ANIMATION
    // =============================================
    const footer = document.getElementById('destinova-footer');
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.classList.add('in-view');
                    footerObserver.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the footer is visible

        footerObserver.observe(footer);
    }

});