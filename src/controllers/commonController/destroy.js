const db = require('../../models');
const commonService = require('../../services/commonService');
const fileService = require('../../services/fileService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function destory(req, res, next) {
  const t = await db.sequelize.transaction();
  const files = fileService.createFileChanges(t);

  try {
    const request = req.body;

    const module = await commonService.getModuleById(request.moduleId);
    commonService.assertWritableModule(module);

    const fields = await commonService.getModuleFields(request.moduleId);

    const primaryField = fields.find(field => field.identity);

    const detailData = await commonService.getDetailData(
      module.name,
      request.id,
      primaryField.name,
    );

    await files.removeUnused(fields, detailData);
    await commonService.deleteData(module.name, primaryField.name, request.id, t);

    await helpers.createAuditTrail(
      req,
      {
        module,
        fields,
        action: enums.auditAction.delete,
        rowId: request.id,
        oldData: detailData,
      },
      t,
    );

    await t.commit();
    await files.commit();
    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'Data deleted successfully',
    });
  } catch (err) {
    await t.rollback();

    const error = helpers.getErrorResponse(err.message);

    if (error.code === enums.statusCode.INTERNAL_SERVER_ERROR) {
      next(err);
    } else {
      return res.status(error.code).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = destory;
