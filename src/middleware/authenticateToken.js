const jwt = require('jsonwebtoken');
const enums = require('../enums');
const jwtConfig = require('../config/jwt');

function authenticateToken(req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.sendStatus(enums.statusCode.UNAUTHORIZED);
  }

  jwt.verify(token, jwtConfig.secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(enums.statusCode.FORBIDDEN);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
