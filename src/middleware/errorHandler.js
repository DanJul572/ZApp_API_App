const { ValidationError } = require('express-validation');

const enums = require('../enums');

function errorHandler(err, _req, res) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: err.details,
    });
  }

  return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
  });
}

module.exports = errorHandler;
