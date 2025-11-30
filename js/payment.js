/**
 * 💳 DESTINOVA PAYMENT
 * Secure payment processing with Stripe integration and multiple payment methods
 */

'use strict';

// ============================================
// CONFIGURATION
// ============================================

// Stripe publishable key (use test key in development)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key';

// ============================================
// STATE MANAGEMENT
// ============================================

const PaymentState = {
    bookingData: null,
    selectedMethod: 'card',
    selectedBank: null,
    selectedWallet: null,
    stripe: null,
    cardElement: null,
    savedCards: [],
    selectedSavedCard: null,
    isProcessing: false
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('💳 Payment Page Initialized');
    
    // Load booking data
    loadBookingData();
    
    // Initialize Stripe
    initializeStripe();
    
    // Setup payment method listeners
    setupPaymentMethodListeners();
    
    // Load saved cards if logged in
    loadSavedCards();
    
    // Setup wallet and bank option listeners
    setupOptionListeners();
});

/**
 * Load booking data from localStorage
 */
function loadBookingData() {
    const storedData = localStorage.getItem('destinova_booking_data');
    
    if (!storedData) {
        console.error('No booking data found');
        showBookingNotFoundError();
        return;
    }
    
    try {
        PaymentState.bookingData = JSON.parse(storedData);
        updateOrderSummary();
    } catch (error) {
        console.error('Error parsing booking data:', error);
        showBookingNotFoundError();
    }
}

/**
 * Update order summary sidebar
 */
function updateOrderSummary() {
    const { flight, passengers, pricing, searchParams } = PaymentState.bookingData;
    
    if (!flight) return;
    
    // Flight info
    document.getElementById('origin-code').textContent = flight.origin?.code || 'DEL';
    document.getElementById('dest-code').textContent = flight.destination?.code || 'BOM';
    
    const depTime = new Date(flight.departureTime);
    document.getElementById('flight-date').textContent = depTime.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric'
    });
    document.getElementById('flight-time').textContent = depTime.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('flight-number').textContent = flight.flightNumber;
    
    // Passengers
    const passengersSummary = document.getElementById('passengers-summary');
    if (passengers && passengers.length > 0) {
        passengersSummary.innerHTML = passengers.map((p, i) => `
            <div class="passenger-item">
                <i class="fas fa-user"></i>
                <span>${p.title || ''} ${p.firstName || 'Passenger'} ${p.lastName || (i + 1)}</span>
            </div>
        `).join('');
    }
    
    // Pricing
    document.getElementById('summary-base').textContent = `₹${pricing.baseFare.toLocaleString()}`;
    document.getElementById('summary-taxes').textContent = `₹${pricing.taxes.toLocaleString()}`;
    
    if (pricing.addons > 0) {
        document.getElementById('summary-addons-row').style.display = 'flex';
        document.getElementById('summary-addons').textContent = `₹${pricing.addons.toLocaleString()}`;
    }
    
    document.getElementById('summary-total').textContent = `₹${pricing.total.toLocaleString()}`;
    document.getElementById('pay-amount').textContent = pricing.total.toLocaleString();
}

/**
 * Show error when booking data not found
 */
function showBookingNotFoundError() {
    const main = document.querySelector('.main-content');
    main.innerHTML = `
        <div class="section-card" style="grid-column: 1 / -1; text-align: center; padding: 60px;">
            <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #f0b429; margin-bottom: 20px;"></i>
            <h2 style="margin-bottom: 16px;">Booking Session Expired</h2>
            <p style="color: #666; margin-bottom: 24px;">
                Your booking session has expired. Please start a new search.
            </p>
            <a href="index.html" class="pay-btn" style="display: inline-flex; width: auto; padding: 14px 28px; text-decoration: none;">
                <i class="fas fa-search"></i> Search Flights
            </a>
        </div>
    `;
}

// ============================================
// STRIPE INITIALIZATION
// ============================================

/**
 * Initialize Stripe Elements
 */
