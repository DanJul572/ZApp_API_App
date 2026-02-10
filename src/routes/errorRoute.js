const { Router } = require('express');

const { errorController } = require('../controllers');

const router = Router();

router.use(errorController.notFound);

module.exports = router;
