const enums = require('../../enums');
const exportService = require('../../services/exportSevice');

async function csv(req, res) {
  try {
    const {moduleId} = req.query;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=data.zip');

    const module = await exportService.getModuleById(moduleId);
    const stream = await exportService.getCsvStream(module.name);

    return await exportService.streamCsvAsZip(module.name, stream, res);
  } catch (error) {
    res.status(enums.statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = csv;
