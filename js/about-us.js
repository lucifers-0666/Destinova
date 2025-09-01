document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Scroll-Triggered Animations ---
    // This is a more performant way to handle animations on scroll
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animation to save resources
                // scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Observe all elements with the class 'animate-on-scroll'
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => scrollObserver.observe(el));


    // --- Testimonial Carousel ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        // Hide all slides and deactivate all dots
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
            slide.style.transform = `translateX(-${index * 100}%)`;
        });

        // Show the correct slide and activate its dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            // Reset auto-scroll timer on manual navigation
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });

    // Auto-scroll functionality
    const startCarousel = () => {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    };

    // Initialize the carousel
    if (slides.length > 0) {
        // A simple hack to reset slider position for the CSS transition to work
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${i * 100}%)`;
        });
        const sliderContainer = document.querySelector('.testimonial-slider');
        sliderContainer.style.display = 'flex';
        slides.forEach((slide, i) => {
            slide.style.position = 'relative'; // Change from absolute
            slide.style.top = '0';
            slide.style.opacity = '1'; // Make all visible but moved by transform
        });
        
        const goToSlide = (slideIndex) => {
             sliderContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
             dots.forEach(dot => dot.classList.remove('active'));
             dots[slideIndex].classList.add('active');
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                goToSlide(index);
                clearInterval(slideInterval);
                slideInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    goToSlide(currentSlide);
                }, 5000);
            });
        });
        
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(currentSlide);
        }, 5000);

        goToSlide(0); // Start at the first slide
    }
});