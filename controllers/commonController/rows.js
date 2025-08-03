const commonService = require('@services/commonService');
const helpers = require('@helpers');
const enums = require('@enums');

async function rows(req, res) {
  try {
    const request = JSON.parse(req.body.data);

    const module = await commonService.getModuleById(request.id);
    const fields = await commonService.getModuleFields(module.id);
    const data = await commonService.getData(
      module.name,
      fields,
      request.page,
      request.advanceFilter,
      request.filter,
      request.sort,
      request.defaultFilter,
    );
    return res.status(enums.statusCode.OK).send(data);
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await commonService.insertInternalError(req, error.code, error.message);
    return res.status(error.code).send(error.message);
  }
}

module.exports = rows;
