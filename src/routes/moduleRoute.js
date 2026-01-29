const {Router} = require('express');

const config = require('../config');
const middleware = require('../middleware');
const {moduleController} = require('../controllers');

const router = Router();

router.get('/module/detail', middleware.authenticateToken, moduleController.detail);

router.post(
  '/module/create',
  config.multer.none(),
  middleware.parseJsonData,
  middleware.authenticateToken,
  moduleController.create,
);
router.post(
  '/module/delete',
  config.multer.none(),
  middleware.parseJsonData,
  middleware.authenticateToken,
  moduleController.destroy,
);

module.exports = router;
