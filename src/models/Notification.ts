import mongoose, { Schema, Document, Model } from 'mongoose';

// Notification Action Interface
export interface INotificationAction {
  label: string;
  type: 'link' | 'button' | 'dismiss';
  url?: string;
  action?: string;
}

// Notification Document Interface
export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  
  // Notification Type & Category
  type: 'booking' | 'payment' | 'flight-update' | 'price-alert' | 'promotion' | 'reminder' | 'system' | 'account' | 'review';
  category: 'transactional' | 'marketing' | 'informational' | 'alert';
  
  // Content
  title: string;
  message: string;
  shortMessage?: string;
  htmlContent?: string;
  
  // Visual
  icon?: string;
  image?: string;
  color?: string;
  
  // Links & Actions
  link?: string;
  deepLink?: string;
  actions?: INotificationAction[];
  
  // References
  relatedBooking?: mongoose.Types.ObjectId;
  relatedFlight?: mongoose.Types.ObjectId;
  relatedPayment?: mongoose.Types.ObjectId;
  relatedPriceAlert?: mongoose.Types.ObjectId;
  
  // Status
  read: boolean;
  readAt?: Date;
  dismissed: boolean;
  dismissedAt?: Date;
  archived: boolean;
  archivedAt?: Date;
  
  // Delivery
  channels: ('in-app' | 'email' | 'sms' | 'push')[];
  deliveryStatus: {
    channel: 'in-app' | 'email' | 'sms' | 'push';
    status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
    sentAt?: Date;
    deliveredAt?: Date;
    failedAt?: Date;
    errorMessage?: string;
    attempts: number;
  }[];
  
  // Priority & Scheduling
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor?: Date;
  sentAt?: Date;
  
  // Targeting
  targetSegment?: string;
  campaignId?: string;
  
  // Interaction Tracking
  clickedAt?: Date;
  clickedLink?: string;
  interactionType?: 'clicked' | 'dismissed' | 'action-taken';
  
  // Expiration
  expiresAt?: Date;
  isExpired: boolean;
  
  // Batch & Group
  batchId?: string;
  groupId?: string;
  isGrouped: boolean;
  groupCount?: number;
  
  // Metadata
  metadata?: Record<string, unknown>;
  tags?: string[];
  source?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  markAsRead(): Promise<void>;
  markAsUnread(): Promise<void>;
  dismiss(): Promise<void>;
  archive(): Promise<void>;
  trackClick(link?: string): Promise<void>;
}

// Notification Model Interface
export interface INotificationModel extends Model<INotification> {
  findUserNotifications(userId: mongoose.Types.ObjectId, options?: { unreadOnly?: boolean; limit?: number }): Promise<INotification[]>;
  getUnreadCount(userId: mongoose.Types.ObjectId): Promise<number>;
  markAllAsRead(userId: mongoose.Types.ObjectId): Promise<number>;
  createBookingNotification(userId: mongoose.Types.ObjectId, bookingId: mongoose.Types.ObjectId, type: string, title: string, message: string): Promise<INotification>;
  cleanupExpired(): Promise<number>;
  bulkCreate(notifications: Partial<INotification>[]): Promise<INotification[]>;
}

const NotificationActionSchema = new Schema({
  label: { type: String, required: true },
  type: { type: String, enum: ['link', 'button', 'dismiss'], required: true },
  url: { type: String },
  action: { type: String }
}, { _id: false });

const DeliveryStatusSchema = new Schema({
  channel: { type: String, enum: ['in-app', 'email', 'sms', 'push'], required: true },
  status: { 
    type: String, 
    enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'],
    default: 'pending'
  },
  sentAt: { type: Date },
  deliveredAt: { type: Date },
  failedAt: { type: Date },
  errorMessage: { type: String },
  attempts: { type: Number, default: 0 }
}, { _id: false });

const NotificationSchema: Schema<INotification> = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User is required'],
    index: true 
  },
  
  // Notification Type & Category
  type: { 
    type: String, 
    enum: ['booking', 'payment', 'flight-update', 'price-alert', 'promotion', 'reminder', 'system', 'account', 'review'],
    required: [true, 'Notification type is required'],
    index: true
  },
  category: {
    type: String,
    enum: ['transactional', 'marketing', 'informational', 'alert'],
    default: 'informational'
  },
  
  // Content
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    trim: true,
    maxlength: 2000
  },
  shortMessage: { 
    type: String,
    trim: true,
    maxlength: 100
  },
  htmlContent: { type: String },
  
  // Visual
  icon: { type: String },
  image: { type: String },
  color: { type: String },
  
  // Links & Actions
  link: { type: String },
  deepLink: { type: String },
  actions: [NotificationActionSchema],
  
  // References
  relatedBooking: { type: Schema.Types.ObjectId, ref: 'Booking', index: true },
  relatedFlight: { type: Schema.Types.ObjectId, ref: 'Flight' },
  relatedPayment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  relatedPriceAlert: { type: Schema.Types.ObjectId, ref: 'PriceAlert' },
  
  // Status
  read: { type: Boolean, default: false, index: true },
  readAt: { type: Date },
  dismissed: { type: Boolean, default: false },
  dismissedAt: { type: Date },
  archived: { type: Boolean, default: false },
  archivedAt: { type: Date },
  
  // Delivery
  channels: [{
    type: String,
    enum: ['in-app', 'email', 'sms', 'push']
  }],
  deliveryStatus: [DeliveryStatusSchema],
  
  // Priority & Scheduling
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  scheduledFor: { type: Date, index: true },
  sentAt: { type: Date },
  
  // Targeting
  targetSegment: { type: String },
  campaignId: { type: String, index: true },
  
  // Interaction Tracking
  clickedAt: { type: Date },
  clickedLink: { type: String },
  interactionType: { type: String, enum: ['clicked', 'dismissed', 'action-taken'] },
  
  // Expiration
  expiresAt: { type: Date, index: true },
  isExpired: { type: Boolean, default: false },
  
  // Batch & Group
  batchId: { type: String, index: true },
  groupId: { type: String },
  isGrouped: { type: Boolean, default: false },
  groupCount: { type: Number },
  
  // Metadata
  metadata: { type: Schema.Types.Mixed },
  tags: [{ type: String }],
  source: { type: String }
}, {
  timestamps: true
});

