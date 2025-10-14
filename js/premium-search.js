/* ============================================
   PREMIUM FLIGHT SEARCH - JAVASCRIPT
   10/10 Functionality
   ============================================ */

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', function() {
    
    // Elements
    const tripTabs = document.querySelectorAll('.trip-tab-button');
    const returnInputWrapper = document.getElementById('return-input-wrapper');
    const returnInput = document.getElementById('return-input');
    const swapButton = document.querySelector('.swap-locations-btn');
    const fromInput = document.getElementById('from-input');
    const toInput = document.getElementById('to-input');
    const departureInput = document.getElementById('departure-input');
    const travelersInput = document.getElementById('travelers-input');
    const searchForm = document.getElementById('premium-search-form');
    const searchButton = document.querySelector('.search-submit-button');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    if (departureInput) departureInput.setAttribute('min', today);
    if (returnInput) returnInput.setAttribute('min', today);

    // Trip Type Tab Switching
    if (tripTabs) {
      tripTabs.forEach(tab => {
        tab.addEventListener('click', function() {
          // Remove active from all
          tripTabs.forEach(t => t.classList.remove('active'));
          // Add active to clicked
          this.classList.add('active');

          const tripType = this.getAttribute('data-trip-type');

          // Show/hide return date based on trip type
          if (returnInputWrapper) {
            if (tripType === 'one-way') {
              returnInputWrapper.style.display = 'none';
              returnInput.removeAttribute('required');
            } else {
              returnInputWrapper.style.display = 'block';
              if (tripType === 'round-trip') {
                returnInput.setAttribute('required', 'required');
              }
            }
          }
        });
      });
    }

    // Swap Locations
    if (swapButton && fromInput && toInput) {
      swapButton.addEventListener('click', function() {
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;

        // Add animation class
        this.style.transform = 'rotate(180deg) scale(1.1)';
        setTimeout(() => {
          this.style.transform = '';
        }, 300);
      });
    }

    // Update return date minimum when departure changes
    if (departureInput && returnInput) {
      departureInput.addEventListener('change', function() {
        returnInput.setAttribute('min', this.value);
        if (returnInput.value && returnInput.value < this.value) {
          returnInput.value = '';
        }
      });
    }

    // Travelers Input (placeholder for dropdown - can be enhanced)
    if (travelersInput) {
      travelersInput.addEventListener('click', function() {
        // This would open a custom dropdown
        // For now, just show an alert
        alert('Travelers & Class selector\n\nThis would open a dropdown with:\n- Adults, Children, Infants counters\n- Cabin class selection (Economy, Business, First)');
      });
    }

    // Form Submission
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form
        if (!fromInput.value.trim()) {
          alert('Please enter departure city');
          fromInput.focus();
          return;
        }

        if (!toInput.value.trim()) {
          alert('Please enter destination city');
          toInput.focus();
          return;
        }

        if (!departureInput.value) {
          alert('Please select departure date');
          departureInput.focus();
          return;
        }

        // Check if round-trip and return date required
        const activeTab = document.querySelector('.trip-tab-button.active');
        const tripType = activeTab ? activeTab.getAttribute('data-trip-type') : 'round-trip';
        
        if (tripType === 'round-trip' && !returnInput.value) {
          alert('Please select return date for round-trip');
          returnInput.focus();
          return;
        }

        // Show loading state
        if (searchButton) {
          const originalHTML = searchButton.innerHTML;
          searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Searching...</span>';
          searchButton.disabled = true;

          // Simulate search (replace with actual booking page navigation)
          setTimeout(() => {
            // Gather form data
            const formData = {
              tripType: tripType,
              from: fromInput.value,
              to: toInput.value,
              departure: departureInput.value,
              return: returnInput.value || null,
              travelers: travelersInput.value,
              fareType: document.querySelector('input[name="fare-type"]:checked').value,
              currency: document.getElementById('currency-select').value,
              directFlights: document.getElementById('direct-flights').checked,
              nearbyAirports: document.getElementById('nearby-airports').checked,
              flexibleDates: document.getElementById('flexible-dates').checked
            };

            console.log('Search Data:', formData);

            // Navigate to booking page (replace with your actual booking page)
            // window.location.href = `booking.html?from=${formData.from}&to=${formData.to}&departure=${formData.departure}`;

            // For demo, show success
            searchButton.innerHTML = '<i class="fas fa-check-circle"></i><span>Found 247 Flights!</span>';
            searchButton.style.background = 'linear-gradient(135deg, #2a7d4a 0%, #1d5e33 100%)';
            
            setTimeout(() => {
              searchButton.innerHTML = originalHTML;
              searchButton.disabled = false;
              searchButton.style.background = '';
            }, 2000);
          }, 1500);
        }
      });
    }

    // Input Focus Effects
    const searchInputs = document.querySelectorAll('.search-input-field');
    searchInputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.parentElement.style.transition = 'transform 0.3s ease';
      });

      input.addEventListener('blur', function() {
        this.parentElement.style.transform = '';
      });
    });

    // Recent Searches Button
    const recentSearchesBtn = document.querySelector('.recent-searches-btn');
    if (recentSearchesBtn) {
      recentSearchesBtn.addEventListener('click', function() {
        // This would show a dropdown with recent searches
        alert('Recent Searches\n\nThis would show your last 5 searches:\n- Delhi → Mumbai\n- Mumbai → Dubai\n- Bangalore → Singapore\netc.');
      });
    }

    // Fare Type Radio Change
    const fareTypeRadios = document.querySelectorAll('input[name="fare-type"]');
    fareTypeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        console.log('Fare type changed to:', this.value);
      });
    });

    // Checkbox Change
    const checkboxes = document.querySelectorAll('.extra-option-checkbox input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        console.log(`${this.id}: ${this.checked}`);
      });
    });

  });

})();
