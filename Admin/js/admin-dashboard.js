// Admin Dashboard JavaScript - Destinova
// Global Variables
let dashboardData = {};
let charts = {};
let updateInterval;
let searchTimeout;

// Initialize Dashboard
function initializeDashboard() {
    console.log('Initializing Admin Dashboard...');
    // Always setup event listeners first so UI controls work even if other init fails
    setupEventListeners();

    try {
        // Load dashboard data and widgets (may rely on optional libs like Chart.js)
        loadDashboardStats();
        if (typeof Chart !== 'undefined') {
            createRevenueChart();
            createClassChart();
        }
        loadRecentActivity();
        loadSystemAlerts();
        updatePerformanceMetrics();

        // Update date/time
        updateDateTime();
        setInterval(updateDateTime, 1000);

        // Start auto-refresh
        startAutoRefresh();

        // Load quick actions
        loadQuickActions();

        console.log('Dashboard initialized successfully!');
    } catch (err) {
        console.warn('Dashboard partial initialization failed, continuing with core features:', err);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Global search
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleGlobalSearch);
        searchInput.addEventListener('focus', () => {
            const results = document.getElementById('search-results');
            if (results && results.children.length > 0) {
                results.classList.add('active');
            }
        });
    }
    
    // Notification bell
    const notificationBell = document.getElementById('notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', handleNotificationClick);
    }
    
    // Profile dropdown
    const adminProfile = document.getElementById('admin-profile');
    if (adminProfile) {
        adminProfile.addEventListener('click', profileDropdownToggle);
    }
    
    // Sidebar toggle (mobile)
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Refresh activity button
    const refreshActivity = document.getElementById('refresh-activity');
    if (refreshActivity) {
        refreshActivity.addEventListener('click', loadRecentActivity);
    }
    
    // Quick action cards
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-bell')) {
            document.getElementById('notification-dropdown')?.classList.remove('active');
        }
        if (!e.target.closest('.admin-profile')) {
            document.getElementById('profile-dropdown')?.classList.remove('active');
        }
        if (!e.target.closest('.search-container')) {
            document.getElementById('search-results')?.classList.remove('active');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // D for Dashboard
        if (e.key === 'd' && !e.ctrlKey && !e.target.matches('input, textarea')) {
            window.location.href = 'admin-dashboard.html';
        }
        // S for Search
        if (e.key === 's' && !e.ctrlKey && !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('global-search')?.focus();
        }
        // N for Notifications
        if (e.key === 'n' && !e.ctrlKey && !e.target.matches('input, textarea')) {
            handleNotificationClick();
        }
    });
}

// Load Dashboard Statistics
async function loadDashboardStats() {
    // Try real API first
    try {
        if (typeof window.DestinovaAPI !== 'undefined' && window.DestinovaAPI.Admin) {
            const response = await window.DestinovaAPI.Admin.getDashboardStats();
            if (response && response.stats) {
                const stats = response.stats;
                
                // Animate counters
                animateCounter('total-bookings', 0, stats.todayBookings || 0, 2000);
                animateCounter('total-revenue', 0, stats.totalRevenue || 0, 2000);
                animateCounter('active-flights', 0, stats.activeFlights || 0, 2000);
                animateCounter('registered-users', 0, stats.registeredUsers || 0, 2000);
                
                // Update trends
                if (document.getElementById('bookings-trend')) {
                    document.getElementById('bookings-trend').textContent = `+${stats.bookingsTrend || 0}%`;
                }
                if (document.getElementById('revenue-trend')) {
                    document.getElementById('revenue-trend').textContent = `+${stats.revenueTrend || 0}%`;
                }
                if (document.getElementById('new-users-today')) {
                    document.getElementById('new-users-today').textContent = `+${stats.newUsersToday || 0}`;
                }
                
                dashboardData.stats = stats;
                return;
            }
        }
    } catch (error) {
        console.log('Admin API not available, using mock data:', error.message);
    }
    
    // Fallback to mock data
    const stats = {
        todayBookings: 147,
        bookingsTrend: 12.5,
        totalRevenue: 2845000,
        revenueTrend: 8.5,
        activeFlights: 42,
        flightsTrend: 0,
        registeredUsers: 8542,
        newUsersToday: 23
    };
    
    // Animate counters
    animateCounter('total-bookings', 0, stats.todayBookings, 2000);
    animateCounter('total-revenue', 0, stats.totalRevenue, 2000);
    animateCounter('active-flights', 0, stats.activeFlights, 2000);
    animateCounter('registered-users', 0, stats.registeredUsers, 2000);
    
    // Update trends
    document.getElementById('bookings-trend').textContent = `+${stats.bookingsTrend}%`;
    document.getElementById('revenue-trend').textContent = `+${stats.revenueTrend}%`;
    document.getElementById('new-users-today').textContent = `+${stats.newUsersToday}`;
    
    dashboardData.stats = stats;
}

