const { Router } = require('express');
const { exportController } = require('../controllers');
const middleware = require('../middleware');

const router = Router();

router.get('/export/csv', middleware.authenticateToken, exportController.csv);
router.get('/export/excel', middleware.authenticateToken, exportController.excel);

module.exports = router;
