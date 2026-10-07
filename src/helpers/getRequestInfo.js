const decodeToken = require('./decodeToken');

// req.user is only set on routes behind authenticateToken, so fall back to the cookie.
function getRequestUser(req) {
  if (req.user) return req.user;

  const token = req.cookies?.access_token;
  if (!token) return null;

  try {
    return decodeToken(token);
  } catch {
    return null;
  }
}

function getRequestInfo(req) {
  const user = getRequestUser(req);

  return {
    userId: user?.userId ?? null,
    userName: user?.userName ?? null,
    ipAddress: req.ip ?? null,
    userAgent: req.get?.('user-agent') ?? null,
  };
}

module.exports = getRequestInfo;