// Animate Counter
function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        
        // Format number with commas
        if (elementId === 'total-revenue') {
            element.textContent = Math.floor(current).toLocaleString('en-IN');
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Create Revenue Chart
function createRevenueChart() {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    // Mock data for last 30 days
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        data.push(Math.floor(Math.random() * 100000) + 50000);
    }
    
    charts.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue (₹)',
                data: data,
                borderColor: '#2d5a3d',
                backgroundColor: 'rgba(45, 90, 61, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#2d5a3d',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
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
                    backgroundColor: 'rgba(26, 58, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.parsed.y.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 10
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + (value / 1000) + 'k';
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Create Class Distribution Chart
function createClassChart() {
    const ctx = document.getElementById('class-chart');
    if (!ctx) return;
    
    charts.classChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Economy', 'Business', 'First Class'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                    '#4facfe',
                    '#f093fb',
                    '#43e97b'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 13
                        },
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 58, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return label + ': ' + value + '%';
                        }
                    }
                }
            },
            cutout: '70%'
        },
        plugins: [{
            beforeDraw: function(chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                
                ctx.restore();
                const fontSize = (height / 160).toFixed(2);
                ctx.font = fontSize + "em sans-serif";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#1a3a2a";
                
                const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const text = total + "%";
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2;
                
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        }]
    });
}

// Load Recent Activity
function loadRecentActivity() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    // Show loading
    activityList.innerHTML = '<div class="activity-loading"><i class="fas fa-spinner fa-spin"></i> Loading activities...</div>';
    
    // Simulate API call
    setTimeout(() => {
        const activities = generateMockActivities(20);
        
        activityList.innerHTML = '';
        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <img src="${activity.avatar}" alt="${activity.user}" class="activity-avatar">
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-timestamp">${activity.timestamp}</div>
                </div>
            `;
            item.addEventListener('click', () => {
                alert('Activity details: ' + activity.text);
            });
            activityList.appendChild(item);
        });
    }, 500);
}

// Generate Mock Activities
function generateMockActivities(count) {
    const activities = [];
    const actions = [
        { text: 'booked a flight to Mumbai', type: 'booking' },
        { text: 'cancelled booking #BK12345', type: 'cancellation' },
        { text: 'registered a new account', type: 'registration' },
        { text: 'requested a refund for booking #BK67890', type: 'refund' },
        { text: 'updated profile information', type: 'update' },
        { text: 'completed payment for booking #BK54321', type: 'payment' }
    ];
    
    for (let i = 0; i < count; i++) {
        const action = actions[Math.floor(Math.random() * actions.length)];
        const minutes = Math.floor(Math.random() * 120) + 1;
        
        activities.push({
            user: `User ${i + 1}`,
            avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${(i % 50) + 1}.jpg`,
            text: `<strong>User ${i + 1}</strong> ${action.text}`,
            timestamp: getRelativeTime(minutes),
            type: action.type
        });
    }
    
    return activities;
}

