'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Files', {
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
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Files');
  },
};
