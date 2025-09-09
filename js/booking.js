document.addEventListener('DOMContentLoaded', function () {
    // --- Date Picker Validation for booking.html ---
    const departureDateInput = document.getElementById('departure');
    const returnDateInput = document.getElementById('return');

    if (departureDateInput && returnDateInput) {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Set the minimum date for the departure input to today
        departureDateInput.setAttribute('min', today);
        returnDateInput.setAttribute('min', today);

        // When the departure date changes, update the minimum for the return date
        departureDateInput.addEventListener('change', function () {
            const departureDate = this.value;
            returnDateInput.setAttribute('min', departureDate);
            if (returnDateInput.value && returnDateInput.value < departureDate) {
                returnDateInput.value = ''; // Clear invalid return date
            }
        });
    }
});