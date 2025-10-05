/* Manage Bookings JavaScript - Destinova Admin */

// Sample bookings data
let bookingsData = [];
let filteredBookings = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeBookingsManagement();
    loadBookingsData();
    setupEventListeners();
});

// Initialize bookings management
function initializeBookingsManagement() {
    console.log('Initializing Bookings Management...');
    updateStats();
}

// Setup event listeners
function setupEventListeners() {
    // Filter change events
    document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
    document.getElementById('dateFilter')?.addEventListener('change', applyFilters);
    document.getElementById('classFilter')?.addEventListener('change', applyFilters);
    document.getElementById('bookingSearch')?.addEventListener('input', applyFilters);
    
    // Reset filters
    document.getElementById('resetFilters')?.addEventListener('click', resetFilters);
    
    // Select all checkbox
    document.getElementById('selectAll')?.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
    });
    
    // Export button
    document.getElementById('exportBtn')?.addEventListener('click', exportBookings);
    
    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', refreshBookings);
    
    // Table action buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-btn')) {
            const row = e.target.closest('tr');
            viewBookingDetails(row);
        }
        
        if (e.target.closest('.edit-btn')) {
            const row = e.target.closest('tr');
            editBooking(row);
        }
        
        if (e.target.closest('.delete-btn')) {
            const row = e.target.closest('tr');
            cancelBooking(row);
        }
    });
    
    // Modal close
    document.querySelector('.modal-close')?.addEventListener('click', closeModal);
}

// Load bookings data
function loadBookingsData() {
    // Mock data - Replace with actual API call
    bookingsData = generateMockBookings(50);
    filteredBookings = [...bookingsData];
    renderBookingsTable();
}

