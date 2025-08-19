const db = require('@db');
const commonService = require('@services/commonService');
const helpers = require('@helpers');
const enums = require('@enums');

async function create(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = req.body;
    const files = req.files;
    const token = req.header('Authorization');

    const user = helpers.decodeToken(token);
    const module = await commonService.getModuleById(request.moduleId);

    await commonService.runValidationBefore(
      request.data,
      module.id,
      enums.actionId.create,
      user,
      t,
    );

    await commonService.insertFile(files, module.id, t);
    await commonService.insertData(module.name, request.data, t);

    await commonService.runValidationAfter(request.data, module.id, enums.actionId.create, user, t);

    t.commit();
    return res.status(enums.statusCode.OK).send('Data has been created.');
  } catch (err) {
    await t.rollback();
    const error = helpers.getErrorResponse(err.message);
    await commonService.insertInternalError(req, error.code, error.message);
    return res.status(error.code).send(error.message);
  }
}

module.exports = create;
