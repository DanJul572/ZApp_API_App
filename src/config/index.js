const audit = require('./audit');
const cors = require('./cors');
const database = require('./database');
const datetimeFormat = require('./datetimeFormat');
const emailTracking = require('./emailTracking');
const errorLogTarget = require('./errorLogTarget');
const file = require('./file');
const jwt = require('./jwt');
const multer = require('./multer');
const rabbitmq = require('./rabbitmq');
const rateLimit = require('./rateLimit');
const table = require('./table');
const view = require('./view');

module.exports = {
  audit,
  cors,
  database,
  datetimeFormat,
  emailTracking,
  errorLogTarget,
  file,
  jwt,
  multer,
  rabbitmq,
  rateLimit,
  table,
  view,
};
