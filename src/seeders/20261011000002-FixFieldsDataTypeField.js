'use strict';

const dayjs = require('dayjs');

const dateTimeFormatConfig = require('../config/datetimeFormat');

/**
 * The Fields seeder registered the "dataType" column of the fields module under the name
 * "inputType", so the module ended up with two "inputType" fields. The wrong one is the field that
 * refers to dataTypes; it is renamed in place so its id stays the same.
 *
 * This is a seeder rather than a migration because on a fresh database the Fields seeder runs after
 * all migrations. Nothing is changed when the field is already correct.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;

    await sequelize.transaction(async transaction => {
      const select = (query, replacements) =>
        sequelize.query(query, { replacements, transaction, type: sequelize.QueryTypes.SELECT });

      const [module] = await select('SELECT "id" FROM "modules" WHERE "name" = ?', ['fields']);
      if (!module) return;

      const [dataTypeField] = await select(
        'SELECT "id" FROM "fields" WHERE "moduleId" = ? AND "name" = ?',
        [module.id, 'dataType'],
      );
      if (dataTypeField) return;

      await queryInterface.bulkUpdate(
        'fields',
        {
          name: 'dataType',
          label: 'Data Type',
          updatedAt: dayjs().format(dateTimeFormatConfig.datetime.value),
        },
        { moduleId: module.id, name: 'inputType', tableRef: 'dataTypes' },
        { transaction },
      );
    });
  },

  // Nothing to revert: restoring the old name would bring the duplicate "inputType" field back.
  async down() {},
};
