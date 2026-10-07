const reportService = require('../../services/reportService');
const enums = require('../../enums');

async function previewDataSchema(req, res, next) {
  try {
    const dataSchemaId = req.query.dataSchemaId;

    const dataSchema = await reportService.getDataSchema(dataSchemaId);
    if (!dataSchema) {
      return res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'data schema not found',
      });
    }

    const jsreportData = await reportService.getJSReportData(dataSchema);
    if (!jsreportData) {
      return res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'no data available for the report',
      });
    }

    return res.status(enums.statusCode.OK).json({
      success: true,
      data: jsreportData,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = previewDataSchema;
