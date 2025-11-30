/**
 * Seat Selection Module
 * Interactive seat selection UI for flight bookings
 */

'use strict';

// API Base URL
const SEATS_API_BASE = '/api/flights';

// Seat Selection State
const SeatSelectionState = {
  flightId: null,
  selectedSeats: [],
  lockedSeats: [],
  seatMap: [],
  lockTimer: null,
  lockExpiresAt: null,
  maxSeats: 9,
  passengerCount: 1,
  onSelectionChange: null
};

/**
 * Fetch seat map from API
 */
async function fetchSeatMap(flightId) {
  try {
    const response = await fetch(`${SEATS_API_BASE}/${flightId}/seats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch seat map');
    }

    const result = await response.json();
    
    if (result.success) {
      SeatSelectionState.flightId = flightId;
      SeatSelectionState.seatMap = result.data.seatMap;
      return result.data;
    }
    
    throw new Error(result.message || 'Unknown error');
  } catch (error) {
    console.error('[SeatSelection] Error fetching seat map:', error);
    return null;
  }
}

/**
 * Lock selected seats
 */
async function lockSeats(flightId, seatNumbers) {
  try {
    const token = localStorage.getItem('destinova_token');
    
    const response = await fetch(`${SEATS_API_BASE}/${flightId}/seats/lock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ seatNumbers })
    });

    const result = await response.json();
    
    if (result.success) {
      SeatSelectionState.lockedSeats = result.data.lockedSeats;
      SeatSelectionState.lockExpiresAt = new Date(result.data.expiresAt);
      startLockTimer();
      return result.data;
    }
    
    throw new Error(result.message || 'Failed to lock seats');
  } catch (error) {
    console.error('[SeatSelection] Error locking seats:', error);
    return null;
  }
}

/**
 * Release locked seats
 */
async function releaseSeats(flightId, seatNumbers) {
  try {
    const token = localStorage.getItem('destinova_token');
    
    const response = await fetch(`${SEATS_API_BASE}/${flightId}/seats/release`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify({ seatNumbers })
    });

    const result = await response.json();
    
    if (result.success) {
      // Remove released seats from locked list
      SeatSelectionState.lockedSeats = SeatSelectionState.lockedSeats.filter(
        s => !result.data.releasedSeats.includes(s)
      );
      return result.data;
    }
    
    return null;
  } catch (error) {
    console.error('[SeatSelection] Error releasing seats:', error);
    return null;
  }
}

/**
 * Start lock expiration timer
 */
function startLockTimer() {
  if (SeatSelectionState.lockTimer) {
    clearInterval(SeatSelectionState.lockTimer);
  }

  updateLockTimerDisplay();
  
  SeatSelectionState.lockTimer = setInterval(() => {
    updateLockTimerDisplay();
    
    // Check if lock expired
    if (SeatSelectionState.lockExpiresAt && new Date() >= SeatSelectionState.lockExpiresAt) {
      clearInterval(SeatSelectionState.lockTimer);
      handleLockExpired();
    }
  }, 1000);
}

/**
 * Update lock timer display
 */
function updateLockTimerDisplay() {
  const timerEl = document.getElementById('seat-lock-timer');
  if (!timerEl || !SeatSelectionState.lockExpiresAt) return;

  const remaining = Math.max(0, SeatSelectionState.lockExpiresAt - new Date());
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Add warning class if less than 2 minutes
  if (remaining < 120000) {
    timerEl.classList.add('warning');
  }
}

/**
 * Handle lock expiration
 */
function handleLockExpired() {
  SeatSelectionState.lockedSeats = [];
  SeatSelectionState.selectedSeats = [];
  
  // Show notification
  if (typeof showNotification === 'function') {
    showNotification('Your seat selection has expired. Please select again.', 'warning');
  }
  
  // Refresh seat map
  if (SeatSelectionState.flightId) {
    fetchSeatMap(SeatSelectionState.flightId).then(data => {
      if (data) renderSeatMap(document.getElementById('seat-map-container'));
    });
  }
}

/**
 * Toggle seat selection
 */
