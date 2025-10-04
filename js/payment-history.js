document.addEventListener('DOMContentLoaded', function () {
    // --- Global State ---
    let transactionsData = [];
    let filteredTransactions = [];
    let currentPage = 1;
    const transactionsPerPage = 10;

    // --- DOM Elements ---
    const transactionsList = document.getElementById('transactions-list');
    const paginationContainer = document.getElementById('pagination-container');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-transactions');
    const statusFilter = document.getElementById('status-filter');
    const methodFilter = document.getElementById('payment-method-filter');
    const sortSelect = document.getElementById('sort-by');

    // --- MOCK API & DATA ---
    const mockApi = {
        fetchPayments: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const statuses = ['Success', 'Failed', 'Pending', 'Refunded'];
            const methods = ['Card', 'UPI', 'Net Banking', 'Wallet'];
            return Array.from({ length: 35 }, (_, i) => ({
                id: `PAY_Nf8Kj9sLp${String(i).padStart(3, '0')}`,
                date: new Date(Date.now() - i * 1000 * 60 * 60 * 24 * 5).toISOString(),
                status: statuses[i % statuses.length],
                amount: Math.floor(Math.random() * 20000) + 5000,
                bookingRef: `DN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                route: 'Delhi (DEL) → Mumbai (BOM)',
                travelDate: '2024-08-15',
                passengers: 2,
                paymentMethod: methods[i % methods.length],
                paymentDetail: '**** **** **** 1234',
            }));
        }
    };

    // --- Core Functions ---

    /**
     * Fetches transactions, populates data, and triggers initial render.
     */
    async function loadTransactions() {
        transactionsData = await mockApi.fetchPayments();
        filteredTransactions = [...transactionsData];
        updateSummary();
        renderPage();
    }

    /**
     * Renders the current page of transactions and updates pagination.
     */
    function renderPage() {
        renderTransactions();
        updatePagination();
    }

    /**
     * Renders transaction cards for the current page.
     */
    function renderTransactions() {
        transactionsList.innerHTML = '';
        if (filteredTransactions.length === 0) {
            emptyState.style.display = 'block';
            transactionsList.style.display = 'none';
            paginationContainer.innerHTML = '';
            return;
        }

        emptyState.style.display = 'none';
        transactionsList.style.display = 'flex';

        const start = (currentPage - 1) * transactionsPerPage;
        const end = start + transactionsPerPage;
        const paginatedTransactions = filteredTransactions.slice(start, end);

        paginatedTransactions.forEach(txn => {
            const card = document.createElement('div');
            card.className = `transaction-card ${txn.status.toLowerCase()}`;
            card.innerHTML = `
                <div class="transaction-header">
                    <span class="transaction-id">Txn ID: ${txn.id}</span>
                    <span class="transaction-date">${formatDate(txn.date)}</span>
                    <span class="status-badge ${txn.status.toLowerCase()}">${txn.status}</span>
                </div>
                <div class="transaction-body">
                    <div class="transaction-details">
                        <p><strong>Booking Ref:</strong> <a href="#">${txn.bookingRef}</a></p>
                        <p><strong>Flight:</strong> ${txn.route}</p>
                        <p><strong>Travel Date:</strong> ${txn.travelDate}</p>
                        <p><strong>Passengers:</strong> ${txn.passengers} Adults</p>
                    </div>
                    <div class="payment-info">
                        <span class="payment-amount">${formatCurrency(txn.amount)}</span>
                        <div class="payment-method">
                            ${handlePaymentMethodIcon(txn.paymentMethod)}
                            <span>${txn.paymentMethod}: ${txn.paymentDetail}</span>
                        </div>
                    </div>
                </div>
                <div class="transaction-actions">
                    <button class="action-btn" data-txn-id="${txn.id}">View Receipt</button>
                    <button class="action-btn" data-txn-id="${txn.id}">Download Invoice</button>
                    <button class="action-btn" data-txn-id="${txn.id}">Raise Issue</button>
                    <button class="expand-btn" data-txn-id="${txn.id}">View Details <i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="expandable-details">
                    <p>Detailed breakdown and timeline for transaction ${txn.id} will be shown here.</p>
                </div>
            `;
            transactionsList.appendChild(card);
        });
    }

    /**
     * Updates the pagination controls.
     */
    function updatePagination() {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(filteredTransactions.length / transactionsPerPage);
        if (pageCount <= 1) return;

        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = (i === currentPage) ? 'active' : '';
            button.addEventListener('click', () => {
                currentPage = i;
                renderPage();
                window.scrollTo(0, transactionsList.offsetTop - 100);
            });
            paginationContainer.appendChild(button);
        }
    }

    /**
     * Applies all active filters and re-renders the list.
     */
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;
        const selectedMethod = methodFilter.value;

        filteredTransactions = transactionsData.filter(txn => {
            const matchesSearch = searchTerm === '' || txn.id.toLowerCase().includes(searchTerm) || txn.bookingRef.toLowerCase().includes(searchTerm);
            const matchesStatus = selectedStatus === 'all' || txn.status === selectedStatus;
            const matchesMethod = selectedMethod === 'all' || txn.paymentMethod === selectedMethod;
            return matchesSearch && matchesStatus && matchesMethod;
        });

        sortTransactions(); // Apply current sort
        currentPage = 1;
        renderPage();
    }

    /**
     * Sorts the `filteredTransactions` array.
     */
    function sortTransactions() {
        const sortBy = sortSelect.value;
        switch (sortBy) {
            case 'amount-high':
                filteredTransactions.sort((a, b) => b.amount - a.amount);
                break;
            case 'amount-low':
                filteredTransactions.sort((a, b) => a.amount - b.amount);
                break;
            case 'date-oldest':
                filteredTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'date-newest':
            default:
                filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }
    }

    // --- Helper Functions ---
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    }

    function handlePaymentMethodIcon(method) {
        switch (method) {
            case 'Card': return '<i class="fab fa-cc-visa"></i>';
            case 'UPI': return '<i class="fas fa-mobile-alt"></i>';
            case 'Net Banking': return '<i class="fas fa-university"></i>';
            case 'Wallet': return '<i class="fas fa-wallet"></i>';
            default: return '';
        }
    }

    // --- Event Listeners ---
    let debounceTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(applyFilters, 300);
    });

    [statusFilter, methodFilter, sortSelect].forEach(el => {
        el.addEventListener('change', applyFilters);
    });

    transactionsList.addEventListener('click', (e) => {
        if (e.target.closest('.expand-btn')) {
            const btn = e.target.closest('.expand-btn');
            const card = btn.closest('.transaction-card');
            const details = card.querySelector('.expandable-details');
            btn.classList.toggle('active');
            details.classList.toggle('active');
        }
    });

    // --- Dummy/Placeholder Functions ---
    function updateSummary() { console.log("Updating summary cards..."); }

    // --- Initial Load ---
    loadTransactions();
});