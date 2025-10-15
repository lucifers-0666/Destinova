// ═══════════════════════════════════════════════════════════════════════════════
// HEADER ENHANCEMENTS - Quick Search, Currency, Notifications, User Profile
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    
    // ━━━ Currency Switcher ━━━
    const currencyBtn = document.querySelector('.currency-switcher-btn');
    const currencyMenu = document.querySelector('.currency-switcher-menu');
    const selectedCurrency = document.getElementById('selected-currency');
    
    if (currencyBtn && currencyMenu) {
        // Toggle currency menu
        currencyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currencyMenu.classList.toggle('active');
            // Close other dropdowns
            if (document.querySelector('.language-switcher-menu')) {
                document.querySelector('.language-switcher-menu').classList.remove('active');
            }
            if (document.querySelector('.notification-dropdown')) {
                document.querySelector('.notification-dropdown').classList.remove('active');
            }
            if (document.querySelector('.user-profile-menu')) {
                document.querySelector('.user-profile-menu').classList.remove('active');
            }
        });
        
        // Select currency
        currencyMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const currency = e.currentTarget.dataset.currency.toUpperCase();
                const currencyIcon = e.currentTarget.querySelector('i').cloneNode(true);
                
                // Update selected currency
                if (selectedCurrency) {
                    selectedCurrency.textContent = currency;
                }
                
                // Store in localStorage
                localStorage.setItem('selectedCurrency', currency);
                
                // Close menu
                currencyMenu.classList.remove('active');
                
                // Show toast notification
                showToast(`Currency changed to ${currency}`, 'success');
                
                // TODO: Update prices across the site
                updatePrices(currency);
            });
        });
    }
    
    // Load saved currency
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && selectedCurrency) {
        selectedCurrency.textContent = savedCurrency;
    }
    
    // ━━━ Enhanced Language Switcher ━━━
    const langBtn = document.querySelector('.language-switcher-btn');
    const langMenu = document.querySelector('.language-switcher-menu');
    
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('active');
            // Close other dropdowns
            if (currencyMenu) currencyMenu.classList.remove('active');
            if (document.querySelector('.notification-dropdown')) {
                document.querySelector('.notification-dropdown').classList.remove('active');
            }
            if (document.querySelector('.user-profile-menu')) {
                document.querySelector('.user-profile-menu').classList.remove('active');
            }
        });
    }
    
    // ━━━ Notifications ━━━
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const notificationBadge = document.getElementById('notification-badge');
    const notificationList = document.getElementById('notification-list');
    const markAllReadBtn = document.getElementById('mark-all-read');
    
    if (notificationBtn && notificationDropdown) {
        // Toggle notification dropdown
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');
            // Close other dropdowns
            if (currencyMenu) currencyMenu.classList.remove('active');
            if (langMenu) langMenu.classList.remove('active');
            if (document.querySelector('.user-profile-menu')) {
                document.querySelector('.user-profile-menu').classList.remove('active');
            }
        });
        
        // Mark all as read
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', () => {
                const unreadNotifications = notificationList.querySelectorAll('.notification-item.unread');
                unreadNotifications.forEach(item => {
                    item.classList.remove('unread');
                });
                updateNotificationBadge();
                showToast('All notifications marked as read', 'success');
            });
        }
        
        // Load notifications from localStorage or API
        loadNotifications();
    }
    
    // ━━━ User Profile Menu ━━━
    const userProfileBtn = document.querySelector('.user-profile-btn');
    const userProfileMenu = document.querySelector('.user-profile-menu');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (userProfileBtn && userProfileMenu) {
        // Toggle user profile menu
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userProfileMenu.classList.toggle('active');
            userProfileBtn.classList.toggle('active');
            // Close other dropdowns
            if (currencyMenu) currencyMenu.classList.remove('active');
            if (langMenu) langMenu.classList.remove('active');
            if (notificationDropdown) notificationDropdown.classList.remove('active');
        });
        
        // Logout functionality
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Confirm logout
                if (confirm('Are you sure you want to logout?')) {
                    // Clear user session
                    localStorage.removeItem('isUserSignedIn');
                    localStorage.removeItem('userInfo');
                    
                    // Show toast
                    showToast('Logged out successfully', 'info');
                    
                    // Redirect to signin page
                    setTimeout(() => {
                        window.location.href = 'signin.html';
                    }, 1000);
                }
            });
        }
    }
    
    // ━━━ Quick Search Modal ━━━
    const quickSearchTrigger = document.getElementById('header-search-trigger');
    const quickSearchModal = document.getElementById('quick-search-modal');
    const quickSearchClose = document.getElementById('quick-search-close');
    const quickSearchOverlay = document.querySelector('.quick-search-overlay');
    const quickSearchForm = document.getElementById('quick-search-form');
    const quickSwapBtn = document.getElementById('quick-swap-btn');
    
    if (quickSearchTrigger && quickSearchModal) {
        // Open modal
        quickSearchTrigger.addEventListener('click', () => {
            quickSearchModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on first input
            setTimeout(() => {
                document.getElementById('quick-from').focus();
            }, 300);
        });
        
        // Close modal
        function closeQuickSearch() {
            quickSearchModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (quickSearchClose) {
            quickSearchClose.addEventListener('click', closeQuickSearch);
        }
        
        if (quickSearchOverlay) {
            quickSearchOverlay.addEventListener('click', closeQuickSearch);
        }
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && quickSearchModal.classList.contains('active')) {
                closeQuickSearch();
            }
        });
        
        // Swap locations
        if (quickSwapBtn) {
            quickSwapBtn.addEventListener('click', () => {
                const fromInput = document.getElementById('quick-from');
                const toInput = document.getElementById('quick-to');
                
                if (fromInput && toInput) {
                    const temp = fromInput.value;
                    fromInput.value = toInput.value;
                    toInput.value = temp;
                    
                    // Add animation
                    quickSwapBtn.style.transform = 'rotate(180deg)';
                    setTimeout(() => {
                        quickSwapBtn.style.transform = '';
                    }, 300);
                }
            });
        }
        
        // Submit quick search
        if (quickSearchForm) {
            quickSearchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = {
                    from: document.getElementById('quick-from').value,
                    to: document.getElementById('quick-to').value,
                    departure: document.getElementById('quick-departure').value,
                    return: document.getElementById('quick-return').value,
                    travelers: document.getElementById('quick-travelers').value,
                    class: document.getElementById('quick-class').value
                };
                
                // Validate
                if (!formData.from || !formData.to || !formData.departure) {
                    showToast('Please fill in all required fields', 'error');
                    return;
                }
                
                // Save to localStorage
                localStorage.setItem('quickSearchData', JSON.stringify(formData));
                
                // Redirect to results page
                showToast('Searching for flights...', 'info');
                setTimeout(() => {
                    window.location.href = 'results.html';
                }, 500);
            });
        }
    }
    
    // ━━━ Close all dropdowns when clicking outside ━━━
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.currency-switcher')) {
            if (currencyMenu) currencyMenu.classList.remove('active');
        }
        if (!e.target.closest('.language-switcher')) {
            if (langMenu) langMenu.classList.remove('active');
        }
        if (!e.target.closest('.header-notifications')) {
            if (notificationDropdown) notificationDropdown.classList.remove('active');
        }
        if (!e.target.closest('.header-user-profile')) {
            if (userProfileMenu) {
                userProfileMenu.classList.remove('active');
                if (userProfileBtn) userProfileBtn.classList.remove('active');
            }
        }
    });
    
    // ━━━ Check user login status and show/hide elements ━━━
    checkUserStatus();
    
    // ━━━ Auto-update notification badge every 30 seconds ━━━
    if (notificationBadge) {
        setInterval(() => {
            // Check for new notifications (simulate with random chance)
            if (Math.random() > 0.8) {
                addNewNotification();
            }
        }, 30000);
    }
    
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Check if user is signed in and update UI
function checkUserStatus() {
    const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    
    const signInBtn = document.getElementById('header-signin-btn');
    const userProfile = document.getElementById('header-user-profile');
    const notifications = document.getElementById('header-notifications');
    const userName = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');
    
    if (isSignedIn) {
        // Hide sign in button
        if (signInBtn) signInBtn.style.display = 'none';
        
        // Show user profile and notifications
        if (userProfile) userProfile.classList.remove('hidden');
        if (notifications) notifications.classList.remove('hidden');
        
        // Update user info
        if (userName && userInfo.name) {
            userName.textContent = userInfo.name;
        }
        if (userAvatar && userInfo.avatar) {
            userAvatar.src = userInfo.avatar;
        }
        
        // Load notifications
        loadNotifications();
    } else {
        // Show sign in button
        if (signInBtn) signInBtn.style.display = 'flex';
        
        // Hide user profile and notifications
        if (userProfile) userProfile.classList.add('hidden');
        if (notifications) notifications.classList.add('hidden');
    }
}

