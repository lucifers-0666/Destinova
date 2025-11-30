/**
 * 🧳 DESTINOVA PASSENGER DETAILS
 * Handle passenger information collection, add-ons, and proceed to payment
 */

'use strict';

// ============================================
// STATE MANAGEMENT
// ============================================

const PassengerState = {
    flight: null,
    searchParams: null,
    passengers: [],
    selectedAddons: [],
    pricing: {
        baseFare: 0,
        taxes: 0,
        addons: 0,
        total: 0
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🧳 Passenger Details Page Initialized');
    
    // Load selected flight data
    loadFlightData();
    
    // Initialize passenger forms
    initializePassengerForms();
    
    // Setup add-on interactions
    setupAddonListeners();
    
    // Pre-fill contact info if user is logged in
    prefillUserContact();
    
    // Calculate and display pricing
    calculatePricing();
});

// ============================================
// DATA LOADING
// ============================================

/**
 * Load flight data from localStorage
 */
function loadFlightData() {
    const storedData = localStorage.getItem('destinova_selected_flight');
    
    if (!storedData) {
        console.error('No flight data found');
        showFlightNotFoundError();
        return;
    }
    
    try {
        const bookingData = JSON.parse(storedData);
        PassengerState.flight = bookingData.flight;
        PassengerState.searchParams = bookingData.searchParams;
        
        // Update summary UI
        updateFlightSummary();
        
    } catch (error) {
        console.error('Error parsing flight data:', error);
        showFlightNotFoundError();
    }
}

/**
 * Update flight summary in sidebar
 */
function updateFlightSummary() {
    const { flight, searchParams } = PassengerState;
    
    if (!flight) return;
    
    // Airline info
    document.getElementById('summary-airline-logo').src = 
        flight.airlineLogo || 'https://via.placeholder.com/36';
    document.getElementById('summary-airline-name').textContent = flight.airline;
    document.getElementById('summary-flight-number').textContent = flight.flightNumber;
    
    // Times
    const depTime = new Date(flight.departureTime);
    const arrTime = new Date(flight.arrivalTime);
    
    document.getElementById('summary-dep-time').textContent = 
        depTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('summary-arr-time').textContent = 
        arrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Route
    document.getElementById('summary-origin').textContent = flight.origin?.code || 'DEL';
    document.getElementById('summary-destination').textContent = flight.destination?.code || 'BOM';
    
    // Duration
    const hours = Math.floor(flight.duration / 60);
    const minutes = flight.duration % 60;
    document.getElementById('summary-duration').textContent = `${hours}h ${minutes}m`;
    
    // Date
    document.getElementById('summary-date').textContent = depTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    // Passenger count
    const passengerCount = searchParams?.passengers || 1;
    document.getElementById('passenger-count').textContent = passengerCount;
}

/**
 * Show error when flight data not found
 */
function showFlightNotFoundError() {
    const main = document.querySelector('.main-content');
    main.innerHTML = `
        <div class="section-card" style="grid-column: 1 / -1; text-align: center; padding: 60px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #f0b429; margin-bottom: 20px;"></i>
            <h2 style="margin-bottom: 16px;">Flight Not Selected</h2>
            <p style="color: #666; margin-bottom: 24px;">
                Please select a flight from the search results to continue.
            </p>
            <a href="flight-results.html" class="proceed-btn" style="display: inline-flex; width: auto; padding: 14px 28px; text-decoration: none;">
                <i class="fas fa-search"></i> Search Flights
            </a>
        </div>
    `;
}

// ============================================
// PASSENGER FORMS
// ============================================

/**
 * Initialize passenger forms based on passenger count
 */
function initializePassengerForms() {
    const passengerCount = PassengerState.searchParams?.passengers || 1;
    const container = document.getElementById('passengers-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < passengerCount; i++) {
        PassengerState.passengers.push({
            title: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            nationality: 'IN',
            passportNumber: '',
            passportExpiry: ''
        });
        
        container.appendChild(createPassengerForm(i));
    }
}

/**
 * Create a passenger form
 */
