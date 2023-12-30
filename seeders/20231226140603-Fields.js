'use strict';

const data_type = require('../constats/data_type');
const input_type = require('../constats/input_type');

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
                    moduleId: 1,
                    name: 'id',
                    label: 'ID',
                    inputType: input_type.number,
                    dataType: data_type.integer,
                    tableRef: null,
                    tableRefKey: null,
                    tableRefName: null,
                    tableRefAlias: null,
                    tableRefFilter: null,
                    regex: null,
                    multiSelect: false,
                    identity: true,
                    notNull: true,
                    unique: true,
                },
                {
                    moduleId: 1,
                    name: 'moduleId',
                    label: 'Module ID',
                    inputType: input_type.dropdown,
                    dataType: data_type.tableReference,
                    tableRef: 'Modules',
                    tableRefKey: 'id',
                    tableRefName: 'name',
                    tableRefAlias: null,
                    tableRefFilter: null,
                    regex: null,
                    multiSelect: false,
                    identity: false,
                    notNull: true,
                    unique: false,
                },
                {
                    moduleId: 1,
                    name: 'content',
                    label: 'Content',
                    inputType: input_type.code,
                    dataType: data_type.json,
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
