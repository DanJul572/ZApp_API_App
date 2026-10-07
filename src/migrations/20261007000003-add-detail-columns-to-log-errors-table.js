'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('logErrors', 'statusCode', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('logErrors', 'stack', { type: Sequelize.TEXT });
    await queryInterface.addColumn('logErrors', 'requestBody', { type: Sequelize.JSONB });
    await queryInterface.addColumn('logErrors', 'userId', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('logErrors', 'userName', { type: Sequelize.STRING });
    await queryInterface.addColumn('logErrors', 'ipAddress', { type: Sequelize.STRING });

    await queryInterface.addIndex('logErrors', ['createdAt']);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('logErrors', ['createdAt']);

    await queryInterface.removeColumn('logErrors', 'ipAddress');
    await queryInterface.removeColumn('logErrors', 'userName');
    await queryInterface.removeColumn('logErrors', 'userId');
    await queryInterface.removeColumn('logErrors', 'requestBody');
    await queryInterface.removeColumn('logErrors', 'stack');
    await queryInterface.removeColumn('logErrors', 'statusCode');
  },
};
