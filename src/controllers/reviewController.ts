import { Request, Response } from 'express';
import { Review } from '../models/Review.js';
import { Booking } from '../models/Booking.js';
import { Flight } from '../models/Flight.js';
import { asyncHandler, successResponse, errorResponse } from '../types/api.js';
import mongoose from 'mongoose';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { bookingId, flightId, rating, title, comment, categories } = req.body;

  // Verify booking exists and belongs to user
  const booking = await Booking.findOne({
    _id: bookingId,
    user: userId,
    status: 'confirmed'
  });

  if (!booking) {
    return res.status(404).json(
      errorResponse('Booking not found or not eligible for review', 404)
    );
  }

  // Check if booking is completed (flight has departed)
  const flight = await Flight.findById(flightId);
  if (!flight) {
    return res.status(404).json(
      errorResponse('Flight not found', 404)
    );
  }

  if (new Date(flight.departureTime) > new Date()) {
    return res.status(400).json(
      errorResponse('Cannot review a flight that has not yet departed', 400)
    );
  }

  // Check if user already reviewed this booking
  const existingReview = await Review.findOne({
    user: userId,
    booking: bookingId
  });

  if (existingReview) {
    return res.status(400).json(
      errorResponse('You have already reviewed this booking', 400)
    );
  }

  // Create review
  const review = await Review.create({
    user: userId,
    booking: bookingId,
    flight: flightId,
    airline: flight.airline,
    rating,
    title,
    comment,
    categories: categories || {
      comfort: rating,
      service: rating,
      cleanliness: rating,
      foodAndBeverage: rating,
      entertainment: rating,
      valueForMoney: rating
    },
    travelClass: booking.class,
    verifiedPurchase: true,
    status: 'pending' // Reviews need moderation
  } as any);

  // Update flight average rating
  await updateFlightRating(flightId.toString());

  res.status(201).json(
    successResponse(review, 'Review submitted successfully and pending approval')
  );
});

// @desc    Get reviews for a flight
// @route   GET /api/reviews/flight/:flightId
// @access  Public
export const getFlightReviews = asyncHandler(async (req: Request, res: Response) => {
  const { flightId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sortBy = req.query.sortBy as string || 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
  const minRating = parseInt(req.query.minRating as string) || 1;

  const query: any = {
    flight: flightId,
    status: 'approved'
  };

  if (minRating > 1) {
    query.rating = { $gte: minRating };
  }

  const skip = (page - 1) * limit;
  const total = await Review.countDocuments(query);

  const reviews = await Review.find(query)
    .populate('user', 'firstName lastName profilePicture')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  // Get rating distribution
  const ratingDistribution = await Review.aggregate([
    { $match: { flight: new mongoose.Types.ObjectId(flightId), status: 'approved' } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);

  // Get average category ratings
  const categoryAverages = await Review.aggregate([
    { $match: { flight: new mongoose.Types.ObjectId(flightId), status: 'approved' } },
    {
      $group: {
        _id: null,
        comfort: { $avg: '$categories.comfort' },
        service: { $avg: '$categories.service' },
        cleanliness: { $avg: '$categories.cleanliness' },
        foodAndBeverage: { $avg: '$categories.foodAndBeverage' },
        entertainment: { $avg: '$categories.entertainment' },
        valueForMoney: { $avg: '$categories.valueForMoney' }
      }
    }
  ]);

  res.json(
    successResponse({
      reviews,
      ratingDistribution,
      categoryAverages: categoryAverages[0] || null,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  );
});

// @desc    Get reviews by airline
// @route   GET /api/reviews/airline/:airline
// @access  Public
export const getAirlineReviews = asyncHandler(async (req: Request, res: Response) => {
  const { airline } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const skip = (page - 1) * limit;
  const query = { airline: decodeURIComponent(airline), status: 'approved' };
  
  const total = await Review.countDocuments(query);

  const reviews = await Review.find(query)
    .populate('user', 'firstName lastName profilePicture')
    .populate('flight', 'flightNumber origin destination')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get airline stats
  const stats = await Review.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        recommended: { 
          $sum: { $cond: [{ $gte: ['$rating', 4] }, 1, 0] }
        }
      }
    }
  ]);

  res.json(
    successResponse({
      reviews,
      stats: stats[0] || { averageRating: 0, totalReviews: 0, recommended: 0 },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  );
});

// @desc    Get my reviews
// @route   GET /api/reviews/my
// @access  Private
export const getMyReviews = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const skip = (page - 1) * limit;
  const total = await Review.countDocuments({ user: userId });

  const reviews = await Review.find({ user: userId })
    .populate('flight', 'flightNumber origin destination airline departureTime')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json(
    successResponse({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  );
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id)
    .populate('user', 'firstName lastName profilePicture')
    .populate('flight', 'flightNumber origin destination airline departureTime');

  if (!review) {
    return res.status(404).json(
      errorResponse('Review not found', 404)
    );
  }

  res.json(successResponse(review));
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { rating, title, comment, categories } = req.body;

  const review = await Review.findOne({
    _id: req.params.id,
    user: userId
  });

  if (!review) {
    return res.status(404).json(
      errorResponse('Review not found or you do not have permission to edit', 404)
    );
  }

  // Check if review was submitted within last 7 days
  const daysSinceCreation = Math.floor(
    (Date.now() - new Date(review.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceCreation > 7) {
    return res.status(400).json(
      errorResponse('Reviews can only be edited within 7 days of submission', 400)
    );
  }

  // Update fields
  if (rating !== undefined) review.rating = rating;
  if (title !== undefined) review.title = title;
  if (comment !== undefined) review.comment = comment;
  if (categories) review.categories = { ...review.categories, ...categories };
  
  // Reset status to pending for re-moderation
  review.status = 'pending';

  await review.save();

  // Update flight rating
  await updateFlightRating(review.flight?.toString() || '');

  res.json(
    successResponse(review, 'Review updated and pending re-approval')
  );
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const isAdmin = req.user?.role === 'admin';

  const query: any = { _id: req.params.id };
  if (!isAdmin) {
    query.user = userId;
  }

  const review = await Review.findOne(query);

  if (!review) {
    return res.status(404).json(
      errorResponse('Review not found or you do not have permission to delete', 404)
    );
  }

  const flightId = review.flight?.toString() || '';
  await review.deleteOne();

  // Update flight rating
  await updateFlightRating(flightId);

  res.json(
    successResponse(null, 'Review deleted successfully')
  );
});

// @desc    Vote on review helpfulness
// @route   POST /api/reviews/:id/vote
// @access  Private
export const voteReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  const { helpful } = req.body; // true for helpful, false for not helpful

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json(
      errorResponse('Review not found', 404)
    );
  }

  // Check if user already voted
  const helpfulIndex = review.helpfulVotes.findIndex(
    id => id.toString() === userId
  );
  const unhelpfulIndex = review.unhelpfulVotes.findIndex(
    id => id.toString() === userId
  );

  if (helpful) {
    // Add to helpful, remove from unhelpful if exists
    if (helpfulIndex === -1) {
      review.helpfulVotes.push(new mongoose.Types.ObjectId(userId));
    }
    if (unhelpfulIndex !== -1) {
      review.unhelpfulVotes.splice(unhelpfulIndex, 1);
    }
  } else {
    // Add to unhelpful, remove from helpful if exists
    if (unhelpfulIndex === -1) {
      review.unhelpfulVotes.push(new mongoose.Types.ObjectId(userId));
    }
    if (helpfulIndex !== -1) {
      review.helpfulVotes.splice(helpfulIndex, 1);
    }
  }

  await review.save();

  res.json(
    successResponse({
      helpfulCount: review.helpfulVotes.length,
      unhelpfulCount: review.unhelpfulVotes.length
    }, 'Vote recorded')
  );
});

// @desc    Report a review
// @route   POST /api/reviews/:id/report
// @access  Private
export const reportReview = asyncHandler(async (req: Request, res: Response) => {
  const { reason } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json(
      errorResponse('Review not found', 404)
    );
  }

  // In production, you'd save this to a separate reports collection
  // For now, flag the review for admin review
  review.status = 'flagged';
  await review.save();

  res.json(
    successResponse(null, 'Review reported and will be reviewed by our team')
  );
});