// Generate mock bookings
function generateMockBookings(count) {
    const bookings = [];
    const statuses = ['confirmed', 'pending', 'cancelled', 'completed'];
    const classes = ['Economy', 'Business', 'First Class'];
    const routes = [
        { from: 'NYC', to: 'LAX', flight: 'AA-1234' },
        { from: 'LHR', to: 'JFK', flight: 'BA-5678' },
        { from: 'SFO', to: 'NRT', flight: 'UA-9012' },
        { from: 'DXB', to: 'SYD', flight: 'EK-3456' },
        { from: 'ORD', to: 'CDG', flight: 'AF-7890' }
    ];
    
    for (let i = 1; i <= count; i++) {
        const route = routes[Math.floor(Math.random() * routes.length)];
        const classType = classes[Math.floor(Math.random() * classes.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        bookings.push({
            id: `BK${1000 + i}`,
            passenger: {
                name: `Passenger ${i}`,
                email: `passenger${i}@email.com`,
                avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${20 + (i % 50)}.jpg`
            },
            flight: route,
            travelDate: new Date(2024, 11, 15 + (i % 15)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            class: classType,
            amount: classType === 'Economy' ? (400 + Math.random() * 200) : classType === 'Business' ? (800 + Math.random() * 500) : (1800 + Math.random() * 500),
            status: status,
            bookedOn: new Date(2024, 10, 28 + (i % 7)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        });
    }
    
    return bookings;
}

// Render bookings table
function renderBookingsTable() {
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;
    
    if (filteredBookings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px; color: #6c757d;">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                    <strong>No bookings found</strong>
                    <p style="margin-top: 10px;">Try adjusting your filters</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredBookings.slice(0, 10).map(booking => `
        <tr data-booking-id="${booking.id}">
            <td><input type="checkbox" class="row-checkbox"></td>
            <td><strong>#${booking.id}</strong></td>
            <td>
                <div class="passenger-info">
                    <img src="${booking.passenger.avatar}" alt="Passenger">
                    <div>
                        <strong>${booking.passenger.name}</strong>
                        <span>${booking.passenger.email}</span>
                    </div>
                </div>
            </td>
            <td>
                <div class="flight-info">
                    <strong>${booking.flight.from} → ${booking.flight.to}</strong>
                    <span>Flight ${booking.flight.flight}</span>
                </div>
            </td>
            <td>${booking.travelDate}</td>
            <td><span class="class-badge ${booking.class.toLowerCase().replace(' ', '')}">${booking.class}</span></td>
            <td><strong>$${booking.amount.toFixed(2)}</strong></td>
            <td><span class="status-badge ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></td>
            <td>${booking.bookedOn}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon view-btn" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-btn" title="Cancel"><i class="fas fa-times"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Apply filters
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const dateFilter = document.getElementById('dateFilter')?.value || 'all';
    const classFilter = document.getElementById('classFilter')?.value || 'all';
    const searchTerm = document.getElementById('bookingSearch')?.value.toLowerCase() || '';
    
    filteredBookings = bookingsData.filter(booking => {
        // Status filter
        if (statusFilter !== 'all' && booking.status !== statusFilter) {
            return false;
        }
        
        // Class filter
        if (classFilter !== 'all' && booking.class.toLowerCase() !== classFilter) {
            return false;
        }
        
        // Search filter
        if (searchTerm) {
            const searchableText = `${booking.id} ${booking.passenger.name} ${booking.passenger.email} ${booking.flight.from} ${booking.flight.to} ${booking.flight.flight}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    renderBookingsTable();
    updateStats();
}

// Reset filters
function resetFilters() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('dateFilter').value = 'all';
    document.getElementById('classFilter').value = 'all';
    document.getElementById('bookingSearch').value = '';
    
    filteredBookings = [...bookingsData];
    renderBookingsTable();
    updateStats();
}

// Update stats
function updateStats() {
    const confirmed = bookingsData.filter(b => b.status === 'confirmed').length;
    const pending = bookingsData.filter(b => b.status === 'pending').length;
    const cancelled = bookingsData.filter(b => b.status === 'cancelled').length;
    
    document.getElementById('totalBookings').textContent = bookingsData.length.toLocaleString();
    document.getElementById('confirmedBookings').textContent = confirmed.toLocaleString();
    document.getElementById('pendingBookings').textContent = pending.toLocaleString();
    document.getElementById('cancelledBookings').textContent = cancelled.toLocaleString();
}

// View booking details
function viewBookingDetails(row) {
    const bookingId = row.dataset.bookingId;
    const booking = bookingsData.find(b => b.id === bookingId);
    
    if (!booking) return;
    
    const modal = document.getElementById('viewBookingModal');
    const content = document.getElementById('bookingDetailsContent');
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
            <div>
                <h3 style="color: var(--admin-secondary); margin-bottom: 10px;">Booking Information</h3>
                <p><strong>Booking ID:</strong> #${booking.id}</p>
                <p><strong>Status:</strong> <span class="status-badge ${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></p>
                <p><strong>Booked On:</strong> ${booking.bookedOn}</p>
            </div>
            <div>
                <h3 style="color: var(--admin-secondary); margin-bottom: 10px;">Passenger Details</h3>
                <p><strong>Name:</strong> ${booking.passenger.name}</p>
                <p><strong>Email:</strong> ${booking.passenger.email}</p>
            </div>
            <div>
                <h3 style="color: var(--admin-secondary); margin-bottom: 10px;">Flight Details</h3>
                <p><strong>Route:</strong> ${booking.flight.from} → ${booking.flight.to}</p>
                <p><strong>Flight:</strong> ${booking.flight.flight}</p>
                <p><strong>Travel Date:</strong> ${booking.travelDate}</p>
                <p><strong>Class:</strong> ${booking.class}</p>
            </div>
            <div>
                <h3 style="color: var(--admin-secondary); margin-bottom: 10px;">Payment Information</h3>
                <p><strong>Amount:</strong> $${booking.amount.toFixed(2)}</p>
                <p><strong>Payment Status:</strong> <span style="color: var(--admin-success);">Paid</span></p>
            </div>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
            <button onclick="printBooking('${booking.id}')" style="padding: 10px 20px; background: var(--admin-secondary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                <i class="fas fa-print"></i> Print
            </button>
            <button onclick="sendConfirmation('${booking.id}')" style="padding: 10px 20px; background: var(--admin-success); color: white; border: none; border-radius: 6px; cursor: pointer;">
                <i class="fas fa-envelope"></i> Send Confirmation
            </button>
        </div>
    `;
    
    modal.classList.add('show');
}

// Edit booking
function editBooking(row) {
    const bookingId = row.dataset.bookingId;
    alert(`Edit booking #${bookingId}\nThis feature will open an edit form.`);
}

// Cancel booking
function cancelBooking(row) {
    const bookingId = row.dataset.bookingId;
    
    if (confirm(`Are you sure you want to cancel booking #${bookingId}?`)) {
        const booking = bookingsData.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'cancelled';
            applyFilters();
            showNotification('Booking cancelled successfully', 'success');
        }
    }
}

// Export bookings
function exportBookings() {
    const csv = generateCSV(filteredBookings);
    downloadFile(csv, 'bookings-export.csv', 'text/csv');
    showNotification('Bookings exported successfully', 'success');
}

// Generate CSV
function generateCSV(data) {
    const headers = ['Booking ID', 'Passenger Name', 'Email', 'Flight', 'Travel Date', 'Class', 'Amount', 'Status', 'Booked On'];
    const rows = data.map(b => [
        b.id,
        b.passenger.name,
        b.passenger.email,
        `${b.flight.from}-${b.flight.to}`,
        b.travelDate,
        b.class,
        b.amount.toFixed(2),
        b.status,
        b.bookedOn
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Download file
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Refresh bookings
function refreshBookings() {
    const btn = document.getElementById('refreshBtn');
    btn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
    btn.disabled = true;
    
    setTimeout(() => {
        loadBookingsData();
        btn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        btn.disabled = false;
        showNotification('Bookings refreshed successfully', 'success');
    }, 1000);
}

// Close modal
function closeModal() {
    document.getElementById('viewBookingModal')?.classList.remove('show');
}

// Print booking
function printBooking(bookingId) {
    alert(`Print booking #${bookingId}`);
}

// Send confirmation
function sendConfirmation(bookingId) {
    alert(`Sending confirmation email for booking #${bookingId}`);
    showNotification('Confirmation email sent successfully', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Reuse notification from admin-dashboard.js if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

console.log('Manage Bookings JS Loaded Successfully');
