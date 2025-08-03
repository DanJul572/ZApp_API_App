const enums = require('@enums');

const scriptService = require('@services/scriptService');

async function run(req, res) {
  try {
    const param = req.query;

    const module = await scriptService.getModuleById(enums.moduleId.scripts);
    const fields = await scriptService.getModuleFields(module.id);

    const identity = fields.find(field => field.identity);

    const script = await scriptService.getDetailData(module.name, param.id, identity.name);
    const data = await scriptService.executeScript(script.sql);

    return res.status(enums.statusCode.OK).send(data);
  } catch (error) {
    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = run;
