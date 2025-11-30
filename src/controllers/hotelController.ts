import { Request, Response } from 'express';
import { Hotel } from '../models/Hotel.js';

// @desc    Get all hotels with filters
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req: Request, res: Response) => {
  try {
    const { city, country, minRating, maxPrice, guests } = req.query;

    let query: any = {};

    if (city) query.city = { $regex: city, $options: 'i' };
    if (country) query.country = { $regex: country, $options: 'i' };
    if (minRating) query.rating = { $gte: Number(minRating) };
    
    // Filter by price in roomTypes
    if (maxPrice) {
      query['roomTypes.pricePerNight'] = { $lte: Number(maxPrice) };
    }

    // Filter by guests capacity
    if (guests) {
      query['roomTypes.maxGuests'] = { $gte: Number(guests) };
    }

    const hotels = await Hotel.find(query);
    res.json({ data: hotels });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured hotels
// @route   GET /api/hotels/featured
// @access  Public
export const getFeaturedHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ featured: true }).limit(5);
    res.json({ data: hotels });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel) {
      res.json({ data: hotel });
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private/Admin
export const createHotel = async (req: Request, res: Response) => {
  try {
    const hotel = new Hotel(req.body);
    const createdHotel = await hotel.save();
    res.status(201).json({ data: createdHotel });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
