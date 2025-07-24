'use strict';

const dayjs = require('dayjs');
const bcryptjs = require('bcryptjs');

const enums = require('@enums');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = dayjs().format(enums.datetimeFormat.datetime.value);
    const hashedPassword = await bcryptjs.hash('devpass', enums.auth.salt);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Dev',
          email: 'dev@zapp.com',
          password: hashedPassword,
          roleId: 1,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
