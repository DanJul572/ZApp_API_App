const { randomUUID } = require('crypto');
const dayjs = require('dayjs');

const db = require('../models');
const config = require('../config');
const enums = require('../enums');
const rabbitmq = require('../helpers/rabbitmq');
const emailBuilderService = require('./emailBuilderService');
const emailService = require('./emailService');
const emailExecutionQuery = require('../queries/emailExecutionQuery');

// Keeps one INSERT well below the PostgreSQL limit of 65535 bound values.
const INSERT_CHUNK_SIZE = 500;

const { onQueue, failed, success } = enums.emailExecutionStatus;

async function insertExecutions(executions) {
  const batchId = randomUUID();
  const now = dayjs().format(config.datetimeFormat.datetime.value);
  const rows = executions.map(execution => ({
    ...execution,
    batchId,
    createdAt: now,
    updatedAt: now,
  }));

  const inserted = await db.sequelize.transaction(async transaction => {
    const result = [];
    for (let index = 0; index < rows.length; index += INSERT_CHUNK_SIZE) {
      const chunk = rows.slice(index, index + INSERT_CHUNK_SIZE);
      result.push(...(await emailExecutionQuery.insertMany(chunk, transaction)));
    }
    return result;
  });

  return { batchId, inserted };
}

/**
 * Publishes one message per execution for the worker app. The rows are committed before this
 * runs, so the worker always finds them. When the broker cannot be reached the rows are marked
 * failed, so they can be retried from the email log.
 */
async function publish(executionIds) {
  if (!executionIds.length) return;

  try {
    await rabbitmq.sendToQueue(
      config.rabbitmq.queueName.sendEmail,
      executionIds.map(executionId => ({ executionId })),
    );
  } catch (err) {
    await emailExecutionQuery.setStatus(
      executionIds,
      failed,
      `Could not be queued: ${err.message}`,
    );
    throw new Error(
      `${enums.statusCode.SERVICE_UNAVAILABLE}:The emails were saved but could not be queued ` +
        `(${err.message}). Retry them from the email log.`,
      { cause: err },
    );
  }
}

async function getTemplate(emailId) {
  const email = await emailService.getEmailById(emailId);
  if (!email) {
    throw new Error(`${enums.statusCode.NOT_FOUND}:Email template not found`);
  }
  return await emailService.getEmailDetail(email);
}

/**
 * Builds the template into ready-to-send emails, stores them in "emailExecutions" and queues
 * them for the worker app.
 */
async function queueEmail(emailId, { trigger, testRecipient } = {}) {
  const template = await getTemplate(emailId);
  const executions = await emailBuilderService.buildExecutions(template, {
    trigger,
    testRecipient,
  });

  if (!executions.length) {
    throw new Error(
      `${enums.statusCode.BAD_REQUEST}:The primary source returned no rows, ` +
        'so there is no one to send this email to.',
    );
  }

  const { batchId, inserted } = await insertExecutions(executions);
  const queuedIds = inserted.filter(row => row.status === onQueue).map(row => row.id);

  await publish(queuedIds);

  return {
    batchId,
    total: inserted.length,
    queued: queuedIds.length,
    failed: inserted.length - queuedIds.length,
  };
}

/**
 * Records a send that could not even be built (for example a broken source query), so a
 * scheduled send that fails shows up in the email log.
 */
async function recordBuildFailure(emailId, trigger, message) {
  const email = await emailService.getEmailById(emailId);
  if (!email) return;
  const { settings } = await emailService.getEmailDetail(email);

  await insertExecutions([
    {
      emailId,
      emailName: email.name,
      trigger,
      priority: settings.priority,
      status: failed,
      errorMessage: message,
    },
  ]);
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

  await emailExecutionQuery.setStatus([execution.id], onQueue, null);
  await publish([execution.id]);
}

module.exports = {
  queueEmail,
  recordBuildFailure,
  retryExecution,
};
