const reportService = require('../../services/reportService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function jsReport(req, res, next) {
  try {
    const reportType = req.query.type;
    const reportname = req.query.name;
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

    res.set({
      'Content-Type': `application/${reportType}`,
      'Content-Disposition': `inline; filename=${reportname}.${reportType}`,
    });

    return reportService
      .getJSReport(reportname, reportType, jsreportData)
      .then(response => response.pipe(res))
      .catch(next);
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);
    next(err);
  }
}

module.exports = jsReport;
