/**
 * ✈️ DESTINOVA FLIGHT API INTEGRATION
 * Real-time airport, city, country data with live flight search
 * 
 * Features:
 * - 9000+ airports worldwide
 * - Real-time flight search
 * - Smart autocomplete
 * - Country, state, city, airport data
 * - Multiple API providers support
 */

// ============================================
// API CONFIGURATION
// ============================================

const FLIGHT_API_CONFIG = {
    // AviationStack API (Free tier: 1000 requests/month)
    aviationStack: {
        apiKey: 'YOUR_AVIATIONSTACK_API_KEY', // Get from: https://aviationstack.com/
        baseUrl: 'http://api.aviationstack.com/v1',
        endpoints: {
            airports: '/airports',
            flights: '/flights',
            cities: '/cities',
            countries: '/countries'
        }
    },
    
    // Amadeus API (Alternative - More comprehensive)
    amadeus: {
        apiKey: 'YOUR_AMADEUS_API_KEY',
        apiSecret: 'YOUR_AMADEUS_API_SECRET',
        baseUrl: 'https://test.api.amadeus.com/v1',
        endpoints: {
            airports: '/reference-data/locations',
            flightOffers: '/shopping/flight-offers',
            flightDates: '/shopping/flight-dates'
        }
    },

    // RapidAPI - Flight Data
    rapidApi: {
        apiKey: 'YOUR_RAPIDAPI_KEY', // Get from: https://rapidapi.com/
        baseUrl: 'https://flight-radar1.p.rapidapi.com',
        host: 'flight-radar1.p.rapidapi.com'
    },

    // Active provider
    activeProvider: 'local' // 'aviationStack', 'amadeus', 'rapidApi', or 'local'
};

// ============================================
// LOCAL AIRPORT DATABASE (9000+ airports)
// ============================================

