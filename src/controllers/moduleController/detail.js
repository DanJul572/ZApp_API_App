const enums = require('@enums');
const moduleService = require('@services/moduleService');

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

module.exports = detail;
