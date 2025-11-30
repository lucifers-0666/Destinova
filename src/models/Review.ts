import mongoose, { Schema, Document, Model } from 'mongoose';

// Review Aspects Interface
export interface IReviewAspects {
  punctuality?: number; // 1-5
  service?: number;
  cleanliness?: number;
  comfort?: number;
  valueForMoney?: number;
  foodQuality?: number;
  entertainment?: number;
  boardingProcess?: number;
  cabinCrew?: number;
  seatComfort?: number;
}

// Admin Response Interface
export interface IAdminResponse {
  message: string;
  respondedAt: Date;
  respondedBy: mongoose.Types.ObjectId;
  isPublic: boolean;
}

// Review Document Interface
export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  
  // References
  user: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  flight?: mongoose.Types.ObjectId;
  destination?: mongoose.Types.ObjectId;
  
  // Review Type
  reviewType: 'flight' | 'airline' | 'destination' | 'booking_experience';
  
  // Airline Info (for airline reviews)
  airlineCode?: string;
  airlineName?: string;
  
  // Rating & Review
  rating: number; // Overall rating 1-5
  title?: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  
  // Detailed Aspects
  aspects?: IReviewAspects;
  categories?: IReviewAspects; // Alias for aspects
  
  // Travel Details
  travelDate?: Date;
  travelClass?: 'economy' | 'business' | 'first';
  tripType?: 'leisure' | 'business' | 'family' | 'solo';
  route?: {
    origin: string;
    destination: string;
  };
  
  // Media
  images?: string[];
  videos?: string[];
  
  // Engagement
  helpful: number;
  notHelpful: number;
  helpfulVotes: mongoose.Types.ObjectId[]; // Array of user IDs who voted helpful
  unhelpfulVotes: mongoose.Types.ObjectId[]; // Array of user IDs who voted unhelpful
  helpfulVoters?: mongoose.Types.ObjectId[];
  notHelpfulVoters?: mongoose.Types.ObjectId[];
  totalVotes: number;
  
  // Status & Moderation
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'hidden';
  moderationNotes?: string;
  moderationNote?: string; // Alias
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  rejectionReason?: string;
  
  // Flags
  isVerifiedPurchase: boolean;
  isFeatured: boolean;
  isEdited: boolean;
  editHistory?: {
    editedAt: Date;
    previousComment: string;
    previousRating: number;
  }[];
  
  // Admin Response
  adminResponse?: IAdminResponse;
  
  // Reporting
  reports?: {
    reportedBy: mongoose.Types.ObjectId;
    reason: string;
    description?: string;
    reportedAt: Date;
    status: 'pending' | 'reviewed' | 'dismissed';
  }[];
  reportCount: number;
  
  // Language
  language?: string;
  isTranslated?: boolean;
  originalLanguage?: string;
  
  // Source
  source: 'web' | 'mobile' | 'api' | 'imported';
  
  // Metadata
  ipAddress?: string;
  userAgent?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  markHelpful(userId: mongoose.Types.ObjectId): Promise<void>;
  markNotHelpful(userId: mongoose.Types.ObjectId): Promise<void>;
  report(userId: mongoose.Types.ObjectId, reason: string, description?: string): Promise<void>;
}

// Review Model Interface
export interface IReviewModel extends Model<IReview> {
  findByFlight(flightId: mongoose.Types.ObjectId, approvedOnly?: boolean): Promise<IReview[]>;
  findByUser(userId: mongoose.Types.ObjectId): Promise<IReview[]>;
  findByAirline(airlineCode: string): Promise<IReview[]>;
  getAverageRating(targetId: mongoose.Types.ObjectId, targetType: string): Promise<number>;
  getReviewStats(targetId: mongoose.Types.ObjectId): Promise<any>;
}

const ReviewAspectsSchema = new Schema({
  punctuality: { type: Number, min: 1, max: 5 },
  service: { type: Number, min: 1, max: 5 },
  cleanliness: { type: Number, min: 1, max: 5 },
  comfort: { type: Number, min: 1, max: 5 },
  valueForMoney: { type: Number, min: 1, max: 5 },
  foodQuality: { type: Number, min: 1, max: 5 },
  entertainment: { type: Number, min: 1, max: 5 },
  boardingProcess: { type: Number, min: 1, max: 5 },
  cabinCrew: { type: Number, min: 1, max: 5 },
  seatComfort: { type: Number, min: 1, max: 5 }
}, { _id: false });

