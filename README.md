# Destinova - Premium Flight Booking Experience

Destinova is a modern, responsive flight booking website built with HTML, CSS, and JavaScript. It offers a premium user experience with advanced search features, personalization, and comprehensive flight result management.

## Features

### Enhanced Search Form Intelligence

- **Flexible Date Selection**: Toggle "Flexible Dates" to search ±3 days around your selected dates with custom range inputs
- **Nearby Airports**: Checkbox to include nearby airports for origin and destination to find cheaper fares
- **Detailed Passenger Modal**: Comprehensive passenger selection with Adults (12+), Children (2-12), Infants (<2), and cabin classes (Economy, Premium Economy, Business, First)
- **Direct Flights Filter**: Prominent checkbox for nonstop flights only
- **Fare Type Selection**: Choose from Regular, Student, Senior Citizen, Armed Forces, and Corporate fares with informative tooltips

### User Personalization & Convenience

- **Location Detection**: Automatic geolocation to pre-fill nearest major airport in the "From" field
- **Search History**: Dropdown showing recent searches for quick re-booking
- **Currency Selection**: Choose display currency (INR, USD, EUR)
- **Promotional Elements**: Rotating promotional banner with discount codes and trust badges (SSL Secured, IATA Certified, 24/7 Support)

### Post-Search Features

- **Smart Sorting**: Sort results by price, duration, departure/arrival time
- **Advanced Filtering**: Filter by stops, airlines, departure time, and price range
- **Fare Calendar View**: Visual calendar showing cheapest fares for each day
- **Price Alerts**: Set email alerts for price drops on specific routes
- **Responsive Design**: Fully responsive layout for mobile and desktop

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