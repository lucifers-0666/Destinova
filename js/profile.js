/**
 * 👤 DESTINOVA PROFILE
 * User profile management with API integration
 */

'use strict';

// ============================================
// STATE MANAGEMENT
// ============================================

const ProfileState = {
    user: null,
    isEditing: false,
    originalData: null
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('👤 Profile Page Initialized');
    
    // Check authentication
    checkAuthentication();
    
    // Load user profile
    loadUserProfile();
    
    // Setup form handlers
    setupFormHandlers();
    
    // Setup tab navigation
    setupTabNavigation();
    
    // Make header solid
    const header = document.getElementById('header-main');
    if (header) {
        header.classList.add('header-scrolled');
    }
    
    // AOS Initialization
    if (typeof AOS !== 'undefined') {
        AOS.init({ once: true });
    }
});

// ============================================
// AUTHENTICATION CHECK
// ============================================

/**
 * Check if user is authenticated
 */
function checkAuthentication() {
    const token = localStorage.getItem('destinova_token');
    const isSignedIn = localStorage.getItem('isUserSignedIn') === 'true';
    
    if (!token && !isSignedIn) {
        // Redirect to sign-in if not logged in
        window.location.href = 'sign-in.html?redirect=' + encodeURIComponent(window.location.href);
        return false;
    }
    
    return true;
}

// ============================================
// PROFILE LOADING
// ============================================

/**
 * Load user profile from API or localStorage
 */
async function loadUserProfile() {
    showLoading(true);
    
    try {
        // Try to load from API first
        if (typeof UsersAPI !== 'undefined') {
            const response = await UsersAPI.getProfile();
            if (response.success && response.data) {
                ProfileState.user = response.data.user || response.data;
                localStorage.setItem('destinova_user', JSON.stringify(ProfileState.user));
                updateProfileUI(ProfileState.user);
                return;
            }
        }
        
        // Fallback to localStorage
        const storedUser = localStorage.getItem('destinova_user');
        if (storedUser) {
            ProfileState.user = JSON.parse(storedUser);
            updateProfileUI(ProfileState.user);
        } else {
            // Create placeholder user
            ProfileState.user = {
                firstName: 'Guest',
                lastName: 'User',
                email: 'guest@example.com'
            };
            updateProfileUI(ProfileState.user);
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
        
        // Fallback to localStorage
        const storedUser = localStorage.getItem('destinova_user');
        if (storedUser) {
            ProfileState.user = JSON.parse(storedUser);
            updateProfileUI(ProfileState.user);
        }
    } finally {
        showLoading(false);
    }
}

/**
 * Update profile UI with user data
 */
function updateProfileUI(user) {
    if (!user) return;
    
    // Update display fields
    const nameEl = document.getElementById('profile-name') || document.querySelector('.profile-name');
    const emailEl = document.getElementById('profile-email') || document.querySelector('.profile-email');
    const phoneEl = document.getElementById('profile-phone') || document.querySelector('.profile-phone');
    const avatarEl = document.getElementById('profile-avatar') || document.querySelector('.profile-avatar');
    
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    
    if (nameEl) nameEl.textContent = fullName || 'User';
    if (emailEl) emailEl.textContent = user.email || '';
    if (phoneEl) phoneEl.textContent = user.phone || 'Not set';
    
    // Update avatar
    if (avatarEl) {
        if (user.avatar) {
            avatarEl.src = user.avatar;
        } else {
            // Generate initials avatar
            const initials = `${(user.firstName || 'U')[0]}${(user.lastName || '')[0] || ''}`.toUpperCase();
            avatarEl.alt = initials;
        }
    }
    
    // Update form fields if they exist
    const fields = {
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'phone': user.phone,
        'dateOfBirth': user.dateOfBirth?.split('T')[0],
        'gender': user.gender,
        'nationality': user.nationality,
        'address': user.address,
        'city': user.city,
        'state': user.state,
        'country': user.country,
        'zipCode': user.zipCode,
        'passportNumber': user.passportNumber,
        'passportExpiry': user.passportExpiry?.split('T')[0]
    };
    
    Object.entries(fields).forEach(([id, value]) => {
        const input = document.getElementById(id);
        if (input && value) {
            input.value = value;
        }
    });
    
    // Update stats
    updateUserStats(user);
    
    // Update travel preferences
    if (user.preferences) {
        updatePreferences(user.preferences);
    }
}

/**
 * Update user statistics
 */
function updateUserStats(user) {
    const stats = {
        'total-bookings': user.totalBookings || 0,
        'loyalty-points': user.loyaltyPoints || 0,
        'membership-tier': user.membershipTier || 'Silver',
        'miles-traveled': user.milesTraveled || 0
    };
    
    Object.entries(stats).forEach(([id, value]) => {
        const el = document.getElementById(id) || document.querySelector(`.${id}`);
        if (el) {
            el.textContent = typeof value === 'number' ? value.toLocaleString() : value;
        }
    });
}

/**
 * Update travel preferences
 */
function updatePreferences(preferences) {
    if (!preferences) return;
    
    // Seat preference
    const seatPref = document.getElementById('seat-preference');
    if (seatPref && preferences.seatPreference) {
        seatPref.value = preferences.seatPreference;
    }
    
    // Meal preference
    const mealPref = document.getElementById('meal-preference');
    if (mealPref && preferences.mealPreference) {
        mealPref.value = preferences.mealPreference;
    }
    
    // Notification preferences
    const notifPrefs = ['email-notifications', 'sms-notifications', 'deals-notifications', 'flight-updates'];
    notifPrefs.forEach(pref => {
        const checkbox = document.getElementById(pref);
        if (checkbox && preferences[pref.replace(/-/g, '_')] !== undefined) {
            checkbox.checked = preferences[pref.replace(/-/g, '_')];
        }
    });
}

// ============================================
// FORM HANDLERS
// ============================================

/**
 * Setup form handlers
 */
function setupFormHandlers() {
    // Personal info form
    const personalForm = document.getElementById('personal-info-form');
    if (personalForm) {
        personalForm.addEventListener('submit', handlePersonalInfoSubmit);
    }
    
    // Password form
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
    
    // Preferences form
    const preferencesForm = document.getElementById('preferences-form');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', handlePreferencesSubmit);
    }
    
    // Edit button
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', toggleEditMode);
    }
    
    // Avatar upload
    const avatarInput = document.getElementById('avatar-upload');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
}

