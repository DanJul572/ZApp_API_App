const commonService = require('../../services/commonService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function columns(req, res, next) {
  try {
    const request = req.query;

    const fields = await commonService.getModuleFields(request.id);
    const columns = await helpers.generateColumnByField(fields);

    return res.status(enums.statusCode.OK).send({
      success: true,
      data: columns,
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);

    if (error.code === enums.statusCode.INTERNAL_SERVER_ERROR) {
      next(err);
    } else {
      return res.status(error.code).send({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = columns;
