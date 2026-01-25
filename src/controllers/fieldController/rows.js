const fieldService = require('../../services/fieldService');
const helpers = require('../../helpers');
const enums = require('../../enums');

async function rows(req, res) {
  try {
    const request = req.query;
    const data = await fieldService.getFields(request.moduleId);
    return res.status(enums.statusCode.OK).send({
      success: true,
      data: data,
    });
  } catch (err) {
    const error = helpers.getErrorResponse(err.message);
    await helpers.insertInternalError(req, error.code, error.message);

    return res.status(enums.statusCode.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: error.message,
    });
  }
}

module.exports = rows;
