'use strict';

const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const enums = require('../enums');
const { fileUpload } = require('../config/file');
const fileFields = require('../seeders/fields/files');

const FOLDER_NAME_PATTERN = /^[\w-]+$/;

function getExtension(fileName) {
  const extension = path
    .extname(fileName)
    .slice(1)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  return extension ? `.${extension}` : '';
}

// Old rows were named "<uuid>_<original name>" by the web app.
function getOriginalName(fileName) {
  const separatorIndex = fileName.indexOf('_');
  return separatorIndex === -1 ? fileName : fileName.substring(separatorIndex + 1);
}

// Field rows of the files module as they were before this migration.
function getLegacyFileFields(now) {
  const field = (name, label, inputType, dataType, sequence, options = {}) => ({
    moduleId: enums.moduleId.files,
    name,
    label,
    inputType,
    dataType,
    tableRef: null,
    tableRefKey: null,
    tableRefName: null,
    tableRefAlias: null,
    tableRefFilter: null,
    regex: null,
    multiSelect: false,
    identity: false,
    notNull: true,
    unique: false,
    sequence,
    createdAt: now,
    updatedAt: now,
    ...options,
  });
  const { inputType, dataType } = enums;

  return [
    field('id', 'ID', inputType.number, dataType.integer, 1, { identity: true, unique: true }),
    field('name', 'Name', inputType.shortText, dataType.varchar, 2),
    field('data', 'Data', inputType.file, dataType.byte, 3),
    field('type', 'Type', inputType.shortText, dataType.varchar, 4),
    field('encoding', 'Encoding', inputType.shortText, dataType.varchar, 5),
    field('size', 'Size', inputType.number, dataType.integer, 6),
    field('moduleId', 'Module ID', inputType.dropdown, dataType.tableReference, 7, {
      tableRef: 'modules',
      tableRefKey: 'id',
      tableRefName: 'label',
    }),
  ];
}

/**
 * The field rows are renamed and updated in place, so their ids (which the web app refers to,
 * e.g. CFieldID.files.moduleId) do not change. On a fresh database there are no rows yet and the
 * Fields seeder inserts them later.
 */
async function updateFileFields(queryInterface, definitions, renames, transaction) {
  const moduleId = enums.moduleId.files;

  for (const [from, to] of Object.entries(renames)) {
    await queryInterface.bulkUpdate(
      'fields',
      { name: to },
      { moduleId, name: from },
      { transaction },
    );
  }

  for (const field of definitions) {
    // The rows keep the date they were created.
    const definition = { ...field };
    delete definition.createdAt;

    await queryInterface.bulkUpdate(
      'fields',
      definition,
      { moduleId, name: definition.name },
      { transaction },
    );
  }
}

const FIELD_RENAMES = { data: 'path', encoding: 'fieldName' };

// The primary key keeps its name when a table is renamed, so it is renamed too to let the new
// files table create its own.
async function moveFilesTable(queryInterface, newName, transaction) {
  await queryInterface.renameTable('files', newName, { transaction });
  await queryInterface.sequelize.query(
    `ALTER TABLE "${newName}" RENAME CONSTRAINT "files_pkey" TO "${newName}_pkey"`,
    { transaction },
  );
}

async function getModuleFileFields(sequelize, moduleId, transaction) {
  return await sequelize.query(
    'SELECT "m"."name" AS "moduleName", "f"."name" AS "fieldName" FROM "fields" AS "f" ' +
      'JOIN "modules" AS "m" ON "m"."id" = "f"."moduleId" ' +
      'WHERE "f"."moduleId" = ? AND "f"."inputType" = ? AND "f"."dataType" = ?',
    {
      replacements: [moduleId, enums.inputType.file, enums.dataType.byte],
      transaction,
      type: sequelize.QueryTypes.SELECT,
    },
  );
}

