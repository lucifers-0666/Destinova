import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Booking } from '../models/Booking.js';
import {
  successResponse,
  errorResponse,
  asyncHandler,
  ChangePasswordBody
} from '../types/api.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const user = await User.findById(userId).select('-password');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  return successResponse(res, 200, 'Profile retrieved successfully', user);
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const allowedUpdates = [
    'firstName',
    'lastName',
    'phone',
    'dateOfBirth',
    'gender',
    'nationality',
    'preferences',
    'passportDetails',
    'savedAddresses'
  ];

  // Filter out non-allowed fields
  const updates: any = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  return successResponse(res, 200, 'Profile updated successfully', user);
});

/**
 * @desc    Change password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { currentPassword, newPassword }: ChangePasswordBody = req.body;

  // Get user with password
  const user = await User.findById(userId).select('+password');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    return errorResponse(res, 400, 'Current password is incorrect');
  }

  // Hash new password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  user.password = hashedPassword;
  await user.save();

  return successResponse(res, 200, 'Password changed successfully');
});

/**
 * @desc    Upload profile picture
 * @route   POST /api/users/profile/picture
 * @access  Private
 */
export const uploadProfilePicture = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  // Check if file was uploaded
  if (!req.file) {
    return errorResponse(res, 400, 'No file uploaded');
  }

  // Get file path (in production, this would be a cloud storage URL)
  const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    userId,
    { profilePicture: profilePictureUrl },
    { new: true }
  ).select('-password');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  return successResponse(res, 200, 'Profile picture uploaded successfully', {
    profilePicture: user.profilePicture
  });
});

/**
 * @desc    Delete user account (soft delete)
 * @route   DELETE /api/users/account
 * @access  Private
 */
export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { password, reason } = req.body;

  // Get user with password
  const user = await User.findById(userId).select('+password');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Verify password for confirmation
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return errorResponse(res, 400, 'Password is incorrect');
  }

  // Check for pending bookings
  const pendingBookings = await Booking.countDocuments({
    user: userId,
    status: { $in: ['pending', 'confirmed'] },
    'flight.departureTime': { $gte: new Date() }
  });

  if (pendingBookings > 0) {
    return errorResponse(
      res,
      400,
      `You have ${pendingBookings} upcoming booking(s). Please cancel them before deleting your account.`
    );
  }

  // Soft delete user
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.deletionReason = reason;
  user.email = `deleted_${user._id}_${user.email}`; // Prevent email reuse issues
  await user.save();

  return successResponse(res, 200, 'Account deleted successfully');
});

/**
 * @desc    Get user's booking statistics
 * @route   GET /api/users/stats
 * @access  Private
 */
export const getUserBookingStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const stats = await Booking.aggregate([
    {
      $match: { user: userId }
    },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        completedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        upcomingBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
        },
        totalSpent: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$pricing.total', 0] }
        },
        totalTrips: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    }
  ]);

  // Get user's loyalty info
  const user = await User.findById(userId).select('loyaltyPoints loyaltyTier');

  // Get frequently visited destinations
  const topDestinations = await Booking.aggregate([
    {
      $match: { user: userId, status: { $in: ['confirmed', 'completed'] } }
    },
    {
      $lookup: {
        from: 'flights',
        localField: 'flight',
        foreignField: '_id',
        as: 'flightDetails'
      }
    },
    {
      $unwind: '$flightDetails'
    },
    {
      $group: {
        _id: '$flightDetails.destination.city',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 5
    }
  ]);

  return successResponse(res, 200, 'User statistics retrieved', {
    bookingStats: stats[0] || {
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      upcomingBookings: 0,
      totalSpent: 0,
      totalTrips: 0
    },
    loyalty: {
      points: user?.loyaltyPoints || 0,
      tier: user?.loyaltyTier || 'bronze'
    },
    topDestinations
  });
});

/**
 * @desc    Update notification preferences
 * @route   PUT /api/users/preferences/notifications
 * @access  Private
 */
export const updateNotificationPreferences = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { email, push, sms, marketing } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        'preferences.notifications.email': email,
        'preferences.notifications.push': push,
        'preferences.notifications.sms': sms,
        'preferences.notifications.marketing': marketing
      }
    },
    { new: true }
  ).select('preferences.notifications');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  return successResponse(res, 200, 'Notification preferences updated', user.preferences);
});

/**
 * @desc    Add saved address
 * @route   POST /api/users/addresses
 * @access  Private
 */
export const addSavedAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const addressData = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // If this is set as default, unset other defaults
  if (addressData.isDefault) {
    user.savedAddresses = user.savedAddresses?.map((addr: any) => ({
      ...addr,
      isDefault: false
    })) || [];
  }

  user.savedAddresses = user.savedAddresses || [];
  user.savedAddresses.push(addressData);
  await user.save();

  return successResponse(res, 201, 'Address added successfully', user.savedAddresses);
});

/**
 * @desc    Delete saved address
 * @route   DELETE /api/users/addresses/:addressId
 * @access  Private
 */
export const deleteSavedAddress = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { addressId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  user.savedAddresses = user.savedAddresses?.filter(
    (addr: any) => addr._id?.toString() !== addressId
  ) || [];
  
  await user.save();

  return successResponse(res, 200, 'Address deleted successfully');
});

/**
 * @desc    Redeem loyalty points
 * @route   POST /api/users/loyalty/redeem
 * @access  Private
 */
export const redeemLoyaltyPoints = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { points, bookingId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  if (!user.loyaltyPoints || user.loyaltyPoints < points) {
    return errorResponse(res, 400, 'Insufficient loyalty points');
  }

  // Minimum redemption
  if (points < 500) {
    return errorResponse(res, 400, 'Minimum 500 points required for redemption');
  }

  // Calculate discount (1 point = ₹1)
  const discountAmount = points;

  // If booking ID provided, apply to booking
  if (bookingId) {
    const booking = await Booking.findOne({ _id: bookingId, user: userId, status: 'pending' });
    
    if (!booking) {
      return errorResponse(res, 404, 'Pending booking not found');
    }

    const pricingTotal = booking.pricing?.total || 0;
    if (discountAmount > pricingTotal * 0.5) {
      return errorResponse(res, 400, 'Cannot redeem more than 50% of booking value');
    }

    // Update booking with discount
    if (booking.pricing) {
      (booking.pricing as any).loyaltyDiscount = discountAmount;
      booking.pricing.total -= discountAmount;
    }
    await booking.save();
  }

  // Deduct points
  user.loyaltyPoints -= points;
  await user.save();

  return successResponse(res, 200, 'Points redeemed successfully', {
    pointsRedeemed: points,
    discountAmount,
    remainingPoints: user.loyaltyPoints
  });
});
