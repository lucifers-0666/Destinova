import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Booking } from '../models/Booking.js';
import { Flight } from '../models/Flight.js';
import {
  successResponse,
  errorResponse,
  asyncHandler,
  getPagination,
  getPaginationInfo,
  CreateBookingBody
} from '../types/api.js';

// Temporary booking storage for payment window (in production, use Redis)
const temporaryBookings = new Map<string, { expiresAt: Date; seatsLocked: number }>();

/**
 * Generate unique booking reference
 */
const generateBookingReference = (): string => {
  const prefix = 'DN';
  const uniquePart = uuidv4().substring(0, 6).toUpperCase();
  return `${prefix}-${uniquePart}`;
};

/**
 * Calculate total price with taxes and add-ons
 */
const calculateTotalPrice = (
  basePrice: number,
  passengers: number,
  addOns?: CreateBookingBody['addOns']
): { subtotal: number; taxes: number; addOnsCost: number; total: number } => {
  const subtotal = basePrice * passengers;
  
  // Tax calculation (GST 5% for domestic, 12% for international)
  const taxRate = 0.05; // Default domestic
  const taxes = subtotal * taxRate;
  
  // Add-ons calculation
  let addOnsCost = 0;
  if (addOns) {
    if (addOns.insurance) addOnsCost += 499 * passengers;
    if (addOns.priorityBoarding) addOnsCost += 299 * passengers;
    if (addOns.extraBaggage) addOnsCost += 1500 * addOns.extraBaggage;
  }
  
  const total = subtotal + taxes + addOnsCost;
  
  return {
    subtotal: Math.round(subtotal),
    taxes: Math.round(taxes),
    addOnsCost: Math.round(addOnsCost),
    total: Math.round(total)
  };
};

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const bookingData: CreateBookingBody = req.body;

  // Get flight details
  const flight = await Flight.findById(bookingData.flightId);
  if (!flight) {
    return errorResponse(res, 404, 'Flight not found');
  }

  // Check if flight is available
  if (!['scheduled', 'on-time', 'delayed'].includes(flight.status)) {
    return errorResponse(res, 400, 'Flight is not available for booking');
  }

  // Check departure time (cannot book if less than 2 hours to departure)
  const hoursUntilDeparture = (flight.departureTime.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilDeparture < 2) {
    return errorResponse(res, 400, 'Booking closed. Flight departs in less than 2 hours.');
  }

  // Check seat availability
  const passengerCount = bookingData.passengers.length;
  if (flight.seatsAvailable < passengerCount) {
    return errorResponse(
      res,
      400,
      `Not enough seats available. Only ${flight.seatsAvailable} seats left.`
    );
  }

  // Get seat class price
  let classPrice = flight.currentPrice;
  const seatConfig = flight.seatConfiguration as any;
  if (bookingData.seatClass === 'business') {
    classPrice = seatConfig?.business?.price || flight.currentPrice * 2.5;
  } else if (bookingData.seatClass === 'first') {
    classPrice = seatConfig?.first?.price || flight.currentPrice * 4;
  }

  // Calculate total price
  const pricing = calculateTotalPrice(classPrice, passengerCount, bookingData.addOns);

  // Generate booking reference
  const bookingReference = generateBookingReference();

  // Create booking
  const bookingDoc = await Booking.create({
    bookingReference,
    user: userId,
    flight: flight._id,
    passengers: bookingData.passengers.map((p, index) => ({
      ...p,
      seatNumber: null, // Will be assigned later
      isLeadPassenger: index === 0
    })),
    seatClass: bookingData.seatClass,
    seatPreferences: bookingData.seatPreferences,
    mealPreferences: bookingData.mealPreferences,
    contactDetails: {
      email: bookingData.contactEmail,
      phone: bookingData.contactPhone
    },
    pricing: {
      basePrice: classPrice,
      ...pricing,
      currency: flight.currency || 'INR'
    },
    addOns: {
      insurance: bookingData.addOns?.insurance || false,
      priorityBoarding: bookingData.addOns?.priorityBoarding || false,
      extraBaggage: bookingData.addOns?.extraBaggage || 0
    },
    status: 'pending',
    paymentStatus: 'pending',
    paymentDeadline: new Date(Date.now() + 10 * 60 * 1000) // 10 minute payment window
  } as any);
  
  // Handle both array and single document return from create
  const booking: any = Array.isArray(bookingDoc) ? bookingDoc[0] : bookingDoc;

  // Temporarily lock seats
  flight.seatsAvailable -= passengerCount;
  await flight.save();

  // Store temporary booking info
  temporaryBookings.set(booking._id.toString(), {
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    seatsLocked: passengerCount
  });

  // Schedule seat release if payment not completed
  setTimeout(async () => {
    const tempBooking = temporaryBookings.get(booking._id.toString());
    if (tempBooking) {
      const currentBooking = await Booking.findById(booking._id);
      if (currentBooking && currentBooking.paymentStatus === 'pending') {
        // Release seats
        await Flight.findByIdAndUpdate(flight._id, {
          $inc: { seatsAvailable: passengerCount }
        });
        currentBooking.status = 'cancelled';
        currentBooking.cancellation = {
          cancelledAt: new Date(),
          reason: 'Payment timeout',
          cancelledBy: 'system'
        };
        await currentBooking.save();
        temporaryBookings.delete(booking._id.toString());
      }
    }
  }, 10 * 60 * 1000);

  // Populate flight details for response
  await booking.populate('flight', 'flightNumber airline origin destination departureTime arrivalTime');

  return successResponse(res, 201, 'Booking created successfully. Complete payment within 10 minutes.', {
    booking,
    paymentDeadline: booking.paymentDeadline,
    paymentWindow: '10 minutes'
  });
});

