const enums = require('../../enums');
const helpers = require('../../helpers');
const moduleService = require('../../services/moduleService');

async function detail(req, res, next) {
  try {
    const request = req.query;

    const module = await moduleService.getModuleById(request.moduleId);
    const fields = await moduleService.getModuleFields(module.id);

    module.fields = fields;

    return res.status(enums.statusCode.OK).send({
      success: true,
      data: module,
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);

    next(err);
  }
}

module.exports = detail;
