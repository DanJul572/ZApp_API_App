const enums = require('../../enums');
const helpers = require('../../helpers');
const scriptService = require('../../services/scriptService');

async function run(req, res, next) {
  try {
    const param = req.query;

    const module = await scriptService.getModuleById(enums.moduleId.scripts);
    const fields = await scriptService.getModuleFields(module.id);

    const identity = fields.find(field => field.identity);

    const script = await scriptService.getDetailData(module.name, param.id, identity.name);
    const data = await scriptService.executeScript(script.sql);

    return res.status(enums.statusCode.OK).send({
      success: true,
      message: 'Script executed successfully',
      data: data,
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);

    next(err);
  }
}

module.exports = run;
