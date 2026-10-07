'use strict';

const dayjs = require('dayjs');

const enums = require('../enums');
const dateTimeFormatConfig = require('../config/datetimeFormat');
const auditLoginFields = require('../seeders/fields/auditLogins');
const auditTrailFields = require('../seeders/fields/auditTrails');
const logErrorFields = require('../seeders/fields/logErrors');
const logMenu = require('../seeders/menus/logMenu');

const auditModules = [
  { id: enums.moduleId.auditTrails, name: 'auditTrails', label: 'Audit Trail' },
  { id: enums.moduleId.auditLogins, name: 'auditLogins', label: 'Login History' },
];

const auditFields = [...auditTrailFields, ...auditLoginFields, ...logErrorFields];

function hasMenuUrl(tree, url) {
  return tree.some(item => item.url === url || hasMenuUrl(item.child || [], url));
}

function parseTree(tree) {
  return typeof tree === 'string' ? JSON.parse(tree) : tree || [];
}

/**
 * Registers the audit modules, their fields and the Log menu on a database that was seeded
 * before they existed. On a fresh database the modules table is still empty here, so this
 * migration does nothing and the seeders insert everything instead.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;
    const select = (query, replacements) =>
      sequelize.query(query, { replacements, type: sequelize.QueryTypes.SELECT });

    const [{ count }] = await select('SELECT COUNT(*) AS "count" FROM "modules"');
    if (parseInt(count, 10) === 0) return;

    const now = dayjs().format(dateTimeFormatConfig.datetime.value);

    await sequelize.transaction(async transaction => {
      for (const auditModule of auditModules) {
        const [existing] = await select('SELECT "id", "name" FROM "modules" WHERE "id" = ?', [
          auditModule.id,
        ]);

        if (existing && existing.name !== auditModule.name) {
          throw new Error(
            `Module id ${auditModule.id} is already used by "${existing.name}". ` +
              `Change enums.moduleId.${auditModule.name} to a free id and try again.`,
          );
        }

        if (!existing) {
          await queryInterface.bulkInsert(
            'modules',
            [{ ...auditModule, createdAt: now, updatedAt: now }],
            { transaction },
          );
        }
      }

      await sequelize.query(
        `SELECT setval(pg_get_serial_sequence('modules', 'id'), (SELECT MAX("id") FROM "modules"))`,
        { transaction },
      );

      const existingFields = await select(
        'SELECT "moduleId", "name" FROM "fields" WHERE "moduleId" IN (?)',
        [[enums.moduleId.auditTrails, enums.moduleId.auditLogins, enums.moduleId.logErrors]],
      );
      const existingFieldKeys = existingFields.map(field => `${field.moduleId}.${field.name}`);
      const missingFields = auditFields.filter(
        field => !existingFieldKeys.includes(`${field.moduleId}.${field.name}`),
      );

      if (missingFields.length) {
        await queryInterface.bulkInsert('fields', missingFields, { transaction });
      }

      const menus = await select('SELECT "id", "tree" FROM "menus"');
      for (const menu of menus) {
        const tree = parseTree(menu.tree);
        if (hasMenuUrl(tree, logMenu.child[0].url)) continue;

        await queryInterface.bulkUpdate(
          'menus',
          { tree: JSON.stringify([...tree, logMenu]), updatedAt: now },
          { id: menu.id },
          { transaction },
        );
      }
    });
  },

  async down(queryInterface) {
    const sequelize = queryInterface.sequelize;

    await sequelize.transaction(async transaction => {
      const menus = await sequelize.query('SELECT "id", "tree" FROM "menus"', {
        transaction,
        type: sequelize.QueryTypes.SELECT,
      });
      for (const menu of menus) {
        const tree = parseTree(menu.tree);
        const cleanedTree = tree.filter(item => item.id !== logMenu.id);
        if (cleanedTree.length === tree.length) continue;

        await queryInterface.bulkUpdate(
          'menus',
          { tree: JSON.stringify(cleanedTree) },
          { id: menu.id },
          { transaction },
        );
      }

      const addedLogErrorFields = logErrorFields
        .filter(field => field.sequence > 4)
        .map(field => field.name);

      await queryInterface.bulkDelete(
        'fields',
        { moduleId: enums.moduleId.logErrors, name: addedLogErrorFields },
        { transaction },
      );
      await queryInterface.bulkDelete(
        'fields',
        { moduleId: [enums.moduleId.auditTrails, enums.moduleId.auditLogins] },
        { transaction },
      );
      await queryInterface.bulkDelete(
        'modules',
        { id: auditModules.map(auditModule => auditModule.id) },
        { transaction },
      );
    });
  },
};