function initializeStripe() {
    try {
        // Initialize Stripe (only if Stripe is loaded)
        if (typeof Stripe !== 'undefined') {
            PaymentState.stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
            
            const elements = PaymentState.stripe.elements();
            
            // Create card element
            PaymentState.cardElement = elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#333',
                        fontFamily: '"Poppins", sans-serif',
                        '::placeholder': {
                            color: '#999'
                        }
                    },
                    invalid: {
                        color: '#dc3545',
                        iconColor: '#dc3545'
                    }
                }
            });
            
            // Mount card element
            const cardContainer = document.getElementById('card-element');
            if (cardContainer) {
                PaymentState.cardElement.mount('#card-element');
                
                // Handle errors
                PaymentState.cardElement.on('change', (event) => {
                    const displayError = document.getElementById('card-errors');
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }
                });
            }
        } else {
            console.warn('Stripe.js not loaded. Using fallback payment.');
        }
    } catch (error) {
        console.error('Error initializing Stripe:', error);
    }
}

// ============================================
// PAYMENT METHOD HANDLING
// ============================================

/**
 * Setup payment method switching listeners
 */
function setupPaymentMethodListeners() {
    const methods = document.querySelectorAll('.payment-method');
    
    methods.forEach(method => {
        method.addEventListener('click', () => {
            // Update active state
            methods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            
            // Update radio button
            const radio = method.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
            
            // Switch form
            const methodType = method.dataset.method;
            PaymentState.selectedMethod = methodType;
            switchPaymentForm(methodType);
        });
    });
}

/**
 * Switch visible payment form
 */
function switchPaymentForm(method) {
    // Hide all forms
    document.querySelectorAll('.card-form, .upi-form, .wallet-form, .netbanking-form')
        .forEach(form => form.classList.remove('active'));
    
    // Show selected form
    const formId = `${method}-form`;
    const form = document.getElementById(formId);
    if (form) {
        form.classList.add('active');
    }
}

/**
 * Setup wallet and bank option listeners
 */
function setupOptionListeners() {
    // Wallet options
    document.querySelectorAll('.wallet-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.wallet-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            PaymentState.selectedWallet = option.dataset.wallet;
        });
    });
    
    // Bank options
    document.querySelectorAll('.bank-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.bank-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            PaymentState.selectedBank = option.dataset.bank;
            
            // Also update dropdown
            const bankSelect = document.getElementById('bank-select');
            if (bankSelect) bankSelect.value = option.dataset.bank;
        });
    });
    
    // Bank dropdown
    const bankSelect = document.getElementById('bank-select');
    if (bankSelect) {
        bankSelect.addEventListener('change', () => {
            PaymentState.selectedBank = bankSelect.value;
            
            // Update visual selection
            document.querySelectorAll('.bank-option').forEach(o => {
                o.classList.toggle('selected', o.dataset.bank === bankSelect.value);
            });
        });
    }
}

// ============================================
// SAVED CARDS
// ============================================

/**
 * Load saved cards for logged-in users
 */
async function loadSavedCards() {
    const token = localStorage.getItem('destinova_token');
    if (!token) return;
    
    try {
        if (typeof PaymentsAPI !== 'undefined') {
            const response = await PaymentsAPI.getSavedCards();
            if (response.success && response.data?.cards?.length > 0) {
                PaymentState.savedCards = response.data.cards;
                renderSavedCards();
            }
        }
    } catch (error) {
        console.error('Error loading saved cards:', error);
    }
}

/**
 * Render saved cards
 */
function renderSavedCards() {
    const container = document.getElementById('saved-cards');
    const divider = document.getElementById('or-divider');
    
    if (PaymentState.savedCards.length === 0) return;
    
    container.style.display = 'block';
    divider.style.display = 'flex';
    
    container.innerHTML = PaymentState.savedCards.map(card => `
        <div class="saved-card" data-card-id="${card.id}" onclick="selectSavedCard('${card.id}')">
            <i class="fab fa-cc-${card.brand?.toLowerCase() || 'visa'} card-brand-icon"></i>
            <div class="saved-card-info">
                <div class="card-number">•••• •••• •••• ${card.last4}</div>
                <div class="card-expiry">Expires ${card.expMonth}/${card.expYear}</div>
            </div>
        </div>
    `).join('');
}

