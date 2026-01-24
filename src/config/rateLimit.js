const rateLimit = require('express-rate-limit');

const rateLimitConfig = rateLimit({
  windowMs: 1 * 1000,
  max: 2,
  message: {
    status: false,
    message: 'To many request, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimitConfig;
