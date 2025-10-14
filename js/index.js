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

    // ═══════════════════════════════════════════════════════════════════════════════
    // PREMIUM 3D TRAVEL CLASS TABS - Enhanced with Parallax & Ken Burns Effect
    // ═══════════════════════════════════════════════════════════════════════════════
    function initializeTravelClassTabs() {
        const tabsSection = document.querySelector('.travel-classes-3d-section');
        if (!tabsSection) return;

        const tabButtons = Array.from(tabsSection.querySelectorAll('.travel-tab-btn'));
        const tabPanels = Array.from(tabsSection.querySelectorAll('.travel-class-panel'));
        
        if (tabButtons.length === 0 || tabPanels.length === 0) return;

        let currentIndex = 0;
        let isAnimating = false;

        // ━━━ Tab Switching Function with Animation Sequence ━━━
        function switchTab(targetIndex) {
            if (isAnimating || targetIndex === currentIndex) return;
            
            isAnimating = true;
            const previousPanel = tabPanels[currentIndex];
            const nextPanel = tabPanels[targetIndex];

            // Remove active from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Activate new tab button
            tabButtons[targetIndex].classList.add('active');

            // Animate content transition
            setTimeout(() => {
                nextPanel.classList.add('active');
                
                // Trigger feature animations when panel becomes active
                triggerFeatureAnimations(nextPanel);
                
                currentIndex = targetIndex;
                
                setTimeout(() => {
                    isAnimating = false;
                }, 800);
            }, 100);

            // Add ripple effect to clicked tab
            const clickedBtn = tabButtons[targetIndex];
            createRippleEffect(clickedBtn);
        }

        // ━━━ Feature Reveal Animation ━━━
        function triggerFeatureAnimations(panel) {
            const features = panel.querySelectorAll('.feature-item');
            features.forEach((feature, index) => {
                feature.style.animationDelay = `${index * 0.1}s`;
            });

            // Trigger SVG checkmark animations
            const checkmarks = panel.querySelectorAll('.checkmark-svg');
            checkmarks.forEach(svg => {
                const circle = svg.querySelector('.checkmark-circle');
                const check = svg.querySelector('.checkmark-check');
                
                // Reset animations
                circle.style.animation = 'none';
                check.style.animation = 'none';
                
                // Trigger reflow
                void circle.offsetWidth;
                void check.offsetWidth;
                
                // Restart animations
                circle.style.animation = 'checkmarkCircle 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards';
                check.style.animation = 'checkmarkCheck 0.5s 0.4s cubic-bezier(0.65, 0, 0.45, 1) forwards';
            });
        }

        // ━━━ Ripple Effect on Tab Click ━━━
        function createRippleEffect(button) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(29, 94, 51, 0.3);
                width: 20px;
                height: 20px;
                animation: rippleAnimation 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = button.getBoundingClientRect();
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            
            button.style.position = 'relative';
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }

        // ━━━ 3D Parallax Effect on Card Hover ━━━
        tabPanels.forEach(panel => {
            const card3D = panel.querySelector('.panel-3d-card');
            if (!card3D) return;

            card3D.addEventListener('mousemove', (e) => {
                const rect = card3D.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg
                const rotateY = ((x - centerX) / centerX) * 5;   // Max 5deg
                
                card3D.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateY(-12px) 
                    scale(1.02)
                `;
            });

            card3D.addEventListener('mouseleave', () => {
                card3D.style.transform = '';
            });
        });

        // ━━━ Tab Button Click Handlers ━━━
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                switchTab(index);
            });

            // Keyboard accessibility
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    switchTab(index);
                }
            });
        });

        // ━━━ Keyboard Navigation (Arrow Keys) ━━━
        tabsSection.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
                switchTab(prevIndex);
                tabButtons[prevIndex].focus();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % tabButtons.length;
                switchTab(nextIndex);
                tabButtons[nextIndex].focus();
            }
        });

        // ━━━ Intersection Observer for Scroll Animations ━━━
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe amenity chips for stagger animation
        tabPanels.forEach(panel => {
            const chips = panel.querySelectorAll('.amenity-chip');
            chips.forEach((chip, index) => {
                chip.style.opacity = '0';
                chip.style.transform = 'translateY(20px)';
                chip.style.transition = `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s`;
                observer.observe(chip);
            });
        });

        // ━━━ Initialize First Tab ━━━
        switchTab(0);

        // ━━━ Add Ripple Animation Keyframes ━━━
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes rippleAnimation {
                    to {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // ━━━ Performance: Lazy Load Images ━━━
        const images = tabsSection.querySelectorAll('.panel-hero-image img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        console.log('✈️ Premium 3D Travel Class Tabs initialized with', tabButtons.length, 'classes');
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

    // Initialize AOS for other sections with optimized settings for smooth scrolling
    AOS.init({
        duration: 600,
        once: true,
        offset: 50, // Reduced offset so animations start earlier
        easing: 'ease-out-cubic',
        delay: 0,
        mirror: false, // Don't animate out
        anchorPlacement: 'top-bottom', // Start animation when top of element hits bottom of viewport
        disable: false,
        startEvent: 'DOMContentLoaded',
        animatedClassName: 'aos-animate',
        initClassName: 'aos-init',
        useClassNames: false,
        disableMutationObserver: false,
        debounceDelay: 50,
        throttleDelay: 99,
    });

    // --- ENHANCED SCROLL ANIMATIONS ---
    function addScrollAnimations() {
        const observerOptions = {
            threshold: 0.05, // Lower threshold for earlier trigger
            rootMargin: '0px 0px -100px 0px' // Start earlier
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

    // --- TESTIMONIALS SECTION REMOVED ---

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
    // NEW SECTIONS: INTERACTIVE FUNCTIONALITY
    // =============================================

    // ============================================= 
    // FLASH DEALS TICKER ANIMATION
    // ============================================= 
    function initializeFlashDealsTicker() {
        const ticker = document.getElementById('deals-ticker');
        if (!ticker) return;

        // Clone deals for seamless loop
        const tickerContent = ticker.innerHTML;
        ticker.innerHTML = tickerContent + tickerContent;

        // Pause animation on hover
        ticker.addEventListener('mouseenter', () => {
            ticker.style.animationPlayState = 'paused';
        });

        ticker.addEventListener('mouseleave', () => {
            ticker.style.animationPlayState = 'running';
        });
    }

    // ============================================= 
    // POPULAR ROUTES: CLICK TO SEARCH
    // ============================================= 
    function initializePopularRoutes() {
        const routeCards = document.querySelectorAll('.route-card');
        const toInput = document.getElementById('to');
        const fromInput = document.getElementById('from');
        const searchSection = document.getElementById('search-section-anchor');

        routeCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.closest('.route-cta-btn')) {
                    const fromCode = this.dataset.from;
                    const toCode = this.dataset.to;
                    const cityFrom = this.querySelector('.city-from').textContent;
                    const cityTo = this.querySelector('.city-to').textContent;

                    // Populate search form
                    if (fromInput && toInput) {
                        fromInput.value = `${cityFrom} (${fromCode})`;
                        toInput.value = `${cityTo} (${toCode})`;

                        // Scroll to search section
                        if (searchSection) {
                            searchSection.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });

                            // Highlight the search button
                            setTimeout(() => {
                                const searchBtn = document.querySelector('.search-flights-btn');
                                if (searchBtn) {
                                    searchBtn.style.animation = 'pulse 1s ease-in-out 3';
                                }
                            }, 800);
                        }
                    }
                }
            });

            // Add hover sound effect (optional)
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
        });
    }

    // ============================================= 
    // LAST-MINUTE DEALS CAROUSEL
    // ============================================= 
    function initializeLastMinuteCarousel() {
        const carousel = document.querySelector('.last-minute-carousel');
        const prevBtn = document.querySelector('.last-minute-carousel-container .prev-btn');
        const nextBtn = document.querySelector('.last-minute-carousel-container .next-btn');
        
        if (!carousel || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        const cards = carousel.querySelectorAll('.lastminute-card');
        const totalCards = cards.length;
        let cardsToShow = getCardsToShow();

        function getCardsToShow() {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 1024) return 2;
            return 3;
        }

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 24; // 1.5rem = 24px
            const offset = currentIndex * (cardWidth + gap);
            carousel.style.transform = `translateX(-${offset}px)`;
            carousel.style.transition = 'transform 0.5s ease-in-out';
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            const maxIndex = totalCards - cardsToShow;
            currentIndex = Math.min(maxIndex, currentIndex + 1);
            updateCarousel();
        });

        // Update on window resize
        window.addEventListener('resize', () => {
            cardsToShow = getCardsToShow();
            currentIndex = Math.min(currentIndex, totalCards - cardsToShow);
            updateCarousel();
        });

        // Auto-scroll every 5 seconds
        let autoScrollInterval = setInterval(() => {
            const maxIndex = totalCards - cardsToShow;
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel();
        }, 5000);

        // Pause auto-scroll on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(() => {
                const maxIndex = totalCards - cardsToShow;
                if (currentIndex >= maxIndex) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                updateCarousel();
            }, 5000);
        });

        // Book now button functionality
        const bookNowBtns = document.querySelectorAll('.lastminute-cta-btn');
        bookNowBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const card = this.closest('.lastminute-card');
                const destination = card.querySelector('.lastminute-route > span:first-child').textContent;
                
                // Show confirmation animation
                this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
                this.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                
                setTimeout(() => {
                    this.innerHTML = 'Book Now <i class="fas fa-arrow-right"></i>';
                    this.style.background = '';
                }, 2000);
            });
        });
    }

    // ============================================= 
    // AIRLINE PARTNERS: HOVER EFFECT
    // ============================================= 
    function initializeAirlinePartners() {
        const partnerItems = document.querySelectorAll('.partner-logo-item');
        
        partnerItems.forEach(item => {
            item.addEventListener('click', function() {
                const airlineName = this.querySelector('.partner-name').textContent;
                
                // Show tooltip or modal with airline info (optional)
                console.log(`Showing flights from ${airlineName}`);
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    }

    // ============================================= 
    // PRICE COMPARISON: ANIMATE ON SCROLL
    // ============================================= 
    function initializePriceComparison() {
        const comparisonSection = document.querySelector('.price-comparison-section');
        if (!comparisonSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const logos = entry.target.querySelectorAll('.airline-logo');
                    logos.forEach((logo, index) => {
                        setTimeout(() => {
                            logo.style.animation = 'fadeInUp 0.5s ease forwards';
                            logo.style.opacity = '1';
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(comparisonSection);
    }

    // ============================================= 
    // URGENCY TIMER FOR LAST-MINUTE DEALS
    // ============================================= 
    function initializeUrgencyTimers() {
        const urgencyBadges = document.querySelectorAll('.urgency-badge');
        
        urgencyBadges.forEach(badge => {
            const text = badge.querySelector('span').textContent;
            const days = parseInt(text.match(/\d+/));
            
            // Update color based on urgency
            if (days <= 2) {
                badge.classList.add('urgent');
            }
            
            // Add pulsing animation for very urgent deals
            if (days === 1) {
                badge.style.animation = 'urgencyPulse 0.8s ease-in-out infinite';
            }
        });
    }

    // ============================================= 
    // SMOOTH SCROLL FOR DEALS BUTTONS
    // ============================================= 
    function initializeDealsButtons() {
        const viewAllDealsBtn = document.querySelector('.view-all-deals-btn');
        
        if (viewAllDealsBtn) {
            viewAllDealsBtn.addEventListener('click', function(e) {
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: rgba(255,255,255,0.5);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        }
    }

    // Initialize all new features
    if (document.querySelector('.flash-deals-banner')) {
        initializeFlashDealsTicker();
    }

    if (document.querySelector('.popular-routes-section')) {
        initializePopularRoutes();
    }

    if (document.querySelector('.last-minute-deals-section')) {
        initializeLastMinuteCarousel();
        initializeUrgencyTimers();
    }

    if (document.querySelector('.airline-partners-section')) {
        initializeAirlinePartners();
    }

    if (document.querySelector('.price-comparison-section')) {
        initializePriceComparison();
    }

    initializeDealsButtons();

    // ============================================= 
    // SMOOTH SCROLL OPTIMIZATION
    // ============================================= 
    function optimizeSmoothScrolling() {
        // Debounce scroll events for better performance
        let scrollTimeout;
        let isScrolling = false;

        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                isScrolling = true;
                document.body.classList.add('is-scrolling');
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                isScrolling = false;
                document.body.classList.remove('is-scrolling');
            }, 150);
        }, { passive: true });

        // Preload sections on scroll (exclude footer)
        const sections = document.querySelectorAll('section:not(.destinova-footer):not(.home-hero)');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.01,
            rootMargin: '100px 0px'
        });

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
            sectionObserver.observe(section);
        });

        // Make hero and footer immediately visible
        const hero = document.querySelector('.home-hero');
        const footer = document.querySelector('.destinova-footer');
        if (hero) {
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }
        if (footer) {
            footer.style.opacity = '1';
            footer.style.transform = 'translateY(0)';
        }
    }

    optimizeSmoothScrolling();

    // ============================================= 
    // MODERN HERO SECTION: VANTA.JS BACKGROUND
    // ============================================= 
    function initializeHeroBackground() {
        const vantaBg = document.getElementById('vanta-bg');
        if (vantaBg && typeof VANTA !== 'undefined') {
        if (vantaBg && typeof VANTA !== 'undefined' && typeof THREE !== 'undefined') {
            try {
                VANTA.WAVES({
                    el: vantaBg,
                    THREE: THREE, // Pass THREE.js object
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0x0a5f46,
                    color: 0x0a5f46, // A dark emerald color
                    shininess: 40.00,
                    waveHeight: 15.00,
                    waveSpeed: 0.60,
                    zoom: 0.80
                });
            } catch (e) {
                console.log('Vanta.js initialization skipped:', e.message);
                console.warn('Vanta.js initialization failed. It might be blocked or not loaded correctly.', e);
                // Fallback solid color
                vantaBg.style.backgroundColor = '#0f2027';
            }
        } else {
            console.warn('Vanta.js, THREE.js, or the #vanta-bg element is not available.');
        }
    }

    // ============================================= 
    // HERO SECTION: ANIMATED COUNTERS
    // ============================================= 
    function initializeHeroCounters() {
        const counters = document.querySelectorAll('.stat-number-hero');
        const options = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseFloat(entry.target.getAttribute('data-count'));
                    animateHeroCounter(entry.target, 0, target, 2000);
                }
            });
        }, options);

        counters.forEach(counter => observer.observe(counter));
    }

    function animateHeroCounter(element, start, end, duration) {
        let startTime = null;
        const isDecimal = end % 1 !== 0;

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            const value = progress * (end - start) + start;
            
            if (isDecimal) {
                element.textContent = value.toFixed(1);
            } else {
                element.textContent = Math.floor(value).toLocaleString();
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = isDecimal ? end.toFixed(1) : end.toLocaleString();
                // Ensure final value is exact
                if (isDecimal) {
                    element.textContent = end.toFixed(1);
                } else {
                    // Add M for million
                    element.textContent = end.toLocaleString() + 'M';
                }
            }
        };

        requestAnimationFrame(step);
    }

    // ============================================= 
    // HERO SEARCH WIDGET: TAB SWITCHING
    // ============================================= 
    function initializeHeroSearchWidget() {
        const tabButtons = document.querySelectorAll('.widget-tabs .tab-btn');
        const returnDateField = document.querySelector('.return-date');
        
        if (!tabButtons.length || !returnDateField) return;

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all tabs
                tabButtons.forEach(b => b.classList.remove('active'));
                
                // Add active to clicked tab
                btn.classList.add('active');
                
                const tabType = btn.getAttribute('data-tab');
                
                // Show/hide return date based on trip type
                if (tabType === 'one-way') {
                    returnDateField?.classList.add('hidden');
                    returnDateField.classList.add('hidden');
                } else {
                    returnDateField?.classList.remove('hidden');
                    returnDateField.classList.remove('hidden');
                }

                // Add smooth transition
                if (returnDateField) {
                    returnDateField.style.transition = 'all 0.3s ease';
                }
            });
        });
    }

    // ============================================= 
    // HERO SEARCH: SWAP LOCATIONS
    // ============================================= 
    function initializeHeroSwapButton() {
        const swapBtn = document.getElementById('swap-btn-hero');
        const fromInput = document.getElementById('hero-from');
        const toInput = document.getElementById('hero-to');
        
        if (swapBtn && fromInput && toInput) {
            swapBtn.addEventListener('click', () => {
                const temp = fromInput.value;
                fromInput.value = toInput.value;
                toInput.value = temp;
                [fromInput.value, toInput.value] = [toInput.value, fromInput.value];
                
                // Add animation
                fromInput.style.transform = 'scale(1.05)';
                toInput.style.transform = 'scale(1.05)';
                
                setTimeout(() => {
                    fromInput.style.transform = 'scale(1)';
                    toInput.style.transform = 'scale(1)';
                }, 200);
            });
        }
    }

    // ============================================= 
    // HERO SEARCH: PASSENGERS DROPDOWN
    // ============================================= 
    function initializeHeroPassengersDropdown() {
        const passengersBtn = document.getElementById('passengers-toggle-hero');
        const passengersDropdown = document.getElementById('passengers-dropdown-hero');
        const doneBtn = document.getElementById('passengers-done-hero');
        const displayText = document.getElementById('passengers-display-hero');
        
        if (!passengersBtn || !passengersDropdown || !doneBtn || !displayText) return;

        let adults = 1, children = 0, infants = 0;
        let flightClass = 'Economy';
        
        passengersBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            passengersDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!passengersDropdown.contains(e.target) && e.target !== passengersBtn) {
                passengersDropdown.classList.remove('active');
            }
        });
        
        passengersDropdown.querySelectorAll('.counter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                const type = btn.getAttribute('data-type');
                const counterValueEl = document.getElementById(`${type}-count-hero`);
                let count = parseInt(counterValueEl.textContent);

                if (action === 'increase') {
                    if (type === 'adults' && count < 9) adults = ++count;
                    else if (type === 'children' && count < 8) children = ++count;
                    else if (type === 'infants' && count < adults) infants = ++count;
                } else if (action === 'decrease') {
                    if (type === 'adults' && count > 1) {
                        adults = --count;
                        if (infants > adults) infants = adults;
                    } else if ((type === 'children' || type === 'infants') && count > 0) {
                        if (type === 'children') children = --count;
                        if (type === 'infants') infants = --count;
                    }
                }
                updatePassengersDisplay();
            });
        });
        
        passengersDropdown.querySelectorAll('.class-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                passengersDropdown.querySelectorAll('.class-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                flightClass = btn.getAttribute('data-class');
                updatePassengersDisplay();
            });
        });
        
        doneBtn.addEventListener('click', () => {
            passengersDropdown.classList.remove('active');
        });
        
        function updatePassengersDisplay() {
            document.getElementById('adults-count-hero').textContent = adults;
            document.getElementById('children-count-hero').textContent = children;
            document.getElementById('infants-count-hero').textContent = infants;

            const totalPassengers = adults + children + infants;
            displayText.textContent = `${totalPassengers} Passenger${totalPassengers > 1 ? 's' : ''}, ${flightClass}`;

            // Update button states
            passengersDropdown.querySelector('[data-type="adults"][data-action="decrease"]').disabled = adults <= 1;
            passengersDropdown.querySelector('[data-type="infants"][data-action="increase"]').disabled = infants >= adults;
        }
    }

    // ============================================= 
    // HERO SEARCH: FORM SUBMISSION
    // ============================================= 
    function initializeHeroSearchForm() {
        const form = document.getElementById('hero-search-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = {
                    from: document.getElementById('hero-from')?.value,
                    to: document.getElementById('hero-to')?.value,
                    departure: document.getElementById('hero-departure')?.value,
                    return: document.getElementById('hero-return')?.value,
                    passengers: document.getElementById('passengers-display-hero')?.textContent
                };
                
                if (!formData.from || !formData.to || !formData.departure) {
                    alert('Please fill in all required fields.');
                    return;
                }
                
                const params = new URLSearchParams(formData);
                window.location.href = `results.html?${params.toString()}`;
            });
        }
    }

    // ============================================= 
    // MODERN HERO SECTION: VANTA.JS BACKGROUND
    // ============================================= 
    function initializeHeroBackground() {
        const vantaBg = document.getElementById('vanta-bg');
        if (vantaBg && typeof VANTA !== 'undefined') {
            try {
                VANTA.WAVES({
                    el: vantaBg,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: 0x0a5f46,
                    shininess: 40.00,
                    waveHeight: 15.00,
                    waveSpeed: 0.60,
                    zoom: 0.80
                });
            } catch (e) {
                console.log('Vanta.js initialization skipped:', e.message);
            }
        }
    }

    // ============================================= 
    // HERO SEARCH: PASSENGERS DROPDOWN
    // ============================================= 
    function initializeHeroPassengersDropdown() {
        const passengersBtn = document.getElementById('passengers-toggle-hero');
        const passengersDropdown = document.getElementById('passengers-dropdown-hero');
        const doneBtn = document.getElementById('passengers-done-hero');
        const displayText = document.getElementById('passengers-display-hero');
        
        let adults = 1;
        let children = 0;
        let infants = 0;
        let flightClass = 'Economy';
        
        // Toggle dropdown
        if (passengersBtn && passengersDropdown) {
            passengersBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                passengersDropdown.classList.toggle('active');
            });
            
            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!passengersDropdown.contains(e.target) && e.target !== passengersBtn) {
                    passengersDropdown.classList.remove('active');
                }
            });
        }
        
        // Counter buttons
        const counterButtons = passengersDropdown?.querySelectorAll('.counter-btn');
        counterButtons?.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                const type = btn.getAttribute('data-type');
                const counterValue = document.getElementById(`${type}-count-hero`);
                
                let currentValue = parseInt(counterValue.textContent);
                
                if (action === 'increase') {
                    if (type === 'adults' && currentValue < 9) {
                        currentValue++;
                        adults = currentValue;
                    } else if (type === 'children' && currentValue < 8) {
                        currentValue++;
                        children = currentValue;
                    } else if (type === 'infants' && currentValue < adults) {
                        currentValue++;
                        infants = currentValue;
                    }
                } else if (action === 'decrease') {
                    if (type === 'adults' && currentValue > 1) {
                        currentValue--;
                        adults = currentValue;
                        // Ensure infants don't exceed adults
                        if (infants > adults) {
                            infants = adults;
                            document.getElementById('infants-count-hero').textContent = infants;
                        }
                    } else if ((type === 'children' || type === 'infants') && currentValue > 0) {
                        currentValue--;
                        if (type === 'children') children = currentValue;
                        if (type === 'infants') infants = currentValue;
                    }
                }
                
                counterValue.textContent = currentValue;
                updatePassengersDisplay();
                updateCounterStates();
            });
        });
        
        // Class selector
        const classButtons = passengersDropdown?.querySelectorAll('.class-btn');
        classButtons?.forEach(btn => {
            btn.addEventListener('click', () => {
                classButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                flightClass = btn.getAttribute('data-class');
                updatePassengersDisplay();
            });
        });
        
        // Done button
        if (doneBtn) {
            doneBtn.addEventListener('click', () => {
                passengersDropdown.classList.remove('active');
            });
        }
        
        function updatePassengersDisplay() {
            const totalPassengers = adults + children + infants;
            const passengerText = totalPassengers === 1 ? '1 Passenger' : `${totalPassengers} Passengers`;
            displayText.textContent = `${passengerText}, ${flightClass}`;
        }
        
        function updateCounterStates() {
            // Update button states
            const adultsCountBtn = passengersDropdown?.querySelectorAll('[data-type="adults"]');
            const infantsCountBtn = passengersDropdown?.querySelectorAll('[data-type="infants"]');
            
            adultsCountBtn?.forEach(btn => {
                if (btn.getAttribute('data-action') === 'decrease') {
                    btn.disabled = adults <= 1;
                } else {
                    btn.disabled = adults >= 9;
                }
            });
            
            infantsCountBtn?.forEach(btn => {
                if (btn.getAttribute('data-action') === 'increase') {
                    btn.disabled = infants >= adults;
                }
            });
        }
    }

    // ============================================= 
    // HERO SEARCH: FORM SUBMISSION
    // ============================================= 
    function initializeHeroSearchForm() {
        const form = document.getElementById('hero-search-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = {
                    from: document.getElementById('hero-from')?.value,
                    to: document.getElementById('hero-to')?.value,
                    departure: document.getElementById('hero-departure')?.value,
                    return: document.getElementById('hero-return')?.value,
                    passengers: document.getElementById('passengers-display-hero')?.textContent
                };
                
                // Validate
                if (!formData.from || !formData.to) {
                    alert('Please enter departure and arrival cities');
                    return;
                }
                
                if (!formData.departure) {
                    alert('Please select a departure date');
                    return;
                }
                
                // Redirect to booking page with data
                const params = new URLSearchParams(formData);
                window.location.href = `booking.html?${params.toString()}`;
            });
        }
    }

    // ============================================= 
    // HERO: GSAP ANIMATIONS
    // ============================================= 
    function initializeHeroAnimations() {
        if (typeof gsap !== 'undefined') {
            // Animate hero title
            gsap.from('.hero-title-gradient', {
                opacity: 0,
                y: 50,
                duration: 1,
                delay: 0.3,
                ease: 'power3.out'
            });
            
            // Animate subtitle
            gsap.from('.hero-subtitle', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.6,
                ease: 'power2.out'
            });
            
            // Animate stats
            gsap.from('.hero-trust-stats', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.9,
                ease: 'power2.out'
            });
            
            // Animate search widget
            gsap.from('.search-widget-glass', {
                opacity: 0,
                x: 100,
                duration: 1,
                delay: 0.5,
                ease: 'power3.out'
            });
        }
    }

    // ============================================= 
    // POPULAR ROUTES: QUICK SELECT
    // ============================================= 
    function initializePopularRoutesQuickSelect() {
        const routeCards = document.querySelectorAll('.route-quick-card');
        const scrollContainer = document.getElementById('routes-scroll-container');
        const scrollHintBtn = document.getElementById('scroll-hint-routes');
        
        // Auto-scroll hint
        if (scrollHintBtn && scrollContainer) {
            scrollHintBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({
                    left: 200,
                    behavior: 'smooth'
                });
            });
        }
        
        // Route card click handler
        routeCards.forEach(card => {
            card.addEventListener('click', () => {
                const from = card.getAttribute('data-from');
                const to = card.getAttribute('data-to');
                const price = card.getAttribute('data-price');
                
                // Auto-fill search form
                const fromInput = document.getElementById('hero-from');
                const toInput = document.getElementById('hero-to');
                
                if (fromInput && toInput) {
                    fromInput.value = from;
                    toInput.value = to;
                    
                    // Add animation
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 200);
                    
                    // Pulse animation on inputs
                    [fromInput, toInput].forEach(input => {
                        input.style.animation = 'pulse 0.5s ease';
                        setTimeout(() => {
                            input.style.animation = '';
                        }, 500);
                    });
                    
                    // Show flexible date grid
                    showFlexibleDateGrid();
                }
            });
        });
    }

    // ============================================= 
    // FLEXIBLE DATE GRID
    // ============================================= 
    function showFlexibleDateGrid() {
        const dateGrid = document.getElementById('flexible-date-grid');
        const dateContainer = document.getElementById('date-grid-container');
        
        if (dateGrid && dateContainer) {
            dateGrid.style.display = 'block';
            
            // Generate date grid
            setTimeout(() => {
                generateDateGrid(dateContainer);
            }, 300);
        }
    }

    function generateDateGrid(container) {
        const today = new Date();
        const dates = [];
        
        // Generate next 14 days
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            // Random price simulation
            const basePrice = 300 + Math.floor(Math.random() * 400);
            const priceCategory = basePrice < 400 ? 'cheap' : 
                                 basePrice < 550 ? 'moderate' : 'expensive';
            
            dates.push({
                date: date,
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                number: date.getDate(),
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                price: basePrice,
                category: priceCategory
            });
        }
        
        // Clear skeleton
        container.innerHTML = '';
        
        // Render date cells
        dates.forEach((dateInfo, index) => {
            const cell = document.createElement('div');
            cell.className = `date-cell price-${dateInfo.category}`;
            cell.innerHTML = `
                <div class="date-day">${dateInfo.day}</div>
                <div class="date-number">${dateInfo.number}</div>
                <div class="date-price">$${dateInfo.price}</div>
                <div class="date-tooltip">
                    <strong>${dateInfo.day}, ${dateInfo.month} ${dateInfo.number}</strong><br>
                    Best price: $${dateInfo.price}<br>
                    ${dateInfo.category === 'cheap' ? '🔥 Great deal!' : 
                      dateInfo.category === 'moderate' ? '💼 Fair price' : 
                      '💎 Premium'}
                </div>
            `;
            
            // Add click handler
            cell.addEventListener('click', () => {
                // Remove previous selection
                container.querySelectorAll('.date-cell').forEach(c => {
                    c.classList.remove('selected');
                });
                
                // Select this cell
                cell.classList.add('selected');
                
                // Update departure input
                const departureInput = document.getElementById('hero-departure');
                if (departureInput) {
                    const formattedDate = dateInfo.date.toISOString().split('T')[0];
                    departureInput.value = formattedDate;
                }
                
                // Trigger price update animation
                cell.style.animation = 'chipPop 0.4s ease';
                setTimeout(() => {
                    cell.style.animation = '';
                }, 400);
            });
            
            container.appendChild(cell);
            
            // Stagger animation
            setTimeout(() => {
                cell.style.animation = 'fadeInUp 0.3s ease';
            }, index * 30);
        });
    }

    function initializeFlexibleDateGrid() {
        const closeDateBtn = document.getElementById('close-date-grid');
        const dateGrid = document.getElementById('flexible-date-grid');
        
        if (closeDateBtn && dateGrid) {
            closeDateBtn.addEventListener('click', () => {
                dateGrid.style.display = 'none';
            });
        }
    }

    // ============================================= 
    // AIRLINE FILTER CHIPS
    // ============================================= 
    function initializeAirlineFilters() {
        const airlineChips = document.querySelectorAll('.airline-chip');
        const clearFiltersBtn = document.getElementById('clear-airline-filters');
        const selectedAirlines = new Set();
        
        airlineChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const airline = chip.getAttribute('data-airline');
                
                if (chip.classList.contains('active')) {
                    chip.classList.remove('active');
                    selectedAirlines.delete(airline);
                } else {
                    chip.classList.add('active');
                    selectedAirlines.add(airline);
                }
                
                // Update search results (simulated)
                console.log('Selected airlines:', Array.from(selectedAirlines));
            });
        });
        
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                airlineChips.forEach(chip => {
                    chip.classList.remove('active');
                });
                selectedAirlines.clear();
                
                // Add feedback animation
                clearFiltersBtn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    clearFiltersBtn.style.transform = '';
                }, 200);
            });
        }
    }

    // ============================================= 
    // PRICE ALERT TOGGLE
    // ============================================= 
    function initializePriceAlert() {
        const priceAlertToggle = document.getElementById('price-alert-toggle');
        
        if (priceAlertToggle) {
            priceAlertToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Show notification
                    showPriceAlertNotification('✓ Price alerts enabled! We\'ll notify you of drops.');
                    
                    // Save to localStorage
                    localStorage.setItem('priceAlertsEnabled', 'true');
                } else {
                    showPriceAlertNotification('Price alerts disabled.');
                    localStorage.removeItem('priceAlertsEnabled');
                }
            });
            
            // Load saved state
            if (localStorage.getItem('priceAlertsEnabled') === 'true') {
                priceAlertToggle.checked = true;
            }
        }
    }

    function showPriceAlertNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #10B981 0%, #059669 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // ============================================= 
    // SEARCH RESULTS SKELETON
    // ============================================= 
    function showSearchSkeleton() {
        const skeleton = document.getElementById('search-skeleton');
        if (skeleton) {
            skeleton.style.display = 'block';
            
            // Auto-hide after simulated load time
            setTimeout(() => {
                hideSearchSkeleton();
            }, 2500);
        }
    }

    function hideSearchSkeleton() {
        const skeleton = document.getElementById('search-skeleton');
        if (skeleton) {
            skeleton.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                skeleton.style.display = 'none';
                skeleton.style.animation = '';
            }, 300);
        }
    }

    // ============================================= 
    // REAL-TIME PRICE UPDATES
    // ============================================= 
    function initializeRealTimePriceUpdates() {
        const priceElements = document.querySelectorAll('.price-amount, .date-price');
        
        // Simulate price updates every 30 seconds
        setInterval(() => {
            priceElements.forEach(priceEl => {
                const currentPrice = parseInt(priceEl.textContent.replace(/\D/g, ''));
                
                // Random price change (-5% to +5%)
                const change = Math.floor(currentPrice * (Math.random() * 0.1 - 0.05));
                const newPrice = currentPrice + change;
                
                if (change !== 0) {
                    // Pulse animation
                    priceEl.style.animation = 'pulse 0.5s ease';
                    
                    setTimeout(() => {
                        priceEl.textContent = priceEl.textContent.includes('$') ? 
                            `$${newPrice}` : newPrice.toString();
                        
                        // Color flash based on change
                        if (change < 0) {
                            priceEl.style.color = '#10B981';
                        } else if (change > 0) {
                            priceEl.style.color = '#EF4444';
                        }
                        
                        setTimeout(() => {
                            priceEl.style.animation = '';
                            priceEl.style.color = '';
                        }, 500);
                    }, 250);
                }
            });
        }, 30000);
    }

    // ============================================= 
    // ENHANCED HERO SEARCH FORM WITH SKELETON
    // ============================================= 
    function enhanceHeroSearchForm() {
        const form = document.getElementById('hero-search-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = {
                    from: document.getElementById('hero-from')?.value,
                    to: document.getElementById('hero-to')?.value,
                    departure: document.getElementById('hero-departure')?.value,
                    return: document.getElementById('hero-return')?.value,
                    passengers: document.getElementById('passengers-display-hero')?.textContent
                };
                
                // Validate
                if (!formData.from || !formData.to) {
                    alert('Please enter departure and arrival cities');
                    return;
                }
                
                if (!formData.departure) {
                    alert('Please select a departure date');
                    return;
                }
                
                // Show skeleton loading
                showSearchSkeleton();
                
                // Simulate search delay
                setTimeout(() => {
                    // Redirect to booking page with data
                    const params = new URLSearchParams(formData);
                    window.location.href = `booking.html?${params.toString()}`;
                }, 2500);
            });
        }
    }

    // Add pulse animation to CSS dynamically
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(pulseStyle);

    // =============================================
    // MASONRY GALLERY INITIALIZATION
    // =============================================
    function initializeMasonryGallery() {
        // Lazy Loading with Blur-Up Effect
        initializeLazyLoading();
        
        // Favorite Hearts Functionality
        initializeFavoriteHearts();
        
        // Countdown Timers
        initializeCountdownTimers();
        
        // Video Background Hover
        initializeVideoBackgrounds();
        
        console.log('🖼️ Masonry gallery initialized with lazy loading, favorites, and countdown timers');
    }

    // ============================================= 
    // LAZY LOADING WITH INTERSECTION OBSERVER
    // ============================================= 
    function initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('.masonry-card-image.lazy-load');
        
        if (!lazyImages.length) return;
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        // Create temporary image to preload
                        const tempImg = new Image();
                        tempImg.src = src;
                        
                        tempImg.onload = () => {
                            img.src = src;
                            img.classList.remove('lazy-load');
                            img.classList.add('lazy-loaded');
                        };
                        
                        tempImg.onerror = () => {
                            console.error('Failed to load image:', src);
                            img.classList.remove('lazy-load');
                        };
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading 50px before entering viewport
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================= 
    // FAVORITE HEARTS WITH LOCAL STORAGE
    // ============================================= 
    function initializeFavoriteHearts() {
        const favoriteButtons = document.querySelectorAll('.favorite-heart');
        
        if (!favoriteButtons.length) return;
        
        // Load saved favorites from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favoriteDestinations') || '[]');
        
        favoriteButtons.forEach(button => {
            const destination = button.getAttribute('data-destination');
            
            // Set initial state
            if (savedFavorites.includes(destination)) {
                button.classList.add('active');
            }
            
            // Click handler
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                
                const isActive = button.classList.contains('active');
                button.classList.toggle('active');
                
                // Update localStorage
                let favorites = JSON.parse(localStorage.getItem('favoriteDestinations') || '[]');
                
                if (isActive) {
                    // Remove from favorites
                    favorites = favorites.filter(fav => fav !== destination);
                    showMasonryNotification(`Removed ${destination} from favorites`, 'info');
                } else {
                    // Add to favorites
                    if (!favorites.includes(destination)) {
                        favorites.push(destination);
                        showMasonryNotification(`Added ${destination} to favorites ❤️`, 'success');
                    }
                }
                
                localStorage.setItem('favoriteDestinations', JSON.stringify(favorites));
            });
        });
    }

    function showMasonryNotification(message, type) {
        const colors = {
            success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            info: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type] || colors.success};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ============================================= 
    // COUNTDOWN TIMERS FOR LIMITED TIME DEALS
    // ============================================= 
    function initializeCountdownTimers() {
        const countdownElements = document.querySelectorAll('.countdown-timer');
        
        if (!countdownElements.length) return;
        
        countdownElements.forEach(element => {
            const endTime = element.getAttribute('data-endtime');
            
            if (!endTime) return;
            
            const countdownInterval = setInterval(() => {
                const now = new Date().getTime();
                const end = new Date(endTime).getTime();
                const distance = end - now;
                
                if (distance < 0) {
                    clearInterval(countdownInterval);
                    element.textContent = 'EXPIRED';
                    return;
                }
                
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                element.textContent = `${hours}h ${minutes}m ${seconds}s`;
            }, 1000);
        });
    }

    // ============================================= 
    // VIDEO BACKGROUNDS ON HOVER (IF IMPLEMENTED)
    // ============================================= 
    function initializeVideoBackgrounds() {
        const videoCards = document.querySelectorAll('.masonry-card[data-video]');
        
        if (!videoCards.length) return;
        
        videoCards.forEach(card => {
            const videoUrl = card.getAttribute('data-video');
            
            if (!videoUrl) return;
            
            // Create video element (hidden initially)
            const video = document.createElement('video');
            video.src = videoUrl;
            video.loop = true;
            video.muted = true;
            video.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0;
                transition: opacity 0.5s ease;
                z-index: 1;
            `;
            
            const imageWrapper = card.querySelector('.masonry-card-image-wrapper');
            imageWrapper.insertBefore(video, imageWrapper.firstChild);
            
            // Hover events
            card.addEventListener('mouseenter', () => {
                video.play();
                setTimeout(() => {
                    video.style.opacity = '1';
                }, 100);
            });
            
            card.addEventListener('mouseleave', () => {
                video.style.opacity = '0';
                setTimeout(() => {
                    video.pause();
                    video.currentTime = 0;
                }, 500);
            });
        });
    }

    // ============================================= 
    // MASONRY FILTER PILLS (IF IMPLEMENTED)
    // ============================================= 
    function initializeMasonryFilters() {
        const filterPills = document.querySelectorAll('.masonry-filter-pill');
        const masonryCards = document.querySelectorAll('.masonry-card');
        
        if (!filterPills.length) return;
        
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                // Update active state
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                const category = pill.getAttribute('data-category');
                
                // Filter cards
                masonryCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Initialize all hero features
    if (document.getElementById('hero-section')) {
    if (document.querySelector('.home-hero')) {
        initializeHeroBackground();
        initializeHeroCounters();
        initializeHeroSearchWidget();
        initializeHeroSwapButton();
        initializeHeroPassengersDropdown();
        initializeHeroSearchForm();
        enhanceHeroSearchForm();
        
        // Initialize new features
        initializePopularRoutesQuickSelect();
        initializeFlexibleDateGrid();
        initializeAirlineFilters();
        initializePriceAlert();
        initializeRealTimePriceUpdates();
        
        // Initialize GSAP animations after a short delay
        setTimeout(() => {
            initializeHeroAnimations();
        }, 100);
    }

    // Initialize masonry gallery if present
    if (document.getElementById('masonry-grid')) {
        initializeMasonryGallery();
    }

    // ═══════════════════════════════════════════════════════════════════════════════
    // FLIGHT BOOKING HERO - CONVERSION FOCUSED FUNCTIONALITY
    // ═══════════════════════════════════════════════════════════════════════════════
    
    function initFlightBookingHero() {
        // Parallax Effect on Scroll
        const heroBackground = document.querySelector('.hero-bg-image');
        if (heroBackground) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            });
        }

        // Tab Navigation
        const tabBtns = document.querySelectorAll('.tab-btn');
        const returnDateGroup = document.getElementById('returnDateGroup');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all tabs
                tabBtns.forEach(tab => tab.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');
                
                const tripType = this.getAttribute('data-trip-type');
                
                // Hide/show return date based on trip type
                if (tripType === 'one-way') {
                    if (returnDateGroup) returnDateGroup.style.display = 'none';
                } else {
                    if (returnDateGroup) returnDateGroup.style.display = 'flex';
                }
            });
        });

        // Swap Locations Button
        const swapBtn = document.getElementById('swapLocations');
        const fromInput = document.getElementById('fromLocation');
        const toInput = document.getElementById('toLocation');
        
        if (swapBtn && fromInput && toInput) {
            swapBtn.addEventListener('click', function() {
                const temp = fromInput.value;
                fromInput.value = toInput.value;
                toInput.value = temp;
                
                // Add animation class
                this.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    this.style.transform = 'rotate(0deg)';
                }, 300);
            });
        }

        // Autocomplete Functionality
        const fromLocationInput = document.getElementById('fromLocation');
        const toLocationInput = document.getElementById('toLocation');
        const fromDropdown = document.getElementById('fromDropdown');
        const toDropdown = document.getElementById('toDropdown');
        
        function setupAutocomplete(input, dropdown) {
            if (!input || !dropdown) return;
            
            input.addEventListener('focus', function() {
                dropdown.classList.add('active');
            });
            
            input.addEventListener('input', function() {
                const value = this.value.toLowerCase();
                const items = dropdown.querySelectorAll('.autocomplete-item');
                
                items.forEach(item => {
                    const city = item.getAttribute('data-city').toLowerCase();
                    const code = item.getAttribute('data-code').toLowerCase();
                    
                    if (city.includes(value) || code.includes(value) || value === '') {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
            
            const items = dropdown.querySelectorAll('.autocomplete-item');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    const city = this.getAttribute('data-city');
                    const code = this.getAttribute('data-code');
                    input.value = `${city} (${code})`;
                    dropdown.classList.remove('active');
                });
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }
        
        setupAutocomplete(fromLocationInput, fromDropdown);
        setupAutocomplete(toLocationInput, toDropdown);

        // Date Picker (Simple implementation - can be enhanced with a library)
        const departDate = document.getElementById('departDate');
        const returnDate = document.getElementById('returnDate');
        const departDay = document.getElementById('departDay');
        const returnDay = document.getElementById('returnDay');
        
        function setupDateInput(input, dayLabel) {
            if (!input) return;
            
            input.addEventListener('click', function() {
                // In a real implementation, this would open a calendar picker
                const today = new Date();
                const formatted = today.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                });
                this.value = formatted;
                
                if (dayLabel) {
                    const dayName = today.toLocaleDateString('en-US', { weekday: 'short' });
                    dayLabel.textContent = dayName;
                }
            });
        }
        
        setupDateInput(departDate, departDay);
        setupDateInput(returnDate, returnDay);

        // Travelers & Class Dropdown
        const travelersTrigger = document.getElementById('travelersTrigger');
        const travelersDropdown = document.getElementById('travelersDropdown');
        const travelersDisplay = document.querySelector('.travelers-display');
        const travelersDoneBtn = document.getElementById('travelersDoneBtn');
        
        let adultsCount = 1;
        let childrenCount = 0;
        let infantsCount = 0;
        let selectedClass = 'economy';
        
        if (travelersTrigger) {
            travelersTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                travelersDropdown.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
        
        // Counter buttons
        const counterBtns = document.querySelectorAll('.counter-btn');
        counterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const target = this.getAttribute('data-target');
                const isPlus = this.classList.contains('plus');
                const counterValue = document.getElementById(`${target}Count`);
                
                let currentValue = parseInt(counterValue.textContent);
                
                if (isPlus) {
                    currentValue++;
                    // Animate
                    counterValue.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        counterValue.style.transform = 'scale(1)';
                    }, 200);
                } else if (currentValue > 0) {
                    if (target === 'adults' && currentValue === 1) return; // Minimum 1 adult
                    currentValue--;
                    counterValue.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        counterValue.style.transform = 'scale(1)';
                    }, 200);
                }
                
                counterValue.textContent = currentValue;
                
                // Update counts
                if (target === 'adults') adultsCount = currentValue;
                if (target === 'children') childrenCount = currentValue;
                if (target === 'infants') infantsCount = currentValue;
                
                updateTravelersDisplay();
            });
        });
        
        // Class buttons
        const classBtns = document.querySelectorAll('.class-btn');
        classBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                classBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedClass = this.getAttribute('data-class');
                updateTravelersDisplay();
            });
        });
        
        function updateTravelersDisplay() {
            const totalTravelers = adultsCount + childrenCount + infantsCount;
            const travelerText = totalTravelers === 1 ? 'Adult' : `${adultsCount} Adult${adultsCount > 1 ? 's' : ''}${childrenCount > 0 ? `, ${childrenCount} Child${childrenCount > 1 ? 'ren' : ''}` : ''}${infantsCount > 0 ? `, ${infantsCount} Infant${infantsCount > 1 ? 's' : ''}` : ''}`;
            
            const classNames = {
                'economy': 'Economy',
                'premium': 'Premium Economy',
                'business': 'Business',
                'first': 'First Class'
            };
            
            if (travelersDisplay) {
                travelersDisplay.textContent = `${travelerText}, ${classNames[selectedClass]}`;
            }
        }
        
        if (travelersDoneBtn) {
            travelersDoneBtn.addEventListener('click', function() {
                travelersDropdown.classList.remove('active');
                travelersTrigger.classList.remove('active');
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (travelersDropdown && !travelersDropdown.contains(e.target) && !travelersTrigger.contains(e.target)) {
                travelersDropdown.classList.remove('active');
                travelersTrigger.classList.remove('active');
            }
        });

        // Advanced Search Toggle
        const advancedToggle = document.getElementById('advancedToggle');
        const advancedOptions = document.getElementById('advancedOptions');
        
        if (advancedToggle) {
            advancedToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                advancedOptions.classList.toggle('active');
            });
        }
        
        // Close advanced options when clicking outside
        document.addEventListener('click', function(e) {
            if (advancedOptions && !advancedOptions.contains(e.target) && !advancedToggle.contains(e.target)) {
                advancedOptions.classList.remove('active');
                advancedToggle.classList.remove('active');
            }
        });

        // Search Button with Loading State
        const searchForm = document.getElementById('flightSearchForm');
        const searchBtn = document.getElementById('searchFlightsBtn');
        
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Add loading state
                searchBtn.classList.add('loading');
                
                // Simulate search (in real app, this would make an API call)
                setTimeout(() => {
                    searchBtn.classList.remove('loading');
                    
                    // Get form values
                    const from = fromInput.value;
                    const to = toInput.value;
                    const depart = departDate.value;
                    const returnVal = returnDate.value;
                    
                    console.log('Searching flights:', {
                        from,
                        to,
                        departDate: depart,
                        returnDate: returnVal,
                        adults: adultsCount,
                        children: childrenCount,
                        infants: infantsCount,
                        class: selectedClass
                    });
                    
                    // Redirect to booking page or show results
                    // window.location.href = 'booking.html';
                    alert('Flight search submitted! In a real app, this would show flight results.');
                }, 2000);
            });
        }

        // Popular Destinations Quick Select
        const destinationPills = document.querySelectorAll('.destination-pill');
        destinationPills.forEach(pill => {
            pill.addEventListener('click', function() {
                const destination = this.getAttribute('data-destination');
                const code = this.getAttribute('data-code');
                
                if (toInput) {
                    toInput.value = `${destination} (${code})`;
                    toInput.focus();
                    
                    // Add pulse animation
                    toInput.style.animation = 'pulse 0.5s ease';
                    setTimeout(() => {
                        toInput.style.animation = '';
                    }, 500);
                }
            });
        });
    }
    
    // Initialize Flight Booking Hero if present
    if (document.querySelector('.flight-booking-hero')) {
        initFlightBookingHero();
        console.log('✈️ Flight Booking Hero: Initialized with conversion-focused features!');
    }

    console.log('✈️ Destinova: All sections initialized with smooth scrolling, modern hero, advanced search features, masonry gallery, deals carousel, and Bento Box social proof!');
    }
}
});