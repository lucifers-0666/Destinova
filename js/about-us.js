/* ═══════════════════════════════════════════════════════════════════
   DESTINOVA ABOUT US - ULTRA-PREMIUM JAVASCRIPT
   Professional 25+ Years UI/UX Design Approach
   Smooth Parallax | Crystal Reveals | Counter Animations
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const APP_STATE = {
    scrollPosition: 0,
    isScrolling: false,
    hasCountersAnimated: false,
    observers: {
        reveal: null,
        counter: null
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Destinova About Us - Ultra-Premium Edition Initialized');
    
    initializeGlassmorphicHeader();
    initializeParallaxHero();
    initializeCrystalReveal();
    initializeCounterAnimations();
    initializeHeroScrollIndicator();
    initializeValueCardEffects();
    initializeTeamCardInteractions();
    initializeSmoothScrolling();
    initializeAmbientOrbs();
    
    // Performance optimization
    optimizeScrollPerformance();
    
    console.log('🎨 All premium features loaded successfully');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLASSMORPHIC HEADER SCROLL EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeGlassmorphicHeader() {
    const header = document.querySelector('.glass-header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    const updateHeader = () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
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
// PARALLAX HERO EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeParallaxHero() {
    const parallaxBg = document.querySelector('.hero-parallax-bg');
    const meshGradient = document.querySelector('.hero-mesh-gradient');
    const heroContent = document.querySelector('.hero-content-crystal');
    
    if (!parallaxBg) return;
    
    let ticking = false;
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const heroHeight = window.innerHeight;
        
        if (scrolled < heroHeight) {
            // Parallax background
            const bgTranslate = scrolled * 0.5;
            parallaxBg.style.transform = `translateY(${bgTranslate}px) scale(1.1)`;
            
            // Mesh gradient rotation
            if (meshGradient) {
                const rotation = scrolled * 0.05;
                meshGradient.style.transform = `rotate(${rotation}deg) scale(${1 + scrolled * 0.0002})`;
            }
            
            // Content fade out
            if (heroContent) {
                const opacity = 1 - (scrolled / heroHeight);
                heroContent.style.opacity = Math.max(0, opacity);
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CRYSTAL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeCrystalReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };
    
    APP_STATE.observers.reveal = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered reveal with delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // Add elegant entrance sound (optional)
                    // playEntranceSound();
                }, index * 100);
                
                // Unobserve after reveal for performance
                APP_STATE.observers.reveal.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all crystal reveal elements
    document.querySelectorAll('.reveal-crystal').forEach(el => {
        APP_STATE.observers.reveal.observe(el);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COUNTER ANIMATIONS WITH EASING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeCounterAnimations() {
    const counterElements = document.querySelectorAll('.stat-crystal-number[data-count]');
    
    if (counterElements.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    APP_STATE.observers.counter = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !APP_STATE.hasCountersAnimated) {
                APP_STATE.hasCountersAnimated = true;
                animateCounter(entry.target);
                APP_STATE.observers.counter.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counterElements.forEach(counter => {
        APP_STATE.observers.counter.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2500; // 2.5 seconds
    const startTime = performance.now();
    
    // Easing function for smooth acceleration/deceleration
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);
        
        const currentValue = Math.floor(easedProgress * target);
        
        // Format with commas for large numbers
        element.textContent = currentValue.toLocaleString('en-US');
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString('en-US');
            
            // Add completion shimmer effect
            element.style.animation = 'counterComplete 0.6s ease-out';
        }
    };
    
    requestAnimationFrame(updateCounter);
}

// Add counter completion animation
const style = document.createElement('style');
style.textContent = `
    @keyframes counterComplete {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HERO SCROLL INDICATOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeHeroScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-scroll-crystal');
    
    if (!scrollIndicator) return;
    
    // Smooth scroll to content
    scrollIndicator.addEventListener('click', () => {
        const visionSection = document.querySelector('.vision-section-glass');
        if (visionSection) {
            visionSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    });
    
    // Fade out on scroll
    let ticking = false;
    
    const updateIndicator = () => {
        const scrolled = window.pageYOffset;
        const heroHeight = window.innerHeight;
        
        if (scrolled > heroHeight * 0.3) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateIndicator);
            ticking = true;
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VALUE CARDS 3D TILT EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeValueCardEffects() {
    const valueCards = document.querySelectorAll('.value-card-premium');
    
    valueCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateY(-12px) 
                scale(1.02)
            `;
            
            // Update shimmer position
            const shimmerLayer = card.querySelector('.icon-shimmer-layer');
            if (shimmerLayer) {
                shimmerLayer.style.transform = `translate(${(x / rect.width) * 100}%, ${(y / rect.height) * 100}%)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TEAM CARDS INTERACTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeTeamCardInteractions() {
    const teamCards = document.querySelectorAll('.team-card-crystal');
    
    teamCards.forEach(card => {
        // Sophisticated hover effect
        card.addEventListener('mouseenter', () => {
            const image = card.querySelector('.image-crystal-frame img');
            if (image) {
                image.style.transform = 'scale(1.08) rotate(2deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const image = card.querySelector('.image-crystal-frame img');
            if (image) {
                image.style.transform = '';
            }
        });
        
        // Social links ripple effect
        const socialLinks = card.querySelectorAll('.social-glass-btn');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(229, 203, 175, 0.5);
                    width: 100px;
                    height: 100px;
                    left: ${e.offsetX - 50}px;
                    top: ${e.offsetY - 50}px;
                    animation: rippleExpand 0.6s ease-out;
                    pointer-events: none;
                `;
                
                link.style.position = 'relative';
                link.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
                
                // Open link after animation
                setTimeout(() => {
                    window.open(link.href, '_blank');
                }, 300);
            });
        });
    });
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
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
document.head.appendChild(rippleStyle);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 100;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AMBIENT ORBS MOUSE INTERACTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeAmbientOrbs() {
    const orbs = document.querySelectorAll('.ambient-orb');
    
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                orbs.forEach((orb, index) => {
                    const speed = (index + 1) * 0.015;
                    const x = (mouseX - window.innerWidth / 2) * speed;
                    const y = (mouseY - window.innerHeight / 2) * speed;
                    
                    orb.style.transform = `translate(${x}px, ${y}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PERFORMANCE OPTIMIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function optimizeScrollPerformance() {
    // Passive event listeners for better scrolling performance
    const passiveIfSupported = supportsPassive() ? { passive: true } : false;
    
    window.addEventListener('scroll', () => {
        APP_STATE.scrollPosition = window.pageYOffset;
    }, passiveIfSupported);
    
    // Reduce animations when user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.style.scrollBehavior = 'auto';
    }
}

function supportsPassive() {
    let passiveSupported = false;
    try {
        const options = {
            get passive() {
                passiveSupported = true;
                return false;
            }
        };
        window.addEventListener('test', null, options);
        window.removeEventListener('test', null, options);
    } catch (err) {
        passiveSupported = false;
    }
    return passiveSupported;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LAZY LOADING IMAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// KEYBOARD SHORTCUTS (ACCESSIBILITY)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('keydown', (e) => {
    // 'T' to scroll to top
    if (e.key === 't' || e.key === 'T') {
        if (!e.ctrlKey && !e.metaKey) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // 'H' to go to hero
    if (e.key === 'h' || e.key === 'H') {
        if (!e.ctrlKey && !e.metaKey) {
            const hero = document.querySelector('.hero-crystal');
            if (hero) hero.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE VISIBILITY API - PAUSE ANIMATIONS WHEN TAB HIDDEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        document.body.style.animationPlayState = 'running';
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSOLE EASTER EGG (PREMIUM BRANDING)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log(
    '%c✨ DESTINOVA - LUXURY TRAVEL REDEFINED',
    'color: #1d5e33; font-size: 24px; font-weight: 900; padding: 20px; background: linear-gradient(135deg, #E5CBAF 0%, #1d5e33 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'
);

console.log(
    '%c🎨 Ultra-Premium Glassmorphism Edition\nProfessional 25+ Years UI/UX Design',
    'color: #5C6B73; font-size: 14px; padding: 10px; line-height: 1.6;'
);

console.log(
    '%cInterested in joining our world-class team?\n→ Visit careers.destinova.com',
    'color: #E5CBAF; font-size: 13px; padding: 8px; font-weight: 600;'
);

console.log(
    '%c© 2025 Destinova | Founded by Zaid Malik & Ashok Sah',
    'color: #8B9BA5; font-size: 11px; padding: 6px;'
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLEANUP ON PAGE UNLOAD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

window.addEventListener('beforeunload', () => {
    // Disconnect observers to prevent memory leaks
    if (APP_STATE.observers.reveal) {
        APP_STATE.observers.reveal.disconnect();
    }
    if (APP_STATE.observers.counter) {
        APP_STATE.observers.counter.disconnect();
    }
});

console.log('✨ Destinova About Us - All Premium Systems Active');
/* ═══════════════════════════════════════════════════════════════════
   ADDITIONAL FEATURES FOR NEW SECTIONS
   ═══════════════════════════════════════════════════════════════════ */

