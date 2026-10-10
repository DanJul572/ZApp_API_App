const db = require('../models');
const { emailTrackingBuilder } = require('../builders');

async function run(query, replacements, type, transaction) {
  try {
    return await db.sequelize.query(query, { replacements, transaction, type });
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
}

const { QueryTypes } = db.sequelize;

module.exports = {
  async recordOpen(trackingId) {
    await run(emailTrackingBuilder.recordOpen(), [trackingId], QueryTypes.UPDATE);
  },

  async recordClick(trackingId, url) {
    await run(emailTrackingBuilder.recordClick(), [trackingId, url], QueryTypes.INSERT);
  },

  async getClicks(executionId) {
    return await run(emailTrackingBuilder.getClicks(), [executionId], QueryTypes.SELECT);
  },

  async getByTrackingId(trackingId, transaction) {
    const rows = await run(
      emailTrackingBuilder.getByTrackingId(),
      [trackingId],
      QueryTypes.SELECT,
      transaction,
    );
    return rows.length > 0 ? rows[0] : null;
  },

  async setUnsubscribed(executionId, transaction) {
    await run(
      emailTrackingBuilder.setUnsubscribed(),
      [executionId],
      QueryTypes.UPDATE,
      transaction,
    );
  },

  async insertUnsubscribes(emailId, addresses, executionId, transaction) {
    if (!addresses.length) return;

    await run(
      emailTrackingBuilder.insertUnsubscribes(addresses.length),
      addresses.flatMap(address => [emailId, address, executionId]),
      QueryTypes.INSERT,
      transaction,
    );
  },

  async getUnsubscribedAddresses(emailId) {
    const rows = await run(
      emailTrackingBuilder.getUnsubscribedAddresses(),
      [emailId],
      QueryTypes.SELECT,
    );
    return new Set(rows.map(row => row.address));
  },
};
