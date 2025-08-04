const db = require('@db');
const helpers = require('@helpers');
const enums = require('@enums');
const commonService = require('@services/commonService');

async function update(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = req.body;
    const files = req.files;

    const module = await commonService.getModuleById(request.moduleId);
    const fields = await commonService.getModuleFields(module.id);

    const primaryField = fields.find(field => field.identity);

    const detailData = await commonService.getDetailData(
      module.name,
      request.rowId,
      primaryField.name,
    );

    await commonService.deleteFile(fields, detailData, t);
    await commonService.insertFile(files, module.id, t);

    const data = await commonService.updateData(
      module.name,
      primaryField.name,
      request.rowId,
      request.data,
      t,
    );

    t.commit();
    return res.status(enums.statusCode.OK).send(data);
  } catch (err) {
    await t.rollback();
    const error = helpers.getErrorResponse(err.message);
    await commonService.insertInternalError(req, error.code, error.message);
    return res.status(error.code).send(error.message);
  }
}

module.exports = update;
