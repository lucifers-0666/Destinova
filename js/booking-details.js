/**
 * 📋 DESTINOVA BOOKING DETAILS
 * Display and manage individual booking details
 */

'use strict';

// ============================================
// STATE
// ============================================

let currentBooking = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 Booking Details Page Initialized');
    
    // Get booking ID from URL
    const bookingId = getBookingIdFromURL();
    
    if (!bookingId) {
        showError('No booking ID provided');
        return;
    }
    
    // Load booking details
    loadBookingDetails(bookingId);
});

/**
 * Get booking ID from URL parameters
 */
function getBookingIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || params.get('bookingId');
}

// ============================================
// DATA LOADING
// ============================================

/**
 * Load booking details from API
 */
async function loadBookingDetails(bookingId) {
    showLoading(true);
    
    try {
        let booking = null;
        
        // Try API first
        if (typeof BookingsAPI !== 'undefined') {
            const response = await BookingsAPI.getBookingById(bookingId);
            if (response.success && response.data) {
                booking = response.data.booking || response.data;
            }
        }
        
        // Check localStorage for recently completed booking
        if (!booking) {
            const confirmationData = localStorage.getItem('destinova_booking_confirmation');
            if (confirmationData) {
                const parsed = JSON.parse(confirmationData);
                if (parsed.bookingId === bookingId || parsed.booking?._id === bookingId) {
                    booking = transformConfirmationToBooking(parsed);
                }
            }
        }
        
        // Check local bookings storage
        if (!booking) {
            const localBookings = localStorage.getItem('userBookings');
            if (localBookings) {
                const bookings = JSON.parse(localBookings);
                booking = bookings.find(b => b.id === bookingId || b._id === bookingId);
            }
        }
        
        if (!booking) {
            // Create demo booking for testing
            booking = createDemoBooking(bookingId);
        }
        
        currentBooking = booking;
        renderBookingDetails(booking);
        
    } catch (error) {
        console.error('Error loading booking details:', error);
        showError('Failed to load booking details');
    } finally {
        showLoading(false);
    }
}

/**
 * Transform confirmation data to booking format
 */
function transformConfirmationToBooking(confirmationData) {
    const { flight, passengers, pricing, bookingId, booking } = confirmationData;
    
    return {
        id: bookingId || booking?._id,
        status: 'confirmed',
        flight: flight || booking?.flight,
        passengers: passengers || booking?.passengers,
        pricing: pricing || booking?.pricing,
        createdAt: confirmationData.confirmedAt || new Date().toISOString()
    };
}

/**
 * Create demo booking for testing
 */
function createDemoBooking(bookingId) {
    return {
        id: bookingId,
        status: 'confirmed',
        flight: {
            airline: 'Air India',
            flightNumber: 'AI 856',
            origin: { code: 'DEL', city: 'New Delhi' },
            destination: { code: 'BOM', city: 'Mumbai' },
            departureTime: '2025-02-20T14:30:00',
            arrivalTime: '2025-02-20T16:30:00',
            duration: 120
        },
        passengers: [
            { title: 'Mr', firstName: 'John', lastName: 'Doe', seat: '12A' },
            { title: 'Mrs', firstName: 'Jane', lastName: 'Doe', seat: '12B' }
        ],
        pricing: {
            baseFare: 12000,
            taxes: 1800,
            addons: 500,
            total: 14300
        },
        cabinClass: 'Economy',
        createdAt: new Date().toISOString()
    };
}

// ============================================
// RENDERING
// ============================================

/**
 * Render booking details
 */
