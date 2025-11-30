import { Request, Response } from 'express';
import { PriceAlert } from '../models/PriceAlert.js';
import { Flight } from '../models/Flight.js';
import { Destination } from '../models/Destination.js';
import { asyncHandler, successResponse, errorResponse } from '../types/api.js';

// @desc    Create a price alert
// @route   POST /api/price-alerts
// @access  Private
export const createPriceAlert = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const {
    originCode,
    destinationCode,
    travelDateStart,
    travelDateEnd,
    targetPrice,
    preferredClass,
    alertFrequency,
    notificationChannels,
    isFlexibleDates,
    flexibleDays,
    maxStops,
    preferredAirlines,
    name
  } = req.body;

  // Get origin and destination details
  const [originDest, destDest] = await Promise.all([
    Destination.findOne({ code: originCode.toUpperCase() }),
    Destination.findOne({ code: destinationCode.toUpperCase() })
  ]);

  // Check if user already has an active alert for this route
  const existingAlert = await PriceAlert.findOne({
    user: userId,
    'origin.airportCode': originCode.toUpperCase(),
    'destination.airportCode': destinationCode.toUpperCase(),
    isActive: true,
    travelDateStart: travelDateStart ? {
      $gte: new Date(new Date(travelDateStart).setHours(0, 0, 0, 0)),
      $lt: new Date(new Date(travelDateStart).setHours(23, 59, 59, 999))
    } : { $exists: false }
  });

  if (existingAlert) {
    return res.status(400).json(
      errorResponse('You already have an active price alert for this route and date', 400)
    );
  }

  // Check user's alert limit (max 10 active alerts)
  const activeAlertsCount = await PriceAlert.countDocuments({
    user: userId,
    isActive: true
  });

  if (activeAlertsCount >= 10) {
    return res.status(400).json(
      errorResponse('You have reached the maximum limit of 10 active price alerts', 400)
    );
  }

  // Get current lowest price for reference
  const priceField = `price.${preferredClass || 'economy'}`;
  const currentLowestFlight = await Flight.findOne({
    'origin.code': originCode.toUpperCase(),
    'destination.code': destinationCode.toUpperCase(),
    departureTime: travelDateStart ? {
      $gte: new Date(travelDateStart),
      $lt: new Date(new Date(travelDateStart).setDate(new Date(travelDateStart).getDate() + (flexibleDays || 0) + 1))
    } : { $gte: new Date() },
    availableSeats: { $gt: 0 }
  }).sort({ [priceField]: 1 });

  const flightPrice = currentLowestFlight?.price as any;
  const currentLowestPrice = flightPrice?.[preferredClass || 'economy'] as number | undefined;

  // Calculate expiry date (default 30 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const priceAlert = await PriceAlert.create({
    user: userId,
    origin: {
      airportCode: originCode.toUpperCase(),
      city: originDest?.city || originCode.toUpperCase(),
      country: originDest?.country
    },
    destination: {
      airportCode: destinationCode.toUpperCase(),
      city: destDest?.city || destinationCode.toUpperCase(),
      country: destDest?.country
    },
    targetPrice,
    currentLowestPrice,
    currency: 'USD',
    travelDateStart: travelDateStart ? new Date(travelDateStart) : undefined,
    travelDateEnd: travelDateEnd ? new Date(travelDateEnd) : undefined,
    isFlexibleDates: isFlexibleDates || false,
    flexibleDays: flexibleDays || 0,
    preferredClass: preferredClass || 'any',
    maxStops,
    preferredAirlines,
    alertFrequency: alertFrequency || 'daily',
    notificationChannels: notificationChannels || ['email'],
    isActive: true,
    isPaused: false,
    expiresAt,
    name,
    lowestPriceEver: currentLowestPrice || targetPrice,
    lowestPriceDate: currentLowestPrice ? new Date() : undefined,
    totalNotificationsSent: 0,
    timesChecked: 0,
    priceDropsDetected: 0,
    autoRenew: false
  });

  res.status(201).json(
    successResponse(priceAlert, 'Price alert created successfully')
  );
});

