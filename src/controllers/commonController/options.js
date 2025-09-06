const commonService = require('../../services/commonService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function options(req, res) {
  try {
    const request = req.query;

    const field = await commonService.getField(request.id);
    const fieldOptions = await commonService.getFieldOptions(field);

    return res.status(enums.statusCode.OK).send(fieldOptions);
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await commonService.insertInternalError(req, error.code, error.message);
    return res.status(error.code).send(error.message);
  }
}

module.exports = options;
