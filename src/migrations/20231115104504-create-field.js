'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fields', {
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
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      label: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      inputType: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      dataType: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      tableRef: {
        type: Sequelize.STRING,
      },
      tableRefKey: {
        type: Sequelize.STRING,
      },
      tableRefName: {
        type: Sequelize.STRING,
      },
      tableRefAlias: {
        type: Sequelize.STRING,
      },
      tableRefFilter: {
        type: Sequelize.STRING,
      },
      regex: {
        type: Sequelize.STRING,
      },
      multiSelect: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      identity: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      autoIncrement: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      notNull: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      unique: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      sequence: {
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
    await queryInterface.dropTable('fields');
  },
};
