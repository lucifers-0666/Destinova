/* ═══════════════════════════════════════════════════════════════════
   DESTINOVA MY BOOKINGS PAGE - INTERACTIVE JAVASCRIPT
   Premium Booking Management Interface
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SAMPLE BOOKING DATA
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    const sampleBookings = [
        {
            id: 'BK7382',
            status: 'upcoming',
            origin: { code: 'DEL', name: 'New Delhi' },
            destination: { code: 'BOM', name: 'Mumbai' },
            date: '2025-11-20',
            time: '14:30',
            airline: 'Air India',
            flightNumber: 'AI 856',
            class: 'Business',
            passengers: 2,
            price: 24500,
            bookingDate: '2025-11-01'
        },
        {
            id: 'BK6291',
            status: 'upcoming',
            origin: { code: 'BOM', name: 'Mumbai' },
            destination: { code: 'DXB', name: 'Dubai' },
            date: '2025-11-15',
            time: '09:15',
            airline: 'Emirates',
            flightNumber: 'EK 501',
            class: 'Economy',
            passengers: 1,
            price: 18200,
            bookingDate: '2025-10-28'
        },
        {
            id: 'BK5147',
            status: 'past',
            origin: { code: 'DEL', name: 'New Delhi' },
            destination: { code: 'BLR', name: 'Bangalore' },
            date: '2025-10-25',
            time: '16:45',
            airline: 'IndiGo',
            flightNumber: '6E 2032',
            class: 'Economy',
            passengers: 1,
            price: 6500,
            bookingDate: '2025-10-15'
        },
        {
            id: 'BK4893',
            status: 'past',
            origin: { code: 'BLR', name: 'Bangalore' },
            destination: { code: 'DEL', name: 'New Delhi' },
            date: '2025-10-28',
            time: '08:30',
            airline: 'IndiGo',
            flightNumber: '6E 2015',
            class: 'Economy',
            passengers: 1,
            price: 7200,
            bookingDate: '2025-10-15'
        },
        {
            id: 'BK3726',
            status: 'cancelled',
            origin: { code: 'DEL', name: 'New Delhi' },
            destination: { code: 'GOI', name: 'Goa' },
            date: '2025-12-24',
            time: '11:00',
            airline: 'SpiceJet',
            flightNumber: 'SG 8156',
            class: 'Economy',
            passengers: 3,
            price: 18900,
            bookingDate: '2025-10-20'
        },
        {
            id: 'BK2584',
            status: 'upcoming',
            origin: { code: 'DEL', name: 'New Delhi' },
            destination: { code: 'SIN', name: 'Singapore' },
            date: '2025-12-10',
            time: '23:45',
            airline: 'Singapore Airlines',
            flightNumber: 'SQ 401',
            class: 'Business',
            passengers: 2,
            price: 82500,
            bookingDate: '2025-10-30'
        }
    ];
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STATE MANAGEMENT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    let currentTab = 'upcoming';
    let currentView = 'grid';
    let currentFilter = 'all';
    let currentSort = 'date-desc';
    let searchQuery = '';
    
    // Load bookings from localStorage or use sample data
    let bookings = loadBookings();
    
    function loadBookings() {
        const stored = localStorage.getItem('userBookings');
        return stored ? JSON.parse(stored) : sampleBookings;
    }
    
    function saveBookings() {
        localStorage.setItem('userBookings', JSON.stringify(bookings));
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PARTICLES.JS INITIALIZATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-bookings', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.2, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: true, out_mode: 'out' }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
                modes: { grab: { distance: 200, line_linked: { opacity: 0.5 } }, push: { particles_nb: 2 } }
            }
        });
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // STATISTICS UPDATE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    function updateStatistics() {
        const upcoming = bookings.filter(b => b.status === 'upcoming').length;
        const past = bookings.filter(b => b.status === 'past').length;
        const cancelled = bookings.filter(b => b.status === 'cancelled').length;
        const total = bookings.length;
        
        animateCounter('upcoming-count', upcoming);
        animateCounter('past-count', past);
        animateCounter('cancelled-count', cancelled);
        animateCounter('total-count', total);
    }
    
    function animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const duration = 1000;
        const start = 0;
        const increment = targetValue / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // RENDER BOOKINGS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    function renderBookings() {
        const container = document.getElementById('bookings-container');
        const emptyState = document.getElementById('empty-state');
        
        if (!container) return;
        
        // Filter bookings
        let filtered = bookings.filter(booking => {
            // Tab filter
            if (currentTab !== 'all' && booking.status !== currentTab) return false;
            
            // Status filter
            if (currentFilter !== 'all' && booking.status !== currentFilter) return false;
            
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesRef = booking.id.toLowerCase().includes(query);
                const matchesOrigin = booking.origin.code.toLowerCase().includes(query) || 
                                     booking.origin.name.toLowerCase().includes(query);
                const matchesDest = booking.destination.code.toLowerCase().includes(query) || 
                                   booking.destination.name.toLowerCase().includes(query);
                const matchesAirline = booking.airline.toLowerCase().includes(query);
                
                if (!matchesRef && !matchesOrigin && !matchesDest && !matchesAirline) return false;
            }
            
            return true;
        });
        
        // Sort bookings
        filtered.sort((a, b) => {
            switch (currentSort) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'destination':
                    return a.destination.name.localeCompare(b.destination.name);
                default:
                    return 0;
            }
        });
        
        // Show/hide empty state
        if (filtered.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        } else {
            emptyState.classList.add('hidden');
        }
        
        // Render cards
        container.innerHTML = filtered.map(booking => createBookingCard(booking)).join('');
        
        // Attach event listeners
        attachCardEventListeners();
    }
    
    function createBookingCard(booking) {
        const date = new Date(booking.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        return `
            <div class="booking-card" data-booking-id="${booking.id}">
                <div class="booking-header">
                    <div class="booking-ref">
                        <i class="fas fa-barcode"></i>
                        <span>${booking.id}</span>
                    </div>
                    <span class="booking-status ${booking.status}">${booking.status}</span>
                </div>
                
                <div class="booking-body">
                    <div class="flight-route">
                        <div class="route-city">
                            <div class="city-code">${booking.origin.code}</div>
                            <div class="city-name">${booking.origin.name}</div>
                        </div>
                        <div class="route-arrow">
                            <i class="fas fa-plane"></i>
                        </div>
                        <div class="route-city">
                            <div class="city-code">${booking.destination.code}</div>
                            <div class="city-name">${booking.destination.name}</div>
                        </div>
                    </div>
                    
                    <div class="flight-details">
                        <div class="detail-item">
                            <div class="detail-label">Date</div>
                            <div class="detail-value">${formattedDate}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Time</div>
                            <div class="detail-value">${booking.time}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Airline</div>
                            <div class="detail-value">${booking.airline}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Flight</div>
                            <div class="detail-value">${booking.flightNumber}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Class</div>
                            <div class="detail-value">${booking.class}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Passengers</div>
                            <div class="detail-value">${booking.passengers}</div>
                        </div>
                    </div>
                </div>
                
                <div class="booking-footer">
                    <div class="booking-price">
                        <div class="price-label">Total Price</div>
                        <div class="price-value">₹${booking.price.toLocaleString()}</div>
                    </div>
                    <div class="booking-actions">
                        ${booking.status === 'upcoming' ? `
                            <button class="btn-action primary" onclick="viewBookingDetails('${booking.id}')">
                                <i class="fas fa-eye"></i>
                                <span>View Details</span>
                            </button>
                            <button class="btn-action" onclick="cancelBooking('${booking.id}')">
                                <i class="fas fa-times"></i>
                                <span>Cancel</span>
                            </button>
                        ` : ''}
                        ${booking.status === 'past' ? `
                            <button class="btn-action primary" onclick="viewBookingDetails('${booking.id}')">
                                <i class="fas fa-receipt"></i>
                                <span>View Receipt</span>
                            </button>
                            <button class="btn-action" onclick="rebookFlight('${booking.id}')">
                                <i class="fas fa-redo"></i>
                                <span>Rebook</span>
                            </button>
                        ` : ''}
                        ${booking.status === 'cancelled' ? `
                            <button class="btn-action primary" onclick="viewBookingDetails('${booking.id}')">
                                <i class="fas fa-info-circle"></i>
                                <span>Details</span>
                            </button>
                            <button class="btn-action" onclick="rebookFlight('${booking.id}')">
                                <i class="fas fa-search"></i>
                                <span>Search Again</span>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    function attachCardEventListeners() {
        // Event delegation is handled via inline onclick attributes
        // This function can be extended for additional event listeners if needed
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // TAB NAVIGATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            currentTab = tab;
            
            // Update active state
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Re-render bookings
            renderBookings();
        });
    });
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FILTERS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) {
        filterStatus.addEventListener('change', function() {
            currentFilter = this.value;
            renderBookings();
        });
    }
    
    const sortBy = document.getElementById('sort-by');
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            currentSort = this.value;
            renderBookings();
        });
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // SEARCH
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    const searchInput = document.getElementById('search-booking');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchQuery = this.value;
                renderBookings();
            }, 300); // Debounce search
        });
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // VIEW TOGGLE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            currentView = view;
            
            // Update active state
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update container class
            const container = document.getElementById('bookings-container');
            if (container) {
                container.className = `bookings-container ${view}-view`;
            }
        });
    });
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // BOOKING ACTIONS (Global functions)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    window.viewBookingDetails = function(bookingId) {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            // Store booking details in localStorage for viewing
            localStorage.setItem('viewBookingDetails', JSON.stringify(booking));
            // Redirect to booking confirmation page
            window.location.href = 'booking-confirmation.html';
        }
    };
    
    window.cancelBooking = function(bookingId) {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            const confirmed = confirm(`Are you sure you want to cancel booking ${bookingId}?\n\nRoute: ${booking.origin.code} → ${booking.destination.code}\nDate: ${booking.date}\n\nThis action cannot be undone.`);
            
            if (confirmed) {
                // Update booking status
                booking.status = 'cancelled';
                saveBookings();
                
                // Show success message
                showNotification('Booking cancelled successfully', 'success');
                
                // Update UI
                updateStatistics();
                renderBookings();
            }
        }
    };
    
    window.rebookFlight = function(bookingId) {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            // Store search parameters
            const searchData = {
                from: booking.origin.code,
                to: booking.destination.code,
                departDate: booking.date,
                passengers: booking.passengers,
                class: booking.class.toLowerCase()
            };
            localStorage.setItem('flightSearch', JSON.stringify(searchData));
            
            // Redirect to search/results page
            window.location.href = 'index.html#search';
        }
    };
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // NOTIFICATION SYSTEM
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 32px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                          type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                          'linear-gradient(135deg, #3b82f6, #2563eb)'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // HEADER SCROLL EFFECT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    const header = document.getElementById('header-main');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // INITIALIZE ON PAGE LOAD
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    updateStatistics();
    renderBookings();
    
    // Check user authentication
    const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
    if (!isSignedIn) {
        // Optionally redirect to sign-in page or show a message
        console.log('User not signed in. Showing sample bookings.');
    }
    
    console.log('✈️ My Bookings page initialized successfully');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATION KEYFRAMES (Add to document if needed)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
