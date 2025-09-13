const enums = require('../../enums');
const fieldBuilder = require('./fieldBuilder');

function getRows(table, fields, page, filter, sort, defaultFilter) {
  const offset = (page - 1) * enums.setting.rowsPerPage;
  const rowsValues = []; // Array untuk menyimpan nilai parameter

  // Format fields
  const fieldsFormat = fields.map(field => fieldBuilder.selectFormat(field, table)).join(',');

  // Initiation Query
  let rowsQuery = `SELECT ${fieldsFormat} FROM "${table}"`;

  // Combine default filters and filters provided
  const combinedFilters = [...(defaultFilter || []), ...(filter || [])];
  let whereClauses = [];
  if (combinedFilters.length) {
    const combinedWhere = combinedFilters
      .map(condition => {
        rowsValues.push(condition.value);
        return `"${condition.id}" = ?`;
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
    const orderBy = `"${sort[0].id}" ${ascdesc}`;
    rowsQuery += ` ORDER BY ${orderBy}`;
  }

  // Add pagination
  rowsValues.push(offset);
  rowsQuery += ` LIMIT ${enums.setting.rowsPerPage} OFFSET ?`;

  return {rowsQuery, rowsValues};
}

function getRowDetail(table, field) {
  return `SELECT * FROM "${table}" WHERE "${field}" = ?`;
}

function getRowsCount(table) {
  return `SELECT count(*) AS "count" FROM "${table}"`;
}

function deleteRow(table, field) {
  return `DELETE FROM "${table}" WHERE "${field}" = ?`;
}

function getOptions(table, value, label) {
  return `SELECT "${value}" AS "value", "${label}" AS "label" FROM "${table}"`;
}

function insertRow(table, data) {
  let fieldQuery = '';
  let valuePlaceholders = '';
  const values = [];

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      fieldQuery += `"${key}", `;
      valuePlaceholders += '?, ';
      values.push(data[key]);
    }
  }

  fieldQuery = fieldQuery.slice(0, -2);
  valuePlaceholders = valuePlaceholders.slice(0, -2);

  const query = `INSERT INTO "${table}" (${fieldQuery}) VALUES (${valuePlaceholders}) RETURNING *`;

  return {query, values};
}

function insertManyRows(table, data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array of objects');
  }

  const fields = Object.keys(data[0]);
  const fieldQuery = fields.map(f => `"${f}"`).join(', ');

  const values = [];
  const valuePlaceholders = data
    .map(row => {
      const placeholders = fields.map(() => '?');
      values.push(...fields.map(f => row[f]));
      return `(${placeholders.join(', ')})`;
    })
    .join(', ');

  const query = `INSERT INTO "${table}" (${fieldQuery}) VALUES ${valuePlaceholders}`;

  return {query, values};
}

function updateRow(table, newData, condition) {
  let query = `UPDATE "${table}" SET `;
  const values = [];

  for (const key in newData) {
    if (Object.hasOwnProperty.call(newData, key)) {
      query += `"${key}" = ?, `;
      values.push(newData[key]);
    }
  }

  query = query.slice(0, -2); // Remove trailing comma and space

  if (condition) {
    query += ' WHERE ';
    for (const key in condition) {
      if (Object.hasOwnProperty.call(condition, key)) {
        query += `"${key}" = ? AND `;
        values.push(condition[key]);
      }
    }
    query = query.slice(0, -5); // Remove trailing ' AND '
  }

  return {query, values};
}

function getMenu() {
  return `SELECT * FROM "menus" WHERE "roleId" = ?`;
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