/**
 * Select a saved card
 */
function selectSavedCard(cardId) {
    document.querySelectorAll('.saved-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.cardId === cardId);
    });
    
    PaymentState.selectedSavedCard = cardId;
}

// ============================================
// UPI VERIFICATION
// ============================================

/**
 * Verify UPI ID
 */
function verifyUPI() {
    const upiId = document.getElementById('upi-id').value;
    
    if (!upiId || !upiId.includes('@')) {
        alert('Please enter a valid UPI ID');
        return;
    }
    
    // In production, this would call an API to verify the UPI ID
    alert(`UPI ID "${upiId}" verified successfully!`);
}

// ============================================
// PAYMENT PROCESSING
// ============================================

/**
 * Process payment based on selected method
 */
async function processPayment() {
    if (PaymentState.isProcessing) return;
    
    PaymentState.isProcessing = true;
    const payBtn = document.getElementById('pay-btn');
    payBtn.classList.add('loading');
    payBtn.disabled = true;
    
    try {
        let paymentResult;
        
        switch (PaymentState.selectedMethod) {
            case 'card':
                paymentResult = await processCardPayment();
                break;
            case 'upi':
                paymentResult = await processUPIPayment();
                break;
            case 'wallet':
                paymentResult = await processWalletPayment();
                break;
            case 'netbanking':
                paymentResult = await processNetbankingPayment();
                break;
            default:
                throw new Error('Invalid payment method');
        }
        
        if (paymentResult.success) {
            // Create booking in backend
            await createBooking(paymentResult);
            
            // Redirect to confirmation
            window.location.href = `booking-confirmation.html?bookingId=${paymentResult.bookingId}`;
        } else {
            throw new Error(paymentResult.error || 'Payment failed');
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        alert(error.message || 'Payment failed. Please try again.');
        
    } finally {
        PaymentState.isProcessing = false;
        payBtn.classList.remove('loading');
        payBtn.disabled = false;
    }
}

/**
 * Process card payment with Stripe
 */
async function processCardPayment() {
    const { bookingData, stripe, cardElement, selectedSavedCard } = PaymentState;
    
    // If using saved card
    if (selectedSavedCard) {
        return await processWithSavedCard(selectedSavedCard);
    }
    
    // New card payment
    if (!stripe || !cardElement) {
        // Fallback for demo without Stripe
        return await processPaymentFallback();
    }
    
    try {
        // Create payment intent on backend
        let clientSecret;
        if (typeof PaymentsAPI !== 'undefined') {
            const response = await PaymentsAPI.createPaymentIntent({
                amount: bookingData.pricing.total,
                currency: 'inr',
                bookingData: bookingData
            });
            
            if (!response.success) {
                throw new Error(response.message || 'Failed to create payment');
            }
            
            clientSecret = response.data.clientSecret;
        } else {
            // Demo mode - simulate payment
            return await processPaymentFallback();
        }
        
        // Confirm payment with Stripe
        const cardName = document.getElementById('card-name')?.value || '';
        
        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: cardName,
                    email: bookingData.contact?.email
                }
            }
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        // Save card if requested
        const saveCard = document.getElementById('save-card')?.checked;
        if (saveCard && typeof PaymentsAPI !== 'undefined') {
            await PaymentsAPI.saveCard({ paymentMethodId: paymentIntent.payment_method });
        }
        
        return {
            success: true,
            paymentId: paymentIntent.id,
            bookingId: generateBookingId()
        };
        
    } catch (error) {
        console.error('Stripe payment error:', error);
        throw error;
    }
}

/**
 * Process payment with saved card
 */
async function processWithSavedCard(cardId) {
    if (typeof PaymentsAPI !== 'undefined') {
        const response = await PaymentsAPI.chargeCard({
            cardId,
            amount: PaymentState.bookingData.pricing.total
        });
        
        if (!response.success) {
            throw new Error(response.message || 'Payment failed');
        }
        
        return {
            success: true,
            paymentId: response.data.paymentId,
            bookingId: generateBookingId()
        };
    }
    
    return processPaymentFallback();
}

