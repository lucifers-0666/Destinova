// mongoose imported via connectDB
import dotenv from 'dotenv';
import { Destination } from '../models/Destination.js';
import { connectDatabase } from '../config/db.js';

dotenv.config();

// 20 Popular Destinations - Indian Cities + International
const destinations = [
  // ============ INDIAN DESTINATIONS ============
  {
    name: 'Mumbai',
    country: 'India',
    city: 'Mumbai',
    airportCode: 'BOM',
    description: 'The financial capital of India, Mumbai is a vibrant metropolis known for Bollywood, colonial architecture, bustling markets, and the iconic Gateway of India.',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Chhatrapati Shivaji Terminus', 'Juhu Beach'],
    bestTimeToVisit: 'November to February',
    averageTemp: '27°C',
    currency: 'Indian Rupee (₹)',
    language: 'Hindi, Marathi, English',
    popularityScore: 98,
    featured: true,
    weather: {
      summer: { avgTemp: 33, description: 'Hot and humid with pre-monsoon showers' },
      monsoon: { avgTemp: 28, description: 'Heavy rainfall, lush greenery' },
      winter: { avgTemp: 25, description: 'Pleasant and dry, ideal for sightseeing' },
      spring: { avgTemp: 30, description: 'Warm with occasional humidity' }
    },
    timezone: {
      name: 'Indian Standard Time',
      abbreviation: 'IST',
      utcOffset: '+05:30'
    }
  },
  {
    name: 'Delhi',
    country: 'India',
    city: 'New Delhi',
    airportCode: 'DEL',
    description: 'India\'s capital territory, Delhi is a sprawling metropolis that seamlessly blends ancient history with modern development, featuring Mughal architecture and vibrant markets.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Red Fort', 'Qutub Minar', 'India Gate', 'Lotus Temple', 'Humayun\'s Tomb', 'Chandni Chowk'],
    bestTimeToVisit: 'October to March',
    averageTemp: '25°C',
    currency: 'Indian Rupee (₹)',
    language: 'Hindi, English, Punjabi',
    popularityScore: 97,
    featured: true,
    weather: {
      summer: { avgTemp: 40, description: 'Extremely hot and dry' },
      monsoon: { avgTemp: 32, description: 'Humid with moderate rainfall' },
      winter: { avgTemp: 15, description: 'Cool and foggy, perfect for tourism' },
      spring: { avgTemp: 28, description: 'Pleasant, flowers in bloom' }
    },
    timezone: {
      name: 'Indian Standard Time',
      abbreviation: 'IST',
      utcOffset: '+05:30'
    }
  },
  {
    name: 'Bangalore',
    country: 'India',
    city: 'Bengaluru',
    airportCode: 'BLR',
    description: 'The Silicon Valley of India, Bangalore is known for its pleasant climate, thriving tech industry, beautiful parks, and vibrant nightlife.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Lalbagh Botanical Garden', 'Cubbon Park', 'Bangalore Palace', 'ISKCON Temple', 'Vidhana Soudha'],
    bestTimeToVisit: 'October to February',
    averageTemp: '24°C',
    currency: 'Indian Rupee (₹)',
    language: 'Kannada, English, Hindi',
    popularityScore: 92,
    featured: true,
    weather: {
      summer: { avgTemp: 33, description: 'Warm with occasional thunderstorms' },
      monsoon: { avgTemp: 24, description: 'Pleasant with moderate rainfall' },
      winter: { avgTemp: 20, description: 'Cool and pleasant, ideal weather' },
      spring: { avgTemp: 28, description: 'Warm and comfortable' }
    },
    timezone: {
      name: 'Indian Standard Time',
      abbreviation: 'IST',
      utcOffset: '+05:30'
    }
  },
  {
    name: 'Goa',
    country: 'India',
    city: 'Panaji',
    airportCode: 'GOI',
    description: 'India\'s beach paradise, Goa offers stunning coastlines, Portuguese heritage, vibrant nightlife, water sports, and delicious seafood cuisine.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Baga Beach', 'Basilica of Bom Jesus', 'Fort Aguada', 'Dudhsagar Falls', 'Anjuna Flea Market'],
    bestTimeToVisit: 'November to February',
    averageTemp: '28°C',
    currency: 'Indian Rupee (₹)',
    language: 'Konkani, English, Hindi',
    popularityScore: 96,
    featured: true,
    weather: {
      summer: { avgTemp: 33, description: 'Hot and humid' },
      monsoon: { avgTemp: 27, description: 'Heavy rainfall, lush landscapes' },
      winter: { avgTemp: 26, description: 'Perfect beach weather' },
      spring: { avgTemp: 30, description: 'Warm, good for water activities' }
    },
    timezone: {
      name: 'Indian Standard Time',
      abbreviation: 'IST',
      utcOffset: '+05:30'
    }
  },
  {
    name: 'Jaipur',
    country: 'India',
    city: 'Jaipur',
    airportCode: 'JAI',
    description: 'The Pink City of India, Jaipur is renowned for its stunning palaces, ancient forts, vibrant bazaars, and rich Rajasthani culture and heritage.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort', 'Jal Mahal'],
    bestTimeToVisit: 'October to March',
    averageTemp: '26°C',
    currency: 'Indian Rupee (₹)',
    language: 'Hindi, Rajasthani, English',
    popularityScore: 94,
    featured: true,
    weather: {
      summer: { avgTemp: 42, description: 'Very hot and dry' },
      monsoon: { avgTemp: 30, description: 'Occasional rainfall, less crowded' },
      winter: { avgTemp: 18, description: 'Cool and pleasant, peak season' },
      spring: { avgTemp: 32, description: 'Warm days, comfortable evenings' }
    },
    timezone: {
      name: 'Indian Standard Time',
      abbreviation: 'IST',
      utcOffset: '+05:30'
    }
  },
  {
    name: 'Kerala',
    country: 'India',
    city: 'Kochi',
    airportCode: 'COK',
    description: 'God\'s Own Country, Kerala is famous for its serene backwaters, pristine beaches, Ayurvedic treatments, hill stations, and lush tea plantations.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Alleppey Backwaters', 'Munnar Tea Gardens', 'Fort Kochi', 'Periyar Wildlife Sanctuary', 'Kovalam Beach'],
    bestTimeToVisit: 'September to March',
    averageTemp: '28°C',
    currency: 'Indian Rupee (₹)',
    language: 'Malayalam, English',
    popularityScore: 95,
    featured: true,
    weather: {
      summer: { avgTemp: 32, description: 'Hot and humid' },
      monsoon: { avgTemp: 26, description: 'Heavy rainfall, Ayurveda season' },
      winter: { avgTemp: 26, description: 'Pleasant and ideal for tourism' },
      spring: { avgTemp: 30, description: 'Warm with occasional showers' }
    },
    timezone: {
      name: 'Indian Standard Time',
      abbreviation: 'IST',
      utcOffset: '+05:30'
    }
  },
  {
    name: 'Hyderabad',
    country: 'India',
    city: 'Hyderabad',
    airportCode: 'HYD',
    description: 'The City of Pearls and Nizams, Hyderabad offers a perfect blend of heritage, technology, and the world-famous Hyderabadi biryani.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Charminar', 'Golconda Fort', 'Hussain Sagar Lake', 'Ramoji Film City', 'Salar Jung Museum'],
    bestTimeToVisit: 'October to March',
    averageTemp: '27°C',
    currency: 'Indian Rupee (₹)',
    language: 'Telugu, Urdu, Hindi, English',
    popularityScore: 90,
    featured: false,
    weather: {
      summer: { avgTemp: 38, description: 'Hot and dry' },
      monsoon: { avgTemp: 28, description: 'Moderate rainfall' },
      winter: { avgTemp: 22, description: 'Pleasant weather' },
      spring: { avgTemp: 32, description: 'Warm and comfortable' }
    },
    timezone: {
      name: 'Indian Standard Time',
      abbreviation: 'IST',
      utcOffset: '+05:30'
    }
  },
  {
    name: 'Chennai',
    country: 'India',
    city: 'Chennai',
    airportCode: 'MAA',
    description: 'The cultural capital of South India, Chennai is known for its classical music, ancient temples, beautiful beaches, and delicious South Indian cuisine.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Marina Beach', 'Kapaleeshwarar Temple', 'Fort St. George', 'San Thome Basilica', 'Mahabalipuram'],
    bestTimeToVisit: 'November to February',
    averageTemp: '29°C',
    currency: 'Indian Rupee (₹)',
    language: 'Tamil, English',
    popularityScore: 88,
    featured: false,
    weather: {
      summer: { avgTemp: 38, description: 'Very hot and humid' },
      monsoon: { avgTemp: 30, description: 'Northeast monsoon brings heavy rain' },
      winter: { avgTemp: 26, description: 'Pleasant and less humid' },
      spring: { avgTemp: 33, description: 'Warm, approaching summer heat' }
    },
    timezone: {
      name: 'Indian Standard Time',
      abbreviation: 'IST',
      utcOffset: '+05:30'
    }
  },
  {
    name: 'Kolkata',
    country: 'India',
    city: 'Kolkata',
    airportCode: 'CCU',
    description: 'The City of Joy, Kolkata is a cultural hub known for its colonial architecture, literary heritage, Durga Puja celebrations, and delectable sweets.',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Victoria Memorial', 'Howrah Bridge', 'Dakshineswar Kali Temple', 'Indian Museum', 'Park Street'],
    bestTimeToVisit: 'October to March',
    averageTemp: '27°C',
    currency: 'Indian Rupee (₹)',
    language: 'Bengali, English, Hindi',
    popularityScore: 89,
    featured: false,
    weather: {
      summer: { avgTemp: 35, description: 'Hot and very humid' },
      monsoon: { avgTemp: 30, description: 'Heavy rainfall' },
      winter: { avgTemp: 20, description: 'Pleasant and comfortable' },
      spring: { avgTemp: 30, description: 'Warm with high humidity' }
    },
    timezone: {
      name: 'Indian Standard Time',
      abbreviation: 'IST',
      utcOffset: '+05:30'
    }
  },
  {
    name: 'Agra',
    country: 'India',
    city: 'Agra',
    airportCode: 'AGR',
    description: 'Home to the iconic Taj Mahal, Agra is a UNESCO World Heritage city showcasing the pinnacle of Mughal architecture and craftsmanship.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Taj Mahal', 'Agra Fort', 'Fatehpur Sikri', 'Mehtab Bagh', 'Itimad-ud-Daulah'],
    bestTimeToVisit: 'October to March',
    averageTemp: '26°C',
    currency: 'Indian Rupee (₹)',
    language: 'Hindi, English',
    popularityScore: 99,
    featured: true,
    weather: {
      summer: { avgTemp: 42, description: 'Extremely hot' },
      monsoon: { avgTemp: 32, description: 'Humid with rainfall' },
      winter: { avgTemp: 18, description: 'Cool and foggy, best for Taj' },
      spring: { avgTemp: 30, description: 'Warm days' }
    },
    timezone: {
      name: 'Indian Standard Time',
      abbreviation: 'IST',
      utcOffset: '+05:30'
    }
  },
  
  // ============ INTERNATIONAL DESTINATIONS ============
  {
    name: 'Dubai',
    country: 'UAE',
    city: 'Dubai',
    airportCode: 'DXB',
    description: 'A city of superlatives, Dubai is known for luxury shopping, ultramodern architecture, the world\'s tallest building, and a vibrant nightlife scene.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea90b2009f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Burj Khalifa', 'The Dubai Mall', 'Palm Jumeirah', 'Burj Al Arab', 'Dubai Marina', 'Desert Safari'],
    bestTimeToVisit: 'November to March',
    averageTemp: '28°C',
    currency: 'UAE Dirham (AED)',
    language: 'Arabic, English',
    popularityScore: 96,
    featured: true,
    weather: {
      summer: { avgTemp: 42, description: 'Extremely hot' },
      monsoon: { avgTemp: 38, description: 'Hot with no rainfall' },
      winter: { avgTemp: 20, description: 'Pleasant, perfect weather' },
      spring: { avgTemp: 30, description: 'Warm and comfortable' }
    },
    timezone: {
      name: 'Gulf Standard Time',
      abbreviation: 'GST',
      utcOffset: '+04:00'
    }
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    city: 'Singapore',
    airportCode: 'SIN',
    description: 'A global financial hub, Singapore is a city-state known for its futuristic skyline, multicultural food scene, and world-class attractions.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Orchard Road', 'Universal Studios', 'Singapore Zoo'],
    bestTimeToVisit: 'February to April',
    averageTemp: '27°C',
    currency: 'Singapore Dollar (SGD)',
    language: 'English, Mandarin, Malay, Tamil',
    popularityScore: 94,
    featured: true,
    weather: {
      summer: { avgTemp: 31, description: 'Hot and humid' },
      monsoon: { avgTemp: 27, description: 'Heavy rainfall periods' },
      winter: { avgTemp: 26, description: 'Slightly less humid' },
      spring: { avgTemp: 28, description: 'Warm with occasional rain' }
    },
    timezone: {
      name: 'Singapore Standard Time',
      abbreviation: 'SGT',
      utcOffset: '+08:00'
    }
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    city: 'Bangkok',
    airportCode: 'BKK',
    description: 'Thailand\'s capital Bangkok is known for ornate shrines, vibrant street life, floating markets, and the iconic Grand Palace.',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Grand Palace', 'Wat Phra Kaew', 'Chatuchak Market', 'Wat Arun', 'Khao San Road', 'Floating Markets'],
    bestTimeToVisit: 'November to February',
    averageTemp: '29°C',
    currency: 'Thai Baht (THB)',
    language: 'Thai, English',
    popularityScore: 93,
    featured: true,
    weather: {
      summer: { avgTemp: 35, description: 'Very hot and humid' },
      monsoon: { avgTemp: 30, description: 'Heavy rainfall' },
      winter: { avgTemp: 26, description: 'Cool and dry, best time' },
      spring: { avgTemp: 33, description: 'Hot with humidity rising' }
    },
    timezone: {
      name: 'Indochina Time',
      abbreviation: 'ICT',
      utcOffset: '+07:00'
    }
  },
  {
    name: 'London',
    country: 'United Kingdom',
    city: 'London',
    airportCode: 'LHR',
    description: 'A world capital of culture, London offers iconic landmarks, royal heritage, world-class museums, West End shows, and diverse culinary experiences.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Big Ben', 'Tower of London', 'Buckingham Palace', 'British Museum', 'London Eye', 'Hyde Park'],
    bestTimeToVisit: 'March to May',
    averageTemp: '14°C',
    currency: 'British Pound (£)',
    language: 'English',
    popularityScore: 97,
    featured: true,
    weather: {
      summer: { avgTemp: 22, description: 'Warm and pleasant' },
      monsoon: { avgTemp: 15, description: 'Frequent rain showers' },
      winter: { avgTemp: 6, description: 'Cold and damp' },
      spring: { avgTemp: 14, description: 'Mild with flowers blooming' }
    },
    timezone: {
      name: 'Greenwich Mean Time',
      abbreviation: 'GMT',
      utcOffset: '+00:00'
    }
  },
  {
    name: 'New York',
    country: 'USA',
    city: 'New York City',
    airportCode: 'JFK',
    description: 'The city that never sleeps, New York is home to iconic skyscrapers, Broadway shows, world-class museums, and Central Park.',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Statue of Liberty', 'Central Park', 'Empire State Building', 'Times Square', 'Brooklyn Bridge', 'Metropolitan Museum'],
    bestTimeToVisit: 'April to June',
    averageTemp: '13°C',
    currency: 'US Dollar ($)',
    language: 'English',
    popularityScore: 98,
    featured: true,
    weather: {
      summer: { avgTemp: 29, description: 'Hot and humid' },
      monsoon: { avgTemp: 22, description: 'Occasional thunderstorms' },
      winter: { avgTemp: 2, description: 'Cold with snowfall' },
      spring: { avgTemp: 15, description: 'Mild and pleasant' }
    },
    timezone: {
      name: 'Eastern Standard Time',
      abbreviation: 'EST',
      utcOffset: '-05:00'
    }
  },
  {
    name: 'Paris',
    country: 'France',
    city: 'Paris',
    airportCode: 'CDG',
    description: 'The City of Light, Paris is known for its café culture, the Eiffel Tower, the Louvre, haute couture fashion, and romantic ambiance.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Arc de Triomphe', 'Champs-Élysées', 'Palace of Versailles'],
    bestTimeToVisit: 'June to August',
    averageTemp: '12°C',
    currency: 'Euro (€)',
    language: 'French',
    popularityScore: 99,
    featured: true,
    weather: {
      summer: { avgTemp: 25, description: 'Warm and sunny' },
      monsoon: { avgTemp: 18, description: 'Occasional rain' },
      winter: { avgTemp: 5, description: 'Cold but festive' },
      spring: { avgTemp: 14, description: 'Pleasant with blooming flowers' }
    },
    timezone: {
      name: 'Central European Time',
      abbreviation: 'CET',
      utcOffset: '+01:00'
    }
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    city: 'Tokyo',
    airportCode: 'NRT',
    description: 'Japan\'s busy capital mixes ultramodern and traditional, from neon-lit skyscrapers to historic temples, anime culture, and exquisite cuisine.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Senso-ji Temple', 'Tokyo Skytree', 'Meiji Jingu Shrine', 'Shibuya Crossing', 'Akihabara', 'Mount Fuji Day Trip'],
    bestTimeToVisit: 'March to May',
    averageTemp: '16°C',
    currency: 'Japanese Yen (¥)',
    language: 'Japanese',
    popularityScore: 95,
    featured: true,
    weather: {
      summer: { avgTemp: 30, description: 'Hot and humid' },
      monsoon: { avgTemp: 25, description: 'Rainy season (tsuyu)' },
      winter: { avgTemp: 8, description: 'Cold but mostly dry' },
      spring: { avgTemp: 18, description: 'Cherry blossom season' }
    },
    timezone: {
      name: 'Japan Standard Time',
      abbreviation: 'JST',
      utcOffset: '+09:00'
    }
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    city: 'Denpasar',
    airportCode: 'DPS',
    description: 'Indonesia\'s paradise island, Bali offers stunning beaches, ancient temples, terraced rice paddies, yoga retreats, and vibrant nightlife.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Uluwatu Temple', 'Tegallalang Rice Terrace', 'Sacred Monkey Forest', 'Tanah Lot', 'Seminyak Beach', 'Ubud Art Market'],
    bestTimeToVisit: 'April to October',
    averageTemp: '27°C',
    currency: 'Indonesian Rupiah (IDR)',
    language: 'Indonesian, Balinese, English',
    popularityScore: 94,
    featured: true,
    weather: {
      summer: { avgTemp: 28, description: 'Dry season, perfect weather' },
      monsoon: { avgTemp: 27, description: 'Wet season with tropical showers' },
      winter: { avgTemp: 26, description: 'Pleasant and comfortable' },
      spring: { avgTemp: 28, description: 'Dry and sunny' }
    },
    timezone: {
      name: 'Central Indonesia Time',
      abbreviation: 'WITA',
      utcOffset: '+08:00'
    }
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    city: 'Malé',
    airportCode: 'MLE',
    description: 'A tropical paradise of 26 atolls, Maldives is famous for its crystal-clear waters, overwater villas, pristine beaches, and world-class diving.',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Underwater Restaurants', 'Overwater Bungalows', 'Coral Reefs', 'Bioluminescent Beach', 'Malé Friday Mosque'],
    bestTimeToVisit: 'November to April',
    averageTemp: '29°C',
    currency: 'Maldivian Rufiyaa (MVR)',
    language: 'Dhivehi, English',
    popularityScore: 97,
    featured: true,
    weather: {
      summer: { avgTemp: 30, description: 'Wet season starts' },
      monsoon: { avgTemp: 28, description: 'Southwest monsoon, rainfall' },
      winter: { avgTemp: 28, description: 'Dry season, ideal for visits' },
      spring: { avgTemp: 30, description: 'Warm and transitioning' }
    },
    timezone: {
      name: 'Maldives Time',
      abbreviation: 'MVT',
      utcOffset: '+05:00'
    }
  },
  {
    name: 'Sydney',
    country: 'Australia',
    city: 'Sydney',
    airportCode: 'SYD',
    description: 'Australia\'s largest city, Sydney is famous for its harbourfront Opera House, the Harbour Bridge, beautiful beaches, and laid-back lifestyle.',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    attractions: ['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach', 'Taronga Zoo', 'The Rocks', 'Blue Mountains'],
    bestTimeToVisit: 'September to November',
    averageTemp: '18°C',
    currency: 'Australian Dollar (AUD)',
    language: 'English',
    popularityScore: 92,
    featured: false,
    weather: {
      summer: { avgTemp: 26, description: 'Warm and sunny (Dec-Feb)' },
      monsoon: { avgTemp: 20, description: 'Autumn, mild weather (Mar-May)' },
      winter: { avgTemp: 13, description: 'Cool and mild (Jun-Aug)' },
      spring: { avgTemp: 20, description: 'Pleasant, flowers blooming (Sep-Nov)' }
    },
    timezone: {
      name: 'Australian Eastern Standard Time',
      abbreviation: 'AEST',
      utcOffset: '+10:00'
    }
  }
];

const seedDestinations = async () => {
  try {
    console.log('🌍 Starting destination seeding...');
    await connectDatabase();
    
    // Clear existing destinations
    await Destination.deleteMany();
    console.log('✅ Existing destinations cleared');

    // Insert all destinations
    const insertedDestinations = await Destination.insertMany(destinations);
    console.log(`✅ Successfully seeded ${insertedDestinations.length} destinations:`);
    
    // Log summary by region
    const indianDestinations = insertedDestinations.filter(d => d.country === 'India');
    const internationalDestinations = insertedDestinations.filter(d => d.country !== 'India');
    
    console.log(`   📍 Indian Destinations: ${indianDestinations.length}`);
    indianDestinations.forEach(d => console.log(`      - ${d.name} (${d.airportCode})`));
    
    console.log(`   🌐 International Destinations: ${internationalDestinations.length}`);
    internationalDestinations.forEach(d => console.log(`      - ${d.name}, ${d.country} (${d.airportCode})`));
    
    const featuredCount = insertedDestinations.filter(d => d.featured).length;
    console.log(`   ⭐ Featured Destinations: ${featuredCount}`);

    console.log('\n🎉 Destination seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding destinations:', error);
    process.exit(1);
  }
};

seedDestinations();
