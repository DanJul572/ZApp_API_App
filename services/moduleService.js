const commonQuery = require('@queries/commonQuery');
const fieldQuery = require('@queries/fieldQuery');
const fileQuery = require('@queries/fileQuery');
const moduleQuery = require('@queries/moduleQuery');

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

async function insertModule(data, transaction) {
  delete data.fields;
  return await commonQuery.insertRow('Modules', data, transaction);
}

async function insertFields(data) {
  return await commonQuery.insertManyRows('Fields', data);
}

async function deleteModule(id, transaction) {
  return await commonQuery.deleteRow('Modules', 'id', id, transaction);
}

module.exports = {
  deleteFields,
  deleteFiles,
  deleteModule,
  dropTable,
  generateTable,
  getModuleById,
  getModuleFields,
  insertFields,
  insertModule,
};
