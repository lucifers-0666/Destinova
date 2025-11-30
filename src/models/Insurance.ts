/**
 * Insurance Model
 * Travel insurance plans for bookings
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

// Coverage Item Interface
export interface ICoverageItem {
  type: 'trip_cancellation' | 'medical_emergency' | 'baggage_loss' | 'flight_delay' | 'trip_interruption' | 'personal_accident' | 'emergency_evacuation';
  description: string;
  maxAmount: number;
  isIncluded: boolean;
}

// Insurance Document Interface
export interface IInsurance extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  
  // Pricing
  price: number;
  priceType: 'fixed' | 'percentage';
  percentageOfBooking?: number;
  minPrice?: number;
  maxPrice?: number;
  
  // Coverage Details
  coverage: ICoverageItem[];
  maxCoverageAmount: number;
  deductible: number;
  
  // Plan Details
  planType: 'basic' | 'standard' | 'premium' | 'comprehensive';
  duration: 'single_trip' | 'annual' | 'multi_trip';
  
  // Eligibility
  minAge: number;
  maxAge: number;
  domesticOnly: boolean;
  internationalOnly: boolean;
  
  // Features
  features: string[];
  exclusions: string[];
  
  // Terms
  termsAndConditions: string;
  claimProcess: string;
  
  // Status
  isActive: boolean;
  isPopular: boolean;
  displayOrder: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Insurance Model Interface
export interface IInsuranceModel extends Model<IInsurance> {
  findActivePlans(): Promise<IInsurance[]>;
  findBySlug(slug: string): Promise<IInsurance | null>;
  calculatePremium(planId: string, bookingAmount: number): Promise<number>;
}

// Coverage Schema
const CoverageSchema = new Schema({
  type: {
    type: String,
    enum: ['trip_cancellation', 'medical_emergency', 'baggage_loss', 'flight_delay', 'trip_interruption', 'personal_accident', 'emergency_evacuation'],
    required: true
  },
  description: { type: String, required: true },
  maxAmount: { type: Number, required: true },
  isIncluded: { type: Boolean, default: true }
}, { _id: false });

// Insurance Schema
const InsuranceSchema = new Schema<IInsurance>({
  name: {
    type: String,
    required: [true, 'Insurance plan name is required'],
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceType: {
    type: String,
    enum: ['fixed', 'percentage'],
    default: 'fixed'
  },
  percentageOfBooking: {
    type: Number,
    min: 0,
    max: 100
  },
  minPrice: { type: Number, min: 0 },
  maxPrice: { type: Number, min: 0 },
  
  // Coverage
  coverage: [CoverageSchema],
  maxCoverageAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deductible: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Plan Details
  planType: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'comprehensive'],
    default: 'standard'
  },
  duration: {
    type: String,
    enum: ['single_trip', 'annual', 'multi_trip'],
    default: 'single_trip'
  },
  
  // Eligibility
  minAge: { type: Number, default: 0 },
  maxAge: { type: Number, default: 99 },
  domesticOnly: { type: Boolean, default: false },
  internationalOnly: { type: Boolean, default: false },
  
  // Features
  features: [{ type: String }],
  exclusions: [{ type: String }],
  
  // Terms
  termsAndConditions: { type: String },
  claimProcess: { type: String },
  
  // Status
  isActive: { type: Boolean, default: true },
  isPopular: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes
InsuranceSchema.index({ isActive: 1, displayOrder: 1 });
InsuranceSchema.index({ slug: 1 });
InsuranceSchema.index({ planType: 1 });

// Static Methods
InsuranceSchema.statics.findActivePlans = async function(): Promise<IInsurance[]> {
  return this.find({ isActive: true }).sort({ displayOrder: 1 });
};

InsuranceSchema.statics.findBySlug = async function(slug: string): Promise<IInsurance | null> {
  return this.findOne({ slug, isActive: true });
};

InsuranceSchema.statics.calculatePremium = async function(
  planId: string, 
  bookingAmount: number
): Promise<number> {
  const plan = await this.findById(planId);
  if (!plan) return 0;
  
  if (plan.priceType === 'percentage' && plan.percentageOfBooking) {
    let premium = (bookingAmount * plan.percentageOfBooking) / 100;
    
    // Apply min/max limits
    if (plan.minPrice && premium < plan.minPrice) {
      premium = plan.minPrice;
    }
    if (plan.maxPrice && premium > plan.maxPrice) {
      premium = plan.maxPrice;
    }
    
    return Math.round(premium);
  }
  
  return plan.price;
};

// Pre-save middleware to generate slug
InsuranceSchema.pre('save', function() {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

export const Insurance = mongoose.model<IInsurance, IInsuranceModel>('Insurance', InsuranceSchema);
