import mongoose, { Schema, Document, Model } from 'mongoose';

// Price Alert Document Interface
export interface IPriceAlert extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  
  // Route Details
  origin: {
    airportCode: string;
    city: string;
    country?: string;
  };
  destination: {
    airportCode: string;
    city: string;
    country?: string;
  };
  
  // Price Criteria
  targetPrice: number;
  currentLowestPrice?: number;
  currency: string;
  priceFlexibility?: number; // percentage above target price to still notify
  
  // Travel Criteria
  travelDateStart?: Date;
  travelDateEnd?: Date;
  isFlexibleDates: boolean;
  flexibleDays?: number; // +/- days
  
  // Preferences
  preferredAirlines?: string[];
  excludedAirlines?: string[];
  preferredClass?: 'economy' | 'business' | 'first' | 'any';
  maxStops?: number;
  preferredDepartureTime?: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
  
  // Alert Settings
  alertFrequency: 'instant' | 'daily' | 'weekly';
  notificationChannels: ('email' | 'sms' | 'push')[];
  emailAddress?: string;
  phoneNumber?: string;
  
  // Status
  isActive: boolean;
  isPaused: boolean;
  pausedReason?: string;
  pausedUntil?: Date;
  
  // Notification History
  notificationsSent: {
    sentAt: Date;
    channel: 'email' | 'sms' | 'push';
    priceAtTime: number;
    flightId?: mongoose.Types.ObjectId;
    success: boolean;
    errorMessage?: string;
  }[];
  lastNotifiedAt?: Date;
  totalNotificationsSent: number;
  
  // Price History Tracking
  priceHistory: {
    price: number;
    timestamp: Date;
    flightId?: mongoose.Types.ObjectId;
  }[];
  lowestPriceEver: number;
  lowestPriceDate?: Date;
  highestPriceTracked?: number;
  averagePrice?: number;
  
  // Statistics
  timesChecked: number;
  lastCheckedAt?: Date;
  priceDropsDetected: number;
  
  // Metadata
  name?: string; // User-friendly name for the alert
  notes?: string;
  tags?: string[];
  
  // Expiration
  expiresAt?: Date;
  autoRenew: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  checkPrice(currentPrice: number): boolean;
  sendNotification(channel: 'email' | 'sms' | 'push'): Promise<boolean>;
  updatePriceHistory(price: number, flightId?: mongoose.Types.ObjectId): Promise<void>;
  pause(reason?: string, until?: Date): Promise<void>;
  resume(): Promise<void>;
}

// Price Alert Model Interface
export interface IPriceAlertModel extends Model<IPriceAlert> {
  findActiveAlerts(origin: string, destination: string): Promise<IPriceAlert[]>;
  findUserAlerts(userId: mongoose.Types.ObjectId, activeOnly?: boolean): Promise<IPriceAlert[]>;
  getAlertsToProcess(): Promise<IPriceAlert[]>;
  cleanupExpiredAlerts(): Promise<number>;
}

const LocationSchema = new Schema({
  airportCode: { type: String, required: true, uppercase: true },
  city: { type: String, required: true },
  country: { type: String }
}, { _id: false });

const NotificationHistorySchema = new Schema({
  sentAt: { type: Date, required: true },
  channel: { type: String, enum: ['email', 'sms', 'push'], required: true },
  priceAtTime: { type: Number, required: true },
  flightId: { type: Schema.Types.ObjectId, ref: 'Flight' },
  success: { type: Boolean, required: true },
  errorMessage: { type: String }
}, { _id: false });

const PriceHistoryItemSchema = new Schema({
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  flightId: { type: Schema.Types.ObjectId, ref: 'Flight' }
}, { _id: false });

