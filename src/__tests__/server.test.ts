import { describe, it, expect } from 'vitest';
import { createServer } from '../app.js';

describe('Server basic endpoints', () => {
  const app = createServer();

  it('health returns ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.status).toBe('ok');
  });

  it('create booking flow', async () => {
    // list flights first
    const flights = await app.inject({ method: 'GET', url: '/api/flights?from=JFK' });
    expect(flights.statusCode).toBe(200);
    const flightData = flights.json().flights;
    expect(flightData.length).toBeGreaterThan(0);
    const flightId = flightData[0].id;

    const bookingRes = await app.inject({
      method: 'POST',
      url: '/api/bookings',
      payload: {
        flightIds: [flightId],
        currency: 'USD',
        passengers: [
          { firstName: 'John', lastName: 'Doe', age: 30 }
        ]
      }
    });
    expect(bookingRes.statusCode).toBe(201);
    const booking = bookingRes.json().booking;
    expect(booking.id).toMatch(/^BKG-/);

    const confirmRes = await app.inject({ method: 'POST', url: `/api/bookings/${booking.id}/confirm` });
    expect(confirmRes.statusCode).toBe(200);
    expect(confirmRes.json().booking.status).toBe('CONFIRMED');
  });
});
