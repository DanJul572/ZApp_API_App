const enums = require('../../enums');
const helpers = require('../../helpers');

// Errors thrown as "<status>:<message>" are answered with that status; anything else goes to
// the error handler as a server error.
function respondError(err, res, next) {
  const error = helpers.getErrorResponse(err.message);

  if (error.code === enums.statusCode.INTERNAL_SERVER_ERROR) {
    return next(err);
  }

  return res.status(error.code).json({
    success: false,
    message: error.message,
  });
}

module.exports = respondError;
