const cors = require('cors');

const corsConfig = cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
});

module.exports = corsConfig;
