/**
 * 🛫 DESTINOVA FLIGHT RESULTS
 * Flight search results display with filtering, sorting, and selection
 */

'use strict';

// ============================================
// STATE MANAGEMENT
// ============================================

const FlightResultsState = {
    searchParams: {},
    allFlights: [],
    filteredFlights: [],
    sortBy: 'price',
    filters: {
        stops: [0, 1],
        maxPrice: 50000,
        departureTimes: ['morning', 'afternoon', 'evening'],
        airlines: []
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🛫 Flight Results Page Initialized');
    
    // Parse URL parameters
    parseSearchParams();
    
    // Update search summary UI
    updateSearchSummary();
    
    // Load flights
    loadFlights();
});

/**
 * Parse search parameters from URL
 */
function parseSearchParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    FlightResultsState.searchParams = {
        from: urlParams.get('from') || '',
        to: urlParams.get('to') || '',
        date: urlParams.get('date') || new Date().toISOString().split('T')[0],
        returnDate: urlParams.get('returnDate') || '',
        passengers: parseInt(urlParams.get('passengers')) || 1,
        class: urlParams.get('class') || 'economy'
    };

    console.log('Search params:', FlightResultsState.searchParams);
}

/**
 * Update the search summary bar with current search parameters
 */
function updateSearchSummary() {
    const { from, to, date, passengers, class: cabinClass } = FlightResultsState.searchParams;
    
    // Update route display
    document.getElementById('from-code').textContent = from || 'DEL';
    document.getElementById('to-code').textContent = to || 'BOM';
    
    // Update date
    if (date) {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        document.getElementById('travel-date').textContent = formattedDate;
    }
    
    // Update passengers
    document.getElementById('passenger-count').textContent = 
        `${passengers} ${passengers === 1 ? 'Adult' : 'Adults'}`;
    
    // Update cabin class
    const classLabels = {
        'economy': 'Economy',
        'premium': 'Premium Economy',
        'business': 'Business',
        'first': 'First Class'
    };
    document.getElementById('cabin-class').textContent = classLabels[cabinClass] || 'Economy';
}

// ============================================
// API INTEGRATION
// ============================================

/**
 * Load flights from API or cached results
 */
async function loadFlights() {
    showLoading(true);
    
    try {
        let flights = [];
        
        // Check for cached results first
        const cachedResults = localStorage.getItem('flightSearchResults');
        if (cachedResults) {
            const parsed = JSON.parse(cachedResults);
            flights = parsed.data?.flights || parsed.flights || parsed.data || parsed;
            localStorage.removeItem('flightSearchResults'); // Clear after use
        }
        
        // If no cached results, fetch from API
        if (!flights.length && typeof FlightAPI !== 'undefined') {
            const response = await FlightAPI.searchFlights({
                origin: FlightResultsState.searchParams.from,
                destination: FlightResultsState.searchParams.to,
                date: FlightResultsState.searchParams.date,
                passengers: FlightResultsState.searchParams.passengers,
                class: FlightResultsState.searchParams.class
            });
            
            if (response.success && response.data) {
                flights = response.data.flights || response.data;
            }
        }
        
        // If still no flights, use mock data for demo
        if (!flights.length) {
            flights = generateMockFlights();
        }
        
        FlightResultsState.allFlights = flights;
        FlightResultsState.filteredFlights = [...flights];
        
        // Extract unique airlines for filter
        populateAirlineFilters();
        
        // Apply initial sorting
        sortFlights(FlightResultsState.sortBy);
        
    } catch (error) {
        console.error('Error loading flights:', error);
        showError('Failed to load flights. Please try again.');
    } finally {
        showLoading(false);
    }
}

/**
 * Generate mock flights for demo/fallback
 */
