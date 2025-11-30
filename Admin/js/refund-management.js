document.addEventListener('DOMContentLoaded', () => {
    // API Configuration
    const API_BASE_URL = '/api/refunds';
    
    // Global State
    let refundsData = [];
    let filteredRefunds = [];
    let currentPage = 1;
    const refundsPerPage = 15;
    let isLoading = false;

    // Helper function to get auth token
    function getAuthToken() {
        return localStorage.getItem('adminToken') || localStorage.getItem('token');
    }

    // API Helper
    async function apiRequest(endpoint, options = {}) {
        const token = getAuthToken();
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...defaultOptions, ...options });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    }

    // Transform API refund data to UI format
    function transformRefundData(refund) {
        const flightInfo = refund.booking?.flight || {};
        return {
            id: refund.refundId || refund._id,
            _id: refund._id,
            requestDate: refund.requestedAt || refund.createdAt,
            bookingRef: refund.booking?.bookingReference || 'N/A',
            userName: refund.user?.name || 'Unknown User',
            userEmail: refund.user?.email || 'N/A',
            flightDetails: flightInfo.origin && flightInfo.destination 
                ? `${flightInfo.origin} → ${flightInfo.destination}, ${flightInfo.flightNumber || 'N/A'}`
                : 'Flight details unavailable',
            cancellationReason: refund.reason || 'Not specified',
            originalAmount: refund.originalAmount || 0,
            cancellationCharges: refund.cancellationFee || 0,
            refundAmount: refund.refundAmount || 0,
            status: capitalizeFirst(refund.status || 'pending'),
            priority: determinePriority(refund),
            adminNotes: refund.adminNotes || '',
            items: refund.items || [],
            policy: refund.policy || {},
            processingTimeline: refund.processingTimeline || [],
            processedBy: refund.processedBy,
            reviewedAt: refund.reviewedAt,
            processedAt: refund.processedAt
        };
    }

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    function determinePriority(refund) {
        // Determine priority based on amount and age
        const amount = refund.refundAmount || 0;
        const requestAge = refund.requestedAt ? 
            (new Date() - new Date(refund.requestedAt)) / (1000 * 60 * 60 * 24) : 0;
        
        if (amount > 50000 || requestAge > 7) return 'High';
        if (amount > 20000 || requestAge > 3) return 'Medium';
        return 'Low';
    }

    // DOM Elements
    const tableBody = document.getElementById('refund-table-body');
    const paginationContainer = document.getElementById('pagination-container');
    const detailsModal = document.getElementById('refund-details-modal');
    const approvalModal = document.getElementById('approval-modal');
    const rejectionModal = document.getElementById('rejection-modal');

    // --- Main Functions ---

    async function loadRefunds() {
        if (isLoading) return;
        isLoading = true;
        showSkeletonLoader();
        
        try {
            const response = await apiRequest('');
            refundsData = (response.data || response.refunds || []).map(transformRefundData);
            filteredRefunds = [...refundsData];
            await loadStatistics();
            renderRefunds();
        } catch (error) {
            console.error('Failed to load refunds:', error);
            showError('Failed to load refunds. Please try again.');
            tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding: 20px; color: #ef4444;">
                Error loading refunds: ${error.message}
            </td></tr>`;
        } finally {
            isLoading = false;
        }
    }

    async function loadStatistics() {
        try {
            const stats = await apiRequest('/stats');
            updateStatisticsUI(stats.data || stats);
        } catch (error) {
            console.error('Failed to load statistics:', error);
            // Use local calculation as fallback
            updateStatistics();
        }
    }

    function updateStatisticsUI(stats) {
        document.getElementById('pending-requests-stat').textContent = stats.pending || 0;
        document.getElementById('approved-today-stat').textContent = stats.approvedToday || 0;
        
        const totalRefunded = stats.totalRefunded || 0;
        if (totalRefunded >= 100000) {
            document.getElementById('total-refunded-stat').textContent = `₹${(totalRefunded / 100000).toFixed(1)}L`;
        } else if (totalRefunded >= 1000) {
            document.getElementById('total-refunded-stat').textContent = `₹${(totalRefunded / 1000).toFixed(1)}k`;
        } else {
            document.getElementById('total-refunded-stat').textContent = `₹${totalRefunded.toFixed(0)}`;
        }
        
        const avgTime = stats.averageProcessingTime || 0;
        document.getElementById('avg-time-stat').textContent = avgTime > 0 ? `${avgTime.toFixed(1)}d` : 'N/A';
    }

    function showError(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast toast-error';
        toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 12px 20px;
            background: #fee2e2; color: #dc2626; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;
            display: flex; align-items: center; gap: 8px; font-size: 14px;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    function showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 12px 20px;
            background: #dcfce7; color: #16a34a; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000;
            display: flex; align-items: center; gap: 8px; font-size: 14px;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
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
            tr.dataset.mongoId = refund._id;
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
                    ${refund.status === 'Approved' ? `<button class="action-process" title="Process Refund"><i class="fas fa-money-bill-wave"></i></button>` : ''}
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

        // Set action button states based on status
        const isPending = refund.status === 'Pending';
        const isApproved = refund.status === 'Approved';
        
        document.getElementById('modal-approve-btn').disabled = !isPending;
        document.getElementById('modal-reject-btn').disabled = !isPending;
        
        const processBtn = document.getElementById('modal-process-btn');
        if (processBtn) {
            processBtn.disabled = !isApproved;
            processBtn.style.display = isApproved ? 'inline-flex' : 'none';
        }

        // Show processing timeline if available
        const timelineContainer = document.getElementById('processing-timeline');
        if (timelineContainer && refund.processingTimeline && refund.processingTimeline.length > 0) {
            timelineContainer.innerHTML = refund.processingTimeline.map(event => `
                <div class="timeline-item">
                    <span class="timeline-date">${new Date(event.timestamp).toLocaleString()}</span>
                    <span class="timeline-action">${event.action}</span>
                    ${event.note ? `<span class="timeline-note">${event.note}</span>` : ''}
                </div>
            `).join('');
            timelineContainer.style.display = 'block';
        } else if (timelineContainer) {
            timelineContainer.style.display = 'none';
        }

        // Store current refund ID and MongoDB ID for actions
        detailsModal.dataset.currentRefundId = refundId;
        detailsModal.dataset.mongoId = refund._id;

        showModal(detailsModal);
    }

    function openApprovalModal(refundId, mongoId) {
        const refund = refundsData.find(r => r.id === refundId);
        if (!refund) return;
        document.getElementById('approval-amount').textContent = `₹${refund.refundAmount.toFixed(2)}`;
        document.getElementById('approval-booking-ref').textContent = refund.bookingRef;
        approvalModal.dataset.currentRefundId = refundId;
        approvalModal.dataset.mongoId = mongoId || refund._id;
        showModal(approvalModal);
    }

    function openRejectionModal(refundId, mongoId) {
        const refund = refundsData.find(r => r.id === refundId);
        if (!refund) return;
        document.getElementById('rejection-booking-ref').textContent = refund.bookingRef;
        rejectionModal.dataset.currentRefundId = refundId;
        rejectionModal.dataset.mongoId = mongoId || refund._id;
        showModal(rejectionModal);
    }

    async function processRefund(mongoId) {
        if (!confirm('Are you sure you want to process this refund? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await apiRequest(`/${mongoId}/process`, {
                method: 'PUT',
                body: JSON.stringify({
                    transactionId: `TXN${Date.now()}`,
                    paymentMethod: 'original_payment_method'
                })
            });
            
            showSuccess('Refund processed successfully!');
            await loadRefunds();
        } catch (error) {
            console.error('Failed to process refund:', error);
            showError(`Failed to process refund: ${error.message}`);
        }
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
        const row = e.target.closest('tr');
        const refundId = row?.dataset.refundId;
        const mongoId = row?.dataset.mongoId;
        if (!refundId) return;

        if (e.target.closest('.action-view')) {
            openDetailsModal(refundId);
        } else if (e.target.closest('.action-approve')) {
            openApprovalModal(refundId, mongoId);
        } else if (e.target.closest('.action-reject')) {
            openRejectionModal(refundId, mongoId);
        } else if (e.target.closest('.action-process')) {
            processRefund(mongoId);
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
        const mongoId = detailsModal.dataset.mongoId;
        hideModal(detailsModal);
        openApprovalModal(refundId, mongoId);
    });
    document.getElementById('modal-reject-btn').addEventListener('click', () => {
        const refundId = detailsModal.dataset.currentRefundId;
        const mongoId = detailsModal.dataset.mongoId;
        hideModal(detailsModal);
        openRejectionModal(refundId, mongoId);
    });

    // Process button in details modal
    const modalProcessBtn = document.getElementById('modal-process-btn');
    if (modalProcessBtn) {
        modalProcessBtn.addEventListener('click', async () => {
            const mongoId = detailsModal.dataset.mongoId;
            hideModal(detailsModal);
            await processRefund(mongoId);
        });
    }

    // Export functionality
    const exportBtn = document.querySelector('.export-btn, #export-refunds-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            try {
                const response = await apiRequest('/export?format=csv');
                // Handle file download
                const blob = new Blob([response], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `refunds-export-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                showSuccess('Refunds exported successfully!');
            } catch (error) {
                console.error('Export failed:', error);
                // Fallback: export from local data
                exportLocalData();
            }
        });
    }

    function exportLocalData() {
        const headers = ['Refund ID', 'Request Date', 'Booking Ref', 'User', 'Email', 'Flight', 'Original Amount', 'Refund Amount', 'Status', 'Priority'];
        const csvContent = [
            headers.join(','),
            ...filteredRefunds.map(r => [
                r.id,
                new Date(r.requestDate).toISOString(),
                r.bookingRef,
                `"${r.userName}"`,
                r.userEmail,
                `"${r.flightDetails}"`,
                r.originalAmount,
                r.refundAmount,
                r.status,
                r.priority
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `refunds-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showSuccess('Refunds exported successfully!');
    }

    // Confirm Approval
    document.getElementById('confirm-approval-btn').addEventListener('click', async (e) => {
        const mongoId = approvalModal.dataset.mongoId;
        const refundId = approvalModal.dataset.currentRefundId;
        const notesInput = document.getElementById('approval-notes');
        const notes = notesInput ? notesInput.value : '';
        
        e.target.disabled = true;
        e.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Approving...';
        
        try {
            await apiRequest(`/${mongoId}/review`, {
                method: 'PUT',
                body: JSON.stringify({
                    action: 'approve',
                    adminNotes: notes
                })
            });
            
            hideModal(approvalModal);
            showSuccess('Refund approved successfully!');
            await loadRefunds();
        } catch (error) {
            console.error('Failed to approve refund:', error);
            showError(`Failed to approve refund: ${error.message}`);
        } finally {
            e.target.disabled = false;
            e.target.innerHTML = 'Confirm & Send Email';
            if (notesInput) notesInput.value = '';
        }
    });

    // Confirm Rejection
    document.getElementById('confirm-rejection-btn').addEventListener('click', async (e) => {
        const reason = document.getElementById('rejection-reason').value;
        if (!reason) {
            alert('Rejection reason is required.');
            return;
        }
        
        const mongoId = rejectionModal.dataset.mongoId;
        
        e.target.disabled = true;
        e.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rejecting...';
        
        try {
            await apiRequest(`/${mongoId}/review`, {
                method: 'PUT',
                body: JSON.stringify({
                    action: 'reject',
                    rejectionReason: reason,
                    adminNotes: reason
                })
            });
            
            hideModal(rejectionModal);
            showSuccess('Refund rejected. User has been notified.');
            await loadRefunds();
        } catch (error) {
            console.error('Failed to reject refund:', error);
            showError(`Failed to reject refund: ${error.message}`);
        } finally {
            e.target.disabled = false;
            e.target.innerHTML = 'Confirm & Send Email';
            document.getElementById('rejection-reason').value = '';
        }
    });

    // Initial Load
    loadRefunds();
});