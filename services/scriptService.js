const commonQuery = require('../queries/commonQuery');
const fieldQuery = require('../queries/fieldQuery');
const moduleQuery = require('../queries/moduleQuery');
const scriptQuery = require('../queries/scriptQuery');

async function getDetailData(tableName, rowId, primaryKeyName) {
  return await commonQuery.getRowDetail(tableName, rowId, primaryKeyName);
}

async function getModuleById(moduleId) {
  return await moduleQuery.getModule(moduleId);
}

async function getModuleFields(moduleId) {
  return await fieldQuery.getFields(moduleId);
}

async function executeScript(sql) {
  return await scriptQuery.run(sql);
}

module.exports = {
  executeScript,
  getDetailData,
  getModuleById,
  getModuleFields,
};
