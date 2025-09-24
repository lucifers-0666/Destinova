document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // MANAGE MENU VISIBILITY (from index.js)
    // =============================================
    function handleManageMenuVisibility() {
        const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
        const hasBooked = localStorage.getItem('hasBookedTicket') === 'true';

        const manageMenuDesktop = document.getElementById('manage-menu-desktop');
        const manageMenuMobile = document.getElementById('manage-menu-mobile');

        if (!(isSignedIn && hasBooked)) {
            if (manageMenuDesktop) manageMenuDesktop.classList.add('manage-menu-hidden');
            if (manageMenuMobile) manageMenuMobile.classList.add('manage-menu-hidden');
        }
    }
    handleManageMenuVisibility();
    // =============================================
    // HEADER & NAVIGATION LOGIC (from index.js)
    // =============================================

    // --- ACTIVE PAGE INDICATOR IN NAVBAR ---
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.header-desktop-nav a, .header-mobile-nav a');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();

            if (linkPage === currentPage) {
                link.classList.add('nav-active');

                // If the active link is inside a dropdown, also highlight the main dropdown link
                const dropdownParent = link.closest('.header-dropdown');
                if (dropdownParent) {
                    const parentLink = dropdownParent.querySelector(':scope > a');
                    if (parentLink) parentLink.classList.add('nav-active');
                }
            }
        });
    }
    setActiveNavLink();

    // --- HEADER SCROLL & MOBILE MENU ---
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
            e.preventDefault();
            const parent = link.parentElement;
            parent.classList.toggle('header-open');
        });
    });

    // =============================================
    // PAGE-SPECIFIC: SMOOTH SCROLL FOR "START EXPLORING" BUTTON
    // =============================================
    const exploreBtn = document.getElementById('explore-destinations-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function (e) {
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
    function initializeSlider(sliderId, options = {}) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const track = slider.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const nextButton = slider.querySelector('.next') || slider.parentElement.querySelector('.next');
        const prevButton = slider.querySelector('.prev') || slider.parentElement.querySelector('.prev');
        const dotsContainer = slider.parentElement.querySelector('.testimonial-dots-container');

        if (slides.length === 0) return;

        const config = {
            slidesToShow: options.slidesToShow || 1,
            autoPlay: options.autoPlay || false,
            autoPlaySpeed: options.autoPlaySpeed || 5000,
        };

        let slideWidth = slides[0].offsetWidth + (parseFloat(getComputedStyle(slides[0]).marginRight) || 0) * 2;
        let currentIndex = 0;
        let autoPlayInterval;

        const totalSlides = slides.length;
        const maxIndex = Math.ceil(totalSlides / config.slidesToShow) -1;

        const updateSliderPosition = () => {
            const moveDistance = currentIndex * (slideWidth * config.slidesToShow);
            track.style.transform = `translateX(-${moveDistance}px)`;
            track.style.transition = 'transform 0.5s ease-in-out';
            updateDots();
        };

        const updateDots = () => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < maxIndex) ? currentIndex + 1 : 0;
                updateSliderPosition();
                if (config.autoPlay) resetAutoPlay();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : maxIndex;
                updateSliderPosition();
                if (config.autoPlay) resetAutoPlay();
            });
        }

        if (dotsContainer) {
            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSliderPosition();
                    if (config.autoPlay) resetAutoPlay();
                });
                dotsContainer.appendChild(dot);
            }
            updateDots();
        }

        const startAutoPlay = () => autoPlayInterval = setInterval(() => nextButton.click(), config.autoPlaySpeed);
        const resetAutoPlay = () => { clearInterval(autoPlayInterval); startAutoPlay(); };

        if (config.autoPlay) startAutoPlay();

        window.addEventListener('resize', () => {
            slideWidth = slides[0].offsetWidth + (parseFloat(getComputedStyle(slides[0]).marginRight) || 0) * 2;
            track.style.transition = 'none';
            updateSliderPosition();
        });
    }

    initializeSlider('offers-slider');
    // Updated initialization for the new testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider-container');
    if (testimonialSlider) {
        initializeSlider(testimonialSlider.id, { slidesToShow: 1, autoPlay: true });
    }

    // =============================================
    // PAGE-SPECIFIC: COUNTDOWN TIMERS FOR OFFERS
    // =============================================
    function initializeCountdownTimers() {
        const countdownElements = document.querySelectorAll('.offer-countdown');

        countdownElements.forEach(element => {
            const endTime = new Date(element.dataset.endTime).getTime();

            if (isNaN(endTime)) {
                element.innerHTML = "Offer expired";
                return;
            }

            const timerInterval = setInterval(() => {
                const now = new Date().getTime();
                const distance = endTime - now;

                if (distance < 0) {
                    clearInterval(timerInterval);
                    element.innerHTML = "Offer Expired";
                    return;
                }

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Pad with leading zeros
                const fHours = hours.toString().padStart(2, '0');
                const fMinutes = minutes.toString().padStart(2, '0');
                const fSeconds = seconds.toString().padStart(2, '0');

                element.innerHTML = `<i class="far fa-clock"></i> ${days}d ${fHours}:${fMinutes}:${fSeconds}`;
            }, 1000);
        });
    }
    initializeCountdownTimers();

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

    // =============================================
    // PAGE-SPECIFIC: TRAVEL YOUR WAY INTERACTIVITY
    // =============================================
    function initializeTravelStyles() {
        const container = document.querySelector('.travel-style-container');
        if (!container) return;

        const options = container.querySelectorAll('.style-option');
        const images = container.querySelectorAll('.style-image');

        options.forEach(option => {
            option.addEventListener('click', () => {
                const style = option.dataset.style;

                // Update active state for options
                options.forEach(opt => {
                    opt.classList.toggle('active', opt.dataset.style === style);
                });

                // Update active state for images
                images.forEach(img => {
                    img.classList.toggle('active', img.dataset.style === style);
                });

                // Optional: Update the "Find Flights" button link
                const ctaButton = container.querySelector('.style-preview-content .btn');
                if (ctaButton) {
                    ctaButton.href = `booking.html?category=${style}`;
                }
            });
        });
    }
    initializeTravelStyles();

    // =============================================
    // PAGE-SPECIFIC: INSPIRATION CARD GLOW EFFECT
    // =============================================
    function initializeInspirationCardGlow() {
        const card = document.querySelector('.inspiration-card-modern');
        if (!card) return;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Use setProperty to update CSS custom properties for the glow
            card.style.setProperty('--glow-x', `${x}px`);
            card.style.setProperty('--glow-y', `${y}px`);
        });
    }
    initializeInspirationCardGlow();

    // =============================================
    // PAGE-SPECIFIC: ENHANCED BOOKING SECTION ANIMATIONS
    // =============================================
    function initializeEnhancedBookingSection() {
        const iconsContainer = document.querySelector('.floating-icons-bg');
        const tickerContainer = document.querySelector('.success-ticker');

        // 1. Generate Floating Background Icons
        if (iconsContainer) {
            const icons = ['fa-plane', 'fa-globe-americas', 'fa-suitcase', 'fa-map-marked-alt', 'fa-passport', 'fa-compass'];
            for (let i = 0; i < 15; i++) {
                const icon = document.createElement('i');
                icon.className = `fas ${icons[Math.floor(Math.random() * icons.length)]}`;
                icon.style.left = `${Math.random() * 100}%`;
                icon.style.top = `${Math.random() * 100}%`;
                icon.style.fontSize = `${Math.random() * 30 + 20}px`;
                icon.style.animationDuration = `${Math.random() * 20 + 15}s`;
                icon.style.animationDelay = `${Math.random() * -20}s`;
                iconsContainer.appendChild(icon);
            }
        }

        // 2. Generate Success Stories Ticker
        if (tickerContainer) {
            const stories = [
                "<strong>Maria S.</strong> just booked a family trip to <strong>Paris</strong>!",
                "<strong>David L.</strong> saved <strong>₹8,500</strong> on a business flight to <strong>New York</strong>.",
                "<strong>Aisha K.</strong> is exploring <strong>Kyoto's</strong> temples.",
                "<strong>The Chen Family</strong> are on their way to a <strong>Kenyan Safari</strong>.",
                "<strong>Raj P.</strong> found a last-minute deal to the <strong>Maldives</strong>.",
                "<strong>Sophie B.</strong> is enjoying the sunsets in <strong>Santorini</strong>."
            ];

            // Duplicate stories for a seamless loop
            const allStories = [...stories, ...stories];

            allStories.forEach(story => {
                const item = document.createElement('div');
                item.className = 'success-ticker-item';
                item.innerHTML = `<i class="fas fa-check-circle"></i> ${story}`;
                tickerContainer.appendChild(item);
            });
        }
    }
    initializeEnhancedBookingSection();

});