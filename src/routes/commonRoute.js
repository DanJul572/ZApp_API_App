const { Router } = require('express');

const config = require('../config');
const middleware = require('../middleware');
const { commonController } = require('../controllers');

const router = Router();

// File fields are sent as multipart parts named after the field, the row itself as JSON in `data`.
const uploadFiles = [
  middleware.removeTempUploads,
  config.multer.any(),
  middleware.multerErrorHandler,
  middleware.parseJsonData,
];

router.get('/common/columns', middleware.authenticateToken, commonController.columns);
router.get('/common/detail', middleware.authenticateToken, commonController.detail);
router.get('/common/menu', middleware.authenticateToken, commonController.menu);
router.get('/common/options', commonController.options);

router.post(
  '/common/create',
  middleware.authenticateToken,
  ...uploadFiles,
  commonController.create,
);

router.post(
  '/common/delete',
  config.multer.none(),
  middleware.authenticateToken,
  commonController.destroy,
);

router.post(
  '/common/rows',
  config.multer.none(),
  middleware.authenticateToken,
  commonController.rows,
);

router.post(
  '/common/update',
  middleware.authenticateToken,
  ...uploadFiles,
  commonController.update,
);

module.exports = router;
