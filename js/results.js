document.addEventListener('DOMContentLoaded', function () {
    // Mock flight data
    const mockFlights = [
        {
            id: 1,
            airline: 'IndiGo',
            logo: 'IG',
            flightNumber: '6E 101',
            departure: { time: '08:00', date: '2025-01-15', city: 'Delhi', code: 'DEL' },
            arrival: { time: '10:15', date: '2025-01-15', city: 'Mumbai', code: 'BOM' },
            duration: '2h 15m',
            stops: 0,
            price: 4500,
            currency: 'INR',
            class: 'Economy'
        },
        {
            id: 2,
            airline: 'Air India',
            logo: 'AI',
            flightNumber: 'AI 301',
            departure: { time: '14:30', date: '2025-01-15', city: 'Delhi', code: 'DEL' },
            arrival: { time: '16:45', date: '2025-01-15', city: 'Mumbai', code: 'BOM' },
            duration: '2h 15m',
            stops: 0,
            price: 5200,
            currency: 'INR',
            class: 'Economy'
        },
        {
            id: 3,
            airline: 'SpiceJet',
            logo: 'SG',
            flightNumber: 'SG 401',
            departure: { time: '18:00', date: '2025-01-15', city: 'Delhi', code: 'DEL' },
            arrival: { time: '20:15', date: '2025-01-15', city: 'Mumbai', code: 'BOM' },
            duration: '2h 15m',
            stops: 0,
            price: 3800,
            currency: 'INR',
            class: 'Economy'
        },
        {
            id: 4,
            airline: 'Vistara',
            logo: 'UK',
            flightNumber: 'UK 501',
            departure: { time: '10:00', date: '2025-01-15', city: 'Delhi', code: 'DEL' },
            arrival: { time: '12:30', date: '2025-01-15', city: 'Mumbai', code: 'BOM' },
            duration: '2h 30m',
            stops: 0,
            price: 6800,
            currency: 'INR',
            class: 'Business'
        },
        {
            id: 5,
            airline: 'IndiGo',
            logo: 'IG',
            flightNumber: '6E 201',
            departure: { time: '06:00', date: '2025-01-15', city: 'Delhi', code: 'DEL' },
            arrival: { time: '08:30', date: '2025-01-15', city: 'Mumbai', code: 'BOM' },
            duration: '2h 30m',
            stops: 1,
            price: 3200,
            currency: 'INR',
            class: 'Economy'
        }
    ];

    let currentFlights = [...mockFlights];
    let currentView = 'list';

    // Initialize
    function init() {
        loadSearchSummary();
        renderFlights();
        setupEventListeners();
        generateCalendar();
    }

    // Load search summary from URL params or localStorage
    function loadSearchSummary() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchData = JSON.parse(localStorage.getItem('lastSearch') || '{}');

        document.getElementById('search-route').textContent =
            `${urlParams.get('from') || searchData.from || 'Delhi'} → ${urlParams.get('to') || searchData.to || 'Mumbai'}`;
        document.getElementById('search-dates').textContent =
            `Departure: ${urlParams.get('departure') || searchData.departure || '2025-01-15'}`;
        document.getElementById('search-passengers').textContent =
            `${urlParams.get('adults') || searchData.adults || 1} Adult${(urlParams.get('adults') || searchData.adults || 1) > 1 ? 's' : ''}, ${urlParams.get('class') || searchData.flightClass || 'Economy'}`;
    }

    // Render flights
    function renderFlights() {
        const flightsList = document.getElementById('flights-list');
        flightsList.innerHTML = '';

        if (currentFlights.length === 0) {
            flightsList.innerHTML = '<div class="no-flights">No flights found matching your criteria.</div>';
            return;
        }

        currentFlights.forEach(flight => {
            const flightCard = createFlightCard(flight);
            flightsList.appendChild(flightCard);
        });

        document.getElementById('results-count').textContent = currentFlights.length;
    }

    // Create flight card
    function createFlightCard(flight) {
        const card = document.createElement('div');
        card.className = 'flight-card';
        card.innerHTML = `
            <div class="flight-header">
                <div class="airline-info">
                    <div class="airline-logo">${flight.logo}</div>
                    <div>
                        <div class="airline-name">${flight.airline}</div>
                        <div class="flight-number">${flight.flightNumber}</div>
                    </div>
                </div>
                <div class="flight-price">
                    <div class="price-amount">₹${flight.price.toLocaleString()}</div>
                    <div class="price-currency">${flight.currency}</div>
                </div>
            </div>
            <div class="flight-times">
                <div class="time-info">
                    <div class="departure-time">${flight.departure.time}</div>
                    <div class="date-info">${flight.departure.city} (${flight.departure.code})</div>
                </div>
                <div class="flight-route">
                    <div class="route-line"></div>
                    <div class="flight-duration">${flight.duration}</div>
                    <div class="route-line"></div>
                </div>
                <div class="time-info">
                    <div class="arrival-time">${flight.arrival.time}</div>
                    <div class="date-info">${flight.arrival.city} (${flight.arrival.code})</div>
                </div>
            </div>
            <div class="flight-details">
                <div class="flight-info">
                    ${flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`} • ${flight.class}
                </div>
                <button class="select-flight-btn" data-flight-id="${flight.id}">Select Flight</button>
            </div>
        `;

        card.querySelector('.select-flight-btn').addEventListener('click', () => {
            selectFlight(flight);
        });

        return card;
    }

    // Select flight
    function selectFlight(flight) {
        alert(`Flight ${flight.flightNumber} selected! Proceeding to booking...`);
        // In real app, redirect to booking page with flight details
    }

    // Setup event listeners
    function setupEventListeners() {
        // Sorting
        document.getElementById('sort-select').addEventListener('change', (e) => {
            sortFlights(e.target.value);
        });

        // View switching
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                switchView(btn.dataset.view);
            });
        });

        // Filters
        document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });

        document.getElementById('price-range').addEventListener('input', (e) => {
            document.getElementById('price-value').textContent = parseInt(e.target.value).toLocaleString();
            applyFilters();
        });

        // Clear filters
        document.querySelector('.clear-filters-btn').addEventListener('click', clearFilters);

        // Price alert modal
        document.querySelectorAll('.select-flight-btn').forEach(btn => {
            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                showPriceAlertModal();
            });
        });

        document.querySelector('.close-modal-btn').addEventListener('click', () => {
            document.getElementById('price-alert-modal').style.display = 'none';
        });

        document.getElementById('price-alert-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            const price = e.target.querySelector('input[type="number"]').value;

            // Save alert to localStorage
            const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
            alerts.push({ email, price, route: document.getElementById('search-route').textContent, date: new Date().toISOString() });
            localStorage.setItem('priceAlerts', JSON.stringify(alerts));

            alert('Price alert set! You will be notified when prices drop.');
            document.getElementById('price-alert-modal').style.display = 'none';
        });

        // Modify search
        document.querySelector('.modify-search-btn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Sort flights
    function sortFlights(criteria) {
        switch (criteria) {
            case 'price-low':
                currentFlights.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                currentFlights.sort((a, b) => b.price - a.price);
                break;
            case 'duration':
                currentFlights.sort((a, b) => {
                    const aDuration = parseDuration(a.duration);
                    const bDuration = parseDuration(b.duration);
                    return aDuration - bDuration;
                });
                break;
            case 'departure':
                currentFlights.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
                break;
            case 'arrival':
                currentFlights.sort((a, b) => a.arrival.time.localeCompare(b.arrival.time));
                break;
        }
        renderFlights();
    }

    // Parse duration string to minutes
    function parseDuration(duration) {
        const match = duration.match(/(\d+)h\s*(\d+)m/);
        if (match) {
            return parseInt(match[1]) * 60 + parseInt(match[2]);
        }
        return 0;
    }

    // Switch view
    function switchView(view) {
        currentView = view;
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        document.getElementById('flights-list').style.display = view === 'list' ? 'flex' : 'none';
        document.getElementById('fare-calendar-view').style.display = view === 'calendar' ? 'block' : 'none';
    }

    // Apply filters
    function applyFilters() {
        const nonstop = document.getElementById('nonstop').checked;
        const onestop = document.getElementById('onestop').checked;
        const twostops = document.getElementById('twostops').checked;
        const airindia = document.getElementById('airindia').checked;
        const indigo = document.getElementById('indigo').checked;
        const spicejet = document.getElementById('spicejet').checked;
        const vistara = document.getElementById('vistara').checked;
        const morning = document.getElementById('morning').checked;
        const afternoon = document.getElementById('afternoon').checked;
        const evening = document.getElementById('evening').checked;
        const night = document.getElementById('night').checked;
        const maxPrice = parseInt(document.getElementById('price-range').value);

        currentFlights = mockFlights.filter(flight => {
            // Stops filter
            if (!nonstop && flight.stops === 0) return false;
            if (!onestop && flight.stops === 1) return false;
            if (!twostops && flight.stops >= 2) return false;

            // Airlines filter
            if (airindia && flight.airline !== 'Air India') return false;
            if (indigo && flight.airline !== 'IndiGo') return false;
            if (spicejet && flight.airline !== 'SpiceJet') return false;
            if (vistara && flight.airline !== 'Vistara') return false;

            // Time filter
            const hour = parseInt(flight.departure.time.split(':')[0]);
            if (morning && !(hour >= 6 && hour < 12)) return false;
            if (afternoon && !(hour >= 12 && hour < 18)) return false;
            if (evening && !(hour >= 18 && hour < 24)) return false;
            if (night && !(hour >= 0 && hour < 6)) return false;

            // Price filter
            if (flight.price > maxPrice) return false;

            return true;
        });

        renderFlights();
    }

    // Clear filters
    function clearFilters() {
        document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        document.getElementById('price-range').value = 50000;
        document.getElementById('price-value').textContent = '50,000';
        currentFlights = [...mockFlights];
        renderFlights();
    }

    // Generate fare calendar
    function generateCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        calendarGrid.innerHTML = '';

        // Mock calendar data for next 30 days
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `
                <div class="day-number">${date.getDate()}</div>
                <div class="day-price">₹${(3000 + Math.random() * 4000).toFixed(0)}</div>
            `;

            // Mark some days as cheapest
            if (i === 5 || i === 12 || i === 18) {
                dayElement.classList.add('cheapest');
            }

            dayElement.addEventListener('click', () => {
                // In real app, update search date and refresh results
                alert(`Selected date: ${date.toDateString()}`);
            });

            calendarGrid.appendChild(dayElement);
        }
    }

    // Show price alert modal
    function showPriceAlertModal() {
        document.getElementById('price-alert-modal').style.display = 'flex';
    }

    // Initialize on page load
    init();
});