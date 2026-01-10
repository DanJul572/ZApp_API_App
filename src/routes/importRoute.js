const {Router} = require('express');
const {importController} = require('../controllers');
// const middleware = require('../middleware');

const router = Router();

router.post('/api/import/excel', importController.excel);

module.exports = router;
