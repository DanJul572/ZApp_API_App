const commonService = require('../../services/commonService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function options(req, res, next) {
  try {
    const request = req.query;

    const field = await commonService.getField(request.id);
    const fieldOptions = await commonService.getFieldOptions(field);

    return res.status(enums.statusCode.OK).send({
      success: true,
      data: fieldOptions,
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.insertInternalError(req, error.code, error.message);

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

module.exports = options;
