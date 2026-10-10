const jsreportClient = require('@jsreport/nodejs-client');

const commonQuery = require('../queries/commonQuery');
const scriptQuery = require('../queries/scriptQuery');

async function getDataSchema(schemaId) {
  const dataSchema = await commonQuery.getRowDetail('jsReportDataSchemas', schemaId, 'id');
  return dataSchema ? dataSchema.schema : null;
}

async function getJSReportData(schema) {
  const result = await scriptQuery.executeDataSchema(schema);
  return Object.keys(result).length > 0 ? result : null;
}

function getClient() {
  return jsreportClient(
    process.env.JSREPORT_URL,
    process.env.JSREPORT_USER,
    process.env.JSREPORT_PASS,
  );
}

async function getJSReport(templateName, templateType, data) {
  const recipeMap = {
    pdf: 'chrome-pdf',
    html: 'html',
  };

  const client = getClient();

  return await client.render({
    template: {
      name: templateName,
      recipe: recipeMap[templateType],
    },
    data: data,
  });
}

// Renders with the template's own recipe and the data sent by the web app.
async function renderTemplate(templateName, data) {
  return await getClient().render({
    template: {
      name: templateName,
    },
    data: data,
  });
}

module.exports = {
  getDataSchema,
  getJSReport,
  getJSReportData,
  renderTemplate,
};
