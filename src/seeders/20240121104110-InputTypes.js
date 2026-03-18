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
      'inputTypes',
      [
        {
          value: 1,
          label: 'Short Text',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 2,
          label: 'Long Text',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 3,
          label: 'Dropdown',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 4,
          label: 'Number',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 5,
          label: 'Toggle',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 6,
          label: 'Date',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 7,
          label: 'Time',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 8,
          label: 'File',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 9,
          label: 'Rich Text',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 10,
          label: 'Radio',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 11,
          label: 'Check Box',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 12,
          label: 'Code',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 13,
          label: 'Date Time',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 14,
          label: 'Password',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 15,
          label: 'Slider',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 16,
          label: 'Ratings',
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
    await queryInterface.bulkDelete('inputTypes', null, {});
  },
};
