'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emailSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      openTracking: {
        type: Sequelize.BOOLEAN,
      },
      clickTracking: {
        type: Sequelize.BOOLEAN,
      },
      unsubscribeLink: {
        type: Sequelize.BOOLEAN,
      },
      emailId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      emailPriorityLevelId: {
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
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('emailSettings');
  },
};
