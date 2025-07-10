const decodeToken = require('./decodeToken');
const findValidTokenForUser = require('./findValidTokenForUser');
const generateColumnByField = require('./generateColumnByField');
const getErrorResponse = require('./getErrorResponse');
const insertError = require('./insertError');
const jsonToWhereClause = require('./jsonToWhereClause');
const replacePlaceholders = require('./replacePlaceholders');

module.exports = {
  decodeToken,
  findValidTokenForUser,
  generateColumnByField,
  getErrorResponse,
  insertError,
  jsonToWhereClause,
  replacePlaceholders,
};