// @desc    Get my price alerts
// @route   GET /api/price-alerts/my
// @access  Private
export const getMyAlerts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const status = req.query.status as string; // active, expired, triggered

  const query: any = { user: userId };

  if (status === 'active') {
    query.isActive = true;
    query.isPaused = false;
    query.expiresAt = { $gt: new Date() };
  } else if (status === 'expired') {
    query.$or = [
      { isActive: false },
      { expiresAt: { $lte: new Date() } }
    ];
  } else if (status === 'paused') {
    query.isPaused = true;
  }

  const skip = (page - 1) * limit;
  const total = await PriceAlert.countDocuments(query);

  const alerts = await PriceAlert.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get current prices for active alerts
  const alertsWithCurrentPrices = await Promise.all(
    alerts.map(async (alert) => {
      const travelDate = alert.travelDateStart;
      if (alert.isActive && travelDate && new Date(travelDate) > new Date()) {
        const priceField = alert.preferredClass === 'any' ? 'economy' : alert.preferredClass;
        const currentFlight = await Flight.findOne({
          'origin.code': alert.origin.airportCode,
          'destination.code': alert.destination.airportCode,
          departureTime: {
            $gte: new Date(travelDate),
            $lt: new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() + (alert.flexibleDays || 0) + 1))
          },
          availableSeats: { $gt: 0 }
        }).sort({ [`price.${priceField}`]: 1 });

        const flightPrice = currentFlight?.price as any;
        const currentPrice = priceField ? (flightPrice?.[priceField] as number | null) : null;
        
        return {
          ...alert.toObject(),
          latestPrice: currentPrice,
          priceDifference: currentPrice 
            ? alert.targetPrice - currentPrice
            : null,
          isTargetMet: currentPrice ? currentPrice <= alert.targetPrice : false
        };
      }
      return alert.toObject();
    })
  );

  res.json(
    successResponse({
      alerts: alertsWithCurrentPrices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  );
});

// @desc    Get single price alert
// @route   GET /api/price-alerts/:id
// @access  Private
export const getAlertById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  const alert = await PriceAlert.findOne({
    _id: req.params.id,
    user: userId
  });

  if (!alert) {
    return res.status(404).json(
      errorResponse('Price alert not found', 404)
    );
  }

  // Get matching flights
  const travelDate = alert.travelDateStart;
  const priceField = alert.preferredClass === 'any' ? 'economy' : alert.preferredClass;
  
  let matchingFlights: any[] = [];
  if (travelDate) {
    matchingFlights = await Flight.find({
      'origin.code': alert.origin.airportCode,
      'destination.code': alert.destination.airportCode,
      departureTime: {
        $gte: new Date(travelDate),
        $lt: new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() + (alert.flexibleDays || 0) + 1))
      },
      [`price.${priceField}`]: { $lte: alert.targetPrice + (alert.priceFlexibility || 0) },
      availableSeats: { $gt: 0 }
    })
      .sort({ [`price.${priceField}`]: 1 })
      .limit(5);
  }

  res.json(
    successResponse({
      alert,
      matchingFlights
    })
  );
});

// @desc    Update price alert
// @route   PUT /api/price-alerts/:id
// @access  Private
export const updateAlert = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { targetPrice, priceFlexibility, isActive, isPaused, pausedReason, alertFrequency, notificationChannels, name } = req.body;

  const alert = await PriceAlert.findOne({
    _id: req.params.id,
    user: userId
  });

  if (!alert) {
    return res.status(404).json(
      errorResponse('Price alert not found', 404)
    );
  }

  if (targetPrice !== undefined) alert.targetPrice = targetPrice;
  if (priceFlexibility !== undefined) alert.priceFlexibility = priceFlexibility;
  if (isActive !== undefined) alert.isActive = isActive;
  if (isPaused !== undefined) {
    alert.isPaused = isPaused;
    if (isPaused && pausedReason) alert.pausedReason = pausedReason;
  }
  if (alertFrequency !== undefined) alert.alertFrequency = alertFrequency;
  if (notificationChannels !== undefined) alert.notificationChannels = notificationChannels;
  if (name !== undefined) alert.name = name;

  await alert.save();

  res.json(
    successResponse(alert, 'Price alert updated successfully')
  );
});

