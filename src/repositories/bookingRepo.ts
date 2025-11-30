import { Booking, FlightSegment, Passenger } from '../utils/types.js';

const bookings: Booking[] = [];

export function createBooking(data: { id: string; segments: FlightSegment[]; passengers: Passenger[]; currency: string }) {
  const totalPriceCents = data.segments.reduce((s, seg) => s + seg.priceCents, 0);
  const booking: Booking = {
    id: data.id,
    createdAt: new Date().toISOString(),
    segments: data.segments,
    passengers: data.passengers,
    totalPriceCents,
    currency: data.currency,
    status: 'PENDING'
  };
  bookings.push(booking);
  return booking;
}

export function confirmBooking(id: string) {
  const b = bookings.find(b => b.id === id);
  if (!b) return null;
  b.status = 'CONFIRMED';
  return b;
}

export function listBookings() {
  return bookings;
}

export function getBooking(id: string) {
  return bookings.find(b => b.id === id) || null;
}
