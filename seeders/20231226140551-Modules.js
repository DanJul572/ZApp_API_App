'use strict';

const dayjs = require('dayjs');

const enums = require('@enums');

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
    const now = dayjs().format(enums.datetimeFormat.datetime.value);

    await queryInterface.bulkInsert(
      'Modules',
      [
        {
          name: 'Modules',
          label: 'Modules',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Roles',
          label: 'Roles',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'InputTypes',
          label: 'Input Types',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'DataTypes',
          label: 'Data Types',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Fields',
          label: 'Fields',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Files',
          label: 'Files',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Views',
          label: 'Views',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Menus',
          label: 'Menus',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Users',
          label: 'Users',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Script',
          label: 'Script',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Actions',
          label: 'Actions',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Access',
          label: 'Access',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'ValidationTime',
          label: 'ValidationTime',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Validation',
          label: 'Validation',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'LogError',
          label: 'Log Error',
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
    await queryInterface.bulkDelete('Modules', null, {});
  },
};
