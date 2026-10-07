'use strict';

const { randomUUID } = require('crypto');
const dayjs = require('dayjs');

const dateTimeFormatConfig = require('../config/datetimeFormat');
const viewConfig = require('../config/view');
const viewEncryption = require('../helpers/viewEncryption');

const MODULE = { name: 'Test_Module', label: 'Test Module' };
const KEY_FIELD = {
  name: 'Test_Field',
  label: 'Test Field',
  inputType: 1, // shortText
  dataType: 1, // varchar
};
const LIST_VIEW_LABEL = 'Test Module - List';
const FORM_VIEW_LABEL = 'Test Module - Form';
const MENU_ITEM_ID = 'test-module';

// Snapshot of the web app enums the view builder stores inside view content.
const group = {
  fieldControl: { value: 2, label: 'Field Control' },
  visualElement: { value: 4, label: 'Visual Element' },
  button: { value: 5, label: 'Button' },
  table: { value: 6, label: 'Table' },
};
const type = {
  text: { value: 1, label: 'Text' },
  shortText: { value: 1, label: 'Short Text' },
  button: { value: 1, label: 'Button' },
  table: { value: 1, label: 'Table' },
};
const tableAction = {
  insert: { value: 1, label: 'Insert' },
  update: { value: 2, label: 'Update' },
  delete: { value: 3, label: 'Delete' },
};

function title() {
  return {
    id: randomUUID(),
    group: group.visualElement,
    type: type.text,
    properties: { label: `"${MODULE.label}"`, size: 20 },
  };
}

function listContent(moduleId, formViewId) {
  const formPath = `/${formViewId}`;

  return [
    title(),
    {
      id: randomUUID(),
      group: group.table,
      type: type.table,
      properties: {
        moduleID: moduleId,
        actions: [
          {
            label: tableAction.insert.label,
            type: tableAction.insert.value,
            onClick: `zcore.redirect.internal('${formPath}');`,
          },
          {
            label: tableAction.update.label,
            type: tableAction.update.value,
            onClick: `zcore.redirect.internal('${formPath}?rowId=' + encodeURIComponent(param.row.${KEY_FIELD.name}));`,
          },
          {
            label: tableAction.delete.label,
            type: tableAction.delete.value,
            onClick: null,
          },
        ],
      },
    },
  ];
}

function formContent(moduleId, listViewId) {
  return [
    title(),
    {
      id: randomUUID(),
      group: group.fieldControl,
      type: type.shortText,
      properties: { label: `"${KEY_FIELD.label}"`, name: KEY_FIELD.name },
    },
    {
      id: randomUUID(),
      group: group.button,
      type: type.button,
      properties: {
        label: '"Save"',
        onClick: `zbuilder.classicQuery.createOrUpdate(${moduleId}, 'rowId', '/${listViewId}');`,
        display: { horizontal: { name: 'right', value: 'flex-end', type: 'horizontal' } },
      },
    },
  ];
}

// Opened with ?rowId=<Test_Field>, the form loads that row for editing.
function formPage(moduleId) {
  return { onLoad: `zbuilder.classicQuery.findOneAndSet(${moduleId}, 'rowId');` };
}

function parseTree(tree) {
  return typeof tree === 'string' ? JSON.parse(tree) : tree || [];
}

function hasMenuUrl(tree, url) {
  return tree.some(item => item.url === url || hasMenuUrl(item.child || [], url));
}

function removeMenuUrl(tree, url) {
  return tree
    .filter(item => item.url !== url)
    .map(item => (item.child ? { ...item, child: removeMenuUrl(item.child, url) } : item));
}

