const {rowsPerPage} = require('../constats/setting');
const fieldBuilder = require('./fieldBuilder');
const jsonToWhereClause = require('../helpers/jsonToWhereClause');

function getRows(table, fields, page, advanceFilter, filter, sort, defaultFilter) {
    const offset = (page - 1) * rowsPerPage;

    // Format fields
    const fieldsFormat = fields.map(field => fieldBuilder.selectFormat(field, table)).join(',');

    // Initiation Query
    let rowsQuery = `SELECT ${fieldsFormat} FROM "${table}"`;

    // Generate the advance filter clause
    const advanceFilterFormat = jsonToWhereClause(advanceFilter);

    // Combine default filters and filters provided
    const combinedFilters = [...(defaultFilter || []), ...(filter || [])];
    let whereClauses = [];

    if (combinedFilters.length) {
        const combinedWhere = combinedFilters.map(condition => `"${condition.id}" = '${condition.value}'`).join(' AND ');
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
    rowsQuery += ` LIMIT ${rowsPerPage} OFFSET ${offset}`;

    return rowsQuery;
}

function getRowDetail(table, field, id) {
    return `SELECT * FROM "${table}" WHERE "${field}" = ${id}`;
}

function getRowsCount(table) {
    return `SELECT count(*) AS "count" FROM "${table}"`;
}

function deleteRow(table, field, id) {
    return `DELETE FROM "${table}" WHERE "${field}" = ${id}`;
}

function getOptions(table, value, label) {
    return `SELECT "${value}" AS "value", "${label}" AS "label" FROM "${table}"`;
}

function insertRow(table, data) {
    let fieldQuery = '';
    let valueQuery = '';

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            fieldQuery += `"${key}", `;
            const value = typeof data[key] === 'string' ? `'${data[key]}'` : data[key];
            valueQuery += `${value}, `;
        }
    }

    fieldQuery = fieldQuery.slice(0, -2);
    valueQuery = valueQuery.slice(0, -2);

    return `INSERT INTO "${table}" (${fieldQuery}) VALUES (${valueQuery})`;
}

function updateRow(table, newData, condition) {
    let updateQuery = `UPDATE "${table}" SET `;

    for (const key in newData) {
        if (Object.hasOwnProperty.call(newData, key)) {
            const value = typeof newData[key] === 'string' ? `'${newData[key]}'` : newData[key];
            updateQuery += `"${key}" = ${value}, `;
        }
    }

    updateQuery = updateQuery.slice(0, -2);

    if (condition) {
        updateQuery += ' WHERE ';
        for (const key in condition) {
            if (Object.hasOwnProperty.call(condition, key)) {
                const value = typeof condition[key] === 'string' ? `'${condition[key]}'` : condition[key];
                updateQuery += `"${key}" = ${value} AND `;
            }
        }
        updateQuery = updateQuery.slice(0, -5);
    }

    return updateQuery;
}

function getMenu(roleId) {
    return `SELECT * FROM "Menus" WHERE "roleId" = ${roleId}`;
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
