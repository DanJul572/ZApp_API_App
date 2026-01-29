const fs = require('fs/promises');

const enums = require('../../enums');
const helpers = require('../../helpers');
const importService = require('../../services/importService');

async function importExcelController(req, res, next) {
  let filePath;

  try {
    const {id} = req.query;
    const file = req.file;

    if (!file) {
      return res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'file is required',
      });
    }

    if (!id) {
      return res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'id is required',
      });
    }

    filePath = file.path;

    const module = await importService.getModuleById(id);
    if (!module) {
      return res.status(enums.statusCode.BAD_REQUEST).json({
        success: false,
        message: 'Module not found',
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

    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'Import is success',
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);
    next(err);
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
