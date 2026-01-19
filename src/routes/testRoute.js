const {Router} = require('express');

const {testController} = require('../controllers');

const router = Router();

router.get('/api/test', testController.test);

module.exports = router;
