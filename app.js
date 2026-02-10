require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');

const errorHandler = require('./src/middleware/errorHandler');

const routes = require('./src/routes');
const config = require('./src/config');

const app = express();

app.use(config.cors);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', config.rateLimit);
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
