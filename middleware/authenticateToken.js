const jwt = require('jsonwebtoken');

const auth = require('../constats/auth');

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, auth.secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
