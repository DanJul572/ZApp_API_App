'use strict';
const dayjs = require('dayjs');

const dataType = require('../constats/dataType');
const inputType = require('../constats/inputType');
const moduleId = require('../constats/moduleId');
const datetimeFormat = require('../constats/datetimeFormat');

const now = dayjs().format(datetimeFormat.datetime.value);

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
            'Fields',
            [
                {
                    moduleId: moduleId.menus,
                    name: 'afterLogin',
                    label: 'After Login',
                    inputType: inputType.shortText,
                    dataType: dataType.varchar,
                    tableRef: null,
                    tableRefKey: null,
                    tableRefName: null,
                    tableRefAlias: null,
                    tableRefFilter: null,
                    regex: null,
                    multiSelect: false,
                    identity: false,
                    notNull: false,
                    unique: false,
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
        await queryInterface.bulkDelete('Fields', null, {});
    },
};