const PriceAlertSchema: Schema<IPriceAlert> = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User is required'],
    index: true 
  },
  
  // Route Details
  origin: {
    type: LocationSchema,
    required: [true, 'Origin is required']
  },
  destination: {
    type: LocationSchema,
    required: [true, 'Destination is required']
  },
  
  // Price Criteria
  targetPrice: { 
    type: Number, 
    required: [true, 'Target price is required'],
    min: [0, 'Target price must be positive']
  },
  currentLowestPrice: { type: Number },
  currency: { type: String, default: 'INR', uppercase: true },
  priceFlexibility: { type: Number, default: 10, min: 0, max: 100 }, // 10% default
  
  // Travel Criteria
  travelDateStart: { type: Date },
  travelDateEnd: { type: Date },
  isFlexibleDates: { type: Boolean, default: false },
  flexibleDays: { type: Number, default: 3, min: 0, max: 30 },
  
  // Preferences
  preferredAirlines: [{ type: String, uppercase: true }],
  excludedAirlines: [{ type: String, uppercase: true }],
  preferredClass: { 
    type: String, 
    enum: ['economy', 'business', 'first', 'any'],
    default: 'any'
  },
  maxStops: { type: Number, min: 0, max: 3 },
  preferredDepartureTime: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night', 'any'],
    default: 'any'
  },
  
  // Alert Settings
  alertFrequency: { 
    type: String, 
    enum: ['instant', 'daily', 'weekly'],
    default: 'daily'
  },
  notificationChannels: [{
    type: String,
    enum: ['email', 'sms', 'push']
  }],
  emailAddress: { type: String, lowercase: true },
  phoneNumber: { type: String },
  
  // Status
  isActive: { type: Boolean, default: true, index: true },
  isPaused: { type: Boolean, default: false },
  pausedReason: { type: String },
  pausedUntil: { type: Date },
  
  // Notification History
  notificationsSent: [NotificationHistorySchema],
  lastNotifiedAt: { type: Date },
  totalNotificationsSent: { type: Number, default: 0 },
  
  // Price History Tracking
  priceHistory: [PriceHistoryItemSchema],
  lowestPriceEver: { type: Number },
  lowestPriceDate: { type: Date },
  highestPriceTracked: { type: Number },
  averagePrice: { type: Number },
  
  // Statistics
  timesChecked: { type: Number, default: 0 },
  lastCheckedAt: { type: Date },
  priceDropsDetected: { type: Number, default: 0 },
  
  // Metadata
  name: { type: String, trim: true, maxlength: 100 },
  notes: { type: String, maxlength: 500 },
  tags: [{ type: String }],
  
  // Expiration
  expiresAt: { type: Date, index: true },
  autoRenew: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
PriceAlertSchema.index({ user: 1, isActive: 1 });
PriceAlertSchema.index({ 'origin.airportCode': 1, 'destination.airportCode': 1 });
PriceAlertSchema.index({ isActive: 1, isPaused: 1 });
PriceAlertSchema.index({ targetPrice: 1 });
PriceAlertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
PriceAlertSchema.index({ lastCheckedAt: 1 });

// Virtual for route string
PriceAlertSchema.virtual('route').get(function() {
  return `${this.origin.airportCode} → ${this.destination.airportCode}`;
});

// Pre-save middleware
PriceAlertSchema.pre('save', function() {
  // Set default notification channels if not provided
  if (!this.notificationChannels || this.notificationChannels.length === 0) {
    this.notificationChannels = ['email'];
  }
  
  // Set default expiration (90 days from creation)
  if (!this.expiresAt && this.isNew) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 90);
    this.expiresAt = expirationDate;
  }
  
  // Auto-resume if pause period has ended
  if (this.isPaused && this.pausedUntil && this.pausedUntil < new Date()) {
    this.isPaused = false;
    this.pausedReason = undefined;
    this.pausedUntil = undefined;
  }
});

// Method to check if current price triggers alert
PriceAlertSchema.methods.checkPrice = function(currentPrice: number): boolean {
  const effectiveTarget = this.targetPrice * (1 + (this.priceFlexibility || 0) / 100);
  return currentPrice <= effectiveTarget;
};

