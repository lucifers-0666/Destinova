document.addEventListener('DOMContentLoaded', function () {
    const passengerFormsContainer = document.getElementById('passenger-forms-container');
    const addPassengerBtn = document.getElementById('add-passenger-btn');
    const primaryPassengerNameDisplay = document.getElementById('primary-passenger-name');
    const travelInsuranceCheckbox = document.getElementById('travel-insurance');

    let passengerCount = 0;
    const MAX_PASSENGERS = 9;
    const INSURANCE_COST_PER_PERSON = 500;
    const BAGGAGE_COST_PER_ITEM = 1500;

    // Function to create a new passenger form
    function createPassengerForm(isPrimary = false) {
        passengerCount++;
        const formId = `passenger-${passengerCount}`;

        const formHTML = `
            <div id="${formId}" class="bg-white p-6 rounded-xl shadow-md border border-gray-200 passenger-form">
                <div class="passenger-form-header">
                    <h4>Passenger ${passengerCount} ${isPrimary ? '(Primary)' : ''}</h4>
                    ${!isPrimary ? `<button class="remove-passenger-btn" data-form-id="${formId}"><i class="fas fa-trash-alt mr-1"></i>Remove</button>` : ''}
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Name Fields -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                        <input type="text" placeholder="Enter first name" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/50 transition passenger-name" ${isPrimary ? 'id="primary-passenger-input"' : ''}>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                        <input type="text" placeholder="Enter last name" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/50 transition">
                    </div>
                    <!-- New Fields -->
                    <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                        <div>
                            <label for="meal-${formId}" class="block text-sm font-medium text-slate-700 mb-1">Meal Preference</label>
                            <select id="meal-${formId}" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/50 transition">
                                <option>No Preference</option>
                                <option>Vegetarian</option>
                                <option>Non-Vegetarian</option>
                                <option>Vegan</option>
                                <option>Jain</option>
                            </select>
                        </div>
                        <div class="flex flex-col justify-end">
                            <div class="flex items-center justify-between mt-4">
                                <label for="wheelchair-${formId}" class="flex items-center cursor-pointer">
                                    <input type="checkbox" id="wheelchair-${formId}" class="h-4 w-4 rounded border-gray-300 text-primary-emerald focus:ring-primary-emerald">
                                    <span class="ml-2 text-sm font-medium text-text-charcoal">Wheelchair Assistance</span>
                                </label>
                            </div>
                            <div class="flex items-center justify-between mt-4">
                                <label for="baggage-${formId}" class="flex items-center cursor-pointer">
                                    <input type="checkbox" id="baggage-${formId}" class="h-4 w-4 rounded border-gray-300 text-primary-emerald focus:ring-primary-emerald extra-baggage-checkbox">
                                    <span class="ml-2 text-sm font-medium text-text-charcoal">Extra Baggage</span>
                                </label>
                                <div id="baggage-controls-${formId}" class="baggage-controls hidden">
                                    <button class="baggage-btn baggage-decrease" data-form-id="${formId}">-</button>
                                    <input type="text" id="baggage-quantity-${formId}" value="1" readonly class="baggage-quantity">
                                    <button class="baggage-btn baggage-increase" data-form-id="${formId}">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        passengerFormsContainer.insertAdjacentHTML('beforeend', formHTML);
        updateAddPassengerButton();
        updatePriceSummary();
    }

    // Update UI based on passenger count
    function updateAddPassengerButton() {
        addPassengerBtn.disabled = passengerCount >= MAX_PASSENGERS;
        if (addPassengerBtn.disabled) {
            addPassengerBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            addPassengerBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    // Event Delegation for dynamic elements
    passengerFormsContainer.addEventListener('click', function (e) {
        // Remove passenger
        if (e.target.closest('.remove-passenger-btn')) {
            const formId = e.target.closest('.remove-passenger-btn').dataset.formId;
            document.getElementById(formId).remove();
            passengerCount--;
            updateAddPassengerButton();
            updatePriceSummary();
        }

        // Baggage quantity controls
        const formId = e.target.closest('.passenger-form')?.id;
        if (!formId) return;

        const quantityInput = document.getElementById(`baggage-quantity-${formId}`);
        if (!quantityInput) return;
        let quantity = parseInt(quantityInput.value);

        if (e.target.classList.contains('baggage-decrease')) {
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity;
                updatePriceSummary();
            }
        }
        if (e.target.classList.contains('baggage-increase')) {
            if (quantity < 5) { // Max 5 extra bags
                quantity++;
                quantityInput.value = quantity;
                updatePriceSummary();
            }
        }
    });

    passengerFormsContainer.addEventListener('change', function(e) {
        // Toggle baggage controls visibility
        if (e.target.classList.contains('extra-baggage-checkbox')) {
            const formId = e.target.closest('.passenger-form').id;
            const controls = document.getElementById(`baggage-controls-${formId}`);
            if (controls) {
                controls.classList.toggle('hidden', !e.target.checked);
                controls.classList.toggle('flex', e.target.checked);
            }
            updatePriceSummary();
        }
    });

    // Add passenger button click
    addPassengerBtn.addEventListener('click', () => createPassengerForm());

    // Update primary passenger name on e-ticket
    passengerFormsContainer.addEventListener('input', function (e) {
        if (e.target.id === 'primary-passenger-input') {
            primaryPassengerNameDisplay.textContent = e.target.value || 'Enter Details';
        }
    });

    // Update price summary
    function updatePriceSummary() {
        const baseFarePerPerson = 4500;
        const taxesPerPerson = 850;

        // Base fare and taxes
        const totalBaseFare = baseFarePerPerson * passengerCount;
        const totalTaxes = taxesPerPerson * passengerCount;
        document.getElementById('base-fare').textContent = `₹${totalBaseFare.toLocaleString()}`;
        document.getElementById('taxes-fees').textContent = `₹${totalTaxes.toLocaleString()}`;
        document.getElementById('passenger-count-summary').textContent = `${passengerCount} Adult${passengerCount > 1 ? 's' : ''}`;

        // Insurance cost
        const isInsuranceAdded = travelInsuranceCheckbox.checked;
        const totalInsuranceCost = isInsuranceAdded ? INSURANCE_COST_PER_PERSON * passengerCount : 0;
        document.getElementById('insurance-cost').textContent = `₹${totalInsuranceCost.toLocaleString()}`;
        document.getElementById('insurance-summary-line').classList.toggle('hidden', !isInsuranceAdded);

        // Baggage cost
        let totalBaggageCost = 0;
        const baggageCheckboxes = document.querySelectorAll('.extra-baggage-checkbox:checked');
        baggageCheckboxes.forEach(checkbox => {
            const formId = checkbox.closest('.passenger-form').id;
            const quantity = parseInt(document.getElementById(`baggage-quantity-${formId}`).value);
            totalBaggageCost += quantity * BAGGAGE_COST_PER_ITEM;
        });
        document.getElementById('baggage-cost').textContent = `₹${totalBaggageCost.toLocaleString()}`;
        document.getElementById('baggage-summary-line').classList.toggle('hidden', totalBaggageCost === 0);

        // Total price
        const totalPrice = totalBaseFare + totalTaxes + totalInsuranceCost + totalBaggageCost;
        document.getElementById('total-price').textContent = `₹${totalPrice.toLocaleString()}`;
    }

    // Listen for insurance checkbox change
    travelInsuranceCheckbox.addEventListener('change', updatePriceSummary);

    // Initial setup
    createPassengerForm(true); // Create the first primary passenger form
    AOS.init({ once: true });

    // --- Multi-step form logic ---
    const steps = document.querySelectorAll('.step-content');
    const progressSteps = document.querySelectorAll('.progress-step');

    function goToStep(stepNumber) {
        steps.forEach(step => step.classList.add('hidden'));
        document.getElementById(`step-${stepNumber}`).classList.remove('hidden');

        progressSteps.forEach((step, index) => {
            if (index < stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        window.scrollTo(0, 0);
    }

    document.getElementById('to-step-2').addEventListener('click', () => goToStep(2));
    document.getElementById('to-step-3').addEventListener('click', () => goToStep(3));
    document.getElementById('back-to-step-1').addEventListener('click', () => goToStep(1));
    document.getElementById('back-to-step-2').addEventListener('click', () => goToStep(2));

    // --- Seat Map Generation (Demo) ---
    const seatMapContainer = document.querySelector('.seat-map-container');
    if (seatMapContainer) {
        const rows = 15;
        const seatsPerRow = 6;
        let seatHTML = '';
        for (let i = 1; i <= rows; i++) {
            seatHTML += `<div class="flex justify-center gap-2 mb-2">`;
            for (let j = 0; j < seatsPerRow; j++) {
                const seatId = `${i}${String.fromCharCode(65 + j)}`;
                let seatClass = 'bg-gray-200';
                if (i < 5) seatClass = 'bg-yellow-100 border border-yellow-300'; // Premium
                if (Math.random() > 0.7) seatClass = 'bg-slate-400'; // Taken
                seatHTML += `<div class="w-8 h-8 rounded-md ${seatClass} cursor-pointer flex items-center justify-center text-xs">${seatId}</div>`;
                if (j === 2) seatHTML += `<div class="w-8"></div>`; // Aisle
            }
            seatHTML += `</div>`;
        }
        seatMapContainer.innerHTML = seatHTML;

        seatMapContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('rounded-md') && !e.target.classList.contains('bg-slate-400')) {
                // Remove previous selection
                const currentlySelected = seatMapContainer.querySelector('.bg-primary-emerald');
                if (currentlySelected) {
                    currentlySelected.classList.remove('bg-primary-emerald', 'border-emerald-800', 'text-white');
                    // Restore original class
                    // This is a simplified restore; a real app would store original state
                    if (parseInt(currentlySelected.textContent) < 5) {
                        currentlySelected.classList.add('bg-yellow-100', 'border', 'border-yellow-300');
                    } else {
                        currentlySelected.classList.add('bg-gray-200');
                    }
                }
                // Add new selection
                e.target.classList.add('bg-primary-emerald', 'border', 'border-emerald-800', 'text-white');
            }
        });
    }
});


