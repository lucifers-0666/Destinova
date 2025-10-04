document.addEventListener('DOMContentLoaded', function () {
    // --- HEADER LOGIC (from index.js for consistency) ---
    const header = document.getElementById('header-main');
    if (header) {
        header.classList.add('header-scrolled'); // Make header solid from the start
    }
    // Add other header/nav logic from index.js if needed (mobile menu, etc.)

    // --- PASSENGER FORM LOGIC ---
    const formsContainer = document.getElementById('passenger-forms-container');
    const addPassengerBtn = document.getElementById('add-passenger-btn');
    let passengerCount = 0;

    function createPassengerForm() {
        passengerCount++;
        const formHTML = `
            <div class="form-card" id="passenger-${passengerCount}">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="form-card-title !mb-0">Passenger ${passengerCount}</h3>
                    ${passengerCount > 1 ? `<button class="text-red-500 font-semibold text-sm hover:underline remove-passenger-btn" data-id="${passengerCount}">Remove</button>` : ''}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label>Title <span class="text-red-500">*</span></label>
                        <select required><option>Mr</option><option>Mrs</option><option>Ms</option></select>
                    </div>
                    <div></div> <!-- Spacer -->
                    <div>
                        <label>First Name <span class="text-red-500">*</span></label>
                        <input type="text" required placeholder="As on passport">
                    </div>
                    <div>
                        <label>Last Name <span class="text-red-500">*</span></label>
                        <input type="text" required placeholder="As on passport">
                    </div>
                    <div>
                        <label>Date of Birth <span class="text-red-500">*</span></label>
                        <input type="date" required>
                    </div>
                    <div>
                        <label>Gender <span class="text-red-500">*</span></label>
                        <div class="flex gap-4 pt-2">
                            <label class="checkbox-label"><input type="radio" name="gender-${passengerCount}" checked> Male</label>
                            <label class="checkbox-label"><input type="radio" name="gender-${passengerCount}"> Female</label>
                            <label class="checkbox-label"><input type="radio" name="gender-${passengerCount}"> Other</label>
                        </div>
                    </div>
                    <div class="md:col-span-2"><hr class="my-2"></div>
                    <div>
                        <label>Passport Number <span class="text-red-500">*</span></label>
                        <input type="text" required>
                    </div>
                    <div>
                        <label>Passport Expiry <span class="text-red-500">*</span></label>
                        <input type="date" required>
                    </div>
                    <div>
                        <label>Nationality <span class="text-red-500">*</span></label>
                        <select required><option>India</option><option>United States</option><option>United Kingdom</option></select>
                    </div>
                </div>
            </div>
        `;
        formsContainer.insertAdjacentHTML('beforeend', formHTML);
        updateSummary();
    }

    addPassengerBtn.addEventListener('click', createPassengerForm);

    formsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-passenger-btn')) {
            const passengerId = e.target.dataset.id;
            document.getElementById(`passenger-${passengerId}`).remove();
            passengerCount--;
            // Re-number remaining passengers if needed (optional)
            updateSummary();
        }
    });

    // --- ADD-ONS & SUMMARY LOGIC ---
    const extraBaggageCheckbox = document.getElementById('extra-baggage');
    const baggageQuantitySelector = document.getElementById('baggage-quantity-selector');
    const travelInsuranceCheckbox = document.getElementById('travel-insurance');

    const BAGGAGE_COST = 1500;
    const INSURANCE_COST = 500;

    function updateSummary() {
        const baseFare = 4500 * passengerCount;
        const taxes = 850 * passengerCount;
        let baggageFee = 0;
        let insuranceFee = 0;

        // Baggage Fee
        if (extraBaggageCheckbox.checked) {
            const quantity = parseInt(document.getElementById('baggage-quantity').textContent);
            baggageFee = BAGGAGE_COST * quantity;
            document.getElementById('summary-baggage-item').classList.remove('hidden');
            document.getElementById('summary-baggage-fee').textContent = `₹${baggageFee.toLocaleString()}`;
        } else {
            document.getElementById('summary-baggage-item').classList.add('hidden');
        }

        // Insurance Fee
        if (travelInsuranceCheckbox.checked) {
            insuranceFee = INSURANCE_COST * passengerCount;
            document.getElementById('summary-insurance-item').classList.remove('hidden');
            document.getElementById('summary-insurance-fee').textContent = `₹${insuranceFee.toLocaleString()}`;
        } else {
            document.getElementById('summary-insurance-item').classList.add('hidden');
        }

        // Update Totals
        const total = baseFare + taxes + baggageFee + insuranceFee;
        document.getElementById('summary-base-fare').textContent = `₹${baseFare.toLocaleString()}`;
        document.getElementById('summary-total-price').textContent = `₹${total.toLocaleString()}`;
    }

    extraBaggageCheckbox.addEventListener('change', function() {
        baggageQuantitySelector.classList.toggle('hidden', !this.checked);
        baggageQuantitySelector.classList.toggle('flex', this.checked);
        updateSummary();
    });

    travelInsuranceCheckbox.addEventListener('change', updateSummary);

    baggageQuantitySelector.addEventListener('click', function(e) {
        const quantityEl = document.getElementById('baggage-quantity');
        let quantity = parseInt(quantityEl.textContent);
        if (e.target.dataset.action === 'increase' && quantity < 5) quantity++;
        if (e.target.dataset.action === 'decrease' && quantity > 1) quantity--;
        quantityEl.textContent = quantity;
        updateSummary();
    });

    // Initial call
    createPassengerForm();
});