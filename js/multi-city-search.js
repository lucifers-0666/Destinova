/**
 * Multi-City Search Module
 * Handles multi-city flight search functionality
 */

'use strict';

class MultiCitySearch {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '#multiCityContainer');
    this.maxLegs = options.maxLegs || 5;
    this.minLegs = 2;
    this.legs = [];
    this.onSearch = options.onSearch || null;
    
    this.init();
  }
  
  init() {
    // Add initial two legs
    this.addLeg();
    this.addLeg();
    this.render();
    this.bindEvents();
  }
  
  /**
   * Add a new leg to the journey
   */
  addLeg() {
    if (this.legs.length >= this.maxLegs) {
      this.showToast(`Maximum ${this.maxLegs} cities allowed`, 'warning');
      return;
    }
    
    const previousLeg = this.legs[this.legs.length - 1];
    
    this.legs.push({
      id: Date.now(),
      origin: previousLeg?.destination || '',
      originCode: previousLeg?.destinationCode || '',
      destination: '',
      destinationCode: '',
      date: this.getMinDate(this.legs.length),
      passengers: { adults: 1, children: 0, infants: 0 }
    });
    
    this.render();
  }
  
  /**
   * Remove a leg
   */
  removeLeg(index) {
    if (this.legs.length <= this.minLegs) {
      this.showToast(`Minimum ${this.minLegs} cities required`, 'warning');
      return;
    }
    
    this.legs.splice(index, 1);
    this.render();
  }
  
  /**
   * Get minimum date for a leg
   */
  getMinDate(legIndex) {
    const today = new Date();
    if (legIndex === 0) {
      return today.toISOString().split('T')[0];
    }
    
    const previousDate = this.legs[legIndex - 1]?.date;
    if (previousDate) {
      return previousDate;
    }
    
    return today.toISOString().split('T')[0];
  }
  
  /**
   * Render the multi-city form
   */
  render() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="multi-city-search">
        <div class="multi-city-legs">
          ${this.legs.map((leg, index) => this.renderLeg(leg, index)).join('')}
        </div>
        
        ${this.legs.length < this.maxLegs ? `
          <button class="btn btn-add-city" id="addCityBtn">
            <i class="fas fa-plus"></i> Add Another City
          </button>
        ` : ''}
        
        <div class="multi-city-passengers">
          <div class="passenger-selector">
            <label>Passengers</label>
            <div class="passenger-controls">
              <div class="passenger-type">
                <span>Adults (12+)</span>
                <div class="counter">
                  <button class="counter-btn" data-type="adults" data-action="decrease">-</button>
                  <span id="adultsCount">${this.legs[0]?.passengers.adults || 1}</span>
                  <button class="counter-btn" data-type="adults" data-action="increase">+</button>
                </div>
              </div>
              <div class="passenger-type">
                <span>Children (2-11)</span>
                <div class="counter">
                  <button class="counter-btn" data-type="children" data-action="decrease">-</button>
                  <span id="childrenCount">${this.legs[0]?.passengers.children || 0}</span>
                  <button class="counter-btn" data-type="children" data-action="increase">+</button>
                </div>
              </div>
              <div class="passenger-type">
                <span>Infants (0-2)</span>
                <div class="counter">
                  <button class="counter-btn" data-type="infants" data-action="decrease">-</button>
                  <span id="infantsCount">${this.legs[0]?.passengers.infants || 0}</span>
                  <button class="counter-btn" data-type="infants" data-action="increase">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button class="btn btn-primary btn-search-multi" id="searchMultiBtn">
          <i class="fas fa-search"></i> Search Flights
        </button>
      </div>
    `;
    
    this.bindEvents();
    this.initAutocomplete();
  }
  
  /**
   * Render a single leg
   */
  renderLeg(leg, index) {
    const isFirst = index === 0;
    const canRemove = this.legs.length > this.minLegs;
    
    return `
      <div class="multi-city-leg" data-leg-index="${index}">
        <div class="leg-header">
          <span class="leg-number">Flight ${index + 1}</span>
          ${canRemove ? `
            <button class="btn-remove-leg" data-index="${index}" title="Remove">
              <i class="fas fa-times"></i>
            </button>
          ` : ''}
        </div>
        
        <div class="leg-fields">
          <div class="field-group origin-field">
            <label><i class="fas fa-plane-departure"></i> From</label>
            <input 
              type="text" 
              class="airport-input" 
              data-field="origin"
              data-index="${index}"
              placeholder="City or Airport"
              value="${leg.origin}"
              ${!isFirst ? 'readonly' : ''}
            >
            <input type="hidden" class="airport-code" data-field="originCode" data-index="${index}" value="${leg.originCode}">
          </div>
          
          <button class="btn-swap-cities" data-index="${index}" title="Swap cities">
            <i class="fas fa-exchange-alt"></i>
          </button>
          
          <div class="field-group destination-field">
            <label><i class="fas fa-plane-arrival"></i> To</label>
            <input 
              type="text" 
              class="airport-input" 
              data-field="destination"
              data-index="${index}"
              placeholder="City or Airport"
              value="${leg.destination}"
            >
            <input type="hidden" class="airport-code" data-field="destinationCode" data-index="${index}" value="${leg.destinationCode}">
          </div>
          
          <div class="field-group date-field">
            <label><i class="fas fa-calendar"></i> Date</label>
            <input 
              type="date" 
              class="date-input"
              data-field="date"
              data-index="${index}"
              value="${leg.date}"
              min="${this.getMinDate(index)}"
            >
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Bind event handlers
   */
  bindEvents() {
    // Add city button
    document.getElementById('addCityBtn')?.addEventListener('click', () => {
      this.addLeg();
    });
    
    // Remove leg buttons
    document.querySelectorAll('.btn-remove-leg').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        this.removeLeg(index);
      });
    });
    
    // Swap buttons
    document.querySelectorAll('.btn-swap-cities').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        this.swapCities(index);
      });
    });
    
    // Input changes
    document.querySelectorAll('.airport-input, .date-input').forEach(input => {
      input.addEventListener('change', (e) => {
        this.handleInputChange(e);
      });
    });
    
    // Passenger counters
    document.querySelectorAll('.counter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const action = btn.dataset.action;
        this.updatePassengers(type, action);
      });
    });
    
    // Search button
    document.getElementById('searchMultiBtn')?.addEventListener('click', () => {
      this.handleSearch();
    });
  }
  
  /**
   * Initialize airport autocomplete
   */
  initAutocomplete() {
    // If airport autocomplete module exists
    if (typeof initAirportAutocomplete === 'function') {
      document.querySelectorAll('.airport-input:not([readonly])').forEach(input => {
        initAirportAutocomplete(input, {
          onSelect: (airport) => {
            const index = parseInt(input.dataset.index);
            const field = input.dataset.field;
            
            this.legs[index][field] = airport.city || airport.name;
            this.legs[index][`${field}Code`] = airport.code;
            
            // Auto-fill next leg's origin
            if (field === 'destination' && index < this.legs.length - 1) {
              this.legs[index + 1].origin = airport.city || airport.name;
              this.legs[index + 1].originCode = airport.code;
              this.render();
            }
          }
        });
      });
    }
  }
  
  /**
   * Handle input changes
   */
  handleInputChange(e) {
    const index = parseInt(e.target.dataset.index);
    const field = e.target.dataset.field;
    
    if (field === 'date') {
      this.legs[index].date = e.target.value;
      
      // Update minimum dates for subsequent legs
      for (let i = index + 1; i < this.legs.length; i++) {
        const minDate = this.legs[i - 1].date;
        if (this.legs[i].date < minDate) {
          this.legs[i].date = minDate;
        }
      }
      this.render();
    } else {
      this.legs[index][field] = e.target.value;
    }
  }
  
  /**
   * Swap origin and destination
   */
  swapCities(index) {
    const leg = this.legs[index];
    const tempOrigin = leg.origin;
    const tempOriginCode = leg.originCode;
    
    leg.origin = leg.destination;
    leg.originCode = leg.destinationCode;
    leg.destination = tempOrigin;
    leg.destinationCode = tempOriginCode;
    
    this.render();
  }
  
  /**
   * Update passenger counts
   */
  updatePassengers(type, action) {
    const currentValue = this.legs[0].passengers[type];
    let newValue = currentValue;
    
    if (action === 'increase') {
      const totalPassengers = this.getTotalPassengers();
      if (totalPassengers < 9) {
        newValue = currentValue + 1;
      }
    } else if (action === 'decrease') {
      if (type === 'adults' && currentValue > 1) {
        newValue = currentValue - 1;
      } else if (type !== 'adults' && currentValue > 0) {
        newValue = currentValue - 1;
      }
    }
    
    // Check infant-adult ratio
    if (type === 'infants' && newValue > this.legs[0].passengers.adults) {
      this.showToast('Infants cannot exceed number of adults', 'warning');
      return;
    }
    
    // Update all legs
    this.legs.forEach(leg => {
      leg.passengers[type] = newValue;
    });
    
    this.render();
  }
  
  /**
   * Get total passengers
   */
  getTotalPassengers() {
    const p = this.legs[0].passengers;
    return p.adults + p.children + p.infants;
  }
  
  /**
   * Validate form
   */
  validate() {
    const errors = [];
    
    this.legs.forEach((leg, index) => {
      if (!leg.origin || !leg.originCode) {
        errors.push(`Flight ${index + 1}: Please select origin city`);
      }
      if (!leg.destination || !leg.destinationCode) {
        errors.push(`Flight ${index + 1}: Please select destination city`);
      }
      if (!leg.date) {
        errors.push(`Flight ${index + 1}: Please select travel date`);
      }
      if (leg.originCode === leg.destinationCode) {
        errors.push(`Flight ${index + 1}: Origin and destination cannot be the same`);
      }
    });
    
    return errors;
  }
  
  /**
   * Handle search
   */
  handleSearch() {
    const errors = this.validate();
    
    if (errors.length > 0) {
      errors.forEach(err => this.showToast(err, 'error'));
      return;
    }
    
    const searchData = {
      tripType: 'multi-city',
      legs: this.legs.map(leg => ({
        origin: leg.originCode,
        originName: leg.origin,
        destination: leg.destinationCode,
        destinationName: leg.destination,
        date: leg.date
      })),
      passengers: this.legs[0].passengers,
      cabinClass: 'economy'
    };
    
    // Store in session
    sessionStorage.setItem('multiCitySearch', JSON.stringify(searchData));
    
    // Callback or redirect
    if (this.onSearch) {
      this.onSearch(searchData);
    } else {
      window.location.href = `booking.html?type=multi-city`;
    }
  }
  
  /**
   * Get search data
   */
  getSearchData() {
    return {
      tripType: 'multi-city',
      legs: this.legs,
      passengers: this.legs[0].passengers
    };
  }
  
  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer') || document.body;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MultiCitySearch };
}
