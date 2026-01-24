const {Router} = require('express');

const middleware = require('../middleware');
const {reportController} = require('../controllers');
const reportValidation = require('../validations/reportvalidation');

const router = Router();

router.get(
  '/api/report/jsreport',
  middleware.authenticateToken,
  middleware.validateRequest(reportValidation.getjsReport),
  reportController.jsReport,
);

module.exports = router;
