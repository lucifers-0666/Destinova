import { Request, Response } from 'express';
import { Destination } from '../models/Destination.js';
import { Flight } from '../models/Flight.js';
import { asyncHandler, successResponse, errorResponse } from '../types/api.js';

// @desc    Get all destinations with pagination and filtering
// @route   GET /api/destinations
// @access  Public
export const getDestinations = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const continent = req.query.continent as string;
  const country = req.query.country as string;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string || 'name';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

  const query: any = {};

  if (continent) {
    query.continent = continent;
  }

  if (country) {
    query.country = { $regex: country, $options: 'i' };
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { country: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  const total = await Destination.countDocuments(query);

  const destinations = await Destination.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  res.json(
    successResponse({
      destinations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  );
});

// @desc    Get featured destinations
// @route   GET /api/destinations/featured
// @access  Public
export const getFeaturedDestinations = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 8;
  
  const destinations = await Destination.find({ featured: true })
    .sort({ rating: -1 })
    .limit(limit);

  res.json(successResponse(destinations));
});

// @desc    Get popular destinations (based on flight bookings)
// @route   GET /api/destinations/popular
// @access  Public
export const getPopularDestinations = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

  // Get destinations with most flights
  const popular = await Flight.aggregate([
    {
      $match: {
        departureTime: { $gte: new Date() }
      }
    },
    {
      $group: {
        _id: '$destination.code',
        city: { $first: '$destination.city' },
        country: { $first: '$destination.country' },
        flightCount: { $sum: 1 },
        avgPrice: { $avg: '$price.economy' },
        minPrice: { $min: '$price.economy' }
      }
    },
    { $sort: { flightCount: -1 } },
    { $limit: limit }
  ]);

  // Enhance with destination details
  const enhancedDestinations = await Promise.all(
    popular.map(async (dest) => {
      const fullDestination = await Destination.findOne({ code: dest._id });
      return {
        ...dest,
        destination: fullDestination || null
      };
    })
  );

  res.json(successResponse(enhancedDestinations));
});

// @desc    Get destination by ID
// @route   GET /api/destinations/:id
// @access  Public
export const getDestinationById = asyncHandler(async (req: Request, res: Response) => {
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return res.status(404).json(
      errorResponse('Destination not found', 404)
    );
  }

  // Get flight stats for this destination
  const flightStats = await Flight.aggregate([
    {
      $match: {
        $or: [
          { 'destination.code': destination.code },
          { 'origin.code': destination.code }
        ],
        departureTime: { $gte: new Date() }
      }
    },
    {
      $group: {
        _id: null,
        totalFlights: { $sum: 1 },
        minPrice: { $min: '$price.economy' },
        avgPrice: { $avg: '$price.economy' },
        airlines: { $addToSet: '$airline' }
      }
    }
  ]);

  res.json(
    successResponse({
      destination,
      flightStats: flightStats[0] || {
        totalFlights: 0,
        minPrice: null,
        avgPrice: null,
        airlines: []
      }
    })
  );
});

// @desc    Get destination by code
// @route   GET /api/destinations/code/:code
// @access  Public
export const getDestinationByCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;
  
  const destination = await Destination.findOne({ 
    code: code.toUpperCase() 
  });
  
  if (!destination) {
    return res.status(404).json(
      errorResponse('Destination not found', 404)
    );
  }

  res.json(successResponse(destination));
});

// @desc    Search destinations (autocomplete)
// @route   GET /api/destinations/search
// @access  Public
export const searchDestinations = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!query || query.length < 2) {
    return res.status(400).json(
      errorResponse('Search query must be at least 2 characters', 400)
    );
  }

  const destinations = await Destination.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { city: { $regex: query, $options: 'i' } },
      { country: { $regex: query, $options: 'i' } },
      { code: { $regex: `^${query}`, $options: 'i' } }
    ]
  })
    .select('name city country code continent image')
    .limit(limit);

  res.json(successResponse(destinations));
});

