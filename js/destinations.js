// ============================================
// DESTINOVA DESTINATIONS - CLEAN & STRATEGIC JS
// Professional Interactive Features
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('%c✈️ Destinova Destinations Loaded', 'color: #E5CBAF; font-size: 18px; font-weight: bold;');
    
    // ============================================
    // MANAGE MENU VISIBILITY
    // ============================================
    function handleManageMenuVisibility() {
        const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
        const hasBooked = localStorage.getItem('hasBookedTicket') === 'true';
        const manageMenuDesktop = document.getElementById('manageMenuDesktop');
        const manageMenuMobile = document.getElementById('manageMenuMobile');
        
        if (!(isSignedIn && hasBooked)) {
            if (manageMenuDesktop) manageMenuDesktop.classList.add('manage-menu-hidden');
            if (manageMenuMobile) manageMenuMobile.classList.add('manage-menu-hidden');
        }
    }
    
    handleManageMenuVisibility();
    
    // ============================================
    // MOBILE NAVIGATION TOGGLE
    // ============================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.querySelector('.nav-mobile');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    if (mobileMenuBtn && mobileNav && mobileOverlay) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            this.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });
        
        mobileOverlay.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            this.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.header-premium-glass');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            header.style.padding = '12px 0';
        } else {
            header.style.padding = '16px 0';
        }
    });
    
    // ============================================
    // HERO SEARCH FORM EXPAND ON SCROLL
    // ============================================
    const heroSearch = document.getElementById('heroSearchForm');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 150 && heroSearch) {
            heroSearch.classList.add('expanded');
        } else if (heroSearch) {
            heroSearch.classList.remove('expanded');
        }
    });
    
    // ============================================
    // WORD REVEAL ANIMATION (Hero Headline)
    // ============================================
    const wordReveals = document.querySelectorAll('.word-reveal');
    wordReveals.forEach(word => {
        const delay = word.getAttribute('data-delay');
        word.style.animationDelay = delay + 'ms';
    });
    
    // ============================================
    // MAIN SEARCH FORM SUBMISSION
    // ============================================
    const mainSearchForm = document.getElementById('mainSearchForm');
    
    if (mainSearchForm) {
        mainSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const destination = document.getElementById('searchDestination').value;
            const departure = document.getElementById('searchDeparture').value;
            const returnDate = document.getElementById('searchReturn').value;
            const travelers = document.getElementById('searchTravelers').value;
            
            if (!destination || !departure || !returnDate) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            const searchData = {
                destination,
                departure,
                returnDate,
                travelers,
                searchDate: new Date().toISOString()
            };
            
            localStorage.setItem('flightSearchData', JSON.stringify(searchData));
            
            showToast('Searching for flights...', 'success');
            
            setTimeout(() => {
                window.location.href = 'flights.html';
            }, 1000);
        });
    }
    
    // ============================================
    // WISHLIST FUNCTIONALITY
    // ============================================
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    let wishlist = JSON.parse(localStorage.getItem('destinovaWishlist')) || [];
    
    // Initialize wishlist buttons
    wishlistButtons.forEach(btn => {
        const card = btn.closest('.destination-card-clean');
        const destinationName = card.querySelector('.destination-title').textContent;
        
        if (wishlist.includes(destinationName)) {
            btn.classList.add('active');
            btn.querySelector('i').classList.remove('far');
            btn.querySelector('i').classList.add('fas');
        }
    });
    
    wishlistButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.destination-card-clean');
            const destinationName = card.querySelector('.destination-title').textContent;
            const icon = this.querySelector('i');
            
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                icon.classList.remove('fas');
                icon.classList.add('far');
                wishlist = wishlist.filter(item => item !== destinationName);
                showToast('Removed from wishlist', 'info');
            } else {
                this.classList.add('active');
                icon.classList.remove('far');
                icon.classList.add('fas');
                wishlist.push(destinationName);
                showToast('Added to wishlist ❤️', 'success');
            }
            
            localStorage.setItem('destinovaWishlist', JSON.stringify(wishlist));
        });
    });
    
    // ============================================
    // DESTINATION CARD CLICK (Book Now)
    // ============================================
    const bookNowButtons = document.querySelectorAll('.btn-primary-gold');
    
    bookNowButtons.forEach(btn => {
        // Only attach to buttons in destination cards
        if (btn.closest('.destination-card-clean')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const card = this.closest('.destination-card-clean');
                const destinationName = card.querySelector('.destination-title').textContent;
                const destinationLocation = card.querySelector('.destination-location').textContent.trim();
                const price = card.querySelector('.amount').textContent;
                
                const destinationData = {
                    name: destinationName,
                    location: destinationLocation,
                    price: price,
                    selectedDate: new Date().toISOString()
                };
                
                localStorage.setItem('selectedDestination', JSON.stringify(destinationData));
                
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Loading...</span>';
                
                showToast('Redirecting to flights...', 'success');
                
                setTimeout(() => {
                    window.location.href = 'flights.html';
                }, 1000);
            });
        }
    });
    
    // ============================================
    // PRICE PREDICTION TOOL
    // ============================================
    const pricePredictionForm = document.getElementById('pricePredictionForm');
    const predictionResult = document.getElementById('predictionResult');
    
    if (pricePredictionForm) {
        pricePredictionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fromCity = document.getElementById('predictFrom').value;
            const toCity = document.getElementById('predictTo').value;
            const travelDate = document.getElementById('predictDate').value;
            
            if (!fromCity || !toCity || !travelDate) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading
            showToast('Analyzing price trends...', 'info');
            
            // Simulate API call
            setTimeout(() => {
                predictionResult.style.display = 'block';
                predictionResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Animate chart if Chart.js is available
                if (typeof Chart !== 'undefined') {
                    initializePriceChart();
                }
                
                showToast('Prediction ready!', 'success');
            }, 1500);
        });
    }
    
    // Swap Cities Button
    const swapBtn = document.querySelector('.btn-swap');
    if (swapBtn) {
        swapBtn.addEventListener('click', function() {
            const fromInput = document.getElementById('predictFrom');
            const toInput = document.getElementById('predictTo');
            
            const temp = fromInput.value;
            fromInput.value = toInput.value;
            toInput.value = temp;
        });
    }
    
    // ============================================
    // DESTINATION QUIZ
    // ============================================
    let quizStep = 1;
    let quizAnswers = {};
    
    const quizOptions = document.querySelectorAll('.quiz-option');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const quizResults = document.getElementById('quizResults');
    const progressFill = document.getElementById('quizProgressFill');
    const progressText = document.getElementById('quizProgressText');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const currentStep = this.closest('.quiz-step');
            const stepNumber = currentStep.getAttribute('data-step');
            const value = this.getAttribute('data-value');
            
            // Store answer
            quizAnswers[`step${stepNumber}`] = value;
            
            // Visual feedback
            currentStep.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Move to next step after delay
            setTimeout(() => {
                if (parseInt(stepNumber) < 5) {
                    // Go to next step
                    currentStep.classList.remove('active');
                    const nextStep = document.querySelector(`.quiz-step[data-step="${parseInt(stepNumber) + 1}"]`);
                    nextStep.classList.add('active');
                    
                    // Update progress
                    const progress = (parseInt(stepNumber) + 1) / 5 * 100;
                    progressFill.style.width = progress + '%';
                    progressText.textContent = `Question ${parseInt(stepNumber) + 1} of 5`;
                    
                } else {
                    // Show results
                    currentStep.classList.remove('active');
                    quizResults.style.display = 'block';
                    progressFill.style.width = '100%';
                    progressText.textContent = 'Complete!';
                    
                    // Scroll to results
                    quizResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 600);
        });
    });
    
    // Retake Quiz
    const retakeQuiz = document.getElementById('retakeQuiz');
    if (retakeQuiz) {
        retakeQuiz.addEventListener('click', function() {
            quizAnswers = {};
            quizResults.style.display = 'none';
            quizSteps.forEach(step => step.classList.remove('active'));
            document.querySelector('.quiz-step[data-step="1"]').classList.add('active');
            progressFill.style.width = '20%';
            progressText.textContent = 'Question 1 of 5';
            
            document.querySelector('.quiz-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
    
    // Email Results
    const emailResults = document.getElementById('emailResults');
    if (emailResults) {
        emailResults.addEventListener('click', function() {
            showToast('Results sent to your email!', 'success');
        });
    }
    
    // ============================================
    // TESTIMONIALS CAROUSEL
    // ============================================
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const carouselDots = document.querySelectorAll('.carousel-dot');
    
    let currentTestimonialIndex = 0;
    const testimonialCards = document.querySelectorAll('.testimonial-card-glass');
    const totalTestimonials = testimonialCards.length;
    
    function updateTestimonialCarousel() {
        if (!testimonialsTrack) return;
        
        const scrollAmount = currentTestimonialIndex * (testimonialCards[0].offsetWidth + 32);
        testimonialsTrack.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        carouselDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTestimonialIndex);
        });
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex - 1 + totalTestimonials) % totalTestimonials;
            updateTestimonialCarousel();
        });
        
        nextBtn.addEventListener('click', () => {
            currentTestimonialIndex = (currentTestimonialIndex + 1) % totalTestimonials;
            updateTestimonialCarousel();
        });
    }
    
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentTestimonialIndex = index;
            updateTestimonialCarousel();
        });
    });
    
    // Auto-play carousel
    let autoplayInterval = setInterval(() => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % totalTestimonials;
        updateTestimonialCarousel();
    }, 5000);
    
    // Pause on hover
    if (testimonialsTrack) {
        testimonialsTrack.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        testimonialsTrack.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(() => {
                currentTestimonialIndex = (currentTestimonialIndex + 1) % totalTestimonials;
                updateTestimonialCarousel();
            }, 5000);
        });
    }
    
    // ============================================
    // NEWSLETTER FORM
    // ============================================
    const newsletterForm = document.getElementById('premiumNewsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletter-email-input').value;
            const phone = document.getElementById('newsletter-phone-input').value;
            
            if (!email || !validateEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers')) || [];
            
            if (subscribers.some(sub => sub.email === email)) {
                showToast('You are already subscribed! 🎉', 'info');
                return;
            }
            
            subscribers.push({ 
                email, 
                phone, 
                subscribedDate: new Date().toISOString() 
            });
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            
            const submitBtn = this.querySelector('.btn-subscribe-premium');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Subscribed!</span>';
            submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            
            showToast('Welcome to Premium Club! Check email for ₹5,000 voucher 🎁', 'success');
            
            setTimeout(() => {
                this.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.background = '';
            }, 3000);
        });
    }
    
    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500 && scrollToTopBtn) {
            scrollToTopBtn.classList.add('visible');
        } else if (scrollToTopBtn) {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ============================================
    // SET MIN DATE FOR DATE INPUTS
    // ============================================
    const departureDateInput = document.getElementById('searchDeparture');
    const returnDateInput = document.getElementById('searchReturn');
    const predictDateInput = document.getElementById('predictDate');
    
    const today = new Date().toISOString().split('T')[0];
    
    if (departureDateInput) departureDateInput.setAttribute('min', today);
    if (returnDateInput) returnDateInput.setAttribute('min', today);
    if (predictDateInput) predictDateInput.setAttribute('min', today);
    
    if (departureDateInput && returnDateInput) {
        departureDateInput.addEventListener('change', function() {
            returnDateInput.setAttribute('min', this.value);
        });
    }
    
    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const animateOnScroll = document.querySelectorAll(`
        .destination-card-clean,
        .advantage-card,
        .testimonial-card-glass,
        .result-destination-card
    `);
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animateOnScroll.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });
    
    // ============================================
    // LIVE ACTIVITY FEED ANIMATION
    // ============================================
    const activityItems = document.querySelectorAll('.activity-item');
    if (activityItems.length > 0) {
        let activityIndex = 0;
        
        setInterval(() => {
            activityItems.forEach(item => item.style.opacity = '0.5');
            activityItems[activityIndex].style.opacity = '1';
            activityItems[activityIndex].style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                activityItems[activityIndex].style.transform = 'scale(1)';
            }, 500);
            
            activityIndex = (activityIndex + 1) % activityItems.length;
        }, 3000);
    }
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showToast(message, type = 'info') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        
        const iconMap = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle'
        };
        
        const colorMap = {
            success: '#10B981',
            error: '#EF4444',
            info: '#3B82F6'
        };
        
        toast.innerHTML = `
            <i class="fas fa-${iconMap[type]}"></i>
            <span>${message}</span>
        `;
        
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            padding: '18px 28px',
            background: colorMap[type],
            color: 'white',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '15px',
            fontWeight: '600',
            zIndex: '10000',
            animation: 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        });
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
    
    function initializePriceChart() {
        const ctx = document.getElementById('priceChart');
        if (!ctx || typeof Chart === 'undefined') return;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['60 days ago', '45 days', '30 days', '15 days', 'Today', 'Next week'],
                datasets: [{
                    label: 'Price Trend',
                    data: [38000, 41000, 39500, 42999, 42999, 48500],
                    borderColor: '#E5CBAF',
                    backgroundColor: 'rgba(229, 203, 175, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#E5CBAF',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            },
                            color: 'rgba(255, 255, 255, 0.8)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.8)'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Add animation keyframes
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ============================================
    // LOG INITIALIZATION COMPLETE
    // ============================================
    console.log('%c✅ All features loaded successfully!', 'color: #10B981; font-weight: bold;');
    console.log(`%c📊 Statistics:`, 'color: #E5CBAF; font-weight: bold;');
    console.log(`Total Destinations: ${document.querySelectorAll('.destination-card-clean').length}`);
    console.log(`Wishlist Items: ${wishlist.length}`);
    
});

// ============================================
// GLOBAL UTILITY FUNCTIONS
// ============================================

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function getDaysDifference(date1, date2) {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// ============================================
// END OF DESTINATIONS.JS
// ============================================
