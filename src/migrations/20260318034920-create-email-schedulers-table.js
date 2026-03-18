'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emailSchedulers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      startTime: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      endTime: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      emailId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      emailSchedulerTypeId: {
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
    await queryInterface.dropTable('emailSchedulers');
  },
};