function renderBookingDetails(booking) {
    const container = document.getElementById('booking-card');
    if (!container) return;
    
    const flight = booking.flight || {};
    const origin = flight.origin || {};
    const destination = flight.destination || {};
    const passengers = booking.passengers || [];
    const pricing = booking.pricing || {};
    
    // Format dates and times
    const depTime = flight.departureTime ? new Date(flight.departureTime) : new Date();
    const arrTime = flight.arrivalTime ? new Date(flight.arrivalTime) : new Date();
    const duration = flight.duration || Math.round((arrTime - depTime) / 60000);
    
    const formatTime = (date) => date.toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: true 
    });
    
    const formatDate = (date) => date.toLocaleDateString('en-US', { 
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
    });
    
    // Determine status display
    let statusClass = booking.status || 'confirmed';
    if (statusClass === 'confirmed') {
        statusClass = depTime > new Date() ? 'upcoming' : 'completed';
    }
    
    container.innerHTML = `
        <!-- Header -->
        <div class="booking-header">
            <div class="header-top">
                <div class="booking-ref">
                    Booking Reference
                    <strong>${booking.id || 'N/A'}</strong>
                </div>
                <span class="status-badge ${statusClass}">
                    ${statusClass.charAt(0).toUpperCase() + statusClass.slice(1)}
                </span>
            </div>
            
            <div class="flight-route">
                <div class="route-city">
                    <div class="city-code">${origin.code || 'DEL'}</div>
                    <div class="city-name">${origin.city || 'New Delhi'}</div>
                </div>
                
                <div class="route-line">
                    <div class="duration">${Math.floor(duration / 60)}h ${duration % 60}m</div>
                    <div class="line"></div>
                    <div class="stops">${flight.stops ? `${flight.stops} Stop` : 'Non-stop'}</div>
                </div>
                
                <div class="route-city">
                    <div class="city-code">${destination.code || 'BOM'}</div>
                    <div class="city-name">${destination.city || 'Mumbai'}</div>
                </div>
            </div>
        </div>
        
        <!-- Flight Info -->
        <div class="flight-info-section">
            <div class="info-item">
                <label>Date</label>
                <div class="value">${formatDate(depTime)}</div>
            </div>
            <div class="info-item">
                <label>Departure</label>
                <div class="value">${formatTime(depTime)}</div>
            </div>
            <div class="info-item">
                <label>Arrival</label>
                <div class="value">${formatTime(arrTime)}</div>
            </div>
            <div class="info-item">
                <label>Flight</label>
                <div class="value">${flight.airline || 'Airline'} ${flight.flightNumber || ''}</div>
            </div>
        </div>
        
        <!-- Passengers -->
        <div class="passengers-section">
            <h3 class="section-title">
                <i class="fas fa-users"></i> Passengers (${passengers.length || 1})
            </h3>
            <div class="passenger-list">
                ${passengers.length > 0 ? passengers.map((p, i) => `
                    <div class="passenger-item">
                        <div class="passenger-avatar">
                            ${(p.firstName?.[0] || 'P').toUpperCase()}${(p.lastName?.[0] || (i + 1)).toString().toUpperCase()}
                        </div>
                        <div class="passenger-details">
                            <div class="passenger-name">
                                ${p.title || ''} ${p.firstName || 'Passenger'} ${p.lastName || (i + 1)}
                            </div>
                            <div class="passenger-info">
                                ${booking.cabinClass || 'Economy'} Class
                                ${p.meal ? ` • ${p.meal} Meal` : ''}
                            </div>
                        </div>
                        ${p.seat ? `<div class="passenger-seat">Seat ${p.seat}</div>` : ''}
                    </div>
                `).join('') : `
                    <div class="passenger-item">
                        <div class="passenger-avatar">G</div>
                        <div class="passenger-details">
                            <div class="passenger-name">Guest Passenger</div>
                            <div class="passenger-info">${booking.cabinClass || 'Economy'} Class</div>
                        </div>
                    </div>
                `}
            </div>
        </div>
        
        <!-- Price Breakdown -->
        <div class="price-section">
            <h3 class="section-title">
                <i class="fas fa-receipt"></i> Price Details
            </h3>
            <div class="price-row">
                <span class="label">Base Fare (${passengers.length || 1} Passenger${passengers.length !== 1 ? 's' : ''})</span>
                <span class="value">₹${(pricing.baseFare || 0).toLocaleString()}</span>
            </div>
            <div class="price-row">
                <span class="label">Taxes & Fees</span>
                <span class="value">₹${(pricing.taxes || 0).toLocaleString()}</span>
            </div>
            ${pricing.addons > 0 ? `
                <div class="price-row">
                    <span class="label">Add-ons</span>
                    <span class="value">₹${pricing.addons.toLocaleString()}</span>
                </div>
            ` : ''}
            <div class="price-divider"></div>
            <div class="price-row total">
                <span class="label">Total Paid</span>
                <span class="value">₹${(pricing.total || pricing.baseFare + pricing.taxes).toLocaleString()}</span>
            </div>
        </div>
        
        <!-- Actions -->
        <div class="actions-section">
            <button class="action-btn primary" onclick="downloadTicket()">
                <i class="fas fa-download"></i> Download E-Ticket
            </button>
            <button class="action-btn secondary" onclick="printTicket()">
                <i class="fas fa-print"></i> Print Ticket
            </button>
            <button class="action-btn secondary" onclick="shareBooking()">
                <i class="fas fa-share-alt"></i> Share
            </button>
            ${statusClass === 'upcoming' ? `
                <button class="action-btn danger" onclick="cancelBooking('${booking.id}')">
                    <i class="fas fa-times"></i> Cancel Booking
                </button>
            ` : ''}
        </div>
    `;
}

