import { body, ValidationChain } from 'express-validator';

/**
 * Auth Validators
 * Validation rules for authentication endpoints
 */

// Password strength regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Registration validation rules
 */
export const validateRegister: ValidationChain[] = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes')
    .escape(),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes')
    .escape(),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email must not exceed 254 characters'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(PASSWORD_REGEX)
    .withMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)')
    .custom((value, { req }) => {
      const firstName = req.body.firstName?.toLowerCase() || '';
      const lastName = req.body.lastName?.toLowerCase() || '';
      const email = req.body.email?.split('@')[0]?.toLowerCase() || '';
      const passwordLower = value.toLowerCase();
      
      // Check if password contains name or email
      if (firstName && firstName.length >= 3 && passwordLower.includes(firstName)) {
        throw new Error('Password cannot contain your first name');
      }
      if (lastName && lastName.length >= 3 && passwordLower.includes(lastName)) {
        throw new Error('Password cannot contain your last name');
      }
      if (email && email.length >= 3 && passwordLower.includes(email)) {
        throw new Error('Password cannot contain your email address');
      }
      
      // Check for common passwords
      const commonPasswords = ['password', 'password1', 'qwerty', '123456', 'letmein', 'admin', 'welcome'];
      if (commonPasswords.some(common => passwordLower.includes(common))) {
        throw new Error('Password is too common. Please choose a stronger password');
      }
      
      return true;
    }),
  
  body('confirmPassword')
    .optional()
    .custom((value, { req }) => {
      if (value && value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,14}$/)
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
 * Forgot password validation
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
 * Reset password validation
 */
export const validateResetPassword: ValidationChain[] = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 64, max: 64 })
    .withMessage('Invalid reset token'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(PASSWORD_REGEX)
    .withMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)')
];

/**
 * Change password validation
 */
export const validateChangePassword: ValidationChain[] = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters')
    .matches(PASSWORD_REGEX)
    .withMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

export default {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword
};
