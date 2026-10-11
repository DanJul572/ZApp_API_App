'use strict';

/**
 * The API no longer builds emails itself.
 *
 * - "emailSendRequests" has one row per send (manual, test or scheduled). The API (or the
 *   worker app's scheduler) inserts it; the worker app builds its emails into "emailExecutions".
 *   Its id is the "batchId" of those rows.
 * - "emailExecutions"."publishedAt" is set when the worker app has handed the row to the email
 *   sender app. Rows on queue without it are picked up again by the worker app's sweep.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'emailSendRequests',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
          },
          // Kept as NULL when the template is deleted; the worker app then fails the request.
          emailId: {
            type: Sequelize.INTEGER,
            references: { model: 'emails', key: 'id' },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          trigger: {
            allowNull: false,
            type: Sequelize.STRING(20),
          },
          // Only for a test send: the one address it goes to.
          testRecipient: {
            type: Sequelize.STRING,
          },
          status: {
            allowNull: false,
            defaultValue: 'pending',
            type: Sequelize.STRING(20),
          },
          errorMessage: {
            type: Sequelize.TEXT,
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
      await queryInterface.addIndex('emailSendRequests', ['status', 'updatedAt'], {
        transaction,
      });

      await queryInterface.addColumn(
        'emailExecutions',
        'publishedAt',
        { type: Sequelize.DATE },
        { transaction },
      );
      // Every existing row was already published by the API.
      await queryInterface.sequelize.query(
        'UPDATE "emailExecutions" SET "publishedAt" = "updatedAt"',
        { transaction },
      );
      await queryInterface.addIndex('emailExecutions', ['status', 'publishedAt'], {
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.removeColumn('emailExecutions', 'publishedAt', { transaction });
      await queryInterface.dropTable('emailSendRequests', { transaction });
    });
  },
};
