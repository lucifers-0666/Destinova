# Destinova - Premium Flight Booking Experience

Destinova is a modern, responsive front-end prototype for a premium flight booking website, meticulously crafted with HTML, CSS, and vanilla JavaScript. It showcases a rich, interactive user experience with a focus on a clean, luxurious aesthetic, advanced search capabilities, and a variety of engaging UI components.

## Features

### 1. Home Page & Search

- **Flexible Date Selection**: Toggle "Flexible Dates" to search ±3 days around your selected dates with custom range inputs
- **Nearby Airports**: Checkbox to include nearby airports for origin and destination to find cheaper fares
- **Detailed Passenger Modal**: Comprehensive passenger selection with Adults (12+), Children (2-12), Infants (<2), and cabin classes (Economy, Premium Economy, Business, First)
- **Direct Flights Filter**: Prominent checkbox for nonstop flights only
- **Fare Type Selection**: Choose from Regular, Student, Senior Citizen, Armed Forces, and Corporate fares with informative tooltips

- **Location Detection**: Automatic geolocation to pre-fill nearest major airport in the "From" field
- **Search History**: Dropdown showing recent searches for quick re-booking
- **Currency Selection**: Choose display currency (INR, USD, EUR)
- **Promotional Elements**: Rotating promotional banner with discount codes and trust badges (SSL Secured, IATA Certified, 24/7 Support)
- **Interactive Destination Grid**: "Bento box" style grid of popular destinations. Clicking a destination populates the search form.
- **Wishlist Functionality**: Add destinations to a wishlist directly from the cards.
- **Animated Content Sections**:
    - **Travel Classes**: An auto-playing tabbed interface showcasing First, Business, Premium Economy, and Economy classes.
    - **Special Offers**: A responsive, auto-scrolling carousel for promotional deals.
    - **Testimonials**: A smooth, auto-playing slider for customer reviews.

### 2. Booking Process

- **Multi-Step Booking Flow**: A clean, guided 3-step process for booking:
    1.  **Passenger Details**: Dynamically add or remove passenger forms.
    2.  **Seat Selection**: An interactive mock seat map.
    3.  **Review & Payment**: A summary and payment form layout.
- **Live E-Ticket Preview**: A sticky sidebar on the booking page that updates with the primary passenger's name and shows a summary of the flight.

### 3. Content Pages

- **Destinations Page**: A visually rich page with a hero video/image, destination grid, offer slider, and travel inspiration sections.
- **Travel Classes Page**: Detailed sections for each class with dedicated image sliders and feature lists.
- **About Us Page**: A well-structured page introducing the company, team, and values.

### 4. General UI/UX

- **Consistent Branding & Design**: A cohesive and premium design language is used across all pages, with a consistent color palette and typography.
- **Smooth Animations**: Uses the AOS (Animate On Scroll) library and custom CSS animations for an elegant user experience.
- **Microinteractions**: Subtle hover effects, 3D transforms on cards, and button feedback to enhance interactivity.
- **Fully Responsive Design**: A mobile-first approach ensures a seamless experience on all devices, from small phones to large desktops.
- **Shared Header/Footer**: A consistent and fully functional header and footer are present on all pages.

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