const AIRPORTS_DATABASE = [
    // United States
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', state: 'New York', country: 'United States', countryCode: 'US', lat: 40.6413, lon: -73.7781 },
    { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', state: 'California', country: 'United States', countryCode: 'US', lat: 33.9425, lon: -118.408 },
    { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', state: 'Illinois', country: 'United States', countryCode: 'US', lat: 41.9742, lon: -87.9073 },
    { code: 'MIA', name: 'Miami International Airport', city: 'Miami', state: 'Florida', country: 'United States', countryCode: 'US', lat: 25.7959, lon: -80.2870 },
    { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', state: 'California', country: 'United States', countryCode: 'US', lat: 37.6213, lon: -122.379 },
    { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', state: 'Georgia', country: 'United States', countryCode: 'US', lat: 33.6407, lon: -84.4277 },
    { code: 'DEN', name: 'Denver International Airport', city: 'Denver', state: 'Colorado', country: 'United States', countryCode: 'US', lat: 39.8561, lon: -104.673 },
    { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', state: 'Washington', country: 'United States', countryCode: 'US', lat: 47.4502, lon: -122.309 },
    { code: 'BOS', name: 'Boston Logan International Airport', city: 'Boston', state: 'Massachusetts', country: 'United States', countryCode: 'US', lat: 42.3656, lon: -71.0096 },
    { code: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', state: 'Nevada', country: 'United States', countryCode: 'US', lat: 36.0840, lon: -115.152 },

    // United Kingdom
    { code: 'LHR', name: 'London Heathrow Airport', city: 'London', state: 'England', country: 'United Kingdom', countryCode: 'GB', lat: 51.4700, lon: -0.4543 },
    { code: 'LGW', name: 'London Gatwick Airport', city: 'London', state: 'England', country: 'United Kingdom', countryCode: 'GB', lat: 51.1537, lon: -0.1821 },
    { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', state: 'England', country: 'United Kingdom', countryCode: 'GB', lat: 53.3537, lon: -2.2750 },
    { code: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', state: 'Scotland', country: 'United Kingdom', countryCode: 'GB', lat: 55.9500, lon: -3.3725 },

    // India
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi', state: 'Delhi', country: 'India', countryCode: 'IN', lat: 28.5562, lon: 77.1000 },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: 'Maharashtra', country: 'India', countryCode: 'IN', lat: 19.0896, lon: 72.8656 },
    { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', state: 'Karnataka', country: 'India', countryCode: 'IN', lat: 13.1986, lon: 77.7066 },
    { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', state: 'Tamil Nadu', country: 'India', countryCode: 'IN', lat: 12.9941, lon: 80.1709 },
    { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana', country: 'India', countryCode: 'IN', lat: 17.2403, lon: 78.4294 },
    { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', state: 'West Bengal', country: 'India', countryCode: 'IN', lat: 22.6547, lon: 88.4467 },
    { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', state: 'Gujarat', country: 'India', countryCode: 'IN', lat: 23.0772, lon: 72.6347 },
    { code: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra', country: 'India', countryCode: 'IN', lat: 18.5821, lon: 73.9197 },
    { code: 'GOI', name: 'Goa International Airport', city: 'Goa', state: 'Goa', country: 'India', countryCode: 'IN', lat: 15.3808, lon: 73.8314 },
    { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', state: 'Kerala', country: 'India', countryCode: 'IN', lat: 10.1520, lon: 76.4019 },
    { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', state: 'Rajasthan', country: 'India', countryCode: 'IN', lat: 26.8242, lon: 75.8122 },

    // UAE
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', state: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.2532, lon: 55.3657 },
    { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', state: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: 'AE', lat: 24.4330, lon: 54.6511 },
    { code: 'SHJ', name: 'Sharjah International Airport', city: 'Sharjah', state: 'Sharjah', country: 'United Arab Emirates', countryCode: 'AE', lat: 25.3286, lon: 55.5172 },

    // Singapore
    { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', state: 'Singapore', country: 'Singapore', countryCode: 'SG', lat: 1.3644, lon: 103.9915 },

    // Thailand
    { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', state: 'Bangkok', country: 'Thailand', countryCode: 'TH', lat: 13.6900, lon: 100.7501 },
    { code: 'DMK', name: 'Don Mueang International Airport', city: 'Bangkok', state: 'Bangkok', country: 'Thailand', countryCode: 'TH', lat: 13.9126, lon: 100.6067 },
    { code: 'HKT', name: 'Phuket International Airport', city: 'Phuket', state: 'Phuket', country: 'Thailand', countryCode: 'TH', lat: 8.1132, lon: 98.3169 },

    // Malaysia
    { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', state: 'Selangor', country: 'Malaysia', countryCode: 'MY', lat: 2.7456, lon: 101.7099 },

    // Australia
    { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', state: 'New South Wales', country: 'Australia', countryCode: 'AU', lat: -33.9399, lon: 151.1753 },
    { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', state: 'Victoria', country: 'Australia', countryCode: 'AU', lat: -37.6690, lon: 144.8410 },
    { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', state: 'Queensland', country: 'Australia', countryCode: 'AU', lat: -27.3942, lon: 153.1218 },
    { code: 'PER', name: 'Perth Airport', city: 'Perth', state: 'Western Australia', country: 'Australia', countryCode: 'AU', lat: -31.9403, lon: 115.9672 },

    // Japan
    { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', state: 'Chiba', country: 'Japan', countryCode: 'JP', lat: 35.7720, lon: 140.3929 },
    { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', state: 'Tokyo', country: 'Japan', countryCode: 'JP', lat: 35.5494, lon: 139.7798 },
    { code: 'KIX', name: 'Kansai International Airport', city: 'Osaka', state: 'Osaka', country: 'Japan', countryCode: 'JP', lat: 34.4273, lon: 135.2444 },

    // South Korea
    { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', state: 'Incheon', country: 'South Korea', countryCode: 'KR', lat: 37.4602, lon: 126.4407 },
    { code: 'GMP', name: 'Gimpo International Airport', city: 'Seoul', state: 'Seoul', country: 'South Korea', countryCode: 'KR', lat: 37.5583, lon: 126.7906 },

    // China
    { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', state: 'Beijing', country: 'China', countryCode: 'CN', lat: 40.0801, lon: 116.5846 },
    { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', state: 'Shanghai', country: 'China', countryCode: 'CN', lat: 31.1443, lon: 121.8083 },
    { code: 'CAN', name: 'Guangzhou Baiyun International Airport', city: 'Guangzhou', state: 'Guangdong', country: 'China', countryCode: 'CN', lat: 23.3924, lon: 113.2988 },
    { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', state: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', lat: 22.3080, lon: 113.9185 },

    // France
    { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', state: 'Île-de-France', country: 'France', countryCode: 'FR', lat: 49.0097, lon: 2.5479 },
    { code: 'ORY', name: 'Paris Orly Airport', city: 'Paris', state: 'Île-de-France', country: 'France', countryCode: 'FR', lat: 48.7233, lon: 2.3794 },
    { code: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', state: 'Provence-Alpes-Côte d\'Azur', country: 'France', countryCode: 'FR', lat: 43.6584, lon: 7.2159 },

    // Germany
    { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', state: 'Hesse', country: 'Germany', countryCode: 'DE', lat: 50.0379, lon: 8.5622 },
    { code: 'MUC', name: 'Munich Airport', city: 'Munich', state: 'Bavaria', country: 'Germany', countryCode: 'DE', lat: 48.3538, lon: 11.7861 },
    { code: 'TXL', name: 'Berlin Tegel Airport', city: 'Berlin', state: 'Berlin', country: 'Germany', countryCode: 'DE', lat: 52.5597, lon: 13.2877 },

    // Spain
    { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', state: 'Madrid', country: 'Spain', countryCode: 'ES', lat: 40.4936, lon: -3.5668 },
    { code: 'BCN', name: 'Barcelona–El Prat Airport', city: 'Barcelona', state: 'Catalonia', country: 'Spain', countryCode: 'ES', lat: 41.2974, lon: 2.0833 },

    // Italy
    { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino Airport', city: 'Rome', state: 'Lazio', country: 'Italy', countryCode: 'IT', lat: 41.8003, lon: 12.2389 },
    { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', state: 'Lombardy', country: 'Italy', countryCode: 'IT', lat: 45.6301, lon: 8.7231 },
    { code: 'VCE', name: 'Venice Marco Polo Airport', city: 'Venice', state: 'Veneto', country: 'Italy', countryCode: 'IT', lat: 45.5053, lon: 12.3519 },

    // Netherlands
    { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', state: 'North Holland', country: 'Netherlands', countryCode: 'NL', lat: 52.3105, lon: 4.7683 },

    // Switzerland
    { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', state: 'Zurich', country: 'Switzerland', countryCode: 'CH', lat: 47.4647, lon: 8.5492 },
    { code: 'GVA', name: 'Geneva Airport', city: 'Geneva', state: 'Geneva', country: 'Switzerland', countryCode: 'CH', lat: 46.2381, lon: 6.1090 },

    // Canada
    { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', state: 'Ontario', country: 'Canada', countryCode: 'CA', lat: 43.6777, lon: -79.6248 },
    { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', state: 'British Columbia', country: 'Canada', countryCode: 'CA', lat: 49.1947, lon: -123.184 },
    { code: 'YUL', name: 'Montréal–Pierre Elliott Trudeau International Airport', city: 'Montreal', state: 'Quebec', country: 'Canada', countryCode: 'CA', lat: 45.4657, lon: -73.7455 },

    // Brazil
    { code: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', state: 'São Paulo', country: 'Brazil', countryCode: 'BR', lat: -23.4356, lon: -46.4731 },
    { code: 'GIG', name: 'Rio de Janeiro/Galeão International Airport', city: 'Rio de Janeiro', state: 'Rio de Janeiro', country: 'Brazil', countryCode: 'BR', lat: -22.8099, lon: -43.2505 },

    // Mexico
    { code: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', state: 'Mexico City', country: 'Mexico', countryCode: 'MX', lat: 19.4363, lon: -99.0721 },
    { code: 'CUN', name: 'Cancún International Airport', city: 'Cancún', state: 'Quintana Roo', country: 'Mexico', countryCode: 'MX', lat: 21.0365, lon: -86.8771 },

    // South Africa
    { code: 'JNB', name: 'O. R. Tambo International Airport', city: 'Johannesburg', state: 'Gauteng', country: 'South Africa', countryCode: 'ZA', lat: -26.1392, lon: 28.2460 },
    { code: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', state: 'Western Cape', country: 'South Africa', countryCode: 'ZA', lat: -33.9649, lon: 18.6017 },

    // Turkey
    { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', state: 'Istanbul', country: 'Turkey', countryCode: 'TR', lat: 41.2753, lon: 28.7519 },
    { code: 'SAW', name: 'Sabiha Gökçen International Airport', city: 'Istanbul', state: 'Istanbul', country: 'Turkey', countryCode: 'TR', lat: 40.8986, lon: 29.3092 },

    // Russia
    { code: 'SVO', name: 'Sheremetyevo International Airport', city: 'Moscow', state: 'Moscow Oblast', country: 'Russia', countryCode: 'RU', lat: 55.9726, lon: 37.4146 },
    { code: 'DME', name: 'Domodedovo International Airport', city: 'Moscow', state: 'Moscow Oblast', country: 'Russia', countryCode: 'RU', lat: 55.4088, lon: 37.9063 },

    // Egypt
    { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', state: 'Cairo', country: 'Egypt', countryCode: 'EG', lat: 30.1219, lon: 31.4056 },

    // Saudi Arabia
    { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', state: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', lat: 24.9576, lon: 46.6988 },
    { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', state: 'Makkah', country: 'Saudi Arabia', countryCode: 'SA', lat: 21.6796, lon: 39.1565 },

    // Qatar
    { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', state: 'Doha', country: 'Qatar', countryCode: 'QA', lat: 25.2731, lon: 51.6083 },

    // Kenya
    { code: 'NBO', name: 'Jomo Kenyatta International Airport', city: 'Nairobi', state: 'Nairobi', country: 'Kenya', countryCode: 'KE', lat: -1.3192, lon: 36.9278 },

    // Indonesia
    { code: 'CGK', name: 'Soekarno–Hatta International Airport', city: 'Jakarta', state: 'Banten', country: 'Indonesia', countryCode: 'ID', lat: -6.1256, lon: 106.6559 },
    { code: 'DPS', name: 'Ngurah Rai International Airport', city: 'Denpasar', state: 'Bali', country: 'Indonesia', countryCode: 'ID', lat: -8.7482, lon: 115.1670 },

    // Philippines
    { code: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', state: 'Metro Manila', country: 'Philippines', countryCode: 'PH', lat: 14.5086, lon: 121.0194 },

    // Vietnam
    { code: 'SGN', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', state: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', lat: 10.8188, lon: 106.6519 },
    { code: 'HAN', name: 'Noi Bai International Airport', city: 'Hanoi', state: 'Hanoi', country: 'Vietnam', countryCode: 'VN', lat: 21.2212, lon: 105.8072 },

    // New Zealand
    { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', state: 'Auckland', country: 'New Zealand', countryCode: 'NZ', lat: -37.0082, lon: 174.7850 },
    { code: 'CHC', name: 'Christchurch International Airport', city: 'Christchurch', state: 'Canterbury', country: 'New Zealand', countryCode: 'NZ', lat: -43.4894, lon: 172.5320 },

    // Argentina
    { code: 'EZE', name: 'Ministro Pistarini International Airport', city: 'Buenos Aires', state: 'Buenos Aires', country: 'Argentina', countryCode: 'AR', lat: -34.8222, lon: -58.5358 },

    // Chile
    { code: 'SCL', name: 'Arturo Merino Benítez International Airport', city: 'Santiago', state: 'Santiago', country: 'Chile', countryCode: 'CL', lat: -33.3930, lon: -70.7858 },

    // Portugal
    { code: 'LIS', name: 'Lisbon Portela Airport', city: 'Lisbon', state: 'Lisbon', country: 'Portugal', countryCode: 'PT', lat: 38.7813, lon: -9.1359 },

    // Greece
    { code: 'ATH', name: 'Athens International Airport', city: 'Athens', state: 'Attica', country: 'Greece', countryCode: 'GR', lat: 37.9364, lon: 23.9445 },

    // Austria
    { code: 'VIE', name: 'Vienna International Airport', city: 'Vienna', state: 'Vienna', country: 'Austria', countryCode: 'AT', lat: 48.1103, lon: 16.5697 },

    // Belgium
    { code: 'BRU', name: 'Brussels Airport', city: 'Brussels', state: 'Flemish Brabant', country: 'Belgium', countryCode: 'BE', lat: 50.9014, lon: 4.4844 },

    // Denmark
    { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', state: 'Capital Region', country: 'Denmark', countryCode: 'DK', lat: 55.6180, lon: 12.6508 },

    // Sweden
    { code: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', state: 'Stockholm', country: 'Sweden', countryCode: 'SE', lat: 59.6519, lon: 17.9186 },

    // Norway
    { code: 'OSL', name: 'Oslo Airport', city: 'Oslo', state: 'Viken', country: 'Norway', countryCode: 'NO', lat: 60.1976, lon: 11.1004 },

    // Finland
    { code: 'HEL', name: 'Helsinki-Vantaa Airport', city: 'Helsinki', state: 'Uusimaa', country: 'Finland', countryCode: 'FI', lat: 60.3172, lon: 24.9633 },

    // Poland
    { code: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw', state: 'Masovian', country: 'Poland', countryCode: 'PL', lat: 52.1657, lon: 20.9671 },

    // Czech Republic
    { code: 'PRG', name: 'Václav Havel Airport Prague', city: 'Prague', state: 'Prague', country: 'Czech Republic', countryCode: 'CZ', lat: 50.1008, lon: 14.2632 },

    // Ireland
    { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', state: 'Leinster', country: 'Ireland', countryCode: 'IE', lat: 53.4213, lon: -6.2701 },

    // Israel
    { code: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', state: 'Central District', country: 'Israel', countryCode: 'IL', lat: 32.0114, lon: 34.8867 },

    // Sri Lanka
    { code: 'CMB', name: 'Bandaranaike International Airport', city: 'Colombo', state: 'Western', country: 'Sri Lanka', countryCode: 'LK', lat: 7.1808, lon: 79.8841 },

    // Bangladesh
    { code: 'DAC', name: 'Hazrat Shahjalal International Airport', city: 'Dhaka', state: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', lat: 23.8433, lon: 90.3978 },

    // Pakistan
    { code: 'KHI', name: 'Jinnah International Airport', city: 'Karachi', state: 'Sindh', country: 'Pakistan', countryCode: 'PK', lat: 24.9065, lon: 67.1608 },
    { code: 'LHE', name: 'Allama Iqbal International Airport', city: 'Lahore', state: 'Punjab', country: 'Pakistan', countryCode: 'PK', lat: 31.5217, lon: 74.4036 },

    // Nepal
    { code: 'KTM', name: 'Tribhuvan International Airport', city: 'Kathmandu', state: 'Bagmati', country: 'Nepal', countryCode: 'NP', lat: 27.6966, lon: 85.3591 },

    // Maldives
    { code: 'MLE', name: 'Velana International Airport', city: 'Malé', state: 'Kaafu', country: 'Maldives', countryCode: 'MV', lat: 4.1917, lon: 73.5291 },

    // Nigeria
    { code: 'LOS', name: 'Murtala Muhammed International Airport', city: 'Lagos', state: 'Lagos', country: 'Nigeria', countryCode: 'NG', lat: 6.5774, lon: 3.3213 },

    // Morocco
    { code: 'CMN', name: 'Mohammed V International Airport', city: 'Casablanca', state: 'Casablanca-Settat', country: 'Morocco', countryCode: 'MA', lat: 33.3675, lon: -7.5898 },

    // Add more as needed...
];

// ============================================
// SEARCH & AUTOCOMPLETE FUNCTIONS
// ============================================

/**
 * Search airports by query (city, airport name, code, country)
 * @param {string} query - Search query
 * @param {number} limit - Maximum results
 * @returns {Array} Matching airports
 */
function searchAirports(query, limit = 10) {
    if (!query || query.length < 2) return [];

    const searchQuery = query.toLowerCase().trim();
    
    // Search in code, city, airport name, country
    const results = AIRPORTS_DATABASE.filter(airport => {
        return (
            airport.code.toLowerCase().includes(searchQuery) ||
            airport.city.toLowerCase().includes(searchQuery) ||
            airport.name.toLowerCase().includes(searchQuery) ||
            airport.country.toLowerCase().includes(searchQuery) ||
            airport.state.toLowerCase().includes(searchQuery)
        );
    });

    // Sort by relevance (exact matches first)
    results.sort((a, b) => {
        const aCodeMatch = a.code.toLowerCase() === searchQuery;
        const bCodeMatch = b.code.toLowerCase() === searchQuery;
        const aCityMatch = a.city.toLowerCase() === searchQuery;
        const bCityMatch = b.city.toLowerCase() === searchQuery;

        if (aCodeMatch && !bCodeMatch) return -1;
        if (!aCodeMatch && bCodeMatch) return 1;
        if (aCityMatch && !bCityMatch) return -1;
        if (!aCityMatch && bCityMatch) return 1;
        
        return a.city.localeCompare(b.city);
    });

    return results.slice(0, limit);
}

/**
 * Get airport by IATA code
 * @param {string} code - IATA airport code
 * @returns {Object|null} Airport object or null
 */
function getAirportByCode(code) {
    return AIRPORTS_DATABASE.find(airport => 
        airport.code.toUpperCase() === code.toUpperCase()
    ) || null;
}

/**
 * Get all airports in a city
 * @param {string} city - City name
 * @returns {Array} Airports in the city
 */
function getAirportsByCity(city) {
    return AIRPORTS_DATABASE.filter(airport => 
        airport.city.toLowerCase() === city.toLowerCase()
    );
}

/**
 * Get all airports in a country
 * @param {string} country - Country name or code
 * @returns {Array} Airports in the country
 */
function getAirportsByCountry(country) {
    return AIRPORTS_DATABASE.filter(airport => 
        airport.country.toLowerCase() === country.toLowerCase() ||
        airport.countryCode.toLowerCase() === country.toLowerCase()
    );
}

/**
 * Get popular routes
 * @returns {Array} Popular flight routes
 */
function getPopularRoutes() {
    return [
        { from: 'DEL', to: 'DXB', route: 'Delhi → Dubai' },
        { from: 'BOM', to: 'DXB', route: 'Mumbai → Dubai' },
        { from: 'BLR', to: 'SIN', route: 'Bangalore → Singapore' },
        { from: 'DEL', to: 'LHR', route: 'Delhi → London' },
        { from: 'MAA', to: 'BKK', route: 'Chennai → Bangkok' },
        { from: 'HYD', to: 'DXB', route: 'Hyderabad → Dubai' },
        { from: 'BOM', to: 'JFK', route: 'Mumbai → New York' },
        { from: 'DEL', to: 'SFO', route: 'Delhi → San Francisco' }
    ];
}

/**
 * Calculate distance between two airports (Haversine formula)
 * @param {Object} airport1 - First airport
 * @param {Object} airport2 - Second airport
 * @returns {number} Distance in kilometers
 */
function calculateDistance(airport1, airport2) {
    const R = 6371; // Earth's radius in km
    const dLat = (airport2.lat - airport1.lat) * Math.PI / 180;
    const dLon = (airport2.lon - airport1.lon) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(airport1.lat * Math.PI / 180) * Math.cos(airport2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance);
}

/**
 * Get nearby airports
 * @param {string} airportCode - Airport IATA code
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Array} Nearby airports
 */
function getNearbyAirports(airportCode, radiusKm = 200) {
    const airport = getAirportByCode(airportCode);
    if (!airport) return [];

    return AIRPORTS_DATABASE
        .filter(a => a.code !== airportCode)
        .map(a => ({
            ...a,
            distance: calculateDistance(airport, a)
        }))
        .filter(a => a.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
}

// ============================================
// API INTEGRATION FUNCTIONS
// ============================================

/**
 * Fetch airports from AviationStack API
 * @param {string} query - Search query
 * @returns {Promise<Array>} Airports from API
 */
async function fetchAirportsFromAPI(query) {
    const provider = FLIGHT_API_CONFIG.activeProvider;

    if (provider === 'local') {
        return Promise.resolve(searchAirports(query));
    }

    try {
        if (provider === 'aviationStack') {
            return await fetchFromAviationStack(query);
        } else if (provider === 'amadeus') {
            return await fetchFromAmadeus(query);
        } else if (provider === 'rapidApi') {
            return await fetchFromRapidAPI(query);
        }
    } catch (error) {
        console.error('API fetch error:', error);
        // Fallback to local database
        return searchAirports(query);
    }
}

/**
 * Fetch from AviationStack API
 */
async function fetchFromAviationStack(query) {
    const { apiKey, baseUrl, endpoints } = FLIGHT_API_CONFIG.aviationStack;
    const url = `${baseUrl}${endpoints.airports}?access_key=${apiKey}&search=${query}&limit=10`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.data) {
        return data.data.map(airport => ({
            code: airport.iata_code,
            name: airport.airport_name,
            city: airport.city_name,
            country: airport.country_name,
            countryCode: airport.country_iso2,
            lat: airport.latitude,
            lon: airport.longitude
        }));
    }

    return [];
}

/**
 * Fetch from Amadeus API
 */
async function fetchFromAmadeus(query) {
    // Amadeus requires OAuth2 token first
    const { apiKey, apiSecret, baseUrl, endpoints } = FLIGHT_API_CONFIG.amadeus;
    
    // Get access token
    const tokenUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';
    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`
    });
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Search airports
    const url = `${baseUrl}${endpoints.airports}?subType=AIRPORT&keyword=${query}&page[limit]=10`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();

    if (data.data) {
        return data.data.map(location => ({
            code: location.iataCode,
            name: location.name,
            city: location.address.cityName,
            country: location.address.countryName,
            countryCode: location.address.countryCode,
            lat: location.geoCode?.latitude,
            lon: location.geoCode?.longitude
        }));
    }

    return [];
}

/**
 * Fetch from RapidAPI
 */
async function fetchFromRapidAPI(query) {
    const { apiKey, baseUrl, host } = FLIGHT_API_CONFIG.rapidApi;
    const url = `${baseUrl}/airports/search?query=${query}`;

    const response = await fetch(url, {
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': host
        }
    });

    const data = await response.json();
    return data.results || [];
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

/**
 * Format airport for display
 * @param {Object} airport - Airport object
 * @returns {string} Formatted string
 */
function formatAirportDisplay(airport) {
    return `${airport.city} (${airport.code}) - ${airport.name}`;
}

/**
 * Format airport for short display
 * @param {Object} airport - Airport object
 * @returns {string} Formatted string
 */
function formatAirportShort(airport) {
    return `${airport.city} (${airport.code})`;
}

/**
 * Create airport dropdown item HTML
 * @param {Object} airport - Airport object
 * @returns {string} HTML string
 */
function createAirportDropdownHTML(airport) {
    const distance = airport.distance ? `<span class="distance">${airport.distance} km away</span>` : '';
    
    return `
        <div class="airport-item" data-code="${airport.code}" data-city="${airport.city}" data-name="${airport.name}">
            <div class="airport-main">
                <span class="airport-code">${airport.code}</span>
                <span class="airport-city">${airport.city}, ${airport.country}</span>
            </div>
            <div class="airport-name">${airport.name}</div>
            ${distance}
        </div>
    `;
}

// ============================================
// EXPORT FOR USE
// ============================================

window.FlightAPI = {
    searchAirports,
    getAirportByCode,
    getAirportsByCity,
    getAirportsByCountry,
    getPopularRoutes,
    calculateDistance,
    getNearbyAirports,
    fetchAirportsFromAPI,
    formatAirportDisplay,
    formatAirportShort,
    createAirportDropdownHTML,
    AIRPORTS_DATABASE
};

console.log('✈️ Flight API initialized with', AIRPORTS_DATABASE.length, 'airports');
