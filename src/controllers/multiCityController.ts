/**
 * Multi-City Booking Controller
 * Handles multi-city flight bookings
 */

import { Request, Response } from 'express';
import { Booking } from '../models/Booking.js';
import { Flight } from '../models/Flight.js';
import mongoose from 'mongoose';

/**
 * Multi-City Flight Leg Interface
 */
interface IFlightLeg {
  flightId: string;
  date: string;
}

/**
 * Create multi-city booking
 * POST /api/bookings/multi-city
 */
export const createMultiCityBooking = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const userId = (req as any).user?.id;
    const {
      flights, // Array of { flightId, date }
      passengers,
      contactDetails,
      cabinClass = 'economy',
      promoCode,
      insurance
    } = req.body;
    
    // Validate flights array
    if (!flights || !Array.isArray(flights) || flights.length < 2) {
      res.status(400).json({
        success: false,
        message: 'At least 2 flights are required for multi-city booking'
      });
      return;
    }
    
    if (flights.length > 5) {
      res.status(400).json({
        success: false,
        message: 'Maximum 5 flights allowed for multi-city booking'
      });
      return;
    }
    
    // Validate passengers
    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one passenger is required'
      });
      return;
    }
    
    // Fetch and validate all flights
    const flightIds = flights.map((f: IFlightLeg) => f.flightId);
    const flightDocs = await Flight.find({ _id: { $in: flightIds } }).session(session);
    
    if (flightDocs.length !== flights.length) {
      await session.abortTransaction();
      res.status(404).json({
        success: false,
        message: 'One or more flights not found'
      });
      return;
    }
    
    // Check availability for all flights
    const unavailableFlights: string[] = [];
    let totalBasePrice = 0;
    
    for (const flight of flightDocs) {
      const availableSeats = flight.availableSeats || 0;
      if (availableSeats < passengers.length) {
        unavailableFlights.push(flight.flightNumber);
      }
      totalBasePrice += (flight.currentPrice || flight.basePrice) * passengers.length;
    }
    
    if (unavailableFlights.length > 0) {
      await session.abortTransaction();
      res.status(400).json({
        success: false,
        message: `Insufficient seats on flights: ${unavailableFlights.join(', ')}`
      });
      return;
    }
    
    // Calculate pricing
    let totalAmount = totalBasePrice;
    let promoDiscount = 0;
    let insurancePremium = 0;
    
    // Apply promo code discount (simplified)
    if (promoCode) {
      // TODO: Validate promo code and calculate discount
      promoDiscount = Math.round(totalAmount * 0.1); // 10% discount for demo
    }
    
    // Add insurance premium
    if (insurance?.planId) {
      insurancePremium = insurance.premium || 0;
    }
    
    // Build flights array for booking
    const bookingFlights = flights.map((leg: IFlightLeg, index: number) => ({
      flight: new mongoose.Types.ObjectId(leg.flightId),
      date: new Date(leg.date),
      passengers: []
    }));
    
    // Calculate taxes and fees
    const taxes = Math.round(totalBasePrice * 0.12); // 12% tax
    const convenienceFee = 199 * flights.length;
    
    const finalAmount = totalBasePrice + taxes + convenienceFee - promoDiscount + insurancePremium;
    
    // Create booking
    const booking = new Booking({
      user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      bookingType: 'flight',
      isMultiCity: true,
      flights: bookingFlights,
      
      // Travel dates (first and last flight)
      travelDate: new Date(flights[0].date),
      returnDate: new Date(flights[flights.length - 1].date),
      
      // Passengers
      passengers: passengers.map((p: any) => ({
        type: p.type || 'adult',
        title: p.title || 'Mr',
        firstName: p.firstName,
        lastName: p.lastName,
        dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : undefined,
        gender: p.gender || 'male',
        nationality: p.nationality || 'IN',
        passportNumber: p.passportNumber,
        passportExpiry: p.passportExpiry ? new Date(p.passportExpiry) : undefined,
        email: p.email,
        phone: p.phone
      })),
      totalPassengers: passengers.length,
      adults: passengers.filter((p: any) => p.type === 'adult').length || 1,
      children: passengers.filter((p: any) => p.type === 'child').length || 0,
      infants: passengers.filter((p: any) => p.type === 'infant').length || 0,
      
      // Contact
      contactDetails: {
        email: contactDetails.email,
        phone: contactDetails.phone,
        alternatePhone: contactDetails.alternatePhone
      },
      
      // Pricing
      priceBreakdown: {
        basePrice: totalBasePrice,
        taxes,
        fees: convenienceFee,
        discount: promoDiscount,
        insurance: insurancePremium,
        total: finalAmount
      },
      totalAmount: finalAmount,
      paidAmount: 0,
      dueAmount: finalAmount,
      currency: 'INR',
      
      // Insurance
      insuranceOpted: !!insurance?.planId,
      insurance: insurance?.planId ? new mongoose.Types.ObjectId(insurance.planId) : undefined,
      insurancePremium,
      
      // Promo
      promoCode,
      promoDiscount,
      
      // Status
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      bookingSource: 'web',
      bookingDate: new Date()
    });
    
    // Generate booking reference and PNR
    booking.bookingReference = booking.generateBookingReference();
    booking.pnr = `MC${Date.now().toString(36).toUpperCase()}`;
    
    await booking.save({ session });
    
    // Update seat availability on all flights
    for (const flightDoc of flightDocs) {
      flightDoc.availableSeats = Math.max(0, (flightDoc.availableSeats || 0) - passengers.length);
      flightDoc.bookedSeats = (flightDoc.bookedSeats || 0) + passengers.length;
      await flightDoc.save({ session });
    }
    
    await session.commitTransaction();
    
    // Populate flight details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('flights.flight', 'flightNumber airline origin destination departureTime arrivalTime')
      .populate('insurance', 'name price maxCoverageAmount');
    
    res.status(201).json({
      success: true,
      message: 'Multi-city booking created successfully',
      data: {
        booking: populatedBooking,
        bookingReference: booking.bookingReference,
        pnr: booking.pnr,
        totalAmount: finalAmount,
        paymentDue: finalAmount
      }
    });
    
  } catch (error: any) {
    await session.abortTransaction();
    console.error('[MultiCityController] createMultiCityBooking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create multi-city booking',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

/**
 * Get multi-city booking details
 * GET /api/bookings/multi-city/:id
 */
export const getMultiCityBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    
    const booking = await Booking.findOne({
      _id: id,
      isMultiCity: true,
      ...(userId && { user: userId })
    })
      .populate('flights.flight', 'flightNumber airline origin destination departureTime arrivalTime duration')
      .populate('insurance', 'name price maxCoverageAmount coverage');
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Multi-city booking not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
    
  } catch (error: any) {
    console.error('[MultiCityController] getMultiCityBooking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: error.message
    });
  }
};

