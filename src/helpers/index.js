const decodeToken = require('./decodeToken');
const createErrorLog = require('./createErrorLog');
const fileLogger = require('./fileLogger');
const generateColumnByField = require('./generateColumnByField');
const getErrorResponse = require('./getErrorResponse');
const replacePlaceholders = require('./replacePlaceholders');

module.exports = {
  decodeToken,
  fileLogger,
  generateColumnByField,
  getErrorResponse,
  createErrorLog,
  replacePlaceholders,
};
