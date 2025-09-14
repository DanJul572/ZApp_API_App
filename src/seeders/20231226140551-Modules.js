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

    await queryInterface.bulkInsert(
      'modules',
      [
        {
          name: 'modules',
          label: 'Modules',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'roles',
          label: 'Roles',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'inputtypes',
          label: 'Input Types',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'datatypes',
          label: 'Data Types',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'fields',
          label: 'Fields',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'files',
          label: 'Files',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'views',
          label: 'Views',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'menus',
          label: 'Menus',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'users',
          label: 'Users',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'scripts',
          label: 'Scripts',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'actions',
          label: 'Actions',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'access',
          label: 'Access',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'validationtimes',
          label: 'Validation Times',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'validations',
          label: 'Validations',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'logerror',
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
    await queryInterface.bulkDelete('modules', null, {});
  },
};
