'use strict';

/**
 * "userPictures" holds the profile photo of a user, at most one per user. The file is stored in
 * the database itself.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userPictures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        unique: true,
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('userPictures');
  },
};
