const {rowsPerPage} = require('../constats/setting');
const fieldBuilder = require('./fieldBuilder');
const helpers = require('../helpers');

function getRows(table, fields, page, advanceFilter, filter, sort, defaultFilter) {
  const offset = (page - 1) * rowsPerPage;
  const rowsValues = []; // Array untuk menyimpan nilai parameter

  // Format fields
  const fieldsFormat = fields.map(field => fieldBuilder.selectFormat(field, table)).join(',');

  // Initiation Query
  let rowsQuery = `SELECT ${fieldsFormat} FROM "${table}"`;

  // Generate the advance filter clause
  const advanceFilterFormat = helpers.jsonToWhereClause(advanceFilter);

  // Combine default filters and filters provided
  const combinedFilters = [...(defaultFilter || []), ...(filter || [])];
  let whereClauses = [];
  if (combinedFilters.length) {
    const combinedWhere = combinedFilters
      .map(condition => {
        rowsValues.push(condition.value);
        return `"${condition.id}" = $${rowsValues.length}`;
      })
      .join(' AND ');
    whereClauses.push(combinedWhere);
  }

  // Add the advance filter format to where clauses if it exists
  if (advanceFilterFormat) {
    whereClauses.push(advanceFilterFormat);
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
  rowsQuery += ` LIMIT ${rowsPerPage} OFFSET $${rowsValues.length}`;

  return {rowsQuery, rowsValues};
}

function getRowDetail(table, field) {
  return `SELECT * FROM "${table}" WHERE "${field}" = $1`;
}

function getRowsCount(table) {
  return `SELECT count(*) AS "count" FROM "${table}"`;
}

function deleteRow(table, field) {
  return `DELETE FROM "${table}" WHERE "${field}" = $1`;
}

function getOptions(table, value, label) {
  return `SELECT "${value}" AS "value", "${label}" AS "label" FROM "${table}"`;
}

function insertRow(table, data) {
  let fieldQuery = '';
  let valuePlaceholders = '';
  const values = [];

  let index = 1; // Index for parameterized values
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      fieldQuery += `"${key}", `;
      valuePlaceholders += `$${index}, `;
      values.push(data[key]);
      index++;
    }
  }

  fieldQuery = fieldQuery.slice(0, -2);
  valuePlaceholders = valuePlaceholders.slice(0, -2);

  const query = `INSERT INTO "${table}" (${fieldQuery}) VALUES (${valuePlaceholders})`;

  return {query, values};
}

function updateRow(table, newData, condition) {
  let query = `UPDATE "${table}" SET `;
  const values = [];
  let index = 1; // Index for parameterized values

  for (const key in newData) {
    if (Object.hasOwnProperty.call(newData, key)) {
      query += `"${key}" = $${index}, `;
      values.push(newData[key]);
      index++;
    }
  }

  query = query.slice(0, -2); // Remove trailing comma and space

  if (condition) {
    query += ' WHERE ';
    for (const key in condition) {
      if (Object.hasOwnProperty.call(condition, key)) {
        query += `"${key}" = $${index} AND `;
        values.push(condition[key]);
        index++;
      }
    }
    query = query.slice(0, -5); // Remove trailing ' AND '
  }

  return {query, values};
}

function getMenu() {
  return `SELECT * FROM "Menus" WHERE "roleId" = $1`;
}

module.exports = {
  getRows,
  getRowDetail,
  getRowsCount,
  deleteRow,
  getOptions,
  insertRow,
  updateRow,
  getMenu,
};
