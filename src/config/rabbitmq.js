const nodeEnv = process.env.NODE_ENV || 'development';

// The worker app consumes the same queue names, built from its own NODE_ENV.
const queueName = {
  sendEmail: process.env.EMAIL_QUEUE_NAME || `${nodeEnv}_send_email_queue`,
};

module.exports = {
  queueName,
};
