document.addEventListener('DOMContentLoaded', function () {

    // --- SHARED HEADER/FOOTER LOGIC (from index.js) ---
    function handleManageMenuVisibility() {
        const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
        const hasBooked = localStorage.getItem('hasBookedTicket') === 'true';
        const manageMenuDesktop = document.getElementById('manage-menu-desktop');
        const manageMenuMobile = document.getElementById('manage-menu-mobile');
        if (isSignedIn && hasBooked) {
            if (manageMenuDesktop) manageMenuDesktop.classList.remove('manage-menu-hidden');
            if (manageMenuMobile) manageMenuMobile.classList.remove('manage-menu-hidden');
        }
    }

    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.header-desktop-nav a, .header-mobile-nav a');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('nav-active');
                const dropdownParent = link.closest('.header-dropdown');
                if (dropdownParent) {
                    dropdownParent.querySelector(':scope > a')?.classList.add('nav-active');
                }
            }
        });
    }

    function initializeHeader() {
        const header = document.getElementById('header-main');
        if (header) {
            window.addEventListener('scroll', () => {
                header.classList.toggle('header-scrolled', window.scrollY > 50);
            });
        }
        const menuToggle = document.getElementById('header-menuToggle');
        const nav = document.getElementById('header-mobile-nav');
        const overlay = document.getElementById('header-mobileNavOverlay');
        if (menuToggle && nav && overlay) {
            const toggleMenu = () => {
                nav.classList.toggle('header-active');
                overlay.classList.toggle('header-active');
                document.body.style.overflow = nav.classList.contains('header-active') ? 'hidden' : '';
            };
            menuToggle.addEventListener('click', toggleMenu);
            overlay.addEventListener('click', toggleMenu);
        }
        document.querySelectorAll('.header-mobile-nav .header-dropdown > a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                link.parentElement.classList.toggle('header-open');
            });
        });
    }

    function initializeFooter() {
        const footer = document.getElementById('destinova-footer');
        if (footer) {
            const footerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        footer.classList.add('in-view');
                        footerObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            footerObserver.observe(footer);
        }
    }

    // Initialize shared components
    handleManageMenuVisibility();
    setActiveNavLink();
    initializeHeader();
    initializeFooter();
    AOS.init();

    // --- CONTACT US PAGE SPECIFIC LOGIC ---

    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('success-msg');

    // --- Form Validation ---
    function validateField(field) {
        const errorDiv = document.getElementById(`${field.id}-error`);
        let isValid = true;
        let errorMessage = '';

        field.classList.remove('error');

        if (field.required && field.value.trim() === '') {
            isValid = false;
            errorMessage = 'This field is required.';
        } else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        } else if (field.id === 'phone' && field.value && !/^\d{10}$/.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid 10-digit phone number.';
        } else if (field.id === 'message' && (field.value.length < 10 || field.value.length > 500)) {
            isValid = false;
            errorMessage = 'Message must be between 10 and 500 characters.';
        } else if (field.type === 'checkbox' && !field.checked) {
            isValid = false;
            errorMessage = 'You must agree to the privacy policy.';
        }

        if (!isValid) {
            field.classList.add('error');
            errorDiv.textContent = errorMessage;
        } else {
            errorDiv.textContent = '';
        }
        return isValid;
    }

    function validateForm() {
        let isFormValid = true;
        const fields = contactForm.querySelectorAll('[required]');
        fields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    // --- Form Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateForm()) {
                const submitBtn = document.getElementById('submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                // Mock API call
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    successMsg.style.display = 'flex';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message';

                    // Reset form after a delay
                    setTimeout(() => {
                        contactForm.reset();
                        contactForm.style.display = 'block';
                        successMsg.style.display = 'none';
                        document.getElementById('char-counter').textContent = '0/500';
                    }, 4000);

                }, 1500);
            }
        });

        // Real-time validation on blur
        contactForm.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
        });
    }

    // --- Character Counter for Textarea ---
    const messageTextarea = document.getElementById('message');
    const charCounter = document.getElementById('char-counter');
    if (messageTextarea && charCounter) {
        messageTextarea.addEventListener('input', () => {
            const count = messageTextarea.value.length;
            charCounter.textContent = `${count}/500`;
            charCounter.style.color = count > 500 ? 'var(--error-red)' : 'var(--text-slate)';
        });
    }

    // --- Click to Copy/Call ---
    function showTooltip(element, text) {
        const originalText = element.querySelector('span:last-child').textContent;
        element.querySelector('span:last-child').textContent = text;
        setTimeout(() => {
            element.querySelector('span:last-child').textContent = originalText;
        }, 2000);
    }

    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('support@destinova.com');
            showTooltip(copyEmailBtn, 'Copied!');
        });
    }

    const copyPhoneBtn = document.getElementById('copy-phone-btn');
    if (copyPhoneBtn) {
        copyPhoneBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('+911234567890');
            showTooltip(copyPhoneBtn, 'Copied!');
        });
    }

    // --- Open Google Maps ---
    const openMapBtn = document.getElementById('open-map-btn');
    if (openMapBtn) {
        openMapBtn.addEventListener('click', () => {
            // Replace with actual coordinates or address
            const mapUrl = 'https://www.google.com/maps/search/?api=1&query=Aero+City,New+Delhi';
            window.open(mapUrl, '_blank');
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const answer = item.querySelector('.faq-answer');
                const icon = question.querySelector('i');

                // Close other active items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = null;
                        otherItem.querySelector('.faq-answer p').style.paddingTop = '0px';
                        otherItem.querySelector('.faq-question i').classList.replace('fa-minus', 'fa-plus');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                    answer.querySelector('p').style.paddingTop = '0px'; // Adjust if needed
                    icon.classList.replace('fa-plus', 'fa-minus');
                } else {
                    answer.style.maxHeight = null;
                    icon.classList.replace('fa-minus', 'fa-plus');
                }
            });
        });
    }

    // --- Smooth Scroll to Form ---
    if (window.location.hash === '#contact-form') {
        document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
    }
});