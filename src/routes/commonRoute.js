const {Router} = require('express');

const middleware = require('../middleware');
const {commonController} = require('../controllers');

const router = Router();

router.get('/api/common/columns', middleware.authenticateToken, commonController.columns);
router.get('/api/common/detail', middleware.authenticateToken, commonController.detail);
router.get('/api/common/menu', middleware.authenticateToken, commonController.menu);
router.get('/api/common/options', commonController.options);

router.post(
  '/api/common/create',
  middleware.parseJsonData,
  middleware.authenticateToken,
  commonController.create,
);

router.post(
  '/api/common/delete',
  middleware.parseJsonData,
  middleware.authenticateToken,
  commonController.destroy,
);

router.post(
  '/api/common/rows',
  middleware.parseJsonData,
  middleware.authenticateToken,
  commonController.rows,
);

router.post(
  '/api/common/update',
  middleware.parseJsonData,
  middleware.authenticateToken,
  commonController.update,
);

module.exports = router;
