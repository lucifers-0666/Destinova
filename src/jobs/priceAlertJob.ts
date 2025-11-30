/**
 * Price Alert Checker Cron Job
 * Checks price alerts every hour and sends notifications
 */

import * as cron from 'node-cron';
import { PriceAlert, IPriceAlert } from '../models/PriceAlert.js';
import { Flight } from '../models/Flight.js';
import { User } from '../models/User.js';
import emailService from '../services/emailService.js';

let isRunning = false;
let lastRunTime: Date | null = null;
let lastRunStats: { checked: number; triggered: number; notified: number } | null = null;

/**
 * Find the lowest price flight for a route
 */
async function findLowestPriceForRoute(
  originCode: string,
  destinationCode: string,
  travelDateStart?: Date,
  travelDateEnd?: Date
): Promise<{ price: number; flight: any } | null> {
  try {
    const query: any = {
      'origin.airportCode': originCode.toUpperCase(),
      'destination.airportCode': destinationCode.toUpperCase(),
      isActive: true,
      departureTime: { $gt: new Date() }
    };

    // Add date range if specified
    if (travelDateStart) {
      query.departureTime.$gte = travelDateStart;
    }
    if (travelDateEnd) {
      query.departureTime.$lte = travelDateEnd;
    }

    const flight = await Flight.findOne(query)
      .sort({ currentPrice: 1 })
      .select('flightNumber currentPrice departureTime airline origin destination');

    if (!flight) {
      return null;
    }

    return {
      price: flight.currentPrice,
      flight
    };
  } catch (error) {
    console.error('[PriceAlertJob] Error finding lowest price:', error);
    return null;
  }
}

/**
 * Process a single price alert
 */
async function processAlert(alert: IPriceAlert): Promise<{
  triggered: boolean;
  notified: boolean;
  error?: string;
}> {
  try {
    // Find current lowest price
    const result = await findLowestPriceForRoute(
      alert.origin.airportCode,
      alert.destination.airportCode,
      alert.travelDateStart,
      alert.travelDateEnd
    );

    if (!result) {
      return { triggered: false, notified: false };
    }

    const { price, flight } = result;

    // Update alert's current lowest price
    alert.currentLowestPrice = price;
    alert.timesChecked = (alert.timesChecked || 0) + 1;
    alert.lastCheckedAt = new Date();

    // Track price history
    alert.priceHistory.push({
      price,
      timestamp: new Date(),
      flightId: flight._id
    });

    // Keep only last 100 price points
    if (alert.priceHistory.length > 100) {
      alert.priceHistory = alert.priceHistory.slice(-100);
    }

    // Update lowest price ever
    if (!alert.lowestPriceEver || price < alert.lowestPriceEver) {
      alert.lowestPriceEver = price;
      alert.lowestPriceDate = new Date();
    }

    // Check if price meets target (with flexibility)
    const effectiveTarget = alert.priceFlexibility
      ? alert.targetPrice * (1 + alert.priceFlexibility / 100)
      : alert.targetPrice;

    const priceTriggered = price <= effectiveTarget;

    if (priceTriggered) {
      alert.priceDropsDetected = (alert.priceDropsDetected || 0) + 1;

      // Check if we should notify (avoid spamming)
      const shouldNotify = !alert.lastNotifiedAt || 
        (new Date().getTime() - alert.lastNotifiedAt.getTime()) > getNotificationCooldown(alert.alertFrequency);

      if (shouldNotify) {
        // Get user for notification
        const user = await User.findById(alert.user).select('email firstName lastName');

        if (user && alert.notificationChannels.includes('email')) {
          // Send email notification
          const emailResult = await emailService.sendPriceAlert(alert, price, flight, user);

          // Record notification
          alert.notificationsSent.push({
            sentAt: new Date(),
            channel: 'email',
            priceAtTime: price,
            flightId: flight._id,
            success: emailResult.success,
            errorMessage: emailResult.error
          });

          alert.lastNotifiedAt = new Date();
          alert.totalNotificationsSent = (alert.totalNotificationsSent || 0) + 1;

          // Optionally deactivate one-time alerts
          if (alert.alertFrequency === 'instant') {
            alert.isActive = false;
            alert.isPaused = true;
            alert.pausedReason = 'Alert triggered - target price reached';
          }

          await alert.save();

          return {
            triggered: true,
            notified: emailResult.success,
            error: emailResult.error
          };
        }
      }
    }

    await alert.save();

    return {
      triggered: priceTriggered,
      notified: false
    };

  } catch (error: any) {
    console.error(`[PriceAlertJob] Error processing alert ${alert._id}:`, error);
    return {
      triggered: false,
      notified: false,
      error: error.message
    };
  }
}

