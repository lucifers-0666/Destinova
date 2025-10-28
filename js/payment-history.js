/* ═══════════════════════════════════════════════════════════════════
   DESTINOVA PAYMENT HISTORY - COMPLETE JAVASCRIPT
   Elegant, Smooth, Feature-Rich
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOCK PAYMENT DATA (In production, this comes from API)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const MOCK_PAYMENTS = [
    {
        id: 'PAY_Nf8Kj9sLp01',
        bookingRef: 'DEST789A',
        amount: 14256.00,
        status: 'success',
        date: '2025-10-15T10:30:00',
        method: 'card',
        methodDetails: 'Card ****1234',
        flightRoute: 'Delhi (DEL) → Mumbai (BOM)',
        travelDate: '2025-11-15',
        passengers: 2
    },
    {
        id: 'PAY_Xk3Nm2pQr02',
        bookingRef: 'DEST456B',
        amount: 18761.00,
        status: 'pending',
        date: '2025-10-14T14:20:00',
        method: 'upi',
        methodDetails: 'UPI: 9876543210@paytm',
        flightRoute: 'Mumbai (BOM) → Dubai (DXB)',
        travelDate: '2025-11-20',
        passengers: 1
    },
    {
        id: 'PAY_Qs9Lm5kTv03',
        bookingRef: 'DEST123C',
        amount: 12578.00,
        status: 'failed',
        date: '2025-10-13T09:15:00',
        method: 'netbanking',
        methodDetails: 'HDFC Bank',
        flightRoute: 'Delhi (DEL) → Bangalore (BLR)',
        travelDate: '2025-11-18',
        passengers: 1
    },
    {
        id: 'PAY_Rt6Hp8mWx04',
        bookingRef: 'DEST789D',
        amount: 20883.00,
        status: 'success',
        date: '2025-10-12T16:45:00',
        method: 'card',
        methodDetails: 'Card ****5678',
        flightRoute: 'Mumbai (BOM) → Singapore (SIN)',
        travelDate: '2025-12-05',
        passengers: 3
    },
    {
        id: 'PAY_Yv2Bn4cDz05',
        bookingRef: 'DEST999E',
        amount: 17852.00,
        status: 'refunded',
        date: '2025-10-10T11:30:00',
        method: 'wallet',
        methodDetails: 'Paytm Wallet',
        flightRoute: 'Delhi (DEL) → London (LHR)',
        travelDate: '2025-11-25',
        passengers: 2
    },
    {
        id: 'PAY_Pm7Qj3nRs06',
        bookingRef: 'DEST111F',
        amount: 21600.00,
        status: 'success',
        date: '2025-09-28T13:20:00',
        method: 'card',
        methodDetails: 'Card ****9012',
        flightRoute: 'Bangalore (BLR) → New York (JFK)',
        travelDate: '2025-10-30',
        passengers: 2
    },
    {
        id: 'PAY_Wb5Kt8hMs07',
        bookingRef: 'DEST222G',
        amount: 15360.00,
        status: 'success',
        date: '2025-09-20T10:15:00',
        method: 'upi',
        methodDetails: 'UPI: 8765432109@oksbi',
        flightRoute: 'Chennai (MAA) → Dubai (DXB)',
        travelDate: '2025-10-15',
        passengers: 1
    },
    {
        id: 'PAY_Lc9Nv6pXq08',
        bookingRef: 'DEST333H',
        amount: 19178.00,
        status: 'success',
        date: '2025-08-15T15:30:00',
        method: 'card',
        methodDetails: 'Card ****3456',
        flightRoute: 'Delhi (DEL) → Paris (CDG)',
        travelDate: '2025-09-10',
        passengers: 2
    }
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const STATE = {
    allPayments: MOCK_PAYMENTS,
    filteredPayments: MOCK_PAYMENTS,
    currentPage: 1,
    itemsPerPage: 10,
    filters: {
        search: '',
        status: 'all',
        method: 'all',
        sort: 'date-desc'
    },
    chart: null
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', function() {
    console.log('💳 Destinova Payment History - Initialized');
    
    updateSummaryCards();
    initializeChart();
    setupEventListeners();
    applyFilters();
    renderTransactions();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UPDATE SUMMARY CARDS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function updateSummaryCards() {
    const successPayments = STATE.allPayments.filter(p => p.status === 'success');
    const totalSpent = successPayments.reduce((sum, p) => sum + p.amount, 0);
    const avgTransaction = successPayments.length > 0 ? totalSpent / successPayments.length : 0;
    const pendingCount = STATE.allPayments.filter(p => p.status === 'pending').length;
    
    animateValue('total-spent', totalSpent, true);
    animateValue('total-transactions', STATE.allPayments.length, false);
    animateValue('avg-transaction', avgTransaction, true);
    animateValue('pending-count', pendingCount, false);
}

function animateValue(elementId, target, isCurrency) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            if (isCurrency) {
                element.textContent = `₹${target.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            } else {
                element.textContent = Math.round(target);
            }
            clearInterval(timer);
        } else {
            if (isCurrency) {
                element.textContent = `₹${Math.floor(current).toLocaleString('en-IN')}`;
            } else {
                element.textContent = Math.floor(current);
            }
        }
    }, stepTime);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INITIALIZE CHART
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function initializeChart() {
    const ctx = document.getElementById('spending-chart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    // Group payments by month
    const monthlyData = {};
    STATE.allPayments.forEach(payment => {
        if (payment.status === 'success') {
            const date = new Date(payment.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + payment.amount;
        }
    });
    
    const sortedMonths = Object.keys(monthlyData).sort().slice(-6);
    const labels = sortedMonths.map(m => {
        const [year, month] = m.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    const data = sortedMonths.map(m => monthlyData[m]);
    
    STATE.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Spending',
                data: data,
                borderColor: '#1d5e33',
                backgroundColor: 'rgba(29, 94, 51, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1d5e33',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(28, 37, 38, 0.95)',
                    titleColor: '#E5CBAF',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `₹${context.parsed.y.toLocaleString('en-IN')}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + (value / 1000) + 'k';
                        },
                        color: '#5C6B73'
                    },
                    grid: {
                        color: 'rgba(229, 203, 175, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#5C6B73'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT LISTENERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('search-transactions');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            STATE.filters.search = e.target.value.toLowerCase();
            applyFilters();
        });
    }
    
    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            STATE.filters.status = e.target.value;
            applyFilters();
        });
    }
    
    // Method filter
    const methodFilter = document.getElementById('payment-method-filter');
    if (methodFilter) {
        methodFilter.addEventListener('change', (e) => {
            STATE.filters.method = e.target.value;
            applyFilters();
        });
    }
    
    // Sort
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            STATE.filters.sort = e.target.value;
            applyFilters();
        });
    }
    
    // Chart filters
    document.querySelectorAll('.chart-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.chart-filter-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            // In production, update chart data based on period
        });
    });
    
    // Export buttons
    const exportPDF = document.getElementById('export-pdf');
    if (exportPDF) {
        exportPDF.addEventListener('click', () => {
            showNotification('PDF export feature coming soon!', 'info');
        });
    }
    
    const exportExcel = document.getElementById('export-excel');
    if (exportExcel) {
        exportExcel.addEventListener('click', () => {
            showNotification('Excel export feature coming soon!', 'info');
        });
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// APPLY FILTERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function applyFilters() {
    let filtered = STATE.allPayments;
    
    // Search
    if (STATE.filters.search) {
        filtered = filtered.filter(p => 
            p.id.toLowerCase().includes(STATE.filters.search) ||
            p.bookingRef.toLowerCase().includes(STATE.filters.search) ||
            p.flightRoute.toLowerCase().includes(STATE.filters.search)
        );
    }
    
    // Status filter
    if (STATE.filters.status !== 'all') {
        filtered = filtered.filter(p => p.status === STATE.filters.status);
    }
    
    // Method filter
    if (STATE.filters.method !== 'all') {
        filtered = filtered.filter(p => p.method === STATE.filters.method);
    }
    
    // Sort
    switch (STATE.filters.sort) {
        case 'date-desc':
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'amount-desc':
            filtered.sort((a, b) => b.amount - a.amount);
            break;
        case 'amount-asc':
            filtered.sort((a, b) => a.amount - b.amount);
            break;
    }
    
    STATE.filteredPayments = filtered;
    STATE.currentPage = 1;
    renderTransactions();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RENDER TRANSACTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderTransactions() {
    const container = document.getElementById('transactions-list');
    const emptyState = document.getElementById('empty-state');
    
    if (STATE.filteredPayments.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    const startIndex = (STATE.currentPage - 1) * STATE.itemsPerPage;
    const endIndex = startIndex + STATE.itemsPerPage;
    const pagePayments = STATE.filteredPayments.slice(startIndex, endIndex);
    
    container.innerHTML = pagePayments.map((payment, index) => 
        renderTransactionCard(payment, index)
    ).join('');
    
    renderPagination();
    setupTransactionActions();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RENDER TRANSACTION CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderTransactionCard(payment, index) {
    const date = new Date(payment.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', { 
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const travelDate = new Date(payment.travelDate);
    const formattedTravelDate = travelDate.toLocaleDateString('en-US', { 
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    const delay = index * 0.1;
    
    return `
        <div class="transaction-card ${payment.status}" style="animation-delay: ${delay}s;">
            <div class="transaction-header">
                <div>
                    <div class="transaction-id">Txn ID: ${payment.id}</div>
                    <div class="transaction-date">${formattedDate}, ${formattedTime}</div>
                </div>
                <span class="status-pill ${payment.status}">${payment.status}</span>
            </div>
            
            <div class="transaction-details">
                <div class="detail-left">
                    <div class="detail-item">
                        <strong>Booking Ref:</strong> ${payment.bookingRef}
                    </div>
                    <div class="detail-item">
                        <strong>Flight:</strong> ${payment.flightRoute}
                    </div>
                    <div class="detail-item">
                        <strong>Travel Date:</strong> ${formattedTravelDate}
                    </div>
                    <div class="detail-item">
                        <strong>Passengers:</strong> ${payment.passengers} ${payment.passengers > 1 ? 'Adults' : 'Adult'}
                    </div>
                </div>
                
                <div class="detail-right">
                    <div class="transaction-amount">₹${payment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <div class="payment-method">
                        <i class="fas fa-${getPaymentIcon(payment.method)}"></i>
                        <span>${payment.methodDetails}</span>
                    </div>
                </div>
            </div>
            
            <div class="transaction-actions">
                ${payment.status === 'success' ? `
                    <button class="action-btn-small primary view-receipt" data-id="${payment.id}">
                        <i class="fas fa-receipt"></i>
                        <span>View Receipt</span>
                    </button>
                    <button class="action-btn-small download-invoice" data-id="${payment.id}">
                        <i class="fas fa-download"></i>
                        <span>Download Invoice</span>
                    </button>
                ` : payment.status === 'failed' ? `
                    <button class="action-btn-small retry-payment" data-id="${payment.id}">
                        <i class="fas fa-redo"></i>
                        <span>Retry Payment</span>
                    </button>
                    <button class="action-btn-small view-details" data-id="${payment.id}">
                        <i class="fas fa-info-circle"></i>
                        <span>View Details</span>
                    </button>
                ` : payment.status === 'pending' ? `
                    <button class="action-btn-small check-status" data-id="${payment.id}">
                        <i class="fas fa-sync"></i>
                        <span>Check Status</span>
                    </button>
                ` : `
                    <button class="action-btn-small view-details" data-id="${payment.id}">
                        <i class="fas fa-info-circle"></i>
                        <span>Refund Details</span>
                    </button>
                `}
            </div>
        </div>
    `;
}

function getPaymentIcon(method) {
    switch(method) {
        case 'card': return 'credit-card';
        case 'upi': return 'mobile-alt';
        case 'netbanking': return 'university';
        case 'wallet': return 'wallet';
        default: return 'credit-card';
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGINATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function renderPagination() {
    const container = document.getElementById('pagination-container');
    const totalPages = Math.ceil(STATE.filteredPayments.length / STATE.itemsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button class="page-btn" ${STATE.currentPage === 1 ? 'disabled' : ''} onclick="changePage(${STATE.currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= STATE.currentPage - 1 && i <= STATE.currentPage + 1)) {
            html += `<button class="page-btn ${i === STATE.currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === STATE.currentPage - 2 || i === STATE.currentPage + 2) {
            html += `<span style="padding: 0 8px; color: var(--text-muted);">...</span>`;
        }
    }
    
    // Next button
    html += `<button class="page-btn" ${STATE.currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${STATE.currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    container.innerHTML = html;
}

function changePage(page) {
    const totalPages = Math.ceil(STATE.filteredPayments.length / STATE.itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    STATE.currentPage = page;
    renderTransactions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TRANSACTION ACTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function setupTransactionActions() {
    document.querySelectorAll('.view-receipt').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            window.location.href = `/booking-confirmation.html?payment=${id}`;
        });
    });
    
    document.querySelectorAll('.download-invoice').forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Invoice downloaded successfully!', 'success');
        });
    });
    
    document.querySelectorAll('.retry-payment').forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Redirecting to payment gateway...', 'info');
        });
    });
    
    document.querySelectorAll('.check-status').forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Payment is being processed...', 'info');
        });
    });
    
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', () => {
            showNotification('Details view coming soon!', 'info');
        });
    });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#1d5e33'};
        color: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(29, 94, 51, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        max-width: 300px;
        font-family: 'Poppins', sans-serif;
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    notification.innerHTML = `${icon} ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('💳 Destinova Payment History - All Systems Active');
