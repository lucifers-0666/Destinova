import mongoose, { Schema, Document, Model } from 'mongoose';

// Card Details Interface
export interface ICardDetails {
  last4Digits: string;
  last4?: string; // Alias
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'rupay' | 'other';
  expiryMonth: number;
  expiryYear: number;
  cardholderName?: string;
  cardType: 'credit' | 'debit';
  issuingBank?: string;
}

// UPI Details Interface
export interface IUPIDetails {
  vpa: string;
  provider?: string;
  transactionRef?: string;
}

// Net Banking Details Interface
export interface INetBankingDetails {
  bankName: string;
  bankCode: string;
  accountLast4?: string;
}

// Wallet Details Interface
export interface IWalletDetails {
  walletProvider: string;
  walletId?: string;
}

// EMI Details Interface
export interface IEMIDetails {
  bankName: string;
  tenure: number;
  interestRate: number;
  emiAmount: number;
  processingFee: number;
}

// Refund Details Interface
export interface IRefundDetails {
  amount: number;
  reason: string;
  status: 'initiated' | 'pending' | 'processing' | 'processed' | 'completed' | 'failed';
  initiatedAt: Date;
  processedAt?: Date;
  transactionId?: string;
  refundMethod: 'original' | 'bank_transfer' | 'wallet';
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  failureReason?: string;
  attempts: number;
}

// Payment Document Interface
export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  paymentId: string; // Unique payment identifier (e.g., PAY-XXXXXX)
  orderId: string; // Order ID for payment gateway
  
  // References
  booking: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  
  // Amount Details
  amount: number;
  originalAmount: number;
  discountAmount: number;
  convenienceFee: number;
  taxAmount: number;
  currency: string;
  
  // Payment Method
  paymentMethod: 'card' | 'upi' | 'netbanking' | 'wallet' | 'emi' | 'pay-later' | 'cash';
  paymentGateway: 'stripe' | 'razorpay' | 'paytm' | 'phonepe' | 'manual' | 'other';
  
  // Method-specific Details
  cardDetails?: ICardDetails;
  upiDetails?: IUPIDetails;
  netBankingDetails?: INetBankingDetails;
  walletDetails?: IWalletDetails;
  emiDetails?: IEMIDetails;
  
  // Transaction Details
  transactionId: string;
  gatewayTransactionId?: string;
  gatewayOrderId?: string;
  gatewayResponse?: Record<string, unknown>;
  
  // Status
  status: 'initiated' | 'pending' | 'processing' | 'authorized' | 'captured' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
  statusHistory: {
    status: string;
    timestamp: Date;
    reason?: string;
    metadata?: Record<string, unknown>;
  }[];
  
  // Failure Details
  failureReason?: string;
  failureCode?: string;
  
  // Refund
  refund?: IRefundDetails;
  partialRefunds?: {
    amount: number;
    reason: string;
    transactionId: string;
    processedAt: Date;
  }[];
  totalRefundedAmount: number;
  
  // Verification
  isVerified: boolean;
  verifiedAt?: Date;
  verificationMethod?: 'signature' | 'webhook' | 'manual';
  
  // Gateway IDs (aliases)
  gatewayPaymentId?: string;
  paidAt?: Date; // Alias for completedAt
  
  // 3D Secure
  is3DSecure: boolean;
  threeDSecureResponse?: {
    enrolled: boolean;
    authenticated: boolean;
    eci?: string;
    cavv?: string;
  };
  
  // Risk Assessment
  riskScore?: number;
  riskFlags?: string[];
  isFlagged: boolean;
  flagReason?: string;
  
  // Timestamps
  initiatedAt: Date;
  authorizedAt?: Date;
  capturedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  
  // IP & Device Info
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  
  // Invoice
  invoiceNumber?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  
  // Notes & Metadata
  description?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  updateStatus(status: string, reason?: string): Promise<void>;
  initiateRefund(amount: number, reason: string): Promise<IRefundDetails>;
  verifyPayment(): Promise<boolean>;
}

// Payment Model Interface
export interface IPaymentModel extends Model<IPayment> {
  findByTransactionId(transactionId: string): Promise<IPayment | null>;
  findByBooking(bookingId: mongoose.Types.ObjectId): Promise<IPayment[]>;
  getPaymentStats(startDate: Date, endDate: Date): Promise<any>;
  generatePaymentId(): string;
}

