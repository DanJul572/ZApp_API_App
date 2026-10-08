'use strict';

/**
 * One row per email that is ready to send: the template's merge tags are already replaced, so
 * the worker app only has to read the row and send it. The row also serves as the email log.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'emailExecutions',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          // Groups the rows created by one send (one row per primary source record).
          batchId: {
            allowNull: false,
            type: Sequelize.UUID,
          },
          // Kept as NULL when the template is deleted, so its log stays.
          emailId: {
            type: Sequelize.INTEGER,
            references: { model: 'emails', key: 'id' },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          emailName: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          trigger: {
            allowNull: false,
            type: Sequelize.STRING(20),
          },
          to: {
            type: Sequelize.TEXT,
          },
          cc: {
            type: Sequelize.TEXT,
          },
          bcc: {
            type: Sequelize.TEXT,
          },
          subject: {
            type: Sequelize.TEXT,
          },
          body: {
            type: Sequelize.TEXT,
          },
          priority: {
            allowNull: false,
            defaultValue: 'normal',
            type: Sequelize.STRING(10),
          },
          status: {
            allowNull: false,
            defaultValue: 'onQueue',
            type: Sequelize.STRING(20),
          },
          errorMessage: {
            type: Sequelize.TEXT,
          },
          attempts: {
            allowNull: false,
            defaultValue: 0,
            type: Sequelize.INTEGER,
          },
          sentAt: {
            type: Sequelize.DATE,
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

      await queryInterface.addIndex('emailExecutions', ['status'], { transaction });
      await queryInterface.addIndex('emailExecutions', ['batchId'], { transaction });
      await queryInterface.addIndex('emailExecutions', ['emailId'], { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('emailExecutions');
  },
};
