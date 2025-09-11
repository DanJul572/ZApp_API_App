'use strict';

const dayjs = require('dayjs');

const enums = require('../enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = dayjs().format(enums.datetimeFormat.datetime.value);
    await queryInterface.bulkInsert(
      'validationtimes',
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
    await queryInterface.bulkDelete('validationtimes', null, {});
  },
};
