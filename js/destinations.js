document.addEventListener('DOMContentLoaded', function () {

    // =============================================
    // MANAGE MENU VISIBILITY (from index.js)
    // =============================================
    function handleManageMenuVisibility() {
        const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
        const hasBooked = localStorage.getItem('hasBookedTicket') === 'true';

        const manageMenuDesktop = document.getElementById('manage-menu-desktop');
        const manageMenuMobile = document.getElementById('manage-menu-mobile');

        if (!(isSignedIn && hasBooked)) {
            if (manageMenuDesktop) manageMenuDesktop.classList.add('manage-menu-hidden');
            if (manageMenuMobile) manageMenuMobile.classList.add('manage-menu-hidden');
        }
    }
    handleManageMenuVisibility();
    // =============================================
    // HEADER & NAVIGATION LOGIC (from index.js)
    // =============================================

    // --- ACTIVE PAGE INDICATOR IN NAVBAR ---
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.header-desktop-nav a, .header-mobile-nav a');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();

            if (linkPage === currentPage) {
                link.classList.add('nav-active');

                // If the active link is inside a dropdown, also highlight the main dropdown link
                const dropdownParent = link.closest('.header-dropdown');
                if (dropdownParent) {
                    const parentLink = dropdownParent.querySelector(':scope > a');
                    if (parentLink) parentLink.classList.add('nav-active');
                }
            }
        });
    }
    setActiveNavLink();

    // --- HEADER SCROLL & MOBILE MENU ---
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
            const parent = link.parentElement;
            parent.classList.toggle('header-open');
        });
    });

    // =============================================
    // PAGE-SPECIFIC: SMOOTH SCROLL FOR "START EXPLORING" BUTTON
    // =============================================
    const exploreBtn = document.getElementById('explore-destinations-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function (e) {
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
    // HERO SECTION: CINEMATIC UPGRADE
    // =============================================

    // --- 1. Typing Animation for Headline ---
    function initializeHeroAmbience() {
        // This function is kept for potential future ambience effects.
        // Current design is mostly CSS-driven.
    }

    // --- 2. Glassmorphism Card Tabs & Autocomplete ---
    function initializeSimpleSearchForm() {
        // All interactions for the new simple form are handled by CSS.
        // This function is a placeholder for any future JS-based interactions
        // like form validation or dynamic passenger input.
    }

    // =============================================
    // QUICK FILTERS INTERACTIVITY
    // =============================================
    function initializeQuickFilters() {
        const quickFiltersContainer = document.querySelector('.quick-filters');
        if (!quickFiltersContainer) return;

        quickFiltersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-filter-chip')) {
                // Remove active class from all chips
                quickFiltersContainer.querySelectorAll('.quick-filter-chip').forEach(chip => {
                    chip.classList.remove('active');
                });
                // Add active class to the clicked chip
                e.target.classList.add('active');
            }
        });
    }

    // =============================================
    // PAGE-SPECIFIC: DEALS SECTION URGENCY
    // =============================================

    // --- Countdown Timer Logic ---
    function initializeCountdown(elementId, hours) {
        const countdownElement = document.getElementById(elementId);
        if (!countdownElement) return;

        const endTime = new Date().getTime() + hours * 60 * 60 * 1000;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                clearInterval(interval);
                countdownElement.innerHTML = "<div class='deal-expired'>DEAL EXPIRED</div>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = countdownElement.querySelector('[data-unit="days"]');
            const hoursEl = countdownElement.querySelector('[data-unit="hours"]');
            const minutesEl = countdownElement.querySelector('[data-unit="minutes"]');
            const secondsEl = countdownElement.querySelector('[data-unit="seconds"]');

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

            // Color psychology
            const totalHours = distance / (1000 * 60 * 60);
            if (totalHours < 1) {
                countdownElement.classList.add('danger');
                countdownElement.classList.remove('warning');
            } else if (totalHours < 12) {
                countdownElement.classList.add('warning');
                countdownElement.classList.remove('danger');
            }

        }, 1000);
    }

    // --- Scarcity Bar Animation ---
    function animateScarcityBar() {
        const scarcityBar = document.querySelector('.featured-deal .progress-fill');
        const scarcityText = document.querySelector('.featured-deal .scarcity-text span:first-child');
        if (!scarcityBar || !scarcityText) return;

        let claimed = 73;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate the bar on view
                    scarcityBar.style.width = `${claimed}%`;

                    // Simulate real-time claims
                    setInterval(() => {
                        if (claimed < 98) {
                            claimed += Math.random() > 0.5 ? 1 : 0;
                            scarcityBar.style.width = `${claimed}%`;
                            scarcityText.innerHTML = `<i class="fas fa-fire"></i> ${claimed}% Claimed`;
                        }
                    }, (Math.random() * 10 + 5) * 1000); // every 5-15 seconds

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });

        observer.observe(scarcityBar);
    }

    // Initialize all deals features
    initializeCountdown('featured-countdown', 38); // 1 day + 14 hours
    initializeCountdown('weekend-countdown', 72);
    animateScarcityBar();

    // =============================================
    // PAGE-SPECIFIC: IMMERSIVE DESTINATION CARDS
    // =============================================
    function initializeDestinationCards() {
      // All card interactions for the new design are handled by CSS hover states.
      // No JavaScript is needed for the card layout or basic interactivity.
    }
    initializeDestinationCards();
    // =============================================
    // PAGE-SPECIFIC: SCROLL-TRIGGERED ANIMATIONS
    // =============================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    initializeHeroAmbience();
    initializeSimpleSearchForm();
    initializeQuickFilters();

    // =============================================
    // FLIGHT DEALS FILTER INTERACTIVITY
    // =============================================
    function initializeDealFilters() {
        const dealFiltersContainer = document.querySelector('.deals-filters .filter-chips');
        if (!dealFiltersContainer) return;

        dealFiltersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-chip')) {
                dealFiltersContainer.querySelectorAll('.filter-chip').forEach(chip => {
                    chip.classList.remove('active');
                });
                e.target.classList.add('active');
                // Add logic here to filter deal cards based on the selected chip
            }
        });
    }
    initializeDealFilters();
    // =============================================
    // FOOTER-RELATED: SCROLL TO TOP BUTTON
    // =============================================
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =============================================
    // FOOTER-RELATED: NEWSLETTER & ANIMATIONS
    // =============================================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            this.classList.add('submitted');
            setTimeout(() => {
                this.classList.remove('submitted');
                const input = this.querySelector('input[type="email"]');
                if(input) input.value = '';
            }, 2000);
        });
    }

    // =============================================
    // FOOTER-RELATED: SCROLL-IN ANIMATION
    // =============================================
    const footer = document.getElementById('destinova-footer');
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.classList.add('in-view');
                    footerObserver.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the footer is visible

        footerObserver.observe(footer);
    }

    // =============================================
    // REMOVED: Travel styles section no longer needed
    // =============================================
    function initializeTravelStylesAndModal() {
        // Function disabled - travel styles section removed
        return;

        const modalContent_OLD = {
            adventure: {
                title: 'Adventure & Outdoors',
                description: 'For the thrill-seekers and nature lovers. Our adventure trips range from scaling mountains to diving into the deep blue. Get your adrenaline pumping!',
                itineraries: ['Himalayan Trekking', 'Costa Rica Ziplining', 'African Safari']
            },
            luxury: {
                title: 'Luxury & Wellness',
                description: 'Indulge in the finest experiences the world has to offer. From 5-star resorts to private tours and spa retreats, every moment is curated for your comfort.',
                itineraries: ['Maldives Overwater Bungalow Stay', 'Tuscan Vineyard Tour', 'Japanese Onsen Retreat']
            },
            family: {
                title: 'Family Adventures',
                description: 'Create memories that will last a lifetime with our family-friendly packages. We focus on fun, safety, and activities for all ages.',
                itineraries: ['Orlando Theme Parks', 'Australian Outback Exploration', 'European Castle Tour']
            },
            'art-culture': {
                title: 'Cultural Immersion',
                description: 'Dive deep into the heart of a destination. Explore ancient ruins, savor local cuisines, and experience the traditions that make each place unique.',
                itineraries: ['Kyoto Temple Tour', 'Egyptian Pyramids Discovery', 'Peruvian Food Journey']
            },
            solo: {
                title: 'Solo Journeys',
                description: 'Discover the world and yourself. Our solo trips are designed for safety, social opportunities, and personal discovery.',
                itineraries: ['Southeast Asia Backpacking', 'New Zealand Road Trip', 'Iceland Ring Road Adventure']
            },
            couples: {
                title: 'Romantic Escapes',
                description: 'Whether it\'s a honeymoon or a quiet getaway, our romantic escapes provide the perfect backdrop for moments you\'ll cherish forever.',
                itineraries: ['Paris & Rome Discovery', 'Santorini Sunsets', 'Bora Bora Honeymoon']
            }
        };

        function showModal(style) {
            const content = modalContent[style];
            if (!content) return;

            const modalHTML = `
                <div class="style-modal-overlay">
                    <div class="style-modal">
                        <div class="style-modal-header">
                            <h3>${content.title}</h3>
                            <button class="style-modal-close">&times;</button>
                        </div>
                        <div class="style-modal-body">
                            <p>${content.description}</p>
                            <h4>Sample Itineraries:</h4>
                            <ul>
                                ${content.itineraries.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                            <a href="#">See All Sample Itineraries</a>
                        </div>
                    </div>
                </div>
            `;
            modalContainer.innerHTML = modalHTML;
            const overlay = modalContainer.querySelector('.style-modal-overlay');
            setTimeout(() => overlay.classList.add('visible'), 10);

            overlay.addEventListener('click', (e) => {
                if (e.target.classList.contains('style-modal-overlay') || e.target.classList.contains('style-modal-close')) {
                    overlay.classList.remove('visible');
                    setTimeout(() => modalContainer.innerHTML = '', 300);
                }
            });
        }

        function filterDestinations(style) {
            destinationCards.forEach(card => {
                const cardStyles = card.dataset.style.split(',');
                if (cardStyles.includes(style)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            if (popularDestinationsSection) {
                popularDestinationsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        themeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const style = card.dataset.style;
                if (e.target.closest('.btn-book-style')) {
                    e.preventDefault();
                    filterDestinations(style);
                } else {
                    showModal(style);
                }
            });
        });
    }
    initializeTravelStylesAndModal();

    // =============================================
    // REMOVED: Inspiration section no longer needed
    // =============================================
    function initializeInspirationSection() {
        // Function disabled - inspiration section removed
        return;

        const lightboxOverlay = document.getElementById('lightbox-overlay');
        if (!lightboxOverlay) return;

        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');

        const galleries = {
            dubai: [
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200',
                'https://images.unsplash.com/photo-1523813676091-5341b31b5b53?q=80&w=1200',
                'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b1?q=80&w=1200'
            ],
            japan: [
                'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=1200',
                'https://images.unsplash.com/photo-1526481280643-3b9462cd7a25?q=80&w=1200',
                'https://images.unsplash.com/photo-1559756472-390969c86183?q=80&w=1200'
            ],
            safari: [
                'https://images.unsplash.com/photo-1534437431034-0a6a4a131575?q=80&w=1200',
                'https://images.unsplash.com/photo-1588965861394-329489a23839?q=80&w=1200',
                'https://images.unsplash.com/photo-1558533386-d3b3c398535a?q=80&w=1200'
            ],
            winter: [
                'https://images.unsplash.com/photo-1603811498297-1229b59d9c35?q=80&w=1200',
                'https://images.unsplash.com/photo-1482338533771-5d4553533145?q=80&w=1200',
                'https://images.unsplash.com/photo-1511184151939-57595a51030e?q=80&w=1200'
            ]
        };

        let currentGallery = [];
        let currentIndex = 0;

        function showLightbox(galleryKey) {
            currentGallery = galleries[galleryKey];
            if (!currentGallery || currentGallery.length === 0) return;
            currentIndex = 0;
            updateLightboxImage();
            lightboxOverlay.classList.add('visible');
        }

        function closeLightbox() {
            lightboxOverlay.classList.remove('visible');
        }

        function updateLightboxImage() {
            lightboxImage.src = currentGallery[currentIndex];
        }

        function showNextImage() {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateLightboxImage();
        }

        function showPrevImage() {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightboxImage();
        }

        inspirationCards.forEach(card => {
            const wishlistBtn = card.querySelector('.wishlist-btn');
            const galleryBtn = card.querySelector('.gallery-btn');

            if (wishlistBtn) {
                wishlistBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    wishlistBtn.classList.toggle('active');
                    const icon = wishlistBtn.querySelector('i');
                    icon.classList.toggle('far');
                    icon.classList.toggle('fas');
                });
            }

            if (galleryBtn) {
                galleryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const galleryKey = card.dataset.gallery;
                    showLightbox(galleryKey);
                });
            }
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) closeLightbox();
        });
        lightboxNext.addEventListener('click', showNextImage);
        lightboxPrev.addEventListener('click', showPrevImage);
    }
    initializeInspirationSection();

    // =============================================
    // PAGE-SPECIFIC: NEW TESTIMONIAL CAROUSEL
    // =============================================
    function initializeTestimonials() {
        const grid = document.getElementById('testimonial-grid');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.testimonial-card-new');

        if (!grid) return;

        // "Read More" functionality
        grid.addEventListener('click', (e) => {
            const readMoreBtn = e.target.closest('.testimonial-read-more');
            if (readMoreBtn) {
                const card = readMoreBtn.closest('.testimonial-card-new');
                const quote = card.querySelector('.testimonial-quote');
                
                quote.classList.toggle('expanded');
                readMoreBtn.classList.toggle('active');

                if (quote.classList.contains('expanded')) {
                    readMoreBtn.innerHTML = 'Read Less <i class="fas fa-arrow-up"></i>';
                } else {
                    readMoreBtn.innerHTML = 'Read Full Story <i class="fas fa-arrow-down"></i>';
                }
            }
        });

        // Filtering functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter cards
                cards.forEach(card => {
                    const tags = card.dataset.filterTags;
                    if (filter === 'all' || (tags && tags.includes(filter))) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    initializeTestimonials();

    // =============================================
    // REMOVED: Live activity notifications (too distracting)
    // =============================================
    function initializeLiveActivityFeed() {
        // Function disabled - live notifications removed
        return;

        const container = document.getElementById('live-activity-container');
        if (!container) return;

        const mockActivities = [
            { type: 'booking', text: 'Emma from Seattle 🇺🇸 just booked the Tokyo Cherry Blossom tour!', icon: 'https://i.pravatar.cc/150?img=1' },
            { type: 'rating', text: 'Mike rated his Bali adventure 5 stars ⭐⭐⭐⭐⭐', icon: 'https://i.pravatar.cc/150?img=2' },
            { type: 'trending', text: 'Trending: 127 people searched for Thailand today', icon: 'fas fa-fire' },
            { type: 'deal', text: 'Flash deal: 34 people are viewing Maldives packages right now!', icon: 'fas fa-tags' },
            { type: 'review', text: "New review: 'Best travel experience of my life!'", icon: 'fas fa-comment-dots' },
            { type: 'price', text: 'Price alert: European tour just dropped ₹25,000!', icon: 'fas fa-dollar-sign' }
        ];

        function createNotification() {
            const activity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
            
            const card = document.createElement('div');
            card.className = 'activity-popup-card';

            let iconHTML = '';
            if (activity.icon.startsWith('fas')) {
                iconHTML = `<div class="activity-popup-icon"><i class="${activity.icon}"></i></div>`;
            } else {
                iconHTML = `<div class="activity-popup-icon"><img src="${activity.icon}" alt="User photo"></div>`;
            }

            card.innerHTML = `
                ${iconHTML}
                <div class="activity-popup-content">
                    <p>${activity.text}</p>
                    <small>${Math.floor(Math.random() * 10) + 1} minutes ago</small>
                </div>
            `;

            // Add click listener
            card.addEventListener('click', () => {
                alert(`Viewing details for: "${activity.text}"`);
                // In a real app, this would open a modal or navigate to a relevant page.
                card.remove(); // Remove immediately on click
            });

            container.appendChild(card);

            // Auto-dismiss logic
            setTimeout(() => {
                card.classList.add('hiding');
                // Remove from DOM after animation finishes
                card.addEventListener('animationend', () => {
                    if (card.parentNode) {
                        card.remove();
                    }
                }, { once: true });
            }, 5000); // 5-second lifespan
        }

        function startFeed() {
            // Initial notification
            setTimeout(createNotification, 3000);

            // Subsequent notifications at random intervals
            setInterval(() => {
                // Limit the number of visible notifications to avoid clutter
                if (container.children.length < 3) {
                    createNotification();
                }
            }, Math.random() * (30000 - 15000) + 15000); // Randomly between 15 and 30 seconds
        }

        startFeed();
    }
    initializeLiveActivityFeed();

});

document.addEventListener('DOMContentLoaded', function () {
    // ... (existing code)

    // =============================================
    // PAGE-SPECIFIC: ADVANCED SEARCH HUB
    // =============================================
    function initializeSearchHub() {
        const searchHub = document.getElementById('advanced-search-hub');
        if (!searchHub) return;

        // Budget Slider
        const budgetSlider = document.getElementById('budget-slider');
        const budgetValue = document.getElementById('budget-value');
        if (budgetSlider && budgetValue) {
            budgetSlider.addEventListener('input', () => {
                const value = parseInt(budgetSlider.value);
                if (value >= 10000) {
                    budgetValue.textContent = '$10,000+';
                } else {
                    budgetValue.textContent = '$' + value.toLocaleString();
                }
            });
        }

        // Chip Groups
        const chipGroups = searchHub.querySelectorAll('.chip-group');
        chipGroups.forEach(group => {
            group.addEventListener('click', (e) => {
                if (e.target.classList.contains('chip')) {
                    // For single-select groups, remove active from others
                    if (group.closest('.filter-block').querySelector('label').textContent === 'Duration') {
                        group.querySelectorAll('.chip').forEach(chip => chip.classList.remove('active'));
                    }
                    e.target.classList.toggle('active');
                }
            });
        });

        // Map Tooltip
        const mapPins = searchHub.querySelectorAll('.map-pin');
        const mapTooltip = document.getElementById('map-tooltip');
        if (mapPins.length > 0 && mapTooltip) {
            mapPins.forEach(pin => {
                pin.addEventListener('mouseenter', (e) => {
                    const info = JSON.parse(pin.dataset.info);
                    mapTooltip.innerHTML = `<h4>${info.name}</h4><p>From ${info.price}</p><p><i class="fas fa-cloud-sun"></i> ${info.weather}</p>`;
                    mapTooltip.style.left = `${e.clientX - searchHub.getBoundingClientRect().left + 15}px`;
                    mapTooltip.style.top = `${e.clientY - searchHub.getBoundingClientRect().top + 15}px`;
                    mapTooltip.classList.add('visible');
                });
                pin.addEventListener('mouseleave', () => {
                    mapTooltip.classList.remove('visible');
                });
            });
        }
    }
    initializeSearchHub();

    // =============================================
    // PAGE-SPECIFIC: TODAY'S FLIGHT DEALS FILTERS
    // =============================================
    function initializeFlightDealsFilters() {
        const filterContainer = document.querySelector('.quick-deal-filters');
        if (!filterContainer) return;

        const dealCards = document.querySelectorAll('.deal-card-horizontal');

        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-deal-filter')) {
                const filterValue = e.target.dataset.filter;

                // Update active button
                filterContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');

                // Show/hide cards
                dealCards.forEach(card => {
                    const cardCategory = card.dataset.category;
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'grid';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    }
    initializeFlightDealsFilters();

    // =============================================
    // LAST-MINUTE BANNER: ANIMATED COUNTER & COUNTDOWN
    // =============================================
    function initializeLastMinuteBanner() {
        // Animated Counter
        const counterElement = document.getElementById('last-minute-counter');
        if (counterElement) {
            let currentCount = 127;
            setInterval(() => {
                // Randomly increment counter (simulate real bookings)
                if (Math.random() > 0.7) {
                    currentCount += 1;
                    counterElement.textContent = currentCount;
                }
            }, 5000); // Update every 5 seconds
        }

        // Countdown Timer
        const countdownElement = document.getElementById('refresh-countdown');
        if (countdownElement) {
            // Set end time to 2h 15m from now
            let endTime = new Date().getTime() + (2 * 60 * 60 + 15 * 60) * 1000;

            const updateCountdown = () => {
                const now = new Date().getTime();
                const distance = endTime - now;

                if (distance < 0) {
                    // Reset countdown when it reaches 0
                    endTime = new Date().getTime() + (2 * 60 * 60 + 15 * 60) * 1000;
                    return;
                }

                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

                countdownElement.textContent = `${hours}h ${minutes}m`;
            };

            updateCountdown();
            setInterval(updateCountdown, 60000); // Update every minute
        }
    }
    initializeLastMinuteBanner();

    // ============================================
    // FEATURED COLLECTIONS - CATEGORY FILTERING & LAZY LOADING
    // ============================================
    
    function initializeFeaturedCollections() {
        const filterTabs = document.querySelectorAll('.collection-filter-tab');
        const collectionCards = document.querySelectorAll('.collection-card');
        
        // Category Filtering
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active tab with underline animation
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Filter cards with smooth transition
                collectionCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (category === 'all' || cardCategory === category) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.classList.add('hidden');
                        }, 400);
                    }
                });
            });
        });
        
        // Lazy Loading with Intersection Observer
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const img = card.querySelector('.collection-image');
                    
                    // Trigger lazy load animation
                    if (img && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Add staggered entrance animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(card);
                }
            });
        }, observerOptions);
        
        // Observe all collection cards for lazy loading
        collectionCards.forEach((card, index) => {
            // Initial state for staggered entrance
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            
            imageObserver.observe(card);
        });
        
        // CTA Button Click Handlers
        const ctaButtons = document.querySelectorAll('.collection-cta-btn');
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const destination = this.closest('.collection-card').querySelector('.collection-destination').textContent;
                console.log(`Planning trip to: ${destination}`);
                // Add your booking logic here
            });
        });
        
        // Card Click Handler (navigate to destination details)
        collectionCards.forEach(card => {
            card.addEventListener('click', function() {
                const destination = this.querySelector('.collection-destination').textContent;
                console.log(`Viewing details for: ${destination}`);
                // Add your navigation logic here
            });
        });
    }
    
    // Initialize Featured Collections on page load
    if (document.querySelector('.featured-collections-grid')) {
        initializeFeaturedCollections();
    }

    // ============================================
    // WHY BOOK WITH US - SCROLL ANIMATIONS & INTERACTIONS
    // ============================================
    
    function initializeWhyBookSection() {
        const whyBookCards = document.querySelectorAll('.why-book-card-enhanced');
        
        if (whyBookCards.length === 0) return;

        // Scroll-triggered animations with 100ms stagger
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const delay = parseInt(card.getAttribute('data-aos-delay') || 0);
                    
                    // Set initial state
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(40px)';
                    
                    // Trigger animation with stagger
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, delay);
                    
                    cardObserver.unobserve(card);
                }
            });
        }, observerOptions);

        whyBookCards.forEach(card => {
            cardObserver.observe(card);
        });

        // Icon animation on hover
        whyBookCards.forEach(card => {
            const icon = card.querySelector('.why-icon-enhanced');
            
            card.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            card.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });

        // Payment logo hover effects
        const paymentLogos = document.querySelectorAll('.payment-logo');
        paymentLogos.forEach(logo => {
            logo.addEventListener('mouseenter', () => {
                paymentLogos.forEach(otherLogo => {
                    if (otherLogo !== logo) {
                        otherLogo.style.opacity = '0.4';
                    }
                });
            });
            
            logo.addEventListener('mouseleave', () => {
                paymentLogos.forEach(otherLogo => {
                    otherLogo.style.opacity = '0.8';
                });
            });
        });

        // CTA button ripple effect
        const ctaButton = document.querySelector('.btn-join-travelers');
        if (ctaButton) {
            ctaButton.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        }

        // Animate CTA container
        const ctaContainer = document.querySelector('.why-book-cta-container');
        if (ctaContainer) {
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            ctaContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            ctaContainer.style.opacity = '1';
                            ctaContainer.style.transform = 'translateY(0)';
                        }, 400);
                        ctaObserver.unobserve(ctaContainer);
                    }
                });
            }, observerOptions);

            ctaContainer.style.opacity = '0';
            ctaContainer.style.transform = 'translateY(30px)';
            ctaObserver.observe(ctaContainer);
        }
    }

    // Initialize Why Book section
    if (document.querySelector('.why-book-section')) {
        initializeWhyBookSection();
    }

    // ============================================
    // AIRLINE PARTNERS - CAROUSEL INTERACTIONS
    // ============================================
    
    function initializeAirlinePartnersCarousel() {
        const carouselWrappers = document.querySelectorAll('.airline-carousel-wrapper');
        const logoItems = document.querySelectorAll('.airline-logo-carousel');
        
        if (carouselWrappers.length === 0) return;

        // Add individual hover pause for each logo
        logoItems.forEach(logo => {
            logo.addEventListener('mouseenter', function() {
                const carousel = this.closest('.airline-carousel');
                if (carousel) {
                    carousel.style.animationPlayState = 'paused';
                }
            });

            logo.addEventListener('mouseleave', function() {
                const carousel = this.closest('.airline-carousel');
                if (carousel) {
                    carousel.style.animationPlayState = 'running';
                }
            });

            // Add click handler for potential airline details
            logo.addEventListener('click', function() {
                const airlineName = this.querySelector('img').alt;
                console.log(`Viewing flights from: ${airlineName}`);
                // Add your navigation logic here
                // e.g., window.location.href = `/airlines/${airlineName.toLowerCase().replace(/\s+/g, '-')}`;
            });
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carouselWrappers.forEach(wrapper => {
            wrapper.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                const carousel = wrapper.querySelector('.airline-carousel');
                carousel.style.animationPlayState = 'paused';
            });

            wrapper.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const carousel = wrapper.querySelector('.airline-carousel');
                carousel.style.animationPlayState = 'running';
                
                // Optional: Detect swipe direction for potential interactions
                if (touchEndX < touchStartX - 50) {
                    console.log('Swiped left');
                } else if (touchEndX > touchStartX + 50) {
                    console.log('Swiped right');
                }
            });

            // Pause on touch/hold
            wrapper.addEventListener('touchmove', () => {
                const carousel = wrapper.querySelector('.airline-carousel');
                carousel.style.animationPlayState = 'paused';
            });
        });

        // Add accessibility: keyboard navigation
        logoItems.forEach((logo, index) => {
            logo.setAttribute('tabindex', '0');
            logo.setAttribute('role', 'button');
            logo.setAttribute('aria-label', `View flights from ${logo.querySelector('img').alt}`);

            logo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    logo.click();
                }

                // Arrow key navigation
                if (e.key === 'ArrowRight' && index < logoItems.length - 1) {
                    logoItems[index + 1].focus();
                } else if (e.key === 'ArrowLeft' && index > 0) {
                    logoItems[index - 1].focus();
                }
            });
        });

        // Reduced motion support
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            const carousels = document.querySelectorAll('.airline-carousel');
            carousels.forEach(carousel => {
                carousel.style.animation = 'none';
            });
        }

        // View All Partners link interaction
        const viewAllLink = document.querySelector('.view-all-partners-link');
        if (viewAllLink) {
            viewAllLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Viewing all airline partners');
                // Add your navigation logic here
                // e.g., window.location.href = '/airlines';
            });
        }

        // Log analytics when carousel is viewed
        const carouselSection = document.querySelector('.airline-partners-section');
        if (carouselSection) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        console.log('Airline Partners section viewed');
                        // Add your analytics tracking here
                        sectionObserver.unobserve(carouselSection);
                    }
                });
            }, { threshold: 0.5 });

            sectionObserver.observe(carouselSection);
        }
    }

    // Initialize Airline Partners Carousel
    if (document.querySelector('.airline-partners-section')) {
        initializeAirlinePartnersCarousel();
    }

    // ============================================
    // CUSTOMER REVIEWS - CAROUSEL & FILTERING
    // ============================================
    
    function initializeCustomerReviews() {
        const carousel = document.getElementById('reviewsCarousel');
        const dotsContainer = document.getElementById('carouselDots');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const reviewCards = document.querySelectorAll('.review-card');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const starFilterBtns = document.querySelectorAll('.star-filter-btn');
        const helpfulBtns = document.querySelectorAll('.helpful-btn');
        const shareReviewBtns = document.querySelectorAll('.share-review-btn');
        const writeReviewBtn = document.querySelector('.btn-write-review');

        if (!carousel || reviewCards.length === 0) return;

        let currentIndex = 0;
        let autoPlayInterval;
        const cardsPerView = getCardsPerView();

        // Get cards per view based on screen size
        function getCardsPerView() {
            if (window.innerWidth >= 1200) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        // Create navigation dots
        function createDots() {
            dotsContainer.innerHTML = '';
            const totalDots = Math.ceil(reviewCards.length / cardsPerView);
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        // Update dots
        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Go to specific slide
        function goToSlide(index) {
            const maxIndex = Math.ceil(reviewCards.length / cardsPerView) - 1;
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            
            const cardWidth = reviewCards[0].offsetWidth;
            const gap = 24;
            const offset = currentIndex * (cardWidth + gap) * cardsPerView;
            
            carousel.style.transform = `translateX(-${offset}px)`;
            updateDots();
        }

        // Next slide
        function nextSlide() {
            const maxIndex = Math.ceil(reviewCards.length / cardsPerView) - 1;
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            goToSlide(currentIndex);
        }

        // Previous slide
        function prevSlide() {
            const maxIndex = Math.ceil(reviewCards.length / cardsPerView) - 1;
            currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
            goToSlide(currentIndex);
        }

        // Auto-advance every 5 seconds
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Navigation buttons
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Filtering System
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active from all
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                applyFilter(filter);
            });
        });

        starFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                starFilterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const stars = this.getAttribute('data-stars');
                applyStarFilter(stars);
            });
        });

        function applyFilter(filter) {
            let visibleCards = [];
            
            reviewCards.forEach(card => {
                let shouldShow = true;
                
                switch(filter) {
                    case 'recent':
                        shouldShow = true;
                        break;
                    case 'highest':
                        shouldShow = card.getAttribute('data-rating') === '5';
                        break;
                    case 'photos':
                        shouldShow = card.getAttribute('data-has-photos') === 'true';
                        break;
                    case 'verified':
                        shouldShow = card.getAttribute('data-verified') === 'true';
                        break;
                }
                
                if (shouldShow) {
                    card.style.display = 'flex';
                    visibleCards.push(card);
                } else {
                    card.style.display = 'none';
                }
            });
            
            currentIndex = 0;
            goToSlide(0);
            createDots();
        }

        function applyStarFilter(stars) {
            reviewCards.forEach(card => {
                const rating = parseInt(card.getAttribute('data-rating'));
                let shouldShow = true;
                
                switch(stars) {
                    case 'all':
                        shouldShow = true;
                        break;
                    case '5':
                        shouldShow = rating === 5;
                        break;
                    case '4':
                        shouldShow = rating >= 4;
                        break;
                    case '3':
                        shouldShow = rating >= 3;
                        break;
                }
                
                card.style.display = shouldShow ? 'flex' : 'none';
            });
            
            currentIndex = 0;
            goToSlide(0);
            createDots();
        }

        // Helpful button interactions
        helpfulBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.innerHTML;
                const match = text.match(/\((\d+)\)/);
                
                if (match) {
                    const count = parseInt(match[1]) + 1;
                    this.innerHTML = text.replace(/\d+/, count);
                    this.style.color = '#0EA5E9';
                    this.style.borderColor = '#0EA5E9';
                    
                    // Add animation
                    this.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 200);
                }
            });
        });

        // Share review buttons
        shareReviewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Implement share functionality
                const card = this.closest('.review-card');
                const reviewerName = card.querySelector('.reviewer-name').textContent;
                console.log(`Sharing review from ${reviewerName}`);
                
                // Example: Copy link to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-share-alt"></i> Share';
                    }, 2000);
                });
            });
        });

        // Write Review CTA
        if (writeReviewBtn) {
            writeReviewBtn.addEventListener('click', function() {
                console.log('Opening review form...');
                // Implement review form modal/redirect
                // Example: window.location.href = '/write-review';
                alert('Thank you for your interest! The review form will open here.');
            });
        }

        // Touch/Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay();
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        });

        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                nextSlide();
            } else if (touchEndX > touchStartX + 50) {
                prevSlide();
            }
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Window resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                createDots();
                goToSlide(0);
            }, 250);
        });

        // Animate rating bars on scroll
        const ratingBars = document.querySelectorAll('.rating-bar-fill');
        const ratingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    ratingObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        ratingBars.forEach(bar => ratingObserver.observe(bar));

        // Initialize
        createDots();
        startAutoPlay();
    }

    // Initialize Customer Reviews
    if (document.querySelector('.customer-reviews-section')) {
        initializeCustomerReviews();
    }

    // ============================================
    // NEWSLETTER & APP DOWNLOAD FUNCTIONALITY
    // ============================================
    function initializeNewsletterApp() {
        const newsletterForm = document.getElementById('newsletterSubscribeForm');
        const emailInput = newsletterForm?.querySelector('.newsletter-email-input');
        const subscribeBtn = newsletterForm?.querySelector('.newsletter-subscribe-btn');
        const appStoreButtons = document.querySelectorAll('.app-store-btn');
        const incentiveBadge = document.querySelector('.incentive-badge');

        // Newsletter Form Submission
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const email = emailInput.value.trim();
                
                // Email Validation
                if (!email) {
                    showNotification('Please enter your email address', 'error');
                    emailInput.focus();
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    emailInput.focus();
                    return;
                }

                // Disable button and show loading state
                subscribeBtn.disabled = true;
                const originalText = subscribeBtn.innerHTML;
                subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';

                // Simulate API call (replace with actual API endpoint)
                setTimeout(() => {
                    // Success
                    showNotification('🎉 Successfully subscribed! Check your email for your ₹500 bonus.', 'success');
                    emailInput.value = '';
                    subscribeBtn.disabled = false;
                    subscribeBtn.innerHTML = originalText;
                    
                    // Add celebratory animation
                    newsletterForm.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        newsletterForm.style.transform = 'scale(1)';
                    }, 200);

                    // Track conversion (Google Analytics, etc.)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'newsletter_subscribe', {
                            'event_category': 'engagement',
                            'event_label': 'destinations_page'
                        });
                    }
                }, 1500);
            });
        }

        // Email Validation Helper
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Notification System
        function showNotification(message, type = 'info') {
            // Remove existing notifications
            const existingNotif = document.querySelector('.notification-popup');
            if (existingNotif) {
                existingNotif.remove();
            }

            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification-popup notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;

            // Add styles
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? 'linear-gradient(135deg, #10B981, #34D399)' : 'linear-gradient(135deg, #EF4444, #F87171)'};
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                animation: slideInRight 0.4s ease;
                max-width: 400px;
                font-size: 15px;
                font-weight: 600;
            `;

            const style = document.createElement('style');
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
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-content i {
                    font-size: 20px;
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(notification);

            // Auto remove after 4 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.4s ease';
                setTimeout(() => {
                    notification.remove();
                }, 400);
            }, 4000);
        }

        // App Store Button Tracking
        appStoreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const store = button.classList.contains('apple-btn') ? 'App Store' : 'Google Play';
                
                showNotification(`🚀 Redirecting to ${store}...`, 'success');
                
                // Track app download click
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'app_download_click', {
                        'event_category': 'engagement',
                        'event_label': store,
                        'value': 1
                    });
                }

                // Simulate redirect (replace with actual app store URLs)
                setTimeout(() => {
                    if (store === 'App Store') {
                        // window.location.href = 'https://apps.apple.com/your-app';
                        console.log('Redirect to App Store');
                    } else {
                        // window.location.href = 'https://play.google.com/store/apps/details?id=your.app';
                        console.log('Redirect to Google Play');
                    }
                }, 1000);
            });
        });

        // Incentive Badge Interaction
        if (incentiveBadge) {
            incentiveBadge.addEventListener('click', () => {
                // Scroll to app section or show more details
                incentiveBadge.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    incentiveBadge.style.transform = 'scale(1)';
                }, 200);

                showNotification('📱 Download our app to claim your ₹200 discount!', 'success');
            });

            // Make badge interactive with cursor
            incentiveBadge.style.cursor = 'pointer';
        }

        // Subscriber Avatars Animation
        const avatars = document.querySelectorAll('.subscriber-avatars .avatar');
        avatars.forEach((avatar, index) => {
            avatar.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
        });

        // Add floating animation for avatars
        const floatStyle = document.createElement('style');
        floatStyle.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-5px);
                }
            }
        `;
        document.head.appendChild(floatStyle);

        // Input Focus Animation
        if (emailInput) {
            emailInput.addEventListener('focus', () => {
                emailInput.parentElement.style.transform = 'scale(1.02)';
            });

            emailInput.addEventListener('blur', () => {
                emailInput.parentElement.style.transform = 'scale(1)';
            });
        }

        // Phone Mockup Tilt Effect (on hover for desktop)
        const phoneMockup = document.querySelector('.phone-mockup');
        if (phoneMockup && window.innerWidth > 768) {
            phoneMockup.addEventListener('mousemove', (e) => {
                const rect = phoneMockup.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                phoneMockup.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            phoneMockup.addEventListener('mouseleave', () => {
                phoneMockup.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        }
    }

    // Initialize Newsletter & App Section
    if (document.querySelector('.newsletter-app-section')) {
        initializeNewsletterApp();
    }

    // ============================================
    // REDESIGNED FOOTER FUNCTIONALITY
    // ============================================
    function initializeFooter() {
        // Back to Top Button
        const backToTopBtn = document.getElementById('backToTopBtn');
        
        if (backToTopBtn) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });

            // Smooth scroll to top
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Add animation feedback
                backToTopBtn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    backToTopBtn.style.transform = '';
                }, 200);
            });
        }

        // Language Selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                const selectedLanguage = e.target.value;
                console.log('Language changed to:', selectedLanguage);
                
                // Show notification
                showFooterNotification(`Language changed to ${e.target.options[e.target.selectedIndex].text}`);
                
                // Store preference
                localStorage.setItem('preferredLanguage', selectedLanguage);
                
                // In a real app, trigger language change
                // window.location.href = `?lang=${selectedLanguage}`;
            });

            // Load saved preference
            const savedLanguage = localStorage.getItem('preferredLanguage');
            if (savedLanguage) {
                languageSelect.value = savedLanguage;
            }
        }

        // Currency Selector
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) {
            currencySelect.addEventListener('change', (e) => {
                const selectedCurrency = e.target.value;
                console.log('Currency changed to:', selectedCurrency);
                
                // Show notification
                showFooterNotification(`Currency changed to ${selectedCurrency}`);
                
                // Store preference
                localStorage.setItem('preferredCurrency', selectedCurrency);
                
                // In a real app, update all prices
                // updatePricesOnPage(selectedCurrency);
            });

            // Load saved preference
            const savedCurrency = localStorage.getItem('preferredCurrency');
            if (savedCurrency) {
                currencySelect.value = savedCurrency;
            }
        }

        // Popular Routes Quick Book
        const routeLinks = document.querySelectorAll('.route-link');
        routeLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                
                showFooterNotification(`Searching flights for ${route}...`);
                
                // In a real app, navigate to booking page with route
                setTimeout(() => {
                    console.log('Navigate to booking with route:', route);
                    // window.location.href = `booking.html?route=${route}`;
                }, 1000);
            });
        });

        // Social Media Tracking
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                
                const platform = icon.getAttribute('aria-label');
                console.log('Social media click:', platform);
                
                // Track with analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'social_click', {
                        'event_category': 'engagement',
                        'event_label': platform
                    });
                }
                
                // Show notification
                showFooterNotification(`Opening ${platform}...`);
            });
        });

        // Trust Badge Interactions
        const trustBadges = document.querySelectorAll('.trust-badge-item');
        trustBadges.forEach((badge, index) => {
            // Staggered animation on scroll
            badge.style.opacity = '0';
            badge.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                badge.style.transition = 'all 0.5s ease';
                badge.style.opacity = '1';
                badge.style.transform = 'translateY(0)';
            }, index * 100);

            // Hover effect with tooltip (optional)
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'translateY(-5px) scale(1.05)';
            });

            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Footer Links Smooth Scroll (for anchor links)
        const footerLinks = document.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }
        });

        // Notification Helper for Footer
        function showFooterNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 30px;
                background: linear-gradient(135deg, #1F2937, #374151);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: slideInUp 0.4s ease;
                font-size: 14px;
                font-weight: 600;
                border: 1px solid rgba(249, 115, 22, 0.3);
            `;
            notification.textContent = message;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInUp {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutDown 0.4s ease';
                notification.style.animationFillMode = 'forwards';
                
                const slideOutStyle = document.createElement('style');
                slideOutStyle.textContent = `
                    @keyframes slideOutDown {
                        from {
                            transform: translateY(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateY(100px);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(slideOutStyle);
                
                setTimeout(() => {
                    notification.remove();
                }, 400);
            }, 3000);
        }

        // Accessibility: Keyboard navigation for selectors
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open selectors
                if (document.activeElement.tagName === 'SELECT') {
                    document.activeElement.blur();
                }
            }
        });

        // Payment icons animation on hover
        const paymentIcons = document.querySelectorAll('.payment-icons i');
        paymentIcons.forEach((icon, index) => {
            icon.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
        });
    }

    // Initialize Footer
    if (document.querySelector('.destinova-footer-redesigned')) {
        initializeFooter();
    }

    // ... (rest of the existing code)
});