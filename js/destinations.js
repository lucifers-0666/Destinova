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
    // PAGE-SPECIFIC: TRAVEL YOUR WAY INTERACTIVITY
    // =============================================
    function initializeTravelStylesAndModal() {
        const themeCards = document.querySelectorAll('.theme-card');
        const modalContainer = document.getElementById('style-modal-container');
        const popularDestinationsSection = document.getElementById('popular-destinations');
        const destinationCards = document.querySelectorAll('#popular-destinations .destination-card');

        if (themeCards.length === 0 || !modalContainer) return;

        const modalContent = {
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
    // PAGE-SPECIFIC: INSPIRATION CARD GLOW EFFECT
    // =============================================
    function initializeInspirationSection() {
        const inspirationCards = document.querySelectorAll('.inspiration-card');
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
    // LIVE ACTIVITY NOTIFICATIONS
    // =============================================
    function initializeLiveActivityFeed() {
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


    // ... (rest of the existing code)
});