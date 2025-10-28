/* ═══════════════════════════════════════════════════════════════════
   DESTINOVA SPECIAL OFFERS - ULTRA-PREMIUM JAVASCRIPT
   3D Tilt Effects | Carousel | Counter Animations | Flash Timer
   Professional 25+ Years UI/UX Design
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const APP_STATE = {
    currentCarouselIndex: 0,
    totalCarouselItems: 0,
    flashCountdownInterval: null,
    observers: {
        reveal: null
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Destinova Special Offers - Ultra-Premium Edition Initialized');
    
    initializeGlassHeader();
    initializeScrollReveal();
    initializeCounterAnimations();
    initializeFlashCountdown();
    initialize3DTilt();
    initializeFilterTabs();
    initializeCarousel();
    initializeNewsletterForm();
    initializeWaveMouseTracking();
    
    console.log('🎨 All premium features loaded successfully');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLASSMORPHIC HEADER SCROLL EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeGlassHeader() {
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
    document.querySelectorAll('.reveal-scale, .reveal-fade-up, .reveal-tilt').forEach(el => {
        APP_STATE.observers.reveal.observe(el);
    });
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
// FLASH COUNTDOWN TIMER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeFlashCountdown() {
    const countdownElement = document.getElementById('flash-countdown');
    if (!countdownElement) return;
    
    // Set end time (24 hours from now)
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance < 0) {
            countdownElement.textContent = '00:00:00';
            clearInterval(APP_STATE.flashCountdownInterval);
            return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    
    updateCountdown();
    APP_STATE.flashCountdownInterval = setInterval(updateCountdown, 1000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3D TILT EFFECT ON CARDS (UNIQUE TO OFFERS PAGE)
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
                translateY(-12px)
                scale(1.02)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILTER TABS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab-crystal');
    const offerCards = document.querySelectorAll('.offer-card-crystal');
    
    if (filterTabs.length === 0) return;
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Filter cards
            offerCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CAROUSEL WITH INDICATORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeCarousel() {
    const carouselTrack = document.getElementById('offers-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    
    if (!carouselTrack) return;
    
    const cards = carouselTrack.querySelectorAll('.offer-card-crystal');
    APP_STATE.totalCarouselItems = cards.length;
    
    // Create indicators
    if (indicatorsContainer) {
        for (let i = 0; i < Math.ceil(APP_STATE.totalCarouselItems / 3); i++) {
            const indicator = document.createElement('span');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollCarousel(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollCarousel(1);
        });
    }
    
    function scrollCarousel(direction) {
        const cardWidth = 380 + 32; // card width + gap
        const scrollAmount = cardWidth * 3 * direction;
        
        carouselTrack.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        updateIndicators();
    }
    
    function goToSlide(index) {
        const cardWidth = 380 + 32;
        const scrollAmount = cardWidth * 3 * index;
        
        carouselTrack.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        updateIndicators();
    }
    
    function updateIndicators() {
        if (!indicatorsContainer) return;
        
        const scrollLeft = carouselTrack.scrollLeft;
        const cardWidth = 380 + 32;
        const currentSlide = Math.round(scrollLeft / (cardWidth * 3));
        
        const indicators = indicatorsContainer.querySelectorAll('span');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Update indicators on scroll
    carouselTrack.addEventListener('scroll', () => {
        updateIndicators();
    });
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
        
        if (!emailInput || !emailInput.value) {
            alert('Please enter a valid email address');
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
// WAVE MOUSE TRACKING (UNIQUE TO OFFERS PAGE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeWaveMouseTracking() {
    const waves = document.querySelectorAll('.wave-layer');
    
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                waves.forEach((wave, index) => {
                    const speed = (index + 1) * 0.015;
                    const x = (mouseX - window.innerWidth / 2) * speed;
                    const y = (mouseY - window.innerHeight / 2) * speed;
                    
                    wave.style.transform = `translate(${x}px, ${y}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BOOKING BUTTON INTERACTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.querySelectorAll('.btn-flash-book, .btn-book-crystal').forEach(btn => {
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

document.querySelectorAll('.flash-deal-card, .offer-card-crystal').forEach(card => {
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
// DESTINATION CARDS CLICK HANDLERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.querySelectorAll('.destination-card-large, .destination-card-small').forEach(card => {
    card.addEventListener('click', function() {
        // Add pulse animation
        this.style.animation = 'destinationPulse 0.4s ease';
        
        setTimeout(() => {
            this.style.animation = '';
            // Navigate to destination page
            console.log('Navigate to destination details');
        }, 400);
    });
});

// Add destination pulse animation
const destStyle = document.createElement('style');
destStyle.textContent = `
    @keyframes destinationPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(0.98); }
    }
`;
document.head.appendChild(destStyle);

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
    // Left arrow - previous carousel
    if (e.key === 'ArrowLeft') {
        const prevBtn = document.getElementById('carousel-prev');
        if (prevBtn) prevBtn.click();
    }
    
    // Right arrow - next carousel
    if (e.key === 'ArrowRight') {
        const nextBtn = document.getElementById('carousel-next');
        if (nextBtn) nextBtn.click();
    }
    
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
    document.querySelectorAll('.wave-layer').forEach(wave => {
        wave.style.animation = 'none';
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE VISIBILITY API - PAUSE ANIMATIONS WHEN TAB HIDDEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('visibilitychange', () => {
    const waves = document.querySelectorAll('.wave-layer');
    
    if (document.hidden) {
        waves.forEach(wave => {
            wave.style.animationPlayState = 'paused';
        });
    } else {
        waves.forEach(wave => {
            wave.style.animationPlayState = 'running';
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
// CONSOLE EASTER EGG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log(
    '%c✨ DESTINOVA SPECIAL OFFERS',
    'color: #1d5e33; font-size: 24px; font-weight: 900; padding: 20px; background: linear-gradient(135deg, #E5CBAF 0%, #1d5e33 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'
);

console.log(
    '%c🎨 Ultra-Premium Glassmorphism Edition\n3D Tilt Effects | Crystal Wave Animations | Flash Deals',
    'color: #5C6B73; font-size: 14px; padding: 10px; line-height: 1.6;'
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
    
    if (APP_STATE.flashCountdownInterval) {
        clearInterval(APP_STATE.flashCountdownInterval);
    }
});

console.log('✨ Destinova Special Offers - All Premium Systems Active');
