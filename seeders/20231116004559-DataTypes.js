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
            'DataTypes',
            [
                {
                    label: 'Varchar',
                    value: 1,
                },
                {
                    label: 'Text',
                    value: 2,
                },
                {
                    label: 'Integer',
                    value: 3,
                },
                {
                    value: 4,
                    label: 'Boolean',
                },
                {
                    value: 5,
                    label: 'Table Reference',
                },
                {
                    value: 6,
                    label: 'Datetime',
                },
                {
                    value: 7,
                    label: 'Byte',
                },
                {
                    value: 8,
                    label: 'JSON',
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

        await queryInterface.bulkDelete('DataTypes', null, {});
    },
};
