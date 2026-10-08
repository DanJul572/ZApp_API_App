'use strict';

const dayjs = require('dayjs');

const dateTimeFormatConfig = require('../config/datetimeFormat');
const logMenu = require('../seeders/menus/logMenu');

const emailLogMenu = logMenu.child.find(item => item.id === 'email-log');

function parseTree(tree) {
  return typeof tree === 'string' ? JSON.parse(tree) : tree || [];
}

function hasMenuUrl(tree, url) {
  return tree.some(item => item.url === url || hasMenuUrl(item.child || [], url));
}

function isEmailLogMenu(item) {
  return item.id === emailLogMenu.id && item.url === emailLogMenu.url;
}

function removeEmailLogMenu(tree) {
  return tree
    .filter(item => !isEmailLogMenu(item))
    .map(item => (item.child ? { ...item, child: removeEmailLogMenu(item.child) } : item));
}

// The Log group is recognised by its other log pages, since its id and label may have been
// changed with the menu builder.
function addEmailLogMenu(tree) {
  const logUrls = logMenu.child.map(item => item.url);
  const logGroup = tree.find(item => (item.child || []).some(child => logUrls.includes(child.url)));

  if (!logGroup) return [...tree, emailLogMenu];

  return tree.map(item =>
    item === logGroup ? { ...item, child: [...item.child, emailLogMenu] } : item,
  );
}

/**
 * Adds the Email Log page to the Log group of every menu, or at the end of the tree when a menu
 * has no Log group. Menus that already link to /email-log are left as they are. On a fresh
 * database the Menus seeder adds the item instead.
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
        if (hasMenuUrl(tree, emailLogMenu.url)) continue;

        await queryInterface.bulkUpdate(
          'menus',
          { tree: JSON.stringify(addEmailLogMenu(tree)), updatedAt: now },
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
        const cleanedTree = removeEmailLogMenu(tree);
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