const AdminResponseSchema = new Schema({
  message: { type: String, required: true },
  respondedAt: { type: Date, default: Date.now },
  respondedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: true }
}, { _id: false });

const EditHistorySchema = new Schema({
  editedAt: { type: Date, required: true },
  previousComment: { type: String, required: true },
  previousRating: { type: Number, required: true }
}, { _id: false });

const ReportSchema = new Schema({
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  description: { type: String },
  reportedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'reviewed', 'dismissed'], default: 'pending' }
}, { _id: false });

const ReviewSchema: Schema<IReview> = new Schema({
  // References
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User is required'],
    index: true 
  },
  booking: { 
    type: Schema.Types.ObjectId, 
    ref: 'Booking',
    index: true
  },
  flight: { 
    type: Schema.Types.ObjectId, 
    ref: 'Flight',
    index: true 
  },
  destination: {
    type: Schema.Types.ObjectId,
    ref: 'Destination',
    index: true
  },
  
  // Review Type
  reviewType: {
    type: String,
    enum: ['flight', 'airline', 'destination', 'booking_experience'],
    required: true,
    index: true
  },
  
  // Airline Info
  airlineCode: { type: String, uppercase: true },
  airlineName: { type: String },
  
  // Rating & Review
  rating: { 
    type: Number, 
    required: [true, 'Rating is required'], 
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: { 
    type: String, 
    trim: true,
    maxlength: 200
  },
  comment: { 
    type: String, 
    required: [true, 'Comment is required'], 
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [5000, 'Comment cannot exceed 5000 characters']
  },
  pros: [{ type: String, maxlength: 200 }],
  cons: [{ type: String, maxlength: 200 }],
  
  // Detailed Aspects
  aspects: ReviewAspectsSchema,
  
  // Travel Details
  travelDate: { type: Date },
  travelClass: { type: String, enum: ['economy', 'business', 'first'] },
  tripType: { type: String, enum: ['leisure', 'business', 'family', 'solo'] },
  route: {
    origin: { type: String },
    destination: { type: String }
  },
  
  // Media
  images: [{ type: String }],
  videos: [{ type: String }],
  
  // Engagement
  helpful: { type: Number, default: 0, min: 0 },
  notHelpful: { type: Number, default: 0, min: 0 },
  helpfulVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  unhelpfulVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  helpfulVoters: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  notHelpfulVoters: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  totalVotes: { type: Number, default: 0, min: 0 },
  
  // Status & Moderation
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'flagged', 'hidden'],
    default: 'pending',
    index: true
  },
  moderationNotes: { type: String },
  moderatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  moderatedAt: { type: Date },
  rejectionReason: { type: String },
  
  // Flags
  isVerifiedPurchase: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  editHistory: [EditHistorySchema],
  
  // Admin Response
  adminResponse: AdminResponseSchema,
  
  // Reporting
  reports: [ReportSchema],
  reportCount: { type: Number, default: 0, min: 0 },
  
  // Language
  language: { type: String, default: 'en' },
  isTranslated: { type: Boolean, default: false },
  originalLanguage: { type: String },
  
  // Source
  source: { 
    type: String, 
    enum: ['web', 'mobile', 'api', 'imported'],
    default: 'web'
  },
  
  // Metadata
  ipAddress: { type: String },
  userAgent: { type: String }
}, {
  timestamps: true
});

// Indexes
ReviewSchema.index({ user: 1, flight: 1 }, { unique: true, sparse: true });
ReviewSchema.index({ flight: 1, status: 1, createdAt: -1 });
ReviewSchema.index({ airlineCode: 1, status: 1 });
ReviewSchema.index({ destination: 1, status: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ isFeatured: 1 });
ReviewSchema.index({ helpful: -1 });

// Pre-save middleware
ReviewSchema.pre('save', function() {
  this.totalVotes = this.helpful + this.notHelpful;
  
  // Auto-flag if too many reports
  if (this.reportCount >= 3 && this.status === 'approved') {
    this.status = 'flagged';
  }
});

