/* ═══════════════════════════════════════════════════════════════════════════════
   PREMIUM OVERLAPPING HERO SEARCH - JAVASCRIPT INTERACTIONS
   Handles: Trip Type Toggle, Fare Type Selector, Travelers & Class Dropdown,
   Extra Search Options, Currency Selector, Premium Animations
   ═══════════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    
    // ═══════════════════════════════════════════════════════════════════
    // STATE MANAGEMENT - 4 PASSENGER CATEGORIES
    // ═══════════════════════════════════════════════════════════════════
    
    const searchState = {
      tripType: 'round-trip',
      fareType: 'regular',
      infants: 0,      // 0-2 years
      children: 0,     // 2-12 years
      adults: 1,       // 18-59 years (default 1)
      seniors: 0,      // 60+ years
      travelClass: 'economy',
      directFlights: false,
      nearbyAirports: false,
      flexibleDates: false,
      currency: 'INR'
    };

    // ═══════════════════════════════════════════════════════════════════
    // DOM ELEMENTS - COMPACT MODAL DESIGN
    // ═══════════════════════════════════════════════════════════════════
    
    const elements = {
      tripTypeButtons: document.querySelectorAll('.trip-type-btn-compact'),
      fareTypeButtons: document.querySelectorAll('.fare-tab'),
      returnField: document.getElementById('return-date-field'),
      passengersTrigger: document.getElementById('passengers-class-trigger'),
      passengersModal: document.getElementById('passengers-modal'),
      passengersDisplay: document.getElementById('passengers-display'),
      passengersDoneBtn: document.getElementById('modal-done-btn'),
      modalOverlay: document.querySelector('.modal-overlay'),
      modalClose: document.querySelector('.modal-close'),
      counterButtons: document.querySelectorAll('.counter-btn'),
      classButtons: document.querySelectorAll('.class-option'),
      directFlightsCheckbox: document.getElementById('direct-flights'),
      nearbyAirportsCheckbox: document.getElementById('nearby-airports'),
      flexibleDatesCheckbox: document.getElementById('flexible-dates'),
      currencySelect: document.getElementById('currency-select'),
      searchForm: document.getElementById('overlapping-search-form'),
      searchButton: document.querySelector('.compact-search-button')
    };

    // ═══════════════════════════════════════════════════════════════════
    // TRIP TYPE TOGGLE HANDLER
    // ═══════════════════════════════════════════════════════════════════
    
    function initTripTypeToggle() {
      if (!elements.tripTypeButtons.length) return;

      elements.tripTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remove active from all
          elements.tripTypeButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active to clicked
          this.classList.add('active');
          
          // Update state
          searchState.tripType = this.getAttribute('data-trip-type');
          
          // Show/hide return date based on trip type
          if (elements.returnField) {
            if (searchState.tripType === 'one-way') {
              elements.returnField.style.display = 'none';
              const returnInput = elements.returnField.querySelector('input');
              if (returnInput) returnInput.removeAttribute('required');
            } else if (searchState.tripType === 'round-trip') {
              elements.returnField.style.display = 'block';
              const returnInput = elements.returnField.querySelector('input');
              if (returnInput) returnInput.setAttribute('required', 'required');
            } else if (searchState.tripType === 'multi-city') {
              elements.returnField.style.display = 'block';
              // For multi-city, we'd need additional fields (future enhancement)
              console.log('Multi-city selected - requires additional implementation');
            }
          }
          
          // Add micro-interaction
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = '';
          }, 150);
        });
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // FARE TYPE SELECTOR HANDLER
    // ═══════════════════════════════════════════════════════════════════
    
    function initFareTypeSelector() {
      if (!elements.fareTypeButtons.length) return;

      elements.fareTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remove active from all
          elements.fareTypeButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active to clicked
          this.classList.add('active');
          
          // Update state
          searchState.fareType = this.getAttribute('data-fare-type');
          
          // Add micro-interaction
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = '';
          }, 150);
          
          console.log('Fare type selected:', searchState.fareType);
        });
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // PASSENGERS & CLASS MODAL HANDLER (COMPACT DESIGN)
    // ═══════════════════════════════════════════════════════════════════
    
    function initPassengersModal() {
      if (!elements.passengersTrigger || !elements.passengersModal) return;

      // Open modal
      elements.passengersTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
      });

      // Close with overlay
      if (elements.modalOverlay) {
        elements.modalOverlay.addEventListener('click', function() {
          closeModal();
        });
      }

      // Close with X button
      if (elements.modalClose) {
        elements.modalClose.addEventListener('click', function() {
          closeModal();
        });
      }

      // Done button
      if (elements.passengersDoneBtn) {
        elements.passengersDoneBtn.addEventListener('click', function() {
          closeModal();
          updatePassengersDisplay();
        });
      }

      function openModal() {
        elements.passengersModal.classList.add('active');
        elements.passengersTrigger.classList.add('active');
        elements.passengersTrigger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
      }

      function closeModal() {
        elements.passengersModal.classList.remove('active');
        elements.passengersTrigger.classList.remove('active');
        elements.passengersTrigger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore scroll
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // PASSENGER COUNTER HANDLERS (4 CATEGORIES)
    // ═══════════════════════════════════════════════════════════════════
    
    function initPassengerCounters() {
      if (!elements.counterButtons.length) return;

      elements.counterButtons.forEach(button => {
        button.addEventListener('click', function() {
          const action = this.getAttribute('data-action');
          const passengerType = this.getAttribute('data-category');
          const countElement = document.getElementById(`${passengerType}-count`);
          
          if (!countElement) return;

          let currentValue = parseInt(countElement.textContent);

          if (action === 'increase') {
            // Maximum limits for each category
            const maxLimits = { infants: 4, children: 6, adults: 9, seniors: 9 };
            if (currentValue < maxLimits[passengerType]) {
              currentValue++;
            }
          } else if (action === 'decrease') {
            // Minimum limits (at least 1 adult OR 1 senior required)
            if (passengerType === 'adults' || passengerType === 'seniors') {
              const otherAdultType = passengerType === 'adults' ? 'seniors' : 'adults';
              const otherCount = searchState[otherAdultType];
              // Allow decrease only if there's at least 1 adult-type passenger total
              if (currentValue > 0 && (currentValue > 1 || otherCount >= 1)) {
                currentValue--;
              }
            } else {
              // Children and infants can go to 0
              if (currentValue > 0) {
                currentValue--;
              }
            }
          }

          // Update display
          countElement.textContent = currentValue;
          
          // Update state
          searchState[passengerType] = currentValue;
          
          // Update button states for all passenger types
          updateCounterButtonStates('infants', searchState.infants);
          updateCounterButtonStates('children', searchState.children);
          updateCounterButtonStates('adults', searchState.adults);
          updateCounterButtonStates('seniors', searchState.seniors);
          
          // Add animation
          countElement.style.transform = 'scale(1.2)';
          setTimeout(() => {
            countElement.style.transform = 'scale(1)';
          }, 200);
        });
      });

      // Initialize button states
      updateCounterButtonStates('infants', 0);
      updateCounterButtonStates('children', 0);
      updateCounterButtonStates('adults', 1);
      updateCounterButtonStates('seniors', 0);
    }

    function updateCounterButtonStates(passengerType, value) {
      const decreaseBtn = document.querySelector(`.counter-btn[data-action="decrease"][data-category="${passengerType}"]`);
      const increaseBtn = document.querySelector(`.counter-btn[data-action="increase"][data-category="${passengerType}"]`);
      
      if (!decreaseBtn || !increaseBtn) return;

      // Handle decrease button state
      if (passengerType === 'adults' || passengerType === 'seniors') {
        const totalAdultTypes = searchState.adults + searchState.seniors;
        // Disable if this is the last adult-type passenger
        if (totalAdultTypes <= 1 && value <= 1) {
          decreaseBtn.disabled = true;
        } else if (value <= 0) {
          decreaseBtn.disabled = true;
        } else {
          decreaseBtn.disabled = false;
        }
      } else {
        // Children and infants can go to 0
        decreaseBtn.disabled = (value <= 0);
      }

      // Disable increase if at maximum
      const maxLimits = { infants: 4, children: 6, adults: 9, seniors: 9 };
      increaseBtn.disabled = (value >= maxLimits[passengerType]);
    }

    // ═══════════════════════════════════════════════════════════════════
    // CLASS SELECTION HANDLER
    // ═══════════════════════════════════════════════════════════════════
    
    function initClassSelector() {
      if (!elements.classButtons.length) return;

      elements.classButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remove active from all
          elements.classButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active to clicked
          this.classList.add('active');
          
          // Update state
          searchState.travelClass = this.getAttribute('data-class');
          
          // Update display immediately
          updatePassengersDisplay();
          
          // Add micro-interaction
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = '';
          }, 150);
        });
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // UPDATE PASSENGERS DISPLAY (4 CATEGORIES)
    // ═══════════════════════════════════════════════════════════════════
    
    function updatePassengersDisplay() {
      if (!elements.passengersDisplay) return;

      const totalPassengers = searchState.infants + searchState.children + searchState.adults + searchState.seniors;
      let passengerParts = [];

      // Build display text for non-zero categories
      if (searchState.infants > 0) {
        passengerParts.push(`${searchState.infants} Infant${searchState.infants > 1 ? 's' : ''}`);
      }
      if (searchState.children > 0) {
        passengerParts.push(`${searchState.children} Child${searchState.children > 1 ? 'ren' : ''}`);
      }
      if (searchState.adults > 0) {
        passengerParts.push(`${searchState.adults} Adult${searchState.adults > 1 ? 's' : ''}`);
      }
      if (searchState.seniors > 0) {
        passengerParts.push(`${searchState.seniors} Senior${searchState.seniors > 1 ? 's' : ''}`);
      }

      const passengerText = passengerParts.join(', ');

      // Format class name
      const classNames = {
        'economy': 'Economy',
        'premium-economy': 'Premium Economy',
        'business': 'Business',
        'first': 'First Class'
      };

      elements.passengersDisplay.textContent = `${passengerText}, ${classNames[searchState.travelClass]}`;
    }

    // ═══════════════════════════════════════════════════════════════════
    // EXTRA SEARCH OPTIONS HANDLERS
    // ═══════════════════════════════════════════════════════════════════
    
    function initExtraOptions() {
      if (elements.directFlightsCheckbox) {
        elements.directFlightsCheckbox.addEventListener('change', function() {
          searchState.directFlights = this.checked;
          console.log('Direct flights only:', searchState.directFlights);
        });
      }

      if (elements.nearbyAirportsCheckbox) {
        elements.nearbyAirportsCheckbox.addEventListener('change', function() {
          searchState.nearbyAirports = this.checked;
          console.log('Search nearby airports:', searchState.nearbyAirports);
        });
      }

      if (elements.flexibleDatesCheckbox) {
        elements.flexibleDatesCheckbox.addEventListener('change', function() {
          searchState.flexibleDates = this.checked;
          console.log('Flexible dates (±3 days):', searchState.flexibleDates);
        });
      }

      if (elements.currencySelect) {
        elements.currencySelect.addEventListener('change', function() {
          searchState.currency = this.value;
          console.log('Currency changed to:', searchState.currency);
          
          // Add visual feedback
          this.style.transform = 'scale(1.05)';
          setTimeout(() => {
            this.style.transform = 'scale(1)';
          }, 200);
        });
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // FORM SUBMISSION HANDLER
    // ═══════════════════════════════════════════════════════════════════
    
    function initFormSubmission() {
      if (!elements.searchForm) return;

      elements.searchForm.addEventListener('submit', function(e) {
        // Allow form to submit normally, but add our state data
        
        // Add hidden inputs for our custom state
        const stateInputs = [
          { name: 'tripType', value: searchState.tripType },
          { name: 'fareType', value: searchState.fareType },
          { name: 'infants', value: searchState.infants },
          { name: 'children', value: searchState.children },
          { name: 'adults', value: searchState.adults },
          { name: 'seniors', value: searchState.seniors },
          { name: 'travelClass', value: searchState.travelClass },
          { name: 'directFlights', value: searchState.directFlights },
          { name: 'nearbyAirports', value: searchState.nearbyAirports },
          { name: 'flexibleDates', value: searchState.flexibleDates },
          { name: 'currency', value: searchState.currency }
        ];

        stateInputs.forEach(input => {
          const hiddenInput = document.createElement('input');
          hiddenInput.type = 'hidden';
          hiddenInput.name = input.name;
          hiddenInput.value = input.value;
          this.appendChild(hiddenInput);
        });

        // Add loading state to button
        if (elements.searchButton) {
          elements.searchButton.style.opacity = '0.7';
          elements.searchButton.style.pointerEvents = 'none';
          
          const originalText = elements.searchButton.querySelector('span').textContent;
          elements.searchButton.querySelector('span').textContent = 'Searching...';
        }

        console.log('Form submitted with state:', searchState);
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // INPUT FIELD ENHANCEMENTS (Glow on Focus)
    // ═══════════════════════════════════════════════════════════════════
    
    function initInputEnhancements() {
      const inputs = document.querySelectorAll('.overlapping-search-input');
      
      inputs.forEach(input => {
        input.addEventListener('focus', function() {
          this.parentElement.style.boxShadow = '0 0 0 4px rgba(29, 94, 51, 0.15)';
          this.parentElement.style.transition = 'box-shadow 0.3s ease';
        });

        input.addEventListener('blur', function() {
          this.parentElement.style.boxShadow = '';
        });
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // DATE CONSTRAINTS
    // ═══════════════════════════════════════════════════════════════════
    
    function initDateConstraints() {
      const departureInput = document.getElementById('overlapping-departure');
      const returnInput = document.getElementById('overlapping-return');

      if (departureInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        departureInput.setAttribute('min', today);

        // When departure changes, update return minimum
        departureInput.addEventListener('change', function() {
          if (returnInput) {
            returnInput.setAttribute('min', this.value);
            
            // Clear return if it's before departure
            if (returnInput.value && returnInput.value < this.value) {
              returnInput.value = '';
            }
          }
        });
      }

      if (returnInput) {
        const today = new Date().toISOString().split('T')[0];
        returnInput.setAttribute('min', today);
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // INITIALIZE ALL FEATURES
    // ═══════════════════════════════════════════════════════════════════
    
    function init() {
      console.log('🎯 Initializing Compact Premium Search Features...');
      
      initTripTypeToggle();
      initFareTypeSelector();
      initPassengersModal();
      initPassengerCounters();
      initClassSelector();
      initExtraOptions();
      initFormSubmission();
      initInputEnhancements();
      initDateConstraints();
      
      // Initialize display
      updatePassengersDisplay();
      
      console.log('✅ Compact Premium Search initialized successfully!');
      console.log('Initial state:', searchState);
    }

    // Run initialization
    init();

  }); // End DOMContentLoaded

})();
