const enums = require('../../enums');
const moduleService = require('../../services/moduleService');

async function detail(req, res, next) {
  try {
    const request = req.query;

    const module = await moduleService.getModuleById(request.moduleId);
    const fields = await moduleService.getModuleFields(module.id);

    module.fields = fields;

    return res.status(enums.statusCode.OK).json({
      success: true,
      data: module,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = detail;
