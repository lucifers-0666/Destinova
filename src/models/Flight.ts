import mongoose, { Schema, Document, Model } from 'mongoose';

// Airline Info Interface
export interface IAirline {
  name: string;
  code: string;
  logo?: string;
}

// Aircraft Info Interface
export interface IAircraft {
  type: string;
  model: string;
  registration?: string;
}

// Airport/Location Interface
export interface ILocation {
  airportCode: string;
  airportName: string;
  city: string;
  country: string;
  terminal?: string;
  gate?: string;
}

// Seat Configuration Interface
export interface ISeatConfiguration {
  economy: number;
  business: number;
  firstClass: number;
  first?: number; // Alias for firstClass
  available?: {
    economy: number;
    business: number;
    first: number;
  };
}

// Baggage Allowance Interface
export interface IBaggageAllowance {
  checkedBaggage: {
    pieces: number;
    weightPerPiece: number;
    unit: 'kg' | 'lb';
  };
  cabinBaggage: {
    pieces: number;
    weightPerPiece: number;
    unit: 'kg' | 'lb';
  };
}

// Price History Interface
export interface IPriceHistory {
  price: number;
  timestamp: Date;
  reason?: string;
}

// Layover/Stop Interface
export interface ILayover {
  airportCode: string;
  airportName: string;
  city: string;
  arrivalTime: Date;
  departureTime: Date;
  duration: number; // in minutes
}

// Seat Map Interface
export interface ISeatMap {
  row: number;
  seat: string;
  class: 'economy' | 'business' | 'first';
  isAvailable: boolean;
  isWindow: boolean;
  isAisle: boolean;
  isEmergencyExit: boolean;
  price: number;
}

// Flight Document Interface
export interface IFlight extends Document {
  _id: mongoose.Types.ObjectId;
  flightNumber: string;
  airline: IAirline;
  aircraft: IAircraft;
  origin: ILocation;
  destination: ILocation;
  departureTime: Date;
  arrivalTime: Date;
  duration: number; // in minutes
  
  // Pricing
  basePrice: number;
  currentPrice: number;
  currency: string;
  taxAmount: number;
  
  // Seats
  totalSeats: number;
  availableSeats: number;
  seatsAvailable: number; // Alias
  bookedSeats: number;
  seatConfiguration: ISeatConfiguration;
  seatMap?: ISeatMap[];
  
  // Class-specific prices
  prices: {
    economy: number;
    business: number;
    firstClass: number;
  };
  price?: number; // Current/base price alias
  
  // Amenities
  amenities: string[];
  mealOptions: string[];
  entertainmentOptions: string[];
  wifiAvailable: boolean;
  powerOutlets: boolean;
  
  // Flight Details
  status: 'scheduled' | 'boarding' | 'departed' | 'in-air' | 'landed' | 'arrived' | 'delayed' | 'cancelled' | 'diverted';
  stops: number;
  layovers: ILayover[];
  isDirectFlight: boolean;
  isInternational: boolean;
  
  // Gate and Terminal info
  gate?: string;
  terminal?: string;
  estimatedDepartureTime?: Date;
  estimatedArrivalTime?: Date;
  actualDepartureTime?: Date;
  actualArrivalTime?: Date;
  
  // Baggage
  baggage: IBaggageAllowance;
  
  // Pricing History
  priceHistory: IPriceHistory[];
  
  // Additional Info
  flightType: 'domestic' | 'international';
  operatingDays: number[]; // 0-6 (Sunday-Saturday)
  isRecurring: boolean;
  recurringEndDate?: Date;
  
  // Booking Info
  bookingOpenDate: Date;
  bookingCloseTime: number; // hours before departure
  cancellationAllowed: boolean;
  cancellationFee: number;
  refundable: boolean;
  changeAllowed: boolean;
  changeFee: number;
  
  // Ratings
  averageRating: number;
  totalReviews: number;
  onTimePerformance: number; // percentage
  
  // Metadata
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  updateAvailability(seatsBooked: number): Promise<void>;
  updatePrice(newPrice: number, reason?: string): Promise<void>;
  calculateTotalPrice(classType: string, passengers: number): number;
}

// Flight Model Interface
export interface IFlightModel extends Model<IFlight> {
  searchFlights(origin: string, destination: string, date: Date, passengers?: number): Promise<IFlight[]>;
  getPopularRoutes(limit?: number): Promise<{ origin: string; destination: string; count: number }[]>;
}

const AirlineSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, uppercase: true, minlength: 2, maxlength: 3 },
  logo: { type: String }
}, { _id: false });

