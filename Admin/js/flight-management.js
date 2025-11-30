/**
 * Flight Management Module
 * Admin CRUD operations for flights
 */

class FlightManagement {
  constructor() {
    this.flights = [];
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalPages = 1;
    this.filters = {
      search: '',
      status: '',
      airline: '',
      dateFrom: '',
      dateTo: ''
    };
    this.selectedFlights = new Set();
    this.editingFlightId = null;
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.loadFlights();
    this.loadAirlines();
  }

  cacheElements() {
    this.elements = {
      flightsTable: document.getElementById('flightsTable'),
      flightsTbody: document.getElementById('flightsTbody'),
      searchInput: document.getElementById('flightSearch'),
      statusFilter: document.getElementById('statusFilter'),
      airlineFilter: document.getElementById('airlineFilter'),
      dateFromFilter: document.getElementById('dateFromFilter'),
      dateToFilter: document.getElementById('dateToFilter'),
      addFlightBtn: document.getElementById('addFlightBtn'),
      bulkActionsDropdown: document.getElementById('bulkActionsDropdown'),
      selectAllCheckbox: document.getElementById('selectAll'),
      selectedCount: document.getElementById('selectedCount'),
      pagination: document.getElementById('pagination'),
      modal: document.getElementById('flightModal'),
      modalTitle: document.getElementById('modalTitle'),
      flightForm: document.getElementById('flightForm'),
      loadingOverlay: document.getElementById('loadingOverlay'),
      flightStats: document.getElementById('flightStats')
    };
  }

  bindEvents() {
    // Search and filters
    this.elements.searchInput?.addEventListener('input', this.debounce(() => this.handleSearch(), 300));
    this.elements.statusFilter?.addEventListener('change', () => this.handleFilter());
    this.elements.airlineFilter?.addEventListener('change', () => this.handleFilter());
    this.elements.dateFromFilter?.addEventListener('change', () => this.handleFilter());
    this.elements.dateToFilter?.addEventListener('change', () => this.handleFilter());

    // Add flight button
    this.elements.addFlightBtn?.addEventListener('click', () => this.openModal());

    // Select all checkbox
    this.elements.selectAllCheckbox?.addEventListener('change', (e) => this.handleSelectAll(e));

    // Form submission
    this.elements.flightForm?.addEventListener('submit', (e) => this.handleFormSubmit(e));

    // Bulk actions
    document.querySelectorAll('.bulk-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleBulkAction(e.target.dataset.action));
    });

