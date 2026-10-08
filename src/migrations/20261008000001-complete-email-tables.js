'use strict';

const dayjs = require('dayjs');

const enums = require('../enums');
const dateTimeFormatConfig = require('../config/datetimeFormat');

const lookups = {
  emailDataSourceTypes: [
    { id: enums.emailDataSourceType.primary, label: 'Primary' },
    { id: enums.emailDataSourceType.optional, label: 'Optional' },
  ],
  emailPriorityLevels: [
    { id: enums.emailPriorityLevel.high, label: 'High' },
    { id: enums.emailPriorityLevel.normal, label: 'Normal' },
    { id: enums.emailPriorityLevel.low, label: 'Low' },
  ],
  emailSchedulerTypes: [
    { id: enums.emailSchedulerType.days, label: 'Days' },
    { id: enums.emailSchedulerType.month, label: 'Month' },
    { id: enums.emailSchedulerType.year, label: 'Year' },
  ],
};

// Child tables that belong to one email and are removed together with it.
const emailChildTables = [
  'emailAttachments',
  'emailBCC',
  'emailCC',
  'emailDataSources',
  'emailSchedulers',
  'emailSettings',
  'emailTags',
];

const lookupForeignKeys = [
  { table: 'emailDataSources', field: 'emailDataSourceTypeId', ref: 'emailDataSourceTypes' },
  { table: 'emailSchedulers', field: 'emailSchedulerTypeId', ref: 'emailSchedulerTypes' },
  { table: 'emailSettings', field: 'emailPriorityLevelId', ref: 'emailPriorityLevels' },
];

// An email has at most one scheduler and one settings row.
const oneToOneTables = ['emailSchedulers', 'emailSettings'];

/**
 * Completes the email tables so they hold everything the email builder form sends:
 * recipients, subject, the editor design, the SQL data sources and the lookup rows.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const sequelize = queryInterface.sequelize;
    const now = dayjs().format(dateTimeFormatConfig.datetime.value);

    await sequelize.transaction(async transaction => {
      await queryInterface.changeColumn(
        'emails',
        'name',
        { allowNull: false, type: Sequelize.STRING },
        { transaction },
      );
      await queryInterface.changeColumn(
        'emails',
        'description',
        { type: Sequelize.TEXT },
        { transaction },
      );
      await queryInterface.addColumn('emails', 'to', { type: Sequelize.TEXT }, { transaction });
      await queryInterface.addColumn(
        'emails',
        'subject',
        { type: Sequelize.STRING },
        { transaction },
      );
      await queryInterface.addColumn(
        'emails',
        'design',
        { type: Sequelize.JSONB },
        { transaction },
      );
      await queryInterface.addColumn(
        'emails',
        'useScheduler',
        { allowNull: false, defaultValue: false, type: Sequelize.BOOLEAN },
        { transaction },
      );

      // emailDataSourceTypes is a lookup (primary / optional), not a row per email.
      await queryInterface.removeColumn('emailDataSourceTypes', 'emailId', { transaction });

      await queryInterface.createTable(
        'emailDataSources',
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
          query: {
            allowNull: false,
            type: Sequelize.TEXT,
          },
          emailId: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          emailDataSourceTypeId: {
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

      for (const [table, rows] of Object.entries(lookups)) {
        const existing = await sequelize.query(`SELECT "id" FROM "${table}"`, {
          transaction,
          type: sequelize.QueryTypes.SELECT,
        });
        const existingIds = existing.map(row => row.id);
        const missingRows = rows
          .filter(row => !existingIds.includes(row.id))
          .map(row => ({ ...row, createdAt: now, updatedAt: now }));

        if (missingRows.length) {
          await queryInterface.bulkInsert(table, missingRows, { transaction });
        }

        await sequelize.query(
          `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), (SELECT MAX("id") FROM "${table}"))`,
          { transaction },
        );
      }

      for (const table of emailChildTables) {
        await queryInterface.addConstraint(table, {
          fields: ['emailId'],
          type: 'foreign key',
          name: `${table}_emailId_fkey`,
          references: { table: 'emails', field: 'id' },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          transaction,
        });
      }

      for (const foreignKey of lookupForeignKeys) {
        await queryInterface.addConstraint(foreignKey.table, {
          fields: [foreignKey.field],
          type: 'foreign key',
          name: `${foreignKey.table}_${foreignKey.field}_fkey`,
          references: { table: foreignKey.ref, field: 'id' },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
          transaction,
        });
      }

      for (const table of oneToOneTables) {
        await queryInterface.addConstraint(table, {
          fields: ['emailId'],
          type: 'unique',
          name: `${table}_emailId_key`,
          transaction,
        });
      }
    });
  },

  async down(queryInterface, Sequelize) {
    const sequelize = queryInterface.sequelize;

    await sequelize.transaction(async transaction => {
      for (const table of oneToOneTables) {
        await queryInterface.removeConstraint(table, `${table}_emailId_key`, { transaction });
      }

      for (const foreignKey of lookupForeignKeys) {
        await queryInterface.removeConstraint(
          foreignKey.table,
          `${foreignKey.table}_${foreignKey.field}_fkey`,
          { transaction },
        );
      }

      for (const table of emailChildTables) {
        await queryInterface.removeConstraint(table, `${table}_emailId_fkey`, { transaction });
      }

      await queryInterface.dropTable('emailDataSources', { transaction });

      for (const [table, rows] of Object.entries(lookups)) {
        await queryInterface.bulkDelete(table, { id: rows.map(row => row.id) }, { transaction });
      }

      await queryInterface.addColumn(
        'emailDataSourceTypes',
        'emailId',
        { allowNull: false, type: Sequelize.INTEGER },
        { transaction },
      );

      await queryInterface.removeColumn('emails', 'useScheduler', { transaction });
      await queryInterface.removeColumn('emails', 'design', { transaction });
      await queryInterface.removeColumn('emails', 'subject', { transaction });
      await queryInterface.removeColumn('emails', 'to', { transaction });
      await queryInterface.changeColumn(
        'emails',
        'description',
        { type: Sequelize.STRING },
        { transaction },
      );
      await queryInterface.changeColumn(
        'emails',
        'name',
        { allowNull: true, type: Sequelize.STRING },
        { transaction },
      );
    });
  },
};
