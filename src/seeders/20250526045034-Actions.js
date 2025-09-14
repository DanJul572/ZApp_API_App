'use strict';

const dayjs = require('dayjs');

const dateTimeFormatConfig = require('../config/datetimeFormat');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = dayjs().format(dateTimeFormatConfig.datetime.value);
    await queryInterface.bulkInsert(
      'actions',
      [
        {
          label: 'View',
          createdAt: now,
          updatedAt: now,
        },
        {
          label: 'Create',
          createdAt: now,
          updatedAt: now,
        },
        {
          label: 'Update',
          createdAt: now,
          updatedAt: now,
        },
        {
          label: 'Delete',
          createdAt: now,
          updatedAt: now,
        },
        {
          label: 'Detail',
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('actions', null, {});
  },
};