// @desc    Delete price alert
// @route   DELETE /api/price-alerts/:id
// @access  Private
export const deleteAlert = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  const alert = await PriceAlert.findOneAndDelete({
    _id: req.params.id,
    user: userId
  });

  if (!alert) {
    return res.status(404).json(
      errorResponse('Price alert not found', 404)
    );
  }

  res.json(
    successResponse(null, 'Price alert deleted successfully')
  );
});

// @desc    Check and process price alerts (background job)
// @route   POST /api/price-alerts/check
// @access  Private/Admin or System
export const checkAlerts = asyncHandler(async (req: Request, res: Response) => {
  // Get all active, non-expired, non-paused alerts
  const activeAlerts = await PriceAlert.find({
    isActive: true,
    isPaused: false,
    expiresAt: { $gt: new Date() },
    $or: [
      { travelDateStart: { $gt: new Date() } },
      { travelDateStart: { $exists: false } }
    ]
  }).populate('user', 'email firstName notificationPreferences');

  const triggeredAlerts: any[] = [];
  const updatedAlerts: any[] = [];

  for (const alert of activeAlerts) {
    const priceField = alert.preferredClass === 'any' ? 'economy' : alert.preferredClass;
    const travelDate = alert.travelDateStart;
    
    // Build query for matching flights
    const flightQuery: any = {
      'origin.code': alert.origin.airportCode,
      'destination.code': alert.destination.airportCode,
      [`price.${priceField}`]: { $lte: alert.targetPrice },
      availableSeats: { $gt: 0 }
    };
    
    if (travelDate) {
      flightQuery.departureTime = {
        $gte: new Date(travelDate),
        $lt: new Date(new Date(travelDate).setDate(
          new Date(travelDate).getDate() + (alert.flexibleDays || 0) + 1
        ))
      };
    } else {
      flightQuery.departureTime = { $gte: new Date() };
    }

    // Find flights matching the alert criteria
    const matchingFlight = await Flight.findOne(flightQuery).sort({ [`price.${priceField}`]: 1 });

    if (matchingFlight) {
      const flightPrice = matchingFlight.price as any;
      const currentPrice = priceField ? ((flightPrice?.[priceField] || 0) as number) : 0;
      
      // Check if this is a new price drop
      const shouldNotify = !alert.lastNotifiedAt || 
        currentPrice < (alert.lowestPriceEver || Infinity) ||
        (Date.now() - new Date(alert.lastNotifiedAt).getTime() > 24 * 60 * 60 * 1000); // At least 24h since last notification
        
      if (shouldNotify) {
        // Update lowest price ever if applicable
        if (currentPrice < (alert.lowestPriceEver || Infinity)) {
          alert.lowestPriceEver = currentPrice;
          alert.lowestPriceDate = new Date();
        }
        
        alert.lastNotifiedAt = new Date();
        alert.totalNotificationsSent = (alert.totalNotificationsSent || 0) + 1;
        alert.priceDropsDetected = (alert.priceDropsDetected || 0) + 1;
        
        triggeredAlerts.push({
          alertId: alert._id,
          user: alert.user,
          origin: alert.origin,
          destination: alert.destination,
          targetPrice: alert.targetPrice,
          currentPrice,
          savings: alert.targetPrice - currentPrice,
          flight: matchingFlight
        });

        // In production, send email/push notification here
        // await sendPriceAlertNotification(alert.user, matchingFlight, currentPrice);
      }
    }

    // Update last checked time and current price
    const latestFlightQuery: any = {
      'origin.code': alert.origin.airportCode,
      'destination.code': alert.destination.airportCode,
      availableSeats: { $gt: 0 }
    };
    
    if (travelDate) {
      latestFlightQuery.departureTime = {
        $gte: new Date(travelDate),
        $lt: new Date(new Date(travelDate).setDate(new Date(travelDate).getDate() + 1))
      };
    } else {
      latestFlightQuery.departureTime = { $gte: new Date() };
    }
    
    const latestFlight = await Flight.findOne(latestFlightQuery).sort({ [`price.${priceField}`]: 1 });

    alert.lastCheckedAt = new Date();
    alert.timesChecked = (alert.timesChecked || 0) + 1;
    if (latestFlight) {
      const latestFlightPrice = latestFlight.price as any;
      alert.currentLowestPrice = priceField ? ((latestFlightPrice?.[priceField] || 0) as number) : 0;
    }

    await alert.save();
    updatedAlerts.push(alert._id);
  }

  res.json(
    successResponse({
      checkedCount: activeAlerts.length,
      triggeredCount: triggeredAlerts.length,
      triggeredAlerts: triggeredAlerts.map(a => ({
        alertId: a.alertId,
        route: `${a.origin.city} (${a.origin.airportCode}) → ${a.destination.city} (${a.destination.airportCode})`,
        targetPrice: a.targetPrice,
        currentPrice: a.currentPrice,
        savings: a.savings
      }))
    }, `Checked ${activeAlerts.length} alerts, ${triggeredAlerts.length} triggered`)
  );
});

