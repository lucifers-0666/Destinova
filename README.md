# Destinova - Premium Flight Booking Experience

Destinova is a modern, responsive front-end prototype for a premium flight booking website. It's meticulously crafted with HTML, CSS, and vanilla JavaScript to showcase a rich, interactive user experience. The project focuses on a clean, luxurious aesthetic, a comprehensive booking flow, and a variety of well-designed user-centric pages.

## Features

### 1. Core Booking & User Management

- **Multi-Step Booking Flow (`booking.html`)**: A clean, guided 3-step process with a progress bar:
    1.  **Passenger Details**: Dynamically add/remove passenger forms, select add-ons like travel insurance.
    2.  **Seat Selection**: An interactive mock seat map to select seats for each passenger.
    3.  **Review & Payment**: A final summary and a standard payment form layout.
- **Live E-Ticket & Price Preview**: A sticky sidebar on the booking page that updates in real-time with passenger details and a full price summary.
- **Booking Confirmation (`booking-confirmation.html`)**: A detailed confirmation page featuring:
    - A celebratory confetti effect on load.
    - A full e-ticket summary with a dynamically generated QR code.
    - Action buttons to Download (as PDF), Email, Print, or Add to Calendar.
- **My Bookings Page (`my-bookings.html`)**: A dashboard to manage user bookings:
    - Tabbed interface for `Upcoming`, `Past`, and `Cancelled` flights.
    - Search and filter functionality.
    - Ability to `View Ticket`, `Modify`, or `Cancel` upcoming bookings.
- **User Profile (`profile.html`)**: A comprehensive user profile page to manage:
    - Contact details and address.
    - Travel preferences (preferred class, meal, seat).
    - Saved payment methods and loyalty programs.

### 2. Informational & Support Pages

- **Home Page (`index.html`)**: The main landing page with a comprehensive flight search form, promotional sections, and animated content carousels for offers and testimonials.
- **About Us (`about-us.html`)**: A well-structured page introducing the company, its values, the team, and a testimonial carousel.
- **Contact Us (`contact-us.html`)**: A page with contact information, a contact form with validation, and an embedded FAQ accordion.
- **FAQ Page (`faq.html`)**: A dedicated, feature-rich FAQ section with:
    - Live search with debouncing to filter questions.
    - Category tabs to browse topics.
    - A "Popular Questions" section for quick access.
- **Terms & Conditions (`terms-conditions.html`)**: A legal page with a sticky sidebar for easy navigation through the document sections.

### 3. UI/UX & Technical Features

- **Consistent Branding & Design**: A cohesive and premium design language is used across all pages, with a consistent color palette, typography, and shared header/footer components.
- **Smooth Animations**: Uses the AOS (Animate On Scroll) library and custom CSS animations for an elegant user experience.
- **Microinteractions**: Subtle hover effects, 3D transforms on cards, and button feedback enhance interactivity (e.g., click-to-copy on contact info).
- **Fully Responsive Design**: A mobile-first approach ensures a seamless experience on all devices, from small phones to large desktops.
- **Dynamic Content**: JavaScript is used extensively to dynamically generate content, such as passenger forms, booking cards, FAQ items, and seat maps.
- **Third-Party Libraries**: Integrates useful libraries like `AOS` for animations, `canvas-confetti` for user delight, and `jsPDF`/`html2canvas` for ticket downloading.
- **Mock Data-Driven**: The front-end operates on mock data arrays within the JavaScript files, simulating a real-world API interaction for pages like "My Bookings" and "FAQ".

## File Structure

```
destinova/
├── html/
│   ├── index.html          # Home page with search form
│   ├── results.html        # Flight results page
│   └── ...                 # Other pages
├── css/
│   ├── index.css           # Home page styles
│   ├── results.css         # Results page styles
│   └── ...                 # Other stylesheets
├── js/
│   ├── index.js            # Home page functionality
│   ├── results.js          # Results page functionality
│   └── ...                 # Other scripts
└── site-images/            # Images and assets
```

## Technical Implementation

### Search Form Enhancements

- **Flexible Dates**: JavaScript toggles range inputs when checkbox is enabled, auto-calculates ±3 day ranges
- **Geolocation**: Uses navigator.geolocation API with static airport database for nearest airport detection
- **Search History**: localStorage-based persistence of recent searches with clickable restoration
- **Form Validation**: Client-side validation with passenger count constraints (infants ≤ adults)

### Results Page Features

- **Mock Data**: Simulated flight data with realistic pricing and schedules
- **Dynamic Filtering**: Real-time filtering with multiple criteria combinations
- **Calendar Integration**: Interactive fare calendar with cheapest day highlighting
- **Price Alerts**: localStorage-based alert system with email collection

### Responsive Design

- Mobile-first approach with breakpoints at 768px and 1024px
- Touch-friendly interfaces for mobile users
- Optimized layouts for various screen sizes

## Usage

1. Open `html/index.html` in a web browser
2. Allow location access for automatic airport detection
3. Fill in search criteria and submit
4. View results on the results page with sorting/filtering options
5. Use fare calendar or set price alerts as needed

## Browser Support

- Modern browsers with ES6+ support
- Geolocation API for location detection
- localStorage for data persistence
- CSS Grid and Flexbox for layouts

## Development

The project uses vanilla JavaScript with no external dependencies for core functionality. Tailwind CSS is included via CDN for utility classes, and Font Awesome for icons.

## Future Enhancements

- Real API integration for live flight data
- User accounts and booking management
- Payment processing integration
- Multi-language support
- Progressive Web App features