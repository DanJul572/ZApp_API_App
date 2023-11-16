'use strict';

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
                    },
                    {
                        id: '5',
                        label: 'View',
                        url: '/view',
                    },
                    {
                        id: '4',
                        label: 'Menu',
                        url: '/menu',
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
