const enums = require('../enums');

function getErrorResponse(error) {
  const separatorIndex = error.indexOf(':');
  if (separatorIndex === -1) {
    return {
      message: error,
      code: enums.statusCode.INTERNAL_SERVER_ERROR,
    };
  }

  const code = error.substring(0, separatorIndex);
  const message = error.substring(separatorIndex + 1);

  return {
    message,
    code: parseInt(code),
  };
}

module.exports = getErrorResponse;