// Load notifications
function loadNotifications() {
    const notificationList = document.getElementById('notification-list');
    if (!notificationList) return;
    
    // Get notifications from localStorage
    let notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    // If no notifications, show sample ones for demo
    if (notifications.length === 0) {
        notifications = [
            {
                id: 1,
                type: 'info',
                title: 'Welcome to Destinova!',
                message: 'Your account has been successfully created.',
                time: '2 hours ago',
                unread: true
            },
            {
                id: 2,
                type: 'success',
                title: 'Booking Confirmed',
                message: 'Your flight to Paris has been confirmed. Booking ID: DN12345',
                time: '1 day ago',
                unread: true
            },
            {
                id: 3,
                type: 'warning',
                title: 'Price Drop Alert',
                message: 'Flights to Tokyo are now 20% off! Book now.',
                time: '3 days ago',
                unread: false
            }
        ];
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
    
    // Clear existing notifications
    notificationList.innerHTML = '';
    
    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div class="notification-empty">
                <i class="fas fa-bell-slash"></i>
                <p>No new notifications</p>
            </div>
        `;
    } else {
        notifications.forEach(notif => {
            const notifElement = document.createElement('div');
            notifElement.className = `notification-item ${notif.unread ? 'unread' : ''}`;
            notifElement.innerHTML = `
                <div class="notification-icon ${notif.type}">
                    <i class="fas fa-${getNotificationIcon(notif.type)}"></i>
                </div>
                <div class="notification-content">
                    <h5>${notif.title}</h5>
                    <p>${notif.message}</p>
                    <span class="notification-time">${notif.time}</span>
                </div>
            `;
            
            // Click to mark as read
            notifElement.addEventListener('click', () => {
                notifElement.classList.remove('unread');
                notif.unread = false;
                localStorage.setItem('notifications', JSON.stringify(notifications));
                updateNotificationBadge();
            });
            
            notificationList.appendChild(notifElement);
        });
    }
    
    // Update badge
    updateNotificationBadge();
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    return icons[type] || 'bell';
}

// Update notification badge
function updateNotificationBadge() {
    const notificationBadge = document.getElementById('notification-badge');
    if (!notificationBadge) return;
    
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const unreadCount = notifications.filter(n => n.unread).length;
    
    if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        notificationBadge.style.display = 'block';
    } else {
        notificationBadge.style.display = 'none';
    }
}

// Add new notification
function addNewNotification() {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    const newNotification = {
        id: Date.now(),
        type: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)],
        title: 'New Update',
        message: 'You have a new update in your account.',
        time: 'Just now',
        unread: true
    };
    
    notifications.unshift(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    loadNotifications();
    showToast('You have a new notification', 'info');
}

// Update prices based on currency
function updatePrices(currency) {
    // Exchange rates (sample data - in production, fetch from API)
    const rates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        INR: 83.12,
        AUD: 1.52
    };
    
    const symbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        INR: '₹',
        AUD: 'A$'
    };
    
    // Find all price elements and update them
    const priceElements = document.querySelectorAll('[data-base-price]');
    priceElements.forEach(el => {
        const basePrice = parseFloat(el.dataset.basePrice);
        const convertedPrice = (basePrice * rates[currency]).toFixed(2);
        el.textContent = `${symbols[currency]}${convertedPrice}`;
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${getToastColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        warning: 'exclamation-triangle',
        error: 'times-circle'
    };
    return icons[type] || 'info-circle';
}

function getToastColor(type) {
    const colors = {
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336'
    };
    return colors[type] || '#2196F3';
}

// Add toast animations to document
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(toastStyles);

// ═══════════════════════════════════════════════════════════════════════════════
// CART / SAVED FLIGHTS FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════════════════════

const cartBtn = document.querySelector('.cart-btn');
const cartDropdown = document.querySelector('.cart-dropdown');
const cartBadge = document.getElementById('cart-badge');
const cartCount = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items-list');
const cartFooter = document.getElementById('cart-footer');
const cartTotalPrice = document.getElementById('cart-total-price');
const clearCartBtn = document.getElementById('clear-cart');

// Initialize cart from localStorage
let savedFlights = JSON.parse(localStorage.getItem('savedFlights')) || [];

// Cart functionality
if (cartBtn && cartDropdown) {
    // Toggle cart dropdown
    cartBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cartBtn.classList.toggle('active');
        // Close other dropdowns
        if (currencyMenu) currencyMenu.classList.remove('active');
        if (langMenu) langMenu.classList.remove('active');
        if (notificationDropdown) notificationDropdown.classList.remove('active');
        if (document.querySelector('.user-profile-menu')) {
            document.querySelector('.user-profile-menu').classList.remove('active');
        }
    });
    
    // Update cart display
    updateCartDisplay();
    
    // Clear all cart items
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to remove all saved flights?')) {
                savedFlights = [];
                localStorage.setItem('savedFlights', JSON.stringify(savedFlights));
                updateCartDisplay();
                showToast('All saved flights cleared', 'info');
            }
        });
    }
}

function updateCartDisplay() {
    const count = savedFlights.length;
    
    // Update badge
    if (cartBadge) {
        cartBadge.textContent = count;
        if (count > 0) {
            cartBadge.classList.add('show');
        } else {
            cartBadge.classList.remove('show');
        }
    }
    
    // Update count in header
    if (cartCount) {
        cartCount.textContent = count;
    }
    
    // Update cart items list
    if (cartItemsList) {
        if (count === 0) {
            cartItemsList.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-heart-broken"></i>
                    <p>No saved flights yet</p>
                    <small>Save flights to compare and book later</small>
                </div>
            `;
            if (cartFooter) cartFooter.classList.add('hidden');
        } else {
            cartItemsList.innerHTML = savedFlights.map((flight, index) => `
                <div class="cart-item" data-index="${index}">
                    <div class="flight-info">
                        <strong>${flight.from} → ${flight.to}</strong>
                        <span>${flight.date}</span>
                    </div>
                    <div class="price">${flight.price}</div>
                    <button class="remove-btn" onclick="removeFromCart(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
            
            // Calculate total
            const total = savedFlights.reduce((sum, flight) => {
                const price = parseFloat(flight.price.replace(/[^0-9.]/g, ''));
                return sum + (isNaN(price) ? 0 : price);
            }, 0);
            
            if (cartTotalPrice) {
                cartTotalPrice.textContent = `$${total.toFixed(0)}`;
            }
            
            if (cartFooter) cartFooter.classList.remove('hidden');
        }
    }
}

// Add flight to cart (call this from flight cards)
window.addToCart = function(flightData) {
    // Check if already saved
    const exists = savedFlights.some(f => 
        f.from === flightData.from && 
        f.to === flightData.to && 
        f.date === flightData.date
    );
    
    if (exists) {
        showToast('Flight already in saved list', 'info');
        return;
    }
    
    savedFlights.push(flightData);
    localStorage.setItem('savedFlights', JSON.stringify(savedFlights));
    updateCartDisplay();
    showToast(`Flight saved: ${flightData.from} → ${flightData.to}`, 'success');
};

// Remove flight from cart
window.removeFromCart = function(index) {
    const removed = savedFlights.splice(index, 1)[0];
    localStorage.setItem('savedFlights', JSON.stringify(savedFlights));
    updateCartDisplay();
    showToast(`Removed: ${removed.from} → ${removed.to}`, 'info');
};

// Example usage - Add this button to flight cards:
// <button onclick="addToCart({from: 'NYC', to: 'LON', date: 'Dec 15', price: '$850'})">
//     <i class="fas fa-heart"></i> Save
// </button>
