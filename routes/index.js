var express = require('express');
var router = express.Router();

const menuController = require('../controllers').menu;
const moduleController = require('../controllers').modules;

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});

/* Menu Router */
router.post('/api/menu', menuController.list);

/* Module Router */
router.post('/api/module/create', moduleController.create);
router.post('/api/module/delete', moduleController.delete);

module.exports = router;
