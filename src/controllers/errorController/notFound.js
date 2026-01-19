const enums = require('../../enums');

async function notFound(_req, res) {
  res.status(enums.statusCode.NOT_FOUND).send({
    success: false,
    message: 'endpoint not found',
  });
}

module.exports = notFound;