async function toggleSeatSelection(seatNumber) {
  const seatIndex = SeatSelectionState.selectedSeats.indexOf(seatNumber);
  
  if (seatIndex > -1) {
    // Deselect
    SeatSelectionState.selectedSeats.splice(seatIndex, 1);
    
    // Release the lock
    if (SeatSelectionState.lockedSeats.includes(seatNumber)) {
      await releaseSeats(SeatSelectionState.flightId, [seatNumber]);
    }
  } else {
    // Check if can select more
    if (SeatSelectionState.selectedSeats.length >= SeatSelectionState.passengerCount) {
      if (typeof showNotification === 'function') {
        showNotification(`You can only select ${SeatSelectionState.passengerCount} seat(s)`, 'warning');
      }
      return;
    }
    
    // Select
    SeatSelectionState.selectedSeats.push(seatNumber);
    
    // Lock the seat
    const lockResult = await lockSeats(SeatSelectionState.flightId, [seatNumber]);
    
    if (!lockResult) {
      // Failed to lock, remove selection
      SeatSelectionState.selectedSeats.pop();
      if (typeof showNotification === 'function') {
        showNotification('This seat is no longer available', 'error');
      }
      return;
    }
  }
  
  // Update UI
  updateSeatUI(seatNumber);
  updateSelectionSummary();
  
  // Trigger callback
  if (SeatSelectionState.onSelectionChange) {
    SeatSelectionState.onSelectionChange(SeatSelectionState.selectedSeats);
  }
}

/**
 * Update individual seat UI
 */
function updateSeatUI(seatNumber) {
  const seatEl = document.querySelector(`[data-seat="${seatNumber}"]`);
  if (!seatEl) return;

  const isSelected = SeatSelectionState.selectedSeats.includes(seatNumber);
  seatEl.classList.toggle('selected', isSelected);
}

/**
 * Update selection summary
 */
function updateSelectionSummary() {
  const summaryEl = document.getElementById('seat-selection-summary');
  if (!summaryEl) return;

  const selectedSeats = SeatSelectionState.selectedSeats;
  const seatMap = SeatSelectionState.seatMap;
  
  // Calculate total cost
  let totalCost = 0;
  selectedSeats.forEach(seatNumber => {
    const seat = seatMap.find(s => s.seatNumber === seatNumber || s.seat === seatNumber);
    if (seat) {
      totalCost += seat.price || 0;
    }
  });

  summaryEl.innerHTML = `
    <div class="selected-seats-list">
      <strong>Selected Seats:</strong> 
      ${selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
    </div>
    <div class="seat-selection-cost">
      <strong>Seat Selection Cost:</strong> 
      ₹${totalCost.toLocaleString()}
    </div>
  `;
}

/**
 * Render seat map
 */
function renderSeatMap(container, options = {}) {
  if (!container) return;

  const { 
    seatMap = SeatSelectionState.seatMap,
    showLegend = true,
    readOnly = false 
  } = options;

  if (!seatMap || seatMap.length === 0) {
    container.innerHTML = '<p class="no-seats">Seat map not available</p>';
    return;
  }

  // Group seats by row
  const seatsByRow = {};
  seatMap.forEach(seat => {
    const row = seat.row;
    if (!seatsByRow[row]) {
      seatsByRow[row] = [];
    }
    seatsByRow[row].push(seat);
  });

  // Determine seat class sections
  const firstClassRows = [];
  const businessRows = [];
  const economyRows = [];

  Object.keys(seatsByRow).forEach(row => {
    const seats = seatsByRow[row];
    const seatClass = seats[0]?.class;
    
    if (seatClass === 'first') {
      firstClassRows.push(parseInt(row));
    } else if (seatClass === 'business') {
      businessRows.push(parseInt(row));
    } else {
      economyRows.push(parseInt(row));
    }
  });

  let html = `
    <div class="seat-map-wrapper">
      ${showLegend ? renderSeatLegend() : ''}
      
      <div class="lock-timer-container">
        <span class="timer-icon">⏱️</span>
        <span id="seat-lock-timer">10:00</span>
        <span class="timer-label">remaining</span>
      </div>
      
      <div class="aircraft-cabin">
        <div class="cabin-front">
          <div class="cockpit">✈️ COCKPIT</div>
        </div>
  `;

  // First Class Section
  if (firstClassRows.length > 0) {
    html += `
      <div class="cabin-section first-class">
        <div class="section-header">First Class</div>
        ${renderSeatRows(seatsByRow, firstClassRows, readOnly)}
      </div>
    `;
  }

  // Business Class Section  
  if (businessRows.length > 0) {
    html += `
      <div class="cabin-section business-class">
        <div class="section-header">Business Class</div>
        ${renderSeatRows(seatsByRow, businessRows, readOnly)}
      </div>
    `;
  }

  // Economy Class Section
  if (economyRows.length > 0) {
    html += `
      <div class="cabin-section economy-class">
        <div class="section-header">Economy Class</div>
        ${renderSeatRows(seatsByRow, economyRows, readOnly)}
      </div>
    `;
  }

  html += `
        <div class="cabin-rear">
          <div class="lavatory">🚻 LAVATORY</div>
        </div>
      </div>
    </div>
    
    <div id="seat-selection-summary" class="seat-selection-summary"></div>
  `;

  container.innerHTML = html;
  
  // Add event listeners
  if (!readOnly) {
    container.querySelectorAll('.seat:not(.unavailable):not(.booked)').forEach(seatEl => {
      seatEl.addEventListener('click', () => {
        const seatNumber = seatEl.dataset.seat;
        toggleSeatSelection(seatNumber);
      });
    });
  }

  updateSelectionSummary();
}

