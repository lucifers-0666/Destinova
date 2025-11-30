import mongoose, { Schema, Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Passenger Interface
export interface IPassenger {
  title?: 'Mr' | 'Mrs' | 'Ms' | 'Miss' | 'Dr';
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  age: number;
  gender: 'male' | 'female' | 'other';
  passportNumber?: string;
  passportExpiry?: Date;
  nationality?: string;
  seatNumber?: string;
  seatClass: 'economy' | 'business' | 'first';
  seatPreference?: 'window' | 'aisle' | 'middle';
  mealPreference?: string;
  specialAssistance?: string[];
  frequentFlyerNumber?: string;
  isLeadPassenger: boolean;
}

// Contact Details Interface
export interface IContactDetails {
  email: string;
  phone: string;
  alternatePhone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Price Breakdown Interface
export interface IPriceBreakdown {
  baseFare: number;
  taxes: number;
  serviceFee: number;
  seatCharges: number;
  mealCharges: number;
  baggageCharges: number;
  insuranceCharges: number;
  convenienceFee: number;
  discount: number;
  promoDiscount: number;
  total: number;
}

// Add-ons Interface
export interface IAddOns {
  extraBaggage?: {
    weight: number;
    price: number;
  };
  travelInsurance?: {
    type: string;
    coverage: number;
    price: number;
  };
  mealPlan?: {
    type: string;
    price: number;
  };
  priorityBoarding?: boolean;
  loungeAccess?: boolean;
}

// Cancellation Details Interface
export interface ICancellation {
  cancelledAt: Date;
  cancelledBy: mongoose.Types.ObjectId | 'user' | 'system' | 'admin';
  reason: string;
  refundAmount?: number;
  refundStatus?: 'pending' | 'processing' | 'processed' | 'completed' | 'rejected' | 'approved';
  refundTransactionId?: string;
  refundProcessedAt?: Date;
  cancellationFee?: number;
  refundPercentage?: number;
  processedAt?: Date;
  rejectionReason?: string;
  cancellationCharges?: number; // Alias for cancellationFee
}

// Pricing Interface
export interface IPricing {
  baseFare: number;
  taxes: number;
  fees: number;
  total: number;
  currency: string;
}

// Booking Document Interface
export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  bookingReference: string;
  pnr: string;
  user: mongoose.Types.ObjectId;
  
  // Booking Type
  bookingType: 'flight' | 'hotel' | 'package';
  
  // Status fields
  status: 'pending' | 'confirmed' | 'ticketed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  
  // Flight Details
  flight?: mongoose.Types.ObjectId;
  outboundFlight?: mongoose.Types.ObjectId;
  returnFlight?: mongoose.Types.ObjectId;
  isRoundTrip: boolean;
  
  // Multi-City Support
  isMultiCity: boolean;
  flights?: {
    flight: mongoose.Types.ObjectId;
    date: Date;
    passengers: mongoose.Types.ObjectId[];
  }[];
  
  // Hotel Details (if applicable)
  hotel?: mongoose.Types.ObjectId;
  roomType?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  numberOfRooms?: number;
  numberOfNights?: number;
  
  // Travel Details
  travelDate: Date;
  returnDate?: Date;
  
  // Passengers
  passengers: IPassenger[];
  totalPassengers: number;
  adults: number;
  children: number;
  infants: number;
  seatClass?: 'economy' | 'business' | 'first';
  class?: 'economy' | 'business' | 'first'; // Alias
  
  // Contact
  contactDetails: IContactDetails;
  
  // Pricing (multiple aliases for compatibility)
  priceBreakdown: IPriceBreakdown;
  pricing?: IPricing;
  totalAmount: number;
  totalPrice?: number; // Alias
  paidAmount: number;
  dueAmount: number;
  currency: string;
  
  // Payment
  paymentStatus: 'pending' | 'partial' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod?: 'card' | 'upi' | 'netbanking' | 'wallet' | 'emi' | 'pay-later';
  paymentId?: mongoose.Types.ObjectId;
  payment?: mongoose.Types.ObjectId; // Alias
  transactionId?: string;
  paymentDate?: Date;
  paymentDeadline?: Date;
  
  // Booking Status
  bookingStatus: 'pending' | 'confirmed' | 'ticketed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  
  // Add-ons
  addOns?: IAddOns;
  
  // Special Requests
  specialRequests?: string;
  dietaryRequirements?: string[];
  
  // Insurance
  insuranceOpted: boolean;
  insurance?: mongoose.Types.ObjectId;
  insurancePremium?: number;
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    coverage: number;
    premium: number;
  };
  
  // Promo Code
  promoCode?: string;
  promoDiscount?: number;
  
  // Cancellation
  cancellation?: ICancellation;
  
  // Ticket Details
  eTicketNumber?: string;
  ticketStatus?: 'not-issued' | 'issued' | 'void' | 'refunded';
  ticketIssuedAt?: Date;
  
  // Check-in
  webCheckInCompleted: boolean;
  webCheckInTime?: Date;
  boardingPassUrl?: string;
  
  // Modification
  hasBeenModified: boolean;
  modificationHistory?: {
    modifiedAt: Date;
    modifiedBy: mongoose.Types.ObjectId;
    changes: string;
    additionalCharges: number;
  }[];
  
  // Reminders & Notifications
  remindersSent: {
    type: string;
    sentAt: Date;
  }[];
  
  // Source & Tracking
  bookingSource: 'web' | 'mobile' | 'api' | 'agent';
  ipAddress?: string;
  userAgent?: string;
  
  // Ratings & Feedback
  rating?: number;
  feedback?: string;
  feedbackSubmittedAt?: Date;
  
  // Timestamps
  bookingDate: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  generateBookingReference(): string;
  calculateTotalPrice(): number;
  canCancel(): { allowed: boolean; fee: number; refundAmount: number };
  canModify(): boolean;
  processRefund(): Promise<void>;
}

