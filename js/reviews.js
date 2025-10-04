document.addEventListener('DOMContentLoaded', function () {
    // --- Global State ---
    let reviewsData = [];
    let filteredReviews = [];
    let currentPage = 1;
    const reviewsPerPage = 12;

    // --- DOM Elements ---
    const reviewsContainer = document.getElementById('reviews-container');
    const paginationContainer = document.getElementById('pagination-container');
    const writeReviewBtn = document.getElementById('write-review-btn');
    const modal = document.getElementById('write-review-modal');
    const closeModalBtn = modal.querySelector('.modal-close-btn');
    const reviewForm = document.getElementById('review-form');
    const charCounter = document.getElementById('char-counter');
    const reviewTextarea = document.getElementById('review-text-input');
    const searchInput = document.getElementById('search-reviews');

    // --- MOCK API & DATA ---
    // In a real app, this would be a fetch call to a server.
    const mockApi = {
        fetchReviews: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // Generate more mock data for pagination
            const sampleReviews = Array.from({ length: 50 }, (_, i) => ({
                id: i + 1,
                author: `Traveler ${i + 1}`,
                avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i}.jpg`,
                location: 'Some City, Country',
                memberSince: 2022,
                rating: Math.floor(Math.random() * 3) + 3, // 3 to 5 stars
                date: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString().split('T')[0],
                flight: { route: 'DEL → BOM', number: `DN${500 + i}`, date: '2024-05-10', class: i % 3 === 0 ? 'Business' : 'Economy' },
                title: `Review Title ${i + 1}`,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(Math.random() * 5 + 2),
                helpful: { up: Math.floor(Math.random() * 50), down: Math.floor(Math.random() * 5) },
                isVerified: Math.random() > 0.3,
                adminResponse: i % 5 === 0 ? { text: 'Thank you for your feedback!', date: '2024-05-11' } : null,
            }));
            return sampleReviews;
        },
        submitReview: async (reviewData) => {
            console.log("Submitting review:", reviewData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true, message: "Review submitted for moderation." };
        }
    };

    // --- Core Functions ---

    /**
     * Fetches reviews, populates data, and triggers initial render.
     */
    async function loadReviews() {
        reviewsData = await mockApi.fetchReviews();
        filteredReviews = [...reviewsData];
        renderStatistics();
        renderPage();
    }

    /**
     * Renders the current page of reviews and updates pagination.
     */
    function renderPage() {
        renderReviews();
        updatePagination();
    }

    /**
     * Renders the review cards for the current page.
     */
    function renderReviews() {
        reviewsContainer.innerHTML = ''; // Clear existing reviews
        const start = (currentPage - 1) * reviewsPerPage;
        const end = start + reviewsPerPage;
        const paginatedReviews = filteredReviews.slice(start, end);

        if (paginatedReviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="no-reviews-message">No reviews match your criteria.</p>';
            return;
        }

        paginatedReviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card';
            card.innerHTML = `
                <div class="user-profile">
                    <img src="${review.avatar}" alt="${review.author}">
                    <div class="user-info">
                        <span class="user-name">${review.author} ${review.isVerified ? '<i class="fas fa-check-circle verified-badge" title="Verified Booking"></i>' : ''}</span>
                        <span class="user-meta">from ${review.location} • Member since ${review.memberSince}</span>
                    </div>
                </div>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                <p class="review-date">Reviewed on: ${new Date(review.date).toLocaleDateString()}</p>
                <p class="flight-details">Flight: ${review.flight.route}, ${review.flight.number}, ${review.flight.date} (${review.flight.class})</p>
                <h3 class="review-title">${review.title}</h3>
                <p class="review-text">${review.text}</p>
                <div class="helpful-section">
                    <span>Was this helpful?</span>
                    <div class="helpful-buttons">
                        <button class="helpful-btn" data-review-id="${review.id}" data-action="up"><i class="fas fa-thumbs-up"></i> Yes (${review.helpful.up})</button>
                        <button class="helpful-btn" data-review-id="${review.id}" data-action="down"><i class="fas fa-thumbs-down"></i> No (${review.helpful.down})</button>
                    </div>
                </div>
                ${review.adminResponse ? `
                <div class="admin-response">
                    <img src="../site-images/favicon.png" alt="Destinova Logo" class="admin-logo">
                    <div class="admin-response-content">
                        <p class="response-text">"${review.adminResponse.text}"</p>
                        <p class="response-date">- The Destinova Team, ${new Date(review.adminResponse.date).toLocaleDateString()}</p>
                    </div>
                </div>` : ''}
            `;
            reviewsContainer.appendChild(card);
        });
    }

    /**
     * Updates the pagination controls based on filtered reviews.
     */
    function updatePagination() {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(filteredReviews.length / reviewsPerPage);
        if (pageCount <= 1) return;

        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = (i === currentPage) ? 'active' : '';
            button.addEventListener('click', () => {
                currentPage = i;
                renderPage();
                window.scrollTo(0, reviewsContainer.offsetTop - 100);
            });
            paginationContainer.appendChild(button);
        }
    }

    /**
     * Applies all active filters and re-renders the reviews.
     */
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedRatings = [...document.querySelectorAll('.rating-filter-group input:checked')].map(el => parseInt(el.value));
        const selectedClass = document.getElementById('class-filter').value;
        const verifiedOnly = document.getElementById('verified-only-toggle').checked;

        filteredReviews = reviewsData.filter(review => {
            const matchesSearch = searchTerm === '' || review.title.toLowerCase().includes(searchTerm) || review.text.toLowerCase().includes(searchTerm);
            const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(review.rating);
            const matchesClass = selectedClass === 'all' || review.flight.class === selectedClass;
            const matchesVerified = !verifiedOnly || review.isVerified;
            return matchesSearch && matchesRating && matchesClass && matchesVerified;
        });

        sortReviews(); // Apply current sort
        currentPage = 1;
        renderPage();
    }

    /**
     * Sorts the `filteredReviews` array based on the selected criteria.
     */
    function sortReviews() {
        const sortBy = document.getElementById('sort-reviews').value;
        switch (sortBy) {
            case 'highest':
                filteredReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                filteredReviews.sort((a, b) => a.rating - b.rating);
                break;
            case 'helpful':
                filteredReviews.sort((a, b) => b.helpful.up - a.helpful.up);
                break;
            case 'recent':
            default:
                filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }
    }

    // --- Modal Functions ---

    function openReviewModal() {
        modal.style.display = 'flex';
        setTimeout(() => modal.style.opacity = 1, 10);
        document.body.style.overflow = 'hidden';
    }

    function closeReviewModal() {
        modal.style.opacity = 0;
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            reviewForm.reset();
            charCounter.textContent = '500 characters remaining';
        }, 300);
    }

    // --- Event Listeners ---

    // Modal listeners
    writeReviewBtn.addEventListener('click', openReviewModal);
    closeModalBtn.addEventListener('click', closeReviewModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeReviewModal();
        }
    });

    // Character counter
    reviewTextarea.addEventListener('input', () => {
        const remaining = 500 - reviewTextarea.value.length;
        charCounter.textContent = `${remaining} characters remaining`;
    });

    // Filter listeners
    document.getElementById('sort-reviews').addEventListener('change', () => {
        sortReviews();
        renderPage();
    });

    document.querySelectorAll('.rating-filter-group input, #class-filter, #verified-only-toggle').forEach(el => {
        el.addEventListener('change', applyFilters);
    });

    // Debounced search
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    });

    // Rating bar click to filter
    document.querySelectorAll('.rating-bar').forEach(bar => {
        bar.addEventListener('click', () => {
            const rating = bar.dataset.rating;
            const checkbox = document.querySelector(`.rating-filter-group input[value="${rating}"]`);
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                applyFilters();
            }
        });
    });

    // Form submission
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submit-review-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        const formData = {
            bookingId: reviewForm.querySelector('#booking-select').value,
            rating: reviewForm.querySelector('#rating-value').value,
            title: reviewForm.querySelector('#review-title-input').value,
            text: reviewForm.querySelector('#review-text-input').value,
            recommend: reviewForm.querySelector('#recommend-checkbox').checked,
        };

        const result = await mockApi.submitReview(formData);

        if (result.success) {
            submitBtn.style.backgroundColor = 'var(--primary-emerald)';
            submitBtn.textContent = 'Success!';
            setTimeout(() => {
                closeReviewModal();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Review';
                loadReviews(); // Refresh reviews
            }, 2000);
        } else {
            // Handle error
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
            alert('Submission failed. Please try again.');
        }
    });

    // Interactive star rating
    const stars = modal.querySelectorAll('.interactive-rating i');
    stars.forEach(star => {
        star.addEventListener('mouseover', () => {
            const value = star.dataset.value;
            stars.forEach(s => {
                s.classList.toggle('hovered', s.dataset.value <= value);
            });
        });
        star.addEventListener('mouseout', () => {
            stars.forEach(s => s.classList.remove('hovered'));
        });
        star.addEventListener('click', () => {
            const value = star.dataset.value;
            document.getElementById('rating-value').value = value;
            stars.forEach(s => {
                s.classList.toggle('selected', s.dataset.value <= value);
            });
            validateForm();
        });
    });

    // Form validation
    function validateForm() {
        const booking = reviewForm.querySelector('#booking-select').value;
        const rating = reviewForm.querySelector('#rating-value').value;
        const title = reviewForm.querySelector('#review-title-input').value;
        const text = reviewForm.querySelector('#review-text-input').value;
        const submitBtn = document.getElementById('submit-review-btn');

        const isValid = booking && rating > 0 && title.length >= 5 && text.length >= 20;
        submitBtn.disabled = !isValid;
    }
    reviewForm.addEventListener('input', validateForm);

    // --- Dummy/Placeholder Functions from Prompt ---
    function renderStatistics() { console.log("Rendering statistics..."); }
    function toggleShowMore(reviewId) { console.log(`Toggling show more for review ${reviewId}`); }
    function markHelpful(reviewId, isHelpful) { console.log(`Marking review ${reviewId} as helpful: ${isHelpful}`); }
    function loadUserBookings() { console.log("Loading user bookings..."); }
    function handlePhotoUpload(files) { console.log("Handling photo upload:", files); }
    function reportReview(reviewId) { console.log(`Reporting review ${reviewId}`); }

    // --- Initial Load ---
    loadReviews();
});