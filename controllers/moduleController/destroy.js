const db = require('@db');
const enums = require('@enums');
const moduleService = require('@services/moduleService');

async function destory(req, res) {
  const t = await db.sequelize.transaction();

  try {
    const request = req.body;

    const module = await moduleService.getModuleById(request.id);
    const fields = await moduleService.getModuleFields(module.id);

    const identity = fields.find(field => field.identity);

    await moduleService.deleteModule(module.id, t);
    await moduleService.deleteFields(module.id, t);
    await moduleService.deleteFiles(module.id, t);
    await moduleService.dropTable(module.name, identity.name, t);

    await t.commit();
    return res.status(enums.statusCode.OK).send('Module has been deleted');
  } catch (error) {
    await t.rollback();
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = destory;
