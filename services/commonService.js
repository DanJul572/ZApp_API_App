const validationTimeId = require('../enums/validationTimeId');

const commonQuery = require('../queries/commonQuery');
const fieldQuery = require('../queries/fieldQuery');
const fileQuery = require('../queries/fileQuery');
const moduleQuery = require('../queries/moduleQuery');
const validationQuery = require('../queries/validationQuery');

async function getModuleById(moduleId) {
  return await moduleQuery.getModule(moduleId);
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
    validationTimeId.before,
    user,
    transaction,
  );
}

async function runValidationAfter(data, moduleId, actionId, user, transaction) {
  return await validationQuery.runValidation(
    data,
    moduleId,
    actionId,
    validationTimeId.after,
    user,
    transaction,
  );
}

async function insertFile(files, moduleId, transaction) {
  return await fileQuery.save(files, moduleId, transaction);
}

async function deleteFile(fields, detailData, transaction) {
  await fileQuery.delete(fields, detailData, transaction);
}

async function insertData(table, data, user, transaction) {
  return await commonQuery.insertRow(table, data, user, transaction);
}

async function getData(moduleName, fields, page, advanceFilter, filter, sort, defaultFilter) {
  return commonQuery.getRows(moduleName, fields, page, advanceFilter, filter, sort, defaultFilter);
}

async function getDetailData(tableName, rowId, primaryFieldName) {
  return await commonQuery.getRowDetail(tableName, rowId, primaryFieldName);
}

async function deleteData(tableName, primaryFieldName, rowId, transaction) {
  return commonQuery.deleteRow(tableName, primaryFieldName, rowId, transaction);
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

async function insertError(request, code, message) {
  if (code !== 500) {
    return;
  }
  const url = request.originalUrl;
  const method = request.method;
  const data = {
    url,
    method,
    message,
  };
  return await commonQuery.insertRow('LogError', data);
}

module.exports = {
  deleteData,
  deleteFile,
  getData,
  getDetailData,
  getField,
  getFieldOptions,
  getMenu,
  getModuleById,
  getModuleFields,
  getPrimaryField,
  insertData,
  insertFile,
  runValidationAfter,
  runValidationBefore,
  updateData,
  insertError,
};
