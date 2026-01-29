const enums = require('../../enums');

async function test(_req, res) {
  return res.status(enums.statusCode.OK).json({
    success: true,
    message: 'hello world!',
  });
}

module.exports = test;
