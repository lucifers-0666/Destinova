/**
 * Seat Controller
 * Handles seat selection, locking, and release operations
 */

import { Request, Response } from 'express';
import { Flight } from '../models/Flight.js';
import mongoose from 'mongoose';

// In-memory store for seat locks (in production, use Redis)
interface SeatLock {
  seatNumber: string;
  flightId: string;
  userId: string;
  lockedAt: Date;
  expiresAt: Date;
}

const seatLocks: Map<string, SeatLock> = new Map();
const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// Cleanup expired locks every minute
setInterval(() => {
  const now = new Date();
  for (const [key, lock] of seatLocks.entries()) {
    if (lock.expiresAt < now) {
      seatLocks.delete(key);
      console.log(`[SeatController] Released expired lock: ${key}`);
    }
  }
}, 60 * 1000);

/**
 * Generate a complete seat map for a flight
 */
function generateSeatMap(config: { economy: number; business: number; firstClass: number }) {
  const seatMap: any[] = [];
  let row = 1;
  
  // First Class (rows 1-2, 2-2 config: A, B, D, E)
  const firstClassSeats = ['A', 'B', 'D', 'E'];
  const firstClassRows = Math.ceil(config.firstClass / 4);
  
  for (let r = 0; r < firstClassRows; r++) {
    for (const seat of firstClassSeats) {
      if (seatMap.filter(s => s.class === 'first').length < config.firstClass) {
        seatMap.push({
          row: row + r,
          seat: `${row + r}${seat}`,
          seatNumber: `${row + r}${seat}`,
          class: 'first',
          type: seat === 'A' || seat === 'E' ? 'window' : 'aisle',
          status: 'available',
          isWindow: seat === 'A' || seat === 'E',
          isAisle: seat === 'B' || seat === 'D',
          isMiddle: false,
          isEmergencyExit: false,
          isAvailable: true,
          price: 3000, // Premium for first class
          features: ['extra-legroom', 'recline', 'amenity-kit']
        });
      }
    }
  }
  row += firstClassRows;
  
  // Business Class (rows 3-6, 2-2 config: A, B, D, E)
  const businessSeats = ['A', 'B', 'D', 'E'];
  const businessRows = Math.ceil(config.business / 4);
  
  for (let r = 0; r < businessRows; r++) {
    for (const seat of businessSeats) {
      if (seatMap.filter(s => s.class === 'business').length < config.business) {
        seatMap.push({
          row: row + r,
          seat: `${row + r}${seat}`,
          seatNumber: `${row + r}${seat}`,
          class: 'business',
          type: seat === 'A' || seat === 'E' ? 'window' : 'aisle',
          status: 'available',
          isWindow: seat === 'A' || seat === 'E',
          isAisle: seat === 'B' || seat === 'D',
          isMiddle: false,
          isEmergencyExit: r === 0, // First business row is emergency exit
          isAvailable: true,
          price: 1500,
          features: ['extra-legroom', 'recline']
        });
      }
    }
  }
  row += businessRows;
  
  // Economy Class (remaining rows, 3-3 config: A, B, C, D, E, F)
  const economySeats = ['A', 'B', 'C', 'D', 'E', 'F'];
  const economyRows = Math.ceil(config.economy / 6);
  
  for (let r = 0; r < economyRows; r++) {
    const currentRow = row + r;
    const isExitRow = currentRow === row || currentRow === row + Math.floor(economyRows / 2);
    
    for (const seat of economySeats) {
      if (seatMap.filter(s => s.class === 'economy').length < config.economy) {
        const isWindow = seat === 'A' || seat === 'F';
        const isAisle = seat === 'C' || seat === 'D';
        const isMiddle = seat === 'B' || seat === 'E';
        
        seatMap.push({
          row: currentRow,
          seat: `${currentRow}${seat}`,
          seatNumber: `${currentRow}${seat}`,
          class: 'economy',
          type: isWindow ? 'window' : (isAisle ? 'aisle' : 'middle'),
          status: 'available',
          isWindow,
          isAisle,
          isMiddle,
          isEmergencyExit: isExitRow,
          isAvailable: true,
          price: isExitRow ? 800 : (isWindow || isAisle ? 500 : 0),
          features: isExitRow ? ['extra-legroom'] : []
        });
      }
    }
  }
  
  return seatMap;
}

/**
 * Get seat map for a flight
 * GET /api/flights/:id/seats
 */
