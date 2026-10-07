const db = require('../../models');
const enums = require('../../enums');
const moduleService = require('../../services/moduleService');

async function destory(req, res, next) {
  const t = await db.sequelize.transaction();

  try {
    const request = req.body;

    const module = await moduleService.getModuleById(request.id);
    const fields = await moduleService.getModuleFields(module.id);

    const sequence = fields.find(field => field.autoIncrement);

    await moduleService.deleteModule(module.id, t);
    await moduleService.deleteFields(module.id, t);
    await moduleService.deleteFiles(module.id, t);
    await moduleService.dropTable(module.name, sequence?.name, t);

    await t.commit();
    return res.status(enums.statusCode.OK).json({
      success: true,
      message: 'module_is_deleted',
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

module.exports = destory;
