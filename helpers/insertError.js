const moduleId = require('../constats/moduleId');
const commonQuery = require('../queries/commonQuery');

function insertError(req, code, message) {
    if (code !== 500) {
        return;
    }

    const url = req.originalUrl;
    const method = req.method;
    const data = {
        url,
        method,
        message
    };
    return commonQuery.insertRow(moduleId.logError, data);
};

module.exports = insertError;