const {ValidationError} = require('express-validation');

const enums = require('../enums');

function errorHandler(err, _req, res, _next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: 'Validation error',
      errors: err.details,
    });
  }

  return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
}

module.exports = errorHandler;