const AircraftSchema = new Schema({
  type: { type: String, required: true },
  model: { type: String, required: true },
  registration: { type: String }
}, { _id: false });

const LocationSchema = new Schema({
  airportCode: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 4 },
  airportName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  terminal: { type: String },
  gate: { type: String }
}, { _id: false });

const SeatConfigurationSchema = new Schema({
  economy: { type: Number, default: 0, min: 0 },
  business: { type: Number, default: 0, min: 0 },
  firstClass: { type: Number, default: 0, min: 0 }
}, { _id: false });

const BaggageAllowanceSchema = new Schema({
  checkedBaggage: {
    pieces: { type: Number, default: 1 },
    weightPerPiece: { type: Number, default: 23 },
    unit: { type: String, enum: ['kg', 'lb'], default: 'kg' }
  },
  cabinBaggage: {
    pieces: { type: Number, default: 1 },
    weightPerPiece: { type: Number, default: 7 },
    unit: { type: String, enum: ['kg', 'lb'], default: 'kg' }
  }
}, { _id: false });

const PriceHistorySchema = new Schema({
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  reason: { type: String }
}, { _id: false });

const LayoverSchema = new Schema({
  airportCode: { type: String, required: true, uppercase: true },
  airportName: { type: String, required: true },
  city: { type: String, required: true },
  arrivalTime: { type: Date, required: true },
  departureTime: { type: Date, required: true },
  duration: { type: Number, required: true }
}, { _id: false });

const SeatMapSchema = new Schema({
  row: { type: Number, required: true },
  seat: { type: String, required: true },
  class: { type: String, enum: ['economy', 'business', 'first'], required: true },
  isAvailable: { type: Boolean, default: true },
  isWindow: { type: Boolean, default: false },
  isAisle: { type: Boolean, default: false },
  isEmergencyExit: { type: Boolean, default: false },
  price: { type: Number, default: 0 }
}, { _id: false });

