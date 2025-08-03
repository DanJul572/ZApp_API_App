const commonService = require('@services/commonService');
const helpers = require('@helpers');
const enums = require('@enums');

async function options(req, res) {
  try {
    const request = req.query;

    const field = await commonService.getField(request.id);
    const data = await commonService.getFieldOptions(field);

    return res.status(enums.statusCode.OK).send(data);
  } catch (error) {
    const response = helpers.getErrorResponse(error.message);
    await commonService.insertInternalError(req, response.code, response.message);
    return res.status(response.code).send(response.message);
  }
}

module.exports = options;
