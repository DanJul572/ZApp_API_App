const nodeEnv = process.env.NODE_ENV || 'development';

// The email sender app consumes the same queue names, built from its own NODE_ENV.
const queueName = {
  emailRequest: process.env.EMAIL_REQUEST_QUEUE_NAME || `${nodeEnv}_email_request_queue`,
};

module.exports = {
  queueName,
};
