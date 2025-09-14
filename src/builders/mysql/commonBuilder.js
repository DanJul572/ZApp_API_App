const tableConfig = require('../../config/table');

const fieldBuilder = require('./fieldBuilder');

function getRows(table, fields, page, filter, sort, defaultFilter) {
  const offset = (page - 1) * tableConfig.rowsPerPage;
  const rowsValues = [];

  // Format fields
  const fieldsFormat = fields.map(field => fieldBuilder.selectFormat(field, table)).join(',');

  // Initiation Query
  let rowsQuery = `SELECT ${fieldsFormat} FROM \`${table}\``;

  // Combine default filters and filters provided
  const combinedFilters = [...(defaultFilter || []), ...(filter || [])];
  let whereClauses = [];
  if (combinedFilters.length) {
    const combinedWhere = combinedFilters
      .map(condition => {
        rowsValues.push(condition.value);
        return `\`${condition.id}\` = ?`;
      })
      .join(' AND ');
    whereClauses.push(combinedWhere);
  }

  if (whereClauses.length) {
    rowsQuery += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  // Add sorting if provided
  if (sort && sort.length) {
    const ascdesc = sort[0].desc ? 'DESC' : 'ASC';
    const orderBy = `\`${sort[0].id}\` ${ascdesc}`;
    rowsQuery += ` ORDER BY ${orderBy}`;
  }

  // Add pagination
  rowsQuery += ` LIMIT ${tableConfig.rowsPerPage} OFFSET ?`;
  rowsValues.push(offset);

  return {rowsQuery, rowsValues};
}

function getRowDetail(table, field) {
  return {
    query: `SELECT * FROM \`${table}\` WHERE \`${field}\` = ?`,
  };
}

function getRowsCount(table) {
  return {
    query: `SELECT count(*) AS count FROM \`${table}\``,
  };
}

function deleteRow(table, field) {
  return {
    query: `DELETE FROM \`${table}\` WHERE \`${field}\` = ?`,
  };
}

function getOptions(table, value, label) {
  return {
    query: `SELECT \`${value}\` AS \`value\`, \`${label}\` AS \`label\` FROM \`${table}\``,
  };
}

function insertRow(table, data) {
  const fields = Object.keys(data);
  const fieldQuery = fields.map(f => `\`${f}\``).join(', ');
  const valuePlaceholders = fields.map(() => '?').join(', ');
  const values = fields.map(f => data[f]);

  const query = `INSERT INTO \`${table}\` (${fieldQuery}) VALUES (${valuePlaceholders})`;

  return {query, values};
}

function insertManyRows(table, data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array of objects');
  }

  const fields = Object.keys(data[0]);
  const fieldQuery = fields.map(f => `\`${f}\``).join(', ');

  const values = [];
  const valuePlaceholders = data
    .map(row => {
      const placeholders = fields.map(() => '?');
      values.push(...fields.map(f => row[f]));
      return `(${placeholders.join(', ')})`;
    })
    .join(', ');

  const query = `INSERT INTO \`${table}\` (${fieldQuery}) VALUES ${valuePlaceholders}`;

  return {query, values};
}

function updateRow(table, newData, condition) {
  let query = `UPDATE \`${table}\` SET `;
  const values = [];

  const setClauses = [];
  for (const key in newData) {
    if (Object.hasOwnProperty.call(newData, key)) {
      setClauses.push(`\`${key}\` = ?`);
      values.push(newData[key]);
    }
  }
  query += setClauses.join(', ');

  if (condition && Object.keys(condition).length > 0) {
    const whereClauses = [];
    for (const key in condition) {
      if (Object.hasOwnProperty.call(condition, key)) {
        whereClauses.push(`\`${key}\` = ?`);
        values.push(condition[key]);
      }
    }
    query += ' WHERE ' + whereClauses.join(' AND ');
  }

  return {query, values};
}

function getMenu() {
  return {
    query: 'SELECT * FROM `menus` WHERE `roleId` = ?',
  };
}

module.exports = {
  deleteRow,
  getMenu,
  getOptions,
  getRowDetail,
  getRows,
  getRowsCount,
  insertManyRows,
  insertRow,
  updateRow,
};
