require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const logger = require('morgan');
const multer = require('multer');
const path = require('path');

const errorHandler = require('./src/middleware/errorHandler');

const routes = require('./src/routes');
const {file} = require('./src/config');

const app = express();

const upload = multer({
  storage: multer.diskStorage({
    destination: file.fileUpload.destination,
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * file.fileUpload.maxSize,
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array('files'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

if (process.env.NODE_ENV !== 'production') {
  const {specs, swaggerUi} = require('./swagger');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

app.use(errorHandler);

module.exports = app;
