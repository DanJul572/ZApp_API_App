const enums = require('../../enums');
const dateTimeFormatConfig = require('../../config/datetimeFormat');

module.exports = {
  findByModule() {
    return `SELECT * FROM "fields" WHERE "moduleId" = ? ORDER BY "sequence" ASC`;
  },

  findPrimaryField() {
    return `SELECT * FROM "fields" WHERE "moduleId" = ? AND "identity" = true`;
  },

  findById() {
    return `SELECT * FROM "fields" WHERE "id" = ?`;
  },

  deleteByModule() {
    return `DELETE FROM "fields" WHERE "moduleId" = ?`;
  },

  selectFormat(field, module) {
    if (field.inputType === enums.inputType.code || field.inputType === enums.inputType.richText) {
      return `
        CASE
          WHEN "${field.name}" IS NOT NULL
          THEN 'Code'
          ELSE NULL
        END AS "${field.name}"
      `;
    }

    if (field.inputType === enums.inputType.toggle) {
      return `
        CASE
          WHEN "${field.name}" = 1
          THEN 'Yes'
          ELSE 'No'
        END AS "${field.name}"
      `;
    }

    if (field.inputType === enums.inputType.password) {
      return `
        CASE
          WHEN "${field.name}" IS NOT NULL
          THEN '********'
          ELSE NULL
        END AS "${field.name}"
      `;
    }

    if (field.inputType === enums.inputType.dropdown || field.inputType === enums.inputType) {
      return `(
        SELECT CONCAT('(', "${field.tableRef}"."${field.tableRefKey}", ') - ', "${field.tableRef}"."${field.tableRefName}")
        FROM "${field.tableRef}"
        WHERE CAST("${field.tableRef}"."${field.tableRefKey}" AS VARCHAR(255)) = CAST("${module}"."${field.name}" AS VARCHAR(255))
      ) AS "${field.name}"`;
    }

    if (field.inputType === enums.inputType.checkbox) {
      return `
        SELECT STRING_AGG(CONCAT('(', "${field.tableRef}"."${field.tableRefKey}", ') - ', "${field.tableRef}"."${field.tableRefName}"), ', ') AS "${field.name}"
        FROM "${field.tableRef}"
        WHERE "${field.tableRef}"."${field.tableRefKey}" IN ("${module}"."${field.name}");
      `;
    }

    if (
      field.inputType === enums.inputType.datetime ||
      field.inputType === enums.inputType.date ||
      field.inputType === enums.inputType.time
    ) {
      return `TO_CHAR("${field.name}", '${dateTimeFormatConfig.datetime.display}') AS "${field.name}"`;
    }

    return `"${field.name}"`;
  },
};
