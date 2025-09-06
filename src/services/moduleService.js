const commonQuery = require('../queries/commonQuery');
const fieldQuery = require('../queries/fieldQuery');
const fileQuery = require('../queries/fileQuery');
const moduleQuery = require('../queries/moduleQuery');

async function getModuleById(moduleId) {
  return await moduleQuery.getModule(moduleId);
}

async function getModuleFields(moduleId) {
  return await fieldQuery.getFields(moduleId);
}

async function generateTable(name, fields, transaction) {
  return await moduleQuery.createTable(name, fields, transaction);
}

async function dropTable(tableName, identityFieldName, transaction) {
  return await moduleQuery.dropTable(tableName, identityFieldName, transaction);
}

async function deleteFiles(moduleId, transaction) {
  return await fileQuery.deleteByModuleId(moduleId, transaction);
}

async function deleteFields(moduleId, transaction) {
  return await fieldQuery.deleteFields(moduleId, transaction);
}

async function insertModule(data, transaction) {
  delete data.fields;
  return await commonQuery.insertRow('Modules', data, transaction);
}

async function insertFields(data, transaction) {
  return await commonQuery.insertManyRows('Fields', data, transaction);
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
