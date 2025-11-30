/**
 * Insurance Selection Module
 * Handles travel insurance selection during booking
 */

'use strict';

class InsuranceSelector {
  constructor(options = {}) {
    this.plans = [];
    this.selectedPlan = null;
    this.bookingAmount = options.bookingAmount || 0;
    this.passengerCount = options.passengerCount || 1;
    this.onSelectionChange = options.onSelectionChange || null;
    this.containerSelector = options.container || '#insuranceSection';
    
    this.init();
  }
  
  async init() {
    await this.loadPlans();
    this.render();
  }
  
  /**
   * Load insurance plans from API
   */
  async loadPlans() {
    try {
      const response = await fetch('/api/insurance/plans');
      const data = await response.json();
      
      if (data.success) {
        this.plans = data.data;
      }
    } catch (error) {
      console.error('Failed to load insurance plans:', error);
      // Use mock data for demo
      this.plans = this.getMockPlans();
    }
  }
  
  /**
   * Mock plans for demo
   */
  getMockPlans() {
    return [
      {
        _id: 'basic',
        name: 'Basic Coverage',
        shortDescription: 'Essential protection for your journey',
        price: 299,
        planType: 'basic',
        maxCoverageAmount: 50000,
        isPopular: false,
        coverage: [
          { type: 'trip_cancellation', description: 'Trip cancellation coverage', maxAmount: 25000, isIncluded: true },
          { type: 'flight_delay', description: 'Flight delay compensation', maxAmount: 5000, isIncluded: true },
          { type: 'baggage_loss', description: 'Baggage loss coverage', maxAmount: 10000, isIncluded: true }
        ],
        features: [
          'Trip cancellation up to ₹25,000',
          'Flight delay compensation',
          'Baggage loss protection',
          '24/7 customer support'
        ]
      },
      {
        _id: 'standard',
        name: 'Standard Coverage',
        shortDescription: 'Comprehensive protection with medical coverage',
        price: 599,
        planType: 'standard',
        maxCoverageAmount: 500000,
        isPopular: true,
        coverage: [
          { type: 'trip_cancellation', description: 'Trip cancellation coverage', maxAmount: 75000, isIncluded: true },
          { type: 'medical_emergency', description: 'Medical emergency coverage', maxAmount: 200000, isIncluded: true },
          { type: 'flight_delay', description: 'Flight delay compensation', maxAmount: 10000, isIncluded: true },
          { type: 'baggage_loss', description: 'Baggage loss coverage', maxAmount: 25000, isIncluded: true },
          { type: 'trip_interruption', description: 'Trip interruption coverage', maxAmount: 50000, isIncluded: true }
        ],
        features: [
          'Trip cancellation up to ₹75,000',
          'Medical coverage up to ₹2,00,000',
          'Flight delay compensation',
          'Baggage protection',
          '24/7 emergency assistance'
        ]
      },
      {
        _id: 'premium',
        name: 'Premium Coverage',
        shortDescription: 'Ultimate protection with premium benefits',
        price: 1299,
        planType: 'premium',
        maxCoverageAmount: 2500000,
        isPopular: false,
        coverage: [
          { type: 'trip_cancellation', description: 'Full trip cancellation coverage', maxAmount: 200000, isIncluded: true },
          { type: 'medical_emergency', description: 'Comprehensive medical coverage', maxAmount: 1000000, isIncluded: true },
          { type: 'flight_delay', description: 'Flight delay compensation', maxAmount: 25000, isIncluded: true },
          { type: 'baggage_loss', description: 'Premium baggage protection', maxAmount: 75000, isIncluded: true },
          { type: 'trip_interruption', description: 'Trip interruption coverage', maxAmount: 150000, isIncluded: true },
          { type: 'personal_accident', description: 'Personal accident coverage', maxAmount: 500000, isIncluded: true },
          { type: 'emergency_evacuation', description: 'Emergency evacuation', maxAmount: 500000, isIncluded: true }
        ],
        features: [
          'Trip cancellation up to ₹2,00,000',
          'Medical coverage up to ₹10,00,000',
          'Zero deductible',
          'Personal accident cover',
          'Emergency evacuation',
          'Adventure sports included'
        ]
      }
    ];
  }
  
