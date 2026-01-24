const reportService = require('../../services/reportService');
const enums = require('../../enums');

async function jsReport(req, res) {
  try {
    const dataSchemaId = req.query.dataSchemaId;

    const dataSchema = await reportService.getDataSchema(dataSchemaId);
    if (!dataSchema) {
      return res.status(enums.statusCode.BAD_REQUEST).send({
        success: false,
        message: 'data schema not found',
      });
    }

    const jsreportData = await reportService.getJSReportData(dataSchema);
    if (!jsreportData) {
      return res.status(enums.statusCode.BAD_REQUEST).send({
        success: false,
        message: 'no data available for the report',
      });
    }

    return res.status(enums.statusCode.OK).send({
      success: true,
      data: jsreportData,
    });
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = jsReport;