/**
 * Module files were stored as binary in the files table. They now live in
 * uploads/<module>/<field>/<file id>.<extension>, the files table keeps only their details, and a
 * module row holds the file id instead of the file name.
 *
 * Existing files are written to the uploads folder and the rows pointing at them are updated.
 * Files that no row points at are dropped. Files written before a failure stay on the disk.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const sequelize = queryInterface.sequelize;

    await sequelize.transaction(async transaction => {
      await moveFilesTable(queryInterface, 'legacyFiles', transaction);

      await queryInterface.createTable(
        'files',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
          },
          name: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          path: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING,
          },
          type: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          size: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          moduleId: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          fieldName: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          createdAt: {
            allowNull: false,
            defaultValue: Sequelize.fn('NOW'),
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            defaultValue: Sequelize.fn('NOW'),
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      const legacyFiles = await sequelize.query(
        'SELECT "name", "data", "type", "size", "moduleId", "createdAt" FROM "legacyFiles"',
        { transaction, type: sequelize.QueryTypes.SELECT },
      );

      for (const legacyFile of legacyFiles) {
        const fields = await getModuleFileFields(sequelize, legacyFile.moduleId, transaction);

        for (const { moduleName, fieldName } of fields) {
          if (!FOLDER_NAME_PATTERN.test(moduleName) || !FOLDER_NAME_PATTERN.test(fieldName)) {
            continue;
          }

          const id = randomUUID();
          const [updatedRows] = await sequelize.query(
            `UPDATE "${moduleName}" SET "${fieldName}" = ? WHERE "${fieldName}" = ? RETURNING 1`,
            { replacements: [id, legacyFile.name], transaction },
          );
          if (!updatedRows.length) continue;

          const originalName = getOriginalName(legacyFile.name);
          const filePath = path.posix.join(
            fileUpload.storage,
            moduleName,
            fieldName,
            `${id}${getExtension(originalName)}`,
          );

          await fs.mkdir(path.dirname(filePath), { recursive: true });
          await fs.writeFile(filePath, legacyFile.data);

          await queryInterface.bulkInsert(
            'files',
            [
              {
                id,
                name: originalName,
                path: filePath,
                type: legacyFile.type,
                size: legacyFile.size,
                moduleId: legacyFile.moduleId,
                fieldName,
                createdAt: legacyFile.createdAt,
                updatedAt: new Date(),
              },
            ],
            { transaction },
          );
          break;
        }
      }

      await queryInterface.dropTable('legacyFiles', { transaction });
      await updateFileFields(queryInterface, fileFields, FIELD_RENAMES, transaction);
    });
  },

  // Reads the files back into the table. The copies in the uploads folder are left in place.
  async down(queryInterface, Sequelize) {
    const sequelize = queryInterface.sequelize;

    await sequelize.transaction(async transaction => {
      await moveFilesTable(queryInterface, 'storedFiles', transaction);

      await queryInterface.createTable(
        'files',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          data: {
            allowNull: false,
            type: Sequelize.BLOB,
          },
          type: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          encoding: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          size: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          moduleId: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      const storedFiles = await sequelize.query(
        'SELECT "f"."id", "f"."name", "f"."path", "f"."type", "f"."size", "f"."moduleId", ' +
          '"f"."fieldName", "f"."createdAt", "m"."name" AS "moduleName" FROM "storedFiles" AS "f" ' +
          'JOIN "modules" AS "m" ON "m"."id" = "f"."moduleId"',
        { transaction, type: sequelize.QueryTypes.SELECT },
      );

      for (const storedFile of storedFiles) {
        let data;
        try {
          data = await fs.readFile(storedFile.path);
        } catch {
          continue;
        }

        const legacyName = `${storedFile.id}_${storedFile.name}`;

        await sequelize.query(
          `UPDATE "${storedFile.moduleName}" SET "${storedFile.fieldName}" = ? ` +
            `WHERE "${storedFile.fieldName}" = ?`,
          { replacements: [legacyName, storedFile.id], transaction },
        );

        await queryInterface.bulkInsert(
          'files',
          [
            {
              name: legacyName,
              data,
              type: storedFile.type,
              encoding: '7bit',
              size: storedFile.size,
              moduleId: storedFile.moduleId,
              createdAt: storedFile.createdAt,
              updatedAt: new Date(),
            },
          ],
          { transaction },
        );
      }

      await queryInterface.dropTable('storedFiles', { transaction });

      const legacyRenames = Object.fromEntries(
        Object.entries(FIELD_RENAMES).map(([from, to]) => [to, from]),
      );
      await updateFileFields(
        queryInterface,
        getLegacyFileFields(new Date()),
        legacyRenames,
        transaction,
      );
    });
  },
};