function generateMockFlights() {
    const { from, to, date } = FlightResultsState.searchParams;
    
    const airlines = [
        { code: 'AI', name: 'Air India', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Air_India_Logo.svg/200px-Air_India_Logo.svg.png' },
        { code: '6E', name: 'IndiGo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/IndiGo_Airlines_logo.svg/200px-IndiGo_Airlines_logo.svg.png' },
        { code: 'UK', name: 'Vistara', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Vistara_Logo.svg/200px-Vistara_Logo.svg.png' },
        { code: 'SG', name: 'SpiceJet', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/SpiceJet_logo.svg/200px-SpiceJet_logo.svg.png' },
        { code: 'G8', name: 'GoAir', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/GoAir_logo.svg/200px-GoAir_logo.svg.png' }
    ];

    const mockFlights = [];
    const baseDate = new Date(date);

    for (let i = 0; i < 12; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const departureHour = 6 + Math.floor(Math.random() * 16); // 6AM to 10PM
        const departureMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
        const durationMinutes = 90 + Math.floor(Math.random() * 180); // 1.5 to 4.5 hours
        const stops = Math.random() > 0.6 ? 0 : Math.random() > 0.5 ? 1 : 2;
        const basePrice = 3500 + Math.floor(Math.random() * 12000);
        
        const departureTime = new Date(baseDate);
        departureTime.setHours(departureHour, departureMinute, 0, 0);
        
        const arrivalTime = new Date(departureTime);
        arrivalTime.setMinutes(arrivalTime.getMinutes() + durationMinutes + (stops * 45));

        mockFlights.push({
            _id: `flight_${i}_${Date.now()}`,
            flightNumber: `${airline.code}${100 + Math.floor(Math.random() * 900)}`,
            airline: airline.name,
            airlineCode: airline.code,
            airlineLogo: airline.logo,
            origin: {
                code: from || 'DEL',
                city: 'New Delhi',
                airport: 'Indira Gandhi International'
            },
            destination: {
                code: to || 'BOM',
                city: 'Mumbai',
                airport: 'Chhatrapati Shivaji Maharaj International'
            },
            departureTime: departureTime.toISOString(),
            arrivalTime: arrivalTime.toISOString(),
            duration: durationMinutes + (stops * 45),
            stops: stops,
            stopDetails: stops > 0 ? [{ code: 'HYD', city: 'Hyderabad' }] : [],
            price: {
                economy: basePrice,
                business: basePrice * 2.5,
                first: basePrice * 4
            },
            currentPrice: basePrice,
            originalPrice: basePrice + Math.floor(Math.random() * 2000),
            availableSeats: 3 + Math.floor(Math.random() * 20),
            amenities: {
                wifi: Math.random() > 0.5,
                meals: Math.random() > 0.3,
                entertainment: Math.random() > 0.5,
                usb: true,
                legroom: Math.random() > 0.5 ? 'extra' : 'standard'
            },
            dynamicPricing: Math.random() > 0.7,
            aircraft: ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A380'][Math.floor(Math.random() * 4)]
        });
    }

    // Sort by price initially
    return mockFlights.sort((a, b) => a.currentPrice - b.currentPrice);
}

// ============================================
// RENDERING
// ============================================

/**
 * Render flight cards
 */
function renderFlights() {
    const container = document.getElementById('flights-list');
    const flights = FlightResultsState.filteredFlights;
    
    // Update results count
    document.getElementById('results-count').textContent = flights.length;
    
    if (flights.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-plane-slash"></i>
                <h3>No flights found</h3>
                <p>Try adjusting your filters or search for different dates</p>
                <button class="select-btn" onclick="clearAllFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = flights.map(flight => createFlightCard(flight)).join('');
}

/**
 * Create a flight card HTML
 */
function createFlightCard(flight) {
    const departureTime = new Date(flight.departureTime);
    const arrivalTime = new Date(flight.arrivalTime);
    const { passengers, class: cabinClass } = FlightResultsState.searchParams;
    
    const price = flight.price?.[cabinClass] || flight.currentPrice;
    const totalPrice = price * passengers;
    
    const formatTime = (date) => date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };
    
    const stopsText = flight.stops === 0 ? 'Non-stop' : 
                      flight.stops === 1 ? '1 Stop' : 
                      `${flight.stops} Stops`;
    
    const dynamicBadge = flight.dynamicPricing ? 
        `<div class="dynamic-badge"><i class="fas fa-bolt"></i> Price Drop</div>` : '';
    
    const amenitiesHtml = `
        ${flight.amenities?.wifi ? '<span class="amenity"><i class="fas fa-wifi"></i> WiFi</span>' : ''}
        ${flight.amenities?.meals ? '<span class="amenity"><i class="fas fa-utensils"></i> Meals</span>' : ''}
        ${flight.amenities?.entertainment ? '<span class="amenity"><i class="fas fa-tv"></i> Entertainment</span>' : ''}
        ${flight.amenities?.usb ? '<span class="amenity"><i class="fas fa-usb"></i> USB</span>' : ''}
    `;
    
    return `
        <div class="flight-card" data-flight-id="${flight._id}">
            ${dynamicBadge}
            <div class="flight-card-main">
                <div class="flight-info">
                    <div class="airline-info">
                        <img src="${flight.airlineLogo || 'https://via.placeholder.com/48'}" 
                             alt="${flight.airline}" class="airline-logo"
                             onerror="this.src='https://via.placeholder.com/48?text=${flight.airlineCode}'">
                        <span class="airline-name">${flight.airline}</span>
                        <span class="flight-number">${flight.flightNumber}</span>
                    </div>
                    
                    <div class="flight-times">
                        <div class="time-block">
                            <div class="time">${formatTime(departureTime)}</div>
                            <div class="airport-code">${flight.origin?.code || 'DEL'}</div>
                        </div>
                        
                        <div class="flight-duration">
                            <div class="duration-text">${formatDuration(flight.duration)}</div>
                            <div class="duration-line"></div>
                            <div class="stops-text ${flight.stops === 0 ? 'non-stop' : ''}">${stopsText}</div>
                        </div>
                        
                        <div class="time-block">
                            <div class="time">${formatTime(arrivalTime)}</div>
                            <div class="airport-code">${flight.destination?.code || 'BOM'}</div>
                        </div>
                    </div>
                </div>
                
                <div class="price-section">
                    <div class="price-display">
                        ${flight.originalPrice > flight.currentPrice ? 
                            `<div class="price-original">₹${flight.originalPrice.toLocaleString()}</div>` : ''}
                        <div class="price-current">₹${totalPrice.toLocaleString()}</div>
                        <div class="price-per-person">${passengers > 1 ? `₹${price.toLocaleString()}/person` : 'per person'}</div>
                    </div>
                    ${flight.availableSeats <= 5 ? 
                        `<div class="seats-left"><i class="fas fa-fire"></i> Only ${flight.availableSeats} seats left!</div>` : ''}
                    <button class="select-btn" onclick="selectFlight('${flight._id}')">
                        Select <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
            
            <div class="flight-card-footer">
                <div class="amenities">
                    ${amenitiesHtml}
                </div>
                <span class="view-details" onclick="showFlightDetails('${flight._id}')">
                    View Details <i class="fas fa-chevron-down"></i>
                </span>
            </div>
        </div>
    `;
}

// ============================================
// FILTERING
// ============================================

/**
 * Populate airline filter checkboxes
 */
function populateAirlineFilters() {
    const airlines = [...new Set(FlightResultsState.allFlights.map(f => f.airline))];
    const container = document.getElementById('airline-filters');
    
    FlightResultsState.filters.airlines = airlines; // Select all by default
    
    container.innerHTML = airlines.map(airline => `
        <label class="filter-checkbox">
            <input type="checkbox" name="airline" value="${airline}" checked onchange="applyFilters()">
            <span>${airline}</span>
        </label>
    `).join('');
}

/**
 * Apply all active filters
 */
function applyFilters() {
    const { allFlights, filters } = FlightResultsState;
    
    // Get selected stops
    const selectedStops = Array.from(document.querySelectorAll('input[name="stops"]:checked'))
        .map(el => parseInt(el.value));
    
    // Get selected departure times
    const selectedDepartures = Array.from(document.querySelectorAll('input[name="departure"]:checked'))
        .map(el => el.value);
    
    // Get selected airlines
    const selectedAirlines = Array.from(document.querySelectorAll('input[name="airline"]:checked'))
        .map(el => el.value);
    
    // Get max price
    const maxPrice = parseInt(document.getElementById('price-range').value);
    
    // Apply filters
    FlightResultsState.filteredFlights = allFlights.filter(flight => {
        // Stops filter
        const matchesStops = selectedStops.length === 0 || 
            selectedStops.includes(flight.stops) ||
            (selectedStops.includes(2) && flight.stops >= 2);
        
        // Price filter
        const matchesPrice = flight.currentPrice <= maxPrice;
        
        // Departure time filter
        const departureHour = new Date(flight.departureTime).getHours();
        let departureSlot = '';
        if (departureHour >= 6 && departureHour < 12) departureSlot = 'morning';
        else if (departureHour >= 12 && departureHour < 18) departureSlot = 'afternoon';
        else if (departureHour >= 18 && departureHour < 24) departureSlot = 'evening';
        else departureSlot = 'night';
        
        const matchesDeparture = selectedDepartures.length === 0 || 
            selectedDepartures.includes(departureSlot);
        
        // Airlines filter
        const matchesAirline = selectedAirlines.length === 0 || 
            selectedAirlines.includes(flight.airline);
        
        return matchesStops && matchesPrice && matchesDeparture && matchesAirline;
    });
    
    // Re-apply current sorting
    sortFlights(FlightResultsState.sortBy, false);
}

/**
 * Update price filter display
 */
function updatePriceFilter(value) {
    document.getElementById('price-max-label').textContent = `₹${parseInt(value).toLocaleString()}`;
    applyFilters();
}

/**
 * Clear all filters
 */
function clearAllFilters() {
    // Reset checkboxes
    document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
        checkbox.checked = checkbox.name === 'airline' || 
                          ['0', '1', 'morning', 'afternoon', 'evening'].includes(checkbox.value);
    });
    
    // Reset price slider
    document.getElementById('price-range').value = 50000;
    document.getElementById('price-max-label').textContent = '₹50,000';
    
    // Reset filtered flights
    FlightResultsState.filteredFlights = [...FlightResultsState.allFlights];
    
    // Re-render
    sortFlights(FlightResultsState.sortBy, false);
}

// ============================================
// SORTING
// ============================================

/**
 * Sort flights by specified criteria
 */
function sortFlights(criteria, render = true) {
    FlightResultsState.sortBy = criteria;
    
    // Update sort button states
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === criteria);
    });
    
    // Sort flights
    FlightResultsState.filteredFlights.sort((a, b) => {
        switch (criteria) {
            case 'price':
                return a.currentPrice - b.currentPrice;
            case 'duration':
                return a.duration - b.duration;
            case 'departure':
                return new Date(a.departureTime) - new Date(b.departureTime);
            default:
                return 0;
        }
    });
    
    if (render) {
        renderFlights();
    } else {
        renderFlights();
    }
}

