document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.form-step');
    let currentStep = 1;
    let timerInterval;

    const emailForm = document.getElementById('email-form');
    const otpForm = document.getElementById('otp-form');
    const passwordForm = document.getElementById('password-form');

    const emailInput = document.getElementById('reset-email');
    const otpInputs = document.querySelectorAll('.otp-input');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    const resendBtn = document.getElementById('resend-btn');
    const resendTimer = document.getElementById('resend-timer');

    const strengthBar = document.getElementById('strength-bar');
    const requirementsList = document.getElementById('password-requirements');

    function showStep(stepNumber) {
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step-${stepNumber}`)?.classList.add('active');
        currentStep = stepNumber;
    }

    // --- Step 1: Email Submission ---
    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateEmail(emailInput.value)) {
                const submitBtn = emailForm.querySelector('.btn-send');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                // API Call Simulation
                setTimeout(() => {
                    document.getElementById('user-email-display').textContent = emailInput.value;
                    showStep(2);
                    startResendTimer();
                    otpInputs[0].focus();
                }, 1500);
            }
        });
    }

    function validateEmail(email) {
        const isValid = /^\S+@\S+\.\S+$/.test(email);
        if (!isValid) {
            alert('Please enter a valid email address.');
        }
        return isValid;
    }

    // --- Step 2: OTP Verification ---
    if (otpForm) {
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                // Move to next input
                if (e.target.value && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
                input.classList.toggle('filled', e.target.value);
            });

            input.addEventListener('keydown', (e) => {
                // Move to previous input on backspace
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });

        otpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let otp = '';
            otpInputs.forEach(input => otp += input.value);

            if (otp.length !== 6) {
                document.getElementById('otp-error').textContent = 'Please enter all 6 digits.';
                return;
            }

            // API Call Simulation
            const submitBtn = otpForm.querySelector('.btn-send');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Mock OTP '123456'
                if (otp === '123456') {
                    clearInterval(timerInterval);
                    showStep(3);
                    newPasswordInput.focus();
                } else {
                    document.getElementById('otp-error').textContent = 'Invalid code. Please try again.';
                    document.querySelector('.otp-inputs').classList.add('error');
                    setTimeout(() => document.querySelector('.otp-inputs').classList.remove('error'), 500);
                    submitBtn.innerHTML = 'Verify Code';
                    submitBtn.disabled = false;
                }
            }, 1500);
        });
    }

    // --- Resend Timer ---
    function startResendTimer() {
        let timeLeft = 59;
        resendBtn.disabled = true;
        resendTimer.style.display = 'inline';

        timerInterval = setInterval(() => {
            resendTimer.textContent = `Resend code in ${timeLeft}s`;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(timerInterval);
                resendTimer.style.display = 'none';
                resendBtn.disabled = false;
            }
        }, 1000);
    }

    if (resendBtn) {
        resendBtn.addEventListener('click', () => {
            // API Call Simulation to resend code
            alert('A new verification code has been sent. (Demo)');
            otpInputs.forEach(input => input.value = '');
            otpInputs[0].focus();
            startResendTimer();
        });
    }

    // --- Step 3: Password Reset ---
    if (passwordForm) {
        newPasswordInput.addEventListener('input', () => {
            checkPasswordStrength(newPasswordInput.value);
            validatePasswordMatch();
        });

        confirmPasswordInput.addEventListener('input', validatePasswordMatch);

        passwordForm.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const input = e.target.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                e.target.classList.toggle('fa-eye');
                e.target.classList.toggle('fa-eye-slash');
            });
        });

        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validatePasswordMatch() && strengthBar.classList.contains('strong')) {
                const submitBtn = passwordForm.querySelector('.btn-send');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
                submitBtn.disabled = true;

                // API Call Simulation
                setTimeout(() => {
                    showStep(4);
                    // Redirect after success animation
                    setTimeout(() => {
                        window.location.href = 'signin.html';
                    }, 4000);
                }, 1500);
            } else {
                alert('Please ensure your password is strong and that both passwords match.');
            }
        });
    }

    function checkPasswordStrength(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };

        let strength = 0;
        for (const req in requirements) {
            const reqItem = requirementsList.querySelector(`[data-req="${req}"]`);
            const icon = reqItem.querySelector('i');
            if (requirements[req]) {
                strength++;
                reqItem.classList.add('complete');
                icon.classList.replace('fa-times', 'fa-check');
            } else {
                reqItem.classList.remove('complete');
                icon.classList.replace('fa-check', 'fa-times');
            }
        }

        strengthBar.className = 'strength-bar';
        if (strength <= 2) {
            strengthBar.classList.add('weak');
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
    }

    function validatePasswordMatch() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const errorDiv = document.getElementById('password-match-error');
        const submitBtn = passwordForm.querySelector('.btn-send');

        if (confirmPassword && password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match.';
            submitBtn.disabled = true;
            return false;
        } else {
            errorDiv.textContent = '';
            // Only enable if the new password has some value
            if (password && confirmPassword) {
                submitBtn.disabled = false;
            }
            return true;
        }
    }

    // --- Initial Setup ---
    function init() {
        // For demo purposes, allow navigating steps via hash
        const hash = window.location.hash;
        if (hash === '#step2') {
            showStep(2);
            startResendTimer();
        } else if (hash === '#step3') {
            showStep(3);
        } else if (hash === '#step4') {
            showStep(4);
        } else {
            showStep(1);
            emailInput.focus();
        }
    }

    init();
});