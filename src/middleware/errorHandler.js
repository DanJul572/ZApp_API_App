const {ValidationError} = require('express-validation');

const enums = require('@enums');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res
    .status(enums.statusCode.INTERNAL_SERVER_ERROR)
    .json({message: 'Internal server error', error: err});
}

module.exports = errorHandler;
