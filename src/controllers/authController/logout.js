const enums = require('../../enums');

function logout(_req, res) {
  res.clearCookie('access_token');
  return res.status(enums.statusCode.OK).json({
    success: true,
    message: 'You have successfully logged out',
  });
}

module.exports = logout;
