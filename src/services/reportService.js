const commonQuery = require('../queries/commonQuery');
const scriptQuery = require('../queries/scriptQuery');

async function getDataSchema(schemaId) {
  const dataSchema = await commonQuery.getRowDetail('jsreportdataschema', schemaId, 'id');
  return dataSchema.schema;
}

async function getJSReportData(schema) {
  return await scriptQuery.executeDataSchema(schema);
}

async function getJSReport(templateName, templateType, data) {
  const url = process.env.JSREPORT_URL;
  const user = process.env.JSREPORT_USER;
  const pass = process.env.JSREPORT_PASS;

  const recipeMap = {
    pdf: 'chrome-pdf',
    html: 'html',
  };

  const client = require('@jsreport/nodejs-client')(url, user, pass);

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
