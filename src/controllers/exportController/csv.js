const enums = require('../../enums');
const exportService = require('../../services/exportSevice');
const helpers = require('../../helpers');

async function csv(req, res, next) {
  try {
    const { id } = req.query;

    const queryData = await exportService.getQueryData(id);
    if (!queryData) {
      return res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'Query not found',
      });
    }

    const safeLabel = exportService.sanitaize(queryData.label);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=${safeLabel}.zip`);

    await exportService.streamCsvAsZip(safeLabel, queryData.sql, res);
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);

    if (res.headersSent) {
      res.destroy(err);
    } else {
      next(err);
    }
  }
}

module.exports = csv;
