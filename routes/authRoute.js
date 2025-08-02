const {Router} = require('express');
const {validate} = require('express-validation');

const authController = require('@controllers/authController');
const authValidation = require('@validations/authValidation');
const parseJsonData = require('@middleware/parseJsonData');

const router = Router();

router.post('/api/auth/login', parseJsonData, validate(authValidation.login), authController.login);
router.post('/api/auth/register', authController.register);

module.exports = router;
