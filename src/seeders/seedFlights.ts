import dotenv from 'dotenv';
import { Flight, IFlight } from '../models/Flight.js';
import { connectDatabase, disconnectDatabase } from '../config/db.js';

dotenv.config();

// Airline data
const airlines = [
  { name: 'Air India', code: 'AI', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Air_India_Logo.svg/1200px-Air_India_Logo.svg.png' },
  { name: 'IndiGo', code: '6E', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/IndiGo_Logo.svg/1200px-IndiGo_Logo.svg.png' },
  { name: 'SpiceJet', code: 'SG', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/SpiceJet_logo.svg/1200px-SpiceJet_logo.svg.png' },
  { name: 'Vistara', code: 'UK', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Vistara_Logo.svg/1200px-Vistara_Logo.svg.png' },
  { name: 'Emirates', code: 'EK', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png' },
  { name: 'Singapore Airlines', code: 'SQ', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/1200px-Singapore_Airlines_Logo_2.svg.png' },
  { name: 'Thai Airways', code: 'TG', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ec/Thai_Airways_Logo.svg/1200px-Thai_Airways_Logo.svg.png' },
  { name: 'Qatar Airways', code: 'QR', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Qatar_Airways_logo.svg/1200px-Qatar_Airways_logo.svg.png' }
];

// Airport data
const airports = {
  // Indian Airports
  DEL: { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', terminal: 'T3' },
  BOM: { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', terminal: 'T2' },
  BLR: { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India', terminal: 'T1' },
  MAA: { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai', country: 'India', terminal: 'T1' },
  CCU: { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India', terminal: 'T2' },
  HYD: { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', terminal: 'T1' },
  GOI: { code: 'GOI', name: 'Goa International Airport', city: 'Goa', country: 'India', terminal: 'T1' },
  JAI: { code: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', country: 'India', terminal: 'T1' },
  COK: { code: 'COK', name: 'Cochin International Airport', city: 'Kochi', country: 'India', terminal: 'T3' },
  AMD: { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India', terminal: 'T1' },
  PNQ: { code: 'PNQ', name: 'Pune International Airport', city: 'Pune', country: 'India', terminal: 'T1' },
  
  // International Airports
  DXB: { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', terminal: 'T3' },
  SIN: { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', terminal: 'T3' },
  BKK: { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', terminal: 'Main' },
  LHR: { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', terminal: 'T5' },
  JFK: { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', terminal: 'T4' },
  CDG: { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', terminal: '2E' },
  DOH: { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', terminal: 'Main' },
  KUL: { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', terminal: 'KLIA' }
};

// Aircraft types
const aircraftTypes = [
  { type: 'Narrow Body', model: 'Airbus A320neo' },
  { type: 'Narrow Body', model: 'Airbus A321neo' },
  { type: 'Narrow Body', model: 'Boeing 737-800' },
  { type: 'Narrow Body', model: 'Boeing 737 MAX 8' },
  { type: 'Wide Body', model: 'Boeing 777-300ER' },
  { type: 'Wide Body', model: 'Boeing 787-9 Dreamliner' },
  { type: 'Wide Body', model: 'Airbus A350-900' },
  { type: 'Wide Body', model: 'Airbus A380-800' }
];

// Routes configuration
const routes = [
  // Domestic Routes
  { origin: 'DEL', destination: 'BOM', duration: 135, basePrice: 4500, domestic: true },
  { origin: 'BOM', destination: 'DEL', duration: 140, basePrice: 4500, domestic: true },
  { origin: 'DEL', destination: 'BLR', duration: 165, basePrice: 5200, domestic: true },
  { origin: 'BLR', destination: 'DEL', duration: 170, basePrice: 5200, domestic: true },
  { origin: 'BOM', destination: 'BLR', duration: 90, basePrice: 3800, domestic: true },
  { origin: 'BLR', destination: 'BOM', duration: 95, basePrice: 3800, domestic: true },
  { origin: 'DEL', destination: 'MAA', duration: 170, basePrice: 5500, domestic: true },
  { origin: 'MAA', destination: 'DEL', duration: 175, basePrice: 5500, domestic: true },
  { origin: 'DEL', destination: 'CCU', duration: 140, basePrice: 4800, domestic: true },
  { origin: 'CCU', destination: 'DEL', duration: 145, basePrice: 4800, domestic: true },
  { origin: 'BOM', destination: 'HYD', duration: 85, basePrice: 3200, domestic: true },
  { origin: 'HYD', destination: 'BOM', duration: 90, basePrice: 3200, domestic: true },
  { origin: 'BOM', destination: 'GOI', duration: 70, basePrice: 2800, domestic: true },
  { origin: 'GOI', destination: 'BOM', duration: 75, basePrice: 2800, domestic: true },
  { origin: 'DEL', destination: 'JAI', duration: 55, basePrice: 2200, domestic: true },
  { origin: 'JAI', destination: 'DEL', duration: 60, basePrice: 2200, domestic: true },
  { origin: 'BLR', destination: 'COK', duration: 65, basePrice: 2500, domestic: true },
  { origin: 'COK', destination: 'BLR', duration: 70, basePrice: 2500, domestic: true },
  { origin: 'DEL', destination: 'AMD', duration: 90, basePrice: 3000, domestic: true },
  { origin: 'AMD', destination: 'DEL', duration: 95, basePrice: 3000, domestic: true },
  { origin: 'BLR', destination: 'HYD', duration: 75, basePrice: 2800, domestic: true },
  { origin: 'HYD', destination: 'BLR', duration: 80, basePrice: 2800, domestic: true },
  { origin: 'BOM', destination: 'PNQ', duration: 45, basePrice: 1800, domestic: true },
  { origin: 'PNQ', destination: 'BOM', duration: 50, basePrice: 1800, domestic: true },
  
  // International Routes
  { origin: 'DEL', destination: 'DXB', duration: 210, basePrice: 15000, domestic: false },
  { origin: 'DXB', destination: 'DEL', duration: 220, basePrice: 15000, domestic: false },
  { origin: 'BOM', destination: 'DXB', duration: 180, basePrice: 14000, domestic: false },
  { origin: 'DXB', destination: 'BOM', duration: 190, basePrice: 14000, domestic: false },
  { origin: 'DEL', destination: 'SIN', duration: 330, basePrice: 22000, domestic: false },
  { origin: 'SIN', destination: 'DEL', duration: 340, basePrice: 22000, domestic: false },
  { origin: 'BOM', destination: 'SIN', duration: 300, basePrice: 20000, domestic: false },
  { origin: 'SIN', destination: 'BOM', duration: 310, basePrice: 20000, domestic: false },
  { origin: 'DEL', destination: 'BKK', duration: 240, basePrice: 18000, domestic: false },
  { origin: 'BKK', destination: 'DEL', duration: 250, basePrice: 18000, domestic: false },
  { origin: 'BLR', destination: 'SIN', duration: 270, basePrice: 18000, domestic: false },
  { origin: 'SIN', destination: 'BLR', duration: 280, basePrice: 18000, domestic: false },
  { origin: 'DEL', destination: 'LHR', duration: 540, basePrice: 45000, domestic: false },
  { origin: 'LHR', destination: 'DEL', duration: 510, basePrice: 45000, domestic: false },
  { origin: 'BOM', destination: 'LHR', duration: 570, basePrice: 48000, domestic: false },
  { origin: 'LHR', destination: 'BOM', duration: 540, basePrice: 48000, domestic: false },
  { origin: 'DEL', destination: 'JFK', duration: 900, basePrice: 65000, domestic: false },
  { origin: 'JFK', destination: 'DEL', duration: 840, basePrice: 65000, domestic: false },
  { origin: 'BOM', destination: 'DOH', duration: 210, basePrice: 16000, domestic: false },
  { origin: 'DOH', destination: 'BOM', duration: 220, basePrice: 16000, domestic: false },
  { origin: 'MAA', destination: 'SIN', duration: 240, basePrice: 16000, domestic: false },
  { origin: 'SIN', destination: 'MAA', duration: 250, basePrice: 16000, domestic: false },
  { origin: 'DEL', destination: 'CDG', duration: 510, basePrice: 42000, domestic: false },
  { origin: 'CDG', destination: 'DEL', duration: 480, basePrice: 42000, domestic: false },
  { origin: 'BLR', destination: 'DXB', duration: 240, basePrice: 14500, domestic: false },
  { origin: 'DXB', destination: 'BLR', duration: 250, basePrice: 14500, domestic: false },
  { origin: 'HYD', destination: 'DXB', duration: 240, basePrice: 13500, domestic: false },
  { origin: 'DXB', destination: 'HYD', duration: 250, basePrice: 13500, domestic: false },
  { origin: 'COK', destination: 'DXB', duration: 240, basePrice: 12000, domestic: false },
  { origin: 'DXB', destination: 'COK', duration: 250, basePrice: 12000, domestic: false },
  { origin: 'DEL', destination: 'KUL', duration: 330, basePrice: 19000, domestic: false },
  { origin: 'KUL', destination: 'DEL', duration: 340, basePrice: 19000, domestic: false }
];

// Amenities by airline type
const amenitiesByAirline = {
  budget: ['wifi'],
  standard: ['wifi', 'meals', 'entertainment'],
  premium: ['wifi', 'meals', 'entertainment', 'power-outlets', 'extra-legroom'],
  luxury: ['wifi', 'meals', 'entertainment', 'power-outlets', 'extra-legroom', 'lounge-access', 'priority-boarding', 'blanket', 'pillow']
};

// Meal options
const mealOptions = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Hindu Meal', 'Muslim Meal', 'Diabetic Meal'];

// Entertainment options
const entertainmentOptions = ['Movies', 'TV Shows', 'Music', 'Games', 'News', 'Live TV'];

// Helper functions
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const generateFlightNumber = (airlineCode: string, index: number): string => {
  const num = String(100 + index + getRandomNumber(1, 899)).padStart(3, '0');
  return `${airlineCode}-${num}`;
};

const getAirlineType = (airlineCode: string): 'budget' | 'standard' | 'premium' | 'luxury' => {
  const budgetAirlines = ['6E', 'SG'];
  const luxuryAirlines = ['EK', 'SQ', 'QR'];
  const premiumAirlines = ['UK', 'TG'];
  
  if (budgetAirlines.includes(airlineCode)) return 'budget';
  if (luxuryAirlines.includes(airlineCode)) return 'luxury';
  if (premiumAirlines.includes(airlineCode)) return 'premium';
  return 'standard';
};

const generateDepartureTime = (baseDate: Date, slotIndex: number): Date => {
  const slots = [
    { start: 6, end: 9 },    // Morning
    { start: 10, end: 13 },  // Late Morning
    { start: 14, end: 17 },  // Afternoon
    { start: 18, end: 21 },  // Evening
    { start: 22, end: 23 }   // Night
  ];
  
  const slot = slots[slotIndex % slots.length]!;
  const hour = getRandomNumber(slot.start, slot.end);
  const minute = getRandomNumber(0, 3) * 15; // 0, 15, 30, or 45
  
  const date = new Date(baseDate);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const generateFlights = (): Partial<IFlight>[] => {
  const flights: Partial<IFlight>[] = [];
  const baseDate = new Date();
  let flightIndex = 0;
  
  // Generate flights for the next 30 days
  for (let dayOffset = 1; dayOffset <= 30; dayOffset++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + dayOffset);
    
    // Select routes for this day (cycle through routes)
    const routesToday = routes.slice((dayOffset - 1) % routes.length, ((dayOffset - 1) % routes.length) + 5);
    
    routesToday.forEach((route, routeIndex) => {
      // Select airline based on route type
      const availableAirlines = route.domestic 
        ? airlines.filter(a => ['AI', '6E', 'SG', 'UK'].includes(a.code))
        : airlines;
      
      const airline = getRandomElement(availableAirlines);
      const airlineType = getAirlineType(airline.code);
      const aircraft = route.domestic 
        ? getRandomElement(aircraftTypes.filter(a => a.type === 'Narrow Body'))
        : getRandomElement(aircraftTypes);
      
      const departureTime = generateDepartureTime(date, routeIndex);
      const arrivalTime = new Date(departureTime.getTime() + route.duration * 60 * 1000);
      
      // Price variation based on time of day and demand
      const timeMultiplier = departureTime.getHours() >= 6 && departureTime.getHours() <= 9 ? 1.2 : 
                            departureTime.getHours() >= 18 && departureTime.getHours() <= 21 ? 1.15 : 1;
      const demandMultiplier = dayOffset <= 7 ? 1.1 : dayOffset <= 14 ? 1 : 0.95;
      const basePrice = Math.round(route.basePrice * timeMultiplier * demandMultiplier);
      
      // Seat configuration based on aircraft
      const isWidebody = aircraft.type === 'Wide Body';
      const seatConfig = isWidebody 
        ? { economy: 280, business: 42, firstClass: 8 }
        : { economy: 150, business: 12, firstClass: 0 };
      
      const totalSeats = seatConfig.economy + seatConfig.business + seatConfig.firstClass;
      const bookedSeats = getRandomNumber(Math.floor(totalSeats * 0.3), Math.floor(totalSeats * 0.8));
      
      const origin = airports[route.origin as keyof typeof airports]!;
      const destination = airports[route.destination as keyof typeof airports]!;
      
      const flight: Partial<IFlight> = {
        flightNumber: generateFlightNumber(airline.code, flightIndex++),
        airline: {
          name: airline.name,
          code: airline.code,
          logo: airline.logo
        },
        aircraft: {
          type: aircraft.type,
          model: aircraft.model,
          registration: `VT-${String.fromCharCode(65 + getRandomNumber(0, 25))}${String.fromCharCode(65 + getRandomNumber(0, 25))}${String.fromCharCode(65 + getRandomNumber(0, 25))}`
        },
        origin: {
          airportCode: origin.code,
          airportName: origin.name,
          city: origin.city,
          country: origin.country,
          terminal: origin.terminal
        },
        destination: {
          airportCode: destination.code,
          airportName: destination.name,
          city: destination.city,
          country: destination.country,
          terminal: destination.terminal
        },
        departureTime,
        arrivalTime,
        duration: route.duration,
        basePrice,
        currentPrice: basePrice,
        currency: 'INR',
        taxAmount: Math.round(basePrice * 0.12),
        totalSeats,
        availableSeats: totalSeats - bookedSeats,
        bookedSeats,
        seatConfiguration: seatConfig,
        prices: {
          economy: basePrice,
          business: Math.round(basePrice * 2.5),
          firstClass: Math.round(basePrice * 5)
        },
        amenities: amenitiesByAirline[airlineType] as ('wifi' | 'meals' | 'entertainment' | 'power-outlets' | 'blanket' | 'pillow' | 'lounge-access' | 'priority-boarding' | 'extra-legroom')[],
        mealOptions: airlineType !== 'budget' ? mealOptions.slice(0, getRandomNumber(3, 7)) : [],
        entertainmentOptions: airlineType !== 'budget' ? entertainmentOptions.slice(0, getRandomNumber(3, 6)) : [],
        wifiAvailable: true,
        powerOutlets: airlineType !== 'budget',
        status: 'scheduled',
        stops: 0,
        layovers: [],
        isDirectFlight: true,
        isInternational: !route.domestic,
        baggage: {
          checkedBaggage: {
            pieces: airlineType === 'budget' ? 1 : 2,
            weightPerPiece: airlineType === 'budget' ? 15 : 23,
            unit: 'kg' as const
          },
          cabinBaggage: {
            pieces: 1,
            weightPerPiece: 7,
            unit: 'kg' as const
          }
        },
        priceHistory: [{
          price: basePrice,
          timestamp: new Date(),
          reason: 'Initial price'
        }],
        flightType: route.domestic ? 'domestic' : 'international',
        operatingDays: [0, 1, 2, 3, 4, 5, 6],
        isRecurring: true,
        bookingOpenDate: new Date(),
        bookingCloseTime: 2,
        cancellationAllowed: true,
        cancellationFee: Math.round(basePrice * 0.15),
        refundable: true,
        changeAllowed: true,
        changeFee: Math.round(basePrice * 0.1),
        averageRating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        totalReviews: getRandomNumber(50, 500),
        onTimePerformance: getRandomNumber(75, 98),
        isActive: true,
        isFeatured: getRandomNumber(1, 10) <= 2,
        tags: route.domestic 
          ? ['domestic', 'popular', origin.city.toLowerCase(), destination.city.toLowerCase()]
          : ['international', 'long-haul', origin.city.toLowerCase(), destination.city.toLowerCase()]
      };
      
      flights.push(flight);
    });
  }
  
  return flights;
};

const seedFlights = async (): Promise<void> => {
  try {
    console.log('🚀 Starting flight seeder...');
    
    await connectDatabase();
    
    // Clear existing flights
    await Flight.deleteMany({});
    console.log('🗑️  Cleared existing flights');
    
    // Generate and insert flights
    const flights = generateFlights();
    console.log(`📝 Generated ${flights.length} flights`);
    
    // Insert in batches
    const batchSize = 50;
    let inserted = 0;
    
    for (let i = 0; i < flights.length; i += batchSize) {
      const batch = flights.slice(i, i + batchSize);
      await Flight.insertMany(batch, { ordered: false });
      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${flights.length} flights`);
    }
    
    // Summary
    const stats = await Flight.aggregate([
      {
        $group: {
          _id: '$flightType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$currentPrice' }
        }
      }
    ]);
    
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    FLIGHT SEEDING COMPLETE                     ║');
    console.log('╠════════════════════════════════════════════════════════════════╣');
    console.log(`║  ✅ Total Flights: ${String(flights.length).padEnd(43)}║`);
    stats.forEach(stat => {
      console.log(`║  📊 ${stat._id}: ${stat.count} flights (Avg: ₹${Math.round(stat.avgPrice)})`.padEnd(65) + '║');
    });
    console.log('╚════════════════════════════════════════════════════════════════╝');
    
    await disconnectDatabase();
    console.log('');
    console.log('✅ Flight seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding flights:', error);
    process.exit(1);
  }
};

seedFlights();
