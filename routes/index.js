var express = require('express');
var router = express.Router();

const middleware = require('@middleware');
const controllers = require('@controllers');

const commonController = controllers.commonController;
const fieldController = controllers.fieldController;
const fileController = controllers.fileController;
const moduleController = controllers.moduleController;
const scriptController = controllers.scriptController;
const viewController = controllers.viewController;

const authRoute = require('./authRoute');

router.use(authRoute);

/*  common */
router.get('/api/common/columns', middleware.authenticateToken, commonController.columns);
router.get('/api/common/detail', middleware.authenticateToken, commonController.detail);
router.get('/api/common/menu', middleware.authenticateToken, commonController.menu);
router.get('/api/common/options', commonController.options);
router.post('/api/common/create', middleware.authenticateToken, commonController.create);
router.post('/api/common/delete', middleware.authenticateToken, commonController.destroy);
router.post('/api/common/rows', middleware.authenticateToken, commonController.rows);
router.post('/api/common/update', middleware.authenticateToken, commonController.update);

/* field */
router.get('/api/field/rows', middleware.authenticateToken, fieldController.rows);

/* view */
router.get('/api/view/options', middleware.authenticateToken, viewController.options);

/* script */
router.get('/api/script/run', middleware.authenticateToken, scriptController.run);

/* file */
router.get('/api/file/download', middleware.authenticateToken, fileController.download);

/* module */
router.get('/api/module/detail', middleware.authenticateToken, moduleController.detail);
router.post('/api/module/create', middleware.authenticateToken, moduleController.create);
router.post('/api/module/delete', middleware.authenticateToken, moduleController.destroy);

module.exports = router;
