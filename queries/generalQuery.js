const db = require('../models');
const moduleQuery = require('./moduleQuery');
const fieldQuery = require('./fieldQuery');
const fieldBuilder = require('../builders/fieldBuilder');
const generalBuilder = require('../builders/generalBuilder');

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
                };
            });
            return columns;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
