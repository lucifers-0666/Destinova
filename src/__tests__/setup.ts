import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

/**
 * Test Setup and Teardown
 * Manages test database connection using in-memory MongoDB
 */

// Connect to in-memory database before all tests
beforeAll(async () => {
  try {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Connect to in-memory database
    await mongoose.connect(mongoUri);
    console.log('[Test Setup] Connected to in-memory MongoDB');
  } catch (error) {
    console.error('[Test Setup] Failed to connect to test database:', error);
    throw error;
  }
});

// Clear database before each test
beforeEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Disconnect and stop MongoDB after all tests
afterAll(async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('[Test Setup] Disconnected from test database');
  } catch (error) {
    console.error('[Test Setup] Error during cleanup:', error);
  }
});

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key-for-testing-only';
process.env.JWT_EXPIRE = '1h';
process.env.BCRYPT_SALT_ROUNDS = '10';
process.env.DISABLE_REDIS = 'true';

// Mock external services
jest.mock('../services/emailService.js', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
  sendVerificationEmail: jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendBookingConfirmation: jest.fn().mockResolvedValue(true)
}));

// Global test utilities
export const createTestUser = async (overrides = {}) => {
  const { User } = await import('../models/User.js');
  
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    isVerified: true,
    role: 'user',
    ...overrides
  };
  
  return User.create(defaultUser);
};

export const createTestAdmin = async (overrides = {}) => {
  return createTestUser({
    firstName: 'Admin',
    lastName: 'User',
    email: `admin${Date.now()}@example.com`,
    role: 'admin',
    ...overrides
  });
};

export const generateAuthToken = async (user: { _id: any; email: string; role: string }) => {
  const jwt = await import('jsonwebtoken');
  return jwt.default.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );
};

export const testHelpers = {
  createTestUser,
  createTestAdmin,
  generateAuthToken
};

export default testHelpers;
