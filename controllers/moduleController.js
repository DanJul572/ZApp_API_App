const db = require('@db');

const moduleService = require('@services/moduleService');
const enums = require('@enums');

const Module = db.Module;
const Field = db.Field;

async function detail(req, res) {
  try {
    const request = req.query;

    const module = await moduleService.getModuleById(request.moduleId);
    const fields = await moduleService.getModuleFields(module.id);

    module.fields = fields;

    return res.status(enums.statusCode.OK).send(module);
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

async function create(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = JSON.parse(req.body.data);

    await Module.create(request, {
      transaction: t,
      include: {
        model: Field,
        as: 'fields',
      },
    });
    await moduleService.generateTable(request.name, request.fields);

    await t.commit();
    return res.status(enums.statusCode.OK).send('Module has been created');
  } catch (error) {
    await t.rollback();
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

async function destory(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = JSON.parse(req.body.data);

    const module = await moduleService.getModuleById(request.id);
    const fields = await moduleService.getModuleFields(module.id);

    const identity = fields.find(field => field.identity);

    await Module.destroy({
      transaction: t,
      where: {
        id: module.id,
      },
    });

    await moduleService.deleteFiles(module.id);
    await moduleService.deleteFields(module.id);
    await moduleService.dropTable(module.name, identity.name);

    await t.commit();
    return res.status(enums.statusCode.OK).send('Module has been deleted');
  } catch (error) {
    await t.rollback();
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = {
  detail,
  create,
  destory,
};