export const getSeatMap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid flight ID'
      });
      return;
    }

    const flight = await Flight.findById(id).select(
      'flightNumber seatMap seatConfiguration totalSeats availableSeats bookedSeats prices'
    );

    if (!flight) {
      res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
      return;
    }

    // Generate seat map if not exists
    let seatMap = flight.seatMap;
    
    if (!seatMap || seatMap.length === 0) {
      seatMap = generateSeatMap(flight.seatConfiguration || {
        economy: 150,
        business: 24,
        firstClass: 6
      });
      
      // Save generated seat map
      flight.seatMap = seatMap;
      await flight.save();
    }

    // Add lock status to seats
    const seatMapWithLocks = seatMap.map((seat: any) => {
      const lockKey = `${id}-${seat.seatNumber}`;
      const lock = seatLocks.get(lockKey);
      
      return {
        ...seat.toObject ? seat.toObject() : seat,
        isLocked: !!lock,
        lockExpiry: lock?.expiresAt || null
      };
    });

    // Group seats by class for easier frontend rendering
    const groupedSeats = {
      first: seatMapWithLocks.filter((s: any) => s.class === 'first'),
      business: seatMapWithLocks.filter((s: any) => s.class === 'business'),
      economy: seatMapWithLocks.filter((s: any) => s.class === 'economy')
    };

    // Calculate availability stats
    const stats = {
      total: seatMap.length,
      available: seatMap.filter((s: any) => s.isAvailable && s.status === 'available').length,
      booked: seatMap.filter((s: any) => !s.isAvailable || s.status === 'booked').length,
      locked: Array.from(seatLocks.values()).filter(l => l.flightId === id).length
    };

    res.status(200).json({
      success: true,
      data: {
        flightId: flight._id,
        flightNumber: flight.flightNumber,
        seatMap: seatMapWithLocks,
        groupedSeats,
        stats,
        prices: flight.prices,
        config: flight.seatConfiguration
      }
    });
  } catch (error: any) {
    console.error('[SeatController] getSeatMap error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get seat map',
      error: error.message
    });
  }
};

/**
 * Lock seats temporarily
 * POST /api/flights/:id/seats/lock
 */
export const lockSeats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { seatNumbers } = req.body;
    const userId = (req as any).user?.id || 'anonymous';

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid flight ID'
      });
      return;
    }

    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Seat numbers are required'
      });
      return;
    }

    // Validate maximum seats
    if (seatNumbers.length > 9) {
      res.status(400).json({
        success: false,
        message: 'Cannot lock more than 9 seats at once'
      });
      return;
    }

    const flight = await Flight.findById(id).select('seatMap');

    if (!flight) {
      res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
      return;
    }

    const lockedSeats: string[] = [];
    const failedSeats: { seat: string; reason: string }[] = [];
    const now = new Date();
    const expiresAt = new Date(now.getTime() + LOCK_DURATION_MS);

    for (const seatNumber of seatNumbers) {
      const lockKey = `${id}-${seatNumber}`;
      
      // Check if seat exists
      const seat = flight.seatMap?.find((s: any) => s.seatNumber === seatNumber || s.seat === seatNumber);
      
      if (!seat) {
        failedSeats.push({ seat: seatNumber, reason: 'Seat not found' });
        continue;
      }

      // Check if seat is available
      if (!seat.isAvailable) {
        failedSeats.push({ seat: seatNumber, reason: 'Seat is not available' });
        continue;
      }

      // Check if already locked by someone else
      const existingLock = seatLocks.get(lockKey);
      if (existingLock && existingLock.userId !== userId && existingLock.expiresAt > now) {
        failedSeats.push({ seat: seatNumber, reason: 'Seat is temporarily locked' });
        continue;
      }

      // Lock the seat
      seatLocks.set(lockKey, {
        seatNumber,
        flightId: id,
        userId,
        lockedAt: now,
        expiresAt
      });

      lockedSeats.push(seatNumber);
    }

    // Return response
    if (lockedSeats.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Failed to lock any seats',
        failedSeats
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Successfully locked ${lockedSeats.length} seat(s)`,
      data: {
        lockedSeats,
        failedSeats,
        expiresAt,
        lockDurationMinutes: LOCK_DURATION_MS / 60000
      }
    });
  } catch (error: any) {
    console.error('[SeatController] lockSeats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to lock seats',
      error: error.message
    });
  }
};

/**
 * Release locked seats
 * POST /api/flights/:id/seats/release
 */
export const releaseSeats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { seatNumbers } = req.body;
    const userId = (req as any).user?.id || 'anonymous';

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid flight ID'
      });
      return;
    }

    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Seat numbers are required'
      });
      return;
    }

    const releasedSeats: string[] = [];
    const failedSeats: { seat: string; reason: string }[] = [];

    for (const seatNumber of seatNumbers) {
      const lockKey = `${id}-${seatNumber}`;
      const lock = seatLocks.get(lockKey);

      if (!lock) {
        failedSeats.push({ seat: seatNumber, reason: 'Seat is not locked' });
        continue;
      }

      // Only allow release by the same user or admin
      const isAdmin = (req as any).user?.role === 'admin';
      if (lock.userId !== userId && !isAdmin) {
        failedSeats.push({ seat: seatNumber, reason: 'Not authorized to release this lock' });
        continue;
      }

      seatLocks.delete(lockKey);
      releasedSeats.push(seatNumber);
    }

    if (releasedSeats.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Failed to release any seats',
        failedSeats
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Successfully released ${releasedSeats.length} seat(s)`,
      data: {
        releasedSeats,
        failedSeats
      }
    });
  } catch (error: any) {
    console.error('[SeatController] releaseSeats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to release seats',
      error: error.message
    });
  }
};

