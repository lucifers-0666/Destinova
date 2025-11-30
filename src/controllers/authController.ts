import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../models/User.js';
import { 
  successResponse, 
  errorResponse, 
  asyncHandler,
  TokenPayload,
  RegisterBody,
  LoginBody,
  ResetPasswordBody
} from '../types/api.js';

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'destinova-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Token blacklist (in production, use Redis)
const tokenBlacklist = new Set<string>();

/**
 * Generate JWT tokens
 */
const generateTokens = (user: { _id: any; email: string; role: string }) => {
  const payload: TokenPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN 
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(
    { userId: user._id.toString(), type: 'refresh' }, 
    JWT_SECRET, 
    { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone }: RegisterBody = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return errorResponse(res, 400, 'User already exists with this email');
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password: hashedPassword,
    phone,
    verificationToken: hashedVerificationToken,
    isVerified: false,
    role: 'user',
    loyaltyPoints: 0,
    loyaltyTier: 'bronze'
  });

  // Generate tokens
  const tokens = generateTokens(user);

  // TODO: Send verification email
  const verificationUrl = `${FRONTEND_URL}/verify-email/${verificationToken}`;
  console.log(`📧 Verification URL for ${email}: ${verificationUrl}`);

  // Remove sensitive fields from response
  const userResponse = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerified,
    loyaltyPoints: user.loyaltyPoints,
    loyaltyTier: user.loyaltyTier,
    createdAt: user.createdAt
  };

  return successResponse(res, 201, 'Registration successful. Please verify your email.', {
    user: userResponse,
    ...tokens
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginBody = req.body;

  // Find user with password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return errorResponse(res, 401, 'Invalid email or password');
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return errorResponse(res, 401, 'Invalid email or password');
  }

  // Check if account is active
  if (user.isDeleted) {
    return errorResponse(res, 403, 'Account has been deactivated. Please contact support.');
  }

  // Generate tokens
  const tokens = generateTokens(user);

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Remove sensitive fields
  const userResponse = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerified,
    profilePicture: user.profilePicture,
    loyaltyPoints: user.loyaltyPoints,
    loyaltyTier: user.loyaltyTier,
    preferences: user.preferences
  };

  return successResponse(res, 200, 'Login successful', {
    user: userResponse,
    ...tokens
  });
});

/**
 * @desc    Forgot password - Send reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  
  // Don't reveal if user exists
  if (!user) {
    return successResponse(res, 200, 'If an account exists with this email, a password reset link will be sent.');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Save reset token with 1 hour expiry
  user.resetPasswordToken = hashedResetToken;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // TODO: Send reset email
  const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;
  console.log(`📧 Password reset URL for ${email}: ${resetUrl}`);

  return successResponse(res, 200, 'If an account exists with this email, a password reset link will be sent.');
});

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password }: ResetPasswordBody = req.body;

  // Hash the token to compare with stored hash
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) {
    return errorResponse(res, 400, 'Invalid or expired reset token');
  }

  // Hash new password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Update password and clear reset token
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // Generate new tokens
  const tokens = generateTokens(user);

  return successResponse(res, 200, 'Password reset successful', tokens);
});

/**
 * @desc    Verify email with token
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  // Hash the token to compare with stored hash
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Find user with verification token
  const user = await User.findOne({ verificationToken: hashedToken });

  if (!user) {
    return errorResponse(res, 400, 'Invalid verification token');
  }

  if (user.isVerified) {
    return successResponse(res, 200, 'Email already verified');
  }

  // Verify user
  user.isVerified = true;
  user.verificationToken = undefined;
  
  // Award bonus points for email verification
  user.loyaltyPoints = (user.loyaltyPoints || 0) + 100;
  await user.save();

  return successResponse(res, 200, 'Email verified successfully. You earned 100 loyalty points!');
});

/**
 * @desc    Refresh JWT token
 * @route   POST /api/auth/refresh-token
 * @access  Public (with refresh token)
 */
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return errorResponse(res, 401, 'Refresh token is required');
  }

  // Check if token is blacklisted
  if (tokenBlacklist.has(token)) {
    return errorResponse(res, 401, 'Token has been invalidated');
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; type: string };
    
    if (decoded.type !== 'refresh') {
      return errorResponse(res, 401, 'Invalid token type');
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || user.isDeleted) {
      return errorResponse(res, 401, 'User not found or deactivated');
    }

    // Blacklist old refresh token
    tokenBlacklist.add(token);

    // Generate new tokens
    const tokens = generateTokens(user);

    return successResponse(res, 200, 'Token refreshed successfully', tokens);
  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired refresh token');
  }
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const { refreshToken: token } = req.body;

  // Blacklist access token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const accessToken = authHeader.split(' ')[1];
    tokenBlacklist.add(accessToken);
  }

  // Blacklist refresh token
  if (token) {
    tokenBlacklist.add(token);
  }

  return successResponse(res, 200, 'Logged out successfully');
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id).select('-password');
  
  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  return successResponse(res, 200, 'User retrieved successfully', user);
});

/**
 * Check if token is blacklisted (exported for middleware)
 */
export const isTokenBlacklisted = (token: string): boolean => {
  return tokenBlacklist.has(token);
};
