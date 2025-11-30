/**
 * Refund Controller
 * Handles refund request and processing operations
 */

import { Request, Response } from 'express';
import { Refund } from '../models/Refund.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import {
  successResponse,
  errorResponse,
  asyncHandler,
  getPagination,
  getPaginationInfo
} from '../types/api.js';
import { sendEmail } from '../services/emailService.js';

/**
 * @desc    Request a refund
 * @route   POST /api/refunds/request
 * @access  Private
 */
export const requestRefund = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const {
    bookingId,
    reason,
    category,
    comments,
    refundMethod,
    bankDetails
  } = req.body;

  // Validate booking exists and belongs to user
  const booking = await Booking.findById(bookingId)
    .populate('flight', 'departureTime status');

  if (!booking) {
    return errorResponse(res, 404, 'Booking not found');
  }

  if (booking.user?.toString() !== userId) {
    return errorResponse(res, 403, 'You can only request refunds for your own bookings');
  }

  // Check if refund already exists
  const existingRefund = await Refund.findOne({ booking: bookingId });
  if (existingRefund) {
    return errorResponse(res, 400, `A refund request already exists for this booking (ID: ${existingRefund.refundId}, Status: ${existingRefund.status})`);
  }

  // Validate booking is eligible for refund
  if (!['confirmed', 'ticketed', 'cancelled'].includes(booking.bookingStatus)) {
    return errorResponse(res, 400, `Booking with status '${booking.bookingStatus}' is not eligible for refund`);
  }

  // Calculate refund amount based on cancellation policy
  const refundCalculation = calculateRefundAmount(booking);

  // Determine priority based on category and amount
  let priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal';
  if (category === 'flight_cancelled' || category === 'service_issue') {
    priority = 'high';
  }
  if (refundCalculation.netRefund > 50000) {
    priority = 'high';
  }

  // Check for auto-refund eligibility
  const isAutoRefundEligible = 
    category === 'flight_cancelled' ||
    (refundCalculation.refundPercentage >= 90 && refundCalculation.netRefund < 10000);

  // Create refund request
  const refund = new Refund({
    booking: bookingId,
    user: userId,
    payment: booking.payment,
    originalBookingAmount: booking.totalPrice,
    totalRefundAmount: refundCalculation.totalRefund,
    refundItems: refundCalculation.items,
    deductions: refundCalculation.deductions,
    netRefundAmount: refundCalculation.netRefund,
    requestReason: reason,
    requestCategory: category,
    customerComments: comments,
    refundMethod: refundMethod || 'original_payment',
    refundDestination: bankDetails,
    priority,
    isAutoRefundEligible,
    expectedCompletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    timeline: [{
      status: 'pending',
      message: 'Refund request submitted',
      timestamp: new Date()
    }]
  });

  await refund.save();

  // Update booking status
  if (booking.bookingStatus !== 'cancelled') {
    booking.bookingStatus = 'cancelled';
    booking.cancellation = {
      cancelledAt: new Date(),
      cancelledBy: userId,
      reason,
      refundAmount: refundCalculation.netRefund,
      refundStatus: 'pending'
    };
    await booking.save();
  }

  // Process auto-refund if eligible
  if (isAutoRefundEligible) {
    // Queue for automatic processing
    refund.status = 'approved';
    refund.approvedAt = new Date();
    refund.addTimelineEvent('approved', 'Auto-approved based on refund policy');
    // In production, would trigger actual refund processing
  }

  // Send confirmation email
  const user = await User.findById(userId);
  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: `Refund Request Received - ${refund.refundId}`,
      html: `
        <h2>Refund Request Confirmation</h2>
        <p>Dear ${user.firstName},</p>
        <p>We have received your refund request for booking <strong>${booking.bookingReference}</strong>.</p>
        <table style="border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Refund ID</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${refund.refundId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Original Amount</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">₹${(booking.totalPrice || 0).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Refund Amount</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">₹${refundCalculation.netRefund.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Status</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${refund.status.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Expected By</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${refund.expectedCompletionDate?.toLocaleDateString()}</td>
          </tr>
        </table>
        <p>You can track your refund status in the My Bookings section.</p>
      `
    });
  }

  return successResponse(res, 201, 'Refund request submitted successfully', {
    refundId: refund.refundId,
    status: refund.status,
    netRefundAmount: refund.netRefundAmount,
    expectedCompletionDate: refund.expectedCompletionDate,
    breakdown: {
      originalAmount: booking.totalPrice,
      refundableAmount: refundCalculation.totalRefund,
      deductions: refundCalculation.deductions,
      netRefund: refundCalculation.netRefund
    }
  });
});

