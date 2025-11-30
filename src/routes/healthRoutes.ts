import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { getRedisClient, isRedisConnected } from '../config/redis.js';
import os from 'os';

const router = Router();

// ===========================================
// Health Check Types
// ===========================================

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  checks: {
    database: ComponentHealth;
    redis: ComponentHealth;
    memory: ComponentHealth;
    disk?: ComponentHealth;
  };
  system: SystemInfo;
}

interface ComponentHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  message?: string;
  details?: Record<string, unknown>;
}

interface SystemInfo {
  platform: string;
  nodeVersion: string;
  cpuUsage: number;
  memoryUsage: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  loadAverage: number[];
}

// ===========================================
// Health Check Functions
// ===========================================

async function checkDatabase(): Promise<ComponentHealth> {
  const start = Date.now();
  
  try {
    const state = mongoose.connection.readyState;
    
    if (state !== 1) {
      return {
        status: 'down',
        message: 'MongoDB not connected',
        details: { 
          connectionState: getConnectionStateName(state) 
        },
      };
    }
    
    // Ping database
    await mongoose.connection.db?.admin().ping();
    
    const responseTime = Date.now() - start;
    
    return {
      status: responseTime < 100 ? 'up' : 'degraded',
      responseTime,
      message: responseTime < 100 ? 'MongoDB connected' : 'MongoDB slow response',
      details: {
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      },
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      message: error instanceof Error ? error.message : 'Database check failed',
    };
  }
}

async function checkRedis(): Promise<ComponentHealth> {
  const start = Date.now();
  
  try {
    const redisClient = getRedisClient();
    
    if (!isRedisConnected() || !redisClient) {
      return {
        status: 'down',
        message: 'Redis not connected',
      };
    }
    
    // Ping Redis
    await redisClient.ping();
    
    const responseTime = Date.now() - start;
    
    // Get Redis info
    const info = await redisClient.info('memory');
    const usedMemory = info.match(/used_memory_human:(\S+)/)?.[1] || 'unknown';
    
    return {
      status: responseTime < 50 ? 'up' : 'degraded',
      responseTime,
      message: 'Redis connected',
      details: {
        usedMemory,
      },
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      message: error instanceof Error ? error.message : 'Redis check failed',
    };
  }
}

function checkMemory(): ComponentHealth {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const percentage = (usedMemory / totalMemory) * 100;
  
  let status: 'up' | 'degraded' | 'down' = 'up';
  let message = 'Memory usage normal';
  
  if (percentage > 90) {
    status = 'down';
    message = 'Critical memory usage';
  } else if (percentage > 80) {
    status = 'degraded';
    message = 'High memory usage';
  }
  
  return {
    status,
    message,
    details: {
      total: formatBytes(totalMemory),
      used: formatBytes(usedMemory),
      free: formatBytes(freeMemory),
      percentage: Math.round(percentage * 100) / 100,
    },
  };
}

function getSystemInfo(): SystemInfo {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  
  // Calculate CPU usage
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;
  
  cpus.forEach(cpu => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  });
  
  const cpuUsage = 100 - (totalIdle / totalTick) * 100;
  
  return {
    platform: os.platform(),
    nodeVersion: process.version,
    cpuUsage: Math.round(cpuUsage * 100) / 100,
    memoryUsage: {
      total: totalMemory,
      used: usedMemory,
      free: freeMemory,
      percentage: Math.round((usedMemory / totalMemory) * 10000) / 100,
    },
    loadAverage: os.loadavg(),
  };
}

// ===========================================
// Helper Functions
// ===========================================

