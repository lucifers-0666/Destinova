// mongoose imported via connectDB
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Flight } from '../models/Flight.js';
import { Destination } from '../models/Destination.js';
import { connectDatabase } from '../config/db.js';

dotenv.config();

// ========================================
// USERS DATA
// ========================================
const createUsers = async () => {
  const saltRounds = 12;
  const adminPassword = await bcrypt.hash('Admin@123', saltRounds);
  const userPassword = await bcrypt.hash('User@123', saltRounds);

  return [
    {
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@destinova.com',
      password: adminPassword,
      phone: '+91-9000000001',
      role: 'admin',
      isVerified: true,
      loyaltyPoints: 100000,
      loyaltyTier: 'platinum',
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: { email: true, push: true, sms: true, marketing: false },
        seatPreference: 'window',
        mealPreference: 'vegetarian'
      }
    },
    {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@email.com',
      password: userPassword,
      phone: '+91-9876543210',
      role: 'user',
      isVerified: true,
      loyaltyPoints: 15000,
      loyaltyTier: 'gold'
    },
    {
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya.patel@email.com',
      password: userPassword,
      phone: '+91-9876543211',
      role: 'user',
      isVerified: true,
      loyaltyPoints: 8500,
      loyaltyTier: 'silver'
    },
    {
      firstName: 'Amit',
      lastName: 'Kumar',
      email: 'amit.kumar@email.com',
      password: userPassword,
      phone: '+91-9876543212',
      role: 'user',
      isVerified: true,
      loyaltyPoints: 25000,
      loyaltyTier: 'platinum'
    },
    {
      firstName: 'Sneha',
      lastName: 'Reddy',
      email: 'sneha.reddy@email.com',
      password: userPassword,
      phone: '+91-9876543213',
      role: 'user',
      isVerified: true,
      loyaltyPoints: 3200,
      loyaltyTier: 'bronze'
    },
    {
      firstName: 'Vikram',
      lastName: 'Singh',
      email: 'vikram.singh@email.com',
      password: userPassword,
      phone: '+91-9876543214',
      role: 'user',
      isVerified: false,
      loyaltyPoints: 0,
      loyaltyTier: 'bronze'
    }
  ];
};

