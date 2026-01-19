const enums = require('../../enums');

async function test(_req, res) {
  res.status(enums.statusCode.OK).send({
    success: true,
    message: 'hello world!',
  });
}

module.exports = test;
