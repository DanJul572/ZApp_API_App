'use strict';

const { registerModules, unregisterModules } = require('./modules/registerModules');
const userModules = require('./modules/userModules');

/**
 * Registers the user tables added after the core modules (User Pictures) in modules and fields.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    await registerModules(queryInterface, userModules);
  },

  async down(queryInterface) {
    await unregisterModules(queryInterface, userModules);
  },
};
