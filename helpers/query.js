const dataType = require('../constats/dataType');
const inputType = require('../constats/inputType');
const {rowsPerPage} = require('../constats/setting');
const db = require('../models');
const builder = require('./builder');

module.exports = {
    async createTable(name, fields) {
        try {
            /* set column */
            let columns = fields.map(field => {
                let column = '';
                if (field.dataType === dataType.integer) {
                    column = `"${field.name}" integer `;
                } else if (field.dataType === dataType.varchar) {
                    column = `"${field.name}" character varying(255) COLLATE pg_catalog."default" `;
                } else if (field.dataType === dataType.boolean) {
                    column = `"${field.name}" boolean `;
                } else if (field.dataType === dataType.text) {
                    column = `"${field.name}" text `;
                } else if (field.dataType === dataType.datetime) {
                    column = `"${field.name}" timestamp with time zone NOT NULL DEFAULT now() `;
                } else if (field.dataType === dataType.byte) {
                    column = `"${field.name}" bytea `;
                }

                if (field.autoIncrement) column += ` DEFAULT nextval('"${name}_${field.name}_seq"'::regclass) `;
                if (field.notNull) column += ' NOT NULL ';
                if (field.defaultValue) column += ` DEFAULT ${field.defaultValue} `;

                return column;
            });

            /* set default column */
            columns.push(`"createdAt" timestamp with time zone NOT NULL DEFAULT now()`);
            columns.push(`"updatedAt" timestamp with time zone NOT NULL DEFAULT now()`);

            /* set primary */
            let primaryKey = fields.find(field => field.identity).name;

            /* set sequence */
            let sequence = fields.find(field => field.autoIncrement).name;

            /* build query */
            columns = columns.join(',');
            const query = `
                CREATE SEQUENCE "${name}_${sequence}_seq";
                CREATE TABLE IF NOT EXISTS public."${name}" (${columns}, PRIMARY KEY ("${primaryKey}"))
                TABLESPACE pg_default;
                ALTER TABLE IF EXISTS public."${name}" OWNER to postgres;
            `;

            return db.sequelize.query(query).catch(error => {
                throw new Error(error.message);
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async dropTable(table, sequence) {
        try {
            const query = `
                DROP TABLE IF EXISTS public."${table}";
                DROP SEQUENCE IF EXISTS "${table}_${sequence}_seq";
            `;
            return db.sequelize.query(query).catch(error => {
                throw new Error(error.message);
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getModule(id) {
        try {
            const query = `SELECT * FROM "Modules" WHERE "id" = ${id}`;
            return db.sequelize
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

    async getFields(id) {
        try {
            const query = `SELECT * FROM "Fields" WHERE "moduleId" = ${id}`;
            return db.sequelize
                .query(query)
                .then(result => {
                    if (result.length <= 0) return [];
                    const fields = result[0];
                    const timestapFields = [
                        {
                            moduleId: id,
                            name: 'createdAt',
                            label: 'Created dAt',
                            inputType: inputType.datetime,
                            dataType: dataType.datetime,
                            tableRef: null,
                            tableRefKey: null,
                            tableRefName: null,
                            tableRefAlias: null,
                            tableRefFilter: null,
                            regex: null,
                            multiSelect: false,
                            identity: false,
                            notNull: false,
                            unique: false,
                        },
                        {
                            moduleId: id,
                            name: 'updatedAt',
                            label: 'Updated At',
                            inputType: inputType.datetime,
                            dataType: dataType.datetime,
                            tableRef: null,
                            tableRefKey: null,
                            tableRefName: null,
                            tableRefAlias: null,
                            tableRefFilter: null,
                            regex: null,
                            multiSelect: false,
                            identity: false,
                            notNull: false,
                            unique: false,
                        },
                    ];
                    return fields.concat(timestapFields);
                })
                .catch(error => {
                    throw new Error(error.message);
                });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async deleteFields(id) {
        try {
            const query = `DELETE FROM "Fields" WHERE "moduleId" = ${id}`;
            return db.sequelize.query(query).catch(error => {
                throw new Error(error.message);
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async getRows(id, page, filter, order) {
        try {
            const module = await this.getModule(id);
            const offset = (page - 1) * rowsPerPage;

            let fields = await this.getFields(id);
            fields = fields.map(field => builder.field(field, module.name)).join(',');

            const countQuery = `SELECT count(*) AS "count" FROM "${module.name}"`;
            let rowsQuery = `SELECT ${fields} FROM "${module.name}"`;

            if (filter && filter.length) {
                const where = `"${filter.field}" ILIKE '%${filter.value}%'`;
                rowsQuery += ` WHERE ${where}`;
            }

            if (order && filter.length) {
                const orderBy = `"${order.field}" ${order.value}`;
                rowsQuery += ` ORDER BY ${orderBy}`;
            }

            rowsQuery += ` LIMIT ${rowsPerPage} OFFSET ${offset}`;

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
            let fields = await this.getFields(id);
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
