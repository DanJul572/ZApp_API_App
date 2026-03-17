const nodeEnv = process.env.NODE_ENV || 'development';

const queueName = {
  sendEmail: `${nodeEnv}_send_email_queue`,
};