  /**
   * Render insurance section
   */
  render() {
    const container = document.querySelector(this.containerSelector);
    if (!container) return;
    
    container.innerHTML = `
      <div class="insurance-section">
        <div class="insurance-header">
          <div class="insurance-title">
            <h3><i class="fas fa-shield-alt"></i> Protect Your Trip</h3>
            <p>Add travel insurance for peace of mind</p>
          </div>
          <button class="btn-info" id="whyInsuranceBtn" title="Why buy insurance?">
            <i class="fas fa-question-circle"></i> Why Insurance?
          </button>
        </div>
        
        <div class="insurance-plans">
          ${this.plans.map(plan => this.renderPlanCard(plan)).join('')}
        </div>
        
        <div class="no-insurance-option">
          <label class="radio-card ${!this.selectedPlan ? 'selected' : ''}">
            <input type="radio" name="insurance" value="" ${!this.selectedPlan ? 'checked' : ''}>
            <span class="radio-content">
              <i class="fas fa-times-circle"></i>
              <span>No, I'll risk it</span>
            </span>
          </label>
        </div>
        
        <div class="insurance-summary" id="insuranceSummary" style="display: ${this.selectedPlan ? 'block' : 'none'}">
          <div class="summary-content">
            <span class="summary-label">Insurance Premium:</span>
            <span class="summary-amount" id="insuranceAmount">₹0</span>
          </div>
        </div>
      </div>
    `;
    
    this.bindEvents();
    this.updateSummary();
  }
  
