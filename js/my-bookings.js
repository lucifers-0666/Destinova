/* ═══════════════════════════════════════════════════════════════════
   DESTINOVA MY BOOKINGS - COMPLETE JAVASCRIPT
   Modern, Interactive, Feature-Rich
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SAMPLE BOOKING DATA (In production, this comes from API)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ALL_BOOKINGS = [
    {
        id: 1,
        ref: 'DEST789A',
        route: 'Delhi (DEL) to Mumbai (BOM)',
        departure: {
            city: 'New Delhi',
            code: 'DEL',
            date: '2025-03-15',
            time: '08:00'
        },
        arrival: {
            city: 'Mumbai',
            code: 'BOM',
            date: '2025-03-15',
            time: '10:10'
        },
        passengers: ['Diwakar Monga'],
        seats: ['12A'],
        class: 'Economy',
        status: 'upcoming',
        bookingDate: '2025-01-15'
    },
    {
        id: 2,
        ref: 'DEST456B',
        route: 'New York (JFK) to London (LHR)',
        departure: {
            city: 'New York',
            code: 'JFK',
            date: '2025-04-20',
            time: '21:00'
        },
        arrival: {
            city: 'London',
            code: 'LHR',
            date: '2025-04-21',
            time: '09:30'
        },
        passengers: ['Diwakar Monga', 'Jane Doe'],
        seats: ['3A', '3B'],
        class: 'Business',
        status: 'upcoming',
        bookingDate: '2025-02-10'
    },
    {
        id: 3,
        ref: 'DEST123C',
        route: 'Mumbai (BOM) to Dubai (DXB)',
        departure: {
            city: 'Mumbai',
            code: 'BOM',
            date: '2024-12-10',
            time: '14:30'
        },
        arrival: {
            city: 'Dubai',
            code: 'DXB',
            date: '2024-12-10',
            time: '17:45'
        },
        passengers: ['Diwakar Monga'],
        seats: ['18F'],
        class: 'Economy',
        status: 'past',
        bookingDate: '2024-11-05'
    },
    {
        id: 4,
        ref: 'DEST789D',
        route: 'Paris (CDG) to Tokyo (NRT)',
        departure: {
            city: 'Paris',
            code: 'CDG',
            date: '2024-11-15',
            time: '10:00'
        },
        arrival: {
            city: 'Tokyo',
            code: 'NRT',
            date: '2024-11-16',
            time: '06:30'
        },
        passengers: ['Diwakar Monga', 'Sarah Johnson'],
        seats: ['5A', '5B'],
        class: 'Business',
        status: 'past',
        bookingDate: '2024-10-01'
    },
    {
        id: 5,
        ref: 'DEST999E',
        route: 'Singapore (SIN) to Sydney (SYD)',
        departure: {
            city: 'Singapore',
            code: 'SIN',
            date: '2025-02-10',
            time: '23:00'
        },
        arrival: {
            city: 'Sydney',
            code: 'SYD',
            date: '2025-02-11',
            time: '09:30'
        },
        passengers: ['Diwakar Monga'],
        seats: ['21C'],
        class: 'Economy',
        status: 'cancelled',
        bookingDate: '2025-01-20'
    }
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STATE = {
    currentTab: 'upcoming',
    currentView: 'grid',
    currentFilter: 'all',
    currentSort: 'date-desc',
    searchQuery: '',
    bookings: ALL_BOOKINGS
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Destinova My Bookings - Initialized');
    
    initializeParticles();
    setupEventListeners();
    updateStatistics();
    renderBookings();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PARTICLES.JS INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-bookings', {
            particles: {
                number: {
                    value: 50,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#E5CBAF', '#ffffff']
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.4,
                    random: true
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#E5CBAF',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out'
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT LISTENERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setupEventListeners() {
    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.currentTarget.dataset.tab;
            switchTab(tab);
        });
    });
    
    // View toggle buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });
    
    // Filter status
    const filterSelect = document.getElementById('filter-status');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            STATE.currentFilter = e.target.value;
            renderBookings();
        });
    }
    
    // Sort by
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            STATE.currentSort = e.target.value;
            renderBookings();
        });
    }
    
    // Search
    const searchInput = document.getElementById('search-booking');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            STATE.searchQuery = e.target.value.toLowerCase();
            renderBookings();
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB SWITCHING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function switchTab(tab) {
    STATE.currentTab = tab;
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    renderBookings();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIEW SWITCHING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function switchView(view) {
    STATE.currentView = view;
    
    // Update active view button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });
    
    // Update container class
    const container = document.getElementById('bookings-container');
    container.className = `bookings-container ${view}-view`;
    
    renderBookings();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UPDATE STATISTICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function updateStatistics() {
    const stats = {
        upcoming: STATE.bookings.filter(b => b.status === 'upcoming').length,
        past: STATE.bookings.filter(b => b.status === 'past').length,
        cancelled: STATE.bookings.filter(b => b.status === 'cancelled').length,
        total: STATE.bookings.length
    };
    
    animateCount('upcoming-count', stats.upcoming);
    animateCount('past-count', stats.past);
    animateCount('cancelled-count', stats.cancelled);
    animateCount('total-count', stats.total);
}

function animateCount(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = target / 20;
    const duration = 1000;
    const stepTime = duration / 20;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILTER & SORT BOOKINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function getFilteredBookings() {
    let filtered = STATE.bookings;
    
    // Filter by tab
    if (STATE.currentTab !== 'all') {
        filtered = filtered.filter(b => b.status === STATE.currentTab);
    }
    
    // Filter by status dropdown
    if (STATE.currentFilter !== 'all') {
        filtered = filtered.filter(b => b.status === STATE.currentFilter);
    }
    
    // Filter by search query
    if (STATE.searchQuery) {
        filtered = filtered.filter(b => 
            b.ref.toLowerCase().includes(STATE.searchQuery) ||
            b.route.toLowerCase().includes(STATE.searchQuery) ||
            b.departure.city.toLowerCase().includes(STATE.searchQuery) ||
            b.arrival.city.toLowerCase().includes(STATE.searchQuery)
        );
    }
    
    // Sort
    switch (STATE.currentSort) {
        case 'date-desc':
            filtered.sort((a, b) => new Date(b.departure.date) - new Date(a.departure.date));
            break;
        case 'date-asc':
            filtered.sort((a, b) => new Date(a.departure.date) - new Date(b.departure.date));
            break;
        case 'destination':
            filtered.sort((a, b) => a.arrival.city.localeCompare(b.arrival.city));
            break;
    }
    
    return filtered;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RENDER BOOKINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderBookings() {
    const container = document.getElementById('bookings-container');
    const emptyState = document.getElementById('empty-state');
    const bookings = getFilteredBookings();
    
    if (bookings.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    if (STATE.currentView === 'timeline') {
        container.innerHTML = bookings.map(booking => renderTimelineItem(booking)).join('');
    } else {
        container.innerHTML = bookings.map(booking => renderBookingCard(booking)).join('');
    }
    
    // Setup action buttons
    setupActionButtons();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RENDER BOOKING CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderBookingCard(booking) {
    const departureDate = new Date(booking.departure.date);
    const formattedDate = departureDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    return `
        <div class="booking-card glass-card" data-booking-id="${booking.id}">
            <div class="booking-header">
                <div>
                    <div class="booking-route">${booking.route}</div>
                    <div class="booking-ref">Booking Ref: ${booking.ref}</div>
                </div>
                <span class="status-badge ${booking.status}">${booking.status}</span>
            </div>
            
            <div class="flight-details">
                <div class="flight-point departure">
                    <div class="flight-time">${booking.departure.time}</div>
                    <div class="flight-date">${formattedDate}</div>
                </div>
                
                <div class="flight-arrow">
                    <i class="fas fa-plane"></i>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">2h 10m</span>
                </div>
                
                <div class="flight-point arrival">
                    <div class="flight-time">${booking.arrival.time}</div>
                    <div class="flight-date">${formattedDate}</div>
                </div>
            </div>
            
            <div class="passenger-info">
                <div class="info-item">
                    <i class="fas fa-user"></i>
                    <span>${booking.passengers.length} Passenger${booking.passengers.length > 1 ? 's' : ''}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-chair"></i>
                    <span>Seat${booking.seats.length > 1 ? 's' : ''}: ${booking.seats.join(', ')}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-plane-up"></i>
                    <span>${booking.class}</span>
                </div>
            </div>
            
            <div class="booking-actions">
                ${booking.status === 'upcoming' ? `
                    <button class="action-btn primary view-ticket" data-ref="${booking.ref}">
                        <i class="fas fa-ticket"></i>
                        <span>View Ticket</span>
                    </button>
                    <button class="action-btn modify-booking" data-id="${booking.id}">
                        <i class="fas fa-pen"></i>
                        <span>Modify</span>
                    </button>
                    <button class="action-btn danger cancel-booking" data-id="${booking.id}">
                        <i class="fas fa-times"></i>
                        <span>Cancel</span>
                    </button>
                ` : booking.status === 'past' ? `
                    <button class="action-btn primary view-ticket" data-ref="${booking.ref}">
                        <i class="fas fa-receipt"></i>
                        <span>View Receipt</span>
                    </button>
                    <button class="action-btn rebook" data-id="${booking.id}">
                        <i class="fas fa-redo"></i>
                        <span>Rebook</span>
                    </button>
                    <button class="action-btn download-invoice" data-id="${booking.id}">
                        <i class="fas fa-download"></i>
                        <span>Invoice</span>
                    </button>
                ` : `
                    <button class="action-btn rebook" data-id="${booking.id}">
                        <i class="fas fa-search"></i>
                        <span>Book Again</span>
                    </button>
                    <button class="action-btn" style="grid-column: span 2;">
                        <i class="fas fa-info-circle"></i>
                        <span>Cancelled on ${new Date(booking.bookingDate).toLocaleDateString()}</span>
                    </button>
                `}
            </div>
        </div>
    `;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RENDER TIMELINE ITEM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderTimelineItem(booking) {
    return `
        <div class="timeline-item">
            <div class="timeline-marker">
                <i class="fas fa-plane"></i>
            </div>
            ${renderBookingCard(booking)}
        </div>
    `;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SETUP ACTION BUTTONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setupActionButtons() {
    // View Ticket
    document.querySelectorAll('.view-ticket').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ref = e.currentTarget.dataset.ref;
            window.location.href = `/booking-confirmation.html?ref=${ref}`;
        });
    });
    
    // Modify Booking
    document.querySelectorAll('.modify-booking').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            showNotification('Modify booking feature coming soon!', 'info');
        });
    });
    
    // Cancel Booking
    document.querySelectorAll('.cancel-booking').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            cancelBooking(id);
        });
    });
    
    // Rebook
    document.querySelectorAll('.rebook').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            const booking = STATE.bookings.find(b => b.id == id);
            if (booking) {
                window.location.href = `/flights?from=${booking.departure.code}&to=${booking.arrival.code}`;
            }
        });
    });
    
    // Download Invoice
    document.querySelectorAll('.download-invoice').forEach(btn => {
        btn.addEventListener('click', (e) => {
            showNotification('Invoice downloaded!', 'success');
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CANCEL BOOKING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function cancelBooking(id) {
    const booking = STATE.bookings.find(b => b.id == id);
    if (!booking) return;
    
    const confirmed = confirm(
        `Are you sure you want to cancel your booking?\n\n` +
        `Booking: ${booking.ref}\n` +
        `Route: ${booking.route}\n` +
        `Date: ${booking.departure.date}\n\n` +
        `Cancellation charges may apply.`
    );
    
    if (confirmed) {
        // In production, this would call an API
        booking.status = 'cancelled';
        updateStatistics();
        renderBookings();
        showNotification('Booking cancelled successfully', 'success');
    }
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
        background: ${type === 'success' ? '#2a7d4a' : type === 'error' ? '#D93025' : '#1d5e33'};
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

console.log('✈️ Destinova My Bookings - All Systems Active');
