const dialect = process.env.DB_DIALECT || 'postgres';

const authBuilder = require(`./${dialect}/authBuilder`);
const commonBuilder = require(`./${dialect}/commonBuilder`);
const fieldBuilder = require(`./${dialect}/fieldBuilder`);
const fileBuilder = require(`./${dialect}/fileBuilder`);
const menuBuilder = require(`./${dialect}/menuBuilder`);
const moduleBuilder = require(`./${dialect}/moduleBuilder`);
const validationBuilder = require(`./${dialect}/validationBuilder`);
const viewBuilder = require(`./${dialect}/viewBuilder`);

module.exports = {
  authBuilder,
  commonBuilder,
  fieldBuilder,
  fileBuilder,
  menuBuilder,
  moduleBuilder,
  validationBuilder,
  viewBuilder,
};
