const commonService = require('../../services/commonService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function columns(req, res) {
  try {
    const request = req.query;

    const fields = await commonService.getModuleFields(request.id);
    const columns = await helpers.generateColumnByField(fields);

    return res.status(enums.statusCode.OK).send(columns);
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await commonService.insertInternalError(req, error.code, error.message);
    return res.status(error.code).send(error.message);
  }
}

module.exports = columns;
