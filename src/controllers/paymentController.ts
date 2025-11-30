import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Payment } from '../models/Payment.js';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import {
  successResponse,
  errorResponse,
  asyncHandler,
  getPagination,
  getPaginationInfo
} from '../types/api.js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia'
});

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * @desc    Create payment intent
 * @route   POST /api/payments/create-intent
 * @access  Private
 */
export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { bookingId, paymentMethod } = req.body;

  // Get booking
  const booking = await Booking.findById(bookingId).populate('flight');

  if (!booking) {
    return errorResponse(res, 404, 'Booking not found');
  }

  // Verify booking belongs to user
  if (booking.user.toString() !== userId?.toString()) {
    return errorResponse(res, 403, 'Access denied');
  }

  // Check booking status
  if (booking.status === 'confirmed') {
    return errorResponse(res, 400, 'Booking is already confirmed');
  }

  if (booking.status === 'cancelled') {
    return errorResponse(res, 400, 'Booking has been cancelled');
  }

  // Check payment deadline
  if (booking.paymentDeadline && new Date() > booking.paymentDeadline) {
    return errorResponse(res, 400, 'Payment window has expired. Please create a new booking.');
  }

  // Check if payment already exists
  let payment: any = await Payment.findOne({ booking: bookingId, status: { $ne: 'failed' } });

  if (payment && payment.status === 'completed') {
    return errorResponse(res, 400, 'Payment already completed for this booking');
  }

  // Create Stripe payment intent
  const flight = booking.flight as any;
  const pricing = booking.pricing!; // pricing is always populated after booking creation
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(pricing.total * 100), // Stripe expects amount in smallest currency unit
    currency: pricing.currency.toLowerCase(),
    metadata: {
      bookingId: booking._id.toString(),
      bookingReference: booking.bookingReference,
      userId: userId?.toString() || '',
      flightNumber: flight.flightNumber
    },
    description: `Flight booking ${booking.bookingReference} - ${flight.flightNumber}`,
    receipt_email: booking.contactDetails.email
  });

  // Create or update payment record
  if (!payment) {
    payment = await Payment.create({
      user: userId,
      booking: bookingId,
      amount: pricing.total,
      currency: pricing.currency,
      paymentGateway: 'stripe',
      gatewayPaymentId: paymentIntent.id,
      status: 'pending',
      paymentMethod: paymentMethod || 'card'
    } as any);
  } else {
    payment.gatewayPaymentId = paymentIntent.id;
    payment.status = 'pending';
    await payment.save();
  }

  return successResponse(res, 200, 'Payment intent created', {
    clientSecret: paymentIntent.client_secret,
    paymentId: payment._id,
    amount: pricing.total,
    currency: pricing.currency
  });
});

/**
 * @desc    Confirm payment
 * @route   POST /api/payments/confirm
 * @access  Private
 */
export const confirmPayment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { paymentIntentId, bookingId } = req.body;

  // Verify payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    return errorResponse(res, 400, `Payment not successful. Status: ${paymentIntent.status}`);
  }

  // Get booking and payment
  const booking = await Booking.findById(bookingId);
  const payment = await Payment.findOne({ gatewayPaymentId: paymentIntentId });

  if (!booking || !payment) {
    return errorResponse(res, 404, 'Booking or payment not found');
  }

  // Verify ownership
  if (booking.user.toString() !== userId?.toString()) {
    return errorResponse(res, 403, 'Access denied');
  }

  // Update payment status
  payment.status = 'completed';
  payment.paidAt = new Date();
  payment.cardDetails = {
    last4Digits: paymentIntent.payment_method_types.includes('card') ? '****' : '0000',
    brand: 'visa', // Would come from payment method details
    expiryMonth: 0,
    expiryYear: 0,
    cardType: 'credit'
  };
  await payment.save();

  // Update booking status
  booking.status = 'confirmed';
  booking.paymentStatus = 'completed';
  booking.payment = payment._id;
  await booking.save();

  // Award loyalty points (1 point per ₹100 spent)
  const pointsEarned = Math.floor(booking.pricing!.total / 100);
  await User.findByIdAndUpdate(userId, {
    $inc: { loyaltyPoints: pointsEarned }
  });

  // TODO: Send confirmation email

  return successResponse(res, 200, 'Payment confirmed successfully', {
    bookingReference: booking.bookingReference,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    pointsEarned,
    receipt: {
      transactionId: payment.gatewayPaymentId,
      amount: payment.amount,
      currency: payment.currency,
      paidAt: payment.paidAt
    }
  });
});

/**
 * @desc    Process refund
 * @route   POST /api/payments/refund/:bookingId
 * @access  Private/Admin
 */
