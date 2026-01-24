const {Router} = require('express');

const middleware = require('../middleware');
const {reportController} = require('../controllers');

const router = Router();

router.get('/api/report/jsreport', middleware.authenticateToken, reportController.jsReport);

module.exports = router;
