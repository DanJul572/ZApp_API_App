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
                    name: 'Tokens',
                    label: 'Tokens',
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
