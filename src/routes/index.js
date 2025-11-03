var express = require('express');
var router = express.Router();

const testRoute = require('./testRoute');
const authRoute = require('./authRoute');
const commonRoute = require('./commonRoute');
const fieldRoute = require('./fieldRoute');
const fileRoute = require('./fileRoute');
const moduleRoute = require('./moduleRoute');
const scriptRoute = require('./scriptRoute');
const viewRoute = require('./viewRoute');

router.use(testRoute);
router.use(authRoute);
router.use(commonRoute);
router.use(fieldRoute);
router.use(fileRoute);
router.use(moduleRoute);
router.use(scriptRoute);
router.use(viewRoute);

module.exports = router;
