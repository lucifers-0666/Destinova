/**
 * Email Service
 * Handles all email notifications using nodemailer
 */

import * as nodemailer from 'nodemailer';
import { IPriceAlert } from '../models/PriceAlert.js';
import { IBooking } from '../models/Booking.js';
import { IUser } from '../models/User.js';

// Extended booking interface for populated flight data
interface IBookingPopulated extends Omit<IBooking, 'flight'> {
  flight?: {
    _id?: any;
    origin?: { city: string; airportCode: string };
    destination?: { city: string; airportCode: string };
    flightNumber?: string;
    departureTime?: Date;
  } | null;
  cabinClass?: string;
}

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '' // Use app-specific password for Gmail
  }
};

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@destinova.com';
const FROM_NAME = process.env.FROM_NAME || 'Destinova';
const APP_URL = process.env.APP_URL || 'http://localhost:4000';

// Create transporter
let transporter: nodemailer.Transporter | null = null;

/**
 * Initialize the email transporter
 */
function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: EMAIL_CONFIG.auth.user ? EMAIL_CONFIG.auth : undefined,
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return transporter;
}

/**
 * Send email with error handling
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    // Skip if no SMTP credentials configured
    if (!EMAIL_CONFIG.auth.user) {
      console.log('[EmailService] SMTP not configured, skipping email:', options.subject);
      return { success: true, messageId: 'skipped-no-smtp' };
    }

    const transport = getTransporter();

    const result = await transport.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '')
    });

    console.log(`[EmailService] Email sent: ${options.subject} to ${options.to}`);
    return { success: true, messageId: result.messageId };

  } catch (error: any) {
    console.error('[EmailService] Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Format currency
 */
function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Format date
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(
  booking: IBookingPopulated,
  user: IUser
): Promise<{ success: boolean; error?: string }> {
  const subject = `Booking Confirmed - ${booking.bookingReference}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
        .flight-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .route { font-size: 24px; font-weight: bold; color: #333; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 22px; font-weight: bold; color: #667eea; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✈️ Booking Confirmed!</h1>
          <p>Reference: <strong>${booking.bookingReference}</strong></p>
        </div>
        <div class="content">
          <p>Dear ${user.firstName || 'Traveler'},</p>
          <p>Your flight booking has been confirmed. Here are your trip details:</p>
          
          <div class="flight-info">
            <div class="route">
              ${booking.flight?.origin?.city || 'Origin'} → ${booking.flight?.destination?.city || 'Destination'}
            </div>
            <p style="color: #666;">${booking.flight?.origin?.airportCode} → ${booking.flight?.destination?.airportCode}</p>
            
            <div class="detail-row">
              <span>Flight</span>
              <strong>${booking.flight?.flightNumber || 'N/A'}</strong>
            </div>
            <div class="detail-row">
              <span>Departure</span>
              <strong>${booking.flight?.departureTime ? formatDate(booking.flight.departureTime) : 'N/A'}</strong>
            </div>
            <div class="detail-row">
              <span>Passengers</span>
              <strong>${booking.passengers?.length || 1}</strong>
            </div>
            <div class="detail-row">
              <span>Class</span>
              <strong>${booking.cabinClass || 'Economy'}</strong>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <div class="total">Total: ${formatCurrency(booking.totalAmount || 0)}</div>
          </div>

          <div style="text-align: center;">
            <a href="${APP_URL}/html/booking-details.html?id=${booking._id}" class="btn">View Booking Details</a>
          </div>

          <p style="margin-top: 30px; color: #666;">
            <strong>Important:</strong> Please arrive at the airport at least 2 hours before your scheduled departure.
          </p>
        </div>
        <div class="footer">
          <p>Thank you for choosing Destinova!</p>
          <p>© ${new Date().getFullYear()} Destinova. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject,
    html
  });
}

/**
 * Send booking cancellation email
 */
export async function sendCancellationEmail(
  booking: IBookingPopulated,
  user: IUser,
  refundAmount?: number
): Promise<{ success: boolean; error?: string }> {
  const subject = `Booking Cancelled - ${booking.bookingReference}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
        .refund-info { background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Booking Cancelled</h1>
          <p>Reference: <strong>${booking.bookingReference}</strong></p>
        </div>
        <div class="content">
          <p>Dear ${user.firstName || 'Traveler'},</p>
          <p>Your booking has been successfully cancelled.</p>
          
          <h3>Cancelled Flight Details:</h3>
          <p>
            <strong>${booking.flight?.origin?.city}</strong> → <strong>${booking.flight?.destination?.city}</strong><br>
            Flight: ${booking.flight?.flightNumber}<br>
            Was scheduled for: ${booking.flight?.departureTime ? formatDate(booking.flight.departureTime) : 'N/A'}
          </p>

          ${refundAmount && refundAmount > 0 ? `
          <div class="refund-info">
            <h3 style="margin-top: 0; color: #155724;">💰 Refund Information</h3>
            <p style="font-size: 18px;">
              <strong>Refund Amount: ${formatCurrency(refundAmount)}</strong>
            </p>
            <p>The refund will be processed to your original payment method within 5-7 business days.</p>
          </div>
          ` : `
          <p style="color: #666;">
            Based on the cancellation policy, no refund is applicable for this booking.
          </p>
          `}

          <p style="margin-top: 20px;">
            If you have any questions, please contact our support team.
          </p>
        </div>
        <div class="footer">
          <p>We hope to see you again soon!</p>
          <p>© ${new Date().getFullYear()} Destinova. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject,
    html
  });
}

/**
 * Send price alert notification
 */
