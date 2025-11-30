/**
 * Check-In Module
 * Handles online check-in and boarding pass generation
 */

class CheckInManager {
  constructor() {
    this.bookingData = null;
    this.bookingId = null;
    this.init();
  }

  init() {
    // DOM Elements
    this.elements = {
      loadingOverlay: document.getElementById('loadingOverlay'),
      message: document.getElementById('message'),
      messageText: document.getElementById('messageText'),
      searchTabs: document.querySelectorAll('.search-tab'),
      searchForms: document.querySelectorAll('.search-form'),
      referenceForm: document.getElementById('referenceForm'),
      flightForm: document.getElementById('flightForm'),
      resultsSection: document.getElementById('resultsSection'),
      boardingPassSection: document.getElementById('boardingPassSection'),
      checkInBtn: document.getElementById('checkInBtn'),
      selectSeatsBtn: document.getElementById('selectSeatsBtn'),
      downloadBpBtn: document.getElementById('downloadBpBtn'),
      emailBpBtn: document.getElementById('emailBpBtn'),
      printBpBtn: document.getElementById('printBpBtn')
    };

    // Bind events
    this.bindEvents();

    // Check URL params for booking reference
    this.checkURLParams();
  }

  bindEvents() {
    // Tab switching
    this.elements.searchTabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Form submissions
    this.elements.referenceForm?.addEventListener('submit', (e) => this.handleReferenceSearch(e));
    this.elements.flightForm?.addEventListener('submit', (e) => this.handleFlightSearch(e));

    // Action buttons
    this.elements.checkInBtn?.addEventListener('click', () => this.performCheckIn());
    this.elements.selectSeatsBtn?.addEventListener('click', () => this.navigateToSeatSelection());
    this.elements.downloadBpBtn?.addEventListener('click', () => this.downloadBoardingPass());
    this.elements.emailBpBtn?.addEventListener('click', () => this.emailBoardingPass());
    this.elements.printBpBtn?.addEventListener('click', () => this.printBoardingPass());
  }

  checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    const lastName = urlParams.get('lastName');

