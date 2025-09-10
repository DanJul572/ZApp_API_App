const enums = require('../../enums');

module.exports = {
  findByModule() {
    return 'SELECT * FROM `Fields` WHERE `moduleId` = ? ORDER BY `sequence` ASC';
  },

  findPrimaryField() {
    return 'SELECT * FROM `Fields` WHERE `moduleId` = ? AND `identity` = true';
  },

  findById() {
    return 'SELECT * FROM `Fields` WHERE `id` = ?';
  },

  deleteByModule() {
    return 'DELETE FROM `Fields` WHERE `moduleId` = ?';
  },

  selectFormat(field, module) {
    if (field.inputType === enums.inputType.code || field.inputType === enums.inputType.richText) {
      return `
        CASE
          WHEN \`${field.name}\` IS NOT NULL
          THEN 'Code'
          ELSE NULL
        END AS \`${field.name}\`
      `;
    }

    if (field.inputType === enums.inputType.toggle) {
      return `
        CASE
          WHEN \`${field.name}\` = 1
          THEN 'Yes'
          ELSE 'No'
        END AS \`${field.name}\`
      `;
    }

    if (field.inputType === enums.inputType.password) {
      return `
        CASE
          WHEN \`${field.name}\` IS NOT NULL
          THEN '********'
          ELSE NULL
        END AS \`${field.name}\`
      `;
    }

    if (field.inputType === enums.inputType.dropdown || field.inputType === enums.inputType) {
      return `(
        SELECT CONCAT('(', \`${field.tableRef}\`.\`${field.tableRefKey}\`, ') - ', \`${field.tableRef}\`.\`${field.tableRefName}\`)
        FROM \`${field.tableRef}\`
        WHERE CAST(\`${field.tableRef}\`.\`${field.tableRefKey}\` AS CHAR) = CAST(\`${module}\`.\`${field.name}\` AS CHAR)
      ) AS \`${field.name}\``;
    }

    if (field.inputType === enums.inputType.checkbox) {
      return `
        SELECT GROUP_CONCAT(CONCAT('(', \`${field.tableRef}\`.\`${field.tableRefKey}\`, ') - ', \`${field.tableRef}\`.\`${field.tableRefName}\`) SEPARATOR ', ') AS \`${field.name}\`
        FROM \`${field.tableRef}\`
        WHERE FIND_IN_SET(\`${field.tableRef}\`.\`${field.tableRefKey}\`, \`${module}\`.\`${field.name}\`);
      `;
    }

    if (
      field.inputType === enums.inputType.datetime ||
      field.inputType === enums.inputType.date ||
      field.inputType === enums.inputType.time
    ) {
      return `DATE_FORMAT(\`${field.name}\`, '${enums.datetimeFormat.datetime.mysqlDisplay}') AS \`${field.name}\``;
    }

    return `\`${field.name}\``;
  },
};