/**
 * @desc    Get user's bookings
 * @route   GET /api/bookings/my
 * @access  Private
 */
export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { status, page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

  // Build query
  const query: any = { user: userId };
  
  if (status === 'upcoming') {
    query.status = { $in: ['confirmed', 'pending'] };
    query['flight.departureTime'] = { $gte: new Date() };
  } else if (status === 'completed') {
    query.status = 'completed';
  } else if (status === 'cancelled') {
    query.status = 'cancelled';
  }

  const { skip } = getPagination(Number(page), Number(limit));
  
  const sortOptions: any = {};
  sortOptions[sort as string] = order === 'asc' ? 1 : -1;

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('flight', 'flightNumber airline origin destination departureTime arrivalTime status')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(limit));

  return successResponse(res, 200, 'Bookings retrieved successfully', bookings, pagination);
});

/**
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const isAdmin = req.user?.role === 'admin';

  const booking = await Booking.findById(id)
    .populate('flight')
    .populate('user', 'firstName lastName email phone');

  if (!booking) {
    return errorResponse(res, 404, 'Booking not found');
  }

  // Check ownership (unless admin)
  if (!isAdmin && booking.user._id.toString() !== userId?.toString()) {
    return errorResponse(res, 403, 'Access denied. You can only view your own bookings.');
  }

  return successResponse(res, 200, 'Booking retrieved successfully', booking);
});

/**
 * @desc    Cancel booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const isAdmin = req.user?.role === 'admin';
  const { reason } = req.body;

  const booking = await Booking.findById(id).populate('flight');

  if (!booking) {
    return errorResponse(res, 404, 'Booking not found');
  }

  // Check ownership (unless admin)
  if (!isAdmin && booking.user.toString() !== userId?.toString()) {
    return errorResponse(res, 403, 'Access denied. You can only cancel your own bookings.');
  }

  // Check if already cancelled
  if (booking.status === 'cancelled') {
    return errorResponse(res, 400, 'Booking is already cancelled');
  }

  // Check cancellation policy (24 hours before flight)
  const flight = booking.flight as any;
  const hoursUntilDeparture = (new Date(flight.departureTime).getTime() - Date.now()) / (1000 * 60 * 60);
  
  let refundPercentage = 0;
  let cancellationCharges = 0;
  
  if (hoursUntilDeparture > 72) {
    // More than 72 hours: 90% refund
    refundPercentage = 90;
  } else if (hoursUntilDeparture > 24) {
    // 24-72 hours: 50% refund
    refundPercentage = 50;
  } else if (hoursUntilDeparture > 4) {
    // 4-24 hours: 25% refund
    refundPercentage = 25;
  } else {
    // Less than 4 hours: No refund
    refundPercentage = 0;
  }

  const pricingTotal = booking.pricing?.total || 0;
  const refundAmount = Math.round((pricingTotal * refundPercentage) / 100);
  cancellationCharges = pricingTotal - refundAmount;

  // Update booking status
  booking.status = 'cancelled';
  booking.cancellation = {
    cancelledAt: new Date(),
    reason: reason || 'User requested cancellation',
    cancelledBy: isAdmin ? 'admin' : 'user',
    refundAmount,
    refundPercentage,
    cancellationCharges
  };

  await booking.save();

  // Release seats back to flight
  await Flight.findByIdAndUpdate(flight._id, {
    $inc: { seatsAvailable: booking.passengers.length }
  });

  // Clear temporary booking if exists
  temporaryBookings.delete(id);

  // TODO: Process refund through payment gateway

  return successResponse(res, 200, 'Booking cancelled successfully', {
    bookingReference: booking.bookingReference,
    status: booking.status,
    refundDetails: {
      originalAmount: pricingTotal,
      refundPercentage,
      refundAmount,
      cancellationCharges
    }
  });
});

/**
 * @desc    Get all bookings (admin)
 * @route   GET /api/bookings
 * @access  Private/Admin
 */
