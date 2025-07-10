const validationTimeId = require('../constats/validationTimeId');

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

async function runValidationBefore(data, moduleId, actionId, user) {
  return await validationQuery.runValidation(
    data,
    moduleId,
    actionId,
    validationTimeId.before,
    user,
  );
}

async function runValidationAfter(data, moduleId, actionId, user) {
  return await validationQuery.runValidation(
    data,
    moduleId,
    actionId,
    validationTimeId.after,
    user,
  );
}

async function insertFile(files, moduleId) {
  return await fileQuery.save(files, moduleId);
}

async function deleteFile(fields, detailData) {
  await fileQuery.delete(fields, detailData);
}

async function insertData(moduleId, data, user) {
  return await commonQuery.insertRow(moduleId, data, user);
}

async function getData(
  moduleName,
  fields,
  page,
  advanceFilter,
  filter,
  sort,
  defaultFilter,
) {
  return commonQuery.getRows(
    moduleName,
    fields,
    page,
    advanceFilter,
    filter,
    sort,
    defaultFilter,
  );
}

async function getDetailData(tableName, rowId, primaryFieldName) {
  return await commonQuery.getRowDetail(tableName, rowId, primaryFieldName);
}

async function deleteData(tableName, primaryFieldName, rowId) {
  return commonQuery.deleteRow(tableName, primaryFieldName, rowId);
}

async function getFieldOptions(field) {
  return await commonQuery.getOptions(field);
}

async function getField(id) {
  return await fieldQuery.getField(id);
}

async function updateData(primaryFieldName, rowId, data) {
  return await commonQuery.updateRow(primaryFieldName, rowId, data);
}

async function getMenu(roleId) {
  return await commonQuery.getMenu(roleId);
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
};
