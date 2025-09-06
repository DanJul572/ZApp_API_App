// routes/authRoute.js

const {Router} = require('express');

const authController = require('../controllers/authController');
const authValidation = require('../validations/authValidation');
const middleware = require('../middleware');

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates user with email and password, returns an access token and menu.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 format: JSON
 *                 description: JSON string containing user email and user password
 *                 example: >
 *                   {
 *                     "email": "myuser@example.com",
 *                     "password": "mypassword123",
 *                   }
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 afterLogin:
 *                   type: string
 *                   items:
 *                     type: object
 *                   description: Menu items available after login
 *                 accessToken:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */

router.post(
  '/api/auth/login',
  middleware.parseJsonData,
  middleware.validateRequest(authValidation.login),
  authController.login,
);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and stores it in the database.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 format: JSON
 *                 description: JSON string containing user registration details
 *                 example: >
 *                   {
 *                     "email": "newuser@example.com",
 *                     "password": "securePassword123",
 *                     "fullName": "John Doe",
 *                     "roleId": 2
 *                   }
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 roleId:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

router.post('/api/auth/register', middleware.parseJsonData, authController.register);

module.exports = router;
