function recordOpen() {
  return (
    'UPDATE "emailExecutions" SET "openCount" = "openCount" + 1, ' +
    '"openedAt" = COALESCE("openedAt", NOW()) WHERE "trackingId" = ?'
  );
}

// A click also counts as an open, for mail clients that block the tracking pixel.
function recordClick() {
  return (
    'WITH "execution" AS (' +
    'UPDATE "emailExecutions" SET "clickCount" = "clickCount" + 1, ' +
    '"clickedAt" = COALESCE("clickedAt", NOW()), "openedAt" = COALESCE("openedAt", NOW()) ' +
    'WHERE "trackingId" = ? RETURNING "id") ' +
    'INSERT INTO "emailClicks" ("emailExecutionId", "url", "createdAt") ' +
    'SELECT "id", ?, NOW() FROM "execution"'
  );
}

function getClicks() {
  return (
    'SELECT "url", count(*)::int AS "count", max("createdAt") AS "lastClickedAt" ' +
    'FROM "emailClicks" WHERE "emailExecutionId" = ? GROUP BY "url" ORDER BY "count" DESC, "url"'
  );
}

function getByTrackingId() {
  return (
    'SELECT "id", "emailId", "emailName", "to", "unsubscribedAt" FROM "emailExecutions" ' +
    'WHERE "trackingId" = ?'
  );
}

function setUnsubscribed() {
  return (
    'UPDATE "emailExecutions" SET "unsubscribedAt" = COALESCE("unsubscribedAt", NOW()) ' +
    'WHERE "id" = ?'
  );
}

function insertUnsubscribes(count) {
  return (
    'INSERT INTO "emailUnsubscribes" ("emailId", "address", "emailExecutionId", "createdAt", "updatedAt") ' +
    `VALUES ${Array.from({ length: count }, () => '(?, ?, ?, NOW(), NOW())').join(', ')} ` +
    'ON CONFLICT ("emailId", "address") DO NOTHING'
  );
}

function getUnsubscribedAddresses() {
  return 'SELECT "address" FROM "emailUnsubscribes" WHERE "emailId" = ?';
}

module.exports = {
  getByTrackingId,
  getClicks,
  getUnsubscribedAddresses,
  insertUnsubscribes,
  recordClick,
  recordOpen,
  setUnsubscribed,
};
