const db = require('../../models');
const helpers = require('../../helpers');
const enums = require('../../enums');
const commonService = require('../../services/commonService');
const fileService = require('../../services/fileService');

async function update(req, res, next) {
  const t = await db.sequelize.transaction();
  const files = fileService.createFileChanges(t);

  try {
    const request = req.body;

    const module = await commonService.getModuleById(request.moduleId);
    commonService.assertWritableModule(module);

    const fields = await commonService.getModuleFields(module.id);

    const primaryField = fields.find(field => field.identity);

    const detailData = await commonService.getDetailData(
      module.name,
      request.rowId,
      primaryField.name,
    );

    await files.save(module, fields, req.files, request.data, detailData);
    await files.removeUnused(fields, detailData, request.data);

    const data = await commonService.updateData(
      module.name,
      primaryField.name,
      request.rowId,
      request.data,
      t,
    );

    // The primary key itself may have been changed by this update.
    const updatedRowId = request.data[primaryField.name] ?? request.rowId;
    const updatedData = await commonService.getDetailData(
      module.name,
      updatedRowId,
      primaryField.name,
      t,
    );

    await helpers.createAuditTrail(
      req,
      {
        module,
        fields,
        action: enums.auditAction.update,
        rowId: updatedRowId,
        oldData: detailData,
        newData: updatedData,
      },
      t,
    );

    await t.commit();
    await files.commit();
    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'Data updated successfully',
      data: data,
    });
  } catch (err) {
    await t.rollback();
    await files.rollback();

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

module.exports = update;
