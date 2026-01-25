const enums = require('../enums');
const commonQuery = require('../queries/commonQuery');

async function insertInternalError(request, code, message) {
  if (code !== enums.statusCode.INTERNAL_SERVER_ERROR) {
    return;
  }
  const url = request.originalUrl;
  const method = request.method;
  const data = {
    url,
    method,
    message,
  };
  return await commonQuery.insertRow('logerror', data);
}

module.exports = insertInternalError;