export async function sendPriceAlert(
  alert: IPriceAlert,
  currentPrice: number,
  flight: any,
  user: IUser | any
): Promise<{ success: boolean; error?: string }> {
  const subject = `🔔 Price Alert: ${alert.origin.city} to ${alert.destination.city} - ${formatCurrency(currentPrice)}!`;

  const savings = alert.targetPrice - currentPrice;
  const savingsPercent = ((alert.targetPrice - currentPrice) / alert.targetPrice * 100).toFixed(0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
        .price-box { background: #f8f9fa; padding: 25px; border-radius: 12px; text-align: center; margin: 20px 0; }
        .current-price { font-size: 36px; font-weight: bold; color: #11998e; }
        .target-price { color: #666; text-decoration: line-through; font-size: 18px; }
        .savings { background: #d4edda; color: #155724; padding: 10px 20px; border-radius: 20px; display: inline-block; margin-top: 10px; }
        .btn { display: inline-block; background: #11998e; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-size: 16px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .flight-details { margin: 20px 0; padding: 15px; border-left: 3px solid #11998e; background: #f0fdf4; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Price Drop Alert!</h1>
          <p>Your price alert has been triggered</p>
        </div>
        <div class="content">
          <p>Hi ${user.firstName || 'Traveler'},</p>
          <p>Great news! The price for your tracked route has dropped below your target!</p>
          
          <div class="price-box">
            <div class="route" style="font-size: 24px; margin-bottom: 15px;">
              ${alert.origin.city} ✈️ ${alert.destination.city}
            </div>
            <div class="target-price">Your target: ${formatCurrency(alert.targetPrice)}</div>
            <div class="current-price">${formatCurrency(currentPrice)}</div>
            ${savings > 0 ? `
            <div class="savings">
              You save ${formatCurrency(savings)} (${savingsPercent}% off)!
            </div>
            ` : ''}
          </div>

          <div class="flight-details">
            <strong>Available Flight:</strong><br>
            ✈️ ${flight.flightNumber} - ${flight.airline?.name || 'Airline'}<br>
            📅 ${formatDate(flight.departureTime)}
          </div>

          <div style="text-align: center;">
            <a href="${APP_URL}/html/flight-results.html?from=${alert.origin.airportCode}&to=${alert.destination.airportCode}" class="btn">
              Book Now →
            </a>
          </div>

          <p style="color: #666; font-size: 13px; margin-top: 30px;">
            ⚠️ <strong>Prices change quickly!</strong> Book now to lock in this rate.<br>
            This price was found at ${formatDate(new Date())}.
          </p>
        </div>
        <div class="footer">
          <p>You received this email because you set up a price alert on Destinova.</p>
          <p><a href="${APP_URL}/html/price-alerts.html">Manage your alerts</a></p>
          <p>© ${new Date().getFullYear()} Destinova. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: alert.emailAddress || user.email,
    subject,
    html
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(
  user: IUser,
  resetToken: string
): Promise<{ success: boolean; error?: string }> {
  const subject = 'Reset Your Password - Destinova';
  const resetUrl = `${APP_URL}/html/reset-password.html?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #667eea; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset</h1>
        </div>
        <div class="content">
          <p>Hi ${user.firstName || 'there'},</p>
          <p>We received a request to reset your password for your Destinova account.</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>

          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>

          <div class="warning">
            <strong>⚠️ This link expires in 1 hour.</strong><br>
            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Destinova. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject,
    html
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  user: IUser
): Promise<{ success: boolean; error?: string }> {
  const subject = 'Welcome to Destinova! ✈️';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
        .feature { padding: 15px 0; border-bottom: 1px solid #eee; }
        .feature:last-child { border-bottom: none; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Destinova! ✈️</h1>
          <p>Your journey to amazing destinations starts here</p>
        </div>
        <div class="content">
          <p>Hi ${user.firstName || 'Traveler'},</p>
          <p>Thank you for joining Destinova! We're excited to help you discover and book your perfect flights.</p>
          
          <h3>What you can do with Destinova:</h3>
          
          <div class="feature">
            <strong>🔍 Search Flights</strong>
            <p>Compare prices across airlines and find the best deals</p>
          </div>
          
          <div class="feature">
            <strong>🤖 AI-Powered Pricing</strong>
            <p>Get dynamic prices optimized in real-time</p>
          </div>
          
          <div class="feature">
            <strong>🔔 Price Alerts</strong>
            <p>Set alerts and we'll notify you when prices drop</p>
          </div>
          
          <div class="feature">
            <strong>📱 Easy Booking</strong>
            <p>Book flights in just a few clicks</p>
          </div>

          <div style="text-align: center;">
            <a href="${APP_URL}" class="btn">Start Exploring →</a>
          </div>
        </div>
        <div class="footer">
          <p>Happy travels! 🌍</p>
          <p>© ${new Date().getFullYear()} Destinova. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject,
    html
  });
}

/**
 * Verify email configuration
 */
export async function verifyConnection(): Promise<boolean> {
  try {
    if (!EMAIL_CONFIG.auth.user) {
      console.log('[EmailService] SMTP not configured');
      return false;
    }
    
    const transport = getTransporter();
    await transport.verify();
    console.log('[EmailService] SMTP connection verified');
    return true;
  } catch (error) {
    console.error('[EmailService] SMTP verification failed:', error);
    return false;
  }
}

export default {
  sendBookingConfirmation,
  sendCancellationEmail,
  sendPriceAlert,
  sendPasswordReset,
  sendWelcomeEmail,
  verifyConnection
};
