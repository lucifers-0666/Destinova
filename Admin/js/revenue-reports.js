document.addEventListener('DOMContentLoaded', () => {
    // Global chart instances
    const charts = {};

    // --- Helper Functions ---
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
    }

    function calculateGrowth(current, previous) {
        if (previous === 0) return { value: 'N/A', class: '' };
        const growth = ((current - previous) / previous) * 100;
        const isPositive = growth >= 0;
        return {
            value: `${isPositive ? '+' : ''}${growth.toFixed(1)}%`,
            class: isPositive ? 'positive' : 'negative',
            icon: isPositive ? 'fa-arrow-up' : 'fa-arrow-down'
        };
    }

    // --- Data Loading and Rendering ---
    function loadRevenueData(range = 'last30days') {
        console.log(`Fetching data for: ${range}`);
        // API Simulation
        showSkeletonLoaders();
        setTimeout(() => {
            const revenueData = generateMockData(range);
            renderOverviewCards(revenueData.overview);
            createRevenueChart(revenueData.revenueTrend);
            createClassDistributionChart(revenueData.classDistribution);
            createRouteChart(revenueData.topRoutes);
            createPaymentMethodsChart(revenueData.paymentMethods);
            renderRevenueTable(revenueData.revenueBreakdown);
            renderTopRoutesTable(revenueData.topRoutes);
            hideSkeletonLoaders();
        }, 1500);
    }

    function renderOverviewCards(data) {
        document.getElementById('total-revenue').textContent = formatCurrency(data.totalRevenue.current);
        const revenueGrowth = calculateGrowth(data.totalRevenue.current, data.totalRevenue.previous);
        const revenueGrowthEl = document.getElementById('revenue-growth');
        revenueGrowthEl.innerHTML = `<i class="fas ${revenueGrowth.icon}"></i> ${revenueGrowth.value}`;
        revenueGrowthEl.className = `card-growth ${revenueGrowth.class}`;

        document.getElementById('total-bookings').textContent = data.totalBookings.current.toLocaleString();
        const bookingsGrowth = calculateGrowth(data.totalBookings.current, data.totalBookings.previous);
        const bookingsGrowthEl = document.getElementById('bookings-growth');
        bookingsGrowthEl.innerHTML = `<i class="fas ${bookingsGrowth.icon}"></i> ${bookingsGrowth.value}`;
        bookingsGrowthEl.className = `card-growth ${bookingsGrowth.class}`;

        document.getElementById('avg-booking-value').textContent = formatCurrency(data.avgBookingValue.current);
        const avgGrowth = calculateGrowth(data.avgBookingValue.current, data.avgBookingValue.previous);
        const avgGrowthEl = document.getElementById('avg-booking-growth');
        avgGrowthEl.innerHTML = `<i class="fas ${avgGrowth.icon}"></i> ${avgGrowth.value}`;
        avgGrowthEl.className = `card-growth ${avgGrowth.class}`;

        document.getElementById('conversion-rate').textContent = `${data.conversionRate.current.toFixed(1)}%`;
        const convGrowth = calculateGrowth(data.conversionRate.current, data.conversionRate.previous);
        const convGrowthEl = document.getElementById('conversion-growth');
        convGrowthEl.innerHTML = `<i class="fas ${convGrowth.icon}"></i> ${convGrowth.value}`;
        convGrowthEl.className = `card-growth ${convGrowth.class}`;
    }

    // --- Chart Creation Functions ---

    function createChart(chartId, config) {
        if (charts[chartId]) {
            charts[chartId].destroy();
        }
        const ctx = document.getElementById(chartId).getContext('2d');
        charts[chartId] = new Chart(ctx, config);
    }

    function createRevenueChart(data) {
        const config = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.revenue,
                    borderColor: '#1d5e33',
                    backgroundColor: 'rgba(29, 94, 51, 0.1)',
                    fill: true,
                    tension: 0.4,
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        };
        createChart('revenue-chart', config);
    }

    function createClassDistributionChart(data) {
        const config = {
            type: 'doughnut',
            data: {
                labels: ['Economy', 'Business', 'First Class'],
                datasets: [{
                    data: [data.economy, data.business, data.first],
                    backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        };
        createChart('class-chart', config);
    }

    function createRouteChart(data) {
        const config = {
            type: 'bar',
            data: {
                labels: data.map(d => d.route),
                datasets: [{
                    label: 'Revenue',
                    data: data.map(d => d.revenue),
                    backgroundColor: '#1d5e33',
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        };
        createChart('route-chart', config);
    }

    function createPaymentMethodsChart(data) {
        const config = {
            type: 'pie',
            data: {
                labels: ['Credit Card', 'UPI', 'Net Banking', 'Wallet'],
                datasets: [{
                    data: [data.card, data.upi, data.netbanking, data.wallet],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#9333ea'],
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        };
        createChart('payment-chart', config);
    }

    // --- Table Rendering ---

    function renderRevenueTable(data) {
        const tableBody = document.getElementById('revenue-breakdown-table');
        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.date}</td>
                <td>${row.bookings}</td>
                <td>${formatCurrency(row.gross)}</td>
                <td class="negative">${formatCurrency(row.refunds)}</td>
                <td class="positive">${formatCurrency(row.net)}</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function renderTopRoutesTable(data) {
        const tableBody = document.getElementById('top-routes-table');
        tableBody.innerHTML = '';
        const totalRevenue = data.reduce((sum, r) => sum + r.revenue, 0);
        data.forEach(row => {
            const tr = document.createElement('tr');
            const percentage = ((row.revenue / totalRevenue) * 100).toFixed(1);
            tr.innerHTML = `
                <td>${row.route}</td>
                <td>${row.bookings}</td>
                <td>${formatCurrency(row.revenue)}</td>
                <td>${percentage}%</td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // --- Mock Data Generation ---

    function generateMockData(range) {
        // This is a simplified mock data generator. A real app would get this from an API.
        const numPoints = range === 'today' ? 24 : 30;
        const revenueTrend = {
            labels: Array.from({ length: numPoints }, (_, i) => `Day ${i + 1}`),
            revenue: Array.from({ length: numPoints }, () => Math.floor(Math.random() * 50000) + 10000),
        };
        const totalRevenue = revenueTrend.revenue.reduce((a, b) => a + b, 0);
        return {
            overview: {
                totalRevenue: { current: totalRevenue, previous: totalRevenue * 0.9 },
                totalBookings: { current: 1240, previous: 1300 },
                avgBookingValue: { current: totalRevenue / 1240, previous: (totalRevenue * 0.9) / 1300 },
                conversionRate: { current: 2.5, previous: 2.3 },
            },
            revenueTrend,
            classDistribution: { economy: 65, business: 25, first: 10 },
            topRoutes: Array.from({ length: 10 }, (_, i) => ({
                route: `Route ${String.fromCharCode(65 + i)} → ${String.fromCharCode(75 + i)}`,
                bookings: Math.floor(Math.random() * 100) + 20,
                revenue: Math.floor(Math.random() * 200000) + 50000,
            })).sort((a, b) => b.revenue - a.revenue),
            paymentMethods: { card: 45, upi: 30, netbanking: 15, wallet: 10 },
            revenueBreakdown: Array.from({ length: 10 }, (_, i) => ({
                date: `2024-05-${20 - i}`,
                bookings: Math.floor(Math.random() * 50) + 10,
                gross: Math.floor(Math.random() * 100000) + 20000,
                refunds: -Math.floor(Math.random() * 5000),
                net: Math.floor(Math.random() * 95000) + 15000,
            })),
        };
    }

    // --- Skeleton Loader ---
    function showSkeletonLoaders() {
        // In a real app, you'd replace content with skeleton placeholders
        document.querySelectorAll('.card-value, .metric-value').forEach(el => el.textContent = '...');
        document.querySelectorAll('.chart-container').forEach(el => el.classList.add('loading'));
    }

    function hideSkeletonLoaders() {
        document.querySelectorAll('.chart-container').forEach(el => el.classList.remove('loading'));
    }

    // --- Event Listeners ---

    // Date Range Buttons
    const dateRangeButtons = document.querySelectorAll('.date-range-btn');
    dateRangeButtons.forEach(button => {
        button.addEventListener('click', () => {
            dateRangeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const range = button.dataset.range;
            loadRevenueData(range);
        });
    });

    // Print Button
    document.getElementById('print-report-btn').addEventListener('click', () => {
        window.print();
    });

    // Export Button
    document.getElementById('export-report-btn').addEventListener('click', () => {
        alert('Exporting to Excel... (functionality not implemented)');
    });

    // --- Initial Load ---
    loadRevenueData('last30days');

    // Add a simple resize listener to re-render charts if needed
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            Object.values(charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        }, 250);
    });
});