'use strict';

const dayjs = require('dayjs');

const datetimeFormat = require('../constats/datetimeFormat');

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
        const now = dayjs().format(datetimeFormat.datetime);

        await queryInterface.bulkInsert(
            'Modules',
            [
                {
                    name: 'Views',
                    label: 'Views',
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    name: 'Modules',
                    label: 'Modules',
                    createdAt: now,
                    updatedAt: now,
                },
                {
                    name: 'Menus',
                    label: 'Menus',
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
