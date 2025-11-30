import { body, param, query, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { errorResponse } from '../types/api.js';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error: any) => ({
      field: error.path || error.param,
      message: error.msg
    }));
    
    return errorResponse(
      res,
      400,
      'Validation failed',
      'Please check the input fields',
      formattedErrors
    );
  }
  
  next();
};

/**
 * Registration validation rules
 */
export const validateRegistration: ValidationChain[] = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Please provide a valid phone number')
];

/**
 * Login validation rules
 */
export const validateLogin: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Forgot password validation rules
 */
export const validateForgotPassword: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

/**
 * Reset password validation rules
 */
export const validateResetPassword: ValidationChain[] = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character')
];

/**
 * Change password validation rules
 */
export const validateChangePassword: ValidationChain[] = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

/**
 * Flight search validation rules
 */
export const validateFlightSearch: ValidationChain[] = [
  query('origin')
    .trim()
    .notEmpty()
    .withMessage('Origin airport code is required')
    .isLength({ min: 3, max: 3 })
    .withMessage('Origin must be a valid 3-letter airport code')
    .toUpperCase(),
  
  query('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination airport code is required')
    .isLength({ min: 3, max: 3 })
    .withMessage('Destination must be a valid 3-letter airport code')
    .toUpperCase()
    .custom((value, { req }) => {
      if (value === req.query?.origin) {
        throw new Error('Origin and destination cannot be the same');
      }
      return true;
    }),
  
  query('departureDate')
    .notEmpty()
    .withMessage('Departure date is required')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Departure date cannot be in the past');
      }
      return true;
    }),
  
  query('returnDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid return date')
    .custom((value, { req }) => {
      if (value && req.query?.departureDate) {
        const departureDate = new Date(req.query.departureDate as string);
        const returnDate = new Date(value);
        if (returnDate < departureDate) {
          throw new Error('Return date must be after departure date');
        }
      }
      return true;
    }),
  
  query('passengers')
    .optional()
    .isInt({ min: 1, max: 9 })
    .withMessage('Passengers must be between 1 and 9'),
  
  query('class')
    .optional()
    .isIn(['economy', 'business', 'first'])
    .withMessage('Class must be economy, business, or first')
];

/**
 * Create flight validation (admin)
 */
export const validateCreateFlight: ValidationChain[] = [
  body('flightNumber')
    .trim()
    .notEmpty()
    .withMessage('Flight number is required')
    .matches(/^[A-Z0-9]{2,3}\d{1,4}$/)
    .withMessage('Invalid flight number format'),
  
  body('airline.code')
    .trim()
    .notEmpty()
    .withMessage('Airline code is required'),
  
  body('airline.name')
    .trim()
    .notEmpty()
    .withMessage('Airline name is required'),
  
  body('origin.code')
    .trim()
    .notEmpty()
    .withMessage('Origin airport code is required')
    .isLength({ min: 3, max: 3 }),
  
  body('destination.code')
    .trim()
    .notEmpty()
    .withMessage('Destination airport code is required')
    .isLength({ min: 3, max: 3 }),
  
  body('departureTime')
    .notEmpty()
    .withMessage('Departure time is required')
    .isISO8601()
    .withMessage('Invalid departure time format'),
  
  body('arrivalTime')
    .notEmpty()
    .withMessage('Arrival time is required')
    .isISO8601()
    .withMessage('Invalid arrival time format'),
  
  body('basePrice')
    .notEmpty()
    .withMessage('Base price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('totalSeats')
    .notEmpty()
    .withMessage('Total seats is required')
    .isInt({ min: 1 })
    .withMessage('Total seats must be at least 1')
];

/**
 * Booking validation rules
 */
export const validateCreateBooking: ValidationChain[] = [
  body('flightId')
    .notEmpty()
    .withMessage('Flight ID is required')
    .isMongoId()
    .withMessage('Invalid flight ID'),
  
  body('passengers')
    .isArray({ min: 1 })
    .withMessage('At least one passenger is required'),
  
  body('passengers.*.firstName')
    .trim()
    .notEmpty()
    .withMessage('Passenger first name is required'),
  
  body('passengers.*.lastName')
    .trim()
    .notEmpty()
    .withMessage('Passenger last name is required'),
  
  body('passengers.*.dateOfBirth')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('passengers.*.email')
    .trim()
    .notEmpty()
    .withMessage('Passenger email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  
  body('seatClass')
    .notEmpty()
    .withMessage('Seat class is required')
    .isIn(['economy', 'business', 'first'])
    .withMessage('Invalid seat class'),
  
  body('contactEmail')
    .trim()
    .notEmpty()
    .withMessage('Contact email is required')
    .isEmail()
    .withMessage('Invalid contact email'),
  
  body('contactPhone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone is required')
];

/**
 * Payment validation rules
 */
export const validateCreatePayment: ValidationChain[] = [
  body('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isMongoId()
    .withMessage('Invalid booking ID')
];

/**
 * Review validation rules
 */
export const validateCreateReview: ValidationChain[] = [
  body('flightId')
    .notEmpty()
    .withMessage('Flight ID is required')
    .isMongoId()
    .withMessage('Invalid flight ID'),
  
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must be less than 1000 characters')
];

/**
 * Price alert validation rules
 */
export const validatePriceAlert: ValidationChain[] = [
  body('origin')
    .trim()
    .notEmpty()
    .withMessage('Origin is required')
    .isLength({ min: 3, max: 3 })
    .withMessage('Origin must be a valid 3-letter airport code')
    .toUpperCase(),
  
  body('destination')
    .trim()
    .notEmpty()
    .withMessage('Destination is required')
    .isLength({ min: 3, max: 3 })
    .withMessage('Destination must be a valid 3-letter airport code')
    .toUpperCase(),
  
  body('targetPrice')
    .notEmpty()
    .withMessage('Target price is required')
    .isFloat({ min: 1 })
    .withMessage('Target price must be greater than 0'),
  
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Invalid expiry date')
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    })
];

/**
 * MongoDB ID parameter validation
 */
export const validateMongoId = (paramName: string = 'id'): ValidationChain[] => [
  param(paramName)
    .notEmpty()
    .withMessage(`${paramName} is required`)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`)
];

/**
 * Pagination validation
 */
export const validatePagination: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

/**
 * Profile update validation
 */
export const validateProfileUpdate: ValidationChain[] = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .withMessage('Invalid phone number'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  
  body('preferences.currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR', 'GBP', 'AED'])
    .withMessage('Invalid currency'),
  
  body('preferences.language')
    .optional()
    .isIn(['en', 'hi', 'ta', 'te', 'ml', 'bn'])
    .withMessage('Invalid language')
];
