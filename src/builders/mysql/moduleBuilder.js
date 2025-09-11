const enums = require('../../enums');

module.exports = {
  findOne() {
    return 'SELECT * FROM `modules` WHERE `id` = ?';
  },

  createTable(name, fields) {
    /* set column */
    let columns = fields.map(field => {
      let column = '';
      if (field.dataType === enums.dataType.integer) {
        column = `\`${field.name}\` INT `;
      } else if (field.dataType === enums.dataType.varchar) {
        column = `\`${field.name}\` VARCHAR(255) `;
      } else if (field.dataType === enums.dataType.boolean) {
        column = `\`${field.name}\` TINYINT(1) `;
      } else if (field.dataType === enums.dataType.text) {
        column = `\`${field.name}\` TEXT `;
      } else if (field.dataType === enums.dataType.byte) {
        column = `\`${field.name}\` BLOB `;
      } else if (field.dataType === enums.dataType.datetime) {
        column = `\`${field.name}\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP `;
      } else if (field.dataType === enums.dataType.json) {
        column = `\`${field.name}\` JSON `;
      }

      if (field.autoIncrement) {
        column += ' AUTO_INCREMENT ';
      }

      if (field.notNull) {
        column += ' NOT NULL ';
      }

      if (field.defaultValue) {
        column += ` DEFAULT ${field.defaultValue} `;
      }

      return column;
    });

    /* set default column */
    columns.push('`createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
    columns.push(
      '`updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
    );

    /* set primary */
    let primaryKey = fields.find(field => field.identity).name;

    /* build query */
    columns = columns.join(',');
    return `
      CREATE TABLE IF NOT EXISTS \`${name}\` (${columns}, PRIMARY KEY (\`${primaryKey}\`))
      ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
  },

  deleteTable(name) {
    return `
      DROP TABLE IF EXISTS \`${name}\`;
    `;
  },
};
