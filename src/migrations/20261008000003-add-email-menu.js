'use strict';

const dayjs = require('dayjs');

const dateTimeFormatConfig = require('../config/datetimeFormat');
const emailMenu = require('../seeders/menus/emailMenu');

// The "Template" group is recognised by the builder pages it holds, since its id and label may
// have been changed with the menu builder.
const TEMPLATE_GROUP_URLS = ['/module', '/view', '/menu'];

function parseTree(tree) {
  return typeof tree === 'string' ? JSON.parse(tree) : tree || [];
}

function hasMenuUrl(tree, url) {
  return tree.some(item => item.url === url || hasMenuUrl(item.child || [], url));
}

function isEmailMenu(item) {
  return item.id === emailMenu.id && item.url === emailMenu.url;
}

function removeEmailMenu(tree) {
  return tree
    .filter(item => !isEmailMenu(item))
    .map(item => (item.child ? { ...item, child: removeEmailMenu(item.child) } : item));
}

function addEmailMenu(tree) {
  const templateGroup = tree.find(item =>
    (item.child || []).some(child => TEMPLATE_GROUP_URLS.includes(child.url)),
  );

  if (!templateGroup) return [...tree, emailMenu];

  return tree.map(item =>
    item === templateGroup ? { ...item, child: [...item.child, emailMenu] } : item,
  );
}

/**
 * Adds the Email page to the "Template" group of every menu on a database that was seeded
 * before the page existed, or at the end of the tree when a menu has no such group. Menus that
 * already link to /email are left as they are.
 *
 * On a fresh database the menus table is still empty here (seeders run after migrations), so
 * this migration does nothing and the Menus seeder adds the item instead.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    const sequelize = queryInterface.sequelize;
    const now = dayjs().format(dateTimeFormatConfig.datetime.value);

    await sequelize.transaction(async transaction => {
      const menus = await sequelize.query('SELECT "id", "tree" FROM "menus"', {
        transaction,
        type: sequelize.QueryTypes.SELECT,
      });

      for (const menu of menus) {
        const tree = parseTree(menu.tree);
        if (hasMenuUrl(tree, emailMenu.url)) continue;

        await queryInterface.bulkUpdate(
          'menus',
          { tree: JSON.stringify(addEmailMenu(tree)), updatedAt: now },
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
        const cleanedTree = removeEmailMenu(tree);
        if (JSON.stringify(cleanedTree) === JSON.stringify(tree)) continue;

        await queryInterface.bulkUpdate(
          'menus',
          { tree: JSON.stringify(cleanedTree) },
          { id: menu.id },
          { transaction },
        );
      }
    });
  },
};
