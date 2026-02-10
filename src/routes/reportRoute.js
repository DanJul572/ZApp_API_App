const { Router } = require('express');

const middleware = require('../middleware');
const { reportController } = require('../controllers');
const reportValidation = require('../validations/reportvalidation');

const router = Router();

router.get(
  '/report/jsreport',
  middleware.authenticateToken,
  middleware.validateRequest(reportValidation.getjsReport),
  reportController.jsReport,
);

router.get(
  '/report/previewDataSchema',
  middleware.authenticateToken,
  middleware.validateRequest(reportValidation.getPreviewDataSchema),
  reportController.previewDataSchema,
);

module.exports = router;
