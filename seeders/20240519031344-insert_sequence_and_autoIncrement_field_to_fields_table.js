'use strict';

const dayjs = require('dayjs');

const dataType = require('../constats/dataType');
const datetimeFormat = require('../constats/datetimeFormat');
const inputType = require('../constats/inputType');
const moduleId = require('../constats/moduleId');

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
                    moduleId: moduleId.fields,
                    name: 'sequence',
                    label: 'Sequence',
                    inputType: inputType.number,
                    dataType: dataType.integer,
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
                {
                    moduleId: moduleId.fields,
                    name: 'autoIncrement',
                    label: 'Auto Increment',
                    inputType: inputType.toggle,
                    dataType: dataType.boolean,
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
