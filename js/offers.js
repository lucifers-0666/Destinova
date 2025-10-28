/* ═══════════════════════════════════════════════════════════════════
   DESTINOVA SPECIAL OFFERS - COMPLETE JAVASCRIPT
   Emerald Green & Champagne Gold Theme
   Categories | Carousel | 3D Tilt | Countdown | Counters
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const APP_STATE = {
    countdownInterval: null,
    observers: {
        reveal: null
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Destinova Special Offers - Complete Edition Initialized');
    
    initializeHeader();
    initializeScrollReveal();
    initializeCountdown();
    initializeCounterAnimations();
    initialize3DTilt();
    initializeCategoryCards();
    initializeCarousel();
    initializeNewsletterForm();
    initializeBookingButtons();
    
    console.log('🎨 All premium features loaded successfully');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HEADER SCROLL EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeHeader() {
    const header = document.querySelector('.glass-header-offers');
    if (!header) return;
    
    let ticking = false;
    
    const updateHeader = () => {
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCROLL REVEAL ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };
    
    APP_STATE.observers.reveal = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                
                APP_STATE.observers.reveal.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal-fade-up, .reveal-scale, .reveal-tilt').forEach(el => {
        APP_STATE.observers.reveal.observe(el);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COUNTDOWN TIMER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeCountdown() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) return;
    
    // Set end time (24 hours from now)
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) {
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            clearInterval(APP_STATE.countdownInterval);
            return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    };
    
    updateCountdown();
    APP_STATE.countdownInterval = setInterval(updateCountdown, 1000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COUNTER ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number-crystal[data-count]');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const startTime = performance.now();
    
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        
        const currentValue = Math.floor(easedProgress * target);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    requestAnimationFrame(updateCounter);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3D TILT EFFECT ON CARDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initialize3DTilt() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${-rotateX}deg) 
                rotateY(${rotateY}deg)
                translateY(-8px)
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CATEGORY CARDS CLICK INTERACTION (NEW)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card-glass');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Add click animation
            this.style.animation = 'categoryClick 0.4s ease';
            
            setTimeout(() => {
                this.style.animation = '';
                console.log(`Navigating to category: ${category}`);
                // Add your navigation logic here
                // window.location.href = `/offers?category=${category}`;
            }, 400);
        });
    });
}

// Add category click animation
const categoryStyle = document.createElement('style');
categoryStyle.textContent = `
    @keyframes categoryClick {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(0.95); }
    }
`;
document.head.appendChild(categoryStyle);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LAST MINUTE DEALS CAROUSEL (NEW)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeCarousel() {
    const carousel = document.getElementById('last-minute-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    
    if (!carousel || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 340; // card width + gap
    
    prevBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Optional: Auto-scroll every 5 seconds
    setInterval(() => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        
        if (carousel.scrollLeft >= maxScroll) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }, 5000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NEWSLETTER FORM SUBMISSION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const successMessage = document.getElementById('newsletter-success');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('.btn-subscribe-crystal');
        const consent = document.getElementById('newsletter-consent');
        
        if (!emailInput || !emailInput.value) {
            alert('Please enter a valid email address');
            return;
        }
        
        if (!consent.checked) {
            alert('Please agree to receive promotional emails');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        const originalText = submitBtn.querySelector('span:nth-child(2)').textContent;
        submitBtn.querySelector('span:nth-child(2)').textContent = 'Subscribing...';
        
        // Simulate API call
        setTimeout(() => {
            // Success
            submitBtn.disabled = false;
            submitBtn.querySelector('span:nth-child(2)').textContent = originalText;
            
            // Show success message
            if (successMessage) {
                successMessage.style.display = 'flex';
                
                // Hide after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
            
            // Reset form
            form.reset();
            
        }, 1500);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BOOKING BUTTON INTERACTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeBookingButtons() {
    const bookButtons = document.querySelectorAll('.btn-book-crystal');
    
    bookButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: 100px;
                height: 100px;
                left: ${e.offsetX - 50}px;
                top: ${e.offsetY - 50}px;
                animation: rippleExpand 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Navigate to booking page
            setTimeout(() => {
                window.location.href = '/booking.html';
            }, 300);
        });
    });
}

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleExpand {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CARD HOVER EFFECTS WITH GLOW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.querySelectorAll('.deal-card-glass, .carousel-card-glass').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const glowLayer = this.querySelector('.image-glow-layer');
        if (glowLayer) {
            glowLayer.style.opacity = '1';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const glowLayer = this.querySelector('.image-glow-layer');
        if (glowLayer) {
            glowLayer.style.opacity = '0';
        }
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KEYBOARD SHORTCUTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('keydown', (e) => {
    // 'T' - scroll to top
    if (e.key === 't' || e.key === 'T') {
        if (!e.ctrlKey && !e.metaKey) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PERFORMANCE OPTIMIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Reduce animations when user prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.style.scrollBehavior = 'auto';
    document.querySelectorAll('.orb').forEach(orb => {
        orb.style.animation = 'none';
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE VISIBILITY API - PAUSE ANIMATIONS WHEN TAB HIDDEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('visibilitychange', () => {
    const orbs = document.querySelectorAll('.orb');
    
    if (document.hidden) {
        orbs.forEach(orb => {
            orb.style.animationPlayState = 'paused';
        });
    } else {
        orbs.forEach(orb => {
            orb.style.animationPlayState = 'running';
        });
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LAZY LOADING FOR IMAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSOLE BRANDING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log(
    '%c✨ DESTINOVA SPECIAL OFFERS',
    'color: #1d5e33; font-size: 24px; font-weight: 900; padding: 20px; background: linear-gradient(135deg, #E5CBAF 0%, #1d5e33 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'
);

console.log(
    '%c🎨 Premium Edition | Categories | Carousel | Countdown\nEmerald Green & Champagne Gold Theme',
    'color: #5C6B73; font-size: 14px; padding: 10px; line-height: 1.8;'
);

console.log(
    '%cDiscover exclusive travel deals at destinova.com',
    'color: #E5CBAF; font-size: 13px; padding: 8px; font-weight: 600;'
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLEANUP ON PAGE UNLOAD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

window.addEventListener('beforeunload', () => {
    if (APP_STATE.observers.reveal) {
        APP_STATE.observers.reveal.disconnect();
    }
    
    if (APP_STATE.countdownInterval) {
        clearInterval(APP_STATE.countdownInterval);
    }
});

console.log('✨ Destinova Special Offers - All Premium Systems Active');
