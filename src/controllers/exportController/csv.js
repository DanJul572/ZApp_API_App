const enums = require('../../enums');
const exportService = require('../../services/exportSevice');

async function csv(req, res) {
  try {
    const {id} = req.query;

    const queryData = await exportService.getQueryData(id);
    if (!queryData) {
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'Query not found',
      });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=data.zip');
    res.setHeader('Transfer-Encoding', 'chunked');

    await exportService.streamCsvAsZip(queryData.label, queryData.sql, res);
  } catch (err) {
    if (res.headersSent) {
      res.destroy(err);
    } else {
      res.status(enums.statusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = csv;
