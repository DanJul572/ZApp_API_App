const { ValidationError } = require('express-validation');

const enums = require('../enums');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      data: err.details,
      message: err.message,
      statusCode: err.statusCode,
      success: false,
    });
  }

  return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).json({
    message: 'An unexpected error occurred. Please try again later.',
    statusCode: enums.statusCode.INTERNAL_SERVER_ERROR,
    success: false,
  });
}

module.exports = errorHandler;
