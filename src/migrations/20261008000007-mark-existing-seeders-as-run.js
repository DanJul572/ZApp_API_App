'use strict';

// Seeders that existed before executed seeders were recorded in SequelizeData. Seeders added
// later must not be listed here, so they still run on existing databases.
const EXISTING_SEEDERS = [
  '20231116004559-DataTypes.js',
  '20231116005347-Roles.js',
  '20231116010607-Menus.js',
  '20231226140551-Modules.js',
  '20231226140603-Fields.js',
  '20240121104110-InputTypes.js',
  '20250526043707-Users.js',
  '20250526045034-Actions.js',
  '20250526051034-Scripts.js',
  '20250526095345-ValidationTimes.js',
];

/**
 * Marks the existing seeders as executed on a database that was seeded before seederStorage was
 * enabled, so the next `db:seed:all` does not insert their data a second time.
 *
 * On a fresh database the modules table is still empty here (seeders run after migrations), so
 * this migration only creates the SequelizeData table and the seeders run as usual.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;

    await sequelize.transaction(async transaction => {
      // Same shape as the table sequelize-cli creates for seederStorage: 'sequelize'.
      await sequelize.query(
        'CREATE TABLE IF NOT EXISTS "SequelizeData" ("name" VARCHAR(255) NOT NULL PRIMARY KEY)',
        { transaction },
      );

      const [{ count }] = await sequelize.query('SELECT COUNT(*) AS "count" FROM "modules"', {
        transaction,
        type: sequelize.QueryTypes.SELECT,
      });
      if (Number(count) === 0) return;

      await sequelize.query(
        `INSERT INTO "SequelizeData" ("name") VALUES ${EXISTING_SEEDERS.map(() => '(?)').join(', ')}
         ON CONFLICT ("name") DO NOTHING`,
        { replacements: EXISTING_SEEDERS, transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DELETE FROM "SequelizeData" WHERE "name" IN (?)', {
      replacements: [EXISTING_SEEDERS],
    });
  },
};
