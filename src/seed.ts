import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Flight } from './models/Flight.js';
import { config } from './config/env.js';

/**
 * Seed database with sample data
 * Run: npm run seed
 */

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    await mongoose.connect(config.databaseUrl);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - remove in production)
    await User.deleteMany({});
    await Flight.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@destinova.com',
      password: 'admin123456',
      role: 'admin',
      status: 'active',
      emailVerified: true
    });
    await adminUser.save();
    console.log('✅ Admin user created: admin@destinova.com / admin123456');

    // Create Test Customer
    const testUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '+1234567890',
      role: 'customer',
      status: 'active',
      emailVerified: true
    });
    await testUser.save();
    console.log('✅ Test user created: john@example.com / password123');

    // Create Sample Flights
    const flights = [
      {
        flightNumber: 'AI101',
        airline: { name: 'Air India', code: 'AI', logo: '/images/airlines/air-india.png' },
        departure: {
          airport: 'Indira Gandhi International Airport',
          airportCode: 'DEL',
          city: 'New Delhi',
          country: 'India',
          terminal: '3',
          scheduledTime: new Date('2025-12-01T08:00:00Z')
        },
        arrival: {
          airport: 'Chhatrapati Shivaji Maharaj International Airport',
          airportCode: 'BOM',
          city: 'Mumbai',
          country: 'India',
          terminal: '2',
          scheduledTime: new Date('2025-12-01T10:30:00Z')
        },
        aircraft: { model: 'Boeing 787' },
        duration: 150,
        distance: 1400,
        status: 'scheduled',
        pricing: {
          economy: { price: 5000, available: 150, total: 180 },
          business: { price: 15000, available: 20, total: 24 },
          firstClass: { price: 30000, available: 8, total: 12 }
        },
        amenities: ['WiFi', 'Entertainment', 'Meals', 'USB Charging'],
        baggage: { cabin: '7kg', checked: '23kg' },
        isActive: true
      },
      {
        flightNumber: 'SG202',
        airline: { name: 'SpiceJet', code: 'SG', logo: '/images/airlines/spicejet.png' },
        departure: {
          airport: 'Kempegowda International Airport',
          airportCode: 'BLR',
          city: 'Bangalore',
          country: 'India',
          terminal: '1',
          scheduledTime: new Date('2025-12-01T14:00:00Z')
        },
        arrival: {
          airport: 'Rajiv Gandhi International Airport',
          airportCode: 'HYD',
          city: 'Hyderabad',
          country: 'India',
          terminal: '1',
          scheduledTime: new Date('2025-12-01T15:30:00Z')
        },
        aircraft: { model: 'Boeing 737' },
        duration: 90,
        distance: 575,
        status: 'scheduled',
        pricing: {
          economy: { price: 3500, available: 160, total: 180 },
          business: { price: 12000, available: 18, total: 20 },
          firstClass: { price: 25000, available: 0, total: 0 }
        },
        amenities: ['WiFi', 'Snacks'],
        baggage: { cabin: '7kg', checked: '15kg' },
        isActive: true
      },
      {
        flightNumber: 'EK303',
        airline: { name: 'Emirates', code: 'EK', logo: '/images/airlines/emirates.png' },
        departure: {
          airport: 'Dubai International Airport',
          airportCode: 'DXB',
          city: 'Dubai',
          country: 'UAE',
          terminal: '3',
          scheduledTime: new Date('2025-12-02T02:00:00Z')
        },
        arrival: {
          airport: 'John F. Kennedy International Airport',
          airportCode: 'JFK',
          city: 'New York',
          country: 'USA',
          terminal: '4',
          scheduledTime: new Date('2025-12-02T10:00:00Z')
        },
        aircraft: { model: 'Airbus A380' },
        duration: 840,
        distance: 11000,
        status: 'scheduled',
        pricing: {
          economy: { price: 45000, available: 300, total: 350 },
          business: { price: 150000, available: 70, total: 76 },
          firstClass: { price: 300000, available: 10, total: 14 }
        },
        amenities: ['WiFi', 'Entertainment', 'Luxury Meals', 'USB Charging', 'Lie-flat Seats'],
        baggage: { cabin: '7kg', checked: '30kg' },
        isActive: true
      },
      {
        flightNumber: '6E404',
        airline: { name: 'IndiGo', code: '6E', logo: '/images/airlines/indigo.png' },
        departure: {
          airport: 'Netaji Subhas Chandra Bose International Airport',
          airportCode: 'CCU',
          city: 'Kolkata',
          country: 'India',
          terminal: '2',
          scheduledTime: new Date('2025-12-03T06:30:00Z')
        },
        arrival: {
          airport: 'Indira Gandhi International Airport',
          airportCode: 'DEL',
          city: 'New Delhi',
          country: 'India',
          terminal: '1',
          scheduledTime: new Date('2025-12-03T09:00:00Z')
        },
        aircraft: { model: 'Airbus A320' },
        duration: 150,
        distance: 1350,
        status: 'scheduled',
        pricing: {
          economy: { price: 4500, available: 170, total: 180 },
          business: { price: 14000, available: 18, total: 20 },
          firstClass: { price: 0, available: 0, total: 0 }
        },
        amenities: ['WiFi', 'Snacks', 'Entertainment'],
        baggage: { cabin: '7kg', checked: '15kg' },
        isActive: true
      },
      {
        flightNumber: 'BA505',
        airline: { name: 'British Airways', code: 'BA', logo: '/images/airlines/british-airways.png' },
        departure: {
          airport: 'Heathrow Airport',
          airportCode: 'LHR',
          city: 'London',
          country: 'UK',
          terminal: '5',
          scheduledTime: new Date('2025-12-04T09:00:00Z')
        },
        arrival: {
          airport: 'Chhatrapati Shivaji Maharaj International Airport',
          airportCode: 'BOM',
          city: 'Mumbai',
          country: 'India',
          terminal: '2',
          scheduledTime: new Date('2025-12-04T22:00:00Z')
        },
        aircraft: { model: 'Boeing 777' },
        duration: 540,
        distance: 7200,
        status: 'scheduled',
        pricing: {
          economy: { price: 35000, available: 220, total: 250 },
          business: { price: 120000, available: 45, total: 48 },
          firstClass: { price: 250000, available: 8, total: 12 }
        },
        amenities: ['WiFi', 'Entertainment', 'Premium Meals', 'USB Charging', 'Lie-flat Seats'],
        baggage: { cabin: '7kg', checked: '23kg' },
        isActive: true
      }
    ];

    await Flight.insertMany(flights);
    console.log(`✅ Created ${flights.length} sample flights`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('   Admin: admin@destinova.com / admin123456');
    console.log('   User:  john@example.com / password123');
    console.log('\n✈️  Sample Flights:');
    flights.forEach(f => {
      console.log(`   ${f.flightNumber}: ${f.departure.city} → ${f.arrival.city}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
