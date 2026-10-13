const tableConfig = require('../../config/table');

const listFields =
  '"id", "batchId", "emailId", "emailName", "trigger", "to", "subject", "priority", "status", ' +
  '"errorMessage", "attempts", "sentAt", "createdAt", "updatedAt"';

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

// Puts a row back on queue; the email sender app sends it again.
function requeue() {
  return (
    'UPDATE "emailExecutions" SET "status" = \'onQueue\', "errorMessage" = NULL, ' +
    '"publishedAt" = NULL, "updatedAt" = NOW() WHERE "id" = ?'
  );
}

module.exports = {
  countByStatus,
  getById,
  getRows,
  requeue,
};
