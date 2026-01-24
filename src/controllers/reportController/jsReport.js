const reportService = require('../../services/reportService');
const enums = require('../../enums');

async function jsReport(req, res, next) {
  try {
    const reportType = req.query.type;
    const reportname = req.query.name;
    const dataSchemaId = req.query.dataSchemaId;

    const dataSchema = await reportService.getDataSchema(dataSchemaId);
    const jsreportData = await reportService.getJSReportData(dataSchema);

    res.set({
      'Content-Type': `application/${reportType}`,
      'Content-Disposition': `inline; filename=${reportname}.${reportType}`,
    });

    return reportService
      .getJSReport(reportname, reportType, jsreportData)
      .then(response => response.pipe(res))
      .catch(next);
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = jsReport;
