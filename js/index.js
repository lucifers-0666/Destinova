document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Initialize AOS for scroll animations
    AOS.init({
        duration: 800,      // Animation duration in ms
        once: true,         // Whether animation should happen only once
        offset: 100,        // Offset (in px) from the original trigger point
        easing: 'ease-out-quad'
    });

    // 2. Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
        
        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 4. Passenger selector functionality
    const passengerSelector = document.querySelector('.passenger-selector');
    if(passengerSelector) {
        const passengersInput = document.getElementById('passengers');
        const adultCountEl = document.getElementById('adult-count');
        const childCountEl = document.getElementById('child-count');
        
        let adults = 1;
        let children = 0;

        function updatePassengerDisplay() {
            passengersInput.value = `${adults} Adult${adults > 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`;
            adultCountEl.textContent = adults;
            childCountEl.textContent = children;
        }

        passengersInput.addEventListener('click', (e) => {
            e.stopPropagation();
            passengerSelector.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!passengerSelector.contains(e.target)) {
                passengerSelector.classList.remove('active');
            }
        });

        // Event delegation for controls
        passengerSelector.addEventListener('click', (e) => {
            const target = e.target;
            if(target.matches('.increase-adult') && adults < 9) adults++;
            if(target.matches('.decrease-adult') && adults > 1) adults--;
            if(target.matches('.increase-child') && children < 6) children++;
            if(target.matches('.decrease-child') && children > 0) children--;
            updatePassengerDisplay();
        });
        
        updatePassengerDisplay();
    }
    
    // 5. Automatic Image Slider for Flight Classes
    function createAutoSlider(sliderId, dotsId, images, interval = 5000) {
        const slider = document.getElementById(sliderId);
        const dotsContainer = document.getElementById(dotsId);
        if (!slider || !dotsContainer) return;

        let currentIndex = 0;

        // Create slider dots
        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        });
        
        const dots = dotsContainer.querySelectorAll('.slider-dot');

        function updateSlider() {
            slider.style.backgroundImage = `url('${images[currentIndex]}')`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % images.length;
            updateSlider();
        }

        // Initial load
        updateSlider();

        // Auto-play
        setInterval(nextSlide, interval);
    }

    // Image assets for sliders
    const businessClassImages = [
        'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1621323931442-7df7680879a6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578781429972-6f29a19c0615?auto=format&fit=crop&w=800&q=80'
    ];

    const economyClassImages = [
        'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544634262-c38a4d444737?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1610415349377-a8a520a7b454?auto=format&fit=crop&w=800&q=80'
    ];
    
    // Initialize sliders
    createAutoSlider('business-class-slider', 'business-class-dots', businessClassImages);
    createAutoSlider('economy-class-slider', 'economy-class-dots', economyClassImages);

});