// Booking Model Interface
export interface IBookingModel extends Model<IBooking> {
  findByReference(reference: string): Promise<IBooking | null>;
  findUserBookings(userId: mongoose.Types.ObjectId, status?: string): Promise<IBooking[]>;
  getBookingStats(startDate: Date, endDate: Date): Promise<any>;
}

const PassengerSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  age: { type: Number, required: true, min: 0 },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  passportNumber: { type: String, trim: true },
  passportExpiry: { type: Date },
  nationality: { type: String },
  seatNumber: { type: String },
  seatClass: { type: String, enum: ['economy', 'business', 'first'], default: 'economy' },
  seatPreference: { type: String, enum: ['window', 'aisle', 'middle'] },
  mealPreference: { type: String },
  specialAssistance: [{ type: String }],
  frequentFlyerNumber: { type: String },
  isLeadPassenger: { type: Boolean, default: false }
}, { _id: false });

const ContactDetailsSchema = new Schema({
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true },
  alternatePhone: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String }
  }
}, { _id: false });

const PriceBreakdownSchema = new Schema({
  baseFare: { type: Number, required: true, min: 0 },
  taxes: { type: Number, default: 0, min: 0 },
  serviceFee: { type: Number, default: 0, min: 0 },
  seatCharges: { type: Number, default: 0, min: 0 },
  mealCharges: { type: Number, default: 0, min: 0 },
  baggageCharges: { type: Number, default: 0, min: 0 },
  insuranceCharges: { type: Number, default: 0, min: 0 },
  convenienceFee: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  promoDiscount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 }
}, { _id: false });

const AddOnsSchema = new Schema({
  extraBaggage: {
    weight: { type: Number },
    price: { type: Number }
  },
  travelInsurance: {
    type: { type: String },
    coverage: { type: Number },
    price: { type: Number }
  },
  mealPlan: {
    type: { type: String },
    price: { type: Number }
  },
  priorityBoarding: { type: Boolean, default: false },
  loungeAccess: { type: Boolean, default: false }
}, { _id: false });

const CancellationSchema = new Schema({
  cancelledAt: { type: Date, required: true },
  cancelledBy: { type: Schema.Types.Mixed, required: true },
  reason: { type: String, required: true },
  refundAmount: { type: Number, required: true, min: 0 },
  refundStatus: { type: String, enum: ['pending', 'processing', 'processed', 'completed', 'rejected', 'approved'], default: 'pending' },
  refundTransactionId: { type: String },
  refundProcessedAt: { type: Date },
  cancellationFee: { type: Number, default: 0, min: 0 }
}, { _id: false });

