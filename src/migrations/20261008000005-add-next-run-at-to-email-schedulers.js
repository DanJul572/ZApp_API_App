'use strict';

/**
 * Stores when a scheduled email is sent next, so the scheduler job can find due emails and
 * never sends the same occurrence twice. Existing schedules start at their start time; the job
 * moves past occurrences that are already over.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.addColumn(
        'emailSchedulers',
        'nextRunAt',
        { type: Sequelize.DATE },
        { transaction },
      );
      await queryInterface.sequelize.query(
        'UPDATE "emailSchedulers" SET "nextRunAt" = "startTime"',
        { transaction },
      );
      await queryInterface.addIndex('emailSchedulers', ['nextRunAt'], { transaction });
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('emailSchedulers', 'nextRunAt');
  },
};
