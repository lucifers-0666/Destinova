import { Request, Response } from 'express';
import { Flight } from '../models/Flight.js';
import {
  successResponse,
  errorResponse,
  asyncHandler,
  getPagination,
  getPaginationInfo,
  FlightSearchQuery
} from '../types/api.js';

/**
 * @desc    Search flights
 * @route   GET /api/flights/search
 * @access  Public
 */
export const searchFlights = asyncHandler(async (req: Request, res: Response) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers = 1,
    class: seatClass = 'economy',
    sort = 'price',
    order = 'asc',
    flexibleDates = false,
    page = 1,
    limit = 20
  } = req.query as unknown as FlightSearchQuery;

  // Build date range query
  const departureStart = new Date(departureDate);
  departureStart.setHours(0, 0, 0, 0);
  
  const departureEnd = new Date(departureDate);
  departureEnd.setHours(23, 59, 59, 999);

  // If flexible dates, expand range by ±3 days
  if (flexibleDates) {
    departureStart.setDate(departureStart.getDate() - 3);
    departureEnd.setDate(departureEnd.getDate() + 3);
  }

  // Build query
  const query: any = {
    'origin.code': origin?.toUpperCase(),
    'destination.code': destination?.toUpperCase(),
    departureTime: {
      $gte: departureStart,
      $lte: departureEnd
    },
    status: { $in: ['scheduled', 'on-time', 'delayed'] },
    seatsAvailable: { $gte: Number(passengers) }
  };

  // Build sort options
  const sortOptions: any = {};
  switch (sort) {
    case 'price':
      sortOptions.currentPrice = order === 'desc' ? -1 : 1;
      break;
    case 'duration':
      sortOptions.duration = order === 'desc' ? -1 : 1;
      break;
    case 'departure':
      sortOptions.departureTime = order === 'desc' ? -1 : 1;
      break;
    default:
      sortOptions.currentPrice = 1;
  }

  // Get pagination
  const { skip } = getPagination(Number(page), Number(limit));

  // Execute query
  const [flights, total] = await Promise.all([
    Flight.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .select('-priceHistory'),
    Flight.countDocuments(query)
  ]);

  // Calculate prices based on seat class
  const flightsWithPricing = flights.map((flight) => {
    const f = flight.toObject();
    let classPrice = f.currentPrice;
    const seatConfig = f.seatConfiguration as any;
    
    if (seatClass === 'business' && seatConfig?.business) {
      classPrice = seatConfig.business.price || f.currentPrice * 2.5;
    } else if (seatClass === 'first' && seatConfig?.first) {
      classPrice = seatConfig.first.price || f.currentPrice * 4;
    }
    
    return {
      ...f,
      displayPrice: classPrice,
      totalPrice: classPrice * Number(passengers),
      seatClass
    };
  });

  const pagination = getPaginationInfo(total, Number(page), Number(limit));

  return successResponse(
    res,
    200,
    `Found ${total} flights from ${origin} to ${destination}`,
    flightsWithPricing,
    pagination
  );
});

/**
 * @desc    Get flight by ID
 * @route   GET /api/flights/:id
 * @access  Public
 */
export const getFlightById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const flight = await Flight.findById(id);

  if (!flight) {
    return errorResponse(res, 404, 'Flight not found');
  }

  // Get seat availability breakdown
  const seatConfig = flight.seatConfiguration as any;
  const seatAvailability = {
    economy: seatConfig?.economy?.available || 0,
    business: seatConfig?.business?.available || 0,
    first: seatConfig?.first?.available || 0
  };

  return successResponse(res, 200, 'Flight retrieved successfully', {
    ...flight.toObject(),
    seatAvailability
  });
});

/**
 * @desc    Create new flight (admin only)
 * @route   POST /api/flights
 * @access  Private/Admin
 */
export const createFlight = asyncHandler(async (req: Request, res: Response) => {
  const flightData = req.body;

  // Check if flight number already exists for this date
  const existingFlight = await Flight.findOne({
    flightNumber: flightData.flightNumber,
    departureTime: {
      $gte: new Date(new Date(flightData.departureTime).setHours(0, 0, 0, 0)),
      $lte: new Date(new Date(flightData.departureTime).setHours(23, 59, 59, 999))
    }
  });

  if (existingFlight) {
    return errorResponse(
      res,
      400,
      'Flight with this number already exists for the selected date'
    );
  }

  // Set initial current price to base price
  flightData.currentPrice = flightData.basePrice;
  flightData.seatsAvailable = flightData.totalSeats;

  const flight = await Flight.create(flightData);

  return successResponse(res, 201, 'Flight created successfully', flight);
});

/**
 * @desc    Update flight (admin only)
 * @route   PUT /api/flights/:id
 * @access  Private/Admin
 */
export const updateFlight = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const flight = await Flight.findById(id);

  if (!flight) {
    return errorResponse(res, 404, 'Flight not found');
  }

  // If price is being updated, add to price history
  if (updateData.currentPrice && updateData.currentPrice !== flight.currentPrice) {
    flight.priceHistory = flight.priceHistory || [];
    flight.priceHistory.push({
      price: updateData.currentPrice,
      timestamp: new Date(),
      reason: updateData.priceChangeReason || 'Manual update'
    });
  }

  // Update flight
  Object.assign(flight, updateData);
  await flight.save();

  return successResponse(res, 200, 'Flight updated successfully', flight);
});

/**
 * @desc    Delete/Cancel flight (admin only)
 * @route   DELETE /api/flights/:id
 * @access  Private/Admin
 */
