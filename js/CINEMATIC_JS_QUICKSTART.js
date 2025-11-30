/**
 * 🎬 CINEMATIC ANIMATION SYSTEM - JAVASCRIPT QUICKSTART
 * 
 * Complete JavaScript implementation for all 10 animation parts
 * Add to: js/booking-confirmation.js (or create new file)
 * 
 * Dependencies: None (vanilla JavaScript)
 * Performance: Optimized with RAF and debouncing
 * Browser Support: ES6+ (Chrome 90+, Firefox 88+, Safari 14+)
 */

// ═══════════════════════════════════════════════════════════════════
// INITIALIZATION - Run on DOMContentLoaded
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initCinematicAnimations();
});

function initCinematicAnimations() {
    // Part 1: Hero Confirmation
    initKineticTypography();
    
    // Part 2: Flight Journey Card
    initSplitFlapDisplay();
    initAnimatedFlightPath();
    
    // Part 3: Passenger Information
    initPassengerAccordion();
    initPassengerIndexing();
    
    // Part 4: Boarding Pass & Payment
    initPaymentCascade();
    initQRValidation();
    
    // Part 5: Action Buttons
    initButtonRipples();
    initButtonStates();
    initMagneticButtons();
    
    // Part 6: Timeline
    initTimelineSteps();
    
    // Part 7: Travel Tips
    initTipCards();
    init3DTiltEffect();
    
    // Part 8: Destination Cards
    initPromoCards();
    initKenBurnsEffect();
    
    // Part 9: Global Effects
    initCustomCursor();
    initConstellationCanvas();
    initParallaxLayers();
    
    // Part 10: Micro-interactions
    initHapticFeedback();
    initToastNotifications();
    
    // Performance: Intersection Observer
    initScrollAnimations();
}

// ═══════════════════════════════════════════════════════════════════
// PART 1: HERO CONFIRMATION - CINEMATIC OPENING
// ═══════════════════════════════════════════════════════════════════

function initKineticTypography() {
    const title = document.querySelector('.success-title');
    if (!title) return;
    
    const text = title.textContent.trim();
    title.innerHTML = text.split('').map((char, i) => {
        if (char === ' ') return '&nbsp;';
        return `<span style="--letter-index: ${i}; --rotation-start: ${Math.random() * 360}deg; --rotation-bounce: ${Math.random() * 5 + 2}deg">${char}</span>`;
    }).join('');
    
    console.log('✅ Kinetic typography initialized');
}

// ═══════════════════════════════════════════════════════════════════
// PART 2: FLIGHT JOURNEY CARD - INTERACTIVE STORYTELLING
// ═══════════════════════════════════════════════════════════════════

function initSplitFlapDisplay() {
    const cityCodes = document.querySelectorAll('.city-code');
    if (!cityCodes.length) return;
    
    cityCodes.forEach((code, codeIndex) => {
        const text = code.textContent.trim();
        code.innerHTML = text.split('').map((char, i) => 
            `<span style="--char-index: ${i}; animation-delay: ${codeIndex * 0.5 + i * 0.08}s">${char}</span>`
        ).join('');
    });
    
    console.log('✅ Split-flap display initialized');
}

function initAnimatedFlightPath() {
    const flightPath = document.querySelector('.flight-path-timeline');
    if (!flightPath) return;
    
    // Create animated airplane element
    const plane = document.createElement('div');
    plane.className = 'animated-plane';
    plane.innerHTML = '✈️';
    plane.style.cssText = `
        position: absolute;
        font-size: 24px;
        z-index: 10;
        filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
    `;
    
    flightPath.appendChild(plane);
    
    console.log('✅ Animated flight path initialized');
}

// ═══════════════════════════════════════════════════════════════════
// PART 3: PASSENGER INFORMATION - SMART EXPANSION
// ═══════════════════════════════════════════════════════════════════

function initPassengerAccordion() {
    const headers = document.querySelectorAll('.passenger-header');
    if (!headers.length) return;
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const wasActive = this.classList.contains('active');
            
            // Close all others
            document.querySelectorAll('.passenger-header').forEach(h => {
                h.classList.remove('active');
                const content = h.nextElementSibling;
                if (content && content.classList.contains('passenger-content')) {
                    content.classList.remove('active');
                }
            });
            
            // Toggle current
            if (!wasActive) {
                this.classList.add('active');
                const content = this.nextElementSibling;
                if (content && content.classList.contains('passenger-content')) {
                    content.classList.add('active');
                }
            }
        });
    });
    
    console.log('✅ Passenger accordion initialized');
}

