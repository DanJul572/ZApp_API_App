const dayjs = require('dayjs');

const dateTimeFormatConfig = require('../../config/datetimeFormat');

/**
 * Registers tables in modules and fields. Modules are looked up by name and only the missing
 * modules and fields are inserted, so running it again (or on a database where some of them were
 * already added by hand) does not create duplicates.
 */
async function registerModules(queryInterface, modules) {
  const sequelize = queryInterface.sequelize;

  await sequelize.transaction(async transaction => {
    const select = (query, replacements) =>
      sequelize.query(query, { replacements, transaction, type: sequelize.QueryTypes.SELECT });
    const insert = async (query, replacements) => {
      const [rows] = await sequelize.query(query, { replacements, transaction });
      return rows[0];
    };

    const now = dayjs().format(dateTimeFormatConfig.datetime.value);

    for (const definition of modules) {
      let [module] = await select('SELECT "id" FROM "modules" WHERE "name" = ?', [definition.name]);

      if (!module) {
        module = await insert(
          `INSERT INTO "modules" ("name", "label", "createdAt", "updatedAt")
           VALUES (?, ?, ?, ?) RETURNING "id"`,
          [definition.name, definition.label, now, now],
        );
      }

      const existingFields = await select('SELECT "name" FROM "fields" WHERE "moduleId" = ?', [
        module.id,
      ]);
      const existingNames = existingFields.map(field => field.name);
      const missingFields = definition.fields
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
}

// Removes the modules and their fields only; the tables themselves are kept.
async function unregisterModules(queryInterface, modules) {
  const sequelize = queryInterface.sequelize;

  await sequelize.transaction(async transaction => {
    const rows = await sequelize.query('SELECT "id" FROM "modules" WHERE "name" IN (?)', {
      replacements: [modules.map(definition => definition.name)],
      transaction,
      type: sequelize.QueryTypes.SELECT,
    });
    if (!rows.length) return;

    const moduleIds = rows.map(module => module.id);

    await queryInterface.bulkDelete('fields', { moduleId: moduleIds }, { transaction });
    await queryInterface.bulkDelete('modules', { id: moduleIds }, { transaction });
  });
}

module.exports = {
  registerModules,
  unregisterModules,
};
