'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auditTrails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      moduleId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      moduleName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      rowId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      action: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      oldData: {
        type: Sequelize.JSONB,
      },
      newData: {
        type: Sequelize.JSONB,
      },
      changes: {
        type: Sequelize.JSONB,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      userName: {
        type: Sequelize.STRING,
      },
      ipAddress: {
        type: Sequelize.STRING,
      },
      userAgent: {
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
    });

    await queryInterface.addIndex('auditTrails', ['moduleId', 'rowId']);
    await queryInterface.addIndex('auditTrails', ['userId']);
    await queryInterface.addIndex('auditTrails', ['createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('auditTrails');
  },
};
