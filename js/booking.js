/* ═══════════════════════════════════════════════════════════════════
   DESTINOVA BOOKING SYSTEM - COMPLETE ENHANCED EDITION
   With Particles.js, Close Buttons, Card Validation, Payment Providers
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBAL STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STATE = {
    currentStep: 1,
    passengerCount: 0,
    maxPassengers: 9,
    passengers: [],
    selectedSeats: new Map(),
    insuranceSelected: false,
    promoCode: null,
    promoDiscount: 0,
    baseFarePerPerson: 9000,
    taxesPerPerson: 1800,
    seatPremiumCost: 1350,
    insuranceCostPerPerson: 900,
    countdownSeconds: 15 * 60,
    exitIntentShown: false,
    autoSaveInterval: null,
    timerBarVisible: true
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Destinova Booking System - Complete Enhanced Edition Initialized');
    
    initializeBookingSystem();
    setupEventListeners();
    initializeParticles();
    startCountdownTimer();
    enableMagneticButtons();
    enableExitIntent();
    startAutoSave();
    animateLiveActivity();
    
    addPassengerForm(true);
});

function initializeBookingSystem() {
    const savedData = localStorage.getItem('destinova_booking_draft');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            console.log('📋 Restored booking draft', parsed);
        } catch (e) {
            console.error('Failed to parse saved data:', e);
        }
    }
    
    updatePriceSummary();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PARTICLES.JS INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#E5CBAF', '#ffffff', '#2a7d4a']
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#E5CBAF',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
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
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CLOSE BUTTONS FUNCTIONALITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function closeTimerBar() {
    const timerBar = document.getElementById('timer-bar');
    if (timerBar) {
        timerBar.style.animation = 'slideOutUp 0.3s ease';
        setTimeout(() => {
            timerBar.style.display = 'none';
            STATE.timerBarVisible = false;
        }, 300);
    }
}

function removeInsurance() {
    const confirmed = confirm('Are you sure you want to remove travel insurance? You will lose coverage for cancellations, medical emergencies, and lost baggage.');
    
    if (confirmed) {
        STATE.insuranceSelected = false;
        const insuranceCard = document.getElementById('insurance-card');
        if (insuranceCard) {
            insuranceCard.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                insuranceCard.style.display = 'none';
            }, 300);
        }
        
        const hiddenInput = document.getElementById('insurance-value');
        if (hiddenInput) {
            hiddenInput.value = 'no';
        }
        
        updatePriceSummary();
        showNotification('Insurance removed', 'info');
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT LISTENERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setupEventListeners() {
    const addPassengerBtn = document.getElementById('add-passenger-btn');
    if (addPassengerBtn) {
        addPassengerBtn.addEventListener('click', () => addPassengerForm(false));
    }
    
    const insuranceYes = document.getElementById('insurance-yes');
    const insuranceNo = document.getElementById('insurance-no');
    
    if (insuranceYes) {
        insuranceYes.addEventListener('click', () => selectInsurance(true));
    }
    
    if (insuranceNo) {
        insuranceNo.addEventListener('click', () => selectInsurance(false));
    }
    
    const usePassengerContact = document.getElementById('use-passenger-contact');
    if (usePassengerContact) {
        usePassengerContact.addEventListener('change', toggleContactAutofill);
    }
    
    const verifyEmailBtn = document.getElementById('verify-email-btn');
    if (verifyEmailBtn) {
        verifyEmailBtn.addEventListener('click', sendEmailVerification);
    }
    
    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');
    
    if (contactEmail) {
        contactEmail.addEventListener('input', (e) => validateEmailInput(e.target));
        contactEmail.addEventListener('blur', (e) => validateEmailInput(e.target));
    }
    
    if (contactPhone) {
        contactPhone.addEventListener('input', (e) => validatePhoneInput(e.target));
        contactPhone.addEventListener('blur', (e) => validatePhoneInput(e.target));
    }
    
    const autoAssignBtn = document.getElementById('auto-assign-btn');
    if (autoAssignBtn) {
        autoAssignBtn.addEventListener('click', autoAssignSeats);
    }
    
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentMethodChange);
    });
    
    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCVV = document.getElementById('card-cvv');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
        cardNumber.addEventListener('blur', validateCardNumber);
    }
    
    if (cardExpiry) {
        cardExpiry.addEventListener('input', formatCardExpiry);
    }
    
    if (cardCVV) {
        cardCVV.addEventListener('input', formatCVV);
    }
    
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', handlePaymentConfirmation);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PASSENGER FORMS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function addPassengerForm(isPrimary = false) {
    if (STATE.passengerCount >= STATE.maxPassengers) {
        showNotification('Maximum 9 passengers allowed', 'warning');
        return;
    }
    
    STATE.passengerCount++;
    const passengerId = `passenger-${STATE.passengerCount}`;
    
    const formHTML = `
        <div class="passenger-form-card glass-card card-elevated" id="${passengerId}" data-index="${STATE.passengerCount}">
            <div class="form-header">
                <div class="form-title">
                    <span>${isPrimary ? '🎫 Primary Passenger' : `👤 Passenger ${STATE.passengerCount}`}</span>
                    <span class="passenger-badge">
                        <i class="fas fa-user"></i>
                        Adult
                    </span>
                </div>
                ${!isPrimary ? `
                    <button type="button" class="btn-remove" onclick="removePassenger('${passengerId}')">
                        <i class="fas fa-times"></i>
                        Remove
                    </button>
                ` : ''}
            </div>
            
            <div class="form-grid">
                <div class="input-group">
                    <input type="text" class="input-field" id="${passengerId}-first-name" 
                           placeholder=" " required>
                    <label class="input-label">First Name</label>
                    <i class="input-icon fas fa-user"></i>
                    <div class="input-validation-icon"></div>
                </div>
                
                <div class="input-group">
                    <input type="text" class="input-field" id="${passengerId}-last-name" 
                           placeholder=" " required>
                    <label class="input-label">Last Name</label>
                    <i class="input-icon fas fa-user"></i>
                    <div class="input-validation-icon"></div>
                </div>
                
                <div class="input-group">
                    <input type="date" class="input-field" id="${passengerId}-dob" 
                           placeholder=" " max="${getMaxDate()}" required>
                    <label class="input-label">Date of Birth</label>
                    <i class="input-icon fas fa-calendar"></i>
                </div>
                
                <div class="input-group">
                    <select class="input-field" id="${passengerId}-gender" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <label class="input-label">Gender</label>
                    <i class="input-icon fas fa-venus-mars"></i>
                </div>
                
                <div class="input-group">
                    <select class="input-field" id="${passengerId}-nationality" required>
                        <option value="">Select Nationality</option>
                        <option value="IN">India</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="other">Other</option>
                    </select>
                    <label class="input-label">Nationality</label>
                    <i class="input-icon fas fa-flag"></i>
                </div>
                
                <div class="input-group">
                    <input type="text" class="input-field" id="${passengerId}-passport" 
                           placeholder=" " style="text-transform: uppercase;">
                    <label class="input-label">Passport Number</label>
                    <i class="input-icon fas fa-passport"></i>
                </div>
                
                <div class="form-field-full">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600; color: var(--text-charcoal);">
                        <i class="fas fa-utensils" style="margin-right: 8px;"></i>
                        Meal Preference
                    </label>
                    <div class="meal-selector">
                        <div class="meal-option" onclick="selectMeal('${passengerId}', 'veg')">
                            <i class="fas fa-leaf"></i>
                            <span>Vegetarian</span>
                        </div>
                        <div class="meal-option" onclick="selectMeal('${passengerId}', 'nonveg')">
                            <i class="fas fa-drumstick-bite"></i>
                            <span>Non-Veg</span>
                        </div>
                        <div class="meal-option" onclick="selectMeal('${passengerId}', 'vegan')">
                            <i class="fas fa-seedling"></i>
                            <span>Vegan</span>
                        </div>
                        <div class="meal-option" onclick="selectMeal('${passengerId}', 'special')">
                            <i class="fas fa-utensils"></i>
                            <span>Special</span>
                        </div>
                    </div>
                    <input type="hidden" id="${passengerId}-meal" required>
                </div>
                
                <div class="form-field-full" style="margin-top: 16px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600; color: var(--text-charcoal);">
                        <i class="fas fa-wheelchair" style="margin-right: 8px;"></i>
                        Special Assistance
                    </label>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <label class="checkbox-custom">
                            <input type="checkbox" id="${passengerId}-wheelchair">
                            <span class="checkbox-mark"></span>
                            <span class="checkbox-label">Wheelchair assistance</span>
                        </label>
                        <label class="checkbox-custom">
                            <input type="checkbox" id="${passengerId}-hearing">
                            <span class="checkbox-mark"></span>
                            <span class="checkbox-label">Hearing support</span>
                        </label>
                        <label class="checkbox-custom">
                            <input type="checkbox" id="${passengerId}-vision">
                            <span class="checkbox-mark"></span>
                            <span class="checkbox-label">Vision support</span>
                        </label>
                        <label class="checkbox-custom">
                            <input type="checkbox" id="${passengerId}-mobility">
                            <span class="checkbox-mark"></span>
                            <span class="checkbox-label">Other mobility</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('passenger-forms');
    container.insertAdjacentHTML('beforeend', formHTML);
    
    const newForm = document.getElementById(passengerId);
    newForm.style.animation = 'fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setupInputValidation(passengerId);
    
    updatePassengerCapacity();
    updatePriceSummary();
    
    showNotification(`Passenger ${STATE.passengerCount} added`, 'success');
}

function removePassenger(passengerId) {
    const form = document.getElementById(passengerId);
    if (!form) return;
    
    form.style.opacity = '0';
    form.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        form.remove();
        STATE.passengerCount--;
        updatePassengerCapacity();
        updatePriceSummary();
        showNotification('Passenger removed', 'info');
    }, 300);
}

function updatePassengerCapacity() {
    const remaining = STATE.maxPassengers - STATE.passengerCount;
    const slotsText = document.getElementById('slots-remaining');
    
    if (slotsText) {
        slotsText.textContent = `${remaining} slots remaining`;
    }
    
    const addBtn = document.getElementById('add-passenger-btn');
    if (addBtn) {
        if (remaining <= 0) {
            addBtn.disabled = true;
            addBtn.style.opacity = '0.5';
            addBtn.style.cursor = 'not-allowed';
        } else {
            addBtn.disabled = false;
            addBtn.style.opacity = '1';
            addBtn.style.cursor = 'pointer';
        }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INPUT VALIDATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setupInputValidation(passengerId) {
    const firstName = document.getElementById(`${passengerId}-first-name`);
    const lastName = document.getElementById(`${passengerId}-last-name`);
    const dob = document.getElementById(`${passengerId}-dob`);
    
    if (firstName) {
        firstName.addEventListener('input', (e) => validateNameInput(e.target));
        firstName.addEventListener('blur', (e) => validateNameInput(e.target));
    }
    
    if (lastName) {
        lastName.addEventListener('input', (e) => validateNameInput(e.target));
        lastName.addEventListener('blur', (e) => validateNameInput(e.target));
    }
    
    if (dob) {
        dob.addEventListener('change', (e) => validateDOB(e.target));
    }
}

function validateNameInput(input) {
    const value = input.value.trim();
    const validationIcon = input.parentElement.querySelector('.input-validation-icon');
    
    if (value.length >= 2 && /^[a-zA-Z\s]+$/.test(value)) {
        input.classList.remove('error');
        input.classList.add('valid');
        if (validationIcon) {
            validationIcon.style.opacity = '1';
            validationIcon.style.color = 'var(--accent-success)';
        }
        return true;
    } else if (value.length > 0) {
        input.classList.add('error');
        input.classList.remove('valid');
        if (validationIcon) {
            validationIcon.style.opacity = '1';
            validationIcon.style.color = 'var(--accent-red)';
        }
        return false;
    }
    return false;
}

function validateEmailInput(input) {
    const value = input.value.trim();
    const validationIcon = input.parentElement.querySelector('.input-validation-icon');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(value)) {
        input.classList.remove('error');
        input.classList.add('valid');
        if (validationIcon) {
            validationIcon.style.opacity = '1';
            validationIcon.style.color = 'var(--accent-success)';
        }
        return true;
    } else if (value.length > 0) {
        input.classList.add('error');
        input.classList.remove('valid');
        if (validationIcon) {
            validationIcon.style.opacity = '1';
            validationIcon.style.color = 'var(--accent-red)';
        }
        return false;
    }
    return false;
}

function validatePhoneInput(input) {
    const value = input.value.trim();
    const validationIcon = input.parentElement.querySelector('.input-validation-icon');
    
    input.value = value.replace(/\D/g, '');
    
    if (/^\d{10}$/.test(input.value)) {
        input.classList.remove('error');
        input.classList.add('valid');
        if (validationIcon) {
            validationIcon.style.opacity = '1';
            validationIcon.style.color = 'var(--accent-success)';
        }
        return true;
    } else if (input.value.length > 0) {
        input.classList.add('error');
        input.classList.remove('valid');
        if (validationIcon) {
            validationIcon.style.opacity = '1';
            validationIcon.style.color = 'var(--accent-red)';
        }
        return false;
    }
    return false;
}

function validateDOB(input) {
    const dob = new Date(input.value);
    const today = new Date();
    const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (age >= 18) {
        input.classList.remove('error');
        input.classList.add('valid');
        return true;
    } else {
        input.classList.add('error');
        showNotification('Passenger must be 18+ years old', 'error');
        return false;
    }
}

function getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEAL SELECTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function selectMeal(passengerId, mealType) {
    const form = document.getElementById(passengerId);
    if (!form) return;
    
    const options = form.querySelectorAll('.meal-option');
    options.forEach(opt => opt.classList.remove('selected'));
    
    event.target.closest('.meal-option').classList.add('selected');
    
    const hiddenInput = document.getElementById(`${passengerId}-meal`);
    if (hiddenInput) {
        hiddenInput.value = mealType;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INSURANCE SELECTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function selectInsurance(selected) {
    STATE.insuranceSelected = selected;
    
    const yesBtn = document.getElementById('insurance-yes');
    const noBtn = document.getElementById('insurance-no');
    
    if (selected) {
        yesBtn.style.background = 'linear-gradient(135deg, #2a7d4a, #3a9c60)';
        yesBtn.style.transform = 'scale(1.02)';
        noBtn.style.opacity = '0.6';
        showNotification('Travel insurance added ✓', 'success');
        triggerConfetti();
    } else {
        const confirm = window.confirm('⚠️ Are you sure? Travel insurance protects you from unforeseen circumstances.');
        if (confirm) {
            yesBtn.style.background = '';
            yesBtn.style.transform = '';
            noBtn.style.opacity = '1';
            showNotification('Insurance not selected', 'info');
        } else {
            STATE.insuranceSelected = true;
            return;
        }
    }
    
    const hiddenInput = document.getElementById('insurance-value');
    if (hiddenInput) {
        hiddenInput.value = selected ? 'yes' : 'no';
    }
    
    updatePriceSummary();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTACT DETAILS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function toggleContactAutofill() {
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const checkbox = document.getElementById('use-passenger-contact');
    
    if (checkbox.checked) {
        emailInput.disabled = true;
        phoneInput.disabled = true;
        emailInput.style.opacity = '0.6';
        phoneInput.style.opacity = '0.6';
        
        emailInput.value = 'passenger1@example.com';
        phoneInput.value = '9876543210';
    } else {
        emailInput.disabled = false;
        phoneInput.disabled = false;
        emailInput.style.opacity = '1';
        phoneInput.style.opacity = '1';
        emailInput.value = '';
        phoneInput.value = '';
    }
}

function sendEmailVerification() {
    const emailInput = document.getElementById('contact-email');
    const btn = document.getElementById('verify-email-btn');
    
    if (!validateEmailInput(emailInput)) {
        showNotification('Please enter a valid email address', 'error');
        emailInput.focus();
        return;
    }
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Code Sent!';
        btn.style.background = 'var(--accent-success)';
        btn.style.color = 'white';
        
        showNotification('Verification code sent to your email', 'success');
        
        setTimeout(() => {
            const otp = prompt('Enter the 6-digit verification code:');
            if (otp && otp.length === 6) {
                showNotification('Email verified successfully! ✓', 'success');
                triggerConfetti();
            }
            
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Verification Code</span>';
            btn.style.background = '';
            btn.style.color = '';
        }, 1500);
    }, 1500);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STEP NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function nextStep(stepNumber) {
    if (!validateCurrentStep()) {
        return;
    }
    
    const currentStepEl = document.getElementById(`step-${STATE.currentStep}`);
    currentStepEl.classList.add('hidden');
    
    const currentProgress = document.querySelector(`[data-step="${STATE.currentStep}"]`);
    currentProgress.classList.remove('active');
    currentProgress.classList.add('completed');
    
    STATE.currentStep = stepNumber;
    const nextStepEl = document.getElementById(`step-${stepNumber}`);
    nextStepEl.classList.remove('hidden');
    
    const nextProgress = document.querySelector(`[data-step="${stepNumber}"]`);
    nextProgress.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (stepNumber === 2) {
        initializeSeatMap();
    } else if (stepNumber === 3) {
        populateReviewSummary();
    }
    
    showNotification(`Step ${stepNumber} of 3`, 'info');
}

function prevStep(stepNumber) {
    const currentStepEl = document.getElementById(`step-${STATE.currentStep}`);
    currentStepEl.classList.add('hidden');
    
    const currentProgress = document.querySelector(`[data-step="${STATE.currentStep}"]`);
    currentProgress.classList.remove('active');
    
    STATE.currentStep = stepNumber;
    const prevStepEl = document.getElementById(`step-${stepNumber}`);
    prevStepEl.classList.remove('hidden');
    
    const prevProgress = document.querySelector(`[data-step="${stepNumber}"]`);
    prevProgress.classList.add('active');
    prevProgress.classList.remove('completed');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateCurrentStep() {
    if (STATE.currentStep === 1) {
        if (STATE.passengerCount === 0) {
            showNotification('Please add at least one passenger', 'error');
            return false;
        }
        
        const forms = document.querySelectorAll('.passenger-form-card');
        for (let form of forms) {
            const requiredInputs = form.querySelectorAll('input[required], select[required]');
            for (let input of requiredInputs) {
                if (!input.value.trim() && input.type !== 'hidden') {
                    showNotification('Please fill all required passenger details', 'error');
                    input.focus();
                    return false;
                }
            }
        }
        
        const email = document.getElementById('contact-email');
        const phone = document.getElementById('contact-phone');
        
        if (!validateEmailInput(email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        if (!validatePhoneInput(phone)) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return false;
        }
    }
    
    if (STATE.currentStep === 2) {
        if (STATE.selectedSeats.size < STATE.passengerCount) {
            const confirm = window.confirm(
                `You've selected ${STATE.selectedSeats.size} seat(s) for ${STATE.passengerCount} passenger(s).\n\n` +
                'Would you like to auto-assign the remaining seats?'
            );
            if (confirm) {
                autoAssignSeats();
            } else {
                return false;
            }
        }
    }
    
    return true;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SEAT SELECTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeSeatMap() {
    const seatMap = document.getElementById('seat-map');
    if (!seatMap || seatMap.children.length > 0) return;
    
    const rows = 20;
    const cols = ['A', 'B', 'C', '', 'D', 'E', 'F'];
    
    for (let row = 1; row <= rows; row++) {
        for (let col of cols) {
            if (col === '') {
                const aisle = document.createElement('div');
                aisle.className = 'seat seat-aisle';
                seatMap.appendChild(aisle);
                continue;
            }
            
            const seatNumber = `${row}${col}`;
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.textContent = seatNumber;
            seat.dataset.seat = seatNumber;
            
            if (row >= 6 && row <= 8) {
                seat.classList.add('premium');
                seat.dataset.type = 'premium';
                seat.dataset.price = 9;
            } else if (row >= 7 && row <= 10 && ['E', 'B'].includes(col)) {
                seat.classList.add('frequent');
                seat.dataset.type = 'frequent';
                seat.dataset.price = 0;
            } else if (row >= 11 && row <= 12) {
                seat.classList.add('exit-row');
                seat.dataset.type = 'exit';
                seat.dataset.price = 10;
            } else if (row === 13 && col === 'B') {
                seat.classList.add('standard');
                seat.dataset.type = 'standard';
                seat.dataset.price = 0;
            } else if (row === 14 && col === 'D') {
                seat.classList.add('standard');
                seat.dataset.type = 'standard';
                seat.dataset.price = 0;
            } else if (Math.random() > 0.7) {
                seat.classList.add('taken');
                seat.dataset.type = 'taken';
            } else {
                seat.classList.add('available');
                seat.dataset.type = 'available';
            }
            
            if (!seat.classList.contains('taken')) {
                seat.addEventListener('click', () => selectSeat(seat));
            }
            
            seatMap.appendChild(seat);
        }
    }
    
    showNotification('Select your preferred seats', 'info');
}

function selectSeat(seatElement) {
    const seatNumber = seatElement.dataset.seat;
    
    if (seatElement.classList.contains('selected')) {
        seatElement.classList.remove('selected');
        const originalType = seatElement.dataset.type;
        seatElement.classList.add(originalType);
        STATE.selectedSeats.delete(seatNumber);
    } else {
        if (STATE.selectedSeats.size >= STATE.passengerCount) {
            showNotification(`You can only select ${STATE.passengerCount} seat(s)`, 'warning');
            return;
        }
        
        seatElement.classList.remove('available', 'premium', 'exit-row', 'frequent', 'standard');
        seatElement.classList.add('selected');
        
        STATE.selectedSeats.set(seatNumber, {
            type: seatElement.dataset.type,
            price: parseInt(seatElement.dataset.price) || 0
        });
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    updateSelectedSeatsDisplay();
    updatePriceSummary();
}

function updateSelectedSeatsDisplay() {
    const display = document.getElementById('selected-seats-display');
    if (!display) return;
    
    if (STATE.selectedSeats.size === 0) {
        display.className = 'seats-display-empty';
        display.innerHTML = `
            <i class="fas fa-chair empty-icon"></i>
            <p>No seats selected yet</p>
        `;
        return;
    }
    
    display.className = '';
    display.innerHTML = '';
    
    let passengerNum = 1;
    STATE.selectedSeats.forEach((seat, seatNumber) => {
        const seatItem = document.createElement('div');
        seatItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: var(--crystal-gold);
            border-radius: var(--radius);
            margin-bottom: 8px;
        `;
        
        seatItem.innerHTML = `
            <div>
                <strong style="display: block; margin-bottom: 4px;">Passenger ${passengerNum}</strong>
                <span style="font-size: 0.85rem; color: var(--text-slate);">
                    Seat ${seatNumber} ${seat.type === 'premium' ? '(Premium ✨)' : seat.type === 'exit' ? '(Exit Row)' : ''}
                </span>
            </div>
            <div style="text-align: right;">
                <strong style="color: ${seat.price > 0 ? 'var(--primary-emerald)' : 'var(--accent-success)'};">
                    ${seat.price > 0 ? `$${seat.price}` : 'Free'}
                </strong>
            </div>
        `;
        
        display.appendChild(seatItem);
        passengerNum++;
    });
}

function autoAssignSeats() {
    STATE.selectedSeats.clear();
    
    const availableSeats = document.querySelectorAll('.seat.available, .seat.frequent, .seat.standard');
    let assigned = 0;
    
    for (let seat of availableSeats) {
        if (assigned >= STATE.passengerCount) break;
        selectSeat(seat);
        assigned++;
    }
    
    showNotification(`${assigned} seats automatically assigned`, 'success');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REVIEW & PAYMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function populateReviewSummary() {
    const seatsArray = Array.from(STATE.selectedSeats.keys());
    const passengersList = document.getElementById('passengers-review-list');
    if (!passengersList) return;
    
    passengersList.innerHTML = '';
    
    const forms = document.querySelectorAll('.passenger-form-card');
    let passengerNum = 1;
    
    forms.forEach(form => {
        const firstName = form.querySelector('[id$="-first-name"]')?.value || '';
        const lastName = form.querySelector('[id$="-last-name"]')?.value || '';
        const gender = form.querySelector('[id$="-gender"]')?.value || '';
        const meal = form.querySelector('[id$="-meal"]')?.value || '';
        
        const passengerItem = document.createElement('div');
        passengerItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: var(--crystal-gold);
            border-radius: var(--radius);
            margin-bottom: 12px;
        `;
        
        passengerItem.innerHTML = `
            <div style="
                width: 48px;
                height: 48px;
                background: var(--gradient-emerald);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
                flex-shrink: 0;
            ">
                <i class="fas fa-user"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 1rem; margin-bottom: 4px;">
                    ${firstName} ${lastName}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-slate);">
                    ${gender.charAt(0).toUpperCase() + gender.slice(1)} • 
                    ${meal.charAt(0).toUpperCase() + meal.slice(1)} meal • 
                    Seat ${seatsArray[passengerNum - 1] || 'TBD'}
                </div>
            </div>
        `;
        
        passengersList.appendChild(passengerItem);
        passengerNum++;
    });
    
    const passengerCount = document.getElementById('passenger-count');
    if (passengerCount) {
        passengerCount.textContent = STATE.passengerCount;
    }
}

function handlePaymentMethodChange(e) {
    const allForms = document.querySelectorAll('.payment-form-wrapper');
    allForms.forEach(form => form.classList.add('hidden'));
    
    const selectedMethod = e.target.value;
    const formId = `${selectedMethod}-payment-form`;
    const selectedForm = document.getElementById(formId);
    
    if (selectedForm) {
        selectedForm.classList.remove('hidden');
    }
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    
    // Limit to 16 digits
    value = value.slice(0, 16);
    
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formatted;
    
    // Detect card brand
    detectCardBrand(value);
}

function validateCardNumber(e) {
    const value = e.target.value.replace(/\s/g, '');
    
    if (value.length >= 12 && value.length <= 16) {
        e.target.classList.add('valid');
        e.target.classList.remove('error');
        showNotification('Card number validated ✓', 'success');
    } else {
        e.target.classList.add('error');
        e.target.classList.remove('valid');
        showNotification('Card number must be 12-16 digits', 'error');
    }
}

function detectCardBrand(cardNumber) {
    const brandElement = document.getElementById('card-brand');
    if (!brandElement) return;
    
    let brand = '';
    if (/^4/.test(cardNumber)) {
        brand = '<i class="fab fa-cc-visa" style="font-size: 2rem; color: #1A1F71;"></i>';
    } else if (/^5[1-5]/.test(cardNumber)) {
        brand = '<i class="fab fa-cc-mastercard" style="font-size: 2rem; color: #EB001B;"></i>';
    } else if (/^3[47]/.test(cardNumber)) {
        brand = '<i class="fab fa-cc-amex" style="font-size: 2rem; color: #006FCF;"></i>';
    }
    
    brandElement.innerHTML = brand;
}

function formatCardExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
}

function formatCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
}

function handlePaymentConfirmation() {
    const termsCheckbox = document.getElementById('terms-checkbox');
    if (!termsCheckbox || !termsCheckbox.checked) {
        showNotification('Please accept the Terms & Conditions', 'error');
        return;
    }
    
    const btn = document.getElementById('confirm-payment-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Processing Payment...</span>';
    
    setTimeout(() => {
        triggerConfetti();
        showNotification('🎉 Payment Successful!', 'success');
        
        setTimeout(() => {
            alert(
                '🎉 Booking Confirmed!\n\n' +
                'Your booking reference: DEST1NOVA\n' +
                'E-tickets have been sent to your email.\n\n' +
                'Thank you for choosing Destinova!'
            );
            window.location.href = '/';
        }, 1000);
    }, 2500);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PRICE CALCULATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function calculatePrices() {
    const passengers = STATE.passengerCount || 1;
    const baseFare = STATE.baseFarePerPerson * passengers;
    const taxes = STATE.taxesPerPerson * passengers;
    
    let seatCost = 0;
    STATE.selectedSeats.forEach(seat => {
        seatCost += seat.price || 0;
    });
    
    const insuranceCost = STATE.insuranceSelected ? 
        (STATE.insuranceCostPerPerson * passengers) : 0;
    
    const subtotal = baseFare + taxes + seatCost + insuranceCost;
    const total = subtotal - STATE.promoDiscount;
    
    return { baseFare, taxes, seatCost, insuranceCost, subtotal, total, passengers };
}

function updatePriceSummary() {
    const prices = calculatePrices();
    
    const totalElements = ['sidebar-total', 'final-total-amount'];
    totalElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = `₹${prices.total.toLocaleString()}`;
    });
    
    const seatCostEl = document.getElementById('sidebar-seat-cost');
    if (seatCostEl) seatCostEl.textContent = `₹${prices.seatCost.toLocaleString()}`;
    
    if (STATE.insuranceSelected) {
        const insuranceRows = document.querySelectorAll('.insurance-row-sidebar');
        insuranceRows.forEach(row => {
            row.classList.remove('hidden');
            row.style.display = 'flex';
        });
        
        const el = document.getElementById('sidebar-insurance-cost');
        if (el) el.textContent = `₹${prices.insuranceCost.toLocaleString()}`;
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COUNTDOWN TIMER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function startCountdownTimer() {
    const display = document.getElementById('countdown-display');
    if (!display) return;
    
    const timer = setInterval(() => {
        const minutes = Math.floor(STATE.countdownSeconds / 60);
        const seconds = STATE.countdownSeconds % 60;
        
        display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (STATE.countdownSeconds <= 0) {
            clearInterval(timer);
            showNotification('Session expired. Please start again.', 'error');
            setTimeout(() => window.location.reload(), 2000);
        }
        
        if (STATE.countdownSeconds === 120) {
            showNotification('⚠️ Only 2 minutes left!', 'warning');
        }
        
        STATE.countdownSeconds--;
    }, 1000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAGNETIC BUTTONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function enableMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-magnetic');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const moveX = x * 0.15;
            const moveY = y * 0.15;
            
            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELP WIDGET
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function toggleHelp() {
    const panel = document.getElementById('help-panel');
    if (panel) panel.classList.toggle('hidden');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXIT INTENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function enableExitIntent() {
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !STATE.exitIntentShown && STATE.currentStep < 3) {
            showNotification('Wait! Use code COMPLETE10 for 10% off!', 'info');
            STATE.exitIntentShown = true;
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTO-SAVE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function startAutoSave() {
    STATE.autoSaveInterval = setInterval(() => {
        const bookingData = {
            step: STATE.currentStep,
            passengerCount: STATE.passengerCount,
            insuranceSelected: STATE.insuranceSelected,
            selectedSeats: Array.from(STATE.selectedSeats.entries()),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('destinova_booking_draft', JSON.stringify(bookingData));
    }, 30000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LIVE ACTIVITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function animateLiveActivity() {
    const activities = [
        'Sarah from Delhi booked 5 min ago',
        'Raj from Mumbai just confirmed booking',
        'Priya from Bangalore selected seats',
        'Amit from Pune added insurance',
        'Neha from Chennai completed payment'
    ];
    
    let index = 0;
    
    setInterval(() => {
        const textEl = document.getElementById('live-activity-text');
        if (textEl) {
            index = (index + 1) % activities.length;
            textEl.textContent = activities[index];
        }
    }, 5000);
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
        background: ${type === 'success' ? 'var(--accent-success)' : type === 'error' ? 'var(--accent-red)' : type === 'warning' ? 'var(--accent-warning)' : 'var(--primary-emerald)'};
        color: white;
        border-radius: var(--radius);
        box-shadow: var(--crystal-glow);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        max-width: 300px;
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ';
    notification.innerHTML = `${icon} ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFETTI
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#2a7d4a', '#E5CBAF', '#3a9c60', '#d4b591', '#1d5e33'];
    
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 100,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, i) => {
            ctx.beginPath();
            ctx.lineWidth = p.r / 2;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();
            
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;
            
            if (p.y > canvas.height) {
                particles.splice(i, 1);
            }
        });
        
        if (particles.length > 0) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    draw();
}

// Add CSS animations
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
    
    @keyframes slideOutUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100%); opacity: 0; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('✈️ Destinova Booking System Fully Loaded - All Features Active');