const CardDetailsSchema = new Schema({
  last4Digits: { type: String, required: true, minlength: 4, maxlength: 4 },
  brand: { 
    type: String, 
    enum: ['visa', 'mastercard', 'amex', 'discover', 'rupay', 'other'],
    required: true 
  },
  expiryMonth: { type: Number, required: true, min: 1, max: 12 },
  expiryYear: { type: Number, required: true },
  cardholderName: { type: String },
  cardType: { type: String, enum: ['credit', 'debit'], required: true },
  issuingBank: { type: String }
}, { _id: false });

const UPIDetailsSchema = new Schema({
  vpa: { type: String, required: true },
  provider: { type: String },
  transactionRef: { type: String }
}, { _id: false });

const NetBankingDetailsSchema = new Schema({
  bankName: { type: String, required: true },
  bankCode: { type: String, required: true },
  accountLast4: { type: String }
}, { _id: false });

const WalletDetailsSchema = new Schema({
  walletProvider: { type: String, required: true },
  walletId: { type: String }
}, { _id: false });

const EMIDetailsSchema = new Schema({
  bankName: { type: String, required: true },
  tenure: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  emiAmount: { type: Number, required: true },
  processingFee: { type: Number, default: 0 }
}, { _id: false });

const RefundDetailsSchema = new Schema({
  amount: { type: Number, required: true, min: 0 },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['initiated', 'pending', 'processing', 'completed', 'failed'],
    default: 'initiated'
  },
  initiatedAt: { type: Date, required: true },
  processedAt: { type: Date },
  transactionId: { type: String },
  refundMethod: { 
    type: String, 
    enum: ['original', 'bank_transfer', 'wallet'],
    default: 'original'
  },
  bankDetails: {
    accountNumber: { type: String },
    ifscCode: { type: String },
    accountHolderName: { type: String }
  },
  failureReason: { type: String },
  attempts: { type: Number, default: 1 }
}, { _id: false });

const StatusHistorySchema = new Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reason: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, { _id: false });

const PaymentSchema: Schema<IPayment> = new Schema({
  paymentId: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true
  },
  orderId: { 
    type: String, 
    required: true,
    unique: true
  },
  
  // References
  booking: { 
    type: Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: [true, 'Booking reference is required'],
    index: true 
  },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'User reference is required'],
    index: true 
  },
  
  // Amount Details
  amount: { type: Number, required: true, min: 0 },
  originalAmount: { type: Number, required: true, min: 0 },
  discountAmount: { type: Number, default: 0, min: 0 },
  convenienceFee: { type: Number, default: 0, min: 0 },
  taxAmount: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: 'INR', uppercase: true },
  
  // Payment Method
  paymentMethod: { 
    type: String, 
    enum: ['card', 'upi', 'netbanking', 'wallet', 'emi', 'pay-later', 'cash'],
    required: [true, 'Payment method is required']
  },
  paymentGateway: { 
    type: String, 
    enum: ['stripe', 'razorpay', 'paytm', 'phonepe', 'manual', 'other'],
    required: [true, 'Payment gateway is required']
  },
  
  // Method-specific Details
  cardDetails: CardDetailsSchema,
  upiDetails: UPIDetailsSchema,
  netBankingDetails: NetBankingDetailsSchema,
  walletDetails: WalletDetailsSchema,
  emiDetails: EMIDetailsSchema,
  
  // Transaction Details
  transactionId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  gatewayTransactionId: { type: String },
  gatewayOrderId: { type: String },
  gatewayResponse: { type: Schema.Types.Mixed },
  
  // Status
  status: { 
    type: String, 
    enum: ['initiated', 'pending', 'processing', 'authorized', 'captured', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'initiated',
    index: true
  },
  statusHistory: [StatusHistorySchema],
  
  // Failure Details
  failureReason: { type: String },
  failureCode: { type: String },
  
  // Refund
  refund: RefundDetailsSchema,
  partialRefunds: [{
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    transactionId: { type: String, required: true },
    processedAt: { type: Date, required: true }
  }],
  totalRefundedAmount: { type: Number, default: 0, min: 0 },
  
  // Verification
  isVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  verificationMethod: { type: String, enum: ['signature', 'webhook', 'manual'] },
  
  // 3D Secure
  is3DSecure: { type: Boolean, default: false },
  threeDSecureResponse: {
    enrolled: { type: Boolean },
    authenticated: { type: Boolean },
    eci: { type: String },
    cavv: { type: String }
  },
  
  // Risk Assessment
  riskScore: { type: Number, min: 0, max: 100 },
  riskFlags: [{ type: String }],
  isFlagged: { type: Boolean, default: false },
  flagReason: { type: String },
  
  // Timestamps
  initiatedAt: { type: Date, default: Date.now },
  authorizedAt: { type: Date },
  capturedAt: { type: Date },
  completedAt: { type: Date },
  failedAt: { type: Date },
  
  // IP & Device Info
  ipAddress: { type: String },
  userAgent: { type: String },
  deviceFingerprint: { type: String },
  
  // Invoice
  invoiceNumber: { type: String, unique: true, sparse: true },
  invoiceUrl: { type: String },
  receiptUrl: { type: String },
  
  // Notes & Metadata
  description: { type: String },
  notes: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

// Indexes
PaymentSchema.index({ paymentId: 1 }, { unique: true });
PaymentSchema.index({ transactionId: 1 }, { unique: true });
PaymentSchema.index({ booking: 1 });
PaymentSchema.index({ user: 1, status: 1 });
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ paymentGateway: 1, status: 1 });
PaymentSchema.index({ createdAt: -1 });

