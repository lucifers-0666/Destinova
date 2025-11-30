/**
 * Check-In Controller
 * Handles online check-in and boarding pass generation
 */

import { Request, Response } from 'express';
import { Booking } from '../models/Booking.js';
import { generateBoardingPassPDF, generateBoardingPassHTML } from '../services/boardingPassService.js';
import { sendEmail } from '../services/emailService.js';

/**
 * Search booking for check-in
 * POST /api/check-in/search
 */
export const searchBookingForCheckIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingReference, lastName, email, flightNumber } = req.body;
    
    // Build search query
    const query: any = { bookingStatus: { $in: ['confirmed', 'ticketed'] } };
    
    if (bookingReference && lastName) {
      query.bookingReference = bookingReference.toUpperCase();
      query['passengers.lastName'] = new RegExp(lastName, 'i');
    } else if (email && flightNumber) {
      query['contactDetails.email'] = email.toLowerCase();
      // Need to join with flight collection
    } else {
      res.status(400).json({
        success: false,
        message: 'Please provide booking reference + last name, or email + flight number'
      });
      return;
    }
    
    const booking = await Booking.findOne(query)
      .populate('flight', 'flightNumber airline origin destination departureTime arrivalTime status')
      .populate('outboundFlight', 'flightNumber airline origin destination departureTime arrivalTime status')
      .populate('returnFlight', 'flightNumber airline origin destination departureTime arrivalTime status');
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found. Please check your details.'
      });
      return;
    }
    
    // Get the flight for check-in eligibility
    const flight = booking.flight || booking.outboundFlight;
    
    if (!flight) {
      res.status(400).json({
        success: false,
        message: 'No flight associated with this booking'
      });
      return;
    }
    
    // Check if already checked in
    if (booking.webCheckInCompleted) {
      res.status(200).json({
        success: true,
        message: 'Already checked in',
        data: {
          booking,
          checkInStatus: 'completed',
          canCheckIn: false,
          boardingPassAvailable: true
        }
      });
      return;
    }
    
    // Check check-in window (24 hours before departure)
    const departureTime = new Date((flight as any).departureTime || booking.travelDate);
    const now = new Date();
    const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let canCheckIn = true;
    let checkInMessage = '';
    
    if (hoursUntilDeparture > 24) {
      canCheckIn = false;
      checkInMessage = `Check-in opens in ${Math.floor(hoursUntilDeparture - 24)} hours`;
    } else if (hoursUntilDeparture < 1) {
      canCheckIn = false;
      checkInMessage = 'Check-in has closed for this flight';
    } else if ((flight as any).status === 'cancelled') {
      canCheckIn = false;
      checkInMessage = 'Flight has been cancelled';
    }
    
    res.status(200).json({
      success: true,
      data: {
        booking: {
          bookingReference: booking.bookingReference,
          pnr: booking.pnr,
          passengers: booking.passengers,
          totalPassengers: booking.totalPassengers,
          contactDetails: booking.contactDetails,
          travelDate: booking.travelDate
        },
        flight: {
          flightNumber: (flight as any).flightNumber,
          airline: (flight as any).airline,
          origin: (flight as any).origin,
          destination: (flight as any).destination,
          departureTime: (flight as any).departureTime,
          arrivalTime: (flight as any).arrivalTime,
          status: (flight as any).status
        },
        checkInStatus: 'pending',
        canCheckIn,
        checkInMessage,
        hoursUntilDeparture: Math.max(0, hoursUntilDeparture).toFixed(1),
        checkInOpensAt: hoursUntilDeparture > 24 
          ? new Date(departureTime.getTime() - 24 * 60 * 60 * 1000)
          : null
      }
    });
    
  } catch (error: any) {
    console.error('[CheckInController] searchBookingForCheckIn error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search booking',
      error: error.message
    });
  }
};

/**
 * Perform check-in
 * POST /api/bookings/:id/check-in
 */
