const dayjs = require('dayjs');

const db = require('../models');

const fieldQuery = require('./fieldQuery');
const fileQuery = require('./fileQuery');
const moduleQuery = require('./moduleQuery');
const validationQuery = require('./validationQuery');

const commonBuilder = require('../builders/commonBuilder');

const actionId = require('../constats/actionId');
const datetimeFormat = require('../constats/datetimeFormat');
const validationTimeId = require('../constats/validationTimeId');

async function getRows(moduleId, page, advanceFilter, filter, order, defaultFilter) {
    try {
        const module = await moduleQuery.getModule(moduleId);
        const fields = await fieldQuery.getFields(moduleId);
        const countQuery = commonBuilder.getRowsCount(module.name);

        // default sorting
        if (!order || order.length <= 0) {
            const primaryField = await fieldQuery.getPrimaryField(moduleId);
            order = [
                {
                    id: primaryField.name,
                    desc: false,
                },
            ];
        }

        const {rowsQuery, rowsValues} = commonBuilder.getRows(
            module.name,
            fields,
            page,
            advanceFilter,
            filter,
            order,
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

async function getColumns(id) {
    try {
        let fields = await fieldQuery.getFields(id);
        let columns = fields.map(field => {
            return {
                accessorKey: field.name,
                header: field.label,
                size: 100,
                minSize: 100,
                maxSize: 200,
                type: field.inputType,
                identity: field.identity,
            };
        });
        return columns;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getRowDetail(
    moduleId,
    rowId,
    user = null,
    options = {
        withValidation: true,
    },
) {
    try {
        const data = {
            rowId: rowId,
            moduleId: moduleId,
        };

        if (options.withValidation) {
            await validationQuery.runValidation(data, moduleId, actionId.detail, validationTimeId.before, user);
        }

        const module = await moduleQuery.getModule(moduleId);
        const primaryField = await fieldQuery.getPrimaryField(moduleId);
        const query = commonBuilder.getRowDetail(module.name, primaryField.name);

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

async function deleteRow(moduleId, rowId) {
    try {
        const module = await moduleQuery.getModule(moduleId);
        const moduleFields = await fieldQuery.getFields(moduleId);
        const rowDetail = await getRowDetail(moduleId, rowId, null, {
            withValidation: false,
        });

        // Get Primary Field
        const primaryField = moduleFields.find(field => field.identity);

        // Delete Files
        fileQuery.delete(moduleFields, rowDetail);

        // Delete Rows
        const query = commonBuilder.deleteRow(module.name, primaryField.name);

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

async function getOptions(id) {
    try {
        const field = await fieldQuery.getField(id);
        const query = commonBuilder.getOptions(field.tableRef, field.tableRefKey, field.tableRefName);
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

async function insertRow(moduleId, data, user = null, files = []) {
    try {
        const module = await moduleQuery.getModule(moduleId);

        // before validation
        await validationQuery.runValidation(data, moduleId, actionId.create, validationTimeId.before, user);

        // save files
        fileQuery.save(files);

        // insert
        data.createdAt = dayjs().format(datetimeFormat.datetime.value);
        data.updatedAt = dayjs().format(datetimeFormat.datetime.value);

        const {query, values} = commonBuilder.insertRow(module.name, data);

        // after validation
        await validationQuery.runValidation(data, moduleId, actionId.create, validationTimeId.after, user);

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

async function updateRow(moduleId, rowId, data, files = []) {
    try {
        const module = await moduleQuery.getModule(moduleId);
        const moduleFields = await fieldQuery.getFields(moduleId);
        const rowDetail = await getRowDetail(moduleId, rowId, null, {
            withValidation: false,
        });

        // get primary field
        const primaryField = moduleFields.find(field => field.identity);

        // delete files
        fileQuery.delete(moduleFields, rowDetail);

        // insert files
        fileQuery.save(files);

        // update row
        const condition = {
            [primaryField.name]: rowId,
        };

        data.updatedAt = dayjs().format(datetimeFormat.datetime.value);

        const {query, values} = commonBuilder.updateRow(module.name, data, condition);

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
    getColumns,
    getRowDetail,
    deleteRow,
    getOptions,
    insertRow,
    updateRow,
    getMenu,
};
