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
    // HERO SECTION: CINEMATIC UPGRADE
    // =============================================

    // --- 1. Typing Animation for Headline ---
    function typeAnimation() {
        const headline = document.getElementById('hero-headline');
        if (!headline) return;

        const text = "Turn Your Travel Dreams Into Unforgettable Adventures";
        let i = 0;
        headline.innerHTML = ""; // Clear existing text

        function type() {
            if (i < text.length) {
                headline.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 50); // Adjust typing speed here
            } else {
                headline.classList.add('typing-finished'); // Optional class to stop blinking cursor
            }
        }
        type();
    }

    // --- 2. Personalization: Time & Geo Greeting ---
    function personalizeHero() {
        const timeGreeting = document.getElementById('time-based-greeting');
        const geoGreeting = document.getElementById('geo-location-greeting');

        // Time-based greeting
        if (timeGreeting) {
            const hour = new Date().getHours();
            let greeting = "Ready for an adventure?";
            if (hour < 12) {
                greeting = "Good morning! Ready for an adventure?";
            } else if (hour < 18) {
                greeting = "Good afternoon! Where to next?";
            } else {
                greeting = "Good evening! Planning a getaway?";
            }
            timeGreeting.textContent = greeting;
        }

        // Geo-location greeting (mocked for demonstration)
        if (geoGreeting) {
            // In a real app, you would use a Geolocation API
            const cities = ["New York", "London", "Tokyo", "Sydney", "your city"];
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            geoGreeting.textContent = `Discover amazing trips from ${randomCity}`;
        }
    }

    // --- 3. Trust Indicator Counter Animation ---
    function animateCounters() {
        const ratingCounter = document.getElementById('rating-counter');

        const animateValue = (element, start, end, duration, decimals = 1) => {
            if (!element) return;
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = progress * (end - start) + start;
                element.innerText = value.toFixed(decimals);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (ratingCounter) animateValue(ratingCounter, 0, 4.9, 2000, 1);
                    // You can add the "50,000+" counter here if you add an ID to it
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const trustIndicators = document.querySelector('.trust-indicators');
        if (trustIndicators) {
            observer.observe(trustIndicators);
        }
    }

    // --- 4. Smart Search Enhancements ---
    function initializeSmartSearch() {
        const destinationInput = document.getElementById('hero-destination-input');
        const autocompleteContainer = document.getElementById('autocomplete-results');
        const surpriseBtn = document.getElementById('surprise-me-btn');

        if (!destinationInput || !autocompleteContainer) return;

        const mockDestinations = [
            { name: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760c0341?q=80&w=100' },
            { name: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=100' },
            { name: 'Bora Bora', country: 'French Polynesia', img: 'https://images.unsplash.com/photo-1507525428034-b723a996f3ea?q=80&w=100' },
            { name: 'Rome', country: 'Italy', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=100' },
            { name: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=100' }
        ];

        destinationInput.addEventListener('input', () => {
            const query = destinationInput.value.toLowerCase();
            if (query.length < 2) {
                autocompleteContainer.style.display = 'none';
                return;
            }

            const filtered = mockDestinations.filter(d => d.name.toLowerCase().includes(query));
            autocompleteContainer.innerHTML = '';

            if (filtered.length > 0) {
                filtered.forEach(dest => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.innerHTML = `
                        <img src="${dest.img}" alt="${dest.name}">
                        <div>
                            <div class="item-name">${dest.name}</div>
                            <div class="item-country">${dest.country}</div>
                        </div>
                    `;
                    item.addEventListener('click', () => {
                        destinationInput.value = dest.name;
                        autocompleteContainer.style.display = 'none';
                    });
                    autocompleteContainer.appendChild(item);
                });
                autocompleteContainer.style.display = 'block';
            } else {
                autocompleteContainer.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!destinationInput.contains(e.target)) {
                autocompleteContainer.style.display = 'none';
            }
        });

        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', () => {
                const randomDest = mockDestinations[Math.floor(Math.random() * mockDestinations.length)];
                destinationInput.value = randomDest.name;
            });
        }

        // Smart suggestions based on season
        const month = new Date().getMonth();
        const suggestion1 = document.getElementById('suggestion-1');
        const suggestion2 = document.getElementById('suggestion-2');
        if (suggestion1 && suggestion2) {
            if (month >= 5 && month <= 8) { // Summer
                suggestion1.textContent = 'Beach Escapes';
                suggestion2.textContent = 'Mountain Hikes';
            } else { // Winter/Other
                suggestion1.textContent = 'City Breaks';
                suggestion2.textContent = 'Cultural Tours';
            }
            document.querySelector('.smart-suggestions').style.display = 'flex';
        }
    }

    // --- 5. Live Booking Ticker ---
    function initializeLiveTicker() {
        const ticker = document.getElementById('live-booking-ticker');
        const tickerText = document.getElementById('ticker-text');
        const tickerTime = document.getElementById('ticker-time');
        if (!ticker || !tickerText || !tickerTime) return;

        const mockBookings = [
            "Michael from London just booked a trip to Rome!",
            "The Smith family is heading to Orlando!",
            "Priya from Mumbai found a deal to Dubai!",
            "Kenji from Osaka is exploring the temples of Kyoto."
        ];

        let bookingIndex = 0;

        setInterval(() => {
            ticker.classList.remove('visible');
            setTimeout(() => {
                bookingIndex = (bookingIndex + 1) % mockBookings.length;
                tickerText.textContent = mockBookings[bookingIndex];
                tickerTime.textContent = `${Math.floor(Math.random() * 10) + 1} minutes ago`;
                ticker.classList.add('visible');
            }, 500);
        }, 8000); // Change every 8 seconds
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

    // --- Initialize All New Hero Features ---
    typeAnimation();
    personalizeHero();
    animateCounters();
    initializeSmartSearch();
    initializeLiveTicker();


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
    // PAGE-SPECIFIC: NEW TESTIMONIAL CAROUSEL
    // =============================================
    function initializeTestimonialCarousel() {
        const container = document.getElementById('testimonial-carousel');
        if (!container) return;

        const track = container.querySelector('.testimonial-carousel-track');
        const cards = Array.from(track.children);
        const dotsContainer = container.nextElementSibling;
        if (!dotsContainer || cards.length === 0) return;

        let currentIndex = 0;
        let autoPlayInterval;

        const getVisibleCardsCount = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1200) return 2;
            return 3;
        };

        const totalPages = Math.ceil(cards.length / getVisibleCardsCount());

        // Create dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            dot.addEventListener('click', () => {
                goToPage(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
        const dots = Array.from(dotsContainer.children);

        function goToPage(pageIndex) {
            currentIndex = pageIndex;
            const visibleCards = getVisibleCardsCount();
            const cardWidth = cards[0].offsetWidth;
            const gap = parseInt(getComputedStyle(track).gap) || 30;
            const offset = currentIndex * visibleCards * (cardWidth + gap);
            
            track.style.transform = `translateX(-${offset}px)`;

            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        function autoPlay() {
            const nextPage = (currentIndex + 1) % totalPages;
            goToPage(nextPage);
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(autoPlay, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        goToPage(0);
        startAutoPlay();
    }
    initializeTestimonialCarousel();
});