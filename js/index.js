document.addEventListener('DOMContentLoaded', function () {
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

        document.querySelectorAll('.header-mobile-nav a').forEach(link => {
            if (!link.parentElement.classList.contains('header-dropdown')) {
                link.addEventListener('click', toggleMenu);
            }
        });
    }

    document.querySelectorAll('.header-mobile-nav .header-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = link.parentElement;
            parent.classList.toggle('header-open');
        });
    });

    // --- MAIN CONTENT FUNCTIONALITY ---
    // Passenger selector functionality
    const passengersInput = document.getElementById('passengers');
    if (passengersInput) {
        const passengerDropdown = document.querySelector('.home-passenger-dropdown');
        const adultCountEl = document.getElementById('adult-count');
        const childCountEl = document.getElementById('child-count');

        if (passengerDropdown && adultCountEl && childCountEl) {
            let adults = 1;
            let children = 0;

            passengersInput.addEventListener('click', function (event) {
                event.stopPropagation();
                passengerDropdown.style.display = passengerDropdown.style.display === 'block' ? 'none' : 'block';
            });

            document.addEventListener('click', function (e) {
                if (!e.target.closest('.home-passenger-selector')) {
                    passengerDropdown.style.display = 'none';
                }
            });

            function updatePassengerDisplay() {
                let text = `${adults} Adult${adults !== 1 ? 's' : ''}`;
                if (children > 0) {
                    text += `, ${children} Child${children !== 1 ? 'ren' : ''}`;
                }
                passengersInput.value = text;
                adultCountEl.textContent = adults;
                childCountEl.textContent = children;
            }

            const incAdult = document.querySelector('.increase-adult');
            if (incAdult) incAdult.addEventListener('click', () => { if (adults < 9) adults++; updatePassengerDisplay(); });

            const decAdult = document.querySelector('.decrease-adult');
            if (decAdult) decAdult.addEventListener('click', () => { if (adults > 1) adults--; updatePassengerDisplay(); });

            const incChild = document.querySelector('.increase-child');
            if (incChild) incChild.addEventListener('click', () => { if (children < 6) children++; updatePassengerDisplay(); });

            const decChild = document.querySelector('.decrease-child');
            if (decChild) decChild.addEventListener('click', () => { if (children > 0) children--; updatePassengerDisplay(); });

            updatePassengerDisplay();
        }
    }

    // --- REBUILT FLIGHT CLASS SLIDERS with Full Controls ---
    function initializeSlider(sliderId) {
        const wrapper = document.getElementById(sliderId);
        if (!wrapper) return;

        const slides = wrapper.querySelectorAll('.home-class-slide');
        const prevBtn = wrapper.querySelector('.home-prev');
        const nextBtn = wrapper.querySelector('.home-next');
        const dotsContainer = wrapper.querySelector('.home-slider-dots');

        if (slides.length === 0) return;

        let currentIndex = 0;
        let autoPlayInterval;

        // Create dots dynamically
        dotsContainer.innerHTML = ''; // Clear existing dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('home-dot');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.home-dot');

        function goToSlide(index) {
            // Loop around if index is out of bounds
            currentIndex = (index + slides.length) % slides.length;

            // Update slides
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentIndex);
            });

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            resetAutoPlay();
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });

            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }

        // Initial setup
        goToSlide(0); // Set initial active slide and dot
        startAutoPlay();
    }

    // Initialize all sliders
    initializeSlider('home-slider-economy');
    initializeSlider('home-slider-premium');
    initializeSlider('home-slider-business');
    initializeSlider('home-slider-first');


    // Initialize AOS for other sections
    AOS.init({
        duration: 800,
        once: true,
        offset: 150,
        easing: 'ease-out-quad'
    });

    // --- Custom Scroll-Based Reveal Animation ---
    try {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const elementsToReveal = document.querySelectorAll('[data-animation="reveal"]');
        if (elementsToReveal.length > 0) {
            elementsToReveal.forEach(el => revealObserver.observe(el));
        }
    } catch (e) { console.error("Intersection Observer error:", e); }

    // --- CTA Button Click Animation ---
    const ctaButtons = document.querySelectorAll('.home-alt-content-container .btn.btn-primary');
    if (ctaButtons.length > 0) {
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (button.classList.contains('is-clicked')) return;
                button.classList.add('is-clicked');
                setTimeout(() => button.classList.remove('is-clicked'), 1000);
            });
        });
    }

    // --- FOOTER FUNCTIONALITY ---
    function initializeFooterScripts() {
        const footer = document.getElementById('destinova-footer');
        if (footer) {
            try {
                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            footer.classList.add('in-view');
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                observer.observe(footer);
            } catch (e) { console.error("Footer Observer error:", e); }
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
            scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    }

    initializeFooterScripts();
});