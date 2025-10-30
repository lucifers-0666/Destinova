// Counter animation for stats
function animateCounter(id, target, duration, decimals = 0) {
    const element = document.getElementById(id);
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (decimals > 0) {
            element.textContent = current.toFixed(decimals);
        } else if (target >= 1000000) {
            element.textContent = (current / 1000000).toFixed(1) + 'M+';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Start counter animations on load
window.addEventListener('load', () => {
    setTimeout(() => {
        animateCounter('tripsCount', 2500000, 2000);
        animateCounter('countriesCount', 195, 1500);
        animateCounter('ratingCount', 4.9, 1500, 1);
    }, 300);
});
// Page Transition Function
function navigateWithTransition(url) {
    const transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'page-transition active';
    transitionOverlay.innerHTML = `
        <div class="page-transition-content">
            <div class="transition-spinner"></div>
            <div class="transition-text">Loading...</div>
        </div>
    `;
    document.body.appendChild(transitionOverlay);
    
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Add transition to navigation links
document.addEventListener('DOMContentLoaded', function() {
    const transitionLinks = document.querySelectorAll('a[href$=".html"]');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
                e.preventDefault();
                navigateWithTransition(href);
            }
        });
    });
    
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Email validation
const emailInput = document.getElementById('email');
const emailSuccess = document.getElementById('emailSuccess');
const emailErrorIcon = document.getElementById('emailErrorIcon');
const emailError = document.getElementById('emailError');

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

let emailValidationTimeout;
emailInput.addEventListener('input', function() {
    clearTimeout(emailValidationTimeout);
    
    // Remove error state while typing
    if (this.classList.contains('error')) {
        this.classList.remove('error');
        emailErrorIcon.style.display = 'none';
        emailError.classList.remove('active');
    }
    
    // Debounce validation
    emailValidationTimeout = setTimeout(() => {
        const email = this.value.trim();
        if (email) {
            if (validateEmail(email)) {
                this.classList.remove('error');
                emailSuccess.style.display = 'flex';
                emailErrorIcon.style.display = 'none';
                emailError.classList.remove('active');
            }
        }
    }, 300);
});

emailInput.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email) {
        if (validateEmail(email)) {
            this.classList.remove('error');
            emailSuccess.style.display = 'flex';
            emailErrorIcon.style.display = 'none';
            emailError.classList.remove('active');
        } else {
            this.classList.add('error');
            emailSuccess.style.display = 'none';
            emailErrorIcon.style.display = 'flex';
            emailError.classList.add('active');
        }
    }
});

// Password toggle
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('passwordToggle');
const toggleIcon = document.getElementById('toggleIcon');

function togglePassword() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
        passwordToggle.classList.add('toggled');
        passwordToggle.setAttribute('aria-label', 'Hide password');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
        passwordToggle.classList.remove('toggled');
        passwordToggle.setAttribute('aria-label', 'Show password');
    }
}

// Password strength indicator (3 segments)
const passwordStrength = document.getElementById('passwordStrength');
const strengthLabel = document.getElementById('strengthLabel');
const segment1 = document.getElementById('segment1');
const segment2 = document.getElementById('segment2');
const segment3 = document.getElementById('segment3');
const passwordError = document.getElementById('passwordError');

passwordInput.addEventListener('input', function() {
    const password = this.value;
    
    if (password.length === 0) {
        passwordStrength.classList.remove('active');
        passwordError.classList.remove('active');
        return;
    }
    
    passwordStrength.classList.add('active');
    passwordError.classList.remove('active');
    
    // Clear previous state
    segment1.classList.remove('filled', 'weak', 'medium', 'strong');
    segment2.classList.remove('filled', 'weak', 'medium', 'strong');
    segment3.classList.remove('filled', 'weak', 'medium', 'strong');
    strengthLabel.classList.remove('weak', 'medium', 'strong');
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    if (password.length <= 5 || strength <= 1) {
        // Weak - fill 1 segment red
        segment1.classList.add('filled', 'weak');
        strengthLabel.textContent = 'Weak';
        strengthLabel.classList.add('weak');
    } else if (password.length <= 8 || strength <= 2) {
        // Medium - fill 2 segments yellow
        segment1.classList.add('filled', 'medium');
        segment2.classList.add('filled', 'medium');
        strengthLabel.textContent = 'Medium';
        strengthLabel.classList.add('medium');
    } else {
        // Strong - fill all 3 segments green
        segment1.classList.add('filled', 'strong');
        segment2.classList.add('filled', 'strong');
        segment3.classList.add('filled', 'strong');
        strengthLabel.textContent = 'Strong';
        strengthLabel.classList.add('strong');
    }
});

// Error alert close
function closeErrorAlert() {
    document.getElementById('errorAlert').classList.remove('active');
}

// Form submission
const form = document.getElementById('signinForm');
const signinBtn = document.getElementById('signinBtn');
const errorAlert = document.getElementById('errorAlert');
const successOverlay = document.getElementById('successOverlay');

let failedAttempts = 0;
const maxAttempts = 3;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Clear previous errors
    errorAlert.classList.remove('active');
    
    // Validate
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    let isValid = true;
    
    if (!validateEmail(email)) {
        emailInput.classList.add('error');
        emailSuccess.style.display = 'none';
        emailErrorIcon.style.display = 'flex';
        emailError.classList.add('active');
        isValid = false;
    }
    
    if (!password || password.length < 8) {
        passwordInput.classList.add('error');
        passwordError.classList.add('active');
        isValid = false;
    }
    
    if (!isValid) {
        // Shake button
        signinBtn.style.animation = 'shake 500ms';
        setTimeout(() => {
            signinBtn.style.animation = '';
        }, 500);
        return;
    }
    
    // Check rate limiting
    if (failedAttempts >= maxAttempts) {
        document.getElementById('errorAlertText').textContent = 'Too many attempts. Please try again in 5 minutes.';
        errorAlert.classList.add('active');
        return;
    }
    
    // Show loading
    signinBtn.classList.add('loading');
    signinBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate for demo
        
        if (success) {
            // Show success checkmark
            signinBtn.classList.remove('loading');
            signinBtn.classList.add('success');
            
            // Show success overlay
            setTimeout(() => {
                successOverlay.classList.add('active');
                
                setTimeout(() => {
                    successOverlay.classList.remove('active');
                    alert('Success! Redirecting to dashboard...');
                    signinBtn.classList.remove('success');
                    signinBtn.disabled = false;
                }, 800);
            }, 500);
        } else {
            // Show error
            signinBtn.classList.remove('loading');
            signinBtn.disabled = false;
            
            failedAttempts++;
            errorAlert.classList.add('active');
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                errorAlert.classList.remove('active');
            }, 5000);
        }
    }, 2000);
});

// Parallax effect
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.01;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.01;
});

function animateParallax() {
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;
    
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        heroBg.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.1)`;
    }

    requestAnimationFrame(animateParallax);
}

animateParallax();
