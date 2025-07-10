'use strict';

const dayjs = require('dayjs');

const datetimeFormat = require('../constats/datetimeFormat');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = dayjs().format(datetimeFormat.datetime.value);
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          label: 'Developer',
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