  /**
   * Render individual plan card
   */
  renderPlanCard(plan) {
    const totalPrice = plan.price * this.passengerCount;
    const isSelected = this.selectedPlan?._id === plan._id;
    
    return `
      <div class="plan-card ${isSelected ? 'selected' : ''} ${plan.isPopular ? 'popular' : ''}" data-plan-id="${plan._id}">
        ${plan.isPopular ? '<span class="popular-badge">Most Popular</span>' : ''}
        
        <div class="plan-header">
          <input type="radio" name="insurance" value="${plan._id}" ${isSelected ? 'checked' : ''}>
          <div class="plan-title">
            <h4>${plan.name}</h4>
            <p>${plan.shortDescription}</p>
          </div>
          <div class="plan-price">
            <span class="price-amount">₹${plan.price.toLocaleString('en-IN')}</span>
            <span class="price-unit">/person</span>
            ${this.passengerCount > 1 ? `<span class="total-price">Total: ₹${totalPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
        </div>
        
        <div class="plan-coverage">
          <div class="coverage-header">
            <span>Coverage up to</span>
            <strong>₹${(plan.maxCoverageAmount / 100000).toFixed(1)} Lakhs</strong>
          </div>
          <ul class="coverage-list">
            ${plan.coverage.filter(c => c.isIncluded).slice(0, 5).map(c => `
              <li>
                <i class="fas fa-check"></i>
                <span>${this.getCoverageLabel(c.type)}</span>
                <span class="coverage-amount">₹${(c.maxAmount / 1000).toFixed(0)}K</span>
              </li>
            `).join('')}
          </ul>
        </div>
        
        <button class="btn-view-details" data-plan-id="${plan._id}">
          View Details <i class="fas fa-chevron-down"></i>
        </button>
      </div>
    `;
  }
  
  /**
   * Get readable coverage label
   */
  getCoverageLabel(type) {
    const labels = {
      'trip_cancellation': 'Trip Cancellation',
      'medical_emergency': 'Medical Emergency',
      'baggage_loss': 'Baggage Loss',
      'flight_delay': 'Flight Delay',
      'trip_interruption': 'Trip Interruption',
      'personal_accident': 'Personal Accident',
      'emergency_evacuation': 'Emergency Evacuation'
    };
    return labels[type] || type;
  }
  
  /**
   * Bind event handlers
   */
  bindEvents() {
    // Plan selection via radio buttons
    document.querySelectorAll('input[name="insurance"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const planId = e.target.value;
        this.selectPlan(planId);
      });
    });
    
    // Plan card click
    document.querySelectorAll('.plan-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-view-details')) {
          const planId = card.dataset.planId;
          this.selectPlan(planId);
          
          // Update radio
          const radio = card.querySelector('input[type="radio"]');
          if (radio) radio.checked = true;
        }
      });
    });
    
    // View details buttons
    document.querySelectorAll('.btn-view-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const planId = btn.dataset.planId;
        this.showPlanDetails(planId);
      });
    });
    
    // Why insurance button
    document.getElementById('whyInsuranceBtn')?.addEventListener('click', () => {
      this.showWhyInsurancePopup();
    });
    
    // No insurance option
    document.querySelector('.no-insurance-option label')?.addEventListener('click', () => {
      this.selectPlan(null);
    });
  }
  
  /**
   * Select a plan
   */
  selectPlan(planId) {
    if (planId) {
      this.selectedPlan = this.plans.find(p => p._id === planId);
    } else {
      this.selectedPlan = null;
    }
    
    // Update UI
    document.querySelectorAll('.plan-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.planId === planId);
    });
    
    document.querySelector('.no-insurance-option label')?.classList.toggle('selected', !planId);
    
    this.updateSummary();
    
    // Callback
    if (this.onSelectionChange) {
      this.onSelectionChange(this.getSelectionData());
    }
  }
  
  /**
   * Update summary section
   */
  updateSummary() {
    const summaryEl = document.getElementById('insuranceSummary');
    const amountEl = document.getElementById('insuranceAmount');
    
    if (this.selectedPlan) {
      const totalPremium = this.selectedPlan.price * this.passengerCount;
      if (summaryEl) summaryEl.style.display = 'block';
      if (amountEl) amountEl.textContent = `₹${totalPremium.toLocaleString('en-IN')}`;
    } else {
      if (summaryEl) summaryEl.style.display = 'none';
    }
  }
  
  /**
   * Get selection data
   */
  getSelectionData() {
    if (!this.selectedPlan) {
      return {
        selected: false,
        planId: null,
        planName: null,
        premium: 0
      };
    }
    
    return {
      selected: true,
      planId: this.selectedPlan._id,
      planName: this.selectedPlan.name,
      pricePerPerson: this.selectedPlan.price,
      premium: this.selectedPlan.price * this.passengerCount,
      maxCoverage: this.selectedPlan.maxCoverageAmount
    };
  }
  
  /**
   * Show plan details modal
   */
  showPlanDetails(planId) {
    const plan = this.plans.find(p => p._id === planId);
    if (!plan) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal insurance-details-modal">
        <div class="modal-header">
          <h3>${plan.name}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p class="plan-description">${plan.description || plan.shortDescription}</p>
          
          <div class="plan-features">
            <h4><i class="fas fa-check-circle"></i> What's Covered</h4>
            <ul>
              ${plan.features?.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('') || ''}
            </ul>
          </div>
          
          <div class="coverage-details">
            <h4><i class="fas fa-shield-alt"></i> Coverage Details</h4>
            <table class="coverage-table">
              <thead>
                <tr>
                  <th>Coverage Type</th>
                  <th>Max Amount</th>
                </tr>
              </thead>
              <tbody>
                ${plan.coverage.filter(c => c.isIncluded).map(c => `
                  <tr>
                    <td>${this.getCoverageLabel(c.type)}</td>
                    <td>₹${c.maxAmount.toLocaleString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          ${plan.exclusions?.length ? `
            <div class="plan-exclusions">
              <h4><i class="fas fa-times-circle"></i> What's Not Covered</h4>
              <ul>
                ${plan.exclusions.map(e => `<li>${e}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Close</button>
          <button class="btn btn-primary select-plan-btn" data-plan-id="${plan._id}">
            Select This Plan - ₹${plan.price}/person
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close handlers
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('.select-plan-btn').addEventListener('click', () => {
      this.selectPlan(planId);
      modal.remove();
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }
  
  /**
   * Show why insurance popup
   */
  showWhyInsurancePopup() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal why-insurance-modal">
        <div class="modal-header">
          <h3><i class="fas fa-question-circle"></i> Why Buy Travel Insurance?</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="benefit-list">
            <div class="benefit-item">
              <div class="benefit-icon"><i class="fas fa-calendar-times"></i></div>
              <div class="benefit-content">
                <h4>Trip Cancellation Protection</h4>
                <p>Get reimbursed for non-refundable trip costs if you need to cancel due to illness, injury, or other covered reasons.</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon"><i class="fas fa-hospital"></i></div>
              <div class="benefit-content">
                <h4>Medical Emergency Coverage</h4>
                <p>Covers medical expenses if you get sick or injured during your trip, including hospital stays and emergency treatment.</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon"><i class="fas fa-suitcase"></i></div>
              <div class="benefit-content">
                <h4>Baggage Loss Protection</h4>
                <p>Get compensated if your luggage is lost, stolen, or damaged during your journey.</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon"><i class="fas fa-clock"></i></div>
              <div class="benefit-content">
                <h4>Flight Delay Compensation</h4>
                <p>Receive compensation for additional expenses incurred due to significant flight delays.</p>
              </div>
            </div>
            
            <div class="benefit-item">
              <div class="benefit-icon"><i class="fas fa-headset"></i></div>
              <div class="benefit-content">
                <h4>24/7 Assistance</h4>
                <p>Access round-the-clock emergency assistance services anywhere in the world.</p>
              </div>
            </div>
          </div>
          
          <div class="stats-section">
            <h4>Did You Know?</h4>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">1 in 6</span>
                <span class="stat-label">travelers face trip disruption</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">₹50,000+</span>
                <span class="stat-label">average medical cost abroad</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">12%</span>
                <span class="stat-label">of checked bags get delayed</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary modal-close-btn">Got It!</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-close-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }
  
  /**
   * Set booking amount (for percentage-based pricing)
   */
  setBookingAmount(amount) {
    this.bookingAmount = amount;
    this.render();
  }
  
  /**
   * Set passenger count
   */
  setPassengerCount(count) {
    this.passengerCount = count;
    this.render();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { InsuranceSelector };
}
