const inputType = require('../constats/inputType');

module.exports = {
    findByModule(id) {
        return `SELECT * FROM "Fields" WHERE "moduleId" = ${id}`;
    },
    deleteByModule(id) {
        return `DELETE FROM "Fields" WHERE "moduleId" = ${id}`;
    },
    selectFormat(field, module) {
        if (field.inputType === inputType.code)
            return `
                CASE
                    WHEN "${field.name}" IS NOT NULL
                    THEN 'Code'
                    ELSE NULL
                END AS "${field.name}"
            `;

        if (field.inputType === inputType.dropdown)
            return `(
                SELECT CONCAT('(', "${field.tableRef}"."${field.tableRefKey}", ') - ', "${field.tableRef}"."${field.tableRefName}")
                FROM "${field.tableRef}"
                WHERE CAST("${field.tableRef}"."${field.tableRefKey}" AS VARCHAR(255)) = CAST("${module}"."${field.name}" AS VARCHAR(255))
            ) AS "${field.name}"`;

        return `"${field.name}"`;
    },
};
