const dayjs = require('dayjs');

const db = require('../models');

const fieldQuery = require('./fieldQuery');
const moduleQuery = require('./moduleQuery');
const validationQuery = require('./validationQuery');

const commonBuilder = require('../builders/commonBuilder');

const actionId = require('../constats/actionId');
const datetimeFormat = require('../constats/datetimeFormat');
const validationTimeId = require('../constats/validationTimeId');

module.exports = {
    async getRows(id, page, advanceFilter, filter, order, defaultFilter) {
        try {
            const module = await moduleQuery.getModule(id);
            const fields = await fieldQuery.getFields(id);
            const countQuery = commonBuilder.getRowsCount(module.name);
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
    },

    async getColumns(id) {
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
    },

    async getRowDetail(user, moduleId, rowId) {
        try {
            // before validation
            const data = {
                rowId: rowId,
                moduleId: moduleId,
            };
            await validationQuery.runValidation(data, moduleId, actionId.detail, validationTimeId.before, user);

            const module = await moduleQuery.getModule(moduleId);
            const primaryField = await fieldQuery.getPrimaryField(moduleId);
            const query = commonBuilder.getRowDetail(module.name, primaryField.name, rowId);

            return await db.sequelize
                .query(query)
                .then(result => {
                    return result.length > 0 ? result[0][0] : null;
                })
                .catch(error => {
                    throw new Error(error.message);
                });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async deleteRow(moduleId, id) {
        try {
            const module = await moduleQuery.getModule(moduleId);
            const primaryField = await fieldQuery.getPrimaryField(moduleId);
            const query = commonBuilder.deleteRow(module.name, primaryField.name, id);
            return await db.sequelize
                .query(query)
                .then(() => {
                    return 'Data has been deleted.';
                })
                .catch(error => {
                    throw new Error(error.message);
                });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getOptions(id) {
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
    },

    async insertRow(moduleId, data, user = null) {
        try {
            const module = await moduleQuery.getModule(moduleId);

            // before validation
            await validationQuery.runValidation(data, moduleId, actionId.create, validationTimeId.before, user);

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
    },

    async updateRow(moduleId, rowId, data) {
        try {
            const module = await moduleQuery.getModule(moduleId);
            const primaryField = await fieldQuery.getPrimaryField(moduleId);

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
    },

    async getMenu(roleId) {
        try {
            const query = commonBuilder.getMenu(roleId);

            return await db.sequelize
                .query(query)
                .then(result => {
                    return result.length > 0 ? result[0][0] : null;
                })
                .catch(error => {
                    throw new Error(error.message);
                });
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
