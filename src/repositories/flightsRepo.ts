import { FlightSegment } from '../utils/types.js';

// Simple in-memory flight store for initial scaffold.
const flights: FlightSegment[] = [
  {
    id: 'SEG1',
    from: 'JFK',
    to: 'LAX',
    departTime: new Date(Date.now() + 3600_000).toISOString(),
    arriveTime: new Date(Date.now() + 6 * 3600_000).toISOString(),
    carrier: 'DN',
    flightNumber: 'DN101',
    priceCents: 35000,
    seatsAvailable: 42,
    flightTimeMinutes: 300
  } as any
];

export function searchFlights(params: { from?: string; to?: string }) {
  return flights.filter(f => {
    return (!params.from || f.from === params.from) && (!params.to || f.to === params.to);
  });
}

export function getFlight(id: string) {
  return flights.find(f => f.id === id) || null;
}

export function reserveSeats(id: string, count: number) {
  const flight = getFlight(id);
  if (!flight) return false;
  if (flight.seatsAvailable < count) return false;
  flight.seatsAvailable -= count;
  return true;
}