function createPassengerForm(index) {
    const card = document.createElement('div');
    card.className = 'passenger-card';
    card.dataset.passengerIndex = index;
    
    card.innerHTML = `
        <div class="passenger-card-header">
            <h3 class="passenger-card-title">
                <i class="fas fa-user"></i> Passenger ${index + 1} ${index === 0 ? '(Primary)' : ''}
            </h3>
        </div>
        
        <form class="passenger-form" data-passenger="${index}">
            <div class="form-row">
                <div class="form-group" style="max-width: 100px;">
                    <label>Title <span class="required">*</span></label>
                    <select name="title" required onchange="updatePassengerData(${index}, 'title', this.value)">
                        <option value="">--</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>First Name <span class="required">*</span></label>
                    <input type="text" name="firstName" required placeholder="As per ID"
                           onchange="updatePassengerData(${index}, 'firstName', this.value)">
                </div>
                <div class="form-group">
                    <label>Last Name <span class="required">*</span></label>
                    <input type="text" name="lastName" required placeholder="As per ID"
                           onchange="updatePassengerData(${index}, 'lastName', this.value)">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Date of Birth <span class="required">*</span></label>
                    <input type="date" name="dateOfBirth" required
                           max="${new Date().toISOString().split('T')[0]}"
                           onchange="updatePassengerData(${index}, 'dateOfBirth', this.value)">
                </div>
                <div class="form-group">
                    <label>Nationality <span class="required">*</span></label>
                    <select name="nationality" required onchange="updatePassengerData(${index}, 'nationality', this.value)">
                        <option value="IN" selected>India</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="AE">UAE</option>
                        <option value="SG">Singapore</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Gender <span class="required">*</span></label>
                    <select name="gender" required onchange="updatePassengerData(${index}, 'gender', this.value)">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row passport-fields" style="display: none;">
                <div class="form-group">
                    <label>Passport Number</label>
                    <input type="text" name="passportNumber" placeholder="A12345678"
                           onchange="updatePassengerData(${index}, 'passportNumber', this.value)">
                </div>
                <div class="form-group">
                    <label>Passport Expiry</label>
                    <input type="date" name="passportExpiry" 
                           min="${new Date().toISOString().split('T')[0]}"
                           onchange="updatePassengerData(${index}, 'passportExpiry', this.value)">
                </div>
            </div>
        </form>
    `;
    
    return card;
}

/**
 * Update passenger data in state
 */
function updatePassengerData(index, field, value) {
    if (PassengerState.passengers[index]) {
        PassengerState.passengers[index][field] = value;
    }
}

/**
 * Pre-fill contact information for logged-in users
 */
