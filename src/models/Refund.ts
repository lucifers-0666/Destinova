/**
 * Refund Model
 * Tracks refund requests and processing
 */

import mongoose, { Document, Schema, Types } from 'mongoose';

// Refund item interface
interface IRefundItem {
  type: 'flight' | 'hotel' | 'insurance' | 'seat' | 'meal' | 'baggage' | 'other';
  description: string;
  originalAmount: number;
  refundAmount: number;
  refundPercentage: number;
}

// Refund timeline event
interface IRefundTimelineEvent {
  status: string;
  message: string;
  timestamp: Date;
  actor?: Types.ObjectId;
  actorName?: string;
}

// Refund interface
export interface IRefund extends Document {
  refundId: string;
  booking: Types.ObjectId;
  user: Types.ObjectId;
  payment?: Types.ObjectId;
  
  // Refund amounts
  originalBookingAmount: number;
  totalRefundAmount: number;
  refundItems: IRefundItem[];
  deductions: {
    cancellationFee: number;
    processingFee: number;
    penaltyFee: number;
    otherDeductions: number;
    deductionReasons: string[];
  };
  netRefundAmount: number;
  
  // Request details
  requestedAt: Date;
  requestReason: string;
  requestCategory: 'cancellation' | 'duplicate_booking' | 'flight_cancelled' | 'schedule_change' | 'service_issue' | 'other';
  customerComments?: string;
  attachments?: string[];
  
  // Processing
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'processing' | 'processed' | 'completed' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: Types.ObjectId;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  reviewComments?: string;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  rejectedBy?: Types.ObjectId;
  rejectedAt?: Date;
  rejectionReason?: string;
  
  // Refund method
  refundMethod: 'original_payment' | 'bank_transfer' | 'wallet_credit' | 'voucher';
  refundDestination?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolderName?: string;
    upiId?: string;
  };
  
  // Processing details
  processedAt?: Date;
  transactionId?: string;
  gatewayResponse?: any;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  
  // Timeline
  timeline: IRefundTimelineEvent[];
  
  // Auto-refund eligibility
  isAutoRefundEligible: boolean;
  autoRefundAttempted: boolean;
  autoRefundFailureReason?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  addTimelineEvent(status: string, message: string, actor?: Types.ObjectId, actorName?: string): Promise<void>;
  calculateNetRefund(): number;
}

// Refund item schema
const RefundItemSchema = new Schema({
  type: {
    type: String,
    enum: ['flight', 'hotel', 'insurance', 'seat', 'meal', 'baggage', 'other'],
    required: true
  },
  description: { type: String, required: true },
  originalAmount: { type: Number, required: true, min: 0 },
  refundAmount: { type: Number, required: true, min: 0 },
  refundPercentage: { type: Number, min: 0, max: 100 }
}, { _id: false });

// Timeline event schema
const TimelineEventSchema = new Schema({
  status: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  actor: { type: Schema.Types.ObjectId, ref: 'User' },
  actorName: String
}, { _id: false });

// Refund schema
const RefundSchema = new Schema<IRefund>({
  refundId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment'
  },
  
  // Amounts
  originalBookingAmount: { type: Number, required: true, min: 0 },
  totalRefundAmount: { type: Number, required: true, min: 0 },
  refundItems: [RefundItemSchema],
  deductions: {
    cancellationFee: { type: Number, default: 0, min: 0 },
    processingFee: { type: Number, default: 0, min: 0 },
    penaltyFee: { type: Number, default: 0, min: 0 },
    otherDeductions: { type: Number, default: 0, min: 0 },
    deductionReasons: [String]
  },
  netRefundAmount: { type: Number, required: true, min: 0 },
  
  // Request
  requestedAt: { type: Date, default: Date.now },
  requestReason: { type: String, required: true },
  requestCategory: {
    type: String,
    enum: ['cancellation', 'duplicate_booking', 'flight_cancelled', 'schedule_change', 'service_issue', 'other'],
    required: true
  },
  customerComments: String,
  attachments: [String],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'processing', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  
  // Review & Approval
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  reviewComments: String,
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,
  rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  rejectedAt: Date,
  rejectionReason: String,
  
  // Refund method
  refundMethod: {
    type: String,
    enum: ['original_payment', 'bank_transfer', 'wallet_credit', 'voucher'],
    default: 'original_payment'
  },
  refundDestination: {
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    upiId: String
  },
  
  // Processing
  processedAt: Date,
  transactionId: String,
  gatewayResponse: Schema.Types.Mixed,
  expectedCompletionDate: Date,
  actualCompletionDate: Date,
  
  // Timeline
  timeline: [TimelineEventSchema],
  
  // Auto-refund
  isAutoRefundEligible: { type: Boolean, default: false },
  autoRefundAttempted: { type: Boolean, default: false },
  autoRefundFailureReason: String
}, {
  timestamps: true
});

// Generate unique refund ID
RefundSchema.pre('save', async function() {
  if (!this.refundId) {
    const date = new Date();
    const prefix = 'REF';
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.refundId = `${prefix}${year}${month}${random}`;
  }
});

// Add timeline event
RefundSchema.methods.addTimelineEvent = async function(
  status: string, 
  message: string, 
  actor?: Types.ObjectId,
  actorName?: string
) {
  this.timeline.push({
    status,
    message,
    timestamp: new Date(),
    actor,
    actorName
  });
  await this.save();
};

// Calculate net refund
RefundSchema.methods.calculateNetRefund = function(): number {
  const totalDeductions = 
    (this.deductions?.cancellationFee || 0) +
    (this.deductions?.processingFee || 0) +
    (this.deductions?.penaltyFee || 0) +
    (this.deductions?.otherDeductions || 0);
  
  this.netRefundAmount = Math.max(0, this.totalRefundAmount - totalDeductions);
  return this.netRefundAmount;
};

// Static methods
RefundSchema.statics.findByBooking = function(bookingId: Types.ObjectId) {
  return this.findOne({ booking: bookingId });
};

RefundSchema.statics.findPending = function() {
  return this.find({ status: { $in: ['pending', 'under_review'] } })
    .sort({ priority: -1, requestedAt: 1 });
};

RefundSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$netRefundAmount' }
      }
    }
  ]);
  
  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      count: stat.count,
      totalAmount: stat.totalAmount
    };
    return acc;
  }, {});
};

// Indexes
RefundSchema.index({ status: 1, requestedAt: -1 });
RefundSchema.index({ user: 1, requestedAt: -1 });
RefundSchema.index({ requestCategory: 1 });
RefundSchema.index({ priority: -1, requestedAt: 1 });

export const Refund = mongoose.model<IRefund>('Refund', RefundSchema);