const BookingSchema: Schema<IBooking> = new Schema({
  bookingReference: { 
    type: String, 
    unique: true, 
    required: true,
    uppercase: true
  },
  pnr: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User is required'],
    index: true
  },
  
  // Booking Type
  bookingType: { 
    type: String, 
    enum: ['flight', 'hotel', 'package'], 
    required: true,
    default: 'flight'
  },
  
  // Flight Details
  flight: { type: Schema.Types.ObjectId, ref: 'Flight' },
  outboundFlight: { type: Schema.Types.ObjectId, ref: 'Flight' },
  returnFlight: { type: Schema.Types.ObjectId, ref: 'Flight' },
  isRoundTrip: { type: Boolean, default: false },
  
  // Multi-City Support
  isMultiCity: { type: Boolean, default: false },
  flights: [{
    flight: { type: Schema.Types.ObjectId, ref: 'Flight' },
    date: { type: Date },
    passengers: [{ type: Schema.Types.ObjectId }]
  }],
  
  // Hotel Details
  hotel: { type: Schema.Types.ObjectId, ref: 'Hotel' },
  roomType: { type: String },
  checkInDate: { type: Date },
  checkOutDate: { type: Date },
  numberOfRooms: { type: Number, min: 1 },
  numberOfNights: { type: Number, min: 1 },
  
  // Travel Details
  travelDate: { type: Date, required: true },
  returnDate: { type: Date },
  
  // Passengers
  passengers: {
    type: [PassengerSchema],
    required: true,
    validate: {
      validator: function(v: IPassenger[]) {
        return v.length > 0;
      },
      message: 'At least one passenger is required'
    }
  },
  totalPassengers: { type: Number, required: true, min: 1 },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, default: 0, min: 0 },
  infants: { type: Number, default: 0, min: 0 },
  
  // Contact
  contactDetails: {
    type: ContactDetailsSchema,
    required: true
  },
  
  // Pricing
  priceBreakdown: {
    type: PriceBreakdownSchema,
    required: true
  },
  totalAmount: { type: Number, required: true, min: 0 },
  paidAmount: { type: Number, default: 0, min: 0 },
  dueAmount: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'INR', uppercase: true },
  
  // Payment
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'partial', 'completed', 'failed', 'refunded', 'cancelled'], 
    default: 'pending'
  },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'upi', 'netbanking', 'wallet', 'emi', 'pay-later']
  },
  paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
  transactionId: { type: String },
  paymentDate: { type: Date },
  
  // Booking Status
  bookingStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'ticketed', 'checked-in', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'pending'
  },
  
  // Add-ons
  addOns: AddOnsSchema,
  
  // Special Requests
  specialRequests: { type: String, maxlength: 1000 },
  dietaryRequirements: [{ type: String }],
  
  // Insurance
  insuranceOpted: { type: Boolean, default: false },
  insurance: { type: Schema.Types.ObjectId, ref: 'Insurance' },
  insurancePremium: { type: Number, default: 0 },
  insuranceDetails: {
    provider: { type: String },
    policyNumber: { type: String },
    coverage: { type: Number },
    premium: { type: Number }
  },
  
  // Promo Code
  promoCode: { type: String, uppercase: true },
  promoDiscount: { type: Number, default: 0, min: 0 },
  
  // Cancellation
  cancellation: CancellationSchema,
  
  // Ticket Details
  eTicketNumber: { type: String },
  ticketStatus: { 
    type: String, 
    enum: ['not-issued', 'issued', 'void', 'refunded'],
    default: 'not-issued'
  },
  ticketIssuedAt: { type: Date },
  
  // Check-in
  webCheckInCompleted: { type: Boolean, default: false },
  webCheckInTime: { type: Date },
  boardingPassUrl: { type: String },
  
  // Modification
  hasBeenModified: { type: Boolean, default: false },
  modificationHistory: [{
    modifiedAt: { type: Date, required: true },
    modifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    changes: { type: String, required: true },
    additionalCharges: { type: Number, default: 0 }
  }],
  
  // Reminders & Notifications
  remindersSent: [{
    type: { type: String, required: true },
    sentAt: { type: Date, required: true }
  }],
  
  // Source & Tracking
  bookingSource: { 
    type: String, 
    enum: ['web', 'mobile', 'api', 'agent'],
    default: 'web'
  },
  ipAddress: { type: String },
  userAgent: { type: String },
  
  // Ratings & Feedback
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String, maxlength: 2000 },
  feedbackSubmittedAt: { type: Date },
  
  // Timestamps
  bookingDate: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
BookingSchema.index({ bookingReference: 1 }, { unique: true });
BookingSchema.index({ pnr: 1 }, { unique: true, sparse: true });
BookingSchema.index({ user: 1, bookingStatus: 1 });
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ flight: 1 });
BookingSchema.index({ travelDate: 1 });
BookingSchema.index({ bookingStatus: 1 });
BookingSchema.index({ paymentStatus: 1 });
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ 'contactDetails.email': 1 });