async function prefillUserContact() {
    // Check if user is logged in
    const token = localStorage.getItem('destinova_token');
    if (!token) return;
    
    try {
        // Get user profile from API or localStorage
        const userStr = localStorage.getItem('destinova_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            
            if (user.email) {
                document.getElementById('contact-email').value = user.email;
            }
            if (user.phone) {
                document.getElementById('contact-phone').value = user.phone;
            }
            
            // Also pre-fill first passenger if available
            if (user.firstName && PassengerState.passengers[0]) {
                const firstForm = document.querySelector('.passenger-form[data-passenger="0"]');
                if (firstForm) {
                    const firstNameInput = firstForm.querySelector('input[name="firstName"]');
                    const lastNameInput = firstForm.querySelector('input[name="lastName"]');
                    
                    if (firstNameInput && user.firstName) {
                        firstNameInput.value = user.firstName;
                        PassengerState.passengers[0].firstName = user.firstName;
                    }
                    if (lastNameInput && user.lastName) {
                        lastNameInput.value = user.lastName;
                        PassengerState.passengers[0].lastName = user.lastName;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error pre-filling contact info:', error);
    }
}

// ============================================
// ADD-ONS
// ============================================

/**
 * Setup add-on click listeners
 */
function setupAddonListeners() {
    const addonItems = document.querySelectorAll('.addon-item');
    
    addonItems.forEach(item => {
        item.addEventListener('click', () => {
            toggleAddon(item);
        });
    });
}

/**
 * Toggle add-on selection
 */
function toggleAddon(item) {
    const addonName = item.dataset.addon;
    const addonPrice = parseInt(item.dataset.price);
    
    item.classList.toggle('selected');
    
    if (item.classList.contains('selected')) {
        // Add to selected addons
        if (!PassengerState.selectedAddons.find(a => a.name === addonName)) {
            PassengerState.selectedAddons.push({
                name: addonName,
                price: addonPrice
            });
        }
    } else {
        // Remove from selected addons
        PassengerState.selectedAddons = PassengerState.selectedAddons.filter(
            a => a.name !== addonName
        );
    }
    
    // Recalculate pricing
    calculatePricing();
}

// ============================================
// PRICING
// ============================================

/**
 * Calculate and display pricing
 */
function calculatePricing() {
    const { flight, searchParams, selectedAddons } = PassengerState;
    const passengerCount = searchParams?.passengers || 1;
    
    // Base fare
    const pricePerPerson = flight?.currentPrice || flight?.price?.economy || 5000;
    const baseFare = pricePerPerson * passengerCount;
    
    // Taxes (approx 15%)
    const taxes = Math.round(baseFare * 0.15);
    
    // Add-ons
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0) * passengerCount;
    
    // Total
    const total = baseFare + taxes + addonsTotal;
    
    // Update state
    PassengerState.pricing = {
        baseFare,
        taxes,
        addons: addonsTotal,
        total
    };
    
    // Update UI
    document.getElementById('base-fare').textContent = `₹${baseFare.toLocaleString()}`;
    document.getElementById('taxes-fees').textContent = `₹${taxes.toLocaleString()}`;
    
    if (addonsTotal > 0) {
        document.getElementById('addons-row').style.display = 'flex';
        document.getElementById('addons-price').textContent = `₹${addonsTotal.toLocaleString()}`;
    } else {
        document.getElementById('addons-row').style.display = 'none';
    }
    
    document.getElementById('total-amount').textContent = `₹${total.toLocaleString()}`;
}

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Validate all forms before proceeding
 */
function validateForms() {
    let isValid = true;
    const errors = [];
    
    // Validate passenger forms
    const passengerForms = document.querySelectorAll('.passenger-form');
    passengerForms.forEach((form, index) => {
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
                errors.push(`Passenger ${index + 1}: ${field.name} is required`);
            } else {
                field.classList.remove('error');
            }
        });
    });
    
    // Validate contact form
    const email = document.getElementById('contact-email');
    const phone = document.getElementById('contact-phone');
    
    if (!email.value.trim() || !isValidEmail(email.value)) {
        email.classList.add('error');
        isValid = false;
        errors.push('Valid email address is required');
    } else {
        email.classList.remove('error');
    }
    
    if (!phone.value.trim() || !isValidPhone(phone.value)) {
        phone.classList.add('error');
        isValid = false;
        errors.push('Valid phone number is required');
    } else {
        phone.classList.remove('error');
    }
    
    if (!isValid) {
        // Show first error
        alert(errors[0] || 'Please fill in all required fields');
    }
    
    return isValid;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone format
 */
function isValidPhone(phone) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone.replace(/\s/g, ''));
}

// ============================================
// PROCEED TO PAYMENT
// ============================================

/**
 * Proceed to payment page
 */
function proceedToPayment() {
    // Validate forms
    if (!validateForms()) {
        return;
    }
    
    // Collect all data
    const bookingData = {
        flight: PassengerState.flight,
        searchParams: PassengerState.searchParams,
        passengers: PassengerState.passengers,
        addons: PassengerState.selectedAddons,
        contact: {
            email: document.getElementById('contact-email').value,
            phone: document.getElementById('contact-phone').value,
            altPhone: document.getElementById('contact-alt-phone').value
        },
        pricing: PassengerState.pricing,
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('destinova_booking_data', JSON.stringify(bookingData));
    
    // Update the selected flight data as well
    localStorage.setItem('destinova_selected_flight', JSON.stringify({
        flight: PassengerState.flight,
        searchParams: PassengerState.searchParams
    }));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.updatePassengerData = updatePassengerData;
window.proceedToPayment = proceedToPayment;
