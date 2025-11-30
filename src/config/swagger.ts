import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Destinova Flight Booking API',
      version: '1.0.0',
      description: `
# Destinova Flight Booking API

A comprehensive RESTful API for flight booking, management, and travel services.

## Features
- **User Authentication**: Register, login, password reset with JWT tokens
- **Flight Management**: Search, filter, and manage flights
- **Booking System**: Complete booking workflow with seat selection
- **Payment Processing**: Secure Stripe integration
- **Price Alerts**: Get notified when prices drop
- **Reviews & Ratings**: User reviews for flights
- **Admin Dashboard**: Complete administrative controls

## Authentication
Most endpoints require authentication via JWT Bearer token. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your_token>
\`\`\`

## Rate Limiting
- General endpoints: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Search endpoints: 30 requests per minute

## Error Responses
All errors follow a consistent format:
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional validation errors
}
\`\`\`
      `,
      contact: {
        name: 'Destinova Support',
        email: 'support@destinova.com',
        url: 'https://destinova.com/support'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server'
      },
      {
        url: 'https://api.destinova.com',
        description: 'Production Server'
      }
    ],
    tags: [
      { name: 'Auth', description: 'Authentication & Authorization' },
      { name: 'Users', description: 'User profile management' },
      { name: 'Flights', description: 'Flight search and management' },
      { name: 'Bookings', description: 'Booking operations' },
      { name: 'Payments', description: 'Payment processing' },
      { name: 'Reviews', description: 'Flight reviews and ratings' },
      { name: 'Price Alerts', description: 'Price drop notifications' },
      { name: 'Refunds', description: 'Refund requests and processing' },
      { name: 'Notifications', description: 'User notifications' },
      { name: 'Destinations', description: 'Travel destinations' },
      { name: 'Admin', description: 'Administrative operations' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from /api/auth/login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            phone: { type: 'string', example: '+1234567890' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            isVerified: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Flight: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            flightNumber: { type: 'string', example: 'DN-101' },
            airline: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Destinova Air' },
                code: { type: 'string', example: 'DN' },
                logo: { type: 'string' }
              }
            },
            origin: {
              type: 'object',
              properties: {
                airportCode: { type: 'string', example: 'DEL' },
                airportName: { type: 'string', example: 'Indira Gandhi International Airport' },
                city: { type: 'string', example: 'Delhi' },
                country: { type: 'string', example: 'India' }
              }
            },
            destination: {
              type: 'object',
              properties: {
                airportCode: { type: 'string', example: 'BOM' },
                airportName: { type: 'string', example: 'Chhatrapati Shivaji International Airport' },
                city: { type: 'string', example: 'Mumbai' },
                country: { type: 'string', example: 'India' }
              }
            },
            departureTime: { type: 'string', format: 'date-time' },
            arrivalTime: { type: 'string', format: 'date-time' },
            duration: { type: 'number', example: 120 },
            currentPrice: { type: 'number', example: 5500 },
            currency: { type: 'string', example: 'INR' },
            availableSeats: { type: 'number', example: 150 },
            status: { type: 'string', enum: ['scheduled', 'delayed', 'cancelled', 'completed'] }
          }
        },
        Booking: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            bookingReference: { type: 'string', example: 'DN-ABC123' },
            user: { type: 'string' },
            flight: { $ref: '#/components/schemas/Flight' },
            passengers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  seatNumber: { type: 'string' }
                }
              }
            },
            travelClass: { type: 'string', enum: ['economy', 'business', 'firstClass'] },
            totalAmount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
            paymentStatus: { type: 'string', enum: ['pending', 'paid', 'refunded', 'failed'] }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            booking: { type: 'string' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            paymentMethod: { type: 'string', enum: ['card', 'upi', 'netbanking', 'wallet'] },
            status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
            transactionId: { type: 'string' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            flight: { type: 'string' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            title: { type: 'string' },
            comment: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        PriceAlert: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            origin: { type: 'string' },
            destination: { type: 'string' },
            targetPrice: { type: 'number' },
            isActive: { type: 'boolean' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Authentication required'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Resource not found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Validation failed',
                errors: [{ field: 'email', message: 'Invalid email format' }]
              }
            }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './src/docs/*.ts'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI options
  const swaggerUiOptions = {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { color: #3b82f6; }
    `,
    customSiteTitle: 'Destinova API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true
    }
  };

  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  // Serve raw swagger.json
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger documentation available at /api-docs');
};

export { swaggerSpec };