/**
 * Render seat rows
 */
function renderSeatRows(seatsByRow, rowNumbers, readOnly) {
  let html = '';
  
  rowNumbers.sort((a, b) => a - b).forEach(rowNum => {
    const seats = seatsByRow[rowNum];
    if (!seats) return;

    // Sort seats alphabetically
    seats.sort((a, b) => {
      const seatA = a.seatNumber || a.seat;
      const seatB = b.seatNumber || b.seat;
      return seatA.localeCompare(seatB);
    });

    html += `<div class="seat-row" data-row="${rowNum}">`;
    html += `<div class="row-number">${rowNum}</div>`;
    
    // Left side seats (A, B, C)
    html += '<div class="seat-group left">';
    seats.filter(s => {
      const letter = (s.seatNumber || s.seat).slice(-1);
      return ['A', 'B', 'C'].includes(letter);
    }).forEach(seat => {
      html += renderSeat(seat, readOnly);
    });
    html += '</div>';
    
    // Aisle
    html += '<div class="aisle"></div>';
    
    // Right side seats (D, E, F)
    html += '<div class="seat-group right">';
    seats.filter(s => {
      const letter = (s.seatNumber || s.seat).slice(-1);
      return ['D', 'E', 'F'].includes(letter);
    }).forEach(seat => {
      html += renderSeat(seat, readOnly);
    });
    html += '</div>';
    
    html += '</div>';
  });
  
  return html;
}

/**
 * Render individual seat
 */
function renderSeat(seat, readOnly) {
  const seatNumber = seat.seatNumber || seat.seat;
  const isSelected = SeatSelectionState.selectedSeats.includes(seatNumber);
  const isLocked = seat.isLocked && !SeatSelectionState.lockedSeats.includes(seatNumber);
  const isUnavailable = !seat.isAvailable || seat.status === 'booked' || isLocked;
  
  let classes = ['seat'];
  classes.push(seat.class);
  classes.push(seat.type);
  
  if (isSelected) classes.push('selected');
  if (isUnavailable) classes.push('unavailable');
  if (seat.isEmergencyExit) classes.push('exit-row');
  if (readOnly) classes.push('readonly');
  
  const tooltip = getSeatTooltip(seat);
  
  return `
    <div class="${classes.join(' ')}" 
         data-seat="${seatNumber}"
         data-price="${seat.price || 0}"
         title="${tooltip}">
      <span class="seat-letter">${seatNumber.slice(-1)}</span>
      ${seat.price > 0 ? `<span class="seat-price">+₹${seat.price}</span>` : ''}
    </div>
  `;
}

/**
 * Get seat tooltip text
 */