// Pre-save middleware
PaymentSchema.pre('save', function() {
  // Add to status history when status changes
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
    
    // Update relevant timestamps
    switch (this.status) {
      case 'authorized':
        this.authorizedAt = new Date();
        break;
      case 'captured':
        this.capturedAt = new Date();
        break;
      case 'completed':
        this.completedAt = new Date();
        break;
      case 'failed':
        this.failedAt = new Date();
        break;
    }
  }
});

// Method to update status
PaymentSchema.methods.updateStatus = async function(status: string, reason?: string): Promise<void> {
  this.status = status;
  if (reason) {
    this.statusHistory[this.statusHistory.length - 1].reason = reason;
  }
  await this.save();
};

// Method to initiate refund
PaymentSchema.methods.initiateRefund = async function(amount: number, reason: string): Promise<IRefundDetails> {
  if (amount > this.amount - this.totalRefundedAmount) {
    throw new Error('Refund amount exceeds available amount');
  }
  
  const refundDetails: IRefundDetails = {
    amount,
    reason,
    status: 'initiated',
    initiatedAt: new Date(),
    refundMethod: 'original',
    attempts: 1
  };
  
  if (amount === this.amount - this.totalRefundedAmount) {
    this.refund = refundDetails;
    this.status = 'refunded';
  } else {
    this.partialRefunds = this.partialRefunds || [];
    this.partialRefunds.push({
      amount,
      reason,
      transactionId: `REF-${Date.now()}`,
      processedAt: new Date()
    });
    this.totalRefundedAmount += amount;
    this.status = 'partially_refunded';
  }
  
  await this.save();
  return refundDetails;
};

// Method to verify payment
PaymentSchema.methods.verifyPayment = async function(): Promise<boolean> {
  // In production, verify with payment gateway
  this.isVerified = true;
  this.verifiedAt = new Date();
  this.verificationMethod = 'manual';
  await this.save();
  return true;
};

// Static method to find by transaction ID
PaymentSchema.statics.findByTransactionId = function(transactionId: string): Promise<IPayment | null> {
  return this.findOne({ transactionId }).populate('booking user');
};

// Static method to find payments by booking
PaymentSchema.statics.findByBooking = function(bookingId: mongoose.Types.ObjectId): Promise<IPayment[]> {
  return this.find({ booking: bookingId }).sort({ createdAt: -1 });
};

// Static method to get payment stats
PaymentSchema.statics.getPaymentStats = async function(startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'captured'] }
      }
    },
    {
      $group: {
        _id: {
          gateway: '$paymentGateway',
          method: '$paymentMethod'
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);
};

// Static method to generate payment ID
PaymentSchema.statics.generatePaymentId = function(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PAY-${timestamp}${random}`;
};

export const Payment = mongoose.model<IPayment, IPaymentModel>('Payment', PaymentSchema);
