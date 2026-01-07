var express = require('express');
var router = express.Router();

const authRoute = require('./authRoute');
const commonRoute = require('./commonRoute');
const exportRoute = require('./exportRoute');
const fieldRoute = require('./fieldRoute');
const fileRoute = require('./fileRoute');
const moduleRoute = require('./moduleRoute');
const scriptRoute = require('./scriptRoute');
const testRoute = require('./testRoute');
const viewRoute = require('./viewRoute');

router.use(authRoute);
router.use(commonRoute);
router.use(exportRoute);
router.use(fieldRoute);
router.use(fileRoute);
router.use(moduleRoute);
router.use(scriptRoute);
router.use(testRoute);
router.use(viewRoute);

module.exports = router;
