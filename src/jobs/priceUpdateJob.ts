/**
 * Price Update Cron Job
 * Automatically updates flight prices using AI every 6 hours
 */

import * as cron from 'node-cron';
import pricingService from '../services/pricingService.js';
import { Flight } from '../models/Flight.js';

let isRunning = false;
let lastRunTime: Date | null = null;
let lastRunStats: { updated: number; failed: number; duration: number } | null = null;

/**
 * Run price update for all upcoming flights
 */
async function runPriceUpdate(): Promise<void> {
  if (isRunning) {
    console.log('[PriceUpdateJob] Job already running, skipping...');
    return;
  }

  isRunning = true;
  const startTime = Date.now();
  console.log('[PriceUpdateJob] Starting scheduled price update...');

  try {
    // Ensure pricing model is loaded
    await pricingService.loadModel();

    // Get all upcoming active flights
    const now = new Date();
    const flights = await Flight.find({
      departureTime: { $gt: now },
      isActive: true
    }).limit(500); // Process in batches of 500

    console.log(`[PriceUpdateJob] Found ${flights.length} flights to update`);

    let updated = 0;
    let failed = 0;

    for (const flight of flights) {
      try {
        const result = await pricingService.updateFlightPrice(flight._id.toString());
        
        if (result.success) {
          updated++;
          
          // Log significant price changes
          if (result.oldPrice && result.newPrice) {
            const changePercent = Math.abs((result.newPrice - result.oldPrice) / result.oldPrice * 100);
            if (changePercent > 10) {
              console.log(
                `[PriceUpdateJob] Significant price change for ${flight.flightNumber}: ` +
                `₹${result.oldPrice} → ₹${result.newPrice} (${changePercent.toFixed(1)}%)`
              );
            }
          }
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        console.error(`[PriceUpdateJob] Error updating flight ${flight.flightNumber}:`, error);
      }
    }

    const duration = Date.now() - startTime;
    lastRunTime = new Date();
    lastRunStats = { updated, failed, duration };

    console.log(
      `[PriceUpdateJob] Completed: ${updated} updated, ${failed} failed, ${(duration / 1000).toFixed(2)}s`
    );

  } catch (error) {
    console.error('[PriceUpdateJob] Job failed:', error);
  } finally {
    isRunning = false;
  }
}

/**
 * Start the price update cron job
 * Runs every 6 hours: 0:00, 6:00, 12:00, 18:00
 */
export function startPriceUpdateJob(): void {
  // Schedule: At minute 0 past every 6th hour
  const schedule = '0 */6 * * *';
  
  cron.schedule(schedule, () => {
    runPriceUpdate();
  }, {
    timezone: 'Asia/Kolkata'
  });

  console.log('[PriceUpdateJob] Scheduled to run every 6 hours (0:00, 6:00, 12:00, 18:00 IST)');

  // Run immediately on startup (after a short delay)
  setTimeout(() => {
    console.log('[PriceUpdateJob] Running initial price update...');
    runPriceUpdate();
  }, 5000); // 5 second delay to allow model loading
}

/**
 * Get job status
 */
export function getPriceUpdateJobStatus(): {
  isRunning: boolean;
  lastRunTime: Date | null;
  lastRunStats: { updated: number; failed: number; duration: number } | null;
} {
  return {
    isRunning,
    lastRunTime,
    lastRunStats
  };
}

/**
 * Manually trigger a price update
 */
export async function triggerPriceUpdate(): Promise<void> {
  await runPriceUpdate();
}

export default {
  startPriceUpdateJob,
  getPriceUpdateJobStatus,
  triggerPriceUpdate
};
