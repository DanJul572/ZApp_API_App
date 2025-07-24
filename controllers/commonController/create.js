const db = require('@db');
const commonService = require('@services/commonService');
const helpers = require('@helpers');
const enums = require('@enums');

async function create(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = JSON.parse(req.body.data);
    const files = req.files;
    const token = req.header('Authorization');

    const user = helpers.decodeToken(token);
    const module = await commonService.getModuleById(request.moduleId);

    await commonService.runValidationBefore(request.data, module.id, enums.actionId.create, user);

    await commonService.insertFile(files, module.id);
    const data = await commonService.insertData(module.name, request.data);

    await commonService.runValidationAfter(request.data, module.id, enums.actionId.create, user);

    t.commit();
    return res.status(enums.statusCode.OK).send(data);
  } catch (error) {
    await t.rollback();
    const response = helpers.getErrorResponse(error.message);
    await commonService.insertError(req, response.code, error.message);
    return res.status(response.code).send(response.message);
  }
}

module.exports = create;
