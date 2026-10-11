const db = require('../models');
const config = require('../config');
const emailTracking = require('../helpers/emailTracking');
const emailTrackingQuery = require('../queries/emailTrackingQuery');

const TRACKING_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Links from the public routes are checked first, so a mangled id is answered as unknown
// instead of failing the uuid column.
const isTrackingId = value => TRACKING_ID_PATTERN.test(value || '');

const toAddressList = value =>
  (value || '')
    .split(',')
    .map(address => address.trim().toLowerCase())
    .filter(Boolean);

async function recordOpen(trackingId) {
  if (!isTrackingId(trackingId)) return;
  await emailTrackingQuery.recordOpen(trackingId);
}

/** Returns false when the link was not made by the API, so it must not be redirected to. */
function isValidClick(trackingId, url, signature) {
  return emailTracking.isValidClick(config.emailTracking.secretKey, trackingId, url, signature);
}

async function recordClick(trackingId, url) {
  if (!isTrackingId(trackingId)) return;
  await emailTrackingQuery.recordClick(trackingId, url);
}

async function getClicks(executionId) {
  return await emailTrackingQuery.getClicks(executionId);
}

async function getExecution(trackingId) {
  if (!isTrackingId(trackingId)) return null;
  return await emailTrackingQuery.getByTrackingId(trackingId);
}

/**
 * Leaves the "To" addresses of a sent email out of the next sends of its template. Returns the
 * email, or null when the link is unknown.
 */
async function unsubscribe(trackingId) {
  if (!isTrackingId(trackingId)) return null;

  return await db.sequelize.transaction(async transaction => {
    const execution = await emailTrackingQuery.getByTrackingId(trackingId, transaction);
    if (!execution) return null;

    if (execution.emailId) {
      await emailTrackingQuery.insertUnsubscribes(
        execution.emailId,
        [...new Set(toAddressList(execution.to))],
        execution.id,
        transaction,
      );
    }
    await emailTrackingQuery.setUnsubscribed(execution.id, transaction);

    return execution;
  });
}

module.exports = {
  getClicks,
  getExecution,
  isValidClick,
  recordClick,
  recordOpen,
  unsubscribe,
};
