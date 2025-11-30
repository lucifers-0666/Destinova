export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface FlightSegment {
  id: string;
  from: string; // IATA code
  to: string;   // IATA code
  departTime: string; // ISO
  arriveTime: string; // ISO
  carrier: string;
  flightNumber: string;
  priceCents: number;
  seatsAvailable: number;
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
}

export interface Booking {
  id: string;
  createdAt: string;
  segments: FlightSegment[];
  passengers: Passenger[];
  totalPriceCents: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}
