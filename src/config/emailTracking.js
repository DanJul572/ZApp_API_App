require('./loadEnv');

const nodeEnv = process.env.NODE_ENV || 'development';

// A development machine falls back to the local API, so tracking works with a local mail
// server (Mailpit, MailHog) without extra settings.
const developmentUrl = `http://localhost:${process.env.PORT || 8080}/api`;

module.exports = {
  // The API's "/api" address as the recipients' mail clients reach it. The tracking pixel,
  // tracked links and unsubscribe links point here.
  publicUrl: (process.env.EMAIL_PUBLIC_URL || (nodeEnv === 'development' ? developmentUrl : ''))
    .trim()
    .replace(/\/+$/, ''),
  // Signs tracked links, so the click endpoint only redirects to links that are in an email.
  secretKey: process.env.ENCRYPTION_KEY,
};