export const performCheckIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { seatSelections, passengerIds } = req.body;
    
    // Find booking
    const booking = await Booking.findById(id)
      .populate('flight', 'flightNumber airline origin destination departureTime arrivalTime status')
      .populate('outboundFlight', 'flightNumber airline origin destination departureTime arrivalTime status');
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }
    
    // Check if already checked in
    if (booking.webCheckInCompleted) {
      res.status(400).json({
        success: false,
        message: 'Already checked in for this booking'
      });
      return;
    }
    
    // Verify booking status
    if (!['confirmed', 'ticketed'].includes(booking.bookingStatus)) {
      res.status(400).json({
        success: false,
        message: 'Booking is not eligible for check-in'
      });
      return;
    }
    
    const flight = booking.flight || booking.outboundFlight;
    
    if (!flight) {
      res.status(400).json({
        success: false,
        message: 'No flight found for this booking'
      });
      return;
    }
    
    // Verify within check-in window
    const departureTime = new Date((flight as any).departureTime || booking.travelDate);
    const now = new Date();
    const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDeparture > 24) {
      res.status(400).json({
        success: false,
        message: 'Check-in is not yet open. Opens 24 hours before departure.'
      });
      return;
    }
    
    if (hoursUntilDeparture < 1) {
      res.status(400).json({
        success: false,
        message: 'Check-in has closed for this flight'
      });
      return;
    }
    
    // Generate gate and terminal info (in production, this would come from airline data)
    const gate = `${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(Math.random() * 20) + 1}`;
    const terminal = `T${Math.floor(Math.random() * 3) + 1}`;
    const boardingTime = new Date(departureTime.getTime() - 45 * 60000); // 45 min before departure
    
    // Update booking with check-in info
    booking.webCheckInCompleted = true;
    booking.webCheckInTime = new Date();
    booking.bookingStatus = 'checked-in';
    
    // Add check-in details (would store in booking or separate collection)
    (booking as any).checkInDetails = {
      gate,
      terminal,
      boardingTime,
      checkedInAt: new Date(),
      seatSelections: seatSelections || []
    };
    
    await booking.save();
    
    // Generate boarding pass URL (would be a signed URL in production)
    const boardingPassUrl = `/api/bookings/${booking._id}/boarding-pass`;
    booking.boardingPassUrl = boardingPassUrl;
    await booking.save();
    
    res.status(200).json({
      success: true,
      message: 'Check-in completed successfully!',
      data: {
        bookingReference: booking.bookingReference,
        pnr: booking.pnr,
        checkInTime: booking.webCheckInTime,
        boardingPassUrl,
        flightDetails: {
          flightNumber: (flight as any).flightNumber,
          gate,
          terminal,
          boardingTime,
          departureTime: (flight as any).departureTime
        },
        passengers: booking.passengers.map((p, i) => ({
          name: `${p.firstName} ${p.lastName}`,
          seat: seatSelections?.[i]?.seatNumber || 'Auto-assigned',
          boardingSequence: i + 1
        }))
      }
    });
    
  } catch (error: any) {
    console.error('[CheckInController] performCheckIn error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete check-in',
      error: error.message
    });
  }
};

/**
 * Get boarding pass
 * GET /api/bookings/:id/boarding-pass
 */
export const getBoardingPass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { format = 'html', passengerIndex = 0 } = req.query;
    
    const booking = await Booking.findById(id)
      .populate('flight', 'flightNumber airline origin destination departureTime arrivalTime')
      .populate('outboundFlight', 'flightNumber airline origin destination departureTime arrivalTime');
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }
    
    if (!booking.webCheckInCompleted) {
      res.status(400).json({
        success: false,
        message: 'Please complete check-in first'
      });
      return;
    }
    
    const pIndex = parseInt(passengerIndex as string) || 0;
    
    if (pIndex < 0 || pIndex >= booking.passengers.length) {
      res.status(400).json({
        success: false,
        message: 'Invalid passenger index'
      });
      return;
    }
    
    const checkInDetails = (booking as any).checkInDetails || {};
    const seatNumber = checkInDetails.seatSelections?.[pIndex]?.seatNumber || 
      `${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`;
    
    const boardingPassData = {
      booking: booking as any,
      passengerIndex: pIndex,
      gate: checkInDetails.gate || 'A12',
      terminal: checkInDetails.terminal || 'T3',
      boardingTime: checkInDetails.boardingTime,
      seatNumber
    };
    
    if (format === 'pdf') {
      try {
        const pdfBuffer = await generateBoardingPassPDF(boardingPassData);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 
          `attachment; filename="boarding-pass-${booking.bookingReference}-${pIndex + 1}.pdf"`);
        res.send(pdfBuffer);
      } catch (pdfError) {
        console.error('PDF generation failed:', pdfError);
        // Fallback to HTML
        const html = generateBoardingPassHTML(boardingPassData);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
      }
    } else {
      const html = generateBoardingPassHTML(boardingPassData);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    }
    
  } catch (error: any) {
    console.error('[CheckInController] getBoardingPass error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate boarding pass',
      error: error.message
    });
  }
};