export const deleteFlight = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const flight = await Flight.findById(id);

  if (!flight) {
    return errorResponse(res, 404, 'Flight not found');
  }

  // Soft delete - mark as cancelled
  flight.status = 'cancelled';
  await flight.save();

  // TODO: Notify affected passengers and process refunds

  return successResponse(res, 200, 'Flight cancelled successfully', {
    flightNumber: flight.flightNumber,
    status: flight.status
  });
});

/**
 * @desc    Get flight status
 * @route   GET /api/flights/status/:flightNumber
 * @access  Public
 */
export const getFlightStatus = asyncHandler(async (req: Request, res: Response) => {
  const { flightNumber } = req.params;
  const { date } = req.query;

  // Build query
  const query: any = {
    flightNumber: flightNumber.toUpperCase()
  };

  // If date provided, search for that specific date
  if (date) {
    const searchDate = new Date(date as string);
    query.departureTime = {
      $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
      $lte: new Date(searchDate.setHours(23, 59, 59, 999))
    };
  } else {
    // Default to today and upcoming
    query.departureTime = { $gte: new Date() };
  }

  const flight = await Flight.findOne(query)
    .sort({ departureTime: 1 })
    .select('flightNumber airline origin destination departureTime arrivalTime status gate terminal');

  if (!flight) {
    return errorResponse(res, 404, 'Flight not found');
  }

  // Calculate delay if applicable
  let delayMinutes = 0;
  if (flight.status === 'delayed' && flight.estimatedDepartureTime) {
    delayMinutes = Math.round(
      (flight.estimatedDepartureTime.getTime() - flight.departureTime.getTime()) / 60000
    );
  }

  return successResponse(res, 200, 'Flight status retrieved', {
    flightNumber: flight.flightNumber,
    airline: flight.airline,
    origin: flight.origin,
    destination: flight.destination,
    scheduledDeparture: flight.departureTime,
    scheduledArrival: flight.arrivalTime,
    status: flight.status,
    gate: flight.gate,
    terminal: flight.terminal,
    delayMinutes
  });
});

/**
 * @desc    Get popular routes
 * @route   GET /api/flights/popular
 * @access  Public
 */
export const getPopularRoutes = asyncHandler(async (req: Request, res: Response) => {
  const { limit = 10 } = req.query;

  // Aggregate to find popular routes
  const popularRoutes = await Flight.aggregate([
    {
      $match: {
        status: { $in: ['scheduled', 'on-time'] },
        departureTime: { $gte: new Date() }
      }
    },
    {
      $group: {
        _id: {
          origin: '$origin.code',
          destination: '$destination.code'
        },
        originCity: { $first: '$origin.city' },
        destinationCity: { $first: '$destination.city' },
        flightCount: { $sum: 1 },
        minPrice: { $min: '$currentPrice' },
        avgPrice: { $avg: '$currentPrice' }
      }
    },
    {
      $sort: { flightCount: -1 }
    },
    {
      $limit: Number(limit)
    },
    {
      $project: {
        _id: 0,
        route: {
          origin: '$_id.origin',
          destination: '$_id.destination',
          originCity: '$originCity',
          destinationCity: '$destinationCity'
        },
        flightCount: 1,
        startingPrice: { $round: ['$minPrice', 0] },
        averagePrice: { $round: ['$avgPrice', 0] }
      }
    }
  ]);

  return successResponse(res, 200, 'Popular routes retrieved', popularRoutes);
});

/**
 * @desc    Get all flights (admin)
 * @route   GET /api/flights
 * @access  Private/Admin
 */
export const getAllFlights = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 20,
    status,
    airline,
    origin,
    destination,
    dateFrom,
    dateTo
  } = req.query;

  // Build query
  const query: any = {};

  if (status) query.status = status;
  if (airline) query['airline.code'] = airline;
  if (origin) query['origin.code'] = (origin as string).toUpperCase();
  if (destination) query['destination.code'] = (destination as string).toUpperCase();
  
  if (dateFrom || dateTo) {
    query.departureTime = {};
    if (dateFrom) query.departureTime.$gte = new Date(dateFrom as string);
    if (dateTo) query.departureTime.$lte = new Date(dateTo as string);
  }

  const { skip } = getPagination(Number(page), Number(limit));

  const [flights, total] = await Promise.all([
    Flight.find(query)
      .sort({ departureTime: 1 })
      .skip(skip)
      .limit(Number(limit)),
    Flight.countDocuments(query)
  ]);

  const pagination = getPaginationInfo(total, Number(page), Number(limit));

  return successResponse(res, 200, 'Flights retrieved successfully', flights, pagination);
});

/**
 * @desc    Update flight prices (bulk - admin)
 * @route   PUT /api/flights/prices/bulk
 * @access  Private/Admin
 */
export const updatePricesBulk = asyncHandler(async (req: Request, res: Response) => {
  const { updates } = req.body; // Array of { flightId, newPrice, reason }

  if (!Array.isArray(updates) || updates.length === 0) {
    return errorResponse(res, 400, 'No updates provided');
  }

  const results = await Promise.all(
    updates.map(async ({ flightId, newPrice, reason }) => {
      try {
        const flight = await Flight.findById(flightId);
        if (!flight) {
          return { flightId, success: false, error: 'Flight not found' };
        }

        flight.priceHistory = flight.priceHistory || [];
        flight.priceHistory.push({
          price: newPrice,
          timestamp: new Date(),
          reason: reason || 'Bulk price update'
        });
        flight.currentPrice = newPrice;
        await flight.save();

        return { flightId, success: true, newPrice };
      } catch (error) {
        return { flightId, success: false, error: 'Update failed' };
      }
    })
  );

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return successResponse(res, 200, `Updated ${successful} flights, ${failed} failed`, results);
});
