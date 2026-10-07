const config = require('../config');
const logQuery = require('../queries/logQuery');

const HOUR_IN_MS = 60 * 60 * 1000;

async function purgeExpiredLogs() {
  for (const [table, days] of Object.entries(config.logRetention.days)) {
    if (!days) continue;

    try {
      const deleted = await logQuery.deleteExpired(table, days);
      if (deleted) {
        console.log(
          `Log retention: deleted ${deleted} row(s) older than ${days} day(s) from ${table}`,
        );
      }
    } catch (err) {
      console.error(`Log retention: failed to clean up ${table}`, err);
    }
  }
}

// Runs once on startup, then every LOG_RETENTION_INTERVAL_HOURS. Disabled unless
// LOG_RETENTION_ENABLED=true.
function start() {
  if (!config.logRetention.enabled) return;

  purgeExpiredLogs();
  setInterval(purgeExpiredLogs, config.logRetention.intervalHours * HOUR_IN_MS).unref();
}

module.exports = {
  purgeExpiredLogs,
  start,
};
