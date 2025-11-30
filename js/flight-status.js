/* ═══════════════════════════════════════════════════════════════════
   DESTINOVA FLIGHT STATUS - COMPLETE JAVASCRIPT
   Real-time Tracking with Smooth Animations
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOCK FLIGHT DATA (In production, this comes from real-time API)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const MOCK_FLIGHTS = {
    'AI202': {
        flightNumber: 'AI202',
        airline: 'Air India',
        airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Air_India_Logo.svg/200px-Air_India_Logo.svg.png',
        departure: {
            city: 'Delhi',
            code: 'DEL',
            airport: 'Indira Gandhi International',
            scheduledTime: '08:00',
            actualTime: '08:15',
            terminal: '3',
            gate: '24A'
        },
        arrival: {
            city: 'Mumbai',
            code: 'BOM',
            airport: 'Chhatrapati Shivaji International',
            scheduledTime: '10:10',
            estimatedTime: '10:25',
            terminal: '2',
            baggage: 'Belt 5'
        },
        status: 'delayed',
        aircraft: 'Boeing 787-8 Dreamliner',
        delay: '15 minutes',
        delayReason: 'Air traffic congestion',
        progress: 35
    },
    '6E101': {
        flightNumber: '6E101',
        airline: 'IndiGo',
        airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/IndiGo_Airlines_logo.svg/200px-IndiGo_Airlines_logo.svg.png',
        departure: {
            city: 'Mumbai',
            code: 'BOM',
            airport: 'Chhatrapati Shivaji International',
            scheduledTime: '14:30',
            actualTime: '14:30',
            terminal: '1',
            gate: '12'
        },
        arrival: {
            city: 'Bangalore',
            code: 'BLR',
            airport: 'Kempegowda International',
            scheduledTime: '16:00',
            estimatedTime: '16:00',
            terminal: '1',
            baggage: 'Belt 3'
        },
        status: 'on-time',
        aircraft: 'Airbus A320neo',
        delay: null,
        delayReason: null,
        progress: 60
    },
    'UK955': {
        flightNumber: 'UK955',
        airline: 'Vistara',
        airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Vistara_Logo.svg/200px-Vistara_Logo.svg.png',
        departure: {
            city: 'Delhi',
            code: 'DEL',
            airport: 'Indira Gandhi International',
            scheduledTime: '06:00',
            actualTime: '06:00',
            terminal: '3',
            gate: '18'
        },
        arrival: {
            city: 'Goa',
            code: 'GOI',
            airport: 'Dabolim Airport',
            scheduledTime: '08:30',
            estimatedTime: '08:30',
            terminal: '1',
            baggage: 'Belt 1'
        },
        status: 'boarding',
        aircraft: 'Airbus A321neo',
        delay: null,
        delayReason: null,
        progress: 10
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STATE = {
    recentSearches: [],
    currentFlight: null
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', function() {
    console.log('✈️ Destinova Flight Status - Initialized');
    
    loadRecentSearches();
    setupEventListeners();
    setDefaultDate();
    checkURLParams();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SET DEFAULT DATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setDefaultDate() {
    const dateInput = document.getElementById('flight-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.min = today;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECK URL PARAMETERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const flightNumber = urlParams.get('flight');
    const date = urlParams.get('date');
    
    if (flightNumber && date) {
        document.getElementById('flight-number').value = flightNumber;
        document.getElementById('flight-date').value = date;
        searchFlight();
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT LISTENERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setupEventListeners() {
    // Search form submission
    const searchForm = document.getElementById('status-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            searchFlight();
        });
    }
    
    // Route tab switching
    document.querySelectorAll('.route-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            switchRouteTab(e.currentTarget.dataset.tab);
        });
    });
    
    // Route chip clicks
    document.querySelectorAll('.route-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            const route = e.currentTarget.dataset.route;
            showNotification(`Showing flights for ${route}`, 'info');
        });
    });
    
    // Recent search pills
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('recent-pill')) {
            const flightNumber = e.target.dataset.flight;
            const date = e.target.dataset.date;
            document.getElementById('flight-number').value = flightNumber;
            document.getElementById('flight-date').value = date;
            searchFlight();
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROUTE TAB SWITCHING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function switchRouteTab(tab) {
    // Update active tab button
    document.querySelectorAll('.route-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update active content pane
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`tab-${tab}`).classList.add('active');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEARCH FLIGHT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function searchFlight() {
    const flightNumber = document.getElementById('flight-number').value.trim().toUpperCase();
    const flightDate = document.getElementById('flight-date').value;
    const errorDiv = document.getElementById('form-error');
    
    // Validation
    if (!flightNumber || !flightDate) {
        showError('Please enter both flight number and date');
        return;
    }
    
    // Hide error
    errorDiv.classList.add('hidden');
    
    // Show loading
    const searchBtn = document.getElementById('status-search-btn');
    const originalHTML = searchBtn.innerHTML;
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    
    // Try API first, then fallback to mock data
    let flight = null;
    
    // Try new FlightsAPI first
    if (typeof FlightsAPI !== 'undefined') {
        try {
            const response = await FlightsAPI.getFlightStatus(flightNumber, flightDate);
            
            if (response.success && response.data) {
                flight = transformApiFlightStatus(response.data);
            }
        } catch (error) {
            console.log('FlightsAPI error:', error);
        }
    }
    
    // Fallback to legacy API
    if (!flight && typeof window.DestinovaAPI !== 'undefined') {
        try {
            // Use the search endpoint with flightNumber filter
            const response = await window.DestinovaAPI.Flight.search({ flightNumber: flightNumber });
            
            if (response.data && response.data.flights && response.data.flights.length > 0) {
                flight = transformApiFlightStatus(response.data.flights[0]);
            }
        } catch (error) {
            console.log('Legacy API unavailable or error:', error);
        }
    }
    
    // Fallback to mock data
    if (!flight) {
        flight = MOCK_FLIGHTS[flightNumber];
    }
    
    // Reset button
    searchBtn.disabled = false;
    searchBtn.innerHTML = originalHTML;
    
    if (flight) {
        displayFlightResults(flight, flightDate);
        saveToRecentSearches(flightNumber, flightDate);
        showNotification('Flight status found!', 'success');
    } else {
        showError(`Flight ${flightNumber} not found. Try AI202, 6E101, or UK955`);
    }
}

// Transform API flight data to display format
function transformApiFlightStatus(apiFlight) {
    const origin = apiFlight.origin || {};
    const destination = apiFlight.destination || {};
    const departureTime = apiFlight.departureTime ? new Date(apiFlight.departureTime) : new Date();
    const arrivalTime = apiFlight.arrivalTime ? new Date(apiFlight.arrivalTime) : new Date();
    
    return {
        flightNumber: apiFlight.flightNumber,
        airline: apiFlight.airline,
        airlineLogo: apiFlight.airlineLogo || 'https://via.placeholder.com/200x50?text=' + (apiFlight.airline || 'Airline'),
        departure: {
            city: origin.city || origin.name || (typeof apiFlight.origin === 'string' ? apiFlight.origin : 'Origin'),
            code: origin.code || (typeof apiFlight.origin === 'string' ? apiFlight.origin.substring(0, 3).toUpperCase() : 'XXX'),
            airport: origin.airport || (origin.city || 'Origin') + ' International',
            scheduledTime: departureTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            actualTime: (apiFlight.actualDepartureTime ? new Date(apiFlight.actualDepartureTime) : departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            terminal: apiFlight.departureTerminal || 'T1',
            gate: apiFlight.departureGate || 'TBD'
        },
        arrival: {
            city: destination.city || destination.name || (typeof apiFlight.destination === 'string' ? apiFlight.destination : 'Destination'),
            code: destination.code || (typeof apiFlight.destination === 'string' ? apiFlight.destination.substring(0, 3).toUpperCase() : 'XXX'),
            airport: destination.airport || (destination.city || 'Destination') + ' International',
            scheduledTime: arrivalTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            estimatedTime: (apiFlight.estimatedArrivalTime ? new Date(apiFlight.estimatedArrivalTime) : arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            terminal: apiFlight.arrivalTerminal || 'T1',
            baggage: apiFlight.baggageBelt || 'TBD'
        },
        status: apiFlight.status || 'on-time',
        aircraft: apiFlight.aircraft || 'Boeing 737',
        delay: apiFlight.delayMinutes ? `${apiFlight.delayMinutes} minutes` : null,
        delayReason: apiFlight.delayReason || null,
        progress: calculateFlightProgress(departureTime, arrivalTime)
    };
}

// Calculate flight progress percentage
function calculateFlightProgress(departureTime, arrivalTime) {
    const now = new Date();
    const totalDuration = arrivalTime - departureTime;
    const elapsed = now - departureTime;
    
    if (now < departureTime) return 0;
    if (now > arrivalTime) return 100;
    
    return Math.round((elapsed / totalDuration) * 100);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DISPLAY FLIGHT RESULTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function displayFlightResults(flight, date) {
    STATE.currentFlight = flight;
    
    // Show results container
    const resultsDiv = document.getElementById('flight-results');
    resultsDiv.classList.remove('hidden');
    
    // Populate flight data
    document.getElementById('result-airline-logo').src = flight.airlineLogo;
    document.getElementById('result-airline-name').textContent = flight.airline;
    document.getElementById('result-flight-number').textContent = flight.flightNumber;
    
    // Status badge
    const statusBadge = document.getElementById('result-flight-status');
    statusBadge.textContent = flight.status.replace('-', ' ');
    statusBadge.className = `status-badge ${flight.status}`;
    
    // Route
    document.getElementById('result-departure-city').textContent = flight.departure.city;
    document.getElementById('result-arrival-city').textContent = flight.arrival.city;
    
    // Departure details
    document.getElementById('result-scheduled-departure').textContent = 
        `${flight.departure.scheduledTime} - ${flight.departure.code}`;
    document.getElementById('result-actual-departure').textContent = 
        `${flight.departure.actualTime} - ${flight.departure.code}`;
    document.getElementById('result-departure-gate').textContent = 
        `T${flight.departure.terminal} / Gate ${flight.departure.gate}`;
    
    // Arrival details
    document.getElementById('result-scheduled-arrival').textContent = 
        `${flight.arrival.scheduledTime} - ${flight.arrival.code}`;
    document.getElementById('result-estimated-arrival').textContent = 
        `${flight.arrival.estimatedTime} - ${flight.arrival.code}`;
    document.getElementById('result-arrival-gate').textContent = 
        `T${flight.arrival.terminal} / ${flight.arrival.baggage}`;
    
    // Aircraft
    document.getElementById('result-aircraft').textContent = flight.aircraft;
    
    // Delay info
    const delayDiv = document.getElementById('delay-info');
    if (flight.delay) {
        delayDiv.classList.remove('hidden');
        document.getElementById('result-delay-duration').textContent = flight.delay;
        document.getElementById('result-delay-reason').textContent = flight.delayReason;
    } else {
        delayDiv.classList.add('hidden');
    }
    
    // Update timeline progress
    updateTimeline(flight.progress);
    
    // Scroll to results
    setTimeout(() => {
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UPDATE TIMELINE PROGRESS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function updateTimeline(progress) {
    const progressBar = document.getElementById('timeline-progress');
    const points = document.querySelectorAll('.timeline-point');
    
    // Update progress bar width
    setTimeout(() => {
        progressBar.style.width = `${progress}%`;
    }, 300);
    
    // Activate timeline points based on progress
    points.forEach((point, index) => {
        if (progress >= (index * 50)) {
            point.classList.add('active');
        } else {
            point.classList.remove('active');
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RECENT SEARCHES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function loadRecentSearches() {
    const saved = localStorage.getItem('recentFlightSearches');
    if (saved) {
        STATE.recentSearches = JSON.parse(saved);
        renderRecentSearches();
    }
}

function saveToRecentSearches(flightNumber, date) {
    const search = { flightNumber, date, timestamp: Date.now() };
    
    // Remove duplicates
    STATE.recentSearches = STATE.recentSearches.filter(
        s => s.flightNumber !== flightNumber || s.date !== date
    );
    
    // Add to beginning
    STATE.recentSearches.unshift(search);
    
    // Keep only last 5
    STATE.recentSearches = STATE.recentSearches.slice(0, 5);
    
    // Save to localStorage
    localStorage.setItem('recentFlightSearches', JSON.stringify(STATE.recentSearches));
    
    renderRecentSearches();
}

function renderRecentSearches() {
    const container = document.getElementById('recent-searches-list');
    const section = document.getElementById('recent-searches');
    
    if (STATE.recentSearches.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    section.classList.remove('hidden');
    
    container.innerHTML = STATE.recentSearches.map(search => {
        const date = new Date(search.timestamp);
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <button class="recent-pill" data-flight="${search.flightNumber}" data-date="${search.date}">
                <i class="fas fa-plane"></i>
                ${search.flightNumber} - ${dateStr}
            </button>
        `;
    }).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ERROR HANDLING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showError(message) {
    const errorDiv = document.getElementById('form-error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#1d5e33'};
        color: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(29, 94, 51, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        max-width: 300px;
        font-family: 'Poppins', sans-serif;
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    notification.innerHTML = `${icon} ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTO-REFRESH FLIGHT STATUS (Optional)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Auto-refresh every 60 seconds if a flight is being tracked
setInterval(() => {
    if (STATE.currentFlight) {
        console.log('Auto-refreshing flight status...');
        // In production, fetch updated data from API
    }
}, 60000);

console.log('✈️ Destinova Flight Status - All Systems Active');
