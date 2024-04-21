var express = require('express');
var router = express.Router();

const authController = require('../controllers').auth;
const generalController = require('../controllers').general;
const moduleController = require('../controllers').modules;
const scriptController = require('../controllers').script;

/* Authentication */
router.post('/api/auth/login', authController.login);
router.post('/api/auth/register', authController.register);
router.post('/api/auth/logout', authController.authenticateToken, authController.logout);

/*  General */
router.get('/api/general/columns', authController.authenticateToken, generalController.columns);
router.get('/api/general/detail', authController.authenticateToken, generalController.detail);
router.get('/api/general/menu', authController.authenticateToken, generalController.menu);
router.get('/api/general/options', generalController.options);
router.post('/api/general/create', authController.authenticateToken, generalController.create);
router.post('/api/general/delete', authController.authenticateToken, generalController.delete);
router.post('/api/general/rows', authController.authenticateToken, generalController.rows);
router.post('/api/general/update', authController.authenticateToken, generalController.update);

/* script */
router.get('/api/script/run', authController.authenticateToken, scriptController.run);

/* Module */
router.post('/api/module/create', authController.authenticateToken, moduleController.create);
router.post('/api/module/delete', authController.authenticateToken, moduleController.delete);

module.exports = router;
