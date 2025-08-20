document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize page content that doesn't depend on header/footer
    initializePageContent();

    // Set up a system to wait for both header and footer to load
    let headerReady = false;
    let footerReady = false;

    function checkComponentsReady() {
        // This function now only initializes the animation library
        if (headerReady && footerReady) {
            AOS.init({
                duration: 800,
                once: true,
                offset: 150,
                easing: 'ease-out-quad'
            });
        }
    }

    window.addEventListener('headerLoaded', () => {
        headerReady = true;
        checkComponentsReady();
    });

    window.addEventListener('footerLoaded', () => {
        footerReady = true;
        checkComponentsReady();
    });
});

function initializePageContent() {
    // --- Passenger selector functionality ---
    const passengersInput = document.getElementById('passengers');
    const passengerDropdown = document.querySelector('.passenger-dropdown');
    
    if (passengersInput && passengerDropdown) {
        const adultCountEl = document.getElementById('adult-count');
        const childCountEl = document.getElementById('child-count');
        
        let adults = 1;
        let children = 0;
        
        passengersInput.addEventListener('click', function(event) {
            event.stopPropagation();
            passengerDropdown.style.display = passengerDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.passenger-selector')) {
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
        
        document.querySelector('.increase-adult').addEventListener('click', function() {
            if (adults < 9) adults++;
            updatePassengerDisplay();
        });
        
        document.querySelector('.decrease-adult').addEventListener('click', function() {
            if (adults > 1) adults--;
            updatePassengerDisplay();
        });
        
        document.querySelector('.increase-child').addEventListener('click', function() {
            if (children < 6) children++;
            updatePassengerDisplay();
        });
        
        document.querySelector('.decrease-child').addEventListener('click', function() {
            if (children > 0) children--;
            updatePassengerDisplay();
        });
        
        updatePassengerDisplay();
    }

    // --- Flight Class Sliders ---
    function initializeSlider(sliderId) {
        const wrapper = document.getElementById(sliderId);
        if (!wrapper) return;

        const slider = wrapper.querySelector('.class-slider');
        const slides = wrapper.querySelectorAll('.class-slide');
        const prevBtn = wrapper.querySelector('.prev');
        const nextBtn = wrapper.querySelector('.next');
        const dotsContainer = wrapper.querySelector('.slider-dots');
        let currentIndex = 0;
        let autoPlayInterval;

        if (slides.length === 0) return;

        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
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

    initializeSlider('slider-economy');
    initializeSlider('slider-premium');
    initializeSlider('slider-business');
    initializeSlider('slider-first');
}