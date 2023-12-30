var express = require('express');
var router = express.Router();

const generalController = require('../controllers').general;
const menuController = require('../controllers').menu;
const moduleController = require('../controllers').modules;
const viewController = require('../controllers').view;

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

/*  General */
router.post('/api/general/rows', generalController.rows);
router.post('/api/general/columns', generalController.columns);

/* Menu */
router.post('/api/menu', menuController.list);

/* Module */
router.post('/api/module/list', moduleController.list);
router.post('/api/module/create', moduleController.create);
router.post('/api/module/delete', moduleController.delete);

/* View */
router.post('/api/view/create', viewController.create);

module.exports = router;