// Method to send notification
PriceAlertSchema.methods.sendNotification = async function(channel: 'email' | 'sms' | 'push'): Promise<boolean> {
  try {
    // In production, implement actual notification sending
    // For now, just log the notification
    console.log(`Sending ${channel} notification for price alert ${this._id}`);
    
    this.notificationsSent.push({
      sentAt: new Date(),
      channel,
      priceAtTime: this.currentLowestPrice || this.targetPrice,
      success: true
    });
    
    this.lastNotifiedAt = new Date();
    this.totalNotificationsSent += 1;
    
    await this.save();
    return true;
  } catch (error) {
    this.notificationsSent.push({
      sentAt: new Date(),
      channel,
      priceAtTime: this.currentLowestPrice || this.targetPrice,
      success: false,
      errorMessage: (error as Error).message
    });
    
    await this.save();
    return false;
  }
};

// Method to update price history
PriceAlertSchema.methods.updatePriceHistory = async function(
  price: number, 
  flightId?: mongoose.Types.ObjectId
): Promise<void> {
  // Add to price history (keep last 100 entries)
  this.priceHistory.push({
    price,
    timestamp: new Date(),
    flightId
  });
  
  if (this.priceHistory.length > 100) {
    this.priceHistory = this.priceHistory.slice(-100);
  }
  
  // Update statistics
  this.currentLowestPrice = price;
  this.timesChecked += 1;
  this.lastCheckedAt = new Date();
  
  // Track lowest price ever
  if (!this.lowestPriceEver || price < this.lowestPriceEver) {
    this.lowestPriceEver = price;
    this.lowestPriceDate = new Date();
    this.priceDropsDetected += 1;
  }
  
  // Track highest price
  if (!this.highestPriceTracked || price > this.highestPriceTracked) {
    this.highestPriceTracked = price;
  }
  
  // Calculate average price
  const sum = this.priceHistory.reduce((acc: number, item: { price: number }) => acc + item.price, 0);
  this.averagePrice = Math.round(sum / this.priceHistory.length);
  
  await this.save();
};

// Method to pause alert
PriceAlertSchema.methods.pause = async function(reason?: string, until?: Date): Promise<void> {
  this.isPaused = true;
  this.pausedReason = reason;
  this.pausedUntil = until;
  await this.save();
};

// Method to resume alert
PriceAlertSchema.methods.resume = async function(): Promise<void> {
  this.isPaused = false;
  this.pausedReason = undefined;
  this.pausedUntil = undefined;
  await this.save();
};

// Static method to find active alerts for a route
PriceAlertSchema.statics.findActiveAlerts = function(
  origin: string, 
  destination: string
): Promise<IPriceAlert[]> {
  return this.find({
    'origin.airportCode': origin.toUpperCase(),
    'destination.airportCode': destination.toUpperCase(),
    isActive: true,
    isPaused: false,
    $or: [
      { expiresAt: { $gt: new Date() } },
      { expiresAt: null }
    ]
  }).populate('user', 'email firstName lastName');
};

// Static method to find user's alerts
PriceAlertSchema.statics.findUserAlerts = function(
  userId: mongoose.Types.ObjectId, 
  activeOnly: boolean = false
): Promise<IPriceAlert[]> {
  const query: { user: mongoose.Types.ObjectId; isActive?: boolean } = { user: userId };
  if (activeOnly) {
    query.isActive = true;
  }
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get alerts that need processing
PriceAlertSchema.statics.getAlertsToProcess = function(): Promise<IPriceAlert[]> {
  const now = new Date();
  
  return this.find({
    isActive: true,
    isPaused: false,
    $and: [
      {
        $or: [
          { expiresAt: { $gt: now } },
          { expiresAt: null }
        ]
      },
      {
        $or: [
          { lastCheckedAt: { $lt: new Date(now.getTime() - 60 * 60 * 1000) } }, // Not checked in last hour
          { lastCheckedAt: null }
        ]
      }
    ]
  }).populate('user', 'email firstName lastName');
};

// Static method to cleanup expired alerts
PriceAlertSchema.statics.cleanupExpiredAlerts = async function(): Promise<number> {
  const result = await this.updateMany(
    {
      expiresAt: { $lt: new Date() },
      autoRenew: false
    },
    {
      $set: { isActive: false }
    }
  );
  
  return result.modifiedCount;
};

export const PriceAlert = mongoose.model<IPriceAlert, IPriceAlertModel>('PriceAlert', PriceAlertSchema);
