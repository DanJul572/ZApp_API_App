const viewService = require('../../services/viewService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function options(req, res, next) {
  try {
    const request = req.query;

    const options = await viewService.getOptions(request.moduleId);

    return res.status(enums.statusCode.OK).send({
      success: true,
      data: options,
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.createErrorLog(req, error.code, error.message);

    next(err);
  }
}

module.exports = options;
