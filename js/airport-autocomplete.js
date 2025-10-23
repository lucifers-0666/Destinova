/**
 * ✈️ AIRPORT AUTOCOMPLETE COMPONENT
 * Smart autocomplete with search, filtering, and keyboard navigation
 */

class AirportAutocomplete {
    constructor(inputElement, options = {}) {
        this.input = inputElement;
        this.options = {
            minChars: 2,
            maxResults: 10,
            showNearby: true,
            showPopular: true,
            ...options
        };

        this.dropdown = null;
        this.selectedIndex = -1;
        this.results = [];
        this.selectedAirport = null;

        this.init();
    }

    init() {
        this.createDropdown();
        this.attachEventListeners();
    }

    createDropdown() {
        // Create dropdown container
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'airport-autocomplete-dropdown';
        this.dropdown.style.display = 'none';
        
        // Insert after input's parent
        const parent = this.input.closest('.input-wrapper') || this.input.parentElement;
        parent.style.position = 'relative';
        parent.appendChild(this.dropdown);
    }

    attachEventListeners() {
        // Input events
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.input.addEventListener('focus', this.handleFocus.bind(this));
        this.input.addEventListener('keydown', this.handleKeydown.bind(this));
        this.input.addEventListener('blur', this.handleBlur.bind(this));

        // Dropdown events
        this.dropdown.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent input blur
        });

        this.dropdown.addEventListener('click', this.handleDropdownClick.bind(this));

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }

    handleInput(e) {
        const query = e.target.value.trim();

        if (query.length < this.options.minChars) {
            this.hideDropdown();
            return;
        }

        this.search(query);
    }

    handleFocus(e) {
        if (this.input.value.length >= this.options.minChars) {
            this.search(this.input.value);
        } else if (this.options.showPopular) {
            this.showPopularAirports();
        }
    }

    handleKeydown(e) {
        if (!this.dropdown || this.dropdown.style.display === 'none') return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateDown();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateUp();
                break;
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && this.results[this.selectedIndex]) {
                    this.selectAirport(this.results[this.selectedIndex]);
                }
                break;
            case 'Escape':
                this.hideDropdown();
                break;
        }
    }

    handleBlur(e) {
        // Delay to allow dropdown clicks
        setTimeout(() => {
            this.hideDropdown();
        }, 200);
    }

    handleDropdownClick(e) {
        const airportItem = e.target.closest('.airport-item');
        if (airportItem) {
            const code = airportItem.dataset.code;
            const airport = this.results.find(a => a.code === code);
            if (airport) {
                this.selectAirport(airport);
            }
        }
    }

    async search(query) {
        try {
            // Use the FlightAPI to search
            this.results = await window.FlightAPI.fetchAirportsFromAPI(query);
            
            if (this.results.length === 0) {
                this.showNoResults();
            } else {
                this.showResults();
            }
        } catch (error) {
            console.error('Search error:', error);
            this.results = window.FlightAPI.searchAirports(query, this.options.maxResults);
            this.showResults();
        }
    }

    showResults() {
        let html = '';

        if (this.results.length === 0) {
            html = '<div class="no-results">No airports found</div>';
        } else {
            html = '<div class="results-list">';
            this.results.forEach((airport, index) => {
                html += window.FlightAPI.createAirportDropdownHTML(airport);
            });
            html += '</div>';
        }

        this.dropdown.innerHTML = html;
        this.dropdown.style.display = 'block';
        this.selectedIndex = -1;
    }

    showNoResults() {
        this.dropdown.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No airports found</p>
                <small>Try searching by city, airport name, or code</small>
            </div>
        `;
        this.dropdown.style.display = 'block';
    }

    showPopularAirports() {
        const popular = [
            { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International', country: 'India' },
            { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj', country: 'India' },
            { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International', country: 'India' },
            { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'UAE' },
            { code: 'LHR', city: 'London', name: 'Heathrow', country: 'UK' },
            { code: 'JFK', city: 'New York', name: 'John F. Kennedy', country: 'USA' },
            { code: 'SIN', city: 'Singapore', name: 'Changi', country: 'Singapore' },
            { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi', country: 'Thailand' }
        ];

        this.results = popular;

        let html = '<div class="popular-airports">';
        html += '<div class="section-header"><i class="fas fa-fire"></i> Popular Airports</div>';
        html += '<div class="results-list">';
        popular.forEach(airport => {
            html += window.FlightAPI.createAirportDropdownHTML(airport);
        });
        html += '</div></div>';

        this.dropdown.innerHTML = html;
        this.dropdown.style.display = 'block';
    }

    navigateDown() {
        const items = this.dropdown.querySelectorAll('.airport-item');
        if (items.length === 0) return;

        if (this.selectedIndex < items.length - 1) {
            this.selectedIndex++;
            this.updateSelection(items);
        }
    }

    navigateUp() {
        const items = this.dropdown.querySelectorAll('.airport-item');
        if (items.length === 0) return;

        if (this.selectedIndex > 0) {
            this.selectedIndex--;
            this.updateSelection(items);
        }
    }

    updateSelection(items) {
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    selectAirport(airport) {
        this.selectedAirport = airport;
        this.input.value = window.FlightAPI.formatAirportShort(airport);
        
        // Store data attributes
        this.input.dataset.airportCode = airport.code;
        this.input.dataset.city = airport.city;
        this.input.dataset.country = airport.country;
        
        // Add success state
        const container = this.input.closest('.input-container');
        if (container) {
            container.classList.add('success');
            container.classList.remove('error');
        }

        this.hideDropdown();

        // Trigger custom event
        const event = new CustomEvent('airportSelected', {
            detail: { airport }
        });
        this.input.dispatchEvent(event);

        // Trigger change event
        this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    hideDropdown() {
        if (this.dropdown) {
            this.dropdown.style.display = 'none';
        }
        this.selectedIndex = -1;
    }

    getSelectedAirport() {
        return this.selectedAirport;
    }

    clear() {
        this.input.value = '';
        this.selectedAirport = null;
        delete this.input.dataset.airportCode;
        delete this.input.dataset.city;
        delete this.input.dataset.country;
        
        const container = this.input.closest('.input-container');
        if (container) {
            container.classList.remove('success', 'error');
        }
        
        this.hideDropdown();
    }
}

// Initialize autocomplete on page load
function initializeAirportAutocomplete() {
    // Find all airport input fields
    const fromInput = document.getElementById('fromInput');
    const toInput = document.getElementById('toInput');

    if (fromInput) {
        window.fromAutocomplete = new AirportAutocomplete(fromInput, {
            minChars: 2,
            maxResults: 10,
            showPopular: true
        });
    }

    if (toInput) {
        window.toAutocomplete = new AirportAutocomplete(toInput, {
            minChars: 2,
            maxResults: 10,
            showPopular: true
        });
    }

    // Swap functionality for inline swap icon
    const swapIcon = document.querySelector('.swap-icon-inline');
    if (swapIcon && fromInput && toInput) {
        swapIcon.addEventListener('click', () => {
            const fromValue = fromInput.value;
            const toValue = toInput.value;
            const fromCode = fromInput.dataset.airportCode;
            const toCode = toInput.dataset.airportCode;

            fromInput.value = toValue;
            toInput.value = fromValue;
            fromInput.dataset.airportCode = toCode;
            toInput.dataset.airportCode = fromCode;

            // Swap selected airports
            const tempAirport = window.fromAutocomplete?.selectedAirport;
            if (window.fromAutocomplete) {
                window.fromAutocomplete.selectedAirport = window.toAutocomplete?.selectedAirport;
            }
            if (window.toAutocomplete) {
                window.toAutocomplete.selectedAirport = tempAirport;
            }

            // Animation
            swapIcon.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                swapIcon.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAirportAutocomplete);
} else {
    initializeAirportAutocomplete();
}

// Export
window.AirportAutocomplete = AirportAutocomplete;
window.initializeAirportAutocomplete = initializeAirportAutocomplete;
