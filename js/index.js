document.addEventListener('DOMContentLoaded', function () {
    // --- MANAGE MENU VISIBILITY ---
    function handleManageMenuVisibility() {
        const hasBooked = localStorage.getItem('hasBookedTicket') === 'true';
        const manageMenuDesktop = document.getElementById('manage-menu-desktop');
        const manageMenuMobile = document.getElementById('manage-menu-mobile');

        if (!hasBooked) {
            if (manageMenuDesktop) manageMenuDesktop.classList.add('manage-menu-hidden');
            if (manageMenuMobile) manageMenuMobile.classList.add('manage-menu-hidden');
        } else {
            if (manageMenuDesktop) manageMenuDesktop.classList.remove('manage-menu-hidden');
            if (manageMenuMobile) manageMenuMobile.classList.remove('manage-menu-hidden');
        }
    }
    handleManageMenuVisibility(); // Call on page load

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
                    if(parentLink) parentLink.classList.add('nav-active');
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

    // Page indicator text (shows current page under header)
    const indicator = document.getElementById('page-indicator');
    if (indicator) {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const mapping = {
            'index.html': 'Home',
            'booking.html': 'Book Flights',
            'destinations.html': 'Destinations',
            'classes.html': 'Travel Classes',
            'offers.html': 'Special Offers',
            'loyalty.html': 'Loyalty Program',
            'manage.html': 'Manage Booking',
            'checkin.html': 'Check-in',
            'status.html': 'Flight Status',
            'about.html': 'About Us',
            'contact.html': 'Contact',
            'signin.html': 'Sign In'
        };
        const label = mapping[path] || 'Page';
        indicator.textContent = `You are on: ${label}`;
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

    // --- TRAVEL CLASS TABS ---
    function initializeTravelClassTabs() {
        const tabContainer = document.querySelector('.travel-class-tabs-container');
        if (!tabContainer) return;

        const tabButtons = tabContainer.querySelectorAll('.tab-button');
        const tabPanels = tabContainer.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;

                // Update buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Update panels
                tabPanels.forEach(panel => {
                    panel.classList.toggle('active', panel.id === `tab-${tabId}`);
                });
            });
        });
    }
    initializeTravelClassTabs();

    // --- OFFERS CAROUSEL FUNCTIONALITY ---
    function initializeOffersCarousel() {
        const container = document.querySelector('.home-offers-carousel-container');
        const carousel = document.querySelector('.home-offers-carousel');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const cards = document.querySelectorAll('.home-offer-card');

        if (!container || !carousel || !prevBtn || !nextBtn || cards.length === 0) return;

        let currentIndex = 0;
        let cardWidthWithGap = 0;
        let maxIndex = 0;

        function updateCarouselState() {
            const gap = window.innerWidth <= 768 ? 20 : 30;
            carousel.style.gap = `${gap}px`;

            const firstCard = cards[0];
            if (firstCard) {
                cardWidthWithGap = firstCard.offsetWidth + gap;
            }

            const visibleCards = Math.floor(container.offsetWidth / cardWidthWithGap);
            maxIndex = Math.max(0, cards.length - visibleCards);

            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }

            const translateX = -currentIndex * cardWidthWithGap;
            carousel.style.transform = `translateX(${translateX}px)`;
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarouselState();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(maxIndex, currentIndex + 1);
            updateCarouselState();
        });

        setInterval(() => {
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            updateCarouselState();
        }, 5000);

        window.addEventListener('resize', updateCarouselState);
        updateCarouselState(); // Initial call
    }

    initializeOffersCarousel();

    // --- REAL-TIME ACTIVITY FEED ---
    function initializeActivityFeed() {
        const activities = [
            { icon: 'fas fa-plane-departure', text: 'Sarah from New York just booked a flight to Paris', time: '2 minutes ago' },
            { icon: 'fas fa-ticket-alt', text: 'Michael saved $247 on his London trip', time: '5 minutes ago' },
            { icon: 'fas fa-star', text: 'Emma rated her Dubai experience 5 stars', time: '8 minutes ago' },
            { icon: 'fas fa-map-marker-alt', text: 'John discovered a new route to Tokyo', time: '12 minutes ago' },
            { icon: 'fas fa-heart', text: 'Lisa added Rome to her wishlist', time: '15 minutes ago' },
            { icon: 'fas fa-plane', text: 'David booked a business class seat to Singapore', time: '18 minutes ago' }
        ];
        
        let currentActivityIndex = 0;
        
        function updateActivity() {
            const activityItems = document.querySelectorAll('.activity-item');
            if (activityItems.length === 0) return;
            
            activityItems.forEach((item, index) => {
                const activity = activities[(currentActivityIndex + index) % activities.length];
                const icon = item.querySelector('i');
                const text = item.querySelector('span');
                const time = item.querySelector('small');
                
                if (icon && text && time) {
                    icon.className = activity.icon;
                    text.textContent = activity.text;
                    time.textContent = activity.time;
                }
            });
            
            currentActivityIndex = (currentActivityIndex + 1) % activities.length;
        }
        
        // Update activity feed every 8 seconds
        setInterval(updateActivity, 8000);
        
        // Animate customer counter
        const customerCounter = document.getElementById('customer-counter');
        if (customerCounter) {
            let count = 2847392;
            setInterval(() => {
                count += Math.floor(Math.random() * 3) + 1;
                customerCounter.textContent = count.toLocaleString();
            }, 15000);
        }
    }
    
    initializeActivityFeed();

    // Initialize AOS for other sections with enhanced settings
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-out-quad',
        delay: 0
    });

    // --- ENHANCED SCROLL ANIMATIONS ---
    function addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all major sections
        const elementsToAnimate = document.querySelectorAll(
            '.home-section-title, .home-destination-card, .home-feature-item, .home-offer-card, .btn'
        );
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
    }

    addScrollAnimations();

    // --- ENHANCED MICROINTERACTIONS WITH 3D EFFECTS ---
    function addMicrointeractions() {
        // Button hover effects with crystal shimmer
        const buttons = document.querySelectorAll('.btn:not(.header-btn-signin), .explore-btn, .stub-search-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px) scale(1.02)';
                btn.style.boxShadow = '0 8px 25px rgba(29, 94, 51, 0.3), 0 0 20px rgba(59, 130, 246, 0.2)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            });
        });

        // Enhanced 3D card hover effects with mouse tracking
        const cards = document.querySelectorAll('.home-offer-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                card.style.boxShadow = `
                    0 20px 40px rgba(0, 0, 0, 0.2),
                    0 0 30px rgba(59, 130, 246, 0.3),
                    0 0 50px rgba(147, 51, 234, 0.2)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });

        // Crystal icon hover effects
        const featureIcons = document.querySelectorAll('.feature-icon');
        featureIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                icon.style.animationPlayState = 'paused';
                icon.style.transform = 'scale(1.2) rotateY(15deg)';
            });

            icon.addEventListener('mouseleave', () => {
                icon.style.animationPlayState = 'running';
                icon.style.transform = '';
            });
        });

        // Crystal Sign In Button Glow
        const signInBtn = document.querySelector('.header-btn-signin');
        if (signInBtn) {
            signInBtn.addEventListener('mousemove', (e) => {
                const rect = signInBtn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                signInBtn.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
                signInBtn.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
            });
        }
    }

    addMicrointeractions();
    
    // --- NEW TICKET SEARCH FORM LOGIC ---
    function initializeTicketSearchForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;

        const optionsToggle = document.getElementById('flight-options-toggle');
        const optionsPopover = document.getElementById('flight-options-popover');
        const closePopoverBtn = document.getElementById('close-popover-btn');

        // --- Date Picker Logic ---
        const departureInput = form.querySelector('#departure');
        const returnInput = form.querySelector('#return');

        if (departureInput && returnInput) {
            const today = new Date().toISOString().split('T')[0];
            departureInput.setAttribute('min', today);
            returnInput.setAttribute('min', today);

            departureInput.addEventListener('change', function() {
                const departureDate = this.value;
                if (departureDate) {
                    returnInput.setAttribute('min', departureDate);
                    if (returnInput.value && returnInput.value < departureDate) {
                        returnInput.value = '';
                    }
                }
            });
        }

        // --- Popover Logic ---
        if (optionsToggle && optionsPopover) {
            optionsToggle.addEventListener('click', () => {
                optionsPopover.classList.toggle('active');
            });

            if (closePopoverBtn) {
                closePopoverBtn.addEventListener('click', () => {
                    optionsPopover.classList.remove('active');
                });
            }

            document.addEventListener('click', (e) => {
                if (!optionsToggle.contains(e.target) && !optionsPopover.contains(e.target)) {
                    optionsPopover.classList.remove('active');
                }
            });
        }

        // --- Options Logic within Popover ---
        let tripType = 'round-trip';
        let adults = 1;
        let children = 0;
        let flightClass = 'Economy';

        function updateSummary() {
            const tripText = tripType === 'round-trip' ? 'Round-trip' : 'One-way';
            const totalPassengers = adults + children;
            const passengerText = `${totalPassengers} Traveler${totalPassengers > 1 ? 's' : ''}`;
            optionsToggle.textContent = `${tripText}, ${passengerText}, ${flightClass}`;
        }

        // Trip Type
        optionsPopover.querySelectorAll('.option-btn[data-value]').forEach(btn => {
            btn.addEventListener('click', () => {
                optionsPopover.querySelectorAll('.option-btn[data-value]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                tripType = btn.dataset.value;
                updateSummary();
            });
        });

        // Passenger Counters
        optionsPopover.querySelectorAll('.counter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const action = btn.dataset.action;
                const valueEl = optionsPopover.querySelector(`.counter-value[data-type="${type}"]`);

                if (action === 'increase') {
                    if (type === 'adult' && adults < 9) adults++;
                    if (type === 'child' && children < 9) children++;
                } else {
                    if (type === 'adult' && adults > 1) adults--;
                    if (type === 'child' && children > 0) children--;
                }

                valueEl.textContent = type === 'adult' ? adults : children;
                updateSummary();
            });
        });

        // Flight Class
        optionsPopover.querySelectorAll('.option-btn-class').forEach(btn => {
            btn.addEventListener('click', () => {
                optionsPopover.querySelectorAll('.option-btn-class').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                flightClass = btn.dataset.value;
                updateSummary();
            });
        });

        // --- Form Submission ---
        const searchBtn = document.getElementById('search-flights-btn');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Search submitted with:', { tripType, adults, children, flightClass, from: form.from.value, to: form.to.value, departure: form.departure.value, return: form.return.value });
            
            // Set flag in localStorage to indicate a booking has been made
            localStorage.setItem('hasBookedTicket', 'true');
            handleManageMenuVisibility(); // This function is already global
        });
    }
    initializeTicketSearchForm();

    function addSwipeSupport() {
        // Add swipe support to offers carousel
        const offersCarousel = document.querySelector('.home-offers-carousel');
        if (offersCarousel) {
            let startX = 0;
            let currentX = 0;
            let isDragging = false;
            
            offersCarousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });
            
            offersCarousel.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
                const diffX = startX - currentX;
                
                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        // Swipe left - next
                        document.querySelector('.carousel-next')?.click();
                    } else {
                        // Swipe right - previous
                        document.querySelector('.carousel-prev')?.click();
                    }
                    isDragging = false;
                }
            });
            
            offersCarousel.addEventListener('touchend', () => {
                isDragging = false;
            });
        }
        
        // Add swipe support to testimonials
        const testimonialsSlider = document.querySelector('.home-testimonial-slider');
        if (testimonialsSlider) {
            let startX = 0;
            let isDragging = false;
            
            testimonialsSlider.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });
            
            testimonialsSlider.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const currentX = e.touches[0].clientX;
                const diffX = startX - currentX;
                
                if (Math.abs(diffX) > 50) {
                    const indicators = document.querySelectorAll('.testimonial-indicators .indicator');
                    const activeIndex = Array.from(indicators).findIndex(ind => ind.classList.contains('active'));
                    
                    if (diffX > 0 && activeIndex < indicators.length - 1) {
                        // Swipe left - next
                        indicators[activeIndex + 1].click();
                    } else if (diffX < 0 && activeIndex > 0) {
                        // Swipe right - previous
                        indicators[activeIndex - 1].click();
                    }
                    isDragging = false;
                }
            });
            
            testimonialsSlider.addEventListener('touchend', () => {
                isDragging = false;
            });
        }
    }
    
    addSwipeSupport();

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
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        footer.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(footer);
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

    // --- BENTO GRID RESPONSIVE HANDLING ---
    function handleBentoGridResponsive() {
        const bentoGrid = document.querySelector('.home-destinations-bento-grid');
        if (!bentoGrid) return;

        function adjustBentoGrid() {
            const largeCard = bentoGrid.querySelector('.bento-large');
            if (!largeCard) return;

            if (window.innerWidth <= 768) {
                bentoGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                bentoGrid.style.gridTemplateRows = 'repeat(2, 250px)'; // Corrected from 3 rows
                largeCard.style.gridColumn = 'span 2';
                largeCard.style.gridRow = 'span 1';
            } else {
                // Reset to default CSS behavior on larger screens
                bentoGrid.style.gridTemplateColumns = '';
                bentoGrid.style.gridTemplateRows = '';
                largeCard.style.gridColumn = '';
                largeCard.style.gridRow = '';
            }
        }

        window.addEventListener('resize', adjustBentoGrid);
        adjustBentoGrid();
    }

    handleBentoGridResponsive();
});