function getSeatTooltip(seat) {
  const parts = [
    `Seat ${seat.seatNumber || seat.seat}`,
    `${seat.class.charAt(0).toUpperCase() + seat.class.slice(1)} Class`,
    seat.type.charAt(0).toUpperCase() + seat.type.slice(1)
  ];
  
  if (seat.isEmergencyExit) parts.push('Emergency Exit Row');
  if (seat.features?.includes('extra-legroom')) parts.push('Extra Legroom');
  if (seat.price > 0) parts.push(`+₹${seat.price}`);
  if (!seat.isAvailable) parts.push('Unavailable');
  
  return parts.join(' | ');
}

/**
 * Render seat legend
 */
function renderSeatLegend() {
  return `
    <div class="seat-legend">
      <div class="legend-item">
        <div class="legend-seat available"></div>
        <span>Available</span>
      </div>
      <div class="legend-item">
        <div class="legend-seat selected"></div>
        <span>Selected</span>
      </div>
      <div class="legend-item">
        <div class="legend-seat unavailable"></div>
        <span>Unavailable</span>
      </div>
      <div class="legend-item">
        <div class="legend-seat exit-row"></div>
        <span>Exit Row (+₹)</span>
      </div>
      <div class="legend-item">
        <div class="legend-seat window"></div>
        <span>Window</span>
      </div>
      <div class="legend-item">
        <div class="legend-seat aisle"></div>
        <span>Aisle</span>
      </div>
    </div>
  `;
}

/**
 * Initialize seat selection
 */
async function initializeSeatSelection(container, options = {}) {
  const {
    flightId,
    passengerCount = 1,
    preSelectedSeats = [],
    onSelectionChange = null
  } = options;

  if (!flightId) {
    console.error('[SeatSelection] Flight ID is required');
    return;
  }

  // Update state
  SeatSelectionState.flightId = flightId;
  SeatSelectionState.passengerCount = passengerCount;
  SeatSelectionState.selectedSeats = [...preSelectedSeats];
  SeatSelectionState.onSelectionChange = onSelectionChange;

  // Show loading
  container.innerHTML = `
    <div class="seat-map-loading">
      <div class="loading-spinner"></div>
      <p>Loading seat map...</p>
    </div>
  `;

  // Fetch seat map
  const data = await fetchSeatMap(flightId);
  
  if (!data) {
    container.innerHTML = `
      <div class="seat-map-error">
        <p>Failed to load seat map. Please try again.</p>
        <button onclick="initializeSeatSelection(this.parentElement.parentElement, ${JSON.stringify(options)})">
          Retry
        </button>
      </div>
    `;
    return;
  }

  // Render seat map
  renderSeatMap(container);

  // Lock pre-selected seats
  if (preSelectedSeats.length > 0) {
    await lockSeats(flightId, preSelectedSeats);
  }
}

/**
 * Get current selection
 */
function getSelectedSeats() {
  return {
    seats: [...SeatSelectionState.selectedSeats],
    totalCost: calculateSeatsCost(),
    flightId: SeatSelectionState.flightId
  };
}

/**
 * Calculate total seat selection cost
 */
function calculateSeatsCost() {
  let total = 0;
  SeatSelectionState.selectedSeats.forEach(seatNumber => {
    const seat = SeatSelectionState.seatMap.find(
      s => s.seatNumber === seatNumber || s.seat === seatNumber
    );
    if (seat) {
      total += seat.price || 0;
    }
  });
  return total;
}

/**
 * Clear selection
 */
async function clearSeatSelection() {
  if (SeatSelectionState.lockedSeats.length > 0) {
    await releaseSeats(SeatSelectionState.flightId, SeatSelectionState.lockedSeats);
  }
  
  SeatSelectionState.selectedSeats = [];
  SeatSelectionState.lockedSeats = [];
  
  // Update UI
  document.querySelectorAll('.seat.selected').forEach(el => {
    el.classList.remove('selected');
  });
  
  updateSelectionSummary();
}

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
  if (SeatSelectionState.lockedSeats.length > 0) {
    // Release locks (best effort)
    releaseSeats(SeatSelectionState.flightId, SeatSelectionState.lockedSeats);
  }
});

// Export for use in other modules
window.SeatSelection = {
  initialize: initializeSeatSelection,
  getSelectedSeats,
  clearSelection: clearSeatSelection,
  calculateCost: calculateSeatsCost,
  lockSeats,
  releaseSeats
};
