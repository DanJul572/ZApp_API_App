const jsreportClient = require('@jsreport/nodejs-client');

const commonQuery = require('../queries/commonQuery');
const scriptQuery = require('../queries/scriptQuery');

async function getDataSchema(schemaId) {
  const dataSchema = await commonQuery.getRowDetail('jsreportdataschema', schemaId, 'id');
  return dataSchema ? dataSchema : null;
}

async function getJSReportData(schema) {
  const result = await scriptQuery.executeDataSchema(schema);
  return Object.keys(result).length > 0 ? result : null;
}

async function getJSReport(templateName, templateType, data) {
  const url = process.env.JSREPORT_URL;
  const user = process.env.JSREPORT_USER;
  const pass = process.env.JSREPORT_PASS;

  const recipeMap = {
    pdf: 'chrome-pdf',
    html: 'html',
  };

  const client = jsreportClient(url, user, pass);

  return await client.render({
    template: {
      name: templateName,
      recipe: recipeMap[templateType],
    },
    data: data,
  });
}

module.exports = {
  getDataSchema,
  getJSReport,
  getJSReportData,
};