// Admin endpoints

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/admin/all
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;
  const search = req.query.search as string;

  const query: any = {};

  if (status && ['pending', 'approved', 'rejected', 'flagged'].includes(status)) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { comment: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  const total = await Review.countDocuments(query);

  const reviews = await Review.find(query)
    .populate('user', 'firstName lastName email')
    .populate('flight', 'flightNumber origin destination airline')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get status counts
  const statusCounts = await Review.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.json(
    successResponse({
      reviews,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  );
});

// @desc    Moderate review (admin)
// @route   PUT /api/reviews/admin/:id/moderate
// @access  Private/Admin
export const moderateReview = asyncHandler(async (req: Request, res: Response) => {
  const { status, moderationNote } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json(
      errorResponse('Invalid status. Must be "approved" or "rejected"', 400)
    );
  }

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json(
      errorResponse('Review not found', 404)
    );
  }

  review.status = status;
  review.moderatedAt = new Date();
  review.moderatedBy = new mongoose.Types.ObjectId(req.userId);
  if (moderationNote) {
    review.moderationNote = moderationNote;
  }

  await review.save();

  // Update flight rating if approved
  if (status === 'approved') {
    await updateFlightRating(review.flight?.toString() || '');
  }

  res.json(
    successResponse(review, `Review ${status} successfully`)
  );
});

// Helper function to update flight average rating
async function updateFlightRating(flightId: string): Promise<void> {
  const stats = await Review.aggregate([
    { 
      $match: { 
        flight: new mongoose.Types.ObjectId(flightId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Flight.findByIdAndUpdate(flightId, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  } else {
    await Flight.findByIdAndUpdate(flightId, {
      rating: 0,
      totalReviews: 0
    });
  }
}

// @desc    Get review statistics (admin)
// @route   GET /api/reviews/admin/stats
// @access  Private/Admin
export const getReviewStats = asyncHandler(async (req: Request, res: Response) => {
  const [
    totalStats,
    ratingDistribution,
    topAirlines,
    recentTrends
  ] = await Promise.all([
    // Total statistics
    Review.aggregate([
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          pendingReviews: { 
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          flaggedReviews: {
            $sum: { $cond: [{ $eq: ['$status', 'flagged'] }, 1, 0] }
          }
        }
      }
    ]),
    
    // Rating distribution
    Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]),
    
    // Top rated airlines
    Review.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$airline',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      },
      { $match: { totalReviews: { $gte: 5 } } }, // Min 5 reviews
      { $sort: { averageRating: -1 } },
      { $limit: 10 }
    ]),
    
    // Reviews trend (last 30 days)
    Review.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { _id: 1 } }
    ])
  ]);

  res.json(
    successResponse({
      totalStats: totalStats[0] || {
        totalReviews: 0,
        averageRating: 0,
        pendingReviews: 0,
        flaggedReviews: 0
      },
      ratingDistribution,
      topAirlines,
      recentTrends
    })
  );
});
