import mongoose, { Schema, Document, Model } from 'mongoose';

// Weather Info Interface
export interface IWeatherInfo {
  season: string;
  avgTemperature: {
    min: number;
    max: number;
    unit: 'celsius' | 'fahrenheit';
  };
  rainfall: string;
  humidity: string;
  bestMonths: string[];
}

// Visa Info Interface
export interface IVisaInfo {
  required: boolean;
  type?: string;
  duration?: string;
  cost?: number;
  processingTime?: string;
  notes?: string;
}

// Travel Tips Interface
export interface ITravelTips {
  localCustoms?: string[];
  safetyTips?: string[];
  packingEssentials?: string[];
  localTransport?: string[];
  doAndDonts?: {
    dos: string[];
    donts: string[];
  };
}

// Destination Document Interface
export interface IDestination extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Basic Info
  name?: string; // Optional alias for city
  code?: string; // Airport code alias
  city: string;
  country: string;
  continent: string;
  airportCode: string;
  airportName: string;
  alternateAirports?: {
    code: string;
    name: string;
    distance: number; // km from city center
  }[];
  
  // Description & Content
  description: string;
  shortDescription: string;
  highlights: string[];
  
  // Media
  image: string;
  images: string[];
  videoUrl?: string;
  thumbnailImage?: string;
  bannerImage?: string;
  
  // Attractions & Activities
  attractions: {
    name: string;
    description?: string;
    type: string;
    image?: string;
    rating?: number;
  }[];
  activities: string[];
  cuisines: string[];
  
  // Travel Info
  bestTimeToVisit: string;
  worstTimeToVisit?: string;
  weatherInfo: IWeatherInfo[];
  timezone: string;
  timezoneOffset: number; // offset from UTC in hours
  
  // Practical Info
  currency: string;
  currencySymbol: string;
  language: string;
  languages?: string[];
  visaInfo?: IVisaInfo;
  travelTips?: ITravelTips;
  
  // Pricing
  avgFlightPrice: number;
  avgHotelPrice: number;
  budgetPerDay: {
    budget: number;
    midRange: number;
    luxury: number;
    currency: string;
  };
  
  // Scores & Ratings
  popularityScore: number;
  safetyScore: number;
  averageRating: number;
  totalReviews: number;
  
  // Categories & Tags
  categories: string[];
  tags: string[];
  travelStyles: ('adventure' | 'beach' | 'cultural' | 'romantic' | 'family' | 'business' | 'solo' | 'luxury' | 'budget')[];
  
  // Flags
  featured: boolean;
  isTrending: boolean;
  isPopular: boolean;
  isNewDestination: boolean;
  isActive: boolean;
  
  // SEO
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  
  // Geographic
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Related
  nearbyDestinations?: mongoose.Types.ObjectId[];
  popularRoutes?: {
    from: string;
    avgPrice: number;
    flightDuration: number;
  }[];
  
  // Stats
  totalFlightsAvailable: number;
  totalBookings: number;
  viewCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// Destination Model Interface
export interface IDestinationModel extends Model<IDestination> {
  findByAirportCode(code: string): Promise<IDestination | null>;
  findFeatured(limit?: number): Promise<IDestination[]>;
  findPopular(limit?: number): Promise<IDestination[]>;
  findTrending(limit?: number): Promise<IDestination[]>;
  searchDestinations(query: string): Promise<IDestination[]>;
}

const WeatherInfoSchema = new Schema({
  season: { type: String, required: true },
  avgTemperature: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    unit: { type: String, enum: ['celsius', 'fahrenheit'], default: 'celsius' }
  },
  rainfall: { type: String },
  humidity: { type: String },
  bestMonths: [{ type: String }]
}, { _id: false });

const VisaInfoSchema = new Schema({
  required: { type: Boolean, default: true },
  type: { type: String },
  duration: { type: String },
  cost: { type: Number },
  processingTime: { type: String },
  notes: { type: String }
}, { _id: false });

const TravelTipsSchema = new Schema({
  localCustoms: [{ type: String }],
  safetyTips: [{ type: String }],
  packingEssentials: [{ type: String }],
  localTransport: [{ type: String }],
  doAndDonts: {
    dos: [{ type: String }],
    donts: [{ type: String }]
  }
}, { _id: false });

const AttractionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, min: 0, max: 5 }
}, { _id: false });

const AlternateAirportSchema = new Schema({
  code: { type: String, required: true, uppercase: true },
  name: { type: String, required: true },
  distance: { type: Number, required: true }
}, { _id: false });

const PopularRouteSchema = new Schema({
  from: { type: String, required: true },
  avgPrice: { type: Number, required: true },
  flightDuration: { type: Number, required: true }
}, { _id: false });

