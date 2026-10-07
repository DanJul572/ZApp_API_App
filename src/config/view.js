require('dotenv').config();

module.exports = {
  // Must match REACT_APP_ENCRYPTION_KEY of the web app, which decrypts view content.
  encryptionKey: process.env.VIEW_ENCRYPTION_KEY,
};