export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    status,
    paymentStatus,
    dateFrom,
    dateTo,
    search
  } = req.query;

  // Build query
  const query: any = {};

  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom as string);
    if (dateTo) query.createdAt.$lte = new Date(dateTo as string);
  }

  if (search) {
    query.$or = [
      { bookingReference: { $regex: search, $options: 'i' } },
      { 'contactDetails.email': { $regex: search, $options: 'i' } }
    ];
  }

  const { skip } = getPagination(Number(page), Number(limit));

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .populate('flight', 'flightNumber airline origin destination departureTime')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(limit));

  return successResponse(res, 200, 'Bookings retrieved successfully', bookings, pagination);
});

/**
 * @desc    Get booking statistics (admin)
 * @route   GET /api/bookings/stats
 * @access  Private/Admin
 */
export const getBookingStats = asyncHandler(async (req: Request, res: Response) => {
  const { period = '30' } = req.query; // Days

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(period));

  const stats = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        confirmedBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
        },
        cancelledBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        pendingBookings: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        totalRevenue: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$pricing.total', 0] }
        },
        totalPassengers: { $sum: { $size: '$passengers' } },
        avgBookingValue: { $avg: '$pricing.total' }
      }
    }
  ]);

  // Daily breakdown
  const dailyStats = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        bookings: { $sum: 1 },
        revenue: {
          $sum: { $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$pricing.total', 0] }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return successResponse(res, 200, 'Booking statistics retrieved', {
    summary: stats[0] || {
      totalBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      pendingBookings: 0,
      totalRevenue: 0,
      totalPassengers: 0,
      avgBookingValue: 0
    },
    dailyBreakdown: dailyStats,
    period: `Last ${period} days`
  });
});

/**
 * @desc    Get booking by reference
 * @route   GET /api/bookings/reference/:ref
 * @access  Public (limited info) / Private (full info)
 */
export const getBookingByReference = asyncHandler(async (req: Request, res: Response) => {
  const { ref } = req.params;
  const { email } = req.query;
  const isAuthenticated = !!req.user;

  const booking = await Booking.findOne({ bookingReference: ref.toUpperCase() })
    .populate('flight', 'flightNumber airline origin destination departureTime arrivalTime status');

  if (!booking) {
    return errorResponse(res, 404, 'Booking not found');
  }

  // If not authenticated, require email verification
  if (!isAuthenticated) {
    if (!email || booking.contactDetails.email.toLowerCase() !== (email as string).toLowerCase()) {
      return errorResponse(res, 403, 'Please provide the email used for booking');
    }

    // Return limited info for public access
    return successResponse(res, 200, 'Booking found', {
      bookingReference: booking.bookingReference,
      status: booking.status,
      flight: booking.flight,
      passengers: booking.passengers.map(p => ({
        firstName: p.firstName,
        lastName: p.lastName,
        seatNumber: p.seatNumber
      })),
      seatClass: booking.seatClass
    });
  }

  return successResponse(res, 200, 'Booking retrieved successfully', booking);
});