// @desc    Get destinations by continent
// @route   GET /api/destinations/continent/:continent
// @access  Public
export const getDestinationsByContinent = asyncHandler(async (req: Request, res: Response) => {
  const { continent } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const validContinents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania', 'Antarctica'];
  
  if (!validContinents.some(c => c.toLowerCase() === continent.toLowerCase())) {
    return res.status(400).json(
      errorResponse('Invalid continent', 400)
    );
  }

  const skip = (page - 1) * limit;
  const query = { continent: { $regex: continent, $options: 'i' } };
  const total = await Destination.countDocuments(query);

  const destinations = await Destination.find(query)
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit);

  res.json(
    successResponse({
      destinations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  );
});

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    code,
    city,
    country,
    continent,
    description,
    image,
    images,
    highlights,
    bestTimeToVisit,
    currency,
    language,
    timezone,
    featured
  } = req.body;

  // Check if destination code already exists
  const existingDestination = await Destination.findOne({ code: code.toUpperCase() });
  if (existingDestination) {
    return res.status(400).json(
      errorResponse('Destination with this code already exists', 400)
    );
  }

  const destination = await Destination.create({
    name,
    code: code.toUpperCase(),
    city,
    country,
    continent,
    description,
    image,
    images,
    highlights,
    bestTimeToVisit,
    currency,
    language,
    timezone,
    featured: featured || false
  });

  res.status(201).json(
    successResponse(destination, 'Destination created successfully')
  );
});

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = asyncHandler(async (req: Request, res: Response) => {
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return res.status(404).json(
      errorResponse('Destination not found', 404)
    );
  }

  // If code is being updated, check for uniqueness
  if (req.body.code && req.body.code.toUpperCase() !== destination.code) {
    const existingDestination = await Destination.findOne({ 
      code: req.body.code.toUpperCase(),
      _id: { $ne: req.params.id }
    });
    if (existingDestination) {
      return res.status(400).json(
        errorResponse('Destination with this code already exists', 400)
      );
    }
  }

  const updatedFields = { ...req.body };
  if (updatedFields.code) {
    updatedFields.code = updatedFields.code.toUpperCase();
  }

  const updatedDestination = await Destination.findByIdAndUpdate(
    req.params.id,
    updatedFields,
    { new: true, runValidators: true }
  );

  res.json(
    successResponse(updatedDestination, 'Destination updated successfully')
  );
});

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = asyncHandler(async (req: Request, res: Response) => {
  const destination = await Destination.findById(req.params.id);
  
  if (!destination) {
    return res.status(404).json(
      errorResponse('Destination not found', 404)
    );
  }

  // Check if there are flights using this destination
  const flightsCount = await Flight.countDocuments({
    $or: [
      { 'origin.code': destination.code },
      { 'destination.code': destination.code }
    ]
  });

  if (flightsCount > 0) {
    return res.status(400).json(
      errorResponse(
        `Cannot delete destination with ${flightsCount} associated flights. Please remove flights first.`,
        400
      )
    );
  }

  await destination.deleteOne();

  res.json(
    successResponse(null, 'Destination deleted successfully')
  );
});

// @desc    Get destination statistics (admin)
// @route   GET /api/destinations/stats
// @access  Private/Admin
export const getDestinationStats = asyncHandler(async (req: Request, res: Response) => {
  const [
    totalDestinations,
    byContinent,
    featured,
    flightCoverage
  ] = await Promise.all([
    // Total count
    Destination.countDocuments(),
    
    // By continent
    Destination.aggregate([
      { $group: { _id: '$continent', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    
    // Featured count
    Destination.countDocuments({ featured: true }),
    
    // Destinations with flights
    Flight.aggregate([
      {
        $group: {
          _id: '$destination.code'
        }
      },
      {
        $count: 'destinationsWithFlights'
      }
    ])
  ]);

  res.json(
    successResponse({
      totalDestinations,
      byContinent,
      featuredCount: featured,
      destinationsWithFlights: flightCoverage[0]?.destinationsWithFlights || 0,
      coveragePercent: totalDestinations > 0 
        ? Math.round((flightCoverage[0]?.destinationsWithFlights || 0) / totalDestinations * 100)
        : 0
    })
  );
});
