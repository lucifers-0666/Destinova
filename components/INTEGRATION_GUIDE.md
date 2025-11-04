# Header & Footer Component Integration Guide

## ✅ What Was Done

The new Destinova header and footer components have been successfully integrated into `index.html`.

### Files Created:
- `components/header.html` - Reusable header HTML
- `components/footer.html` - Reusable footer HTML
- `css/header.css` - Header styles
- `css/footer.css` - Footer styles
- `js/header.js` - Header functionality

### Changes Made to `index.html`:
1. Added CSS imports for `header.css` and `footer.css`
2. Added `<div id="header-container"></div>` after `<body>` tag
3. Added `<div id="footer-container"></div>` before closing `</body>`
4. Added JavaScript to dynamically load components

---

## 🚀 How to Preview

### Option 1: Python HTTP Server
```bash
cd d:\Air_ticket_booking_mini_project
python -m http.server 8000
```
Then open: http://localhost:8000/html/index.html

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

---

## 📋 How to Integrate into Other Pages

### Quick Copy-Paste Integration

For any existing page (e.g., `booking.html`, `profile.html`, etc.):

#### Step 1: Add CSS Links (in `<head>`)
```html
<link rel="stylesheet" href="../css/header.css">
<link rel="stylesheet" href="../css/footer.css">
```

#### Step 2: Add Header Container (right after `<body>`)
```html
<body>
    <!-- Header Component -->
    <div id="header-container"></div>
    
    <!-- Your existing content -->
```

#### Step 3: Add Footer Container (before closing `</body>`)
```html
    <!-- Footer Component -->
    <div id="footer-container"></div>

    <!-- Load Header & Footer Components -->
    <script>
        // Load Header Component
        fetch('../components/header.html')
            .then(res => res.text())
            .then(html => {
                document.getElementById('header-container').innerHTML = html;
                const headerScript = document.createElement('script');
                headerScript.src = '../js/header.js';
                document.body.appendChild(headerScript);
            })
            .catch(err => console.error('Error loading header:', err));

        // Load Footer Component
        fetch('../components/footer.html')
            .then(res => res.text())
            .then(html => {
                document.getElementById('footer-container').innerHTML = html;
            })
            .catch(err => console.error('Error loading footer:', err));
    </script>
</body>
```

---

## 🎯 Features You Get

### Navigation Structure:
- **Home** → index.html
- **Book** (dropdown): New Booking, Flight Status, Destinations
- **My Trips** (dropdown): My Bookings, Payment History
- **Offers** → offers.html (with 🔥 badge)
- **More** (dropdown): About Us, Contact Us, FAQ, Blog, Reviews

### Auth System:
- **Not Logged In**: "Sign In" + "Register" buttons
- **Logged In**: Profile dropdown with user name
  - My Profile
  - My Bookings
  - Payment History
  - Sign Out

### Additional Features:
- ✅ Dark mode toggle (persists across pages)
- ✅ Mobile hamburger menu
- ✅ Active page highlighting
- ✅ Sticky header with scroll effects
- ✅ Fully responsive (desktop, tablet, mobile)
- ✅ Keyboard accessible (ARIA compliant)

---

## 🔧 JavaScript API

The header exposes a global API for programmatic control:

```javascript
// Refresh auth state (call this after user logs in)
window.DestinovaHeader.refreshAuthState();

// Toggle dark mode programmatically
window.DestinovaHeader.setDarkMode(true); // or false

// Close mobile menu
window.DestinovaHeader.closeMobileMenu();
```

---

## 🎨 Customization

### Colors (Defined in `css/header.css`):
All styles use CSS variables from `css/index.css`:
- `--primary-emerald`: #10B981
- `--champagne-gold`: #D4AF37
- `--text-charcoal`: #1F2937

To change colors globally, edit the root variables in `css/index.css`.

### Modifying Navigation:
Edit `components/header.html` to add/remove menu items.

---

## ✅ Testing Checklist

- [ ] Desktop navigation works (dropdowns open on hover)
- [ ] Mobile hamburger menu toggles correctly
- [ ] Auth state shows correct buttons (logged in/out)
- [ ] Dark mode toggle persists across page reloads
- [ ] Active page is highlighted in navigation
- [ ] Footer links work correctly
- [ ] Responsive on all screen sizes (1024px, 768px, 480px)

---

## 🐛 Troubleshooting

### Header not showing?
- Check browser console for fetch errors
- Verify paths: `../components/header.html`, `../css/header.css`
- Ensure you're running from a server (not `file://`)

### Auth state not updating?
- Check `localStorage` for `isUserSignedIn` and `userDetails`
- Call `window.DestinovaHeader.refreshAuthState()` after login

### Dark mode not persisting?
- Check `localStorage` for `theme` key
- Ensure `js/theme-manager.js` isn't conflicting

---

## 📁 Project Structure

```
d:\Air_ticket_booking_mini_project\
├── components/
│   ├── header.html          ← Reusable header
│   ├── footer.html          ← Reusable footer
│   └── INTEGRATION_GUIDE.md ← This file
├── css/
│   ├── header.css           ← Header styles
│   ├── footer.css           ← Footer styles
│   └── index.css            ← Root theme variables
├── js/
│   └── header.js            ← Header functionality
└── html/
    ├── index.html           ← ✅ Integrated
    ├── booking.html         ← TODO
    ├── profile.html         ← TODO
    └── ... (25 more pages)
```

---

## 🚨 Important Notes

1. **Never remove existing header manually** - The component loads dynamically
2. **LocalStorage keys used**:
   - `isUserSignedIn` - Boolean
   - `userDetails` - JSON object with user info
   - `theme` - 'light' or 'dark'
3. **The header is sticky** - It stays at the top when scrolling
4. **Mobile breakpoint** - Navigation switches to hamburger at 1024px

---

## 📞 Next Steps

1. Test the integrated `index.html` locally
2. Apply the same integration to other pages:
   - booking.html
   - profile.html
   - my-bookings.html
   - payment-history.html
   - offers.html
   - (all 25+ pages)
3. Verify auth flows (login/logout)
4. Test mobile responsiveness
5. Confirm dark mode works across all pages

---

**Questions?** Check the implementation in `html/index.html` (lines 69-71 for CSS, line 116 for header container, lines 1293-1317 for component loading).