/**
 * @desc    Get refund status
 * @route   GET /api/refunds/:refundId
 * @access  Private
 */
export const getRefundStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { refundId } = req.params;

  const refund = await Refund.findOne({ refundId })
    .populate('booking', 'bookingReference totalPrice')
    .populate('reviewedBy', 'firstName lastName')
    .populate('approvedBy', 'firstName lastName');

  if (!refund) {
    return errorResponse(res, 404, 'Refund not found');
  }

  // Verify ownership (unless admin)
  const user = await User.findById(userId);
  if (refund.user.toString() !== userId && user?.role !== 'admin') {
    return errorResponse(res, 403, 'Access denied');
  }

  return successResponse(res, 200, 'Refund details retrieved', {
    refund,
    timeline: refund.timeline
  });
});

/**
 * @desc    Get user's refund history
 * @route   GET /api/refunds/my-refunds
 * @access  Private
 */
export const getMyRefunds = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { page = 1, limit = 10, status } = req.query;

  const query: any = { user: userId };
  if (status) query.status = status;

  const { skip } = getPagination(Number(page), Number(limit));

  const [refunds, total] = await Promise.all([
    Refund.find(query)
      .populate('booking', 'bookingReference travelDate')
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Refund.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(limit));

  return successResponse(res, 200, 'Refunds retrieved', refunds, pagination);
});

/**
 * @desc    Admin: Get all refund requests
 * @route   GET /api/admin/refunds
 * @access  Admin
 */
export const getAllRefunds = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    category,
    sortBy = 'requestedAt',
    order = 'desc',
    search
  } = req.query;

  const query: any = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.requestCategory = category;
  if (search) {
    query.$or = [
      { refundId: { $regex: search, $options: 'i' } },
      { requestReason: { $regex: search, $options: 'i' } }
    ];
  }

  const { skip } = getPagination(Number(page), Number(limit));
  const sortOptions: any = { [sortBy as string]: order === 'asc' ? 1 : -1 };

  const [refunds, total, stats] = await Promise.all([
    Refund.find(query)
      .populate('user', 'firstName lastName email phone')
      .populate('booking', 'bookingReference totalPrice travelDate')
      .populate('assignedTo', 'firstName lastName')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit)),
    Refund.countDocuments(query),
    (Refund as any).getStats()
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(limit));

  return successResponse(res, 200, 'Refunds retrieved', { refunds, stats }, pagination);
});

/**
 * @desc    Admin: Review refund request
 * @route   PUT /api/admin/refunds/:refundId/review
 * @access  Admin
 */
export const reviewRefund = asyncHandler(async (req: Request, res: Response) => {
  const adminId = (req as any).user?.id;
  const { refundId } = req.params;
  const { comments, adjustedAmount } = req.body;

  const refund = await Refund.findOne({ refundId });

  if (!refund) {
    return errorResponse(res, 404, 'Refund not found');
  }

  if (!['pending', 'under_review'].includes(refund.status)) {
    return errorResponse(res, 400, `Cannot review refund with status '${refund.status}'`);
  }

  refund.status = 'under_review';
  refund.reviewedBy = adminId;
  refund.reviewedAt = new Date();
  refund.reviewComments = comments;

  if (adjustedAmount !== undefined && adjustedAmount !== refund.netRefundAmount) {
    refund.netRefundAmount = adjustedAmount;
    refund.deductions.otherDeductions += (refund.totalRefundAmount - adjustedAmount - 
      refund.deductions.cancellationFee - refund.deductions.processingFee - refund.deductions.penaltyFee);
    refund.deductions.deductionReasons.push('Admin adjustment');
  }

  refund.timeline.push({
    status: 'under_review',
    message: `Reviewed by admin: ${comments || 'No comments'}`,
    timestamp: new Date(),
    actor: adminId
  });

  await refund.save();

  return successResponse(res, 200, 'Refund reviewed', refund);
});

/**
 * @desc    Admin: Approve refund
 * @route   PUT /api/admin/refunds/:refundId/approve
 * @access  Admin
 */
