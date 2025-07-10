const fieldQuery = require('../queries/fieldQuery');
const fileQuery = require('../queries/fileQuery');
const moduleQuery = require('../queries/moduleQuery');

async function getModuleById(moduleId) {
  return await moduleQuery.getModule(moduleId);
}

async function getModuleFields(moduleId) {
  return await fieldQuery.getFields(moduleId);
}

async function generateTable(name, fields) {
  return await moduleQuery.createTable(name, fields);
}

async function dropTable(tableName, identityFieldName) {
  return await moduleQuery.dropTable(tableName, identityFieldName);
}

async function deleteFiles(moduleId) {
  return await fileQuery.deleteByModuleId(moduleId);
}

async function deleteFields(moduleId) {
  return await fieldQuery.deleteFields(moduleId);
}

module.exports = {
  deleteFields,
  deleteFiles,
  dropTable,
  generateTable,
  getModuleById,
  getModuleFields,
};
