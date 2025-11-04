/**
 * DESTINOVA - PREMIUM FLIGHT BOOKING HOMEPAGE
 * Phase 2: Search Card Interactivity
 * 
 * This file handles the floating search card interactions including:
 * - Tab switching (Round Trip, One Way, Multi-City)
 * - Form input effects and validation
 * - Location swap functionality
 * - Date picker interactions
 * - Dropdown behaviors
 */

// ===============================================
// INITIALIZATION
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Destinova Search Module Initialized');
    
    // Initialize search tabs
    initSearchTabs();
    
    // Initialize swap button
    initSwapButton();
    
    // Initialize form inputs
    initFormInputs();
    
    // Initialize form submission
    initFormSubmission();
    
    // Set default dates
    setDefaultDates();
});

// ===============================================
// SEARCH TAB SWITCHING
// ===============================================

function initSearchTabs() {
    const searchTabs = document.querySelectorAll('.search-tab');
    const returnDateGroup = document.getElementById('returnDateGroup');
    const returnDateInput = document.getElementById('returnDate');
    
    if (!searchTabs.length) return;
    
    searchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            searchTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get tab type
            const tabType = tab.getAttribute('data-tab');
            
            // Handle return date visibility based on tab
            if (tabType === 'one-way') {
                // Hide return date for one-way
                if (returnDateGroup) {
                    fadeOut(returnDateGroup);
                    if (returnDateInput) {
                        returnDateInput.removeAttribute('required');
                        returnDateInput.value = '';
                    }
                }
            } else if (tabType === 'round-trip') {
                // Show return date for round-trip
                if (returnDateGroup) {
                    fadeIn(returnDateGroup);
                    if (returnDateInput) {
                        returnDateInput.setAttribute('required', 'required');
                    }
                }
            } else if (tabType === 'multi-city') {
                // Multi-city logic (can be expanded later)
                if (returnDateGroup) {
                    fadeIn(returnDateGroup);
                }
                console.log('Multi-city mode activated');
            }
            
            // Add tab switch animation
            animateTabSwitch(tab);
        });
    });
}

function animateTabSwitch(tab) {
    if (typeof anime !== 'undefined') {
        anime({
            targets: tab,
            scale: [1, 1.05, 1],
            duration: 300,
            easing: 'easeOutElastic(1, .5)'
        });
    }
}

// ===============================================
// SWAP BUTTON FUNCTIONALITY
// ===============================================

function initSwapButton() {
    const swapButton = document.querySelector('.swap-button');
    const fromInput = document.getElementById('fromLocation');
    const toInput = document.getElementById('toLocation');
    
    if (!swapButton || !fromInput || !toInput) return;
    
    swapButton.addEventListener('click', () => {
        // Swap values
        const tempValue = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = tempValue;
        
        // Add swap animation
        animateSwap(fromInput, toInput);
        
        // Add rotation animation to button (handled by CSS)
        swapButton.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            swapButton.style.transform = '';
        }, 300);
    });
}

function animateSwap(from, to) {
    if (typeof anime !== 'undefined') {
        // Animate from field
        anime({
            targets: from,
            translateX: [0, 20, 0],
            opacity: [1, 0.5, 1],
            duration: 400,
            easing: 'easeInOutQuad'
        });
        
        // Animate to field
        anime({
            targets: to,
            translateX: [0, -20, 0],
            opacity: [1, 0.5, 1],
            duration: 400,
            easing: 'easeInOutQuad'
        });
    }
}

// ===============================================
// FORM INPUT ENHANCEMENTS
// ===============================================

function initFormInputs() {
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(input => {
        // Focus effect
        input.addEventListener('focus', (e) => {
            const formGroup = e.target.closest('.form-group');
            if (formGroup) {
                formGroup.classList.add('focused');
                animateInputFocus(e.target);
            }
        });
        
        // Blur effect
        input.addEventListener('blur', (e) => {
            const formGroup = e.target.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('focused');
            }
        });
        
        // Input validation on change
        input.addEventListener('input', (e) => {
            validateInput(e.target);
        });
    });
    
    // Date input constraints
    const departDate = document.getElementById('departDate');
    const returnDate = document.getElementById('returnDate');
    
    if (departDate) {
        departDate.addEventListener('change', () => {
            // Set return date minimum to depart date
            if (returnDate && departDate.value) {
                returnDate.min = departDate.value;
                
                // If return date is before depart date, clear it
                if (returnDate.value && returnDate.value < departDate.value) {
                    returnDate.value = '';
                }
            }
        });
    }
}

function animateInputFocus(input) {
    if (typeof anime !== 'undefined') {
        anime({
            targets: input,
            scale: [1, 1.02, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
}

function validateInput(input) {
    const formGroup = input.closest('.form-group');
    
    if (!input.value && input.hasAttribute('required')) {
        formGroup?.classList.add('error');
        formGroup?.classList.remove('success');
    } else if (input.value) {
        formGroup?.classList.remove('error');
        formGroup?.classList.add('success');
    } else {
        formGroup?.classList.remove('error', 'success');
    }
}

// ===============================================
// FORM SUBMISSION
// ===============================================

function initFormSubmission() {
    const searchForm = document.getElementById('flightSearchForm');
    
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate form
        const isValid = validateForm(searchForm);
        
        if (!isValid) {
            showFormError('Please fill in all required fields');
            return;
        }
        
        // Get form data
        const formData = getFormData(searchForm);
        
        // Show loading state
        const submitButton = searchForm.querySelector('.btn-search-primary');
        showLoadingState(submitButton);
        
        // Simulate search (in production, this would be an API call)
        setTimeout(() => {
            console.log('Search Data:', formData);
            hideLoadingState(submitButton);
            
            // Redirect to results page (uncomment in production)
            // window.location.href = `results.html?${new URLSearchParams(formData)}`;
            
            // For demo, show success message
            showSuccessMessage('Search completed! Redirecting...');
            
            setTimeout(() => {
                // In production: redirect to results page
                console.log('Redirecting to results page...');
            }, 1500);
        }, 1500);
    });
}

function validateForm(form) {
    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value || !input.validity.valid) {
            isValid = false;
            validateInput(input);
            
            // Add shake animation to invalid input
            if (typeof anime !== 'undefined') {
                anime({
                    targets: input,
                    translateX: [0, -10, 10, -10, 10, 0],
                    duration: 400,
                    easing: 'easeInOutQuad'
                });
            }
        }
    });
    
    return isValid;
}

