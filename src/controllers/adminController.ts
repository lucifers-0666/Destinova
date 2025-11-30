import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Booking } from '../models/Booking.js';
import { Flight } from '../models/Flight.js';
import { Payment } from '../models/Payment.js';
import {
  successResponse,
  errorResponse,
  asyncHandler,
  getPagination,
  getPaginationInfo
} from '../types/api.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Parallel queries for dashboard stats
  const [
    totalUsers,
    newUsersToday,
    totalBookings,
    todayBookings,
    totalRevenue,
    todayRevenue,
    upcomingFlights,
    recentTransactions
  ] = await Promise.all([
    // Total users
    User.countDocuments({ isDeleted: { $ne: true } }),
    
    // New users today
    User.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
      isDeleted: { $ne: true }
    }),
    
    // Total bookings
    Booking.countDocuments(),
    
    // Today's bookings
    Booking.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    }),
    
    // Total revenue (last 30 days)
    Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]),
    
    // Today's revenue
    Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: today, $lt: tomorrow }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]),
    
    // Upcoming flights (next 24 hours)
    Flight.countDocuments({
      departureTime: { $gte: new Date(), $lt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
      status: { $in: ['scheduled', 'on-time', 'delayed'] }
    }),
    
    // Recent transactions
    Payment.find({ status: 'completed' })
      .populate('user', 'firstName lastName email')
      .populate('booking', 'bookingReference')
      .sort({ createdAt: -1 })
      .limit(10)
  ]);

  // Booking status breakdown
  const bookingStatusBreakdown = await Booking.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Revenue trend (last 7 days)
  const revenueTrend = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$amount' },
        transactions: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return successResponse(res, 200, 'Dashboard statistics retrieved', {
    overview: {
      totalUsers,
      newUsersToday,
      totalBookings,
      todayBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayRevenue: todayRevenue[0]?.total || 0,
      upcomingFlights
    },
    bookingStatusBreakdown: bookingStatusBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>),
    revenueTrend,
    recentTransactions
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    search,
    role,
    isVerified,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  // Build query
  const query: any = { isDeleted: { $ne: true } };

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  if (role) query.role = role;
  if (isVerified !== undefined) query.isVerified = isVerified === 'true';

  const { skip } = getPagination(Number(page), Number(limit));
  const sortOptions: any = { [sortBy as string]: order === 'asc' ? 1 : -1 };

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(limit));

  return successResponse(res, 200, 'Users retrieved successfully', users, pagination);
});

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password');

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Get user's booking history
  const bookingHistory = await Booking.find({ user: id })
    .populate('flight', 'flightNumber airline origin destination departureTime')
    .sort({ createdAt: -1 })
    .limit(10);

  return successResponse(res, 200, 'User retrieved successfully', {
    user,
    recentBookings: bookingHistory
  });
});

/**
 * @desc    Update user status (block/unblock)
 * @route   PUT /api/admin/users/:id/status
 * @access  Private/Admin
 */
