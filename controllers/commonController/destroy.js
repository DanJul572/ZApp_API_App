const db = require('@db');
const commonService = require('@services/commonService');
const helpers = require('@helpers');
const enums = require('@enums');

async function destory(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = JSON.parse(req.body.data);

    const module = await commonService.getModuleById(request.moduleId);
    const fields = await commonService.getModuleFields(request.moduleId);

    const primaryField = fields.find(field => field.identity);

    const detailData = await commonService.getDetailData(
      module.name,
      request.id,
      primaryField.name,
    );

    await commonService.deleteFile(fields, detailData);

    const data = await commonService.deleteData(module.name, primaryField.name, request.id);

    t.commit();
    return res.status(enums.statusCode.OK).send(data);
  } catch (error) {
    await t.rollback();
    const response = helpers.getErrorResponse(error.message);
    await commonService.insertError(req, response.code, error.message);
    return res.status(response.code).send(response.message);
  }
}

module.exports = destory;
