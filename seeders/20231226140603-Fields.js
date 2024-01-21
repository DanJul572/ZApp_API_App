'use strict';

const modules = require('./fields/modules');
const roles = require('./fields/roles');
const inputTypes = require('./fields/inputTypes');
const dataTypes = require('./fields/dataTypes');
const fields = require('./fields/fields');
const views = require('./fields/views');
const menus = require('./fields/menus');
const users = require('./fields/users');
const tokens = require('./fields/tokens');

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
        const combine = modules.concat(roles, inputTypes, dataTypes, fields, views, menus, users, tokens);
        await queryInterface.bulkInsert('Fields', combine, {});
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
