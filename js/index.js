document.addEventListener('DOMContentLoaded', function () {
    // --- MANAGE MENU VISIBILITY ---
    function handleManageMenuVisibility() {
        // Conditions to show the "Manage" menu:
        const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
        const hasBooked = localStorage.getItem('hasBookedTicket') === 'true';

        const manageMenuDesktop = document.getElementById('manage-menu-desktop');
        const manageMenuMobile = document.getElementById('manage-menu-mobile');

        if (isSignedIn && hasBooked) {
            if (manageMenuDesktop) manageMenuDesktop.classList.remove('manage-menu-hidden');
            if (manageMenuMobile) manageMenuMobile.classList.remove('manage-menu-hidden');
        } else {
            if (manageMenuDesktop) manageMenuDesktop.classList.add('manage-menu-hidden');
            if (manageMenuMobile) manageMenuMobile.classList.add('manage-menu-hidden');
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

        const tabButtons = Array.from(tabContainer.querySelectorAll('.tab-button'));
        const tabPanels = Array.from(tabContainer.querySelectorAll('.tab-panel'));
        let currentIndex = 0;
        let autoPlayInterval;

        if (tabButtons.length === 0) return;

        function showTab(index) {
            currentIndex = index;
            const tabId = tabButtons[currentIndex].dataset.tab;

            tabButtons.forEach((btn, i) => btn.classList.toggle('active', i === currentIndex));
            tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === `tab-${tabId}`));
        }

        function nextTab() {
            const nextIndex = (currentIndex + 1) % tabButtons.length;
            showTab(nextIndex);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextTab, 5000); // Change tab every 5 seconds
        }

        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                showTab(index);
                resetAutoPlay(); // Reset and restart auto-play on manual interaction
            });
        });

        // Pause on hover
        tabContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        tabContainer.addEventListener('mouseleave', resetAutoPlay);

        // Initial setup
        const initialActiveIndex = tabButtons.findIndex(btn => btn.classList.contains('active'));
        if (initialActiveIndex !== -1) {
            currentIndex = initialActiveIndex;
        }
        
        showTab(currentIndex);
        resetAutoPlay();
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

        function updateCarouselDimensions() {
            const gap = window.innerWidth <= 768 ? 20 : 30;
            carousel.style.gap = `${gap}px`;

            const firstCard = cards[0];
            if (firstCard) { // Ensure cards are loaded
                cardWidthWithGap = firstCard.offsetWidth + gap;
            }

            const visibleCards = Math.floor(container.offsetWidth / cardWidthWithGap);
            maxIndex = Math.max(0, cards.length - visibleCards);

            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            moveCarousel();
        }

        function moveCarousel() {
            // Avoid running if width is not calculated yet
            if (cardWidthWithGap > 0) {
                const translateX = -currentIndex * cardWidthWithGap;
                carousel.style.transform = `translateX(${translateX}px)`;
            }
        }

        prevBtn.addEventListener('click', () => {
            if (maxIndex === 0) return;
            currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
            moveCarousel();
        });

        nextBtn.addEventListener('click', () => {
            if (maxIndex === 0) return;
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            moveCarousel();
        });

        setInterval(() => {
            // To prevent moving if maxIndex is 0 (all cards are visible)
            if (maxIndex === 0) return;
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            moveCarousel();
        }, 5000);

        window.addEventListener('resize', updateCarouselDimensions);
        updateCarouselDimensions(); // Initial call
    }
    initializeOffersCarousel();

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

    // --- DESTINATIONS GRID INTERACTIVITY ---
    function initializeDestinationsGrid() {
        const destinationsGrid = document.getElementById('destinations-grid');
        if (!destinationsGrid) return;

        const toInput = document.getElementById('to');
        const searchSection = document.getElementById('search-section-anchor');

        destinationsGrid.addEventListener('click', function(e) {
            const card = e.target.closest('.home-destination-card');
            if (!card) return;

            // Handle Wishlist Button Click
            if (e.target.closest('.wishlist-btn')) {
                e.stopPropagation(); // Prevent other card actions
                const wishlistBtn = e.target.closest('.wishlist-btn');
                wishlistBtn.classList.toggle('active');
                
                // You can add logic here to save to localStorage
                const isWishlisted = wishlistBtn.classList.contains('active');
                console.log(`Destination ${card.dataset.destinationName} wishlisted: ${isWishlisted}`);
                return;
            }

            // Handle "Explore" Button or Card Click
            if (toInput && (e.target.closest('.explore-btn') || e.target.closest('.destination-info'))) {
                const destinationName = card.dataset.destinationName;
                
                toInput.value = destinationName;
                // Optional: Update airport code display if you have one
                // document.getElementById('to-airport').textContent = `${card.dataset.destinationCode}, ...`;
                
                searchSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    initializeDestinationsGrid();

    // --- FLIGHT SEARCH FORM LOGIC ---
    function initializeTicketSearchForm() {
        const form = document.getElementById('booking-form');
        if (!form) return;
    
        const optionsToggle = document.getElementById('flight-options-toggle');
        const optionsPopover = document.getElementById('flight-options-popover');
        const closePopoverBtn = document.getElementById('close-popover-btn');
        const fromInput = form.querySelector('#from');
        const toInput = form.querySelector('#to');
        const swapBtn = form.querySelector('.swap-btn');
        const tripTypeRadios = form.querySelectorAll('input[name="trip-type"]');
        const departureInput = form.querySelector('#departure');
        const returnInput = form.querySelector('#return');
        const returnDateWrapper = document.getElementById('return-date-wrapper');
        const flexibleDatesCheckbox = form.querySelector('#flexible-dates');
        const flexibleDepartureOptions = document.getElementById('flexible-dates-options');
        const flexibleReturnOptions = document.getElementById('flexible-return-options');
        const departureStart = form.querySelector('#departure-start');
        const departureEnd = form.querySelector('#departure-end');
        const returnStart = form.querySelector('#return-start');
        const returnEnd = form.querySelector('#return-end');
        const recentSearchesBtn = form.querySelector('.recent-searches-btn');
        const recentSearchesDropdown = document.getElementById('recent-searches-dropdown');
        const recentSearchesList = document.getElementById('recent-searches-list'); // Ensure this element exists
    
        // --- User Location Detection ---
        function autoFillOrigin() {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    const { latitude, longitude } = position.coords;
                    console.log('User location:', latitude, longitude);
                    // Static list of major airports with coords for demo (in real app, use API)
                    const airports = [
                        { name: 'Delhi', code: 'DEL', lat: 28.5562, lon: 77.1000 },
                        { name: 'Mumbai', code: 'BOM', lat: 19.0760, lon: 72.8777 },
                        { name: 'Bangalore', code: 'BLR', lat: 13.0827, lon: 80.2707 },
                        { name: 'Chennai', code: 'MAA', lat: 13.0827, lon: 80.2707 },
                        { name: 'Kolkata', code: 'CCU', lat: 22.5726, lon: 88.3639 },
                        { name: 'Hyderabad', code: 'HYD', lat: 17.3850, lon: 78.4867 },
                        { name: 'Pune', code: 'PNQ', lat: 18.5204, lon: 73.8567 },
                        { name: 'Ahmedabad', code: 'AMD', lat: 23.0225, lon: 72.5714 },
                        { name: 'Jaipur', code: 'JAI', lat: 26.9124, lon: 75.7873 },
                        { name: 'Lucknow', code: 'LKO', lat: 26.7606, lon: 80.8893 }
                    ];
                    // Find nearest airport
                    let nearest = airports[0];
                    let minDist = Infinity;
                    airports.forEach(airport => {
                        const dist = Math.sqrt((latitude - airport.lat)**2 + (longitude - airport.lon)**2);
                        if (dist < minDist) {
                            minDist = dist;
                            nearest = airport;
                        }
                    });
                    fromInput.value = nearest.name;
                    document.getElementById('from-airport').textContent = `${nearest.code}, ${nearest.name} Airport`;
                }, error => {
                    console.warn("Could not get user location:", error.message);
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        }
        autoFillOrigin(); // Call this to activate

        // --- Search History Functions ---
        function saveSearch(searchData) {
            const searches = JSON.parse(localStorage.getItem('flightSearches') || '[]');
            searches.unshift(searchData); // Add to beginning
            if (searches.length > 10) searches.pop(); // Keep only 10
            localStorage.setItem('flightSearches', JSON.stringify(searches.filter((v,i,a)=>a.findIndex(t=>(t.from === v.from && t.to===v.to))===i))); // Keep unique
            loadRecentSearches();
        }

        function loadRecentSearches() {
            const searches = JSON.parse(localStorage.getItem('flightSearches') || '[]');
            recentSearchesList.innerHTML = '';
            if (searches.length === 0) {
                recentSearchesList.innerHTML = '<div class="no-searches">No recent searches found.</div>';
                return;
            }
            searches.forEach(search => {
                const item = document.createElement('div');
                item.className = 'recent-search-item';
                item.innerHTML = `
                    <div class="search-route">${search.from} → ${search.to}</div>
                    <div class="search-details">${search.departure}${search.return ? ' - ' + search.return : ''} • ${search.adults + search.children + search.infants} Traveller(s)</div>
                `;
                item.addEventListener('click', () => {
                    // Populate form with this search
                    fromInput.value = search.from;
                    toInput.value = search.to;
                    departureInput.value = search.departure;
                    if (search.return) returnInput.value = search.return;
                    // Set trip type
                    const tripRadio = form.querySelector(`input[name="trip-type"][value="${search.tripType}"]`);
                    if (tripRadio) tripRadio.checked = true;
                    // Set passengers and class
                    adults = search.adults;
                    children = search.children;
                    infants = search.infants;
                    flightClass = search.flightClass;
                    updateUI();
                    // Close dropdown
                    recentSearchesDropdown.classList.remove('visible');
                });
                recentSearchesList.appendChild(item);
            });
        }
    

        // Toggle dropdown
        if (recentSearchesBtn && recentSearchesDropdown) {
            recentSearchesBtn.addEventListener('click', () => {
                recentSearchesDropdown.classList.toggle('visible');
                loadRecentSearches(); // Refresh list
            });

            document.addEventListener('click', (e) => {
                if (!recentSearchesBtn.contains(e.target) && !recentSearchesDropdown.contains(e.target)) {
                    recentSearchesDropdown.classList.remove('visible');
                }
            });
        }

        // State
        let adults = 1;
        let children = 0;
        let infants = 0;
        let flightClass = 'Economy';
    
        // --- Swap Button ---
        if (swapBtn) {
            swapBtn.addEventListener('click', () => {
                if (fromInput && toInput) {
                    [fromInput.value, toInput.value] = [toInput.value, fromInput.value];
                }
            });
        }
    
        // --- Date Pickers ---
        if (departureInput && returnInput && returnDateWrapper) {
            const today = new Date().toISOString().split('T')[0];
            departureInput.setAttribute('min', today);
            returnInput.setAttribute('min', today);
    
            departureInput.addEventListener('change', () => {
                if (departureInput.value) {
                    returnInput.setAttribute('min', departureInput.value);
                    if (returnInput.value && returnInput.value < departureInput.value) {
                        returnInput.value = ''; // Clear if invalid
                    }
                }
            });

            // --- Flexible Dates Toggle ---
            if (flexibleDatesCheckbox && flexibleDepartureOptions && flexibleReturnOptions) {
                flexibleDatesCheckbox.addEventListener('change', () => {
                    const isChecked = flexibleDatesCheckbox.checked;
                    flexibleDepartureOptions.style.display = isChecked ? 'flex' : 'none';
                    flexibleReturnOptions.style.display = isChecked ? 'flex' : 'none';

                    if (isChecked) {
                        // Set default ±3 days ranges based on selected dates
                        if (departureInput.value) {
                            const depDate = new Date(departureInput.value);
                            const start = new Date(depDate);
                            start.setDate(depDate.getDate() - 3);
                            const end = new Date(depDate);
                            end.setDate(depDate.getDate() + 3);
                            departureStart.value = start.toISOString().split('T')[0];
                            departureEnd.value = end.toISOString().split('T')[0];
                        }
                        if (returnInput.value) {
                            const retDate = new Date(returnInput.value);
                            const start = new Date(retDate);
                            start.setDate(retDate.getDate() - 3);
                            const end = new Date(retDate);
                            end.setDate(retDate.getDate() + 3);
                            returnStart.value = start.toISOString().split('T')[0];
                            returnEnd.value = end.toISOString().split('T')[0];
                        }
                    } else {
                        // Clear flexible ranges
                        departureStart.value = '';
                        departureEnd.value = '';
                        returnStart.value = '';
                        returnEnd.value = '';
                    }
                });
            }
        }
    
        // --- Enhanced Travellers & Class Popover ---
        if (optionsToggle && optionsPopover) {
            console.log('Traveller selector elements found:', { optionsToggle, optionsPopover });
            
            optionsToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Traveller selector clicked');
                
                // Close any other open dropdowns first
                document.querySelectorAll('.recent-searches-dropdown.visible').forEach(dropdown => {
                    dropdown.classList.remove('visible');
                });
                
                // Toggle the popover
                const isVisible = optionsPopover.classList.contains('visible');
                optionsPopover.classList.toggle('visible');
                
                console.log('Popover visibility toggled:', !isVisible);
                
                // Add visual feedback to the button
                if (!isVisible) {
                    optionsToggle.style.backgroundColor = 'rgba(29, 94, 51, 0.1)';
                    optionsToggle.style.borderColor = 'var(--primary-emerald)';
                } else {
                    optionsToggle.style.backgroundColor = '';
                    optionsToggle.style.borderColor = '';
                }
            });
    
            if (closePopoverBtn) {
                closePopoverBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    optionsPopover.classList.remove('visible');
                    optionsToggle.style.backgroundColor = '';
                    optionsToggle.style.borderColor = '';
                });
            }
    
            document.addEventListener('click', (e) => {
                if (!optionsToggle.contains(e.target) && !optionsPopover.contains(e.target)) {
                    optionsPopover.classList.remove('visible');
                    optionsToggle.style.backgroundColor = '';
                    optionsToggle.style.borderColor = '';
                }
            });
        } else {
            console.error('Traveller selector elements not found:', { optionsToggle, optionsPopover });
        }
    
        // --- Enhanced Update UI Function ---
        function updateUI() {
            if (!optionsToggle || !returnDateWrapper) return;
    
            // Update passenger summary text with better formatting
            let totalPassengers = adults + children + infants;
            let passengerParts = [];
            
            if (adults > 0) passengerParts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
            if (children > 0) passengerParts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
            if (infants > 0) passengerParts.push(`${infants} Infant${infants > 1 ? 's' : ''}`);
            
            let passengerText = passengerParts.join(', ');
            optionsToggle.textContent = `${passengerText}, ${flightClass}`;
    
            // Update passenger counts in popover with animation
            const adultCounter = optionsPopover.querySelector('.counter-value[data-type="adult"]');
            const childCounter = optionsPopover.querySelector('.counter-value[data-type="child"]');
            const infantCounter = optionsPopover.querySelector('.counter-value[data-type="infant"]');
            
            if (adultCounter && adultCounter.textContent !== adults.toString()) {
                adultCounter.style.transform = 'scale(1.2)';
                adultCounter.textContent = adults;
                setTimeout(() => adultCounter.style.transform = '', 200);
            }
            if (childCounter && childCounter.textContent !== children.toString()) {
                childCounter.style.transform = 'scale(1.2)';
                childCounter.textContent = children;
                setTimeout(() => childCounter.style.transform = '', 200);
            }
            if (infantCounter && infantCounter.textContent !== infants.toString()) {
                infantCounter.style.transform = 'scale(1.2)';
                infantCounter.textContent = infants;
                setTimeout(() => infantCounter.style.transform = '', 200);
            }
    
            // Handle return date based on trip type
            const selectedTripType = form.querySelector('input[name="trip-type"]:checked').value;
            if (selectedTripType === 'one-way' || selectedTripType === 'multi-city') {
                returnDateWrapper.classList.add('disabled');
                returnInput.disabled = true;
                returnInput.value = '';
            } else { // round-trip
                returnDateWrapper.classList.remove('disabled');
                returnInput.disabled = false;
            }

            // Update counter button states
            if (typeof updateCounterButtonStates === 'function') {
                updateCounterButtonStates();
            }
        }
    
        // --- Event Listeners ---
    
        // Trip Type Change
        tripTypeRadios.forEach(radio => radio.addEventListener('change', updateUI));
    
        // Passenger Counters - Enhanced with better validation and feedback
        optionsPopover.querySelectorAll('.counter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent popover from closing
                const { type, action } = btn.dataset;
                let changed = false;

                if (action === 'increase') {
                    if (type === 'adult' && adults < 9) { // Max 9 adults
                        adults++;
                        changed = true;
                    }
                    if (type === 'child' && children < 9) { // Max 9 children
                        children++;
                        changed = true;
                    }
                    // Business rule: Infants on lap cannot exceed adults
                    if (type === 'infant' && infants < adults && infants < 9) {
                        infants++;
                        changed = true;
                    }
                } else { // decrease
                    if (type === 'adult' && adults > 1) {
                        adults--;
                        // If removing an adult makes infants > adults, reduce infants
                        if (infants > adults) {
                            infants = adults;
                        }
                        changed = true;
                    }
                    if (type === 'child' && children > 0) {
                        children--;
                        changed = true;
                    }
                    if (type === 'infant' && infants > 0) {
                        infants--;
                        changed = true;
                    }
                }

                // Add visual feedback for button press
                if (changed) {
                    btn.style.transform = 'scale(0.95)';
                    btn.style.backgroundColor = 'var(--primary-emerald)';
                    btn.style.color = 'white';
                    setTimeout(() => {
                        btn.style.transform = '';
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    }, 150);
                    updateUI();
                } else {
                    // Shake animation for invalid actions
                    btn.style.animation = 'shake 0.3s ease-in-out';
                    setTimeout(() => {
                        btn.style.animation = '';
                    }, 300);
                }

                // Update button states
                updateCounterButtonStates();
            });
        });

        // Function to update counter button states
        function updateCounterButtonStates() {
            // Disable/enable buttons based on limits
            const adultDecrease = optionsPopover.querySelector('.counter-btn[data-type="adult"][data-action="decrease"]');
            const adultIncrease = optionsPopover.querySelector('.counter-btn[data-type="adult"][data-action="increase"]');
            const childDecrease = optionsPopover.querySelector('.counter-btn[data-type="child"][data-action="decrease"]');
            const childIncrease = optionsPopover.querySelector('.counter-btn[data-type="child"][data-action="increase"]');
            const infantDecrease = optionsPopover.querySelector('.counter-btn[data-type="infant"][data-action="decrease"]');
            const infantIncrease = optionsPopover.querySelector('.counter-btn[data-type="infant"][data-action="increase"]');

            // Adult constraints
            if (adultDecrease) adultDecrease.disabled = adults <= 1;
            if (adultIncrease) adultIncrease.disabled = adults >= 9;

            // Child constraints
            if (childDecrease) childDecrease.disabled = children <= 0;
            if (childIncrease) childIncrease.disabled = children >= 9;

            // Infant constraints
            if (infantDecrease) infantDecrease.disabled = infants <= 0;
            if (infantIncrease) infantIncrease.disabled = infants >= adults || infants >= 9;
        }
    
        // Class Selection
        optionsPopover.querySelectorAll('.option-btn-class').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                optionsPopover.querySelectorAll('.option-btn-class').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                flightClass = btn.dataset.value;
                updateUI();
            });
        });
    
        // Form Submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const errorMessageDiv = document.getElementById('form-error-message');
            const tripType = form.querySelector('input[name="trip-type"]:checked').value;
            const fareType = form.querySelector('input[name="fare-type"]:checked').value;
            
            // Simple validation
            if (fromInput.value.trim() === '' || toInput.value.trim() === '') {
                errorMessageDiv.textContent = 'Please enter both "From" and "To" destinations.';
                errorMessageDiv.style.display = 'block';
                errorMessageDiv.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            if (fromInput.value.trim().toLowerCase() === toInput.value.trim().toLowerCase()) {
                errorMessageDiv.textContent = '"From" and "To" destinations cannot be the same.';
                errorMessageDiv.style.display = 'block';
                errorMessageDiv.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
    
            errorMessageDiv.style.display = 'none'; // Hide error on successful validation

            console.log('Search Submitted:', {
                tripType,
                from: fromInput.value,
                to: toInput.value,
                departure: departureInput.value,
                return: tripType === 'round-trip' ? returnInput.value : null,
                flexibleDeparture: flexibleDatesCheckbox.checked ? { start: departureStart.value, end: departureEnd.value } : null,
                flexibleReturn: flexibleDatesCheckbox.checked ? { start: returnStart.value, end: returnEnd.value } : null,
                currency: form.querySelector('#currency').value,
                adults,
                children,
                infants,
                flightClass,
                fareType,
                directFlights: form.querySelector('#direct-flights').checked,
                nearbyAirports: form.querySelector('#nearby-airports').checked,
                flexibleDates: form.querySelector('#flexible-dates').checked
            });
    
            // Save search to history
            const searchData = {
                tripType,
                from: fromInput.value,
                to: toInput.value,
                departure: departureInput.value,
                return: tripType === 'round-trip' ? returnInput.value : null,
                adults,
                children,
                infants,
                flightClass,
                fareType,
                currency: form.querySelector('#currency').value,
                directFlights: form.querySelector('#direct-flights').checked,
                nearbyAirports: form.querySelector('#nearby-airports').checked,
                flexibleDates: form.querySelector('#flexible-dates').checked
            };
            saveSearch(searchData);

            // Save search data for results page
            localStorage.setItem('lastSearch', JSON.stringify(searchData));

            // For demo: redirect to results page
            window.location.href = 'results.html?' + new URLSearchParams({
                from: fromInput.value,
                to: toInput.value,
                departure: departureInput.value,
                return: tripType === 'round-trip' ? returnInput.value : null,
                adults: adults,
                children: children,
                infants: infants,
                class: flightClass,
                currency: form.querySelector('#currency').value
            }).toString();
        });
    
        // Initial UI setup on page load
        if (form) updateUI();
    }
    initializeTicketSearchForm();

    // --- SWIPE SUPPORT FOR MOBILE ---
    function addSwipeSupport() {
        // Add swipe support to offers carousel
        const offersCarousel = document.querySelector('.home-offers-carousel');
        if (offersCarousel) {
            let startX = 0;
            let isDragging = false;

            offersCarousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
            });

            offersCarousel.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                const currentX = e.touches[0].clientX;
                const diffX = startX - currentX;

                if (Math.abs(diffX) > 50) { // Threshold to detect a swipe
                    if (diffX > 0) {
                        document.querySelector('.carousel-next')?.click();
                    } else {
                        document.querySelector('.carousel-prev')?.click();
                    }
                    isDragging = false; // End swipe after one action
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
                        indicators[activeIndex + 1].click();
                    } else if (diffX < 0 && activeIndex > 0) {
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

    // --- TESTIMONIALS SLIDER FUNCTIONALITY ---
    function initializeTestimonialsSlider() {
        const slider = document.querySelector('.home-testimonial-slider');
        const cards = document.querySelectorAll('.home-testimonial-card');
        const indicators = document.querySelectorAll('.testimonial-indicators .indicator');
        
        if (!slider || cards.length === 0 || indicators.length === 0) return;
        
        let currentSlide = 0;
        let autoSlideInterval;
        
        function showSlide(index) {
            // Hide all cards
            cards.forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }
        
        function nextSlide() {
            const next = (currentSlide + 1) % cards.length;
            showSlide(next);
        }
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Add click handlers to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                stopAutoSlide();
                startAutoSlide(); // Restart auto-slide
            });
        });
        
        // Pause auto-slide on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
        
        // Initialize
        showSlide(0);
        startAutoSlide();
    }
    
    initializeTestimonialsSlider();

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