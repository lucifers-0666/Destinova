/**
 * ACCESSIBLE FLIGHT SEARCH WIDGET - JavaScript
 * WCAG 2.1 AA Compliant with proper ARIA announcements
 * Form validation with error states
 */

(function() {
  'use strict';

  // State management
  const state = {
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'Economy',
    tripType: 'roundtrip'
  };

  // DOM Elements
  const form = document.getElementById('flight-search-form');
  const originInput = document.getElementById('origin-input');
  const destinationInput = document.getElementById('destination-input');
  const departureDate = document.getElementById('departure-date');
  const returnDate = document.getElementById('return-date');
  const returnDateGroup = document.getElementById('return-date-group');
  
  const travellersButton = document.getElementById('travellers-button');
  const travellersDialog = document.getElementById('travellers-dialog');
  const travellersSummary = document.querySelector('.travellers-summary');
  
  const swapButton = document.querySelector('.swap-button');
  const tripTypeInputs = document.querySelectorAll('input[name="tripType"]');

  // Initialize
  function init() {
    setMinDates();
    attachEventListeners();
    updateTravellersSummary();
    
    // Focus management
    if (originInput) {
      originInput.focus();
    }
  }

  // Set minimum dates (today)
  function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    if (departureDate) departureDate.setAttribute('min', today);
    if (returnDate) returnDate.setAttribute('min', today);
  }

  // Event Listeners
  function attachEventListeners() {
    // Form submission
    form?.addEventListener('submit', handleFormSubmit);
    
    // Trip type changes
    tripTypeInputs.forEach(input => {
      input.addEventListener('change', handleTripTypeChange);
    });
    
    // Swap airports
    swapButton?.addEventListener('click', handleSwapAirports);
    
    // Date validation
    departureDate?.addEventListener('change', handleDepartureDateChange);
    returnDate?.addEventListener('change', validateReturnDate);
    
    // Travellers dialog
    travellersButton?.addEventListener('click', openTravellersDialog);
    
    // Dialog controls
    const dialogClose = travellersDialog?.querySelector('.dialog-close');
    const dialogApply = travellersDialog?.querySelector('.dialog-apply');
    
    dialogClose?.addEventListener('click', closeTravellersDialog);
    dialogApply?.addEventListener('click', closeTravellersDialog);
    
    // Counter buttons
    const counterButtons = document.querySelectorAll('.counter-btn');
    counterButtons.forEach(btn => {
      btn.addEventListener('click', handleCounterClick);
    });
    
    // Class buttons
    const classButtons = document.querySelectorAll('.class-button');
    classButtons.forEach(btn => {
      btn.addEventListener('click', handleClassClick);
    });
    
    // Close dialog on backdrop click
    travellersDialog?.addEventListener('click', (e) => {
      if (e.target === travellersDialog) {
        closeTravellersDialog();
      }
    });
    
    // ESC key to close dialog
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && travellersDialog?.hasAttribute('open')) {
        closeTravellersDialog();
      }
    });
    
    // Input validation on blur
    originInput?.addEventListener('blur', () => validateInput(originInput));
    destinationInput?.addEventListener('blur', () => validateInput(destinationInput));
  }

  // Form Submission Handler
  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Reset all errors
    clearAllErrors();
    
    let isValid = true;
    
    // Validate origin
    if (!originInput.value.trim()) {
      showError(originInput, 'Please enter a departure city or airport');
      isValid = false;
    }
    
    // Validate destination
    if (!destinationInput.value.trim()) {
      showError(destinationInput, 'Please enter a destination city or airport');
      isValid = false;
    }
    
    // Check if origin and destination are the same
    if (originInput.value.trim() && destinationInput.value.trim() && 
        originInput.value.toLowerCase() === destinationInput.value.toLowerCase()) {
      showError(destinationInput, 'Origin and destination cannot be the same');
      isValid = false;
    }
    
    // Validate departure date
    if (!departureDate.value) {
      showError(departureDate, 'Please select a departure date');
      isValid = false;
    }
    
    // Validate return date for round trip
    if (state.tripType === 'roundtrip' && !returnDate.value) {
      showError(returnDate, 'Please select a return date for round trip');
      isValid = false;
    }
    
    // Validate date logic
    if (departureDate.value && returnDate.value) {
      const depDate = new Date(departureDate.value);
      const retDate = new Date(returnDate.value);
      
      if (retDate <= depDate) {
        showError(returnDate, 'Return date must be after departure date');
        isValid = false;
      }
    }
    
    if (isValid) {
      // Create search parameters
      const searchParams = {
        origin: originInput.value.trim(),
        destination: destinationInput.value.trim(),
        departureDate: departureDate.value,
        returnDate: state.tripType === 'roundtrip' ? returnDate.value : null,
        adults: state.adults,
        children: state.children,
        infants: state.infants,
        cabinClass: state.cabinClass,
        tripType: state.tripType,
        nonstopOnly: document.getElementById('nonstop-only')?.checked || false,
        flexibleDates: document.getElementById('flexible-dates')?.checked || false,
        nearbyAirports: document.getElementById('nearby-airports')?.checked || false
      };
      
      console.log('Search Parameters:', searchParams);
      
      // Announce success to screen readers
      announceToScreenReader('Search submitted successfully. Searching for flights...');
      
      // In production, submit to server or navigate to results page
      // window.location.href = `/search?${new URLSearchParams(searchParams)}`;
      
      // Show loading state (implementation depends on your needs)
      showLoadingState();
    } else {
      // Focus first error
      const firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) {
        firstError.focus();
      }
      
      // Announce errors to screen readers
      const errorCount = form.querySelectorAll('[aria-invalid="true"]').length;
      announceToScreenReader(`Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please correct the errors and try again.`);
    }
  }

  // Show error for input
  function showError(input, message) {
    input.setAttribute('aria-invalid', 'true');
    
    const errorId = input.getAttribute('aria-describedby').split(' ').find(id => id.includes('error'));
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.textContent = '';
      
      // Create icon
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'error-icon');
      icon.setAttribute('viewBox', '0 0 20 20');
      icon.setAttribute('fill', 'currentColor');
      icon.setAttribute('aria-hidden', 'true');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z');
      icon.appendChild(path);
      
      errorElement.appendChild(icon);
      errorElement.appendChild(document.createTextNode(message));
      errorElement.removeAttribute('hidden');
    }
  }

  // Clear error for input
  function clearError(input) {
    input.setAttribute('aria-invalid', 'false');
    
    const errorId = input.getAttribute('aria-describedby').split(' ').find(id => id.includes('error'));
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.setAttribute('hidden', '');
    }
  }

  // Clear all errors
  function clearAllErrors() {
    const invalidInputs = form.querySelectorAll('[aria-invalid="true"]');
    invalidInputs.forEach(input => clearError(input));
  }

  // Validate individual input
  function validateInput(input) {
    if (!input.value.trim() && input.hasAttribute('aria-required') && input.getAttribute('aria-required') === 'true') {
      // Don't show error on blur for empty required fields unless form was submitted
      return;
    }
    
    clearError(input);
  }

  // Trip Type Change Handler
  function handleTripTypeChange(e) {
    state.tripType = e.target.value;
    
    if (state.tripType === 'oneway') {
      returnDateGroup.style.display = 'none';
      returnDate.removeAttribute('aria-required');
      returnDate.value = '';
    } else {
      returnDateGroup.style.display = 'flex';
      if (state.tripType === 'roundtrip') {
        returnDate.setAttribute('aria-required', 'true');
      }
    }
    
    announceToScreenReader(`Trip type changed to ${e.target.nextElementSibling.textContent.trim()}`);
  }

  // Swap Airports Handler
  function handleSwapAirports() {
    const tempOrigin = originInput.value;
    originInput.value = destinationInput.value;
    destinationInput.value = tempOrigin;
    
    // Clear errors when swapping
    clearError(originInput);
    clearError(destinationInput);
    
    announceToScreenReader('Origin and destination swapped');
  }

  // Departure Date Change Handler
  function handleDepartureDateChange() {
    const depDate = new Date(departureDate.value);
    
    // Update return date minimum
    if (returnDate) {
      const nextDay = new Date(depDate);
      nextDay.setDate(nextDay.getDate() + 1);
      returnDate.setAttribute('min', nextDay.toISOString().split('T')[0]);
      
      // Clear return date if it's now invalid
      if (returnDate.value) {
        const retDate = new Date(returnDate.value);
        if (retDate <= depDate) {
          returnDate.value = '';
        }
      }
    }
    
    clearError(departureDate);
  }

  // Return Date Validation
  function validateReturnDate() {
    if (departureDate.value && returnDate.value) {
      const depDate = new Date(departureDate.value);
      const retDate = new Date(returnDate.value);
      
      if (retDate <= depDate) {
        showError(returnDate, 'Return date must be after departure date');
      } else {
        clearError(returnDate);
      }
    }
  }

  // Travellers Dialog Handlers
  function openTravellersDialog() {
    travellersDialog.showModal();
    travellersButton.setAttribute('aria-expanded', 'true');
    
    // Focus first counter button
    const firstCounter = travellersDialog.querySelector('.counter-btn');
    if (firstCounter) {
      setTimeout(() => firstCounter.focus(), 100);
    }
  }

  function closeTravellersDialog() {
    travellersDialog.close();
    travellersButton.setAttribute('aria-expanded', 'false');
    updateTravellersSummary();
    travellersButton.focus();
  }

  // Counter Click Handler
  function handleCounterClick(e) {
    const button = e.currentTarget;
    const action = button.getAttribute('data-action');
    const type = button.getAttribute('data-type');
    const valueElement = document.querySelector(`.counter-value[data-type="${type}"]`);
    
    let currentValue = parseInt(valueElement.textContent);
    let newValue = currentValue;
    
    if (action === 'increase') {
      // Set maximum limits
      const maxValues = { adults: 9, children: 6, infants: 4 };
      if (currentValue < maxValues[type]) {
        newValue = currentValue + 1;
      }
    } else if (action === 'decrease') {
      // Minimum adults is 1
      const minValue = type === 'adults' ? 1 : 0;
      if (currentValue > minValue) {
        newValue = currentValue - 1;
      }
    }
    
    if (newValue !== currentValue) {
      valueElement.textContent = newValue;
      state[type] = newValue;
      
      // Announce change
      announceToScreenReader(`${type} ${action}d to ${newValue}`);
      
      // Update button states
      updateCounterButtons(type, newValue);
    }
  }

  // Update counter button disabled states
  function updateCounterButtons(type, value) {
    const decreaseBtn = document.querySelector(`.counter-btn[data-type="${type}"][data-action="decrease"]`);
    const increaseBtn = document.querySelector(`.counter-btn[data-type="${type}"][data-action="increase"]`);
    
    const minValue = type === 'adults' ? 1 : 0;
    const maxValues = { adults: 9, children: 6, infants: 4 };
    
    if (decreaseBtn) {
      decreaseBtn.disabled = value <= minValue;
    }
    
    if (increaseBtn) {
      increaseBtn.disabled = value >= maxValues[type];
    }
  }

  // Class Click Handler
  function handleClassClick(e) {
    const button = e.currentTarget;
    const className = button.getAttribute('data-class');
    
    // Remove active from all
    document.querySelectorAll('.class-button').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Add active to clicked
    button.classList.add('active');
    
    // Update state - capitalize first letter
    state.cabinClass = className.charAt(0).toUpperCase() + className.slice(1);
    if (state.cabinClass === 'Premium') {
      state.cabinClass = 'Premium Economy';
    } else if (state.cabinClass === 'First') {
      state.cabinClass = 'First Class';
    }
    
    announceToScreenReader(`Cabin class changed to ${state.cabinClass}`);
  }

  // Update Travellers Summary
  function updateTravellersSummary() {
    const total = state.adults + state.children + state.infants;
    const passengers = total === 1 ? '1 Traveller' : `${total} Travellers`;
    
    let summary = `${state.adults} Adult${state.adults > 1 ? 's' : ''}`;
    
    if (state.children > 0) {
      summary += `, ${state.children} Child${state.children > 1 ? 'ren' : ''}`;
    }
    
    if (state.infants > 0) {
      summary += `, ${state.infants} Infant${state.infants > 1 ? 's' : ''}`;
    }
    
    summary += `, ${state.cabinClass}`;
    
    travellersSummary.textContent = summary;
  }

  // Screen Reader Announcements
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Loading State (placeholder)
  function showLoadingState() {
    const searchButton = form.querySelector('.search-button');
    if (searchButton) {
      searchButton.disabled = true;
      searchButton.innerHTML = '<span>Searching...</span>';
      
      // Re-enable after delay (in production, this would be after actual search)
      setTimeout(() => {
        searchButton.disabled = false;
        searchButton.innerHTML = `
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2"/>
          </svg>
          Search Flights
        `;
      }, 2000);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