/**
 * Email boarding pass
 * POST /api/bookings/:id/boarding-pass/email
 */
export const emailBoardingPass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    const booking = await Booking.findById(id)
      .populate('flight', 'flightNumber airline origin destination departureTime arrivalTime')
      .populate('outboundFlight', 'flightNumber airline origin destination departureTime arrivalTime');
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }
    
    if (!booking.webCheckInCompleted) {
      res.status(400).json({
        success: false,
        message: 'Please complete check-in first'
      });
      return;
    }
    
    const targetEmail = email || booking.contactDetails?.email;
    
    if (!targetEmail) {
      res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
      return;
    }
    
    // Generate HTML boarding passes for all passengers
    const checkInDetails = (booking as any).checkInDetails || {};
    const boardingPasses: string[] = [];
    
    for (let i = 0; i < booking.passengers.length; i++) {
      const seatNumber = checkInDetails.seatSelections?.[i]?.seatNumber || 
        `${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`;
      
      const html = generateBoardingPassHTML({
        booking: booking as any,
        passengerIndex: i,
        gate: checkInDetails.gate || 'TBA',
        terminal: checkInDetails.terminal || 'TBA',
        boardingTime: checkInDetails.boardingTime,
        seatNumber
      });
      boardingPasses.push(html);
    }
    
    // Send email
    const result = await sendEmail({
      to: targetEmail,
      subject: `Boarding Pass - ${booking.bookingReference}`,
      html: `
        <h2>Your Boarding Pass(es)</h2>
        <p>Thank you for checking in! Below are your boarding passes.</p>
        ${boardingPasses.join('<hr style="margin: 30px 0; border: 2px dashed #ccc;">')}
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          You can also download your boarding passes from our website or mobile app.
        </p>
      `
    });
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Boarding pass(es) sent to ${targetEmail}`
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: result.error
      });
    }
    
  } catch (error: any) {
    console.error('[CheckInController] emailBoardingPass error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to email boarding pass',
      error: error.message
    });
  }
};

/**
 * Get check-in status
 * GET /api/bookings/:id/check-in/status
 */
export const getCheckInStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .select('bookingReference webCheckInCompleted webCheckInTime boardingPassUrl bookingStatus')
      .populate('flight', 'departureTime status');
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }
    
    const flight = booking.flight as any;
    const departureTime = flight?.departureTime || booking.travelDate;
    const now = new Date();
    const hoursUntilDeparture = (new Date(departureTime).getTime() - now.getTime()) / (1000 * 60 * 60);
    
    let checkInWindowStatus = 'closed';
    if (hoursUntilDeparture > 24) {
      checkInWindowStatus = 'not_open';
    } else if (hoursUntilDeparture > 1) {
      checkInWindowStatus = 'open';
    }
    
    res.status(200).json({
      success: true,
      data: {
        bookingReference: booking.bookingReference,
        isCheckedIn: booking.webCheckInCompleted,
        checkInTime: booking.webCheckInTime,
        boardingPassUrl: booking.boardingPassUrl,
        checkInWindowStatus,
        hoursUntilDeparture: Math.max(0, hoursUntilDeparture).toFixed(1),
        departureTime
      }
    });
    
  } catch (error: any) {
    console.error('[CheckInController] getCheckInStatus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get check-in status',
      error: error.message
    });
  }
};
