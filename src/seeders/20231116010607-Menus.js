'use strict';

const dayjs = require('dayjs');

const dateTimeFormatConfig = require('../config/datetimeFormat');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const now = dayjs().format(dateTimeFormatConfig.datetime.value);
    const tree = JSON.stringify([
      {
        id: '1',
        label: 'Template',
        url: '',
        child: [
          {
            id: '2',
            label: 'Module',
            url: '/module',
            icon: null,
          },
          {
            id: '5',
            label: 'View',
            url: '/view',
            icon: null,
          },
          {
            id: '4',
            label: 'Menu',
            url: '/menu',
            icon: null,
          },
        ],
      },
    ]);

    await queryInterface.bulkInsert(
      'menus',
      [
        {
          label: 'Dev Menu',
          tree: tree,
          roleId: 1,
          afterLogin: '/module',
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('menus', null, {});
  },
};
