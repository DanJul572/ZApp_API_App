const {Router} = require('express');

const middleware = require('../middleware');
const {moduleController} = require('../controllers');

const router = Router();

router.get('/api/module/detail', middleware.authenticateToken, moduleController.detail);

router.post(
  '/api/module/create',
  middleware.parseJsonData,
  middleware.authenticateToken,
  moduleController.create,
);
router.post(
  '/api/module/delete',
  middleware.parseJsonData,
  middleware.authenticateToken,
  moduleController.destroy,
);

module.exports = router;
