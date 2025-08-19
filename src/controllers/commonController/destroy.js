const db = require('@db');
const commonService = require('@services/commonService');
const helpers = require('@helpers');
const enums = require('@enums');

async function destory(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = req.body;

    const module = await commonService.getModuleById(request.moduleId);
    const fields = await commonService.getModuleFields(request.moduleId);

    const primaryField = fields.find(field => field.identity);

    const detailData = await commonService.getDetailData(
      module.name,
      request.id,
      primaryField.name,
    );

    await commonService.deleteFile(fields, detailData, t);

    const data = await commonService.deleteData(module.name, primaryField.name, request.id, t);

    t.commit();
    return res.status(enums.statusCode.OK).send(data);
  } catch (err) {
    await t.rollback();
    const error = helpers.getErrorResponse(err.message);
    await commonService.insertInternalError(req, error.code, error.message);
    return res.status(error.code).send(error.message);
  }
}

module.exports = destory;
