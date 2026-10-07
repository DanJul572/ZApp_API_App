const createAuditTrail = require('./createAuditTrail');
const createErrorLog = require('./createErrorLog');
const createLoginAudit = require('./createLoginAudit');
const decodeToken = require('./decodeToken');
const fileLogger = require('./fileLogger');
const generateColumnByField = require('./generateColumnByField');
const getDataChanges = require('./getDataChanges');
const getErrorResponse = require('./getErrorResponse');
const getRequestInfo = require('./getRequestInfo');
const maskSensitiveData = require('./maskSensitiveData');
const replacePlaceholders = require('./replacePlaceholders');
const viewEncryption = require('./viewEncryption');

module.exports = {
  createAuditTrail,
  createErrorLog,
  createLoginAudit,
  decodeToken,
  fileLogger,
  generateColumnByField,
  getDataChanges,
  getErrorResponse,
  getRequestInfo,
  maskSensitiveData,
  replacePlaceholders,
  viewEncryption,
};
