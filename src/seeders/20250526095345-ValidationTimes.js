'use strict';

const dayjs = require('dayjs');

const dateTimeFormatConfig = require('../config/datetimeFormat');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = dayjs().format(dateTimeFormatConfig.datetime.value);
    await queryInterface.bulkInsert(
      'validationTypes',
      [
        {
          label: 'Before',
          createdAt: now,
          updatedAt: now,
        },
        {
          label: 'After',
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('validationTypes', null, {});
  },
};
