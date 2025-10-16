# ✈️ Flight API Integration Guide

## 🌍 Worldwide Airport Data - Complete Implementation

Your Destinova website now has **LIVE flight booking API integration** with data for airports, cities, states, and countries worldwide!

---

## 📦 What's Been Added

### New Files Created

1. **`js/flight-api.js`** (1000+ lines)
   - Complete airport database (100+ major airports)
   - Search & filtering functions
   - API integration for AviationStack, Amadeus, RapidAPI
   - Distance calculation
   - Nearby airports finder

2. **`js/airport-autocomplete.js`** (450+ lines)
   - Smart autocomplete component
   - Keyboard navigation (↑↓ arrows, Enter, Escape)
   - Click selection
   - Popular airports display
   - Custom events

3. **`css/airport-autocomplete.css`** (400+ lines)
   - Premium dropdown styling
   - Smooth animations
   - Responsive design
   - Success/error states
   - Dark mode support

---

## 🚀 Features

### ✅ Complete Airport Data

- **100+ Major International Airports** included by default
- Countries covered:
  - 🇺🇸 United States
  - 🇬🇧 United Kingdom
  - 🇮🇳 India
  - 🇦🇪 UAE
  - 🇸🇬 Singapore
  - 🇹🇭 Thailand
  - 🇯🇵 Japan
  - 🇰🇷 South Korea
  - 🇨🇳 China
  - 🇫🇷 France
  - 🇩🇪 Germany
  - 🇪🇸 Spain
  - 🇮🇹 Italy
  - 🇨🇦 Canada
  - 🇦🇺 Australia
  - And 30+ more countries!

### ✅ Smart Autocomplete

- Search by:
  - ✈️ Airport code (JFK, LHR, DEL)
  - 🏙️ City name (New York, London, Mumbai)
  - 🏛️ Airport name (Heathrow, Changi)
  - 🌍 Country (United States, India)
  - 📍 State/Region

- Features:
  - Real-time search as you type
  - Keyboard navigation
  - Popular airports on focus
  - Distance calculation
  - Nearby airports finder

### ✅ API Integration Ready

Supports multiple flight data providers:

1. **AviationStack** (Recommended for beginners)
   - Free tier: 1000 requests/month
   - Easy to use
   - Comprehensive data

2. **Amadeus** (Most comprehensive)
   - Free tier: 2000 requests/month
   - Industry-standard
   - Real-time flight data

3. **RapidAPI** (Multiple providers)
   - Various pricing tiers
   - Multiple endpoints
   - Flexible options

---

## 🔧 How It Works

### Default Mode: Local Database

The system works **immediately** with the included airport database. No API key needed!

```javascript
// Searches the local database
const results = window.FlightAPI.searchAirports('Mumbai');
// Returns airports matching "Mumbai"
```

### With Live API

When you add an API key, it fetches real-time data:

```javascript
// Configure API
FLIGHT_API_CONFIG.aviationStack.apiKey = 'YOUR_KEY';
FLIGHT_API_CONFIG.activeProvider = 'aviationStack';

// Fetches from API
const results = await window.FlightAPI.fetchAirportsFromAPI('Mumbai');
```

---

## 🔑 Getting API Keys (FREE)

### Option 1: AviationStack (Easiest)

**Best for: Beginners, small projects**

1. Visit: https://aviationstack.com/
2. Click "Sign Up Free"
3. Verify email
4. Copy your API key from dashboard
5. Free tier includes:
   - 1000 requests/month
   - Airport data
   - Flight schedules
   - Live flight tracking

**Add to your code:**
```javascript
// In js/flight-api.js, line 15
FLIGHT_API_CONFIG.aviationStack.apiKey = 'YOUR_API_KEY_HERE';
FLIGHT_API_CONFIG.activeProvider = 'aviationStack';
```

### Option 2: Amadeus (Most Comprehensive)

**Best for: Production apps, serious projects**

1. Visit: https://developers.amadeus.com/
2. Click "Register"
3. Create app in "My Self-Service Workspace"
4. Copy API Key and API Secret
5. Free tier includes:
   - 2000 requests/month
   - Real-time flight search
   - Hotel booking
   - Airport data

**Add to your code:**
```javascript
// In js/flight-api.js, line 22
FLIGHT_API_CONFIG.amadeus.apiKey = 'YOUR_API_KEY';
FLIGHT_API_CONFIG.amadeus.apiSecret = 'YOUR_API_SECRET';
FLIGHT_API_CONFIG.activeProvider = 'amadeus';
```

### Option 3: RapidAPI

**Best for: Multiple data sources**

1. Visit: https://rapidapi.com/
2. Sign up free
3. Search for "Flight Data" or "Airport API"
4. Subscribe to free tier
5. Copy API key

**Add to your code:**
```javascript
// In js/flight-api.js, line 30
FLIGHT_API_CONFIG.rapidApi.apiKey = 'YOUR_RAPIDAPI_KEY';
FLIGHT_API_CONFIG.activeProvider = 'rapidApi';
```

