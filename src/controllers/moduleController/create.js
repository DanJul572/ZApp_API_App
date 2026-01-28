const db = require('../../models');
const enums = require('../../enums');
const helpers = require('../../helpers');
const moduleService = require('../../services/moduleService');

async function create(req, res, next) {
  const t = await db.sequelize.transaction();

  try {
    const request = req.body;
    const createdModule = await moduleService.insertModule({...request}, t);

    const fields = request.fields.map(field => {
      field.moduleId = createdModule.id;
      return field;
    });
    await moduleService.insertFields(fields, t);

    await moduleService.generateTable(request.name, request.fields, t);

    await t.commit();
    return res.status(enums.statusCode.OK).send({
      success: true,
      message: 'module_is_created',
    });
  } catch (err) {
    await t.rollback();

    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);

    next(err);
  }
}

module.exports = create;
