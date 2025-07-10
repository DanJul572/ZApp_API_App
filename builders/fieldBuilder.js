const datetimeFormat = require('../constats/datetimeFormat');
const inputType = require('../constats/inputType');

module.exports = {
  findByModule() {
    return `SELECT * FROM "Fields" WHERE "moduleId" = $1 ORDER BY "sequence" ASC`;
  },

  findPrimaryField() {
    return `SELECT * FROM "Fields" WHERE "moduleId" = $1 AND "identity" = true`;
  },

  findById() {
    return `SELECT * FROM "Fields" WHERE "id" = $1`;
  },

  deleteByModule() {
    return `DELETE FROM "Fields" WHERE "moduleId" = $1`;
  },

  selectFormat(field, module) {
    if (field.inputType === inputType.code || field.inputType === inputType.richText) {
      return `
        CASE
          WHEN "${field.name}" IS NOT NULL
          THEN 'Code'
          ELSE NULL
        END AS "${field.name}"
      `;
    }

    if (field.inputType === inputType.toggle) {
      return `
        CASE
          WHEN "${field.name}" = 1
          THEN 'Yes'
          ELSE 'No'
        END AS "${field.name}"
      `;
    }

    if (field.inputType === inputType.password) {
      return `
        CASE
          WHEN "${field.name}" IS NOT NULL
          THEN '********'
          ELSE NULL
        END AS "${field.name}"
      `;
    }

    if (field.inputType === inputType.dropdown || field.inputType === inputType) {
      return `(
        SELECT CONCAT('(', "${field.tableRef}"."${field.tableRefKey}", ') - ', "${field.tableRef}"."${field.tableRefName}")
        FROM "${field.tableRef}"
        WHERE CAST("${field.tableRef}"."${field.tableRefKey}" AS VARCHAR(255)) = CAST("${module}"."${field.name}" AS VARCHAR(255))
      ) AS "${field.name}"`;
    }

    if (field.inputType === inputType.checkbox) {
      return `
        SELECT STRING_AGG(CONCAT('(', "${field.tableRef}"."${field.tableRefKey}", ') - ', "${field.tableRef}"."${field.tableRefName}"), ', ') AS "${field.name}"
        FROM "${field.tableRef}"
        WHERE "${field.tableRef}"."${field.tableRefKey}" IN ("${module}"."${field.name}");
      `;
    }

    if (
      field.inputType === inputType.datetime ||
      field.inputType === inputType.date ||
      field.inputType === inputType.time
    ) {
      return `TO_CHAR("${field.name}", '${datetimeFormat.datetime.display}') AS "${field.name}"`;
    }

    return `"${field.name}"`;
  },
};
