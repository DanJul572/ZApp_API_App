const {Router} = require('express');

const middleware = require('../middleware');
const {fieldController} = require('../controllers');

const router = Router();

router.get('/api/field/rows', middleware.authenticateToken, fieldController.rows);

module.exports = router;
