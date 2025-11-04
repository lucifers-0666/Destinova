/**
 * DESTINOVA - PREMIUM FLIGHT BOOKING HOMEPAGE
 * Phase 2: Animations & Interactivity
 * 
 * Animation Libraries Used:
 * - GSAP (GreenSock) with ScrollTrigger
 * - Anime.js
 * - AOS (Animate On Scroll)
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: false,
        mirror: true,
        offset: 100,
        anchorPlacement: 'top-bottom'
    });

    // Initialize all animations
    initHeroAnimations();
    initParallaxEffects();
    initCounterAnimations();
    initScrollTriggers();
    initCountdownTimer();
    initFAQAccordion();
    initNewsletterForm();
    initHoverAnimations();
    initPromoBanner();
    checkReducedMotion();
});

// ============================================
// HERO SECTION ANIMATIONS
// ============================================

function initHeroAnimations() {
    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Premium Badge - Pulse Animation
    const premiumBadge = document.querySelector('[data-animate="pulse"]');
    if (premiumBadge) {
        gsap.to(premiumBadge, {
            scale: 1.05,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }

    // Hero Title - Staggered Word Animation
    const heroTitle = document.querySelector('[data-animate="stagger-fade"]');
    if (heroTitle) {
        const words = heroTitle.textContent.split(' ');
        heroTitle.innerHTML = words.map(word => `<span class="hero-word">${word}</span>`).join(' ');
        
        gsap.fromTo('.hero-word', 
            { 
                opacity: 0, 
                y: -20 
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                delay: 0.3,
                ease: 'power2.out'
            }
        );
    }

    // Hero Subtitle - Delayed Fade In
    const heroSubtitle = document.querySelector('[data-animate="fade-in-delayed"]');
    if (heroSubtitle) {
        gsap.fromTo(heroSubtitle,
            { opacity: 0, y: 20 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                delay: 1.2,
                ease: 'power2.out'
            }
        );
    }

    // Floating Search Card - Scale & Fade In
    const searchCard = document.querySelector('.search-card-floating');
    if (searchCard) {
        gsap.fromTo(searchCard,
            { 
                opacity: 0, 
                scale: 0.95, 
                y: 30 
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                delay: 1.5,
                ease: 'back.out(1.2)'
            }
        );
    }
}

// ============================================
// PARALLAX EFFECTS
// ============================================

function initParallaxEffects() {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Background Parallax
    gsap.to('.hero-section', {
        backgroundPosition: '50% 50%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // Destination Card Images Parallax
    const destinationCards = document.querySelectorAll('.destination-image');
    destinationCards.forEach((image) => {
        gsap.to(image, {
            scale: 1.1,
            ease: 'none',
            scrollTrigger: {
                trigger: image.closest('.destination-card'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });

    // Section Background Animations
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index > 0) { // Skip hero section
            gsap.fromTo(section,
                { opacity: 0.9 },
                {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'top 20%',
                        scrub: true
                    }
                }
            );
        }
    });
}

// ============================================
// COUNTER ANIMATIONS (TRUST INDICATORS)
// ============================================

function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.counter);
    const suffix = element.dataset.suffix || '';
    const decimals = parseInt(element.dataset.decimal) || 0;
    
    let displayValue;
    if (target >= 1000000) {
        displayValue = (target / 1000000).toFixed(1);
    } else {
        displayValue = target;
    }

    anime({
        targets: element,
        innerHTML: [0, displayValue],
        duration: 2000,
        easing: 'easeOutExpo',
        round: decimals === 0 ? 1 : 10,
        update: function() {
            const currentValue = parseFloat(element.innerHTML);
            if (target >= 1000000) {
                element.innerHTML = currentValue.toFixed(1) + suffix;
            } else {
                element.innerHTML = Math.round(currentValue) + suffix;
            }
        }
    });
}

// ============================================
// SCROLL TRIGGER ANIMATIONS
// ============================================

function initScrollTriggers() {
    // Feature Cards
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
        gsap.fromTo(card,
            { 
                opacity: 0, 
                y: 50, 
                scale: 0.95 
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                delay: index * 0.15,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Offer Cards Masonry Animation
    gsap.utils.toArray('.offer-card').forEach((card, index) => {
        gsap.fromTo(card,
            { 
                opacity: 0, 
                y: 30 
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // How It Works Timeline
    const stepCards = document.querySelectorAll('.step-card');
    const stepConnectors = document.querySelectorAll('.step-connector');
    
    stepCards.forEach((card, index) => {
        gsap.fromTo(card,
            { 
                opacity: 0, 
                scale: 0.8 
            },
            {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                delay: index * 0.2,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    stepConnectors.forEach((connector, index) => {
        gsap.fromTo(connector,
            { 
                scaleX: 0 
            },
            {
                scaleX: 1,
                duration: 0.5,
                delay: index * 0.2 + 0.3,
                scrollTrigger: {
                    trigger: connector,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Testimonial Cards
    gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
        gsap.fromTo(card,
            { 
                opacity: 0, 
                y: 40 
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.15,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Blog Cards
    gsap.utils.toArray('.blog-card').forEach((card, index) => {
        gsap.fromTo(card,
            { 
                opacity: 0, 
                y: 30 
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.15,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Flash Deal Cards
    gsap.utils.toArray('.flash-deal-card').forEach((card, index) => {
        gsap.fromTo(card,
            { 
                opacity: 0, 
                scale: 0.9,
                y: 20
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.5,
                delay: index * 0.1,
                ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Category Cards
    gsap.utils.toArray('.category-card').forEach((card, index) => {
        gsap.fromTo(card,
            { 
                opacity: 0, 
                x: -30 
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Newsletter Section
    const newsletterSection = document.querySelector('.newsletter-section');
    if (newsletterSection) {
        gsap.fromTo('.newsletter-icon',
            { scale: 0, rotation: -180 },
            {
                scale: 1,
                rotation: 0,
                duration: 0.6,
                ease: 'back.out(2)',
                scrollTrigger: {
                    trigger: newsletterSection,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        gsap.fromTo('.newsletter-title',
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.3,
                scrollTrigger: {
                    trigger: newsletterSection,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }
}

// ============================================
// COUNTDOWN TIMER
// ============================================

function initCountdownTimer() {
    // Set target date (3 days from now for demo)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(23, 59, 59, 999);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
            // Timer expired
            document.querySelector('.flash-sale-title').textContent = 'Flash Sale Ended';
            document.querySelectorAll('.timer-value').forEach(el => el.textContent = '00');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Animate digit changes
        updateTimerDigit('days', days);
        updateTimerDigit('hours', hours);
        updateTimerDigit('minutes', minutes);
        updateTimerDigit('seconds', seconds);
    }

    function updateTimerDigit(id, value) {
        const element = document.getElementById(id);
        if (!element) return;

        const formattedValue = value.toString().padStart(2, '0');
        const currentValue = element.textContent;

        if (formattedValue !== currentValue) {
            // Digit flip animation
            anime({
                targets: element,
                rotateX: [0, 360],
                duration: 600,
                easing: 'easeOutExpo',
                begin: function() {
                    element.textContent = formattedValue;
                }
            });
        }
    }

    // Update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Pulsing discount badges
    anime({
        targets: '.discount-badge',
        scale: [1, 1.1, 1],
        duration: 2000,
        easing: 'easeInOutSine',
        loop: true
    });
}

// ============================================
// FAQ ACCORDION
// ============================================

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-icon');
                    
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    gsap.to(otherAnswer, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                    gsap.to(otherIcon, {
                        rotation: 0,
                        duration: 0.3
                    });
                }
            });
            
            // Toggle current item
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                gsap.to(answer, {
                    height: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.inOut'
                });
                gsap.to(icon, {
                    rotation: 0,
                    duration: 0.3
                });
            } else {
                question.setAttribute('aria-expanded', 'true');
                gsap.set(answer, { height: 'auto', opacity: 1 });
                gsap.from(answer, {
                    height: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.inOut'
                });
                gsap.to(icon, {
                    rotation: 45,
                    duration: 0.3
                });
            }
        });
    });
}

// ============================================
// NEWSLETTER FORM
// ============================================

function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const button = form.querySelector('.newsletter-button');
        const originalText = button.textContent;
        
        // Button animation
        anime({
            targets: button,
            scale: [1, 0.95, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });

        // Simulate submission
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = '✓ Subscribed!';
            button.style.backgroundColor = 'var(--primary-emerald)';
            button.style.color = 'white';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.backgroundColor = '';
                button.style.color = '';
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// ============================================
// HOVER ANIMATIONS
// ============================================

function initHoverAnimations() {
    // Destination Cards
    document.querySelectorAll('.destination-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this.querySelector('.destination-image'), {
                scale: 1.1,
                duration: 0.4,
                ease: 'power2.out'
            });
            gsap.to(this.querySelector('.destination-overlay'), {
                backgroundColor: 'rgba(29, 94, 51, 0.85)',
                duration: 0.3
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this.querySelector('.destination-image'), {
                scale: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
            gsap.to(this.querySelector('.destination-overlay'), {
                backgroundColor: 'rgba(29, 94, 51, 0.6)',
                duration: 0.3
            });
        });
    });

    // Feature Cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this.querySelector('.feature-icon'), {
                rotation: 5,
                scale: 1.1,
                duration: 0.3,
                ease: 'back.out(2)'
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this.querySelector('.feature-icon'), {
                rotation: 0,
                scale: 1,
                duration: 0.3,
                ease: 'back.out(2)'
            });
        });
    });

    // Category Cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this.querySelector('.category-icon'), {
                rotation: 360,
                duration: 1,
                ease: 'power2.out'
            });
        });
    });

    // Offer Cards
    document.querySelectorAll('.offer-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this.querySelector('.offer-image'), {
                scale: 1.05,
                filter: 'brightness(1.1)',
                duration: 0.4
            });
        });

        card.addEventListener('mouseleave', function() {
            gsap.to(this.querySelector('.offer-image'), {
                scale: 1,
                filter: 'brightness(1)',
                duration: 0.4
            });
        });
    });
}

// ============================================
// PROMO BANNER
// ============================================

function initPromoBanner() {
    const promoBanner = document.getElementById('promoBanner');
    const promoClose = promoBanner?.querySelector('.promo-close');
    
    if (promoClose) {
        promoClose.addEventListener('click', () => {
            gsap.to(promoBanner, {
                x: '100%',
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    promoBanner.style.display = 'none';
                }
            });
        });
    }
}

// ============================================
// ACCESSIBILITY: REDUCED MOTION
// ============================================

function checkReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable all animations
        gsap.globalTimeline.timeScale(100); // Speed up dramatically (essentially instant)
        
        // Disable AOS
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
        });
        
        console.log('Reduced motion preference detected - animations minimized');
    }
}

// ============================================
// UTILITY: SMOOTH SCROLL
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: 'power2.inOut'
            });
        }
    });
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`✅ Page loaded in ${pageLoadTime}ms`);
    });
}

console.log('🎨 Destinova animations initialized successfully!');
