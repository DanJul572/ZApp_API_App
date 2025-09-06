require('dotenv').config();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var multer = require('multer');
var path = require('path');

const errorHandler = require('./src/middleware/errorHandler');

var routes = require('./src/routes');
const {specs, swaggerUi} = require('./swagger');

var app = express();
var upload = multer();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array('files'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
