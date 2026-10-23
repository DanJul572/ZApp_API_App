const config = require('../config');
const enums = require('../enums');

const commonQuery = require('../queries/commonQuery');
const fieldQuery = require('../queries/fieldQuery');
const moduleQuery = require('../queries/moduleQuery');
const validationQuery = require('../queries/validationQuery');

async function getModuleById(moduleId) {
  return await moduleQuery.getModule(moduleId);
}

function assertWritableModule(module) {
  if (config.audit.readOnlyModuleIds.includes(module.id)) {
    throw new Error(`${enums.statusCode.METHOD_NOT_ALLOWED}:${module.label} is read-only`);
  }
}

async function getModuleFields(moduleId) {
  return await fieldQuery.getFields(moduleId);
}

async function getPrimaryField(moduleId) {
  return await fieldQuery.getPrimaryField(moduleId);
}

async function runValidationBefore(data, moduleId, actionId, user, transaction) {
  return await validationQuery.runValidation(
    data,
    moduleId,
    actionId,
    enums.validationTimeId.before,
    user,
    transaction,
  );
}

async function runValidationAfter(data, moduleId, actionId, user, transaction) {
  return await validationQuery.runValidation(
    data,
    moduleId,
    actionId,
    enums.validationTimeId.after,
    user,
    transaction,
  );
}

async function insertData(table, data, transaction) {
  return await commonQuery.insertRow(table, data, transaction);
}

async function getData(moduleName, fields, page, filter, sort, defaultFilter) {
  return await commonQuery.getRows(moduleName, fields, page, filter, sort, defaultFilter);
}

async function getDetailData(tableName, rowId, primaryFieldName, transaction) {
  return await commonQuery.getRowDetail(tableName, rowId, primaryFieldName, transaction);
}

async function deleteData(tableName, primaryFieldName, rowId, transaction) {
  return await commonQuery.deleteRow(tableName, primaryFieldName, rowId, transaction);
}

async function getFieldOptions(field) {
  return await commonQuery.getOptions(field);
}

async function getField(id) {
  return await fieldQuery.getField(id);
}

async function updateData(tableName, primaryFieldName, rowId, data, transaction) {
  return await commonQuery.updateRow(tableName, primaryFieldName, rowId, data, transaction);
}

async function getMenu(roleId) {
  return await commonQuery.getMenu(roleId);
}

module.exports = {
  assertWritableModule,
  deleteData,
  getData,
  getDetailData,
  getField,
  getFieldOptions,
  getMenu,
  getModuleById,
  getModuleFields,
  getPrimaryField,
  insertData,
  runValidationAfter,
  runValidationBefore,
  updateData,
};
