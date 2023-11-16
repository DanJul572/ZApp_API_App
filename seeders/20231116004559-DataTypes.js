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
                    label: 'Auto Increment',
                    value: 1,
                },
                {
                    label: 'Varchar',
                    value: 2,
                },
                {
                    label: 'Text',
                    value: 3,
                },
                {
                    value: 4,
                    label: 'Integer',
                },
                {
                    value: 5,
                    label: 'Boolean',
                },
                {
                    value: 6,
                    label: 'Table Reference',
                },
                {
                    value: 7,
                    label: 'Datetime',
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
