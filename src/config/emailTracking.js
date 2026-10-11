require('./loadEnv');

module.exports = {
  // Signs tracked links, so the click endpoint only redirects to links that are in an email.
  // The worker app signs them with the same key.
  secretKey: process.env.ENCRYPTION_KEY,
};
