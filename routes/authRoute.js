const {Router} = require('express');

const authController = require('@controllers/authController');
const authValidation = require('@validations/authValidation');
const middleware = require('@middleware');

const router = Router();

router.post(
  '/api/auth/login',
  middleware.parseJsonData,
  middleware.validateRequest(authValidation.login),
  authController.login,
);
router.post('/api/auth/register', authController.register);

module.exports = router;
