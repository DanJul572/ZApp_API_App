const { randomUUID } = require('crypto');

const config = require('../config');
const enums = require('../enums');
const rabbitmq = require('../helpers/rabbitmq');
const commonQuery = require('../queries/commonQuery');
const emailService = require('./emailService');
const emailExecutionQuery = require('../queries/emailExecutionQuery');

const { success } = enums.emailExecutionStatus;

/**
 * Tells the email sender app there is work to do. The row is saved before this runs, so when
 * the broker cannot be reached the email sender app still finds it on its next sweep and the
 * caller is not failed.
 */
async function notifyEmailSender(message) {
  try {
    await rabbitmq.sendToQueue(config.rabbitmq.queueName.emailRequest, message);
  } catch (err) {
    console.error(
      `Email: could not notify the email sender app (${err.message}); it picks the row up on its next sweep`,
    );
  }
}

/**
 * Saves a send request; the email sender app builds its emails into "emailExecutions" and
 * sends them.
 * Problems with the template (a broken source query, an unknown merge tag, no recipient) are
 * found there and shown in the email log.
 */
async function requestSend(emailId, { trigger, testRecipient } = {}) {
  const email = await emailService.getEmailById(emailId);
  if (!email) {
    throw new Error(`${enums.statusCode.NOT_FOUND}:Email template not found`);
  }

  const sendRequest = await commonQuery.insertRow('emailSendRequests', {
    id: randomUUID(),
    emailId,
    trigger,
    testRecipient: testRecipient || null,
    status: enums.emailSendRequestStatus.pending,
  });

  await notifyEmailSender({
    type: enums.emailRequestMessageType.build,
    requestId: sendRequest.id,
  });

  return { requestId: sendRequest.id };
}

async function retryExecution(id) {
  const execution = await emailExecutionQuery.getById(id);
  if (!execution) {
    throw new Error(`${enums.statusCode.NOT_FOUND}:Email log not found`);
  }
  if (execution.status === success) {
    throw new Error(`${enums.statusCode.BAD_REQUEST}:This email has already been sent`);
  }
  if (!execution.to) {
    throw new Error(
      `${enums.statusCode.BAD_REQUEST}:This email has no recipient. Fix the template and send it again.`,
    );
  }

  await emailExecutionQuery.requeue(execution.id);
  await notifyEmailSender({
    type: enums.emailRequestMessageType.publish,
    executionId: execution.id,
  });
}

module.exports = {
  requestSend,
  retryExecution,
};
