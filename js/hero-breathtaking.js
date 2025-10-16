// Hero Section JavaScript - Comprehensive Interactive System
// Author: AI Assistant
// Purpose: Power all interactive features for the breathtaking hero section

(function() {
    'use strict';

    // ==============================
    // 1. INITIALIZATION & CONFIGURATION
    // ==============================
    
    // Configuration object
    const CONFIG = {
        // API endpoints (mock for now)
        ENDPOINTS: {
            airports: '/api/airports',
            flights: '/api/flights/search',
            autocomplete: '/api/airports/autocomplete'
        },
        
        // Animation durations (in milliseconds)
        ANIMATIONS: {
            swap: 400,
            modal: 300,
            counter: 2000,
            particle: 8000
        },
        
        // Form validation rules
        VALIDATION: {
            minDate: new Date(),
            maxDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year ahead
            minPassengers: 1,
            maxPassengers: 9
        },
        
        // Popular airports data
        POPULAR_AIRPORTS: [
            { code: 'NYC', name: 'New York', city: 'New York', country: 'USA' },
            { code: 'LAX', name: 'Los Angeles', city: 'Los Angeles', country: 'USA' },
            { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK' },
            { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'France' },
            { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
            { code: 'NRT', name: 'Tokyo Narita', city: 'Tokyo', country: 'Japan' },
            { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore' },
            { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' }
        ]
    };

    // State management
    const state = {
        currentTripType: 'round-trip',
        departureDate: null,
        returnDate: null,
        passengers: {
            adults: 1,
            children: 0,
            infants: 0
        },
        selectedClass: 'economy',
        fromAirport: null,
        toAirport: null,
        isSwapping: false,
        modalsOpen: {
            datePickerModal: false,
            travelersModal: false,
            autocompleteModal: false
        }
    };

    // ==============================
    // 2. DOM UTILITIES & HELPERS
    // ==============================
    
    function $(selector, context = document) {
        return context.querySelector(selector);
    }
    
    function $$(selector, context = document) {
        return context.querySelectorAll(selector);
    }
    
    function createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }
    
    function formatDate(date) {
        if (!date) return '';
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ==============================
    // 3. TRIP TYPE MANAGEMENT
    // ==============================
    
    function initializeTripTypes() {
        const tripButtons = $$('.trip-type-button');
        
        tripButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all buttons
                tripButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Update state
                state.currentTripType = button.dataset.trip;
                
                // Toggle return date visibility
                toggleReturnDateVisibility();
                
                // Update form validation
                updateFormValidation();
            });
        });
    }
    
    function toggleReturnDateVisibility() {
        const returnDateGroup = $('.date-group.return-date');
        
        if (state.currentTripType === 'one-way') {
            returnDateGroup.style.opacity = '0.5';
            returnDateGroup.style.pointerEvents = 'none';
            state.returnDate = null;
            updateDateDisplay('return', null);
        } else {
            returnDateGroup.style.opacity = '1';
            returnDateGroup.style.pointerEvents = 'auto';
        }
    }

    // ==============================
    // 4. AIRPORT AUTOCOMPLETE SYSTEM
    // ==============================
    
    function initializeAutocomplete() {
        const fromInput = $('#fromInput');
        const toInput = $('#toInput');
        
        if (fromInput) {
            setupAutocompleteInput(fromInput, 'from');
        }
        
        if (toInput) {
            setupAutocompleteInput(toInput, 'to');
        }
    }
    
    function setupAutocompleteInput(input, type) {
        let autocompleteContainer = input.nextElementSibling;
        
        if (!autocompleteContainer || !autocompleteContainer.classList.contains('autocomplete-dropdown')) {
            autocompleteContainer = createElement('div', 'autocomplete-dropdown');
            input.parentNode.insertBefore(autocompleteContainer, input.nextSibling);
        }
        
        const debouncedSearch = debounce((query) => {
            searchAirports(query, autocompleteContainer, type);
        }, 300);
        
        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query.length >= 2) {
                debouncedSearch(query);
                showAutocompleteDropdown(autocompleteContainer);
            } else {
                hideAutocompleteDropdown(autocompleteContainer);
            }
        });
        
        input.addEventListener('focus', () => {
            if (input.value.length >= 2) {
                showAutocompleteDropdown(autocompleteContainer);
            }
        });
        
        input.addEventListener('blur', (e) => {
            // Delay hiding to allow for clicks on dropdown items
            setTimeout(() => {
                if (!autocompleteContainer.contains(document.activeElement)) {
                    hideAutocompleteDropdown(autocompleteContainer);
                }
            }, 150);
        });
        
        // Keyboard navigation
        input.addEventListener('keydown', (e) => {
            handleAutocompleteKeyboard(e, autocompleteContainer, type);
        });
    }
    
    function searchAirports(query, container, type) {
        // Mock search - in real implementation, this would call an API
        const results = CONFIG.POPULAR_AIRPORTS.filter(airport => 
            airport.name.toLowerCase().includes(query.toLowerCase()) ||
            airport.city.toLowerCase().includes(query.toLowerCase()) ||
            airport.code.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6);
        
        displayAutocompleteResults(results, container, type);
    }
    
    function displayAutocompleteResults(results, container, type) {
        container.innerHTML = '';
        
        if (results.length === 0) {
            container.innerHTML = '<div class="autocomplete-item no-results">No airports found</div>';
            return;
        }
        
        results.forEach((airport, index) => {
            const item = createElement('div', 'autocomplete-item');
            item.innerHTML = `
                <div class="airport-info">
                    <div class="airport-main">
                        <span class="airport-code">${airport.code}</span>
                        <span class="airport-name">${airport.name}</span>
                    </div>
                    <div class="airport-location">${airport.city}, ${airport.country}</div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                selectAirport(airport, type);
                hideAutocompleteDropdown(container);
            });
            
            if (index === 0) {
                item.classList.add('highlighted');
            }
            
            container.appendChild(item);
        });
    }
    
    function selectAirport(airport, type) {
        const input = type === 'from' ? $('#fromInput') : $('#toInput');
        input.value = `${airport.city} (${airport.code})`;
        
        if (type === 'from') {
            state.fromAirport = airport;
        } else {
            state.toAirport = airport;
        }
        
        updateFormValidation();
        
        // Add visual feedback
        input.parentNode.classList.add('has-selection');
        
        // Focus next input if this was "from"
        if (type === 'from') {
            $('#toInput').focus();
        }
    }
    
    function showAutocompleteDropdown(container) {
        container.classList.add('show');
        container.style.maxHeight = '300px';
    }
    
    function hideAutocompleteDropdown(container) {
        container.classList.remove('show');
        container.style.maxHeight = '0';
    }
    
    function handleAutocompleteKeyboard(e, container, type) {
        const items = container.querySelectorAll('.autocomplete-item:not(.no-results)');
        let highlighted = container.querySelector('.autocomplete-item.highlighted');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (!highlighted) {
                    if (items[0]) items[0].classList.add('highlighted');
                } else {
                    highlighted.classList.remove('highlighted');
                    const next = highlighted.nextElementSibling || items[0];
                    next.classList.add('highlighted');
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (!highlighted) {
                    if (items[items.length - 1]) items[items.length - 1].classList.add('highlighted');
                } else {
                    highlighted.classList.remove('highlighted');
                    const prev = highlighted.previousElementSibling || items[items.length - 1];
                    prev.classList.add('highlighted');
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                if (highlighted && !highlighted.classList.contains('no-results')) {
                    highlighted.click();
                }
                break;
                
            case 'Escape':
                hideAutocompleteDropdown(container);
                break;
        }
    }

    // ==============================
    // 5. SWAP FUNCTIONALITY
    // ==============================
    
    function initializeSwapButton() {
        const swapButton = $('.swap-button');
        
        if (swapButton) {
            swapButton.addEventListener('click', (e) => {
                e.preventDefault();
                performSwap();
            });
        }
    }
    
    function performSwap() {
        if (state.isSwapping) return;
        
        state.isSwapping = true;
        
        const fromInput = $('#fromInput');
        const toInput = $('#toInput');
        const swapButton = $('.swap-button');
        
        // Add animation class
        swapButton.classList.add('rotating');
        
        // Swap values with animation
        setTimeout(() => {
            // Swap input values
            const tempValue = fromInput.value;
            fromInput.value = toInput.value;
            toInput.value = tempValue;
            
            // Swap state
            const tempAirport = state.fromAirport;
            state.fromAirport = state.toAirport;
            state.toAirport = tempAirport;
            
            // Update visual states
            updateInputSelectionStates();
            updateFormValidation();
            
            // Remove animation class
            setTimeout(() => {
                swapButton.classList.remove('rotating');
                state.isSwapping = false;
            }, CONFIG.ANIMATIONS.swap);
            
        }, CONFIG.ANIMATIONS.swap / 2);
    }
    
    function updateInputSelectionStates() {
        const fromGroup = $('#fromInput').parentNode;
        const toGroup = $('#toInput').parentNode;
        
        fromGroup.classList.toggle('has-selection', !!state.fromAirport);
        toGroup.classList.toggle('has-selection', !!state.toAirport);
    }

    // ==============================
    // 6. DATE PICKER SYSTEM
    // ==============================
    
    function initializeDatePicker() {
        const departureDateButton = $('.departure-date .date-display');
        const returnDateButton = $('.return-date .date-display');
        
        if (departureDateButton) {
            departureDateButton.addEventListener('click', () => {
                openDatePickerModal('departure');
            });
        }
        
        if (returnDateButton) {
            returnDateButton.addEventListener('click', () => {
                if (state.currentTripType !== 'one-way') {
                    openDatePickerModal('return');
                }
            });
        }
        
        // Initialize with today's date for departure
        const today = new Date();
        state.departureDate = new Date(today.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
        updateDateDisplay('departure', state.departureDate);
        
        if (state.currentTripType === 'round-trip') {
            state.returnDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // Week later
            updateDateDisplay('return', state.returnDate);
        }
    }
    
    function openDatePickerModal(type) {
        let modal = $('#datePickerModal');
        
        if (!modal) {
            modal = createDatePickerModal();
            document.body.appendChild(modal);
        }
        
        const currentDate = type === 'departure' ? state.departureDate : state.returnDate;
        populateDatePickerModal(modal, type, currentDate);
        showModal(modal);
        state.modalsOpen.datePickerModal = true;
    }
    
    function createDatePickerModal() {
        const modal = createElement('div', 'modal-overlay', `
            <div class="modal-content date-picker-modal">
                <div class="modal-header">
                    <h3 class="modal-title">Select Date</h3>
                    <button class="modal-close" aria-label="Close modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="date-picker-content">
                    <div class="date-picker-nav">
                        <button class="date-nav-btn prev-month" aria-label="Previous month">
                            <i data-lucide="chevron-left"></i>
                        </button>
                        <span class="current-month"></span>
                        <button class="date-nav-btn next-month" aria-label="Next month">
                            <i data-lucide="chevron-right"></i>
                        </button>
                    </div>
                    <div class="date-picker-grid">
                        <div class="date-picker-weekdays">
                            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                        </div>
                        <div class="date-picker-days"></div>
                    </div>
                    <div class="date-picker-actions">
                        <button class="btn btn-secondary modal-cancel">Cancel</button>
                        <button class="btn btn-primary modal-confirm">Confirm</button>
                    </div>
                </div>
            </div>
        `);
        
        modal.id = 'datePickerModal';
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => hideModal(modal));
        modal.querySelector('.modal-cancel').addEventListener('click', () => hideModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal(modal);
        });
        
        return modal;
    }
    
    function populateDatePickerModal(modal, type, selectedDate) {
        const currentDate = selectedDate || new Date();
        const today = new Date();
        
        modal.dataset.dateType = type;
        modal.dataset.selectedDate = selectedDate ? selectedDate.toISOString() : '';
        
        renderCalendar(modal, currentDate, today, type);
        
        // Update confirm button handler
        const confirmButton = modal.querySelector('.modal-confirm');
        confirmButton.onclick = () => {
            const selectedDateStr = modal.dataset.selectedDate;
            if (selectedDateStr) {
                const date = new Date(selectedDateStr);
                if (type === 'departure') {
                    state.departureDate = date;
                    updateDateDisplay('departure', date);
                    
                    // Auto-update return date if it's before departure
                    if (state.returnDate && state.returnDate <= date) {
                        state.returnDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                        updateDateDisplay('return', state.returnDate);
                    }
                } else {
                    state.returnDate = date;
                    updateDateDisplay('return', date);
                }
                
                updateFormValidation();
                hideModal(modal);
            }
        };
    }
    
    function renderCalendar(modal, currentDate, today, type) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        modal.querySelector('.current-month').textContent = `${monthNames[month]} ${year}`;
        
        // Update navigation handlers
        const prevBtn = modal.querySelector('.prev-month');
        const nextBtn = modal.querySelector('.next-month');
        
        prevBtn.onclick = () => {
            const newDate = new Date(year, month - 1, 1);
            renderCalendar(modal, newDate, today, type);
        };
        
        nextBtn.onclick = () => {
            const newDate = new Date(year, month + 1, 1);
            renderCalendar(modal, newDate, today, type);
        };
        
        // Generate calendar days
        const daysContainer = modal.querySelector('.date-picker-days');
        daysContainer.innerHTML = '';
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            daysContainer.appendChild(createElement('div', 'date-cell empty'));
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayElement = createElement('div', 'date-cell', day.toString());
            
            // Add appropriate classes
            if (date < today) {
                dayElement.classList.add('disabled');
            } else if (type === 'return' && state.departureDate && date <= state.departureDate) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.classList.add('selectable');
                dayElement.addEventListener('click', () => {
                    // Remove previous selection
                    modal.querySelectorAll('.date-cell.selected').forEach(cell => {
                        cell.classList.remove('selected');
                    });
                    
                    // Add selection to clicked date
                    dayElement.classList.add('selected');
                    modal.dataset.selectedDate = date.toISOString();
                });
            }
            
            // Highlight current selection
            const selectedDateStr = modal.dataset.selectedDate;
            if (selectedDateStr) {
                const selectedDate = new Date(selectedDateStr);
                if (selectedDate.toDateString() === date.toDateString()) {
                    dayElement.classList.add('selected');
                }
            }
            
            daysContainer.appendChild(dayElement);
        }
    }
    
    function updateDateDisplay(type, date) {
        const selector = type === 'departure' ? '.departure-date .date-display' : '.return-date .date-display';
        const displayElement = $(selector);
        
        if (displayElement) {
            if (date) {
                displayElement.innerHTML = `
                    <span class="date-text">${formatDate(date)}</span>
                    <i data-lucide="calendar" class="date-icon"></i>
                `;
                displayElement.classList.add('has-date');
            } else {
                displayElement.innerHTML = `
                    <span class="date-text">${type === 'departure' ? 'Departure' : 'Return'}</span>
                    <i data-lucide="calendar" class="date-icon"></i>
                `;
                displayElement.classList.remove('has-date');
            }
            
            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    // ==============================
    // 7. TRAVELERS SELECTOR
    // ==============================
    
    function initializeTravelersSelector() {
        const travelersButton = $('.travelers-selector');
        
        if (travelersButton) {
            travelersButton.addEventListener('click', () => {
                openTravelersModal();
            });
        }
        
        updateTravelersDisplay();
    }
    
    function openTravelersModal() {
        let modal = $('#travelersModal');
        
        if (!modal) {
            modal = createTravelersModal();
            document.body.appendChild(modal);
        }
        
        populateTravelersModal(modal);
        showModal(modal);
        state.modalsOpen.travelersModal = true;
    }
    
    function createTravelersModal() {
        const modal = createElement('div', 'modal-overlay', `
            <div class="modal-content travelers-modal">
                <div class="modal-header">
                    <h3 class="modal-title">Travelers</h3>
                    <button class="modal-close" aria-label="Close modal">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="travelers-content">
                    <div class="traveler-group">
                        <div class="traveler-info">
                            <div class="traveler-type">Adults</div>
                            <div class="traveler-desc">12+ years</div>
                        </div>
                        <div class="traveler-controls">
                            <button class="traveler-btn decrease" data-type="adults" aria-label="Decrease adults">−</button>
                            <span class="traveler-count adults-count">1</span>
                            <button class="traveler-btn increase" data-type="adults" aria-label="Increase adults">+</button>
                        </div>
                    </div>
                    
                    <div class="traveler-group">
                        <div class="traveler-info">
                            <div class="traveler-type">Children</div>
                            <div class="traveler-desc">2-11 years</div>
                        </div>
                        <div class="traveler-controls">
                            <button class="traveler-btn decrease" data-type="children" aria-label="Decrease children">−</button>
                            <span class="traveler-count children-count">0</span>
                            <button class="traveler-btn increase" data-type="children" aria-label="Increase children">+</button>
                        </div>
                    </div>
                    
                    <div class="traveler-group">
                        <div class="traveler-info">
                            <div class="traveler-type">Infants</div>
                            <div class="traveler-desc">Under 2 years</div>
                        </div>
                        <div class="traveler-controls">
                            <button class="traveler-btn decrease" data-type="infants" aria-label="Decrease infants">−</button>
                            <span class="traveler-count infants-count">0</span>
                            <button class="traveler-btn increase" data-type="infants" aria-label="Increase infants">+</button>
                        </div>
                    </div>
                    
                    <div class="travelers-actions">
                        <button class="btn btn-secondary modal-cancel">Cancel</button>
                        <button class="btn btn-primary modal-confirm">Done</button>
                    </div>
                </div>
            </div>
        `);
        
        modal.id = 'travelersModal';
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => hideModal(modal));
        modal.querySelector('.modal-cancel').addEventListener('click', () => hideModal(modal));
        modal.querySelector('.modal-confirm').addEventListener('click', () => {
            updateTravelersDisplay();
            updateFormValidation();
            hideModal(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal(modal);
        });
        
        // Add traveler control listeners
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('traveler-btn')) {
                handleTravelerChange(e.target);
            }
        });
        
        return modal;
    }
    
    function populateTravelersModal(modal) {
        modal.querySelector('.adults-count').textContent = state.passengers.adults;
        modal.querySelector('.children-count').textContent = state.passengers.children;
        modal.querySelector('.infants-count').textContent = state.passengers.infants;
        
        updateTravelerButtons(modal);
    }
    
    function handleTravelerChange(button) {
        const type = button.dataset.type;
        const isIncrease = button.classList.contains('increase');
        const modal = button.closest('.travelers-modal');
        
        if (isIncrease) {
            if (getTotalPassengers() < CONFIG.VALIDATION.maxPassengers) {
                state.passengers[type]++;
            }
        } else {
            if (type === 'adults') {
                if (state.passengers.adults > CONFIG.VALIDATION.minPassengers) {
                    state.passengers.adults--;
                }
            } else {
                if (state.passengers[type] > 0) {
                    state.passengers[type]--;
                }
            }
        }
        
        // Update display
        modal.querySelector(`.${type}-count`).textContent = state.passengers[type];
        updateTravelerButtons(modal);
    }
    
    function updateTravelerButtons(modal) {
        const totalPassengers = getTotalPassengers();
        
        // Adults controls
        const adultsDecrease = modal.querySelector('.traveler-btn.decrease[data-type="adults"]');
        adultsDecrease.disabled = state.passengers.adults <= CONFIG.VALIDATION.minPassengers;
        
        const adultsIncrease = modal.querySelector('.traveler-btn.increase[data-type="adults"]');
        adultsIncrease.disabled = totalPassengers >= CONFIG.VALIDATION.maxPassengers;
        
        // Children controls
        const childrenDecrease = modal.querySelector('.traveler-btn.decrease[data-type="children"]');
        childrenDecrease.disabled = state.passengers.children <= 0;
        
        const childrenIncrease = modal.querySelector('.traveler-btn.increase[data-type="children"]');
        childrenIncrease.disabled = totalPassengers >= CONFIG.VALIDATION.maxPassengers;
        
        // Infants controls
        const infantsDecrease = modal.querySelector('.traveler-btn.decrease[data-type="infants"]');
        infantsDecrease.disabled = state.passengers.infants <= 0;
        
        const infantsIncrease = modal.querySelector('.traveler-btn.increase[data-type="infants"]');
        infantsIncrease.disabled = totalPassengers >= CONFIG.VALIDATION.maxPassengers || 
                                    state.passengers.infants >= state.passengers.adults;
    }
    
    function getTotalPassengers() {
        return state.passengers.adults + state.passengers.children + state.passengers.infants;
    }
    
    function updateTravelersDisplay() {
        const travelersButton = $('.travelers-selector');
        if (!travelersButton) return;
        
        const total = getTotalPassengers();
        const text = total === 1 ? '1 Traveler' : `${total} Travelers`;
        
        const textElement = travelersButton.querySelector('.travelers-text');
        if (textElement) {
            textElement.textContent = text;
        }
        
        travelersButton.classList.add('has-selection');
    }

    // ==============================
    // 8. MODAL SYSTEM
    // ==============================
    
    function showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstFocusable = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }
        
        // Escape key handler
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                hideModal(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        
        document.addEventListener('keydown', escapeHandler);
    }
    
    function hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Update state
        if (modal.id === 'datePickerModal') {
            state.modalsOpen.datePickerModal = false;
        } else if (modal.id === 'travelersModal') {
            state.modalsOpen.travelersModal = false;
        }
        
        // Reinitialize Lucide icons if needed
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // ==============================
    // 9. FORM VALIDATION & SUBMISSION
    // ==============================
    
    function initializeFormValidation() {
        const searchButton = $('.search-button');
        
        if (searchButton) {
            searchButton.addEventListener('click', (e) => {
                e.preventDefault();
                handleFormSubmission();
            });
        }
        
        // Initial validation
        updateFormValidation();
    }
    
    function updateFormValidation() {
        const isValid = validateForm();
        const searchButton = $('.search-button');
        
        if (searchButton) {
            searchButton.disabled = !isValid;
            searchButton.classList.toggle('disabled', !isValid);
        }
    }
    
    function validateForm() {
        // Check required fields
        if (!state.fromAirport || !state.toAirport) return false;
        if (!state.departureDate) return false;
        if (state.currentTripType === 'round-trip' && !state.returnDate) return false;
        if (getTotalPassengers() < CONFIG.VALIDATION.minPassengers) return false;
        
        // Check date logic
        const today = new Date();
        if (state.departureDate <= today) return false;
        
        if (state.returnDate) {
            if (state.returnDate <= state.departureDate) return false;
        }
        
        return true;
    }
    
    function handleFormSubmission() {
        if (!validateForm()) {
            showValidationErrors();
            return;
        }
        
        // Show loading state
        const searchButton = $('.search-button');
        searchButton.classList.add('loading');
        searchButton.innerHTML = `
            <div class="loading-spinner"></div>
            <span>Searching...</span>
        `;
        
        // Collect form data
        const searchData = {
            tripType: state.currentTripType,
            from: state.fromAirport,
            to: state.toAirport,
            departureDate: state.departureDate,
            returnDate: state.returnDate,
            passengers: state.passengers,
            class: state.selectedClass
        };
        
        // Mock search delay
        setTimeout(() => {
            // In real implementation, redirect to results page
            console.log('Search data:', searchData);
            
            // Reset button state
            searchButton.classList.remove('loading');
            searchButton.innerHTML = `
                <span>Search Flights</span>
                <i data-lucide="search"></i>
            `;
            
            // Reinitialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Simulate redirect
            alert('Search functionality would redirect to results page with the search parameters.');
            
        }, 2000);
    }
    
    function showValidationErrors() {
        const errors = [];
        
        if (!state.fromAirport) errors.push('Please select departure airport');
        if (!state.toAirport) errors.push('Please select destination airport');
        if (!state.departureDate) errors.push('Please select departure date');
        if (state.currentTripType === 'round-trip' && !state.returnDate) {
            errors.push('Please select return date');
        }
        
        if (errors.length > 0) {
            // Simple alert for now - could be replaced with toast notifications
            alert('Please correct the following:\n\n' + errors.join('\n'));
        }
    }

    // ==============================
    // 10. TRUST INDICATORS & ANIMATIONS
    // ==============================
    
    function initializeTrustIndicators() {
        const counters = $$('.trust-indicator .trust-number');
        
        if (counters.length > 0) {
            // Use Intersection Observer to trigger animations when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            counters.forEach(counter => observer.observe(counter));
        }
    }
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.target || element.textContent.replace(/[^\d]/g, ''));
        const duration = CONFIG.ANIMATIONS.counter;
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }
    
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K+';
        }
        return num.toString();
    }

    // ==============================
    // 11. PARTICLE ANIMATION SYSTEM
    // ==============================
    
    function initializeParticleAnimations() {
        const particleLayer = $('.particle-layer');
        
        if (particleLayer) {
            createParticles(particleLayer);
        }
    }
    
    function createParticles(container) {
        const particleCount = window.innerWidth > 768 ? 50 : 25;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = createElement('div', 'particle');
            
            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Random animation delay and duration
            particle.style.animationDelay = Math.random() * CONFIG.ANIMATIONS.particle + 'ms';
            particle.style.animationDuration = (CONFIG.ANIMATIONS.particle + Math.random() * 4000) + 'ms';
            
            // Random size
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            container.appendChild(particle);
        }
    }

    // ==============================
    // 12. QUICK FILTERS
    // ==============================
    
    function initializeQuickFilters() {
        const filterButtons = $$('.filter-button');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const filterType = button.dataset.filter;
                handleQuickFilter(filterType, button);
            });
        });
    }
    
    function handleQuickFilter(filterType, button) {
        // Remove active class from all filter buttons
        $$('.filter-button').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Apply filter logic based on type
        switch (filterType) {
            case 'cheapest':
                // Would integrate with search/results to sort by price
                console.log('Applying cheapest filter');
                break;
            case 'fastest':
                // Would integrate with search/results to sort by duration
                console.log('Applying fastest filter');
                break;
            case 'best':
                // Would integrate with search/results to sort by value
                console.log('Applying best value filter');
                break;
            default:
                console.log('Unknown filter type:', filterType);
        }
        
        // Visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    // ==============================
    // 13. POPULAR ROUTES
    // ==============================
    
    function initializePopularRoutes() {
        const routeItems = $$('.route-item');
        
        routeItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const from = item.dataset.from;
                const to = item.dataset.to;
                
                if (from && to) {
                    populateRouteFromData(from, to);
                }
            });
        });
    }
    
    function populateRouteFromData(fromCode, toCode) {
        // Find airports by code
        const fromAirport = CONFIG.POPULAR_AIRPORTS.find(airport => airport.code === fromCode);
        const toAirport = CONFIG.POPULAR_AIRPORTS.find(airport => airport.code === toCode);
        
        if (fromAirport && toAirport) {
            // Update form with selected route
            selectAirport(fromAirport, 'from');
            selectAirport(toAirport, 'to');
            
            // Visual feedback
            updateInputSelectionStates();
            updateFormValidation();
            
            // Focus on date selection
            $('.departure-date .date-display').focus();
        }
    }

    // ==============================
    // 14. ACCESSIBILITY ENHANCEMENTS
    // ==============================
    
    function initializeAccessibility() {
        // Add ARIA labels and descriptions
        addAriaLabels();
        
        // Setup keyboard navigation
        setupKeyboardNavigation();
        
        // Add screen reader announcements
        setupScreenReaderAnnouncements();
        
        // Handle reduced motion preferences
        handleReducedMotionPreference();
    }
    
    function addAriaLabels() {
        // Add aria-labels to form elements
        const fromInput = $('#fromInput');
        if (fromInput) {
            fromInput.setAttribute('aria-label', 'Departure airport');
            fromInput.setAttribute('aria-describedby', 'from-help');
        }
        
        const toInput = $('#toInput');
        if (toInput) {
            toInput.setAttribute('aria-label', 'Destination airport');
            toInput.setAttribute('aria-describedby', 'to-help');
        }
        
        // Add aria-expanded for dropdowns
        const travelersButton = $('.travelers-selector');
        if (travelersButton) {
            travelersButton.setAttribute('aria-expanded', 'false');
            travelersButton.setAttribute('aria-haspopup', 'dialog');
        }
    }
    
    function setupKeyboardNavigation() {
        // Tab navigation for form elements
        const formElements = $$('.search-form input, .search-form button, .trip-type-button');
        
        formElements.forEach((element, index) => {
            element.setAttribute('tabindex', '0');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    // Custom tab navigation logic if needed
                }
            });
        });
        
        // Enter key handlers
        $$('.trip-type-button').forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }
    
    function setupScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = createElement('div', 'sr-only');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.id = 'sr-announcements';
        document.body.appendChild(liveRegion);
        
        // Function to announce changes
        window.announceToScreenReader = function(message) {
            liveRegion.textContent = message;
        };
    }
    
    function handleReducedMotionPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
        }
    }

    // ==============================
    // 15. PERFORMANCE OPTIMIZATIONS
    // ==============================
    
    function initializePerformanceOptimizations() {
        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 250);
        });
        
        // Lazy load non-critical features
        requestIdleCallback(() => {
            initializeNonCriticalFeatures();
        });
        
        // Preload critical resources
        preloadCriticalResources();
    }
    
    function handleResize() {
        // Recalculate particles for new screen size
        const particleLayer = $('.particle-layer');
        if (particleLayer) {
            particleLayer.innerHTML = '';
            createParticles(particleLayer);
        }
        
        // Update responsive behaviors
        updateResponsiveBehaviors();
    }
    
    function initializeNonCriticalFeatures() {
        // Initialize particle animations (non-critical)
        initializeParticleAnimations();
        
        // Initialize trust indicator animations
        initializeTrustIndicators();
    }
    
    function preloadCriticalResources() {
        // Preload modal HTML structures
        // This could be expanded to preload other resources
    }
    
    function updateResponsiveBehaviors() {
        const isMobile = window.innerWidth < 768;
        
        // Adjust modal behaviors for mobile
        $$('.modal-content').forEach(modal => {
            if (isMobile) {
                modal.style.maxHeight = '90vh';
                modal.style.overflow = 'auto';
            } else {
                modal.style.maxHeight = '';
                modal.style.overflow = '';
            }
        });
    }

    // ==============================
    // 16. INITIALIZATION & STARTUP
    // ==============================
    
    function initializeHeroSection() {
        // Check if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
    
    function init() {
        try {
            // Core functionality
            initializeTripTypes();
            initializeAutocomplete();
            initializeSwapButton();
            initializeDatePicker();
            initializeTravelersSelector();
            initializeFormValidation();
            
            // Enhanced features
            initializeQuickFilters();
            initializePopularRoutes();
            
            // Accessibility and performance
            initializeAccessibility();
            initializePerformanceOptimizations();
            
            // Initialize Lucide icons if available
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            console.log('Hero section initialized successfully');
            
        } catch (error) {
            console.error('Error initializing hero section:', error);
        }
    }
    
    // Global functions for external access
    window.HeroSection = {
        state: state,
        config: CONFIG,
        functions: {
            selectAirport: selectAirport,
            openDatePickerModal: openDatePickerModal,
            openTravelersModal: openTravelersModal,
            performSwap: performSwap,
            updateFormValidation: updateFormValidation
        }
    };
    
    // Start initialization
    initializeHeroSection();
    
})();