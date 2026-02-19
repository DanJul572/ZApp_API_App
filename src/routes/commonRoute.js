const { Router } = require('express');

const config = require('../config');
const middleware = require('../middleware');
const { commonController } = require('../controllers');

const router = Router();

router.get('/common/columns', middleware.authenticateToken, commonController.columns);
router.get('/common/detail', middleware.authenticateToken, commonController.detail);
router.get('/common/menu', middleware.authenticateToken, commonController.menu);
router.get('/common/options', commonController.options);

router.post(
  '/common/create',
  config.multer.any(),
  middleware.parseJsonData,
  middleware.authenticateToken,
  commonController.create,
);

router.post(
  '/common/delete',
  config.multer.none(),
  middleware.parseJsonData,
  middleware.authenticateToken,
  commonController.destroy,
);

router.post(
  '/common/rows',
  config.multer.none(),
  middleware.parseJsonData,
  middleware.authenticateToken,
  commonController.rows,
);

router.post(
  '/common/update',
  config.multer.any(),
  middleware.parseJsonData,
  middleware.authenticateToken,
  commonController.update,
);

module.exports = router;
