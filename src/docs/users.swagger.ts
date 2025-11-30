/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Returns the authenticated user's complete profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   put:
 *     summary: Update user profile
 *     description: Updates the authenticated user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   country:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *               preferences:
 *                 type: object
 *                 properties:
 *                   seatPreference:
 *                     type: string
 *                     enum: [window, aisle, middle]
 *                   mealPreference:
 *                     type: string
 *                     enum: [veg, non-veg, vegan]
 *                   language:
 *                     type: string
 *                   currency:
 *                     type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/users/change-password:
 *   put:
 *     summary: Change password
 *     description: Changes the user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/users/saved-travelers:
 *   get:
 *     summary: Get saved travelers
 *     description: Returns list of saved traveler profiles
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved travelers returned
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
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       dateOfBirth:
 *                         type: string
 *                       passportNumber:
 *                         type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Add saved traveler
 *     description: Adds a new traveler to saved profiles
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *               passportNumber:
 *                 type: string
 *               nationality:
 *                 type: string
 *     responses:
 *       201:
 *         description: Traveler added successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/users/saved-travelers/{id}:
 *   delete:
 *     summary: Remove saved traveler
 *     description: Removes a traveler from saved profiles
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Traveler removed successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/users/notifications/preferences:
 *   get:
 *     summary: Get notification preferences
 *     description: Returns user's notification settings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferences returned
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   put:
 *     summary: Update notification preferences
 *     description: Updates user's notification settings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: boolean
 *               push:
 *                 type: boolean
 *               sms:
 *                 type: boolean
 *               priceAlerts:
 *                 type: boolean
 *               bookingUpdates:
 *                 type: boolean
 *               promotions:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Preferences updated
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get reviews
 *     description: Returns reviews with optional filtering
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: flightId
 *         schema:
 *           type: string
 *         description: Filter by flight ID
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reviews returned
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
 *                     $ref: '#/components/schemas/Review'
 *   post:
 *     summary: Create review
 *     description: Creates a new review for a completed flight
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *               - rating
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: Booking ID for the completed flight
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *               categories:
 *                 type: object
 *                 properties:
 *                   comfort:
 *                     type: integer
 *                   service:
 *                     type: integer
 *                   food:
 *                     type: integer
 *                   entertainment:
 *                     type: integer
 *                   value:
 *                     type: integer
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Already reviewed or flight not completed
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/reviews/{id}:
 *   put:
 *     summary: Update review
 *     description: Updates an existing review (owner only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               title:
 *                 type: string
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to update this review
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete review
 *     description: Deletes a review (owner or admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized to delete this review
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/price-alerts:
 *   get:
 *     summary: Get my price alerts
 *     description: Returns all price alerts for the authenticated user
 *     tags: [Price Alerts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Price alerts returned
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
 *                     $ref: '#/components/schemas/PriceAlert'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Create price alert
 *     description: Creates a new price alert for a route
 *     tags: [Price Alerts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origin
 *               - destination
 *               - targetPrice
 *             properties:
 *               origin:
 *                 type: string
 *                 description: Origin airport code
 *                 example: DEL
 *               destination:
 *                 type: string
 *                 description: Destination airport code
 *                 example: BOM
 *               targetPrice:
 *                 type: number
 *                 description: Target price to alert at
 *                 example: 5000
 *               travelDate:
 *                 type: string
 *                 format: date
 *                 description: Optional specific travel date
 *               flexibleDates:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Price alert created
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/price-alerts/{id}:
 *   put:
 *     summary: Update price alert
 *     description: Updates an existing price alert
 *     tags: [Price Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetPrice:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Price alert updated
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete price alert
 *     description: Deletes a price alert
 *     tags: [Price Alerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Price alert deleted
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Returns all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *         description: Return only unread notifications
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notifications returned
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     description: Marks a specific notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     description: Marks all user notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Get destinations
 *     description: Returns list of travel destinations
 *     tags: [Destinations]
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured destinations only
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country
 *     responses:
 *       200:
 *         description: Destinations returned
 *
 * /api/destinations/{id}:
 *   get:
 *     summary: Get destination details
 *     description: Returns detailed information about a destination
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destination details returned
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

export {};
