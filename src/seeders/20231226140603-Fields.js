'use strict';

const access = require('./fields/access');
const actions = require('./fields/actions');
const dataTypes = require('./fields/dataTypes');
const fields = require('./fields/fields');
const files = require('./fields/files');
const inputTypes = require('./fields/inputTypes');
const jsReportDataSchema = require('./fields/jsReportDataSchema');
const logError = require('./fields/logError');
const menus = require('./fields/menus');
const modules = require('./fields/modules');
const roles = require('./fields/roles');
const script = require('./fields/script');
const users = require('./fields/users');
const validation = require('./fields/validation');
const validationTime = require('./fields/validationTime');
const views = require('./fields/views');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const combine = modules.concat(
      access,
      actions,
      dataTypes,
      fields,
      files,
      inputTypes,
      jsReportDataSchema,
      logError,
      menus,
      roles,
      script,
      users,
      validation,
      validationTime,
      views,
    );
    await queryInterface.bulkInsert('fields', combine, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('fields', null, {});
  },
};
