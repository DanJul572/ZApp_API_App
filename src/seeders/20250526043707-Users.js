'use strict';

const dayjs = require('dayjs');
const bcryptjs = require('bcryptjs');

const dateTimeFormatConfig = require('../config/datetimeFormat');

const jwtConfig = require('../config/jwt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = dayjs().format(dateTimeFormatConfig.datetime.value);
    const hashedPassword = await bcryptjs.hash('devpass', jwtConfig.salt);

    await queryInterface.bulkInsert(
      'users',
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
    await queryInterface.bulkDelete('users', null, {});
  },
};
