const fs = require('fs/promises');

const enums = require('../../enums');
const importService = require('../../services/importService');

async function importExcelController(req, res) {
  let filePath;

  try {
    const {id} = req.query;
    const files = req.files;

    if (!files || !files.length) {
      res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'file is required',
      });
    }

    filePath = files[0].path;

    const module = await importService.getModuleById(id);
    if (!module) {
      res.status(enums.statusCode.NOT_FOUND).json({
        success: false,
        message: 'module not found',
      });
    }

    const fields = await importService.getModuleFields(module.id);
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
  } finally {
    if (filePath) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Failed to delete file:', err.message);
      }
    }
  }
}

module.exports = importExcelController;
