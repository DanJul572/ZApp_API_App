'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auditLogins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      action: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      reason: {
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

    await queryInterface.addIndex('auditLogins', ['email']);
    await queryInterface.addIndex('auditLogins', ['createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('auditLogins');
  },
};
