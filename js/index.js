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
            link.querySelector('.fa-chevron-down')?.classList.toggle('fa-rotate-180');
            parent.classList.toggle('header-open');
        });
    });

    // --- LANGUAGE SWITCHER ---
    const langSwitcherBtn = document.querySelector('.language-switcher-btn');
    const langMenu = document.querySelector('.language-switcher-menu');
    if (langSwitcherBtn && langMenu) {
        langSwitcherBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', () => {
            langMenu.style.display = 'none';
        });
        langMenu.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent menu from closing when clicking inside
        });
        // Add translation logic here in a real app
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

    function initializeActivityFeed() {
        // Animate real-time stats counter
        const flightsBookedStat = document.getElementById('flights-booked-stat');
        if (flightsBookedStat) {
            let startCount = 2800;
            const endCount = 2847; // The number displayed in HTML
            const duration = 2000;
            let startTime = null;

            function animateCounter(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const current = Math.min(startCount + Math.floor(progress / duration * (endCount - startCount)), endCount);
                flightsBookedStat.textContent = current.toLocaleString();
                if (progress < duration) {
                    requestAnimationFrame(animateCounter);
                } else {
                    // After initial animation, increment slowly
                    setInterval(() => {
                        endCount += Math.floor(Math.random() * 3) + 1;
                        flightsBookedStat.textContent = endCount.toLocaleString();
                    }, 5000);
                }
            }
            requestAnimationFrame(animateCounter);
        }

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

    // --- NEW: Animated Counter for Statistics ---
    function initializeStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    animateCounter(entry.target, 0, target, 2000);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => observer.observe(stat));
    }

    function animateCounter(element, start, end, duration) {
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }

    // --- NEW: FAQ Accordion ---
    function initializeFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                const isActive = item.classList.contains('active');
                
                // Close all items
                document.querySelectorAll('.faq-item').forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Initialize new features
    initializeStatsCounter();
    initializeFAQ();

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
            '.home-section-title, .home-destination-card, .home-feature-item, .btn'
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

        destinationsGrid.addEventListener('click', function (e) {
            const card = e.target.closest('.home-destination-card');
            if (!card) return;

            // Handle Price Alert Button
            if (e.target.closest('.alert-btn')) {
                e.stopPropagation();
                const alertBtn = e.target.closest('.alert-btn');
                alertBtn.innerHTML = '<i class="fas fa-check"></i>';
                alertBtn.style.backgroundColor = 'var(--primary-emerald)';
                alert(`Price alert set for ${card.dataset.destinationName}! (Demo)`);
                return;
            }

            // Handle "Explore" Button Click
            if (e.target.closest('.explore-btn')) {
                e.stopPropagation();
                // Expand the card to show insider tip
                card.classList.toggle('expanded');
                // If you want to scroll to the search form instead/also:
                /*
                const destinationName = card.dataset.destinationName;
                toInput.value = destinationName;
                searchSection.scrollIntoView({ behavior: 'smooth' });
                */
            } else {
                // If clicking anywhere else on the card, you might want to navigate
                // For this demo, we'll just log it.
                console.log(`Navigating to details for ${card.dataset.destinationName}`);
                saveRecentlyViewed(card);
                // window.location.href = `destinations.html#${card.dataset.destinationName}`;
            }
        });

        function saveRecentlyViewed(card) {
            const destination = {
                name: card.dataset.destinationName,
                img: card.querySelector('.home-destination-img').src
            };

            let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewedFlights')) || [];
            // Remove if already exists to move it to the front
            recentlyViewed = recentlyViewed.filter(item => item.name !== destination.name);
            // Add to the front
            recentlyViewed.unshift(destination);
            // Keep only the last 5
            if (recentlyViewed.length > 5) {
                recentlyViewed.pop();
            }
            localStorage.setItem('recentlyViewedFlights', JSON.stringify(recentlyViewed));
        }
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

    // --- SWIPE SUPPORT FOR MOBILE (Testimonials) ---
    function addSwipeSupport() {
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
        const indicatorsContainer = document.querySelector('.testimonial-indicators');
        const filterButtons = document.querySelectorAll('.testimonial-filters .filter-btn');

        if (!slider || cards.length === 0 || !indicatorsContainer) return;

        let currentSlide = 0;
        let autoSlideInterval;
        let visibleCards = Array.from(cards);

        function generateIndicators() {
            indicatorsContainer.innerHTML = '';
            visibleCards.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('indicator');
                if (index === 0) button.classList.add('active');
                button.dataset.slide = index;
                indicatorsContainer.appendChild(button);
            });
            // Add click handlers to new indicators
            indicatorsContainer.querySelectorAll('.indicator').forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    showSlide(index);
                    stopAutoSlide();
                    startAutoSlide();
                });
            });
        }

        function showSlide(index) {
            if (index >= visibleCards.length) index = 0;
            if (index < 0) index = visibleCards.length - 1;

            visibleCards.forEach((card, i) => card.style.display = i === index ? 'flex' : 'none');
            indicatorsContainer.querySelectorAll('.indicator').forEach((ind, i) => ind.classList.toggle('active', i === index));
            currentSlide = index;
        }

        function nextSlide() {
            const next = (currentSlide + 1) % visibleCards.length;
            showSlide(next);
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;

                if (filter === 'all') {
                    visibleCards = Array.from(cards);
                } else {
                    visibleCards = Array.from(cards).filter(card => card.dataset.category === filter);
                }

                generateIndicators();
                showSlide(0);
                stopAutoSlide();
                startAutoSlide();
            });
        });

        slider.addEventListener('click', (e) => {
            if (e.target.closest('.vote-btn')) {
                const parent = e.target.closest('.helpful-vote');
                parent.innerHTML = '<p style="color: var(--primary-emerald); font-weight: 600;">Thank you for your feedback!</p>';
            }
        });

        // Pause auto-slide on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        // Initial setup
        generateIndicators();
        showSlide(0);
        startAutoSlide();
    }
    initializeTestimonialsSlider();

    // --- FOOTER: RECENTLY VIEWED FLIGHTS ---
    function initializeFooterFeatures() {
        const recentlyViewedList = document.getElementById('recently-viewed-list');
        if (!recentlyViewedList) return;

        const viewedItems = JSON.parse(localStorage.getItem('recentlyViewedFlights')) || [];

        if (viewedItems.length > 0) {
            recentlyViewedList.innerHTML = ''; // Clear the placeholder text
            viewedItems.forEach(item => {
                const card = document.createElement('a');
                card.href = `destinations.html#${item.name}`;
                card.className = 'recent-view-card';
                card.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" loading="lazy">
                    <div class="recent-view-card-content">
                        <p>${item.name}</p>
                    </div>
                `;
                recentlyViewedList.appendChild(card);
            });
        }
        // If no items, the default HTML message will be shown.
    }
    initializeFooterFeatures();

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

    // --- COOKIE CONSENT BANNER ---
    function initializeCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        const acceptBtn = document.getElementById('cookie-accept-btn');
        const declineBtn = document.getElementById('cookie-decline-btn');

        if (!banner || !acceptBtn || !declineBtn) return;

        const consent = localStorage.getItem('cookie_consent');

        if (!consent) {
            banner.classList.add('visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            banner.classList.remove('visible');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            banner.classList.remove('visible');
        });
    }
    initializeCookieBanner();

    // ============================================= 
    // TRUST INDICATORS: MODAL FUNCTIONALITY
    // ============================================= 
    
    function initializeTrustModals() {
        const modalTriggers = document.querySelectorAll('.trust-modal-trigger');
        const modals = document.querySelectorAll('.trust-modal');
        
        // Open modal
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.dataset.modal;
                const modal = document.getElementById(`${modalId}-modal`);
                
                if (modal) {
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    
                    // Animate in
                    setTimeout(() => {
                        modal.querySelector('.trust-modal-content').style.animation = 'slideUp 0.3s ease';
                    }, 10);
                }
            });
        });
        
        // Close modal handlers
        modals.forEach(modal => {
            // Close button
            const closeButtons = modal.querySelectorAll('.trust-modal-close');
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => closeTrustModal(modal));
            });
            
            // Overlay click
            const overlay = modal.querySelector('.trust-modal-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => closeTrustModal(modal));
            }
            
            // Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    closeTrustModal(modal);
                }
            });
        });
    }
    
    function closeTrustModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    // ============================================= 
    // TRUST INDICATORS: CHAT NOW BUTTON
    // ============================================= 
    
    function initializeTrustChatButtons() {
        const chatButtons = document.querySelectorAll('.trust-cta-btn');
        
        chatButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Trigger the live chat widget
                const liveChatBtn = document.getElementById('live-chat-btn');
                if (liveChatBtn) {
                    liveChatBtn.click();
                } else {
                    // Fallback: open contact page
                    window.location.href = 'contact-us.html?subject=Chat%20Support';
                }
            });
        });
    }
    
    // ============================================= 
    // TRUST INDICATORS: SMOOTH SCROLL TO FAQ
    // ============================================= 
    
    function initializeTrustLearnMoreLinks() {
        const learnMoreLinks = document.querySelectorAll('.trust-link[href^="#"]');
        
        learnMoreLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                
                // Check if FAQ section exists
                const faqSection = document.querySelector('.faq-section');
                if (faqSection) {
                    faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Scroll to offers or contact page
                    window.location.href = 'faq.html';
                }
            });
        });
    }
    
    // ============================================= 
    // TRUST INDICATORS: ANIMATION ON SCROLL
    // ============================================= 
    
    function initializeTrustPillarAnimations() {
        const trustPillars = document.querySelectorAll('.trust-pillar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        trustPillars.forEach(pillar => {
            observer.observe(pillar);
        });
    }
    
    // Initialize all trust indicator features
    if (document.querySelector('.trust-indicators-section')) {
        initializeTrustModals();
        initializeTrustChatButtons();
        initializeTrustLearnMoreLinks();
        initializeTrustPillarAnimations();
    }

    // ============================================= 
    // SOCIAL PROOF: ANIMATED STATISTICS COUNTERS
    // ============================================= 
    
    function initializeStatisticsCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length === 0) return;

        // Counter animation function
        function animateCounter(element, start, target, duration, decimals = 0, suffix = '') {
            const increment = (target - start) / (duration / 16); // 60fps
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                
                if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format number
                let displayValue;
                if (decimals > 0) {
                    displayValue = current.toFixed(decimals);
                } else {
                    displayValue = Math.floor(current).toLocaleString();
                }
                
                element.textContent = displayValue + suffix;
            }, 16);
        }

        // Intersection Observer for scroll-triggered animation
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    const element = entry.target;
                    const target = parseFloat(element.dataset.target);
                    const decimals = parseInt(element.dataset.decimals) || 0;
                    const suffix = element.dataset.suffix || '';
                    
                    // Mark as counted to prevent re-animation
                    element.classList.add('counted');
                    
                    // Start animation
                    animateCounter(element, 0, target, 2000, decimals, suffix);
                    
                    // Animate parent stat-item
                    const statItem = element.closest('.stat-item');
                    if (statItem) {
                        setTimeout(() => {
                            statItem.classList.add('animated');
                        }, 100);
                    }
                }
            });
        }, observerOptions);

        // Observe all stat numbers
        statNumbers.forEach(statNumber => {
            observer.observe(statNumber);
        });
    }

    // ============================================= 
    // SOCIAL PROOF: LIVE ACTIVITY COUNTER
    // ============================================= 
    
    function initializeLiveActivityCounter() {
        const liveCounter = document.getElementById('live-counter');
        
        if (!liveCounter) return;

        const startValue = parseInt(liveCounter.dataset.start) || 127;
        const maxValue = parseInt(liveCounter.dataset.max) || 350;
        let currentValue = startValue;

        // Update counter every 3-5 seconds with random increment
        function updateLiveCounter() {
            const randomIncrement = Math.floor(Math.random() * 10) + 3; // 3-12 increment
            const newValue = currentValue + randomIncrement;
            
            // Reset if exceeds max
            if (newValue > maxValue) {
                currentValue = startValue + Math.floor(Math.random() * 50);
            } else {
                currentValue = newValue;
            }
            
            // Animate number change
            liveCounter.style.transform = 'scale(1.2)';
            liveCounter.style.color = '#ff6b35';
            
            setTimeout(() => {
                liveCounter.textContent = currentValue;
                liveCounter.style.transform = 'scale(1)';
                liveCounter.style.color = 'var(--primary-emerald)';
            }, 150);
            
            // Random interval between 3-5 seconds
            const nextUpdate = (Math.random() * 2000) + 3000;
            setTimeout(updateLiveCounter, nextUpdate);
        }

        // Start after initial delay
        setTimeout(updateLiveCounter, 4000);
    }

    // ============================================= 
    // SOCIAL PROOF: STAT ITEM HOVER EFFECTS
    // ============================================= 
    
    function initializeStatHoverEffects() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                // Track engagement for analytics
                if (typeof gtag !== 'undefined') {
                    const label = this.querySelector('.stat-label')?.textContent;
                    gtag('event', 'stat_hover', {
                        'event_category': 'social_proof',
                        'event_label': label
                    });
                }
            });
        });
    }

    // ============================================= 
    // SOCIAL PROOF: REVIEWS LINK HANDLER
    // ============================================= 
    
    function initializeReviewsLink() {
        const reviewsLink = document.querySelector('.stat-link[href="#reviews"]');
        
        if (reviewsLink) {
            reviewsLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Check if reviews section exists
                const reviewsSection = document.querySelector('.reviews-section, #reviews, .testimonials-section');
                
                if (reviewsSection) {
                    reviewsSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                } else {
                    // Fallback: navigate to reviews page
                    window.location.href = 'reviews.html';
                }
            });
        }
    }

    // Initialize all social proof features
    if (document.querySelector('.social-proof-statistics')) {
        initializeStatisticsCounters();
        initializeLiveActivityCounter();
        initializeStatHoverEffects();
        initializeReviewsLink();
    }

    // ============================================= 
    // POPULAR DESTINATIONS GALLERY
    // ============================================= 
    
    function initializeDestinationsGallery() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        const destinationCards = document.querySelectorAll('.destination-card');
        const skeletonGrid = document.getElementById('destinations-skeleton');
        const destinationsGrid = document.getElementById('destinations-grid');
        const viewAllBtn = document.querySelector('.view-all-destinations-btn');
        
        // Show skeleton loading state initially (simulate loading)
        if (skeletonGrid && destinationsGrid) {
            skeletonGrid.style.display = 'grid';
            destinationsGrid.style.opacity = '0';
            
            // Simulate data loading
            setTimeout(() => {
                skeletonGrid.style.display = 'none';
                destinationsGrid.style.opacity = '1';
            }, 800);
        }
        
        // Filter tabs functionality
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.dataset.category;
                
                // Update active tab
                filterTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Filter cards with animation
                filterDestinations(category);
                
                // Track filter usage
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'destination_filter', {
                        'event_category': 'destinations',
                        'event_label': category
                    });
                }
            });
            
            // Keyboard navigation
            tab.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        // Card click handlers
        destinationCards.forEach(card => {
            // Click to view destination
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking the CTA button
                if (e.target.closest('.destination-cta-btn')) return;
                
                const destinationName = this.querySelector('.destination-name')?.textContent;
                handleDestinationClick(destinationName);
            });
            
            // CTA button click
            const ctaBtn = card.querySelector('.destination-cta-btn');
            if (ctaBtn) {
                ctaBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const destinationName = card.querySelector('.destination-name')?.textContent;
                    handleDestinationSearch(destinationName);
                });
            }
            
            // Keyboard navigation
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const destinationName = this.querySelector('.destination-name')?.textContent;
                    handleDestinationClick(destinationName);
                }
            });
        });
        
        // View All button
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', function() {
                window.location.href = 'destinations.html';
            });
        }
    }
    
    // Filter destinations by category
    function filterDestinations(category) {
        const cards = document.querySelectorAll('.destination-card');
        
        cards.forEach((card, index) => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                // Fade in matching cards with stagger
                setTimeout(() => {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                }, index * 50);
            } else {
                // Fade out non-matching cards
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Handle destination card click
    function handleDestinationClick(destinationName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'destination_view', {
                'event_category': 'destinations',
                'event_label': destinationName
            });
        }
        
        // Navigate to search results or destination page
        console.log('Viewing destination:', destinationName);
        // window.location.href = `destination-details.html?destination=${encodeURIComponent(destinationName)}`;
    }
    
    // Handle search flights for destination
    function handleDestinationSearch(destinationName) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'destination_search', {
                'event_category': 'destinations',
                'event_label': destinationName
            });
        }
        
        // Pre-fill search form and navigate to results
        console.log('Searching flights to:', destinationName);
        
        // Extract city name (before comma)
        const cityName = destinationName.split(',')[0].trim();
        
        // Set destination in localStorage for search form
        localStorage.setItem('searchDestination', cityName);
        
        // Navigate to booking page or scroll to search
        window.location.href = `booking.html?to=${encodeURIComponent(cityName)}`;
    }
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.95);
            }
        }
    `;
    document.head.appendChild(style);
    
    // ============================================= 
    // DESTINATIONS: LAZY LOADING IMAGES
    // ============================================= 
    
    function initializeDestinationImagesLazyLoad() {
        const images = document.querySelectorAll('.destination-card-image[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // ============================================= 
    // DESTINATIONS: ACCESSIBILITY ENHANCEMENTS
    // ============================================= 
    
    function enhanceDestinationsAccessibility() {
        const cards = document.querySelectorAll('.destination-card');
        
        cards.forEach(card => {
            const destinationName = card.querySelector('.destination-name')?.textContent;
            const price = card.querySelector('.price-value')?.textContent;
            const rating = card.querySelector('.destination-rating span')?.textContent;
            
            // Add comprehensive aria-label
            card.setAttribute('aria-label', 
                `${destinationName}. Rating ${rating} out of 5 stars. Flights from ${price}. Press Enter to view details.`
            );
        });
        
        // Announce filter changes to screen readers
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.dataset.category;
                const visibleCards = document.querySelectorAll('.destination-card[style*="display: flex"]').length;
                
                // Create live region for announcements
                let liveRegion = document.getElementById('destinations-live-region');
                if (!liveRegion) {
                    liveRegion = document.createElement('div');
                    liveRegion.id = 'destinations-live-region';
                    liveRegion.setAttribute('aria-live', 'polite');
                    liveRegion.setAttribute('aria-atomic', 'true');
                    liveRegion.className = 'sr-only';
                    document.body.appendChild(liveRegion);
                }
                
                setTimeout(() => {
                    liveRegion.textContent = `Showing ${visibleCards} ${category === 'all' ? '' : category} destinations`;
                }, 300);
            });
        });
    }
    
    // Initialize destinations gallery features
    if (document.querySelector('.destinations-gallery-section')) {
        initializeDestinationsGallery();
        initializeDestinationImagesLazyLoad();
        enhanceDestinationsAccessibility();
    }
});