function initPassengerIndexing() {
    const items = document.querySelectorAll('.passenger-item');
    items.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    console.log(`✅ ${items.length} passenger items indexed`);
}

// ═══════════════════════════════════════════════════════════════════
// PART 4: BOARDING PASS & PAYMENT - PREMIUM AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════

function initPaymentCascade() {
    const rows = document.querySelectorAll('.payment-row');
    rows.forEach((row, index) => {
        row.style.setProperty('--row-index', index);
    });
    
    console.log(`✅ ${rows.length} payment rows indexed for cascade`);
}

function initQRValidation() {
    const qrContainer = document.querySelector('.qr-container');
    if (!qrContainer) return;
    
    // Simulate QR validation after 2 seconds (demo)
    setTimeout(() => {
        qrContainer.classList.add('validated');
        console.log('✅ QR code validated');
    }, 2000);
}

// ═══════════════════════════════════════════════════════════════════
// PART 5: ACTION BUTTONS - PREMIUM INTERACTIONS
// ═══════════════════════════════════════════════════════════════════

function initButtonRipples() {
    const buttons = document.querySelectorAll('.btn-action');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple class
            this.classList.add('ripple-active');
            
            // Remove after animation
            setTimeout(() => {
                this.classList.remove('ripple-active');
            }, 600);
        });
    });
    
    console.log(`✅ Ripple effect added to ${buttons.length} buttons`);
}

function initButtonStates() {
    const downloadBtn = document.querySelector('.btn-download-pdf');
    const emailBtn = document.querySelector('.btn-email-confirmation');
    
    // Example: Download button with states
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async function() {
            // Loading state
            this.classList.add('loading');
            this.disabled = true;
            
            // Simulate download (2s)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success state
            this.classList.remove('loading');
            this.classList.add('success');
            
            // Reset after 2s
            setTimeout(() => {
                this.classList.remove('success');
                this.disabled = false;
            }, 2000);
        });
    }
    
    console.log('✅ Button states initialized');
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-action');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const distance = Math.sqrt(x * x + y * y);
            
            // Magnetic pull within 100px radius
            if (distance < 100) {
                const pullX = x * 0.15;
                const pullY = y * 0.15;
                this.style.setProperty('--pull-x', `${pullX}px`);
                this.style.setProperty('--pull-y', `${pullY}px`);
                this.classList.add('magnetic-attract');
            } else {
                this.classList.remove('magnetic-attract');
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('magnetic-attract');
            this.style.setProperty('--pull-x', '0px');
            this.style.setProperty('--pull-y', '0px');
        });
    });
    
    console.log(`✅ Magnetic effect added to ${buttons.length} buttons`);
}

// ═══════════════════════════════════════════════════════════════════
// PART 6: WHAT'S NEXT TIMELINE - INTERACTIVE PROGRESS
// ═══════════════════════════════════════════════════════════════════

function initTimelineSteps() {
    const steps = document.querySelectorAll('.timeline-step');
    
    steps.forEach((step, index) => {
        step.style.setProperty('--step-index', index);
    });
    
    console.log(`✅ ${steps.length} timeline steps indexed`);
}

// ═══════════════════════════════════════════════════════════════════
// PART 7: TRAVEL TIPS - SMART CARD GRID
// ═══════════════════════════════════════════════════════════════════

function initTipCards() {
    const cards = document.querySelectorAll('.tip-card');
    
    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
    
    console.log(`✅ ${cards.length} tip cards indexed`);
}

function init3DTiltEffect() {
    const cards = document.querySelectorAll('.tip-card, .promo-card');
    
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
    const cards = document.querySelectorAll('.promo-card');
    
    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });
    
    console.log(`✅ ${cards.length} promo cards indexed`);
}

function initKenBurnsEffect() {
    const images = document.querySelectorAll('.promo-image');
    
    images.forEach(img => {
        const panX = Math.random() * 20 - 10;
        const panY = Math.random() * 20 - 10;
        
        img.style.setProperty('--pan-x', `${panX}px`);
        img.style.setProperty('--pan-y', `${panY}px`);
    });
    
    console.log(`✅ Ken Burns effect added to ${images.length} images`);
}

