require('../config/loadEnv');
const jwt = require('jsonwebtoken');

function decodeToken(token) {
  return jwt.verify(token, process.env.ENCRYPTION_KEY);
}

module.exports = decodeToken;
