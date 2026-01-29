const enums = require('../../enums');

async function notFound(_req, res) {
  return res.status(enums.statusCode.NOT_FOUND).json({
    success: false,
    message: 'Endpoint not found',
  });
}

module.exports = notFound;
