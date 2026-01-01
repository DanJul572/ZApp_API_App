const jwt = require('jsonwebtoken');
const enums = require('../enums');
const jwtConfig = require('../config/jwt');

function authenticateToken(req, res, next) {
  const apiKey = req.header('X-API-Key');
  if (apiKey && apiKey === process.env.REPORT_API_KEY) {
    return next();
  }

  let token = req.header('Authorization');

  if (!token && req.query && req.query.token) {
    token = req.query.token;
  }

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
