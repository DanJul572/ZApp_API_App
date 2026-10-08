const tableConfig = require('../../config/table');

function getSearchClause(search) {
  if (!search) return { where: '', values: [] };

  const keyword = `%${search}%`;
  return {
    where: ' WHERE "name" ILIKE ? OR "subject" ILIKE ? OR "to" ILIKE ?',
    values: [keyword, keyword, keyword],
  };
}

function getRows(page, search) {
  const offset = (page - 1) * tableConfig.rowsPerPage;
  const { where, values } = getSearchClause(search);

  const rowsQuery =
    'SELECT "id", "name", "description", "to", "subject", "useScheduler", "createdAt", "updatedAt" ' +
    `FROM "emails"${where} ORDER BY "updatedAt" DESC, "id" DESC ` +
    `LIMIT ${tableConfig.rowsPerPage} OFFSET ?`;

  return { rowsQuery, rowsValues: [...values, offset] };
}

function getRowsCount(search) {
  const { where, values } = getSearchClause(search);

  return {
    countQuery: `SELECT count(*) AS "count" FROM "emails"${where}`,
    countValues: values,
  };
}

function getByEmailId(table) {
  return `SELECT * FROM "${table}" WHERE "emailId" = ? ORDER BY "id"`;
}

function getAttachments() {
  return (
    'SELECT "id", "fileName", "mimeType", "fileSize" FROM "emailAttachments" ' +
    'WHERE "emailId" = ? ORDER BY "id"'
  );
}

function getAttachment() {
  return 'SELECT "id", "fileName", "mimeType", "fileBuffer" FROM "emailAttachments" WHERE "id" = ?';
}

function deleteAttachments(keepIds) {
  if (!keepIds.length) {
    return 'DELETE FROM "emailAttachments" WHERE "emailId" = ?';
  }

  const placeholders = keepIds.map(() => '?').join(', ');
  return `DELETE FROM "emailAttachments" WHERE "emailId" = ? AND "id" NOT IN (${placeholders})`;
}

// Locks the due schedules, so two API instances never send the same occurrence.
function getDueSchedulers() {
  return (
    'SELECT s."id", s."emailId", s."emailSchedulerTypeId", s."startTime", s."endTime", ' +
    's."nextRunAt" ' +
    'FROM "emailSchedulers" s JOIN "emails" e ON e."id" = s."emailId" ' +
    'WHERE e."useScheduler" = true AND s."nextRunAt" IS NOT NULL ' +
    'AND s."nextRunAt" <= NOW() AND s."nextRunAt" <= s."endTime" ' +
    'ORDER BY s."nextRunAt" FOR UPDATE OF s SKIP LOCKED'
  );
}

function updateNextRunAt() {
  return 'UPDATE "emailSchedulers" SET "nextRunAt" = ?, "updatedAt" = NOW() WHERE "id" = ?';
}

module.exports = {
  deleteAttachments,
  getDueSchedulers,
  updateNextRunAt,
  getAttachment,
  getAttachments,
  getByEmailId,
  getRows,
  getRowsCount,
};