const DestinationSchema: Schema<IDestination> = new Schema({
  // Basic Info
  city: { 
    type: String, 
    required: [true, 'City name is required'],
    trim: true,
    index: true
  },
  country: { 
    type: String, 
    required: [true, 'Country is required'],
    trim: true,
    index: true
  },
  continent: { 
    type: String, 
    required: true,
    enum: ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Antarctica']
  },
  airportCode: { 
    type: String, 
    required: [true, 'Airport code is required'],
    unique: true,
    uppercase: true,
    minlength: 3,
    maxlength: 4
  },
  airportName: { 
    type: String, 
    required: [true, 'Airport name is required']
  },
  alternateAirports: [AlternateAirportSchema],
  
  // Description & Content
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    maxlength: 5000
  },
  shortDescription: { 
    type: String, 
    maxlength: 300
  },
  highlights: [{ type: String }],
  
  // Media
  image: { 
    type: String, 
    required: [true, 'Image is required']
  },
  images: [{ type: String }],
  videoUrl: { type: String },
  thumbnailImage: { type: String },
  bannerImage: { type: String },
  
  // Attractions & Activities
  attractions: [AttractionSchema],
  activities: [{ type: String }],
  cuisines: [{ type: String }],
  
  // Travel Info
  bestTimeToVisit: { 
    type: String, 
    required: true
  },
  worstTimeToVisit: { type: String },
  weatherInfo: [WeatherInfoSchema],
  timezone: { 
    type: String, 
    required: true
  },
  timezoneOffset: { type: Number, default: 0 },
  
  // Practical Info
  currency: { 
    type: String, 
    required: true
  },
  currencySymbol: { type: String },
  language: { 
    type: String, 
    required: true
  },
  languages: [{ type: String }],
  visaInfo: VisaInfoSchema,
  travelTips: TravelTipsSchema,
  
  // Pricing
  avgFlightPrice: { type: Number, default: 0 },
  avgHotelPrice: { type: Number, default: 0 },
  budgetPerDay: {
    budget: { type: Number },
    midRange: { type: Number },
    luxury: { type: Number },
    currency: { type: String, default: 'INR' }
  },
  
  // Scores & Ratings
  popularityScore: { type: Number, default: 0, min: 0, max: 100 },
  safetyScore: { type: Number, default: 80, min: 0, max: 100 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  
  // Categories & Tags
  categories: [{ type: String }],
  tags: [{ type: String }],
  travelStyles: [{
    type: String,
    enum: ['adventure', 'beach', 'cultural', 'romantic', 'family', 'business', 'solo', 'luxury', 'budget']
  }],
  
  // Flags
  featured: { type: Boolean, default: false, index: true },
  isTrending: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  isNewDestination: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  
  // SEO
  slug: { 
    type: String, 
    unique: true,
    lowercase: true
  },
  metaTitle: { type: String, maxlength: 60 },
  metaDescription: { type: String, maxlength: 160 },
  
  // Geographic
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  
  // Related
  nearbyDestinations: [{ type: Schema.Types.ObjectId, ref: 'Destination' }],
  popularRoutes: [PopularRouteSchema],
  
  // Stats
  totalFlightsAvailable: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
DestinationSchema.index({ airportCode: 1 }, { unique: true });
DestinationSchema.index({ slug: 1 }, { unique: true });
DestinationSchema.index({ city: 'text', country: 'text', description: 'text' });
DestinationSchema.index({ featured: 1, popularityScore: -1 });
DestinationSchema.index({ isTrending: 1 });
DestinationSchema.index({ isPopular: 1 });
DestinationSchema.index({ continent: 1 });
DestinationSchema.index({ travelStyles: 1 });
DestinationSchema.index({ popularityScore: -1 });

// Pre-save middleware to generate slug
DestinationSchema.pre('save', function() {
  if (!this.slug) {
    this.slug = `${this.city}-${this.country}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 297) + '...';
  }
});

// Static method to find by airport code
DestinationSchema.statics.findByAirportCode = function(code: string): Promise<IDestination | null> {
  return this.findOne({ airportCode: code.toUpperCase(), isActive: true });
};

// Static method to find featured destinations
DestinationSchema.statics.findFeatured = function(limit: number = 10): Promise<IDestination[]> {
  return this.find({ featured: true, isActive: true })
    .sort({ popularityScore: -1 })
    .limit(limit);
};

// Static method to find popular destinations
DestinationSchema.statics.findPopular = function(limit: number = 10): Promise<IDestination[]> {
  return this.find({ isPopular: true, isActive: true })
    .sort({ popularityScore: -1 })
    .limit(limit);
};

// Static method to find trending destinations
DestinationSchema.statics.findTrending = function(limit: number = 10): Promise<IDestination[]> {
  return this.find({ isTrending: true, isActive: true })
    .sort({ viewCount: -1 })
    .limit(limit);
};

// Static method to search destinations
DestinationSchema.statics.searchDestinations = function(query: string): Promise<IDestination[]> {
  return this.find({
    isActive: true,
    $or: [
      { city: new RegExp(query, 'i') },
      { country: new RegExp(query, 'i') },
      { airportCode: query.toUpperCase() },
      { airportName: new RegExp(query, 'i') }
    ]
  }).sort({ popularityScore: -1 }).limit(20);
};

export const Destination = mongoose.model<IDestination, IDestinationModel>('Destination', DestinationSchema);
