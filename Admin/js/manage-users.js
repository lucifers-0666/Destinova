document.addEventListener('DOMContentLoaded', () => {
    // Mock Data
    const mockUsers = Array.from({ length: 125 }, (_, i) => {
        const roles = ['Customer', 'Agent', 'Admin'];
        const statuses = ['active', 'inactive', 'suspended'];
        const id = 1001 + i;
        const role = roles[i % 3];
        const status = statuses[i % 3];
        const regDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const lastLogin = new Date(regDate.getTime() + Math.random() * (new Date().getTime() - regDate.getTime()));
        return {
            id,
            name: `User ${id}`,
            email: `user${id}@destinova.com`,
            phone: `9876543${String(id).padStart(3, '0')}`,
            avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i % 100}.jpg`,
            registrationDate: regDate.toISOString().split('T')[0],
            lastLogin: lastLogin.toISOString(),
            totalBookings: Math.floor(Math.random() * 20),
            totalSpent: (Math.random() * 50000).toFixed(2),
            role,
            status,
        };
    });

    // Global State
    let usersData = [];
    let filteredUsers = [];
    let selectedUserIds = new Set();
    let currentPage = 1;
    const usersPerPage = 10;

    // DOM Elements
    const tableBody = document.getElementById('users-table-body');
    const paginationContainer = document.getElementById('pagination-container');
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    const bulkActionsToolbar = document.getElementById('bulk-actions-toolbar');
    const selectedCountSpan = document.getElementById('selected-count');

    // --- Main Functions ---

    function loadUsers() {
        showSkeletonLoader();
        
        // Try real API first
        const loadFromAPI = async () => {
            try {
                if (typeof window.DestinovaAPI !== 'undefined' && window.DestinovaAPI.Admin) {
                    const response = await window.DestinovaAPI.Admin.getAllUsers();
                    if (response && response.users && response.users.length > 0) {
                        usersData = response.users.map(user => ({
                            id: user._id,
                            name: user.name || `${user.firstName} ${user.lastName}`,
                            email: user.email,
                            phone: user.phone || 'N/A',
                            avatar: user.profileImage || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=random`,
                            registrationDate: new Date(user.createdAt).toISOString().split('T')[0],
                            lastLogin: new Date().toISOString(), // Mock for now
                            totalBookings: user.totalBookings || 0,
                            totalSpent: user.totalSpent || 0,
                            role: user.role || 'user',
                            status: 'active' // Mock for now
                        }));
                        filteredUsers = [...usersData];
                        renderTable(filteredUsers);
                        updatePagination();
                        updateSelectedCount();
                        return true;
                    }
                }
            } catch (error) {
                console.log('Admin API not available, using mock data:', error.message);
            }
            return false;
        };

        loadFromAPI().then(success => {
            if (!success) {
                // Fallback to mock data
                usersData = mockUsers;
                filteredUsers = [...usersData];
                renderTable(filteredUsers);
                updatePagination();
                updateSelectedCount();
            }
        });
    }
                        usersData = response.users.map((user, i) => ({
                            id: user._id || user.id || (1001 + i),
                            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || `User ${1001 + i}`,
                            email: user.email || `user${1001 + i}@destinova.com`,
                            phone: user.phone || 'N/A',
                            avatar: user.avatar || `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i % 100}.jpg`,
                            registrationDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A',
                            lastLogin: user.lastLogin || user.createdAt || new Date().toISOString(),
                            totalBookings: user.totalBookings || 0,
                            totalSpent: user.totalSpent || '0.00',
                            role: user.role || 'Customer',
                            status: user.status || 'active',
                        }));
                        filteredUsers = [...usersData];
                        updateStatistics();
                        renderUsers();
                        return true;
                    }
                }
            } catch (error) {
                console.log('Admin API not available, using mock data:', error.message);
            }
            return false;
        };
        
        loadFromAPI().then(success => {
            if (!success) {
                // Fallback to mock data
                setTimeout(() => {
                    usersData = mockUsers;
                    filteredUsers = [...usersData];
                    updateStatistics();
                    renderUsers();
                }, 1000);
            }
        });
    }

    function renderUsers() {
        tableBody.innerHTML = '';
        if (filteredUsers.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding: 20px;">No users found.</td></tr>`;
            updatePagination();
            return;
        }

        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

        paginatedUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.dataset.userId = user.id;
            tr.innerHTML = `
                <td><input type="checkbox" class="row-checkbox" data-id="${user.id}"></td>
                <td>${user.id}</td>
                <td>
                    <div class="user-profile">
                        <img src="${user.avatar}" alt="${user.name}">
                        <div>
                            <div class="user-name">${user.name}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>${user.phone}</td>
                <td>${user.registrationDate}</td>
                <td>${new Date(user.lastLogin).toLocaleString()}</td>
                <td>${user.totalBookings}</td>
                <td><span class="role-badge role-${user.role.toLowerCase()}">${user.role}</span></td>
                <td>
                    <label class="status-toggle">
                        <input type="checkbox" ${user.status === 'active' ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </td>
                <td class="action-buttons">
                    <button class="action-view" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-edit" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                    <button class="action-delete" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        updatePagination();
        handleBulkSelection();
    }

    function filterAndSearch() {
        const searchTerm = document.getElementById('search-user').value.toLowerCase();
        const roleFilter = document.getElementById('role-filter').value;
        const statusFilter = document.getElementById('status-filter').value;

        filteredUsers = usersData.filter(user => {
            const matchesSearch = searchTerm === '' ||
                user.name.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm) ||
                user.id.toString().includes(searchTerm);

            const matchesRole = roleFilter === 'all' || user.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });

        currentPage = 1;
        renderUsers();
    }

    function updateStatistics() {
        document.getElementById('total-users-stat').textContent = usersData.length;
        document.getElementById('active-users-stat').textContent = usersData.filter(u => u.status === 'active').length;
        document.getElementById('inactive-users-stat').textContent = usersData.filter(u => u.status === 'inactive').length;
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        document.getElementById('new-users-stat').textContent = usersData.filter(u => new Date(u.registrationDate) > oneMonthAgo).length;
    }

    function updatePagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        if (totalPages <= 1) return;

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&laquo;';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderUsers();
            }
        });
        paginationContainer.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderUsers();
            });
            paginationContainer.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '&raquo;';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderUsers();
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    function handleBulkSelection() {
        const allCheckboxes = tableBody.querySelectorAll('.row-checkbox');
        selectedUserIds.clear();
        allCheckboxes.forEach(cb => {
            if (cb.checked) {
                selectedUserIds.add(parseInt(cb.dataset.id));
            }
        });

        if (selectedUserIds.size > 0) {
            bulkActionsToolbar.classList.add('visible');
            selectedCountSpan.textContent = `${selectedUserIds.size} selected`;
        } else {
            bulkActionsToolbar.classList.remove('visible');
        }

        selectAllCheckbox.checked = allCheckboxes.length > 0 && selectedUserIds.size === allCheckboxes.length;
    }

    function showSkeletonLoader() {
        tableBody.innerHTML = '';
        for (let i = 0; i < usersPerPage; i++) {
            const tr = document.createElement('tr');
            tr.classList.add('skeleton-row');
            tr.innerHTML = `
                <td><div class="skeleton" style="width: 20px; height: 20px;"></div></td>
                <td><div class="skeleton text"></div></td>
                <td>
                    <div class="user-profile">
                        <div class="skeleton avatar"></div>
                        <div>
                            <div class="skeleton" style="width: 100px; height: 15px; margin-bottom: 5px;"></div>
                            <div class="skeleton" style="width: 150px; height: 12px;"></div>
                        </div>
                    </div>
                </td>
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text"></div></td>
                <td><div class="skeleton text" style="width: 30px;"></div></td>
                <td><div class="skeleton text" style="width: 80px;"></div></td>
                <td><div class="skeleton text" style="width: 50px;"></div></td>
                <td><div class="skeleton text" style="width: 80px;"></div></td>
            `;
            tableBody.appendChild(tr);
        }
    }

    // --- Modal Logic ---
    const modal = document.getElementById('user-details-modal');
    const modalCloseBtn = modal.querySelector('.modal-close-btn');

    function showModal(userId) {
        const user = usersData.find(u => u.id === userId);
        if (!user) return;

        // Populate modal
        document.getElementById('modal-user-name').textContent = user.name;
        document.getElementById('modal-user-email').textContent = user.email;
        document.getElementById('modal-user-phone').textContent = user.phone;
        document.getElementById('modal-user-img').src = user.avatar;
        document.getElementById('modal-user-id').textContent = user.id;
        document.getElementById('modal-user-role').textContent = user.role;
        document.getElementById('modal-user-status').textContent = user.status;
        document.getElementById('modal-user-regdate').textContent = user.registrationDate;
        document.getElementById('modal-user-lastlogin').textContent = new Date(user.lastLogin).toLocaleString();
        
        // Mock booking/activity history
        document.getElementById('modal-booking-history').innerHTML = `<p>User has ${user.totalBookings} bookings.</p>`;
        document.getElementById('modal-activity-log').innerHTML = `<p>Last login: ${new Date(user.lastLogin).toLocaleString()}</p>`;

        modal.classList.add('visible');
    }

    function hideModal() {
        modal.classList.remove('visible');
    }

    modalCloseBtn.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // --- Event Listeners ---

    // Debounced search
    let debounceTimer;
    document.getElementById('search-user').addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filterAndSearch, 300);
    });

    // Filters
    document.getElementById('apply-filters-btn').addEventListener('click', filterAndSearch);
    document.getElementById('reset-filters-btn').addEventListener('click', () => {
        document.getElementById('search-user').value = '';
        document.getElementById('role-filter').value = 'all';
        document.getElementById('status-filter').value = 'all';
        document.getElementById('date-filter').value = '';
        filterAndSearch();
    });

    // Table-level event delegation
    tableBody.addEventListener('click', (e) => {
        const target = e.target;
        const row = target.closest('tr');
        if (!row) return;
        const userId = parseInt(row.dataset.userId);

        // Checkbox click
        if (target.classList.contains('row-checkbox')) {
            handleBulkSelection();
        }
        // View action
        else if (target.closest('.action-view')) {
            console.log(`View user ${userId}`);
            showModal(userId);
        }
        // Edit action
        else if (target.closest('.action-edit')) {
            console.log(`Edit user ${userId}`);
            alert(`Editing user ${userId} (UI not implemented).`);
        }
        // Delete action
        else if (target.closest('.action-delete')) {
            if (confirm(`Are you sure you want to delete user ${userId}?`)) {
                console.log(`Deleting user ${userId}`);
                // Simulate API call
                usersData = usersData.filter(u => u.id !== userId);
                filterAndSearch();
                updateStatistics();
            }
        }
        // Status toggle
        else if (target.closest('.status-toggle')) {
            const user = usersData.find(u => u.id === userId);
            if (user) {
                user.status = user.status === 'active' ? 'inactive' : 'active';
                console.log(`Toggled status for user ${userId} to ${user.status}`);
                updateStatistics();
            }
        }
    });

    // Select All Checkbox
    selectAllCheckbox.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        tableBody.querySelectorAll('.row-checkbox').forEach(cb => {
            cb.checked = isChecked;
        });
        handleBulkSelection();
    });

    // Bulk Actions
    document.getElementById('bulk-delete-btn').addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete ${selectedUserIds.size} users?`)) {
            usersData = usersData.filter(u => !selectedUserIds.has(u.id));
            selectedUserIds.clear();
            filterAndSearch();
            updateStatistics();
            handleBulkSelection();
        }
    });

    // Export
    document.getElementById('export-btn').addEventListener('click', () => {
        alert('Exporting to Excel (functionality not implemented).');
    });

    // Initial Load
    loadUsers();
});