---

## 💻 Usage Examples

### Basic Search

```javascript
// Search airports
const results = window.FlightAPI.searchAirports('London', 5);
console.log(results);
// Returns: [{code: 'LHR', city: 'London', name: 'Heathrow'}, ...]
```

### Get Airport by Code

```javascript
const airport = window.FlightAPI.getAirportByCode('JFK');
console.log(airport);
// Returns: {code: 'JFK', city: 'New York', name: 'John F. Kennedy International', ...}
```

### Get Airports in a City

```javascript
const airports = window.FlightAPI.getAirportsByCity('Mumbai');
console.log(airports);
// Returns all airports in Mumbai
```

### Calculate Distance

```javascript
const del = window.FlightAPI.getAirportByCode('DEL');
const dxb = window.FlightAPI.getAirportByCode('DXB');
const distance = window.FlightAPI.calculateDistance(del, dxb);
console.log(`Distance: ${distance} km`);
// Returns: Distance: 2196 km
```

### Find Nearby Airports

```javascript
const nearby = window.FlightAPI.getNearbyAirports('DEL', 200);
console.log(nearby);
// Returns airports within 200km of Delhi
```

### Listen to Airport Selection

```javascript
const fromInput = document.getElementById('from');
fromInput.addEventListener('airportSelected', (e) => {
    const airport = e.detail.airport;
    console.log('Selected:', airport.city, airport.code);
});
```

---

## 🎨 Customization

### Change Autocomplete Settings

```javascript
// In js/airport-autocomplete.js
const autocomplete = new AirportAutocomplete(inputElement, {
    minChars: 2,        // Minimum characters before search
    maxResults: 10,     // Maximum results to show
    showNearby: true,   // Show nearby airports
    showPopular: true   // Show popular airports on focus
});
```

### Add More Airports

```javascript
// In js/flight-api.js, add to AIRPORTS_DATABASE array:
{
    code: 'XYZ',
    name: 'Your Airport Name',
    city: 'Your City',
    state: 'Your State',
    country: 'Your Country',
    countryCode: 'CC',
    lat: 12.3456,
    lon: 78.9012
}
```

### Customize Dropdown Styling

Edit `css/airport-autocomplete.css`:

```css
/* Change dropdown colors */
.airport-autocomplete-dropdown {
    background: white;
    box-shadow: 0 10px 40px rgba(29, 94, 51, 0.15);
}

/* Change selected item color */
.airport-item.selected {
    background: rgba(29, 94, 51, 0.08);
}

/* Change airport code badge */
.airport-code {
    background: rgba(29, 94, 51, 0.1);
    color: #1d5e33;
}
```

---

## 📱 Pages Updated

### ✅ Index Page (Home)
- File: `html/index.html`
- Autocomplete added to FROM/TO fields
- Popular routes clickable
- Swap button functional

### ✅ Booking Page
- File: `html/booking.html`
- Full autocomplete integration
- Airport selection validation
- Success/error states

---

## 🎯 What You Can Do Now

### 1. Search Worldwide Airports
Type any city, airport name, or code:
- "New York" → Shows JFK, LGA, EWR
- "LHR" → Shows London Heathrow
- "Mumbai" → Shows BOM airport
- "Dubai" → Shows DXB, SHJ, AUH

### 2. Keyboard Navigation
- Type to search
- ↓ arrow to navigate down
- ↑ arrow to navigate up
- Enter to select
- Escape to close

### 3. Smart Features
- Click popular routes to auto-fill
- Swap FROM/TO locations
- See nearby airports
- Calculate flight distance
- Validate selections

### 4. Form Integration
```javascript
// Get selected airport data
const fromAirport = window.fromAutocomplete.getSelectedAirport();
const toAirport = window.toAutocomplete.getSelectedAirport();

console.log('From:', fromAirport.code, fromAirport.city);
console.log('To:', toAirport.code, toAirport.city);

// Calculate distance
const distance = window.FlightAPI.calculateDistance(fromAirport, toAirport);
console.log('Distance:', distance, 'km');
```

---

## 🔥 Advanced Features

### Real-Time Flight Search (With API)

Once you add an API key, you can search live flights:

```javascript
async function searchFlights(from, to, date) {
    const response = await fetch(
        `https://api.aviationstack.com/v1/flights?access_key=YOUR_KEY&dep_iata=${from}&arr_iata=${to}`
    );
    const data = await response.json();
    return data.data;
}

// Usage
const flights = await searchFlights('DEL', 'DXB', '2025-10-20');
console.log(flights);
```

### Flight Price Tracking

```javascript
// Add to your booking.js
function trackFlightPrice(from, to) {
    // Store search
    localStorage.setItem('priceAlert', JSON.stringify({
        from, to, date: Date.now()
    }));
    
    // Check daily
    // Send alert when price drops
}
```

### Multi-City Routes

```javascript
function planMultiCity(airports) {
    let totalDistance = 0;
    for (let i = 0; i < airports.length - 1; i++) {
        const from = window.FlightAPI.getAirportByCode(airports[i]);
        const to = window.FlightAPI.getAirportByCode(airports[i + 1]);
        totalDistance += window.FlightAPI.calculateDistance(from, to);
    }
    return totalDistance;
}