export const approveRefund = asyncHandler(async (req: Request, res: Response) => {
  const adminId = (req as any).user?.id;
  const { refundId } = req.params;
  const { notes, processImmediately } = req.body;

  const refund = await Refund.findOne({ refundId })
    .populate('booking')
    .populate('user', 'firstName lastName email');

  if (!refund) {
    return errorResponse(res, 404, 'Refund not found');
  }

  if (!['pending', 'under_review'].includes(refund.status)) {
    return errorResponse(res, 400, `Cannot approve refund with status '${refund.status}'`);
  }

  refund.status = 'approved';
  refund.approvedBy = adminId;
  refund.approvedAt = new Date();

  refund.timeline.push({
    status: 'approved',
    message: `Refund approved${notes ? `: ${notes}` : ''}`,
    timestamp: new Date(),
    actor: adminId
  });

  // Update booking refund status
  const booking = await Booking.findById(refund.booking);
  if (booking?.cancellation) {
    booking.cancellation.refundStatus = 'approved';
    await booking.save();
  }

  if (processImmediately) {
    // Initiate refund processing
    refund.status = 'processing';
    refund.timeline.push({
      status: 'processing',
      message: 'Refund processing initiated',
      timestamp: new Date()
    });
  }

  await refund.save();

  // Send approval email
  const user = refund.user as any;
  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: `Refund Approved - ${refund.refundId}`,
      html: `
        <h2>Refund Approved</h2>
        <p>Dear ${user.firstName},</p>
        <p>Good news! Your refund request <strong>${refund.refundId}</strong> has been approved.</p>
        <p><strong>Refund Amount:</strong> ₹${refund.netRefundAmount.toLocaleString()}</p>
        <p><strong>Refund Method:</strong> ${refund.refundMethod.replace(/_/g, ' ')}</p>
        <p>The refund will be processed and credited within 5-7 business days.</p>
      `
    });
  }

  return successResponse(res, 200, 'Refund approved', {
    refundId: refund.refundId,
    status: refund.status,
    netRefundAmount: refund.netRefundAmount
  });
});

/**
 * @desc    Admin: Reject refund
 * @route   PUT /api/admin/refunds/:refundId/reject
 * @access  Admin
 */
export const rejectRefund = asyncHandler(async (req: Request, res: Response) => {
  const adminId = (req as any).user?.id;
  const { refundId } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return errorResponse(res, 400, 'Rejection reason is required');
  }

  const refund = await Refund.findOne({ refundId })
    .populate('user', 'firstName lastName email');

  if (!refund) {
    return errorResponse(res, 404, 'Refund not found');
  }

  if (!['pending', 'under_review'].includes(refund.status)) {
    return errorResponse(res, 400, `Cannot reject refund with status '${refund.status}'`);
  }

  refund.status = 'rejected';
  refund.rejectedBy = adminId;
  refund.rejectedAt = new Date();
  refund.rejectionReason = reason;

  refund.timeline.push({
    status: 'rejected',
    message: `Refund rejected: ${reason}`,
    timestamp: new Date(),
    actor: adminId
  });

  // Update booking
  const booking = await Booking.findById(refund.booking);
  if (booking?.cancellation) {
    booking.cancellation.refundStatus = 'rejected';
    booking.cancellation.rejectionReason = reason;
    await booking.save();
  }

  await refund.save();

  // Send rejection email
  const user = refund.user as any;
  if (user?.email) {
    await sendEmail({
      to: user.email,
      subject: `Refund Request Update - ${refund.refundId}`,
      html: `
        <h2>Refund Request Update</h2>
        <p>Dear ${user.firstName},</p>
        <p>Unfortunately, your refund request <strong>${refund.refundId}</strong> could not be approved.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>If you believe this is an error, please contact our support team.</p>
      `
    });
  }

  return successResponse(res, 200, 'Refund rejected', {
    refundId: refund.refundId,
    status: refund.status,
    reason
  });
});

/**
 * @desc    Admin: Process refund (mark as completed)
 * @route   PUT /api/admin/refunds/:refundId/process
 * @access  Admin
 */
export const processRefund = asyncHandler(async (req: Request, res: Response) => {
  const adminId = (req as any).user?.id;
  const { refundId } = req.params;
  const { transactionId, notes } = req.body;

  const refund = await Refund.findOne({ refundId });

  if (!refund) {
    return errorResponse(res, 404, 'Refund not found');
  }

  if (refund.status !== 'approved' && refund.status !== 'processing') {
    return errorResponse(res, 400, 'Refund must be approved before processing');
  }

  refund.status = 'completed';
  refund.processedAt = new Date();
  refund.actualCompletionDate = new Date();
  refund.transactionId = transactionId;

  refund.timeline.push({
    status: 'completed',
    message: `Refund processed successfully${transactionId ? `. Transaction ID: ${transactionId}` : ''}`,
    timestamp: new Date(),
    actor: adminId
  });

  // Update booking
  const booking = await Booking.findById(refund.booking);
  if (booking) {
    booking.paymentStatus = 'refunded';
    if (booking.cancellation) {
      booking.cancellation.refundStatus = 'processed';
      booking.cancellation.processedAt = new Date();
    }
    await booking.save();
  }

  await refund.save();

  return successResponse(res, 200, 'Refund processed successfully', {
    refundId: refund.refundId,
    status: refund.status,
    transactionId
  });
});

