/* ═══════════════════════════════════════════════════════════════════
   DESTINOVA BOOKING CONFIRMATION - COMPLETE JAVASCRIPT
   Modern, Interactive, Feature-Rich
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BOOKING DATA (This would come from backend in production)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BOOKING_DATA = {
    bookingRef: 'DEST1NOVA',
    airline: 'Destinova Air',
    flightNumber: 'DN 789',
    departure: {
        code: 'DEL',
        city: 'New Delhi',
        airport: 'Indira Gandhi Int\'l',
        time: '08:00',
        date: '15 Mar, 2025',
        terminal: '3',
        gate: '24A'
    },
    arrival: {
        code: 'BOM',
        city: 'Mumbai',
        airport: 'Chhatrapati Shivaji Int\'l',
        time: '10:10',
        date: '15 Mar, 2025',
        terminal: '2'
    },
    duration: '2h 10m',
    stops: 'Non-stop',
    passengers: [
        {
            name: 'Diwakar Monga',
            seat: '12A',
            class: 'Economy',
            baggage: '2x23kg'
        }
    ],
    bookingDate: '28 Oct, 2025',
    paymentMethod: 'Card ****1234',
    totalAmount: '₹21,600'
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Destinova Booking Confirmation - Initialized');
    
    // Initialize all features
    initializeParticles();
    fireConfetti();
    generateQRCode();
    setupEventListeners();
    animateElements();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PARTICLES.JS INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-success', {
            particles: {
                number: {
                    value: 60,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#E5CBAF', '#2a7d4a', '#ffffff']
                },
                shape: {
                    type: ['circle', 'triangle'],
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.6,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 4,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 3,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: false
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'top',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'bubble'
                    },
                    onclick: {
                        enable: true,
                        mode: 'repulse'
                    },
                    resize: true
                },
                modes: {
                    bubble: {
                        distance: 200,
                        size: 6,
                        duration: 2,
                        opacity: 0.8,
                        speed: 3
                    },
                    repulse: {
                        distance: 150,
                        duration: 0.4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFETTI CELEBRATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function fireConfetti() {
    if (typeof confetti === 'undefined') return;
    
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 10000,
        colors: ['#2a7d4a', '#E5CBAF', '#3a9c60', '#d4b591', '#1d5e33']
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Fire from left side
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        
        // Fire from right side
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// QR CODE GENERATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function generateQRCode() {
    const qrContainer = document.getElementById('qr-code-container');
    if (!qrContainer || typeof QRCode === 'undefined') return;
    
    // Clear any existing QR code
    qrContainer.innerHTML = '';
    
    // Generate QR code with booking reference
    const qrCode = new QRCode(qrContainer, {
        text: `DESTINOVA-${BOOKING_DATA.bookingRef}-${BOOKING_DATA.flightNumber}`,
        width: 128,
        height: 128,
        colorDark: '#1d5e33',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT LISTENERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setupEventListeners() {
    // Copy Booking Reference
    const copyBtn = document.getElementById('copy-ref-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyBookingReference);
    }
    
    // Download Ticket
    const downloadBtn = document.getElementById('download-ticket-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadTicketPDF);
    }
    
    // Email Ticket
    const emailBtn = document.getElementById('email-ticket-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', emailTicket);
    }
    
    // Add to Calendar
    const calendarBtn = document.getElementById('add-to-calendar-btn');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', addToCalendar);
    }
    
    // Print
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
    }
    
    // Social Share Buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialShare);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COPY BOOKING REFERENCE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function copyBookingReference() {
    const bookingRef = document.getElementById('booking-ref').textContent;
    const tooltip = document.getElementById('copy-tooltip');
    
    navigator.clipboard.writeText(bookingRef).then(() => {
        // Show tooltip
        tooltip.classList.add('show');
        
        // Trigger mini confetti
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 30,
                spread: 60,
                origin: { y: 0.2 },
                colors: ['#2a7d4a', '#E5CBAF']
            });
        }
        
        // Hide tooltip after 2 seconds
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy booking reference');
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DOWNLOAD TICKET PDF
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function downloadTicketPDF() {
    const btn = document.getElementById('download-ticket-btn');
    const originalHTML = btn.innerHTML;
    
    // Show loading state
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Generating PDF...</span>';
    
    // Get ticket card element
    const ticketCard = document.getElementById('ticket-card');
    
    if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
        alert('PDF generation libraries not loaded. Please refresh the page.');
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        return;
    }
    
    // Use html2canvas to capture the ticket
    html2canvas(ticketCard, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`Destinova-Ticket-${BOOKING_DATA.bookingRef}.pdf`);
        
        // Reset button
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        
        showNotification('Ticket downloaded successfully!', 'success');
    }).catch(err => {
        console.error('PDF generation failed:', err);
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        alert('Failed to generate PDF. Please try again.');
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EMAIL TICKET
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function emailTicket() {
    const btn = document.getElementById('email-ticket-btn');
    const originalHTML = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
    
    // Simulate API call
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        showNotification('Ticket sent to your email!', 'success');
    }, 2000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ADD TO CALENDAR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function addToCalendar() {
    const event = {
        title: `Flight ${BOOKING_DATA.flightNumber} - ${BOOKING_DATA.departure.city} to ${BOOKING_DATA.arrival.city}`,
        description: `Destinova Flight\nBooking Ref: ${BOOKING_DATA.bookingRef}\nFlight: ${BOOKING_DATA.flightNumber}\nFrom: ${BOOKING_DATA.departure.city} (${BOOKING_DATA.departure.code})\nTo: ${BOOKING_DATA.arrival.city} (${BOOKING_DATA.arrival.code})`,
        start: '2025-03-15T08:00:00',
        end: '2025-03-15T10:10:00',
        location: `${BOOKING_DATA.departure.airport}, ${BOOKING_DATA.departure.city}`
    };
    
    // Create ICS file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
PRODID:-//Destinova//Flight Booking//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
DTSTART:${event.start.replace(/[-:]/g, '')}
DTEND:${event.end.replace(/[-:]/g, '')}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Flight reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;
    
    // Create blob and download
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Destinova-Flight-${BOOKING_DATA.bookingRef}.ics`;
    link.click();
    
    showNotification('Calendar event downloaded!', 'success');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SOCIAL SHARE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function handleSocialShare(e) {
    const btn = e.currentTarget;
    const platform = btn.querySelector('i').classList[1].split('-')[1];
    
    const shareText = `Just booked my flight with Destinova! ✈️ ${BOOKING_DATA.departure.city} → ${BOOKING_DATA.arrival.city}`;
    const shareUrl = window.location.href;
    
    let url = '';
    
    switch(platform) {
        case 'twitter':
            url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            break;
        case 'whatsapp':
            url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
            break;
        case 'instagram':
            showNotification('Please share manually on Instagram!', 'info');
            return;
    }
    
    if (url) {
        window.open(url, '_blank', 'width=600,height=400');
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATE ELEMENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function animateElements() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeSlideUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe elements
    document.querySelectorAll('.glass-card, .tip-card, .destination-card-promo').forEach(el => {
        observer.observe(el);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#2a7d4a' : type === 'error' ? '#D93025' : type === 'warning' ? '#f59e0b' : '#1d5e33'};
        color: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(29, 94, 51, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        max-width: 300px;
        font-family: 'Poppins', sans-serif;
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ';
    notification.innerHTML = `${icon} ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('✈️ Destinova Booking Confirmation - All Systems Active');