    if (ref && lastName) {
      document.getElementById('bookingRef').value = ref;
      document.getElementById('lastName').value = lastName;
      this.searchByReference(ref, lastName);
    }
  }

  switchTab(tabName) {
    // Update tab buttons
    this.elements.searchTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update forms
    this.elements.searchForms.forEach(form => {
      form.classList.toggle('active', form.dataset.form === tabName);
    });
  }

  showLoading(show = true) {
    this.elements.loadingOverlay?.classList.toggle('show', show);
  }

  showMessage(text, type = 'info') {
    const { message, messageText } = this.elements;
    if (!message || !messageText) return;

    messageText.textContent = text;
    message.className = `message show ${type}`;

    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => {
        message.classList.remove('show');
      }, 5000);
    }
  }

  hideMessage() {
    this.elements.message?.classList.remove('show');
  }

  async handleReferenceSearch(e) {
    e.preventDefault();
    const bookingRef = document.getElementById('bookingRef').value.trim();
    const lastName = document.getElementById('lastName').value.trim();

    if (!bookingRef || !lastName) {
      this.showMessage('Please enter booking reference and last name', 'error');
      return;
    }

    await this.searchByReference(bookingRef, lastName);
  }

  async handleFlightSearch(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const flightNumber = document.getElementById('flightNumber').value.trim();

    if (!email || !flightNumber) {
      this.showMessage('Please enter email and flight number', 'error');
      return;
    }

    await this.searchByFlight(email, flightNumber);
  }

  async searchByReference(bookingRef, lastName) {
    this.showLoading();
    this.hideMessage();

    try {
      const response = await fetch('/api/check-in/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingReference: bookingRef, lastName })
      });

      const result = await response.json();

      if (result.success) {
        this.bookingData = result.data;
        this.bookingId = result.data.booking?._id;
        this.displayResults(result.data);
      } else {
        this.showMessage(result.message || 'Booking not found', 'error');
      }
    } catch (error) {
      console.error('Search error:', error);
      this.showMessage('Failed to search booking. Please try again.', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async searchByFlight(email, flightNumber) {
    this.showLoading();
    this.hideMessage();

    try {
      const response = await fetch('/api/check-in/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, flightNumber })
      });

      const result = await response.json();

      if (result.success) {
        this.bookingData = result.data;
        this.bookingId = result.data.booking?._id;
        this.displayResults(result.data);
      } else {
        this.showMessage(result.message || 'Booking not found', 'error');
      }
    } catch (error) {
      console.error('Search error:', error);
      this.showMessage('Failed to search booking. Please try again.', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  displayResults(data) {
    const { booking, flight, checkInStatus, canCheckIn, checkInMessage, hoursUntilDeparture, boardingPassAvailable } = data;

    // Show results section
    this.elements.resultsSection?.classList.add('show');
    this.elements.boardingPassSection?.classList.remove('show');

    // Update flight info
    this.updateElement('flightNum', flight?.flightNumber || 'N/A');
    this.updateElement('originCode', flight?.origin?.airportCode || flight?.origin || 'N/A');
    this.updateElement('originCity', flight?.origin?.city || '');
    this.updateElement('destCode', flight?.destination?.airportCode || flight?.destination || 'N/A');
    this.updateElement('destCity', flight?.destination?.city || '');
    this.updateElement('travelDate', this.formatDate(flight?.departureTime || booking?.travelDate));
    this.updateElement('depTime', this.formatTime(flight?.departureTime));
    this.updateElement('arrTime', this.formatTime(flight?.arrivalTime));
    this.updateElement('timeUntil', `${hoursUntilDeparture}h`);

    // Update status badge
    const statusEl = document.getElementById('checkInStatus');
    if (statusEl) {
      if (checkInStatus === 'completed' || boardingPassAvailable) {
        statusEl.textContent = 'Checked In';
        statusEl.className = 'status checked';
      } else if (canCheckIn) {
        statusEl.textContent = 'Ready to Check-in';
        statusEl.className = 'status ready';
      } else {
        statusEl.textContent = checkInMessage || 'Not Available';
        statusEl.className = 'status not-ready';
      }
    }

    // Update passengers
    this.renderPassengers(booking?.passengers || []);

    // Update buttons
    if (this.elements.checkInBtn) {
      if (boardingPassAvailable) {
        this.elements.checkInBtn.innerHTML = '<i class="fas fa-ticket-alt"></i> View Boarding Pass';
        this.elements.checkInBtn.disabled = false;
        this.elements.checkInBtn.onclick = () => this.viewBoardingPass();
      } else if (canCheckIn) {
        this.elements.checkInBtn.innerHTML = '<i class="fas fa-check-circle"></i> Complete Check-In';
        this.elements.checkInBtn.disabled = false;
        this.elements.checkInBtn.onclick = () => this.performCheckIn();
      } else {
        this.elements.checkInBtn.innerHTML = `<i class="fas fa-clock"></i> ${checkInMessage || 'Check-in Unavailable'}`;
        this.elements.checkInBtn.disabled = true;
      }
    }
  }

  renderPassengers(passengers) {
    const container = document.getElementById('passengerList');
    if (!container) return;

    container.innerHTML = passengers.map((p, index) => `
      <div class="passenger-item">
        <div class="passenger-name">
          <i class="fas fa-user"></i>
          <span>${p.title || 'Mr'} ${p.firstName} ${p.lastName}</span>
        </div>
        <div class="passenger-status ${this.bookingData?.checkInStatus === 'completed' ? 'checked-in' : 'pending'}">
          ${this.bookingData?.checkInStatus === 'completed' 
            ? '<i class="fas fa-check-circle"></i> Checked In' 
            : '<i class="fas fa-clock"></i> Pending'}
        </div>
      </div>
    `).join('');
  }

  async performCheckIn() {
    if (!this.bookingId && !this.bookingData?.booking?._id) {
      // Try to get booking ID from API response
      const bookingRef = this.bookingData?.booking?.bookingReference;
      if (!bookingRef) {
        this.showMessage('Booking information not found', 'error');
        return;
      }
    }

    this.showLoading();
    this.hideMessage();

    try {
      const bookingId = this.bookingId || this.bookingData?.booking?._id;
      
      // First, we need to get the actual booking ID if we only have reference
      let actualBookingId = bookingId;
      
      if (!actualBookingId) {
        // Search again to get ID
        const searchResponse = await fetch('/api/check-in/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingReference: this.bookingData?.booking?.bookingReference,
            lastName: this.bookingData?.booking?.passengers?.[0]?.lastName
          })
        });
        const searchResult = await searchResponse.json();
        actualBookingId = searchResult.data?.booking?._id;
      }

      if (!actualBookingId) {
        this.showMessage('Unable to find booking. Please try searching again.', 'error');
        this.showLoading(false);
        return;
      }

      const response = await fetch(`/api/check-in/bookings/${actualBookingId}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          seatSelections: [] // Could include seat selections if user selected seats
        })
      });

      const result = await response.json();

      if (result.success) {
        this.showMessage('Check-in completed successfully!', 'success');
        this.bookingId = actualBookingId;
        
        // Refresh the booking data and show boarding pass
        await this.viewBoardingPass();
      } else {
        this.showMessage(result.message || 'Check-in failed', 'error');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      this.showMessage('Failed to complete check-in. Please try again.', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async viewBoardingPass() {
    this.showLoading();

    try {
      const bookingId = this.bookingId || this.bookingData?.booking?._id;
      
      if (!bookingId) {
        this.showMessage('Booking ID not found', 'error');
        this.showLoading(false);
        return;
      }

      const response = await fetch(`/api/check-in/bookings/${bookingId}/boarding-pass?format=html`);
      
      if (response.ok) {
        const html = await response.text();
        this.renderBoardingPass(html);
        
        // Show boarding pass section
        this.elements.boardingPassSection?.classList.add('show');
        
        // Scroll to boarding pass
        this.elements.boardingPassSection?.scrollIntoView({ behavior: 'smooth' });
      } else {
        const result = await response.json();
        this.showMessage(result.message || 'Failed to get boarding pass', 'error');
      }
    } catch (error) {
      console.error('Boarding pass error:', error);
      this.showMessage('Failed to load boarding pass', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  renderBoardingPass(html) {
    const container = document.getElementById('boardingPassContainer');
    if (container) {
      // If it's a full HTML document, extract just the body content
      if (html.includes('<!DOCTYPE html>')) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const body = doc.body;
        container.innerHTML = body.innerHTML;
      } else {
        container.innerHTML = html;
      }
    }
  }

  async downloadBoardingPass() {
    const bookingId = this.bookingId || this.bookingData?.booking?._id;
    
    if (!bookingId) {
      this.showMessage('Booking ID not found', 'error');
      return;
    }

    this.showLoading();

    try {
      const response = await fetch(`/api/check-in/bookings/${bookingId}/boarding-pass?format=pdf`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boarding-pass-${this.bookingData?.booking?.bookingReference || 'download'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showMessage('Boarding pass downloaded successfully!', 'success');
      } else {
        // Try HTML fallback
        const htmlResponse = await fetch(`/api/check-in/bookings/${bookingId}/boarding-pass?format=html`);
        if (htmlResponse.ok) {
          const html = await htmlResponse.text();
          const blob = new Blob([html], { type: 'text/html' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `boarding-pass-${this.bookingData?.booking?.bookingReference || 'download'}.html`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          this.showMessage('Boarding pass downloaded as HTML', 'success');
        } else {
          this.showMessage('Failed to download boarding pass', 'error');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      this.showMessage('Failed to download boarding pass', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async emailBoardingPass() {
    const bookingId = this.bookingId || this.bookingData?.booking?._id;
    
    if (!bookingId) {
      this.showMessage('Booking ID not found', 'error');
      return;
    }

    const email = prompt('Enter email address:', this.bookingData?.booking?.contactDetails?.email || '');
    
    if (!email) return;

    this.showLoading();

    try {
      const response = await fetch(`/api/check-in/bookings/${bookingId}/boarding-pass/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (result.success) {
        this.showMessage(`Boarding pass sent to ${email}`, 'success');
      } else {
        this.showMessage(result.message || 'Failed to send email', 'error');
      }
    } catch (error) {
      console.error('Email error:', error);
      this.showMessage('Failed to send boarding pass email', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  printBoardingPass() {
    const container = document.getElementById('boardingPassContainer');
    if (!container) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Boarding Pass - ${this.bookingData?.booking?.bookingReference || ''}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        ${container.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  navigateToSeatSelection() {
    const bookingId = this.bookingId || this.bookingData?.booking?._id;
    const bookingRef = this.bookingData?.booking?.bookingReference;
    
    if (bookingId) {
      window.location.href = `/html/seat-selection.html?bookingId=${bookingId}`;
    } else if (bookingRef) {
      window.location.href = `/html/seat-selection.html?ref=${bookingRef}`;
    } else {
      this.showMessage('Unable to navigate to seat selection', 'error');
    }
  }

  updateElement(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || 'N/A';
  }

  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.checkInManager = new CheckInManager();
});