/**
 * Get notification cooldown based on frequency setting
 */
function getNotificationCooldown(frequency: string): number {
  switch (frequency) {
    case 'instant':
      return 4 * 60 * 60 * 1000; // 4 hours minimum between instant alerts
    case 'daily':
      return 23 * 60 * 60 * 1000; // ~23 hours
    case 'weekly':
      return 6 * 24 * 60 * 60 * 1000; // ~6 days
    default:
      return 24 * 60 * 60 * 1000; // Default 24 hours
  }
}

/**
 * Run price alert checker
 */
async function runPriceAlertCheck(): Promise<void> {
  if (isRunning) {
    console.log('[PriceAlertJob] Job already running, skipping...');
    return;
  }

  isRunning = true;
  const startTime = Date.now();
  console.log('[PriceAlertJob] Starting price alert check...');

  let checked = 0;
  let triggered = 0;
  let notified = 0;

  try {
    // Get all active alerts
    const alerts = await PriceAlert.find({
      isActive: true,
      isPaused: false
    }).limit(1000);

    console.log(`[PriceAlertJob] Found ${alerts.length} active alerts to check`);

    for (const alert of alerts) {
      const result = await processAlert(alert);
      checked++;

      if (result.triggered) {
        triggered++;
      }
      if (result.notified) {
        notified++;
        console.log(
          `[PriceAlertJob] Alert triggered and notified: ` +
          `${alert.origin.airportCode} → ${alert.destination.airportCode} ` +
          `(Target: ₹${alert.targetPrice})`
        );
      }
    }

    const duration = Date.now() - startTime;
    lastRunTime = new Date();
    lastRunStats = { checked, triggered, notified };

    console.log(
      `[PriceAlertJob] Completed: ${checked} checked, ${triggered} triggered, ` +
      `${notified} notified, ${(duration / 1000).toFixed(2)}s`
    );

  } catch (error) {
    console.error('[PriceAlertJob] Job failed:', error);
  } finally {
    isRunning = false;
  }
}

/**
 * Start the price alert cron job
 * Runs every hour at minute 30
 */
export function startPriceAlertJob(): void {
  // Schedule: At minute 30 of every hour
  const schedule = '30 * * * *';

  cron.schedule(schedule, () => {
    runPriceAlertCheck();
  }, {
    timezone: 'Asia/Kolkata'
  });

  console.log('[PriceAlertJob] Scheduled to run every hour at :30');

  // Run initial check after a delay
  setTimeout(() => {
    console.log('[PriceAlertJob] Running initial price alert check...');
    runPriceAlertCheck();
  }, 30000); // 30 second delay
}

/**
 * Get job status
 */
export function getPriceAlertJobStatus(): {
  isRunning: boolean;
  lastRunTime: Date | null;
  lastRunStats: { checked: number; triggered: number; notified: number } | null;
} {
  return {
    isRunning,
    lastRunTime,
    lastRunStats
  };
}

/**
 * Manually trigger alert check
 */
export async function triggerPriceAlertCheck(): Promise<void> {
  await runPriceAlertCheck();
}

export default {
  startPriceAlertJob,
  getPriceAlertJobStatus,
  triggerPriceAlertCheck
};