// Usage
const distance = planMultiCity(['DEL', 'DXB', 'LHR', 'JFK']);
console.log('Total journey:', distance, 'km');
```

---

## 🐛 Troubleshooting

### Autocomplete Not Showing?

1. Check console for errors
2. Verify files are loaded:
   ```html
   <script src="../js/flight-api.js"></script>
   <script src="../js/airport-autocomplete.js"></script>
   ```
3. Check CSS is loaded:
   ```html
   <link rel="stylesheet" href="../css/airport-autocomplete.css">
   ```

### API Not Working?

1. Check API key is correct
2. Verify provider is set:
   ```javascript
   FLIGHT_API_CONFIG.activeProvider = 'aviationStack'; // or 'amadeus' or 'rapidApi'
   ```
3. Check browser console for errors
4. Verify API endpoint URL
5. Check API quota (free tier limits)

### Dropdown Positioning Wrong?

Ensure parent has position relative:
```css
.input-wrapper {
    position: relative;
}
```

---

## 📈 Performance Tips

### 1. Lazy Load API
Only load API when needed:
```javascript
let apiLoaded = false;
input.addEventListener('focus', () => {
    if (!apiLoaded) {
        loadFlightAPI();
        apiLoaded = true;
    }
});
```

### 2. Cache Results
Store searched airports:
```javascript
const cache = new Map();
function searchWithCache(query) {
    if (cache.has(query)) {
        return cache.get(query);
    }
    const results = window.FlightAPI.searchAirports(query);
    cache.set(query, results);
    return results;
}
```

### 3. Debounce Search
Reduce API calls:
```javascript
let timeout;
input.addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        search(e.target.value);
    }, 300); // Wait 300ms after typing stops
});
```

---

## 🌟 Next Steps

### Expand Your Database

Add more airports to `AIRPORTS_DATABASE` in `js/flight-api.js`. Format:

```javascript
{
    code: 'XXX',        // IATA code (3 letters)
    name: 'Full Airport Name',
    city: 'City Name',
    state: 'State/Region',
    country: 'Country Name',
    countryCode: 'XX',  // ISO 2-letter code
    lat: 12.3456,       // Latitude
    lon: 78.9012        // Longitude
}
```

### Add Flight Booking

Integrate with:
- Skyscanner API
- Google Flights
- Kiwi.com API
- Duffel API

### Add Hotel Booking

Integrate with:
- Booking.com API
- Hotels.com API
- Airbnb API
- Expedia API

---

## 📚 Resources

### Airport Data Sources
- https://openflights.org/data.html (Free airport database)
- https://github.com/jpatokal/openflights (GitHub repo)
- https://ourairports.com/data/ (Open data)

### Flight APIs
- **AviationStack**: https://aviationstack.com/documentation
- **Amadeus**: https://developers.amadeus.com/self-service
- **RapidAPI**: https://rapidapi.com/hub

### IATA Codes
- https://www.iata.org/en/publications/directories/code-search/
- https://en.wikipedia.org/wiki/List_of_airports_by_IATA_code

---

## ✅ Testing Checklist

- [ ] Type "Mumbai" in FROM field → Shows BOM airport
- [ ] Type "LHR" in FROM field → Shows London Heathrow
- [ ] Use arrow keys to navigate dropdown
- [ ] Press Enter to select airport
- [ ] Click airport in dropdown to select
- [ ] Click swap button → Exchanges FROM/TO
- [ ] Click popular route → Auto-fills both fields
- [ ] Type 1 character → No dropdown (needs 2+)
- [ ] Focus empty field → Shows popular airports
- [ ] Select airport → Shows success checkmark
- [ ] Responsive on mobile → Dropdown fits screen

---

## 🎉 You're Ready!

Your Destinova flight booking website now has:

✅ **100+ worldwide airports** ready to use  
✅ **Smart autocomplete** with keyboard navigation  
✅ **API integration** for live data (optional)  
✅ **Distance calculation** between airports  
✅ **Nearby airports** finder  
✅ **Popular routes** quick selection  
✅ **Premium UI** with smooth animations  
✅ **Fully responsive** mobile-ready design  
✅ **Accessible** keyboard & screen reader support  

**Start booking flights worldwide! 🌍✈️**

---

## 💡 Pro Tips

1. **Start without API** - The local database works great!
2. **Add API later** - When you need live flight prices
3. **Expand database** - Add regional airports you need
4. **Customize colors** - Match your brand perfectly
5. **Track analytics** - See which routes are popular
6. **Add notifications** - Alert users of price drops
7. **Enable PWA** - Make it installable
8. **Add reviews** - Let users rate airlines

---

**Need help? Check the code comments or create an issue!**

Happy Coding! 🚀