/**
 * Adds the Test Module list and form views, and a "Test Module" menu item, to a database that
 * already has its core data seeded. The module and its table are created as well when the
 * database does not have them yet. Everything that already exists is left as it is.
 *
 * On a fresh database the modules table is still empty here (seeders run after migrations),
 * so this migration does nothing.
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

      const [{ count }] = await select('SELECT COUNT(*) AS "count" FROM "modules"');
      if (parseInt(count, 10) === 0) {
        console.log('Skipped: core data is not seeded yet.');
        return;
      }

      const now = dayjs().format(dateTimeFormatConfig.datetime.value);

      let [module] = await select('SELECT "id" FROM "modules" WHERE "name" = ?', [MODULE.name]);

      if (!module) {
        module = await insert(
          `INSERT INTO "modules" ("name", "label", "createdAt", "updatedAt")
           VALUES (?, ?, ?, ?) RETURNING "id"`,
          [MODULE.name, MODULE.label, now, now],
        );

        await queryInterface.bulkInsert(
          'fields',
          [
            {
              moduleId: module.id,
              ...KEY_FIELD,
              multiSelect: false,
              identity: true,
              autoIncrement: false,
              notNull: true,
              unique: true,
              sequence: 1,
              createdAt: now,
              updatedAt: now,
            },
          ],
          { transaction },
        );

        // Same table definition the module builder generates.
        await sequelize.query(
          `CREATE TABLE IF NOT EXISTS public."${MODULE.name}" (
            "${KEY_FIELD.name}" character varying(255) COLLATE pg_catalog."default" NOT NULL,
            "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
            "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
            PRIMARY KEY ("${KEY_FIELD.name}")
          )`,
          { transaction },
        );
      }

      const findView = async label => {
        const [view] = await select(
          'SELECT "id" FROM "views" WHERE "moduleId" = ? AND "label" = ?',
          [String(module.id), label],
        );
        return view;
      };
      const insertView = label =>
        insert(
          `INSERT INTO "views" ("label", "moduleId", "content", "page", "createdAt", "updatedAt")
           VALUES (?, ?, NULL, NULL, ?, ?) RETURNING "id"`,
          [label, String(module.id), now, now],
        );

      let listView = await findView(LIST_VIEW_LABEL);
      let formView = await findView(FORM_VIEW_LABEL);

      if (!listView || !formView) {
        const key = viewConfig.encryptionKey;

        listView = listView || (await insertView(LIST_VIEW_LABEL));
        formView = formView || (await insertView(FORM_VIEW_LABEL));

        // Both views link to each other, so their content is written once both ids are known.
        await queryInterface.bulkUpdate(
          'views',
          { content: viewEncryption.encrypt(listContent(module.id, formView.id), key), page: null },
          { id: listView.id },
          { transaction },
        );
        await queryInterface.bulkUpdate(
          'views',
          {
            content: viewEncryption.encrypt(formContent(module.id, listView.id), key),
            page: viewEncryption.encrypt(formPage(module.id), key),
          },
          { id: formView.id },
          { transaction },
        );
      }

      const listUrl = `/${listView.id}`;
      const menus = await select('SELECT "id", "tree" FROM "menus"');

      for (const menu of menus) {
        const tree = parseTree(menu.tree);
        if (hasMenuUrl(tree, listUrl)) continue;

        tree.push({ id: MENU_ITEM_ID, label: MODULE.label, url: listUrl, icon: null });
        await queryInterface.bulkUpdate(
          'menus',
          { tree: JSON.stringify(tree), updatedAt: now },
          { id: menu.id },
          { transaction },
        );
      }
    });
  },

  // Removes the views and their menu items. The module and its table are kept, because they
  // may have been created with the module builder rather than by this migration.
  async down(queryInterface) {
    const sequelize = queryInterface.sequelize;

    await sequelize.transaction(async transaction => {
      const select = (query, replacements) =>
        sequelize.query(query, { replacements, transaction, type: sequelize.QueryTypes.SELECT });

      const [module] = await select('SELECT "id" FROM "modules" WHERE "name" = ?', [MODULE.name]);
      if (!module) return;

      const views = await select(
        'SELECT "id", "label" FROM "views" WHERE "moduleId" = ? AND "label" IN (?)',
        [String(module.id), [LIST_VIEW_LABEL, FORM_VIEW_LABEL]],
      );
      const listView = views.find(view => view.label === LIST_VIEW_LABEL);

      if (listView) {
        const listUrl = `/${listView.id}`;
        const menus = await select('SELECT "id", "tree" FROM "menus"');

        for (const menu of menus) {
          const tree = parseTree(menu.tree);
          if (!hasMenuUrl(tree, listUrl)) continue;

          await queryInterface.bulkUpdate(
            'menus',
            { tree: JSON.stringify(removeMenuUrl(tree, listUrl)) },
            { id: menu.id },
            { transaction },
          );
        }
      }

      if (views.length) {
        await queryInterface.bulkDelete(
          'views',
          { id: views.map(view => view.id) },
          { transaction },
        );
      }
    });
  },
};
