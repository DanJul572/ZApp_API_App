const cors = require('./cors');
const database = require('./database');
const datetimeFormat = require('./datetimeFormat');
const errorLogTarget = require('./errorLogTarget');
const file = require('./file');
const jwt = require('./jwt');
const multer = require('./multer');
const rateLimit = require('./rateLimit');
const table = require('./table');

module.exports = {
  cors,
  database,
  datetimeFormat,
  errorLogTarget,
  file,
  jwt,
  multer,
  rateLimit,
  table,
};
