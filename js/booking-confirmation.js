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
    console.log('🎉 Destinova Booking Confirmation - Premium Animations Initialized');
    
    // Initialize Lottie checkmark
    initializeLottieAnimation();
    
    // Initialize all features with sequential timing
    initializeParticles();
    fireConfetti();
    generateQRCode();
    setupEventListeners();
    animateElements();
    initializeMagneticButtons();
    initializeCounterAnimations();
    initializeScrollAnimations();
    initializeAccordion();
    initializeRippleEffect();
    initializeTiltEffect();
    initializeTypewriter();
    initializeFlipCards();
    initializeTimeCounters();
    initializeButtonAnimations();
    initializeTimelineAnimations();
    initialize3DTilt();
    initializePageLoadAnimation();
     // Part 7: Travel Tips
    initTipCards();
    init3DTiltEffect();
    
    // Part 8: Destination Cards
    initPromoCards();
    initKenBurnsEffect();
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
// MAGNETIC BUTTON EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distX = (e.clientX - centerX) * 0.2;
            const distY = (e.clientY - centerY) * 0.2;
            
            btn.style.transform = `translate(${distX}px, ${distY}px) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COUNTER ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.amount-counter, .total-counter, .duration-counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/,/g, ''));
        const isDecimal = counter.textContent.includes('.');
        const decimals = isDecimal ? 1 : 0;
        
        animateCounter(counter, 0, target, decimals);
    });
}

function animateCounter(element, start, end, decimals = 0) {
    const duration = 1500; // 1.5 seconds
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        const displayValue = current.toFixed(decimals);
        element.textContent = parseInt(displayValue).toLocaleString();
    }, 16);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;
    
    const options = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Trigger specific animations
                if (entry.target.classList.contains('flight-segment')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    document.querySelectorAll('.glass-card, .animate-on-scroll, .destination-card-promo').forEach(el => {
        observer.observe(el);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENTS

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOTTIE CHECKMARK ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeLottieAnimation() {
    if (typeof lottie === 'undefined') return;
    
    // Fallback to CSS animation if Lottie unavailable
    const container = document.getElementById('lottie-animation');
    if (!container) return;
    
    // Create SVG checkmark animation manually
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'lottie-checkmark-svg');
    svg.style.cssText = `
        width: 100%;
        height: 100%;
        animation: elasticBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    `;
    
    // Circle background
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '45');
    circle.setAttribute('fill', '#1d5e33');
    circle.setAttribute('opacity', '0.9');
    
    // Checkmark path
    const checkmark = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    checkmark.setAttribute('d', 'M 30 50 L 45 65 L 70 35');
    checkmark.setAttribute('stroke', 'white');
    checkmark.setAttribute('stroke-width', '6');
    checkmark.setAttribute('fill', 'none');
    checkmark.setAttribute('stroke-linecap', 'round');
    checkmark.setAttribute('stroke-linejoin', 'round');
    checkmark.style.cssText = `
        animation: slideUpFade 1s ease-out 0.2s backwards;
        stroke-dasharray: 50;
        stroke-dashoffset: 50;
        animation: slideUpFade 1s ease-out 0.2s forwards, drawingLine 0.8s ease-out 0.4s forwards;
    `;
    
    svg.appendChild(circle);
    svg.appendChild(checkmark);
    container.appendChild(svg);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FLIP CARD ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeFlipCards() {
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach((card, index) => {
        card.style.animationDelay = `${0.5 + index * 0.2}s`;
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TIME COUNTER ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeTimeCounters() {
    const timeCounters = document.querySelectorAll('.time-counter');
    timeCounters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        animateTimeCounter(counter, 0, target, 1500);
    });
}

function animateTimeCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUTTON HOVER ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeButtonAnimations() {
    const buttons = document.querySelectorAll('.btn-action');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.animation = 'iconBounce 0.6s ease-out infinite';
                }, 10);
            }
        });
        
        btn.addEventListener('mouseleave', (e) => {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.style.animation = 'none';
            }
        });
        
        btn.addEventListener('click', (e) => {
            // Ripple effect
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                pointer-events: none;
                animation: rippleClick 0.6s ease-out forwards;
            `;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TIMELINE ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeTimelineAnimations() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const steps = entry.target.querySelectorAll('.timeline-step');
                steps.forEach((step, index) => {
                    step.style.animationDelay = `${0.5 + index * 0.2}s`;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    observer.observe(timeline);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3D TILT EFFECT ENHANCEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initialize3DTilt() {
    // Booking reference 3D tilt
    const bookingRef = document.querySelector('.booking-ref-tilt');
    if (bookingRef) {
        bookingRef.addEventListener('mousemove', (e) => {
            const rect = bookingRef.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            bookingRef.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        bookingRef.addEventListener('mouseleave', () => {
            bookingRef.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    }
    
    // Destination cards 3D tilt
    const destinationCards = document.querySelectorAll('.destination-3d-tilt');
    destinationCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE LOAD ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializePageLoadAnimation() {
    // Page fades in with upward motion
    const mainContent = document.querySelector('.confirmation-main');
    if (mainContent) {
        mainContent.style.animation = 'pageLoadFadeIn 0.8s ease-out forwards';
        mainContent.style.opacity = '0';
    }
    
    // Stagger QR and payment sections
    const qrSection = document.querySelector('.qr-section');
    const paymentSection = document.querySelector('.booking-details');
    
    if (qrSection) qrSection.style.animation = 'slideUpFade 0.8s ease-out 0.8s both';
    if (paymentSection) paymentSection.style.animation = 'slideUpFade 0.8s ease-out 0.9s both';
}

function initializeAccordion() {
    const header = document.getElementById('passenger-toggle');
    const content = document.getElementById('passenger-content');
    const toggleText = header.querySelector('.toggle-text');
    
    if (header && content) {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            content.classList.toggle('active');
            
            if (content.classList.contains('active')) {
                toggleText.textContent = 'Hide Details';
            } else {
                toggleText.textContent = 'View Details';
            }
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RIPPLE EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeRippleEffect() {
    const buttons = document.querySelectorAll('.btn-action, .timeline-cta');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            btn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3D TILT EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeTiltEffect() {
    const cards = document.querySelectorAll('.tip-card, .destination-card-promo');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}
// ═══════════════════════════════════════════════════════════════════
// PART 7: TRAVEL TIPS - SMART CARD GRID
// ═══════════════════════════════════════════════════════════════════

function initTipCards() {
    const cards = document.querySelectorAll('.tip-card');

    if (!cards.length) {
        console.warn('⚠️ Travel Tips: No .tip-card elements found.');
        return;
    }

    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
        card.dataset.tipIndex = index;

        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                card.classList.toggle('tip-card-active');
            }
        });
    });

    console.log(`✅ ${cards.length} tip cards initialized with accessibility hooks`);
}

function init3DTiltEffect() {
    const cards = document.querySelectorAll('.tip-card, .promo-card, .destination-card-promo');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.setProperty('--tilt-x', `${rotateX}deg`);
            this.style.setProperty('--tilt-y', `${rotateY}deg`);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.setProperty('--tilt-x', '0deg');
            this.style.setProperty('--tilt-y', '0deg');
        });
    });
    
    console.log(`✅ 3D tilt effect added to ${cards.length} cards`);
}
// ═══════════════════════════════════════════════════════════════════
// PART 8: DESTINATION CARDS - PREMIUM SHOWCASE
// ═══════════════════════════════════════════════════════════════════

function initPromoCards() {
    const cards = document.querySelectorAll('.destination-card-promo, .promo-card');

    if (!cards.length) {
        console.warn('⚠️ Plan Your Next Trip: No destination cards detected.');
        return;
    }

    cards.forEach((card, index) => {
        card.classList.add('promo-card');
        card.style.setProperty('--card-index', index);

        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }

        const coverImage = card.querySelector('img');
        if (coverImage) {
            coverImage.classList.add('promo-image');
        }
    });

    console.log(`✅ ${cards.length} promo cards normalized & indexed`);
}

function initKenBurnsEffect() {
    const images = document.querySelectorAll('.destination-card-promo img, .promo-card .promo-image');

    if (!images.length) {
        console.warn('⚠️ Plan Your Next Trip: No promo images available for Ken Burns effect.');
        return;
    }

    images.forEach(img => {
        img.classList.add('promo-image');

        const panX = Math.random() * 20 - 10;
        const panY = Math.random() * 20 - 10;
        
        img.style.setProperty('--pan-x', `${panX}px`);
        img.style.setProperty('--pan-y', `${panY}px`);
    });
    
    console.log(`✅ Ken Burns effect added to ${images.length} promo images`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPEWRITER EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeTypewriter() {
    const message = document.querySelector('.success-message');
    if (!message) return;
    
    const text = message.textContent.trim();
    message.textContent = '';
    message.classList.add('typewriter-text');
    
    let i = 0;
    const speed = 30; // ms per char
    
    function type() {
        if (i < text.length) {
            message.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            message.classList.remove('typewriter-text'); // Remove cursor after typing
        }
    }
    
    // Start after a small delay
    setTimeout(type, 1000);
}

console.log('✈️ Destinova Booking Confirmation - All Systems Active');
