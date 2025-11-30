/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings (Admin)
 *     description: Returns all bookings with filtering and pagination
 *     tags: [Bookings, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [pending, paid, refunded, failed]
 *     responses:
 *       200:
 *         description: Bookings list returned
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Create new booking
 *     description: Creates a new flight booking for the authenticated user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flightId
 *               - passengers
 *               - travelClass
 *             properties:
 *               flightId:
 *                 type: string
 *                 description: ID of the flight to book
 *               passengers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - firstName
 *                     - lastName
 *                     - dateOfBirth
 *                     - gender
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                     gender:
 *                       type: string
 *                       enum: [male, female, other]
 *                     passportNumber:
 *                       type: string
 *                     nationality:
 *                       type: string
 *               travelClass:
 *                 type: string
 *                 enum: [economy, business, firstClass]
 *               seatPreferences:
 *                 type: array
 *                 items:
 *                   type: string
 *               mealPreferences:
 *                 type: array
 *                 items:
 *                   type: string
 *               specialRequests:
 *                 type: string
 *               insuranceId:
 *                 type: string
 *                 description: Optional travel insurance plan ID
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     booking:
 *                       $ref: '#/components/schemas/Booking'
 *                     paymentUrl:
 *                       type: string
 *                       description: URL to complete payment
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Flight not found
 *       409:
 *         description: Not enough seats available
 *
 * /api/bookings/my:
 *   get:
 *     summary: Get my bookings
 *     description: Returns all bookings for the authenticated user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, upcoming, past, cancelled]
 *     responses:
 *       200:
 *         description: User's bookings returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/bookings/reference/{ref}:
 *   get:
 *     summary: Get booking by reference
 *     description: Returns booking details using booking reference number
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: ref
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking reference number (e.g., DN-ABC123)
 *         example: DN-ABC123
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email for verification (required if not authenticated)
 *     responses:
 *       200:
 *         description: Booking details returned
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     description: Returns detailed information about a specific booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel booking
 *     description: Cancels a booking and initiates refund process
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     booking:
 *                       $ref: '#/components/schemas/Booking'
 *                     refundAmount:
 *                       type: number
 *                     refundStatus:
 *                       type: string
 *       400:
 *         description: Booking cannot be cancelled
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/bookings/stats:
 *   get:
 *     summary: Get booking statistics (Admin)
 *     description: Returns booking statistics and analytics
 *     tags: [Bookings, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *     responses:
 *       200:
 *         description: Statistics returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalBookings:
 *                       type: integer
 *                     totalRevenue:
 *                       type: number
 *                     confirmedBookings:
 *                       type: integer
 *                     cancelledBookings:
 *                       type: integer
 *                     avgBookingValue:
 *                       type: number
 *                     bookingsByStatus:
 *                       type: object
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

export {};