const FlightSchema: Schema<IFlight> = new Schema({
  flightNumber: { 
    type: String, 
    required: [true, 'Flight number is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{2}\d{1,4}[A-Z]?$|^[A-Z0-9]{2,3}-\d{1,4}$/, 'Invalid flight number format']
  },
  airline: {
    type: AirlineSchema,
    required: [true, 'Airline information is required']
  },
  aircraft: {
    type: AircraftSchema,
    required: [true, 'Aircraft information is required']
  },
  origin: {
    type: LocationSchema,
    required: [true, 'Origin is required']
  },
  destination: {
    type: LocationSchema,
    required: [true, 'Destination is required']
  },
  departureTime: { 
    type: Date, 
    required: [true, 'Departure time is required']
  },
  arrivalTime: { 
    type: Date, 
    required: [true, 'Arrival time is required']
  },
  duration: { 
    type: Number, 
    required: [true, 'Flight duration is required'],
    min: [15, 'Flight duration must be at least 15 minutes']
  },
  
  // Pricing
  basePrice: { 
    type: Number, 
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  currentPrice: { 
    type: Number, 
    required: [true, 'Current price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: { 
    type: String, 
    default: 'INR',
    uppercase: true
  },
  taxAmount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  
  // Seats
  totalSeats: { 
    type: Number, 
    required: [true, 'Total seats is required'],
    min: [1, 'Must have at least 1 seat']
  },
  availableSeats: { 
    type: Number, 
    required: true,
    min: 0
  },
  bookedSeats: { 
    type: Number, 
    default: 0,
    min: 0
  },
  seatConfiguration: {
    type: SeatConfigurationSchema,
    default: () => ({ economy: 150, business: 24, firstClass: 6 })
  },
  seatMap: [SeatMapSchema],
  
  // Class-specific prices
  prices: {
    economy: { type: Number, required: true, min: 0 },
    business: { type: Number, required: true, min: 0 },
    firstClass: { type: Number, required: true, min: 0 }
  },
  
  // Amenities
  amenities: [{ 
    type: String,
    enum: ['wifi', 'meals', 'entertainment', 'power-outlets', 'blanket', 'pillow', 'lounge-access', 'priority-boarding', 'extra-legroom']
  }],
  mealOptions: [{ type: String }],
  entertainmentOptions: [{ type: String }],
  wifiAvailable: { type: Boolean, default: false },
  powerOutlets: { type: Boolean, default: false },
  
  // Flight Details
  status: { 
    type: String, 
    enum: ['scheduled', 'boarding', 'departed', 'in-air', 'landed', 'arrived', 'delayed', 'cancelled', 'diverted'],
    default: 'scheduled'
  },
  stops: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  layovers: [LayoverSchema],
  isDirectFlight: { type: Boolean, default: true },
  isInternational: { type: Boolean, default: false },
  
  // Baggage
  baggage: {
    type: BaggageAllowanceSchema,
    default: () => ({})
  },
  
  // Pricing History
  priceHistory: [PriceHistorySchema],
  
  // Additional Info
  flightType: { 
    type: String, 
    enum: ['domestic', 'international'],
    required: true
  },
  operatingDays: [{
    type: Number,
    min: 0,
    max: 6
  }],
  isRecurring: { type: Boolean, default: false },
  recurringEndDate: { type: Date },
  
  // Booking Info
  bookingOpenDate: { type: Date, default: Date.now },
  bookingCloseTime: { type: Number, default: 2 }, // 2 hours before departure
  cancellationAllowed: { type: Boolean, default: true },
  cancellationFee: { type: Number, default: 500 },
  refundable: { type: Boolean, default: true },
  changeAllowed: { type: Boolean, default: true },
  changeFee: { type: Number, default: 300 },
  
  // Ratings
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0, min: 0 },
  onTimePerformance: { type: Number, default: 85, min: 0, max: 100 },
  
  // Metadata
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
FlightSchema.index({ flightNumber: 1 }, { unique: true });
FlightSchema.index({ 'origin.airportCode': 1, 'destination.airportCode': 1 });
FlightSchema.index({ departureTime: 1 });
FlightSchema.index({ 'origin.city': 1, 'destination.city': 1, departureTime: 1 });
FlightSchema.index({ currentPrice: 1 });
FlightSchema.index({ status: 1 });
FlightSchema.index({ 'airline.code': 1 });
FlightSchema.index({ isActive: 1, status: 1 });
FlightSchema.index({ isFeatured: 1 });
FlightSchema.index({ availableSeats: 1 });

// Virtual for formatted duration
FlightSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return `${hours}h ${minutes}m`;
});

// Virtual for route
FlightSchema.virtual('route').get(function() {
  return `${this.origin.airportCode} → ${this.destination.airportCode}`;
});

// Pre-save middleware to sync available seats
FlightSchema.pre('save', function() {
  this.availableSeats = this.totalSeats - this.bookedSeats;
  this.isDirectFlight = this.stops === 0;
});

// Method to update seat availability
FlightSchema.methods.updateAvailability = async function(seatsBooked: number): Promise<void> {
  this.bookedSeats += seatsBooked;
  this.availableSeats = this.totalSeats - this.bookedSeats;
  await this.save();
};

// Method to update price with history
FlightSchema.methods.updatePrice = async function(newPrice: number, reason?: string): Promise<void> {
  this.priceHistory.push({
    price: this.currentPrice,
    timestamp: new Date(),
    reason: reason || 'Price update'
  });
  this.currentPrice = newPrice;
  this.prices.economy = newPrice;
  this.prices.business = Math.round(newPrice * 2.5);
  this.prices.firstClass = Math.round(newPrice * 5);
  await this.save();
};

// Method to calculate total price
FlightSchema.methods.calculateTotalPrice = function(classType: string, passengers: number): number {
  const priceMap: { [key: string]: number } = {
    economy: this.prices.economy,
    business: this.prices.business,
    first: this.prices.firstClass,
    firstClass: this.prices.firstClass
  };
  const basePrice = priceMap[classType] || this.currentPrice;
  const subtotal = basePrice * passengers;
  const tax = subtotal * 0.12; // 12% tax
  return Math.round(subtotal + tax);
};

// Static method to search flights
FlightSchema.statics.searchFlights = async function(
  origin: string, 
  destination: string, 
  date: Date, 
  passengers: number = 1
): Promise<IFlight[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    $or: [
      { 'origin.airportCode': origin.toUpperCase() },
      { 'origin.city': new RegExp(origin, 'i') }
    ],
    $and: [
      {
        $or: [
          { 'destination.airportCode': destination.toUpperCase() },
          { 'destination.city': new RegExp(destination, 'i') }
        ]
      }
    ],
    departureTime: { $gte: startOfDay, $lte: endOfDay },
    availableSeats: { $gte: passengers },
    isActive: true,
    status: { $in: ['scheduled', 'delayed'] }
  }).sort({ departureTime: 1, currentPrice: 1 });
};

// Static method to get popular routes
FlightSchema.statics.getPopularRoutes = async function(limit: number = 10) {
  return this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: { origin: '$origin.city', destination: '$destination.city' },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        origin: '$_id.origin',
        destination: '$_id.destination',
        count: 1
      }
    }
  ]);
};

export const Flight = mongoose.model<IFlight, IFlightModel>('Flight', FlightSchema);
