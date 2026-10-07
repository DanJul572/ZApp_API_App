const db = require('../../models');
const enums = require('../../enums');
const moduleService = require('../../services/moduleService');

async function create(req, res, next) {
  if (!req.body.fields?.some(field => field.identity)) {
    return res.status(enums.statusCode.BAD_REQUEST).json({
      success: false,
      message: 'module_requires_identity_field',
    });
  }

  const t = await db.sequelize.transaction();

  try {
    const request = req.body;
    const createdModule = await moduleService.insertModule({ ...request }, t);

    const fields = request.fields.map(field => {
      field.moduleId = createdModule.id;
      return field;
    });
    await moduleService.insertFields(fields, t);

    await moduleService.generateTable(request.name, request.fields, t);

    await t.commit();
    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'module_is_created',
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

module.exports = create;
