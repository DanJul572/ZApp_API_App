const { Router } = require('express');

const middleware = require('../middleware');
const { fileController } = require('../controllers');

const router = Router();

router.get('/file/detail', middleware.authenticateToken, fileController.detail);

module.exports = router;
