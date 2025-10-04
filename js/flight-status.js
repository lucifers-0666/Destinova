document.addEventListener('DOMContentLoaded', function () {

    // --- SHARED HEADER/FOOTER LOGIC (from index.js) ---

    // --- MANAGE MENU VISIBILITY ---
    function handleManageMenuVisibility() {
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

    // --- ACTIVE PAGE INDICATOR IN NAVBAR ---
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.header-desktop-nav a, .header-mobile-nav a');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('nav-active');
                const dropdownParent = link.closest('.header-dropdown');
                if (dropdownParent) {
                    const parentLink = dropdownParent.querySelector(':scope > a');
                    if (parentLink) parentLink.classList.add('nav-active');
                }
            }
        });
    }

    // --- HEADER SCROLL & MOBILE MENU ---
    function initializeHeader() {
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
                link.parentElement.classList.toggle('header-open');
            });
        });
    }

    // --- FOOTER SCROLL-IN ANIMATION ---
    function initializeFooter() {
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
    }

    // Initialize shared components
    handleManageMenuVisibility();
    setActiveNavLink();
    initializeHeader();
    initializeFooter();
    AOS.init();

    // --- FLIGHT STATUS PAGE SPECIFIC LOGIC ---

    const searchForm = document.getElementById('status-search-form');
    const flightNumberInput = document.getElementById('flight-number');
    const flightDateInput = document.getElementById('flight-date');
    const resultsContainer = document.getElementById('flight-results');
    const errorDiv = document.getElementById('form-error');
    const recentSearchesList = document.getElementById('recent-searches-list');

    // Set date picker to today by default
    flightDateInput.value = new Date().toISOString().split('T')[0];

    // Mock API response
    const mockApiData = {
        'AI202': {
            airline: { name: 'Air India', logo: 'https://logolook.net/wp-content/uploads/2021/11/Air-India-Logo.png' },
            flightNumber: 'AI202',
            route: { from: 'Delhi (DEL)', to: 'Mumbai (BOM)' },
            status: 'On Time',
            departure: { scheduled: '2024-05-21T08:00:00Z', actual: '2024-05-21T08:05:00Z', terminal: 'T3', gate: '41B' },
            arrival: { scheduled: '2024-05-21T10:15:00Z', estimated: '2024-05-21T10:20:00Z', terminal: 'T2', baggage: '05' },
            aircraft: { type: 'Airbus A321', registration: 'VT-PPN' },
            delay: { duration: null, reason: null }
        },
        '6E101': {
            airline: { name: 'IndiGo', logo: 'https://logolook.net/wp-content/uploads/2022/02/IndiGo-Logo.png' },
            flightNumber: '6E 101',
            route: { from: 'Bangalore (BLR)', to: 'Delhi (DEL)' },
            status: 'Delayed',
            departure: { scheduled: '2024-05-21T14:00:00Z', actual: '2024-05-21T14:45:00Z', terminal: 'T1', gate: '22' },
            arrival: { scheduled: '2024-05-21T16:45:00Z', estimated: '2024-05-21T17:30:00Z', terminal: 'T3', baggage: '08' },
            aircraft: { type: 'Airbus A320neo', registration: 'VT-IZI' },
            delay: { duration: '45 minutes', reason: 'Air Traffic Congestion' }
        }
    };

    function searchFlightStatus(e) {
        e.preventDefault();
        const flightNumber = flightNumberInput.value.trim().toUpperCase();
        const flightDate = flightDateInput.value;

        // Validation
        if (!/^[A-Z0-9]{2}[0-9]{3,4}$/.test(flightNumber)) {
            showError('Please enter a valid flight number (e.g., AI202).');
            return;
        }
        showError(''); // Clear error

        showLoadingSkeleton();

        // Mock API call
        setTimeout(() => {
            const flightData = mockApiData[flightNumber];
            if (flightData) {
                displayFlightResults(flightData);
                saveToRecentSearches(flightNumber);
            } else {
                showError(`Flight ${flightNumber} not found for the selected date.`);
                resultsContainer.style.display = 'none';
            }
        }, 1500); // Simulate network delay
    }

    function displayFlightResults(data) {
        resultsContainer.style.display = 'block';
        document.getElementById('result-airline-logo').src = data.airline.logo;
        document.getElementById('result-flight-number').textContent = data.flightNumber;
        document.getElementById('result-departure-city').textContent = data.route.from;
        document.getElementById('result-arrival-city').textContent = data.route.to;

        const statusBadge = document.getElementById('result-flight-status');
        statusBadge.textContent = data.status;
        statusBadge.className = 'flight-status-badge ' + getStatusClass(data.status);

        document.getElementById('result-scheduled-departure').textContent = formatTime(data.departure.scheduled);
        document.getElementById('result-actual-departure').textContent = formatTime(data.departure.actual);
        document.getElementById('result-departure-gate').textContent = `${data.departure.terminal} / ${data.departure.gate}`;

        document.getElementById('result-scheduled-arrival').textContent = formatTime(data.arrival.scheduled);
        document.getElementById('result-estimated-arrival').textContent = formatTime(data.arrival.estimated);
        document.getElementById('result-arrival-gate').textContent = `${data.arrival.terminal} / ${data.arrival.baggage}`;

        document.getElementById('result-aircraft').textContent = `${data.aircraft.type} (${data.aircraft.registration})`;

        const delayInfo = document.getElementById('delay-info');
        if (data.delay.duration) {
            document.getElementById('result-delay-duration').textContent = data.delay.duration;
            document.getElementById('result-delay-reason').textContent = data.delay.reason;
            delayInfo.style.display = 'block';
        } else {
            delayInfo.style.display = 'none';
        }

        calculateFlightProgress(data);
    }

    function calculateFlightProgress(data) {
        // This is a simplified mock calculation
        const departureProgress = document.querySelector('.progress-point.departure');
        const inAirProgress = document.querySelector('.progress-point.in-air');
        const arrivalProgress = document.querySelector('.progress-point.arrival');
        const lineFill = document.querySelector('.progress-line-fill');

        // Reset
        [departureProgress, inAirProgress, arrivalProgress].forEach(p => p.classList.remove('active', 'done'));
        lineFill.style.width = '0%';

        if (data.status === 'On Time' || data.status === 'Delayed') {
            departureProgress.classList.add('done');
            inAirProgress.classList.add('active');
            lineFill.style.width = '50%'; // Mock progress
        }
        // Add more logic for 'Landed', etc.
    }

    function formatTime(isoString) {
        if (!isoString) return '--';
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    function getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'on time': return 'on-time';
            case 'delayed': return 'delayed';
            case 'cancelled': return 'cancelled';
            case 'boarding': return 'boarding';
            default: return '';
        }
    }

    function saveToRecentSearches(flightNumber) {
        let searches = JSON.parse(localStorage.getItem('flightStatusSearches') || '[]');
        // Remove if already exists to move it to the front
        searches = searches.filter(s => s !== flightNumber);
        searches.unshift(flightNumber);
        // Keep only the last 5
        if (searches.length > 5) {
            searches.pop();
        }
        localStorage.setItem('flightStatusSearches', JSON.stringify(searches));
        loadRecentSearches();
    }

    function loadRecentSearches() {
        const searches = JSON.parse(localStorage.getItem('flightStatusSearches') || '[]');
        recentSearchesList.innerHTML = '';
        searches.forEach(flightNumber => {
            const pill = document.createElement('button');
            pill.className = 'recent-pill';
            pill.textContent = flightNumber;
            pill.onclick = () => quickSearch(flightNumber);
            recentSearchesList.appendChild(pill);
        });
    }

    function quickSearch(flightNumber) {
        flightNumberInput.value = flightNumber;
        searchForm.requestSubmit();
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = message ? 'block' : 'none';
    }

    function showLoadingSkeleton() {
        // In a real app, you would replace the results content with a skeleton loader
        resultsContainer.style.display = 'block';
        resultsContainer.classList.add('skeleton');
        setTimeout(() => resultsContainer.classList.remove('skeleton'), 1500);
    }

    // Event Listeners
    searchForm.addEventListener('submit', searchFlightStatus);

    // Initial Load
    loadRecentSearches();
});