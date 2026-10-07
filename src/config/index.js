const audit = require('./audit');
const cors = require('./cors');
const database = require('./database');
const datetimeFormat = require('./datetimeFormat');
const errorLogTarget = require('./errorLogTarget');
const file = require('./file');
const jwt = require('./jwt');
const logRetention = require('./logRetention');
const multer = require('./multer');
const rateLimit = require('./rateLimit');
const table = require('./table');
const view = require('./view');

module.exports = {
  audit,
  cors,
  database,
  datetimeFormat,
  errorLogTarget,
  file,
  jwt,
  logRetention,
  multer,
  rateLimit,
  table,
  view,
};
