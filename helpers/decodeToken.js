const jwt = require('jsonwebtoken');

function decodeToken(token) {
  return jwt.verify(token, process.env.JWT_SCECRET_KEY);
}

module.exports = decodeToken;