export const processRefund = asyncHandler(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { reason, amount: refundAmount } = req.body;

  // Get booking and payment
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return errorResponse(res, 404, 'Booking not found');
  }

  const payment = await Payment.findOne({ booking: bookingId, status: 'completed' });
  if (!payment) {
    return errorResponse(res, 404, 'No completed payment found for this booking');
  }

  // Calculate refund amount
  const actualRefundAmount = refundAmount || booking.cancellation?.refundAmount || payment.amount;

  if (actualRefundAmount > payment.amount) {
    return errorResponse(res, 400, 'Refund amount cannot exceed original payment');
  }

  try {
    // Create Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: payment.gatewayPaymentId,
      amount: Math.round(actualRefundAmount * 100),
      reason: 'requested_by_customer',
      metadata: {
        bookingId: booking._id.toString(),
        bookingReference: booking.bookingReference,
        reason: reason || 'Cancellation refund'
      }
    });

    // Update payment record
    payment.refund = {
      amount: actualRefundAmount,
      processedAt: new Date(),
      reason: reason || 'Booking cancellation',
      transactionId: refund.id,
      status: 'processed',
      initiatedAt: new Date(),
      refundMethod: 'original',
      attempts: 1
    };
    payment.status = actualRefundAmount === payment.amount ? 'refunded' : 'partially_refunded';
    await payment.save();

    // Update booking
    booking.paymentStatus = payment.status === 'refunded' ? 'refunded' : 'partial';
    await booking.save();

    return successResponse(res, 200, 'Refund processed successfully', {
      refundId: refund.id,
      amount: actualRefundAmount,
      status: refund.status,
      bookingReference: booking.bookingReference
    });
  } catch (error: any) {
    return errorResponse(res, 500, 'Failed to process refund', error.message);
  }
});

/**
 * @desc    Get payment history
 * @route   GET /api/payments/history
 * @access  Private
 */
export const getPaymentHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { page = 1, limit = 10 } = req.query;

  const { skip } = getPagination(Number(page), Number(limit));

  const [payments, total] = await Promise.all([
    Payment.find({ user: userId })
      .populate('booking', 'bookingReference flight')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Payment.countDocuments({ user: userId })
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(limit));

  return successResponse(res, 200, 'Payment history retrieved', payments, pagination);
});

/**
 * @desc    Stripe webhook handler
 * @route   POST /api/payments/webhook
 * @access  Public (with Stripe signature verification)
 */
export const stripeWebhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent succeeded: ${paymentIntent.id}`);
      
      // Update payment and booking if not already done
      const payment = await Payment.findOne({ gatewayPaymentId: paymentIntent.id });
      if (payment && payment.status !== 'completed') {
        payment.status = 'completed';
        payment.paidAt = new Date();
        await payment.save();

        const booking = await Booking.findById(payment.booking);
        if (booking && booking.status !== 'confirmed') {
          booking.status = 'confirmed';
          booking.paymentStatus = 'completed';
          await booking.save();
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`❌ PaymentIntent failed: ${failedIntent.id}`);
      
      const failedPayment = await Payment.findOne({ gatewayPaymentId: failedIntent.id });
      if (failedPayment) {
        failedPayment.status = 'failed';
        failedPayment.failureReason = failedIntent.last_payment_error?.message || 'Payment failed';
        await failedPayment.save();
      }
      break;

    case 'charge.refunded':
      const refund = event.data.object as Stripe.Charge;
      console.log(`💸 Charge refunded: ${refund.id}`);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/:id
 * @access  Private
 */
export const getPaymentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const isAdmin = req.user?.role === 'admin';

  const payment = await Payment.findById(id)
    .populate('booking', 'bookingReference status')
    .populate('user', 'firstName lastName email');

  if (!payment) {
    return errorResponse(res, 404, 'Payment not found');
  }

  // Check ownership unless admin
  if (!isAdmin && payment.user._id.toString() !== userId?.toString()) {
    return errorResponse(res, 403, 'Access denied');
  }

  return successResponse(res, 200, 'Payment retrieved', payment);
});

/**
 * @desc    Get all payments (admin)
 * @route   GET /api/payments
 * @access  Private/Admin
 */
export const getAllPayments = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    status,
    gateway,
    dateFrom,
    dateTo
  } = req.query;

  const query: any = {};

  if (status) query.status = status;
  if (gateway) query.gateway = gateway;
  
  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom as string);
    if (dateTo) query.createdAt.$lte = new Date(dateTo as string);
  }

  const { skip } = getPagination(Number(page), Number(limit));

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate('booking', 'bookingReference')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Payment.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(limit));

  return successResponse(res, 200, 'Payments retrieved', payments, pagination);
});
