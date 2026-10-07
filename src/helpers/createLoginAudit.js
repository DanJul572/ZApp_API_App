const commonQuery = require('../queries/commonQuery');

const getRequestInfo = require('./getRequestInfo');

// Never throws: a failed audit write must not block a login or logout.
async function createLoginAudit(req, { action, email = null, userId = null, reason = null }) {
  try {
    const { ipAddress, userAgent } = getRequestInfo(req);

    await commonQuery.insertRow('auditLogins', {
      userId,
      email,
      action,
      reason,
      ipAddress,
      userAgent,
    });
  } catch (err) {
    console.error('Failed to write login audit to DB', err);
  }
}

module.exports = createLoginAudit;
