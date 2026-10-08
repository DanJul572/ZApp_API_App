const db = require('../models');
const config = require('../config');
const enums = require('../enums');
const getNextRunAt = require('../helpers/getNextRunAt');
const emailQuery = require('../queries/emailQuery');
const emailSendService = require('../services/emailSendService');

const getSchedulerType = id =>
  Object.keys(enums.emailSchedulerType).find(key => enums.emailSchedulerType[key] === id);

/**
 * Queues every scheduled email whose next run time has come. The next run time is moved
 * forward before the email is built, so an occurrence is sent at most once even when building
 * fails; missed occurrences (the API was down) are skipped rather than sent in a burst.
 */
async function sendDueEmails() {
  let dueSchedulers;

  try {
    dueSchedulers = await db.sequelize.transaction(async transaction => {
      const schedulers = await emailQuery.getDueSchedulers(transaction);

      for (const scheduler of schedulers) {
        const type = getSchedulerType(scheduler.emailSchedulerTypeId);
        const nextRunAt = getNextRunAt(scheduler.startTime, type);
        await emailQuery.updateNextRunAt(scheduler.id, nextRunAt, transaction);
      }

      return schedulers;
    });
  } catch (err) {
    console.error('Email scheduler: failed to read the due schedules', err);
    return;
  }

  for (const scheduler of dueSchedulers) {
    try {
      const result = await emailSendService.queueEmail(scheduler.emailId, {
        trigger: enums.emailExecutionTrigger.scheduler,
      });
      console.log(
        `Email scheduler: email ${scheduler.emailId} queued ${result.queued} of ${result.total}`,
      );
    } catch (err) {
      const message = err.message.replace(/^\d{3}:/, '');
      console.error(`Email scheduler: email ${scheduler.emailId} failed: ${message}`);

      await emailSendService
        .recordBuildFailure(scheduler.emailId, enums.emailExecutionTrigger.scheduler, message)
        .catch(recordError => console.error('Email scheduler: failed to log', recordError));
    }
  }
}

// Checks every EMAIL_SCHEDULER_INTERVAL_SECONDS. Disabled unless EMAIL_SCHEDULER_ENABLED=true.
function start() {
  if (!config.emailScheduler.enabled) return;

  sendDueEmails();
  setInterval(sendDueEmails, config.emailScheduler.intervalSeconds * 1000).unref();
}

module.exports = {
  sendDueEmails,
  start,
};
