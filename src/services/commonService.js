const enums = require('../enums');

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

async function insertFile(files, moduleId, transaction) {
  return await fileQuery.save(files, moduleId, transaction);
}

async function deleteFile(fields, detailData, transaction) {
  return await fileQuery.delete(fields, detailData, transaction);
}

async function insertData(table, data, user, transaction) {
  return await commonQuery.insertRow(table, data, user, transaction);
}

async function getData(moduleName, fields, page, filter, sort, defaultFilter) {
  return await commonQuery.getRows(moduleName, fields, page, filter, sort, defaultFilter);
}

async function getDetailData(tableName, rowId, primaryFieldName) {
  return await commonQuery.getRowDetail(tableName, rowId, primaryFieldName);
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

async function insertInternalError(request, code, message) {
  if (code !== enums.statusCode.INTERNAL_SERVER_ERROR) {
    return;
  }
  const url = request.originalUrl;
  const method = request.method;
  const data = {
    url,
    method,
    message,
  };
  return await commonQuery.insertRow('logerror', data);
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
  insertInternalError,
};
