const dataType = require('../constats/dataType');

module.exports = {
    findOne(id) {
        return `SELECT * FROM "Modules" WHERE "id" = ${id}`;
    },

    createTable(name, fields) {
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
        return `
            CREATE SEQUENCE "${name}_${sequence}_seq";
            CREATE TABLE IF NOT EXISTS public."${name}" (${columns}, PRIMARY KEY ("${primaryKey}"))
            TABLESPACE pg_default;
            ALTER TABLE IF EXISTS public."${name}" OWNER to postgres;
        `;
    },

    deleteTable(name, sequence) {
        return `
            DROP TABLE IF EXISTS public."${name}";
            DROP SEQUENCE IF EXISTS "${name}_${sequence}_seq";
        `;
    },
};