function getConnectionStateName(state: number): string {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[state] || 'unknown';
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;
  let value = bytes;
  
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

function determineOverallStatus(checks: HealthStatus['checks']): 'healthy' | 'degraded' | 'unhealthy' {
  const statuses = Object.values(checks).map(c => c.status);
  
  if (statuses.some(s => s === 'down')) {
    // Database down = unhealthy, others = degraded
    if (checks.database.status === 'down') {
      return 'unhealthy';
    }
    return 'degraded';
  }
  
  if (statuses.some(s => s === 'degraded')) {
    return 'degraded';
  }
  
  return 'healthy';
}

// ===========================================
// Routes
// ===========================================

/**
 * @route   GET /health
 * @desc    Basic health check
 * @access  Public
 */
router.get('/', async (_req: Request, res: Response) => {
  const dbCheck = await checkDatabase();
  
  const status = dbCheck.status === 'up' ? 'healthy' : 'unhealthy';
  const statusCode = status === 'healthy' ? 200 : 503;
  
  res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * @route   GET /health/live
 * @desc    Liveness probe (for Kubernetes)
 * @access  Public
 */
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route   GET /health/ready
 * @desc    Readiness probe (for Kubernetes)
 * @access  Public
 */
router.get('/ready', async (_req: Request, res: Response) => {
  const dbCheck = await checkDatabase();
  
  if (dbCheck.status === 'down') {
    res.status(503).json({
      status: 'not_ready',
      reason: 'Database not available',
    });
    return;
  }
  
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @route   GET /health/detailed
 * @desc    Detailed health check with all components
 * @access  Public (consider restricting in production)
 */
router.get('/detailed', async (_req: Request, res: Response) => {
  const [dbCheck, redisCheck] = await Promise.all([
    checkDatabase(),
    checkRedis(),
  ]);
  
  const memoryCheck = checkMemory();
  const systemInfo = getSystemInfo();
  
  const checks = {
    database: dbCheck,
    redis: redisCheck,
    memory: memoryCheck,
  };
  
  const overallStatus = determineOverallStatus(checks);
  
  const health: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks,
    system: systemInfo,
  };
  
  const statusCode = overallStatus === 'healthy' ? 200 : 
                     overallStatus === 'degraded' ? 200 : 503;
  
  res.status(statusCode).json(health);
});

/**
 * @route   GET /health/metrics
 * @desc    Prometheus-compatible metrics endpoint
 * @access  Public (consider restricting in production)
 */
router.get('/metrics', async (_req: Request, res: Response) => {
  const [dbCheck, redisCheck] = await Promise.all([
    checkDatabase(),
    checkRedis(),
  ]);
  
  const memoryCheck = checkMemory();
  const systemInfo = getSystemInfo();
  
  // Format as Prometheus metrics
  const metrics = [
    '# HELP destinova_up Service availability',
    '# TYPE destinova_up gauge',
    `destinova_up 1`,
    '',
    '# HELP destinova_uptime_seconds Process uptime in seconds',
    '# TYPE destinova_uptime_seconds counter',
    `destinova_uptime_seconds ${process.uptime()}`,
    '',
    '# HELP destinova_database_up Database availability',
    '# TYPE destinova_database_up gauge',
    `destinova_database_up ${dbCheck.status === 'up' ? 1 : 0}`,
    '',
    '# HELP destinova_database_response_ms Database response time in milliseconds',
    '# TYPE destinova_database_response_ms gauge',
    `destinova_database_response_ms ${dbCheck.responseTime || 0}`,
    '',
    '# HELP destinova_redis_up Redis availability',
    '# TYPE destinova_redis_up gauge',
    `destinova_redis_up ${redisCheck.status === 'up' ? 1 : 0}`,
    '',
    '# HELP destinova_memory_usage_percent Memory usage percentage',
    '# TYPE destinova_memory_usage_percent gauge',
    `destinova_memory_usage_percent ${(memoryCheck.details as { percentage: number })?.percentage || 0}`,
    '',
    '# HELP destinova_cpu_usage_percent CPU usage percentage',
    '# TYPE destinova_cpu_usage_percent gauge',
    `destinova_cpu_usage_percent ${systemInfo.cpuUsage}`,
  ].join('\n');
  
  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});

export default router;