/**
 * @desc    Get refund statistics
 * @route   GET /api/admin/refunds/stats
 * @access  Admin
 */
export const getRefundStats = asyncHandler(async (req: Request, res: Response) => {
  const { period = '30d' } = req.query;

  const now = new Date();
  let startDate: Date;

  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const [
    statusBreakdown,
    categoryBreakdown,
    totalStats,
    dailyTrend
  ] = await Promise.all([
    // Status breakdown
    Refund.aggregate([
      { $match: { requestedAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$netRefundAmount' }
        }
      }
    ]),

    // Category breakdown
    Refund.aggregate([
      { $match: { requestedAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$requestCategory',
          count: { $sum: 1 },
          totalAmount: { $sum: '$netRefundAmount' }
        }
      }
    ]),

    // Overall stats
    Refund.aggregate([
      { $match: { requestedAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          totalRefundAmount: { $sum: '$netRefundAmount' },
          avgRefundAmount: { $avg: '$netRefundAmount' },
          avgProcessingTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                { $subtract: ['$actualCompletionDate', '$requestedAt'] },
                null
              ]
            }
          }
        }
      }
    ]),

    // Daily trend
    Refund.aggregate([
      { $match: { requestedAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$requestedAt' } },
          count: { $sum: 1 },
          amount: { $sum: '$netRefundAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  return successResponse(res, 200, 'Refund statistics retrieved', {
    period,
    statusBreakdown: statusBreakdown.reduce((acc, s) => {
      acc[s._id] = { count: s.count, totalAmount: s.totalAmount };
      return acc;
    }, {} as Record<string, any>),
    categoryBreakdown: categoryBreakdown.reduce((acc, c) => {
      acc[c._id] = { count: c.count, totalAmount: c.totalAmount };
      return acc;
    }, {} as Record<string, any>),
    totals: {
      requests: totalStats[0]?.totalRequests || 0,
      totalAmount: totalStats[0]?.totalRefundAmount || 0,
      avgAmount: Math.round(totalStats[0]?.avgRefundAmount || 0),
      avgProcessingDays: totalStats[0]?.avgProcessingTime 
        ? Math.round(totalStats[0].avgProcessingTime / (1000 * 60 * 60 * 24))
        : null
    },
    dailyTrend
  });
});

// Helper function to calculate refund amount
function calculateRefundAmount(booking: any) {
  const now = new Date();
  const departureTime = booking.flight?.departureTime || booking.travelDate;
  const hoursUntilDeparture = (new Date(departureTime).getTime() - now.getTime()) / (1000 * 60 * 60);

  let refundPercentage = 100;
  let cancellationFee = 0;

  // Standard cancellation policy
  if (hoursUntilDeparture < 0) {
    // After departure - no refund
    refundPercentage = 0;
  } else if (hoursUntilDeparture < 2) {
    // Less than 2 hours - 25% refund
    refundPercentage = 25;
    cancellationFee = booking.totalPrice * 0.25;
  } else if (hoursUntilDeparture < 24) {
    // Less than 24 hours - 50% refund
    refundPercentage = 50;
    cancellationFee = booking.totalPrice * 0.20;
  } else if (hoursUntilDeparture < 72) {
    // Less than 72 hours - 75% refund
    refundPercentage = 75;
    cancellationFee = booking.totalPrice * 0.15;
  } else {
    // More than 72 hours - 90% refund
    refundPercentage = 90;
    cancellationFee = booking.totalPrice * 0.05;
  }

  const totalRefund = booking.totalPrice * (refundPercentage / 100);
  const processingFee = Math.min(totalRefund * 0.02, 500); // 2% or max ₹500
  const netRefund = Math.max(0, totalRefund - cancellationFee - processingFee);

  return {
    totalRefund,
    netRefund,
    refundPercentage,
    items: [{
      type: 'flight' as const,
      description: 'Flight ticket refund',
      originalAmount: booking.totalPrice,
      refundAmount: totalRefund,
      refundPercentage
    }],
    deductions: {
      cancellationFee: Math.round(cancellationFee),
      processingFee: Math.round(processingFee),
      penaltyFee: 0,
      otherDeductions: 0,
      deductionReasons: [
        cancellationFee > 0 ? 'Cancellation fee' : '',
        processingFee > 0 ? 'Processing fee' : ''
      ].filter(Boolean)
    }
  };
}