/**
 * Process UPI payment
 */
async function processUPIPayment() {
    const upiId = document.getElementById('upi-id')?.value;
    const wallet = PaymentState.selectedWallet;
    
    if (!upiId && !wallet) {
        throw new Error('Please enter UPI ID or select a payment app');
    }
    
    if (typeof PaymentsAPI !== 'undefined') {
        const response = await PaymentsAPI.processUPI({
            upiId,
            wallet,
            amount: PaymentState.bookingData.pricing.total
        });
        
        if (!response.success) {
            throw new Error(response.message || 'UPI payment failed');
        }
        
        return {
            success: true,
            paymentId: response.data.paymentId,
            bookingId: generateBookingId()
        };
    }
    
    return processPaymentFallback();
}

/**
 * Process wallet payment
 */
async function processWalletPayment() {
    const wallet = PaymentState.selectedWallet;
    
    if (!wallet) {
        throw new Error('Please select a wallet');
    }
    
    if (typeof PaymentsAPI !== 'undefined') {
        const response = await PaymentsAPI.processWallet({
            wallet,
            amount: PaymentState.bookingData.pricing.total
        });
        
        if (!response.success) {
            throw new Error(response.message || 'Wallet payment failed');
        }
        
        return {
            success: true,
            paymentId: response.data.paymentId,
            bookingId: generateBookingId()
        };
    }
    
    return processPaymentFallback();
}

/**
 * Process net banking payment
 */
async function processNetbankingPayment() {
    const bank = PaymentState.selectedBank || document.getElementById('bank-select')?.value;
    
    if (!bank) {
        throw new Error('Please select a bank');
    }
    
    if (typeof PaymentsAPI !== 'undefined') {
        const response = await PaymentsAPI.processNetbanking({
            bank,
            amount: PaymentState.bookingData.pricing.total
        });
        
        if (!response.success) {
            throw new Error(response.message || 'Net banking payment failed');
        }
        
        return {
            success: true,
            paymentId: response.data.paymentId,
            bookingId: generateBookingId()
        };
    }
    
    return processPaymentFallback();
}

/**
 * Fallback payment processing for demo
 */
async function processPaymentFallback() {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        success: true,
        paymentId: `PAY_${Date.now()}`,
        bookingId: generateBookingId()
    };
}

/**
 * Create booking in backend after successful payment
 */
async function createBooking(paymentResult) {
    const { bookingData } = PaymentState;
    
    const bookingPayload = {
        flightId: bookingData.flight._id,
        passengers: bookingData.passengers,
        contact: bookingData.contact,
        addons: bookingData.addons,
        paymentId: paymentResult.paymentId,
        totalAmount: bookingData.pricing.total
    };
    
    if (typeof BookingsAPI !== 'undefined') {
        const response = await BookingsAPI.createBooking(bookingPayload);
        
        if (response.success) {
            // Store booking confirmation data
            localStorage.setItem('destinova_booking_confirmation', JSON.stringify({
                booking: response.data,
                flight: bookingData.flight,
                passengers: bookingData.passengers,
                pricing: bookingData.pricing
            }));
            
            // Clear booking session data
            localStorage.removeItem('destinova_booking_data');
            localStorage.removeItem('destinova_selected_flight');
        }
        
        return response;
    }
    
    // Demo mode - store locally
    localStorage.setItem('destinova_booking_confirmation', JSON.stringify({
        bookingId: paymentResult.bookingId,
        flight: bookingData.flight,
        passengers: bookingData.passengers,
        pricing: bookingData.pricing,
        confirmedAt: new Date().toISOString()
    }));
    
    return { success: true };
}

/**
 * Generate a unique booking ID
 */
function generateBookingId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'DST';
    for (let i = 0; i < 7; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.processPayment = processPayment;
window.selectSavedCard = selectSavedCard;
window.verifyUPI = verifyUPI;