/**
 * Toggle edit mode
 */
function toggleEditMode() {
    ProfileState.isEditing = !ProfileState.isEditing;
    
    const editBtn = document.getElementById('edit-profile-btn');
    const formInputs = document.querySelectorAll('.profile-form input:not([type="password"]), .profile-form select');
    const saveBtn = document.getElementById('save-profile-btn');
    
    formInputs.forEach(input => {
        input.disabled = !ProfileState.isEditing;
    });
    
    if (editBtn) {
        editBtn.textContent = ProfileState.isEditing ? 'Cancel' : 'Edit Profile';
        editBtn.classList.toggle('btn-secondary', ProfileState.isEditing);
    }
    
    if (saveBtn) {
        saveBtn.style.display = ProfileState.isEditing ? 'block' : 'none';
    }
    
    if (!ProfileState.isEditing) {
        // Revert to original data
        updateProfileUI(ProfileState.user);
    } else {
        // Store original data
        ProfileState.originalData = { ...ProfileState.user };
    }
}

/**
 * Handle personal info form submission
 */
async function handlePersonalInfoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    showLoading(true);
    
    try {
        if (typeof UsersAPI !== 'undefined') {
            const response = await UsersAPI.updateProfile(data);
            
            if (response.success) {
                ProfileState.user = { ...ProfileState.user, ...data };
                localStorage.setItem('destinova_user', JSON.stringify(ProfileState.user));
                updateProfileUI(ProfileState.user);
                showNotification('Profile updated successfully!', 'success');
                
                // Exit edit mode
                if (ProfileState.isEditing) {
                    toggleEditMode();
                }
            } else {
                throw new Error(response.message || 'Failed to update profile');
            }
        } else {
            // Offline mode - save to localStorage
            ProfileState.user = { ...ProfileState.user, ...data };
            localStorage.setItem('destinova_user', JSON.stringify(ProfileState.user));
            updateProfileUI(ProfileState.user);
            showNotification('Profile saved locally!', 'success');
            
            if (ProfileState.isEditing) {
                toggleEditMode();
            }
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification(error.message || 'Failed to update profile', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Handle password change
 */
async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password')?.value;
    const newPassword = document.getElementById('new-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    
    // Validation
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        if (typeof UsersAPI !== 'undefined') {
            const response = await UsersAPI.changePassword({
                currentPassword,
                newPassword
            });
            
            if (response.success) {
                showNotification('Password changed successfully!', 'success');
                e.target.reset();
            } else {
                throw new Error(response.message || 'Failed to change password');
            }
        } else {
            showNotification('Password change requires server connection', 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification(error.message || 'Failed to change password', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Handle preferences form submission
 */
async function handlePreferencesSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const preferences = {
        seatPreference: formData.get('seat-preference'),
        mealPreference: formData.get('meal-preference'),
        email_notifications: formData.get('email-notifications') === 'on',
        sms_notifications: formData.get('sms-notifications') === 'on',
        deals_notifications: formData.get('deals-notifications') === 'on',
        flight_updates: formData.get('flight-updates') === 'on'
    };
    
    showLoading(true);
    
    try {
        if (typeof UsersAPI !== 'undefined') {
            const response = await UsersAPI.updatePreferences(preferences);
            
            if (response.success) {
                ProfileState.user.preferences = preferences;
                localStorage.setItem('destinova_user', JSON.stringify(ProfileState.user));
                showNotification('Preferences saved!', 'success');
            } else {
                throw new Error(response.message || 'Failed to save preferences');
            }
        } else {
            // Offline mode
            ProfileState.user.preferences = preferences;
            localStorage.setItem('destinova_user', JSON.stringify(ProfileState.user));
            showNotification('Preferences saved locally!', 'success');
        }
    } catch (error) {
        console.error('Error saving preferences:', error);
        showNotification(error.message || 'Failed to save preferences', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Handle avatar upload
 */
async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        if (typeof UsersAPI !== 'undefined') {
            const formData = new FormData();
            formData.append('avatar', file);
            
            const response = await UsersAPI.uploadAvatar(formData);
            
            if (response.success && response.data?.avatarUrl) {
                ProfileState.user.avatar = response.data.avatarUrl;
                localStorage.setItem('destinova_user', JSON.stringify(ProfileState.user));
                
                const avatarEl = document.getElementById('profile-avatar');
                if (avatarEl) {
                    avatarEl.src = response.data.avatarUrl;
                }
                
                showNotification('Avatar updated!', 'success');
            }
        } else {
            // Preview locally
            const reader = new FileReader();
            reader.onload = (event) => {
                const avatarEl = document.getElementById('profile-avatar');
                if (avatarEl) {
                    avatarEl.src = event.target.result;
                }
            };
            reader.readAsDataURL(file);
            showNotification('Avatar preview updated!', 'success');
        }
    } catch (error) {
        console.error('Error uploading avatar:', error);
        showNotification('Failed to upload avatar', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// TAB NAVIGATION
// ============================================

/**
 * Setup tab navigation
 */
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.profile-tab');
    const panels = document.querySelectorAll('.profile-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.dataset.panel;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target panel
            panels.forEach(panel => {
                panel.classList.toggle('active', panel.id === targetPanel);
            });
        });
    });
}

// ============================================
// ACCOUNT ACTIONS
// ============================================

/**
 * Logout user
 */
async function logout() {
    try {
        if (typeof AuthAPI !== 'undefined') {
            await AuthAPI.logout();
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    // Clear all auth data
    localStorage.removeItem('destinova_token');
    localStorage.removeItem('destinova_refresh_token');
    localStorage.removeItem('destinova_user');
    localStorage.removeItem('isUserSignedIn');
    
    // Redirect to home
    window.location.href = 'index.html';
}

/**
 * Delete account
 */
async function deleteAccount() {
    const confirmed = confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (!confirmed) return;
    
    const doubleConfirm = prompt('Type "DELETE" to confirm account deletion:');
    
    if (doubleConfirm !== 'DELETE') {
        showNotification('Account deletion cancelled', 'info');
        return;
    }
    
    showLoading(true);
    
    try {
        if (typeof UsersAPI !== 'undefined') {
            const response = await UsersAPI.deleteAccount();
            
            if (response.success) {
                // Clear all data and redirect
                localStorage.clear();
                window.location.href = 'index.html?deleted=true';
            } else {
                throw new Error(response.message || 'Failed to delete account');
            }
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        showNotification(error.message || 'Failed to delete account', 'error');
    } finally {
        showLoading(false);
    }
}

// ============================================
// UI UTILITIES
// ============================================

/**
 * Show/hide loading overlay
 */
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
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

window.logout = logout;
window.deleteAccount = deleteAccount;
window.toggleEditMode = toggleEditMode;