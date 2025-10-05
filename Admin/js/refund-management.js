document.addEventListener('DOMContentLoaded', () => {
    // Mock Data
    const mockRefunds = Array.from({ length: 88 }, (_, i) => {
        const statuses = ['Pending', 'Approved', 'Rejected', 'Processing', 'Completed'];
        const priorities = ['High', 'Medium', 'Low'];
        const reasons = ['Medical Emergency', 'Flight Cancelled by Airline', 'Change of Plans', 'Booking Error'];
        const originalAmount = Math.floor(Math.random() * 20000) + 5000;
        const cancellationCharges = originalAmount * (Math.random() * 0.25);
        return {
            id: `RF${90125 + i}`,
            requestDate: new Date(new Date() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            bookingRef: `DN${75200 + i}`,
            userName: `User ${1001 + i}`,
            userEmail: `user${1001 + i}@example.com`,
            flightDetails: 'DEL → BOM, DN-101',
            cancellationReason: reasons[i % reasons.length],
            originalAmount: originalAmount,
            cancellationCharges: cancellationCharges,
            refundAmount: originalAmount - cancellationCharges,
            status: statuses[i % statuses.length],
            priority: priorities[i % priorities.length],
        };
    });

    // Global State
    let refundsData = [];
    let filteredRefunds = [];
    let currentPage = 1;
    const refundsPerPage = 15;

    // DOM Elements
    const tableBody = document.getElementById('refund-table-body');
    const paginationContainer = document.getElementById('pagination-container');
    const detailsModal = document.getElementById('refund-details-modal');
    const approvalModal = document.getElementById('approval-modal');
    const rejectionModal = document.getElementById('rejection-modal');

    // --- Main Functions ---

    function loadRefunds() {
        showSkeletonLoader();
        // API Simulation
        setTimeout(() => {
            refundsData = mockRefunds;
            filteredRefunds = [...refundsData];
            updateStatistics();
            renderRefunds();
        }, 1000);
    }

    function renderRefunds() {
        tableBody.innerHTML = '';
        if (filteredRefunds.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 20px;">No refunds found.</td></tr>`;
            updatePagination();
            return;
        }

        const startIndex = (currentPage - 1) * refundsPerPage;
        const endIndex = startIndex + refundsPerPage;
        const paginatedRefunds = filteredRefunds.slice(startIndex, endIndex);

        paginatedRefunds.forEach(refund => {
            const tr = document.createElement('tr');
            tr.dataset.refundId = refund.id;
            tr.innerHTML = `
                <td>${refund.id}</td>
                <td>${new Date(refund.requestDate).toLocaleString()}</td>
                <td><a href="#" class="booking-ref-link">${refund.bookingRef}</a></td>
                <td>
                    <div>${refund.userName}</div>
                    <small class="text-slate-500">${refund.userEmail}</small>
                </td>
                <td>${refund.flightDetails}</td>
                <td class="refund-amount">₹${refund.refundAmount.toFixed(2)}</td>
                <td>
                    <div class="priority-indicator">
                        <span class="priority-dot priority-${refund.priority.toLowerCase()}"></span>
                        ${refund.priority}
                    </div>
                </td>
                <td><span class="status-badge status-${refund.status.toLowerCase()}">${refund.status}</span></td>
                <td class="action-buttons">
                    <button class="action-view" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="action-approve" title="Approve" ${refund.status !== 'Pending' ? 'disabled' : ''}><i class="fas fa-check"></i></button>
                    <button class="action-reject" title="Reject" ${refund.status !== 'Pending' ? 'disabled' : ''}><i class="fas fa-times"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        updatePagination();
    }

    function filterAndSort() {
        const searchTerm = document.getElementById('search-refunds').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;
        const sortBy = document.getElementById('sort-by').value;

        let tempRefunds = refundsData.filter(refund => {
            const matchesSearch = searchTerm === '' ||
                refund.bookingRef.toLowerCase().includes(searchTerm) ||
                refund.userEmail.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        switch (sortBy) {
            case 'newest': tempRefunds.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)); break;
            case 'oldest': tempRefunds.sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate)); break;
            case 'amount-high-low': tempRefunds.sort((a, b) => b.refundAmount - a.refundAmount); break;
            case 'amount-low-high': tempRefunds.sort((a, b) => a.refundAmount - b.refundAmount); break;
        }

        filteredRefunds = tempRefunds;
        currentPage = 1;
        renderRefunds();
    }

    function updateStatistics() {
        document.getElementById('pending-requests-stat').textContent = refundsData.filter(r => r.status === 'Pending').length;
        // This would need more complex date logic in a real app
        document.getElementById('approved-today-stat').textContent = refundsData.filter(r => r.status === 'Approved').length % 5; // Mock
        const totalRefunded = refundsData.filter(r => r.status === 'Completed').reduce((sum, r) => sum + r.refundAmount, 0);
        document.getElementById('total-refunded-stat').textContent = `₹${(totalRefunded / 1000).toFixed(1)}k`;
        document.getElementById('avg-time-stat').textContent = '2.5d'; // Mock
    }

    function updatePagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(filteredRefunds.length / refundsPerPage);
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) pageBtn.classList.add('active');
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderRefunds();
            });
            paginationContainer.appendChild(pageBtn);
        }
    }

    function showSkeletonLoader() {
        tableBody.innerHTML = '';
        for (let i = 0; i < refundsPerPage; i++) {
            const tr = document.createElement('tr');
            tr.classList.add('skeleton-row');
            tr.innerHTML = `
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text"></div></td>
            `;
            tableBody.appendChild(tr);
        }
    }

    // --- Modal Logic ---

    function showModal(modalElem) { modalElem.classList.add('visible'); }
    function hideModal(modalElem) { modalElem.classList.remove('visible'); }

    function openDetailsModal(refundId) {
        const refund = refundsData.find(r => r.id === refundId);
        if (!refund) return;

        // Populate modal fields
        document.getElementById('modal-booking-ref').textContent = refund.bookingRef;
        document.getElementById('modal-user-name').textContent = refund.userName;
        document.getElementById('modal-user-email').textContent = refund.userEmail;
        document.getElementById('modal-flight-details').textContent = refund.flightDetails;
        document.getElementById('modal-original-amount').textContent = `₹${refund.originalAmount.toFixed(2)}`;
        document.getElementById('modal-cancellation-reason').textContent = refund.cancellationReason;

        document.getElementById('calc-original').textContent = `₹${refund.originalAmount.toFixed(2)}`;
        document.getElementById('calc-charges').textContent = `- ₹${refund.cancellationCharges.toFixed(2)}`;
        document.getElementById('calc-deductions').textContent = `- ₹0.00`;
        document.getElementById('calc-final').textContent = `₹${refund.refundAmount.toFixed(2)}`;

        // Set action button states
        document.getElementById('modal-approve-btn').disabled = refund.status !== 'Pending';
        document.getElementById('modal-reject-btn').disabled = refund.status !== 'Pending';
        document.getElementById('modal-process-btn').disabled = refund.status !== 'Approved';

        // Store current refund ID for actions
        detailsModal.dataset.currentRefundId = refundId;

        showModal(detailsModal);
    }

    function openApprovalModal(refundId) {
        const refund = refundsData.find(r => r.id === refundId);
        if (!refund) return;
        document.getElementById('approval-amount').textContent = `₹${refund.refundAmount.toFixed(2)}`;
        document.getElementById('approval-booking-ref').textContent = refund.bookingRef;
        approvalModal.dataset.currentRefundId = refundId;
        showModal(approvalModal);
    }

    function openRejectionModal(refundId) {
        const refund = refundsData.find(r => r.id === refundId);
        if (!refund) return;
        document.getElementById('rejection-booking-ref').textContent = refund.bookingRef;
        rejectionModal.dataset.currentRefundId = refundId;
        showModal(rejectionModal);
    }

    // --- Event Listeners ---

    // Filters
    document.getElementById('apply-filters-btn').addEventListener('click', filterAndSort);
    document.getElementById('reset-filters-btn').addEventListener('click', () => {
        document.getElementById('search-refunds').value = '';
        document.getElementById('status-filter').value = 'all';
        document.getElementById('sort-by').value = 'newest';
        filterAndSort();
    });

    // Table action buttons (event delegation)
    tableBody.addEventListener('click', (e) => {
        const refundId = e.target.closest('tr')?.dataset.refundId;
        if (!refundId) return;

        if (e.target.closest('.action-view')) {
            openDetailsModal(refundId);
        } else if (e.target.closest('.action-approve')) {
            openApprovalModal(refundId);
        } else if (e.target.closest('.action-reject')) {
            openRejectionModal(refundId);
        }
    });

    // Modal close buttons
    [detailsModal, approvalModal, rejectionModal].forEach(modal => {
        modal.querySelector('.modal-close-btn').addEventListener('click', () => hideModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal(modal);
        });
        const cancelBtn = modal.querySelector('.btn-modal-action.cancel');
        if (cancelBtn) cancelBtn.addEventListener('click', () => hideModal(modal));
    });

    // Modal action buttons inside details modal
    document.getElementById('modal-approve-btn').addEventListener('click', () => {
        const refundId = detailsModal.dataset.currentRefundId;
        hideModal(detailsModal);
        openApprovalModal(refundId);
    });
    document.getElementById('modal-reject-btn').addEventListener('click', () => {
        const refundId = detailsModal.dataset.currentRefundId;
        hideModal(detailsModal);
        openRejectionModal(refundId);
    });

    // Confirm Approval
    document.getElementById('confirm-approval-btn').addEventListener('click', (e) => {
        const refundId = approvalModal.dataset.currentRefundId;
        const refund = refundsData.find(r => r.id === refundId);
        if (refund) {
            refund.status = 'Approved';
            e.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Approving...';
            setTimeout(() => {
                hideModal(approvalModal);
                renderRefunds();
                updateStatistics();
                e.target.innerHTML = 'Confirm & Send Email';
            }, 1000);
        }
    });

    // Confirm Rejection
    document.getElementById('confirm-rejection-btn').addEventListener('click', (e) => {
        const reason = document.getElementById('rejection-reason').value;
        if (!reason) {
            alert('Rejection reason is required.');
            return;
        }
        const refundId = rejectionModal.dataset.currentRefundId;
        const refund = refundsData.find(r => r.id === refundId);
        if (refund) {
            refund.status = 'Rejected';
            e.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rejecting...';
            setTimeout(() => {
                hideModal(rejectionModal);
                renderRefunds();
                updateStatistics();
                e.target.innerHTML = 'Confirm & Send Email';
                document.getElementById('rejection-reason').value = '';
            }, 1000);
        }
    });

    // Initial Load
    loadRefunds();
});