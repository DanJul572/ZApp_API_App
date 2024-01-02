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
        await queryInterface.bulkInsert(
            'Modules',
            [
                {
                    name: 'Views',
                    label: 'Views',
                },
                {
                    name: 'Modules',
                    label: 'Modules',
                },
                {
                    name: 'Menus',
                    label: 'Menus',
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
