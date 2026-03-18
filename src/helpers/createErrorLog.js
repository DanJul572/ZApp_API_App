const commonQuery = require('../queries/commonQuery');
const config = require('../config');
const enums = require('../enums');

const fileLogger = require('./fileLogger');

async function createLogError(req, code, message) {
  if (code !== enums.statusCode.INTERNAL_SERVER_ERROR) return;

  const payload = {
    url: req.originalUrl,
    method: req.method,
    message,
  };

  switch (config.errorLogTarget) {
    case 'database':
      try {
        await commonQuery.insertRow('logErrors', payload);
      } catch (err) {
        console.error('Failed to write error log to DB', err);
      }
      break;

    case 'file':
      fileLogger.createLog.error(payload);
      break;

    case 'none':
    default:
      return;
  }
}

module.exports = createLogError;