// @desc    Get price history for a route
// @route   GET /api/price-alerts/price-history
// @access  Public
export const getPriceHistory = asyncHandler(async (req: Request, res: Response) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res.status(400).json(
      errorResponse('Origin and destination are required', 400)
    );
  }

  // Get price trends from flights over the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const priceHistory = await Flight.aggregate([
    {
      $match: {
        'origin.code': (origin as string).toUpperCase(),
        'destination.code': (destination as string).toUpperCase(),
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        minEconomy: { $min: '$price.economy' },
        maxEconomy: { $max: '$price.economy' },
        avgEconomy: { $avg: '$price.economy' },
        minBusiness: { $min: '$price.business' },
        avgBusiness: { $avg: '$price.business' },
        minFirst: { $min: '$price.first' },
        avgFirst: { $avg: '$price.first' },
        flightCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get current lowest prices
  const currentPrices = await Flight.findOne({
    'origin.code': (origin as string).toUpperCase(),
    'destination.code': (destination as string).toUpperCase(),
    departureTime: { $gte: new Date() },
    availableSeats: { $gt: 0 }
  }).sort({ 'price.economy': 1 });

  // Calculate price statistics
  const stats = await Flight.aggregate([
    {
      $match: {
        'origin.code': (origin as string).toUpperCase(),
        'destination.code': (destination as string).toUpperCase(),
        departureTime: { $gte: new Date() }
      }
    },
    {
      $group: {
        _id: null,
        lowestEconomy: { $min: '$price.economy' },
        highestEconomy: { $max: '$price.economy' },
        avgEconomy: { $avg: '$price.economy' },
        lowestBusiness: { $min: '$price.business' },
        avgBusiness: { $avg: '$price.business' }
      }
    }
  ]);

  res.json(
    successResponse({
      route: `${(origin as string).toUpperCase()} → ${(destination as string).toUpperCase()}`,
      priceHistory,
      currentLowest: currentPrices?.price || null,
      statistics: stats[0] || null,
      recommendation: stats[0] ? {
        economy: {
          goodPrice: Math.round(stats[0].avgEconomy * 0.9),
          greatPrice: Math.round(stats[0].lowestEconomy * 1.1)
        },
        business: stats[0].avgBusiness ? {
          goodPrice: Math.round(stats[0].avgBusiness * 0.9),
          greatPrice: Math.round(stats[0].lowestBusiness * 1.1)
        } : null
      } : null
    })
  );
});

