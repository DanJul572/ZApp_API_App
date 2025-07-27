const db = require('@db');
const enums = require('@enums');
const moduleService = require('@services/moduleService');

async function destory(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = JSON.parse(req.body.data);

    const module = await moduleService.getModuleById(request.id);
    const fields = await moduleService.getModuleFields(module.id);

    const identity = fields.find(field => field.identity);

    await moduleService.deleteModule(module.id);
    await moduleService.deleteFields(module.id);
    await moduleService.deleteFiles(module.id);
    await moduleService.dropTable(module.name, identity.name);

    await t.commit();
    return res.status(enums.statusCode.OK).send('Module has been deleted');
  } catch (error) {
    await t.rollback();
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = destory;