/**
 * Book seats permanently (called after payment)
 * POST /api/flights/:id/seats/book
 */
export const bookSeats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { seatNumbers, bookingId } = req.body;
    const userId = (req as any).user?.id;

    console.log(`[SeatController] Booking seats for flight ${id}, user: ${userId || 'anonymous'}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid flight ID'
      });
      return;
    }

    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Seat numbers are required'
      });
      return;
    }

    const flight = await Flight.findById(id);

    if (!flight) {
      res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
      return;
    }

    const bookedSeats: string[] = [];
    const failedSeats: { seat: string; reason: string }[] = [];

    for (const seatNumber of seatNumbers) {
      // Find seat in seat map
      const seatIndex = flight.seatMap?.findIndex(
        (s: any) => s.seatNumber === seatNumber || s.seat === seatNumber
      );

      if (seatIndex === undefined || seatIndex === -1) {
        failedSeats.push({ seat: seatNumber, reason: 'Seat not found' });
        continue;
      }

      const seat = flight.seatMap![seatIndex];

      // Check availability
      if (!seat.isAvailable) {
        failedSeats.push({ seat: seatNumber, reason: 'Seat is not available' });
        continue;
      }

      // Update seat status (mark as not available)
      flight.seatMap![seatIndex].isAvailable = false;
      
      // Remove lock if exists
      const lockKey = `${id}-${seatNumber}`;
      seatLocks.delete(lockKey);

      bookedSeats.push(seatNumber);
    }

    if (bookedSeats.length > 0) {
      // Update available/booked seat counts
      flight.bookedSeats = (flight.bookedSeats || 0) + bookedSeats.length;
      flight.availableSeats = Math.max(0, (flight.availableSeats || 0) - bookedSeats.length);
      
      await flight.save();
    }

    if (bookedSeats.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Failed to book any seats',
        failedSeats
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Successfully booked ${bookedSeats.length} seat(s)`,
      data: {
        bookedSeats,
        failedSeats,
        bookingId
      }
    });
  } catch (error: any) {
    console.error('[SeatController] bookSeats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book seats',
      error: error.message
    });
  }
};

/**
 * Get user's locked seats
 * GET /api/flights/:id/seats/my-locks
 */
export const getMyLockedSeats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id || 'anonymous';

    const userLocks = Array.from(seatLocks.values())
      .filter(lock => lock.flightId === id && lock.userId === userId);

    res.status(200).json({
      success: true,
      data: {
        lockedSeats: userLocks.map(lock => ({
          seatNumber: lock.seatNumber,
          lockedAt: lock.lockedAt,
          expiresAt: lock.expiresAt,
          remainingSeconds: Math.max(0, Math.floor((lock.expiresAt.getTime() - Date.now()) / 1000))
        }))
      }
    });
  } catch (error: any) {
    console.error('[SeatController] getMyLockedSeats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get locked seats',
      error: error.message
    });
  }
};

export default {
  getSeatMap,
  lockSeats,
  releaseSeats,
  bookSeats,
  getMyLockedSeats,
  generateSeatMap
};