function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    // Get form values
    data.from = document.getElementById('fromLocation')?.value || '';
    data.to = document.getElementById('toLocation')?.value || '';
    data.departDate = document.getElementById('departDate')?.value || '';
    data.returnDate = document.getElementById('returnDate')?.value || '';
    data.travelers = document.getElementById('travelers')?.value || '2';
    data.class = document.getElementById('class')?.value || 'economy';
    
    // Get active tab
    const activeTab = document.querySelector('.search-tab.active');
    data.tripType = activeTab?.getAttribute('data-tab') || 'round-trip';
    
    return data;
}

function showLoadingState(button) {
    if (!button) return;
    
    button.classList.add('loading');
    button.disabled = true;
    
    const originalText = button.innerHTML;
    button.setAttribute('data-original-text', originalText);
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
}

function hideLoadingState(button) {
    if (!button) return;
    
    button.classList.remove('loading');
    button.disabled = false;
    
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
        button.innerHTML = originalText;
    }
}

function showFormError(message) {
    showNotification(message, 'error');
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        backgroundColor: type === 'error' ? '#ef4444' : '#10b981',
        color: 'white',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===============================================
// DEFAULT DATES
// ===============================================

function setDefaultDates() {
    const departDate = document.getElementById('departDate');
    const returnDate = document.getElementById('returnDate');
    
    if (departDate) {
        // Set minimum date to today
        const today = new Date();
        departDate.min = formatDate(today);
        
        // Set default to 7 days from now
        const defaultDepart = new Date();
        defaultDepart.setDate(today.getDate() + 7);
        departDate.value = formatDate(defaultDepart);
    }
    
    if (returnDate) {
        // Set default return to 14 days from now
        const defaultReturn = new Date();
        defaultReturn.setDate(new Date().getDate() + 14);
        returnDate.value = formatDate(defaultReturn);
        returnDate.min = departDate?.value || formatDate(new Date());
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ===============================================
// UTILITY FUNCTIONS
// ===============================================

function fadeOut(element) {
    if (typeof anime !== 'undefined') {
        anime({
            targets: element,
            opacity: [1, 0],
            height: [element.offsetHeight, 0],
            marginTop: [element.style.marginTop || 0, 0],
            duration: 300,
            easing: 'easeOutQuad',
            complete: () => {
                element.style.display = 'none';
            }
        });
    } else {
        element.style.display = 'none';
    }
}

function fadeIn(element) {
    if (typeof anime !== 'undefined') {
        element.style.display = '';
        const targetHeight = element.scrollHeight;
        
        anime({
            targets: element,
            opacity: [0, 1],
            height: [0, targetHeight],
            duration: 300,
            easing: 'easeOutQuad'
        });
    } else {
        element.style.display = '';
    }
}

// ===============================================
// LOCATION AUTOCOMPLETE (PLACEHOLDER)
// ===============================================

// This would integrate with the existing airport-autocomplete.js
// For now, we add basic placeholder functionality

function initLocationAutocomplete() {
    const fromInput = document.getElementById('fromLocation');
    const toInput = document.getElementById('toLocation');
    
    // Popular airports for quick selection
    const popularAirports = [
        { code: 'DEL', name: 'Delhi', city: 'New Delhi' },
        { code: 'BOM', name: 'Mumbai', city: 'Mumbai' },
        { code: 'BLR', name: 'Bangalore', city: 'Bengaluru' },
        { code: 'DXB', name: 'Dubai', city: 'Dubai' },
        { code: 'SIN', name: 'Singapore', city: 'Singapore' },
        { code: 'LHR', name: 'London', city: 'London' },
        { code: 'JFK', name: 'New York', city: 'New York' }
    ];
    
    // This is a placeholder - in production, use the existing airport-autocomplete.js
    console.log('Location autocomplete ready with', popularAirports.length, 'airports');
}

// Initialize autocomplete if needed
if (document.getElementById('fromLocation')) {
    initLocationAutocomplete();
}

// ===============================================
// KEYBOARD SHORTCUTS
// ===============================================

document.addEventListener('keydown', (e) => {
    // Alt + S to focus search
    if (e.altKey && e.key === 's') {
        e.preventDefault();
        const fromInput = document.getElementById('fromLocation');
        fromInput?.focus();
    }
    
    // Escape to close any open dropdowns or clear focus
    if (e.key === 'Escape') {
        document.activeElement?.blur();
    }
});

// ===============================================
// EXPORT FOR MODULE USE (if needed)
// ===============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSearchTabs,
        initSwapButton,
        initFormInputs,
        initFormSubmission,
        setDefaultDates
    };
}