// Get Relative Time
function getRelativeTime(minutes) {
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Update Date Time
function updateDateTime() {
    const dateTimeElement = document.getElementById('current-datetime');
    if (!dateTimeElement) return;
    
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
}

// Load Quick Actions
function loadQuickActions() {
    // Quick actions are already in HTML, just add handlers
    console.log('Quick actions loaded');
}

// Handle Quick Action
function handleQuickAction(action) {
    console.log('Quick action clicked:', action);
    
    switch(action) {
        case 'create-flight':
            window.location.href = 'flight-management.html';
            break;
        case 'add-user':
            alert('Add User Modal - Coming Soon!');
            break;
        case 'send-notification':
            window.location.href = 'notification-management.html';
            break;
        case 'generate-report':
            exportDashboardPDF();
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Load System Alerts
function loadSystemAlerts() {
    const alertsList = document.getElementById('alerts-list');
    const alertCount = document.getElementById('alert-count');
    
    if (!alertsList) return;
    
    // Show loading
    alertsList.innerHTML = '<div class="alerts-loading"><i class="fas fa-spinner fa-spin"></i> Loading alerts...</div>';
    
    // Simulate API call
    setTimeout(() => {
        const alerts = [
            {
                id: 1,
                title: 'Payment Gateway Issue',
                message: 'Multiple payment failures reported in the last hour',
                priority: 'high',
                time: '5 minutes ago'
            },
            {
                id: 2,
                title: 'Flight Delay',
                message: 'Flight AI-204 to Delhi delayed by 2 hours',
                priority: 'medium',
                time: '15 minutes ago'
            },
            {
                id: 3,
                title: 'System Update',
                message: 'Scheduled maintenance at 2:00 AM tonight',
                priority: 'low',
                time: '1 hour ago'
            },
            {
                id: 4,
                title: 'High Booking Volume',
                message: 'Unusual spike in bookings detected',
                priority: 'medium',
                time: '2 hours ago'
            }
        ];
        
        if (alertCount) {
            alertCount.textContent = alerts.length;
        }
        
        alertsList.innerHTML = '';
        alerts.forEach(alert => {
            const item = document.createElement('div');
            item.className = `alert-item priority-${alert.priority}`;
            item.innerHTML = `
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-time">${alert.time}</div>
                </div>
                <button class="alert-dismiss" onclick="dismissAlert(${alert.id})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            alertsList.appendChild(item);
        });
        
        // Play sound for high priority alerts
        const highPriorityAlerts = alerts.filter(a => a.priority === 'high');
        if (highPriorityAlerts.length > 0) {
            // Uncomment to enable sound notification
            // new Audio('notification-sound.mp3').play().catch(e => console.log('Audio play failed'));
        }
    }, 500);
}

// Dismiss Alert
function dismissAlert(alertId) {
    console.log('Dismissing alert:', alertId);
    
    const alertItem = event.target.closest('.alert-item');
    if (alertItem) {
        alertItem.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            alertItem.remove();
            
            // Update count
            const alertCount = document.getElementById('alert-count');
            const remainingAlerts = document.querySelectorAll('.alert-item').length;
            if (alertCount) {
                alertCount.textContent = remainingAlerts;
            }
        }, 300);
    }
    
    // Send dismiss to API
    // fetch(`/api/admin/alerts/${alertId}/dismiss`, { method: 'POST' })
}

// Update Performance Metrics
function updatePerformanceMetrics() {
    // Mock data - Replace with actual API call
    const metrics = {
        conversionRate: 3.8,
        avgBookingValue: 15420,
        cancellationRate: 2.4,
        satisfactionScore: 4.6
    };
    
    // Update values with animation
    setTimeout(() => {
        document.getElementById('conversion-rate').textContent = metrics.conversionRate + '%';
        document.getElementById('conversion-progress').style.width = (metrics.conversionRate * 10) + '%';
        
        document.getElementById('avg-booking-value').textContent = metrics.avgBookingValue.toLocaleString('en-IN');
        document.getElementById('avg-value-progress').style.width = '65%';
        
        document.getElementById('cancellation-rate').textContent = metrics.cancellationRate + '%';
        document.getElementById('cancellation-progress').style.width = (metrics.cancellationRate * 10) + '%';
        
        const satisfactionPercentage = (metrics.satisfactionScore / 5) * 100;
        document.getElementById('satisfaction-score').textContent = metrics.satisfactionScore + '/5';
        document.getElementById('satisfaction-progress').style.width = satisfactionPercentage + '%';
    }, 500);
    
    dashboardData.metrics = metrics;
}

// Handle Global Search
function handleGlobalSearch(event) {
    const query = event.target.value.trim();
    const resultsContainer = document.getElementById('search-results');
    
    if (!resultsContainer) return;
    
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        resultsContainer.classList.remove('active');
        return;
    }
    
    searchTimeout = setTimeout(() => {
        // Simulate API search
        const results = performSearch(query);
        displaySearchResults(results, resultsContainer);
    }, 300);
}

// Perform Search
function performSearch(query) {
    // Mock search results
    return {
        bookings: [
            { id: 'BK12345', text: 'Booking #BK12345 - Mumbai to Delhi', url: 'manage-bookings.html?id=BK12345' },
            { id: 'BK67890', text: 'Booking #BK67890 - Bangalore to Chennai', url: 'manage-bookings.html?id=BK67890' }
        ],
        users: [
            { id: 'U001', text: 'John Doe - john@example.com', url: 'manage-users.html?id=U001' },
            { id: 'U002', text: 'Jane Smith - jane@example.com', url: 'manage-users.html?id=U002' }
        ],
        flights: [
            { id: 'AI204', text: 'Flight AI-204 - Delhi to Mumbai', url: 'flight-management.html?id=AI204' }
        ]
    };
}

// Display Search Results
function displaySearchResults(results, container) {
    container.innerHTML = '';
    
    let hasResults = false;
    
    ['bookings', 'users', 'flights'].forEach(category => {
        if (results[category] && results[category].length > 0) {
            hasResults = true;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.style.padding = '15px';
            categoryDiv.style.borderBottom = '1px solid #dee2e6';
            
            const categoryTitle = document.createElement('div');
            categoryTitle.style.fontSize = '12px';
            categoryTitle.style.fontWeight = '600';
            categoryTitle.style.color = '#6c757d';
            categoryTitle.style.textTransform = 'uppercase';
            categoryTitle.style.marginBottom = '10px';
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);
            
            results[category].forEach(item => {
                const resultItem = document.createElement('a');
                resultItem.href = item.url;
                resultItem.style.display = 'block';
                resultItem.style.padding = '8px 0';
                resultItem.style.color = '#495057';
                resultItem.style.textDecoration = 'none';
                resultItem.style.fontSize = '14px';
                resultItem.textContent = item.text;
                resultItem.addEventListener('mouseenter', () => {
                    resultItem.style.color = '#2d5a3d';
                });
                resultItem.addEventListener('mouseleave', () => {
                    resultItem.style.color = '#495057';
                });
                categoryDiv.appendChild(resultItem);
            });
            
            container.appendChild(categoryDiv);
        }
    });
    
    if (!hasResults) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #6c757d;">No results found</div>';
    }
    
    container.classList.add('active');
}

// Handle Notification Click
function handleNotificationClick() {
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        if (dropdown.classList.contains('active')) {
            // Mark as read (visual effect)
            const badge = document.getElementById('notification-count');
            if (badge) {
                setTimeout(() => {
                    badge.textContent = '0';
                    badge.style.display = 'none';
                }, 1000);
            }
        }
    }
}

// Profile Dropdown Toggle
function profileDropdownToggle() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Toggle Sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    const body = document.body;
    
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('active');

        const dashboardContent = document.getElementById('dashboard-content');
        if (dashboardContent) {
            dashboardContent.classList.toggle('sidebar-collapsed');
        }

        const mainContent = document.querySelector('.main-content') || document.querySelector('.settings-content');
        if (mainContent) {
            mainContent.classList.toggle('sidebar-collapsed');
        }

        // Add/remove body class for mobile backdrop
        if (window.innerWidth < 600) {
            body.classList.toggle('sidebar-open');
        }
    }
}

// Make toggleSidebar globally available for the init script
window.toggleSidebar = toggleSidebar;

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('admin-sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    if (window.innerWidth < 600 && 
        sidebar && 
        sidebar.classList.contains('active') && 
        !sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target)) {
        toggleSidebar();
    }
});

// Refresh Dashboard
function refreshDashboard() {
    console.log('Refreshing dashboard...');
    
    loadDashboardStats();
    loadRecentActivity();
    loadSystemAlerts();
    updatePerformanceMetrics();
    
    // Update charts
    if (charts.revenueChart) {
        // Update chart data
        charts.revenueChart.update();
    }
    if (charts.classChart) {
        charts.classChart.update();
    }
}

// Start Auto Refresh
function startAutoRefresh() {
    // Refresh every 5 minutes
    updateInterval = setInterval(() => {
        refreshDashboard();
    }, 300000);
    
    // Refresh activities every 30 seconds
    setInterval(() => {
        loadRecentActivity();
    }, 30000);
    
    // Refresh alerts every 2 minutes
    setInterval(() => {
        loadSystemAlerts();
    }, 120000);
}

// Export Dashboard PDF
function exportDashboardPDF() {
    console.log('Generating dashboard PDF...');
    alert('Dashboard PDF Export - Coming Soon!\nThis will generate a comprehensive report with all charts and metrics.');
    
    // Implementation would use a library like jsPDF or html2canvas
    // Example:
    // const { jsPDF } = window.jspdf;
    // const doc = new jsPDF();
    // doc.text('Dashboard Report', 10, 10);
    // doc.save(`Dashboard-Report-${new Date().toISOString().split('T')[0]}.pdf`);
}

// CSS animation for fade out
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(20px); }
    }
`;
document.head.appendChild(style);

// Initialize on page load
// Universal sidebar toggle for all admin pages
if (typeof initializeDashboard === 'function') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    document.addEventListener('DOMContentLoaded', function() {
        // Sidebar toggle
        var sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle && typeof toggleSidebar === 'function') {
            sidebarToggle.addEventListener('click', toggleSidebar);
        }
        // Profile dropdown
        var adminProfile = document.getElementById('admin-profile');
        if (adminProfile && typeof profileDropdownToggle === 'function') {
            adminProfile.addEventListener('click', profileDropdownToggle);
        }
        // Close profile dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.admin-profile')) {
                var pd = document.getElementById('profile-dropdown');
                if (pd) pd.classList.remove('active');
            }
        });
        // Delegated handler: ensure any .sidebar-toggle click calls toggleSidebar()
        document.addEventListener('click', function(e) {
            var toggleBtn = e.target.closest('.sidebar-toggle');
            if (!toggleBtn) return;
            // prevent double firing if another handler also attached
            if (e.__sidebarHandled) return;
            e.__sidebarHandled = true;
            try {
                if (typeof toggleSidebar === 'function') {
                    toggleSidebar();
                }
            } catch (err) {
                console.warn('toggleSidebar error (delegated):', err);
            }
        });
        // Sidebar click-outside for mobile
        document.addEventListener('click', function(e) {
            var sidebar = document.getElementById('admin-sidebar');
            var sidebarToggle = document.getElementById('sidebar-toggle');
            if (window.innerWidth < 600 && 
                sidebar && 
                sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                if (typeof toggleSidebar === 'function') toggleSidebar();
            }
        });
    });
}

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        refreshDashboard();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

console.log('Admin Dashboard script loaded successfully!');

/* Defensive fallback: ensure sidebar toggle works even if other initializers fail.
   This attaches a minimal toggle handler to the #sidebar-toggle button on every admin page.
*/
(function() {
    function fallbackInit() {
        try {
            var st = document.getElementById('sidebar-toggle');
            if (!st) return;

            // Avoid attaching duplicate handlers
            if (st.dataset.fallbackAttached === '1') return;
            st.dataset.fallbackAttached = '1';

            st.addEventListener('click', function(e) {
                e.preventDefault();
                var sidebar = document.getElementById('admin-sidebar');
                var dashboardContent = document.getElementById('dashboard-content');
                var mainContent = document.querySelector('.main-content') || document.querySelector('.settings-content');
                var body = document.body;

                if (sidebar) {
                    sidebar.classList.toggle('collapsed');
                    sidebar.classList.toggle('active');
                }
                if (dashboardContent) dashboardContent.classList.toggle('sidebar-collapsed');
                if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
                if (body && window.innerWidth < 600) body.classList.toggle('sidebar-open');

                // Toggle aria-expanded for accessibility
                var expanded = st.getAttribute('aria-expanded') === 'true';
                st.setAttribute('aria-expanded', (!expanded).toString());
            });
        } catch (err) {
            // swallow errors - this is just a fallback
            console.warn('Sidebar fallback init error:', err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fallbackInit);
    } else {
        fallbackInit();
    }
})();

// Robust capturing delegated handler
// This runs in the capture phase so it triggers even if other handlers stop propagation.
try {
    // Helper to perform the toggle (central or fallback)
    function performSidebarToggle(btn) {
        try {
            // Prefer central implementation
            if (typeof toggleSidebar === 'function') {
                toggleSidebar();
                return;
            }

            var sidebar = document.getElementById('admin-sidebar');
            var dashboardContent = document.getElementById('dashboard-content');
            var mainContent = document.querySelector('.main-content') || document.querySelector('.settings-content');
            var body = document.body;

            if (sidebar) {
                sidebar.classList.toggle('collapsed');
                sidebar.classList.toggle('active');
            }
            if (dashboardContent) dashboardContent.classList.toggle('sidebar-collapsed');
            if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
            if (body && window.innerWidth < 600) body.classList.toggle('sidebar-open');

            // Update aria-expanded for accessibility
            try {
                if (btn) {
                    var expanded = btn.getAttribute('aria-expanded') === 'true';
                    btn.setAttribute('aria-expanded', (!expanded).toString());
                }
            } catch (err) { /* ignore */ }
        } catch (err) {
            console.warn('performSidebarToggle error:', err);
        }
    }

    // Click (capture) handler
    document.addEventListener('click', function (e) {
        try {
            var btn = e.target && e.target.closest && e.target.closest('.sidebar-toggle');
            if (!btn) return;
            console.debug('Robust sidebar click handler triggered for', btn);
            performSidebarToggle(btn);
        } catch (err) {
            console.warn('Error in robust sidebar click handler:', err);
        }
    }, true);

    // Pointerdown (capture) for touch/pen devices where click may be prevented
    document.addEventListener('pointerdown', function (e) {
        try {
            var btn = e.target && e.target.closest && e.target.closest('.sidebar-toggle');
            if (!btn) return;
            console.debug('Robust sidebar pointerdown handler triggered for', btn);
            performSidebarToggle(btn);
        } catch (err) {
            console.warn('Error in robust sidebar pointerdown handler:', err);
        }
    }, true);

    // Keyboard accessibility: Enter / Space should toggle when focus is on the button
    document.addEventListener('keydown', function (e) {
        try {
            var active = document.activeElement;
            if (!active) return;
            if (!active.classList || !active.classList.contains('sidebar-toggle')) return;
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                performSidebarToggle(active);
            }
        } catch (err) {
            console.warn('Error in robust sidebar keydown handler:', err);
        }
    }, true);
} catch (err) {
    console.warn('Failed to attach robust sidebar handler:', err);
}
