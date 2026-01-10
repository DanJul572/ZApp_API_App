const enums = require('../../enums');
const importService = require('../../services/importService');

async function importExcelController(req, res) {
  try {
    const {id} = req.query;
    const files = req.files;

    if (!files || !files.length) {
      if (!module) {
        res.status(enums.statusCode.BAD_REQUEST).json({
          success: false,
          message: 'file is required',
        });
      }
    }

    const module = await importService.getModuleById(id);
    if (!module) {
      res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'module not found',
      });
    }

    const fields = await importService.getModuleFields(module.id);
    const columns = importService.getColumnNameFromFields(fields);

    await importService.importExcel(files[0].path, {
      table: module.name,
      columns: columns,
      mapRow: row => importService.getRowsMapping(columns, row),
    });

    res.json({
      success: true,
      message: 'import is success',
    });
  } catch (err) {
    res.status(enums.statusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = importExcelController;
