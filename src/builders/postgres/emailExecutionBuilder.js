const tableConfig = require('../../config/table');

const insertFields = [
  'batchId',
  'emailId',
  'emailName',
  'trigger',
  'to',
  'cc',
  'bcc',
  'subject',
  'body',
  'priority',
  'trackingId',
  'headers',
  'status',
  'errorMessage',
  'createdAt',
  'updatedAt',
];

const listFields =
  '"id", "batchId", "emailId", "emailName", "trigger", "to", "subject", "priority", "status", ' +
  '"errorMessage", "attempts", "sentAt", "createdAt", "updatedAt"';

function insertMany(rows) {
  const fieldQuery = insertFields.map(field => `"${field}"`).join(', ');
  const placeholders = `(${insertFields.map(() => '?').join(', ')})`;
  const values = rows.flatMap(row => insertFields.map(field => row[field] ?? null));

  const query =
    `INSERT INTO "emailExecutions" (${fieldQuery}) ` +
    `VALUES ${rows.map(() => placeholders).join(', ')} RETURNING "id", "status"`;

  return { query, values };
}

function getWhere(filter) {
  const clauses = [];
  const values = [];

  if (filter.status) {
    clauses.push('"status" = ?');
    values.push(filter.status);
  }
  if (filter.emailId) {
    clauses.push('"emailId" = ?');
    values.push(filter.emailId);
  }
  if (filter.search) {
    const keyword = `%${filter.search}%`;
    clauses.push('("emailName" ILIKE ? OR "to" ILIKE ? OR "subject" ILIKE ?)');
    values.push(keyword, keyword, keyword);
  }

  return {
    where: clauses.length ? ` WHERE ${clauses.join(' AND ')}` : '',
    values,
  };
}

function getRows(page, filter) {
  const offset = (page - 1) * tableConfig.rowsPerPage;
  const { where, values } = getWhere(filter);

  return {
    query:
      `SELECT ${listFields} FROM "emailExecutions"${where} ORDER BY "id" DESC ` +
      `LIMIT ${tableConfig.rowsPerPage} OFFSET ?`,
    values: [...values, offset],
  };
}

// Count per status for the status tabs. The status filter itself is left out so every tab
// keeps its number.
function countByStatus(filter) {
  const { where, values } = getWhere({ ...filter, status: null });

  return {
    query: `SELECT "status", count(*) AS "count" FROM "emailExecutions"${where} GROUP BY "status"`,
    values,
  };
}

function getById() {
  return 'SELECT * FROM "emailExecutions" WHERE "id" = ?';
}

function setStatus(ids) {
  return (
    'UPDATE "emailExecutions" SET "status" = ?, "errorMessage" = ?, "updatedAt" = NOW() ' +
    `WHERE "id" IN (${ids.map(() => '?').join(', ')})`
  );
}

module.exports = {
  countByStatus,
  getById,
  getRows,
  insertMany,
  setStatus,
};
