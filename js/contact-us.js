/* ═══════════════════════════════════════════════════════════════════
   DESTINOVA CONTACT US - ULTRA-PREMIUM JAVASCRIPT
   Form Validation | Copy Functions | FAQ Accordion | Scroll Reveals
   Professional 25+ Years UI/UX Design
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const APP_STATE = {
    formData: {},
    isSubmitting: false,
    observers: {
        reveal: null
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Destinova Contact Us - Ultra-Premium Edition Initialized');
    
    initializeGlassHeader();
    initializeScrollReveal();
    initializeFAQAccordion();
    initializeContactForm();
    initializeCopyButtons();
    initializeCharCounter();
    initializeParticleMouseTracking();
    
    console.log('🎨 All premium features loaded successfully');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLASSMORPHIC HEADER SCROLL EFFECT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeGlassHeader() {
    const header = document.querySelector('.glass-header-contact');
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
// SCROLL REVEAL ANIMATIONS (UNIQUE SLIDE DIRECTIONS)
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
    document.querySelectorAll('.reveal-slide-up, .reveal-slide-right, .reveal-slide-left').forEach(el => {
        APP_STATE.observers.reveal.observe(el);
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FAQ ACCORDION WITH SMOOTH ANIMATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item-glass');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question-crystal');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
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
                
                // Smooth scroll to item
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
        
        // Keyboard accessibility
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTACT FORM VALIDATION & SUBMISSION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let errorMsg = '';
    
    // Clear previous errors
    field.classList.remove('error');
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    // Validation rules
    switch(fieldName) {
        case 'fullname':
            if (!value) {
                errorMsg = 'Full name is required';
            } else if (value.length < 3) {
                errorMsg = 'Name must be at least 3 characters';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMsg = 'Email is required';
            } else if (!emailRegex.test(value)) {
                errorMsg = 'Please enter a valid email address';
            }
            break;
            
        case 'phone':
            const phoneRegex = /^\d{10}$/;
            if (!value) {
                errorMsg = 'Phone number is required';
            } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                errorMsg = 'Please enter a valid 10-digit phone number';
            }
            break;
            
        case 'subject':
            if (!value) {
                errorMsg = 'Please select a subject';
            }
            break;
            
        case 'message':
            if (!value) {
                errorMsg = 'Message is required';
            } else if (value.length < 10) {
                errorMsg = 'Message must be at least 10 characters';
            }
            break;
            
        case 'privacy':
            if (!field.checked) {
                errorMsg = 'You must agree to the privacy policy';
            }
            break;
    }
    
    if (errorMsg) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMsg;
            errorElement.classList.add('show');
        }
        return false;
    }
    
    return true;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (APP_STATE.isSubmitting) return;
    
    const form = e.target;
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-msg');
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Show loading state
    APP_STATE.isSubmitting = true;
    submitBtn.classList.add('loading');
    submitBtn.querySelector('.btn-submit-text').textContent = 'Sending';
    
    // Simulate API call
    setTimeout(() => {
        // Success
        APP_STATE.isSubmitting = false;
        submitBtn.classList.remove('loading');
        submitBtn.querySelector('.btn-submit-text').textContent = 'Send Message';
        
        // Show success message
        successMsg.style.display = 'flex';
        
        // Reset form
        form.reset();
        
        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
        
    }, 2000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHARACTER COUNTER FOR TEXTAREA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeCharCounter() {
    const messageField = document.getElementById('message');
    const charCounter = document.getElementById('char-counter');
    
    if (!messageField || !charCounter) return;
    
    const maxLength = 500;
    
    messageField.addEventListener('input', () => {
        const currentLength = messageField.value.length;
        charCounter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength) {
            charCounter.style.color = '#ef4444';
            messageField.value = messageField.value.substring(0, maxLength);
        } else {
            charCounter.style.color = '';
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COPY BUTTONS (EMAIL & PHONE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeCopyButtons() {
    // Copy Email
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            copyToClipboard('support@destinova.com', copyEmailBtn);
        });
    }
    
    // Copy Phone
    const copyPhoneBtn = document.getElementById('copy-phone-btn');
    if (copyPhoneBtn) {
        copyPhoneBtn.addEventListener('click', () => {
            copyToClipboard('+91 12345 67890', copyPhoneBtn);
        });
    }
    
    // Open Google Maps
    const openMapBtn = document.getElementById('open-map-btn');
    if (openMapBtn) {
        openMapBtn.addEventListener('click', () => {
            const address = '123 Skyward Avenue, Aero City, New Delhi, 110037, India';
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        });
    }
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success feedback
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
        button.style.background = 'rgba(16, 185, 129, 0.2)';
        button.style.borderColor = '#10b981';
        button.style.color = '#059669';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please copy manually.');
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PARTICLE MOUSE TRACKING (UNIQUE TO CONTACT PAGE)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeParticleMouseTracking() {
    const particles = document.querySelectorAll('.ambient-particle');
    
    let mouseX = 0;
    let mouseY = 0;
    let ticking = false;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                particles.forEach((particle, index) => {
                    const speed = (index + 1) * 0.02;
                    const x = (mouseX - window.innerWidth / 2) * speed;
                    const y = (mouseY - window.innerHeight / 2) * speed;
                    
                    particle.style.transform = `translate(${x}px, ${y}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INPUT FOCUS EFFECTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.querySelectorAll('.input-glass-wrapper input, .input-glass-wrapper select, .input-glass-wrapper textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
        this.parentElement.style.transition = 'transform 0.3s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = '';
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INFO CARD HOVER EFFECTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.querySelectorAll('.info-card-crystal').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.info-icon-crystal');
        if (icon) {
            icon.style.animation = 'iconBounce 0.6s ease';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.info-icon-crystal');
        if (icon) {
            icon.style.animation = '';
        }
    });
});

// Add icon bounce animation
const style = document.createElement('style');
style.textContent = `
    @keyframes iconBounce {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        25% {
            transform: translateY(-8px) rotate(5deg);
        }
        50% {
            transform: translateY(-4px) rotate(-5deg);
        }
        75% {
            transform: translateY(-6px) rotate(3deg);
        }
    }
`;
document.head.appendChild(style);

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
            const headerOffset = 100;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

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
    
    // 'F' to focus on form
    if (e.key === 'f' || e.key === 'F') {
        if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            const firstInput = document.getElementById('fullname');
            if (firstInput) {
                firstInput.focus();
                firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PERFORMANCE OPTIMIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Reduce animations when user prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.style.scrollBehavior = 'auto';
    document.querySelectorAll('.ambient-particle').forEach(particle => {
        particle.style.animation = 'none';
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE VISIBILITY API - PAUSE ANIMATIONS WHEN TAB HIDDEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('visibilitychange', () => {
    const particles = document.querySelectorAll('.ambient-particle');
    
    if (document.hidden) {
        particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    } else {
        particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSOLE EASTER EGG (PREMIUM BRANDING)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

console.log(
    '%c✨ DESTINOVA CONTACT US',
    'color: #1d5e33; font-size: 24px; font-weight: 900; padding: 20px; background: linear-gradient(135deg, #E5CBAF 0%, #1d5e33 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'
);

console.log(
    '%c🎨 Ultra-Premium Glassmorphism Edition\nUnique Floating Particle Animations',
    'color: #5C6B73; font-size: 14px; padding: 10px; line-height: 1.6;'
);

console.log(
    '%cNeed help? Contact us at support@destinova.com',
    'color: #E5CBAF; font-size: 13px; padding: 8px; font-weight: 600;'
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLEANUP ON PAGE UNLOAD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

window.addEventListener('beforeunload', () => {
    if (APP_STATE.observers.reveal) {
        APP_STATE.observers.reveal.disconnect();
    }
});

console.log('✨ Destinova Contact Us - All Premium Systems Active');