// Indexes
NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, type: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, archived: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
NotificationSchema.index({ scheduledFor: 1, 'deliveryStatus.status': 1 });
NotificationSchema.index({ createdAt: -1 });

// Pre-save middleware
NotificationSchema.pre('save', function() {
  // Set default channels
  if (!this.channels || this.channels.length === 0) {
    this.channels = ['in-app'];
  }
  
  // Initialize delivery status for each channel
  if (this.isNew && this.channels) {
    this.deliveryStatus = this.channels.map(channel => ({
      channel,
      status: 'pending',
      attempts: 0
    }));
  }
  
  // Generate short message if not provided
  if (!this.shortMessage && this.message) {
    this.shortMessage = this.message.length > 97 
      ? this.message.substring(0, 97) + '...'
      : this.message;
  }
  
  // Check expiration
  if (this.expiresAt && this.expiresAt < new Date()) {
    this.isExpired = true;
  }
});

// Method to mark as read
NotificationSchema.methods.markAsRead = async function(): Promise<void> {
  if (!this.read) {
    this.read = true;
    this.readAt = new Date();
    await this.save();
  }
};

// Method to mark as unread
NotificationSchema.methods.markAsUnread = async function(): Promise<void> {
  this.read = false;
  this.readAt = undefined;
  await this.save();
};

// Method to dismiss
NotificationSchema.methods.dismiss = async function(): Promise<void> {
  this.dismissed = true;
  this.dismissedAt = new Date();
  this.interactionType = 'dismissed';
  await this.save();
};

// Method to archive
NotificationSchema.methods.archive = async function(): Promise<void> {
  this.archived = true;
  this.archivedAt = new Date();
  await this.save();
};

// Method to track click
NotificationSchema.methods.trackClick = async function(link?: string): Promise<void> {
  this.clickedAt = new Date();
  this.clickedLink = link || this.link;
  this.interactionType = 'clicked';
  if (!this.read) {
    this.read = true;
    this.readAt = new Date();
  }
  await this.save();
};

// Static method to find user notifications
NotificationSchema.statics.findUserNotifications = function(
  userId: mongoose.Types.ObjectId,
  options: { unreadOnly?: boolean; limit?: number } = {}
): Promise<INotification[]> {
  const query: { user: mongoose.Types.ObjectId; archived: boolean; isExpired: boolean; read?: boolean } = { 
    user: userId,
    archived: false,
    isExpired: false
  };
  
  if (options.unreadOnly) {
    query.read = false;
  }
  
  return this.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .limit(options.limit || 50);
};

// Static method to get unread count
NotificationSchema.statics.getUnreadCount = async function(userId: mongoose.Types.ObjectId): Promise<number> {
  return this.countDocuments({
    user: userId,
    read: false,
    archived: false,
    isExpired: false
  });
};

// Static method to mark all as read
NotificationSchema.statics.markAllAsRead = async function(userId: mongoose.Types.ObjectId): Promise<number> {
  const result = await this.updateMany(
    { user: userId, read: false },
    { $set: { read: true, readAt: new Date() } }
  );
  return result.modifiedCount;
};

// Static method to create booking notification
NotificationSchema.statics.createBookingNotification = async function(
  userId: mongoose.Types.ObjectId,
  bookingId: mongoose.Types.ObjectId,
  type: string,
  title: string,
  message: string
): Promise<INotification> {
  const notification = new this({
    user: userId,
    type: 'booking',
    category: 'transactional',
    title,
    message,
    relatedBooking: bookingId,
    priority: 'high',
    channels: ['in-app', 'email'],
    link: `/bookings/${bookingId}`,
    icon: type === 'confirmed' ? '✅' : type === 'cancelled' ? '❌' : '📋'
  });
  
  return notification.save();
};

// Static method to cleanup expired notifications
NotificationSchema.statics.cleanupExpired = async function(): Promise<number> {
  const result = await this.updateMany(
    {
      expiresAt: { $lt: new Date() },
      isExpired: false
    },
    { $set: { isExpired: true } }
  );
  return result.modifiedCount;
};

// Static method for bulk creation
NotificationSchema.statics.bulkCreate = async function(
  notifications: Partial<INotification>[]
): Promise<any[]> {
  return this.insertMany(notifications);
};

export const Notification = mongoose.model<INotification, INotificationModel>('Notification', NotificationSchema);
