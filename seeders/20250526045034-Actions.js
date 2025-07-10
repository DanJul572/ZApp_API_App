'use strict';

const dayjs = require('dayjs');

const datetimeFormat = require('../constats/datetimeFormat');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = dayjs().format(datetimeFormat.datetime.value);
    await queryInterface.bulkInsert(
      'Actions',
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
    await queryInterface.bulkDelete('Actions', null, {});
  },
};
