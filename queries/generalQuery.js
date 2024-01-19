const dayjs = require('dayjs');

const db = require('../models');
const moduleQuery = require('./moduleQuery');
const fieldQuery = require('./fieldQuery');
const fieldBuilder = require('../builders/fieldBuilder');
const generalBuilder = require('../builders/generalBuilder');
const datetimeFormat = require('../constats/datetimeFormat');

module.exports = {
    async getRows(id, page, filter, order) {
        try {
            const module = await moduleQuery.getModule(id);

            let fields = await fieldQuery.getFields(id);
            fields = fields.map(field => fieldBuilder.selectFormat(field, module.name)).join(',');

            const countQuery = generalBuilder.getRowsCount(module.name);
            const rowsQuery = generalBuilder.getRows(module.name, fields, page, filter, order);

            const count = await db.sequelize
                .query(countQuery)
                .then(result => {
                    return result.length > 0 ? parseInt(result[0][0].count) : 0;
                })
                .catch(error => {
                    throw new Error(error.message);
                });

            const rows = await db.sequelize
                .query(rowsQuery)
                .then(result => {
                    return result.length > 0 ? result[0] : [];
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

    async getRowDetail(moduleId, id) {
        try {
            const module = await moduleQuery.getModule(moduleId);
            const primaryField = await fieldQuery.getPrimaryField(moduleId);
            const query = generalBuilder.getRowDetail(module.name, primaryField.name, id);
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
            const query = generalBuilder.deleteRow(module.name, primaryField, id);
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
            const query = generalBuilder.getOptions(field.tableRef, field.tableRefKey, field.tableRefName);
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

    async insertRows(moduleId, data) {
        try {
            const module = await moduleQuery.getModule(moduleId);

            data.createdAt = dayjs().format(datetimeFormat.datetime);
            data.updatedAt = dayjs().format(datetimeFormat.datetime);

            const query = generalBuilder.insertRows(module.name, data);

            return await db.sequelize
                .query(query)
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
};
