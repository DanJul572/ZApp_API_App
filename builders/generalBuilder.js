const {rowsPerPage} = require('../constats/setting');

module.exports = {
    getRows(table, fields, page, filter, order) {
        const offset = (page - 1) * rowsPerPage;

        let rowsQuery = `SELECT ${fields} FROM "${table}"`;

        if (filter && filter.length) {
            const where = `"${filter.field}" ILIKE '%${filter.value}%'`;
            rowsQuery += ` WHERE ${where}`;
        }

        if (order && filter.length) {
            const orderBy = `"${order.field}" ${order.value}`;
            rowsQuery += ` ORDER BY ${orderBy}`;
        }

        rowsQuery += ` LIMIT ${rowsPerPage} OFFSET ${offset}`;

        return rowsQuery;
    },

    getRowDetail(table, field, id) {
        return `SELECT * FROM "${table}" WHERE "${field}" = ${id}`;
    },

    getRowsCount(table) {
        return `SELECT count(*) AS "count" FROM "${table}"`;
    },

    deleteRow(table, field, id) {
        return `DELETE FROM "${table}" WHERE "${field}" = ${id}`;
    },

    getOptions(table, value, label) {
        return `SELECT "${value}" AS "value", "${label}" AS "label" FROM "${table}"`;
    },

    insertRows(table, data) {
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
    },
};
