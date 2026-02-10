const { Router } = require('express');

const config = require('../config');
const { importController } = require('../controllers');
const middleware = require('../middleware');

const router = Router();

router.post(
  '/import/excel',
  config.multer.single('file'),
  middleware.multerErrorHandler,
  importController.excel,
);

module.exports = router;
