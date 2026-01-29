const {Router} = require('express');

const config = require('../config');
const authController = require('../controllers/authController');
const authValidation = require('../validations/authValidation');
const middleware = require('../middleware');

const router = Router();

router.post(
  '/auth/login',
  config.multer.none(),
  middleware.parseJsonData,
  middleware.validateRequest(authValidation.login),
  authController.login,
);
router.post(
  '/auth/register',
  config.multer.none(),
  middleware.parseJsonData,
  authController.register,
);
router.get('/auth/me', middleware.authenticateToken, authController.me);
router.get('/auth/logout', middleware.authenticateToken, authController.logout);

module.exports = router;
