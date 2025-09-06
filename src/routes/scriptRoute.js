const {Router} = require('express');

const middleware = require('../middleware');
const {scriptController} = require('../controllers');

const router = Router();

router.get('/api/script/run', middleware.authenticateToken, scriptController.run);

module.exports = router;
