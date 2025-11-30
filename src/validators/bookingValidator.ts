import { body, param, query, ValidationChain } from 'express-validator';
import mongoose from 'mongoose';

/**
 * Booking Validators
 * Validation rules for booking endpoints
 */

/**
 * Validate passenger details
 */
const validatePassengerDetails = (): ValidationChain[] => [
  body('passengers')
    .isArray({ min: 1 })
    .withMessage('At least one passenger is required'),
  
  body('passengers.*.firstName')
    .trim()
    .notEmpty()
    .withMessage('Passenger first name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters')
    .escape(),
  
  body('passengers.*.lastName')
    .trim()
    .notEmpty()
    .withMessage('Passenger last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters')
    .escape(),
  
  body('passengers.*.age')
    .isInt({ min: 0, max: 120 })
    .withMessage('Passenger age must be between 0 and 120'),
  
  body('passengers.*.gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender value'),
  
  body('passengers.*.email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid passenger email format')
    .normalizeEmail(),
  
  body('passengers.*.phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,14}$/)
    .withMessage('Invalid phone number format'),
  
  body('passengers.*.dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date of birth format')
    .custom((value) => {
      const dob = new Date(value);
      const now = new Date();
      if (dob > now) {
        throw new Error('Date of birth cannot be in the future');
      }
      return true;
    }),
  
  body('passengers.*.passportNumber')
    .optional()
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Passport number must be between 5 and 20 characters')
    .matches(/^[A-Z0-9]+$/i)
    .withMessage('Invalid passport number format'),
  
  body('passengers.*.passportExpiry')
    .optional()
    .isISO8601()
    .withMessage('Invalid passport expiry date format')
    .custom((value, { req }) => {
      const expiry = new Date(value);
      const travelDate = new Date(req.body.travelDate);
      // Passport must be valid for at least 6 months after travel date
      const sixMonthsAfterTravel = new Date(travelDate);
      sixMonthsAfterTravel.setMonth(sixMonthsAfterTravel.getMonth() + 6);
      
      if (expiry < sixMonthsAfterTravel) {
        throw new Error('Passport must be valid for at least 6 months after travel date');
      }
      return true;
    }),
  
  body('passengers.*.seatClass')
    .optional()
    .isIn(['economy', 'business', 'first'])
    .withMessage('Invalid seat class'),
  
  body('passengers.*.seatPreference')
    .optional()
    .isIn(['window', 'aisle', 'middle'])
    .withMessage('Invalid seat preference'),
  
  body('passengers.*.mealPreference')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Meal preference must not exceed 100 characters')
    .escape()
];

/**
 * Create booking validation
 */
export const validateBooking: ValidationChain[] = [
  body('flightId')
    .notEmpty()
    .withMessage('Flight ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid flight ID format');
      }
      return true;
    }),
  
  body('travelDate')
    .notEmpty()
    .withMessage('Travel date is required')
    .isISO8601()
    .withMessage('Invalid travel date format')
    .custom((value) => {
      const travelDate = new Date(value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      if (travelDate < now) {
        throw new Error('Travel date cannot be in the past');
      }
      
      // Cannot book more than 1 year in advance
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      if (travelDate > oneYearFromNow) {
        throw new Error('Cannot book more than 1 year in advance');
      }
      
      return true;
    }),
  
  body('returnDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid return date format')
    .custom((value, { req }) => {
      if (value) {
        const returnDate = new Date(value);
        const travelDate = new Date(req.body.travelDate);
        
        if (returnDate <= travelDate) {
          throw new Error('Return date must be after travel date');
        }
      }
      return true;
    }),
  
  // Spread passenger validations
  ...validatePassengerDetails(),
  
  body('totalPassengers')
    .isInt({ min: 1, max: 9 })
    .withMessage('Total passengers must be between 1 and 9'),
  
  body('adults')
    .isInt({ min: 1, max: 9 })
    .withMessage('At least 1 adult is required'),
  
  body('children')
    .optional()
    .isInt({ min: 0, max: 8 })
    .withMessage('Children count must be between 0 and 8'),
  
  body('infants')
    .optional()
    .isInt({ min: 0, max: 4 })
    .withMessage('Infants count must be between 0 and 4')
    .custom((value, { req }) => {
      if (value > req.body.adults) {
        throw new Error('Number of infants cannot exceed number of adults');
      }
      return true;
    }),
  
  body('contactDetails.email')
    .trim()
    .notEmpty()
    .withMessage('Contact email is required')
    .isEmail()
    .withMessage('Invalid contact email format')
    .normalizeEmail(),
  
  body('contactDetails.phone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone is required')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,14}$/)
    .withMessage('Invalid contact phone format'),
  
  body('seatClass')
    .optional()
    .isIn(['economy', 'business', 'first'])
    .withMessage('Invalid seat class'),
  
  body('insuranceOpted')
    .optional()
    .isBoolean()
    .withMessage('Insurance opted must be a boolean'),
  
  body('specialRequests')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special requests must not exceed 500 characters')
    .escape()
];

/**
 * Booking cancellation validation
 */
export const validateCancellation: ValidationChain[] = [
  param('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid booking ID format');
      }
      return true;
    }),
  
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Cancellation reason is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Cancellation reason must be between 10 and 500 characters')
    .escape()
];

/**
 * Booking modification validation
 */
export const validateBookingModification: ValidationChain[] = [
  param('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid booking ID format');
      }
      return true;
    }),
  
  body('newTravelDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid travel date format')
    .custom((value) => {
      const travelDate = new Date(value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      if (travelDate < now) {
        throw new Error('New travel date cannot be in the past');
      }
      return true;
    }),
  
  body('passengers')
    .optional()
    .isArray()
    .withMessage('Passengers must be an array'),
  
  body('seatChanges')
    .optional()
    .isArray()
    .withMessage('Seat changes must be an array'),
  
  body('seatChanges.*.passengerId')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Invalid passenger ID'),
  
  body('seatChanges.*.newSeat')
    .optional()
    .matches(/^[0-9]{1,2}[A-K]$/)
    .withMessage('Invalid seat number format (e.g., 12A, 3F)')
];

/**
 * Get booking by reference validation
 */
export const validateGetBookingByRef: ValidationChain[] = [
  param('reference')
    .trim()
    .notEmpty()
    .withMessage('Booking reference is required')
    .isLength({ min: 6, max: 20 })
    .withMessage('Invalid booking reference format')
    .matches(/^[A-Z0-9-]+$/i)
    .withMessage('Booking reference can only contain letters, numbers, and hyphens')
    .toUpperCase()
];

/**
 * Search bookings validation
 */
export const validateBookingSearch: ValidationChain[] = [
  query('status')
    .optional()
    .isIn(['pending', 'confirmed', 'ticketed', 'checked-in', 'completed', 'cancelled', 'no-show', 'rescheduled'])
    .withMessage('Invalid booking status'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format')
    .custom((value, { req }) => {
      if (value && req.query?.startDate) {
        const endDate = new Date(value);
        const startDate = new Date(req.query.startDate as string);
        if (endDate < startDate) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

export default {
  validateBooking,
  validateCancellation,
  validateBookingModification,
  validateGetBookingByRef,
  validateBookingSearch
};
