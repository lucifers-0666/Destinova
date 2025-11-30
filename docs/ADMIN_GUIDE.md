# 🛡️ Destinova Admin Guide

This comprehensive guide covers all administrative functions of the Destinova flight booking platform.

---

## Table of Contents

1. [Admin Login](#1-admin-login)
2. [Dashboard Overview](#2-dashboard-overview)
3. [Managing Flights](#3-managing-flights)
4. [Managing Bookings](#4-managing-bookings)
5. [Processing Refunds](#5-processing-refunds)
6. [Managing Users](#6-managing-users)
7. [Viewing Reports](#7-viewing-reports)
8. [System Settings](#8-system-settings)
9. [Troubleshooting](#9-troubleshooting)
10. [Security Best Practices](#10-security-best-practices)

---

## 1. Admin Login

### Accessing the Admin Panel

**URL:** `https://yourdomain.com/Admin/`

### Login Credentials

Admin accounts are created by system administrators. Default credentials for initial setup:

- **Email:** admin@destinova.com
- **Password:** [Set during initial setup]

> ⚠️ **Important:** Change default password immediately after first login!

### Two-Factor Authentication (2FA)

For enhanced security, 2FA is **required** for all admin accounts:

1. After entering credentials, enter the 6-digit code from your authenticator app
2. Supported apps: Google Authenticator, Authy, Microsoft Authenticator

### Session Security

- Admin sessions expire after **30 minutes of inactivity**
- Maximum **1 active session** per admin account
- All login attempts are logged for security audit

---

## 2. Dashboard Overview

### Dashboard Sections

The admin dashboard provides a real-time overview of platform activity:

#### Key Metrics
| Metric | Description |
|--------|-------------|
| **Today's Bookings** | Number of bookings made today |
| **Today's Revenue** | Total revenue generated today |
| **Active Users** | Users currently online |
| **Pending Refunds** | Refund requests awaiting processing |

#### Quick Stats
- **Total Flights:** Active flights in the system
- **Total Bookings:** All-time booking count
- **Total Users:** Registered user count
- **Average Rating:** Platform review score

#### Recent Activity
- Latest bookings (last 10)
- Recent user registrations
- New reviews submitted
- System alerts

#### Charts & Graphs
- **Revenue Trend:** Daily/Weekly/Monthly
- **Booking Distribution:** By airline, route, class
- **User Growth:** Registration trends
- **Popular Routes:** Top 10 searched routes

### Dashboard Controls

- **Date Range Selector:** Filter data by custom date range
- **Refresh Button:** Update all metrics
- **Export:** Download dashboard data as PDF/CSV

---

## 3. Managing Flights

### Viewing All Flights

**Navigation:** Admin → Flights → All Flights

#### Flight List View
| Column | Description |
|--------|-------------|
| Flight Number | Unique flight identifier |
| Route | Origin → Destination |
| Departure | Date and time |
| Status | Scheduled/Delayed/Cancelled |
| Seats | Available/Total |
| Price | Current base price |
| Actions | Edit/Delete/View |

#### Filtering Options
- By status (Scheduled, Delayed, Cancelled, Completed)
- By airline
- By route (origin/destination)
- By date range
- By seat availability

### Adding a New Flight

**Navigation:** Admin → Flights → Add Flight

#### Required Information

**Basic Details:**
```
- Flight Number: DN-XXX (unique identifier)
- Airline: Select from registered airlines
- Aircraft Type: Boeing 737, Airbus A320, etc.
```

**Route Information:**
```
Origin:
  - Airport Code: DEL
  - Airport Name: Indira Gandhi International Airport
  - City: Delhi
  - Country: India
  - Terminal: T3

Destination:
  - Airport Code: BOM
  - Airport Name: Chhatrapati Shivaji International Airport
  - City: Mumbai
  - Country: India
  - Terminal: T2
```

**Schedule:**
```
- Departure Time: Date and time
- Arrival Time: Date and time
- Duration: Auto-calculated or manual
- Operating Days: Select days of week (for recurring flights)
```

**Pricing:**
```
- Base Price: Starting price
- Economy Price: Standard fare
- Business Price: Premium fare
- First Class Price: Luxury fare
- Tax Amount: Applicable taxes
```

**Seat Configuration:**
```
- Total Seats: Maximum capacity
- Economy Seats: Number available
- Business Seats: Number available
- First Class Seats: Number available
```

**Additional Settings:**
```
- Baggage Allowance (check-in and cabin)
- Meal Options available
- WiFi availability
- Entertainment options
- Cancellation policy
- Change policy
```

### Editing a Flight

1. Find the flight in the list
2. Click **"Edit"** action button
3. Modify required fields
4. Click **"Save Changes"**

> ⚠️ **Warning:** Changes to flights with existing bookings will trigger notifications to affected passengers.

### Deleting a Flight

1. Click **"Delete"** on the flight
2. Confirm deletion
3. System will:
   - Check for existing bookings
   - If bookings exist: Show warning and options
   - If no bookings: Delete immediately

### Bulk Operations

**Bulk Price Update:**
1. Select multiple flights
2. Click "Bulk Actions" → "Update Prices"
3. Enter percentage increase/decrease
4. Confirm changes

**Cancel Multiple Flights:**
1. Select flights to cancel
2. Click "Bulk Actions" → "Cancel Flights"
3. Enter cancellation reason
4. System auto-initiates refunds for all bookings

---

## 4. Managing Bookings

### Viewing All Bookings

**Navigation:** Admin → Bookings → All Bookings

#### Booking Status Types

| Status | Description |
|--------|-------------|
| **Pending** | Awaiting payment |
| **Confirmed** | Payment received, booking active |
| **Completed** | Flight departed, journey complete |
| **Cancelled** | Booking cancelled |
| **No-Show** | Passenger didn't board |

#### Payment Status Types

| Status | Description |
|--------|-------------|
| **Pending** | Payment not yet received |
| **Paid** | Payment successful |
| **Failed** | Payment failed |
| **Refunded** | Full refund processed |
| **Partial Refund** | Partial refund issued |

### Booking Details View

Click on any booking to view:

- **Passenger Information:** Names, contact details, documents
- **Flight Details:** Route, times, seats
- **Payment Information:** Amount, method, transaction ID
- **Timeline:** All actions taken on booking
- **Notes:** Internal admin notes

### Modifying Bookings

**Change Passenger Details:**
1. Open booking details
2. Click "Edit Passenger Info"
3. Update name/contact as needed
4. Save changes

**Change Seats:**
1. Open booking details
2. Click "Change Seats"
3. Select new seats from available options
4. Confirm changes

**Change Flight:**
1. Open booking details
2. Click "Change Flight"
3. Search available flights
4. Select new flight
5. Calculate fare difference
6. Process additional payment or refund

### Cancelling a Booking (Admin)

1. Open booking details
2. Click "Cancel Booking"
3. Select reason:
   - Customer Request
   - Flight Cancelled
   - Airline Request
   - Fraudulent Booking
   - Other

4. Choose refund option:
   - Full Refund
   - Partial Refund
   - No Refund

5. Confirm cancellation

---

## 5. Processing Refunds

### Refund Queue

**Navigation:** Admin → Refunds → Pending Refunds

#### Refund Status Types

| Status | Description |
|--------|-------------|
| **Pending** | Awaiting admin review |
| **Approved** | Approved, processing |
| **Processed** | Refund sent to customer |
| **Rejected** | Refund denied |

### Reviewing Refund Requests

Each refund request shows:
- Request ID
- Booking Reference
- Customer Details
- Original Amount
- Requested Amount
- Reason
- Supporting Documents (if any)
- Submission Date

### Approving Refunds

1. Open refund request
2. Review booking and payment details
3. Verify cancellation reason
4. Check applicable policy
5. Determine refund amount:
   - Auto-calculated based on policy
   - Manual adjustment if needed
   
6. Add admin notes (optional)
7. Click **"Approve Refund"**
8. Confirm the action

### Rejecting Refunds

1. Open refund request
2. Click **"Reject Refund"**
3. **Required:** Enter rejection reason
4. Confirm rejection

> Customer will receive email notification with rejection reason.

### Refund Processing

After approval:
1. System automatically processes refund via Stripe
2. Refund typically takes 5-10 business days
3. Customer receives confirmation email
4. Booking status updates to "Refunded"

### Manual Refund Processing

For offline payments or special cases:
1. Click "Process Manual Refund"
2. Enter refund details
3. Upload proof of refund (bank statement, etc.)
4. Mark as processed

---

## 6. Managing Users

### User List

**Navigation:** Admin → Users → All Users

#### User Information
- User ID
- Name
- Email
- Phone
- Registration Date
- Total Bookings
- Account Status
- Last Active

### User Details

Click on any user to view:
- **Profile:** Personal information
- **Bookings:** All user bookings
- **Payments:** Payment history
- **Reviews:** Submitted reviews
- **Activity Log:** Login history, actions

### User Actions

**Block User:**
1. Find user in list
2. Click "Block User"
3. Enter reason (required)
4. Select duration:
   - Temporary (24h, 7d, 30d)
   - Permanent
5. Confirm block

> Blocked users cannot login or make bookings.

**Unblock User:**
1. Go to blocked users list
2. Click "Unblock"
3. Confirm action

**Reset Password:**
1. Open user details
2. Click "Reset Password"
3. System sends password reset email to user

**Delete User:**
1. Open user details
2. Click "Delete Account"
3. Review impact (bookings, payments)
4. Confirm deletion

> ⚠️ **Warning:** User deletion is irreversible. All user data will be anonymized.

### Creating Admin Users

**Navigation:** Admin → Users → Admin Users → Add Admin

Required information:
- Full Name
- Email
- Phone
- Role (Admin/Super Admin)
- Permissions

---

## 7. Viewing Reports

### Available Reports

**Navigation:** Admin → Reports

#### Financial Reports
- **Daily Revenue:** Breakdown by payment method
- **Monthly Summary:** Bookings, revenue, refunds
- **Tax Report:** GST/tax collections
- **Refund Summary:** Refunds processed

#### Booking Reports
- **Booking Summary:** By status, airline, route
- **Cancellation Report:** Reasons, trends
- **Popular Routes:** Most booked routes
- **Peak Hours:** Booking time analysis

#### User Reports
- **Registration Report:** New users over time
- **User Activity:** Active vs inactive users
- **Geographic Distribution:** Users by location

#### Flight Reports
- **Occupancy Report:** Seat utilization
- **Flight Performance:** On-time, delays
- **Route Performance:** Revenue by route

### Generating Reports

1. Select report type
2. Choose date range
3. Apply filters (optional)
4. Click "Generate Report"
5. View online or download

### Export Options

- **PDF:** Formatted report document
- **Excel:** Spreadsheet for analysis
- **CSV:** Raw data export

### Scheduled Reports

Set up automatic report generation:
1. Go to "Scheduled Reports"
2. Click "Add Schedule"
3. Select report type
4. Choose frequency (Daily, Weekly, Monthly)
5. Set recipients (email addresses)
6. Save schedule

---

## 8. System Settings

### General Settings

**Navigation:** Admin → Settings → General

- **Site Name:** Platform display name
- **Contact Email:** Support email address
- **Contact Phone:** Support phone number
- **Time Zone:** System time zone
- **Currency:** Default currency
- **Language:** Default language

### Booking Settings

- **Booking Window:** How far in advance bookings open
- **Minimum Booking Time:** Hours before departure
- **Maximum Passengers:** Per booking limit
- **Auto-Cancel Time:** Pending booking expiry

### Payment Settings

- **Stripe Configuration:**
  - API Keys (Test/Live)
  - Webhook Secret
  - Payment Methods enabled

- **Payment Options:**
  - Credit/Debit Cards
  - UPI
  - Net Banking
  - Wallets

### Email Settings

- **SMTP Configuration:**
  - Host, Port, Username, Password
  - From Address, From Name

- **Email Templates:**
  - Booking Confirmation
  - Cancellation Notice
  - Refund Confirmation
  - Password Reset
  - Price Alert

### Security Settings

- **Password Policy:**
  - Minimum length
  - Complexity requirements
  - Expiry period

- **Session Settings:**
  - Session timeout
  - Max concurrent sessions

- **Rate Limiting:**
  - API rate limits
  - Login attempt limits

---

## 9. Troubleshooting

### Common Issues

#### Booking Stuck in Pending

**Cause:** Payment verification failed

**Solution:**
1. Check payment status in Stripe dashboard
2. If payment successful, manually confirm booking
3. If payment failed, notify customer

#### Payment Not Reflecting

**Cause:** Webhook delay or failure

**Solution:**
1. Check Stripe webhook logs
2. Manually sync payment status
3. If confirmed in Stripe, update booking

#### User Cannot Login

**Possible causes:**
- Account locked (too many attempts)
- Email not verified
- Account blocked

**Solutions:**
1. Check user status in admin panel
2. Unlock account if locked
3. Resend verification email if needed
4. Unblock if accidentally blocked

#### Flight Not Showing in Search

**Possible causes:**
- Flight marked as inactive
- No available seats
- Past departure date
- Filter mismatch

**Solutions:**
1. Check flight status (set to Active)
2. Verify seat availability
3. Check departure date
4. Review search filters

### Error Logs

**Navigation:** Admin → System → Error Logs

View recent system errors:
- Error message
- Stack trace
- Timestamp
- User (if applicable)
- Request details

### Health Check

**Navigation:** Admin → System → Health Check

Monitor system components:
- ✅ Database connection
- ✅ Redis cache
- ✅ Email service
- ✅ Payment gateway
- ✅ API response times

---

## 10. Security Best Practices

### Access Control

1. **Use Strong Passwords:**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Change every 90 days

2. **Enable 2FA:**
   - Required for all admin accounts
   - Use hardware keys for super admins

3. **Limit Admin Access:**
   - Principle of least privilege
   - Regular access reviews
   - Remove inactive admins

### Data Protection

1. **Never Share Credentials:**
   - Each admin has unique login
   - No shared passwords

2. **Secure Sessions:**
   - Always logout after use
   - Don't save passwords in browsers
   - Use incognito mode on shared computers

3. **Data Export:**
   - Export only when necessary
   - Delete files after use
   - Use encrypted storage

### Audit & Compliance

1. **Review Audit Logs:**
   - Check admin activity weekly
   - Investigate unusual patterns
   - Report suspicious activity

2. **Regular Reviews:**
   - Monthly access review
   - Quarterly security assessment
   - Annual compliance audit

### Incident Response

If you suspect a security breach:

1. **Immediately:**
   - Don't delete evidence
   - Note what you observed
   - Report to security team

2. **Contact:**
   - Security Officer: security@destinova.com
   - Phone: [Emergency Contact]

3. **Document:**
   - Time of discovery
   - What was affected
   - Actions taken

---

## Quick Reference

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + D` | Go to Dashboard |
| `Ctrl + F` | Open Search |
| `Ctrl + N` | New Flight |
| `Ctrl + B` | Go to Bookings |
| `Esc` | Close modal/popup |

### Status Color Codes

| Color | Meaning |
|-------|---------|
| 🟢 Green | Active/Confirmed/Success |
| 🟡 Yellow | Pending/Warning |
| 🔴 Red | Cancelled/Error/Blocked |
| 🔵 Blue | Info/Processing |
| ⚫ Grey | Inactive/Completed |

### Contact Support

For technical issues or questions:

- **Email:** admin-support@destinova.com
- **Phone:** +91-XXX-XXX-XXXX (Admin Hotline)
- **Slack:** #admin-support channel

---

*Last updated: November 2025*
