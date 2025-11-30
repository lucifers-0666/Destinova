import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Passport Details Interface
export interface IPassportDetails {
  number?: string;
  nationality?: string;
  expiryDate?: Date;
  issuingCountry?: string;
}

// User Preferences Interface
export interface IUserPreferences {
  currency: string;
  language: string;
  newsletter: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  seatPreference?: 'window' | 'aisle' | 'middle';
  mealPreference?: string;
}

// Address Interface
export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

// Saved Address Interface
export interface ISavedAddress {
  _id?: mongoose.Types.ObjectId;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

// User Document Interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: IAddress;
  passport?: IPassportDetails;
  preferences: IUserPreferences;
  profileImage?: string;
  profilePicture?: string; // Alias for profileImage
  role: 'user' | 'admin';
  loyaltyPoints: number;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  isVerified: boolean;
  verificationToken?: string;
  verificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  resetPasswordToken?: string; // Alias
  resetPasswordExpires?: Date; // Alias
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date;
  deletionReason?: string;
  isBlocked: boolean;
  blockReason?: string;
  blockedAt?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  savedCards?: {
    cardId: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
  }[];
  savedAddresses?: ISavedAddress[];
  frequentFlyers?: {
    airline: string;
    memberId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  matchPassword(enteredPassword: string): Promise<boolean>;
  getFullName(): string;
  isLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  createPasswordResetToken(): Promise<string>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User Model Interface (for statics)
export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const AddressSchema = new Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true },
  postalCode: { type: String, trim: true }
}, { _id: false });

const PassportSchema = new Schema({
  number: { type: String, trim: true },
  nationality: { type: String, trim: true },
  expiryDate: { type: Date },
  issuingCountry: { type: String, trim: true }
}, { _id: false });

const PreferencesSchema = new Schema({
  currency: { type: String, default: 'INR' },
  language: { type: String, default: 'en' },
  newsletter: { type: Boolean, default: true },
  smsNotifications: { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: true },
  seatPreference: { type: String, enum: ['window', 'aisle', 'middle'] },
  mealPreference: { type: String }
}, { _id: false });

const SavedCardSchema = new Schema({
  cardId: { type: String, required: true },
  last4: { type: String, required: true },
  brand: { type: String, required: true },
  expiryMonth: { type: Number, required: true },
  expiryYear: { type: Number, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const FrequentFlyerSchema = new Schema({
  airline: { type: String, required: true },
  memberId: { type: String, required: true }
}, { _id: false });

const UserSchema: Schema<IUser> = new Schema({
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  phone: { 
    type: String,
    trim: true,
    match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 'Please enter a valid phone number']
  },
  dateOfBirth: { type: Date },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  address: AddressSchema,
  passport: PassportSchema,
  preferences: {
    type: PreferencesSchema,
    default: () => ({})
  },
  profileImage: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  loyaltyPoints: { 
    type: Number, 
    default: 0,
    min: 0
  },
  loyaltyTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: { type: String, select: false },
  verificationExpires: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
  deletionReason: { type: String },
  isBlocked: { type: Boolean, default: false },
  blockReason: { type: String },
  blockedAt: { type: Date },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, select: false },
  savedCards: [SavedCardSchema],
  savedAddresses: [{
    label: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  }],
  frequentFlyers: [FrequentFlyerSchema]
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret: any) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { sparse: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ loyaltyPoints: -1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save hook to hash password
UserSchema.pre('save', async function() {
  // Only hash password if it's modified
  if (!this.isModified('password')) {
    return;
  }
  
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
});

// Pre-save hook to update loyalty tier based on points
UserSchema.pre('save', function() {
  if (this.isModified('loyaltyPoints')) {
    if (this.loyaltyPoints >= 100000) {
      this.loyaltyTier = 'platinum';
    } else if (this.loyaltyPoints >= 50000) {
      this.loyaltyTier = 'gold';
    } else if (this.loyaltyPoints >= 20000) {
      this.loyaltyTier = 'silver';
    } else {
      this.loyaltyTier = 'bronze';
    }
  }
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get full name
UserSchema.methods.getFullName = function(): string {
  return `${this.firstName} ${this.lastName}`;
};

// Method to check if account is locked
UserSchema.methods.isLocked = function(): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Method to increment login attempts
UserSchema.methods.incrementLoginAttempts = async function(): Promise<void> {
  // Reset if lock has expired
  if (this.lockUntil && this.lockUntil < new Date()) {
    await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
    return;
  }
  
  const updates: { $inc: { loginAttempts: number }; $set?: { lockUntil: Date } } = { 
    $inc: { loginAttempts: 1 } 
  };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: new Date(Date.now() + 2 * 60 * 60 * 1000) };
  }
  
  await this.updateOne(updates);
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = async function(): Promise<void> {
  await this.updateOne({
    $set: { loginAttempts: 0, lastLogin: new Date() },
    $unset: { lockUntil: 1 }
  });
};

// Method to create password reset token
UserSchema.methods.createPasswordResetToken = async function(): Promise<string> {
  // Generate random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and store in database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Set expiry to 10 minutes from now
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  
  await this.save({ validateBeforeSave: false });
  
  // Return unhashed token (this is what we send to user)
  return resetToken;
};

// Method to compare password (alias for matchPassword)
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find by email
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

export const User = mongoose.model<IUser, IUserModel>('User', UserSchema);