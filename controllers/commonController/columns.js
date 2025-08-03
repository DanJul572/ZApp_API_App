const commonService = require('@services/commonService');
const helpers = require('@helpers');
const enums = require('@enums');

async function columns(req, res) {
  try {
    const request = req.query;

    const fields = await commonService.getModuleFields(request.id);
    const data = await helpers.generateColumnByField(fields);

    return res.status(enums.statusCode.OK).send(data);
  } catch (error) {
    const response = helpers.getErrorResponse(error.message);
    await commonService.insertInternalError(req, response.code, response.message);
    return res.status(response.code).send(response.message);
  }
}

module.exports = columns;