/**
 * Search flights for multi-city
 * POST /api/flights/search/multi-city
 */
export const searchMultiCityFlights = async (req: Request, res: Response): Promise<void> => {
  try {
    const { legs, passengers, cabinClass = 'economy' } = req.body;
    
    if (!legs || !Array.isArray(legs) || legs.length < 2) {
      res.status(400).json({
        success: false,
        message: 'At least 2 legs required for multi-city search'
      });
      return;
    }
    
    const results: any[] = [];
    
    for (const leg of legs) {
      const { origin, destination, date } = leg;
      
      const searchDate = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const flights = await Flight.find({
        'origin.airportCode': origin.toUpperCase(),
        'destination.airportCode': destination.toUpperCase(),
        departureTime: {
          $gte: searchDate,
          $lt: nextDay
        },
        status: 'scheduled',
        availableSeats: { $gte: passengers?.total || 1 }
      })
        .sort({ currentPrice: 1 })
        .limit(10)
        .select('flightNumber airline origin destination departureTime arrivalTime duration currentPrice basePrice availableSeats');
      
      results.push({
        leg: {
          origin,
          destination,
          date
        },
        flights,
        flightCount: flights.length
      });
    }
    
    res.status(200).json({
      success: true,
      data: results,
      totalLegs: legs.length
    });
    
  } catch (error: any) {
    console.error('[MultiCityController] searchMultiCityFlights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search flights',
      error: error.message
    });
  }
};

/**
 * Calculate multi-city pricing
 * POST /api/bookings/multi-city/calculate
 */
export const calculateMultiCityPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { flightIds, passengers, insurance, promoCode } = req.body;
    
    if (!flightIds || !Array.isArray(flightIds) || flightIds.length < 2) {
      res.status(400).json({
        success: false,
        message: 'At least 2 flights required'
      });
      return;
    }
    
    const flights = await Flight.find({ _id: { $in: flightIds } });
    
    if (flights.length !== flightIds.length) {
      res.status(404).json({
        success: false,
        message: 'One or more flights not found'
      });
      return;
    }
    
    const passengerCount = passengers?.total || 1;
    
    // Calculate base prices
    let totalBasePrice = 0;
    const flightPrices = flights.map(f => {
      const price = (f.currentPrice || f.basePrice) * passengerCount;
      totalBasePrice += price;
      return {
        flightId: f._id,
        flightNumber: f.flightNumber,
        pricePerPerson: f.currentPrice || f.basePrice,
        totalPrice: price
      };
    });
    
    // Calculate taxes and fees
    const taxes = Math.round(totalBasePrice * 0.12);
    const convenienceFee = 199 * flights.length;
    
    // Promo discount (simplified)
    let promoDiscount = 0;
    if (promoCode) {
      promoDiscount = Math.round(totalBasePrice * 0.1);
    }
    
    // Insurance premium
    let insurancePremium = 0;
    if (insurance?.planId) {
      insurancePremium = insurance.premium || 599 * passengerCount;
    }
    
    const totalAmount = totalBasePrice + taxes + convenienceFee - promoDiscount + insurancePremium;
    
    res.status(200).json({
      success: true,
      data: {
        flightPrices,
        pricing: {
          basePrice: totalBasePrice,
          taxes,
          convenienceFee,
          promoDiscount,
          insurancePremium,
          totalAmount
        },
        passengerCount,
        flightCount: flights.length
      }
    });
    
  } catch (error: any) {
    console.error('[MultiCityController] calculateMultiCityPrice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate pricing',
      error: error.message
    });
  }
};
