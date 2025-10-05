# Admin Panel Files

This folder contains all admin-related pages and their associated resources for the Destinova Air Ticket Booking system.

## Folder Structure

```
Admin/
├── html/
│   ├── admin-dashboard.html          ⭐ NEW
│   ├── manage-users.html
│   ├── notification-management.html
│   ├── refund-management.html
│   └── revenue-reports.html
├── css/
│   ├── admin-dashboard.css           ⭐ NEW
│   ├── manage-users.css
│   ├── notification-management.css
│   ├── refund-management.css
│   └── revenue-reports.css
└── js/
    ├── admin-dashboard.js            ⭐ NEW
    ├── manage-users.js
    ├── notification-management.js
    ├── refund-management.js
    └── revenue-reports.js
```

## Admin Pages

### 1. **Admin Dashboard** (`admin-dashboard.html`) ⭐ NEW - MAIN ADMIN PAGE
   - **Main admin landing page** with comprehensive overview
   - **Real-time statistics**: Today's bookings, revenue, active flights, registered users
   - **Interactive charts**: Revenue trends (30 days), Bookings by class distribution
   - **Recent activity feed**: Live updates of bookings, cancellations, registrations
   - **Quick actions**: Create flight, Add user, Send notification, Generate report
   - **System alerts**: Critical notifications with priority levels
   - **Performance metrics**: Conversion rate, Average booking value, Cancellation rate, Customer satisfaction
   - **Global search**: Search across bookings, users, and flights
   - **Features**: Auto-refresh, keyboard shortcuts, responsive design, Chart.js integration

### 2. **Manage Users** (`manage-users.html`)
   - User management interface for administrators
   - View, edit, and manage user accounts
   - Assign roles and permissions

### 3. **Notification Management** (`notification-management.html`)
   - Manage system notifications
   - Send announcements to users
   - Configure notification settings

### 4. **Refund Management** (`refund-management.html`)
   - Process and track refund requests
   - Approve or reject refund applications
   - View refund history and status

### 5. **Revenue Reports** (`revenue-reports.html`)
   - View financial reports and analytics
   - Track revenue metrics
   - Generate revenue insights with charts

## Features

### Admin Dashboard Highlights:
- ✅ **Live Statistics**: Real-time counter animations
- ✅ **Revenue Chart**: 30-day trend with Chart.js
- ✅ **Class Distribution**: Donut chart with percentages
- ✅ **Activity Feed**: Auto-refreshing every 30 seconds
- ✅ **System Alerts**: Priority-based notifications
- ✅ **Global Search**: Debounced search with autocomplete
- ✅ **Quick Actions**: One-click access to common tasks
- ✅ **Performance Metrics**: Animated progress bars
- ✅ **Keyboard Shortcuts**: D (Dashboard), S (Search), N (Notifications)
- ✅ **Responsive Design**: Mobile-friendly sidebar toggle
- ✅ **Auto-refresh**: Dashboard updates every 5 minutes

## Path Updates

All file paths have been updated to reflect the new Admin folder structure:
- CSS files: `../css/`
- JS files: `../js/`
- Images: `../../site-images/`
- Main site navigation: `../../html/`

## Missing Pages (To Be Developed)

The following pages are referenced in navigation but not yet created:
- `manage-bookings.html` - Manage all flight bookings
- `flight-management.html` - Manage flight schedules and availability
- `settings.html` - Admin system settings and configuration

## Access

These pages are restricted to administrators only. Users must have admin privileges to access these pages.

## Getting Started

1. Open `admin-dashboard.html` in your browser
2. Use the sidebar navigation to access different admin sections
3. All data is currently mocked - connect to your backend API for real data
4. Chart.js is loaded from CDN - ensure internet connection for charts to work
