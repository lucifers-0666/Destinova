/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create payment intent
 *     description: Creates a Stripe payment intent for a booking
 *     tags: [Payments]
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
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID of the booking to pay for
 *               paymentMethod:
 *                 type: string
 *                 enum: [card, upi, netbanking, wallet]
 *                 default: card
 *     responses:
 *       200:
 *         description: Payment intent created
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
 *                     clientSecret:
 *                       type: string
 *                       description: Stripe client secret for frontend
 *                     paymentIntentId:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     currency:
 *                       type: string
 *       400:
 *         description: Booking already paid or invalid
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Booking not found
 *
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm payment
 *     description: Confirms a payment after Stripe processing
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentIntentId
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed
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
 *                     payment:
 *                       $ref: '#/components/schemas/Payment'
 *                     booking:
 *                       $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Payment failed or invalid
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/payments/webhook:
 *   post:
 *     summary: Stripe webhook handler
 *     description: Handles Stripe webhook events (internal use)
 *     tags: [Payments]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed
 *
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment details
 *     description: Returns details of a specific payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/payments/my:
 *   get:
 *     summary: Get my payments
 *     description: Returns all payments for the authenticated user
 *     tags: [Payments]
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
 *     responses:
 *       200:
 *         description: User's payments returned
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/payments/{id}/refund:
 *   post:
 *     summary: Request payment refund
 *     description: Initiates a refund for a payment
 *     tags: [Payments]
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
 *               amount:
 *                 type: number
 *                 description: Partial refund amount (optional)
 *     responses:
 *       200:
 *         description: Refund initiated
 *       400:
 *         description: Refund not possible
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/refunds:
 *   get:
 *     summary: Get all refund requests (Admin)
 *     description: Returns all refund requests with filtering
 *     tags: [Refunds, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, processed]
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
 *         description: Refund requests returned
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Create refund request
 *     description: Creates a new refund request for a booking
 *     tags: [Refunds]
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
 *               - reason
 *             properties:
 *               bookingId:
 *                 type: string
 *               reason:
 *                 type: string
 *                 enum: [schedule_change, personal_emergency, medical, other]
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Refund request created
 *       400:
 *         description: Invalid request
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/refunds/{id}:
 *   get:
 *     summary: Get refund details
 *     description: Returns details of a specific refund request
 *     tags: [Refunds]
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
 *         description: Refund details returned
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/refunds/{id}/approve:
 *   put:
 *     summary: Approve refund (Admin)
 *     description: Approves a pending refund request
 *     tags: [Refunds, Admin]
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
 *               approvedAmount:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund approved
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/refunds/{id}/reject:
 *   put:
 *     summary: Reject refund (Admin)
 *     description: Rejects a pending refund request
 *     tags: [Refunds, Admin]
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
 *             required:
 *               - rejectionReason
 *             properties:
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refund rejected
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

export {};
