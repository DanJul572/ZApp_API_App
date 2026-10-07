const enums = require('../../enums');
const helpers = require('../../helpers');

async function logout(req, res) {
  await helpers.createLoginAudit(req, {
    action: enums.auditAction.logout,
    email: req.user?.email,
    userId: req.user?.userId,
  });

  res.clearCookie('access_token');
  return res.status(enums.statusCode.OK).json({
    success: true,
    message: 'You have successfully logged out',
  });
}

module.exports = logout;
