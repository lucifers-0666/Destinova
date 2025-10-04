document.addEventListener('DOMContentLoaded', function () {
    // Sample data - in a real app, this would come from an API
    const allBookings = [
        { id: 1, ref: 'DEST789A', route: 'Delhi (DEL) to Mumbai (BOM)', airline: 'Destinova Air', logo: 'https://i.imgur.com/sC3mYh1.png', departure: { date: '2025-03-15', time: '08:00' }, arrival: { date: '2025-03-15', time: '10:10' }, passengers: ['Diwakar Monga'], seats: ['12A'], class: 'Economy', status: 'upcoming' },
        { id: 2, ref: 'DEST456B', route: 'New York (JFK) to London (LHR)', airline: 'Destinova Air', logo: 'https://i.imgur.com/sC3mYh1.png', departure: { date: '2025-04-20', time: '21:00' }, arrival: { date: '2025-04-21', time: '09:30' }, passengers: ['Diwakar Monga', 'Jane Doe'], seats: ['3A', '3B'], class: 'Business', status: 'upcoming' },
        { id: 3, ref: 'DEST123C', route: 'Paris (CDG) to Rome (FCO)', airline: 'Partner Airlines', logo: 'https://i.imgur.com/T0b1t1f.png', departure: { date: '2024-11-10', time: '11:00' }, arrival: { date: '2024-11-10', time: '13:00' }, passengers: ['Diwakar Monga'], seats: ['22F'], class: 'Economy', status: 'past' },
        { id: 4, ref: 'DEST987D', route: 'Sydney (SYD) to Tokyo (NRT)', airline: 'Destinova Air', logo: 'https://i.imgur.com/sC3mYh1.png', departure: { date: '2024-09-05', time: '22:00' }, arrival: { date: '2024-09-06', time: '07:00' }, passengers: ['Diwakar Monga'], seats: ['1A'], class: 'First', status: 'past' },
        { id: 5, ref: 'DEST654E', route: 'Dubai (DXB) to Delhi (DEL)', airline: 'Partner Airlines', logo: 'https://i.imgur.com/WJm4z2a.png', departure: { date: '2025-02-01', time: '14:00' }, arrival: { date: '2025-02-01', time: '18:30' }, passengers: ['Diwakar Monga'], seats: ['15C'], class: 'Economy', status: 'cancelled' },
    ];

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const filterStatus = document.getElementById('filter-status');
    const searchInput = document.getElementById('search-booking');
    const emptyState = document.querySelector('.empty-state');

    function createBookingCard(booking) {
        const passengersHTML = booking.passengers.map(p => `<li>${p}</li>`).join('');
        return `
            <div class="booking-card status-${booking.status}" data-id="${booking.id}" data-ref="${booking.ref}" data-destination="${booking.route.split(' to ')[1]}">
                <div class="booking-main-content">
                    <h3>
                        ${booking.route}
                        <img src="${booking.logo}" alt="${booking.airline}" class="airline-logo">
                    </h3>
                    <div class="booking-details">
                        <span><strong>Departs:</strong> ${booking.departure.date} at ${booking.departure.time}</span> | 
                        <span><strong>Arrives:</strong> ${booking.arrival.date} at ${booking.arrival.time}</span>
                    </div>
                    <div class="passenger-details">
                        <strong>Passengers:</strong>
                        <ul>${passengersHTML}</ul>
                    </div>
                    <p class="booking-ref">Booking Ref: ${booking.ref}</p>
                    <div>
                        <span>Seats: ${booking.seats.join(', ')}</span>
                        <span class="class-badge">${booking.class}</span>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-action view-ticket">View Ticket</button>
                    ${booking.status === 'upcoming' ? '<button class="btn-action modify-booking">Modify</button>' : ''}
                    ${booking.status === 'upcoming' ? '<button class="btn-action cancel-booking">Cancel Booking</button>' : ''}
                </div>
            </div>
        `;
    }

    function loadBookings(bookingsToLoad) {
        const upcomingContainer = document.getElementById('upcoming-content');
        const pastContainer = document.getElementById('past-content');
        const cancelledContainer = document.getElementById('cancelled-content');

        upcomingContainer.innerHTML = '';
        pastContainer.innerHTML = '';
        cancelledContainer.innerHTML = '';

        let bookingsFound = false;
        bookingsToLoad.forEach(booking => {
            bookingsFound = true;
            const cardHTML = createBookingCard(booking);
            if (booking.status === 'upcoming') {
                upcomingContainer.innerHTML += cardHTML;
            } else if (booking.status === 'past') {
                pastContainer.innerHTML += cardHTML;
            } else if (booking.status === 'cancelled') {
                cancelledContainer.innerHTML += cardHTML;
            }
        });

        showEmptyState(!bookingsFound);
    }

    function filterAndSearchBookings() {
        const status = filterStatus.value;
        const searchTerm = searchInput.value.toLowerCase();

        let filteredBookings = allBookings;

        if (status !== 'all') {
            filteredBookings = filteredBookings.filter(b => b.status === status);
        }

        if (searchTerm) {
            filteredBookings = filteredBookings.filter(b => 
                b.ref.toLowerCase().includes(searchTerm) || 
                b.route.toLowerCase().includes(searchTerm)
            );
        }

        loadBookings(filteredBookings);
    }

    function switchTab(e) {
        const targetTab = e.target.dataset.tab;

        tabButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${targetTab}-content`);
        });
    }

    function handleCardAction(e) {
        const bookingCard = e.target.closest('.booking-card');
        if (!bookingCard) return;

        const bookingId = bookingCard.dataset.id;

        if (e.target.classList.contains('view-ticket')) {
            alert(`Viewing ticket for booking ID: ${bookingId}`);
            // In a real app: window.location.href = `booking-confirmation.html?id=${bookingId}`;
        }

        if (e.target.classList.contains('modify-booking')) {
            alert(`Redirecting to modify booking ID: ${bookingId}`);
            // In a real app: window.location.href = `manage-booking.html?id=${bookingId}`;
        }

        if (e.target.classList.contains('cancel-booking')) {
            if (confirm('Are you sure you want to cancel this booking?')) {
                // Simulate API call and update
                const bookingIndex = allBookings.findIndex(b => b.id == bookingId);
                if (bookingIndex > -1) {
                    allBookings[bookingIndex].status = 'cancelled';
                    bookingCard.style.transition = 'opacity 0.5s ease';
                    bookingCard.style.opacity = '0';
                    setTimeout(() => {
                        filterAndSearchBookings();
                        alert(`Booking ${allBookings[bookingIndex].ref} has been cancelled.`);
                    }, 500);
                }
            }
        }
    }

    function showEmptyState(show) {
        emptyState.classList.toggle('hidden', !show);
    }

    // Event Listeners
    tabButtons.forEach(btn => btn.addEventListener('click', switchTab));
    filterStatus.addEventListener('change', filterAndSearchBookings);
    searchInput.addEventListener('input', filterAndSearchBookings);
    
    // Use event delegation for action buttons on dynamically created cards
    document.getElementById('bookings-container').addEventListener('click', handleCardAction);

    // Initial Load
    loadBookings(allBookings);
});