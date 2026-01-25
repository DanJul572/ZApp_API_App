const commonService = require('../../services/commonService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function rows(req, res, next) {
  try {
    const request = req.body;

    const module = await commonService.getModuleById(request.id);
    const fields = await commonService.getModuleFields(module.id);
    const data = await commonService.getData(
      module.name,
      fields,
      request.page,
      request.filter,
      request.sort,
      request.defaultFilter,
    );

    return res.status(enums.statusCode.OK).send({
      success: true,
      data: data,
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

module.exports = rows;
