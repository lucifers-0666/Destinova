import { Request, Response, NextFunction } from 'express';

// Standard API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Controller function type
export type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;

// Success response helper - supports both inline and direct usage patterns
export function successResponse<T>(data?: T, message?: string): ApiResponse<T>;
export function successResponse<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  pagination?: PaginationInfo
): Response;
export function successResponse<T>(
  dataOrRes?: T | Response,
  statusCodeOrMessage?: number | string,
  message?: string,
  data?: T,
  pagination?: PaginationInfo
): Response | ApiResponse<T> {
  // Inline usage: successResponse(data) or successResponse(data, message)
  if (typeof statusCodeOrMessage === 'string' || statusCodeOrMessage === undefined) {
    const response: ApiResponse<T> = {
      success: true,
      message: String(statusCodeOrMessage || 'Success'),
      ...(dataOrRes !== undefined && { data: dataOrRes as T })
    };
    return response;
  }
  
  // Direct usage: successResponse(res, statusCode, message, data, pagination)
  const res = dataOrRes as Response;
  const statusCode = statusCodeOrMessage as number;
  const response: ApiResponse<T> = {
    success: true,
    message: message || 'Success',
    ...(data !== undefined && { data }),
    ...(pagination && { pagination })
  };
  return res.status(statusCode).json(response);
}

// Error response helper - supports both inline and direct usage patterns
export function errorResponse(message?: string, errorOrCode?: string | number): ApiResponse;
export function errorResponse(
  res: Response,
  statusCode: number,
  message: string,
  error?: string,
  errors?: Array<{ field: string; message: string }>
): Response;
export function errorResponse(
  messageOrRes?: string | Response,
  statusCodeOrError?: number | string,
  message?: string,
  error?: string,
  errors?: Array<{ field: string; message: string }>
): Response | ApiResponse {
  // Inline usage: errorResponse(message) or errorResponse(message, error/code)
  if (typeof messageOrRes === 'string' || messageOrRes === undefined) {
    const response: ApiResponse = {
      success: false,
      message: (messageOrRes as string) || 'Error',
      ...(statusCodeOrError && typeof statusCodeOrError === 'string' && { error: statusCodeOrError })
    };
    return response;
  }
  
  // Direct usage: errorResponse(res, statusCode, message, error, errors)
  const res = messageOrRes as Response;
  const statusCode = statusCodeOrError as number;
  const response: ApiResponse = {
    success: false,
    message: message || 'Error',
    ...(error && { error }),
    ...(errors && { errors })
  };
  return res.status(statusCode).json(response);
}

// Async handler wrapper to catch errors
export const asyncHandler = (fn: AsyncController) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Pagination helper
export const getPagination = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};

export const getPaginationInfo = (
  total: number,
  page: number,
  limit: number
): PaginationInfo => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// Token payload interface
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Common request body interfaces
export interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ResetPasswordBody {
  token: string;
  password: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

// Booking interfaces
export interface PassengerDetails {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  passportNumber?: string;
  passportExpiry?: Date;
  nationality: string;
  email: string;
  phone: string;
}

export interface CreateBookingBody {
  flightId: string;
  passengers: PassengerDetails[];
  seatClass: 'economy' | 'business' | 'first';
  seatPreferences?: string[];
  mealPreferences?: string[];
  addOns?: {
    insurance?: boolean;
    priorityBoarding?: boolean;
    extraBaggage?: number;
  };
  contactEmail: string;
  contactPhone: string;
}

// Search interfaces
export interface FlightSearchQuery {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers?: number;
  class?: 'economy' | 'business' | 'first';
  sort?: 'price' | 'duration' | 'departure';
  order?: 'asc' | 'desc';
  flexibleDates?: boolean;
  page?: number;
  limit?: number;
}

// Payment interfaces
export interface CreatePaymentBody {
  bookingId: string;
  paymentMethod?: string;
}

export interface ConfirmPaymentBody {
  paymentIntentId: string;
  bookingId: string;
}
