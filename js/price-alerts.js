/**
 * 🔔 DESTINOVA PRICE ALERTS
 * Manage flight price alerts and notifications
 */

'use strict';

// ============================================
// STATE
// ============================================

const PriceAlertsState = {
    alerts: [],
    isLoading: false
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔔 Price Alerts Page Initialized');
    
    // Check authentication
    if (!checkAuth()) return;
    
    // Set default date to tomorrow
    setDefaultDate();
    
    // Setup form handler
    setupFormHandler();
    
    // Load existing alerts
    loadAlerts();
});

/**
 * Check if user is authenticated
 */
function checkAuth() {
    const token = localStorage.getItem('destinova_token');
    if (!token) {
        window.location.href = 'sign-in.html?redirect=' + encodeURIComponent(window.location.href);
        return false;
    }
    return true;
}

/**
 * Set default date to tomorrow
 */
function setDefaultDate() {
    const dateInput = document.getElementById('alert-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
}

/**
 * Setup form submission handler
 */
function setupFormHandler() {
    const form = document.getElementById('create-alert-form');
    if (form) {
        form.addEventListener('submit', handleCreateAlert);
    }
}

// ============================================
// DATA LOADING
// ============================================

/**
 * Load existing price alerts
 */
async function loadAlerts() {
    PriceAlertsState.isLoading = true;
    showLoading(true);
    
    try {
        let alerts = [];
        
        // Try API first
        if (typeof PriceAlertsAPI !== 'undefined') {
            const response = await PriceAlertsAPI.getMyAlerts();
            if (response.success && response.data) {
                alerts = response.data.alerts || response.data;
            }
        }
        
        // Fallback to localStorage
        if (!alerts.length) {
            const stored = localStorage.getItem('destinova_price_alerts');
            if (stored) {
                alerts = JSON.parse(stored);
            }
        }
        
        PriceAlertsState.alerts = alerts;
        renderAlerts();
        
    } catch (error) {
        console.error('Error loading alerts:', error);
        showError('Failed to load price alerts');
    } finally {
        PriceAlertsState.isLoading = false;
        showLoading(false);
    }
}

// ============================================
// RENDERING
// ============================================

/**
 * Render alerts list
 */
function renderAlerts() {
    const container = document.getElementById('alerts-list');
    const countEl = document.getElementById('alert-count');
    const alerts = PriceAlertsState.alerts;
    
    // Update count
    const activeCount = alerts.filter(a => a.isActive !== false).length;
    countEl.textContent = `${activeCount} active alert${activeCount !== 1 ? 's' : ''}`;
    
    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <h3>No Price Alerts Yet</h3>
                <p>Create your first price alert above to start monitoring flight prices for your favorite routes.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = alerts.map(alert => createAlertCard(alert)).join('');
}

/**
 * Create alert card HTML
 */
function createAlertCard(alert) {
    const isPaused = alert.isActive === false;
    const currentPrice = alert.currentPrice || Math.floor(alert.targetPrice * (0.9 + Math.random() * 0.3));
    const priceDiff = currentPrice - alert.targetPrice;
    const priceClass = priceDiff <= 0 ? 'price-down' : 'price-up';
    
    return `
        <div class="alert-card" data-alert-id="${alert._id || alert.id}">
            <div class="alert-icon">
                <i class="fas fa-plane"></i>
            </div>
            
            <div class="alert-details">
                <div class="alert-route">
                    <span>${alert.origin || alert.from}</span>
                    <span class="arrow"><i class="fas fa-arrow-right"></i></span>
                    <span>${alert.destination || alert.to}</span>
                </div>
                <div class="alert-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(alert.travelDate || alert.date)}</span>
                    <span><i class="fas fa-chair"></i> ${formatClass(alert.cabinClass || alert.class)}</span>
                    ${isPaused ? '<span><i class="fas fa-pause-circle"></i> Paused</span>' : ''}
                </div>
            </div>
            
            <div class="alert-price">
                <div class="price-label">Target Price</div>
                <div class="price-value">₹${(alert.targetPrice || alert.price).toLocaleString()}</div>
                <div class="current-price ${priceClass}">
                    Current: ₹${currentPrice.toLocaleString()}
                    ${priceDiff <= 0 ? '<i class="fas fa-arrow-down"></i>' : '<i class="fas fa-arrow-up"></i>'}
                </div>
            </div>
            
            <div class="alert-actions">
                <button class="alert-action-btn toggle ${isPaused ? 'paused' : ''}" 
                        onclick="toggleAlert('${alert._id || alert.id}')" 
                        title="${isPaused ? 'Resume' : 'Pause'} Alert">
                    <i class="fas fa-${isPaused ? 'play' : 'pause'}"></i>
                </button>
                <button class="alert-action-btn edit" 
                        onclick="editAlert('${alert._id || alert.id}')" 
                        title="Edit Alert">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="alert-action-btn delete" 
                        onclick="deleteAlert('${alert._id || alert.id}')" 
                        title="Delete Alert">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
    if (!dateStr) return 'Any date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format cabin class
 */
function formatClass(cabinClass) {
    const classes = {
        'economy': 'Economy',
        'business': 'Business',
        'first': 'First Class'
    };
    return classes[cabinClass] || 'Economy';
}

// ============================================
// ALERT OPERATIONS
// ============================================

/**
 * Handle create alert form submission
 */
async function handleCreateAlert(e) {
    e.preventDefault();
    
    const form = e.target;
    const alertData = {
        origin: document.getElementById('alert-from').value.trim(),
        destination: document.getElementById('alert-to').value.trim(),
        travelDate: document.getElementById('alert-date').value,
        targetPrice: parseInt(document.getElementById('alert-price').value),
        cabinClass: document.getElementById('alert-class').value,
        isActive: true,
        createdAt: new Date().toISOString()
    };
    
    // Validation
    if (!alertData.origin || !alertData.destination) {
        showNotification('Please enter origin and destination', 'error');
        return;
    }
    
    if (!alertData.targetPrice || alertData.targetPrice < 500) {
        showNotification('Please enter a valid target price (min ₹500)', 'error');
        return;
    }
    
    try {
        let newAlert;
        
        // Try API first
        if (typeof PriceAlertsAPI !== 'undefined') {
            const response = await PriceAlertsAPI.createAlert(alertData);
            if (response.success && response.data) {
                newAlert = response.data.alert || response.data;
            } else {
                throw new Error(response.message || 'Failed to create alert');
            }
        } else {
            // Local storage fallback
            newAlert = {
                ...alertData,
                id: `alert_${Date.now()}`,
                _id: `alert_${Date.now()}`
            };
        }
        
        // Add to state
        PriceAlertsState.alerts.unshift(newAlert);
        
        // Save to localStorage as backup
        saveAlertsLocally();
        
        // Re-render
        renderAlerts();
        
        // Reset form
        form.reset();
        setDefaultDate();
        
        showNotification('Price alert created successfully!', 'success');
        
    } catch (error) {
        console.error('Error creating alert:', error);
        showNotification(error.message || 'Failed to create alert', 'error');
    }
}

/**
 * Toggle alert active status
 */
async function toggleAlert(alertId) {
    const alert = PriceAlertsState.alerts.find(a => (a._id || a.id) === alertId);
    if (!alert) return;
    
    try {
        const newStatus = alert.isActive !== false ? false : true;
        
        if (typeof PriceAlertsAPI !== 'undefined') {
            await PriceAlertsAPI.updateAlert(alertId, { isActive: newStatus });
        }
        
        // Update local state
        alert.isActive = newStatus;
        saveAlertsLocally();
        renderAlerts();
        
        showNotification(newStatus ? 'Alert resumed' : 'Alert paused', 'success');
        
    } catch (error) {
        console.error('Error toggling alert:', error);
        showNotification('Failed to update alert', 'error');
    }
}

/**
 * Edit alert (open modal or inline edit)
 */
function editAlert(alertId) {
    const alert = PriceAlertsState.alerts.find(a => (a._id || a.id) === alertId);
    if (!alert) return;
    
    // Pre-fill form with alert data
    document.getElementById('alert-from').value = alert.origin || alert.from || '';
    document.getElementById('alert-to').value = alert.destination || alert.to || '';
    document.getElementById('alert-date').value = alert.travelDate || alert.date || '';
    document.getElementById('alert-price').value = alert.targetPrice || alert.price || '';
    document.getElementById('alert-class').value = alert.cabinClass || alert.class || 'economy';
    
    // Delete the old alert
    deleteAlert(alertId, true);
    
    // Scroll to form
    document.querySelector('.create-alert-section').scrollIntoView({ behavior: 'smooth' });
    
    showNotification('Edit the alert details and save', 'info');
}

/**
 * Delete alert
 */
async function deleteAlert(alertId, silent = false) {
    if (!silent) {
        const confirmed = confirm('Are you sure you want to delete this price alert?');
        if (!confirmed) return;
    }
    
    try {
        if (typeof PriceAlertsAPI !== 'undefined') {
            await PriceAlertsAPI.deleteAlert(alertId);
        }
        
        // Remove from state
        PriceAlertsState.alerts = PriceAlertsState.alerts.filter(
            a => (a._id || a.id) !== alertId
        );
        
        saveAlertsLocally();
        renderAlerts();
        
        if (!silent) {
            showNotification('Alert deleted', 'success');
        }
        
    } catch (error) {
        console.error('Error deleting alert:', error);
        if (!silent) {
            showNotification('Failed to delete alert', 'error');
        }
    }
}

// ============================================
// LOCAL STORAGE
// ============================================

/**
 * Save alerts to localStorage
 */
function saveAlertsLocally() {
    localStorage.setItem('destinova_price_alerts', JSON.stringify(PriceAlertsState.alerts));
}

// ============================================
// UI UTILITIES
// ============================================

/**
 * Show/hide loading
 */
function showLoading(show) {
    const container = document.getElementById('alerts-list');
    if (show && container) {
        container.innerHTML = '<div class="loading-spinner"></div>';
    }
}

/**
 * Show error message
 */
function showError(message) {
    const container = document.getElementById('alerts-list');
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Something went wrong</h3>
                <p>${message}</p>
                <button class="create-btn" onclick="loadAlerts()" style="margin-top: 20px;">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Check for existing notification system
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not present
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 10px;
                background: white;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            .notification-success { border-left: 4px solid #2e7d32; }
            .notification-success i { color: #2e7d32; }
            .notification-error { border-left: 4px solid #dc3545; }
            .notification-error i { color: #dc3545; }
            .notification-info { border-left: 4px solid #1a5f4a; }
            .notification-info i { color: #1a5f4a; }
            @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.toggleAlert = toggleAlert;
window.editAlert = editAlert;
window.deleteAlert = deleteAlert;