// ========================================
// FLIGHTS DATA (Simplified for master seed)
// ========================================
const createFlights = () => {
  const airlines = [
    { code: 'AI', name: 'Air India', logo: 'https://example.com/airindia.png' },
    { code: '6E', name: 'IndiGo', logo: 'https://example.com/indigo.png' },
    { code: 'UK', name: 'Vistara', logo: 'https://example.com/vistara.png' },
    { code: 'SG', name: 'SpiceJet', logo: 'https://example.com/spicejet.png' },
    { code: 'EK', name: 'Emirates', logo: 'https://example.com/emirates.png' }
  ];

  const routes = [
    { origin: { code: 'DEL', city: 'New Delhi', airport: 'Indira Gandhi International' }, destination: { code: 'BOM', city: 'Mumbai', airport: 'Chhatrapati Shivaji Maharaj' }, duration: 135 },
    { origin: { code: 'BOM', city: 'Mumbai', airport: 'Chhatrapati Shivaji Maharaj' }, destination: { code: 'DEL', city: 'New Delhi', airport: 'Indira Gandhi International' }, duration: 130 },
    { origin: { code: 'BLR', city: 'Bangalore', airport: 'Kempegowda International' }, destination: { code: 'MAA', city: 'Chennai', airport: 'Chennai International' }, duration: 55 },
    { origin: { code: 'DEL', city: 'New Delhi', airport: 'Indira Gandhi International' }, destination: { code: 'DXB', city: 'Dubai', airport: 'Dubai International' }, duration: 210 },
    { origin: { code: 'BOM', city: 'Mumbai', airport: 'Chhatrapati Shivaji Maharaj' }, destination: { code: 'SIN', city: 'Singapore', airport: 'Changi Airport' }, duration: 330 },
    { origin: { code: 'DEL', city: 'New Delhi', airport: 'Indira Gandhi International' }, destination: { code: 'GOI', city: 'Goa', airport: 'Dabolim Airport' }, duration: 145 },
    { origin: { code: 'BOM', city: 'Mumbai', airport: 'Chhatrapati Shivaji Maharaj' }, destination: { code: 'JAI', city: 'Jaipur', airport: 'Jaipur International' }, duration: 95 },
    { origin: { code: 'HYD', city: 'Hyderabad', airport: 'Rajiv Gandhi International' }, destination: { code: 'BLR', city: 'Bangalore', airport: 'Kempegowda International' }, duration: 75 }
  ];

  const flights = [];
  let flightCounter = 1;

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);

    for (const route of routes) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const basePrice = 2000 + Math.floor(Math.random() * 8000);
      const departureHour = 6 + Math.floor(Math.random() * 16);
      
      const departureTime = new Date(date);
      departureTime.setHours(departureHour, Math.floor(Math.random() * 60), 0, 0);
      
      const arrivalTime = new Date(departureTime);
      arrivalTime.setMinutes(arrivalTime.getMinutes() + route.duration);

      flights.push({
        flightNumber: `${airline.code}${100 + flightCounter}`,
        airline: { code: airline.code, name: airline.name, logo: airline.logo },
        aircraft: { model: 'Airbus A320', manufacturer: 'Airbus', registration: `VT-${airline.code}${flightCounter}` },
        origin: route.origin,
        destination: route.destination,
        departureTime,
        arrivalTime,
        duration: route.duration,
        basePrice,
        currentPrice: basePrice,
        currency: 'INR',
        seatsAvailable: 50 + Math.floor(Math.random() * 100),
        totalSeats: 180,
        seatConfiguration: { economy: { total: 150, available: 120, price: basePrice }, business: { total: 30, available: 20, price: basePrice * 2.5 } },
        baggage: { cabin: { weight: 7, dimensions: '55x40x20 cm' }, checked: { weight: 15, pieces: 1 } },
        status: 'scheduled',
        stops: 0
      });

      flightCounter++;
      if (flights.length >= 50) break;
    }
    if (flights.length >= 50) break;
  }

  return flights;
};

