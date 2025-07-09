var express = require('express');
var router = express.Router();

const authenticateToken = require('../middleware/authenticateToken');

const authController = require('../controllers').authController;
const commonController = require('../controllers').commonController;
const fieldController = require('../controllers').field;
const fileController = require('../controllers').file;
const moduleController = require('../controllers').modules;
const scriptController = require('../controllers').script;
const viewController = require('../controllers').view;

/* authentication */
router.post('/api/auth/login', authController.login);
router.post('/api/auth/register', authController.register);
router.post('/api/auth/logout', authenticateToken, authController.logout);

/*  common */
router.get('/api/common/columns', authenticateToken, commonController.columns);
router.get('/api/common/detail', authenticateToken, commonController.detail);
router.get('/api/common/menu', authenticateToken, commonController.menu);
router.get('/api/common/options', commonController.options);
router.post('/api/common/create', authenticateToken, commonController.create);
router.post('/api/common/delete', authenticateToken, commonController.destory);
router.post('/api/common/rows', authenticateToken, commonController.rows);
router.post('/api/common/update', authenticateToken, commonController.update);

/* field */
router.get('/api/field/rows', authenticateToken, fieldController.rows);

/* view */
router.get('/api/view/options', authenticateToken, viewController.options);

/* script */
router.get('/api/script/run', authenticateToken, scriptController.run);

/* script */
router.get('/api/file/download', authenticateToken, fileController.download);

/* module */
router.get('/api/module/detail', authenticateToken, moduleController.detail);
router.post('/api/module/create', authenticateToken, moduleController.create);
router.post('/api/module/delete', authenticateToken, moduleController.delete);

module.exports = router;
