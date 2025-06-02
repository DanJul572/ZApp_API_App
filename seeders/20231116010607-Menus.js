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
        const now = dayjs().format(datetimeFormat.datetime.value);
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
            'Menus',
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

        await queryInterface.bulkDelete('Menus', null, {});
    },
};
