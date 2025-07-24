const jwt = require('jsonwebtoken');

const enums = require('@enums');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, enums.auth.secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
