const {Router} = require('express');
const {importController} = require('../controllers');
const middleware = require('../middleware');

const router = Router();

router.post('/api/import/excel', middleware.multerErrorHandler, importController.excel);

module.exports = router;
