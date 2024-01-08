const {rowsPerPage} = require('../constats/setting');

module.exports = {
    getRows(name, fields, page, filter, order) {
        const offset = (page - 1) * rowsPerPage;

        let rowsQuery = `SELECT ${fields} FROM "${name}"`;

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

    getRowDetail(name, field, id) {
        return `SELECT * FROM "${name}" WHERE "${field}" = ${id}`;
    },

    getRowsCount(name) {
        return `SELECT count(*) AS "count" FROM "${name}"`;
    },
};
