require('dotenv').config();

module.exports = {
  secretKey: process.env.ENCRYPTION_KEY,
  salt: 10,
  expiredIn: '1h',
};
