'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emailAttachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fileName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mimeType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      fileSize: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      fileBuffer: {
        allowNull: false,
        type: Sequelize.BLOB('long'),
      },
      emailId: {
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
    await queryInterface.dropTable('emailAttachments');
  },
};