// ============================================
// ACTIONS
// ============================================

/**
 * Download e-ticket
 */
function downloadTicket() {
    if (!currentBooking) return;
    
    // In production, this would call an API to generate PDF
    alert('E-Ticket download will start shortly...');
    
    // Simulate download
    if (typeof BookingsAPI !== 'undefined') {
        BookingsAPI.downloadTicket(currentBooking.id)
            .then(response => {
                if (response.success && response.data?.url) {
                    window.open(response.data.url, '_blank');
                } else {
                    // Generate simple ticket
                    generateSimpleTicket();
                }
            })
            .catch(() => generateSimpleTicket());
    } else {
        generateSimpleTicket();
    }
}

/**
 * Generate simple ticket for demo
 */
function generateSimpleTicket() {
    const ticketContent = `
DESTINOVA E-TICKET
==================
Booking Reference: ${currentBooking.id}
Status: ${currentBooking.status}

Flight: ${currentBooking.flight?.airline} ${currentBooking.flight?.flightNumber}
From: ${currentBooking.flight?.origin?.city} (${currentBooking.flight?.origin?.code})
To: ${currentBooking.flight?.destination?.city} (${currentBooking.flight?.destination?.code})
Date: ${new Date(currentBooking.flight?.departureTime).toLocaleDateString()}
Time: ${new Date(currentBooking.flight?.departureTime).toLocaleTimeString()}

Passengers:
${currentBooking.passengers?.map(p => `- ${p.title || ''} ${p.firstName} ${p.lastName}`).join('\n') || '- Guest Passenger'}

Total Amount: ₹${currentBooking.pricing?.total?.toLocaleString() || 'N/A'}
    `;
    
    // Create and download text file
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Destinova_Ticket_${currentBooking.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

/**
 * Print ticket
 */
function printTicket() {
    window.print();
}

/**
 * Share booking
 */
function shareBooking() {
    if (!currentBooking) return;
    
    const shareData = {
        title: 'My Destinova Booking',
        text: `Check out my flight booking! ${currentBooking.flight?.origin?.code} → ${currentBooking.flight?.destination?.code}`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch(() => {
            copyToClipboard(window.location.href);
        });
    } else {
        copyToClipboard(window.location.href);
    }
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Booking link copied to clipboard!');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Booking link copied to clipboard!');
    });
}

/**
 * Cancel booking
 */
async function cancelBooking(bookingId) {
    const confirmed = confirm('Are you sure you want to cancel this booking? Cancellation fees may apply.');
    
    if (!confirmed) return;
    
    showLoading(true);
    
    try {
        if (typeof BookingsAPI !== 'undefined') {
            const response = await BookingsAPI.cancelBooking(bookingId);
            
            if (response.success) {
                alert('Booking cancelled successfully. Refund will be processed within 5-7 business days.');
                window.location.href = 'my-bookings.html';
            } else {
                throw new Error(response.message || 'Failed to cancel booking');
            }
        } else {
            // Demo mode
            alert('Booking cancelled successfully (demo mode)');
            window.location.href = 'my-bookings.html';
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert(error.message || 'Failed to cancel booking. Please try again.');
    } finally {
        showLoading(false);
    }
}

// ============================================
// UI UTILITIES
// ============================================

/**
 * Show/hide loading
 */
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

/**
 * Show error message
 */
function showError(message) {
    const container = document.getElementById('booking-card');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: #f0b429; margin-bottom: 20px;"></i>
                <h2 style="margin-bottom: 16px;">Unable to Load Booking</h2>
                <p style="color: #666; margin-bottom: 24px;">${message}</p>
                <a href="my-bookings.html" class="action-btn primary" style="display: inline-flex; text-decoration: none;">
                    <i class="fas fa-arrow-left"></i> Back to My Bookings
                </a>
            </div>
        `;
    }
    showLoading(false);
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.downloadTicket = downloadTicket;
window.printTicket = printTicket;
window.shareBooking = shareBooking;
window.cancelBooking = cancelBooking;
