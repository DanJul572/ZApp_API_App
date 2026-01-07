const {Router} = require('express');
const {exportController} = require('../controllers');
const middleware = require('../middleware');

const router = Router();

router.get('/api/export/csv', middleware.authenticateToken, exportController.csv);

module.exports = router;
