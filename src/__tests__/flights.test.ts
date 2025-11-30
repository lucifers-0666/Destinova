import request from 'supertest';
import { app } from '../app.js';
import { Flight } from '../models/Flight.js';
import { createTestUser, generateAuthToken } from './setup.js';

describe('Flights API', () => {
  // Sample flight data for testing
  const sampleFlight = {
    flightNumber: 'DN-101',
    airline: {
      name: 'Destinova Air',
      code: 'DN',
      logo: '/images/airlines/dn.png'
    },
    aircraft: {
      type: 'Boeing',
      model: '737-800'
    },
    origin: {
      airportCode: 'DEL',
      airportName: 'Indira Gandhi International Airport',
      city: 'Delhi',
      country: 'India',
      terminal: 'T3'
    },
    destination: {
      airportCode: 'BOM',
      airportName: 'Chhatrapati Shivaji International Airport',
      city: 'Mumbai',
      country: 'India',
      terminal: 'T2'
    },
    departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    arrivalTime: new Date(Date.now() + 26 * 60 * 60 * 1000), // Tomorrow + 2h
    duration: 120,
    basePrice: 5000,
    currentPrice: 5500,
    currency: 'INR',
    taxAmount: 500,
    totalSeats: 180,
    availableSeats: 150,
    bookedSeats: 30,
    seatConfiguration: {
      economy: 150,
      business: 24,
      firstClass: 6
    },
    prices: {
      economy: 5500,
      business: 15000,
      firstClass: 30000
    },
    amenities: ['WiFi', 'Meals', 'Entertainment'],
    mealOptions: ['Veg', 'Non-Veg'],
    entertainmentOptions: ['Movies', 'Music'],
    wifiAvailable: true,
    powerOutlets: true,
    status: 'scheduled',
    stops: 0,
    layovers: [],
    isDirectFlight: true,
    isInternational: false,
    baggage: {
      checkedBaggage: { pieces: 1, weightPerPiece: 23, unit: 'kg' },
      cabinBaggage: { pieces: 1, weightPerPiece: 7, unit: 'kg' }
    },
    priceHistory: [],
    flightType: 'domestic',
    operatingDays: [0, 1, 2, 3, 4, 5, 6],
    isRecurring: false,
    bookingOpenDate: new Date(),
    bookingCloseTime: 2,
    cancellationAllowed: true,
    cancellationFee: 500,
    refundable: true,
    changeAllowed: true,
    changeFee: 300,
    averageRating: 4.5,
    totalReviews: 100,
    onTimePerformance: 95,
    isActive: true,
    isFeatured: true,
    tags: ['popular', 'business-friendly']
  };

  beforeEach(async () => {
    // Clear flights collection
    await Flight.deleteMany({});
  });

  describe('GET /api/flights', () => {
    it('should return all active flights', async () => {
      await Flight.create(sampleFlight as any);

      const response = await request(app)
        .get('/api/flights')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return empty array when no flights exist', async () => {
      const response = await request(app)
        .get('/api/flights')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/flights/search', () => {
    beforeEach(async () => {
      await Flight.create(sampleFlight as any);
    });

    it('should search flights by origin and destination', async () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const dateStr = tomorrow.toISOString().split('T')[0];

      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'DEL',
          destination: 'BOM',
          date: dateStr,
          passengers: 1
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter by available seats', async () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const dateStr = tomorrow.toISOString().split('T')[0];

      const response = await request(app)
        .get('/api/flights/search')
        .query({
          origin: 'DEL',
          destination: 'BOM',
          date: dateStr,
          passengers: 200 // More than available seats
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should return error for invalid search parameters', async () => {
      const response = await request(app)
        .get('/api/flights/search')
        .query({}) // Missing required params
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/flights/:id', () => {
    it('should return flight by ID', async () => {
      const flight: any = await Flight.create(sampleFlight as any);

      const response = await request(app)
        .get(`/api/flights/${flight._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.flightNumber).toBe(sampleFlight.flightNumber);
    });

    it('should return 404 for non-existent flight', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/flights/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return error for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/flights/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/flights/popular-routes', () => {
    it('should return popular routes', async () => {
      await Flight.create(sampleFlight as any);

      const response = await request(app)
        .get('/api/flights/popular-routes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Admin Flight Operations', () => {
    let adminToken: string;

    beforeEach(async () => {
      const admin = await createTestUser({ role: 'admin' });
      adminToken = await generateAuthToken(admin);
    });

    it('should create flight when admin', async () => {
      const newFlight = {
        ...sampleFlight,
        flightNumber: 'DN-102'
      };

      const response = await request(app)
        .post('/api/flights')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newFlight)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.flightNumber).toBe('DN-102');
    });

    it('should reject flight creation without admin token', async () => {
      const user = await createTestUser({ role: 'user' });
      const userToken = await generateAuthToken(user);

      const response = await request(app)
        .post('/api/flights')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleFlight)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it('should update flight when admin', async () => {
      const flight: any = await Flight.create(sampleFlight as any);

      const response = await request(app)
        .put(`/api/flights/${flight._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ currentPrice: 6000 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.currentPrice).toBe(6000);
    });

    it('should delete flight when admin', async () => {
      const flight: any = await Flight.create(sampleFlight as any);

      const response = await request(app)
        .delete(`/api/flights/${flight._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify deletion
      const deletedFlight = await Flight.findById(flight._id);
      expect(deletedFlight).toBeNull();
    });
  });
});
