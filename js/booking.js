// Passenger counter functionality
document.addEventListener('DOMContentLoaded', function() {
    const decreaseAdults = document.getElementById('decrease-adults');
    const increaseAdults = document.getElementById('increase-adults');
    const adultsCount = document.getElementById('adults-count');
    
    decreaseAdults.addEventListener('click', function() {
        let count = parseInt(adultsCount.textContent);
        if (count > 1) {
            adultsCount.textContent = count - 1;
        }
    });
    
    increaseAdults.addEventListener('click', function() {
        let count = parseInt(adultsCount.textContent);
        if (count < 9) {
            adultsCount.textContent = count + 1;
        }
    });
    
    // Toggle filters on mobile
    const toggleFilters = document.getElementById('toggle-filters');
    const filterContent = document.getElementById('filter-content');
    
    toggleFilters.addEventListener('click', function() {
        filterContent.classList.toggle('show');
    });
    
    // Flight selection
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const flightCard = this.closest('.flight-card');
            const flightNumber = flightCard.querySelector('p').textContent;
            const from = flightCard.querySelectorAll('.flight-time .date')[0].textContent;
            const to = flightCard.querySelectorAll('.flight-time .date')[1].textContent;
            const time = `${flightCard.querySelectorAll('.time')[0].textContent} - ${flightCard.querySelectorAll('.time')[1].textContent}`;
            const price = flightCard.querySelector('.price').textContent;
            
            // Update booking summary
            document.querySelector('.summary-item:nth-child(1) span:last-child').textContent = `${flightNumber} (${from} → ${to})`;
            document.querySelector('.summary-item:nth-child(2) span:last-child').textContent = 'Aug 25, 2023';
            document.querySelector('.summary-item:nth-child(3) span:last-child').textContent = time;
            document.querySelector('.summary-total span:last-child').textContent = `$${price}`;
            
            // Highlight selected flight
            document.querySelectorAll('.flight-card').forEach(card => {
                card.style.border = 'none';
            });
            flightCard.style.border = `2px solid var(--deep-emerald)`;
        });
    });
    
    // Form submission
    const searchForm = document.querySelector('.search-form');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real application, this would process the form data and fetch results
        alert('Searching for flights...');
    });
});