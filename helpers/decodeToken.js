const jwt = require('jsonwebtoken');

const auth = require('../constats/auth');

async function decodeToken(token) {
  return jwt.verify(token, auth.secretKey);
}

module.exports = decodeToken;
