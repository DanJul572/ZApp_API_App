const {Router} = require('express');

const middleware = require('../middleware');
const {fieldController} = require('../controllers');

const router = Router();

/**
 * @swagger
 * /api/field/rows:
 *   get:
 *     summary: Get field rows
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Field
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer {token}
 *         description: Bearer token for authentication
 *     responses:
 *       200:
 *         description: List of field rows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/api/field/rows', middleware.authenticateToken, fieldController.rows);

module.exports = router;
