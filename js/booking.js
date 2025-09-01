document.addEventListener('DOMContentLoaded', function () {

    // Initialize AOS Library for animations
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    // --- SMART DATE PICKER LOGIC ---
    function setupDatePickers() {
        const departureInput = document.getElementById('departure');
        const returnInput = document.getElementById('return');

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const minDate = `${year}-${month}-${day}`;
        
        departureInput.setAttribute('min', minDate);
        returnInput.setAttribute('min', minDate);

        departureInput.addEventListener('change', () => {
            const departureDate = departureInput.value;
            if (departureDate) {
                returnInput.setAttribute('min', departureDate);
                if (returnInput.value && returnInput.value < departureDate) {
                    returnInput.value = '';
                }
            }
        });
    }
    setupDatePickers();

    // --- FLIGHT SEARCH FORM FUNCTIONALITY ---
    const travelClassBtns = document.querySelectorAll('.travel-class-btn');
    if (travelClassBtns.length > 0) {
        travelClassBtns.forEach(button => {
            button.addEventListener('click', () => {
                travelClassBtns.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    const passengersInput = document.getElementById('passengers');
    const passengerDropdown = document.querySelector('.home-passenger-dropdown');
    if (passengersInput && passengerDropdown) {
        const adultCountEl = document.getElementById('adult-count');
        const childCountEl = document.getElementById('child-count');
        let adults = 1;
        let children = 0;

        passengersInput.addEventListener('click', function (event) {
            event.stopPropagation();
            passengerDropdown.style.display = passengerDropdown.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.home-passenger-selector')) {
                passengerDropdown.style.display = 'none';
            }
        });

        function updatePassengerDisplay() {
            let text = `${adults} Adult${adults !== 1 ? 's' : ''}`;
            if (children > 0) {
                text += `, ${children} Child${children !== 1 ? 'ren' : ''}`;
            }
            passengersInput.value = text;
            adultCountEl.textContent = adults;
            childCountEl.textContent = children;
        }

        document.querySelector('.increase-adult').addEventListener('click', () => { if (adults < 9) adults++; updatePassengerDisplay(); });
        document.querySelector('.decrease-adult').addEventListener('click', () => { if (adults > 1) adults--; updatePassengerDisplay(); });
        document.querySelector('.increase-child').addEventListener('click', () => { if (children < 6) children++; updatePassengerDisplay(); });
        document.querySelector('.decrease-child').addEventListener('click', () => { if (children > 0) children--; updatePassengerDisplay(); });

        updatePassengerDisplay();
    }
    
    // --- HEADER FUNCTIONALITY ---
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

        document.querySelectorAll('.header-mobile-nav a').forEach(link => {
            if (!link.parentElement.classList.contains('header-dropdown')) {
                link.addEventListener('click', toggleMenu);
            }
        });
    }

    document.querySelectorAll('.header-mobile-nav .header-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            link.parentElement.classList.toggle('header-open');
        });
    });

    // --- FOOTER FUNCTIONALITY ---
    function initializeFooterScripts() {
        const footer = document.getElementById('destinova-footer');
        if (footer) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        footer.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(footer);
        }

        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function (e) {
                e.preventDefault();
                this.classList.add('submitted');
                setTimeout(() => { this.classList.remove('submitted'); this.reset(); }, 1000);
            });
        }

        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });
            scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    }
    initializeFooterScripts();
});