// Pre-save middleware to generate booking reference
BookingSchema.pre('save', function() {
  if (!this.bookingReference) {
    this.bookingReference = this.generateBookingReference();
  }
  if (!this.pnr) {
    this.pnr = uuidv4().substring(0, 6).toUpperCase();
  }
  
  // Calculate due amount
  this.dueAmount = this.totalAmount - this.paidAmount;
  
  // Calculate total passengers
  this.totalPassengers = this.adults + this.children + this.infants;
});

// Method to generate booking reference
BookingSchema.methods.generateBookingReference = function(): string {
  const prefix = 'DN';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
};

// Method to calculate total price
BookingSchema.methods.calculateTotalPrice = function(): number {
  const breakdown = this.priceBreakdown;
  const subtotal = breakdown.baseFare + breakdown.taxes + breakdown.serviceFee + 
                   breakdown.seatCharges + breakdown.mealCharges + 
                   breakdown.baggageCharges + breakdown.insuranceCharges + 
                   breakdown.convenienceFee;
  const total = subtotal - breakdown.discount - breakdown.promoDiscount;
  return Math.max(0, total);
};

// Method to check if cancellation is allowed
BookingSchema.methods.canCancel = function(): { allowed: boolean; fee: number; refundAmount: number } {
  const now = new Date();
  const travelDate = new Date(this.travelDate);
  const hoursUntilTravel = (travelDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  // Cannot cancel if already cancelled or completed
  if (['cancelled', 'completed', 'no-show'].includes(this.bookingStatus)) {
    return { allowed: false, fee: 0, refundAmount: 0 };
  }
  
  // Cannot cancel within 2 hours of travel
  if (hoursUntilTravel < 2) {
    return { allowed: false, fee: 0, refundAmount: 0 };
  }
  
  let cancellationFee = 0;
  
  // Calculate cancellation fee based on time until travel
  if (hoursUntilTravel >= 72) {
    cancellationFee = this.totalAmount * 0.10; // 10% fee
  } else if (hoursUntilTravel >= 24) {
    cancellationFee = this.totalAmount * 0.25; // 25% fee
  } else if (hoursUntilTravel >= 4) {
    cancellationFee = this.totalAmount * 0.50; // 50% fee
  } else {
    cancellationFee = this.totalAmount * 0.75; // 75% fee
  }
  
  const refundAmount = Math.max(0, this.paidAmount - cancellationFee);
  
  return {
    allowed: true,
    fee: Math.round(cancellationFee),
    refundAmount: Math.round(refundAmount)
  };
};

// Method to check if modification is allowed
BookingSchema.methods.canModify = function(): boolean {
  const now = new Date();
  const travelDate = new Date(this.travelDate);
  const hoursUntilTravel = (travelDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  // Cannot modify if cancelled, completed, or within 4 hours of travel
  if (['cancelled', 'completed', 'no-show', 'checked-in'].includes(this.bookingStatus)) {
    return false;
  }
  
  return hoursUntilTravel >= 4;
};

// Method to process refund
BookingSchema.methods.processRefund = async function(): Promise<void> {
  if (!this.cancellation) {
    throw new Error('No cancellation details found');
  }
  
  this.cancellation.refundStatus = 'processing';
  await this.save();
  
  // In production, integrate with payment gateway for actual refund
  // For now, just mark as completed
  this.cancellation.refundStatus = 'completed';
  this.cancellation.refundProcessedAt = new Date();
  this.paymentStatus = 'refunded';
  
  await this.save();
};

// Static method to find by reference
BookingSchema.statics.findByReference = function(reference: string): Promise<IBooking | null> {
  return this.findOne({ 
    $or: [
      { bookingReference: reference.toUpperCase() },
      { pnr: reference.toUpperCase() }
    ]
  }).populate('user flight');
};

// Static method to find user bookings
BookingSchema.statics.findUserBookings = function(
  userId: mongoose.Types.ObjectId, 
  status?: string
): Promise<IBooking[]> {
  const query: { user: mongoose.Types.ObjectId; bookingStatus?: string } = { user: userId };
  if (status) {
    query.bookingStatus = status;
  }
  return this.find(query)
    .populate('flight')
    .sort({ createdAt: -1 });
};

// Static method to get booking stats
BookingSchema.statics.getBookingStats = async function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$bookingStatus',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
        totalPaid: { $sum: '$paidAmount' }
      }
    }
  ]);
};

export const Booking = mongoose.model<IBooking, IBookingModel>('Booking', BookingSchema);
