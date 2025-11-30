import mongoose from 'mongoose';

// Database connection options
interface ConnectionOptions {
  maxRetries?: number;
  retryDelay?: number;
  maxPoolSize?: number;
}

// Default options
const defaultOptions: ConnectionOptions = {
  maxRetries: parseInt(process.env.DB_RETRY_ATTEMPTS || '3', 10),
  retryDelay: parseInt(process.env.DB_RETRY_DELAY || '5000', 10),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10', 10)
};

/**
 * Get the MongoDB connection URI
 * Supports both local MongoDB and MongoDB Atlas
 */
const getMongoURI = (): string => {
  // Check for different environment variable names
  const uri = process.env.DATABASE_URL || 
              process.env.MONGO_URI || 
              process.env.MONGODB_URI ||
              'mongodb://127.0.0.1:27017/destinova';
  
  return uri;
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Connect to MongoDB with retry logic
 * @param options - Connection options including retry configuration
 */
export const connectDatabase = async (options: ConnectionOptions = {}): Promise<typeof mongoose> => {
  const config = { ...defaultOptions, ...options };
  const mongoURI = getMongoURI();
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= (config.maxRetries || 3); attempt++) {
    try {
      console.log(`🔄 Attempting to connect to MongoDB (attempt ${attempt}/${config.maxRetries})...`);
      
      // Mongoose connection options
      const mongooseOptions: mongoose.ConnectOptions = {
        maxPoolSize: config.maxPoolSize,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip trying IPv6
        retryWrites: true,
        w: 'majority'
      };
      
      await mongoose.connect(mongoURI, mongooseOptions);
      
      // Get connection info
      const connection = mongoose.connection;
      const host = connection.host;
      const port = connection.port;
      const dbName = connection.name;
      
      console.log('');
      console.log('╔════════════════════════════════════════════════════════════════╗');
      console.log('║                    DATABASE CONNECTION                         ║');
      console.log('╠════════════════════════════════════════════════════════════════╣');
      console.log(`║  ✅ MongoDB Connected Successfully!                            ║`);
      console.log(`║  📍 Host: ${host.padEnd(50)}║`);
      console.log(`║  🔌 Port: ${String(port || 'N/A').padEnd(50)}║`);
      console.log(`║  📁 Database: ${dbName.padEnd(46)}║`);
      console.log(`║  🔗 Pool Size: ${String(config.maxPoolSize).padEnd(45)}║`);
      console.log('╚════════════════════════════════════════════════════════════════╝');
      console.log('');
      
      // Set up connection event handlers
      setupConnectionHandlers();
      
      return mongoose;
      
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Connection attempt ${attempt} failed:`, (error as Error).message);
      
      if (attempt < (config.maxRetries || 3)) {
        console.log(`⏳ Retrying in ${(config.retryDelay || 5000) / 1000} seconds...`);
        await sleep(config.retryDelay || 5000);
      }
    }
  }
  
  // All retries exhausted
  console.error('');
  console.error('╔════════════════════════════════════════════════════════════════╗');
  console.error('║              DATABASE CONNECTION FAILED                        ║');
  console.error('╠════════════════════════════════════════════════════════════════╣');
  console.error('║  ❌ Failed to connect to MongoDB after multiple attempts       ║');
  console.error('║                                                                ║');
  console.error('║  Possible solutions:                                           ║');
  console.error('║  1. Check if MongoDB is running locally                        ║');
  console.error('║  2. Verify your DATABASE_URL in .env file                     ║');
  console.error('║  3. Check network connectivity to MongoDB Atlas                ║');
  console.error('║  4. Whitelist your IP in MongoDB Atlas                         ║');
  console.error('╚════════════════════════════════════════════════════════════════╝');
  console.error('');
  console.error('Error details:', lastError?.message);
  
  throw lastError || new Error('Failed to connect to MongoDB');
};

/**
 * Set up MongoDB connection event handlers
 */
const setupConnectionHandlers = (): void => {
  const connection = mongoose.connection;
  
  // Connection events
  connection.on('connected', () => {
    console.log('📗 Mongoose connected to database');
  });
  
  connection.on('error', (err) => {
    console.error('📕 Mongoose connection error:', err.message);
  });
  
  connection.on('disconnected', () => {
    console.log('📙 Mongoose disconnected from database');
  });
  
  connection.on('reconnected', () => {
    console.log('📗 Mongoose reconnected to database');
  });
  
  // Handle application termination
  process.on('SIGINT', async () => {
    try {
      await connection.close();
      console.log('📕 Mongoose connection closed through app termination (SIGINT)');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
  
  process.on('SIGTERM', async () => {
    try {
      await connection.close();
      console.log('📕 Mongoose connection closed through app termination (SIGTERM)');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('📕 MongoDB disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};

/**
 * Check if database is connected
 */
export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get database connection status
 */
export const getConnectionStatus = (): string => {
  const states: { [key: number]: string } = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized'
  };
  
  return states[mongoose.connection.readyState] || 'unknown';
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async (): Promise<{
  status: string;
  host: string;
  port: number | undefined;
  database: string;
  collections: number;
}> => {
  if (!isDatabaseConnected()) {
    throw new Error('Database is not connected');
  }
  
  const connection = mongoose.connection;
  const collections = await connection.db?.listCollections().toArray();
  
  return {
    status: getConnectionStatus(),
    host: connection.host,
    port: connection.port,
    database: connection.name,
    collections: collections?.length || 0
  };
};

// Export mongoose for convenience
export { mongoose };
