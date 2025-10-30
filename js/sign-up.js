// Form Validation Functions
function validateEmail(email) {
    return /^[\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^\d{10}$/.test(phone.replace(/\s/g, ''));
}

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// ============================================
// FIRST NAME VALIDATION
// ============================================
const firstName = document.getElementById('firstName');
const firstNameSuccess = document.getElementById('firstNameSuccess');
const firstNameError = document.getElementById('firstNameError');

firstName.addEventListener('blur', function() {
    if (this.value.trim().length >= 2) {
        firstNameSuccess.style.display = 'flex';
        firstNameError.classList.remove('active');
        this.classList.remove('error');
    } else if (this.value.trim()) {
        this.classList.add('error');
        firstNameError.classList.add('active');
        firstNameSuccess.style.display = 'none';
    }
});

// ============================================
// LAST NAME VALIDATION
// ============================================
const lastName = document.getElementById('lastName');
const lastNameSuccess = document.getElementById('lastNameSuccess');
const lastNameError = document.getElementById('lastNameError');

lastName.addEventListener('blur', function() {
    if (this.value.trim().length >= 2) {
        lastNameSuccess.style.display = 'flex';
        lastNameError.classList.remove('active');
        this.classList.remove('error');
    } else if (this.value.trim()) {
        this.classList.add('error');
        lastNameError.classList.add('active');
        lastNameSuccess.style.display = 'none';
    }
});

// ============================================
// EMAIL VALIDATION
// ============================================
const emailInput = document.getElementById('email');
const emailSuccess = document.getElementById('emailSuccess');
const emailErrorIcon = document.getElementById('emailErrorIcon');
const emailError = document.getElementById('emailError');

emailInput.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && validateEmail(email)) {
        emailSuccess.style.display = 'flex';
        emailErrorIcon.style.display = 'none';
        emailError.classList.remove('active');
        this.classList.remove('error');
    } else if (email) {
        this.classList.add('error');
        emailSuccess.style.display = 'none';
        emailErrorIcon.style.display = 'flex';
        emailError.classList.add('active');
    }
});

// ============================================
// PASSWORD TOGGLE
// ============================================
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// ============================================
// PASSWORD STRENGTH INDICATOR
// ============================================
const passwordInput = document.getElementById('password');
const passwordStrength = document.getElementById('passwordStrength');
const strengthLabel = document.getElementById('strengthLabel');
const segment1 = document.getElementById('segment1');
const segment2 = document.getElementById('segment2');
const segment3 = document.getElementById('segment3');

passwordInput.addEventListener('input', function() {
    const password = this.value;
    
    if (password.length === 0) {
        passwordStrength.classList.remove('active');
        return;
    }
    
    passwordStrength.classList.add('active');
    
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
        segment1.classList.add('filled', 'weak');
        strengthLabel.textContent = 'Weak';
        strengthLabel.classList.add('weak');
    } else if (password.length <= 8 || strength <= 2) {
        segment1.classList.add('filled', 'medium');
        segment2.classList.add('filled', 'medium');
        strengthLabel.textContent = 'Medium';
        strengthLabel.classList.add('medium');
    } else {
        segment1.classList.add('filled', 'strong');
        segment2.classList.add('filled', 'strong');
        segment3.classList.add('filled', 'strong');
        strengthLabel.textContent = 'Strong';
        strengthLabel.classList.add('strong');
    }
});

// ============================================
// PHONE VALIDATION
// ============================================
const phone = document.getElementById('phone');
const phoneSuccess = document.getElementById('phoneSuccess');
const phoneError = document.getElementById('phoneError');

phone.addEventListener('blur', function() {
    if (validatePhone(this.value)) {
        phoneSuccess.style.display = 'flex';
        phoneError.classList.remove('active');
        this.classList.remove('error');
    } else if (this.value.trim()) {
        this.classList.add('error');
        phoneError.classList.add('active');
        phoneSuccess.style.display = 'none';
    }
});

// ============================================
// DATE OF BIRTH VALIDATION
// ============================================
const dob = document.getElementById('dob');
const dobSuccess = document.getElementById('dobSuccess');
const dobError = document.getElementById('dobError');

dob.addEventListener('change', function() {
    const age = calculateAge(this.value);
    if (age >= 18) {
        dobSuccess.style.display = 'flex';
        dobError.classList.remove('active');
        this.classList.remove('error');
    } else {
        this.classList.add('error');
        dobError.classList.add('active');
        dobSuccess.style.display = 'none';
    }
});

// ============================================
// FORM SUBMISSION
// ============================================
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const signupBtn = document.getElementById('signupBtn');
    const termsCheckbox = document.getElementById('terms');
    
    let isValid = true;
    
    // Validate all fields
    if (firstName.value.trim().length < 2) {
        firstName.classList.add('error');
        firstNameError.classList.add('active');
        isValid = false;
    }
    
    if (lastName.value.trim().length < 2) {
        lastName.classList.add('error');
        lastNameError.classList.add('active');
        isValid = false;
    }
    
    if (!validateEmail(emailInput.value.trim())) {
        emailInput.classList.add('error');
        emailError.classList.add('active');
        isValid = false;
    }
    
    if (passwordInput.value.length < 8) {
        passwordInput.classList.add('error');
        document.getElementById('passwordError').classList.add('active');
        isValid = false;
    }
    
    if (!validatePhone(phone.value)) {
        phone.classList.add('error');
        phoneError.classList.add('active');
        isValid = false;
    }
    
    if (calculateAge(dob.value) < 18) {
        dob.classList.add('error');
        dobError.classList.add('active');
        isValid = false;
    }
    
    if (!document.getElementById('gender').value) {
        document.getElementById('gender').classList.add('error');
        isValid = false;
    }
    
    if (!document.getElementById('country').value) {
        document.getElementById('country').classList.add('error');
        isValid = false;
    }
    
    if (!termsCheckbox.checked) {
        alert('Please agree to the Terms of Service and Privacy Policy');
        isValid = false;
    }
    
    if (!isValid) {
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Update progress
    document.querySelectorAll('.progress-step')[1].classList.add('active');
    
    // Show loading
    signupBtn.classList.add('loading');
    signupBtn.disabled = true;
    
    setTimeout(() => {
        signupBtn.classList.remove('loading');
        signupBtn.disabled = false;
        alert('Account created successfully! Welcome to Destinova!');
    }, 2000);
});

// ============================================
// AUTO-FILL CURRENCY BASED ON COUNTRY
// ============================================
document.getElementById('country').addEventListener('change', function() {
    const currencyMap = {
        'IN': 'INR',
        'US': 'USD',
        'GB': 'GBP',
        'AE': 'AED',
        'CA': 'CAD',
        'AU': 'AUD',
        'SG': 'SGD',
        'JP': 'JPY',
        'CN': 'CNY',
        'FR': 'EUR',
        'DE': 'EUR'
    };
    
    const currency = currencyMap[this.value];
    if (currency) {
        document.getElementById('currency').value = currency;
    }
});
// In your other page's JS
fetch('terms-conditions.html')
  .then(response => response.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const bookingPolicy = doc.querySelector('#booking-policy');
    document.getElementById('booking-policy-container').appendChild(bookingPolicy.cloneNode(true));
  });