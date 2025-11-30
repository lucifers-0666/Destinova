/**
 * @swagger
 * /api/flights/search:
 *   get:
 *     summary: Search for available flights
 *     description: Search flights by origin, destination, date, and passenger count
 *     tags: [Flights]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: origin
 *         required: true
 *         schema:
 *           type: string
 *         description: Origin airport code (e.g., DEL)
 *         example: DEL
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *         description: Destination airport code (e.g., BOM)
 *         example: BOM
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Departure date (YYYY-MM-DD)
 *         example: "2025-12-15"
 *       - in: query
 *         name: passengers
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 9
 *         description: Number of passengers
 *         example: 2
 *       - in: query
 *         name: travelClass
 *         schema:
 *           type: string
 *           enum: [economy, business, firstClass]
 *         description: Travel class
 *         example: economy
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, duration, departure]
 *         description: Sort results by
 *         example: price
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       200:
 *         description: Search results returned
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
 *                     $ref: '#/components/schemas/Flight'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *
 * /api/flights/popular:
 *   get:
 *     summary: Get popular flight routes
 *     description: Returns a list of most searched/booked flight routes
 *     tags: [Flights]
 *     security: []
 *     responses:
 *       200:
 *         description: Popular routes returned
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
 *                       origin:
 *                         type: string
 *                       destination:
 *                         type: string
 *                       lowestPrice:
 *                         type: number
 *                       flightCount:
 *                         type: integer
 *
 * /api/flights/status/{flightNumber}:
 *   get:
 *     summary: Get flight status
 *     description: Returns real-time status of a specific flight
 *     tags: [Flights]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: flightNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight number (e.g., DN-101)
 *         example: DN-101
 *     responses:
 *       200:
 *         description: Flight status returned
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
 *                     flightNumber:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [scheduled, boarding, departed, in-air, landed, delayed, cancelled]
 *                     gate:
 *                       type: string
 *                     estimatedDeparture:
 *                       type: string
 *                       format: date-time
 *                     estimatedArrival:
 *                       type: string
 *                       format: date-time
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/flights/{id}:
 *   get:
 *     summary: Get flight details by ID
 *     description: Returns detailed information about a specific flight
 *     tags: [Flights]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID
 *     responses:
 *       200:
 *         description: Flight details returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Flight'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/flights:
 *   get:
 *     summary: Get all flights (Admin)
 *     description: Returns all flights with pagination (Admin only)
 *     tags: [Flights, Admin]
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
 *           enum: [scheduled, delayed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Flights list returned
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Admin access required
 *   post:
 *     summary: Create new flight (Admin)
 *     description: Creates a new flight in the system
 *     tags: [Flights, Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flightNumber
 *               - airline
 *               - origin
 *               - destination
 *               - departureTime
 *               - arrivalTime
 *               - basePrice
 *               - totalSeats
 *             properties:
 *               flightNumber:
 *                 type: string
 *                 example: DN-201
 *               airline:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   code:
 *                     type: string
 *               origin:
 *                 type: object
 *                 properties:
 *                   airportCode:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *               destination:
 *                 type: object
 *                 properties:
 *                   airportCode:
 *                     type: string
 *                   city:
 *                     type: string
 *                   country:
 *                     type: string
 *               departureTime:
 *                 type: string
 *                 format: date-time
 *               arrivalTime:
 *                 type: string
 *                 format: date-time
 *               basePrice:
 *                 type: number
 *               totalSeats:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Flight created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/flights/{id}:
 *   put:
 *     summary: Update flight (Admin)
 *     description: Updates an existing flight
 *     tags: [Flights, Admin]
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
 *               currentPrice:
 *                 type: number
 *               status:
 *                 type: string
 *               availableSeats:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Flight updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     summary: Delete flight (Admin)
 *     description: Deletes a flight from the system
 *     tags: [Flights, Admin]
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
 *         description: Flight deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

export {};
