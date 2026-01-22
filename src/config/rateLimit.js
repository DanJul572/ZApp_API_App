const rateLimit = require("express-rate-limit");

const rateLimitConfig = rateLimit({
  windowMs: 5 * 1000,
  max: 1,          
  message: {
    status: false,
    message: "To many request, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimitConfig;
