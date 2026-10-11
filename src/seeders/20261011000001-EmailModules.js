'use strict';

const dayjs = require('dayjs');

const dateTimeFormatConfig = require('../config/datetimeFormat');
const emailModules = require('./modules/emailModules');

/**
 * Registers the email tables in modules and fields. Modules are looked up by name and only the
 * missing modules and fields are inserted, so running it again (or on a database where some of
 * them were already added by hand) does not create duplicates.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;

    await sequelize.transaction(async transaction => {
      const select = (query, replacements) =>
        sequelize.query(query, { replacements, transaction, type: sequelize.QueryTypes.SELECT });
      const insert = async (query, replacements) => {
        const [rows] = await sequelize.query(query, { replacements, transaction });
        return rows[0];
      };

      const now = dayjs().format(dateTimeFormatConfig.datetime.value);

      for (const emailModule of emailModules) {
        let [module] = await select('SELECT "id" FROM "modules" WHERE "name" = ?', [
          emailModule.name,
        ]);

        if (!module) {
          module = await insert(
            `INSERT INTO "modules" ("name", "label", "createdAt", "updatedAt")
             VALUES (?, ?, ?, ?) RETURNING "id"`,
            [emailModule.name, emailModule.label, now, now],
          );
        }

        const existingFields = await select('SELECT "name" FROM "fields" WHERE "moduleId" = ?', [
          module.id,
        ]);
        const existingNames = existingFields.map(field => field.name);
        const missingFields = emailModule.fields
          .map((field, index) => ({
            moduleId: module.id,
            ...field,
            sequence: index + 1,
            createdAt: now,
            updatedAt: now,
          }))
          .filter(field => !existingNames.includes(field.name));

        if (missingFields.length) {
          await queryInterface.bulkInsert('fields', missingFields, { transaction });
        }
      }
    });
  },

  // Removes the modules and their fields only; the email tables themselves are kept.
  async down(queryInterface) {
    const sequelize = queryInterface.sequelize;

    await sequelize.transaction(async transaction => {
      const modules = await sequelize.query('SELECT "id" FROM "modules" WHERE "name" IN (?)', {
        replacements: [emailModules.map(emailModule => emailModule.name)],
        transaction,
        type: sequelize.QueryTypes.SELECT,
      });
      if (!modules.length) return;

      const moduleIds = modules.map(module => module.id);

      await queryInterface.bulkDelete('fields', { moduleId: moduleIds }, { transaction });
      await queryInterface.bulkDelete('modules', { id: moduleIds }, { transaction });
    });
  },
};