export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isBlocked, reason } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return errorResponse(res, 404, 'User not found');
  }

  // Prevent blocking admin users
  if (user.role === 'admin' && isBlocked) {
    return errorResponse(res, 400, 'Cannot block admin users');
  }

  user.isBlocked = isBlocked;
  user.blockReason = isBlocked ? reason : undefined;
  user.blockedAt = isBlocked ? new Date() : undefined;
  await user.save();

  return successResponse(res, 200, `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, {
    userId: user._id,
    isBlocked: user.isBlocked
  });
});

/**
 * @desc    Get revenue report
 * @route   GET /api/admin/reports/revenue
 * @access  Private/Admin
 */
export const getRevenueReport = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, groupBy = 'day' } = req.query;

  const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate as string) : new Date();

  let dateFormat: string;
  switch (groupBy) {
    case 'month':
      dateFormat = '%Y-%m';
      break;
    case 'week':
      dateFormat = '%Y-W%V';
      break;
    default:
      dateFormat = '%Y-%m-%d';
  }

  const revenueData = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        revenue: { $sum: '$amount' },
        transactions: { $sum: 1 },
        avgTransactionValue: { $avg: '$amount' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Calculate totals
  const totals = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        avgTransactionValue: { $avg: '$amount' }
      }
    }
  ]);

  // Revenue by payment method
  const revenueByMethod = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: '$method',
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  return successResponse(res, 200, 'Revenue report generated', {
    period: { start, end, groupBy },
    summary: totals[0] || { totalRevenue: 0, totalTransactions: 0, avgTransactionValue: 0 },
    timeline: revenueData,
    byPaymentMethod: revenueByMethod
  });
});

/**
 * @desc    Manage refund requests
 * @route   GET /api/admin/refunds
 * @access  Private/Admin
 */
export const getRefundRequests = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, status } = req.query;

  const query: any = {
    'cancellation.refundAmount': { $gt: 0 }
  };

  if (status === 'pending') {
    query['cancellation.refundStatus'] = { $ne: 'processed' };
  } else if (status === 'processed') {
    query['cancellation.refundStatus'] = 'processed';
  }

  const { skip } = getPagination(Number(page), Number(limit));

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('user', 'firstName lastName email')
      .populate('flight', 'flightNumber')
      .sort({ 'cancellation.cancelledAt': -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(limit));

  return successResponse(res, 200, 'Refund requests retrieved', bookings, pagination);
});

/**
 * @desc    Approve/Reject refund
 * @route   PUT /api/admin/refunds/:bookingId
 * @access  Private/Admin
 */
export const processRefundRequest = asyncHandler(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { action, reason } = req.body; // action: 'approve' or 'reject'

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return errorResponse(res, 404, 'Booking not found');
  }

  if (!booking.cancellation?.refundAmount) {
    return errorResponse(res, 400, 'No refund pending for this booking');
  }

  if (action === 'approve') {
    // TODO: Process refund through payment gateway
    booking.cancellation.refundStatus = 'processed';
    booking.cancellation.processedAt = new Date();
    booking.paymentStatus = 'refunded';
  } else if (action === 'reject') {
    booking.cancellation.refundStatus = 'rejected';
    booking.cancellation.rejectionReason = reason;
  }

  await booking.save();

  return successResponse(res, 200, `Refund ${action}d successfully`, {
    bookingReference: booking.bookingReference,
    refundStatus: booking.cancellation.refundStatus
  });
});

/**
 * @desc    Get flight occupancy report
 * @route   GET /api/admin/reports/occupancy
 * @access  Private/Admin
 */
export const getOccupancyReport = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const start = startDate ? new Date(startDate as string) : new Date();
  const end = endDate ? new Date(endDate as string) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const occupancyData = await Flight.aggregate([
    {
      $match: {
        departureTime: { $gte: start, $lte: end },
        status: { $in: ['scheduled', 'on-time', 'delayed', 'completed'] }
      }
    },
    {
      $project: {
        flightNumber: 1,
        airline: 1,
        origin: 1,
        destination: 1,
        departureTime: 1,
        totalSeats: 1,
        seatsAvailable: 1,
        bookedSeats: { $subtract: ['$totalSeats', '$seatsAvailable'] },
        occupancyRate: {
          $multiply: [
            { $divide: [{ $subtract: ['$totalSeats', '$seatsAvailable'] }, '$totalSeats'] },
            100
          ]
        }
      }
    },
    {
      $group: {
        _id: '$airline.name',
        avgOccupancy: { $avg: '$occupancyRate' },
        totalFlights: { $sum: 1 },
        totalSeats: { $sum: '$totalSeats' },
        bookedSeats: { $sum: '$bookedSeats' }
      }
    },
    {
      $sort: { avgOccupancy: -1 }
    }
  ]);

  // Overall statistics
  const overallStats = await Flight.aggregate([
    {
      $match: {
        departureTime: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: null,
        totalFlights: { $sum: 1 },
        totalSeats: { $sum: '$totalSeats' },
        totalAvailable: { $sum: '$seatsAvailable' },
        avgOccupancy: {
          $avg: {
            $multiply: [
              { $divide: [{ $subtract: ['$totalSeats', '$seatsAvailable'] }, '$totalSeats'] },
              100
            ]
          }
        }
      }
    }
  ]);

  return successResponse(res, 200, 'Occupancy report generated', {
    period: { start, end },
    overall: overallStats[0] || { totalFlights: 0, totalSeats: 0, avgOccupancy: 0 },
    byAirline: occupancyData
  });
});

/**
 * @desc    Export data as CSV
 * @route   GET /api/admin/export/:type
 * @access  Private/Admin
 */
export const exportData = asyncHandler(async (req: Request, res: Response) => {
  const { type } = req.params;
  const { startDate, endDate } = req.query;

  const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate as string) : new Date();

  let data: any[] = [];
  let filename: string;
  let headers: string[];

  switch (type) {
    case 'bookings':
      data = await Booking.find({
        createdAt: { $gte: start, $lte: end }
      })
        .populate('user', 'firstName lastName email')
        .populate('flight', 'flightNumber')
        .lean();
      
      filename = `bookings_${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}.csv`;
      headers = ['Booking Reference', 'User Email', 'Flight', 'Status', 'Total', 'Created At'];
      
      data = data.map((b: any) => ({
        bookingReference: b.bookingReference,
        userEmail: b.user?.email,
        flight: b.flight?.flightNumber,
        status: b.status,
        total: b.pricing?.total,
        createdAt: b.createdAt
      }));
      break;

    case 'payments':
      data = await Payment.find({
        createdAt: { $gte: start, $lte: end }
      })
        .populate('user', 'email')
        .populate('booking', 'bookingReference')
        .lean();
      
      filename = `payments_${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}.csv`;
      headers = ['Transaction ID', 'User Email', 'Booking Reference', 'Amount', 'Status', 'Date'];
      
      data = data.map((p: any) => ({
        transactionId: p.gatewayPaymentId,
        userEmail: p.user?.email,
        bookingReference: p.booking?.bookingReference,
        amount: p.amount,
        status: p.status,
        date: p.createdAt
      }));
      break;

    case 'users':
      data = await User.find({
        createdAt: { $gte: start, $lte: end },
        isDeleted: { $ne: true }
      })
        .select('-password')
        .lean();
      
      filename = `users_${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}.csv`;
      headers = ['Name', 'Email', 'Phone', 'Role', 'Verified', 'Loyalty Points', 'Created At'];
      
      data = data.map((u: any) => ({
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        phone: u.phone,
        role: u.role,
        verified: u.isVerified,
        loyaltyPoints: u.loyaltyPoints,
        createdAt: u.createdAt
      }));
      break;

    default:
      return errorResponse(res, 400, 'Invalid export type');
  }

  // Convert to CSV
  const csvRows = [headers.join(',')];
  data.forEach((row: any) => {
    csvRows.push(Object.values(row).map((v: any) => `"${v || ''}"`).join(','));
  });
  const csv = csvRows.join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.send(csv);
});

/**
 * @desc    Get comprehensive analytics for charts
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
export const getAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { period = '30d' } = req.query;
  
  // Calculate date range based on period
  const now = new Date();
  let startDate: Date;
  let groupByFormat: string;
  
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      groupByFormat = '%Y-%m-%d';
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupByFormat = '%Y-%m-%d';
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      groupByFormat = '%Y-%U'; // Week
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      groupByFormat = '%Y-%m';
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupByFormat = '%Y-%m-%d';
  }

  // Parallel analytics queries
  const [
    revenueByDay,
    bookingsByDay,
    userGrowth,
    topDestinations,
    topRoutes,
    bookingsByClass,
    paymentMethods,
    flightStatusBreakdown,
    avgBookingValue,
    conversionRate,
    cancelledBookings
  ] = await Promise.all([
    // Revenue trend
    Payment.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: groupByFormat, date: '$createdAt' } },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    
    // Bookings trend
    Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: groupByFormat, date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    
    // User growth
    User.aggregate([
      { $match: { createdAt: { $gte: startDate }, isDeleted: { $ne: true } } },
      {
        $group: {
          _id: { $dateToString: { format: groupByFormat, date: '$createdAt' } },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    
    // Top destinations
    Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $lookup: { from: 'flights', localField: 'flight', foreignField: '_id', as: 'flightDetails' } },
      { $unwind: { path: '$flightDetails', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$flightDetails.destination',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 10 }
    ]),
    
    // Top routes
    Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $lookup: { from: 'flights', localField: 'flight', foreignField: '_id', as: 'flightDetails' } },
      { $unwind: { path: '$flightDetails', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: {
            origin: '$flightDetails.origin',
            destination: '$flightDetails.destination'
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 10 }
    ]),
    
    // Bookings by travel class
    Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$travelClass',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]),
    
    // Payment methods breakdown
    Payment.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]),
    
    // Flight status breakdown
    Flight.aggregate([
      { $match: { departureTime: { $gte: startDate } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]),
    
    // Average booking value
    Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          avgValue: { $avg: '$totalPrice' },
          minValue: { $min: '$totalPrice' },
          maxValue: { $max: '$totalPrice' }
        }
      }
    ]),
    
    // Conversion rate (users who made at least one booking)
    Promise.all([
      User.countDocuments({ createdAt: { $gte: startDate }, isDeleted: { $ne: true } }),
      Booking.distinct('user', { createdAt: { $gte: startDate } })
    ]),
    
    // Cancelled bookings
    Booking.aggregate([
      { $match: { bookingStatus: 'cancelled', createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: groupByFormat, date: '$createdAt' } },
          count: { $sum: 1 },
          lostRevenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  // Calculate conversion rate
  const [totalNewUsers, usersWithBookings] = conversionRate;
  const conversionRatePercent = totalNewUsers > 0 
    ? ((usersWithBookings.length / totalNewUsers) * 100).toFixed(2)
    : 0;

  return successResponse(res, 200, 'Analytics retrieved successfully', {
    period,
    dateRange: { start: startDate, end: now },
    charts: {
      revenue: {
        labels: revenueByDay.map(r => r._id),
        data: revenueByDay.map(r => r.revenue),
        transactions: revenueByDay.map(r => r.count)
      },
      bookings: {
        labels: bookingsByDay.map(b => b._id),
        data: bookingsByDay.map(b => b.count)
      },
      userGrowth: {
        labels: userGrowth.map(u => u._id),
        data: userGrowth.map(u => u.newUsers)
      },
      cancellations: {
        labels: cancelledBookings.map(c => c._id),
        counts: cancelledBookings.map(c => c.count),
        lostRevenue: cancelledBookings.map(c => c.lostRevenue)
      }
    },
    distributions: {
      topDestinations: topDestinations.map(d => ({
        destination: d._id,
        bookings: d.bookings,
        revenue: d.revenue
      })),
      topRoutes: topRoutes.map(r => ({
        origin: r._id?.origin,
        destination: r._id?.destination,
        bookings: r.bookings,
        revenue: r.revenue
      })),
      travelClass: bookingsByClass.reduce((acc, c) => {
        acc[c._id || 'economy'] = { count: c.count, revenue: c.revenue };
        return acc;
      }, {} as Record<string, { count: number; revenue: number }>),
      paymentMethods: paymentMethods.reduce((acc, p) => {
        acc[p._id || 'other'] = { count: p.count, total: p.total };
        return acc;
      }, {} as Record<string, { count: number; total: number }>),
      flightStatus: flightStatusBreakdown.reduce((acc, f) => {
        acc[f._id || 'unknown'] = f.count;
        return acc;
      }, {} as Record<string, number>)
    },
    metrics: {
      averageBookingValue: avgBookingValue[0]?.avgValue || 0,
      minBookingValue: avgBookingValue[0]?.minValue || 0,
      maxBookingValue: avgBookingValue[0]?.maxValue || 0,
      conversionRate: conversionRatePercent,
      totalNewUsers,
      usersWithBookings: usersWithBookings.length
    }
  });
});

/**
 * @desc    Get real-time stats for live dashboard
 * @route   GET /api/admin/stats/realtime
 * @access  Private/Admin
 */
export const getRealtimeStats = asyncHandler(async (_req: Request, res: Response) => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    activeUsers,
    recentBookings,
    pendingPayments,
    flightsToday,
    recentActivity
  ] = await Promise.all([
    // Active users (updated in last hour)
    User.countDocuments({
      lastLogin: { $gte: oneHourAgo },
      isDeleted: { $ne: true }
    }),
    
    // Recent bookings (last hour)
    Booking.countDocuments({
      createdAt: { $gte: oneHourAgo }
    }),
    
    // Pending payments
    Payment.countDocuments({
      status: 'pending'
    }),
    
    // Flights today
    Flight.countDocuments({
      departureTime: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }),
    
    // Recent activity log
    Promise.all([
      Booking.find({ createdAt: { $gte: oneHourAgo } })
        .populate('user', 'firstName lastName')
        .select('bookingReference totalPrice createdAt')
        .sort({ createdAt: -1 })
        .limit(5),
      User.find({ createdAt: { $gte: oneHourAgo } })
        .select('firstName lastName createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
    ])
  ]);

  const [recentBookingsList, recentUsersList] = recentActivity;

  // Combine and sort activities
  const activities = [
    ...recentBookingsList.map((b: any) => ({
      type: 'booking',
      message: `New booking ${b.bookingReference} for ₹${b.totalPrice?.toLocaleString()}`,
      user: b.user ? `${b.user.firstName} ${b.user.lastName}` : 'Guest',
      timestamp: b.createdAt
    })),
    ...recentUsersList.map((u: any) => ({
      type: 'user',
      message: `New user registered`,
      user: `${u.firstName} ${u.lastName}`,
      timestamp: u.createdAt
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
   .slice(0, 10);

  return successResponse(res, 200, 'Realtime stats retrieved', {
    activeUsers,
    recentBookings,
    pendingPayments,
    flightsToday,
    activities,
    timestamp: now
  });
});

