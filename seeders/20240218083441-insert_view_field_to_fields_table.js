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
        await queryInterface.bulkInsert(
            'Fields',
            [
                {
                    moduleId: moduleId.views,
                    name: 'label',
                    label: 'Label',
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
                {
                    moduleId: moduleId.views,
                    name: 'page',
                    label: 'Page',
                    inputType: inputType.longText,
                    dataType: dataType.text,
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
