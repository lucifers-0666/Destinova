// MongoDB Initialization Script
// This script runs when MongoDB container is first created

// Switch to destinova database
db = db.getSiblingDB('destinova');

// Create application user with read/write access
db.createUser({
  user: 'destinova_app',
  pwd: 'destinova_secure_password_change_me',
  roles: [
    {
      role: 'readWrite',
      db: 'destinova'
    }
  ]
});

// Create indexes for performance
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

// Flights collection
db.flights.createIndex({ 'departure.iataCode': 1, 'arrival.iataCode': 1 });
db.flights.createIndex({ 'departure.scheduledTime': 1 });
db.flights.createIndex({ flightNumber: 1 });
db.flights.createIndex({ price: 1 });
db.flights.createIndex({ status: 1 });

// Bookings collection
db.bookings.createIndex({ user: 1 });
db.bookings.createIndex({ bookingReference: 1 }, { unique: true });
db.bookings.createIndex({ status: 1 });
db.bookings.createIndex({ createdAt: -1 });

// Payments collection
db.payments.createIndex({ booking: 1 });
db.payments.createIndex({ user: 1 });
db.payments.createIndex({ status: 1 });
db.payments.createIndex({ transactionId: 1 }, { unique: true });

// Reviews collection
db.reviews.createIndex({ user: 1 });
db.reviews.createIndex({ flight: 1 });
db.reviews.createIndex({ rating: -1 });
db.reviews.createIndex({ createdAt: -1 });

// Alerts collection
db.alerts.createIndex({ user: 1 });
db.alerts.createIndex({ isActive: 1 });
db.alerts.createIndex({ 'route.from': 1, 'route.to': 1 });

// Sessions collection (for express-session if used)
db.sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });

print('MongoDB initialized successfully with indexes!');
