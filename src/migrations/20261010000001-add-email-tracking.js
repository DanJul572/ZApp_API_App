'use strict';

/**
 * Open tracking, click tracking and unsubscribe links.
 *
 * - "emailExecutions"."trackingId" is the random id in the tracking pixel, tracked links and
 *   unsubscribe link of one sent email. "headers" holds extra mail headers (List-Unsubscribe).
 * - "emailClicks" has one row per click on a tracked link.
 * - "emailUnsubscribes" lists the addresses that unsubscribed from a template; they are left
 *   out of its next sends.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      const columns = {
        trackingId: { type: Sequelize.UUID },
        headers: { type: Sequelize.JSONB },
        openedAt: { type: Sequelize.DATE },
        openCount: { allowNull: false, defaultValue: 0, type: Sequelize.INTEGER },
        clickedAt: { type: Sequelize.DATE },
        clickCount: { allowNull: false, defaultValue: 0, type: Sequelize.INTEGER },
        unsubscribedAt: { type: Sequelize.DATE },
      };
      for (const [name, definition] of Object.entries(columns)) {
        await queryInterface.addColumn('emailExecutions', name, definition, { transaction });
      }
      await queryInterface.addIndex('emailExecutions', ['trackingId'], {
        unique: true,
        transaction,
      });

      await queryInterface.createTable(
        'emailClicks',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          emailExecutionId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: { model: 'emailExecutions', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          url: {
            allowNull: false,
            type: Sequelize.TEXT,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );
      await queryInterface.addIndex('emailClicks', ['emailExecutionId'], { transaction });

      await queryInterface.createTable(
        'emailUnsubscribes',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          // Opt-outs of a deleted template no longer apply to anything.
          emailId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: { model: 'emails', key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          // Stored in lower case.
          address: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          // The email whose link was used.
          emailExecutionId: {
            type: Sequelize.INTEGER,
            references: { model: 'emailExecutions', key: 'id' },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
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
      await queryInterface.addIndex('emailUnsubscribes', ['emailId', 'address'], {
        unique: true,
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable('emailUnsubscribes', { transaction });
      await queryInterface.dropTable('emailClicks', { transaction });
      for (const name of [
        'trackingId',
        'headers',
        'openedAt',
        'openCount',
        'clickedAt',
        'clickCount',
        'unsubscribedAt',
      ]) {
        await queryInterface.removeColumn('emailExecutions', name, { transaction });
      }
    });
  },
};
