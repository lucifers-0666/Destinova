document.addEventListener('DOMContentLoaded', function () {
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

        // Close menu when a link is clicked
        document.querySelectorAll('.header-mobile-nav a').forEach(link => {
            if (!link.parentElement.classList.contains('header-dropdown')) {
                link.addEventListener('click', toggleMenu);
            }
        });
    }

    // Handle mobile dropdowns
    document.querySelectorAll('.header-mobile-nav .header-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = link.parentElement;
            parent.classList.toggle('header-open');
        });
    });
    // Passenger selector functionality
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

        document.querySelector('.increase-adult').addEventListener('click', function () {
            if (adults < 9) adults++;
            updatePassengerDisplay();
        });

        document.querySelector('.decrease-adult').addEventListener('click', function () {
            if (adults > 1) adults--;
            updatePassengerDisplay();
        });

        document.querySelector('.increase-child').addEventListener('click', function () {
            if (children < 6) children++;
            updatePassengerDisplay();
        });

        document.querySelector('.decrease-child').addEventListener('click', function () {
            if (children > 0) children--;
            updatePassengerDisplay();
        });

        updatePassengerDisplay();
    }
    // --- FOOTER FUNCTIONALITY ---
    function initializeFooterScripts() {
        // Intersection Observer for footer scroll animations
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

        // Newsletter form submission animation
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function (e) {
                e.preventDefault();
                this.classList.add('submitted');
                console.log('Newsletter subscription submitted!');

                // Reset animation and form after it finishes
                setTimeout(() => {
                    this.classList.remove('submitted');
                    this.reset();
                }, 1000);
            });
        }

        // Scroll-to-Top button functionality
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            // Show or hide the button based on scroll position
            window.addEventListener('scroll', function () {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });

            // Smooth scroll to top on click
            scrollToTopBtn.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Initialize footer scripts
    initializeFooterScripts();
});