// ========================================
// DESTINATIONS DATA
// ========================================
const destinations = [
  { name: 'Mumbai', country: 'India', city: 'Mumbai', airportCode: 'BOM', description: 'The financial capital of India', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f', attractions: ['Gateway of India', 'Marine Drive'], bestTimeToVisit: 'November to February', averageTemp: '27°C', currency: 'Indian Rupee (₹)', language: 'Hindi, Marathi', popularityScore: 98, featured: true },
  { name: 'Delhi', country: 'India', city: 'New Delhi', airportCode: 'DEL', description: 'India\'s capital territory', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5', attractions: ['Red Fort', 'India Gate'], bestTimeToVisit: 'October to March', averageTemp: '25°C', currency: 'Indian Rupee (₹)', language: 'Hindi, English', popularityScore: 97, featured: true },
  { name: 'Bangalore', country: 'India', city: 'Bengaluru', airportCode: 'BLR', description: 'The Silicon Valley of India', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2', attractions: ['Lalbagh', 'Cubbon Park'], bestTimeToVisit: 'October to February', averageTemp: '24°C', currency: 'Indian Rupee (₹)', language: 'Kannada, English', popularityScore: 92, featured: true },
  { name: 'Goa', country: 'India', city: 'Panaji', airportCode: 'GOI', description: 'India\'s beach paradise', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2', attractions: ['Baga Beach', 'Fort Aguada'], bestTimeToVisit: 'November to February', averageTemp: '28°C', currency: 'Indian Rupee (₹)', language: 'Konkani, English', popularityScore: 96, featured: true },
  { name: 'Jaipur', country: 'India', city: 'Jaipur', airportCode: 'JAI', description: 'The Pink City', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245', attractions: ['Hawa Mahal', 'Amber Fort'], bestTimeToVisit: 'October to March', averageTemp: '26°C', currency: 'Indian Rupee (₹)', language: 'Hindi, Rajasthani', popularityScore: 94, featured: true },
  { name: 'Kerala', country: 'India', city: 'Kochi', airportCode: 'COK', description: 'God\'s Own Country', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944', attractions: ['Backwaters', 'Munnar'], bestTimeToVisit: 'September to March', averageTemp: '28°C', currency: 'Indian Rupee (₹)', language: 'Malayalam', popularityScore: 95, featured: true },
  { name: 'Dubai', country: 'UAE', city: 'Dubai', airportCode: 'DXB', description: 'City of superlatives', image: 'https://images.unsplash.com/photo-1512453979798-5ea90b2009f4', attractions: ['Burj Khalifa', 'Palm Jumeirah'], bestTimeToVisit: 'November to March', averageTemp: '28°C', currency: 'UAE Dirham (AED)', language: 'Arabic, English', popularityScore: 96, featured: true },
  { name: 'Singapore', country: 'Singapore', city: 'Singapore', airportCode: 'SIN', description: 'A global financial hub', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd', attractions: ['Marina Bay Sands', 'Gardens by the Bay'], bestTimeToVisit: 'February to April', averageTemp: '27°C', currency: 'Singapore Dollar (SGD)', language: 'English, Mandarin', popularityScore: 94, featured: true },
  { name: 'Bangkok', country: 'Thailand', city: 'Bangkok', airportCode: 'BKK', description: 'Thailand\'s vibrant capital', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365', attractions: ['Grand Palace', 'Wat Arun'], bestTimeToVisit: 'November to February', averageTemp: '29°C', currency: 'Thai Baht (THB)', language: 'Thai, English', popularityScore: 93, featured: true },
  { name: 'London', country: 'United Kingdom', city: 'London', airportCode: 'LHR', description: 'World capital of culture', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad', attractions: ['Big Ben', 'Tower of London'], bestTimeToVisit: 'March to May', averageTemp: '14°C', currency: 'British Pound (£)', language: 'English', popularityScore: 97, featured: true }
];

// ========================================
// MASTER SEED FUNCTION
// ========================================
const masterSeed = async () => {
  console.log('═'.repeat(60));
  console.log('🚀 DESTINOVA DATABASE SEEDING');
  console.log('═'.repeat(60));
  
  try {
    await connectDatabase();
    console.log('✅ Database connected\n');

    // Seed Users
    console.log('─'.repeat(40));
    console.log('👤 Seeding Users...');
    await User.deleteMany();
    const users = await createUsers();
    const insertedUsers = await User.insertMany(users);
    console.log(`   ✅ Created ${insertedUsers.length} users`);
    console.log(`      Admin: admin@destinova.com / Admin@123`);
    console.log(`      Users: [email]@email.com / User@123\n`);

    // Seed Destinations
    console.log('─'.repeat(40));
    console.log('🌍 Seeding Destinations...');
    await Destination.deleteMany();
    const insertedDestinations = await Destination.insertMany(destinations);
    console.log(`   ✅ Created ${insertedDestinations.length} destinations\n`);

    // Seed Flights
    console.log('─'.repeat(40));
    console.log('✈️  Seeding Flights...');
    await Flight.deleteMany();
    const flights = createFlights();
    const insertedFlights = await Flight.insertMany(flights);
    console.log(`   ✅ Created ${insertedFlights.length} flights\n`);

    // Summary
    console.log('═'.repeat(60));
    console.log('📊 SEEDING SUMMARY');
    console.log('═'.repeat(60));
    console.log(`   👤 Users:        ${insertedUsers.length}`);
    console.log(`   🌍 Destinations: ${insertedDestinations.length}`);
    console.log(`   ✈️  Flights:      ${insertedFlights.length}`);
    console.log('═'.repeat(60));
    console.log('🎉 Database seeding completed successfully!');
    console.log('═'.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

masterSeed();
