const dayjs = require('dayjs');

const db = require('../models');

const commonBuilder = require('../builders/commonBuilder');
const datetimeFormat = require('../constats/datetimeFormat');

async function getRows(
    moduleName,
    fields,
    page,
    advanceFilter,
    filter,
    sort,
    defaultFilter,
) {
    try {
        if (!sort || sort.length <= 0) {
            const primaryField = await fields.find(field => field.identity);
            sort = [
                {
                    id: primaryField.name,
                    desc: false,
                },
            ];
        }

        const countQuery = commonBuilder.getRowsCount(moduleName);
        const {rowsQuery, rowsValues} = commonBuilder.getRows(
            moduleName,
            fields,
            page,
            advanceFilter,
            filter,
            sort,
            defaultFilter,
        );

        const count = await db.sequelize
            .query(countQuery)
            .then(result => {
                return result.length > 0 ? parseInt(result[0][0].count) : 0;
            })
            .catch(error => {
                throw new Error(error.message);
            });

        const rows = await db.sequelize
            .query(rowsQuery, {
                bind: rowsValues,
                type: db.sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                return result.length > 0 ? result : [];
            })
            .catch(error => {
                throw new Error(error.message);
            });

        return {
            count: count,
            rows: rows,
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getRowDetail(tableName, rowId, primaryFieldName) {
    try {
        const query = commonBuilder.getRowDetail(tableName, primaryFieldName);

        return await db.sequelize
            .query(query, {
                bind: [rowId],
                type: db.sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                return result.length > 0 ? result[0] : null;
            })
            .catch(error => {
                throw new Error(error.message);
            });
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deleteRow(tableName, primaryFieldName, rowId) {
    try {
        const query = commonBuilder.deleteRow(
            tableName,
            primaryFieldName,
            rowId,
        );

        return await db.sequelize
            .query(query, {
                bind: [rowId],
                type: db.sequelize.QueryTypes.DELETE,
            })
            .then(() => {
                return 'Data has been deleted.';
            })
            .catch(error => {
                throw new Error(error.message);
            });
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getOptions(field) {
    try {
        const query = commonBuilder.getOptions(
            field.tableRef,
            field.tableRefKey,
            field.tableRefName,
        );
        return await db.sequelize
            .query(query)
            .then(result => {
                return result.length > 0 ? result[0] : null;
            })
            .catch(error => {
                throw new Error(error.message);
            });
    } catch (error) {
        throw new Error(error.message);
    }
}

async function insertRow(table, data) {
    try {
        data.createdAt = dayjs().format(datetimeFormat.datetime.value);
        data.updatedAt = dayjs().format(datetimeFormat.datetime.value);

        const {query, values} = commonBuilder.insertRow(table, data);

        return await db.sequelize
            .query(query, {
                bind: values,
                type: db.sequelize.QueryTypes.INSERT,
            })
            .then(() => {
                return 'Data has been created.';
            })
            .catch(error => {
                throw new Error(error.message);
            });
    } catch (error) {
        throw new Error(error.message);
    }
}

async function updateRow(primaryFieldName, rowId, data) {
    try {
        const condition = {
            [primaryFieldName]: rowId,
        };

        data.updatedAt = dayjs().format(datetimeFormat.datetime.value);

        const {query, values} = commonBuilder.updateRow(
            module.name,
            data,
            condition,
        );

        return await db.sequelize
            .query(query, {
                bind: values,
                type: db.sequelize.QueryTypes.UPDATE,
            })
            .then(() => {
                return 'Data has been updated.';
            })
            .catch(error => {
                throw new Error(error.message);
            });
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getMenu(roleId) {
    try {
        const query = commonBuilder.getMenu();

        return await db.sequelize
            .query(query, {
                bind: [roleId],
                type: db.sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                return result.length > 0 ? result[0] : null;
            })
            .catch(error => {
                throw new Error(error.message);
            });
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getRows,
    getRowDetail,
    deleteRow,
    getOptions,
    insertRow,
    updateRow,
    getMenu,
};
