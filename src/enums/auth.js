require('dotenv').config();

module.exports = {
  secretKey: process.env.JWT_SCECRET_KEY,
  salt: 10,
  expiredIn: '1h',
};
