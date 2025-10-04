document.addEventListener('DOMContentLoaded', function () {
    // --- HEADER LOGIC (from index.js for consistency) ---
    const header = document.getElementById('header-main');
    if (header) {
        header.classList.add('header-scrolled'); // Make header solid from the start
    }

    const paymentTabs = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const payButton = document.getElementById('pay-btn');
    const termsCheckbox = document.getElementById('terms-checkbox');
    const formInputs = document.querySelectorAll('#card-payment input');

    // --- PAYMENT METHOD SWITCHING ---
    function switchPaymentMethod(method) {
        paymentTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.method === method);
        });
        tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === `${method}-payment`);
        });
        validatePaymentForm(); // Re-validate when switching
    }

    paymentTabs.forEach(tab => {
        tab.addEventListener('click', () => switchPaymentMethod(tab.dataset.method));
    });

    // --- CARD VALIDATION & FORMATTING ---
    const cardNumberInput = document.getElementById('card-number');
    const cardIcons = document.querySelector('.card-icons');

    function formatCardNumberInput() {
        let value = cardNumberInput.value.replace(/\D/g, '').substring(0, 16);
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        cardNumberInput.value = formattedValue;
        detectCardType(value);
    }

    function detectCardType(number) {
        const cardTypes = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/
        };
        cardIcons.querySelectorAll('i').forEach(icon => icon.classList.remove('active'));
        for (const type in cardTypes) {
            if (cardTypes[type].test(number)) {
                cardIcons.querySelector(`.fa-cc-${type}`).classList.add('active');
                break;
            }
        }
    }

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumberInput);
    }

    // --- COUPON SECTION ---
    const couponToggle = document.getElementById('coupon-toggle');
    const couponInputArea = document.getElementById('coupon-input-area');

    if (couponToggle) {
        couponToggle.addEventListener('click', () => {
            couponInputArea.classList.toggle('hidden');
        });
    }

    // --- FORM VALIDATION & PAY BUTTON STATE ---
    function validatePaymentForm() {
        let isFormValid = false;
        const activeMethod = document.querySelector('.tab-btn.active').dataset.method;

        if (activeMethod === 'card') {
            const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            const cardHolder = document.getElementById('card-holder').value;
            const expiry = document.getElementById('expiry-date').value;
            const cvv = document.getElementById('cvv').value;
            // Basic validation for demo
            isFormValid = cardNumber.length >= 15 && cardHolder.length > 2 && expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/) && cvv.length >= 3;
        } else {
            // For other methods, we can assume valid once user proceeds
            isFormValid = true;
        }

        const isTermsChecked = termsCheckbox.checked;
        payButton.disabled = !(isFormValid && isTermsChecked);
    }

    // Add event listeners to all relevant inputs
    document.querySelectorAll('.payment-container input, .payment-container select').forEach(input => {
        input.addEventListener('input', validatePaymentForm);
    });
    termsCheckbox.addEventListener('change', validatePaymentForm);

    // --- PAYMENT PROCESSING ---
    function processPayment() {
        const payText = payButton.querySelector('.pay-text');
        const spinner = payButton.querySelector('.spinner');

        // Show spinner, hide text
        payText.classList.add('hidden');
        spinner.classList.remove('hidden');
        payButton.disabled = true;

        // Simulate API call
        console.log("Processing payment...");
        setTimeout(() => {
            // Simulate success
            console.log("Payment successful!");
            window.location.href = 'booking-confirmation.html?status=success';

            // To simulate an error:
            // payText.classList.remove('hidden');
            // spinner.classList.add('hidden');
            // payButton.disabled = false; // Re-enable on error
            // alert("Payment failed. Please try again.");

        }, 3000); // 3-second delay
    }

    payButton.addEventListener('click', processPayment);

    // --- LOAD BOOKING SUMMARY (from localStorage or URL) ---
    function loadBookingSummary() {
        // This is a placeholder. In a real app, you'd get this data
        // from localStorage set in the previous step or from URL params.
        const passengerCount = 1; // Example
        const baseFare = 4500;
        const taxes = 850;
        const insuranceCost = 0; // Update if selected
        const baggageCost = 0; // Update if selected

        const total = baseFare + taxes + insuranceCost + baggageCost;

        document.getElementById('summary-base-fare').textContent = `₹${baseFare.toLocaleString()}`;
        // ... update other fields ...
        document.getElementById('final-price').textContent = `₹${total.toLocaleString()}`;
    }

    // --- INITIALIZE PAGE ---
    loadBookingSummary();
    validatePaymentForm(); // Initial check
});