    // Modal close
    document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
      btn.addEventListener('click', () => this.closeModal());
    });

    // Export button
    document.getElementById('exportFlightsBtn')?.addEventListener('click', () => this.exportFlights());

    // Refresh button
    document.getElementById('refreshFlightsBtn')?.addEventListener('click', () => this.loadFlights());
  }

  showLoading(show = true) {
    this.elements.loadingOverlay?.classList.toggle('show', show);
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  async loadFlights() {
    this.showLoading(true);

    try {
      const params = new URLSearchParams({
        page: this.currentPage,
        limit: this.pageSize,
        ...this.filters
      });

      const response = await fetch(`/api/flights?${params}`, {
        headers: this.getAuthHeaders()
      });

      const result = await response.json();

      if (result.success) {
        this.flights = result.data || [];
        this.totalPages = result.pagination?.pages || 1;
        this.renderFlights();
        this.renderPagination();
        this.updateStats(result);
      } else {
        this.showError(result.message || 'Failed to load flights');
        // Load mock data for demo
        this.loadMockFlights();
      }
    } catch (error) {
      console.error('Error loading flights:', error);
      this.loadMockFlights();
    } finally {
      this.showLoading(false);
    }
  }

  loadMockFlights() {
    this.flights = [
      {
        _id: '1',
        flightNumber: 'AI-101',
        airline: { name: 'Air India', code: 'AI' },
        origin: { airportCode: 'DEL', city: 'New Delhi' },
        destination: { airportCode: 'BOM', city: 'Mumbai' },
        departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        price: { economy: 4500, business: 12000, first: 25000 },
        availableSeats: { economy: 120, business: 24, first: 8 },
        totalSeats: { economy: 150, business: 30, first: 10 },
        status: 'scheduled',
        aircraft: 'Airbus A320'
      },
      {
        _id: '2',
        flightNumber: 'UK-826',
        airline: { name: 'Vistara', code: 'UK' },
        origin: { airportCode: 'BLR', city: 'Bengaluru' },
        destination: { airportCode: 'DEL', city: 'New Delhi' },
        departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000),
        price: { economy: 5200, business: 14000, first: 28000 },
        availableSeats: { economy: 80, business: 20, first: 6 },
        totalSeats: { economy: 140, business: 28, first: 8 },
        status: 'scheduled',
        aircraft: 'Boeing 737-800'
      },
      {
        _id: '3',
        flightNumber: '6E-505',
        airline: { name: 'IndiGo', code: '6E' },
        origin: { airportCode: 'HYD', city: 'Hyderabad' },
        destination: { airportCode: 'MAA', city: 'Chennai' },
        departureTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
        price: { economy: 3200, business: 8000 },
        availableSeats: { economy: 150, business: 12 },
        totalSeats: { economy: 180, business: 12 },
        status: 'on-time',
        aircraft: 'Airbus A320neo'
      }
    ];
    this.totalPages = 1;
    this.renderFlights();
    this.renderPagination();
    this.updateStats({ total: 3, stats: { scheduled: 2, onTime: 1 } });
  }

  async loadAirlines() {
    try {
      const response = await fetch('/api/flights/airlines', {
        headers: this.getAuthHeaders()
      });
      const result = await response.json();

      if (result.success && this.elements.airlineFilter) {
        result.data?.forEach(airline => {
          const option = document.createElement('option');
          option.value = airline.code || airline._id;
          option.textContent = airline.name;
          this.elements.airlineFilter.appendChild(option);
        });
      }
    } catch (error) {
      console.log('Could not load airlines:', error);
    }
  }

  renderFlights() {
    if (!this.elements.flightsTbody) return;

    if (this.flights.length === 0) {
      this.elements.flightsTbody.innerHTML = `
        <tr>
          <td colspan="10" class="empty-state">
            <i class="fas fa-plane-slash"></i>
            <p>No flights found</p>
            <button class="btn btn-primary" onclick="flightManager.openModal()">
              <i class="fas fa-plus"></i> Add First Flight
            </button>
          </td>
        </tr>
      `;
      return;
    }

    this.elements.flightsTbody.innerHTML = this.flights.map(flight => `
      <tr data-id="${flight._id}">
        <td>
          <input type="checkbox" class="flight-checkbox" 
                 ${this.selectedFlights.has(flight._id) ? 'checked' : ''}
                 onchange="flightManager.handleFlightSelect('${flight._id}', this.checked)">
        </td>
        <td>
          <div class="flight-number">
            <strong>${flight.flightNumber}</strong>
            <small>${flight.airline?.name || 'N/A'}</small>
          </div>
        </td>
        <td>
          <div class="route">
            <span class="route-code">${flight.origin?.airportCode || flight.origin || 'N/A'}</span>
            <i class="fas fa-arrow-right"></i>
            <span class="route-code">${flight.destination?.airportCode || flight.destination || 'N/A'}</span>
          </div>
          <small class="route-cities">
            ${flight.origin?.city || ''} → ${flight.destination?.city || ''}
          </small>
        </td>
        <td>
          <div class="datetime">
            <div>${this.formatDate(flight.departureTime)}</div>
            <small>${this.formatTime(flight.departureTime)}</small>
          </div>
        </td>
        <td>
          <div class="datetime">
            <div>${this.formatDate(flight.arrivalTime)}</div>
            <small>${this.formatTime(flight.arrivalTime)}</small>
          </div>
        </td>
        <td>
          <span class="price">₹${(flight.price?.economy || flight.basePrice || 0).toLocaleString()}</span>
        </td>
        <td>
          <div class="seats-info">
            <div class="seats-bar">
              <div class="seats-fill" style="width: ${this.calculateOccupancy(flight)}%"></div>
            </div>
            <small>${this.getTotalAvailable(flight)} / ${this.getTotalSeats(flight)}</small>
          </div>
        </td>
        <td>
          <span class="status-badge status-${flight.status?.toLowerCase().replace(/\s+/g, '-') || 'scheduled'}">
            ${flight.status || 'Scheduled'}
          </span>
        </td>
        <td class="actions-cell">
          <button class="btn-icon" onclick="flightManager.viewFlight('${flight._id}')" title="View">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-icon" onclick="flightManager.editFlight('${flight._id}')" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon btn-danger" onclick="flightManager.deleteFlight('${flight._id}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  renderPagination() {
    if (!this.elements.pagination) return;

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
      <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
              onclick="flightManager.goToPage(${this.currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
      </button>
    `;

    // Page numbers
    for (let i = 1; i <= this.totalPages; i++) {
      if (i === 1 || i === this.totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        paginationHTML += `
          <button class="page-btn ${i === this.currentPage ? 'active' : ''}" 
                  onclick="flightManager.goToPage(${i})">${i}</button>
        `;
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        paginationHTML += '<span class="page-ellipsis">...</span>';
      }
    }

    // Next button
    paginationHTML += `
      <button class="page-btn" ${this.currentPage === this.totalPages ? 'disabled' : ''} 
              onclick="flightManager.goToPage(${this.currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
      </button>
    `;

    this.elements.pagination.innerHTML = paginationHTML;
  }

  updateStats(data) {
    if (!this.elements.flightStats) return;

    const stats = data.stats || {};
    this.elements.flightStats.innerHTML = `
      <div class="stat-item">
        <span class="stat-number">${data.total || this.flights.length}</span>
        <span class="stat-label">Total Flights</span>
      </div>
      <div class="stat-item">
        <span class="stat-number stat-scheduled">${stats.scheduled || 0}</span>
        <span class="stat-label">Scheduled</span>
      </div>
      <div class="stat-item">
        <span class="stat-number stat-ontime">${stats.onTime || stats['on-time'] || 0}</span>
        <span class="stat-label">On Time</span>
      </div>
      <div class="stat-item">
        <span class="stat-number stat-delayed">${stats.delayed || 0}</span>
        <span class="stat-label">Delayed</span>
      </div>
      <div class="stat-item">
        <span class="stat-number stat-cancelled">${stats.cancelled || 0}</span>
        <span class="stat-label">Cancelled</span>
      </div>
    `;
  }

  goToPage(page) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadFlights();
  }

  handleSearch() {
    this.filters.search = this.elements.searchInput?.value || '';
    this.currentPage = 1;
    this.loadFlights();
  }

  handleFilter() {
    this.filters.status = this.elements.statusFilter?.value || '';
    this.filters.airline = this.elements.airlineFilter?.value || '';
    this.filters.dateFrom = this.elements.dateFromFilter?.value || '';
    this.filters.dateTo = this.elements.dateToFilter?.value || '';
    this.currentPage = 1;
    this.loadFlights();
  }

  handleSelectAll(e) {
    const checked = e.target.checked;
    document.querySelectorAll('.flight-checkbox').forEach(cb => {
      cb.checked = checked;
      const flightId = cb.closest('tr')?.dataset.id;
      if (flightId) {
        if (checked) {
          this.selectedFlights.add(flightId);
        } else {
          this.selectedFlights.delete(flightId);
        }
      }
    });
    this.updateSelectedCount();
  }

  handleFlightSelect(flightId, checked) {
    if (checked) {
      this.selectedFlights.add(flightId);
    } else {
      this.selectedFlights.delete(flightId);
    }
    this.updateSelectedCount();
  }

  updateSelectedCount() {
    if (this.elements.selectedCount) {
      this.elements.selectedCount.textContent = this.selectedFlights.size;
    }
    if (this.elements.bulkActionsDropdown) {
      this.elements.bulkActionsDropdown.style.display = this.selectedFlights.size > 0 ? 'flex' : 'none';
    }
  }

  async handleBulkAction(action) {
    if (this.selectedFlights.size === 0) {
      this.showNotification('Please select flights first', 'warning');
      return;
    }

    const flightIds = Array.from(this.selectedFlights);

    switch (action) {
      case 'cancel':
        if (!confirm(`Cancel ${flightIds.length} flight(s)?`)) return;
        await this.bulkUpdateStatus(flightIds, 'cancelled');
        break;
      case 'activate':
        if (!confirm(`Activate ${flightIds.length} flight(s)?`)) return;
        await this.bulkUpdateStatus(flightIds, 'scheduled');
        break;
      case 'delete':
        if (!confirm(`Delete ${flightIds.length} flight(s)? This cannot be undone.`)) return;
        await this.bulkDelete(flightIds);
        break;
    }
  }

  async bulkUpdateStatus(flightIds, status) {
    this.showLoading(true);
    try {
      const response = await fetch('/api/admin/flights/bulk-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ flightIds, status })
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification(`Successfully updated ${flightIds.length} flights`, 'success');
        this.selectedFlights.clear();
        this.loadFlights();
      } else {
        this.showNotification(result.message || 'Update failed', 'error');
      }
    } catch (error) {
      this.showNotification('Bulk update failed', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async bulkDelete(flightIds) {
    this.showLoading(true);
    try {
      const response = await fetch('/api/admin/flights/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ flightIds })
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification(`Successfully deleted ${flightIds.length} flights`, 'success');
        this.selectedFlights.clear();
        this.loadFlights();
      } else {
        this.showNotification(result.message || 'Delete failed', 'error');
      }
    } catch (error) {
      this.showNotification('Bulk delete failed', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  openModal(flight = null) {
    this.editingFlightId = flight?._id || null;
    
    if (this.elements.modalTitle) {
      this.elements.modalTitle.textContent = flight ? 'Edit Flight' : 'Add New Flight';
    }

    if (this.elements.flightForm) {
      if (flight) {
        this.populateForm(flight);
      } else {
        this.elements.flightForm.reset();
      }
    }

    this.elements.modal?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.elements.modal?.classList.remove('show');
    document.body.style.overflow = '';
    this.editingFlightId = null;
  }

  populateForm(flight) {
    const form = this.elements.flightForm;
    if (!form) return;

    form.querySelector('#formFlightNumber').value = flight.flightNumber || '';
    form.querySelector('#formAirline').value = flight.airline?.code || flight.airline || '';
    form.querySelector('#formOrigin').value = flight.origin?.airportCode || flight.origin || '';
    form.querySelector('#formDestination').value = flight.destination?.airportCode || flight.destination || '';
    form.querySelector('#formDepartureDate').value = this.formatDateInput(flight.departureTime);
    form.querySelector('#formDepartureTime').value = this.formatTimeInput(flight.departureTime);
    form.querySelector('#formArrivalDate').value = this.formatDateInput(flight.arrivalTime);
    form.querySelector('#formArrivalTime').value = this.formatTimeInput(flight.arrivalTime);
    form.querySelector('#formEconomyPrice').value = flight.price?.economy || flight.basePrice || '';
    form.querySelector('#formBusinessPrice').value = flight.price?.business || '';
    form.querySelector('#formFirstPrice').value = flight.price?.first || '';
    form.querySelector('#formEconomySeats').value = flight.totalSeats?.economy || '';
    form.querySelector('#formBusinessSeats').value = flight.totalSeats?.business || '';
    form.querySelector('#formFirstSeats').value = flight.totalSeats?.first || '';
    form.querySelector('#formAircraft').value = flight.aircraft || '';
    form.querySelector('#formStatus').value = flight.status || 'scheduled';
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const flightData = {
      flightNumber: formData.get('flightNumber'),
      airline: formData.get('airline'),
      origin: formData.get('origin'),
      destination: formData.get('destination'),
      departureTime: new Date(`${formData.get('departureDate')}T${formData.get('departureTime')}`),
      arrivalTime: new Date(`${formData.get('arrivalDate')}T${formData.get('arrivalTime')}`),
      price: {
        economy: parseFloat(formData.get('economyPrice')) || 0,
        business: parseFloat(formData.get('businessPrice')) || 0,
        first: parseFloat(formData.get('firstPrice')) || 0
      },
      totalSeats: {
        economy: parseInt(formData.get('economySeats')) || 0,
        business: parseInt(formData.get('businessSeats')) || 0,
        first: parseInt(formData.get('firstSeats')) || 0
      },
      aircraft: formData.get('aircraft'),
      status: formData.get('status')
    };

    this.showLoading(true);

    try {
      const url = this.editingFlightId 
        ? `/api/flights/${this.editingFlightId}`
        : '/api/flights';
      
      const method = this.editingFlightId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(flightData)
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification(
          this.editingFlightId ? 'Flight updated successfully' : 'Flight created successfully',
          'success'
        );
        this.closeModal();
        this.loadFlights();
      } else {
        this.showNotification(result.message || 'Operation failed', 'error');
      }
    } catch (error) {
      this.showNotification('Failed to save flight', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  viewFlight(flightId) {
    const flight = this.flights.find(f => f._id === flightId);
    if (!flight) return;

    const detailsHtml = `
      <div class="flight-details-modal">
        <div class="detail-header">
          <h2>${flight.flightNumber}</h2>
          <span class="status-badge status-${flight.status}">${flight.status}</span>
        </div>
        <div class="detail-grid">
          <div class="detail-item">
            <label>Airline</label>
            <span>${flight.airline?.name || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <label>Aircraft</label>
            <span>${flight.aircraft || 'N/A'}</span>
          </div>
          <div class="detail-item">
            <label>Route</label>
            <span>${flight.origin?.city} → ${flight.destination?.city}</span>
          </div>
          <div class="detail-item">
            <label>Departure</label>
            <span>${this.formatDateTime(flight.departureTime)}</span>
          </div>
          <div class="detail-item">
            <label>Arrival</label>
            <span>${this.formatDateTime(flight.arrivalTime)}</span>
          </div>
          <div class="detail-item">
            <label>Duration</label>
            <span>${this.calculateDuration(flight.departureTime, flight.arrivalTime)}</span>
          </div>
        </div>
        <div class="pricing-table">
          <h4>Pricing & Seats</h4>
          <table>
            <thead>
              <tr><th>Class</th><th>Price</th><th>Available</th><th>Total</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Economy</td>
                <td>₹${(flight.price?.economy || 0).toLocaleString()}</td>
                <td>${flight.availableSeats?.economy || 0}</td>
                <td>${flight.totalSeats?.economy || 0}</td>
              </tr>
              <tr>
                <td>Business</td>
                <td>₹${(flight.price?.business || 0).toLocaleString()}</td>
                <td>${flight.availableSeats?.business || 0}</td>
                <td>${flight.totalSeats?.business || 0}</td>
              </tr>
              <tr>
                <td>First</td>
                <td>₹${(flight.price?.first || 0).toLocaleString()}</td>
                <td>${flight.availableSeats?.first || 0}</td>
                <td>${flight.totalSeats?.first || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Show in modal or alert
    alert(`Flight Details:\n${flight.flightNumber}\n${flight.origin?.city} → ${flight.destination?.city}\nStatus: ${flight.status}`);
  }

  editFlight(flightId) {
    const flight = this.flights.find(f => f._id === flightId);
    if (flight) {
      this.openModal(flight);
    }
  }

  async deleteFlight(flightId) {
    if (!confirm('Are you sure you want to delete this flight?')) return;

    this.showLoading(true);

    try {
      const response = await fetch(`/api/flights/${flightId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const result = await response.json();

      if (result.success) {
        this.showNotification('Flight deleted successfully', 'success');
        this.loadFlights();
      } else {
        this.showNotification(result.message || 'Delete failed', 'error');
      }
    } catch (error) {
      this.showNotification('Failed to delete flight', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async exportFlights() {
    this.showLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/export/flights', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `flights-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        this.showNotification('Export successful', 'success');
      } else {
        this.showNotification('Export failed', 'error');
      }
    } catch (error) {
      this.showNotification('Export failed', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  // Helper methods
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(dateStr) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  formatDateTime(dateStr) {
    return `${this.formatDate(dateStr)} ${this.formatTime(dateStr)}`;
  }

  formatDateInput(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  formatTimeInput(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toTimeString().substring(0, 5);
  }

  calculateDuration(departure, arrival) {
    if (!departure || !arrival) return 'N/A';
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  calculateOccupancy(flight) {
    const available = this.getTotalAvailable(flight);
    const total = this.getTotalSeats(flight);
    if (total === 0) return 0;
    return ((total - available) / total * 100).toFixed(0);
  }

  getTotalAvailable(flight) {
    if (!flight.availableSeats) return 0;
    return (flight.availableSeats.economy || 0) + 
           (flight.availableSeats.business || 0) + 
           (flight.availableSeats.first || 0);
  }

  getTotalSeats(flight) {
    if (!flight.totalSeats) return 0;
    return (flight.totalSeats.economy || 0) + 
           (flight.totalSeats.business || 0) + 
           (flight.totalSeats.first || 0);
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  showError(message) {
    this.showNotification(message, 'error');
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.flightManager = new FlightManagement();
});
