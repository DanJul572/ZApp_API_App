const {rowsPerPage} = require('../constats/setting');

function getRows(table, fields, page, filter, sort) {
    const offset = (page - 1) * rowsPerPage;

    let rowsQuery = `SELECT ${fields} FROM "${table}"`;

    if (filter && filter.length) {
        const where = `${filter.map(condition => `"${condition.id}" ILIKE '%${condition.value}%'`).join(' AND ')}`;
        rowsQuery += ` WHERE ${where}`;
    }

    if (sort && sort.length) {
        const ascdesc = sort[0].desc ? 'DESC' : 'ASC';
        const orderBy = `"${sort[0].id}" ${ascdesc}`;
        rowsQuery += ` ORDER BY ${orderBy}`;
    }

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