// ═══════════════════════════════════════════════════════════════════
// PART 9: GLOBAL PAGE EFFECTS - IMMERSIVE ENVIRONMENT
// ═══════════════════════════════════════════════════════════════════

function initCustomCursor() {
    // Check if user prefers default cursor
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        // Create trail
        if (Math.random() > 0.7) {
            createCursorTrail(cursorX, cursorY);
        }
    });
    
    console.log('✅ Custom cursor initialized');
}

function createCursorTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => trail.remove(), 1000);
}

function initConstellationCanvas() {
    const canvas = document.createElement('canvas');
    canvas.className = 'constellation-canvas';
    document.body.appendChild(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    const stars = [];
    const starCount = 100;
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1
        });
    }
    
    // Draw constellation lines
    function drawConstellation() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw stars
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
            ctx.fill();
        });
        
        // Draw connecting lines
        stars.forEach((star1, i) => {
            stars.slice(i + 1).forEach(star2 => {
                const distance = Math.sqrt(
                    Math.pow(star2.x - star1.x, 2) + 
                    Math.pow(star2.y - star1.y, 2)
                );
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(star1.x, star1.y);
                    ctx.lineTo(star2.x, star2.y);
                    ctx.strokeStyle = `rgba(251, 191, 36, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
    }
    
    drawConstellation();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawConstellation();
    });
    
    console.log('✅ Constellation canvas initialized');
}

function initParallaxLayers() {
    const layers = document.querySelectorAll('.background-layer-1, .background-layer-2');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        layers.forEach((layer, index) => {
            const speed = (index + 1) * 0.2;
            layer.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
    
    console.log(`✅ Parallax effect added to ${layers.length} layers`);
}

// ═══════════════════════════════════════════════════════════════════
// PART 10: MICRO-INTERACTIONS - ATTENTION TO DETAIL
// ═══════════════════════════════════════════════════════════════════

function initHapticFeedback() {
    const hapticElements = document.querySelectorAll('.btn-action, .tip-card, .promo-card');
    
    hapticElements.forEach(el => {
        el.classList.add('haptic-feedback');
        
        el.addEventListener('click', () => {
            // Vibrate API (mobile)
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
    });
    
    console.log(`✅ Haptic feedback added to ${hapticElements.length} elements`);
}

function initToastNotifications() {
    // Example toast on booking confirmation
    setTimeout(() => {
        showToast('Booking confirmed successfully! ✅', 'success');
    }, 1000);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-emerald);
        color: white;
        padding: 16px 24px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        font-weight: 600;
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 3s
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.4s ease-out reverse forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ═══════════════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZATION - INTERSECTION OBSERVER
// ═══════════════════════════════════════════════════════════════════

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                entry.target.classList.add('gpu-accelerated');
            } else {
                // Optionally pause animations when off-screen
                entry.target.classList.remove('animate-on-scroll');
            }
        });
    }, observerOptions);
    
    // Observe heavy animation elements
    const animatedElements = document.querySelectorAll(`
        .ticket-card,
        .promo-card,
        .tip-card,
        .timeline-step,
        .payment-row,
        .passenger-item
    `);
    
    animatedElements.forEach(el => observer.observe(el));
    
    console.log(`✅ Intersection observer watching ${animatedElements.length} elements`);
}

// ═══════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

// Debounce helper
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

// Request Animation Frame helper
function rafThrottle(callback) {
    let requestId = null;
    
    return function(...args) {
        if (requestId === null) {
            requestId = requestAnimationFrame(() => {
                callback(...args);
                requestId = null;
            });
        }
    };
}

// Confetti celebration (for success states)
function triggerConfetti(x, y) {
    const colors = ['#059669', '#fbbf24', '#ffffff'];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-particle';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            left: ${x}px;
            top: ${y}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        `;
        confetti.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
        confetti.style.setProperty('--y', `${Math.random() * 200 - 100}px`);
        confetti.style.setProperty('--rotation', `${Math.random() * 720}deg`);
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
    
    console.log(`🎉 Confetti triggered at (${x}, ${y})`);
}

// ═══════════════════════════════════════════════════════════════════
// EXPORT FOR MODULE USE (OPTIONAL)
// ═══════════════════════════════════════════════════════════════════

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCinematicAnimations,
        showToast,
        triggerConfetti
    };
}

console.log('🎬 Cinematic Animation System JavaScript Loaded');
