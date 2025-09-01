document.addEventListener('DOMContentLoaded', function() {

    // =============================================
    // SMOOTH SCROLL FOR "START EXPLORING" BUTTON
    // =============================================
    const startExploringBtn = document.getElementById('start-exploring-btn');
    if (startExploringBtn) {
        startExploringBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // =============================================
    // REUSABLE SLIDER FUNCTIONALITY
    // =============================================
    function initializeSlider(sliderId) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const track = slider.querySelector('.slider-track');
        const slides = Array.from(track.children);
        const nextButton = slider.querySelector('.next');
        const prevButton = slider.querySelector('.prev');

        if (slides.length === 0) return;

        // Clone slides for infinite loop effect
        const visibleSlides = 1; // Change this based on how many are visible at once
        for (let i = 0; i < visibleSlides; i++) {
            track.appendChild(slides[i].cloneNode(true));
        }
        for (let i = slides.length - 1; i >= slides.length - visibleSlides; i--) {
            track.insertBefore(slides[i].cloneNode(true), slides[0]);
        }
        
        const allSlides = Array.from(track.children);
        const slideWidth = slides[0].getBoundingClientRect().width + parseInt(getComputedStyle(slides[0]).marginRight) * 2;
        let currentIndex = visibleSlides;

        // Initial position
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

        const moveToSlide = (index) => {
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(-${index * slideWidth}px)`;
            currentIndex = index;
        };
        
        nextButton.addEventListener('click', () => {
            if (currentIndex >= allSlides.length - visibleSlides) return;
            moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex <= 0) return;
            moveToSlide(currentIndex - 1);
        });

        track.addEventListener('transitionend', () => {
            if (currentIndex === 0) {
                track.style.transition = 'none';
                moveToSlide(slides.length);
            }
            if (currentIndex === allSlides.length - visibleSlides) {
                track.style.transition = 'none';
                moveToSlide(visibleSlides);
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const newSlideWidth = slides[0].getBoundingClientRect().width + parseInt(getComputedStyle(slides[0]).marginRight) * 2;
            track.style.transition = 'none';
            track.style.transform = `translateX(-${currentIndex * newSlideWidth}px)`;
        });
    }

    // Initialize all sliders on the page
    initializeSlider('offers-slider');
    initializeSlider('testimonials-slider');


    // =============================================
    // SCROLL-TRIGGERED FADE/SLIDE-IN ANIMATIONS
    // =============================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get delay from data attribute
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);

                // Stop observing the element once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

});