'use strict';

const dayjs = require('dayjs');

const enums = require('@enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = dayjs().format(enums.datetimeFormat.datetime.value);
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
