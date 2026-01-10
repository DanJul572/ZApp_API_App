const enums = require('../../enums');
const importService = require('../../services/importService');

async function importExcelController(req, res) {
  try {
    const {id} = req.query;
    const files = req.files;

    if (!files || !files.length) {
      res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'file is required',
      });
    }

    const module = await importService.getModuleById(id);
    if (!module) {
      res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'module not found',
      });
    }

    const fields = await importService.getModuleFields(module.id);
    const filePath = files[0].path;
    const columns = importService.getColumnNameFromFields(fields);
    const importOptions = {
      table: importService.sanitaizeTableName(module.name),
      columns: columns,
      mapRow: row => importService.getRowsMapping(columns, row),
    };

    await importService.importExcel(filePath, importOptions);

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
