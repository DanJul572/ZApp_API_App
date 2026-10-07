const commonQuery = require('../queries/commonQuery');
const config = require('../config');
const enums = require('../enums');

const fileLogger = require('./fileLogger');
const getRequestInfo = require('./getRequestInfo');
const maskSensitiveData = require('./maskSensitiveData');

function getRequestBody(req) {
  if (!req.body || !Object.keys(req.body).length) return null;

  const body = JSON.stringify(maskSensitiveData(req.body));
  if (body.length <= config.audit.maxRequestBodyLength) return body;

  return JSON.stringify({
    truncated: true,
    preview: body.substring(0, config.audit.maxRequestBodyLength),
  });
}

// Called once per unhandled error, from the errorHandler middleware.
async function createLogError(req, err) {
  const { userId, userName, ipAddress } = getRequestInfo(req);

  const payload = {
    url: req.originalUrl,
    method: req.method,
    statusCode: enums.statusCode.INTERNAL_SERVER_ERROR,
    message: err?.message || String(err),
    stack: err?.stack ?? null,
    requestBody: getRequestBody(req),
    userId,
    userName,
    ipAddress,
  };

  switch (config.errorLogTarget) {
    case 'database':
      try {
        await commonQuery.insertRow('logErrors', payload);
      } catch (logErr) {
        console.error('Failed to write error log to DB', logErr);
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