// @desc    Get suggested price alerts based on search history
// @route   GET /api/price-alerts/suggestions
// @access  Private
export const getAlertSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;

  // Get user's existing alerts to avoid duplicates
  const existingAlerts = await PriceAlert.find({
    user: userId,
    isActive: true
  }).select('origin destination');

  const existingRoutes = new Set(
    existingAlerts.map(a => `${a.origin}-${a.destination}`)
  );

  // Get popular routes with good deals
  const popularRoutes = await Flight.aggregate([
    {
      $match: {
        departureTime: { $gte: new Date() },
        availableSeats: { $gt: 0 }
      }
    },
    {
      $group: {
        _id: { origin: '$origin.code', destination: '$destination.code' },
        lowestPrice: { $min: '$price.economy' },
        avgPrice: { $avg: '$price.economy' },
        flightCount: { $sum: 1 },
        originCity: { $first: '$origin.city' },
        destinationCity: { $first: '$destination.city' }
      }
    },
    {
      $match: {
        flightCount: { $gte: 3 } // At least 3 flights
      }
    },
    {
      $addFields: {
        discount: {
          $multiply: [
            { $divide: [{ $subtract: ['$avgPrice', '$lowestPrice'] }, '$avgPrice'] },
            100
          ]
        }
      }
    },
    { $match: { discount: { $gte: 10 } } }, // At least 10% below average
    { $sort: { discount: -1 } },
    { $limit: 10 }
  ]);

  // Filter out routes user already has alerts for
  const suggestions = popularRoutes
    .filter(route => !existingRoutes.has(`${route._id.origin}-${route._id.destination}`))
    .map(route => ({
      origin: route._id.origin,
      destination: route._id.destination,
      originCity: route.originCity,
      destinationCity: route.destinationCity,
      currentLowestPrice: Math.round(route.lowestPrice),
      averagePrice: Math.round(route.avgPrice),
      suggestedAlertPrice: Math.round(route.lowestPrice * 0.95), // 5% below current lowest
      potentialSavings: Math.round(route.avgPrice - route.lowestPrice),
      discountPercent: Math.round(route.discount)
    }));

  res.json(
    successResponse({
      suggestions,
      message: suggestions.length > 0 
        ? 'Based on current market prices'
        : 'No suggestions available at this time'
    })
  );
});

// Admin endpoints

// @desc    Get all price alerts (admin)
// @route   GET /api/price-alerts/admin/all
// @access  Private/Admin
export const getAllAlerts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;

  const query: any = {};

  if (status === 'active') {
    query.isActive = true;
    query.expiresAt = { $gt: new Date() };
  } else if (status === 'expired') {
    query.$or = [
      { isActive: false },
      { expiresAt: { $lte: new Date() } }
    ];
  } else if (status === 'triggered') {
    query.triggeredAt = { $exists: true };
  }

  const skip = (page - 1) * limit;
  const total = await PriceAlert.countDocuments(query);

  const alerts = await PriceAlert.find(query)
    .populate('user', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get statistics
  const stats = await PriceAlert.aggregate([
    {
      $group: {
        _id: null,
        totalAlerts: { $sum: 1 },
        activeAlerts: { 
          $sum: { 
            $cond: [
              { $and: [{ $eq: ['$isActive', true] }, { $gt: ['$expiresAt', new Date()] }] },
              1, 0
            ]
          }
        },
        triggeredAlerts: {
          $sum: { $cond: [{ $ne: ['$triggeredAt', null] }, 1, 0] }
        },
        totalNotificationsSent: { $sum: '$notificationsSent' }
      }
    }
  ]);

  // Get popular routes being monitored
  const popularRoutes = await PriceAlert.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: { origin: '$origin', destination: '$destination' },
        count: { $sum: 1 },
        avgTargetPrice: { $avg: '$targetPrice' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  res.json(
    successResponse({
      alerts,
      stats: stats[0] || {
        totalAlerts: 0,
        activeAlerts: 0,
        triggeredAlerts: 0,
        totalNotificationsSent: 0
      },
      popularRoutes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  );
});
