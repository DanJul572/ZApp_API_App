var express = require('express');
var router = express.Router();

const authRoute = require('./authRoute');
const commonRoute = require('./commonRoute');
const errorRoute = require('./errorRoute');
const exportRoute = require('./exportRoute');
const fieldRoute = require('./fieldRoute');
const fileRoute = require('./fileRoute');
const importRoute = require('./importRoute');
const moduleRoute = require('./moduleRoute');
const reportRoute = require('./reportRoute');
const scriptRoute = require('./scriptRoute');
const testRoute = require('./testRoute');
const viewRoute = require('./viewRoute');

router.use(authRoute);
router.use(commonRoute);
router.use(exportRoute);
router.use(fieldRoute);
router.use(fileRoute);
router.use(importRoute);
router.use(moduleRoute);
router.use(reportRoute);
router.use(scriptRoute);
router.use(testRoute);
router.use(viewRoute);

router.use(errorRoute);

module.exports = router;
