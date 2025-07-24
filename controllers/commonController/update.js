const db = require('@db');
const helpers = require('@helpers');
const enums = require('@enums');
const commonService = require('@services/commonService');

async function update(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = JSON.parse(req.body.data);
    const files = req.files;

    const module = await commonService.getModuleById(request.moduleId);
    const fields = await commonService.getModuleFields(module.id);

    const primaryField = fields.find(field => field.identity);

    const detailData = await commonService.getDetailData(
      module.name,
      request.rowId,
      primaryField.name,
    );

    await commonService.deleteFile(fields, detailData);
    await commonService.insertFile(files, module.id);

    const data = await commonService.updateData(
      module.name,
      primaryField.name,
      request.rowId,
      request.data,
    );

    t.commit();
    return res.status(enums.statusCode.OK).send(data);
  } catch (error) {
    await t.rollback();
    const response = helpers.getErrorResponse(error.message);
    await commonService.insertError(req, response.code, error.message);
    return res.status(response.code).send(response.message);
  }
}

module.exports = update;
