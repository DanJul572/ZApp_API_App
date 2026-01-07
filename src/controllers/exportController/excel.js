const enums = require('../../enums');
const exportService = require('../../services/exportSevice');

async function excel(req, res) {
  try {
    const {id} = req.query;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

    const queryData = await exportService.getQueryData(id);
    if (!queryData) {
      return res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'Query not found',
      });
    }

    return await exportService.streamToExcel(queryData.label, queryData.sql, res);
  } catch (error) {
    res.status(enums.statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = excel;
