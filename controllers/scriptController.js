const moduleId = require('../constats/moduleId');
const statusCode = require('../constats/statusCode');

const scriptService = require('../services/scriptService');

async function run(req, res) {
  try {
    const param = req.query;

    const module = await scriptService.getModuleById(moduleId.scripts);
    const fields = await scriptService.getModuleFields(module.id);

    const identity = fields.find(field => field.identity);

    const script = await scriptService.getDetailData(
      module.name,
      param.id,
      identity.name,
    );
    const data = await scriptService.executeScript(script.sql);

    return res.status(statusCode.OK).send(data);
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

module.exports = {
  run,
};