// Add to the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... existing initialization code ...
    
    initializeTestimonialsCarousel();
    initializeFAQAccordion();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TESTIMONIALS CAROUSEL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeTestimonialsCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-glass-card');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (testimonials.length === 0) return;
    
    let currentIndex = 0;
    const totalTestimonials = testimonials.length;
    
    const showTestimonial = (index) => {
        // Remove active class from all
        testimonials.forEach(card => {
            card.classList.remove('active');
        });
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to current
        testimonials[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentIndex = index;
    };
    
    const nextTestimonial = () => {
        const nextIndex = (currentIndex + 1) % totalTestimonials;
        showTestimonial(nextIndex);
    };
    
    const prevTestimonial = () => {
        const prevIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
        showTestimonial(prevIndex);
    };
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Auto-play carousel every 6 seconds
    let autoPlayInterval = setInterval(nextTestimonial, 6000);
    
    // Pause on hover
    const carouselContainer = document.querySelector('.testimonials-carousel-crystal');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(nextTestimonial, 6000);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevTestimonial();
        } else if (e.key === 'ArrowRight') {
            nextTestimonial();
        }
    });
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextTestimonial();
            } else {
                prevTestimonial();
            }
        }
    };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FAQ ACCORDION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item-crystal');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items (optional: remove these 3 lines for multiple open)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
                
                // Smooth scroll to item if it's below viewport
                setTimeout(() => {
                    const rect = item.getBoundingClientRect();
                    const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;
                    
                    if (!isInView) {
                        item.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }
                }, 300);
            }
        });
    });
    
    // Keyboard accessibility
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
                
                const isActive = item.classList.contains('active');
                question.setAttribute('aria-expanded', isActive);
            }
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ENHANCED AWARDS CARD ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeAwardsAnimations() {
    const awardCards = document.querySelectorAll('.award-card-crystal');
    
    awardCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.award-icon-glass');
            if (icon) {
                icon.style.animation = 'awardPulse 0.6s ease-out';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.award-icon-glass');
            if (icon) {
                icon.style.animation = '';
            }
        });
    });
}

// Add award pulse animation
const awardStyle = document.createElement('style');
awardStyle.textContent = `
    @keyframes awardPulse {
        0%, 100% {
            transform: scale(1) rotate(0deg);
        }
        25% {
            transform: scale(1.1) rotate(5deg);
        }
        75% {
            transform: scale(1.1) rotate(-5deg);
        }
    }
`;
document.head.appendChild(awardStyle);

// Initialize awards animations
document.addEventListener('DOMContentLoaded', () => {
    initializeAwardsAnimations();
});

console.log('✨ Enhanced features loaded: Testimonials Carousel & FAQ Accordion');
