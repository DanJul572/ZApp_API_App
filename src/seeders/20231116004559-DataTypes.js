'use strict';

const dayjs = require('dayjs');

const enums = require('../enums');

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
      'datatypes',
      [
        {
          label: 'Varchar',
          value: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          label: 'Text',
          value: 2,
          createdAt: now,
          updatedAt: now,
        },
        {
          label: 'Integer',
          value: 3,
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 4,
          label: 'Boolean',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 5,
          label: 'Table Reference',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 6,
          label: 'Datetime',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 7,
          label: 'Byte',
          createdAt: now,
          updatedAt: now,
        },
        {
          value: 8,
          label: 'JSON',
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

    await queryInterface.bulkDelete('datatypes', null, {});
  },
};
