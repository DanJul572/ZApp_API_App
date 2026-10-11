'use strict';

const emailModules = require('./modules/emailModules');
const { registerModules, unregisterModules } = require('./modules/registerModules');

/**
 * Registers the email tables in modules and fields.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    await registerModules(queryInterface, emailModules);
  },

  // Removes the modules and their fields only; the email tables themselves are kept.
  async down(queryInterface) {
    await unregisterModules(queryInterface, emailModules);
  },
};
