import request from 'supertest';
import { app } from '../app.js';
import { Booking } from '../models/Booking.js';
import { Flight } from '../models/Flight.js';
import { User } from '../models/User.js';
import { createTestUser, generateAuthToken } from './setup.js';

describe('Bookings API', () => {
  let testUser: InstanceType<typeof User>;
  let authToken: string;
  let testFlight: InstanceType<typeof Flight>;

  // Sample flight for booking tests
  const sampleFlight = {
    flightNumber: 'DN-201',
    airline: { name: 'Destinova Air', code: 'DN' },
    aircraft: { type: 'Boeing', model: '737-800' },
    origin: {
      airportCode: 'DEL',
      airportName: 'Indira Gandhi International Airport',
      city: 'Delhi',
      country: 'India'
    },
    destination: {
      airportCode: 'BOM',
      airportName: 'Chhatrapati Shivaji International Airport',
      city: 'Mumbai',
      country: 'India'
    },
    departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    arrivalTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
    duration: 120,
    basePrice: 5000,
    currentPrice: 5500,
    currency: 'INR',
    taxAmount: 500,
    totalSeats: 180,
    availableSeats: 150,
    bookedSeats: 30,
    seatConfiguration: { economy: 150, business: 24, firstClass: 6 },
    prices: { economy: 5500, business: 15000, firstClass: 30000 },
    status: 'scheduled',
    stops: 0,
    isDirectFlight: true,
    isInternational: false,
    baggage: {
      checkedBaggage: { pieces: 1, weightPerPiece: 23, unit: 'kg' as const },
      cabinBaggage: { pieces: 1, weightPerPiece: 7, unit: 'kg' as const }
    },
    flightType: 'domestic',
    operatingDays: [0, 1, 2, 3, 4, 5, 6],
    bookingOpenDate: new Date(),
    bookingCloseTime: 2,
    cancellationAllowed: true,
    cancellationFee: 500,
    refundable: true,
    isActive: true
  };

  beforeEach(async () => {
    // Create test user and get token
    testUser = await createTestUser();
    authToken = await generateAuthToken(testUser);

    // Create test flight
    testFlight = await Flight.create(sampleFlight as any) as any;
  });

  describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
      const bookingData = {
        flightId: testFlight._id.toString(),
        travelDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        passengers: [
          {
            firstName: 'John',
            lastName: 'Doe',
            age: 30,
            gender: 'male',
            email: 'john@example.com',
            seatClass: 'economy',
            isLeadPassenger: true
          }
        ],
        totalPassengers: 1,
        adults: 1,
        children: 0,
        infants: 0,
        contactDetails: {
          email: 'john@example.com',
          phone: '+919876543210'
        },
        seatClass: 'economy'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookingReference).toBeDefined();
      expect(response.body.data.passengers.length).toBe(1);
    });

    it('should return error when not authenticated', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({})
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return error for invalid flight ID', async () => {
      const bookingData = {
        flightId: '507f1f77bcf86cd799439011', // Non-existent
        travelDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        passengers: [
          {
            firstName: 'John',
            lastName: 'Doe',
            age: 30,
            gender: 'male',
            isLeadPassenger: true
          }
        ],
        totalPassengers: 1,
        adults: 1,
        contactDetails: {
          email: 'john@example.com',
          phone: '+919876543210'
        }
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookingData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return error for past travel date', async () => {
      const bookingData = {
        flightId: testFlight._id.toString(),
        travelDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        passengers: [
          {
            firstName: 'John',
            lastName: 'Doe',
            age: 30,
            gender: 'male',
            isLeadPassenger: true
          }
        ],
        totalPassengers: 1,
        adults: 1,
        contactDetails: {
          email: 'john@example.com',
          phone: '+919876543210'
        }
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(bookingData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings', () => {
    beforeEach(async () => {
      // Create a test booking
      await Booking.create({
        bookingReference: 'TEST123',
        pnr: 'PNR123',
        user: testUser._id,
        bookingType: 'flight',
        flight: testFlight._id,
        travelDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        passengers: [
          {
            firstName: 'John',
            lastName: 'Doe',
            age: 30,
            gender: 'male',
            seatClass: 'economy',
            isLeadPassenger: true
          }
        ],
        totalPassengers: 1,
        adults: 1,
        children: 0,
        infants: 0,
        contactDetails: {
          email: 'john@example.com',
          phone: '+919876543210'
        },
        priceBreakdown: {
          baseFare: 5500,
          taxes: 660,
          serviceFee: 0,
          seatCharges: 0,
          mealCharges: 0,
          baggageCharges: 0,
          insuranceCharges: 0,
          convenienceFee: 0,
          discount: 0,
          promoDiscount: 0,
          total: 6160
        },
        totalAmount: 6160,
        bookingStatus: 'confirmed',
        bookingDate: new Date(),
        insuranceOpted: false
      });
    });

    it('should return user bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return error when not authenticated', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings/:id', () => {
    let testBooking: InstanceType<typeof Booking>;

    beforeEach(async () => {
      testBooking = await Booking.create({
        bookingReference: 'TEST456',
        pnr: 'PNR456',
        user: testUser._id,
        bookingType: 'flight',
        flight: testFlight._id,
        travelDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        passengers: [
          {
            firstName: 'Jane',
            lastName: 'Doe',
            age: 28,
            gender: 'female',
            seatClass: 'economy',
            isLeadPassenger: true
          }
        ],
        totalPassengers: 1,
        adults: 1,
        children: 0,
        infants: 0,
        contactDetails: {
          email: 'jane@example.com',
          phone: '+919876543210'
        },
        priceBreakdown: {
          baseFare: 5500,
          taxes: 660,
          serviceFee: 0,
          seatCharges: 0,
          mealCharges: 0,
          baggageCharges: 0,
          insuranceCharges: 0,
          convenienceFee: 0,
          discount: 0,
          promoDiscount: 0,
          total: 6160
        },
        totalAmount: 6160,
        bookingStatus: 'confirmed',
        bookingDate: new Date(),
        insuranceOpted: false
      });
    });

    it('should return booking by ID', async () => {
      const response = await request(app)
        .get(`/api/bookings/${testBooking._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookingReference).toBe('TEST456');
    });

    it('should return 404 for non-existent booking', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/bookings/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/bookings/:id/cancel', () => {
    let testBooking: InstanceType<typeof Booking>;

    beforeEach(async () => {
      testBooking = await Booking.create({
        bookingReference: 'CANCEL789',
        pnr: 'PNR789',
        user: testUser._id,
        bookingType: 'flight',
        flight: testFlight._id,
        travelDate: new Date(Date.now() + 72 * 60 * 60 * 1000), // 3 days from now
        passengers: [
          {
            firstName: 'Cancel',
            lastName: 'Test',
            age: 35,
            gender: 'male',
            seatClass: 'economy',
            isLeadPassenger: true
          }
        ],
        totalPassengers: 1,
        adults: 1,
        children: 0,
        infants: 0,
        contactDetails: {
          email: 'cancel@example.com',
          phone: '+919876543210'
        },
        priceBreakdown: {
          baseFare: 5500,
          taxes: 660,
          serviceFee: 0,
          seatCharges: 0,
          mealCharges: 0,
          baggageCharges: 0,
          insuranceCharges: 0,
          convenienceFee: 0,
          discount: 0,
          promoDiscount: 0,
          total: 6160
        },
        totalAmount: 6160,
        paidAmount: 6160,
        bookingStatus: 'confirmed',
        paymentStatus: 'completed',
        bookingDate: new Date(),
        insuranceOpted: false
      });
    });

    it('should cancel booking successfully', async () => {
      const response = await request(app)
        .put(`/api/bookings/${testBooking._id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reason: 'Change of travel plans due to personal reasons' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookingStatus).toBe('cancelled');
    });

    it('should return error when cancellation reason is missing', async () => {
      const response = await request(app)
        .put(`/api/bookings/${testBooking._id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/bookings/reference/:reference', () => {
    beforeEach(async () => {
      await Booking.create({
        bookingReference: 'REF123ABC',
        pnr: 'PNRREF',
        user: testUser._id,
        bookingType: 'flight',
        flight: testFlight._id,
        travelDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        passengers: [
          {
            firstName: 'Reference',
            lastName: 'Test',
            age: 40,
            gender: 'male',
            seatClass: 'economy',
            isLeadPassenger: true
          }
        ],
        totalPassengers: 1,
        adults: 1,
        children: 0,
        infants: 0,
        contactDetails: {
          email: 'ref@example.com',
          phone: '+919876543210'
        },
        priceBreakdown: {
          baseFare: 5500,
          taxes: 660,
          serviceFee: 0,
          seatCharges: 0,
          mealCharges: 0,
          baggageCharges: 0,
          insuranceCharges: 0,
          convenienceFee: 0,
          discount: 0,
          promoDiscount: 0,
          total: 6160
        },
        totalAmount: 6160,
        bookingStatus: 'confirmed',
        bookingDate: new Date(),
        insuranceOpted: false
      });
    });

    it('should return booking by reference number', async () => {
      const response = await request(app)
        .get('/api/bookings/reference/REF123ABC')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookingReference).toBe('REF123ABC');
    });

    it('should return 404 for non-existent reference', async () => {
      const response = await request(app)
        .get('/api/bookings/reference/NONEXISTENT')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
