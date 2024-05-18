var express = require('express');
var router = express.Router();

const authController = require('../controllers').auth;
const commonController = require('../controllers').common;
const fieldController = require('../controllers').field;
const moduleController = require('../controllers').modules;
const scriptController = require('../controllers').script;

/* Authentication */
router.post('/api/auth/login', authController.login);
router.post('/api/auth/register', authController.register);
router.post('/api/auth/logout', authController.authenticateToken, authController.logout);

/*  common */
router.get('/api/common/columns', authController.authenticateToken, commonController.columns);
router.get('/api/common/detail', authController.authenticateToken, commonController.detail);
router.get('/api/common/menu', authController.authenticateToken, commonController.menu);
router.get('/api/common/options', commonController.options);
router.post('/api/common/create', authController.authenticateToken, commonController.create);
router.post('/api/common/delete', authController.authenticateToken, commonController.delete);
router.post('/api/common/rows', authController.authenticateToken, commonController.rows);
router.post('/api/common/update', authController.authenticateToken, commonController.update);

/* field */
router.get('/api/field/rows', authController.authenticateToken, fieldController.rows);

/* script */
router.get('/api/script/run', authController.authenticateToken, scriptController.run);

/* Module */
router.get('/api/module/detail', authController.authenticateToken, moduleController.detail);
router.post('/api/module/create', authController.authenticateToken, moduleController.create);
router.post('/api/module/delete', authController.authenticateToken, moduleController.delete);

module.exports = router;
