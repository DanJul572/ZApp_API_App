const {Router} = require('express');

const middleware = require('../middleware');
const {fileController} = require('../controllers');

const router = Router();

router.get('/file/download', middleware.authenticateToken, fileController.download);

module.exports = router;
