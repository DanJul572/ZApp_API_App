const enums = require('../../enums');
const exportService = require('../../services/exportSevice');

async function csv(req, res) {
  try {
    const {id} = req.query;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=data.zip');

    const queryData = await exportService.getQueryData(id);
    if (!queryData) {
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'Query not found',
      });
    }

    const stream = await exportService.getCsvStream(queryData.sql);

    return await exportService.streamCsvAsZip(queryData.label, stream, res);
  } catch (error) {
    res.status(enums.statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = csv;
