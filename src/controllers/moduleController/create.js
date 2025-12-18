const db = require('../../models');
const enums = require('../../enums');

const moduleService = require('../../services/moduleService');

async function create(req, res) {
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
  } catch (error) {
    await t.rollback();
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = create;