// ============================================
// FLIGHT SELECTION
// ============================================

/**
 * Select a flight and proceed to passenger details
 */
function selectFlight(flightId) {
    const flight = FlightResultsState.allFlights.find(f => f._id === flightId);
    
    if (!flight) {
        console.error('Flight not found:', flightId);
        return;
    }
    
    // Save selected flight to localStorage
    const bookingData = {
        flight,
        searchParams: FlightResultsState.searchParams,
        selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('destinova_selected_flight', JSON.stringify(bookingData));
    
    // Redirect to passenger details page
    window.location.href = `passenger-details.html?flightId=${flightId}`;
}

/**
 * Show flight details modal
 */
function showFlightDetails(flightId) {
    const flight = FlightResultsState.allFlights.find(f => f._id === flightId);
    
    if (!flight) return;
    
    // Create and show modal with flight details
    const modal = document.createElement('div');
    modal.className = 'flight-details-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            <h2>${flight.airline} ${flight.flightNumber}</h2>
            <div class="flight-route-details">
                <p><strong>From:</strong> ${flight.origin?.city || 'Origin'} (${flight.origin?.code || 'XXX'})</p>
                <p><strong>To:</strong> ${flight.destination?.city || 'Destination'} (${flight.destination?.code || 'XXX'})</p>
                <p><strong>Aircraft:</strong> ${flight.aircraft || 'Boeing 737'}</p>
                <p><strong>Duration:</strong> ${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m</p>
                ${flight.stops > 0 ? `<p><strong>Stops:</strong> ${flight.stopDetails?.map(s => s.city).join(', ') || 'N/A'}</p>` : ''}
            </div>
            <div class="amenities-list">
                <h3>Amenities</h3>
                <ul>
                    ${flight.amenities?.wifi ? '<li><i class="fas fa-wifi"></i> In-flight WiFi</li>' : ''}
                    ${flight.amenities?.meals ? '<li><i class="fas fa-utensils"></i> Complimentary Meals</li>' : ''}
                    ${flight.amenities?.entertainment ? '<li><i class="fas fa-tv"></i> Entertainment System</li>' : ''}
                    ${flight.amenities?.usb ? '<li><i class="fas fa-usb"></i> USB Charging</li>' : ''}
                    ${flight.amenities?.legroom === 'extra' ? '<li><i class="fas fa-chair"></i> Extra Legroom</li>' : ''}
                </ul>
            </div>
            <button class="select-btn" onclick="selectFlight('${flight._id}'); this.parentElement.parentElement.remove();">
                Select This Flight
            </button>
        </div>
    `;
    
    // Add modal styles if not already present
    if (!document.getElementById('modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .flight-details-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .flight-details-modal .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
            }
            .flight-details-modal .modal-content {
                position: relative;
                background: white;
                padding: 32px;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .flight-details-modal .modal-close {
                position: absolute;
                top: 16px;
                right: 16px;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            }
            .flight-details-modal h2 {
                margin-bottom: 20px;
                color: var(--primary, #1a5f4a);
            }
            .flight-details-modal h3 {
                margin: 20px 0 10px;
                font-size: 1rem;
            }
            .flight-details-modal .flight-route-details p {
                margin: 8px 0;
                color: #555;
            }
            .flight-details-modal .amenities-list ul {
                list-style: none;
                padding: 0;
            }
            .flight-details-modal .amenities-list li {
                padding: 8px 0;
                color: #555;
            }
            .flight-details-modal .amenities-list i {
                color: var(--primary, #1a5f4a);
                width: 24px;
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
}

// ============================================
// UI UTILITIES
// ============================================

/**
 * Show/hide loading overlay
 */
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

/**
 * Show error message
 */
function showError(message) {
    const container = document.getElementById('flights-list');
    container.innerHTML = `
        <div class="no-results">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Something went wrong</h3>
            <p>${message}</p>
            <button class="select-btn" onclick="loadFlights()">Try Again</button>
        </div>
    `;
}

// ============================================
// MOBILE FILTERS
// ============================================

function toggleMobileFilters() {
    const sidebar = document.getElementById('filters-sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Export for global use
window.selectFlight = selectFlight;
window.showFlightDetails = showFlightDetails;
window.sortFlights = sortFlights;
window.applyFilters = applyFilters;
window.updatePriceFilter = updatePriceFilter;
window.clearAllFilters = clearAllFilters;
window.toggleMobileFilters = toggleMobileFilters;
