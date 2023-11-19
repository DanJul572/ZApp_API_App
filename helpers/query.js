const {varchar, boolean, integer} = require('../constats/data_type');
const db = require('../models');

module.exports = {
    async createTable(name, fields) {
        try {
            /* set column */
            let columns = fields.map(field => {
                let column = '';
                if (field.dataType === integer) {
                    column = `"${field.name}" integer `;
                } else if (field.dataType === varchar) {
                    column = `"${field.name}" character varying(255) COLLATE pg_catalog."default" `;
                } else if (field.dataType === boolean) {
                    column = `"${field.name}" boolean `;
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
                CREATE TABLE IF NOT EXISTS public."${name}" (${columns}, PRIMARY KEY (${primaryKey}))
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
    async dropTable(table, sequence, id) {
        try {
            const query = `
                DELETE FROM "Modules" WHERE "id" = ${id};
                DELETE FROM "Fields" WHERE "moduleId" = ${id};
                DROP TABLE IF EXISTS public."${table}";
                DROP SEQUENCE "${table}_${sequence}_seq";
            `;
            return db.sequelize.query(query).catch(error => {
                throw new Error(error.message);
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
