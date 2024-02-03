const datetimeFormat = require('../constats/datetimeFormat');
const inputType = require('../constats/inputType');

module.exports = {
    findByModule(moduleId) {
        return `SELECT * FROM "Fields" WHERE "moduleId" = ${moduleId}`;
    },

    findPrimaryField(moduleId) {
        return `SELECT * FROM "Fields" WHERE "moduleId" = ${moduleId} AND "identity" = true`;
    },

    findById(moduleId) {
        return `SELECT * FROM "Fields" WHERE "id" = ${moduleId}`;
    },

    deleteByModule(moduleId) {
        return `DELETE FROM "Fields" WHERE "moduleId" = ${moduleId}`;
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

        if (field.inputType === inputType.datetime)
            return `TO_CHAR("${field.name}", '${datetimeFormat.datetime.display}') AS "${field.name}"`;

        if (field.inputType === inputType.date)
            return `TO_CHAR("${field.name}", '${datetimeFormat.date.display}') AS "${field.name}"`;

        if (field.inputType === inputType.time)
            return `TO_CHAR("${field.name}", '${datetimeFormat.time.display}') AS "${field.name}"`;

        return `"${field.name}"`;
    },
};
