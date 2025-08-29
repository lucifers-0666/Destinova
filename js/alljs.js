document.addEventListener('DOMContentLoaded', function () {

    // --- MERGED HEADER SCRIPT ---
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

    // --- ORIGINAL INDEX.JS SCRIPT ---
    // --- Passenger selector functionality ---
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

    // --- Flight Class Sliders ---
    function initializeSlider(sliderId) {
        const wrapper = document.getElementById(sliderId);
        if (!wrapper) return;

        const slider = wrapper.querySelector('.home-class-slider');
        const slides = wrapper.querySelectorAll('.home-class-slide');
        const prevBtn = wrapper.querySelector('.home-prev');
        const nextBtn = wrapper.querySelector('.home-next');
        const dotsContainer = wrapper.querySelector('.home-slider-dots');
        let currentIndex = 0;
        let autoPlayInterval;

        if (slides.length === 0) return;

        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('home-dot');
            if (i === 0) dot.classList.add('home-active');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.home-dot');

        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('home-active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = (index + slides.length) % slides.length;
            updateSlider();
        }

        function nextSlide() { goToSlide(currentIndex + 1); }
        function prevSlide() { goToSlide(currentIndex - 1); }
        function startAutoPlay() { autoPlayInterval = setInterval(nextSlide, 5000); }
        function resetAutoPlay() { clearInterval(autoPlayInterval); startAutoPlay(); }

        prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
        nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });

        startAutoPlay();
    }

    initializeSlider('home-slider-economy');
    initializeSlider('home-slider-premium');
    initializeSlider('home-slider-business');
    initializeSlider('home-slider-first');

    // --- INITIALIZE AOS ANIMATION LIBRARY ---
    AOS.init({
        duration: 800,
        once: true,
        offset: 150,
        easing: 'ease-out-quad'
    });

    // --- FOOTER SCRIPTS ---
    /**
     * Initializes all JavaScript functionality for the footer elements.
     */
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
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                this.classList.add('submitted');
                console.log('Newsletter subscription submitted!');
                
                setTimeout(() => {
                    this.classList.remove('submitted');
                    this.reset();
                }, 1000);
            });
        }

        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });

            scrollToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // --- Dynamically load the footer HTML ---
    fetch('../html/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch footer HTML.');
            }
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
                initializeFooterScripts(); // Initialize scripts after loading HTML
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
});
