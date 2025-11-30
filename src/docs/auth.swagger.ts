/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: Creates a new user account and sends a verification email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: John
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Must contain uppercase, lowercase, number, and special character
 *                 example: SecurePass123!
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registration successful. Please verify your email.
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       409:
 *         description: Email already registered
 *
 * /api/auth/login:
 *   post:
 *     summary: Login to user account
 *     description: Authenticates user and returns JWT tokens
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: SecurePass123!
 *               rememberMe:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                     expiresIn:
 *                       type: number
 *                       example: 3600
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Email not verified
 *
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       404:
 *         description: Email not found
 *
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     description: Resets user password using the token from email
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token from password reset email
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: NewSecurePass123!
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 *
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify email address
 *     description: Verifies user's email using the token from verification email
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Gets a new access token using refresh token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 *
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidates the current session
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile information
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
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
 */

export {};
