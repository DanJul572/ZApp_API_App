const {Router} = require('express');

const middleware = require('@middleware');
const {viewController} = require('@controllers');

const router = Router();

router.get('/api/view/options', middleware.authenticateToken, viewController.options);

module.exports = router;
