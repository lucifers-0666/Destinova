document.addEventListener('DOMContentLoaded', function () {
    // --- Global State ---
    let faqData = [];
    let currentCategory = 'all';

    // --- DOM Elements ---
    const faqContent = document.getElementById('faq-content');
    const popularList = document.getElementById('popular-questions-list');
    const searchInput = document.getElementById('faq-search');
    const tabButtons = document.querySelectorAll('.faq-tab-btn');
    const emailSupportBtn = document.getElementById('email-support-btn');
    const liveChatBtn = document.getElementById('live-chat-btn');
    const chatStatus = document.getElementById('chat-status');

    // --- Mock Data ---
    const mockFaqData = [
        { id: 'how-to-book', category: 'booking', question: 'How do I book a flight?', answer: 'You can book a flight easily through our homepage. Simply enter your departure and arrival cities, travel dates, and number of passengers, then click "Search Flights". You\'ll be presented with a list of available flights to choose from.', popularity: 100 },
        { id: 'payment-methods', category: 'booking', question: 'What payment methods do you accept?', answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), Net Banking, UPI, and popular digital wallets. All transactions are secure and encrypted.', popularity: 80 },
        { id: 'cancellation-policy', category: 'cancellation', question: 'What is your cancellation policy?', answer: 'Our cancellation policy depends on the fare type you purchased. Flexible fares can be canceled free of charge up to 24 hours before departure. Standard fares may incur a cancellation fee. You can review the specific policy for your booking in the "Manage Booking" section.', popularity: 95 },
        { id: 'refund-timeline', category: 'cancellation', question: 'How long do refunds take?', answer: 'Once a refund is approved, it is typically processed back to the original payment method within 7-10 business days. You will receive an email confirmation once the refund has been initiated.', popularity: 70 },
        { id: 'baggage-allowance', category: 'checkin', question: 'What is the baggage allowance?', answer: 'Baggage allowance varies by travel class and destination. Typically, Economy class allows one checked bag up to 23kg, while Business and First Class offer more generous allowances. You can find specific details on your e-ticket or in the "Manage Booking" section.', popularity: 90 },
        { id: 'online-checkin', category: 'checkin', question: 'How do I check-in online?', answer: 'Online check-in opens 48 hours before your flight\'s scheduled departure. Visit the "Check-in" page on our website and enter your booking reference and last name to proceed. You can select your seat and get your boarding pass.', popularity: 85 },
        { id: 'reset-password', category: 'account', question: 'How do I reset my password?', answer: 'If you\'ve forgotten your password, click on the "Sign In" button and then select the "Forgot Password?" link. Enter your registered email address, and we\'ll send you instructions to reset it.', popularity: 60 },
        { id: 'group-bookings', category: 'general', question: 'Do you offer group bookings?', answer: 'Yes, we do! For bookings of 10 or more passengers, please contact our dedicated group bookings team through our <a href="contact.html">Contact Us</a> page for special fares and assistance.', popularity: 50 },
    ];

    // --- Core Functions ---

    /**
     * Fetches and loads all FAQ data.
     */
    async function loadFAQs() {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        faqData = mockFaqData;
        renderFAQs();
        loadPopularQuestions();
    }

    /**
     * Renders FAQ items based on the current category or search query.
     * @param {Array} dataToRender - The array of FAQ items to display.
     */
    function renderFAQs(dataToRender = faqData) {
        faqContent.innerHTML = '';
        const categories = [...new Set(dataToRender.map(item => item.category))];

        categories.forEach(category => {
            const categoryData = dataToRender.filter(item => item.category === category);
            if (categoryData.length === 0) return;

            const categorySection = document.createElement('div');
            categorySection.className = 'faq-category-section';
            categorySection.id = `category-${category}`;
            
            const categoryTitle = document.createElement('h2');
            categoryTitle.textContent = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            categorySection.appendChild(categoryTitle);

            categoryData.forEach(item => {
                const faqItem = document.createElement('div');
                faqItem.className = 'faq-item';
                faqItem.id = item.id;
                faqItem.innerHTML = `
                    <div class="faq-question">
                        <h3>${item.question}</h3>
                        <div class="faq-icon"><i class="fas fa-plus"></i></div>
                    </div>
                    <div class="faq-answer">
                        <p>${item.answer}</p>
                    </div>
                `;
                categorySection.appendChild(faqItem);
            });
            faqContent.appendChild(categorySection);
        });

        addAccordionListeners();
    }

    /**
     * Toggles the active state of an FAQ item.
     * @param {HTMLElement} element - The .faq-question element that was clicked.
     */
    function toggleFAQ(element) {
        const item = element.parentElement;
        item.classList.toggle('active');
    }

    /**
     * Adds click listeners to all FAQ questions for the accordion effect.
     */
    function addAccordionListeners() {
        faqContent.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => toggleFAQ(question));
        });
    }

    /**
     * Filters FAQs based on a search query.
     * @param {string} query - The search term.
     */
    function searchFAQs(query) {
        const lowerCaseQuery = query.toLowerCase();
        if (!lowerCaseQuery) {
            renderFAQs(faqData.filter(item => currentCategory === 'all' || item.category === currentCategory));
            return;
        }

        const filtered = faqData.filter(item =>
            item.question.toLowerCase().includes(lowerCaseQuery) ||
            item.answer.toLowerCase().includes(lowerCaseQuery)
        );
        renderFAQs(filtered);
    }

    /**
     * Filters FAQs by the selected category.
     * @param {string} category - The category to filter by.
     */
    function filterByCategory(category) {
        currentCategory = category;
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const dataToRender = category === 'all' ? faqData : faqData.filter(item => item.category === category);
        renderFAQs(dataToRender);
    }

    /**
     * Loads and displays the most popular questions.
     */
    function loadPopularQuestions() {
        const popular = [...faqData].sort((a, b) => b.popularity - a.popularity).slice(0, 5);
        popularList.innerHTML = '';
        popular.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check-circle"></i><a href="#${item.id}">${item.question}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                const targetElement = document.getElementById(item.id);
                if (targetElement) {
                    filterByCategory(item.category);
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        if (!targetElement.classList.contains('active')) {
                            targetElement.querySelector('.faq-question').click();
                        }
                    }, 100);
                }
            });
            popularList.appendChild(li);
        });
    }

    /**
     * Checks support hours and updates chat button status.
     */
    function checkSupportAvailability() {
        const now = new Date();
        const hour = now.getHours();
        // Mock support hours: 9 AM to 6 PM (18:00)
        if (hour >= 9 && hour < 18) {
            liveChatBtn.disabled = false;
            chatStatus.textContent = 'Available Now';
        } else {
            liveChatBtn.disabled = true;
            liveChatBtn.textContent = 'Chat Offline';
            chatStatus.textContent = 'Offline - Email us instead';
        }
    }

    // --- Event Listeners ---

    // Search with debounce
    let debounceTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => searchFAQs(searchInput.value), 300);
    });

    // Category tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => filterByCategory(btn.dataset.category));
    });

    // Help section buttons
    emailSupportBtn.addEventListener('click', () => window.location.href = 'contact.html');
    liveChatBtn.addEventListener('click', () => alert('Live chat initiated! (Demo)'));

    // --- Initial Load ---
    loadFAQs();
    checkSupportAvailability();
});