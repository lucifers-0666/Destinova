# Copilot Instructions � Destinova (Air Ticket Booking Platform)

**Purpose:** Actionable guidance to help AI agents become immediately productive in this 140K+ LOC vanilla-JS flight booking system.

---

## 1. Architecture Overview

**Stack:** Pure vanilla JavaScript + HTML5 + CSS3 (no frameworks, no build tools).

**Structure:**
- html/ ? 25 user-facing pages (index, booking, results, profile, payments, etc.)
- Admin/html/ ? 9 admin pages (dashboard, flight/user/booking management, refund/revenue/notification workflows)
- js/ & Admin/js/ ? Page-specific scripts (38 user scripts, 7 admin scripts)
- css/ ? 50+ granular CSS files (global + page-scoped)

**Data Flow:**
- **User search ? results:** Client-side filtering via AirportAutocomplete class and 9000+ airport DB
- **Booking flow:** Multi-step state in LocalStorage (isUserSignedIn, hasBookedTicket, booking session data)
- **Admin dashboard:** Real-time statistics with Chart.js; mocked data from Admin/js/admin-dashboard.js
- **Payment validation:** Client-side Luhn + CVV checks in js/payment.js; no backend integration yet

---

## 2. Key Files & Responsibilities

| File | Purpose | When to edit |
|------|---------|-------------|
| html/index.html | Landing page, hero sections, floating search widget | Header/hero layout, search positioning |
| js/index.js | Navigation, menu visibility, language switcher, search history | Header logic, landing interactions |
| html/booking.html + js/booking.js | 3-step booking: passengers ? seats ? payment | Passenger form logic, seat selection UI |
| html/results.html + js/results.js | Flight search results, filtering, sorting | Result display, filter logic |
| js/airport-autocomplete.js | Autocomplete with keyboard nav & filtering | Search behavior, debouncing |
| js/payment.js | Payment method tabs, card validation, coupon logic | Payment form validation |
| Admin/html/admin-dashboard.html + Admin/js/admin-dashboard.js | Admin statistics, charts, activity feed | Dashboard metrics, Chart.js datasets |
| css/index.css | Root theme variables (emerald green, gold accents, shadows, spacing) | Global color/spacing tweaks |

---

## 3. Development Workflow

**Preview locally** (no build step):
- Python 3 static server: python -m http.server 8000 --directory . (from repo root)
- Then open: http://localhost:8000/html/index.html
- Alternative: VS Code Live Server extension

**Key CDN dependencies** (must be online):
- Tailwind CSS (config in script tag)
- Chart.js (Admin dashboard)
- jsPDF + html2canvas (booking confirmation QR/PDF)
- AOS (scroll animations), Swiper (carousels), Lucide icons, Flatpickr, GSAP + Vanta.js

---

## 4. Code Patterns & Conventions

**JavaScript:**
- No modules; page-specific scripts fire on DOMContentLoaded event
- Event delegation for dynamic elements (e.g., passenger form removal in booking.js)
- LocalStorage for persistence: recentlyViewedFlights, flightSearches, lastSearch, isUserSignedIn, hasBookedTicket, cookie_consent

**CSS:**
- Root theme variables in css/index.css (primary-emerald, champagne-gold, text-charcoal, shadows, radius, transitions)
- Page-scoped files override globals (hero-redesigned.css, premium-search.css, booking-process.css)
- Tailwind for responsive utilities; CSS vars for premium animations

**Accessibility:**
- ARIA labels and semantic HTML throughout (aria-activedescendant in autocomplete)
- Preserve ARIA attributes on edits

---

## 5. Integration Points & Data Sources

**Airport autocomplete (AirportAutocomplete class):**
- 9000+ worldwide airports with country/state/city data
- Keyboard navigation (arrows, Enter, Escape); debounced; min 2 chars
- Used across: index.html, results.html, booking.html

**Payment validation (js/payment.js):**
- Tab-based: Card, UPI, Net Banking, Wallets
- Card: Luhn validation, expiry regex (MM/YY), CVV length checks
- Do NOT remove client validation; add server hooks via adapter later

**Admin data mock layer (Admin/js/admin-dashboard.js):**
- Hardcoded stats for bookings, revenue, active flights
- To integrate backend: replace with fetch calls to centralized js/api.js adapter

---

## 6. Common Tasks & Examples

- **Fix search autocomplete:** Edit js/airport-autocomplete.js handleKeydown() method; preserve aria-activedescendant
- **Update admin chart:** Edit Admin/html/admin-dashboard.html Chart.js config; update dataset labels/colors in Admin/js/admin-dashboard.js
- **Add payment method:** Tab button (html/payment.html) + tab-pane div + validation logic (js/payment.js validatePaymentForm)
- **Tweak theme:** Edit CSS vars in css/index.css root (--primary-emerald, etc.) � cascades to all pages

---

## 7. Safety Guidelines

? SAFE: Style/layout fixes, CSS variable tweaks, small JS fixes (selector robustness, debounce tuning, typos), ARIA labels, animation intensity tweaks

? REQUIRES APPROVAL: Build tools/frameworks/bundlers, module restructuring, removing client-side validation without backend, mass typography/color changes

---

## 8. LocalStorage Keys

- isUserSignedIn, hasBookedTicket, recentlyViewedFlights, flightSearches, lastSearch
- blogBookmarks, blogSubscribers, viewedArticles, cookie_consent

---

## 9. Admin Panel Must-Preserve Features

- Real-time counters, 30-day revenue chart, class distribution donut, auto-refresh activity feed (30s)
- Keyboard shortcuts: D (Dashboard), S (Search), N (Notifications)
- Debounced global search across bookings, users, flights

---

## 10. Quick Reference: Where to Look First

- System overview: README.md + Admin/README.md
- Landing page: html/index.html + js/index.js + css/hero-*.css
- Search/airport: js/airport-autocomplete.js + js/flight-api.js
- Booking: html/booking.html + js/booking.js
- Payment: html/payment.html + js/payment.js
- Admin: Admin/html/admin-dashboard.html + Admin/js/admin-dashboard.js
- Theme: css/index.css (root vars) + page-scoped CSS

---

## 11. When to Ask for Clarification

- Build system/framework adoption required
- Removing/altering validation logic
- Backend API integration strategy
- Changes to 34-page architecture

# do 
- never create a .md file until i confirm to do or i say to create it 