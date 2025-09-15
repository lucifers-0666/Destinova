document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.step-content');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');

    const toStep2Btn = document.getElementById('to-step-2');
    const toStep3Btn = document.getElementById('to-step-3');
    const backToStep1Btn = document.getElementById('back-to-step-1');
    const backToStep2Btn = document.getElementById('back-to-step-2');

    let currentStep = 1;

    function updateProgress() {
        progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            if (stepNum < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        progressLines.forEach((line, index) => {
            if (index < currentStep - 1) {
                line.style.backgroundColor = '#1d5e33'; // primary-emerald
            } else {
                line.style.backgroundColor = '#a0aec0'; // gray-500
            }
        });
    }

    function showStep(stepNumber) {
        steps.forEach(step => step.classList.add('hidden'));
        document.getElementById(`step-${stepNumber}`).classList.remove('hidden');
        currentStep = stepNumber;
        updateProgress();
        window.scrollTo(0, 0);
    }

    if (toStep2Btn) {
        toStep2Btn.addEventListener('click', () => showStep(2));
    }
    if (toStep3Btn) {
        toStep3Btn.addEventListener('click', () => showStep(3));
    }
    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => showStep(1));
    }
    if (backToStep2Btn) {
        backToStep2Btn.addEventListener('click', () => showStep(2));
    }

    // --- Seat Selection Logic ---
    const seatMapContainer = document.querySelector('.seat-map-container');
    if (seatMapContainer) {
        const rows = 15;
        const seatsPerRow = 6;
        const aisleColumn = 3;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < seatsPerRow + 1; j++) {
                const seat = document.createElement('div');
                if (j === aisleColumn) {
                    seat.className = 'seat-aisle';
                    seat.textContent = i + 1;
                } else {
                    seat.className = 'seat';
                    const seatChar = String.fromCharCode(65 + (j > aisleColumn ? j - 1 : j));
                    seat.textContent = `${i + 1}${seatChar}`;

                    // Mock seat status
                    const random = Math.random();
                    if (random < 0.2) {
                        seat.classList.add('taken');
                    } else if (random < 0.4) {
                        seat.classList.add('premium');
                    } else {
                        seat.classList.add('available');
                    }

                    seat.addEventListener('click', () => {
                        if (seat.classList.contains('available') || seat.classList.contains('premium')) {
                            document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));
                            seat.classList.add('selected');
                        }
                    });
                }
                seatMapContainer.appendChild(seat);
            }
        }
    }

    // Initialize
    showStep(1);

    // --- Dynamic Passenger Form Logic ---
    const passengerFormsContainer = document.getElementById('passenger-forms-container');
    const addPassengerBtn = document.getElementById('add-passenger-btn');
    const primaryPassengerNameSpan = document.getElementById('primary-passenger-name');
    let passengerCount = 0;

    // List of countries for the dropdown
    const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
    const countryOptions = countries.map(country => `<option value="${country}">${country}</option>`).join('');

    function createPassengerForm(passengerNumber) {
        const formId = `passenger-${passengerNumber}`;
        const isFirstPassenger = passengerNumber === 1;

        const formHTML = `
            <div id="${formId}" class="passenger-form-block bg-white p-6 rounded-xl shadow-md border border-gray-200 relative transition-all duration-300">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-semibold text-text-charcoal">Passenger ${passengerNumber}</h3>
                    ${!isFirstPassenger ? '<button type="button" class="remove-passenger-btn text-red-500 hover:text-red-700 font-semibold text-sm"><i class="fas fa-trash-alt mr-1"></i> Remove</button>' : ''}
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                        <label for="${formId}-name" class="block text-sm font-medium text-slate-700 mb-1">Full Name (as on Passport/ID)</label>
                        <input type="text" id="${formId}-name" name="passenger_name[]" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/50 transition" placeholder="e.g., John David Doe">
                    </div>
                    <div>
                        <label for="${formId}-dob" class="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                        <input type="date" id="${formId}-dob" name="passenger_dob[]" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/50 transition">
                    </div>
                    <div>
                        <label for="${formId}-gender" class="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                        <select id="${formId}-gender" name="passenger_gender[]" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/50 transition">
                            <option>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div class="md:col-span-2">
                        <label for="${formId}-nationality" class="block text-sm font-medium text-slate-700 mb-1">Nationality</label>
                        <select id="${formId}-nationality" name="passenger_nationality[]" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/50 transition">
                            <option>Select Nationality</option>
                            ${countryOptions}
                        </select>
                    </div>
                </div>

                <h4 class="text-lg font-semibold text-text-charcoal mt-8 mb-4 border-t pt-4">Passport Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label for="${formId}-passport" class="block text-sm font-medium text-slate-700 mb-1">Passport Number</label>
                        <input type="text" id="${formId}-passport" name="passenger_passport[]" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/50 transition">
                    </div>
                    <div>
                        <label for="${formId}-passport-expiry" class="block text-sm font-medium text-slate-700 mb-1">Passport Expiry</label>
                        <input type="date" id="${formId}-passport-expiry" name="passenger_passport_expiry[]" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/50 transition">
                    </div>
                    <div>
                        <label for="${formId}-passport-country" class="block text-sm font-medium text-slate-700 mb-1">Issuing Country</label>
                        <select id="${formId}-passport-country" name="passenger_passport_country[]" class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-emerald focus:ring-2 focus:ring-primary-emerald/50 transition">
                            <option>Select Country</option>
                            ${countryOptions}
                        </select>
                    </div>
                </div>
            </div>
        `;
        return formHTML;
    }

    function addPassenger() {
        passengerCount++;
        const formHTML = createPassengerForm(passengerCount);
        passengerFormsContainer.insertAdjacentHTML('beforeend', formHTML);
    }

    function updatePassengerNumbers() {
        const forms = passengerFormsContainer.querySelectorAll('.passenger-form-block');
        forms.forEach((form, index) => {
            const passengerNumber = index + 1;
            form.querySelector('h3').textContent = `Passenger ${passengerNumber}`;
            form.id = `passenger-${passengerNumber}`;
            // You might want to update all input IDs and labels as well if strict form association is needed
        });
        passengerCount = forms.length;
    }

    if (addPassengerBtn && passengerFormsContainer) {
        addPassengerBtn.addEventListener('click', addPassenger);

        passengerFormsContainer.addEventListener('click', function(e) {
            if (e.target.closest('.remove-passenger-btn')) {
                const formBlock = e.target.closest('.passenger-form-block');
                formBlock.style.transform = 'scale(0.95)';
                formBlock.style.opacity = '0';
                setTimeout(() => {
                    formBlock.remove();
                    updatePassengerNumbers();
                }, 300);
            }
        });

        // Update E-ticket with primary passenger name
        passengerFormsContainer.addEventListener('input', function(e) {
            if (e.target.id === 'passenger-1-name' && primaryPassengerNameSpan) {
                primaryPassengerNameSpan.textContent = e.target.value || 'Primary Booker';
            }
        });

        // Add the first passenger form on initial load
        addPassenger();
    }
});