// Method to mark review as helpful
ReviewSchema.methods.markHelpful = async function(userId: mongoose.Types.ObjectId): Promise<void> {
  // Remove from notHelpful if exists
  const notHelpfulIndex = this.notHelpfulVoters?.indexOf(userId) ?? -1;
  if (notHelpfulIndex > -1) {
    this.notHelpfulVoters?.splice(notHelpfulIndex, 1);
    this.notHelpful = Math.max(0, this.notHelpful - 1);
  }
  
  // Add to helpful if not already
  if (!this.helpfulVoters?.includes(userId)) {
    this.helpfulVoters = this.helpfulVoters || [];
    this.helpfulVoters.push(userId);
    this.helpful += 1;
  }
  
  await this.save();
};

// Method to mark review as not helpful
ReviewSchema.methods.markNotHelpful = async function(userId: mongoose.Types.ObjectId): Promise<void> {
  // Remove from helpful if exists
  const helpfulIndex = this.helpfulVoters?.indexOf(userId) ?? -1;
  if (helpfulIndex > -1) {
    this.helpfulVoters?.splice(helpfulIndex, 1);
    this.helpful = Math.max(0, this.helpful - 1);
  }
  
  // Add to notHelpful if not already
  if (!this.notHelpfulVoters?.includes(userId)) {
    this.notHelpfulVoters = this.notHelpfulVoters || [];
    this.notHelpfulVoters.push(userId);
    this.notHelpful += 1;
  }
  
  await this.save();
};

// Method to report review
ReviewSchema.methods.report = async function(
  userId: mongoose.Types.ObjectId, 
  reason: string, 
  description?: string
): Promise<void> {
  this.reports = this.reports || [];
  
  // Check if user already reported
  const alreadyReported = this.reports.some(
    (r: { reportedBy: mongoose.Types.ObjectId }) => r.reportedBy.toString() === userId.toString()
  );
  
  if (!alreadyReported) {
    this.reports.push({
      reportedBy: userId,
      reason,
      description,
      reportedAt: new Date(),
      status: 'pending'
    });
    this.reportCount += 1;
  }
  
  await this.save();
};

// Static method to find reviews by flight
ReviewSchema.statics.findByFlight = function(
  flightId: mongoose.Types.ObjectId, 
  approvedOnly: boolean = true
): Promise<IReview[]> {
  const query: { flight: mongoose.Types.ObjectId; status?: string } = { flight: flightId };
  if (approvedOnly) {
    query.status = 'approved';
  }
  return this.find(query)
    .populate('user', 'firstName lastName profileImage')
    .sort({ helpful: -1, createdAt: -1 });
};

// Static method to find reviews by user
ReviewSchema.statics.findByUser = function(userId: mongoose.Types.ObjectId): Promise<IReview[]> {
  return this.find({ user: userId })
    .populate('flight', 'flightNumber airline origin destination')
    .sort({ createdAt: -1 });
};

// Static method to find reviews by airline
ReviewSchema.statics.findByAirline = function(airlineCode: string): Promise<IReview[]> {
  return this.find({ 
    airlineCode: airlineCode.toUpperCase(), 
    status: 'approved' 
  })
    .populate('user', 'firstName lastName profileImage')
    .sort({ helpful: -1, createdAt: -1 });
};

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function(
  targetId: mongoose.Types.ObjectId, 
  targetType: string
): Promise<number> {
  const field = targetType === 'flight' ? 'flight' : 
                targetType === 'destination' ? 'destination' : 'flight';
  
  const result = await this.aggregate([
    { $match: { [field]: targetId, status: 'approved' } },
    { $group: { _id: null, avgRating: { $avg: '$rating' } } }
  ]);
  
  return result[0]?.avgRating || 0;
};

// Static method to get review statistics
ReviewSchema.statics.getReviewStats = async function(targetId: mongoose.Types.ObjectId) {
  return this.aggregate([
    { $match: { flight: targetId, status: 'approved' } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        avgPunctuality: { $avg: '$aspects.punctuality' },
        avgService: { $avg: '$aspects.service' },
        avgCleanliness: { $avg: '$aspects.cleanliness' },
        avgComfort: { $avg: '$aspects.comfort' },
        avgValueForMoney: { $avg: '$aspects.valueForMoney' },
        rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
      }
    }
  ]);
};

export const Review = mongoose.model<IReview, IReviewModel>('Review', ReviewSchema);
